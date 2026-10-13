import { useCallback, useMemo } from 'react'
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import type { Provider } from '@reown/appkit-adapter-solana/react'
import { PublicKey, type TransactionInstruction } from '@solana/web3.js'
import { buildTransaction, getConnection } from '../lib/solana'

// Development only: `/app?watch=<address>` views any wallet read-only, for checking pages without a wallet extension.
// Stripped from production builds; anything that needs a signature refuses in this mode.
const WATCH = (() => {
  if (!import.meta.env.DEV) return null
  const fromUrl = new URLSearchParams(window.location.search).get('watch')
  if (fromUrl) sessionStorage.setItem('stratapay:watch', fromUrl)
  const value = fromUrl ?? sessionStorage.getItem('stratapay:watch')
  try {
    return value ? new PublicKey(value).toBase58() : null
  } catch {
    return null
  }
})()

export function useWallet() {
  const account = useAppKitAccount({ namespace: 'solana' })
  const provider = useAppKitProvider<Provider>('solana')
  const address = WATCH ?? account.address
  const isConnected = WATCH ? true : account.isConnected
  const status = WATCH ? 'connected' : account.status
  const walletProvider = WATCH ? undefined : provider.walletProvider
  const publicKey = useMemo(() => (address ? new PublicKey(address) : null), [address])

  /** Signs with the connected wallet, submits, and waits for confirmation. Returns the signature. */
  const sendInstructions = useCallback(
    async (instructions: TransactionInstruction[]) => {
      if (!publicKey || !walletProvider) throw new Error('Connect a wallet first.')
      const conn = getConnection()
      const { tx, blockhash, lastValidBlockHeight } = await buildTransaction(conn, publicKey, instructions)
      const signature = await walletProvider.sendTransaction(tx, conn)
      const res = await conn.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, 'confirmed')
      if (res.value.err) throw new Error('The transaction failed on-chain.')
      return signature
    },
    [publicKey, walletProvider],
  )

  const signMessage = useCallback(
    async (message: string) => {
      if (!walletProvider) throw new Error('Connect a wallet first.')
      return walletProvider.signMessage(new TextEncoder().encode(message))
    },
    [walletProvider],
  )

  return { address, publicKey, isConnected, status, walletProvider, sendInstructions, signMessage }
}
