import { type ReactNode } from 'react'

export default function Card({ title, description, badge, children }: { title: string; description?: string; badge?: string; children?: ReactNode }) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-soft dark:bg-slate-800 dark:border-slate-700">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-950 dark:text-slate-50">{title}</h3>
          {description ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{description}</p> : null}
        </div>
        {badge ? <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-primary-light">{badge}</span> : null}
      </div>
      {children}
    </div>
  )
}
