import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import bs58 from 'bs58'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from '@solana/web3.js'
import { IconCreditCard, IconLock, IconLockOpen, IconSend, IconTrash, IconUserPlus } from '@tabler/icons-react'
import { ActivityList, ActivitySkeleton } from '../components/ActivityList'
import { Dialog } from '../components/Dialog'
import { PaymentCard } from '../components/PaymentCard'
import { Badge, Button, EmptyState, Field, Input, PageHeader, Panel } from '../components/ui'
import { qk, useActivity, useSolBalance, useSolPrice } from '../hooks/queries'
import { useWallet } from '../hooks/useWallet'
import { deriveCardNumber, expiryFrom, validateCardName } from '../lib/card'
import { explorer, fmt, isWalletAddress, shortAddress } from '../lib/solana'
import { useWalletData, walletStore, type CardRecord, type Person } from '../lib/store'
import { errorMessage, toast } from '../lib/toast'

const FEE_BUFFER = 10_000 // lamports kept back for the network fee

function AddPersonDialog({ wallet, open, onOpenChange }: { wallet: string; open: boolean; onOpenChange: (o: boolean) => void }) {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const nameErr = name.trim().length < 2 ? 'Enter a name.' : null
  const addrErr = !isWalletAddress(address) ? 'Enter a Solana wallet address.' : address.trim() === wallet ? 'That is your own wallet.' : null
  const [touched, setTouched] = useState(false)
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Add a person" description="Someone you pay from creator fees: a mod, artist, dev or co-founder.">
      <div className="flex flex-col gap-4">
        <Field label="Name" error={touched ? nameErr : null}>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Lena (mod)" maxLength={40} />
        </Field>
        <Field label="Wallet address" error={touched ? addrErr : null}>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Solana address" spellCheck={false} className="font-mono text-sm" />
        </Field>
        <Button
          onClick={() => {
            setTouched(true)
            if (nameErr || addrErr) return
            walletStore.addPerson(wallet, { name: name.trim(), address: address.trim() })
            toast({ tone: 'success', title: `${name.trim()} added` })
            setName('')
            setAddress('')
            setTouched(false)
            onOpenChange(false)
          }}
        >
          Save person
        </Button>
      </div>
    </Dialog>
  )
}

function SendDialog({ person, onClose }: { person: Person | null; onClose: () => void }) {
  const { address, publicKey, sendInstructions } = useWallet()
  const balance = useSolBalance(publicKey)
  const price = useSolPrice()
  const qc = useQueryClient()
  const [amount, setAmount] = useState('')
  const [sending, setSending] = useState(false)
  const lamports = Math.round(Number(amount || 0) * LAMPORTS_PER_SOL)
  const max = Math.max(0, (balance.data ?? 0) - FEE_BUFFER)
  const err = !amount ? null : !Number.isFinite(lamports) || lamports <= 0 ? 'Enter an amount above zero.' : lamports > max ? 'More than your available balance.' : null

  const send = async () => {
    if (!person || !publicKey || err || !lamports) return
    setSending(true)
    try {
      const sig = await sendInstructions([SystemProgram.transfer({ fromPubkey: publicKey, toPubkey: new PublicKey(person.address), lamports })])
      toast({ tone: 'success', title: `Sent ${fmt.sol(lamports)} to ${person.name}`, href: explorer.tx(sig) })
      await Promise.all([qc.invalidateQueries({ queryKey: qk.balance(address!) }), qc.invalidateQueries({ queryKey: qk.activity(address!) })])
      setAmount('')
      onClose()
    } catch (e) {
      toast({ tone: 'error', title: 'Payment failed', body: errorMessage(e) })
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog open={!!person} onOpenChange={(o) => !o && onClose()} title={`Pay ${person?.name ?? ''}`} description={person ? `To ${shortAddress(person.address, 6, 6)}` : undefined}>
      <div className="flex flex-col gap-4">
        <Field label="Amount in SOL" error={err} hint={`Available ${balance.data !== undefined ? fmt.sol(max) : '…'}${lamports && price.data ? ` · about ${fmt.lamportsToUsd(lamports, price.data)}` : ''}`}>
          <div className="flex gap-2">
            <Input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))} placeholder="0.00" invalid={!!err} />
            <Button variant="ghost" className="h-12" onClick={() => setAmount((max / LAMPORTS_PER_SOL).toFixed(4))}>
              Max
            </Button>
          </div>
        </Field>
        <Button variant="mint" onClick={send} loading={sending} disabled={!!err || !lamports}>
          <IconSend className="size-4" /> Send payment
        </Button>
      </div>
    </Dialog>
  )
}

function TeamCardDialog({ person, wallet, primary, onClose }: { person: Person | null; wallet: string; primary: CardRecord | undefined; onClose: () => void }) {
  const { signMessage } = useWallet()
  const [limit, setLimit] = useState('500')
  const [busy, setBusy] = useState(false)
  const nameErr = person ? validateCardName(person.name.replace(/[^A-Za-z .'-]/g, '').trim()) : null
  const limitNum = Number(limit)
  const limitErr = !Number.isFinite(limitNum) || limitNum <= 0 ? 'Set a monthly limit above zero.' : null

  const issue = async () => {
    if (!person || !primary || limitErr) return
    setBusy(true)
    try {
      const cardName = person.name.replace(/[^A-Za-z .'-]/g, '').trim().slice(0, 26) || 'Team member'
      const message = [
        'StrataPay team card',
        '',
        `Card holder: ${cardName}`,
        `Holder wallet: ${person.address}`,
        `Monthly limit: ${fmt.usd(limitNum)}`,
        `Funded by: ${wallet}`,
        `Linked coin: ${primary.coinMint ?? 'none, funded from wallet'}`,
        '',
        `Nonce: ${crypto.randomUUID().slice(0, 18)}`,
        `Issued at: ${new Date().toISOString()}`,
      ].join('\n')
      const signature = await signMessage(message)
      const now = Date.now()
      const exp = expiryFrom(now)
      walletStore.addCard(wallet, {
        kind: 'team',
        nameOnCard: cardName,
        network: primary.network,
        pan: await deriveCardNumber(primary.network, signature),
        expMonth: exp.month,
        expYear: exp.year,
        status: 'active',
        monthlyLimitUsd: limitNum,
        coinMint: primary.coinMint,
        holderAddress: person.address,
        createdAt: now,
        proof: { ...primary.proof, message, signature: bs58.encode(signature), signedAt: now },
      })
      toast({ tone: 'success', title: `Team card issued to ${person.name}` })
      onClose()
    } catch (e) {
      toast({ tone: 'error', title: 'Team card not issued', body: errorMessage(e) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={!!person} onOpenChange={(o) => !o && onClose()} title={`Team card for ${person?.name ?? ''}`} description="Funded by your card, with its own monthly limit. You approve it in your wallet.">
      {primary ? (
        <div className="flex flex-col gap-4">
          <PaymentCard network={primary.network} nameOnCard={person?.name ?? ''} variant="silver" />
          {nameErr && <p className="text-[#ff9a9d] text-xs">The name needs at least two letters to print on a card. Edit the person first.</p>}
          <Field label="Monthly limit (USD)" error={limitErr}>
            <Input inputMode="decimal" value={limit} onChange={(e) => setLimit(e.target.value.replace(/[^0-9.]/g, ''))} />
          </Field>
          <Button onClick={issue} loading={busy} disabled={!!limitErr || !!nameErr}>
            Approve and issue
          </Button>
        </div>
      ) : (
        <EmptyState title="Get your own card first" body="Team cards draw on your own card, so it needs to exist first." action={<Link to="/app/card" className="text-gradient-mint text-sm hover:underline">Get your card</Link>} />
      )}
    </Dialog>
  )
}

export function PeoplePage() {
  const { address, publicKey } = useWallet()
  const { people, cards } = useWalletData(address)
  const activity = useActivity(publicKey)
  const [adding, setAdding] = useState(false)
  const [payTo, setPayTo] = useState<Person | null>(null)
  const [cardFor, setCardFor] = useState<Person | null>(null)
  const primary = cards.find((c) => c.kind === 'primary')
  const teamCards = cards.filter((c) => c.kind === 'team')
  const byAddress = useMemo(() => new Map(people.map((p) => [p.address, p.name])), [people])
  const payouts = (activity.data?.pages.flat() ?? []).filter((a) => a.kind === 'sent' && a.counterparty && byAddress.has(a.counterparty))
  if (!address) return null

  return (
    <>
      <PageHeader
        title="Fund your people"
        body="Pay the people who keep your project running, straight from what your coin earns. Payments are real SOL transfers you sign."
        action={
          <Button onClick={() => setAdding(true)}>
            <IconUserPlus className="size-4" /> Add person
          </Button>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] [&>*]:min-w-0">
        <Panel title="People">
          {people.length === 0 ? (
            <EmptyState title="Nobody here yet" body="Add a mod, an artist or a dev with their wallet address, then pay them or give them a card." action={<Button size="sm" onClick={() => setAdding(true)}>Add person</Button>} />
          ) : (
            <ul className="flex flex-col divide-y divide-white/5">
              {people.map((p) => {
                const card = teamCards.find((c) => c.holderAddress === p.address)
                return (
                  <li key={p.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-mint/15 font-medium text-gradient-mint">{p.name.slice(0, 1).toUpperCase()}</span>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-medium">{p.name}</span>
                        <a href={explorer.account(p.address)} target="_blank" rel="noopener noreferrer" className="font-mono text-muted-foreground text-xs hover:underline">
                          {shortAddress(p.address, 6, 6)}
                        </a>
                      </div>
                      {card && <Badge tone={card.status === 'active' ? 'mint' : 'warn'}>Card •••• {card.pan.slice(-4)}</Badge>}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="mint" onClick={() => setPayTo(p)}>
                        <IconSend className="size-4" /> Pay
                      </Button>
                      {!card && (
                        <Button size="sm" variant="ghost" onClick={() => setCardFor(p)}>
                          <IconCreditCard className="size-4" /> Card
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" aria-label={`Remove ${p.name}`} onClick={() => walletStore.removePerson(address, p.id)}>
                        <IconTrash className="size-4" />
                      </Button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </Panel>
        <div className="flex flex-col gap-6">
          <Panel title="Team cards">
            {teamCards.length === 0 ? (
              <p className="text-muted-foreground text-sm">No team cards yet. Use “Card” next to a person to issue one.</p>
            ) : (
              <ul className="flex flex-col divide-y divide-white/5">
                {teamCards.map((c) => (
                  <li key={c.id} className="flex items-center gap-3 py-3">
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-medium text-sm">
                        {c.nameOnCard} · •••• {c.pan.slice(-4)}
                      </span>
                      <span className="text-muted-foreground text-xs">{c.monthlyLimitUsd ? `${fmt.usd(c.monthlyLimitUsd)} a month` : 'No limit'}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => walletStore.updateCard(address, c.id, { status: c.status === 'active' ? 'frozen' : 'active' })}
                    >
                      {c.status === 'active' ? <IconLock className="size-4" /> : <IconLockOpen className="size-4" />}
                      {c.status === 'active' ? 'Freeze' : 'Unfreeze'}
                    </Button>
                    <Button size="sm" variant="ghost" aria-label="Cancel card" onClick={() => walletStore.removeCard(address, c.id)}>
                      <IconTrash className="size-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel title="Recent payouts">
            {activity.isLoading ? <ActivitySkeleton rows={3} /> : payouts.length ? <ActivityList items={payouts} people={byAddress} /> : <p className="text-muted-foreground text-sm">Payments to people on this list appear here once confirmed.</p>}
          </Panel>
        </div>
      </div>
      <AddPersonDialog wallet={address} open={adding} onOpenChange={setAdding} />
      <SendDialog person={payTo} onClose={() => setPayTo(null)} />
      <TeamCardDialog person={cardFor} wallet={address} primary={primary} onClose={() => setCardFor(null)} />
    </>
  )
}
