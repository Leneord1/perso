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

  it('renders separate calendar and calculator icon buttons on the right', () => {
    renderNavbar()
    const calendar = screen.getByRole('button', { name: /^calendar$/i })
    const calculator = screen.getByRole('button', { name: /^calculator$/i })
    expect(calendar.querySelector('img')).toHaveAttribute('src', '/calendar-icon.png')
    expect(calculator.querySelector('img')).toHaveAttribute('src', '/calculator-icon.png')
  })

  it('opens calendar dropdown pad from the icon button', async () => {
    const user = userEvent.setup()
    renderNavbar()
    await user.click(screen.getByRole('button', { name: /^calendar$/i }))
    expect(screen.getByRole('button', { name: /^today$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /open full page/i })).toHaveAttribute('href', '/calendar')
  })

  it('opens calculator dropdown pad from the icon button', async () => {
    const user = userEvent.setup()
    renderNavbar()
    await user.click(screen.getByRole('button', { name: /^calculator$/i }))
    expect(screen.getByRole('group', { name: /calculator keypad/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /open full page/i })).toHaveAttribute('href', '/calculator')
  })

  it('keeps Utilities as a dropdown with hub and resume parser links', async () => {
    const user = userEvent.setup()
    renderNavbar()
    await user.hover(screen.getByRole('button', { name: /utilities/i }))
    expect(screen.getByRole('link', { name: /^utilities$/i })).toHaveAttribute('href', '/utilities')
    expect(screen.getByRole('link', { name: /resume parser/i })).toHaveAttribute('href', '/resume-parser')
  })
})
