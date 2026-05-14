import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

function renderApp(initialEntry) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <App />
    </MemoryRouter>,
  )
}

describe('App', () => {
  it('renders the welcome screen at /', () => {
    renderApp('/')
    expect(screen.getByRole('heading', { level: 1, name: /^welcome$/i })).toBeInTheDocument()
  })

  it('renders the contact page at /contact', () => {
    renderApp('/contact')
    expect(screen.getByRole('heading', { level: 1, name: /^contact$/i })).toBeInTheDocument()
  })

  it('renders the projects hub at /projects', () => {
    renderApp('/projects')
    expect(screen.getByRole('heading', { level: 1, name: /^projects$/i })).toBeInTheDocument()
  })

  it('renders the story page at /story', () => {
    renderApp('/story')
    expect(screen.getByRole('heading', { level: 1, name: /my story/i })).toBeInTheDocument()
  })

  it('renders the skills page at /skills', () => {
    renderApp('/skills')
    expect(screen.getByRole('heading', { level: 1, name: /^skills$/i })).toBeInTheDocument()
  })

  it('renders the experience page at /experience', () => {
    renderApp('/experience')
    expect(screen.getByRole('heading', { level: 1, name: /^experience$/i })).toBeInTheDocument()
  })

  it('renders the resume page at /resume', () => {
    renderApp('/resume')
    expect(screen.getByRole('heading', { level: 1, name: /^resume$/i })).toBeInTheDocument()
  })
})
