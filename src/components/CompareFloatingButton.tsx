import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useCompareStore } from '../store/useCompareStore'
import { usePathStore } from '../store/usePathStore'

// The universal-results-pages counterpart to the Binder's own
// FloatingCompareButton.tsx (that one reads useBinderStore and goes to
// /binder/compare; this one reads useCompareStore and goes to /compare) -
// kept as a separate component/file rather than a shared one parameterized
// by store, since the two stores' shapes don't otherwise match and forcing
// them through one generic component would need more indirection than it
// saves for just two call sites.
export default function CompareFloatingButton() {
  const navigate = useNavigate()
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const compareSelectionMode = useCompareStore((state) => state.compareSelectionMode)
  const selectedCompareCards = useCompareStore((state) => state.selectedCompareCards)

  const count = selectedCompareCards.length
  const visible = compareSelectionMode && count >= 1
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
            {ready ? `Compare ${count} careers →` : 'Select 2 or more'}
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
