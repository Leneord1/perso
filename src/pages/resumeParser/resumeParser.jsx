/**
 * Resume ATS parser UI — upload/paste resume + optional JD, show report.
 */

import React, { useState } from 'react'
import { Link } from 'react-router'
import { readViteEnv } from '../../env.js'
import '../../global.css'

const ACCEPTED = '.pdf,.docx,.txt,.md,application/pdf,text/plain,text/markdown'

/** Read file as base64 (no data: prefix). */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result || '')
      const comma = result.indexOf(',')
      resolve(comma >= 0 ? result.slice(comma + 1) : result)
    }
    reader.onerror = () => reject(reader.error || new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

/** POST analyze request to /api/resume. */
async function analyzeResume(payload) {
  const url = readViteEnv('VITE_RESUME_API_URL') || '/api/resume'
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`)
  }
  return data
}

function severityClass(severity) {
  if (severity === 'high') return 'resume-parser__sev--high'
  if (severity === 'medium') return 'resume-parser__sev--medium'
  return 'resume-parser__sev--low'
}

function ResumeParser() {
  const [resumeFile, setResumeFile] = useState(null)
  const [resumeText, setResumeText] = useState('')
  const [jdFile, setJdFile] = useState(null)
  const [jdText, setJdText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [report, setReport] = useState(null)

  /** Build payload from file or paste fields. */
  async function buildPayload() {
    /** @type {Record<string, string>} */
    const payload = {}

    if (resumeFile) {
      payload.resumeBase64 = await fileToBase64(resumeFile)
      payload.resumeFilename = resumeFile.name
    } else if (resumeText.trim()) {
      payload.resumeText = resumeText
    } else {
      throw new Error('Add a resume file or paste resume text')
    }

    if (jdFile) {
      payload.jdBase64 = await fileToBase64(jdFile)
      payload.jdFilename = jdFile.name
    } else if (jdText.trim()) {
      payload.jdText = jdText
    }

    return payload
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setReport(null)
    setLoading(true)
    try {
      const payload = await buildPayload()
      const data = await analyzeResume(payload)
      setReport(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  function onReset() {
    setResumeFile(null)
    setResumeText('')
    setJdFile(null)
    setJdText('')
    setError(null)
    setReport(null)
  }

  return (
    <main className="page resume-parser">
      <h1>Resume Parser</h1>
      <p>
        Check ATS readiness and optional job-description match. Parsing runs on Vercel;
        semantic JD match uses the site Groq model when configured.
      </p>

      <form className="page-section resume-parser__form" onSubmit={onSubmit}>
        <h2>Resume</h2>
        <label className="resume-parser__label" htmlFor="resume-file">
          Upload (.pdf, .docx, .txt, .md)
        </label>
        <input
          id="resume-file"
          type="file"
          accept={ACCEPTED}
          onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
        />
        <label className="resume-parser__label" htmlFor="resume-text">
          Or paste text
        </label>
        <textarea
          id="resume-text"
          className="resume-parser__textarea"
          rows={8}
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste resume text…"
          disabled={Boolean(resumeFile)}
        />

        <h2 className="resume-parser__subhead">Job description (optional)</h2>
        <label className="resume-parser__label" htmlFor="jd-file">
          Upload JD file
        </label>
        <input
          id="jd-file"
          type="file"
          accept={ACCEPTED}
          onChange={(e) => setJdFile(e.target.files?.[0] || null)}
        />
        <label className="resume-parser__label" htmlFor="jd-text">
          Or paste JD text
        </label>
        <textarea
          id="jd-text"
          className="resume-parser__textarea"
          rows={6}
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste job description…"
          disabled={Boolean(jdFile)}
        />

        <div className="resume-parser__actions">
          <button type="submit" className="button-primary" disabled={loading}>
            {loading ? 'Analyzing…' : 'Analyze'}
          </button>
          <button type="button" className="button-ghost" onClick={onReset} disabled={loading}>
            Reset
          </button>
        </div>
      </form>

      {error ? (
        <p className="resume-parser__error" role="alert">
          {error}
        </p>
      ) : null}

      {report ? (
        <section className="page-section" aria-labelledby="report-heading">
          <h2 id="report-heading">Results</h2>

          <p className="resume-parser__score">
            ATS score: <strong>{report.ats?.score ?? '—'}/100</strong>
            {report.jd_match ? (
              <>
                {' '}
                · JD match: <strong>{report.jd_match.score}%</strong>
                <span className="resume-parser__meta">
                  {' '}
                  ({report.jd_match.model})
                </span>
              </>
            ) : null}
          </p>

          {report.ats?.sections_missing?.length ? (
            <p>
              Missing sections:{' '}
              {report.ats.sections_missing.join(', ')}
            </p>
          ) : null}

          {report.contacts ? (
            <div className="resume-parser__block">
              <h3>Contacts</h3>
              <ul>
                <li>Email: {report.contacts.email || '—'}</li>
                <li>Phone: {report.contacts.phone || '—'}</li>
                <li>LinkedIn: {report.contacts.linkedin || '—'}</li>
                <li>GitHub: {report.contacts.github || '—'}</li>
              </ul>
            </div>
          ) : null}

          {report.skills?.length ? (
            <div className="resume-parser__block">
              <h3>Skills detected</h3>
              <p>{report.skills.join(', ')}</p>
            </div>
          ) : null}

          {report.jd_match?.missing_skills?.length ? (
            <div className="resume-parser__block">
              <h3>Missing JD skills</h3>
              <p>{report.jd_match.missing_skills.join(', ')}</p>
            </div>
          ) : null}

          {report.recommendations?.length ? (
            <div className="resume-parser__block">
              <h3>Recommendations</h3>
              <ol className="resume-parser__recs">
                {report.recommendations.map((rec, i) => (
                  <li key={`${rec.code}-${i}`}>
                    <span className={severityClass(rec.severity)}>
                      [{String(rec.severity || '?').toUpperCase()}]
                    </span>{' '}
                    {rec.message}
                    {rec.fix ? (
                      <span className="resume-parser__fix"> Fix: {rec.fix}</span>
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <p>No major ATS issues detected.</p>
          )}
        </section>
      ) : null}

      <p className="resume-parser__back">
        <Link to="/utilities" className="link">
          Back to Utilities
        </Link>
      </p>
    </main>
  )
}

export default ResumeParser
