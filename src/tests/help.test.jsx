import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import Help from '../pages/help/help'

function renderHelp() {
  return render(
    <MemoryRouter>
      <Help />
    </MemoryRouter>,
  )
}

describe('Help', () => {
  it('renders the help heading and intro', () => {
    renderHelp()
    expect(screen.getByRole('heading', { level: 1, name: /^help$/i })).toBeInTheDocument()
    expect(screen.getByText(/quick guide to this site/i)).toBeInTheDocument()
  })

  it('renders section headings', () => {
    renderHelp()
    expect(screen.getByRole('heading', { name: /^navigation$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /main pages/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /chat assistant/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /still stuck/i })).toBeInTheDocument()
  })

  it('links to key site pages', () => {
    renderHelp()
    expect(screen.getByRole('link', { name: /^home$/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /my story/i })).toHaveAttribute('href', '/story')
    expect(screen.getByRole('link', { name: /^projects$/i })).toHaveAttribute('href', '/projects')
    const contactLinks = screen.getAllByRole('link', { name: /^contact$/i })
    expect(contactLinks.length).toBeGreaterThanOrEqual(1)
    contactLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/contact')
    })
  })

  it('exposes the contact email', () => {
    renderHelp()
    expect(screen.getByRole('link', { name: /sankalp\.amaravadi33@gmail\.com/i })).toHaveAttribute(
      'href',
      'mailto:Sankalp.Amaravadi33@gmail.com',
    )
  })
})
