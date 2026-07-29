import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Experience from './experience'

describe('Experience', () => {
  it('renders the heading and summary copy', () => {
    render(<Experience />)
    expect(screen.getByRole('heading', { level: 1, name: /^experience$/i })).toBeInTheDocument()
    expect(screen.getByText(/summarize roles, impact, and technologies/i)).toBeInTheDocument()
  })
})
