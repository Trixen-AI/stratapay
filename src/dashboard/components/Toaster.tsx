import { IconAlertTriangle, IconCircleCheck, IconExternalLink, IconInfoCircle, IconX } from '@tabler/icons-react'
import { dismiss, useToasts } from '../lib/toast'
import { cn } from '@/lib/utils'

const icon = {
  success: <IconCircleCheck className="size-5 text-gradient-mint" />,
  error: <IconAlertTriangle className="size-5 text-[#ff9a9d]" />,
  info: <IconInfoCircle className="size-5 text-muted-foreground" />,
}

export function Toaster() {
  const toasts = useToasts()
  return (
    <div className="pointer-events-none fixed right-4 bottom-[calc(96px+env(safe-area-inset-bottom))] z-[70] lg:bottom-4 flex w-[calc(100vw-32px)] max-w-sm flex-col gap-2" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn('pointer-events-auto flex items-start gap-3 rounded-2xl border bg-card/95 p-4 shadow-2xl backdrop-blur-xl', t.tone === 'error' ? 'border-destructive/30' : 'border-white/10')}
        >
          {icon[t.tone]}
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="font-medium text-sm">{t.title}</p>
            {t.body && <p className="break-words text-muted-foreground text-xs">{t.body}</p>}
            {t.href && (
              <a href={t.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-gradient-mint text-xs hover:underline">
                View on Solscan <IconExternalLink className="size-3" />
              </a>
            )}
          </div>
          <button type="button" aria-label="Dismiss" onClick={() => dismiss(t.id)} className="text-muted-foreground hover:text-foreground">
            <IconX className="size-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
