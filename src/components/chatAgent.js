import { readViteEnv } from '../env.js'

/** In-app routes the assistant can suggest. */
export const SITE_PATHS = {
  home: '/',
  story: '/story',
  skills: '/skills',
  experience: '/experience',
  projects: '/projects',
  projectsPersonal: '/projects/personal',
  projectsProfessional: '/projects/professional',
  contact: '/contact',
}

const DEFAULT_ACTIONS = [
  { label: 'Projects', to: SITE_PATHS.projects },
  { label: 'Story', to: SITE_PATHS.story },
  { label: 'Contact', to: SITE_PATHS.contact },
]

const LINKEDIN = 'https://linkedin.com/in/sankalp-amaravadi-147202291'
const GITHUB = 'https://github.com/Leneord1'

const SYSTEM_PROMPT = `You are the site assistant for Sankalp Amaravadi's personal portfolio.
Answer briefly (2–4 sentences). Stay on portfolio topics: story, skills, experience, projects, contact.
If unsure, point visitors to the matching page.

Facts:
- Prospective college student aiming for a bachelor's in software engineering.
- Background: Tesla service internship, express technician; Website Development Intern at Georgia Watch (React, APIs, testing, deployment).
- Stack: Java, JavaScript, Python, React, Node.js, HTML, CSS, SQL, Docker; Supabase/PostgreSQL; GitHub Actions CI/CD.
- Seeking software engineering internships / early-career roles (frontend, full-stack, generalist).
- Email: Sankalp.Amaravadi33@gmail.com
- GitHub: ${GITHUB}
- LinkedIn: ${LINKEDIN}
- Site paths: / (home), /story, /skills, /experience, /projects, /projects/personal, /projects/professional, /contact`

/**
 * Quick-nav buttons from user text keywords.
 * @param {string} raw
 * @returns {{ label: string, to: string, external?: boolean }[]}
 */
export function suggestActions(raw) {
  const t = raw.trim().toLowerCase()
  if (!t) return DEFAULT_ACTIONS

  if (/\b(skills?|tech stack|stack|languages|frameworks|tools)\b/.test(t)) {
    return [
      { label: 'View Skills', to: SITE_PATHS.skills },
      { label: 'Projects', to: SITE_PATHS.projects },
    ]
  }
  if (/\b(work history|resume|cv|job|career|employment|experience)\b/.test(t)) {
    return [
      { label: 'Experience', to: SITE_PATHS.experience },
      { label: 'Story', to: SITE_PATHS.story },
    ]
  }
  if (/\b(my story|your story|background|biography|who is|about sankalp)\b/.test(t)) {
    return [
      { label: 'Open Story', to: SITE_PATHS.story },
      { label: 'Experience', to: SITE_PATHS.experience },
    ]
  }
  if (/\b(personal project|side project|hobby project)\b/.test(t)) {
    return [
      { label: 'Personal projects', to: SITE_PATHS.projectsPersonal },
      { label: 'All projects', to: SITE_PATHS.projects },
    ]
  }
  if (/\b(professional|work project|client)\b/.test(t)) {
    return [
      { label: 'Professional projects', to: SITE_PATHS.projectsProfessional },
      { label: 'All projects', to: SITE_PATHS.projects },
    ]
  }
  if (/\b(project|repo|github portfolio|portfolio)\b/.test(t)) {
    return [
      { label: 'Projects hub', to: SITE_PATHS.projects },
      { label: 'GitHub profile', to: GITHUB, external: true },
    ]
  }
  if (/\b(linkedin|linked in)\b/.test(t)) {
    return [{ label: 'Open LinkedIn', to: LINKEDIN, external: true }]
  }
  if (/\b(github|git hub|repos?|repositories)\b/.test(t)) {
    return [
      { label: 'GitHub', to: GITHUB, external: true },
      { label: 'Projects', to: SITE_PATHS.projects },
    ]
  }
  if (/\b(email|mail|contact|reach out|get in touch|message)\b/.test(t)) {
    return [
      { label: 'Contact page', to: SITE_PATHS.contact },
      { label: 'Email', to: 'mailto:Sankalp.Amaravadi33@gmail.com', external: true },
    ]
  }
  if (/\b(home|landing|start|main page)\b/.test(t)) {
    return [{ label: 'Go home', to: SITE_PATHS.home }]
  }

  return DEFAULT_ACTIONS
}

function chatApiUrl() {
  return readViteEnv('VITE_CHAT_API_URL') || '/api/chat'
}

function ollamaModel() {
  return readViteEnv('VITE_OLLAMA_MODEL') || 'llama3.1'
}

/**
 * Asks Ollama (via /api/chat) for a reply; attaches keyword quick-actions.
 * @param {string} raw
 * @param {{ role: string, content: string }[]} [history]
 * @returns {Promise<{ content: string, actions?: { label: string, to: string, external?: boolean }[] }>}
 */
export async function getAgentReply(raw, history = []) {
  const text = raw.trim()
  const actions = suggestActions(text)

  if (!text) {
    return {
      content: 'Ask about projects, skills, experience, or how to reach Sankalp.',
      actions,
    }
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: text },
  ]

  const url = chatApiUrl()
  let res
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: ollamaModel(),
        messages,
        stream: false,
      }),
    })
  } catch {
    return {
      content:
        'Could not reach the chat API. Locally: run `ollama serve` and `npm run dev`. On Vercel: run `npm run tunnel` + `npm run tunnel:sync`, then redeploy.',
      actions,
    }
  }

  if (!res.ok) {
    let detail = ''
    try {
      const errBody = await res.json()
      detail = errBody?.error || ''
    } catch {
      detail = await res.text().catch(() => '')
    }
    const suffix = detail
      ? ` ${String(detail).slice(0, 200)}`
      : ' Check Ollama is running and OLLAMA_BASE_URL on deploy.'
    return {
      content: `Ollama error (${res.status}).${suffix}`,
      actions,
    }
  }

  const data = await res.json()
  const content = data?.message?.content?.trim()
  if (!content) {
    return {
      content: 'Ollama returned an empty reply. Try another model or question.',
      actions,
    }
  }

  return { content, actions }
}

export function getWelcomeMessage() {
  return {
    id: 'welcome',
    role: 'assistant',
    content:
      'Hi! I’m your guide for this site. Ask a question in your own words, or use a shortcut below.',
    actions: DEFAULT_ACTIONS,
  }
}
