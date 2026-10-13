import type { ReactNode } from 'react'
import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import { IconX } from '@tabler/icons-react'

type Props = { open: boolean; onOpenChange: (open: boolean) => void; title: string; description?: string; children: ReactNode }

export function Dialog({ open, onOpenChange, title, description, children }: Props) {
  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <BaseDialog.Popup className="fixed top-1/2 left-1/2 z-[61] w-[calc(100vw-32px)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-card p-6 shadow-2xl outline-none transition-all data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <BaseDialog.Title className="font-medium text-lg">{title}</BaseDialog.Title>
              {description && <BaseDialog.Description className="text-muted-foreground text-sm">{description}</BaseDialog.Description>}
            </div>
            <BaseDialog.Close aria-label="Close" className="flex size-8 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-white/10">
              <IconX className="size-4" />
            </BaseDialog.Close>
          </div>
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  )
}
