import { useState, type MouseEvent } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { useIsPathwaySaved, useSavedPathwaysStore } from '../store/useSavedPathwaysStore'
import AuthPromptModal from './AuthPromptModal'
import Toast from './Toast'

const SAVE_TOAST_MS = 2000

interface SavePathwayButtonProps {
  careerId: number
  /** Extra classes merged onto the button - e.g. "flex-1" to share a row with another action. */
  className?: string
}

// Bookmarks a career to "My saved pathways" (useSavedPathwaysStore),
// reachable from the account menu - account-gated the same way the Binder
// is: signed out, clicking this shows AuthPromptModal instead of saving
// anywhere (not even anonymously to this browser), since a "saved
// pathways" list that can't follow a signed-in user anywhere isn't really
// what it claims to be. Sits alongside ShowFullPathwayButton on every job
// card across the app (Results, Search, Career Changer, Easiest Jobs,
// Highest Paying Jobs) - independent of the site-wide Compare selection
// and the Roll a Job Binder.
export default function SavePathwayButton({ careerId, className = '' }: SavePathwayButtonProps) {
  const saved = useIsPathwaySaved(careerId)
  const toggle = useSavedPathwaysStore((state) => state.toggle)
  const [showToast, setShowToast] = useState(false)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)

  const handleClick = (event: MouseEvent) => {
    // Every card this sits on is also a whole-card link to /career/:id -
    // without this, saving would also fire that navigation.
    event.stopPropagation()
    const result = toggle(careerId)
    if (result === 'unauthenticated') {
      setShowAuthPrompt(true)
      return
    }
    if (result === 'added') {
      setShowToast(true)
      window.setTimeout(() => setShowToast(false), SAVE_TOAST_MS)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={saved}
        className={`inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark ${className}`}
      >
        {saved ? <BookmarkCheck className="h-4 w-4 shrink-0" /> : <Bookmark className="h-4 w-4 shrink-0" />}
        {saved ? 'Saved' : 'Save'}
      </button>
      {showToast ? <Toast message="Pathway saved!" type="success" /> : null}
      {showAuthPrompt ? (
        <AuthPromptModal
          onClose={() => setShowAuthPrompt(false)}
          title="Sign in to save this pathway"
          description="Create a free account to save careers to My saved pathways and find them again anytime."
        />
      ) : null}
    </>
  )
}
