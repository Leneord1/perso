import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Contact from './contact'

describe('Contact', () => {
  it('renders the heading and intro', () => {
    render(<Contact />)
    expect(screen.getByRole('heading', { level: 1, name: /^contact$/i })).toBeInTheDocument()
    expect(screen.getByText(/open to new projects, collaborations/i)).toBeInTheDocument()
  })

  it('exposes email, LinkedIn, and GitHub links', () => {
    render(<Contact />)
    expect(screen.getByRole('link', { name: /sankalp\.amaravadi33@gmail\.com/i })).toHaveAttribute(
      'href',
      'mailto:Sankalp.Amaravadi33@gmail.com',
    )
    const linkedIn = screen.getByRole('link', { name: /^profile$/i })
    expect(linkedIn).toHaveAttribute('href', 'https://linkedin.com/in/sankalp-amaravadi-147202291')
    expect(linkedIn).toHaveAttribute('target', '_blank')
    expect(linkedIn).toHaveAttribute('rel', 'noopener noreferrer')
    const github = screen.getByRole('link', { name: /github\.com\/leneord1/i })
    expect(github).toHaveAttribute('href', 'https://github.com/Leneord1')
    expect(github).toHaveAttribute('target', '_blank')
  })
})
