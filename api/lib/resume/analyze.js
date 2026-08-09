/**
 * Orchestrate extract → parse → ATS score → optional JD match.
 */

import { extractFromBuffer, extractFromText } from './extract.js'
import { parseResume, parseJd } from './parser.js'
import { scoreAts } from './atsScorer.js'
import { scoreJdMatch } from './jdMatch.js'
import { buildReport } from './report.js'

/**
 * @param {{
 *   resumeText?: string,
 *   resumeBuffer?: Buffer,
 *   resumeFilename?: string,
 *   jdText?: string,
 *   jdBuffer?: Buffer,
 *   jdFilename?: string,
 *   groqApiKey?: string,
 *   groqModel?: string,
 * }} input
 */
export async function analyze(input) {
  let extracted
  let resumePath = 'pasted-resume.txt'

  if (input.resumeBuffer && input.resumeFilename) {
    extracted = await extractFromBuffer(input.resumeBuffer, input.resumeFilename)
    resumePath = input.resumeFilename
  } else if (typeof input.resumeText === 'string') {
    extracted = extractFromText(input.resumeText, 'txt')
  } else {
    throw new TypeError('Provide resumeText or resumeBuffer + resumeFilename')
  }

  const parsed = parseResume(extracted.text)
  const ats = scoreAts(parsed, extracted.warnings)

  let jdMatch = null
  let jdPath = null
  const hasJd =
    (typeof input.jdText === 'string' && input.jdText.trim()) ||
    (input.jdBuffer && input.jdFilename)

  if (hasJd) {
    let jdExtracted
    if (input.jdBuffer && input.jdFilename) {
      jdExtracted = await extractFromBuffer(input.jdBuffer, input.jdFilename)
      jdPath = input.jdFilename
    } else {
      jdExtracted = extractFromText(input.jdText, 'txt')
      jdPath = 'pasted-jd.txt'
    }
    const jdParsed = parseJd(jdExtracted.text)
    jdMatch = await scoreJdMatch(parsed, jdParsed, {
      apiKey: input.groqApiKey,
      model: input.groqModel,
    })
  }

  return buildReport({
    resumePath,
    formatName: extracted.format,
    extractWarnings: extracted.warnings,
    parsed,
    ats,
    jdMatch,
    jdPath,
  })
}
