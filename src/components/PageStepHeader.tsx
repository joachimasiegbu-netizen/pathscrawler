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
    <div className="space-y-4 rounded-[28px] bg-slate-800 border border-slate-700 p-5 shadow-soft">
      <div className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-light">Step {step} of {totalSteps}</div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-50">{title}</h1>
        <p className="text-sm leading-6 text-slate-400">{description}</p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>
      {children}
    </div>
  )
}
