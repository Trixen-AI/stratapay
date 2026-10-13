import { BrandLogo } from '@/components/brand/BrandLogos'
import { Glass } from '@/components/ui/glass'
import { socials, socialsSection } from '@/data/content'

export function Socials() {
  return (
    <section className="cv-auto relative overflow-hidden py-20 lg:py-32">
      <div className="pointer-events-none absolute top-1/2 left-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-jade/10 blur-[100px]" />
      <div className="mx-auto max-w-[1440px] px-4 lg:px-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="flex flex-col gap-4 lg:max-w-md">
            <span className="w-fit rounded-full bg-white/5 px-4 py-1.5 font-medium text-sm text-white/80 ring-1 ring-white/10 backdrop-blur-md">{socialsSection.chip}</span>
            <h2 className="font-medium text-4xl leading-tight tracking-tighter drop-shadow-sm lg:text-[56px] lg:leading-[1.05]">{socialsSection.title}</h2>
          </div>
          <p className="max-w-md text-sm text-white/60 leading-6 lg:pt-12 lg:text-lg lg:leading-7">{socialsSection.body}</p>
        </div>
        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-3 lg:gap-8">
          {socials.map((s) => (
            <Glass key={s.platform} radius="rounded-2xl lg:rounded-3xl" className="group flex h-full flex-col p-[1px]">
              <div className="relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-[calc(1rem-1px)] bg-background/40 p-6 lg:rounded-[calc(1.5rem-1px)] lg:p-8">
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-gradient-emerald/40 via-gradient-jade/20 to-transparent" />
                <div className="absolute -top-20 -right-20 size-40 rounded-full bg-gradient-emerald/20 blur-3xl transition-opacity duration-500 group-hover:opacity-60" />
                <div className="relative z-10 flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 backdrop-blur-md">
                    <BrandLogo brand={s.platform} className="size-6" />
                  </div>
                  <span className="font-medium text-foreground text-lg lg:text-xl">{s.label}</span>
                </div>
                <a
                  className="relative z-10 inline-flex h-12 w-fit items-center justify-center rounded-xl bg-white/5 px-6 font-medium text-foreground text-sm ring-1 ring-white/10 transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:ring-white/20"
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.action}
                </a>
              </div>
            </Glass>
          ))}
        </div>
      </div>
    </section>
  )
}
