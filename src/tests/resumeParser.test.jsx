import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import ResumeParser from '../pages/resumeParser'
import Utilities from '../pages/utilities'

function renderPage(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('ResumeParser page', () => {
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
