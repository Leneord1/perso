import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const nextNavigationShim = path.resolve(__dirname, 'src/shims/next-navigation.js')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // @vercel/speed-insights/next expects Next; Vite's optional-peer stub lacks these exports.
      'next/navigation.js': nextNavigationShim,
      'next/navigation': nextNavigationShim,
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    globals: false,
    css: true,
  },
})
