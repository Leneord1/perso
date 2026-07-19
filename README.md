# Sankalp Amaravadi — Personal Website

React + Vite portfolio site deployed on Vercel. Includes resume, projects, photography, an in-browser chess game, and an Ollama-backed chatbot.

## Stack

- React 19 + Vite 8 + React Router 7
- Vitest + Testing Library
- Vercel (static site + `api/chat.js` serverless)
- Ollama (local LLM for chatbot)
- Cloudflare quick tunnel (prod chatbot → home Ollama)

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
npm run dev          # Vite dev server (proxies /api/chat → local Ollama)
npm run build        # production build
npm run preview      # preview build
npm run lint         # ESLint
npm test             # Vitest (watch)
npm run test:run     # Vitest (CI / once)
npm run tunnel       # auth proxy + Cloudflare tunnel for Ollama
npm run tunnel:sync  # push tunnel URL/secret into Vercel env
```

## Local setup

1. `npm install`
2. Copy `.env.example` → `.env.local` if you need overrides (optional)
3. Install [Ollama](https://ollama.com/) and pull a model (default `llama3.1`):
   ```bash
   ollama pull llama3.1
   ```
4. `npm run dev` → http://localhost:5173

Dev chat traffic: browser → Vite `/api/chat` proxy → `http://127.0.0.1:11434`.

## Production chatbot (Ollama tunnel)

Vercel cannot reach your PC’s Ollama directly. Keep a tunnel running, then sync env and redeploy.

**Prereqs:** Ollama running, [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/) installed, `npx vercel login` once.

```bash
# Terminal A — leave running
npm run tunnel

# Terminal B — writes OLLAMA_BASE_URL / OLLAMA_TUNNEL_SECRET / OLLAMA_MODEL to Vercel
npm run tunnel:sync

# Redeploy so serverless picks up env
npx vercel --prod
```

`api/chat.js` proxies chat to the tunnel URL with Bearer auth. If `OLLAMA_BASE_URL` is missing, the API returns 503 with setup hints.

Tunnel state is written to `.tunnel/state.json` (gitignored).

## Env vars

See `.env.example`.

| Variable | Where | Purpose |
| --- | --- | --- |
| `OLLAMA_BASE_URL` | Vercel | Tunnel public URL |
| `OLLAMA_TUNNEL_SECRET` | Vercel + tunnel | Shared secret for tunnel auth |
| `OLLAMA_MODEL` | Vercel | Model name (default `llama3.1`) |
| `VITE_OLLAMA_MODEL` | local (optional) | Client-side model hint |
| `VITE_CHAT_API_URL` | local (optional) | Override chat endpoint |

Never commit `.env.local` or real secrets.

## CI

- **CodeQL** — `.github/workflows/codeql.yml`
- **SonarQube** — `.github/workflows/sonarqube.yml`

## Deploy

Configured for Vercel (`vercel.json`: Vite framework, `api/chat.js` max duration 10s, long-cache for hashed assets).
