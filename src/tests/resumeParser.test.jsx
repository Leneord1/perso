import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import ResumeParser from '../pages/resumeParser'
import Utilities from '../pages/utilities'

function renderPage(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

const sampleReport = {
  ats: {
    score: 92,
    sections_present: ['experience', 'education', 'skills'],
    sections_missing: [],
    word_count: 200,
    skill_count: 8,
    findings: [],
  },
  jd_match: {
    score: 75,
    model: 'keyword-only',
    missing_skills: ['Kubernetes'],
    findings: [],
  },
  contacts: {
    email: 'jane.doe@email.com',
    phone: '(555) 123-4567',
    linkedin: 'linkedin.com/in/janedoe',
    github: 'github.com/janedoe',
  },
  skills: ['Python', 'FastAPI', 'SQL'],
  recommendations: [
    {
      code: 'missing_jd_skill',
      severity: 'high',
      message: 'JD skill not clearly present: Kubernetes',
      fix: "Add evidence of 'Kubernetes'",
    },
  ],
}

describe('ResumeParser page', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => sampleReport,
      })),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders heading, form controls, and analyze button', () => {
    renderPage(<ResumeParser />)
    expect(
      screen.getByRole('heading', { level: 1, name: /resume parser/i }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/upload \(\.pdf/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/or paste text/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^analyze$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to utilities/i })).toHaveAttribute(
      'href',
      '/utilities',
    )
  })

  it('shows error when analyzing without resume input', async () => {
    const user = userEvent.setup()
    renderPage(<ResumeParser />)
    await user.click(screen.getByRole('button', { name: /^analyze$/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/add a resume/i)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('posts pasted resume and renders results', async () => {
    const user = userEvent.setup()
    renderPage(<ResumeParser />)

    await user.type(screen.getByLabelText(/or paste text/i), 'Jane Doe resume text')
    await user.type(screen.getByLabelText(/or paste jd text/i), 'Need Python')
    await user.click(screen.getByRole('button', { name: /^analyze$/i }))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledOnce()
    })
    const [url, opts] = fetch.mock.calls[0]
    expect(url).toBe('/api/resume')
    expect(opts.method).toBe('POST')
    const body = JSON.parse(opts.body)
    expect(body.resumeText).toMatch(/jane doe resume text/i)
    expect(body.jdText).toMatch(/need python/i)

    expect(await screen.findByRole('heading', { name: /results/i })).toBeInTheDocument()
    expect(screen.getByText(/ats score:/i)).toHaveTextContent(/92\/100/)
    expect(screen.getByText(/jd match:/i)).toHaveTextContent(/75%/)
    expect(screen.getByText(/jane\.doe@email\.com/i)).toBeInTheDocument()
    expect(screen.getByText(/python, fastapi, sql/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /missing jd skills/i })).toBeInTheDocument()
    expect(screen.getAllByText(/kubernetes/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/\[HIGH\]/i)).toBeInTheDocument()
  })

  it('surfaces API errors', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Resume too large' }),
    })
    const user = userEvent.setup()
    renderPage(<ResumeParser />)
    await user.type(screen.getByLabelText(/or paste text/i), 'resume body')
    await user.click(screen.getByRole('button', { name: /^analyze$/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/resume too large/i)
  })

  it('resets form and clears report', async () => {
    const user = userEvent.setup()
    renderPage(<ResumeParser />)
    await user.type(screen.getByLabelText(/or paste text/i), 'resume body')
    await user.click(screen.getByRole('button', { name: /^analyze$/i }))
    expect(await screen.findByRole('heading', { name: /results/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^reset$/i }))
    expect(screen.queryByRole('heading', { name: /results/i })).not.toBeInTheDocument()
    expect(screen.getByLabelText(/or paste text/i)).toHaveValue('')
  })
})

describe('Utilities hub', () => {
  it('links to resume parser', () => {
    renderPage(<Utilities />)
    expect(screen.getByRole('link', { name: /resume parser/i })).toHaveAttribute(
      'href',
      '/resume-parser',
    )
  })
})
