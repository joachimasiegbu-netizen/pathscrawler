import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, X } from 'lucide-react'
import Button from './Button'
import { usePathStore } from '../store/usePathStore'

interface AuthPromptModalProps {
  onClose: () => void
}

// Shown instead of actually saving whenever "Add to Binder" is clicked
// while signed out - the roll itself still happened (the result card stays
// on screen underneath), only the save is blocked. "Continue Without
// Saving" just closes this and leaves the result card as it was; it does
// NOT fall back to saving anonymously anywhere (localStorage or otherwise) -
// see useBinderStore's 'unauthenticated' AddCardResult, which this modal is
// the UI response to.
export default function AuthPromptModal({ onClose }: AuthPromptModalProps) {
  const navigate = useNavigate()
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)

  return (
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

        <h2 className="mt-4 text-lg font-bold text-slate-950 dark:text-slate-50">Sign in to save careers to your Binder</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Create a free account to keep every career you roll and build up your collection over time.
        </p>

        <div className="mt-5 flex flex-col gap-2.5">
          <Button onClick={() => navigate('/login')} className="justify-center">
            Sign In
          </Button>
          <Button variant="ghost" onClick={onClose} className="justify-center">
            Continue Without Saving
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
