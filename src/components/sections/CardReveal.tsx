import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { IconUsersPlus } from '@tabler/icons-react'
import { BrandLogo } from '@/components/brand/BrandLogos'
import { CardArt } from '@/components/art/CardArt'
import { Glass } from '@/components/ui/glass'
import { PillLink } from '@/components/ui/button'
import { reveal } from '@/data/content'
import { useMediaQuery } from '@/hooks/useMediaQuery'

// Scroll choreography, sampled from the reference and expressed as progress keyframes
// (progress 0 = section top at viewport top, 1 = section bottom at viewport top).
const P = {
  rotX: { at: [0, 0.084, 0.173, 0.262, 0.9], v: [28, 28, 7.5, 4.3, 48] },
  rotY: { at: [0, 0.9], v: [0, 12] },
  rotZ: { at: [0, 0.5], v: [0, -12] },
  mainY: { at: [0, 0.084, 0.173, 0.262, 0.9], v: [0, 0, -36.7, -54.4, -99.5] },
  mainS: { at: [0, 0.084, 0.173, 0.262], v: [1, 1, 1.073, 1.1] },
  grayY: { at: [0, 0.02, 0.084, 0.173, 0.262, 0.9], v: [71, 71, 34, 10, -3.4, -99.5] },
  grayS: { at: [0, 0.084, 0.173, 0.262, 0.9], v: [1, 1, 0.633, 0.553, 1.1] },
  words: { from: 0.262, to: 0.484 },
  chipsAt: 0.38,
}

function useKeyframes(p: MotionValue<number>, k: { at: number[]; v: number[] }, amp = 1) {
  return useTransform(p, k.at, k.v.map((n) => n * amp))
}

/** Scroll-linked pop: chip i grows from 0 to 1 just after the chips threshold, a little after the previous one. */
function useChipScale(p: MotionValue<number>, i: number) {
  const start = P.chipsAt + i * 0.012
  const raw = useTransform(p, [start, start + 0.03], [0, 1])
  return useSpring(raw, { stiffness: 260, damping: 20 })
}

function Chip({ p, index, className, floatClass, icon, label }: { p: MotionValue<number>; index: number; className: string; floatClass: string; icon: React.ReactNode; label: string }) {
  const scale = useChipScale(p, index)
  return (
    <motion.div
      className={`absolute z-4 ${className}`}
      style={{ scale }}
    >
      <div className={floatClass}>
        <Glass
          className="rounded-full border-t-1 border-r-0 border-b-1 border-l-0 px-3 py-2 font-medium text-sm lg:px-5 lg:py-4 lg:text-base"
          tint="#00000060"
          borderColor="#ffffff30"
          blur={90}
        >
          <span className="flex items-center gap-2 font-[550] whitespace-nowrap">
            {icon}
            <span>{label}</span>
          </span>
        </Glass>
      </div>
    </motion.div>
  )
}

function Word({ p, i, n, children }: { p: MotionValue<number>; i: number; n: number; children: string }) {
  const span = (P.words.to - P.words.from) / n
  const start = P.words.from + span * i
  const color = useTransform(p, [start, start + span], ['rgba(255,255,255,0.4)', 'rgb(255,255,255)'])
  return (
    <motion.span className="inline-block" style={{ color }}>
      {children}
    </motion.span>
  )
}

export function CardReveal() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const isLg = useMediaQuery('(min-width: 1024px)')
  const amp = isLg ? 1 : 0.62

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const p = useTransform(scrollYProgress, (v) => (reduce ? 0.9 : v))

  const rotX = useKeyframes(p, P.rotX)
  const rotY = useKeyframes(p, P.rotY)
  const rotZ = useKeyframes(p, P.rotZ)
  const mainY = useKeyframes(p, P.mainY, amp)
  const mainS = useKeyframes(p, P.mainS)
  const grayY = useKeyframes(p, P.grayY, amp)
  const grayS = useKeyframes(p, P.grayS)

  const toTransform = (z: string) => ([yy, ss, rx, ry, rz]: number[]) =>
    `translateY(${yy}px) ${z}scale(${ss}) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`
  const mainTransform = useTransform([mainY, mainS, rotX, rotY, rotZ], toTransform(''))
  const grayTransform = useTransform([grayY, grayS, rotX, rotY, rotZ], toTransform('translateZ(-255px) '))

  // The scroll cue shows only at the very start of the stage, then shrinks away.
  const cueScale = useSpring(useTransform(p, [0, 0.05, 0.08], [1, 1, 0]), { stiffness: 300, damping: 24 })
  const cueY = useTransform(p, [0.05, 0.08], [0, 10])

  const lit = reveal.headlineLit
  const iconCls = 'size-4 lg:size-6'

  return (
    <div className="relative z-20 min-h-[calc(600px+100vh)] w-full">
      <section ref={sectionRef} className="br-section br-card-reveal" aria-labelledby="br-card-heading">
        <div className="sticky top-0 flex h-screen items-start justify-center overflow-hidden">
          <div className="br-container mx-auto flex w-full max-w-[1440px] flex-col items-center justify-start px-4 pt-52 lg:px-16">
            <div className="br-stage relative isolate flex h-[320px] w-full items-center justify-center lg:h-[520px]" style={{ perspective: 1000, perspectiveOrigin: 'center center' }}>
              <motion.div className="absolute rounded-2xl will-change-transform lg:rounded-[34px]" style={{ transformStyle: 'preserve-3d', transform: grayTransform }}>
                <div className="relative flex h-[180px] w-[300px] items-center justify-center lg:h-[290px] lg:w-[520px]">
                  <div className="relative h-full drop-shadow-2xl" style={{ aspectRatio: '1630 / 1024' }}>
                    <div className="absolute inset-0 z-[-1] translate-y-[4px] brightness-[0.8]">
                      <CardArt variant="silver" last4="0815" />
                    </div>
                    <CardArt variant="silver" last4="0815" network="mastercard" title="StrataPay Starter card" />
                  </div>
                </div>
              </motion.div>
              <motion.div className="absolute rounded-2xl will-change-transform lg:rounded-[34px]" style={{ transformStyle: 'preserve-3d', transform: mainTransform }}>
                <div className="relative flex h-[180px] w-[320px] items-center justify-center lg:h-[290px] lg:w-[550px]">
                  <div className="relative h-full" style={{ aspectRatio: '1630 / 1024' }}>
                    <div className="absolute inset-0 z-[-1] translate-y-[4px] brightness-[0.5]">
                      <CardArt variant="mint" />
                    </div>
                    <CardArt variant="mint" network="visa" title="StrataPay Creator card" />
                    <svg aria-hidden="true" className="pointer-events-none absolute bottom-0 left-[14%] h-[2px] w-[80px] lg:w-[140px]" fill="none" viewBox="0 0 97 1">
                      <path d="M0 0.5H96.1322" opacity="0.8" stroke="url(#br-edge-shine)" strokeWidth="1.5" />
                      <defs>
                        <linearGradient gradientUnits="userSpaceOnUse" id="br-edge-shine" x1="-17.24" x2="96.13" y1="0.77" y2="0.77">
                          <stop offset="0.15" stopColor="white" stopOpacity="0" />
                          <stop offset="0.5" stopColor="white" />
                          <stop offset="1" stopColor="white" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </motion.div>

              <Chip
                p={p}
                index={0}
                floatClass="pill-float-1"
                className="top-0 -left-[2%] sm:left-[18%] md:left-[24%] lg:top-12 lg:left-[16%] xl:left-[22%]"
                label={reveal.chips[0]}
                icon={
                  <svg aria-hidden="true" viewBox="0 0 24 24" className={iconCls} fill="none">
                    <circle cx="12" cy="12" r="10" fill="currentColor" />
                    <path d="M12 6.5v8m0 0-3.2-3.2M12 14.5l3.2-3.2M8 17.5h8" stroke="#030806" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
              />
              <Chip
                p={p}
                index={1}
                floatClass="pill-float-2"
                className="-top-8 right-[2%] sm:right-[20%] md:right-[26%] lg:top-0 lg:right-[22%] xl:right-[28%]"
                label={reveal.chips[1]}
                icon={<BrandLogo brand="solana" className={iconCls} decorative />}
              />
              <Chip
                p={p}
                index={2}
                floatClass="pill-float-3"
                className="bottom-28 -left-[1%] sm:left-[20%] md:left-[28%] lg:bottom-[32%] lg:left-[16%] xl:left-[28%]"
                label={reveal.chips[2]}
                icon={<IconUsersPlus className={iconCls} stroke={2.2} />}
              />
              <Chip
                p={p}
                index={3}
                floatClass="pill-float-4"
                className="-right-[4%] bottom-38 sm:right-[22%] md:right-[28%] lg:right-[14%] lg:bottom-[44%] xl:right-[24%]"
                label={reveal.chips[3]}
                icon={
                  <svg aria-hidden="true" viewBox="0 0 24 24" className={iconCls} fill="none">
                    <rect x="3" y="5" width="18" height="14" rx="3" fill="currentColor" />
                    <path d="M12 8.6v6.8M9.05 10.3l5.9 3.4M14.95 10.3l-5.9 3.4" stroke="#030806" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                }
              />
            </div>

            {/* Mirrors the reference: this block stays at opacity 0 on screen while its words light up with scroll. */}
            <div className="br-cta-block relative -mt-12 flex w-full flex-col items-center justify-center gap-6 pb-8 opacity-0 lg:gap-8 lg:pb-[60px]">
              <div className="br-headline-wrap w-full max-w-[328px] text-center lg:max-w-[830px]">
                <h2 className="font-medium text-3xl leading-8 tracking-tight lg:text-[40px] lg:leading-[48px]" id="br-card-heading">
                  {lit.map((w, i) => (
                    <span key={w + i}>
                      <Word p={p} i={i} n={lit.length}>
                        {w}
                      </Word>{' '}
                    </span>
                  ))}
                  <span className="text-white/40">{reveal.headlineMuted}</span>
                </h2>
              </div>
              <PillLink href="/app/card" tabIndex={-1} className="px-4 font-[480] text-sm leading-4 lg:px-4.5 lg:text-base lg:leading-4.5">
                {reveal.cta}
              </PillLink>
            </div>
          </div>
          <motion.button
            type="button"
            aria-label="Scroll down"
            className="absolute bottom-[30%] left-1/2 -ml-6 cursor-pointer rounded-full"
            style={{ scale: cueScale, y: cueY }}
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Glass className="flex items-center justify-center p-2 shadow-xl" tint="#ffffff60" borderColor="#ffffff90" blur={18}>
              <span className="flex w-full items-center justify-center">
                <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" className="size-8 text-white">
                  <path d="M7.5 10 12 14.5 16.5 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Glass>
          </motion.button>
        </div>
      </section>
    </div>
  )
}
