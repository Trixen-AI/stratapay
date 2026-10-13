import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ScrollArea } from '@base-ui/react/scroll-area'
import { IconArrowsExchange, IconWorld } from '@tabler/icons-react'
import { BrandLogo } from '@/components/brand/BrandLogos'
import { LogoMark } from '@/components/brand/Logo'
import { Glass } from '@/components/ui/glass'
import { DotField } from '@/components/ui/dot-field'
import { features } from '@/data/content'

const GLOW = 'radial-gradient(circle at 50% 50%, var(--glow-1), var(--glow-2), var(--glow-3))'

function IconBubble({ children }: { children: ReactNode }) {
  return (
    <Glass className="flex w-fit rounded-full p-2.5 lg:p-3">
      <span className="flex size-4 items-center justify-center lg:size-5">{children}</span>
    </Glass>
  )
}

function ShieldIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 lg:size-5" fill="none">
      <path d="M12 2.5 4.5 5.4v5.8c0 4.6 3.1 8.6 7.5 10.3 4.4-1.7 7.5-5.7 7.5-10.3V5.4L12 2.5Z" fill="currentColor" />
      <path d="m8.6 12.1 2.4 2.4 4.6-4.8" stroke="#030806" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ---------- artwork, one per card ---------- */

function FeeFeedArt() {
  const rows = [
    ['+1.84 SOL', 'Creator fee', 'now'],
    ['+0.62 SOL', 'Creator fee', '4m'],
    ['+2.10 SOL', 'Creator fee', '11m'],
  ]
  return (
    <div className="relative flex h-[380px] items-end">
      <div className="absolute inset-0 -bottom-350 left-1/2 -z-1 w-[240px] -translate-x-1/2 scale-95 bg-linear-to-l from-[#0b2418] to-[#b6f0c8] blur-2xl lg:w-[280px]" />
      {/* phone frame, cropped by the card bottom */}
      <div className="relative h-[284px] w-[296px] overflow-hidden rounded-t-[44px] border-[6px] border-b-0 border-[#d9e3dd] bg-[#f3f7f4] px-4 pt-5 shadow-[0_0_0_2px_#7c8a83] lg:w-[300px]">
        <div className="flex items-center justify-between px-2 font-semibold text-[#0b1510] text-[13px]">
          <span>9:41</span>
          <span className="h-[18px] w-[70px] rounded-full bg-[#0b1510]" />
          <span className="flex gap-1">
            <i className="block h-2.5 w-1 rounded-sm bg-[#0b1510]" />
            <i className="block h-2.5 w-1 rounded-sm bg-[#0b1510]" />
            <i className="block h-2.5 w-4 rounded-sm bg-[#0b1510]" />
          </span>
        </div>
        <div className="mt-4 flex items-center gap-2.5 rounded-2xl bg-linear-to-br from-[#8ff0b6] to-[#157a4a] p-3 text-white">
          <LogoMark className="h-6 w-auto" color="#ffffff" />
          <div className="leading-tight">
            <p className="font-medium text-[11px] opacity-80">Card balance</p>
            <p className="font-semibold text-lg">$3,482.17</p>
          </div>
        </div>
        <ul className="mt-3 flex flex-col gap-2">
          {rows.map(([amt, label, t], i) => (
            <li key={i} className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.08)]" style={{ opacity: 1 - i * 0.18 }}>
              <BrandLogo brand="pumpfun" className="size-6" decorative />
              <div className="flex-1 leading-tight">
                <p className="font-semibold text-[#0b1510] text-xs">{label}</p>
                <p className="text-[#5d6b64] text-[10px]">Swept to card</p>
              </div>
              <div className="text-right leading-tight">
                <p className="font-semibold text-[#157a4a] text-xs">{amt}</p>
                <p className="text-[#5d6b64] text-[10px]">{t}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function SpendArt() {
  const rows = [
    { name: 'Domain renewal', amt: '- $18.00', glyph: 'www' },
    { name: 'Studio coffee', amt: '- $6.40', glyph: 'cup' },
  ]
  const Glyph = ({ g }: { g: string }) =>
    g === 'www' ? (
      <IconWorld className="size-5 text-white" stroke={2} />
    ) : (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
        <path d="M5 8h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V8Z" fill="#fff" />
        <path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16" stroke="#fff" strokeWidth="1.8" />
        <path d="M8 3.5c0 1 1 1 1 2M11.5 3.5c0 1 1 1 1 2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  return (
    <div className="relative h-[380px] w-[320px] overflow-hidden rounded-[40px] lg:w-[400px] lg:rounded-[50px]">
      <div className="rm-no-filter pointer-events-none absolute inset-0 top-[70%] left-1/2 -z-1 h-[160px] w-[320px] -translate-x-1/2 scale-95 rounded-full lg:h-[200px] lg:w-[400px]" style={{ background: GLOW, filter: 'blur(20px)' }} />
      <div
        className="pointer-events-none absolute inset-0 top-[70%] -z-1 h-[100px]"
        style={{ WebkitMaskImage: 'radial-gradient(circle at 50% 60%, #000 60%, transparent 100%)', maskImage: 'radial-gradient(circle at 50% 60%, #000 60%, transparent 100%)' }}
      >
        <div className="h-full w-full opacity-40">
          <DotField width={398} height={100} className="pointer-events-none" />
        </div>
      </div>
      <div className="rm-no-filter pointer-events-none absolute inset-0 top-[20%] left-1/2 -z-1 h-[80px] w-[160px] -translate-x-1/2 scale-95 rounded-full lg:h-[100px] lg:w-[200px]" style={{ background: GLOW, filter: 'blur(20px)' }} />
      <div
        className="pointer-events-none absolute inset-0 top-[20%] left-1/2 -z-1 h-[40px] w-[80px] -translate-x-1/2 rounded-full lg:h-[50px] lg:w-[100px]"
        style={{ WebkitMaskImage: 'radial-gradient(circle at 50% 60%, #000 60%, transparent 100%)', maskImage: 'radial-gradient(circle at 50% 60%, #000 60%, transparent 100%)' }}
      >
        <div className="h-full w-full opacity-40">
          <DotField width={100} height={50} className="pointer-events-none" />
        </div>
      </div>
      <div className="absolute inset-x-0 top-[72px] flex flex-col items-center gap-2 px-6 lg:px-11">
        {rows.map((r) => (
          <div key={r.name} className="flex w-full items-center gap-3 rounded-2xl border-[3px] border-white/80 bg-white px-1.5 py-1.5 shadow-[0_0_24px_rgba(182,240,200,0.35)]">
            <span className="relative flex size-11 items-center justify-center rounded-xl bg-[#05110b]">
              <Glyph g={r.glyph} />
              <span className="absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full bg-[#7fe3a8] ring-2 ring-white">
                <LogoMark className="h-2.5 w-auto" color="#05110b" />
              </span>
            </span>
            <span className="flex-1 font-semibold text-[#0b1510] text-sm">{r.name}</span>
            <span className="pr-3 font-semibold text-[#0b1510] text-sm">{r.amt}</span>
          </div>
        ))}
        <div className="-mt-3 flex w-[92%] items-center gap-3 rounded-2xl bg-white/30 px-3 py-3 opacity-60 blur-[1px]">
          <span className="size-7 rounded-lg bg-black/40" />
          <span className="flex-1 font-semibold text-[#0b1510]/70 text-xs">Ad credits</span>
          <span className="font-semibold text-[#0b1510]/70 text-xs">- $40.00</span>
        </div>
      </div>
    </div>
  )
}

function ShareArt() {
  return (
    <div className="relative h-[220px] lg:h-[284px]">
      <div className="rm-no-filter pointer-events-none absolute inset-0 top-1/2 left-1/2 -z-1 h-[80px] w-[320px] -translate-x-1/2 -translate-y-[calc(50%-38px)] rotate-12 scale-75 rounded-full lg:h-[100px] lg:w-[400px]" style={{ background: GLOW, filter: 'blur(20px)' }} />
      <div className="flex translate-y-6 flex-col items-center gap-4 lg:translate-y-8">
        <p className="font-medium text-lg lg:text-xl">Amount to send</p>
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/15">−</span>
          <div className="flex h-[82px] w-[264px] items-center justify-center rounded-[22px] bg-[#020604] ring-2 ring-[#7fe3a8] shadow-[0_0_28px_rgba(127,227,168,0.55),inset_0_0_14px_rgba(127,227,168,0.25)]">
            <span className="font-normal text-[40px] tracking-tight">2,500</span>
            <span className="caret-blink mx-0.5 h-10 w-[3px] rounded bg-[#7fe3a8]" />
            <span className="font-normal text-[40px] text-white/50 tracking-tight">USD</span>
          </div>
          <span className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/15">+</span>
        </div>
        <p className="font-medium text-white/50 text-sm">to @mod_lena</p>
      </div>
    </div>
  )
}

function KeysArt() {
  return (
    <div className="relative h-[260px] lg:h-[340px]">
      <div className="rm-no-filter pointer-events-none absolute inset-0 top-1/2 left-1/2 -z-1 h-[160px] w-[320px] -translate-x-1/2 -translate-y-1/2 rotate-12 scale-75 rounded-full lg:h-[200px] lg:w-[400px]" style={{ background: GLOW, filter: 'blur(20px)' }} />
      <svg viewBox="0 0 400 284" className="h-auto w-[320px] -translate-y-6 lg:w-[400px] lg:-translate-y-10" aria-hidden="true">
        <defs>
          <linearGradient id="keys-shield" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e9fff1" />
            <stop offset="1" stopColor="#3fae78" />
          </linearGradient>
          <linearGradient id="keys-rim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="#ffffff" strokeOpacity="0.12">
          <circle cx="200" cy="150" r="96" />
          <circle cx="200" cy="150" r="128" />
        </g>
        <path d="M200 52 132 78v52c0 42 28 78 68 94 40-16 68-52 68-94V78l-68-26Z" fill="url(#keys-shield)" stroke="url(#keys-rim)" strokeWidth="3" />
        <rect x="174" y="128" width="52" height="42" rx="9" fill="#05110b" />
        <path d="M184 128v-10a16 16 0 0 1 32 0v10" fill="none" stroke="#05110b" strokeWidth="8" strokeLinecap="round" />
        <circle cx="200" cy="146" r="5" fill="#7fe3a8" />
        <rect x="198" y="149" width="4" height="10" rx="2" fill="#7fe3a8" />
      </svg>
    </div>
  )
}

const art: Record<string, () => ReactNode> = {
  linked: FeeFeedArt,
  spend: SpendArt,
  share: ShareArt,
  keys: KeysArt,
}

const icons: Record<string, ReactNode> = {
  spend: <IconWorld className="size-4 lg:size-5" stroke={2} />,
  share: <IconArrowsExchange className="size-4 lg:size-5" stroke={2} />,
  keys: <ShieldIcon />,
}

/* ---------- carousel ---------- */

function useDragScroll(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let down = false
    let startX = 0
    let startLeft = 0
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      down = true
      startX = e.clientX
      startLeft = el.scrollLeft
      el.style.cursor = 'grabbing'
    }
    const onMove = (e: PointerEvent) => {
      if (!down) return
      el.scrollLeft = startLeft - (e.clientX - startX)
    }
    const onUp = () => {
      down = false
      el.style.cursor = ''
    }
    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [ref])
}

export function Features() {
  const viewport = useRef<HTMLDivElement>(null)
  const [fade, setFade] = useState({ left: 0, right: 1 })
  useDragScroll(viewport)

  const onScroll = () => {
    const el = viewport.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setFade({ left: el.scrollLeft > 2 ? 1 : 0, right: el.scrollLeft < max - 2 ? 1 : 0 })
  }
  useEffect(onScroll, [])

  return (
    <section className="cv-auto py-8 lg:py-[60px]" id="features">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-16">
        <ScrollArea.Root className="relative w-full overflow-hidden">
          <ScrollArea.Viewport
            ref={viewport}
            onScroll={onScroll}
            className="hide-scrollbar size-full cursor-grab overscroll-x-contain rounded-[inherit] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <ScrollArea.Content style={{ minWidth: 'fit-content' }}>
              <div className="flex items-center gap-3 pb-4 lg:gap-4">
                {features.map((f) => {
                  const Art = art[f.key]
                  return (
                    <Glass key={f.key} radius="rounded-3xl lg:rounded-[3rem]" className="h-[480px] w-[320px] shrink-0 lg:h-[580px] lg:w-[400px]">
                      <div className="flex flex-col items-start gap-2 p-4 lg:gap-3 lg:p-6">
                        <div className="flex items-center gap-3">
                          {f.key === 'linked' ? (
                            <>
                              <IconBubble>
                                <BrandLogo brand="pumpfun" className="size-4 lg:size-5" />
                              </IconBubble>
                              <IconBubble>
                                <BrandLogo brand="solana" className="size-4 lg:size-5" />
                              </IconBubble>
                            </>
                          ) : (
                            <IconBubble>{icons[f.key]}</IconBubble>
                          )}
                        </div>
                        <h3 className="font-medium text-base text-foreground leading-[140%] lg:text-xl">{f.title}</h3>
                        <p className="font-medium text-base text-muted-foreground leading-[140%] opacity-70 lg:text-xl">{f.body}</p>
                      </div>
                      <div className="pointer-events-none flex w-full select-none justify-center">
                        <Art />
                      </div>
                    </Glass>
                  )
                })}
              </div>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-background to-transparent transition-opacity duration-300 lg:w-20" style={{ opacity: fade.left }} />
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-background to-transparent transition-opacity duration-300 lg:w-20" style={{ opacity: fade.right }} />
          <ScrollArea.Scrollbar orientation="horizontal" className="flex h-2.5 touch-none select-none flex-col border-t border-t-transparent p-px opacity-0 transition-opacity delay-300 duration-150 data-hovering:opacity-100 data-hovering:delay-0 data-scrolling:opacity-100 data-scrolling:delay-0">
            <ScrollArea.Thumb className="relative z-20 flex-1 rounded-full bg-border" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </div>
    </section>
  )
}
