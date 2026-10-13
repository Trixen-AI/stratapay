import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  // Solana web3.js and the pump.fun SDK expect Node's Buffer/process in the browser.
  plugins: [react(), tailwindcss(), nodePolyfills({ include: ['buffer', 'process', 'util', 'stream', 'events'], globals: { Buffer: true, process: true, global: true } })],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
})
