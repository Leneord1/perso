import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import handler from '../../api/resume.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const resumeTxt = readFileSync(join(__dirname, 'fixtures/resume.txt'), 'utf8')
const jdTxt = readFileSync(join(__dirname, 'fixtures/jd.txt'), 'utf8')

/** Minimal Vercel-style req/res doubles. */
function mockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(key, value) {
      this.headers[key] = value
    },
    getHeader(key) {
      return this.headers[key]
    },
    status(code) {
      this.statusCode = code
      return this
    },
    json(obj) {
      this.body = obj
      return this
    },
  }
  return res
}

describe('api/resume handler', () => {
  const prevKey = process.env.GROQ_API_KEY

  beforeEach(() => {
    delete process.env.GROQ_API_KEY
  })

  afterEach(() => {
    if (prevKey === undefined) delete process.env.GROQ_API_KEY
    else process.env.GROQ_API_KEY = prevKey
  })

  it('rejects non-POST methods', async () => {
    const res = mockRes()
    await handler({ method: 'GET', body: {} }, res)
    expect(res.statusCode).toBe(405)
    expect(res.body.error).toMatch(/method not allowed/i)
    expect(res.headers.Allow).toBe('POST')
  })

  it('rejects invalid JSON body', async () => {
    const res = mockRes()
    await handler({ method: 'POST', body: '{' }, res)
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toMatch(/invalid json/i)
  })

  it('requires resume text or file', async () => {
    const res = mockRes()
    await handler({ method: 'POST', body: {} }, res)
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toMatch(/resumeText|resumeBase64/i)
  })

  it('analyzes pasted resume text', async () => {
    const res = mockRes()
    await handler({ method: 'POST', body: { resumeText: resumeTxt } }, res)
    expect(res.statusCode).toBe(200)
    expect(res.body.ats.score).toBeGreaterThanOrEqual(85)
    expect(res.body.jd_match).toBeNull()
    expect(res.headers['Cache-Control']).toBe('no-store')
  })

  it('analyzes resume with optional JD text', async () => {
    const res = mockRes()
    await handler(
      { method: 'POST', body: { resumeText: resumeTxt, jdText: jdTxt } },
      res,
    )
    expect(res.statusCode).toBe(200)
    expect(res.body.jd_match).not.toBeNull()
    expect(res.body.jd_match.score).toBeGreaterThan(0)
  })

  it('accepts base64 resume payload', async () => {
    const res = mockRes()
    await handler(
      {
        method: 'POST',
        body: {
          resumeBase64: Buffer.from(resumeTxt, 'utf8').toString('base64'),
          resumeFilename: 'resume.txt',
        },
      },
      res,
    )
    expect(res.statusCode).toBe(200)
    expect(res.body.resume_path).toBe('resume.txt')
    expect(res.body.ats.score).toBeGreaterThanOrEqual(85)
  })

  it('rejects unsupported uploaded format', async () => {
    const res = mockRes()
    await handler(
      {
        method: 'POST',
        body: {
          resumeBase64: Buffer.from('not-a-real-file').toString('base64'),
          resumeFilename: 'resume.xlsx',
        },
      },
      res,
    )
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toMatch(/unsupported format/i)
  })
})
