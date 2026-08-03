import { type ReactNode } from 'react'

interface PageStepHeaderProps {
  step: number
  totalSteps: number
  title: string
  description: string
  children?: ReactNode
}

export default function PageStepHeader({ step, totalSteps, title, description, children }: PageStepHeaderProps) {
  const progress = Math.round((step / totalSteps) * 100)
  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-800">
      <div className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-dark dark:text-primary-light">
        Step {step} of {totalSteps}
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-50">{title}</h1>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>
      {children}
    </div>
  )
}
