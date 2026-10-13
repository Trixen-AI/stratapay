import { Link } from 'react-router'
import { useAppKit } from '@reown/appkit/react'
import { IconCheck } from '@tabler/icons-react'
import { BrandLogo } from '@/components/brand/BrandLogos'
import { Logo } from '@/components/brand/Logo'
import { PaymentCard } from './PaymentCard'
import { Button } from './ui'

const POINTS = ['Read your pump.fun creator fees straight from chain', 'Name your card, approve it, prove you made the coin', 'Claim fees and fund your people from one place']

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_100%,rgba(31,154,94,0.45),rgba(3,8,6,0)_70%)]" />
      <div aria-hidden="true" className="dot-texture pointer-events-none absolute inset-0 opacity-30 [mask-image:linear-gradient(to_top,black,transparent_70%)]" />
      <header className="relative z-10 mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-5 lg:px-16">
        <Link to="/" aria-label="StrataPay home" className="text-foreground">
          <Logo className="h-auto w-[140px]" />
        </Link>
        <Link to="/" className="font-medium text-muted-foreground text-sm hover:text-foreground">
          Back to site
        </Link>
      </header>
      <main className="relative z-10 mx-auto flex w-full max-w-[1180px] flex-1 items-center px-4 pb-16 lg:px-16">{children}</main>
    </div>
  )
}

export function ConnectScreen() {
  const { open } = useAppKit()
  return (
    <Shell>
      <div className="grid w-full items-center gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <BrandLogo brand="pumpfun" className="size-4" decorative />
            Built on pump.fun
          </div>
          <h1 className="font-medium text-[40px] leading-[1.05] tracking-tighter lg:text-6xl">Connect the wallet that launched your coin</h1>
          <ul className="flex flex-col gap-3">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3 text-muted-foreground">
                <IconCheck className="mt-0.5 size-5 shrink-0 text-gradient-mint" />
                {p}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => open({ view: 'Connect', namespace: 'solana' })} className="h-12 px-6 text-base">
              Connect wallet
            </Button>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[460px] -rotate-6 drop-shadow-[0_30px_60px_rgba(31,154,94,0.35)]">
          <PaymentCard network="visa" nameOnCard="Your name" />
        </div>
      </div>
    </Shell>
  )
}

export function SetupScreen() {
  return (
    <Shell>
      <div className="mx-auto flex max-w-xl flex-col gap-5">
        <h1 className="font-medium text-4xl tracking-tight">Add your Reown project ID</h1>
        <p className="text-muted-foreground">Wallet connection runs through Reown AppKit. Create a project at dashboard.reown.com, then add its ID to a .env file in the project root:</p>
        <pre className="overflow-x-auto rounded-2xl bg-[#020604] p-4 font-mono text-gradient-mint text-sm ring-1 ring-white/10">VITE_REOWN_PROJECT_ID=your_project_id</pre>
        <p className="text-muted-foreground text-sm">Restart the dev server after saving. Also add your site's domain to the project's allowed origins in Reown.</p>
      </div>
    </Shell>
  )
}
