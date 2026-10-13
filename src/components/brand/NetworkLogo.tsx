// Card network marks, inlined unmodified from the networks' own files. Resize only.
// Visa Brand Mark      - served by Visa on https://corporate.visa.com/en/about-visa/brand.html (header mark).
//                        Rendered white, a colour variant Visa's brand kit provides for dark card faces.
// Mastercard Symbol    - Mastercard Brand Center, mc_symbol_SVG.zip (ma_symbol.svg, dark background version)
//                        https://www.mastercard.com/brandcenter/us/en/download-artwork.html
import visa from '@/assets/networks/visa-brandmark.svg?raw'
import mastercard from '@/assets/networks/mastercard-symbol.svg?raw'
import { cn } from '@/lib/utils'

export type Network = 'visa' | 'mastercard'

export function NetworkLogo({ network, className }: { network: Network; className?: string }) {
  return (
    <span
      role="img"
      aria-label={network === 'visa' ? 'Visa' : 'Mastercard'}
      className={cn(
        'inline-flex shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full',
        network === 'visa' && '[&_path]:fill-white',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: network === 'visa' ? visa : mastercard }}
    />
  )
}
