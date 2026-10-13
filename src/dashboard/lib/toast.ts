import { useSyncExternalStore } from 'react'

export type Toast = { id: number; tone: 'success' | 'error' | 'info'; title: string; body?: string; href?: string }

let toasts: Toast[] = []
let next = 1
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

export function toast(t: Omit<Toast, 'id'>, ms = 6000) {
  const id = next++
  toasts = [...toasts, { ...t, id }]
  emit()
  window.setTimeout(() => dismiss(id), ms)
}

export function dismiss(id: number) {
  toasts = toasts.filter((t) => t.id !== id)
  emit()
}

export function useToasts() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => toasts,
  )
}

/** Turns wallet/RPC errors into one readable line. */
export function errorMessage(e: unknown) {
  const msg = e instanceof Error ? e.message : String(e)
  if (/reject|denied|cancel/i.test(msg)) return 'You cancelled the request in your wallet.'
  if (/insufficient|0x1\b/i.test(msg)) return 'Not enough SOL to cover this and the network fee.'
  return msg.length > 160 ? `${msg.slice(0, 160)}…` : msg
}
