// pump.fun integration, entirely on-chain through pump.fun's official SDK (@pump-fun/pump-sdk).
// - Creator fees accrue in a vault keyed by the creator wallet, on the bonding curve program and on PumpSwap.
// - A coin's bonding curve account stores its `creator`, which is how coins are found and ownership is proven.
import { PublicKey, type Connection } from '@solana/web3.js'
import { getTokenMetadata, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  ammCreatorVaultPda,
  bondingCurveMarketCap,
  bondingCurvePda,
  creatorVaultPda,
  feeSharingConfigPda,
  OnlinePumpSdk,
  PUMP_PROGRAM_ID,
  PUMP_SDK,
} from '@pump-fun/pump-sdk'

const sdkCache = new WeakMap<Connection, OnlinePumpSdk>()
function sdk(conn: Connection) {
  let s = sdkCache.get(conn)
  if (!s) {
    s = new OnlinePumpSdk(conn)
    sdkCache.set(conn, s)
  }
  return s
}

/** Unclaimed creator fees in lamports, across the bonding curve vault and the PumpSwap vault. */
export async function getUnclaimedFees(conn: Connection, creator: PublicKey): Promise<number> {
  const bn = await sdk(conn).getCreatorVaultBalanceBothPrograms(creator)
  return Number(bn.toString())
}

/** Instructions that move every unclaimed creator fee into the creator's wallet. */
export function claimFeeInstructions(conn: Connection, creator: PublicKey) {
  return sdk(conn).collectCoinCreatorFeeInstructions(creator, creator)
}

export type OwnershipRole = 'creator' | 'fee-admin' | 'shareholder'
export const roleLabel: Record<OwnershipRole, string> = { creator: 'Creator', 'fee-admin': 'Fee-sharing admin', shareholder: 'Fee shareholder' }

export type CoinInfo = {
  mint: string
  name: string
  symbol: string
  image?: string
  creatorOnChain: string
  bondingCurve: string
  complete: boolean
  /** market cap from the curve while it is trading (lamports), null once graduated */
  marketCapLamports: number | null
  /** market cap from Jupiter's live price, used for graduated coins */
  marketCapUsd: number | null
  progress: number
}

export type OwnershipResult = { ok: true; role: OwnershipRole; coin: CoinInfo } | { ok: false; reason: string; coin?: CoinInfo }

const METADATA_PROGRAM = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')
const WSOL = 'So11111111111111111111111111111111111111112'
// Real token reserves a fresh pump.fun curve starts with (793.1M tokens, 6 decimals).
const INITIAL_REAL_TOKEN_RESERVES = 793_100_000_000_000
// Bonding curve layout: discriminator (8) + 5 x u64 (40) + complete (1), then the creator pubkey.
const CREATOR_OFFSET = 49

function readBorshString(data: Uint8Array, offset: number): [string, number] {
  const len = new DataView(data.buffer, data.byteOffset + offset, 4).getUint32(0, true)
  const start = offset + 4
  const text = new TextDecoder().decode(data.slice(start, start + len)).replace(/\0/g, '').trim()
  return [text, start + len]
}

async function fetchMetadata(conn: Connection, mint: PublicKey): Promise<{ name: string; symbol: string; uri: string }> {
  const [pda] = PublicKey.findProgramAddressSync([new TextEncoder().encode('metadata'), METADATA_PROGRAM.toBytes(), mint.toBytes()], METADATA_PROGRAM)
  const info = await conn.getAccountInfo(pda)
  if (info) {
    // key (1) + update authority (32) + mint (32), then name, symbol, uri as borsh strings
    const [name, o1] = readBorshString(info.data, 65)
    const [symbol, o2] = readBorshString(info.data, o1)
    const [uri] = readBorshString(info.data, o2)
    return { name, symbol, uri }
  }
  // Newer pump.fun coins keep metadata in the Token-2022 mint itself.
  const meta = await getTokenMetadata(conn, mint, 'confirmed', TOKEN_2022_PROGRAM_ID)
  return { name: meta?.name ?? 'Unknown coin', symbol: meta?.symbol ?? '???', uri: meta?.uri ?? '' }
}

async function fetchJson<T>(url: string, ms = 6000): Promise<T | null> {
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), ms)
    const res = await fetch(url, { signal: ctrl.signal })
    clearTimeout(t)
    return res.ok ? ((await res.json()) as T) : null
  } catch {
    return null
  }
}

async function jupiterPriceUsd(mint: string): Promise<number | null> {
  const json = await fetchJson<Record<string, { usdPrice?: number }>>(`https://lite-api.jup.ag/price/v3?ids=${mint}`)
  return json?.[mint]?.usdPrice ?? null
}

/** Reads a pump.fun coin from chain and checks whether `wallet` controls its creator fees. */
export async function verifyCoinOwnership(conn: Connection, mint: PublicKey, wallet: PublicKey): Promise<OwnershipResult> {
  let curve
  try {
    curve = await sdk(conn).fetchBondingCurve(mint)
  } catch {
    return { ok: false, reason: 'No pump.fun bonding curve exists for this coin.' }
  }

  const supply = Number(curve.tokenTotalSupply.toString())
  const virtualTokens = Number(curve.virtualTokenReserves.toString())
  // A graduated curve has its reserves emptied, so its market cap comes from the live market price instead.
  const trading = !curve.complete && virtualTokens > 0
  let marketCapLamports: number | null = null
  if (trading) {
    try {
      marketCapLamports = Number(
        bondingCurveMarketCap({ mintSupply: curve.tokenTotalSupply, virtualQuoteReserves: curve.virtualQuoteReserves, virtualTokenReserves: curve.virtualTokenReserves }).toString(),
      )
    } catch {
      marketCapLamports = null
    }
  }

  const [meta, priceUsd] = await Promise.all([
    fetchMetadata(conn, mint).catch(() => ({ name: 'Unknown coin', symbol: '???', uri: '' })),
    trading ? Promise.resolve(null) : jupiterPriceUsd(mint.toBase58()),
  ])
  const image = meta.uri ? (await fetchJson<{ image?: string }>(meta.uri))?.image : undefined
  const realLeft = Number(curve.realTokenReserves.toString())

  const coin: CoinInfo = {
    mint: mint.toBase58(),
    name: meta.name,
    symbol: meta.symbol,
    image,
    creatorOnChain: curve.creator.toBase58(),
    bondingCurve: bondingCurvePda(mint).toBase58(),
    complete: curve.complete,
    marketCapLamports,
    marketCapUsd: priceUsd && supply ? (priceUsd * supply) / 1e6 : null,
    progress: curve.complete ? 1 : Math.min(1, Math.max(0, 1 - realLeft / INITIAL_REAL_TOKEN_RESERVES)),
  }

  if (curve.creator.equals(wallet)) return { ok: true, role: 'creator', coin }

  // Creator fees may have moved to a fee-sharing config; its admin or a shareholder also qualifies.
  const sharingPda = feeSharingConfigPda(mint)
  if (curve.creator.equals(sharingPda)) {
    const info = await conn.getAccountInfo(sharingPda)
    if (info) {
      const cfg = PUMP_SDK.decodeSharingConfig(info)
      if (!cfg.adminRevoked && cfg.admin.equals(wallet)) return { ok: true, role: 'fee-admin', coin }
      if (cfg.shareholders.some((s) => s.address.equals(wallet))) return { ok: true, role: 'shareholder', coin }
    }
  }

  return { ok: false, reason: 'This wallet is not the creator of this coin on pump.fun.', coin }
}

/* ---------------- discovery: which coins did this wallet create? ---------------- */

async function mapLimited<T, R>(items: readonly T[], limit: number, fn: (item: T) => Promise<R>): Promise<(R | null)[]> {
  const out: (R | null)[] = new Array(items.length).fill(null)
  let next = 0
  const worker = async () => {
    while (next < items.length) {
      const i = next++
      out[i] = await fn(items[i]).catch(() => null)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return out
}

/** The mint a bonding curve trades: the curve PDA owns that mint's token account. */
async function mintOfCurve(conn: Connection, curve: PublicKey): Promise<string | null> {
  for (const programId of [TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID]) {
    const res = await conn.getParsedTokenAccountsByOwner(curve, { programId })
    const mint = res.value.map((a) => (a.account.data as { parsed?: { info?: { mint?: string } } }).parsed?.info?.mint).find((m) => m && m !== WSOL)
    if (mint) return mint
  }
  return null
}

/** Fast path: index query for bonding curves whose creator is the wallet (works on Helius and similar RPCs). */
async function mintsFromIndex(conn: Connection, wallet: PublicKey): Promise<string[]> {
  const curves = await conn.getProgramAccounts(PUMP_PROGRAM_ID, {
    dataSlice: { offset: 0, length: 0 },
    filters: [{ memcmp: { offset: CREATOR_OFFSET, bytes: wallet.toBase58() } }],
  })
  const mints = await mapLimited(curves, 4, (c) => mintOfCurve(conn, c.pubkey))
  return mints.filter((m): m is string => !!m)
}

/** Fallback for RPCs without index queries: coins seen in recent trades paying this creator, and coins this wallet created. */
async function mintsFromHistory(conn: Connection, wallet: PublicKey): Promise<string[]> {
  const sources = [creatorVaultPda(wallet), ammCreatorVaultPda(wallet), wallet]
  const sigLists = await Promise.all(sources.map((s) => conn.getSignaturesForAddress(s, { limit: 40 }).catch(() => [])))
  const sigs = [...new Set(sigLists.flat().map((s) => s.signature))].slice(0, 90)
  const txs = await mapLimited(sigs, 4, (sig) => conn.getParsedTransaction(sig, { maxSupportedTransactionVersion: 0 }))
  const mints = new Set<string>()
  for (const tx of txs) {
    for (const b of tx?.meta?.postTokenBalances ?? []) if (b.mint !== WSOL) mints.add(b.mint)
  }
  return [...mints]
}

export type DiscoveredCoin = CoinInfo & { role: OwnershipRole }

/** Every pump.fun coin the wallet created (or controls fees for), verified on-chain. */
export async function discoverCreatedCoins(conn: Connection, wallet: PublicKey): Promise<DiscoveredCoin[]> {
  let candidates: string[]
  try {
    candidates = await mintsFromIndex(conn, wallet)
  } catch {
    candidates = await mintsFromHistory(conn, wallet)
  }
  const unique = [...new Set(candidates)].slice(0, 40)
  const results = await mapLimited(unique, 3, (m) => verifyCoinOwnership(conn, new PublicKey(m), wallet))
  return results.flatMap((r) => (r?.ok ? [{ ...r.coin, role: r.role }] : []))
}
