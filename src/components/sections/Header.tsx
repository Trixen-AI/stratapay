import { useState } from 'react'
import { IconX } from '@tabler/icons-react'
import { Logo } from '@/components/brand/Logo'
import { Glass } from '@/components/ui/glass'
import { PillLink } from '@/components/ui/button'
import { nav } from '@/data/content'
import { cn } from '@/lib/utils'

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 mx-auto w-full bg-linear-to-b from-background to-transparent">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 lg:flex lg:px-16 lg:py-5">
        <div className="flex flex-1 items-center">
          <a aria-label="StrataPay home" href="#top" className="text-foreground">
            <Logo className="h-auto w-[140px]" />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Glass className="hidden h-fit w-fit items-center justify-center py-2 lg:flex" borderColor="#ffffff20" blur={4}>
            <nav aria-label="Main" className="flex items-center justify-center">
              {nav.map((item, i) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'flex h-10 items-center justify-center px-2.5 text-center font-medium text-foreground text-sm leading-4.5 tracking-[0.02em] opacity-70 transition-opacity hover:opacity-90',
                    i === 0 && 'pl-5.5',
                    i === nav.length - 1 && 'pr-5.5',
                  )}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </Glass>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2">
          <div className="hidden items-center justify-end gap-2 lg:flex">
            <PillLink href="/app">Get StrataPay</PillLink>
          </div>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-10 items-center justify-center rounded-full border border-input bg-input/30 text-sm shadow-xs transition-all hover:bg-input/50 lg:hidden"
          >
            {open ? (
              <IconX className="size-5" />
            ) : (
              <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 20 20">
                <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {open && (
        <div className="mx-4 rounded-3xl border border-border bg-card/95 p-4 backdrop-blur-xl lg:hidden">
          <nav aria-label="Mobile" className="flex flex-col">
            {nav.map((item) => (
              <a key={item.label} href={item.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 font-medium text-base text-foreground/80 hover:bg-white/5">
                {item.label}
              </a>
            ))}
          </nav>
          <PillLink href="/app" wrapClassName="mt-3 w-full" className="w-full" onClick={() => setOpen(false)}>
            Get StrataPay
          </PillLink>
        </div>
      )}
    </header>
  )
}
