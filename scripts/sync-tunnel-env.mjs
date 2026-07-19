/**
 * Syncs .tunnel/state.json → Vercel env (production + preview).
 * Requires: npx vercel login (once)
 * Usage: npm run tunnel:sync
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const statePath = resolve(root, '.tunnel', 'state.json')

// Absolute npx entry — never a bare command name (S4036).
const NPX_CLI = join(
  dirname(process.execPath),
  'node_modules',
  'npm',
  'bin',
  'npx-cli.js',
)

/**
 * Builds env with PATH = fixed, unwriteable system dirs only (S4036).
 */
function safeEnv() {
  const env = { ...process.env }
  for (const key of Object.keys(env)) {
    if (key.toLowerCase() === 'path') delete env[key]
  }
  // Literals only — no dirname(process.execPath), no /usr/local/bin.
  env.PATH =
    process.platform === 'win32'
      ? 'C:\\Windows\\System32;C:\\Windows'
      : '/usr/bin:/bin'
  return env
}

/**
 * Runs vercel via absolute node + npx-cli (no PATH, no shell).
 */
function runNpx(args, options = {}) {
  if (!existsSync(NPX_CLI)) {
    throw new Error(`npx CLI not found at ${NPX_CLI}`)
  }
  return spawnSync(process.execPath, [NPX_CLI, ...args], {
    cwd: root,
    shell: false,
    env: safeEnv(),
    encoding: 'utf8',
    ...options,
  })
}

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
  runNpx(['vercel', 'env', 'rm', key, target, '-y'], { stdio: 'pipe' })
  const added = runNpx(['vercel', 'env', 'add', key, target], {
    input: `${value}\n`,
    stdio: ['pipe', 'pipe', 'pipe'],
  })
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
