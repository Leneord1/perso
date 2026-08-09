import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import Navbar from '../navbar'

function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>,
  )
}

describe('Navbar', () => {
  it('renders top-level section labels', () => {
    renderNavbar()
    expect(screen.getByRole('button', { name: /about/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /projects/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /contact/i })).toBeInTheDocument()
  })

  it('opens the About dropdown on hover and exposes internal links', async () => {
    const user = userEvent.setup()
    renderNavbar()
    await user.hover(screen.getByRole('button', { name: /about/i }))
    expect(screen.getByRole('link', { name: /my story/i })).toHaveAttribute('href', '/story')
    expect(screen.getByRole('link', { name: /^resume$/i })).toHaveAttribute('href', '/resume')
    expect(screen.getByRole('link', { name: /skills/i })).toHaveAttribute('href', '/skills')
    expect(screen.getByRole('link', { name: /experience/i })).toHaveAttribute('href', '/experience')
  })

  it('opens tools dropdown from the PNG button and links calendar and calculator', async () => {
    const user = userEvent.setup()
    renderNavbar()
    const toolsBtn = screen.getByRole('button', { name: /calculator and calendar/i })
    expect(toolsBtn.querySelector('img')).toHaveAttribute('src', '/utilities-icon.png')
    await user.hover(toolsBtn)
    const toolsMenu = screen.getByRole('list', { name: /calculator and calendar links/i })
    expect(toolsMenu.querySelector('a[href="/calendar"]')).toHaveTextContent('Calendar')
    expect(toolsMenu.querySelector('a[href="/calculator"]')).toHaveTextContent('Calculator')
  })
})
