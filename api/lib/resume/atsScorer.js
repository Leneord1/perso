/**
 * Deterministic ATS-readiness scorer (0-100) with findings.
 */

/**
 * Score resume ATS readiness from parsed structure and extract warnings.
 * @param {Record<string, unknown>} parsed
 * @param {string[]|null} [extractWarnings]
 */
export function scoreAts(parsed, extractWarnings = null) {
  /** @type {{ code: string, severity: string, message: string, fix: string }[]} */
  const findings = []
  let score = 100
  const warnings = extractWarnings || []

  const contacts = /** @type {Record<string, unknown>} */ (parsed.contacts || {})
  const present = new Set(/** @type {string[]} */ (parsed.sections_present || []))
  const missing = /** @type {string[]} */ (parsed.sections_missing || [])
  const wordCount = Number(parsed.word_count || 0)
  const bulletCount = Number(parsed.bullet_count || 0)

  for (const section of ['experience', 'education', 'skills']) {
    if (!present.has(section)) {
      score -= 10
      findings.push({
        code: `missing_${section}`,
        severity: 'high',
        message: `Missing ${section.charAt(0).toUpperCase()}${section.slice(1)} section`,
        fix: `Add a clearly labeled ${section.charAt(0).toUpperCase()}${section.slice(1)} heading and content`,
      })
    }
  }

  if (!present.has('summary')) {
    score -= 3
    findings.push({
      code: 'missing_summary',
      severity: 'low',
      message: 'No Summary/Profile section detected',
      fix: 'Add a short Summary section with role-aligned keywords',
    })
  }

  if (!contacts.has_email) {
    score -= 12
    findings.push({
      code: 'missing_email',
      severity: 'high',
      message: 'No email address found',
      fix: 'Put a plain-text email near the top of the resume',
    })
  }
  if (!contacts.has_phone) {
    score -= 8
    findings.push({
      code: 'missing_phone',
      severity: 'medium',
      message: 'No phone number found',
      fix: 'Include a phone number in plain text in the header',
    })
  }

  for (const warning of warnings) {
    const lower = String(warning).toLowerCase()
    let deduct = 5
    let severity = 'medium'
    if (lower.includes('little or no extractable') || lower.includes('image-only')) {
      deduct = 20
      severity = 'high'
    } else if (lower.includes('multi-column')) {
      deduct = 10
      severity = 'high'
    } else if (lower.includes('table')) {
      deduct = 8
      severity = 'medium'
    }
    score -= deduct
    findings.push({
      code: 'extractability',
      severity,
      message: String(warning),
      fix: 'Use a single-column, text-based layout without complex tables',
    })
  }

  if (wordCount < 150) {
    score -= 10
    findings.push({
      code: 'too_short',
      severity: 'high',
      message: `Resume is very short (${wordCount} words)`,
      fix: 'Expand experience bullets with concrete skills and outcomes',
    })
  } else if (wordCount > 1200) {
    score -= 5
    findings.push({
      code: 'too_long',
      severity: 'low',
      message: `Resume is very long (${wordCount} words)`,
      fix: 'Tighten to ~1 page (new grad) or 2 pages max',
    })
  }

  if (bulletCount < 3 && present.has('experience')) {
    score -= 8
    findings.push({
      code: 'few_bullets',
      severity: 'medium',
      message: 'Few bullet points detected in the resume',
      fix: 'Use standard bullets (- or •) for experience achievements',
    })
  }

  const skills = /** @type {unknown[]} */ (parsed.skills || [])
  if (present.has('skills') && skills.length < 3) {
    score -= 7
    findings.push({
      code: 'sparse_skills',
      severity: 'medium',
      message: 'Skills section looks sparse or hard to parse',
      fix: 'List skills as a comma-separated plain-text list',
    })
  }

  score = Math.max(0, Math.min(100, Math.round(score)))
  const severityRank = { high: 0, medium: 1, low: 2 }
  findings.sort(
    (a, b) => (severityRank[a.severity] ?? 9) - (severityRank[b.severity] ?? 9),
  )

  return {
    score,
    findings,
    sections_present: [...present].sort(),
    sections_missing: missing,
    word_count: wordCount,
    skill_count: skills.length,
  }
}
