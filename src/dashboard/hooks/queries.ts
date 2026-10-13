import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import type { PublicKey } from '@solana/web3.js'
import { fetchActivity } from '../lib/activity'
import { fetchSolPrice } from '../lib/price'
import { discoverCreatedCoins, getUnclaimedFees } from '../lib/pump'
import { getConnection } from '../lib/solana'

export const qk = {
  price: ['sol-price'] as const,
  balance: (w: string) => ['balance', w] as const,
  fees: (w: string) => ['creator-fees', w] as const,
  activity: (w: string) => ['activity', w] as const,
  coins: (w: string) => ['created-coins', w] as const,
}

export function useSolPrice() {
  return useQuery({ queryKey: qk.price, queryFn: fetchSolPrice, refetchInterval: 60_000, staleTime: 30_000 })
}

export function useSolBalance(pk: PublicKey | null) {
  return useQuery({
    queryKey: qk.balance(pk?.toBase58() ?? ''),
    queryFn: () => getConnection().getBalance(pk!),
    enabled: !!pk,
    refetchInterval: 30_000,
  })
}

export function useUnclaimedFees(pk: PublicKey | null) {
  return useQuery({
    queryKey: qk.fees(pk?.toBase58() ?? ''),
    queryFn: () => getUnclaimedFees(getConnection(), pk!),
    enabled: !!pk,
    refetchInterval: 45_000,
  })
}

const PAGE = 20
export function useActivity(pk: PublicKey | null) {
  return useInfiniteQuery({
    queryKey: qk.activity(pk?.toBase58() ?? ''),
    queryFn: ({ pageParam }) => fetchActivity(getConnection(), pk!, PAGE, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.length === PAGE ? last[last.length - 1].signature : undefined),
    enabled: !!pk,
    staleTime: 20_000,
  })
}

/** pump.fun coins this wallet created, found and verified on-chain. */
export function useCreatedCoins(pk: PublicKey | null) {
  return useQuery({
    queryKey: qk.coins(pk?.toBase58() ?? ''),
    queryFn: () => discoverCreatedCoins(getConnection(), pk!),
    enabled: !!pk,
    staleTime: 5 * 60_000,
  })
}
