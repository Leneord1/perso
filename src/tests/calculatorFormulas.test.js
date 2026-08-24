import { describe, it, expect } from 'vitest'
import {
  FORMULAS,
  capLocked,
  emptyValues,
  initialLocked,
  solveFormula,
} from '../pages/calculator/calculatorFormulas.js'

function formula(id) {
  return FORMULAS.find((item) => item.id === id)
}

/** Solve from a map of user-entered strings. */
function solve(id, entries) {
  const item = formula(id)
  const values = { ...emptyValues(item), ...entries }
  const locked = capLocked(item, [...initialLocked(item), ...Object.keys(entries)])
  return solveFormula(item, values, locked)
}

describe('calculator formulas', () => {
  it('fills wattage from voltage and current', () => {
    const out = solve('watt', { V: '4', I: '2' })
    expect(out.P).toBe('8')
    expect(out.R).toBe('2')
  })

  it('fills ohm fields from voltage and resistance', () => {
    const out = solve('ohm', { V: '12', R: '4' })
    expect(out.I).toBe('3')
    expect(out.P).toBe('36')
  })

  it('fills newton force from mass and acceleration', () => {
    const out = solve('newton', { m: '2', a: '5' })
    expect(out.F).toBe('10')
  })

  it('fills newton force from mass and velocity change', () => {
    const out = solve('newton', { m: '10', vi: '0', vf: '20', dt: '4' })
    expect(out.a).toBe('5')
    expect(out.F).toBe('50')
  })

  it('fills torque at 90 degrees', () => {
    const out = solve('torque', { r: '0.5', F: '120' })
    expect(out.tau).toBe('60')
  })

  it('fills acceleration from speed change', () => {
    const out = solve('accel', { vi: '0', vf: '10', t: '5' })
    expect(out.a).toBe('2')
    expect(out.s).toBe('25')
  })

  it('fills compound interest for one yearly period', () => {
    const out = solve('compound', { P: '1000', rate: '5', t: '1', n: '1' })
    expect(out.A).toBe('1050')
    expect(out.I).toBe('50')
  })
})
