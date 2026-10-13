import { useState } from 'react'
import { Link } from 'react-router'
import bs58 from 'bs58'
import type { PublicKey } from '@solana/web3.js'
import { ed25519 } from '@noble/curves/ed25519.js'
import { IconCheck, IconCircleCheck, IconCopy, IconEye, IconEyeOff, IconLock, IconLockOpen, IconRotate3d, IconSignature, IconWallet } from '@tabler/icons-react'
import { NetworkLogo } from '@/components/brand/NetworkLogo'
import { CoinListSkeleton, CoinSummary, VerifiedNote } from '../components/CoinVerify'
import { roleLabel } from '../lib/pump'
import { Dialog } from '../components/Dialog'
import { PaymentCard } from '../components/PaymentCard'
import { Badge, Button, Field, Input, PageHeader, Panel } from '../components/ui'
import { useCreatedCoins, useSolBalance, useSolPrice, useUnclaimedFees } from '../hooks/queries'
import { useWallet } from '../hooks/useWallet'
import { cvvFromPan, deriveCardNumber, deriveCvv, expiryFrom, formatExpiry, validateCardName, type CardNetwork } from '../lib/card'
import { verifyCoinOwnership } from '../lib/pump'
import { explorer, fmt, getConnection, shortAddress, toPublicKey } from '../lib/solana'
import { useWalletData, walletStore, type CardRecord } from '../lib/store'
import { errorMessage, toast } from '../lib/toast'
import { cn } from '@/lib/utils'

const STEPS = ['Name your card', 'Approve', 'Prove ownership'] as const

function Stepper({ step }: { step: number }) {
  return (
    <ol className="flex items-center gap-2">
      {STEPS.map((label, i) => (
        <li key={label} className="flex flex-1 items-center gap-2">
          <span
            className={cn(
              'flex size-7 shrink-0 items-center justify-center rounded-full font-medium text-xs',
              i < step ? 'bg-gradient-mint text-[#03140b]' : i === step ? 'bg-white text-black' : 'bg-white/5 text-muted-foreground ring-1 ring-white/10',
            )}
          >
            {i < step ? <IconCheck className="size-4" stroke={3} /> : i + 1}
          </span>
          <span className={cn('hidden font-medium text-sm sm:block', i === step ? 'text-foreground' : 'text-muted-foreground')}>{label}</span>
          {i < STEPS.length - 1 && <span className={cn('h-px flex-1', i < step ? 'bg-gradient-mint/60' : 'bg-white/10')} />}
        </li>
      ))}
    </ol>
  )
}

function NetworkPicker({ value, onChange }: { value: CardNetwork; onChange: (n: CardNetwork) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Card network">
      {(['visa', 'mastercard'] as const).map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          onClick={() => onChange(n)}
          className={cn(
            'flex h-16 items-center justify-center rounded-2xl ring-1 transition-all',
            value === n ? 'bg-white/10 ring-2 ring-gradient-mint shadow-[0_0_24px_rgba(127,227,168,0.2)]' : 'bg-white/[0.03] ring-white/10 hover:bg-white/5',
          )}
        >
          <NetworkLogo network={n} className={n === 'visa' ? 'h-5 w-16' : 'h-9 w-14'} />
        </button>
      ))}
    </div>
  )
}

function approvalMessage(name: string, network: CardNetwork, wallet: string, nonce: string, issuedAt: string) {
  return [
    'StrataPay card request',
    '',
    `Name on card: ${name}`,
    `Network: ${network === 'visa' ? 'Visa' : 'Mastercard'}`,
    `Wallet: ${wallet}`,
    'I approve StrataPay to issue a card funded by this wallet, and by the creator fees of any pump.fun coin it created that I link.',
    '',
    `Nonce: ${nonce}`,
    `Issued at: ${issuedAt}`,
  ].join('\n')
}

function issuanceMessage(name: string, network: CardNetwork, wallet: string, fundedBy: string, requestSig: string, nonce: string, issuedAt: string) {
  return [
    'StrataPay card issuance',
    '',
    `Name on card: ${name}`,
    `Network: ${network === 'visa' ? 'Visa' : 'Mastercard'}`,
    `Funded by: ${fundedBy}`,
    `Wallet: ${wallet}`,
    `Request signature: ${requestSig.slice(0, 16)}…`,
    'I approve issuing this card now.',
    '',
    `Nonce: ${nonce}`,
    `Issued at: ${issuedAt}`,
  ].join('\n')
}

type Approval = { message: string; signature: Uint8Array; signedAt: number }

const WALLET_ONLY = 'wallet'

function IssueFlow({ wallet }: { wallet: string }) {
  const { publicKey, signMessage } = useWallet()
  const created = useCreatedCoins(publicKey)
  const createdCoins = created.data ?? []
  const [choice, setChoice] = useState<string | null>(null)
  // Default: your first coin if you launched one, otherwise your wallet.
  const effective = choice ?? createdCoins[0]?.mint ?? WALLET_ONLY
  const selected = effective === WALLET_ONLY ? null : (createdCoins.find((c) => c.mint === effective) ?? null)
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [touched, setTouched] = useState(false)
  const [network, setNetwork] = useState<CardNetwork>('visa')
  const [approval, setApproval] = useState<Approval | null>(null)
  const [signing, setSigning] = useState(false)
  const [issuing, setIssuing] = useState(false)
  const [draft] = useState(() => ({ nonce: crypto.randomUUID().slice(0, 18), at: new Date().toISOString() }))
  const [issueDraft] = useState(() => ({ nonce: crypto.randomUUID().slice(0, 18), at: new Date().toISOString() }))

  const nameError = validateCardName(name)
  const cleanName = name.trim().replace(/\s+/g, ' ')
  const message = approvalMessage(cleanName, network, wallet, draft.nonce, draft.at)
  const fundedBy = selected ? `${selected.symbol} creator fees (${selected.mint})` : 'this wallet'
  const issueMsg = approval ? issuanceMessage(cleanName, network, wallet, fundedBy, bs58.encode(approval.signature), issueDraft.nonce, issueDraft.at) : ''

  const approve = async () => {
    if (!publicKey) return
    setSigning(true)
    try {
      const signature = await signMessage(message)
      const ok = ed25519.verify(signature, new TextEncoder().encode(message), publicKey.toBytes())
      if (!ok) throw new Error('The wallet returned a signature that does not match this request.')
      setApproval({ message, signature, signedAt: Date.now() })
      setStep(2)
    } catch (e) {
      toast({ tone: 'error', title: 'Approval not completed', body: errorMessage(e) })
    } finally {
      setSigning(false)
    }
  }

  const issue = async () => {
    if (!approval || !publicKey) return
    setIssuing(true)
    try {
      const now = Date.now()
      let coinProof: { coinMint: string | null; bondingCurve?: string; creatorOnChain?: string } = { coinMint: null }
      if (selected) {
        // Re-check on-chain right before issuing, so the proof is current.
        const fresh = await verifyCoinOwnership(getConnection(), toPublicKey(selected.mint)!, publicKey)
        if (!fresh.ok) throw new Error(fresh.reason)
        walletStore.upsertCoin(wallet, { ...fresh.coin, role: fresh.role, linkedAt: now })
        coinProof = { coinMint: fresh.coin.mint, bondingCurve: fresh.coin.bondingCurve, creatorOnChain: fresh.coin.creatorOnChain }
      }
      // Second approval: the wallet confirms issuing this exact card.
      const issueSig = await signMessage(issueMsg)
      if (!ed25519.verify(issueSig, new TextEncoder().encode(issueMsg), publicKey.toBytes())) throw new Error('The wallet returned a signature that does not match the issuance request.')
      const [pan, cvv] = await Promise.all([deriveCardNumber(network, issueSig), deriveCvv(issueSig)])
      const exp = expiryFrom(now)
      walletStore.addCard(wallet, {
        kind: 'primary',
        nameOnCard: cleanName,
        network,
        pan,
        cvv,
        expMonth: exp.month,
        expYear: exp.year,
        status: 'active',
        monthlyLimitUsd: null,
        coinMint: coinProof.coinMint,
        createdAt: now,
        proof: {
          kind: selected ? 'coin-creator' : 'wallet',
          message: approval.message,
          signature: bs58.encode(approval.signature),
          signedAt: approval.signedAt,
          issueMessage: issueMsg,
          issueSignature: bs58.encode(issueSig),
          bondingCurve: coinProof.bondingCurve,
          creatorOnChain: coinProof.creatorOnChain,
          verifiedAt: now,
        },
      })
      toast({ tone: 'success', title: 'Your card is ready', body: `${cleanName}, ${network === 'visa' ? 'Visa' : 'Mastercard'} ending ${pan.slice(-4)}` })
    } catch (e) {
      toast({ tone: 'error', title: 'Could not issue the card', body: errorMessage(e) })
    } finally {
      setIssuing(false)
    }
  }

  const walletOption = (
    <button
      type="button"
      role="radio"
      aria-checked={effective === WALLET_ONLY}
      onClick={() => setChoice(WALLET_ONLY)}
      className={cn(
        'flex items-center gap-4 rounded-2xl bg-white/[0.03] p-4 text-left ring-1 transition-shadow',
        effective === WALLET_ONLY ? 'ring-2 ring-gradient-mint' : 'ring-white/10 hover:ring-white/20',
      )}
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-mint/15 text-gradient-mint">
        <IconWallet className="size-5" />
      </span>
      <span className="flex min-w-0 flex-col gap-1">
        <span className="font-medium">Fund from my wallet</span>
        <span className="text-muted-foreground text-xs">No coin needed. You can link a coin to the card later, once you launch one.</span>
      </span>
    </button>
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px] [&>*]:min-w-0">
      <Panel>
        <Stepper step={step} />
        {step === 0 && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="font-medium text-xl">What name goes on the card?</h2>
              <p className="text-muted-foreground text-sm">This is printed on the card and shown on receipts. You can use your own name or your project's.</p>
            </div>
            <Field label="Name on card" error={touched ? nameError : null} hint="Up to 26 characters.">
              <Input value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setTouched(true)} placeholder="e.g. Lena Ortiz" maxLength={26} autoComplete="name" invalid={touched && !!nameError} />
            </Field>
            <Field label="Card network">
              <NetworkPicker value={network} onChange={setNetwork} />
            </Field>
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setTouched(true)
                  if (!nameError) setStep(1)
                }}
              >
                Continue
              </Button>
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="font-medium text-xl">Approve the request in your wallet</h2>
              <p className="text-muted-foreground text-sm">Signing is free and sends nothing on-chain. It proves this wallet asked for the card.</p>
            </div>
            <pre className="whitespace-pre-wrap break-all rounded-2xl bg-[#020604] p-4 font-mono text-muted-foreground text-xs leading-relaxed ring-1 ring-white/10">{message}</pre>
            <div className="flex flex-wrap justify-between gap-3">
              <Button variant="ghost" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button onClick={approve} loading={signing}>
                <IconSignature className="size-4" /> Approve in wallet
              </Button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="font-medium text-xl">Prove ownership</h2>
              <p className="text-muted-foreground text-sm">Your signature already proves this wallet is yours. If you launched a coin on pump.fun, link it so its creator fees fund the card.</p>
            </div>
            <p className="flex items-start gap-2 text-gradient-mint text-sm">
              <IconCircleCheck className="mt-0.5 size-4 shrink-0" />
              <span>
                Wallet verified: the signature from <span className="font-mono">{shortAddress(wallet, 6, 6)}</span> matches its public key.
              </span>
            </p>
            {created.isLoading ? (
              <CoinListSkeleton rows={1} />
            ) : (
              <div className="flex flex-col gap-2" role="radiogroup" aria-label="What funds the card">
                {createdCoins.map((c) => (
                  <button
                    key={c.mint}
                    type="button"
                    role="radio"
                    aria-checked={effective === c.mint}
                    onClick={() => setChoice(c.mint)}
                    className={cn('rounded-2xl text-left transition-shadow', effective === c.mint ? 'ring-2 ring-gradient-mint' : 'ring-0 hover:ring-1 hover:ring-white/20')}
                  >
                    <CoinSummary coin={c} role={c.role} />
                  </button>
                ))}
                {walletOption}
                {created.error ? (
                  <p className="text-muted-foreground text-xs">We could not look up your coins right now ({errorMessage(created.error)}). You can still get a card funded from your wallet.</p>
                ) : !createdCoins.length ? (
                  <p className="text-muted-foreground text-xs">No pump.fun coin found for this wallet, so the card is funded from your wallet.</p>
                ) : null}
              </div>
            )}
            {selected && <VerifiedNote coin={selected} />}
            {!created.isLoading && (
              <div className="flex flex-col gap-2">
                <span className="font-medium text-muted-foreground text-xs uppercase tracking-[0.12em]">You approve this in your wallet to issue the card</span>
                <pre className="whitespace-pre-wrap break-all rounded-2xl bg-[#020604] p-4 font-mono text-muted-foreground text-xs leading-relaxed ring-1 ring-white/10">{issueMsg}</pre>
              </div>
            )}
            <div className="flex flex-wrap justify-between gap-3">
              <Button variant="ghost" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button variant="mint" onClick={issue} loading={issuing} disabled={created.isLoading}>
                <IconSignature className="size-4" /> Approve & issue card
              </Button>
            </div>
          </div>
        )}
      </Panel>
      <div className="flex flex-col gap-4 lg:sticky lg:top-10 lg:self-start">
        <PaymentCard network={network} nameOnCard={cleanName} />
        <p className="text-center text-muted-foreground text-xs">Preview. Your number appears once the card is issued.</p>
      </div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="min-w-0 text-right font-medium text-sm">{children}</span>
    </div>
  )
}

function LimitDialog({ card, wallet, open, onOpenChange }: { card: CardRecord; wallet: string; open: boolean; onOpenChange: (o: boolean) => void }) {
  const [value, setValue] = useState(card.monthlyLimitUsd?.toString() ?? '')
  const n = value.trim() === '' ? null : Number(value)
  const invalid = n !== null && (!Number.isFinite(n) || n <= 0)
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Monthly spending limit" description="Leave empty for no limit.">
      <div className="flex flex-col gap-4">
        <Field label="Limit in USD" error={invalid ? 'Enter a positive amount.' : null}>
          <Input inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value.replace(/[^0-9.]/g, ''))} placeholder="No limit" />
        </Field>
        <Button
          disabled={invalid}
          onClick={() => {
            walletStore.updateCard(wallet, card.id, { monthlyLimitUsd: n })
            toast({ tone: 'success', title: n ? `Limit set to ${fmt.usd(n)} a month` : 'Limit removed' })
            onOpenChange(false)
          }}
        >
          Save limit
        </Button>
      </div>
    </Dialog>
  )
}

/** Checks on-chain that `owner` created `mint`, then makes that coin fund `card`. Returns the coin. */
async function attachCoin(wallet: string, card: CardRecord, mint: string, owner: PublicKey) {
  const fresh = await verifyCoinOwnership(getConnection(), toPublicKey(mint)!, owner)
  if (!fresh.ok) throw new Error(fresh.reason)
  const now = Date.now()
  walletStore.upsertCoin(wallet, { ...fresh.coin, role: fresh.role, linkedAt: now })
  walletStore.updateCard(wallet, card.id, {
    coinMint: fresh.coin.mint,
    proof: { ...card.proof, kind: 'coin-creator', bondingCurve: fresh.coin.bondingCurve, creatorOnChain: fresh.coin.creatorOnChain, verifiedAt: now },
  })
  return fresh.coin
}

function CardManager({ wallet, card }: { wallet: string; card: CardRecord }) {
  const { coins, cards } = useWalletData(wallet)
  const { publicKey } = useWallet()
  const fees = useUnclaimedFees(publicKey)
  const balance = useSolBalance(publicKey)
  const price = useSolPrice()
  const [reveal, setReveal] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const [limitOpen, setLimitOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const coin = card.coinMint ? coins.find((c) => c.mint === card.coinMint) : undefined
  const created = useCreatedCoins(card.coinMint ? null : publicKey)
  const [linking, setLinking] = useState<string | null>(null)

  // A wallet-funded card can take on a coin later, after an on-chain creator check.
  const linkCoin = async (mint: string) => {
    if (!publicKey) return
    setLinking(mint)
    try {
      const coin = await attachCoin(wallet, card, mint, publicKey)
      toast({ tone: 'success', title: `$${coin.symbol} now funds your card` })
    } catch (e) {
      toast({ tone: 'error', title: 'Could not link the coin', body: errorMessage(e) })
    } finally {
      setLinking(null)
    }
  }
  const teamCount = cards.filter((c) => c.kind === 'team').length
  const frozen = card.status === 'frozen'

  const copy = async () => {
    await navigator.clipboard.writeText(card.pan)
    toast({ tone: 'info', title: 'Card number copied' })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[440px_1fr] [&>*]:min-w-0">
      <div className="flex flex-col gap-4">
        <PaymentCard
          network={card.network}
          nameOnCard={card.nameOnCard}
          pan={card.pan}
          expMonth={card.expMonth}
          expYear={card.expYear}
          cvv={card.cvv ?? cvvFromPan(card.pan)}
          reveal={reveal}
          flipped={flipped}
          frozen={frozen}
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFlipped(false)
              setReveal((r) => !r)
            }}
            aria-pressed={reveal}
          >
            {reveal ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />} {reveal ? 'Hide' : 'Number'}
          </Button>
          <Button variant={flipped ? 'mint' : 'ghost'} size="sm" onClick={() => setFlipped((f) => !f)} aria-pressed={flipped}>
            <IconRotate3d className="size-4" /> {flipped ? 'Front' : 'CVV'}
          </Button>
          <Button variant="ghost" size="sm" onClick={copy}>
            <IconCopy className="size-4" /> Copy
          </Button>
          <Button
            variant={frozen ? 'mint' : 'ghost'}
            size="sm"
            onClick={() => {
              walletStore.updateCard(wallet, card.id, { status: frozen ? 'active' : 'frozen' })
              toast({ tone: 'info', title: frozen ? 'Card unfrozen' : 'Card frozen' })
            }}
          >
            {frozen ? <IconLockOpen className="size-4" /> : <IconLock className="size-4" />} {frozen ? 'Unfreeze' : 'Freeze'}
          </Button>
        </div>
        <Panel title="Funding">
          <div className="flex flex-col divide-y divide-white/5">
            <Row label="Unclaimed creator fees">{fees.data !== undefined ? `${fmt.sol(fees.data)} · ${fmt.lamportsToUsd(fees.data, price.data)}` : '…'}</Row>
            <Row label="Wallet balance">{balance.data !== undefined ? `${fmt.sol(balance.data)} · ${fmt.lamportsToUsd(balance.data, price.data)}` : '…'}</Row>
          </div>
          <Link to="/app/fees" className="text-gradient-mint text-sm hover:underline">
            Claim fees to your wallet
          </Link>
        </Panel>
      </div>
      <div className="flex flex-col gap-6">
        <Panel title="Card details" action={<Badge tone={frozen ? 'warn' : 'mint'}>{frozen ? 'Frozen' : 'Active'}</Badge>}>
          <div className="flex flex-col divide-y divide-white/5">
            <Row label="Name on card">{card.nameOnCard}</Row>
            <Row label="Network">
              <span className="inline-flex items-center gap-2">
                <NetworkLogo network={card.network} className={card.network === 'visa' ? 'h-3.5 w-11' : 'h-6 w-9'} />
              </span>
            </Row>
            <Row label="Number">•••• {card.pan.slice(-4)}</Row>
            <Row label="Expires">{formatExpiry(card.expMonth, card.expYear)}</Row>
            <Row label="Monthly limit">
              <button type="button" onClick={() => setLimitOpen(true)} className="text-gradient-mint hover:underline">
                {card.monthlyLimitUsd ? fmt.usd(card.monthlyLimitUsd) : 'No limit · Set'}
              </button>
            </Row>
            <Row label="Team cards">
              <Link to="/app/people" className="text-gradient-mint hover:underline">
                {teamCount ? `${teamCount} issued` : 'Issue one'}
              </Link>
            </Row>
          </div>
        </Panel>
        {coin ? (
          <Panel title="Funded by" action={<Badge tone="mint">{roleLabel[coin.role]}</Badge>}>
            <CoinSummary coin={coin} />
          </Panel>
        ) : (
          <Panel title="Funded by" action={<Badge>Wallet</Badge>}>
            <div className="flex items-center gap-4 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/10">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-mint/15 text-gradient-mint">
                <IconWallet className="size-5" />
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="font-medium">Your wallet</span>
                <span className="text-muted-foreground text-xs">{balance.data !== undefined ? `${fmt.sol(balance.data)} available` : 'Reading balance…'}</span>
              </div>
            </div>
            {created.data?.length ? (
              <div className="flex flex-col gap-2">
                <span className="text-muted-foreground text-xs">You launched a coin. Link it so its creator fees fund this card:</span>
                <div className="flex flex-wrap gap-2">
                  {created.data.map((c) => (
                    <Button key={c.mint} size="sm" variant="ghost" loading={linking === c.mint} onClick={() => linkCoin(c.mint)}>
                      Link ${c.symbol}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-xs">Launch a coin on pump.fun from this wallet and you can link its creator fees here.</p>
            )}
          </Panel>
        )}
        <Panel title="Ownership proof">
          <div className="flex flex-col divide-y divide-white/5">
            <Row label="Approved by">
              <a href={explorer.account(wallet)} target="_blank" rel="noopener noreferrer" className="font-mono hover:underline">
                {shortAddress(wallet, 6, 6)}
              </a>
            </Row>
            <Row label="Signature">
              <span className="font-mono">{shortAddress(card.proof.signature, 8, 8)}</span>
            </Row>
            {card.proof.issueSignature && (
              <Row label="Issue approval">
                <span className="font-mono">{shortAddress(card.proof.issueSignature, 8, 8)}</span>
              </Row>
            )}
            <Row label="Proof">{card.proof.bondingCurve ? 'Wallet signature + coin creator on-chain' : 'Wallet signature'}</Row>
            {card.proof.bondingCurve && (
              <Row label="Bonding curve">
                <a href={explorer.account(card.proof.bondingCurve)} target="_blank" rel="noopener noreferrer" className="font-mono hover:underline">
                  {shortAddress(card.proof.bondingCurve, 6, 6)}
                </a>
              </Row>
            )}
            {card.proof.creatorOnChain && (
              <Row label="On-chain creator">
                <span className="font-mono">{shortAddress(card.proof.creatorOnChain, 6, 6)}</span>
              </Row>
            )}
            <Row label="Verified">{fmt.time(Math.floor(card.proof.verifiedAt / 1000))}</Row>
          </div>
          <details className="group">
            <summary className="cursor-pointer text-muted-foreground text-sm hover:text-foreground">Signed message</summary>
            <pre className="mt-3 whitespace-pre-wrap break-all rounded-2xl bg-[#020604] p-4 font-mono text-muted-foreground text-xs ring-1 ring-white/10">{card.proof.message}</pre>
          </details>
        </Panel>
        <div className="flex justify-end">
          <Button variant="danger" size="sm" onClick={() => setCancelOpen(true)}>
            Cancel this card
          </Button>
        </div>
      </div>
      <LimitDialog key={String(card.monthlyLimitUsd)} card={card} wallet={wallet} open={limitOpen} onOpenChange={setLimitOpen} />
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen} title="Cancel this card?" description="The card stops working right away. You can issue a new one later with a fresh approval.">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setCancelOpen(false)}>
            Keep card
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              walletStore.removeCard(wallet, card.id)
              setCancelOpen(false)
              toast({ tone: 'info', title: 'Card cancelled' })
            }}
          >
            Cancel card
          </Button>
        </div>
      </Dialog>
    </div>
  )
}

export function CardPage() {
  const { address } = useWallet()
  const { cards } = useWalletData(address)
  const primary = cards.find((c) => c.kind === 'primary')
  if (!address) return null
  return (
    <>
      <PageHeader
        title={primary ? 'Your card' : 'Get your card'}
        body={primary ? 'Freeze it, set a limit, or check the proof behind it.' : 'Three steps: name it, approve it, and prove the coin is yours.'}
      />
      {primary ? <CardManager wallet={address} card={primary} /> : <IssueFlow wallet={address} />}
    </>
  )
}
