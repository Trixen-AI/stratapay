import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { IconCoins, IconRefresh, IconRocket } from '@tabler/icons-react'
import { ActivityList, ActivitySkeleton } from '../components/ActivityList'
import { CoinListSkeleton, CoinSummary } from '../components/CoinVerify'
import { Button, EmptyState, PageHeader, Panel, Stat } from '../components/ui'
import { qk, useActivity, useCreatedCoins, useSolPrice, useUnclaimedFees } from '../hooks/queries'
import { useWallet } from '../hooks/useWallet'
import { claimFeeInstructions } from '../lib/pump'
import { explorer, fmt, getConnection } from '../lib/solana'
import { errorMessage, toast } from '../lib/toast'

export function FeesPage() {
  const { address, publicKey, sendInstructions } = useWallet()
  const fees = useUnclaimedFees(publicKey)
  const price = useSolPrice()
  const activity = useActivity(publicKey)
  const created = useCreatedCoins(publicKey)
  const qc = useQueryClient()
  const [claiming, setClaiming] = useState(false)

  const coins = created.data ?? []
  const unclaimed = fees.data ?? 0
  const claims = (activity.data?.pages.flat() ?? []).filter((a) => a.kind === 'fee-claim')
  const claimedTotal = claims.reduce((s, a) => s + Math.max(0, a.lamportsDelta), 0)
  const noCoins = created.isSuccess && coins.length === 0

  const claim = async () => {
    if (!publicKey || !address) return
    setClaiming(true)
    try {
      const ixs = await claimFeeInstructions(getConnection(), publicKey)
      const sig = await sendInstructions(ixs)
      toast({ tone: 'success', title: `Claimed ${fmt.sol(unclaimed)}`, body: 'Creator fees are now in your wallet.', href: explorer.tx(sig) })
      await Promise.all([qc.invalidateQueries({ queryKey: qk.fees(address) }), qc.invalidateQueries({ queryKey: qk.balance(address) }), qc.invalidateQueries({ queryKey: qk.activity(address) })])
    } catch (e) {
      toast({ tone: 'error', title: 'Claim failed', body: errorMessage(e) })
    } finally {
      setClaiming(false)
    }
  }

  const refresh = () => {
    fees.refetch()
    created.refetch()
  }

  return (
    <>
      <PageHeader
        title="Creator fees"
        body="Every trade on the coins you launched on pump.fun pays you a creator fee. We read them straight from your connected wallet."
        action={
          <Button variant="ghost" size="sm" onClick={refresh} loading={fees.isFetching || created.isFetching}>
            <IconRefresh className="size-4" /> Refresh
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4 [&>*]:min-w-0">
        <Stat label="Ready to claim" accent loading={fees.isLoading} value={fmt.sol(unclaimed)} sub={fmt.lamportsToUsd(unclaimed, price.data)} />
        <Stat label="Claimed recently" loading={activity.isLoading} value={fmt.sol(claimedTotal)} sub={`${claims.length} claim${claims.length === 1 ? '' : 's'}`} />
        <Stat label="Coins created" loading={created.isLoading} value={coins.length} sub={coins.length ? coins.map((c) => `$${c.symbol}`).join(', ') : 'None found'} />
      </div>

      <Panel>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 flex-col gap-1">
            <p className="font-medium text-lg">Claim to your wallet</p>
            <p className="text-muted-foreground text-sm">
              {noCoins && !unclaimed ? 'Nothing to claim: this wallet has not launched a coin on pump.fun.' : 'Collects from both pump.fun vaults (bonding curve and PumpSwap) in one transaction you sign.'}
            </p>
            {fees.error && <p className="text-[#ff9a9d] text-sm">Could not read your fees: {errorMessage(fees.error)}</p>}
          </div>
          <Button variant="mint" onClick={claim} loading={claiming} disabled={!unclaimed} className="h-12 px-6">
            <IconCoins className="size-4" /> {unclaimed ? `Claim ${fmt.sol(unclaimed)}` : 'Nothing to claim yet'}
          </Button>
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2 [&>*]:min-w-0">
        <Panel title="Your coins on pump.fun">
          {created.isLoading ? (
            <CoinListSkeleton />
          ) : created.error ? (
            <EmptyState title="Could not look up your coins" body={errorMessage(created.error)} action={<Button size="sm" onClick={() => created.refetch()}>Try again</Button>} />
          ) : noCoins ? (
            <EmptyState
              icon={<IconRocket className="size-5 text-muted-foreground" />}
              title="No coins created yet"
              body="This wallet has not deployed a coin on pump.fun. Launch one, or connect the wallet you launched with, and its creator fees show up here."
              action={
                <a href="https://pump.fun/create" target="_blank" rel="noopener noreferrer" className="text-gradient-mint text-sm hover:underline">
                  Create a coin on pump.fun
                </a>
              }
            />
          ) : (
            <ul className="flex flex-col gap-3">
              {coins.map((c) => (
                <li key={c.mint}>
                  <CoinSummary coin={c} role={c.role} />
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Claim history">
          {activity.isLoading ? (
            <ActivitySkeleton rows={4} />
          ) : claims.length ? (
            <ActivityList items={claims} />
          ) : (
            <EmptyState title="No claims yet" body="Claims you make here, or on pump.fun, show up once they are on-chain." />
          )}
          {activity.hasNextPage && (
            <Button variant="ghost" size="sm" onClick={() => activity.fetchNextPage()} loading={activity.isFetchingNextPage}>
              Search older transactions
            </Button>
          )}
        </Panel>
      </div>
    </>
  )
}
