/**
 * Syncs .tunnel/state.json → Vercel env (production + preview).
 * Requires: npx vercel login (once)
 * Usage: npm run tunnel:sync
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname, delimiter } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const statePath = resolve(root, '.tunnel', 'state.json')

// Hardened env: restrict PATH to fixed, non-writable system dirs (S4036).
// Node ships npx alongside itself, so its install dir is the only extra entry.
const SAFE_PATH = [
  dirname(process.execPath),
  ...(process.platform === 'win32'
    ? ['C:\\Windows\\System32', 'C:\\Windows']
    : ['/usr/local/bin', '/usr/bin', '/bin']),
].join(delimiter)

const SAFE_ENV = (() => {
  const env = { ...process.env }
  // Strip any PATH casing so our value is not shadowed on Windows.
  for (const key of Object.keys(env)) {
    if (key.toLowerCase() === 'path') delete env[key]
  }
  env.PATH = SAFE_PATH
  return env
})()

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
    { cwd: root, stdio: 'pipe', shell: true, env: SAFE_ENV },
  )
  const added = spawnSync(
    'npx',
    ['vercel', 'env', 'add', key, target],
    {
      cwd: root,
      input: `${value}\n`,
      encoding: 'utf8',
      shell: true,
      env: SAFE_ENV,
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
