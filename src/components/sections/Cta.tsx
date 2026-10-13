import { CardArt } from '@/components/art/CardArt'
import { DotGlobe } from '@/components/art/DotGlobe'
import { PillLink } from '@/components/ui/button'
import { cta } from '@/data/content'

export function Cta() {
  return (
    <section className="cv-auto" id="get">
      <div className="relative mx-auto max-w-[1640px] px-4 pb-8 lg:px-16 lg:pb-[60px]">
        <div className="relative flex h-[560px] flex-col items-center justify-center gap-6 overflow-hidden rounded-b-[32px] lg:h-[864px] lg:gap-8 lg:rounded-b-[48px]">
          {/* horizon wash: dark top, mint-to-emerald bands toward the bottom edge */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background: [
                'radial-gradient(120% 60% at 50% 112%, rgba(214,255,228,0.85) 0%, rgba(127,227,168,0.55) 18%, rgba(31,154,94,0.45) 38%, rgba(10,31,21,0) 70%)',
                'radial-gradient(60% 40% at 0% 100%, rgba(201,242,216,0.5), transparent 70%)',
                'radial-gradient(60% 40% at 100% 100%, rgba(201,242,216,0.5), transparent 70%)',
                '#0a120e',
              ].join(', '),
              WebkitMaskImage: 'linear-gradient(to top, #0a120e 0%, transparent 70%)',
              maskImage: 'linear-gradient(to top, #0a120e 0%, transparent 70%)',
            }}
          />
          <div aria-hidden="true" className="dot-texture pointer-events-none absolute inset-0 z-0 opacity-40 [mask-image:linear-gradient(to_top,black_10%,transparent_60%)]" />
          <DotGlobe
            size={1000}
            className="pointer-events-none absolute top-[90%] left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
            style={{ maskImage: 'linear-gradient(to top, black 20%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to top, black 20%, transparent 100%)' }}
          />
          <div className="relative z-10 mb-6 aspect-[1630/1024] w-full max-w-[170px] -rotate-12 scale-90 rounded-4xl transition-all duration-500" style={{ boxShadow: '0 0 58px 19px #5fe39a30' }}>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 scale-[1.1]">
              <div className="absolute inset-0 rounded-[14%] blur-[76px]" style={{ background: 'linear-gradient(177deg, rgba(30,180,110,0.12) 43%, rgba(30,180,110,0.12) 55%, rgb(30,180,110) 85%)' }} />
              <div
                className="absolute inset-0 rounded-[14%] blur-[32px]"
                style={{ background: 'linear-gradient(270deg, rgba(108,240,168,0.6) 1%, rgba(108,240,168,0) 27%, rgba(108,240,168,0) 69%, rgba(108,240,168,0.6) 100%)' }}
              />
              <div className="absolute inset-[3%] rounded-[12%] bg-gradient-to-t from-white via-white/0 to-white/0 opacity-80 mix-blend-plus-lighter blur-sm" />
              <div className="absolute inset-[3%] rounded-[12%] bg-gradient-to-t from-white via-white/0 to-white/0 opacity-70 mix-blend-plus-lighter blur-sm" />
            </div>
            <div className="pointer-events-none relative z-10 select-none">
              <CardArt variant="mint" network="visa" title="StrataPay Creator card" />
            </div>
          </div>
          <h2 className="z-10 max-w-xs text-center font-medium text-[32px] leading-[92%] tracking-tighter lg:text-[52px]">
            {cta.titleTop}
            <br />
            {cta.titleBottom}
          </h2>
          <p className="z-10 max-w-[280px] text-center font-normal text-muted-foreground text-sm leading-5 tracking-[0.02em] md:max-w-md lg:max-w-sm lg:text-base lg:leading-6">{cta.body}</p>
          <PillLink href="/app" wrapClassName="z-10" className="h-10 px-4 font-[480] text-sm leading-4 lg:h-12 lg:px-4.5 lg:text-base lg:leading-4.5">
            {cta.button}
          </PillLink>
        </div>
      </div>
    </section>
  )
}
