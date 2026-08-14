import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useBinderStore } from '../store/useBinderStore'
import { usePathStore } from '../store/usePathStore'

// The Binder's selection-mode "next step" affordance (see BinderCardTile /
// MyBinderPage) - appears the moment anything is selected, but stays a
// gray, disabled preview until there are enough careers (2) to actually
// compare, rather than popping into existence only at 2. Reads selection
// state straight from useBinderStore rather than taking props, so it can
// just be dropped into MyBinderPage with no wiring.
export default function FloatingCompareButton() {
  const navigate = useNavigate()
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const binderSelectionMode = useBinderStore((state) => state.binderSelectionMode)
  const selectedBinderCards = useBinderStore((state) => state.selectedBinderCards)

  const count = selectedBinderCards.length
  const visible = binderSelectionMode && count >= 1
  const ready = count >= 2

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          // This app has no bottom mobile nav bar to clear, so bottom-6 is
          // the whole offset - fixed here rather than in MyBinderPage since
          // it's this component's own positioning concern.
          className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4"
        >
          <button
            type="button"
            disabled={!ready}
            aria-disabled={!ready}
            onClick={() => {
              if (ready) navigate('/binder/compare')
            }}
            className={`pointer-events-auto rounded-full px-8 py-4 text-base font-bold shadow-lg transition-all duration-150 ${
              ready
                ? 'cursor-pointer bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95'
                : 'cursor-not-allowed bg-gray-400 text-white'
            }`}
          >
            {ready ? `Compare ${count} careers →` : `Compare (${count} selected)`}
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
