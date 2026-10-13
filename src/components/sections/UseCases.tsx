import { useEffect, useState, type ComponentType } from 'react'
import { IconBrush, IconServer, IconShirtFilled, IconSpeakerphone, IconToolsKitchen2, IconUsers, type IconProps } from '@tabler/icons-react'
import { Logo } from '@/components/brand/Logo'
import { UseCaseScene } from '@/components/art/UseCaseScene'
import { Glass } from '@/components/ui/glass'
import { useCases } from '@/data/content'
import { cn } from '@/lib/utils'

const TAB_MS = 5000
const icons: Record<string, ComponentType<IconProps>> = {
  team: IconUsers,
  art: IconBrush,
  servers: IconServer,
  ads: IconSpeakerphone,
  merch: IconShirtFilled,
  you: IconToolsKitchen2,
}

function Scenes({ active }: { active: number }) {
  return (
    <>
      {useCases.tabs.map((t, i) => (
        <div key={t.key} className={cn('absolute inset-0 transition-opacity duration-700', i === active ? 'opacity-100' : 'opacity-0')}>
          <UseCaseScene k={t.key} />
        </div>
      ))}
    </>
  )
}

export function UseCases() {
  const [active, setActive] = useState(0)
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = window.setTimeout(() => setActive((a) => (a + 1) % useCases.tabs.length), TAB_MS)
    return () => window.clearTimeout(t)
  }, [active, cycle])

  const tab = useCases.tabs[active]
  const PillIcon = icons[tab.key]

  return (
    <section className="cv-auto py-8 lg:py-[60px]">
      <div className="mx-auto max-w-[1440px] px-3 lg:px-16">
        <div className="relative min-h-[600px] overflow-hidden rounded-[32px] lg:min-h-[640px] lg:rounded-[48px]">
          <div className="absolute inset-0" aria-hidden="true">
            <Scenes active={active} />
          </div>
          <div className="rm-no-backdrop absolute inset-0 bg-linear-to-r from-black/70 to-black/10 backdrop-blur-[20px]" />
          <div className="relative flex min-h-[600px] flex-col gap-6 px-5 py-8 lg:min-h-[640px] lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-20 lg:py-20">
            <div className="flex flex-1 flex-col gap-6 lg:gap-16">
              <div className="flex flex-col gap-4 lg:gap-6">
                <h2 className="max-w-[530px] font-medium text-3xl leading-tight tracking-tight lg:text-6xl lg:leading-[1.02]">{useCases.title}</h2>
                <p className="max-w-[530px] font-normal text-sm text-white/70 leading-5 lg:text-lg lg:leading-6">{useCases.body}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3" role="tablist" aria-label="Use cases">
                {useCases.tabs.map((t, i) => {
                  const on = i === active
                  const Icon = icons[t.key]
                  return (
                    <button
                      key={t.key}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      className="relative"
                      onClick={() => {
                        setActive(i)
                        setCycle((c) => c + 1)
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className={cn('absolute inset-0 z-0 rounded-full transition-all duration-500 ease-in-out', on && 'animate-conic-gradient')}
                        style={{
                          margin: '-3px -6px',
                          opacity: on ? 1 : 0,
                          backgroundImage: on
                            ? 'conic-gradient(from var(--gradient-angle, 0deg), #6cf0a800 0%, #6cf0a800 0%, #6cf0a833, #6cf0a8), radial-gradient(circle at 50% 50%, transparent 55%, #ffffff20 100%)'
                            : undefined,
                          mixBlendMode: 'lighten',
                        }}
                      />
                      <span aria-hidden="true" className="absolute inset-0 z-5 rounded-full" style={{ backgroundColor: on ? 'rgba(0,0,0,0.5)' : undefined }} />
                      <span className="relative z-10 flex">
                        <Glass
                          className={cn('flex flex-row items-center gap-1 border-none px-3 py-2 transition-all duration-500 ease-in-out lg:gap-2.5 lg:px-6 lg:py-4', on && 'scale-105')}
                          tint="#ffffff10"
                          borderColor="#ffffff10"
                        >
                          <span className={cn('flex gap-4 font-medium text-xs leading-4 transition-all duration-500 ease-in-out lg:text-lg lg:leading-6', on ? 'text-white' : 'text-white/50')}>
                            <Icon className={cn('size-4 transition-all duration-500 ease-in-out lg:size-6', on ? 'scale-110 text-white' : 'scale-100 text-white/50')} stroke={2} />
                            {t.label}
                          </span>
                        </Glass>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="relative flex flex-1 flex-col items-center justify-center gap-4 lg:items-center">
              <div className="absolute top-[91%] z-2">
                <Glass className="rm-no-backdrop px-3 py-2 shadow-[0px_8px_40px_0px_rgba(0,40,20,0.30)] backdrop-blur-xl lg:w-72 lg:px-6 lg:py-4" tint="#ffffff60" borderColor="#ffffff50">
                  <div className="flex flex-row items-center justify-between gap-4" aria-live="polite">
                    <div className="flex items-center gap-1 lg:gap-2">
                      <PillIcon className="size-4 lg:size-6" stroke={2} />
                      <span className="text-nowrap font-medium text-xs leading-4 lg:text-lg lg:leading-6">{tab.item}</span>
                    </div>
                    <div className="flex items-center gap-0.5 lg:gap-1">
                      <span className="font-medium text-xs leading-4 lg:text-lg lg:leading-6">{tab.amount}</span>
                      <span className="font-medium text-white/50 text-xs leading-4 lg:text-lg lg:leading-6">USD</span>
                    </div>
                  </div>
                </Glass>
              </div>
              <div className="relative h-48 w-72 overflow-hidden rounded-[20px] shadow-[inset_0px_1px_2px_0px_rgba(255,255,255,1)] lg:h-80 lg:w-[480px] lg:rounded-[32px]">
                <Scenes active={active} />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/60 to-black/0" />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ boxShadow: 'inset -20px -20px 70px 0px rgba(0,150,80,0.9), inset 10px 10px 40px 0px rgba(108,240,168,0.6), inset 0px 0px 50px 0px rgba(255,255,255,0.8)' }}
                />
                <div className="absolute top-4 left-4 lg:top-6 lg:left-6">
                  <Logo className="h-5 w-auto text-white lg:h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
