function collectText(node: unknown): string[] {
  if (!node || typeof node !== 'object') return []
  const record = node as Record<string, unknown>
  const own = typeof record.text === 'string' ? [record.text] : []
  const children = Array.isArray(record.children) ? record.children.flatMap(collectText) : []
  return [...own, ...children]
}

export function RichText({ value }: { value: unknown }) {
  const root =
    value && typeof value === 'object' ? (value as Record<string, unknown>).root : undefined
  const nodes =
    root && typeof root === 'object' ? (root as Record<string, unknown>).children : undefined
  const paragraphs = Array.isArray(nodes)
    ? nodes.map((node) => collectText(node).join('')).filter(Boolean)
    : []

  if (paragraphs.length === 0) return null
  return (
    <div className="rich-text">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  )
}
