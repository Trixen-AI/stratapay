import type { ReactNode } from 'react'

// Flat scenes in the brand greens, one per use case. They fill their box (slice) like a cover photo would.
const C = { bg: '#0a1f15', bg2: '#0f3324', mid: '#157a4a', jade: '#3fae78', mint: '#7fe3a8', pale: '#c9f2d8', ink: '#05110b', white: '#f4f8f5' }

function Frame({ children, sky = C.bg2 }: { children: ReactNode; sky?: string }) {
  return (
    <svg viewBox="0 0 480 320" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="uc-lamp" cx="0.5" cy="0.15" r="0.8">
          <stop offset="0" stopColor={C.mint} stopOpacity="0.45" />
          <stop offset="1" stopColor={C.mint} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="480" height="320" fill={sky} />
      <rect width="480" height="320" fill="url(#uc-lamp)" />
      {children}
    </svg>
  )
}

const scenes: Record<string, () => ReactNode> = {
  team: () => (
    <Frame>
      <rect y="232" width="480" height="88" fill={C.bg} />
      {[150, 240, 330].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={150} r="26" fill={[C.pale, C.mint, C.jade][i]} />
          <path d={`M${x - 46} 236c4-40 22-58 46-58s42 18 46 58Z`} fill={[C.mid, C.jade, C.mint][i]} />
        </g>
      ))}
      <rect x="110" y="226" width="260" height="16" rx="6" fill={C.white} opacity="0.9" />
      <rect x="196" y="190" width="88" height="40" rx="6" fill={C.ink} />
      <circle cx="240" cy="210" r="5" fill={C.mint} />
    </Frame>
  ),
  art: () => (
    <Frame>
      <rect y="250" width="480" height="70" fill={C.bg} />
      <path d="M190 300 240 90l50 210" stroke={C.pale} strokeWidth="8" fill="none" strokeLinecap="round" />
      <rect x="160" y="100" width="160" height="128" rx="8" fill={C.white} />
      {/* the coin mascot being painted */}
      <circle cx="240" cy="166" r="40" fill={C.mint} />
      <circle cx="240" cy="166" r="30" fill="none" stroke={C.jade} strokeWidth="4" />
      <circle cx="228" cy="160" r="5" fill={C.ink} />
      <circle cx="252" cy="160" r="5" fill={C.ink} />
      <path d="M228 176q12 10 24 0" stroke={C.ink} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M346 200l40-60" stroke={C.pale} strokeWidth="6" strokeLinecap="round" />
      <circle cx="388" cy="136" r="8" fill={C.mint} />
    </Frame>
  ),
  servers: () => (
    <Frame sky={C.bg}>
      {[120, 210, 300].map((x) => (
        <g key={x}>
          <rect x={x} y="60" width="70" height="220" rx="6" fill={C.ink} stroke={C.mid} strokeWidth="2" />
          {[0, 1, 2, 3, 4, 5].map((r) => (
            <g key={r}>
              <rect x={x + 8} y={74 + r * 34} width="54" height="24" rx="3" fill={C.bg2} />
              <circle cx={x + 18} cy={86 + r * 34} r="3" fill={(r + x) % 3 ? C.mint : C.pale} />
              <rect x={x + 28} y={84 + r * 34} width="26" height="4" rx="2" fill={C.mid} />
            </g>
          ))}
        </g>
      ))}
    </Frame>
  ),
  ads: () => (
    <Frame>
      <rect y="250" width="480" height="70" fill={C.bg} />
      <path d="M150 150h40l110-60v160l-110-60h-40Z" fill={C.pale} />
      <rect x="150" y="146" width="40" height="64" rx="6" fill={C.mint} />
      <path d="M176 210l14 50h20l-8-50" fill={C.jade} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${322 + i * 26} ${120 - i * 14}q${30 + i * 8} ${50 + i * 14} 0 ${100 + i * 28}`} stroke={C.mint} strokeOpacity={0.9 - i * 0.25} strokeWidth="7" fill="none" strokeLinecap="round" />
      ))}
    </Frame>
  ),
  merch: () => (
    <Frame>
      <rect y="262" width="480" height="58" fill={C.bg} />
      <path d="M170 84l40-18h60l40 18 40 50-34 22-16-18v138H180V138l-16 18-34-22Z" fill={C.mint} />
      <path d="M210 66q30 30 60 0" fill="none" stroke={C.jade} strokeWidth="8" />
      <circle cx="240" cy="168" r="30" fill={C.ink} />
      <circle cx="240" cy="168" r="14" fill={C.mint} />
      <circle cx="240" cy="168" r="7" fill={C.ink} />
    </Frame>
  ),
  you: () => (
    <Frame>
      <rect y="210" width="480" height="110" fill={C.mid} />
      <ellipse cx="240" cy="236" rx="78" ry="22" fill={C.white} />
      <ellipse cx="240" cy="232" rx="46" ry="12" fill={C.jade} />
      <rect x="338" y="150" width="26" height="70" rx="6" fill={C.pale} opacity="0.85" />
      <rect x="120" y="170" width="12" height="50" rx="4" fill={C.white} />
      <path d="M126 150q-8 12 0 20 8-8 0-20Z" fill={C.mint} />
      <circle cx="126" cy="160" r="40" fill={C.mint} opacity="0.12" />
    </Frame>
  ),
}

export function UseCaseScene({ k }: { k: string }) {
  const S = scenes[k]
  return S ? <S /> : null
}
