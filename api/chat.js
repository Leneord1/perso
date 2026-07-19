import process from "prop-types/prop-types.js";

export async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({error: 'Method not allowed'})
  }

  const base = (process.env.OLLAMA_BASE_URL || '').replace(/\/$/, '')
  if (!base) {
    return res.status(503).json({
      error:
          'OLLAMA_BASE_URL is not set. Run `npm run tunnel`, then `npm run tunnel:sync`, and redeploy.',
    })
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  const model = process.env.OLLAMA_MODEL || body.model || 'llama3.1'
  const messages = body.messages

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({error: 'messages array is required'})
  }

  const headers = {'Content-Type': 'application/json'}
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
  res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json')
  return res.send(text)
}
