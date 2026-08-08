import { type ReactNode } from 'react'
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
}

export default function Card({ title, description, badge, children, animateBadge = true }: CardProps) {
  return (
    <div className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:z-10 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
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
