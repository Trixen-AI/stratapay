import { type Connection, type ParsedTransactionWithMeta, type PublicKey } from '@solana/web3.js'
import { PUMP_AMM_PROGRAM_ID, PUMP_PROGRAM_ID } from '@pump-fun/pump-sdk'

export type ActivityKind = 'fee-claim' | 'sent' | 'received' | 'pump-trade' | 'other'
export type ActivityItem = {
  signature: string
  time: number | null
  ok: boolean
  kind: ActivityKind
  lamportsDelta: number
  counterparty?: string
}

const CLAIM_RE = /Instruction: (CollectCreatorFee|CollectCoinCreatorFee)/
const TRADE_RE = /Instruction: (Buy|Sell|BuyExactSolIn|BuyV2|SellV2)/
const PUMP_IDS = new Set([PUMP_PROGRAM_ID.toBase58(), PUMP_AMM_PROGRAM_ID.toBase58()])

function classify(tx: ParsedTransactionWithMeta, wallet: string): Omit<ActivityItem, 'signature' | 'time' | 'ok'> {
  const keys = tx.transaction.message.accountKeys.map((k) => k.pubkey.toBase58())
  const idx = keys.indexOf(wallet)
  const lamportsDelta = idx >= 0 && tx.meta ? tx.meta.postBalances[idx] - tx.meta.preBalances[idx] : 0
  const logs = tx.meta?.logMessages?.join('\n') ?? ''
  const touchesPump = keys.some((k) => PUMP_IDS.has(k))

  if (touchesPump && CLAIM_RE.test(logs)) return { kind: 'fee-claim', lamportsDelta }
  if (touchesPump && TRADE_RE.test(logs)) return { kind: 'pump-trade', lamportsDelta }

  for (const ix of tx.transaction.message.instructions) {
    if ('parsed' in ix && ix.program === 'system' && ix.parsed?.type === 'transfer') {
      const { source, destination } = ix.parsed.info as { source: string; destination: string }
      if (source === wallet) return { kind: 'sent', lamportsDelta, counterparty: destination }
      if (destination === wallet) return { kind: 'received', lamportsDelta, counterparty: source }
    }
  }
  return { kind: 'other', lamportsDelta }
}

/** Runs `fn` over `items` with at most `limit` calls in flight; a failed call yields null instead of failing all. */
async function mapLimited<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<(R | null)[]> {
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

/** The wallet's recent transactions, parsed and labelled. `before` pages further back. */
export async function fetchActivity(conn: Connection, wallet: PublicKey, limit = 20, before?: string): Promise<ActivityItem[]> {
  const sigs = await conn.getSignaturesForAddress(wallet, { limit, before })
  if (!sigs.length) return []
  // One call per transaction: many RPC providers cap or forbid batched getTransaction requests.
  const parsed = await mapLimited(sigs, 4, (s) => conn.getParsedTransaction(s.signature, { maxSupportedTransactionVersion: 0 }))
  const me = wallet.toBase58()
  return sigs.map((s, i) => {
    const tx = parsed[i]
    const base = { signature: s.signature, time: s.blockTime ?? null, ok: !s.err }
    return tx ? { ...base, ...classify(tx, me) } : { ...base, kind: 'other' as const, lamportsDelta: 0 }
  })
}
