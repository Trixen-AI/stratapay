import { Accordion } from '@base-ui/react/accordion'
import { IconMinus, IconPlus } from '@tabler/icons-react'
import { faq } from '@/data/content'

export function Faq() {
  return (
    <section className="py-8 lg:pt-[78px]" id="faq">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-16">
          <div className="flex flex-col gap-10 lg:max-w-md">
            <div className="flex flex-col gap-2 lg:gap-3">
              <h2 className="font-medium text-3xl leading-tight tracking-tight lg:text-[72px] lg:leading-19">{faq.title}</h2>
              <p className="font-normal text-muted-foreground text-sm lg:text-lg">{faq.body}</p>
            </div>
          </div>
          <div className="w-full lg:max-w-[720px]">
            <Accordion.Root defaultValue={[0]} className="flex flex-col gap-2">
              {faq.items.map((item, i) => (
                <Accordion.Item
                  key={item.q}
                  value={i}
                  className="group/item rounded-2xl bg-linear-to-b from-white/10 to-white/5 transition-colors duration-300 motion-reduce:transition-none lg:rounded-3xl"
                >
                  <Accordion.Header>
                    <Accordion.Trigger className="group flex w-full cursor-pointer items-center justify-between gap-4 p-4 text-left lg:p-6">
                      <span className="flex-1 font-medium text-base leading-6 lg:text-xl">{item.q}</span>
                      <span className="flex size-5 shrink-0 items-center justify-center opacity-20 transition-opacity duration-300 group-data-panel-open:opacity-100 motion-reduce:transition-none lg:size-6">
                        <IconPlus className="size-4 group-data-panel-open:hidden lg:size-5" stroke={2} />
                        <IconMinus className="hidden size-4 group-data-panel-open:block lg:size-5" stroke={2} />
                      </span>
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Panel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-300 ease-out data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none">
                    <div className="px-4 pb-4 lg:px-6 lg:pb-6">
                      <p className="font-normal text-sm text-white/60 leading-5 lg:text-base lg:leading-6">{item.a}</p>
                    </div>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </div>
        </div>
      </div>
    </section>
  )
}
