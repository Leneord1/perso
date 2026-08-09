/**
 * Build JSON report from scoring outputs.
 */

/**
 * Merge ATS and JD findings into a stable report schema.
 * @param {{
 *   resumePath: string,
 *   formatName: string,
 *   extractWarnings: string[],
 *   parsed: Record<string, unknown>,
 *   ats: Record<string, unknown>,
 *   jdMatch: Record<string, unknown>|null,
 *   jdPath: string|null,
 * }} args
 */
export function buildReport({
  resumePath,
  formatName,
  extractWarnings,
  parsed,
  ats,
  jdMatch,
  jdPath,
}) {
  /** @type {{ severity?: string }[]} */
  const recommendations = [...(/** @type {unknown[]} */ (ats.findings) || [])]
  if (jdMatch) {
    recommendations.push(...(/** @type {unknown[]} */ (jdMatch.findings) || []))
  }

  const severityRank = { high: 0, medium: 1, low: 2 }
  recommendations.sort(
    (a, b) =>
      (severityRank[/** @type {string} */ (a.severity)] ?? 9) -
      (severityRank[/** @type {string} */ (b.severity)] ?? 9),
  )

  return {
    resume_path: resumePath,
    jd_path: jdPath,
    format: formatName,
    extract_warnings: extractWarnings,
    ats: {
      score: ats.score,
      sections_present: ats.sections_present,
      sections_missing: ats.sections_missing,
      word_count: ats.word_count,
      skill_count: ats.skill_count,
      findings: ats.findings || [],
    },
    jd_match: jdMatch
      ? {
          score: jdMatch.score,
          semantic_similarity: jdMatch.semantic_similarity,
          keyword_overlap: jdMatch.keyword_overlap,
          missing_skills: jdMatch.missing_skills || [],
          weak_jd_lines: jdMatch.weak_jd_lines || [],
          model: jdMatch.model,
          findings: jdMatch.findings || [],
        }
      : null,
    contacts: parsed.contacts,
    skills: (/** @type {unknown[]} */ (parsed.skills) || []).slice(0, 40),
    recommendations: recommendations.slice(0, 20),
  }
}
