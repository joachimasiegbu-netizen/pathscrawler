// Wraps every case-insensitive occurrence of `query` inside `text` in a
// <mark> so search results can show the matching substring highlighted,
// instead of just returning plain text. Renders `text` untouched when
// there's no query to highlight.

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export default function HighlightMatch({ text, query }: { text: string; query: string }) {
  const normalizedQuery = query.trim()
  if (!normalizedQuery) return <>{text}</>

  const parts = text.split(new RegExp(`(${escapeRegExp(normalizedQuery)})`, 'gi'))

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === normalizedQuery.toLowerCase() ? (
          <mark key={index} className="rounded bg-primary/20 text-primary-dark dark:bg-primary/30 dark:text-primary-light">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  )
}
