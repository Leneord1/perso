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

/**
 * Resolve pasted text or base64+filename into analyze input fields.
 * @returns {{ ok: true, fields: Record<string, unknown> } | { ok: false, error: string }}
 */
function resolveFileInput(body, {
  textKey,
  base64Key,
  filenameKey,
  textField,
  bufferField,
  filenameField,
  required,
}) {
  const text = body[textKey]
  if (typeof text === 'string' && text.trim()) {
    if (text.length > MAX_TEXT_CHARS) {
      return { ok: false, error: `${textKey} exceeds ${MAX_TEXT_CHARS} chars` }
    }
    return { ok: true, fields: { [textField]: text } }
  }

  if (body[base64Key] && body[filenameKey]) {
    const decoded = decodeBase64(body[base64Key], base64Key)
    if (decoded.error) return { ok: false, error: decoded.error }
    if (typeof body[filenameKey] !== 'string' || !body[filenameKey].trim()) {
      return { ok: false, error: `${filenameKey} is required with ${base64Key}` }
    }
    return {
      ok: true,
      fields: {
        [bufferField]: decoded.buffer,
        [filenameField]: body[filenameKey].trim(),
      },
    }
  }

  if (required) {
    return {
      ok: false,
      error: `Provide ${textKey} or ${base64Key} + ${filenameKey}`,
    }
  }
  return { ok: true, fields: {} }
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

  const resume = resolveFileInput(body, {
    textKey: 'resumeText',
    base64Key: 'resumeBase64',
    filenameKey: 'resumeFilename',
    textField: 'resumeText',
    bufferField: 'resumeBuffer',
    filenameField: 'resumeFilename',
    required: true,
  })
  if (!resume.ok) return res.status(400).json({ error: resume.error })

  const jd = resolveFileInput(body, {
    textKey: 'jdText',
    base64Key: 'jdBase64',
    filenameKey: 'jdFilename',
    textField: 'jdText',
    bufferField: 'jdBuffer',
    filenameField: 'jdFilename',
    required: false,
  })
  if (!jd.ok) return res.status(400).json({ error: jd.error })

  try {
    const report = await analyze({
      ...resume.fields,
      ...jd.fields,
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
