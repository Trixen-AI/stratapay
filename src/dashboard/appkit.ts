import { createAppKit } from '@reown/appkit/react'
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react'
import { solana } from '@reown/appkit/networks'
import { REOWN_PROJECT_ID } from './lib/solana'

export const appKitConfigured = REOWN_PROJECT_ID.length > 0

// Created once when the dashboard chunk loads. Without a project ID the dashboard shows setup steps instead.
if (appKitConfigured) {
  createAppKit({
    adapters: [new SolanaAdapter()],
    networks: [solana],
    defaultNetwork: solana,
    projectId: REOWN_PROJECT_ID,
    metadata: {
      name: 'StrataPay',
      description: 'The card for coin creators. Turn creator fees into spending power.',
      url: window.location.origin,
      icons: [`${window.location.origin}/brand/logo-500.png`],
    },
    features: { analytics: false, email: false, socials: false, swaps: false, onramp: false, send: false, history: false },
    themeMode: 'dark',
    themeVariables: {
      '--w3m-accent': '#7fe3a8',
      '--w3m-color-mix': '#030806',
      '--w3m-color-mix-strength': 20,
      '--w3m-font-family': "'Geist Variable', ui-sans-serif, system-ui, sans-serif",
      '--w3m-border-radius-master': '3px',
    },
  })
}
