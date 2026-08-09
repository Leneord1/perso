/**
 * Heuristic resume section, contact, and skill parser.
 */

const SECTION_ALIASES = {
  summary: ['summary', 'profile', 'objective', 'about'],
  experience: [
    'experience',
    'work experience',
    'professional experience',
    'employment',
    'work history',
  ],
  education: ['education', 'academic', 'academics'],
  skills: ['skills', 'technical skills', 'core competencies', 'technologies'],
  projects: ['projects', 'personal projects', 'key projects'],
  certifications: ['certifications', 'certificates', 'licenses'],
}

const EMAIL_RE = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/
const PHONE_RE =
  /(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}\b/
const LINKEDIN_RE = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w%-]+\/?/i
const GITHUB_RE = /(?:https?:\/\/)?(?:www\.)?github\.com\/[\w%-]+\/?/i
const BULLET_RE = /^\s*[•\-\*\u2022]\s+/gm
const SECTION_HEADER_RE = /^(?<header>[A-Za-z][A-Za-z &/]{1,40})\s*:?\s*$/m

const JD_NOISE = new Set([
  'requirements',
  'requirement',
  'responsibilities',
  'qualifications',
  'preferred',
  'required',
  'must',
  'skills',
  'experience',
  'job description',
  'about the role',
  'software engineer',
  'strong communication skills',
])

/**
 * Parse resume text into sections, contacts, skills, and raw text.
 * @param {string} text
 */
export function parseResume(text) {
  const normalized = String(text || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const sections = splitSections(normalized)
  const contacts = extractContacts(normalized)
  const skills = extractSkills(sections)
  const present = Object.keys(sections).filter(
    (name) => name !== 'contact' && (sections[name] || '').trim(),
  )
  const required = ['experience', 'education', 'skills']
  const missing = required.filter((name) => !present.includes(name))

  return {
    raw_text: normalized,
    sections,
    sections_present: present,
    sections_missing: missing,
    contacts,
    skills,
    bullet_count: (normalized.match(BULLET_RE) || []).length,
    word_count: normalized.split(/\s+/).filter(Boolean).length,
  }
}

/**
 * Light JD parse: lines and skill-like tokens for matching.
 * @param {string} text
 */
export function parseJd(text) {
  const normalized = String(text || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const lines = normalized
    .split('\n')
    .map((ln) => ln.trim())
    .filter(Boolean)

  let requirementLines = lines.filter(
    (ln) =>
      /^[•\-\*]/.test(ln) ||
      /\b(require|must|prefer|skill|experience|familiar)\b/i.test(ln),
  )
  if (!requirementLines.length) {
    const bullets = lines.filter((ln) => ln.startsWith('-') || ln.startsWith('•') || ln.startsWith('*'))
    requirementLines = bullets.length ? bullets : lines.slice(0, 40)
  }

  const tokens = []
  const seen = new Set()
  for (const ln of requirementLines) {
    let cleaned = ln.replace(/^[•\-\*]+\s*/, '')
    cleaned = cleaned.replace(
      /^(strong|proven|solid|familiarity with|experience with|experience in|knowledge of)\s+/i,
      '',
    )
    cleaned = cleaned.replace(/^[ .:]+|[ .:]+$/g, '')
    if (JD_NOISE.has(cleaned.toLowerCase())) continue

    for (const token of tokenizeSkills(cleaned)) {
      const key = token.toLowerCase()
      if (JD_NOISE.has(key) || seen.has(key)) continue
      seen.add(key)
      tokens.push(token)
    }

    const words = cleaned.split(/\s+/).filter(Boolean)
    if (words.length > 1 && words.length <= 6 && !JD_NOISE.has(cleaned.toLowerCase())) {
      const key = cleaned.toLowerCase()
      if (!seen.has(key) && !key.endsWith('preferred')) {
        seen.add(key)
        tokens.push(cleaned)
      }
    }
  }

  return {
    raw_text: normalized,
    lines,
    requirement_lines: requirementLines,
    skill_tokens: tokens,
    word_count: normalized.split(/\s+/).filter(Boolean).length,
  }
}

/** Map a header line to a canonical section name. */
function normalizeHeader(header) {
  let key = header.toLowerCase().replace(/[^a-z\s]/g, '').trim()
  key = key.replace(/\s+/g, ' ')
  for (const [canonical, aliases] of Object.entries(SECTION_ALIASES)) {
    if (aliases.includes(key) || key === canonical) return canonical
  }
  return null
}

/** Split resume body into known sections by header lines. */
function splitSections(text) {
  /** @type {Record<string, string[]>} */
  const sections = {}
  for (const name of Object.keys(SECTION_ALIASES)) sections[name] = []
  let current = null
  const preamble = []

  for (const line of text.split('\n')) {
    const headerMatch = line.trim().match(SECTION_HEADER_RE)
    if (headerMatch) {
      const canonical = normalizeHeader(headerMatch.groups?.header || headerMatch[1])
      if (canonical) {
        current = canonical
        continue
      }
    }
    if (current) sections[current].push(line)
    else preamble.push(line)
  }

  /** @type {Record<string, string>} */
  const result = {}
  for (const [name, body] of Object.entries(sections)) {
    result[name] = body.join('\n').trim()
  }
  result.contact = preamble.join('\n').trim()
  return result
}

/** Pull email, phone, and profile URLs from text. */
function extractContacts(text) {
  const emails = text.match(new RegExp(EMAIL_RE.source, 'g')) || []
  const phones = text.match(new RegExp(PHONE_RE.source, 'g')) || []
  const linkedin = text.match(new RegExp(LINKEDIN_RE.source, 'gi')) || []
  const github = text.match(new RegExp(GITHUB_RE.source, 'gi')) || []
  return {
    email: emails[0] || null,
    phone: phones[0] || null,
    linkedin: linkedin[0] || null,
    github: github[0] || null,
    has_email: emails.length > 0,
    has_phone: phones.length > 0,
  }
}

/** Split skill-like tokens from comma/pipe/slash/newline lists. */
function tokenizeSkills(blob) {
  const parts = String(blob || '').split(/[,|/;\u2022\n]+/)
  const skills = []
  const seen = new Set()
  for (const part of parts) {
    const token = part.replace(/\s+/g, ' ').replace(/^[\s.\-:\t]+|[\s.\-:\t]+$/g, '')
    if (!token || token.length < 2 || token.length > 40) continue
    if (token.split(/\s+/).length > 4) continue
    const key = token.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    skills.push(token)
  }
  return skills
}

/** Skills from Skills section, with light Experience cues. */
function extractSkills(sections) {
  const skills = tokenizeSkills(sections.skills || '')
  if (skills.length < 5) {
    const exp = sections.experience || ''
    const extra = []
    const re =
      /\b([A-Z][A-Za-z0-9+#.]{1,20}(?:\s[A-Z][A-Za-z0-9+#.]{1,20})?)\b/g
    let m
    while ((m = re.exec(exp))) extra.push(m[1])
    const existing = new Set(skills.map((s) => s.toLowerCase()))
    for (const token of tokenizeSkills(extra.join('\n'))) {
      if (!existing.has(token.toLowerCase())) {
        skills.push(token)
        existing.add(token.toLowerCase())
      }
    }
  }
  return skills
}
