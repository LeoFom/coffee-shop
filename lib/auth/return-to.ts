const allowed = ['/dashboard', '/dashboard/products', '/orders', '/profile', '/membership'] as const

export function safeReturnTo(value: string | null | undefined): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\'))
    return '/dashboard'
  try {
    const url = new URL(value, 'https://coffeo.invalid')
    if (url.origin !== 'https://coffeo.invalid' || url.username || url.password || url.hash)
      return '/dashboard'
    if (!allowed.includes(url.pathname as (typeof allowed)[number])) return '/dashboard'
    return url.pathname
  } catch {
    return '/dashboard'
  }
}
