import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { Info, X } from 'lucide-react'
import { usePathStore } from '../store/usePathStore'

interface RarityInfoModalProps {
  onClose: () => void
}

// Opened from the small "ⓘ" button next to the "1 in X" stat on every roll
// result card (RollResultCard/MythicRevealCard/CelestialRevealCard) -
// shared here so the disclaimer copy only lives in one place. Same
// portal/backdrop/X pattern as AuthPromptModal.tsx (portalled to
// document.body for the same reason - an animated card ancestor's CSS
// transform would otherwise hijack position:fixed's containing block away
// from the true viewport).
export default function RarityInfoModal({ onClose }: RarityInfoModalProps) {
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 px-4 py-6" onClick={onClose}>
      <motion.div
        onClick={(event) => event.stopPropagation()}
        initial={reduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-left shadow-2xl dark:bg-slate-800"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft/60 text-primary dark:bg-primary/15 dark:text-primary-light">
          <Info className="h-5 w-5" aria-hidden="true" />
        </div>

        <h2 className="mt-4 text-lg font-bold text-slate-950 dark:text-slate-50">How we calculate rarity</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          The "1 in X" figures are based on the number of people currently employed in that occupation within the UK
          workforce (~31.4 million people), using data from the Office for National Statistics and the Department for
          Education's Occupations in Demand dataset.
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Some roles (such as Prime Minister or President) are political appointments rather than standard
          occupations, so their rarity reflects the total employed workforce rather than a traditional career
          pathway.
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          These figures are designed to illustrate relative rarity for the game - not to serve as precise labour
          market forecasts.
        </p>
      </motion.div>
    </div>,
    document.body,
  )
}
