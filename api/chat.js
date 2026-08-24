/**
 * Vercel serverless proxy → Groq chat completions.
 * Env: GROQ_API_KEY (required), GROQ_MODEL (optional)
 */
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const DEFAULT_MODEL = 'openai/gpt-oss-20b'
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

  const apiKey = (process.env.GROQ_API_KEY || '').trim()
  if (!apiKey) {
    return res.status(503).json({
      error:
        'GROQ_API_KEY is not set. Add it in Vercel project env (Production + Preview), or in .env.local for local dev.',
    })
  }

  const body = parseBody(req)
  if (!body) {
    return res.status(400).json({ error: 'Invalid JSON body' })
  }

  const model = (process.env.GROQ_MODEL || DEFAULT_MODEL).trim()
  const messages = sanitizeMessages(body.messages)
  if (!messages) {
    return res.status(400).json({
      error: `messages must be a non-empty array (max ${MAX_MESSAGES}) of {role, content} with content ≤ ${MAX_CONTENT_CHARS} chars`,
    })
  }

  let upstream
  try {
    upstream = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
      }),
    })
  } catch (err) {
    return res.status(502).json({
      error: `Could not reach Groq: ${err instanceof Error ? err.message : 'network error'}`,
    })
  }

  const text = await upstream.text()
  let data
  try {
    data = JSON.parse(text)
  } catch {
    res.status(upstream.status)
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    return res.send(JSON.stringify({ error: text.slice(0, 300) || 'Invalid upstream response' }))
  }

  if (!upstream.ok) {
    const detail =
      data?.error?.message ||
      (typeof data?.error === 'string' ? data.error : null) ||
      text.slice(0, 300)
    return res.status(upstream.status).json({ error: detail })
  }

  const content = data?.choices?.[0]?.message?.content ?? ''
  // Keep Ollama-shaped payload so existing clients keep working
  return res.status(200).json({
    message: {
      role: 'assistant',
      content,
    },
  })
}
