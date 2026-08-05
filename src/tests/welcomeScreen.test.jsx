import { describe, it, expect } from 'vitest'
import { render, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import WelcomeScreen from '../pages/welcomeScreen'

function renderWelcomeWithRoutes() {
  const view = render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/projects" element={<h1>Projects stub</h1>} />
        <Route path="/contact" element={<h1>Contact stub</h1>} />
        <Route path="/story" element={<h1>Story stub</h1>} />
        <Route path="/projects/chess" element={<h1>Chess stub</h1>} />
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

  it('navigates to story when My story is clicked', async () => {
    const user = userEvent.setup()
    const { ui } = renderWelcomeWithRoutes()
    await user.click(ui.getByRole('button', { name: /^my story$/i }))
    expect(await ui.findByRole('heading', { name: /story stub/i })).toBeInTheDocument()
  })

  it('navigates to chess when Chess is clicked', async () => {
    const user = userEvent.setup()
    const { ui } = renderWelcomeWithRoutes()
    await user.click(ui.getByRole('button', { name: /^chess$/i }))
    expect(await ui.findByRole('heading', { name: /chess stub/i })).toBeInTheDocument()
  })
})
