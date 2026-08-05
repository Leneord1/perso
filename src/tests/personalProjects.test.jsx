import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PersonalProjects from '../pages/personalProjects'
import { githubProfileUrl, personalProjectRows } from '../data/githubProjects.js'

describe('PersonalProjects', () => {
  it('renders heading and GitHub profile link', () => {
    render(<PersonalProjects />)
    expect(
      screen.getByRole('heading', { level: 1, name: /personal projects/i }),
    ).toBeInTheDocument()
    const github = screen.getByRole('link', { name: /github\.com\/leneord1/i })
    expect(github).toHaveAttribute('href', githubProfileUrl)
    expect(github).toHaveAttribute('target', '_blank')
  })

  it('lists personal project rows in the table', () => {
    render(<PersonalProjects />)
    expect(screen.getByRole('columnheader', { name: /project/i })).toBeInTheDocument()
    for (const row of personalProjectRows) {
      expect(screen.getByText(row.name)).toBeInTheDocument()
    }
  })
})
