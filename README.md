# StrataPay

The card for coin creators. Turn pump.fun creator fees into spending power. Fund your people, your project, or yourself.

Live site: https://stratafin.org

- `/` marketing site
- `/app` dashboard: connect a Solana wallet (Reown AppKit), get a card, claim pump.fun creator fees, pay your team

## Stack

Vite, React 19, TypeScript, Tailwind CSS 4, Motion, Base UI, React Router, TanStack Query, Reown AppKit (Solana), `@solana/web3.js`, and pump.fun's official `@pump-fun/pump-sdk` for creator fees.

## Run locally

```bash
npm install
cp .env.example .env   # then fill in the values below
npm run dev
```

## Environment variables

| Variable | Required | What it is |
|---|---|---|
| `VITE_REOWN_PROJECT_ID` | Yes | Project ID from https://dashboard.reown.com. Without it `/app` shows setup steps instead of the dashboard. |
| `VITE_SOLANA_RPC_URL` | Recommended | Solana mainnet RPC URL. Use a provider that supports `getProgramAccounts` (for example Helius) so a wallet's pump.fun coins are found instantly. If empty, Reown's RPC is used. |

Both values are built into the browser bundle (that is how `VITE_` variables work). Restrict them to your domain:

- Reown dashboard: add `https://stratafin.org` (and any preview domain you use) to the project's allowed domains.
- RPC provider (Helius etc.): restrict the API key to `stratafin.org`.

## Deploy on Vercel

1. Import this repository in Vercel. `vercel.json` sets the Vite build (`npm run build`, output `dist`), SPA routing, caching, security headers and `noindex` for `/app`.
2. In Project Settings > Environment Variables, add `VITE_REOWN_PROJECT_ID` and `VITE_SOLANA_RPC_URL` for Production (and Preview if you use previews), then redeploy.
3. In Project Settings > Domains, add `stratafin.org` and `www.stratafin.org`. `www` redirects to the apex domain.

## Brand assets

`npm run build:brand` regenerates the logo files in `public/brand`, the favicon, the app icons and the Open Graph image from `scripts/build-logo.mjs` and `scripts/build-meta.mjs` (Geist font, SIL OFL, in `scripts/fonts`).

## Notes

- Cards, linked coins and people are stored in the browser per wallet (localStorage). There is no backend yet, so records do not sync across devices.
- Card numbers and security codes are generated in the app; they are not connected to a card issuer.
- StrataPay is an independent project and is not affiliated with pump.fun, Solana, Visa or Mastercard.
