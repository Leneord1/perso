import { describe, it, expect } from 'vitest'
import { render, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import WelcomeScreen from './welcomeScreen'

function renderWelcomeWithRoutes() {
  const view = render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/projects" element={<h1>Projects stub</h1>} />
        <Route path="/contact" element={<h1>Contact stub</h1>} />
      </Routes>
    </MemoryRouter>,
  )
  return { ...view, ui: within(view.container) }
}

describe('WelcomeScreen', () => {
  it('renders the hero heading and intro copy', () => {
    const { ui } = renderWelcomeWithRoutes()
    expect(ui.getByRole('heading', { level: 1, name: /^welcome$/i })).toBeInTheDocument()
    expect(
      ui.getByText(/projects, experience, skills, and background/i),
    ).toBeInTheDocument()
  })

  it('navigates to projects when View projects is clicked', async () => {
    const user = userEvent.setup()
    const { ui } = renderWelcomeWithRoutes()
    await user.click(ui.getByRole('button', { name: /^view projects$/i }))
    expect(
      await ui.findByRole('heading', { name: /projects stub/i }),
    ).toBeInTheDocument()
  })

  it('navigates to contact when Contact is clicked', async () => {
    const user = userEvent.setup()
    const { ui } = renderWelcomeWithRoutes()
    await user.click(ui.getByRole('button', { name: /^contact$/i }))
    expect(
      await ui.findByRole('heading', { name: /contact stub/i }),
    ).toBeInTheDocument()
  })
})
