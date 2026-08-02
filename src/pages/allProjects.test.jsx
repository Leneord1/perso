import { describe, it, expect } from 'vitest'
import { render, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import AllProjects from './allProjects'
import { githubProfileUrl, highlightedProjectRows } from '../data/githubProjects.js'

function renderAllProjects() {
  const view = render(
    <MemoryRouter initialEntries={['/projects']}>
      <Routes>
        <Route path="/projects" element={<AllProjects />} />
        <Route path="/projects/personal" element={<h1>Personal stub</h1>} />
        <Route path="/projects/professional" element={<h1>Professional stub</h1>} />
      </Routes>
    </MemoryRouter>,
  )
  return { ...view, ui: within(view.container) }
}

describe('AllProjects', () => {
  it('renders heading, GitHub link, and highlight table', () => {
    const { ui } = renderAllProjects()
    expect(ui.getByRole('heading', { level: 1, name: /^projects$/i })).toBeInTheDocument()
    const profileLink = ui
      .getAllByRole('link', { name: /^github$/i })
      .find((link) => link.getAttribute('href') === githubProfileUrl)
    expect(profileLink).toBeTruthy()
    expect(profileLink).toHaveAttribute('target', '_blank')
    expect(ui.getByRole('columnheader', { name: /project/i })).toBeInTheDocument()
    expect(ui.getByText(highlightedProjectRows[0].name)).toBeInTheDocument()
  })

  it('navigates to personal projects', async () => {
    const user = userEvent.setup()
    const { ui } = renderAllProjects()
    await user.click(ui.getByRole('button', { name: /personal projects/i }))
    expect(await ui.findByRole('heading', { name: /personal stub/i })).toBeInTheDocument()
  })

  it('navigates to professional projects', async () => {
    const user = userEvent.setup()
    const { ui } = renderAllProjects()
    await user.click(ui.getByRole('button', { name: /professional projects/i }))
    expect(await ui.findByRole('heading', { name: /professional stub/i })).toBeInTheDocument()
  })
})
