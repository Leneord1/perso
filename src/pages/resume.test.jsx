import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Resume from './resume'

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
    expect(screen.getByRole('heading', { name: /technical skills/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^experience$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^projects$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^education$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /awards and extra curricular/i })).toBeInTheDocument()
  })

  it('lists key roles and education', () => {
    render(<Resume />)
    expect(screen.getByText(/senior capstone project team member/i)).toBeInTheDocument()
    expect(screen.getAllByText(/georgia watch/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/operations lead/i)).toBeInTheDocument()
    expect(screen.getByText(/hamsini decorations/i)).toBeInTheDocument()
    expect(screen.getAllByText(/kennesaw state university/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/better financial futures/i)).toBeInTheDocument()
    expect(screen.getByText(/dean/i)).toBeInTheDocument()
    expect(screen.getByText(/little free pantry/i)).toBeInTheDocument()
  })

  it('calls print when Print or save as PDF is clicked', async () => {
    const user = userEvent.setup()
    render(<Resume />)
    await user.click(screen.getByRole('button', { name: /print or save as pdf/i }))
    expect(globalThis.print).toHaveBeenCalledTimes(1)
  })
})
