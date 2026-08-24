import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Bookmark, BookmarkCheck, Check, Dices, Info, MousePointerClick, Share2 } from 'lucide-react'
import type { Career } from '../data/demoCareers'
import { getCareerIcon } from '../utils/careerIcons'
import { getDisplayRarityN, getTierConfig } from '../utils/careerTiers'
import { formatSalaryRange } from '../utils/formatSalary'
import { playSound, TIER_SOUNDS } from '../utils/sound'
import { useAuthStore } from '../store/useAuthStore'
import { useBinderStore } from '../store/useBinderStore'
import { useRollStore } from '../store/useRollStore'
import { usePathStore } from '../store/usePathStore'
import ConfettiBurst from './ConfettiBurst'
import AuthPromptModal from './AuthPromptModal'
import MythicStarfieldReveal from './MythicStarfieldReveal'
import RarityInfoModal from './RarityInfoModal'
import Toast from './Toast'

interface MythicRevealCardProps {
  career: Career
  onRollAgain: () => void
}

type RevealPhase = 'intro' | 'floating' | 'exploding' | 'revealed'

const CONFETTI_RED = ['#DC2626', '#EF4444', '#FCA5A5', '#FFFFFF']

// The Mythic-only "over the top" reveal, promoted out of
// MythicRevealPreviewPage.tsx once its design was approved: a Mythic roll
// doesn't show its face on landing like every other tier does in
// RollResultCard.tsx - it floats in place as a sealed card-back until
// clicked, then bursts open (flash/shake/confetti) into the real card,
// whose hover behavior is the reference design from the brief (re-themed
// red/obsidian, having started as gold/obsidian - see index.css's "Mythic
// reveal preview" section for the animation implementation).
// JobMarketRollPage.tsx renders this INSTEAD of
// RollResultCard specifically when the landed tier is 'mythic', and skips
// its own land-time confetti/flash-text/screen-darken for that case - this
// component owns its own celebration, fired on click instead of on land,
// so the two don't double up.
//
// No close button anywhere on this card, on either the sealed or revealed
// face (there used to be one on each) - Mythic is rare enough that an
// accidental click shouldn't be able to lose or cut a pull short, sealed
// especially: closing before it's even been clicked open would skip the
// auto-save effect below entirely, since that only fires once phase
// reaches 'revealed'. The only ways off this card now are deliberate:
// Roll Again, or clicking through to the career page once it's open.
//
// A new 'intro' phase runs FIRST (skipped entirely under reduceMotion,
// same as everything else here): MythicStarfieldReveal.tsx, a near-black,
// dread-building starfield that cuts to a red flash and a screen shake.
// The sealed card does not exist on screen until that finishes and hands
// back via onComplete - same shape as Celestial's own orbital intro.
export default function MythicRevealCard({ career, onRollAgain }: MythicRevealCardProps) {
  const navigate = useNavigate()
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const currentUser = useAuthStore((state) => state.currentUser)
  const addCard = useBinderStore((state) => state.addCard)

  const [phase, setPhase] = useState<RevealPhase>(reduceMotion ? 'revealed' : 'intro')
  const [showConfetti, setShowConfetti] = useState(false)
  const [hasAdded, setHasAdded] = useState(false)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const [showRarityInfo, setShowRarityInfo] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const timeouts = useRef<number[]>([])

  const Icon = getCareerIcon(career)
  const config = getTierConfig('mythic')

  const after = (ms: number, fn: () => void) => {
    timeouts.current.push(window.setTimeout(fn, ms))
  }

  const reveal = (event: MouseEvent) => {
    event.stopPropagation()
    if (phase !== 'floating') return
    setPhase('exploding')
    setShowConfetti(true)
    // The tier win stinger (mythic.mp3) already played the moment this
    // roll landed (JobMarketRollPage.tsx's finishRoll) - this click only
    // triggers the physical "cracking it open" explosion sound, not a
    // second win cue layered on top of it.
    playSound('/sounds/card-burst.mp3')
    after(1300, () => setShowConfetti(false))
    after(600, () => setPhase('revealed'))
  }

  const flashToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast((current) => (current === message ? null : current)), 2500)
  }

  const handleAddToBinder = (event: MouseEvent) => {
    event.stopPropagation()
    if (hasAdded) return
    if (!currentUser) {
      setShowAuthPrompt(true)
      return
    }
    const attemptNumber = useRollStore.getState().lifetimeTotalRolls
    const result = addCard(career, 'mythic', attemptNumber)
    if (result === 'full') {
      flashToast('Binder full!')
      return
    }
    if (result === 'unauthenticated') {
      setShowAuthPrompt(true)
      return
    }
    setHasAdded(true)
    flashToast(result === 'duplicate' ? 'You already have this card! Duplicate added.' : 'Added to binder!')
  }

  // Mythic is rare enough that requiring a manual click risks losing the
  // pull entirely (close the card without hitting Add, and it's gone) -
  // so a Mythic auto-saves to the binder the moment it's actually
  // revealed, for whoever's signed in. hasAdded flipping true here also
  // disables the Add button below (same disabled styling as a manual add),
  // so there's no way to double-add the same pull. Only fires once per
  // card (guarded by hasAdded) and only when someone's actually signed in
  // to attribute it to - a signed-out viewer keeps the ordinary manual Add
  // button (which still prompts sign-in), same as before.
  useEffect(() => {
    if (phase !== 'revealed' || hasAdded || !currentUser) return
    const attemptNumber = useRollStore.getState().lifetimeTotalRolls
    const result = addCard(career, 'mythic', attemptNumber)
    if (result === 'full') {
      flashToast('Binder full - this Mythic could not be auto-saved!')
      return
    }
    if (result === 'unauthenticated') return // shouldn't happen given the currentUser check above
    setHasAdded(true)
    flashToast(result === 'duplicate' ? 'Mythic! Duplicate auto-added to your binder.' : 'Mythic! Auto-added to your binder.')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const handleShare = async (event: MouseEvent) => {
    event.stopPropagation()
    const url = `${window.location.origin}/job-market/roll?career=${career.id}&tier=mythic`
    const text = `I just rolled a MYTHIC - ${career.title} (${career.salary}) on PathScrawler! ⚫ ${url}`
    if (navigator.share) {
      try {
        await navigator.share({ title: 'PathScrawler roll', text, url })
        return
      } catch {
        // dismissed or unsupported - fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(text)
      flashToast('Link copied to clipboard!')
    } catch {
      // clipboard API unavailable in this browser/context - nothing else to do
    }
  }

  if (phase === 'intro') {
    return (
      <MythicStarfieldReveal
        onComplete={() => {
          // Moved here from JobMarketRollPage.tsx's finishRoll (which
          // plays every other tier's win stinger the instant the roll
          // lands) - Mythic's now fires the moment its sealed card
          // actually appears, right as the dread/explosion intro hands
          // off, not ~7s earlier under a black screen nobody's looking
          // at yet.
          playSound(TIER_SOUNDS.mythic)
          setPhase('floating')
        }}
      />
    )
  }

  return (
    <>
      {/* The backdrop behind the card turns red the moment this JSX
          branch renders at all (i.e. anytime phase isn't 'intro' -
          floating/exploding/revealed all get it now, not just
          'revealed': a screenshot of the still-sealed floating card
          showed it sitting on the old dark navy/black backdrop, not
          red yet, so this was widened to cover that phase too) - same
          technique CelestialRevealCard.tsx uses to paint its own
          background white once ITS intro hands off (a fixed z-[1]
          layer, above the page's own z-0 FloatingJobBackground, below
          the card wrapper itself which needs an explicit z-10 for that
          to hold - see that file's own comment on why an unindexed
          sibling doesn't automatically paint over an explicitly
          z-indexed one just by coming later in the DOM). */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_#7f1d1d_0%,_#1a0000_55%,_#000000_100%)]"
        aria-hidden="true"
      />
      <div
        className={`relative z-10 mx-auto flex h-[500px] w-full max-w-md items-center justify-center ${
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
              // Arrives out of MythicStarfieldReveal's red flash (the
              // 'intro' phase right before this one) rather than popping
              // in - same fix as CelestialRevealCard.tsx's equivalent.
              initial={reduceMotion ? undefined : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }}
              exit={reduceMotion ? undefined : { opacity: 0, transition: { duration: 0.15 } }}
              className={`mythic-float-card relative flex h-[440px] w-[300px] flex-col items-center justify-center rounded-[24px] border-2 border-red-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-black px-6 text-center ${
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
              <div
                onClick={() => navigate(`/career/${career.id}`, { state: { from: 'roll' } })}
                className="mythic-reveal-card bg-gradient-to-br from-slate-900 via-slate-950 to-black"
              >
                <Icon className="mythic-reveal-icon" aria-hidden="true" />

                <div className="mythic-reveal-info">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-red-400/80">{career.category}</p>
                  <h3 className="mt-1 text-xl font-extrabold leading-tight text-white">{career.title}</h3>
                  <p className="mt-2 text-sm font-bold text-red-300">{formatSalaryRange(career.salary)}</p>
                  {/* Folded into the same hover-triggered block as
                      everything above it (not a separate always-visible
                      element anymore) - idle state shows just the icon,
                      nothing else. No background box - plain text sitting
                      on the card, same treatment as everything else in
                      this block, relying on .mythic-reveal-info's own
                      inherited text-shadow for legibility. */}
                  <p className="mt-3 line-clamp-5 text-[11px] leading-5 text-slate-400">{career.description}</p>
                  {/* Was a floating top-right badge (tier only) plus a
                      separate plain rarity line - merged into one pill
                      per "remove all pills by the cards the tier tag
                      should only be by the 1 in x text", same combined
                      "emoji label • 1 in N" pattern RollResultCard.tsx's
                      isHighTier branch uses. Placed AFTER the description,
                      not before it - "the 1 in x is always below the
                      little paragraph description, not here" (a
                      screenshot caught it sitting above the description
                      on Celestial's card; same fix applied here). */}
                  <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-red-600/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-red-400 ring-1 ring-red-500/40">
                    {config.emoji} {config.label} •{' '}
                    {career.rarityLabel
                      ? career.rarityLabel.replace('1 in every ', '1 in ').replace(' workers', '')
                      : `1 in ${getDisplayRarityN(career).toLocaleString('en-GB')}`}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        setShowRarityInfo(true)
                      }}
                      aria-label="How we calculate rarity"
                      className="text-red-400/70 transition hover:text-red-300"
                    >
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </p>
                </div>
              </div>

              {/* Real, always-reachable actions (a hover-only bar doesn't
                  work for touch) - same 3-button pattern every other tier's
                  RollResultCard uses. Width pinned to exactly match
                  .mythic-reveal-card (300px) - without an explicit width
                  here, this grid just shrink-wraps to its own content
                  (motion.div's parent is a flex item, not a block
                  container, so it doesn't stretch to match its sibling's
                  width automatically), which could come out narrower OR
                  wider than the card above it and read as off-center
                  relative to it either way. */}
              <div className="mt-4 grid w-[300px] grid-cols-3 gap-2 text-sm font-semibold">
                <button
                  type="button"
                  onClick={handleAddToBinder}
                  disabled={hasAdded}
                  aria-label={hasAdded ? 'Already added to your career binder' : 'Add to your career binder'}
                  className="tier-action-btn inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-red-500/30 bg-white/5 px-3 py-2.5 text-slate-200 transition-all duration-150 hover:scale-105 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                >
                  {hasAdded ? <BookmarkCheck className="h-4 w-4 shrink-0" /> : <Bookmark className="h-4 w-4 shrink-0" />}
                  {hasAdded ? 'Added' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share this roll"
                  className="tier-action-btn inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-red-500/30 bg-white/5 px-3 py-2.5 text-slate-200 transition-all duration-150 hover:scale-105 hover:bg-white/10"
                >
                  {toast === 'Link copied to clipboard!' ? <Check className="h-4 w-4 shrink-0" /> : <Share2 className="h-4 w-4 shrink-0" />}
                  Share
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    onRollAgain()
                  }}
                  aria-label="Roll again"
                  className={`inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent px-3 py-2.5 text-white transition-all duration-150 hover:scale-105 hover:bg-accent-dark active:scale-95 ${reduceMotion ? '' : 'roll-again-glow'}`}
                >
                  <Dices className="h-4 w-4 shrink-0" />
                  Roll Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {toast ? <Toast message={toast} type="success" /> : null}
      {showAuthPrompt ? <AuthPromptModal onClose={() => setShowAuthPrompt(false)} /> : null}
      {showRarityInfo ? <RarityInfoModal onClose={() => setShowRarityInfo(false)} /> : null}
    </>
  )
}
