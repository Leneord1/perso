/**
 * Vercel serverless resume ATS analyzer.
 * Env: GROQ_API_KEY (optional for JD semantic match), GROQ_MODEL (optional)
 */

import { analyze } from './lib/resume/analyze.js'

const MAX_TEXT_CHARS = 200_000
const MAX_FILE_BYTES = 2 * 1024 * 1024

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

/** Decode base64 payload; return null if invalid or too large. */
function decodeBase64(value, label) {
  if (typeof value !== 'string' || !value.trim()) {
    return { error: `${label} must be a non-empty base64 string` }
  }
  let buf
  try {
    buf = Buffer.from(value, 'base64')
  } catch {
    return { error: `Invalid base64 for ${label}` }
  }
  if (!buf.length) return { error: `${label} decoded to empty buffer` }
  if (buf.length > MAX_FILE_BYTES) {
    return { error: `${label} exceeds ${MAX_FILE_BYTES} byte limit` }
  }
  return { buffer: buf }
}

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = parseBody(req)
  if (!body) {
    return res.status(400).json({ error: 'Invalid JSON body' })
  }

  /** @type {{ resumeText?: string, resumeBuffer?: Buffer, resumeFilename?: string, jdText?: string, jdBuffer?: Buffer, jdFilename?: string }} */
  const input = {}

  if (typeof body.resumeText === 'string' && body.resumeText.trim()) {
    if (body.resumeText.length > MAX_TEXT_CHARS) {
      return res.status(400).json({ error: `resumeText exceeds ${MAX_TEXT_CHARS} chars` })
    }
    input.resumeText = body.resumeText
  } else if (body.resumeBase64 && body.resumeFilename) {
    const decoded = decodeBase64(body.resumeBase64, 'resumeBase64')
    if (decoded.error) return res.status(400).json({ error: decoded.error })
    if (typeof body.resumeFilename !== 'string' || !body.resumeFilename.trim()) {
      return res.status(400).json({ error: 'resumeFilename is required with resumeBase64' })
    }
    input.resumeBuffer = decoded.buffer
    input.resumeFilename = body.resumeFilename.trim()
  } else {
    return res.status(400).json({
      error: 'Provide resumeText or resumeBase64 + resumeFilename',
    })
  }

  if (typeof body.jdText === 'string' && body.jdText.trim()) {
    if (body.jdText.length > MAX_TEXT_CHARS) {
      return res.status(400).json({ error: `jdText exceeds ${MAX_TEXT_CHARS} chars` })
    }
    input.jdText = body.jdText
  } else if (body.jdBase64 && body.jdFilename) {
    const decoded = decodeBase64(body.jdBase64, 'jdBase64')
    if (decoded.error) return res.status(400).json({ error: decoded.error })
    if (typeof body.jdFilename !== 'string' || !body.jdFilename.trim()) {
      return res.status(400).json({ error: 'jdFilename is required with jdBase64' })
    }
    input.jdBuffer = decoded.buffer
    input.jdFilename = body.jdFilename.trim()
  }

  try {
    const report = await analyze({
      ...input,
      groqApiKey: process.env.GROQ_API_KEY,
      groqModel: process.env.GROQ_MODEL,
    })
    return res.status(200).json(report)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Resume analysis failed'
    const status = /unsupported format/i.test(message) ? 400 : 500
    return res.status(status).json({ error: message })
  }
}
