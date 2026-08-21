import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface BackButtonProps {
  to?: string
  state?: any
  label?: string
}

// Every page on the site passes its own `to` here as "my logical parent
// page" (e.g. a career-detail page pointing at /results) - fine as a
// fallback, but as the ONLY behavior it was wrong any time a page is
// reachable from more than one place (search, Job Market, Backtrack,
// Career Changer, a shared link, ...): the button would send everyone to
// the same fixed page regardless of where they actually came from. Real
// browser history is the source of truth for "the page they were on
// before," so that's what this reaches for first now - `to` only kicks in
// when there's nothing in this session's history to go back to (a fresh
// direct link, a reload, a new tab), where a bare `navigate(-1)` would
// otherwise leave the app entirely or do nothing.
// Exported for the rare page with its own secondary "back"-shaped CTA
// (e.g. CareerDetailPage's bottom "Back to results" button) that needs
// the same real-history-first logic but its own visual treatment, so it
// isn't stuck rendering an actual <BackButton>.
export function canGoBackInApp(): boolean {
  const historyState = window.history.state as { idx?: number } | null
  return typeof historyState?.idx === 'number' && historyState.idx > 0
}

export default function BackButton({ to, state, label = 'Back' }: BackButtonProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (canGoBackInApp()) {
      navigate(-1)
      return
    }
    if (to) {
      navigate(to, { state })
    } else {
      navigate(-1)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary-dark dark:text-white dark:hover:text-slate-200"
    >
      <ArrowLeft className="h-5 w-5" />
      {label}
    </button>
  )
}
