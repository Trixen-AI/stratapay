import { useMemo, useState } from 'react'
import { ActivityList, ActivitySkeleton } from '../components/ActivityList'
import { Button, EmptyState, PageHeader, Panel } from '../components/ui'
import { useActivity } from '../hooks/queries'
import { useWallet } from '../hooks/useWallet'
import type { ActivityKind } from '../lib/activity'
import { useWalletData } from '../lib/store'
import { errorMessage } from '../lib/toast'
import { cn } from '@/lib/utils'

const FILTERS: { key: 'all' | ActivityKind; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'fee-claim', label: 'Fee claims' },
  { key: 'sent', label: 'Sent' },
  { key: 'received', label: 'Received' },
  { key: 'pump-trade', label: 'pump.fun trades' },
]

export function ActivityPage() {
  const { address, publicKey } = useWallet()
  const { people } = useWalletData(address)
  const activity = useActivity(publicKey)
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['key']>('all')
  const byAddress = useMemo(() => new Map(people.map((p) => [p.address, p.name])), [people])
  const all = activity.data?.pages.flat() ?? []
  const items = filter === 'all' ? all : all.filter((a) => a.kind === filter)

  return (
    <>
      <PageHeader title="Activity" body="Every transaction from your wallet, read from Solana and labelled so fee claims and payouts stand out." />
      <Panel>
        <div className="hide-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1" role="tablist" aria-label="Filter activity">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={cn('shrink-0 rounded-full px-4 py-2 font-medium text-sm', filter === f.key ? 'bg-white text-black' : 'bg-white/5 text-muted-foreground ring-1 ring-white/10 hover:text-foreground')}
            >
              {f.label}
            </button>
          ))}
        </div>
        {activity.isLoading ? (
          <ActivitySkeleton rows={8} />
        ) : activity.error ? (
          <EmptyState title="Could not load activity" body={errorMessage(activity.error)} action={<Button size="sm" onClick={() => activity.refetch()}>Try again</Button>} />
        ) : items.length ? (
          <ActivityList items={items} people={byAddress} />
        ) : (
          <EmptyState title="Nothing here yet" body={filter === 'all' ? 'This wallet has no transactions yet.' : 'No transactions of this type in the loaded history.'} />
        )}
        {activity.hasNextPage && (
          <Button variant="ghost" onClick={() => activity.fetchNextPage()} loading={activity.isFetchingNextPage} className="self-center">
            Load older
          </Button>
        )}
      </Panel>
    </>
  )
}
