export type CardNetwork = 'visa' | 'mastercard'

function luhnCheckDigit(digits: string) {
  let sum = 0
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i])
    if (i % 2 === 0) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
  }
  return String((10 - (sum % 10)) % 10)
}

/**
 * 16-digit card number in the network's format (Visa starts with 4, Mastercard with 51-55), ending in a valid
 * check digit. Derived from the wallet signature that approved the card, so the same approval gives the same number.
 */
export async function deriveCardNumber(network: CardNetwork, seed: Uint8Array) {
  const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', seed as BufferSource))
  const prefix = network === 'visa' ? '4' : `5${(hash[0] % 5) + 1}`
  let body = prefix
  for (let i = 1; body.length < 15; i++) body += String(hash[i % hash.length] % 10)
  return body + luhnCheckDigit(body)
}

/** 3-digit security code, derived from the same signature as the number (different hash input, so it is independent of it). */
export async function deriveCvv(seed: Uint8Array) {
  const tagged = new Uint8Array([...seed, 0x63, 0x76, 0x76]) // + "cvv"
  const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', tagged as BufferSource))
  return String(((hash[0] << 8) | hash[1]) % 1000).padStart(3, '0')
}

/** For cards issued before codes were stored: a stable code from the card number. */
export function cvvFromPan(pan: string) {
  let h = 2166136261
  for (const ch of pan + ':cvv') h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  return String((h >>> 0) % 1000).padStart(3, '0')
}

export function formatCardNumber(pan: string, reveal: boolean) {
  const groups = pan.match(/.{1,4}/g) ?? []
  return reveal ? groups.join(' ') : `•••• •••• •••• ${pan.slice(-4)}`
}

export function expiryFrom(createdAt: number) {
  const d = new Date(createdAt)
  return { month: d.getMonth() + 1, year: d.getFullYear() + 4 }
}

export function formatExpiry(month: number, year: number) {
  return `${String(month).padStart(2, '0')}/${String(year).slice(-2)}`
}

const NAME_RE = /^[A-Za-z][A-Za-z .'-]{1,25}$/
export function validateCardName(name: string): string | null {
  const v = name.trim()
  if (v.length < 2) return 'Enter at least 2 characters.'
  if (v.length > 26) return 'Keep it to 26 characters so it fits on the card.'
  if (!NAME_RE.test(v)) return 'Use letters, spaces, dots, hyphens or apostrophes.'
  return null
}
