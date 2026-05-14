import { describe, it, expect } from 'vitest'
import { getAgentReply, getWelcomeMessage, SITE_PATHS } from './chatAgent.js'

describe('getAgentReply', () => {
  it('returns default actions for empty input', () => {
    const r = getAgentReply('   ')
    expect(r.actions?.length).toBeGreaterThan(0)
    expect(r.content).toMatch(/ask/i)
  })

  it('routes skills questions to the skills page', () => {
    const r = getAgentReply('What is your tech stack?')
    expect(r.content).toMatch(/skills/i)
    expect(r.actions?.some((a) => a.to === SITE_PATHS.skills)).toBe(true)
  })

  it('routes contact questions', () => {
    const r = getAgentReply('How can I reach you by email?')
    expect(r.content).toMatch(/contact/i)
    expect(r.actions?.some((a) => a.to === SITE_PATHS.contact)).toBe(true)
    expect(r.actions?.some((a) => a.to.startsWith('mailto:'))).toBe(true)
  })

  it('offers GitHub for repo questions', () => {
    const r = getAgentReply('Show me your GitHub repos')
    expect(r.actions?.some((a) => a.external && a.to.includes('github'))).toBe(true)
  })

  it('falls back with suggestions for unknown text', () => {
    const r = getAgentReply('asdf jkl semicolon')
    expect(r.actions?.length).toBeGreaterThan(0)
    expect(r.content).toMatch(/didn/i)
  })
})

describe('getWelcomeMessage', () => {
  it('returns an assistant-shaped welcome object', () => {
    const w = getWelcomeMessage()
    expect(w.role).toBe('assistant')
    expect(w.id).toBe('welcome')
    expect(w.actions?.length).toBeGreaterThan(0)
  })
})
