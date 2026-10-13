import { lazy, Suspense, useEffect } from 'react'
import { DashboardFallback } from './components/DashboardFallback'

// The dashboard (wallet kit, Solana SDKs) loads only when /app is opened, keeping the landing page light.
const DashboardApp = lazy(() => import('./DashboardApp'))

/** Dashboard pages are personal: give them their own title and keep them out of search results. */
function useDashboardHead() {
  useEffect(() => {
    const prevTitle = document.title
    document.title = 'Dashboard | StrataPay'
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    const prevRobots = robots?.content
    if (robots) robots.content = 'noindex, nofollow'
    return () => {
      document.title = prevTitle
      if (robots && prevRobots) robots.content = prevRobots
    }
  }, [])
}

export function DashboardRoute() {
  useDashboardHead()
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardApp />
    </Suspense>
  )
}
