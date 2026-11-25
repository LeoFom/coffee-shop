'use client'

export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="en">
      <body
        style={{ margin: 0, background: '#f7f3ed', color: '#3b2b24', fontFamily: 'sans-serif' }}
      >
        <main role="alert" style={{ maxWidth: 640, margin: '15vh auto', padding: 24 }}>
          <h1>Service temporarily unavailable</h1>
          <p>We could not load this page. Your information has not been changed.</p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              padding: '12px 20px',
              background: '#3b2b24',
              color: 'white',
              border: 0,
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
