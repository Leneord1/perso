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

/**
 * Returns assistant copy and optional quick actions for the portfolio chat agent.
 * @param {string} raw
 * @returns {{ content: string, actions?: { label: string, to: string, external?: boolean }[] }}
 */
export function getAgentReply(raw) {
  const t = raw.trim().toLowerCase()

  if (!t) {
    return {
      content: 'Ask about projects, skills, experience, or how to reach Sankalp.',
      actions: DEFAULT_ACTIONS,
    }
  }

  if (/\b(help|what can you|what do you do|capabilities)\b/.test(t)) {
    return {
      content:
        'I answer questions about this portfolio and link you to the right page—projects, story, skills, experience, and contact details.',
      actions: DEFAULT_ACTIONS,
    }
  }

  if (/(^|\b)(hi|hello|hey|howdy|good (morning|afternoon|evening))\b/.test(t)) {
    return {
      content:
        'Hi! I’m the site assistant for Sankalp’s portfolio. What would you like to explore?',
      actions: DEFAULT_ACTIONS,
    }
  }

  if (/\b(thanks|thank you|ty)\b/.test(t)) {
    return {
      content: 'You’re welcome—enjoy the site.',
      actions: [{ label: 'Home', to: SITE_PATHS.home }],
    }
  }

  if (/\b(my story|your story|background|biography|who is|about sankalp)\b/.test(t)) {
    return {
      content: 'The Story page has background and narrative about Sankalp’s path.',
      actions: [
        { label: 'Open Story', to: SITE_PATHS.story },
        { label: 'Experience', to: SITE_PATHS.experience },
      ],
    }
  }

  if (/\b(skill|tech stack|stack|languages|frameworks|tools)\b/.test(t)) {
    return {
      content: 'Skills and technologies are summarized on the Skills page.',
      actions: [
        { label: 'View Skills', to: SITE_PATHS.skills },
        { label: 'Projects', to: SITE_PATHS.projects },
      ],
    }
  }

  if (/\b(work history|resume|cv|job|career|employment|experience)\b/.test(t)) {
    return {
      content: 'Work history and roles are on the Experience page.',
      actions: [
        { label: 'Experience', to: SITE_PATHS.experience },
        { label: 'Story', to: SITE_PATHS.story },
      ],
    }
  }

  if (/\b(personal project|side project|hobby project)\b/.test(t)) {
    return {
      content: 'Personal projects live in their own section.',
      actions: [
        { label: 'Personal projects', to: SITE_PATHS.projectsPersonal },
        { label: 'All projects', to: SITE_PATHS.projects },
      ],
    }
  }

  if (/\b(professional|work project|client)\b/.test(t)) {
    return {
      content: 'Professional highlights are listed separately from personal work.',
      actions: [
        { label: 'Professional projects', to: SITE_PATHS.projectsProfessional },
        { label: 'All projects', to: SITE_PATHS.projects },
      ],
    }
  }

  if (/\b(project|repo|github portfolio|portfolio)\b/.test(t)) {
    return {
      content:
        'The Projects hub summarizes GitHub highlights; you can open personal or professional lists from there.',
      actions: [
        { label: 'Projects hub', to: SITE_PATHS.projects },
        { label: 'GitHub profile', to: GITHUB, external: true },
      ],
    }
  }

  if (/\b(linkedin|linked in)\b/.test(t)) {
    return {
      content: 'LinkedIn profile opens in a new tab.',
      actions: [{ label: 'Open LinkedIn', to: LINKEDIN, external: true }],
    }
  }

  if (/\b(github|git hub|repos?|repositories)\b/.test(t)) {
    return {
      content: 'Code and repositories are on GitHub.',
      actions: [
        { label: 'GitHub', to: GITHUB, external: true },
        { label: 'Projects', to: SITE_PATHS.projects },
      ],
    }
  }

  if (/\b(email|mail|contact|reach out|get in touch|message)\b/.test(t)) {
    return {
      content:
        'Use the Contact page for email and social links, including Sankalp.Amaravadi33@gmail.com.',
      actions: [
        { label: 'Contact page', to: SITE_PATHS.contact },
        { label: 'Email', to: 'mailto:Sankalp.Amaravadi33@gmail.com', external: true },
      ],
    }
  }

  if (/\b(home|landing|start|main page)\b/.test(t)) {
    return {
      content: 'The welcome screen is the home page.',
      actions: [{ label: 'Go home', to: SITE_PATHS.home }],
    }
  }

  return {
    content: 'I didn’t catch that. Try keywords like projects, skills, experience, story, contact, GitHub, or LinkedIn.',
    actions: DEFAULT_ACTIONS,
  }
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
