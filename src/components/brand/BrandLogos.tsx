// Official third-party logos, inlined byte-for-byte from the brands' own files. Resize only.
// pump.fun logomark  - https://pump.fun/pump-logomark.svg (served on pump.fun's own site)
// Solana logomark    - https://solana.com/src/img/branding/solanaLogoMark.svg (solana.com/branding)
// X logo             - https://about.x.com/content/dam/about-twitter/x/brand-toolkit/x-logo.zip (logo.svg)
import pumpfun from '@/assets/logos/pumpfun-logomark.svg?raw'
import solana from '@/assets/logos/solana-logomark.svg?raw'
import x from '@/assets/social/x-logo.svg?raw'
import { cn } from '@/lib/utils'

const files = { pumpfun, solana, x } as const
export type BrandKey = keyof typeof files

const labels: Record<BrandKey, string> = {
  pumpfun: 'pump.fun',
  solana: 'Solana',
  x: 'X',
}

export function BrandLogo({ brand, className, decorative = false }: { brand: BrandKey; className?: string; decorative?: boolean }) {
  return (
    <span
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : labels[brand]}
      aria-hidden={decorative || undefined}
      className={cn('inline-flex shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full', className)}
      dangerouslySetInnerHTML={{ __html: files[brand] }}
    />
  )
}
