/**
 * Vite replaces optional peer `next` with a stub that does not export these hooks.
 * `@vercel/speed-insights/next` imports `next/navigation`, which breaks non-Next builds.
 * Aliasing `next/navigation` here keeps accidental `/next` imports from failing the bundle.
 * Prefer `@vercel/speed-insights/react` in this app instead of `/next`.
 */
export function useParams() {
  return {}
}

export function usePathname() {
  const win = globalThis.window
  if (win) {
    return win.location.pathname
  }
  return '/'
}

export function useSearchParams() {
  const win = globalThis.window
  const search = win ? win.location.search : ''
  return new URLSearchParams(search)
}
