import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import Calculator, { CalculatorPad } from '../pages/calculator/calculator'

function renderPage() {
  return render(
    <MemoryRouter>
      <Calculator />
    </MemoryRouter>,
  )
}

/** Read the live display value. */
function displayValue() {
  return document.querySelector('.calc-pad__display').textContent.trim()
}

describe('Calculator page', () => {
  it('renders extra functions on the full page', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 1, name: /^calculator$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /square root/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^square$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reciprocal/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^power$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^modulo$/i })).toBeInTheDocument()
  })

  it('computes square root, square, and reciprocal', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: '9' }))
    await user.click(screen.getByRole('button', { name: /square root/i }))
    expect(displayValue()).toBe('3')

    await user.click(screen.getByRole('button', { name: 'C' }))
    await user.click(screen.getByRole('button', { name: '5' }))
    await user.click(screen.getByRole('button', { name: /^square$/i }))
    expect(displayValue()).toBe('25')

    await user.click(screen.getByRole('button', { name: 'C' }))
    await user.click(screen.getByRole('button', { name: '4' }))
    await user.click(screen.getByRole('button', { name: /reciprocal/i }))
    expect(displayValue()).toBe('0.25')
  })

  it('computes power as a chained operator', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: /^power$/i }))
    await user.click(screen.getByRole('button', { name: '8' }))
    await user.click(screen.getByRole('button', { name: '=' }))
    expect(displayValue()).toBe('256')
  })

  it('computes modulo as a chained operator', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('button', { name: '0' }))
    await user.click(screen.getByRole('button', { name: /^modulo$/i }))
    await user.click(screen.getByRole('button', { name: '3' }))
    await user.click(screen.getByRole('button', { name: '=' }))
    expect(displayValue()).toBe('1')
  })
})

describe('CalculatorPad compact', () => {
  it('hides extra functions without extended', () => {
    render(<CalculatorPad />)
    expect(screen.queryByRole('button', { name: /square root/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^power$/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^modulo$/i })).not.toBeInTheDocument()
  })
})

describe('Calculator formulas', () => {
  it('shows formula buttons on the page', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /^wattage$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ohm's law/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /newton's second law/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^torque$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /acceleration & velocity/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /compound interest/i })).toBeInTheDocument()
  })

  it('fills wattage fields from voltage and current', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: /^wattage$/i }))
    await user.type(screen.getByLabelText('Voltage (V)'), '120')
    await user.type(screen.getByLabelText('Current (I)'), '0.5')
    expect(screen.getByLabelText('Power (P)')).toHaveValue('60')
    expect(screen.getByLabelText('Resistance (R)')).toHaveValue('240')
  })
})
