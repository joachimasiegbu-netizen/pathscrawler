import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Bookmark, BookmarkCheck, Check, Dices, Info, MousePointerClick, Share2 } from 'lucide-react'
import type { Career } from '../data/demoCareers'
import { getCareerIcon } from '../utils/careerIcons'
import { getDisplayRarityN, getTierConfig } from '../utils/careerTiers'
import { formatSalaryRange } from '../utils/formatSalary'
import { playSound } from '../utils/sound'
import { getTierStyle } from '../utils/tierStyles'
import { useAuthStore } from '../store/useAuthStore'
import { useBinderStore } from '../store/useBinderStore'
import { useRollStore } from '../store/useRollStore'
import { usePathStore } from '../store/usePathStore'
import ConfettiBurst from './ConfettiBurst'
import AuthPromptModal from './AuthPromptModal'
import CelestialOrbitalReveal from './CelestialOrbitalReveal'
import RarityInfoModal from './RarityInfoModal'
import Toast from './Toast'

interface CelestialRevealCardProps {
  career: Career
  onRollAgain: () => void
}

type RevealPhase = 'intro' | 'floating' | 'exploding' | 'revealed'

// The tier above Mythic - reserved for exactly 4 hand-picked careers (Prime
// Minister, President, Vice President, Royal Butler - see
// careerTiers.ts's forcedTier). Same float -> explode -> reveal shape as
// MythicRevealCard.tsx (that design got approved and promoted into the
// real flow first), re-themed silver/white/gold "starfield" instead of
// obsidian/gold, with its own shorter, brighter flash (200ms, not 600ms)
// and a centered gold banner during the explosion - see index.css's
// "Celestial reveal" section for the animation implementation.
//
// A new 'intro' phase now runs FIRST (skipped entirely under reduceMotion,
// same as everything else here): CelestialOrbitalReveal.tsx, a single
// white orbital core that fades in centered, runs its own ring/pulse
// animation for a few seconds, then detonates into a big screen-shaking
// burst of light. (An earlier two-core approach/spiral/merge version of
// that same component fought its own positioning and got scrapped; before
// that, a white-and-gold dragon intro, CelestialDragonReveal.tsx, filled
// this slot - both left in place but no longer imported here.) Once the
// orbital intro finishes it hands back via onComplete, and phase becomes
// 'floating' - the exact same sealed "click to reveal" card this
// component always showed first, now just arriving a beat later.
//
// JobMarketRollPage.tsx renders this INSTEAD of RollResultCard/
// MythicRevealCard specifically when the landed tier is 'celestial', and
// skips its own land-time confetti/flash-text/screen-darken for that case
// (same reasoning as Mythic) - this component owns its own celebration.
//
// No close button anywhere on this card, on either the sealed or revealed
// face, and the orbital intro above it isn't skippable either (see
// CelestialOrbitalReveal.tsx) - same reasoning as MythicRevealCard.tsx:
// Celestial is rarer still, so an accidental click shouldn't be able to
// lose or cut a pull short. The only ways off this card now are
// deliberate: Roll Again, or clicking through to the career page once
// it's open.
export default function CelestialRevealCard({ career, onRollAgain }: CelestialRevealCardProps) {
  const navigate = useNavigate()
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const currentUser = useAuthStore((state) => state.currentUser)
  const addCard = useBinderStore((state) => state.addCard)

  const [phase, setPhase] = useState<RevealPhase>(reduceMotion ? 'revealed' : 'intro')
  const [showConfetti, setShowConfetti] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [hasAdded, setHasAdded] = useState(false)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const [showRarityInfo, setShowRarityInfo] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const timeouts = useRef<number[]>([])

  const Icon = getCareerIcon(career)
  const config = getTierConfig('celestial')
  const style = getTierStyle('celestial')

  const after = (ms: number, fn: () => void) => {
    timeouts.current.push(window.setTimeout(fn, ms))
  }

  useEffect(() => {
    return () => {
      timeouts.current.forEach((id) => window.clearTimeout(id))
    }
  }, [])

  const reveal = (event: MouseEvent) => {
    event.stopPropagation()
    if (phase !== 'floating') return
    setPhase('exploding')
    setShowConfetti(true)
    setShowBanner(true)
    // Same burst sound as MythicRevealCard.tsx's own reveal() - one
    // "you cracked it open" SFX shared by both sealed tiers, not a
    // separate Celestial-specific cue. The tier win stinger
    // (celestial-win.mp3) already played earlier, during the orbital
    // act of CelestialOrbitalReveal.tsx's own intro (not at land time
    // any more - see JobMarketRollPage.tsx's finishRoll), so this click
    // only triggers the explosion sound, not a second win cue layered
    // on top of it.
    playSound('/sounds/card-burst.mp3')
    after(style.confettiDurationMs + 300, () => setShowConfetti(false))
    after(1700, () => setShowBanner(false))
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
    const result = addCard(career, 'celestial', attemptNumber)
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

  // Celestial is even rarer than Mythic (see MythicRevealCard.tsx for the
  // full reasoning) - auto-saves to the binder the moment it's revealed,
  // for whoever's signed in, so a closed card without clicking Add can
  // never lose the pull. hasAdded flipping true here disables the Add
  // button below too, so there's no way to double-add the same pull.
  useEffect(() => {
    if (phase !== 'revealed' || hasAdded || !currentUser) return
    const attemptNumber = useRollStore.getState().lifetimeTotalRolls
    const result = addCard(career, 'celestial', attemptNumber)
    if (result === 'full') {
      flashToast('Binder full - this Celestial could not be auto-saved!')
      return
    }
    if (result === 'unauthenticated') return // shouldn't happen given the currentUser check above
    setHasAdded(true)
    flashToast(result === 'duplicate' ? 'Celestial! Duplicate auto-added to your binder.' : 'Celestial! Auto-added to your binder.')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const handleShare = async (event: MouseEvent) => {
    event.stopPropagation()
    const url = `${window.location.origin}/job-market/roll?career=${career.id}&tier=celestial`
    const text = `I just rolled a CELESTIAL - ${career.title} on PathScrawler! ✨ ${url}`
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
    return <CelestialOrbitalReveal onComplete={() => setPhase('floating')} />
  }

  return (
    <>
      {/* Celestial-only: once the intro hands off (floating/exploding/
          revealed), the page's own dark backdrop (FloatingJobBackground,
          rendered by JobMarketRollPage - a persistent z-0 layer regardless
          of tier) gets painted over white for the rest of this card's
          life, not just Mythic/every-other-tier's usual dark scene. Fixed
          + z-[1] - above that z-0 background, below both the flash below
          (z-30) and the card wrapper itself, which needs its own explicit
          z-10 for that to actually hold: an element with NO z-index
          (auto) doesn't automatically paint over an explicitly z-indexed
          sibling just by coming later in the DOM - z-index comparisons
          ignore source order once either side sets one, so without this
          the card was rendering BEHIND the white overlay, not on top of
          it (caught via screenshot: the card had vanished entirely, not
          assumed). */}
      <div className="pointer-events-none fixed inset-0 z-[1] bg-white" aria-hidden="true" />
      <div
        className={`relative z-10 mx-auto flex h-[500px] w-full max-w-md items-center justify-center ${
          phase === 'exploding' && !reduceMotion ? 'mythic-screen-shake' : ''
        }`}
      >
        {phase === 'exploding' && !reduceMotion ? (
          <div className="celestial-explode-flash pointer-events-none fixed inset-0 z-30 bg-white" aria-hidden="true" />
        ) : null}
        {showConfetti && !reduceMotion ? (
          <ConfettiBurst colors={style.confettiColors} count={style.confettiCount} durationMs={style.confettiDurationMs} />
        ) : null}

        <AnimatePresence>
          {showBanner && !reduceMotion ? (
            <motion.p
              key="celestial-banner"
              initial={{ opacity: 0, y: 12, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`absolute top-4 z-40 text-center text-2xl font-extrabold drop-shadow-sm sm:text-3xl ${style.flashTextClass}`}
            >
              {style.flashText}
            </motion.p>
          ) : null}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {phase === 'floating' || phase === 'exploding' ? (
            <motion.button
              key="floating-card"
              type="button"
              onClick={reveal}
              aria-label="Reveal your Celestial roll"
              // Arrives out of CelestialDragonReveal's explosion (the 'intro'
              // phase right before this one) rather than popping in - a
              // plain scale+fade, not a bounce, so it reads as the light
              // settling into a card rather than another burst on top of
              // the one that just finished.
              initial={reduceMotion ? undefined : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }}
              exit={reduceMotion ? undefined : { opacity: 0, transition: { duration: 0.15 } }}
              className={`celestial-float-card relative flex h-[440px] w-[300px] flex-col items-center justify-center rounded-[24px] border-2 border-amber-200/60 bg-gradient-to-br from-slate-100 via-white to-amber-50 px-6 text-center ${
                phase === 'exploding' && !reduceMotion ? 'celestial-card-burst-out' : ''
              }`}
            >
              <span className="text-6xl">✨</span>
              {/* text-base + tighter tracking than Mythic's equivalent
                  label - "CELESTIAL" is 3 letters longer than "MYTHIC" and
                  clipped past the card edge at Mythic's text-lg/0.2em
                  combo (confirmed via a real rendered screenshot, not
                  eyeballed). */}
              <span className="celestial-shimmer-text mt-4 px-4 text-base font-black uppercase tracking-[0.12em]">Celestial</span>
              <span className="mt-1 text-xs text-slate-500">Ascended to heaven</span>
              <span className="mythic-prompt-pulse mt-6 inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-3 py-1.5 text-xs font-bold text-amber-600 ring-1 ring-amber-400/40">
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
                className="celestial-reveal-card bg-gradient-to-br from-slate-100 via-white to-amber-50"
              >
                <Icon className="celestial-reveal-icon" aria-hidden="true" />

                <div className="celestial-reveal-info">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-600/80">{career.category}</p>
                  <h3 className="celestial-shimmer-text mt-1 text-xl font-extrabold leading-tight">{career.title}</h3>
                  <p className="mt-2 text-sm font-bold text-amber-700">{formatSalaryRange(career.salary)}</p>
                  {/* Same fix as MythicRevealCard.tsx - folded into the
                      same hover-triggered block instead of a separate
                      always-visible element. No background box - plain
                      text sitting on the light card, same slate tone as
                      the rest of this card's body text, relying on
                      .celestial-reveal-info's own inherited text-shadow
                      for legibility. */}
                  <p className="mt-3 line-clamp-5 text-[11px] leading-5 text-slate-600">{career.description}</p>
                  {/* Was a floating top-right badge (tier only) plus a
                      separate plain rarity line - merged into one pill
                      per "remove all pills by the cards the tier tag
                      should only be by the 1 in x text", same combined
                      "emoji label • 1 in N" pattern RollResultCard.tsx's
                      isHighTier branch uses. Placed AFTER the description,
                      not before it - "the 1 in x is always below the
                      little paragraph description, not here" (a
                      screenshot caught it sitting above the description
                      on this card). */}
                  <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-slate-200 via-white to-amber-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-900 ring-1 ring-amber-300/50">
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
                      className="text-slate-500 transition hover:text-slate-800"
                    >
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </p>
                </div>
              </div>

              {/* Real, always-reachable actions (a hover-only bar doesn't
                  work for touch) - same 3-button pattern every tier's card
                  uses. Width pinned to exactly match .celestial-reveal-card
                  (300px) - without an explicit width here, this grid just
                  shrink-wraps to its own content (motion.div's parent is a
                  flex item, not a block container, so it doesn't stretch
                  to match its sibling's width automatically), which could
                  come out narrower OR wider than the card above it and
                  read as off-center relative to it either way. */}
              <div className="mt-4 grid w-[300px] grid-cols-3 gap-2 text-sm font-semibold">
                <button
                  type="button"
                  onClick={handleAddToBinder}
                  disabled={hasAdded}
                  aria-label={hasAdded ? 'Already added to your career binder' : 'Add to your career binder'}
                  className="tier-action-btn inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-amber-300/50 bg-white/70 px-3 py-2.5 text-slate-700 transition-all duration-150 hover:scale-105 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                >
                  {hasAdded ? <BookmarkCheck className="h-4 w-4 shrink-0" /> : <Bookmark className="h-4 w-4 shrink-0" />}
                  {hasAdded ? 'Added' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share this roll"
                  className="tier-action-btn inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-amber-300/50 bg-white/70 px-3 py-2.5 text-slate-700 transition-all duration-150 hover:scale-105 hover:bg-white"
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
