import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import Story from './story'

function renderStory() {
  return render(
    <MemoryRouter>
      <Story />
    </MemoryRouter>,
  )
}

describe('Story', () => {
  it('renders the story heading and intro', () => {
    renderStory()
    expect(screen.getByRole('heading', { level: 1, name: /my story/i })).toBeInTheDocument()
    expect(screen.getByText(/prospective college student/i)).toBeInTheDocument()
  })

  it('renders section headings for languages, tools, and skills CTA', () => {
    renderStory()
    expect(screen.getByRole('heading', { name: /languages & stacks/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /tools & how i ship/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /full skills breakdown/i })).toBeInTheDocument()
  })

  it('links to the skills page', () => {
    renderStory()
    const skillsLinks = screen.getAllByRole('link', { name: /skills/i })
    expect(skillsLinks.length).toBeGreaterThanOrEqual(1)
    skillsLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/skills')
    })
  })
})
