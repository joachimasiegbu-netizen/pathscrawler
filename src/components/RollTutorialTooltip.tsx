import { X } from 'lucide-react'

interface RollTutorialTooltipProps {
  onDismiss: () => void
}

// Shown once (gated by useRollStore's persisted hasSeenRollTutorial) below
// the Roll button on a visitor's first visit to this page.
export default function RollTutorialTooltip({ onDismiss }: RollTutorialTooltipProps) {
  return (
    <div className="relative mt-6 w-full max-w-xs rounded-2xl border border-primary/20 bg-primary-soft/60 px-4 py-3 text-center shadow-sm dark:border-primary-light/20 dark:bg-primary/10">
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss tutorial"
        className="absolute right-2 top-2 rounded-full p-1 text-primary-dark/60 transition hover:bg-white/60 hover:text-primary-dark dark:text-primary-light/70 dark:hover:bg-white/10"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <p className="pr-4 text-xs font-medium leading-5 text-primary-dark dark:text-primary-light">
        Tap ROLL! to discover a random career. Rarer jobs pay more but are harder to roll!
      </p>
    </div>
  )
}
