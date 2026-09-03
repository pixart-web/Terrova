export function PageHero({
  eyebrow,
  title,
  introduction,
}: {
  eyebrow: string
  title: React.ReactNode
  introduction: string
}) {
  return (
    <header className="page-hero">
      <p className="page-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="page-introduction">{introduction}</p>
    </header>
  )
}

export function BottleMark({ tone = 'wine' }: { tone?: 'wine' | 'vine' | 'terracotta' }) {
  return (
    <span className={`bottle-mark bottle-mark--${tone}`} aria-hidden="true">
      <span className="bottle-mark__neck" />
      <span className="bottle-mark__body">
        <span>Terrova</span>
      </span>
    </span>
  )
}

export function StructuredData({ value }: { value: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(value).replace(/</g, '\\u003c') }}
    />
  )
}
