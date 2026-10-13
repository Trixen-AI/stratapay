import { BrandLogo } from '@/components/brand/BrandLogos'
import { PillLink } from '@/components/ui/button'
import { hero } from '@/data/content'

/** Static backdrop behind the hero and the pinned card stage: mint glow column over a dot grain. */
export function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-0 -z-10 h-490 w-full select-none overflow-hidden lg:h-680"
      style={{
        WebkitMaskImage: 'linear-gradient(to bottom, var(--background) 60%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, var(--background) 60%, transparent 100%)',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: [
            'radial-gradient(38% 22% at 50% 44%, rgba(214,255,228,0.55) 0%, rgba(127,227,168,0.28) 40%, rgba(127,227,168,0) 100%)',
            'radial-gradient(70% 30% at 50% 40%, rgba(31,154,94,0.75) 0%, rgba(21,122,74,0.45) 45%, rgba(10,31,21,0) 100%)',
            'radial-gradient(120% 40% at 50% 34%, rgba(21,122,74,0.6) 0%, rgba(10,31,21,0.4) 55%, rgba(3,8,6,0) 100%)',
            'linear-gradient(to bottom, #030806 0%, #071a10 12%, #0d3a24 26%, #0e4a2d 40%, #0a2d1c 62%, #030806 100%)',
          ].join(', '),
        }}
      />
      <div className="dot-texture absolute inset-0 opacity-60 mix-blend-overlay" />
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative z-50 pt-32 pb-14 lg:pt-38 lg:pb-[120px]" id="top">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-16">
        <div className="flex flex-col items-center gap-6 lg:gap-8">
          <div className="flex items-center gap-2">
            <div
              className="rm-no-backdrop flex items-center justify-center rounded-full border border-foreground/10 border-t-0 border-r border-b-0 border-l p-1.5 [-webkit-backdrop-filter:blur(12px)_brightness(1.1)] [backdrop-filter:blur(12px)_brightness(1.1)]"
              style={{ background: 'linear-gradient(to bottom, var(--card) 0%, rgba(255,255,255,0) 100%)' }}
            >
              <BrandLogo brand="pumpfun" className="size-3" decorative />
            </div>
            <p className="font-medium text-muted-foreground text-xs leading-4 tracking-[0.02em] lg:text-sm lg:leading-4.5">{hero.badge}</p>
          </div>
          <h1 className="max-w-xs text-center font-medium text-[40px] leading-tight tracking-tighter lg:max-w-2xl lg:text-7xl lg:leading-20">{hero.title}</h1>
          <p className="max-w-[280px] text-center font-normal text-muted-foreground text-sm leading-5 tracking-[0.02em] lg:max-w-md lg:text-base lg:leading-6">{hero.body}</p>
          <PillLink href="/app" className="px-4 font-[480] text-sm leading-4 lg:px-4.5 lg:text-base lg:leading-4.5">
            {hero.cta}
          </PillLink>
        </div>
      </div>
    </section>
  )
}
