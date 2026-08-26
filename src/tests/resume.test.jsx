import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Resume from '../pages/resume/resume'

describe('Resume', () => {
  beforeEach(() => {
    vi.spyOn(globalThis, 'print').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders name and contact links', () => {
    render(<Resume />)
    expect(
      screen.getByRole('heading', { level: 1, name: /sankalp amaravadi/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /\(309\) 255-5290/ })).toHaveAttribute(
      'href',
      'tel:+13092555290',
    )
    expect(screen.getByRole('link', { name: /sankalp\.amaravadi33@gmail\.com/i })).toHaveAttribute(
      'href',
      'mailto:sankalp.amaravadi33@gmail.com',
    )
    expect(screen.getByRole('link', { name: /linkedin profile/i })).toHaveAttribute(
      'target',
      '_blank',
    )
    expect(screen.getByRole('link', { name: /github repository/i })).toHaveAttribute(
      'target',
      '_blank',
    )
  })

  it('renders main resume sections', () => {
    render(<Resume />)
    expect(screen.getByRole('heading', { name: /professional summary/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /technical skills/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /professional skills/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^experience$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^projects$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^education$/i })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /awards and extracurricular activities/i }),
    ).toBeInTheDocument()
  })

  it('lists key roles, summary, and professional skills', () => {
    render(<Resume />)
    expect(screen.getByText(/early-career software engineer/i)).toBeInTheDocument()
    expect(screen.getByText(/cross-functional collaboration/i)).toBeInTheDocument()
    expect(screen.getByText(/attention to quality/i)).toBeInTheDocument()
    expect(screen.getByText(/website developer/i)).toBeInTheDocument()
    expect(screen.getAllByText(/georgia watch/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/service technician intern/i)).toBeInTheDocument()
    expect(screen.getAllByText(/kennesaw state university/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/better financial futures/i)).toBeInTheDocument()
    expect(screen.getByText(/ugahacks 11/i)).toBeInTheDocument()
  })

  it('calls print when Print or save as PDF is clicked', async () => {
    const user = userEvent.setup()
    render(<Resume />)
    await user.click(screen.getByRole('button', { name: /print or save as pdf/i }))
    expect(globalThis.print).toHaveBeenCalledTimes(1)
  })

  it('names the print download Sankalp_Resume', async () => {
    const user = userEvent.setup()
    document.title = 'Original Title'
    globalThis.print.mockImplementation(() => {
      expect(document.title).toBe('Sankalp_Resume')
      globalThis.dispatchEvent(new Event('afterprint'))
    })
    render(<Resume />)
    await user.click(screen.getByRole('button', { name: /print or save as pdf/i }))
    expect(document.title).toBe('Original Title')
  })
})
