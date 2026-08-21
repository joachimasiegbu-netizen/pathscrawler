import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, X } from 'lucide-react'
import Button from './Button'
import { usePathStore } from '../store/usePathStore'

interface AuthPromptModalProps {
  onClose: () => void
  /** Defaults to the original Binder copy so every existing call site keeps
   * rendering exactly as before without passing these. */
  title?: string
  description?: string
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
}: AuthPromptModalProps) {
  const navigate = useNavigate()
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)

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

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft/60 text-primary dark:bg-primary/15 dark:text-primary-light">
          <Lock className="h-5 w-5" aria-hidden="true" />
        </div>

        <h2 className="mt-4 text-lg font-bold text-slate-950 dark:text-slate-50">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>

        <div className="mt-5 flex flex-col gap-2.5">
          <Button onClick={() => navigate('/login')} className="justify-center">
            Sign In
          </Button>
          <Button variant="ghost" onClick={onClose} className="justify-center">
            Continue Without Saving
          </Button>
        </div>
      </motion.div>
    </div>,
    document.body,
  )
}
