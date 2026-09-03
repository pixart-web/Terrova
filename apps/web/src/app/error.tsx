'use client'

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main id="main-content" className="status-page">
      <p className="page-eyebrow">Terrova / A temporary pause</p>
      <h1>
        The trail went
        <br />
        quiet.
      </h1>
      <p>We could not load this page safely. No action or payment was completed.</p>
      <button onClick={reset}>Try again</button>
    </main>
  )
}
