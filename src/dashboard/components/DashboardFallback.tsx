import { LogoMark } from '@/components/brand/Logo'

export function DashboardFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background" role="status" aria-label="Loading dashboard">
      <LogoMark className="size-10 animate-pulse text-gradient-mint" />
    </div>
  )
}
