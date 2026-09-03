import Link from 'next/link'

export default function NotFound() {
  return (
    <main id="main-content" className="status-page">
      <p className="page-eyebrow">404 / Off the map</p>
      <h1>
        This path ends
        <br />
        before the vines.
      </h1>
      <p>The story may have moved, returned to draft, or never been published.</p>
      <Link className="button-link" href="/">
        Return to Terrova
      </Link>
    </main>
  )
}
