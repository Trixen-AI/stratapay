import { CardArt } from '@/components/art/CardArt'
import { cn } from '@/lib/utils'

type Mode = 'color' | 'wire'

const box = 'h-auto w-full'

/** Step 1: "Connect wallet" sheet. */
export function ConnectArt({ mode, className }: { mode: Mode; className?: string }) {
  const wire = mode === 'wire'
  const s = wire ? 'currentColor' : 'none'
  return (
    <svg viewBox="0 0 280 175" className={cn(box, className)} aria-hidden="true" fill="none">
      <rect x="1" y="1" width="278" height="173" rx="18" fill={wire ? 'none' : '#030806'} stroke={wire ? s : '#ffffff'} strokeOpacity={wire ? 1 : 0.12} />
      <text x="16" y="34" fill={wire ? 'currentColor' : '#f4f8f5'} fontSize="17" fontWeight="500" fontFamily="'Geist Variable', sans-serif">
        Connect wallet
      </text>
      <rect x="16" y="52" width="248" height="42" rx="21" fill={wire ? 'none' : '#0f2219'} stroke={wire ? s : '#7fe3a8'} strokeWidth={wire ? 1 : 1.6} />
      <text x="34" y="68" fill={wire ? 'currentColor' : '#b9c2bc'} fontSize="7" fontFamily="'Geist Variable', sans-serif">
        Creator wallet
      </text>
      <text x="34" y="83" fill={wire ? 'currentColor' : '#f4f8f5'} fontSize="10" fontFamily="'Geist Mono Variable', monospace">
        7xKX…q4d9Fq
      </text>
      {!wire && <rect x="113" y="74" width="1.5" height="12" fill="#7fe3a8" className="caret-blink" />}
      <rect x="16" y="104" width="120" height="40" rx="20" fill={wire ? 'none' : '#14271d'} stroke={s} />
      <rect x="144" y="104" width="120" height="40" rx="20" fill={wire ? 'none' : '#14271d'} stroke={s} />
      <text x="40" y="128" fill={wire ? 'currentColor' : '#b9c2bc'} fontSize="10" fontFamily="'Geist Variable', sans-serif">
        Browser wallet
      </text>
      <text x="166" y="128" fill={wire ? 'currentColor' : '#b9c2bc'} fontSize="10" fontFamily="'Geist Variable', sans-serif">
        Hardware key
      </text>
      <text x="16" y="162" fill={wire ? 'currentColor' : '#5d6b64'} fontSize="7" fontFamily="'Geist Variable', sans-serif">
        Only the wallet that launched the coin can link it.
      </text>
    </svg>
  )
}

/** Step 2: coin profile with a 7-day fee chart. */
export function CoinArt({ mode, className }: { mode: Mode; className?: string }) {
  const wire = mode === 'wire'
  const bars = [34, 52, 40, 70, 58, 86, 74]
  return (
    <svg viewBox="0 0 280 175" className={cn(box, className)} aria-hidden="true" fill="none">
      <rect x="1" y="1" width="278" height="173" rx="14" fill={wire ? 'none' : '#0a120e'} stroke={wire ? 'currentColor' : '#ffffff'} strokeOpacity={wire ? 1 : 0.14} />
      <path d="M1 34h278" stroke={wire ? 'currentColor' : '#ffffff'} strokeOpacity={wire ? 1 : 0.1} />
      <rect x="14" y="12" width="12" height="10" rx="2" stroke={wire ? 'currentColor' : '#7fe3a8'} />
      <text x="34" y="21" fill={wire ? 'currentColor' : '#b9c2bc'} fontSize="8" letterSpacing="1.4" fontFamily="'Geist Mono Variable', monospace">
        YOUR COINS · 1 SELECTED
      </text>
      <circle cx="44" cy="74" r="22" fill={wire ? 'none' : '#7fe3a8'} stroke={wire ? 'currentColor' : 'none'} />
      {!wire && (
        <g fill="#05110b">
          <circle cx="37" cy="71" r="3" />
          <circle cx="51" cy="71" r="3" />
          <path d="M36 80q8 6 16 0" stroke="#05110b" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        </g>
      )}
      <text x="78" y="70" fill={wire ? 'currentColor' : '#f4f8f5'} fontSize="13" fontWeight="600" fontFamily="'Geist Mono Variable', monospace" letterSpacing="1">
        $YOURCOIN
      </text>
      <text x="78" y="86" fill={wire ? 'currentColor' : '#b9c2bc'} fontSize="8" fontFamily="'Geist Mono Variable', monospace" letterSpacing="1">
        CREATOR FEES · 7D
      </text>
      <rect x="236" y="62" width="28" height="16" rx="8" fill={wire ? 'none' : '#7fe3a8'} stroke={wire ? 'currentColor' : 'none'} />
      <circle cx={wire ? 244 : 256} cy="70" r="5" fill={wire ? 'none' : '#05110b'} stroke={wire ? 'currentColor' : 'none'} />
      {bars.map((h, i) => (
        <rect key={i} x={78 + i * 26} y={158 - h * 0.62} width="16" height={h * 0.62} rx="3" fill={wire ? 'none' : i === 5 ? '#7fe3a8' : '#1f7a52'} stroke={wire ? 'currentColor' : 'none'} />
      ))}
      <path d="M14 158h252" stroke={wire ? 'currentColor' : '#ffffff'} strokeOpacity={wire ? 1 : 0.1} />
    </svg>
  )
}

/** Step 3: the card itself. */
export function ActivateArt({ mode, className }: { mode: Mode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="w-full">
        <CardArt variant={mode === 'wire' ? 'wire' : 'mint'} network={mode === 'wire' ? undefined : 'visa'} />
      </div>
    </div>
  )
}
