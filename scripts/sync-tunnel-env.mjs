/**
 * Syncs .tunnel/state.json → Vercel env (production + preview).
 * Requires: npx vercel login (once)
 * Usage: npm run tunnel:sync
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const statePath = resolve(root, '.tunnel', 'state.json')

if (!existsSync(statePath)) {
  console.error('No .tunnel/state.json — run `npm run tunnel` first.')
  process.exit(1)
}

const state = JSON.parse(readFileSync(statePath, 'utf8'))
if (!state.publicUrl || !state.secret) {
  console.error('Tunnel state incomplete. Wait for the trycloudflare.com URL, then retry.')
  process.exit(1)
}

const model = process.env.OLLAMA_MODEL || 'llama3.1'
const envs = [
  ['OLLAMA_BASE_URL', state.publicUrl],
  ['OLLAMA_TUNNEL_SECRET', state.secret],
  ['OLLAMA_MODEL', model],
]

const targets = ['production', 'preview']

/**
 * Upserts one Vercel env var for a target environment.
 */
function upsertEnv(key, value, target) {
  // Remove existing (ignore failure if missing)
  spawnSync(
    'npx',
    ['vercel', 'env', 'rm', key, target, '-y'],
    { cwd: root, stdio: 'pipe', shell: true },
  )
  const added = spawnSync(
    'npx',
    ['vercel', 'env', 'add', key, target],
    {
      cwd: root,
      input: `${value}\n`,
      encoding: 'utf8',
      shell: true,
    },
  )
  if (added.status !== 0) {
    console.error(added.stderr || added.stdout)
    throw new Error(`Failed to set ${key} (${target})`)
  }
  console.log(`set ${key} → ${target}`)
}

for (const target of targets) {
  for (const [key, value] of envs) {
    upsertEnv(key, value, target)
  }
}

console.log('Done. Redeploy so serverless functions pick up new env:')
console.log('  npx vercel --prod')
