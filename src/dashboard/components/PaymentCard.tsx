import { CardArt } from '@/components/art/CardArt'
import { MarkLayers } from '@/components/brand/Logo'
import { NetworkLogo, type Network } from '@/components/brand/NetworkLogo'
import { MARK_VIEWBOX } from '@/components/brand/logo-data'
import { formatCardNumber, formatExpiry } from '../lib/card'
import { cn } from '@/lib/utils'

type Props = {
  network: Network
  nameOnCard: string
  pan?: string
  expMonth?: number
  expYear?: number
  cvv?: string
  reveal?: boolean
  /** show the back of the card (rotates in 3D) */
  flipped?: boolean
  frozen?: boolean
  variant?: 'mint' | 'silver'
  className?: string
}

const BACK_BG = {
  mint: 'linear-gradient(135deg, #b9f3cf 0%, #6fdc9d 38%, #1f9a5e 70%, #0d5a37 100%)',
  silver: 'linear-gradient(135deg, #e3e8e5 0%, #c2cac6 38%, #929c97 70%, #6a7570 100%)',
}

function Front({ network, nameOnCard, pan, expMonth, expYear, reveal, variant }: Props) {
  return (
    <>
      <div className="absolute inset-0 translate-y-[3px] brightness-50">
        <CardArt variant={variant} bare />
      </div>
      {/* relative so it paints above the absolutely positioned edge copy */}
      <div className="relative">
        <CardArt variant={variant} bare title={`StrataPay card for ${nameOnCard}`} />
      </div>
      <div className="absolute inset-0 flex flex-col justify-end p-[6%] text-white [text-shadow:0_1px_6px_rgba(0,30,15,0.35)]">
        <p className="font-medium font-mono text-[6.2cqw] tracking-[0.08em]">{pan ? formatCardNumber(pan, !!reveal) : '•••• •••• •••• ••••'}</p>
        <div className="mt-[3%] flex items-end justify-between gap-3">
          <div className="flex min-w-0 gap-[7cqw]">
            <div className="min-w-0">
              <p className="text-[2.6cqw] uppercase tracking-[0.14em] opacity-75">Card holder</p>
              <p className="truncate font-medium text-[4.2cqw] uppercase tracking-[0.06em]">{nameOnCard || 'Your name'}</p>
            </div>
            <div className="shrink-0">
              <p className="text-[2.6cqw] uppercase tracking-[0.14em] opacity-75">Expires</p>
              <p className="font-medium font-mono text-[4.2cqw]">{expMonth && expYear ? formatExpiry(expMonth, expYear) : '••/••'}</p>
            </div>
          </div>
          <NetworkLogo network={network} className={network === 'visa' ? 'h-[6.5cqw] w-[20cqw]' : 'h-[12cqw] w-[17cqw]'} />
        </div>
      </div>
    </>
  )
}

function Back({ network, cvv, variant = 'mint' }: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[7.4cqw] ring-1 ring-white/40" style={{ background: BACK_BG[variant] }}>
      {/* magnetic stripe */}
      <div className="absolute inset-x-0 top-[11%] h-[19%] bg-[#0b1510]" />
      {/* signature strip with the security code */}
      <div className="absolute top-[40%] left-[6%] flex h-[14%] w-[64%] items-center justify-end overflow-hidden rounded-[1.4cqw] bg-[repeating-linear-gradient(135deg,#f4f8f5_0_2cqw,#e2e9e5_2cqw_4cqw)] pr-[3cqw]">
        <span className="rounded-[1cqw] bg-white px-[2.2cqw] py-[0.6cqw] font-medium font-mono text-[#0b1510] text-[4.6cqw] italic tracking-[0.12em]">{cvv ?? '•••'}</span>
      </div>
      <div className="absolute top-[41.5%] left-[73%] text-white">
        <p className="text-[2.4cqw] uppercase tracking-[0.14em] opacity-80">Security code</p>
        <p className="font-medium font-mono text-[5.2cqw] tracking-[0.1em]">CVV</p>
      </div>
      <p className="absolute top-[60%] left-[6%] max-w-[64%] text-[2.3cqw] text-white/85 leading-snug">
        Keep this code private. StrataPay will never ask for it outside the dashboard.
      </p>
      <div className="absolute right-[6%] bottom-[8%] left-[6%] flex items-end justify-between">
        <svg viewBox={MARK_VIEWBOX} className="h-[9cqw] w-[9cqw] text-white" aria-hidden="true">
          <MarkLayers color="currentColor" />
        </svg>
        <NetworkLogo network={network} className={network === 'visa' ? 'h-[6.5cqw] w-[20cqw]' : 'h-[12cqw] w-[17cqw]'} />
      </div>
    </div>
  )
}

/** The issued card. Front: holder, number, expiry, network. Back: security code. Flips in 3D. */
export function PaymentCard(props: Props) {
  const { flipped = false, frozen, className } = props
  return (
    <div className={cn('relative w-full @container [perspective:1600px]', className)} style={{ aspectRatio: '1630 / 1024' }}>
      <div
        className={cn('absolute inset-0 transition-[transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] motion-reduce:transition-none', frozen && 'grayscale-[0.85] brightness-75')}
        style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        <div className="absolute inset-0 [backface-visibility:hidden]" aria-hidden={flipped || undefined}>
          <Front {...props} />
        </div>
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]" aria-hidden={!flipped || undefined}>
          <Back {...props} />
        </div>
      </div>
      {frozen && (
        <span className="absolute top-[7%] right-[6%] rounded-full bg-black/55 px-3 py-1 font-medium text-white text-xs ring-1 ring-white/20 backdrop-blur">Frozen</span>
      )}
    </div>
  )
}
