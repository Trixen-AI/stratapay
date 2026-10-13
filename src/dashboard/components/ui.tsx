import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router'
import { Glass } from '@/components/ui/glass'
import { cn } from '@/lib/utils'

export function Panel({ className, children, title, action }: { className?: string; children: ReactNode; title?: ReactNode; action?: ReactNode }) {
  return (
    <Glass radius="rounded-3xl" className={cn('w-full', className)}>
      <div className="flex flex-col gap-5 p-5 lg:p-6">
        {(title || action) && (
          <div className="flex items-center justify-between gap-3">
            {title ? <h2 className="font-medium text-base text-foreground lg:text-lg">{title}</h2> : <span />}
            {action}
          </div>
        )}
        {children}
      </div>
    </Glass>
  )
}

type Variant = 'primary' | 'ghost' | 'mint' | 'danger'
const variants: Record<Variant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/80',
  ghost: 'bg-white/5 text-foreground ring-1 ring-white/10 hover:bg-white/10 hover:ring-white/20',
  mint: 'bg-gradient-mint text-[#03140b] hover:bg-gradient-light-mint',
  danger: 'bg-destructive/15 text-[#ff9a9d] ring-1 ring-destructive/30 hover:bg-destructive/25',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  className,
  children,
  disabled,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: 'sm' | 'md'; loading?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-[0.02em] outline-none transition-all focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-45',
        size === 'md' ? 'h-11 px-5 text-sm' : 'h-9 px-4 text-[13px]',
        variants[variant],
        className,
      )}
      {...rest}
    >
      {loading && <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true" />}
      {children}
    </button>
  )
}

/** A router link styled as a Button (avoids nesting a button inside a link). */
export function ButtonLink({ to, variant = 'primary', className, children }: { to: string; variant?: Variant; className?: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className={cn(
        'inline-flex h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 font-medium text-sm tracking-[0.02em] outline-none transition-all focus-visible:ring-[3px] focus-visible:ring-ring/50',
        variants[variant],
        className,
      )}
    >
      {children}
    </Link>
  )
}

export function Field({ label, hint, error, children }: { label: string; hint?: ReactNode; error?: string | null; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-medium text-muted-foreground text-xs uppercase tracking-[0.12em]">{label}</span>
      {children}
      {error ? <span className="text-[#ff9a9d] text-xs">{error}</span> : hint ? <span className="text-muted-foreground/70 text-xs">{hint}</span> : null}
    </label>
  )
}

export function Input({ className, invalid, ...rest }: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      className={cn(
        'h-12 w-full rounded-2xl bg-[#020604] px-4 text-base text-foreground outline-none ring-1 ring-white/10 transition-shadow placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-gradient-mint focus:shadow-[0_0_24px_rgba(127,227,168,0.25)]',
        invalid && 'ring-destructive/60',
        className,
      )}
      {...rest}
    />
  )
}

export function Badge({ tone = 'neutral', children }: { tone?: 'neutral' | 'mint' | 'warn' | 'danger'; children: ReactNode }) {
  const tones = {
    neutral: 'bg-white/5 text-muted-foreground ring-white/10',
    mint: 'bg-gradient-mint/10 text-gradient-mint ring-gradient-mint/30',
    warn: 'bg-amber-400/10 text-amber-200 ring-amber-300/30',
    danger: 'bg-destructive/10 text-[#ff9a9d] ring-destructive/30',
  }
  return <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium text-xs ring-1', tones[tone])}>{children}</span>
}

export function Stat({ label, value, sub, loading, accent }: { label: string; value: ReactNode; sub?: ReactNode; loading?: boolean; accent?: boolean }) {
  return (
    <Glass radius="rounded-3xl" className="w-full">
      <div className="relative flex flex-col gap-2 overflow-hidden p-4 sm:p-5 lg:p-6">
        {accent && <div className="pointer-events-none absolute -top-16 -right-10 size-40 rounded-full bg-gradient-mint/20 blur-3xl" />}
        <span className="truncate font-medium text-muted-foreground text-xs uppercase tracking-[0.12em]">{label}</span>
        {loading ? <span className="h-8 w-32 animate-pulse rounded-lg bg-white/10" /> : <span className="font-medium text-xl tracking-tight sm:text-2xl lg:text-[28px]">{value}</span>}
        {sub && <span className="truncate text-muted-foreground text-sm">{sub}</span>}
      </div>
    </Glass>
  )
}

export function EmptyState({ title, body, action, icon }: { title: string; body: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 border-dashed px-6 py-10 text-center">
      {icon && <div className="flex size-12 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">{icon}</div>}
      <p className="font-medium text-foreground">{title}</p>
      <p className="max-w-sm text-muted-foreground text-sm">{body}</p>
      {action}
    </div>
  )
}

export function PageHeader({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="font-medium text-3xl tracking-tight lg:text-[40px] lg:leading-[1.1]">{title}</h1>
        {body && <p className="max-w-xl text-muted-foreground text-sm lg:text-base">{body}</p>}
      </div>
      {action}
    </div>
  )
}
