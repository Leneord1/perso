import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './navbar'

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
    expect(screen.getByRole('link', { name: /skills/i })).toHaveAttribute('href', '/skills')
    expect(screen.getByRole('link', { name: /experience/i })).toHaveAttribute('href', '/experience')
  })

  it('marks external social links with security attributes', async () => {
    const user = userEvent.setup()
    renderNavbar()
    await user.hover(screen.getByRole('button', { name: /contact/i }))
    const linkedIn = screen.getByRole('link', { name: /linkedin/i })
    expect(linkedIn).toHaveAttribute('target', '_blank')
    expect(linkedIn).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
