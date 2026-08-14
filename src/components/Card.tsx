import { type KeyboardEvent, type ReactNode } from 'react'
import CountUpStat from './CountUpStat'

interface CardProps {
  title: ReactNode
  description?: string
  badge?: string
  children?: ReactNode
  // The Pathway Results page shows a full grid of career cards where every
  // salary badge would count up at once - the Results page wants those
  // static (see ResultPage.tsx). Other callers (Backtrack careers list,
  // Career Detail's "Similar careers") keep the default count-up.
  animateBadge?: boolean
  /**
   * Makes the WHOLE card a keyboard/screen-reader-accessible link-like
   * control (role="link", tabIndex, click + Enter/Space) instead of a
   * purely presentational card - optional and off by default, so every
   * existing caller of this shared component (RoleSelectionPage,
   * BacktrackCareersListPage, ESOLSubjectPage, QualificationRecognitionPage,
   * CareerDetailPage's "Similar careers") keeps rendering exactly as
   * before without passing it. Callers with their OWN buttons/links inside
   * `children` need to stopPropagation on those, or a click there will
   * also trigger this.
   */
  onClick?: () => void
  /** Accessible name for screen readers when onClick is set (e.g. "Software Developer, view career details") - pass this whenever onClick is used. */
  ariaLabel?: string
}

export default function Card({ title, description, badge, children, animateBadge = true, onClick, ariaLabel }: CardProps) {
  const isInteractive = Boolean(onClick)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
  }

  return (
    <div
      role={isInteractive ? 'link' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      aria-label={isInteractive ? ariaLabel : undefined}
      className={`group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:z-10 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-md dark:border-slate-700 dark:bg-slate-800 ${
        isInteractive ? 'cursor-pointer active:scale-[0.98] hover:border-primary/40 dark:hover:border-primary-light/40' : ''
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-slate-950 dark:text-slate-50">{title}</h3>
          {description ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{description}</p> : null}
        </div>
        {badge ? (
          <span className="shrink-0 whitespace-nowrap rounded-xl bg-primary-soft/70 px-3 py-1.5 text-xs font-semibold text-primary-dark dark:bg-primary/10 dark:text-primary-light">
            {animateBadge ? <CountUpStat value={badge} duration={800} /> : badge}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  )
}
