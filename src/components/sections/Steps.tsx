import { Fragment, useEffect, useState, type ComponentType } from 'react'
import { ActivateArt, CoinArt, ConnectArt } from '@/components/art/StepArt'
import { DotField } from '@/components/ui/dot-field'
import { Glass } from '@/components/ui/glass'
import { steps } from '@/data/content'
import { cn } from '@/lib/utils'

const STEP_MS = 5000
const arts: ComponentType<{ mode: 'color' | 'wire'; className?: string }>[] = [ConnectArt, CoinArt, ActivateArt]
const GLOW = 'radial-gradient(circle at 50% 50%, var(--glow-1), var(--glow-2), var(--glow-3))'

export function Steps() {
  const [active, setActive] = useState(0)
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = window.setTimeout(() => setActive((a) => (a + 1) % steps.items.length), STEP_MS)
    return () => window.clearTimeout(t)
  }, [active, cycle])

  const select = (i: number) => {
    setActive(i)
    setCycle((c) => c + 1)
  }

  return (
    <section className="cv-auto relative overflow-x-hidden py-8 lg:py-[60px]">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-16">
        <div className="flex flex-col gap-10 lg:gap-12">
          <h2 className="font-medium text-3xl leading-tight tracking-tight lg:text-4xl lg:leading-12">{steps.title}</h2>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2" role="tablist" aria-label="Steps">
              {steps.items.map((s, i) => (
                <Fragment key={s.label}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={i === active}
                    onClick={() => select(i)}
                    className="relative cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    {i === active ? (
                      <div className="rounded-full bg-white px-4 py-2 transition-all duration-300">
                        <p className="font-medium text-black text-sm transition-colors duration-300">{s.label}</p>
                      </div>
                    ) : (
                      <Glass className="rounded-full px-4 py-2 transition-all duration-300">
                        <p className="font-medium text-muted-foreground text-sm transition-colors duration-300">{s.label}</p>
                      </Glass>
                    )}
                  </button>
                  {i < steps.items.length - 1 && (
                    <div className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-muted/30">
                      {i === active ? (
                        <div key={`${active}-${cycle}`} className="progress-bar-animate absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-gradient-mint to-gradient-emerald" />
                      ) : (
                        <div className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-gradient-mint to-gradient-emerald" style={{ width: i < active ? '100%' : '0%' }} />
                      )}
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
            <div className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-x-visible">
              {steps.items.map((s, i) => {
                const on = i === active
                const Art = arts[i]
                return (
                  <div key={s.label} className="w-full shrink-0 snap-center lg:w-auto">
                    <button
                      type="button"
                      onClick={() => select(i)}
                      className="relative flex w-full cursor-pointer flex-col gap-6 text-left transition-transform duration-300 active:scale-[0.98] lg:gap-8"
                    >
                      <Glass radius="rounded-3xl" className="flex items-center justify-center p-14">
                        <div
                          className="rm-no-filter pointer-events-none absolute inset-0 top-[95%] left-1/2 -z-1 h-[160px] w-[380px] -translate-x-1/2 scale-95 rounded-full transition-opacity duration-500 lg:h-[150px] lg:w-[450px]"
                          style={{ background: GLOW, filter: 'blur(24px)', opacity: on ? 1 : 0 }}
                        />
                        {on && (
                          <div
                            className="absolute top-1/2 left-1/2 -z-1 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2"
                            style={{ WebkitMaskImage: 'linear-gradient(to top, var(--card) 5%, transparent 95%)', maskImage: 'linear-gradient(to top, var(--card) 5%, transparent 95%)' }}
                          >
                            <DotField width={500} height={300} className="pointer-events-none" />
                          </div>
                        )}
                        <div className="relative rounded-4xl transition-all duration-500" style={{ boxShadow: on ? '0 0 48px 16px #5fe39a20' : 'none' }}>
                          <div className="absolute top-2 right-2 -z-1 size-18 rounded-xl bg-linear-to-tl from-white to-gradient-mint blur-md transition-opacity duration-500" style={{ opacity: on ? 0.5 : 0 }} />
                          <div className="absolute bottom-2 left-2 -z-1 size-18 rounded-xl bg-linear-to-tl from-white to-gradient-mint blur-md transition-opacity duration-500" style={{ opacity: on ? 0.5 : 0 }} />
                          <Art mode="color" className={cn('pointer-events-none relative select-none transition-opacity duration-500', on ? 'opacity-100' : 'opacity-0')} />
                          <Art mode="wire" className={cn('pointer-events-none absolute inset-0 select-none text-white/70 transition-opacity duration-500', on ? 'opacity-0' : 'opacity-30')} />
                          <div
                            aria-hidden="true"
                            className={cn('pointer-events-none absolute inset-0 -left-1 -z-10 scale-[1.55] rounded-2xl transition-opacity duration-500 lg:rounded-xl', on ? 'opacity-100' : 'opacity-0')}
                            style={{ background: 'radial-gradient(60% 55% at 50% 50%, rgba(127,227,168,0.35), rgba(31,122,77,0.18) 55%, transparent 75%)' }}
                          />
                        </div>
                      </Glass>
                      <div className="flex flex-col gap-3 lg:gap-4">
                        <h3 className="font-medium text-lg leading-tight tracking-tight transition-colors duration-300 lg:text-xl" style={{ color: on ? 'white' : 'var(--muted-foreground)' }}>
                          {s.title}
                        </h3>
                        <p className="text-muted-foreground text-sm lg:text-base">{s.body}</p>
                      </div>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
