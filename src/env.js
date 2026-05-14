/**
 * Environment-backed configuration only. Do not hardcode API keys or secrets in source files.
 *
 * Use a local file such as `.env.local` (gitignored) — see `.env.example` for the naming pattern.
 *
 * Vite exposes only `VITE_*` variables to `import.meta.env`. They are still inlined into the
 * production JavaScript bundle, so treat them as public. For true secrets, call your own backend.
 *
 * @param {string} key - Must be `VITE_…` for Vite to inject it (e.g. `VITE_PUBLIC_API_URL`).
 * @returns {string | undefined}
 */
export function readViteEnv(key) {
  if (import.meta.env.DEV && !key.startsWith('VITE_')) {
    console.warn(`[env] "${key}" is not prefixed with VITE_ — Vite will not expose it to the client.`)
  }
  const value = import.meta.env[key]
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined
}
