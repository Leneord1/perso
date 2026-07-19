/**
 * Local auth proxy + Cloudflare quick tunnel for Ollama.
 * Exposes Ollama only with Bearer OLLAMA_TUNNEL_SECRET.
 * Usage: npm run tunnel
 */
import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomBytes } from 'node:crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const statePath = resolve(root, '.tunnel', 'state.json')

const OLLAMA = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434'
const PROXY_PORT = Number(process.env.OLLAMA_TUNNEL_PORT || 11435)
const SECRET =
  process.env.OLLAMA_TUNNEL_SECRET ||
  randomBytes(24).toString('hex')

function findCloudflared() {
  const fromEnv = process.env.CLOUDFLARED_PATH
  if (fromEnv) return fromEnv
  // winget default install location
  const candidates = [
    'cloudflared',
    `${process.env.LOCALAPPDATA}\\Microsoft\\WinGet\\Links\\cloudflared.exe`,
    `${process.env.ProgramFiles}\\cloudflared\\cloudflared.exe`,
    'C:\\Program Files (x86)\\cloudflared\\cloudflared.exe',
  ]
  return candidates[0]
}

async function forward(req, res) {
  const auth = req.headers.authorization || ''
  const headerSecret = req.headers['x-tunnel-secret'] || ''
  const ok =
    auth === `Bearer ${SECRET}` || headerSecret === SECRET
  if (!ok) {
    res.writeHead(401, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Unauthorized' }))
    return
  }

  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const body = Buffer.concat(chunks)

  const target = new URL(req.url || '/', OLLAMA)
  let upstream
  try {
    upstream = await fetch(target, {
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
      },
      body: ['GET', 'HEAD'].includes(req.method || 'GET') ? undefined : body,
    })
  } catch (err) {
    res.writeHead(502, { 'Content-Type': 'application/json' })
    res.end(
      JSON.stringify({
        error: `Ollama unreachable at ${OLLAMA}: ${err instanceof Error ? err.message : 'error'}`,
      }),
    )
    return
  }

  const buf = Buffer.from(await upstream.arrayBuffer())
  res.writeHead(upstream.status, {
    'Content-Type': upstream.headers.get('content-type') || 'application/json',
  })
  res.end(buf)
}

function writeState(extra) {
  mkdirSync(resolve(root, '.tunnel'), { recursive: true })
  writeFileSync(
    statePath,
    JSON.stringify(
      {
        secret: SECRET,
        proxyPort: PROXY_PORT,
        ollama: OLLAMA,
        updatedAt: new Date().toISOString(),
        ...extra,
      },
      null,
      2,
    ),
  )
}

const server = createServer((req, res) => {
  forward(req, res).catch((err) => {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'proxy error' }))
  })
})

server.listen(PROXY_PORT, '127.0.0.1', () => {
  console.log(`[tunnel] auth proxy on http://127.0.0.1:${PROXY_PORT} → ${OLLAMA}`)
  writeState({ publicUrl: null })

  const bin = findCloudflared()
  const cf = spawn(
    bin,
    ['tunnel', '--url', `http://127.0.0.1:${PROXY_PORT}`, '--no-autoupdate'],
    { stdio: ['ignore', 'pipe', 'pipe'] },
  )

  let publicUrl = null
  const onChunk = (buf) => {
    const text = buf.toString()
    process.stderr.write(text)
    const match = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/)
    if (match && !publicUrl) {
      publicUrl = match[0]
      writeState({ publicUrl })
      console.log('')
      console.log('[tunnel] public URL:', publicUrl)
      console.log('[tunnel] set Vercel env:')
      console.log(`  OLLAMA_BASE_URL=${publicUrl}`)
      console.log(`  OLLAMA_TUNNEL_SECRET=${SECRET}`)
      console.log(`  OLLAMA_MODEL=llama3.1`)
      console.log('')
      console.log('[tunnel] state written to .tunnel/state.json')
      console.log('[tunnel] keep this process running while the site is live')
    }
  }

  cf.stdout.on('data', onChunk)
  cf.stderr.on('data', onChunk)

  cf.on('exit', (code) => {
    console.error(`[tunnel] cloudflared exited (${code})`)
    server.close()
    process.exit(code || 1)
  })

  const shutdown = () => {
    cf.kill()
    server.close()
    process.exit(0)
  }
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
})
