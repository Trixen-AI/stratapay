import type { CSSProperties, ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type GlassProps = {
  as?: ElementType
  className?: string
  /** radius classes shared by the frame, its rim and its inner clip */
  radius?: string
  /** top colour of the vertical sheen (fades to transparent) */
  tint?: string
  borderColor?: string
  blur?: number
  style?: CSSProperties
  children?: ReactNode
}

/**
 * The frosted-glass frame repeated across the page: a vertical sheen from `tint` to transparent,
 * left/right hairline borders, a backdrop blur and a stacking context for content (z-3).
 */
export function Glass({
  as: Tag = 'div',
  className,
  radius = 'rounded-full',
  tint = 'var(--card)',
  borderColor,
  blur = 12,
  style,
  children,
}: GlassProps) {
  return (
    <Tag
      data-fluid-bg="1"
      className={cn('relative transform-gpu overflow-hidden border-t-0 border-r border-b-0 border-l', radius, className)}
      style={{
        transform: 'translateZ(0)',
        background: `linear-gradient(to bottom, ${tint} 0%, rgba(255,255,255,0) 100%)`,
        borderColor,
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        backdropFilter: `brightness(1.1) blur(${blur}px)`,
        WebkitBackdropFilter: `brightness(1.1) blur(${blur}px)`,
        ...style,
      }}
    >
      <div className="relative z-3 w-full">{children}</div>
    </Tag>
  )
}
