import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, TriangleAlert, X } from 'lucide-react'
import Button from './Button'
import { isSupabaseConfigured } from '../lib/supabaseClient'
import { usePathStore } from '../store/usePathStore'

/** Why this modal opened. 'signed-out' is the ordinary case - someone who has
 * never had an account clicked a save. 'session-expired' is the one the
 * default copy got wrong: these people DO have an account, so inviting them
 * to "create a free account" reads as though their account is gone. */
export type AuthPromptReason = 'signed-out' | 'session-expired'

interface AuthPromptModalProps {
  onClose: () => void
  /** Defaults to the original Binder copy so every existing call site keeps
   * rendering exactly as before without passing these. */
  title?: string
  description?: string
  /** Defaults to 'signed-out'. Only changes copy - both reasons still send
   * people to the same /login route. */
  reason?: AuthPromptReason
}

// Shown instead of actually saving whenever "Add to Binder" (or "Save
// pathway" - see SavePathwayButton) is clicked while signed out - whatever
// triggered this still happened (the result card / job card stays on
// screen underneath), only the save is blocked. "Continue Without Saving"
// just closes this and leaves things as they were; it does NOT fall back
// to saving anonymously anywhere (localStorage or otherwise) - see
// useBinderStore's / useSavedPathwaysStore's 'unauthenticated' result,
// which this modal is the UI response to either way.
export default function AuthPromptModal({
  onClose,
  title = 'Sign in to save careers to your Binder',
  description = 'Create a free account to keep every career you roll and build up your collection over time.',
  reason = 'signed-out',
}: AuthPromptModalProps) {
  const navigate = useNavigate()
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)

  // The failure path this modal had none of. Signing in is impossible on a
  // deployment with no Supabase credentials (see .env.example) - the old
  // version still showed "Sign In", which navigated to a login page that
  // accepted the form and then silently did nothing. Saying so here, at the
  // point someone asks to save, is the only honest answer.
  const accountsUnavailable = !isSupabaseConfigured

  // 'session-expired' overrides the caller's copy rather than being merged
  // with it: every existing call site's description invites people to create
  // an account, which is actively wrong for someone who already had one and
  // was signed in a moment ago.
  const headline = accountsUnavailable
    ? "Saving isn't available here"
    : reason === 'session-expired'
      ? 'Your session has expired'
      : title
  const body = accountsUnavailable
    ? "This deployment isn't connected to an accounts database, so there's nothing to save to yet. Everything else on the page still works."
    : reason === 'session-expired'
      ? 'You were signed out while this page was open - your account and everything in it are untouched. Sign in again to carry on saving.'
      : description

  // Escape closes just this modal. Capture phase + stopPropagation so the
  // keypress never reaches page-level Escape handlers underneath (e.g.
  // JobMarketRollPage's, which would otherwise discard the rolled card this
  // modal promises to leave on screen).
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      event.stopPropagation()
      onClose()
    }
    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [onClose])

  // Portalled to document.body - this now opens from SavePathwayButton
  // instances deep inside StaggerGrid/Card, whose reveal-animation
  // ancestors apply a CSS transform (framer-motion's y/opacity animation),
  // which creates a new containing block for any `position: fixed`
  // descendant - "cover the whole viewport" would otherwise become "cover
  // the whole animated card" instead. Same fix as the other fixed-overlay
  // bug found earlier in this app.
  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 px-4 py-6"
      onClick={onClose}
    >
      <motion.div
        onClick={(event) => event.stopPropagation()}
        initial={reduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl dark:bg-slate-800"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Amber + warning glyph for the two failure readings, the app's
            primary-soft lock for the ordinary "you need an account" one -
            so a genuine problem doesn't look like a routine upsell. */}
        <div
          className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
            accountsUnavailable || reason === 'session-expired'
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
              : 'bg-primary-soft/60 text-primary dark:bg-primary/15 dark:text-primary-light'
          }`}
        >
          {accountsUnavailable || reason === 'session-expired' ? (
            <TriangleAlert className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Lock className="h-5 w-5" aria-hidden="true" />
          )}
        </div>

        <h2 className="mt-4 text-lg font-bold text-slate-950 dark:text-slate-50">{headline}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{body}</p>

        <div className="mt-5 flex flex-col gap-2.5">
          {/* No "Sign In" at all when there is no backend to sign in to -
              offering a button that cannot work is worse than not offering
              one. The dismiss action becomes the only (and correct) choice,
              so it takes the primary styling. */}
          {accountsUnavailable ? (
            <Button onClick={onClose} className="justify-center">
              Got it
            </Button>
          ) : (
            <>
              <Button onClick={() => navigate('/login')} className="justify-center">
                {reason === 'session-expired' ? 'Sign In Again' : 'Sign In'}
              </Button>
              <Button variant="ghost" onClick={onClose} className="justify-center">
                Continue Without Saving
              </Button>
            </>
          )}
        </div>
      </motion.div>
    </div>,
    document.body,
  )
}
