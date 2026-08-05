import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const nextNavigationShim = path.resolve(__dirname, 'src/shims/next-navigation.js')

/** Add Vercel-style res.status / res.json / res.send for local middleware. */
function withVercelHelpers(res) {
  if (typeof res.status === 'function' && typeof res.json === 'function') return res

  res.status = function status(code) {
    res.statusCode = code
    return res
  }
  res.json = function json(obj) {
    if (!res.getHeader('Content-Type')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
    }
    res.end(JSON.stringify(obj))
    return res
  }
  res.send = function send(body) {
    let contentType = res.getHeader('Content-Type')
    if (typeof body === 'object' && body !== null && !Buffer.isBuffer(body)) {
      if (!contentType) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
      }
      res.end(JSON.stringify(body))
    } else {
      res.end(body)
    }
    return res
  }
  return res
}

/** Mount /api/chat via api/chat.js during Vite server / preview. */
function groqChatApiPlugin() {
  async function mount(middlewares) {
    middlewares.use(async (req, res, next) => {
      const url = req.url?.split('?')[0]
      if (url !== '/api/chat') {
        next()
        return
      }
      try {
        const { default: handler } = await import('./api/chat.js')
        const chunks = []
        for await (const chunk of req) chunks.push(chunk)
        req.body = Buffer.concat(chunks).toString('utf8')
        await handler(req, withVercelHelpers(res))
      } catch (err) {
        if (res.headersSent) return
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(
          JSON.stringify({
            error: err instanceof Error ? err.message : 'chat proxy error',
          }),
        )
      }
    })
  }

  return {
    name: 'groq-chat-api',
    // Before Vite internals so /api/chat is not treated as SPA
    configureServer(server) {
      mount(server.middlewares)
    },
    configurePreviewServer(server) {
      mount(server.middlewares)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.GROQ_API_KEY) process.env.GROQ_API_KEY = env.GROQ_API_KEY
  if (env.GROQ_MODEL) process.env.GROQ_MODEL = env.GROQ_MODEL

  return {
    plugins: [react(), groqChatApiPlugin()],
    resolve: {
      alias: {
        // @vercel/speed-insights/next expects Next; Vite's optional-peer stub lacks these exports.
        'next/navigation.js': nextNavigationShim,
        'next/navigation': nextNavigationShim,
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: './src/tests/setupTests.js',
      globals: false,
      css: true,
      exclude: ['**/node_modules/**', '**/dist/**', '**/chatbot/**'],
    },
  }
})
