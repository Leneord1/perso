import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import Experience from './experience'

function renderExperience() {
  return render(
    <MemoryRouter>
      <Experience />
    </MemoryRouter>,
  )
}

describe('Experience', () => {
  it('renders the heading and intro', () => {
    renderExperience()
    expect(screen.getByRole('heading', { level: 1, name: /^experience$/i })).toBeInTheDocument()
    expect(screen.getByText(/roles, impact, and technologies/i)).toBeInTheDocument()
  })

  it('renders role section headings', () => {
    renderExperience()
    expect(
      screen.getByRole('heading', { name: /senior capstone \/ website development intern/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /operations lead/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^express technician$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^tesla technician$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /earlier service & retail roles/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /community & leadership/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /what i am looking for/i })).toBeInTheDocument()
  })

  it('lists key employers', () => {
    renderExperience()
    expect(screen.getAllByText(/georgia watch/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/hamsini decorations/i)).toBeInTheDocument()
    expect(screen.getByText(/nalley lexus/i)).toBeInTheDocument()
    expect(screen.getByText(/^tesla$/i)).toBeInTheDocument()
    expect(screen.getByText(/carriage nissan/i)).toBeInTheDocument()
  })

  it('links to resume, skills, and story', () => {
    renderExperience()
    expect(screen.getByRole('link', { name: /^resume$/i })).toHaveAttribute('href', '/resume')
    expect(screen.getByRole('link', { name: /^skills$/i })).toHaveAttribute('href', '/skills')
    expect(screen.getByRole('link', { name: /my story/i })).toHaveAttribute('href', '/story')
  })
})
