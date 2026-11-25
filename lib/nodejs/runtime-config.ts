export type BackendConfig = { ok: true; origin: string; internalKey?: string } | { ok: false }

export function backendConfig(env: NodeJS.ProcessEnv): BackendConfig {
  const raw = env.API_URL || (env.NODE_ENV === 'production' ? '' : 'http://127.0.0.1:3001')
  if (!raw || (env.NODE_ENV === 'production' && !env.INTERNAL_API_KEY)) return { ok: false }
  try {
    const url = new URL(raw)
    if (url.username || url.password || url.pathname !== '/' || url.search || url.hash)
      return { ok: false }
    if (
      env.NODE_ENV === 'production'
        ? url.protocol !== 'https:'
        : !['http:', 'https:'].includes(url.protocol)
    )
      return { ok: false }
    return {
      ok: true,
      origin: url.origin,
      ...(env.INTERNAL_API_KEY ? { internalKey: env.INTERNAL_API_KEY } : {}),
    }
  } catch {
    return { ok: false }
  }
}
