import { type LucideIcon, SearchX } from 'lucide-react'
import Button from './Button'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
}

// Shared "nothing to show" treatment: icon badge + heading + message +
// optional action button, instead of a bare line of gray text. Used
// anywhere a list/grid can legitimately come back empty (search, Career
// Changer results, ...) so every empty state in the app reads the same way.
export default function EmptyState({ icon: Icon = SearchX, title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-800/50">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft/70 dark:bg-primary/15">
        <Icon className="h-7 w-7 text-primary-dark dark:text-primary-light" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300">{message}</p>
      {actionLabel && onAction ? (
        <Button onClick={onAction} className="mt-5">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
