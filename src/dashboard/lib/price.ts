const SOL_MINT = 'So11111111111111111111111111111111111111112'

/** Live SOL/USD from Jupiter's public price API. */
export async function fetchSolPrice(): Promise<number> {
  const res = await fetch(`https://lite-api.jup.ag/price/v3?ids=${SOL_MINT}`)
  if (!res.ok) throw new Error(`Price request failed (${res.status})`)
  const json = (await res.json()) as Record<string, { usdPrice?: number }>
  const price = json[SOL_MINT]?.usdPrice
  if (!price) throw new Error('No SOL price returned')
  return price
}
