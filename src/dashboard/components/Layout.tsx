import { NavLink, Outlet, Link } from 'react-router'
import { useAppKit } from '@reown/appkit/react'
import { IconActivity, IconCoins, IconCreditCard, IconLayoutDashboard, IconSettings, IconUsers } from '@tabler/icons-react'
import { Logo } from '@/components/brand/Logo'
import { useWallet } from '../hooks/useWallet'
import { useSolBalance } from '../hooks/queries'
import { fmt, shortAddress } from '../lib/solana'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/app', label: 'Overview', short: 'Home', icon: IconLayoutDashboard, end: true },
  { to: '/app/card', label: 'Card', short: 'Card', icon: IconCreditCard, end: false },
  { to: '/app/fees', label: 'Creator fees', short: 'Fees', icon: IconCoins, end: false },
  { to: '/app/people', label: 'People', short: 'People', icon: IconUsers, end: false },
  { to: '/app/activity', label: 'Activity', short: 'Activity', icon: IconActivity, end: false },
  { to: '/app/settings', label: 'Settings', short: 'Settings', icon: IconSettings, end: false },
] as const

function WalletChip({ compact }: { compact?: boolean }) {
  const { open } = useAppKit()
  const { address, publicKey } = useWallet()
  const balance = useSolBalance(publicKey)
  if (!address) return null
  return (
    <button
      type="button"
      onClick={() => open({ view: 'Account' })}
      className={cn(
        'flex min-w-0 items-center gap-3 rounded-2xl bg-white/5 text-left ring-1 ring-white/10 transition-colors hover:bg-white/10',
        compact ? 'max-w-[180px] p-2 pr-3' : 'w-full p-3',
      )}
    >
      <span className={cn('shrink-0 rounded-full bg-linear-to-br from-gradient-light-mint via-gradient-jade to-gradient-deep-emerald', compact ? 'size-7' : 'size-8')} aria-hidden="true" />
      <span className="flex min-w-0 flex-col">
        <span className="truncate font-medium font-mono text-sm">{shortAddress(address)}</span>
        <span className="truncate text-muted-foreground text-xs">{balance.data !== undefined ? fmt.sol(balance.data) : 'Loading…'}</span>
      </span>
    </button>
  )
}

export function Layout() {
  return (
    <div className="relative min-h-dvh overflow-x-clip bg-background">
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 h-[520px] bg-[radial-gradient(60%_70%_at_50%_-10%,rgba(31,154,94,0.28),rgba(3,8,6,0))]" />

      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col justify-between border-white/5 border-r bg-background/70 p-5 backdrop-blur-xl lg:flex">
        <div className="flex flex-col gap-8">
          <Link to="/" aria-label="StrataPay home" className="px-2 pt-2 text-foreground">
            <Logo className="h-auto w-[132px]" />
          </Link>
          <nav aria-label="Dashboard" className="flex flex-col gap-1">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-full px-4 py-2.5 font-medium text-sm transition-colors',
                    isActive ? 'bg-white text-black' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
                  )
                }
              >
                <Icon className="size-[18px]" stroke={2} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
        <WalletChip />
      </aside>

      {/* mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-white/5 border-b bg-background/80 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Link to="/" aria-label="StrataPay home" className="shrink-0 text-foreground">
          <Logo className="h-auto w-[112px]" />
        </Link>
        <WalletChip compact />
      </header>

      <main className="relative z-10 px-4 pt-6 pb-[calc(96px+env(safe-area-inset-bottom))] lg:ml-[264px] lg:px-10 lg:pt-10 lg:pb-16">
        <div className="mx-auto flex w-full min-w-0 max-w-[1180px] flex-col gap-8">
          <Outlet />
        </div>
      </main>

      {/* mobile bottom bar */}
      <nav
        aria-label="Dashboard"
        className="fixed inset-x-0 bottom-0 z-40 border-white/10 border-t bg-background/90 px-2 pt-2 pb-[calc(8px+env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden"
      >
        <ul className="grid grid-cols-6">
          {NAV.map(({ to, short, icon: Icon, end }) => (
            <li key={to} className="min-w-0">
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn('flex flex-col items-center gap-1 rounded-xl py-1.5 font-medium text-[10px] transition-colors', isActive ? 'text-gradient-mint' : 'text-muted-foreground')
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={cn('flex h-7 w-11 items-center justify-center rounded-full transition-colors', isActive && 'bg-gradient-mint/15')}>
                      <Icon className="size-[19px]" stroke={2} />
                    </span>
                    <span className="max-w-full truncate">{short}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
