import { useMemo } from 'react'

/** Static dotted sphere: dots on latitude rings, orthographic projection, tilted toward the viewer. */
export function DotGlobe({ size = 1000, className, style }: { size?: number; className?: string; style?: React.CSSProperties }) {
  const dots = useMemo(() => {
    const out: { x: number; y: number; r: number; o: number }[] = []
    const R = size * 0.46
    const tilt = (-18 * Math.PI) / 180
    for (let lat = -84; lat <= 84; lat += 4) {
      const phi = (lat * Math.PI) / 180
      const ring = Math.max(6, Math.round(Math.cos(phi) * 90))
      for (let k = 0; k < ring; k++) {
        const lam = (k / ring) * Math.PI * 2 + (lat % 8 === 0 ? 0 : Math.PI / ring)
        const x0 = Math.cos(phi) * Math.sin(lam)
        const y0 = Math.sin(phi)
        const z0 = Math.cos(phi) * Math.cos(lam)
        const y = y0 * Math.cos(tilt) - z0 * Math.sin(tilt)
        const z = y0 * Math.sin(tilt) + z0 * Math.cos(tilt)
        if (z <= 0) continue
        out.push({ x: size / 2 + x0 * R, y: size / 2 - y * R, r: 0.9 + z * 1.3, o: 0.15 + z * 0.75 })
      }
    }
    return out
  }, [size])

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className={className} style={style} aria-hidden="true">
      <defs>
        <radialGradient id="globe-rim" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.86" stopColor="#7fe3a8" stopOpacity="0" />
          <stop offset="0.97" stopColor="#c9f2d8" stopOpacity="0.28" />
          <stop offset="1" stopColor="#c9f2d8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={size * 0.47} fill="url(#globe-rim)" />
      <g fill="#e8fff0">
        {dots.map((d, i) => (
          <circle key={i} cx={d.x.toFixed(1)} cy={d.y.toFixed(1)} r={d.r.toFixed(2)} opacity={d.o.toFixed(2)} />
        ))}
      </g>
    </svg>
  )
}
