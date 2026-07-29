import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProfessionalProjects from './professionalProjects'
import { githubProfileUrl, professionalProjectRows } from '../data/githubProjects.js'

describe('ProfessionalProjects', () => {
  it('renders heading and GitHub profile link', () => {
    render(<ProfessionalProjects />)
    expect(
      screen.getByRole('heading', { level: 1, name: /professional projects/i }),
    ).toBeInTheDocument()
    const profileLink = screen
      .getAllByRole('link', { name: /^github$/i })
      .find((link) => link.getAttribute('href') === githubProfileUrl)
    expect(profileLink).toBeTruthy()
    expect(profileLink).toHaveAttribute('target', '_blank')
  })

  it('lists professional project rows in the table', () => {
    render(<ProfessionalProjects />)
    expect(screen.getByRole('columnheader', { name: /project/i })).toBeInTheDocument()
    for (const row of professionalProjectRows) {
      expect(screen.getByText(row.name)).toBeInTheDocument()
    }
  })
})
