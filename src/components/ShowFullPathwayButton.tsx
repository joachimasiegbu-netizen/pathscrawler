import { type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Route } from 'lucide-react'
import type { Career } from '../data/demoCareers'

interface ShowFullPathwayButtonProps {
  career: Career
  /** Width/layout classes - callers decide (w-full for a card's only
   * button, flex-1 when it shares a row with another action). */
  className?: string
}

// The one "See full pathway" action used on every career card across the
// results pages. Points at the existing Backtrack flow
// (BacktrackPathwayOverviewPage, /backtrack/pathway/:careerId) rather than
// the separate CareerPathwayStepperPage this used to open - having two
// different-looking "full pathway" experiences reachable from different
// cards was the actual problem, not which one to keep. Same label/icon/
// style everywhere is what makes this "the" pathway button now, not just
// another one.
export default function ShowFullPathwayButton({ career, className = '' }: ShowFullPathwayButtonProps) {
  const navigate = useNavigate()

  const handleClick = (event: MouseEvent) => {
    // Every card this sits on is also a whole-card link to /career/:id -
    // without this, opening the pathway would also fire that navigation.
    event.stopPropagation()
    navigate(`/backtrack/pathway/${career.id}`)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark ${className}`}
    >
      <Route className="h-4 w-4 shrink-0" />
      Full pathway
    </button>
  )
}
