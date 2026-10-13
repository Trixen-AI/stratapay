import { useState } from 'react'
import { useDisconnect } from '@reown/appkit/react'
import { IconCopy, IconDownload, IconLogout } from '@tabler/icons-react'
import { Dialog } from '../components/Dialog'
import { Button, PageHeader, Panel } from '../components/ui'
import { useWallet } from '../hooks/useWallet'
import { explorer } from '../lib/solana'
import { walletStore } from '../lib/store'
import { toast } from '../lib/toast'


export function SettingsPage() {
  const { address, walletProvider } = useWallet()
  const { disconnect } = useDisconnect()
  const [resetOpen, setResetOpen] = useState(false)
  if (!address) return null

  const exportData = () => {
    const blob = new Blob([walletStore.exportJson(address)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `stratapay-${address.slice(0, 6)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <PageHeader title="Settings" body="Your wallet connection and the records this dashboard keeps for it." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Wallet">
          <div className="flex flex-col gap-2">
            <span className="text-muted-foreground text-xs uppercase tracking-[0.12em]">Connected address</span>
            <div className="flex items-center gap-2">
              <a href={explorer.account(address)} target="_blank" rel="noopener noreferrer" className="min-w-0 break-all font-mono text-sm hover:underline">
                {address}
              </a>
              <Button
                size="sm"
                variant="ghost"
                aria-label="Copy address"
                onClick={async () => {
                  await navigator.clipboard.writeText(address)
                  toast({ tone: 'info', title: 'Address copied' })
                }}
              >
                <IconCopy className="size-4" />
              </Button>
            </div>
            {walletProvider?.name && <span className="text-muted-foreground text-sm">Connected with {walletProvider.name}</span>}
          </div>
          <Button variant="ghost" onClick={() => disconnect()} className="self-start">
            <IconLogout className="size-4" /> Disconnect
          </Button>
        </Panel>
        <Panel title="Your records">
          <p className="text-muted-foreground text-sm">Cards, linked coins and people are saved in this browser for this wallet. Export them to keep a copy.</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" onClick={exportData}>
              <IconDownload className="size-4" /> Export JSON
            </Button>
            <Button variant="danger" onClick={() => setResetOpen(true)}>
              Clear records
            </Button>
          </div>
        </Panel>
      </div>
      <Dialog open={resetOpen} onOpenChange={setResetOpen} title="Clear all records?" description="Removes cards, linked coins and people for this wallet from this browser. Nothing on-chain changes.">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setResetOpen(false)}>
            Keep them
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              walletStore.reset(address)
              setResetOpen(false)
              toast({ tone: 'info', title: 'Records cleared' })
            }}
          >
            Clear records
          </Button>
        </div>
      </Dialog>
    </>
  )
}
