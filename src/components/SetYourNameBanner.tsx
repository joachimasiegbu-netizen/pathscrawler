import { useState } from 'react'
import { Sparkles, X } from 'lucide-react'
import { useMyUserProfile } from '../store/useUserProfileStore'
import { useAuthStore } from '../store/useAuthStore'
import UsernameModal from './UsernameModal'

// Persistent nudge for players who skipped the setup modal and are running
// under an auto-assigned fallback name (Curious Explorer, New Hire, ...).
// Shows a thin strip under the header; clicking "Set your name" reopens the
// setup modal (dismissible this time). Dismiss (X) hides it for the session
// only - it comes back on reload until they actually pick a name, since the
// whole point is that a generic handle on the leaderboard is a temporary
// state, not a choice.
export default function SetYourNameBanner() {
  const currentUser = useAuthStore((state) => state.currentUser)
  const profile = useMyUserProfile()
  const [dismissed, setDismissed] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  if (!currentUser || !profile?.isFallbackName || dismissed) return null

  return (
    <>
      <div className="mx-4 mt-2 flex items-center gap-3 rounded-xl border border-amber-300/60 bg-amber-50 px-4 py-2.5 text-sm dark:border-amber-500/30 dark:bg-amber-500/10 sm:mx-6">
        <Sparkles className="h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
        <p className="min-w-0 flex-1 text-amber-900 dark:text-amber-200">
          You&rsquo;re on the board as <span className="font-semibold">{profile.username}</span>.
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="ml-1.5 font-semibold text-amber-700 underline underline-offset-2 transition hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-100"
          >
            Set your name
          </button>
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="shrink-0 text-amber-500 transition hover:text-amber-700 dark:hover:text-amber-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {modalOpen ? <UsernameModal dismissible onClose={() => setModalOpen(false)} /> : null}
    </>
  )
}
