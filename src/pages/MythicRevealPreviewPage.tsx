import { useRef, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bookmark, BookmarkCheck, MousePointerClick } from 'lucide-react'
import BackButton from '../components/BackButton'
import ConfettiBurst from '../components/ConfettiBurst'
import PageHeader from '../components/PageHeader'
import AuthPromptModal from '../components/AuthPromptModal'
import demoCareers from '../data/demoCareers'
import { getCareerIcon } from '../utils/careerIcons'
import { getDisplayRarityN, getTierConfig } from '../utils/careerTiers'
import { useAuthStore } from '../store/useAuthStore'
import { useBinderStore } from '../store/useBinderStore'
import { usePathStore } from '../store/usePathStore'

// PREVIEW / DESIGN REVIEW PAGE - not wired into a real roll. Built to show
// how an "over the top" Mythic-specific reveal could work before it
// replaces the instant reveal every tier currently gets in
// JobMarketRollPage.tsx/RollResultCard.tsx: the card doesn't show its face
// immediately, it floats in place as a sealed card-back until clicked,
// then bursts open into the real card (whose hover behavior is the
// reference design supplied in the brief, re-themed - see index.css's
// "Mythic reveal preview" section for the full animation implementation).
// Reachable directly at /preview/mythic-reveal, not linked from any nav -
// that's deliberate, this is for review, not a shipped destination yet.

// A handful of real careers, picked purely for icon variety via
// careerIcons.ts's title overrides (this page always styles them as
// Mythic regardless of their actual current tier - see careerTiers.ts's
// getCareerTier for what genuinely earns that now) so switching between
// them actually demonstrates the "icon representing that job" part rather
// than showing the same fallback icon four times.
const DEMO_CAREER_IDS = [19, 100, 122, 114]

type RevealPhase = 'floating' | 'exploding' | 'revealed'

const CONFETTI_RED = ['#DC2626', '#EF4444', '#FCA5A5', '#FFFFFF']

export default function MythicRevealPreviewPage() {
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const currentUser = useAuthStore((state) => state.currentUser)
  const addCard = useBinderStore((state) => state.addCard)

  const [careerId, setCareerId] = useState(DEMO_CAREER_IDS[0])
  const [phase, setPhase] = useState<RevealPhase>('floating')
  const [showConfetti, setShowConfetti] = useState(false)
  const [hasAdded, setHasAdded] = useState(false)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const timeouts = useRef<number[]>([])

  const career = demoCareers.find((item) => item.id === careerId) ?? demoCareers[0]
  const Icon = getCareerIcon(career)
  const config = getTierConfig('mythic')

  const after = (ms: number, fn: () => void) => {
    timeouts.current.push(window.setTimeout(fn, ms))
  }
  const clearPendingTimeouts = () => {
    timeouts.current.forEach((id) => window.clearTimeout(id))
    timeouts.current = []
  }

  const reveal = () => {
    if (phase !== 'floating') return
    if (reduceMotion) {
      setPhase('revealed')
      return
    }
    setPhase('exploding')
    setShowConfetti(true)
    after(1300, () => setShowConfetti(false))
    after(600, () => setPhase('revealed'))
  }

  const replay = (nextId?: number) => {
    clearPendingTimeouts()
    setShowConfetti(false)
    setHasAdded(false)
    setPhase('floating')
    if (nextId) setCareerId(nextId)
  }

  const handleAddToBinder = (event: MouseEvent) => {
    event.stopPropagation()
    if (hasAdded) return
    if (!currentUser) {
      setShowAuthPrompt(true)
      return
    }
    addCard(career, 'mythic', 0)
    setHasAdded(true)
  }

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } }}
      // No background here - see JobMarketRollPage.tsx's identical comment:
      // -translate-x-1/2 below is a `transform`, which breaks
      // `background-attachment: fixed` on this exact element (CSS spec
      // behavior, confirmed via a real rendered seam, not eyeballed) -
      // MobileContainer.tsx's own forceDarkBg gradient (which IS correctly
      // bg-fixed, on an element with no transform) already paints this
      // same gradient behind everything, header included.
      className="dark-mode relative left-1/2 min-h-screen w-screen -translate-x-1/2 overflow-hidden px-4 pb-20 pt-3 sm:px-6"
    >
      <BackButton to="/job-market/roll" label="Roll a Job" />

      <div className="mx-auto mt-6 max-w-2xl space-y-8 text-center">
        <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-400">
          Preview - not wired into real rolls yet
        </div>
        <PageHeader
          title="Mythic Reveal Concept"
          subtitle="Mythic doesn't show its face right away anymore. It floats, waiting - click it, and watch it go off."
        />

        <div className="flex flex-wrap items-center justify-center gap-2">
          {DEMO_CAREER_IDS.map((id) => {
            const demoCareer = demoCareers.find((item) => item.id === id)
            if (!demoCareer) return null
            return (
              <button
                key={id}
                type="button"
                onClick={() => replay(id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  id === careerId
                    ? 'border-red-500/60 bg-red-500/15 text-red-400'
                    : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
                }`}
              >
                {demoCareer.title}
              </button>
            )
          })}
        </div>

        <div
          className={`relative mx-auto flex h-[440px] items-center justify-center ${
            phase === 'exploding' && !reduceMotion ? 'mythic-screen-shake' : ''
          }`}
        >
          {phase === 'exploding' && !reduceMotion ? (
            <div className="mythic-explode-flash pointer-events-none fixed inset-0 z-30 bg-red-200" aria-hidden="true" />
          ) : null}
          {showConfetti && !reduceMotion ? <ConfettiBurst colors={CONFETTI_RED} count={70} durationMs={1300} /> : null}

          <AnimatePresence mode="wait">
            {phase === 'floating' || phase === 'exploding' ? (
              <motion.button
                key="floating-card"
                type="button"
                onClick={reveal}
                aria-label="Reveal your Mythic roll"
                exit={reduceMotion ? undefined : { opacity: 0, transition: { duration: 0.15 } }}
                className={`mythic-float-card relative flex h-[380px] w-[260px] flex-col items-center justify-center rounded-[20px] border-2 border-red-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-black text-center ${
                  phase === 'exploding' && !reduceMotion ? 'mythic-card-burst-out' : ''
                }`}
              >
                <span className="text-6xl">⚫</span>
                <span className="mt-4 text-lg font-black uppercase tracking-[0.2em] text-red-400">Mythic</span>
                <span className="mt-1 text-xs text-slate-400">Above the earth, below the heavens</span>
                <span className="mythic-prompt-pulse mt-6 inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-400 ring-1 ring-red-500/40">
                  <MousePointerClick className="h-3.5 w-3.5" />
                  Click to reveal
                </span>
              </motion.button>
            ) : (
              <motion.div
                key="revealed-card"
                initial={reduceMotion ? undefined : { opacity: 0, scale: 0.4, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: 0, transition: { type: 'spring', bounce: 0.5, duration: 0.7 } }}
                className="relative"
              >
                <span
                  className="absolute -right-3 -top-3 z-20 inline-flex items-center gap-1 rounded-full bg-red-600/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-400 shadow-lg ring-1 ring-red-500/40"
                  style={{ boxShadow: '0 4px 16px -2px rgba(220, 38, 38, 0.6)' }}
                >
                  {config.emoji} {config.label}
                </span>

                {/* Real "Add to Binder" action, kept as its own pinned
                    corner button rather than layered onto the bar below -
                    that bar's "Add to Binder" label is generated CSS
                    content (::after in index.css, ported straight from the
                    reference), which a real interactive button can't sit
                    on top of without either fighting its own painted text
                    or losing the persistent "already added" state the
                    reference's brief :active swap can't hold. A
                    nice-to-have bonus on top of what was asked, reusing the
                    same store every other job card's Add button writes to. */}
                <button
                  type="button"
                  onClick={handleAddToBinder}
                  disabled={hasAdded}
                  aria-label={hasAdded ? 'Already added to your career binder' : 'Add to your career binder'}
                  className="absolute -left-3 -top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-red-400 shadow-lg ring-1 ring-red-500/40 transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                >
                  {hasAdded ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                </button>

                <div className="mythic-reveal-card bg-gradient-to-br from-slate-900 via-slate-950 to-black">
                  <Icon className="mythic-reveal-icon" aria-hidden="true" />

                  <div className="mythic-reveal-info">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-red-400/80">{career.category}</p>
                    <h3 className="mt-1 text-xl font-extrabold leading-tight text-white">{career.title}</h3>
                    <p className="mt-2 text-sm font-bold text-red-300">{career.salary}</p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {career.rarityLabel
                        ? career.rarityLabel.replace('1 in every ', '1 in ').replace(' workers', '')
                        : `1 in ${getDisplayRarityN(career).toLocaleString('en-GB')}`}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {phase === 'revealed' ? (
          <button
            type="button"
            onClick={() => replay()}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-white/20 hover:text-white"
          >
            Replay reveal
          </button>
        ) : (
          <p className="text-xs text-slate-500">Hover the card once it's open - the icon, title and an action bar all animate in.</p>
        )}
      </div>

      {showAuthPrompt ? <AuthPromptModal onClose={() => setShowAuthPrompt(false)} /> : null}
    </motion.div>
  )
}
