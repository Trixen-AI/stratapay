// Renders the SEO / app-icon images from the brand files (run after build-logo.mjs):
//   public/og-image.png            1200 x 630 share card (Open Graph, X)
//   public/apple-touch-icon.png    180 x 180
//   public/icon-192.png, public/icon-512.png   web app manifest icons
//   public/favicon-32.png          PNG fallback next to favicon.svg
// Run: node scripts/build-meta.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pub = (f) => path.join(root, 'public', f)
const font = path.join(root, 'scripts/fonts/Geist-Medium.ttf')

const BRAND = { bg: '#030806', ink: '#f4f8f5', muted: '#b9c2bc', mint: '#7fe3a8' }

const inner = (svg) => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
const lockup = fs.readFileSync(pub('brand/logo.svg'), 'utf8')
const lockupViewBox = /viewBox="([^"]+)"/.exec(lockup)[1]
const favicon = fs.readFileSync(pub('favicon.svg'), 'utf8')

const render = (svg, width, file) => {
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: width }, font: { fontFiles: [font], loadSystemFonts: false, defaultFontFamily: 'Geist' } })
    .render()
    .asPng()
  fs.writeFileSync(pub(file), png)
  console.log('wrote', file)
}

// ---- share image ----
const card = `
  <defs>
    <linearGradient id="c" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#b9f3cf"/><stop offset="0.38" stop-color="#6fdc9d"/>
      <stop offset="0.7" stop-color="#1f9a5e"/><stop offset="1" stop-color="#0d5a37"/>
    </linearGradient>
    <radialGradient id="g" cx="0.5" cy="1" r="0.8">
      <stop offset="0" stop-color="#1f9a5e" stop-opacity="0.55"/><stop offset="1" stop-color="#030806" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="${BRAND.bg}"/>
  <rect width="1200" height="630" fill="url(#g)"/>
  <g transform="translate(700 150) rotate(-10 200 126)">
    <rect width="420" height="264" rx="30" fill="url(#c)"/>
    <rect x="1" y="1" width="418" height="262" rx="29" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="2"/>
    <rect x="330" y="96" width="50" height="40" rx="8" fill="#e8eeea"/>
    <text x="30" y="226" font-family="Geist" font-size="22" fill="#fff" letter-spacing="4">•••• 4207</text>
    <svg x="30" y="28" width="200" height="${(200 * Number(lockupViewBox.split(' ')[3])) / Number(lockupViewBox.split(' ')[2])}" viewBox="${lockupViewBox}">${inner(lockup).replace(/fill="#7fe3a8"/g, 'fill="#ffffff"')}</svg>
  </g>`
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  ${card}
  <svg x="80" y="76" width="240" height="${(240 * Number(lockupViewBox.split(' ')[3])) / Number(lockupViewBox.split(' ')[2])}" viewBox="${lockupViewBox}">${inner(lockup)}</svg>
  <text x="80" y="300" font-family="Geist" font-size="76" fill="${BRAND.ink}" letter-spacing="-3">The card for</text>
  <text x="80" y="384" font-family="Geist" font-size="76" fill="${BRAND.ink}" letter-spacing="-3">coin creators</text>
  <text x="80" y="450" font-family="Geist" font-size="28" fill="${BRAND.muted}">Turn creator fees into spending power.</text>
  <text x="80" y="550" font-family="Geist" font-size="24" fill="${BRAND.mint}">stratafin.org</text>
</svg>`
render(og, 1200, 'og-image.png')

// ---- icons: the favicon artwork (mark on the brand tile) at each size ----
for (const [size, file] of [[180, 'apple-touch-icon.png'], [192, 'icon-192.png'], [512, 'icon-512.png'], [32, 'favicon-32.png']]) {
  render(favicon, size, file)
}
