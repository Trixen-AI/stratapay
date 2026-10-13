import { Connection, PublicKey, Transaction, type TransactionInstruction } from '@solana/web3.js'

export const REOWN_PROJECT_ID = import.meta.env.VITE_REOWN_PROJECT_ID?.trim() ?? ''
const SOLANA_MAINNET_CAIP = 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'

/** Custom RPC when set, otherwise Reown's Solana mainnet RPC for this project. */
export const RPC_URL =
  import.meta.env.VITE_SOLANA_RPC_URL?.trim() || `https://rpc.walletconnect.org/v1/?chainId=${SOLANA_MAINNET_CAIP}&projectId=${REOWN_PROJECT_ID}`

let connection: Connection | null = null
export function getConnection() {
  connection ??= new Connection(RPC_URL, { commitment: 'confirmed' })
  return connection
}

export const LAMPORTS = 1_000_000_000

export function toPublicKey(value: string): PublicKey | null {
  try {
    return new PublicKey(value.trim())
  } catch {
    return null
  }
}

/** A wallet address is an ed25519 point; program-derived accounts are not. */
export function isWalletAddress(value: string) {
  const pk = toPublicKey(value)
  return !!pk && PublicKey.isOnCurve(pk.toBytes())
}

export function shortAddress(addr: string, head = 4, tail = 4) {
  return addr.length <= head + tail + 1 ? addr : `${addr.slice(0, head)}…${addr.slice(-tail)}`
}

export const explorer = {
  tx: (sig: string) => `https://solscan.io/tx/${sig}`,
  account: (addr: string) => `https://solscan.io/account/${addr}`,
  token: (mint: string) => `https://solscan.io/token/${mint}`,
  pumpCoin: (mint: string) => `https://pump.fun/coin/${mint}`,
}

const solFmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 4, minimumFractionDigits: 2 })
const usdFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
const compactUsd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 })

export const fmt = {
  sol: (lamports: number) => `${solFmt.format(lamports / LAMPORTS)} SOL`,
  solNum: (lamports: number) => solFmt.format(lamports / LAMPORTS),
  usd: (value: number) => usdFmt.format(value),
  usdCompact: (value: number) => compactUsd.format(value),
  lamportsToUsd: (lamports: number, price: number | undefined) => (price ? usdFmt.format((lamports / LAMPORTS) * price) : '-'),
  time: (unixSeconds: number) =>
    new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(unixSeconds * 1000)),
}

/** Builds a legacy transaction with a fresh blockhash; returns what confirmation needs. */
export async function buildTransaction(conn: Connection, feePayer: PublicKey, instructions: TransactionInstruction[]) {
  const { blockhash, lastValidBlockHeight } = await conn.getLatestBlockhash('confirmed')
  const tx = new Transaction({ feePayer, blockhash, lastValidBlockHeight }).add(...instructions)
  return { tx, blockhash, lastValidBlockHeight }
}
