/**
 * Text extractors for resume and JD files (PDF, DOCX, TXT/MD).
 */

import path from 'node:path'

/**
 * @typedef {{ text: string, format: string, warnings: string[] }} ExtractedDoc
 */

/**
 * Extract text from a Buffer given a filename (extension drives format).
 * @param {Buffer} buffer
 * @param {string} filename
 * @returns {Promise<ExtractedDoc>}
 */
export async function extractFromBuffer(buffer, filename) {
  const suffix = path.extname(filename || '').toLowerCase()
  if (suffix === '.txt' || suffix === '.md' || suffix === '') {
    return extractTextBuffer(buffer, suffix === '.md' ? 'md' : 'txt')
  }
  if (suffix === '.pdf') {
    return extractPdf(buffer)
  }
  if (suffix === '.docx') {
    return extractDocx(buffer)
  }
  throw new Error(`Unsupported format '${suffix}'. Use .pdf, .docx, .txt, or .md`)
}

/**
 * Wrap already-available plain text as an ExtractedDoc.
 * @param {string} text
 * @param {string} [format='txt']
 * @returns {ExtractedDoc}
 */
export function extractFromText(text, format = 'txt') {
  const warnings = []
  const value = typeof text === 'string' ? text : ''
  if (!value.trim()) {
    warnings.push('File contains little or no extractable text')
  }
  return { text: value, format, warnings }
}

/** Decode buffer with common encodings. */
function extractTextBuffer(buffer, format) {
  const warnings = []
  let text = ''
  for (const encoding of ['utf8', 'utf-8', 'latin1']) {
    try {
      text = buffer.toString(encoding === 'utf-8' ? 'utf8' : encoding)
      if (encoding === 'latin1' || !text.includes('\uFFFD')) break
    } catch {
      continue
    }
  }
  if (!text.trim()) {
    warnings.push('File contains little or no extractable text')
  }
  return { text, format, warnings }
}

/** Extract PDF text via pdf-parse v2. */
async function extractPdf(buffer) {
  const warnings = []
  let text = ''
  let parser
  try {
    const { PDFParse } = await import('pdf-parse')
    parser = new PDFParse({ data: buffer })
    const result = await parser.getText()
    text = (result?.text || '').trim()
  } catch (err) {
    warnings.push(
      `PDF parse failed: ${err instanceof Error ? err.message : 'unknown error'}`,
    )
    return { text: '', format: 'pdf', warnings }
  } finally {
    if (parser) {
      try {
        await parser.destroy()
      } catch {
        /* ignore */
      }
    }
  }
  if (!text) {
    warnings.push('PDF has little or no extractable text (may be image-only)')
  }
  return { text, format: 'pdf', warnings }
}

/** Extract DOCX paragraphs via mammoth. */
async function extractDocx(buffer) {
  const warnings = []
  try {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ buffer })
    const text = (result?.value || '').trim()
    if (result?.messages?.length) {
      for (const msg of result.messages) {
        if (msg?.message) warnings.push(String(msg.message))
      }
    }
    if (!text) {
      warnings.push('DOCX contains little or no extractable text')
    }
    return { text, format: 'docx', warnings }
  } catch (err) {
    warnings.push(
      `DOCX parse failed: ${err instanceof Error ? err.message : 'unknown error'}`,
    )
    return { text: '', format: 'docx', warnings }
  }
}
