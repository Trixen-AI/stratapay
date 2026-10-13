import { useId } from 'react'
import { LOCKUP, MARK_LAYERS, WORD_PATH } from '@/components/brand/logo-data'
import { MarkLayers } from '@/components/brand/Logo'
import { NetworkLogo, type Network } from '@/components/brand/NetworkLogo'
import { cn } from '@/lib/utils'

export type CardVariant = 'mint' | 'silver' | 'wire'

const palettes = {
  mint: { a: '#b9f3cf', b: '#6fdc9d', c: '#1f9a5e', d: '#0d5a37', sheen: '#ffffff', ink: '#ffffff' },
  silver: { a: '#e3e8e5', b: '#c2cac6', c: '#929c97', d: '#6a7570', sheen: '#ffffff', ink: '#ffffff' },
} as const

type Props = {
  variant?: CardVariant
  last4?: string
  className?: string
  title?: string
  /** omit the printed number (the dashboard overlays live card details) */
  bare?: boolean
  /** show the card network mark in the bottom-right corner */
  network?: Network
}

/** StrataPay card face, drawn in a 1630 x 1024 box (ISO card ratio). */
export function CardArt({ network, ...props }: Props) {
  if (!network) return <CardFace {...props} />
  return (
    <div className={cn('relative', props.className)}>
      <CardFace {...props} className="h-auto w-full" />
      <NetworkLogo network={network} className={cn('absolute right-[6%] bottom-[8%]', network === 'visa' ? 'h-[8%] w-[20%]' : 'h-[16%] w-[17%]')} />
    </div>
  )
}

function CardFace({ variant = 'mint', last4 = '4207', className, title, bare }: Omit<Props, 'network'>) {
  const id = useId().replace(/:/g, '')
  const lockScale = 860 / Number(LOCKUP.viewBox.split(' ')[2])

  if (variant === 'wire') {
    return (
      <svg viewBox="0 0 1630 1024" className={cn('h-auto w-full', className)} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
        <rect x="6" y="6" width="1618" height="1012" rx="118" fill="none" stroke="currentColor" strokeWidth="6" />
        <g transform={`translate(96 92) scale(${lockScale})`} opacity="0.9">
          <g transform={LOCKUP.markTransform}>
            {MARK_LAYERS.map((l) => (
              <path key={l.d} d={l.d} fill="none" stroke="currentColor" strokeWidth={4 / lockScale} />
            ))}
          </g>
          <g transform={LOCKUP.wordTransform}>
            <path d={WORD_PATH} fill="none" stroke="currentColor" strokeWidth={5 / lockScale} />
          </g>
        </g>
        <rect x="1300" y="390" width="190" height="150" rx="30" fill="none" stroke="currentColor" strokeWidth="6" />
        {!bare && (
          <text x="96" y="900" fill="currentColor" fontFamily="'Geist Mono Variable', monospace" fontSize="64" letterSpacing="6">
          •••• {last4}
        </text>
        )}
      </svg>
    )
  }

  const p = palettes[variant]
  return (
    <svg viewBox="0 0 1630 1024" className={cn('h-auto w-full', className)} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <defs>
        <linearGradient id={`${id}-base`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={p.a} />
          <stop offset="0.38" stopColor={p.b} />
          <stop offset="0.7" stopColor={p.c} />
          <stop offset="1" stopColor={p.d} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.3" cy="0.55" r="0.7">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="0.55" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-sheen`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0.42" stopColor={p.sheen} stopOpacity="0" />
          <stop offset="0.56" stopColor={p.sheen} stopOpacity="0.55" />
          <stop offset="0.62" stopColor={p.sheen} stopOpacity="0.08" />
          <stop offset="0.8" stopColor={p.sheen} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-chip`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#d8dedb" />
          <stop offset="1" stopColor="#aab3ae" />
        </linearGradient>
        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.09 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        <clipPath id={`${id}-clip`}>
          <rect width="1630" height="1024" rx="120" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <rect width="1630" height="1024" fill={`url(#${id}-base)`} />
        <rect width="1630" height="1024" fill={`url(#${id}-glow)`} />
        <rect width="1630" height="1024" fill={`url(#${id}-sheen)`} />
        {/* concentric coin rings, the fee motif */}
        <g fill="none" stroke="#ffffff" strokeOpacity="0.14" strokeWidth="3">
          <circle cx="1390" cy="1010" r="250" />
          <circle cx="1390" cy="1010" r="360" />
          <circle cx="1390" cy="1010" r="470" />
        </g>
        <rect width="1630" height="1024" fill="#ffffff" filter={`url(#${id}-grain)`} />
      </g>
      <rect x="2" y="2" width="1626" height="1020" rx="118" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="4" />
      <g transform={`translate(96 102) scale(${lockScale})`} opacity="0.22" aria-hidden="true">
        <g transform={LOCKUP.markTransform}>
          <MarkLayers color="#05110b" />
        </g>
        <g transform={LOCKUP.wordTransform}>
          <path d={WORD_PATH} fill="#05110b" />
        </g>
      </g>
      <g transform={`translate(96 96) scale(${lockScale})`}>
        <g transform={LOCKUP.markTransform}>
          <MarkLayers color={p.ink} />
        </g>
        <g transform={LOCKUP.wordTransform}>
          <path d={WORD_PATH} fill={p.ink} />
        </g>
      </g>
      <g transform="translate(1300 390)">
        <rect width="190" height="150" rx="30" fill={`url(#${id}-chip)`} />
        <path d="M0 52h62M0 98h62M128 52h62M128 98h62M62 0v150M128 0v150" stroke="#8e9893" strokeOpacity="0.55" strokeWidth="4" fill="none" />
      </g>
      {!bare && (
        <text x="96" y="900" fill={p.ink} fontFamily="'Geist Mono Variable', monospace" fontSize="64" fontWeight="500" letterSpacing="6">
        •••• {last4}
      </text>
      )}
    </svg>
  )
}

/** Card with the darker offset copy behind it that gives the edge its thickness. */
export function CardWithEdge({ variant = 'mint', last4, className, edgeBrightness = 0.5, title }: Props & { edgeBrightness?: number }) {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-0 z-[-1] translate-y-[4px]" style={{ filter: `brightness(${edgeBrightness})` }}>
        <CardArt variant={variant} last4={last4} />
      </div>
      <CardArt variant={variant} last4={last4} title={title} />
    </div>
  )
}
