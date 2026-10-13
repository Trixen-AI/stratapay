import { IconCircleCheck, IconExternalLink } from '@tabler/icons-react'
import { roleLabel, type CoinInfo, type OwnershipRole } from '../lib/pump'
import { explorer, fmt, shortAddress } from '../lib/solana'
import { useSolPrice } from '../hooks/queries'
import { Badge } from './ui'

function marketCap(coin: CoinInfo, solPrice: number | undefined) {
  if (coin.marketCapUsd) return fmt.usdCompact(coin.marketCapUsd)
  if (coin.marketCapLamports !== null && solPrice) return fmt.usdCompact((coin.marketCapLamports / 1e9) * solPrice)
  if (coin.marketCapLamports !== null) return fmt.sol(coin.marketCapLamports)
  return null
}

export function CoinSummary({ coin, role }: { coin: CoinInfo; role?: OwnershipRole }) {
  const price = useSolPrice()
  const cap = marketCap(coin, price.data)
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/10">
      {coin.image ? (
        <img src={coin.image} alt="" className="size-12 shrink-0 rounded-xl object-cover ring-1 ring-white/10" />
      ) : (
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-mint/15 font-semibold text-gradient-mint">{coin.symbol.slice(0, 2)}</span>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate font-medium">{coin.name}</span>
          <span className="font-mono text-muted-foreground text-xs">${coin.symbol}</span>
          {role && <Badge tone="mint">{roleLabel[role]}</Badge>}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground text-xs">
          {cap && <span>Market cap {cap}</span>}
          <span>{coin.complete ? 'Graduated to PumpSwap' : `Bonding curve ${Math.round(coin.progress * 100)}%`}</span>
          <a href={explorer.pumpCoin(coin.mint)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-foreground">
            pump.fun <IconExternalLink className="size-3" />
          </a>
        </div>
      </div>
    </div>
  )
}

export function VerifiedNote({ coin }: { coin: CoinInfo }) {
  return (
    <p className="flex items-start gap-2 text-gradient-mint text-sm">
      <IconCircleCheck className="mt-0.5 size-4 shrink-0" />
      <span>
        Verified on-chain: the bonding curve{' '}
        <a href={explorer.account(coin.bondingCurve)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
          {shortAddress(coin.bondingCurve, 5, 5)}
        </a>{' '}
        lists your wallet as the fee recipient.
      </span>
    </p>
  )
}

export function CoinListSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3" role="status" aria-label="Finding your coins">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/5" />
      ))}
      <span className="text-muted-foreground text-xs">Looking up coins created by your wallet on pump.fun…</span>
    </div>
  )
}
