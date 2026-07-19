import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import Skills from './skills'

describe('Skills', () => {
  it('renders the heading and intro', () => {
    render(<Skills />)
    expect(screen.getByRole('heading', { level: 1, name: /^skills$/i })).toBeInTheDocument()
    expect(screen.getByText(/languages and tools with approximate depth/i)).toBeInTheDocument()
  })

  it('lists languages with experience', () => {
    render(<Skills />)
    const tables = screen.getAllByRole('table')
    const languageTable = tables[0]
    expect(within(languageTable).getByRole('columnheader', { name: /language/i })).toBeInTheDocument()
    expect(within(languageTable).getByText('Java')).toBeInTheDocument()
    expect(within(languageTable).getByText('JavaScript')).toBeInTheDocument()
    expect(within(languageTable).getByText('React')).toBeInTheDocument()
    expect(within(languageTable).getByText('Docker')).toBeInTheDocument()
  })

  it('lists tools with experience', () => {
    render(<Skills />)
    const tables = screen.getAllByRole('table')
    const toolsTable = tables[1]
    expect(within(toolsTable).getByRole('columnheader', { name: /tools/i })).toBeInTheDocument()
    expect(within(toolsTable).getByText(/github & git/i)).toBeInTheDocument()
    expect(within(toolsTable).getByText(/ci\/cd pipelines/i)).toBeInTheDocument()
  })
})
