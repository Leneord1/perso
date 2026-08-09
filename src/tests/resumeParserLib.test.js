import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { parseResume, parseJd } from '../../api/lib/resume/parser.js'
import { scoreAts } from '../../api/lib/resume/atsScorer.js'
import { keywordOverlap } from '../../api/lib/resume/jdMatch.js'
import { analyze } from '../../api/lib/resume/analyze.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const resumeTxt = readFileSync(join(__dirname, 'fixtures/resume.txt'), 'utf8')
const jdTxt = readFileSync(join(__dirname, 'fixtures/jd.txt'), 'utf8')

describe('resume parser', () => {
  it('parses sample resume sections and contacts', () => {
    const parsed = parseResume(resumeTxt)
    expect(parsed.contacts.has_email).toBe(true)
    expect(parsed.contacts.email).toMatch(/jane\.doe@email\.com/i)
    expect(parsed.contacts.has_phone).toBe(true)
    expect(parsed.sections_present).toEqual(
      expect.arrayContaining(['summary', 'experience', 'education', 'skills', 'projects']),
    )
    expect(parsed.sections_missing).toEqual([])
    expect(parsed.skills.length).toBeGreaterThanOrEqual(5)
    expect(parsed.bullet_count).toBeGreaterThanOrEqual(3)
  })

  it('parses sample JD skill tokens', () => {
    const jd = parseJd(jdTxt)
    expect(jd.skill_tokens.length).toBeGreaterThan(0)
    const lower = jd.skill_tokens.map((t) => t.toLowerCase())
    expect(lower.some((t) => t.includes('python'))).toBe(true)
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
})

describe('keyword overlap', () => {
  it('finds overlap between resume and JD skills', () => {
    const parsed = parseResume(resumeTxt)
    const jd = parseJd(jdTxt)
    const [score, missing] = keywordOverlap(parsed.skills, jd.skill_tokens)
    expect(score).toBeGreaterThan(0)
    expect(Array.isArray(missing)).toBe(true)
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
})
