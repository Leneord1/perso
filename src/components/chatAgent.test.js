import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getAgentReply, getWelcomeMessage, suggestActions, SITE_PATHS } from './chatAgent.js'

describe('suggestActions', () => {
  it('returns default actions for empty input', () => {
    expect(suggestActions('   ').length).toBeGreaterThan(0)
  })

  it('routes skills questions to the skills page', () => {
    const actions = suggestActions('What is your tech stack?')
    expect(actions.some((a) => a.to === SITE_PATHS.skills)).toBe(true)
  })

  it('routes contact questions', () => {
    const actions = suggestActions('How can I reach you by email?')
    expect(actions.some((a) => a.to === SITE_PATHS.contact)).toBe(true)
    expect(actions.some((a) => a.to.startsWith('mailto:'))).toBe(true)
  })

  it('offers GitHub for repo questions', () => {
    const actions = suggestActions('Show me your GitHub repos')
    expect(actions.some((a) => a.external && a.to.includes('github'))).toBe(true)
  })
})

describe('getAgentReply', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ message: { role: 'assistant', content: 'Ollama says hello.' } }),
      })),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns guidance for empty input without calling Ollama', async () => {
    const r = await getAgentReply('   ')
    expect(r.content).toMatch(/ask/i)
    expect(r.actions?.length).toBeGreaterThan(0)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('posts to Ollama chat and returns model content', async () => {
    const r = await getAgentReply('Tell me about skills')
    expect(r.content).toBe('Ollama says hello.')
    expect(r.actions?.some((a) => a.to === SITE_PATHS.skills)).toBe(true)
    expect(fetch).toHaveBeenCalledOnce()
    const [url, opts] = fetch.mock.calls[0]
    expect(url).toBe('/api/chat')
    expect(opts.method).toBe('POST')
    const body = JSON.parse(opts.body)
    expect(body.stream).toBe(false)
    expect(body.messages.some((m) => m.role === 'system')).toBe(true)
    expect(body.messages.at(-1)).toEqual({ role: 'user', content: 'Tell me about skills' })
  })

  it('surfaces a clear error when Ollama is unreachable', async () => {
    fetch.mockRejectedValueOnce(new Error('network'))
    const r = await getAgentReply('hello')
    expect(r.content).toMatch(/ollama/i)
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
