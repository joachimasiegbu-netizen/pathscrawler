import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import BackButton from '../components/BackButton'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import SparkleBurst from '../components/SparkleBurst'
import SpotlightCareerCard from '../components/SpotlightCareerCard'
import { usePathStore } from '../store/usePathStore'
import { getWeeklySpotlight, type WeeklySpotlight } from '../utils/weeklySpotlight'

// getWeeklySpotlight() is pure/synchronous (no network, demoCareers is
// always non-empty at build time) so it can't actually fail in practice -
// this loading/error machinery is deliberately kept anyway, the same
// "defensive but structurally unreachable" pattern used on the Career
// Changer results empty state, rather than assuming nothing can go wrong.
const LOADING_MS = 500
const SPARKLE_BURST_MS = 900

type Phase = 'loading' | 'error' | 'ready' | 'revealed'

export default function JobMarketSpotlightPage() {
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const [phase, setPhase] = useState<Phase>('loading')
  const [spotlight, setSpotlight] = useState<WeeklySpotlight | null>(null)
  const [showBurst, setShowBurst] = useState(false)

  const loadSpotlight = () => {
    setPhase('loading')
    try {
      const result = getWeeklySpotlight()
      setSpotlight(result)
      if (reduceMotion) {
        setPhase('ready')
        return
      }
      const timer = setTimeout(() => setPhase('ready'), LOADING_MS)
      return () => clearTimeout(timer)
    } catch {
      setPhase('error')
    }
  }

  useEffect(() => {
    const cleanup = loadSpotlight()
    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleReveal = () => {
    setPhase('revealed')
    if (!reduceMotion) {
      setShowBurst(true)
      setTimeout(() => setShowBurst(false), SPARKLE_BURST_MS)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8 sm:px-6">
      <BackButton to="/job-market" label="Job Market" />
      <PageHeader icon={Sparkles} title="This Week's Spotlight" subtitle="A career worth exploring right now" />

      {phase === 'loading' ? (
        <div className="space-y-4 overflow-hidden rounded-[26px] border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800 sm:p-8">
          <div className="skeleton-shimmer h-32 w-full rounded-2xl sm:h-40" />
          <div className="skeleton-shimmer h-8 w-2/3 rounded-full" />
          <div className="skeleton-shimmer h-4 w-full rounded-full" />
          <div className="skeleton-shimmer h-4 w-5/6 rounded-full" />
          <div className="grid grid-cols-3 gap-3">
            <div className="skeleton-shimmer h-16 rounded-2xl" />
            <div className="skeleton-shimmer h-16 rounded-2xl" />
            <div className="skeleton-shimmer h-16 rounded-2xl" />
          </div>
        </div>
      ) : phase === 'error' ? (
        <EmptyState
          icon={Sparkles}
          title="No spotlight this week"
          message="We couldn't load this week's featured career. Try again."
          actionLabel="Retry"
          onAction={loadSpotlight}
        />
      ) : (
        <div className="relative flex min-h-[420px] items-center justify-center">
          <AnimatePresence mode="wait">
            {phase === 'ready' ? (
              <motion.div
                key="reveal-button"
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center gap-4 text-center"
              >
                <motion.button
                  type="button"
                  onClick={handleReveal}
                  animate={reduceMotion ? undefined : { scale: [1, 1.04, 1] }}
                  transition={reduceMotion ? undefined : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  whileHover={reduceMotion ? undefined : { scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-40 w-40 flex-col items-center justify-center gap-2 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-xl shadow-purple-300/50 dark:shadow-purple-950/50"
                >
                  <Sparkles className="h-8 w-8" />
                  <span className="text-sm font-bold">Tap to reveal</span>
                </motion.button>
                <p className="text-sm text-slate-500 dark:text-slate-400">One career, hand-picked for this week.</p>
              </motion.div>
            ) : (
              <motion.div
                key="revealed-card"
                initial={reduceMotion ? undefined : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-full"
              >
                {spotlight ? <SpotlightCareerCard career={spotlight.career} blurb={spotlight.blurb} /> : null}
              </motion.div>
            )}
          </AnimatePresence>
          {showBurst ? <SparkleBurst /> : null}
        </div>
      )}
    </div>
  )
}
