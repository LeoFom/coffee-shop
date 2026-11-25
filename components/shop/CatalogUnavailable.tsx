'use client'

import { useRouter } from 'next/navigation'

export function CatalogUnavailable({ status }: { status: number }) {
  const router = useRouter()
  const unavailable = status === 503 || status === 502
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-40" role="alert">
      <h1 className="font-serif text-3xl text-brand-brown">
        {unavailable ? 'Shop is temporarily unavailable' : 'We could not load the shop'}
      </h1>
      <p className="mt-4 text-brand-muted">
        {unavailable
          ? 'Your information is safe. Please try again shortly.'
          : 'Please try loading the catalog again.'}
      </p>
      <button
        type="button"
        onClick={() => router.refresh()}
        className="mt-6 rounded-lg bg-brand-brown px-5 py-3 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-brown"
      >
        Try again
      </button>
    </main>
  )
}
