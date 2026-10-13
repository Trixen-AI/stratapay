// Per-wallet records (cards, linked coins, people). Versioned so the shape can change safely later.
import { useSyncExternalStore } from 'react'
import type { CardNetwork } from './card'
import type { CoinInfo, OwnershipRole } from './pump'

export type CardProof = {
  /** coin-creator: wallet signature plus on-chain creator check; wallet: signature only */
  kind?: 'coin-creator' | 'wallet'
  message: string
  signature: string // base58
  /** second wallet approval, given when the card was issued */
  issueMessage?: string
  issueSignature?: string
  signedAt: number
  bondingCurve?: string
  creatorOnChain?: string
  verifiedAt: number
}

export type CardRecord = {
  id: string
  kind: 'primary' | 'team'
  nameOnCard: string
  network: CardNetwork
  pan: string
  cvv?: string
  expMonth: number
  expYear: number
  status: 'active' | 'frozen'
  monthlyLimitUsd: number | null
  /** pump.fun coin whose creator fees fund the card; null when funded from the wallet only */
  coinMint: string | null
  holderAddress?: string
  createdAt: number
  proof: CardProof
}

export type LinkedCoin = CoinInfo & { role: OwnershipRole; linkedAt: number }
export type Person = { id: string; name: string; address: string; createdAt: number }

type WalletData = { v: 1; cards: CardRecord[]; coins: LinkedCoin[]; people: Person[] }
const EMPTY: WalletData = { v: 1, cards: [], coins: [], people: [] }
const key = (wallet: string) => `stratapay:v1:${wallet}`

const cache = new Map<string, WalletData>()
const listeners = new Set<() => void>()

function read(wallet: string): WalletData {
  const hit = cache.get(wallet)
  if (hit) return hit
  let data = EMPTY
  try {
    const raw = localStorage.getItem(key(wallet))
    if (raw) {
      const parsed = JSON.parse(raw) as WalletData
      if (parsed?.v === 1) data = { ...EMPTY, ...parsed }
    }
  } catch {
    /* storage unavailable: start empty */
  }
  cache.set(wallet, data)
  return data
}

function write(wallet: string, next: WalletData) {
  cache.set(wallet, next)
  try {
    localStorage.setItem(key(wallet), JSON.stringify(next))
  } catch {
    /* quota or private mode: keep in memory */
  }
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  const onStorage = (e: StorageEvent) => {
    if (e.key?.startsWith('stratapay:v1:')) {
      cache.clear()
      l()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(l)
    window.removeEventListener('storage', onStorage)
  }
}

export function useWalletData(wallet: string | undefined) {
  return useSyncExternalStore(subscribe, () => (wallet ? read(wallet) : EMPTY))
}

const uid = () => crypto.randomUUID()

export const walletStore = {
  addCard(wallet: string, card: Omit<CardRecord, 'id'>) {
    const d = read(wallet)
    const record = { ...card, id: uid() }
    write(wallet, { ...d, cards: [...d.cards, record] })
    return record
  },
  updateCard(wallet: string, id: string, patch: Partial<CardRecord>) {
    const d = read(wallet)
    write(wallet, { ...d, cards: d.cards.map((c) => (c.id === id ? { ...c, ...patch } : c)) })
  },
  removeCard(wallet: string, id: string) {
    const d = read(wallet)
    write(wallet, { ...d, cards: d.cards.filter((c) => c.id !== id) })
  },
  upsertCoin(wallet: string, coin: LinkedCoin) {
    const d = read(wallet)
    write(wallet, { ...d, coins: [...d.coins.filter((c) => c.mint !== coin.mint), coin] })
  },
  removeCoin(wallet: string, mint: string) {
    const d = read(wallet)
    write(wallet, { ...d, coins: d.coins.filter((c) => c.mint !== mint) })
  },
  addPerson(wallet: string, person: Omit<Person, 'id' | 'createdAt'>) {
    const d = read(wallet)
    write(wallet, { ...d, people: [...d.people, { ...person, id: uid(), createdAt: Date.now() }] })
  },
  removePerson(wallet: string, id: string) {
    const d = read(wallet)
    write(wallet, { ...d, people: d.people.filter((p) => p.id !== id) })
  },
  exportJson(wallet: string) {
    return JSON.stringify(read(wallet), null, 2)
  },
  reset(wallet: string) {
    write(wallet, EMPTY)
  },
}
