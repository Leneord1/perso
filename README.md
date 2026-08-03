# perso — Personal Website

React + Vite portfolio site deployed on Vercel. Includes resume, projects, photography, an in-browser chess game, and a Groq-backed chatbot.

Repository: Leneord1/perso
Updated: 2026-08-03

## Stack

- React 19 + Vite 8 + React Router 7
- Vitest + Testing Library
- Vercel (static site + `api/chat.js` serverless)
- Groq (hosted LLM for chatbot)

## Pages

| Route | Description |
| --- | --- |
| `/` | Welcome / home |
| `/story` | About / my story |
| `/resume` | Resume (experience, education, etc.) |
| `/skills` | Skills |
| `/experience` | Job experience |
| `/projects` | All projects |
| `/projects/personal` | Personal projects |
| `/projects/professional` | Professional projects |
| `/projects/chess` | Play chess in the browser |
| `/photography` | Photography portfolio |
| `/contact` | Contact + LinkedIn / GitHub |

Site-wide floating chatbot is available on every page.

## Scripts

```bash
npm install
npm run dev          # Vite + local /api/chat → Groq
npm run build        # production build
npm run preview      # preview build
npm run lint         # ESLint
npm test             # Vitest (watch)
npm run test:run     # Vitest (CI / once)
```

## Local setup

1. `npm install`
2. Copy `.env.example` → `.env.local` (optional)
3. To run the chatbot locally, create a key at [console.groq.com/keys](https://console.groq.com/keys) and set `GROQ_API_KEY` in `.env.local`
4. `npm run dev` → http://localhost:5173

Dev chat traffic: browser → Vite `/api/chat` middleware → Groq.

## Production chatbot (Groq)

1. This repository's Vercel project already has `GROQ_API_KEY` configured in the project environment (server-only).
2. Optionally set `GROQ_MODEL` in Vercel (default `llama-3.1-8b-instant`) or in `.env.local` for local testing.
3. Apply to Production and Preview and redeploy if you change Vercel environment variables.

`api/chat.js` proxies chat to Groq. No local machine or tunnel required for production.

## Env vars

See `.env.example`.

| Variable | Where | Purpose |
| --- | --- | --- |
| `GROQ_API_KEY` | Vercel (configured for this project; server-only) + `.env.local` (optional for local dev) | Groq API key (server-only) |
| `GROQ_MODEL` | Vercel + `.env.local` (optional) | Model id (default `llama-3.1-8b-instant`) |
| `VITE_CHAT_API_URL` | local (optional) | Override chat endpoint |

Never commit `.env.local` or real secrets.

## CI

- **CodeQL** — `.github/workflows/codeql.yml`
- **SonarQube** — `.github/workflows/sonarqube.yml`

## Deploy

Configured for Vercel (`vercel.json`: Vite framework, `api/chat.js` max duration 60s, long-cache for hashed assets).

## Contributing

Contributions welcome — open an issue or a pull request with proposed changes.
