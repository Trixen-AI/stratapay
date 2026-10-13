import type { ReactNode } from 'react'
import { IconCreditCardFilled, IconDeviceMobileFilled, IconDiscountFilled, IconHeadphonesFilled, IconUsersGroup } from '@tabler/icons-react'
import { CardArt } from '@/components/art/CardArt'
import { DotField } from '@/components/ui/dot-field'
import { PillLink } from '@/components/ui/button'
import { cardsSection } from '@/data/content'

function CoinsIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none">
      <circle cx="9" cy="10" r="6.5" fill="currentColor" opacity="0.55" />
      <circle cx="15" cy="14" r="7" fill="currentColor" />
    </svg>
  )
}

const perkIcons: Record<string, (c: string) => ReactNode> = {
  coins: (c) => <CoinsIcon className={c} />,
  percent: (c) => <IconDiscountFilled className={c} />,
  headset: (c) => <IconHeadphonesFilled className={c} />,
  phone: (c) => <IconDeviceMobileFilled className={c} />,
  team: (c) => <IconUsersGroup className={c} stroke={2.4} />,
  card: (c) => <IconCreditCardFilled className={c} />,
}

export function ExploreCards() {
  return (
    <section className="relative py-8 lg:py-[60px]" id="cards">
      <div aria-hidden="true" className="absolute top-80 -left-130 -z-1 hidden size-[800px] rounded-full lg:block">
        <div className="absolute inset-0 rounded-full opacity-25 blur-[60px]" style={{ background: 'radial-gradient(circle at 50% 50%, #d6ffe4 0%, #00a35a 100%)' }} />
        <div
          className="pointer-events-none absolute inset-0 -z-1 flex items-center justify-center rounded-full opacity-60"
          style={{
            WebkitMaskImage: 'radial-gradient(circle at 50% 55%, #000 40%, rgba(0,0,0,0.05) 80%, transparent 100%)',
            maskImage: 'radial-gradient(circle at 50% 55%, #000 40%, rgba(0,0,0,0.05) 80%, transparent 100%)',
          }}
        >
          <div className="h-full w-full rounded-full opacity-40">
            <DotField width={800} height={800} className="pointer-events-none" />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1440px] px-4 lg:px-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr] lg:gap-8">
          <div className="flex flex-col gap-2 lg:gap-3">
            <h2 className="font-medium text-2xl leading-tight tracking-tight lg:text-4xl lg:leading-12">{cardsSection.title}</h2>
            <p className="font-normal text-muted-foreground text-sm lg:text-lg">{cardsSection.body}</p>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            {cardsSection.cards.map((card) => (
              <div key={card.name} className="flex w-full flex-col gap-4 lg:max-w-[396px] lg:gap-6">
                <div className="flex flex-col gap-1">
                  <h3 className="font-medium text-lg lg:text-xl">{card.name}</h3>
                  <p className="font-normal text-muted-foreground text-sm lg:text-base">{card.sub}</p>
                </div>
                <div className="pointer-events-none w-full select-none">
                  <CardArt variant={card.variant} last4={card.last4} network={card.variant === "mint" ? "visa" : "mastercard"} title={`StrataPay ${card.name} card`} />
                </div>
                <ul className="flex flex-col gap-4">
                  {card.perks.map((perk) => (
                    <li key={perk.title} className="flex items-start gap-3 lg:gap-4">
                      {perkIcons[perk.icon]('mt-0.5 size-5 shrink-0')}
                      <div className="flex flex-col gap-1">
                        <p className="font-medium text-sm lg:text-base">{perk.title}</p>
                        <p className="text-muted-foreground text-sm">{perk.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <PillLink href={card.cta.href} wrapClassName="w-fit lg:mt-auto">
                  {card.cta.label}
                </PillLink>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
