import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useCompareStore } from '../store/useCompareStore'
import { usePathStore } from '../store/usePathStore'

// The results page's compare bar - same visual language and animation as
// CompareFloatingButton/FloatingCompareButton (fixed bottom-center pill,
// gray-and-disabled until there's enough to actually compare, green once
// there is), but a distinct component rather than a reused one: those two
// only appear while their page's "Compare" grid-selection mode is active
// (compareSelectionMode), whereas ResultPage.tsx no longer has a
// selection-mode toggle at all - every card's own "Add to compare" button is
// always live, so this just watches selectedCompareCards directly and shows
// itself the moment anything is selected.
export default function ResultsCompareBar() {
  const navigate = useNavigate()
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const selectedCompareCards = useCompareStore((state) => state.selectedCompareCards)

  const count = selectedCompareCards.length
  const visible = count >= 1
  const ready = count >= 2

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4"
        >
          <button
            type="button"
            disabled={!ready}
            aria-disabled={!ready}
            onClick={() => {
              if (ready) navigate('/compare')
            }}
            className={`pointer-events-auto rounded-full px-8 py-4 text-base font-bold shadow-lg transition-all duration-150 ${
              ready
                ? 'cursor-pointer bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95'
                : 'cursor-not-allowed bg-gray-400 text-white'
            }`}
          >
            {count} {count === 1 ? 'career' : 'careers'} selected — Compare now
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
