/**
 * Vercel serverless proxy → Ollama /api/chat via tunnel.
 * Env: OLLAMA_BASE_URL (required), OLLAMA_TUNNEL_SECRET (recommended), OLLAMA_MODEL
 */
const MAX_MESSAGES = 40
const MAX_CONTENT_CHARS = 4000

function parseBody(req) {
  try {
    if (typeof req.body === 'string') {
      return JSON.parse(req.body || '{}')
    }
    return req.body && typeof req.body === 'object' ? req.body : {}
  } catch {
    return null
  }
}

/** Allow only https remotes or local http loopback (dev). */
function isAllowedOllamaBase(base) {
  let url
  try {
    url = new URL(base)
  } catch {
    return false
  }
  if (url.protocol === 'https:') return true
  if (url.protocol !== 'http:') return false
  return url.hostname === '127.0.0.1' || url.hostname === 'localhost'
}

function sanitizeMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return null
  if (messages.length > MAX_MESSAGES) return null

  const cleaned = []
  for (const m of messages) {
    if (!m || typeof m !== 'object') return null
    const role = m.role
    const content = m.content
    if (role !== 'system' && role !== 'user' && role !== 'assistant') return null
    if (typeof content !== 'string') return null
    if (content.length > MAX_CONTENT_CHARS) return null
    cleaned.push({ role, content })
  }
  return cleaned
}

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const base = (process.env.OLLAMA_BASE_URL || '').replace(/\/$/, '')
  if (!base) {
    return res.status(503).json({
      error:
        'OLLAMA_BASE_URL is not set. Run `npm run tunnel`, then `npm run tunnel:sync`, and redeploy.',
    })
  }
  if (!isAllowedOllamaBase(base)) {
    return res.status(500).json({
      error: 'OLLAMA_BASE_URL must be https (or http://127.0.0.1 for local).',
    })
  }

  const body = parseBody(req)
  if (!body) {
    return res.status(400).json({ error: 'Invalid JSON body' })
  }

  const model = process.env.OLLAMA_MODEL || 'llama3.1'
  const messages = sanitizeMessages(body.messages)
  if (!messages) {
    return res.status(400).json({
      error: `messages must be a non-empty array (max ${MAX_MESSAGES}) of {role, content} with content ≤ ${MAX_CONTENT_CHARS} chars`,
    })
  }

  const headers = { 'Content-Type': 'application/json' }
  const secret = process.env.OLLAMA_TUNNEL_SECRET
  if (secret) {
    headers.Authorization = `Bearer ${secret}`
    headers['x-tunnel-secret'] = secret
  }

  let upstream
  try {
    upstream = await fetch(`${base}/api/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages,
        stream: false,
      }),
    })
  } catch (err) {
    return res.status(502).json({
      error: `Could not reach Ollama tunnel: ${err instanceof Error ? err.message : 'network error'}`,
    })
  }

  const text = await upstream.text()
  res.status(upstream.status)
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  return res.send(text)
}
