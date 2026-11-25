'use client'

export default function ShopError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-40" role="alert">
      <h1 className="font-serif text-3xl text-brand-brown">We could not load this product</h1>
      <p className="mt-4 text-brand-muted">
        The shop may be temporarily unavailable. Please try again.
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-6 rounded-lg bg-brand-brown px-5 py-3 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-brown"
      >
        Try again
      </button>
    </main>
  )
}
