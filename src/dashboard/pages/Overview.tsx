import { useMemo } from 'react'
import { Link } from 'react-router'
import { IconArrowRight, IconCoins, IconCreditCard, IconSend } from '@tabler/icons-react'
import { ActivityList, ActivitySkeleton } from '../components/ActivityList'
import { PaymentCard } from '../components/PaymentCard'
import { ButtonLink, EmptyState, PageHeader, Panel, Stat } from '../components/ui'
import { useActivity, useCreatedCoins, useSolBalance, useSolPrice, useUnclaimedFees } from '../hooks/queries'
import { useWallet } from '../hooks/useWallet'
import { fmt } from '../lib/solana'
import { useWalletData } from '../lib/store'
import { errorMessage } from '../lib/toast'

function QuickAction({ to, icon, title, body }: { to: string; icon: React.ReactNode; title: string; body: string }) {
  return (
    <Link to={to} className="group flex items-center gap-4 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/10 transition-colors hover:bg-white/[0.06]">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-mint/15 text-gradient-mint">{icon}</span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-medium text-sm">{title}</span>
        <span className="truncate text-muted-foreground text-xs">{body}</span>
      </span>
      <IconArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}

export function Overview() {
  const { address, publicKey } = useWallet()
  const { cards, people } = useWalletData(address)
  const created = useCreatedCoins(publicKey)
  const coins = created.data ?? []
  const fees = useUnclaimedFees(publicKey)
  const balance = useSolBalance(publicKey)
  const price = useSolPrice()
  const activity = useActivity(publicKey)
  const primary = cards.find((c) => c.kind === 'primary')
  const byAddress = useMemo(() => new Map(people.map((p) => [p.address, p.name])), [people])
  const recent = (activity.data?.pages[0] ?? []).slice(0, 6)

  return (
    <>
      <PageHeader
        title={primary ? `Hi, ${primary.nameOnCard.split(' ')[0]}` : 'Welcome to StrataPay'}
        body="Your creator fees, card and payouts in one place."
        action={
          primary ? (
            <ButtonLink to="/app/fees" variant="mint">
              <IconCoins className="size-4" /> Claim fees
            </ButtonLink>
          ) : (
            <ButtonLink to="/app/card">Get your card</ButtonLink>
          )
        }
      />
      <div className="grid grid-cols-2 gap-3 lg:gap-4 xl:grid-cols-4 [&>*]:min-w-0">
        <Stat label="Unclaimed fees" accent loading={fees.isLoading} value={fees.data !== undefined ? fmt.sol(fees.data) : '-'} sub={fees.data !== undefined ? fmt.lamportsToUsd(fees.data, price.data) : fees.error ? 'Vault unavailable' : undefined} />
        <Stat label="Wallet balance" loading={balance.isLoading} value={balance.data !== undefined ? fmt.sol(balance.data) : '-'} sub={balance.data !== undefined ? fmt.lamportsToUsd(balance.data, price.data) : undefined} />
        <Stat label="Coins created" loading={created.isLoading} value={coins.length} sub={coins.length ? coins.map((c) => `${c.symbol}`).join(', ') : 'None on pump.fun'} />
        <Stat label="Cards" value={cards.length} sub={`${cards.filter((c) => c.kind === 'team').length} for your team`} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[420px_1fr] [&>*]:min-w-0">
        <div className="flex flex-col gap-4">
          {primary ? (
            <Link to="/app/card" aria-label="Open your card">
              <PaymentCard network={primary.network} nameOnCard={primary.nameOnCard} pan={primary.pan} expMonth={primary.expMonth} expYear={primary.expYear} frozen={primary.status === 'frozen'} />
            </Link>
          ) : (
            <Panel>
              <PaymentCard network="visa" nameOnCard="Your name" />
              <p className="text-muted-foreground text-sm">Name it, approve it in your wallet and prove the coin is yours. It takes a minute.</p>
              <ButtonLink to="/app/card" className="w-full">
                <IconCreditCard className="size-4" /> Get your card
              </ButtonLink>
            </Panel>
          )}
          <div className="flex flex-col gap-2">
            <QuickAction to="/app/fees" icon={<IconCoins className="size-[18px]" />} title="Claim creator fees" body="Move what your coin earned into your wallet" />
            <QuickAction to="/app/people" icon={<IconSend className="size-[18px]" />} title="Pay your people" body="Send SOL to a mod, artist or dev" />
          </div>
        </div>
        <Panel title="Recent activity" action={<Link to="/app/activity" className="text-gradient-mint text-sm hover:underline">See all</Link>}>
          {activity.isLoading ? (
            <ActivitySkeleton />
          ) : activity.error ? (
            <EmptyState title="Could not load activity" body={errorMessage(activity.error)} />
          ) : recent.length ? (
            <ActivityList items={recent} people={byAddress} />
          ) : (
            <EmptyState title="No transactions yet" body="Fee claims, payouts and trades from this wallet will show up here." />
          )}
        </Panel>
      </div>
    </>
  )
}
