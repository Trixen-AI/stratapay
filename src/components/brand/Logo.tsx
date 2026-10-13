import { LOCKUP, MARK_LAYERS, MARK_VIEWBOX, WORD_PATH } from './logo-data'
import { cn } from '@/lib/utils'

type Props = { className?: string; markColor?: string; wordColor?: string; title?: string }

/** The three strata of the mark, each at its own opacity. Use inside an SVG. */
export function MarkLayers({ color = 'currentColor' }: { color?: string }) {
  return (
    <>
      {MARK_LAYERS.map((l) => (
        <path key={l.d} d={l.d} fill={color} fillOpacity={l.opacity} />
      ))}
    </>
  )
}

/** Full lockup (mark + outlined wordmark) as one inline SVG. Colours default to currentColor. */
export function Logo({ className, markColor = 'currentColor', wordColor = 'currentColor', title = 'StrataPay' }: Props) {
  return (
    <svg viewBox={LOCKUP.viewBox} className={cn('h-7 w-auto', className)} role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      <g transform={LOCKUP.markTransform}>
        <MarkLayers color={markColor} />
      </g>
      <g transform={LOCKUP.wordTransform}>
        <path d={WORD_PATH} fill={wordColor} />
      </g>
    </svg>
  )
}

export function LogoMark({ className, color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg viewBox={MARK_VIEWBOX} className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <MarkLayers color={color} />
    </svg>
  )
}
