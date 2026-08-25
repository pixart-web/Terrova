import Link from 'next/link'

interface EditorialPageProps {
  eyebrow: string
  title: string
  introduction: string
  note: string
}

export function EditorialPage({ eyebrow, title, introduction, note }: EditorialPageProps) {
  return (
    <main id="main-content" className="editorial-page">
      <p className="editorial-page__eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <div className="editorial-page__body">
        <p>{introduction}</p>
        <p className="editorial-page__note">{note}</p>
        <Link className="text-link" href="/">
          Return to the journey <span aria-hidden="true">→</span>
        </Link>
      </div>
    </main>
  )
}
