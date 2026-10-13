import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Navigate, Route, Routes } from 'react-router'
import { appKitConfigured } from './appkit'
import { ConnectScreen, SetupScreen } from './components/ConnectScreen'
import { DashboardFallback } from './components/DashboardFallback'
import { Layout } from './components/Layout'
import { Toaster } from './components/Toaster'
import { useWallet } from './hooks/useWallet'
import { ActivityPage } from './pages/ActivityPage'
import { CardPage } from './pages/CardPage'
import { FeesPage } from './pages/FeesPage'
import { Overview } from './pages/Overview'
import { PeoplePage } from './pages/PeoplePage'
import { SettingsPage } from './pages/SettingsPage'

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } } })

const RESTORE_WAIT_MS = 2500

function Gate() {
  const { isConnected, status } = useWallet()
  // Give AppKit a moment to restore a previous session, but never leave the user on a spinner.
  const [waited, setWaited] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setWaited(true), RESTORE_WAIT_MS)
    return () => window.clearTimeout(t)
  }, [])
  if (!isConnected && !waited && (status === 'connecting' || status === 'reconnecting')) return <DashboardFallback />
  if (!isConnected) return <ConnectScreen />
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Overview />} />
        <Route path="card" element={<CardPage />} />
        <Route path="fees" element={<FeesPage />} />
        <Route path="people" element={<PeoplePage />} />
        <Route path="activity" element={<ActivityPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Route>
    </Routes>
  )
}

export default function DashboardApp() {
  return (
    <QueryClientProvider client={queryClient}>
      {appKitConfigured ? <Gate /> : <SetupScreen />}
      <Toaster />
    </QueryClientProvider>
  )
}
