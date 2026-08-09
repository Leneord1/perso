/**
 * JD match: keyword overlap + optional Groq semantic score (replaces MiniLM).
 */

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const DEFAULT_MODEL = 'llama-3.1-8b-instant'

/**
 * Normalize skill token for overlap checks.
 * @param {string} s
 */
function norm(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9+#.]/g, '')
}

/** True when JD skill key matches any resume skill (exact or substring). */
function skillMatches(resumeSet, key) {
  if (resumeSet.has(key)) return true
  for (const r of resumeSet) {
    if (r.length > 2 && (key.includes(r) || r.includes(key))) return true
  }
  return false
}

/**
 * Token overlap score and missing JD skill terms.
 * @param {string[]} resumeSkills
 * @param {string[]} jdSkills
 * @returns {[number, string[]]}
 */
export function keywordOverlap(resumeSkills, jdSkills) {
  if (!jdSkills.length) return [0, []]

  const resumeSet = new Set(
    resumeSkills.map(norm).filter(Boolean),
  )
  const missing = []
  let hits = 0
  for (const skill of jdSkills) {
    const key = norm(skill)
    if (!key) continue
    if (skillMatches(resumeSet, key)) hits += 1
    else missing.push(skill)
  }
  const total = Math.max(1, jdSkills.length)
  return [hits / total, missing]
}

/**
 * Call Groq for a semantic similarity estimate and weak JD lines.
 * @param {Record<string, unknown>} parsedResume
 * @param {Record<string, unknown>} parsedJd
 * @param {{ apiKey: string, model?: string }} opts
 */
async function groqSemantic(parsedResume, parsedJd, opts) {
  const resumeSkills = /** @type {string[]} */ (parsedResume.skills || [])
  const experience =
    (/** @type {Record<string, string>} */ (parsedResume.sections) || {}).experience ||
    ''
  const jdText = String(parsedJd.raw_text || '').slice(0, 4000)
  const resumeSnippet = [
    `Skills: ${resumeSkills.join(', ')}`,
    experience.slice(0, 2500),
  ]
    .filter(Boolean)
    .join('\n')
    .slice(0, 4000)

  const system = `You score how well a resume matches a job description.
Reply with ONLY valid JSON (no markdown):
{"semantic_similarity":0.0,"weak_jd_lines":["..."],"missing_skills":["..."]}
semantic_similarity is 0-1. weak_jd_lines: up to 5 JD requirement lines poorly covered. missing_skills: up to 10 concrete skills/tools from the JD not clearly in the resume.`

  const upstream = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${opts.apiKey}`,
    },
    body: JSON.stringify({
      model: (opts.model || DEFAULT_MODEL).trim(),
      messages: [
        { role: 'system', content: system },
        {
          role: 'user',
          content: `RESUME:\n${resumeSnippet}\n\nJOB DESCRIPTION:\n${jdText}`,
        },
      ],
      stream: false,
      temperature: 0.1,
    }),
  })

  const text = await upstream.text()
  if (!upstream.ok) {
    throw new Error(
      `Groq error ${upstream.status}: ${text.slice(0, 200) || 'request failed'}`,
    )
  }

  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('Invalid Groq response')
  }

  const content = data?.choices?.[0]?.message?.content ?? ''
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Groq did not return JSON')

  const parsed = JSON.parse(jsonMatch[0])
  let sim = Number(parsed.semantic_similarity)
  if (!Number.isFinite(sim)) sim = 0
  sim = Math.max(0, Math.min(1, sim))

  const weak = Array.isArray(parsed.weak_jd_lines)
    ? parsed.weak_jd_lines.map(String).slice(0, 8)
    : []
  const missing = Array.isArray(parsed.missing_skills)
    ? parsed.missing_skills.map(String).slice(0, 15)
    : []

  return { semantic_similarity: sim, weak_jd_lines: weak, missing_skills: missing }
}

/**
 * Fuse keyword overlap with optional Groq semantic score.
 * @param {Record<string, unknown>} parsedResume
 * @param {Record<string, unknown>} parsedJd
 * @param {{ apiKey?: string, model?: string }} [opts]
 */
export async function scoreJdMatch(parsedResume, parsedJd, opts = {}) {
  const resumeSkills = /** @type {string[]} */ (parsedResume.skills || [])
  const jdSkills = /** @type {string[]} */ (parsedJd.skill_tokens || [])
  const [kwScore, missingFromKw] = keywordOverlap(resumeSkills, jdSkills)

  let semantic = 0
  let weakLines = /** @type {string[]} */ ([])
  let missingSkills = missingFromKw
  let model = 'keyword-only'

  const apiKey = (opts.apiKey || '').trim()
  if (apiKey) {
    try {
      const groq = await groqSemantic(parsedResume, parsedJd, {
        apiKey,
        model: opts.model,
      })
      semantic = groq.semantic_similarity
      weakLines = groq.weak_jd_lines
      const merged = [...missingFromKw]
      const seen = new Set(merged.map((s) => s.toLowerCase()))
      for (const s of groq.missing_skills) {
        if (!seen.has(s.toLowerCase())) {
          merged.push(s)
          seen.add(s.toLowerCase())
        }
      }
      missingSkills = merged.slice(0, 15)
      model = (opts.model || process.env.GROQ_MODEL || DEFAULT_MODEL).trim()
    } catch {
      // Fall back to keyword-only; ATS path still works
      model = 'keyword-only (groq unavailable)'
    }
  }

  const fused =
    apiKey && model !== 'keyword-only (groq unavailable)' && !model.startsWith('keyword')
      ? 0.65 * semantic + 0.35 * kwScore
      : kwScore
  const matchPct = Math.round(Math.max(0, Math.min(1, fused)) * 100)

  /** @type {{ code: string, severity: string, message: string, fix: string }[]} */
  const findings = []
  for (const skill of missingSkills.slice(0, 8)) {
    findings.push({
      code: 'missing_jd_skill',
      severity: 'high',
      message: `JD skill not clearly present: ${skill}`,
      fix: `Add evidence of '${skill}' in Skills or Experience if accurate`,
    })
  }
  for (const line of weakLines.slice(0, 5)) {
    findings.push({
      code: 'weak_jd_alignment',
      severity: 'medium',
      message: `Weak semantic match to: ${String(line).slice(0, 120)}`,
      fix: 'Mirror key phrases from the JD where truthful',
    })
  }

  return {
    score: matchPct,
    semantic_similarity: Math.round(semantic * 10000) / 10000,
    keyword_overlap: Math.round(kwScore * 10000) / 10000,
    missing_skills: missingSkills.slice(0, 15),
    weak_jd_lines: weakLines.slice(0, 8),
    findings,
    model,
  }
}
