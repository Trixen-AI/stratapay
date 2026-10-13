import { IconArrowDownLeft, IconArrowUpRight, IconCoins, IconExternalLink, IconRefresh, IconTransfer } from '@tabler/icons-react'
import type { ActivityItem, ActivityKind } from '../lib/activity'
import { explorer, fmt, shortAddress } from '../lib/solana'
import { cn } from '@/lib/utils'

const meta: Record<ActivityKind, { label: string; icon: typeof IconCoins }> = {
  'fee-claim': { label: 'Creator fees claimed', icon: IconCoins },
  sent: { label: 'Sent', icon: IconArrowUpRight },
  received: { label: 'Received', icon: IconArrowDownLeft },
  'pump-trade': { label: 'pump.fun trade', icon: IconTransfer },
  other: { label: 'Transaction', icon: IconRefresh },
}

export function ActivityList({ items, people }: { items: ActivityItem[]; people?: Map<string, string> }) {
  return (
    <ul className="flex flex-col divide-y divide-white/5">
      {items.map((a) => {
        const m = meta[a.kind]
        const Icon = m.icon
        const name = a.counterparty ? people?.get(a.counterparty) : undefined
        const positive = a.lamportsDelta > 0
        return (
          <li key={a.signature} className="flex items-center gap-3 py-3">
            <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-full ring-1', a.kind === 'fee-claim' ? 'bg-gradient-mint/15 text-gradient-mint ring-gradient-mint/30' : 'bg-white/5 text-muted-foreground ring-white/10')}>
              <Icon className="size-[18px]" stroke={2} />
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate font-medium text-sm">
                {m.label}
                {a.counterparty && <span className="text-muted-foreground"> {a.kind === 'sent' ? 'to' : 'from'} {name ?? shortAddress(a.counterparty)}</span>}
                {!a.ok && <span className="ml-2 text-[#ff9a9d] text-xs">Failed</span>}
              </span>
              <span className="text-muted-foreground text-xs">{a.time ? fmt.time(a.time) : 'Pending'}</span>
            </div>
            <span className={cn('shrink-0 font-medium font-mono text-sm tabular-nums', positive ? 'text-gradient-mint' : 'text-foreground/80')}>
              {a.lamportsDelta === 0 ? '0' : `${positive ? '+' : '−'}${fmt.solNum(Math.abs(a.lamportsDelta))}`} SOL
            </span>
            <a href={explorer.tx(a.signature)} target="_blank" rel="noopener noreferrer" aria-label="View on Solscan" className="shrink-0 text-muted-foreground hover:text-foreground">
              <IconExternalLink className="size-4" />
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export function ActivitySkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <ul className="flex flex-col gap-3" aria-label="Loading activity">
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className="h-12 animate-pulse rounded-xl bg-white/5" />
      ))}
    </ul>
  )
}
