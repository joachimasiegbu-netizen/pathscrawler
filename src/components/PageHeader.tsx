// Shared page-header treatment (eyebrow + bold headline + gradient underline
// + muted subtitle) so every page reads with the same "premium" hierarchy
// the Job Market page introduced, instead of each page hand-rolling its own
// heading sizes.

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
}) {
  return (
    <div>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-dark dark:text-primary-light">
          {eyebrow}
        </p>
      ) : null}
      <h2 className={`text-3xl font-extrabold text-slate-950 dark:text-slate-50 sm:text-4xl ${eyebrow ? 'mt-2' : ''}`}>
        {title}
      </h2>
      <div className="mt-3 h-1.5 w-20 rounded-full bg-gradient-to-r from-primary to-accent" />
      {subtitle ? (
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 dark:text-slate-200">{subtitle}</p>
      ) : null}
    </div>
  )
}
