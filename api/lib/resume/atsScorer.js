/**
 * Deterministic ATS-readiness scorer (0-100) with findings.
 */

/**
 * @typedef {{ code: string, severity: string, message: string, fix: string }} AtsFinding
 */

/** Push finding and deduct score for a missing core section. */
function penalizeMissingSection(section, findings) {
  findings.push({
    code: `missing_${section}`,
    severity: 'high',
    message: `Missing ${section.charAt(0).toUpperCase()}${section.slice(1)} section`,
    fix: `Add a clearly labeled ${section.charAt(0).toUpperCase()}${section.slice(1)} heading and content`,
  })
  return 10
}

/** Score contact and core section presence. */
function scoreStructure(present, contacts, findings) {
  let deduct = 0
  for (const section of ['experience', 'education', 'skills']) {
    if (!present.has(section)) deduct += penalizeMissingSection(section, findings)
  }
  if (!present.has('summary')) {
    deduct += 3
    findings.push({
      code: 'missing_summary',
      severity: 'low',
      message: 'No Summary/Profile section detected',
      fix: 'Add a short Summary section with role-aligned keywords',
    })
  }
  if (!contacts.has_email) {
    deduct += 12
    findings.push({
      code: 'missing_email',
      severity: 'high',
      message: 'No email address found',
      fix: 'Put a plain-text email near the top of the resume',
    })
  }
  if (!contacts.has_phone) {
    deduct += 8
    findings.push({
      code: 'missing_phone',
      severity: 'medium',
      message: 'No phone number found',
      fix: 'Include a phone number in plain text in the header',
    })
  }
  return deduct
}

/** Map extract warning text to deduct + severity. */
function warningPenalty(warning) {
  const lower = String(warning).toLowerCase()
  if (lower.includes('little or no extractable') || lower.includes('image-only')) {
    return { deduct: 20, severity: 'high' }
  }
  if (lower.includes('multi-column')) return { deduct: 10, severity: 'high' }
  if (lower.includes('table')) return { deduct: 8, severity: 'medium' }
  return { deduct: 5, severity: 'medium' }
}

/** Apply extractability warning penalties. */
function scoreWarnings(warnings, findings) {
  let deduct = 0
  for (const warning of warnings) {
    const { deduct: amount, severity } = warningPenalty(warning)
    deduct += amount
    findings.push({
      code: 'extractability',
      severity,
      message: String(warning),
      fix: 'Use a single-column, text-based layout without complex tables',
    })
  }
  return deduct
}

/** Score length, bullets, and skills density. */
function scoreContent(present, wordCount, bulletCount, skills, findings) {
  let deduct = 0
  if (wordCount < 150) {
    deduct += 10
    findings.push({
      code: 'too_short',
      severity: 'high',
      message: `Resume is very short (${wordCount} words)`,
      fix: 'Expand experience bullets with concrete skills and outcomes',
    })
  } else if (wordCount > 1200) {
    deduct += 5
    findings.push({
      code: 'too_long',
      severity: 'low',
      message: `Resume is very long (${wordCount} words)`,
      fix: 'Tighten to ~1 page (new grad) or 2 pages max',
    })
  }
  if (bulletCount < 3 && present.has('experience')) {
    deduct += 8
    findings.push({
      code: 'few_bullets',
      severity: 'medium',
      message: 'Few bullet points detected in the resume',
      fix: 'Use standard bullets (- or •) for experience achievements',
    })
  }
  if (present.has('skills') && skills.length < 3) {
    deduct += 7
    findings.push({
      code: 'sparse_skills',
      severity: 'medium',
      message: 'Skills section looks sparse or hard to parse',
      fix: 'List skills as a comma-separated plain-text list',
    })
  }
  return deduct
}

/**
 * Score resume ATS readiness from parsed structure and extract warnings.
 * @param {Record<string, unknown>} parsed
 * @param {string[]|null} [extractWarnings]
 */
export function scoreAts(parsed, extractWarnings = null) {
  /** @type {AtsFinding[]} */
  const findings = []
  const warnings = extractWarnings || []

  const contacts = /** @type {Record<string, unknown>} */ (parsed.contacts || {})
  const present = new Set(/** @type {string[]} */ (parsed.sections_present || []))
  const missing = /** @type {string[]} */ (parsed.sections_missing || [])
  const wordCount = Number(parsed.word_count || 0)
  const bulletCount = Number(parsed.bullet_count || 0)
  const skills = /** @type {unknown[]} */ (parsed.skills || [])

  let score = 100
  score -= scoreStructure(present, contacts, findings)
  score -= scoreWarnings(warnings, findings)
  score -= scoreContent(present, wordCount, bulletCount, skills, findings)

  score = Math.max(0, Math.min(100, Math.round(score)))
  const severityRank = { high: 0, medium: 1, low: 2 }
  findings.sort(
    (a, b) => (severityRank[a.severity] ?? 9) - (severityRank[b.severity] ?? 9),
  )

  return {
    score,
    findings,
    sections_present: [...present].sort((a, b) => a.localeCompare(b)),
    sections_missing: missing,
    word_count: wordCount,
    skill_count: skills.length,
  }
}
