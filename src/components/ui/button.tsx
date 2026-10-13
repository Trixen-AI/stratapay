import type { ComponentProps } from 'react'
import { Link } from 'react-router'
import { cn } from '@/lib/utils'

const base =
  "group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap border border-transparent bg-clip-padding font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 gap-1.5 h-fit rounded-full p-0"

const variants = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/80',
  ghost: 'bg-white/10 text-secondary-foreground hover:bg-white/20',
} as const

type Props = ComponentProps<'a'> & {
  variant?: keyof typeof variants
  /** classes for the outer pill (the inner link carries height/padding/type) */
  wrapClassName?: string
}

const inner = 'flex h-12 items-center justify-center px-4.5 font-medium text-sm leading-4.5 tracking-[0.02em]'

/** Pill link-button: the outer span is the visual pill, the inner <a> sets size and type. */
export function PillLink({ variant = 'primary', wrapClassName, className, children, ...rest }: Props) {
  return (
    <span data-slot="button" className={cn(base, variants[variant], wrapClassName)}>
      {rest.href?.startsWith('/') ? (
        <Link to={rest.href} className={cn(inner, className)} onClick={rest.onClick} tabIndex={rest.tabIndex}>
          {children}
        </Link>
      ) : (
        <a className={cn(inner, className)} {...rest}>
          {children}
        </a>
      )}
    </span>
  )
}
