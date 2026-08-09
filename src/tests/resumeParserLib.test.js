import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { parseResume, parseJd } from '../../api/lib/resume/parser.js'
import { scoreAts } from '../../api/lib/resume/atsScorer.js'
import { keywordOverlap, scoreJdMatch } from '../../api/lib/resume/jdMatch.js'
import { analyze } from '../../api/lib/resume/analyze.js'
import { extractFromText, extractFromBuffer } from '../../api/lib/resume/extract.js'
import { buildReport } from '../../api/lib/resume/report.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const resumeTxt = readFileSync(join(__dirname, 'fixtures/resume.txt'), 'utf8')
const jdTxt = readFileSync(join(__dirname, 'fixtures/jd.txt'), 'utf8')

describe('resume parser', () => {
  it('parses sample resume sections and contacts', () => {
    const parsed = parseResume(resumeTxt)
    expect(parsed.contacts.has_email).toBe(true)
    expect(parsed.contacts.email).toMatch(/jane\.doe@email\.com/i)
    expect(parsed.contacts.has_phone).toBe(true)
    expect(parsed.contacts.linkedin).toMatch(/linkedin\.com\/in\/janedoe/i)
    expect(parsed.contacts.github).toMatch(/github\.com\/janedoe/i)
    expect(parsed.sections_present).toEqual(
      expect.arrayContaining(['summary', 'experience', 'education', 'skills', 'projects']),
    )
    expect(parsed.sections_missing).toEqual([])
    expect(parsed.skills.length).toBeGreaterThanOrEqual(5)
    expect(parsed.bullet_count).toBeGreaterThanOrEqual(3)
    expect(parsed.word_count).toBeGreaterThan(50)
  })

  it('handles empty input safely', () => {
    const parsed = parseResume('')
    expect(parsed.contacts.has_email).toBe(false)
    expect(parsed.sections_missing).toEqual(
      expect.arrayContaining(['experience', 'education', 'skills']),
    )
    expect(parsed.skills).toEqual([])
    expect(parsed.bullet_count).toBe(0)
  })

  it('parses sample JD skill tokens', () => {
    const jd = parseJd(jdTxt)
    expect(jd.skill_tokens.length).toBeGreaterThan(0)
    const lower = jd.skill_tokens.map((t) => t.toLowerCase())
    expect(lower.some((t) => t.includes('python'))).toBe(true)
    expect(jd.requirement_lines.length).toBeGreaterThan(0)
  })

  it('skips JD noise tokens', () => {
    const jd = parseJd('Requirements:\n- Strong communication skills\n- Python\n')
    const lower = jd.skill_tokens.map((t) => t.toLowerCase())
    expect(lower).not.toContain('strong communication skills')
    expect(lower.some((t) => t.includes('python'))).toBe(true)
  })
})

describe('extract', () => {
  it('wraps plain text and warns on empty', () => {
    const ok = extractFromText('Hello resume', 'txt')
    expect(ok.text).toBe('Hello resume')
    expect(ok.format).toBe('txt')
    expect(ok.warnings).toEqual([])

    const empty = extractFromText('   ')
    expect(empty.warnings.some((w) => /little or no extractable/i.test(w))).toBe(true)
  })

  it('extracts utf8 text buffers by extension', async () => {
    const buf = Buffer.from(resumeTxt, 'utf8')
    const doc = await extractFromBuffer(buf, 'resume.txt')
    expect(doc.format).toBe('txt')
    expect(doc.text).toContain('Jane Doe')
    expect(doc.warnings).toEqual([])
  })

  it('rejects unsupported formats', async () => {
    await expect(extractFromBuffer(Buffer.from('x'), 'resume.xlsx')).rejects.toThrow(
      /unsupported format/i,
    )
  })
})

describe('ats scorer', () => {
  it('scores a well-formed sample resume highly', () => {
    const parsed = parseResume(resumeTxt)
    const ats = scoreAts(parsed, [])
    expect(ats.score).toBeGreaterThanOrEqual(85)
    expect(ats.sections_missing).toEqual([])
    expect(ats.skill_count).toBeGreaterThan(0)
  })

  it('penalizes missing email and sections', () => {
    const parsed = parseResume('Just a name\n\nProjects\n- Built a thing\n')
    const ats = scoreAts(parsed, [])
    expect(ats.score).toBeLessThan(80)
    expect(ats.findings.some((f) => f.code === 'missing_email')).toBe(true)
  })

  it('penalizes extractability warnings', () => {
    const parsed = parseResume(resumeTxt)
    const ats = scoreAts(parsed, ['PDF has little or no extractable text (may be image-only)'])
    expect(ats.score).toBeLessThan(scoreAts(parsed, []).score)
    expect(ats.findings.some((f) => f.code === 'extractability')).toBe(true)
  })

  it('sorts findings by severity', () => {
    const parsed = parseResume('Short\n')
    const ats = scoreAts(parsed, ['image-only PDF'])
    const ranks = { high: 0, medium: 1, low: 2 }
    for (let i = 1; i < ats.findings.length; i += 1) {
      expect(ranks[ats.findings[i].severity] ?? 9).toBeGreaterThanOrEqual(
        ranks[ats.findings[i - 1].severity] ?? 9,
      )
    }
  })
})

describe('keyword overlap', () => {
  it('finds overlap between resume and JD skills', () => {
    const parsed = parseResume(resumeTxt)
    const jd = parseJd(jdTxt)
    const [score, missing] = keywordOverlap(parsed.skills, jd.skill_tokens)
    expect(score).toBeGreaterThan(0)
    expect(Array.isArray(missing)).toBe(true)
  })

  it('returns zero when JD skills empty', () => {
    expect(keywordOverlap(['Python'], [])).toEqual([0, []])
  })
})

describe('scoreJdMatch', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('uses keyword-only when Groq key absent', async () => {
    const parsed = parseResume(resumeTxt)
    const jd = parseJd(jdTxt)
    const match = await scoreJdMatch(parsed, jd, {})
    expect(match.model).toMatch(/keyword/i)
    expect(match.score).toBeGreaterThan(0)
    expect(match.keyword_overlap).toBeGreaterThan(0)
    expect(match.findings.some((f) => f.code === 'missing_jd_skill')).toBe(true)
  })

  it('fuses Groq semantic score when key present', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        text: async () =>
          JSON.stringify({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    semantic_similarity: 0.9,
                    weak_jd_lines: ['Need Kubernetes'],
                    missing_skills: ['Kubernetes'],
                  }),
                },
              },
            ],
          }),
      })),
    )

    const parsed = parseResume(resumeTxt)
    const jd = parseJd(jdTxt)
    const match = await scoreJdMatch(parsed, jd, { apiKey: 'test-key', model: 'llama-test' })
    expect(match.model).toBe('llama-test')
    expect(match.semantic_similarity).toBe(0.9)
    expect(match.missing_skills).toEqual(expect.arrayContaining(['Kubernetes']))
    expect(match.findings.some((f) => f.code === 'weak_jd_alignment')).toBe(true)
    expect(fetch).toHaveBeenCalledOnce()
  })

  it('falls back when Groq fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, text: async () => 'down' })))
    const parsed = parseResume(resumeTxt)
    const jd = parseJd(jdTxt)
    const match = await scoreJdMatch(parsed, jd, { apiKey: 'test-key' })
    expect(match.model).toMatch(/groq unavailable/i)
    expect(match.score).toBeGreaterThan(0)
  })
})

describe('buildReport', () => {
  it('merges ATS and JD findings', () => {
    const parsed = parseResume(resumeTxt)
    const ats = scoreAts(parsed, [])
    const report = buildReport({
      resumePath: 'pasted-resume.txt',
      formatName: 'txt',
      extractWarnings: [],
      parsed,
      ats,
      jdMatch: {
        score: 70,
        semantic_similarity: 0,
        keyword_overlap: 0.7,
        missing_skills: ['Go'],
        weak_jd_lines: [],
        model: 'keyword-only',
        findings: [
          {
            code: 'missing_jd_skill',
            severity: 'high',
            message: 'JD skill not clearly present: Go',
            fix: 'Add Go',
          },
        ],
      },
      jdPath: 'pasted-jd.txt',
    })

    expect(report.resume_path).toBe('pasted-resume.txt')
    expect(report.jd_path).toBe('pasted-jd.txt')
    expect(report.ats.score).toBe(ats.score)
    expect(report.jd_match.score).toBe(70)
    expect(report.recommendations.length).toBeGreaterThan(0)
    expect(report.skills.length).toBeGreaterThan(0)
  })

  it('omits jd_match when null', () => {
    const parsed = parseResume(resumeTxt)
    const ats = scoreAts(parsed, [])
    const report = buildReport({
      resumePath: 'r.txt',
      formatName: 'txt',
      extractWarnings: [],
      parsed,
      ats,
      jdMatch: null,
      jdPath: null,
    })
    expect(report.jd_match).toBeNull()
    expect(report.jd_path).toBeNull()
  })
})

describe('analyze pipeline', () => {
  it('returns ATS report for pasted resume without Groq', async () => {
    const report = await analyze({ resumeText: resumeTxt })
    expect(report.ats.score).toBeGreaterThanOrEqual(85)
    expect(report.jd_match).toBeNull()
    expect(report.skills.length).toBeGreaterThan(0)
  })

  it('returns keyword JD match when Groq key absent', async () => {
    const report = await analyze({
      resumeText: resumeTxt,
      jdText: jdTxt,
    })
    expect(report.jd_match).not.toBeNull()
    expect(report.jd_match.score).toBeGreaterThan(0)
    expect(String(report.jd_match.model)).toMatch(/keyword/i)
  })

  it('analyzes resume buffer input', async () => {
    const report = await analyze({
      resumeBuffer: Buffer.from(resumeTxt, 'utf8'),
      resumeFilename: 'jane.txt',
    })
    expect(report.resume_path).toBe('jane.txt')
    expect(report.ats.score).toBeGreaterThanOrEqual(85)
  })

  it('throws when resume input missing', async () => {
    await expect(analyze({})).rejects.toThrow(/provide resumeText/i)
  })
})
