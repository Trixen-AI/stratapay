import { useEffect, useRef } from 'react'

type Props = { width: number; height: number; className?: string; gap?: number }

/** Flickering dot grid drawn on a canvas, used under the soft glows. Pauses offscreen and for reduced motion. */
export function DotField({ width, height, className, gap = 4 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    const cols = Math.ceil(width / gap)
    const rows = Math.ceil(height / gap)
    const phase = Array.from({ length: cols * rows }, (_, i) => ((i * 9301 + 49297) % 233280) / 233280)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let visible = true
    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height)
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const p = phase[y * cols + x]
          const a = reduce ? 0.55 : 0.25 + 0.75 * Math.abs(Math.sin(t / 900 + p * 12))
          ctx.fillStyle = `rgba(255,255,255,${a})`
          ctx.fillRect(x * gap, y * gap, 1, 1)
        }
      }
      if (!reduce && visible) raf = requestAnimationFrame(draw)
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      cancelAnimationFrame(raf)
      if (visible) raf = requestAnimationFrame(draw)
    })
    io.observe(canvas)
    raf = requestAnimationFrame(draw)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [width, height, gap])

  return <canvas ref={ref} className={className} style={{ width, height }} aria-hidden="true" />
}
