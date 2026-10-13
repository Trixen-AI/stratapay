import { Logo } from '@/components/brand/Logo'
import { PillLink } from '@/components/ui/button'
import { footer } from '@/data/content'

export function Footer() {
  return (
    <footer className="py-12 lg:py-16">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-16">
        <div className="flex flex-col gap-10 lg:gap-12">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-start lg:gap-6">
            <a href="#top" aria-label="StrataPay home" className="text-foreground">
              <Logo className="h-auto w-[120px]" />
            </a>
            <div className="flex w-full flex-col gap-6 lg:w-auto lg:flex-row lg:items-start lg:gap-12">
              <nav aria-label="Footer navigation" className="flex flex-col items-start gap-3">
                {footer.links.map((l) => (
                  <a key={l.label} className="text-muted-foreground text-sm leading-6 transition-colors hover:text-foreground" href={l.href}>
                    {l.label}
                  </a>
                ))}
              </nav>
              <PillLink href="/app" variant="ghost" wrapClassName="w-fit">
                Get StrataPay
              </PillLink>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <p className="font-normal text-muted-foreground/50 text-xs leading-5">{footer.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
