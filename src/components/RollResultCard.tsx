import { useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { Bookmark, BookmarkCheck, Check, Dices, Info, Share2, X } from 'lucide-react'
import type { Career } from '../data/demoCareers'
import type { TierKey } from '../utils/careerTiers'
import { getDisplayRarityN, getTierConfig } from '../utils/careerTiers'
import { getTierStyle } from '../utils/tierStyles'
import { formatSalaryRange } from '../utils/formatSalary'
import { useAuthStore } from '../store/useAuthStore'
import { useBinderStore, useMyBinderCards } from '../store/useBinderStore'
import { useRollStore } from '../store/useRollStore'
import { usePathStore } from '../store/usePathStore'
import { useMyUserProfile } from '../store/useUserProfileStore'
import AuthPromptModal from './AuthPromptModal'
import CardParticles from './CardParticles'
import RarityInfoModal from './RarityInfoModal'
import TitlePill from './TitlePill'
import Toast from './Toast'

interface RollResultCardProps {
  career: Career
  tier: TierKey
  onDismiss: () => void
  onRollAgain: () => void
}

const SPARKLE_POSITIONS = [
  { className: '-left-2 top-8', delay: '0s' },
  { className: '-right-2 top-20', delay: '0.6s' },
  { className: 'left-10 -top-2', delay: '1.1s' },
  { className: 'right-12 -bottom-2', delay: '0.3s' },
]

// Chunk 7: this card went from "plain white card, colored left border" to
// an actual collectible-card object - full glowing tier-colored frame, 3D
// mouse-tilt, a mouse-follow light sheen, per-tier decorative layers
// (rotating ring / holographic sweep / sparkles / obsidian veins - see
// tierStyles.ts's `effect` field and the CSS it references in index.css),
// gradient salary text, and a spring "pop" entrance. The 4-action bar,
// odds line, and "card click navigates, buttons stopPropagation" pattern
// are unchanged from earlier chunks.
export default function RollResultCard({ career, tier, onDismiss, onRollAgain }: RollResultCardProps) {
  const navigate = useNavigate()
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const currentUser = useAuthStore((state) => state.currentUser)
  const profile = useMyUserProfile()
  const addCard = useBinderStore((state) => state.addCard)
  const binderCards = useMyBinderCards()
  const [toast, setToast] = useState<string | null>(null)
  const [showRarityInfo, setShowRarityInfo] = useState(false)
  // Sticks at true for the rest of this card's lifetime once clicked (a
  // fresh roll is a fresh RollResultCard instance - see
  // JobMarketRollPage.tsx's AnimatePresence, result always passes through
  // null/unmount between rolls), not just a brief animation flag - guards
  // against spam-clicking Add adding unlimited duplicate copies of the SAME
  // roll. Duplicates across DIFFERENT rolls are still a real, intended
  // feature (rolling the same career again later adds another copy), just
  // not from mashing the button on one result.
  const [justAdded, setJustAdded] = useState(false)
  // Rolling a career you've already got shows "Added" immediately, not
  // "Add" again - per explicit request ("if a card has been added then a
  // user rolls the same card make sure that the add button already says
  // added"). addCard() itself already treats this as a genuine duplicate
  // add (a second Binder copy, tracked separately) rather than a no-op -
  // this only affects what the BUTTON shows on first render, not whether
  // clicking it still works.
  const hasAdded = justAdded || binderCards.some((card) => card.careerId === career.id)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // 3D tilt: raw values updated on mousemove, springed for a smooth
  // follow rather than a snap. Disabled entirely under reduce-motion -
  // this is a JS-driven transform, not a CSS `animation`, so it's the one
  // effect in this file the global reduce-motion CSS rules can't reach.
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 25 })
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 25 })

  const config = getTierConfig(tier)
  const style = getTierStyle(tier)
  const isMythic = tier === 'mythic'
  const isHighTier = tier === 'epic' || tier === 'legendary' || tier === 'mythic'

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    rotateY.set(px * 12)
    rotateX.set(-py * 12)
    cardRef.current.style.setProperty('--mx', `${(px + 0.5) * 100}%`)
    cardRef.current.style.setProperty('--my', `${(py + 0.5) * 100}%`)
  }
  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  const flashToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast((current) => (current === message ? null : current)), 2500)
  }

  const handleAddToBinder = (event: MouseEvent) => {
    event.stopPropagation()
    // Belt-and-braces alongside the button's own disabled={hasAdded} below -
    // this is what actually stops a fast/repeated click (or Enter-key
    // repeat) from calling addCard() again before the button's disabled
    // attribute has visually registered.
    if (hasAdded) return
    if (!currentUser) {
      setShowAuthPrompt(true)
      return
    }
    const attemptNumber = useRollStore.getState().lifetimeTotalRolls
    const result = addCard(career, tier, attemptNumber)
    if (result === 'full') {
      flashToast('Binder full!')
      return
    }
    if (result === 'unauthenticated') {
      // Shouldn't happen given the currentUser check above, but if the
      // session expired between the check and the click, fall back to the
      // same prompt rather than silently doing nothing.
      setShowAuthPrompt(true)
      return
    }
    setJustAdded(true)
    flashToast(result === 'duplicate' ? 'You already have this card! Duplicate added.' : 'Added to binder!')
  }

  const buildShareUrl = () => `${window.location.origin}/job-market/roll?career=${career.id}&tier=${tier}`

  const handleShare = async (event: MouseEvent) => {
    event.stopPropagation()
    const url = buildShareUrl()
    const text = `I just rolled a ${config.label} - ${career.title} (${career.salary}) on PathScrawler! 🎲 ${url}`

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

  const effectClass =
    style.effect === 'shimmer-border'
      ? 'tier-shimmer-border'
      : style.effect === 'rotating-border'
        ? 'tier-rotating-border'
        : style.effect === 'holographic'
          ? 'tier-holographic'
          : style.effect === 'obsidian'
            ? 'tier-obsidian'
            : ''

  const buttonBase =
    'tier-action-btn inline-flex items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-2.5 font-semibold transition-all duration-150 hover:scale-105 active:scale-95'
  const buttonSurface = isMythic ? 'bg-white/5 text-slate-200 hover:bg-white/10' : 'bg-white/70 text-slate-700 hover:bg-white dark:bg-slate-800/60 dark:text-slate-200 dark:hover:bg-slate-800'

  return (
    <>
      {/* perspective: the 3D tilt on the card below only reads as 3D with a
          perspective origin set on an ancestor - kept on this wrapper
          (not the card itself) so it doesn't fight the card's own
          rotateX/rotateY transform-origin. */}
      <div className="relative w-full max-w-md" style={{ perspective: reduceMotion ? undefined : 1000 }}>
        {style.particles !== 'none' && !reduceMotion ? <CardParticles kind={style.particles} /> : null}

        <motion.div
          ref={cardRef}
          // stopPropagation: without it, this click also bubbles up to
          // JobMarketRollPage's own outer "click anywhere outside the
          // card to dismiss" handler, which fires dismiss() in the same
          // tick and clears activeResultCareerId (useRollStore) right as
          // the user navigates away - so the "resume the card you
          // rolled" restore-on-Back effect found nothing left to
          // restore. Stopping it here keeps the click-through-to-detail
          // and click-to-dismiss actions from firing on the same click.
          onClick={(event) => {
            event.stopPropagation()
            navigate(`/career/${career.id}`, { state: { from: 'roll' } })
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={
            {
              rotateX: reduceMotion ? 0 : springRotateX,
              rotateY: reduceMotion ? 0 : springRotateY,
              transformStyle: 'preserve-3d',
              boxShadow: `0 10px 40px -10px rgba(${style.glowRgb}, 0.5), 0 4px 14px rgba(0, 0, 0, 0.18)`,
              '--tier-glow-rgb': style.glowRgb,
            } as CSSProperties
          }
          className={`card-noise card-arrival-pulse relative z-10 w-full cursor-pointer rounded-3xl border-[3px] p-6 text-left backdrop-blur-sm ${style.borderColorClass} ${effectClass} ${
            isMythic ? 'tier-mythic-pulse tier-obsidian bg-slate-950/95' : `bg-white/95 dark:bg-slate-800/85 ${style.cardTint}`
          }`}
        >
          {/* Mouse-follow light sheen - always "active" (opacity toggled via
              the class, not conditionally rendered) so it fades in/out
              smoothly with the CSS transition rather than popping. */}
          <div className={`card-sheen ${reduceMotion ? '' : 'card-sheen-active'}`} />

          {style.effect === 'sparkle' && !reduceMotion
            ? SPARKLE_POSITIONS.map((sparkle, index) => (
                <span
                  key={index}
                  className={`sparkle-dot ${sparkle.className} text-amber-400`}
                  style={{ animationDelay: sparkle.delay }}
                  aria-hidden="true"
                >
                  ✦
                </span>
              ))
            : null}

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onDismiss()
            }}
            aria-label="Close this roll"
            className={`absolute right-3 top-3 z-20 rounded-full p-1.5 transition ${
              isMythic ? 'text-slate-400 hover:bg-white/10 hover:text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <X className="h-4 w-4" />
          </button>

          {/* Owner watermark - who rolled this card + their equipped title.
              Reads as attribution when the card is screenshotted/shared
              (spec: "Top corner watermark"). Only for the signed-in player's
              own roll. */}
          {currentUser && profile?.username ? (
            <div className="relative z-10 mb-2 flex items-center gap-1.5 pr-8">
              {profile.equippedTitleId ? (
                <TitlePill titleId={profile.equippedTitleId} tone={isMythic ? 'dark' : 'light'} />
              ) : null}
              <span className={`truncate text-[11px] font-semibold ${isMythic ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {profile.username}
              </span>
            </div>
          ) : null}

          <h2
            className={`relative z-10 text-3xl font-bold leading-tight ${isMythic ? 'text-white' : 'text-slate-950 dark:text-slate-50'}`}
            style={{ textShadow: `0 2px 16px rgba(${style.glowRgb}, 0.35)` }}
          >
            {career.title}
          </h2>
          <p className={`relative z-10 mt-1 text-2xl font-extrabold ${style.salaryTextClass}`}>{formatSalaryRange(career.salary)}</p>

          <p className={`relative z-10 mt-3 line-clamp-2 text-sm leading-6 ${isMythic ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'}`}>
            {career.description}
          </p>

          {isHighTier ? (
            // Epic/Legendary/Mythic (by real UK workforce rarity - see
            // careerTiers.ts's getCareerTier) gets a badge of its own rather
            // than the plain italic line below - "Mythic • 1 in 500" is the
            // whole point of rolling one of these, not a footnote. The
            // figure is getDisplayRarityN's real, unmodified value (no
            // floor - a career only reaches Epic+ by genuinely being that
            // rare in the first place now), or the exact hand-sourced
            // rarityLabel for the handful of heritage-craft careers with
            // one.
            <p
              className="relative z-10 mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-300 ring-1 ring-amber-400/40"
              style={{ boxShadow: '0 2px 12px -2px rgba(251, 191, 36, 0.35)' }}
            >
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
                className="rounded-full text-amber-300/70 transition hover:text-amber-200"
              >
                <Info className="h-3.5 w-3.5" />
              </button>
            </p>
          ) : (
            <p className={`relative z-10 mt-3 inline-flex items-center gap-1 text-xs font-medium italic ${isMythic ? 'text-red-500/90' : style.badgeText}`}>
              {/* A REAL fact, not the game's roll odds relabeled - actual UK
                  employment share (career.employmentPercentage, see
                  demoCareers.d.ts/demoCareers.js for the ONS SOC 2020 / DfE
                  Occupations in Demand 2024 source, one entry per career),
                  converted to "1 in every N workers". */}
              {career.rarityLabel ? `${career.rarityLabel}.` : `1 in every ${getDisplayRarityN(career).toLocaleString('en-GB')} workers.`}
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  setShowRarityInfo(true)
                }}
                aria-label="How we calculate rarity"
                className="not-italic opacity-70 transition hover:opacity-100"
              >
                <Info className="h-3.5 w-3.5" />
              </button>
            </p>
          )}

          {/* Discard was removed as redundant - the X in the top-right
              corner and clicking outside the card already close it. 3
              buttons fit a single row at every width, no 2x2/order
              reshuffling needed anymore.
              onClick stopPropagation on the ROW itself, not just each
              button: the card's own root onClick navigates to the career
              detail page (line ~170), and each button already stops that
              when clicked directly - but the gaps between buttons and the
              row's own padding/border-t weren't covered, so a slightly
              off-target tap fell through to the card and navigated away
              unexpectedly. Catching it here closes that gap without
              touching the buttons' own handlers (still stop + act
              normally when actually clicked). */}
          <div
            className="relative z-10 mt-5 grid grid-cols-3 gap-2 border-t pt-4 text-sm font-semibold"
            style={{ borderColor: isMythic ? 'rgba(255,255,255,0.1)' : `rgba(${style.glowRgb}, 0.15)` }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleAddToBinder}
              disabled={hasAdded}
              aria-label={hasAdded ? 'Already added to your career binder' : 'Add to your career binder'}
              className={`${buttonBase} ${buttonSurface} disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100`}
            >
              {hasAdded ? <BookmarkCheck className="h-4 w-4 shrink-0" /> : <Bookmark className="h-4 w-4 shrink-0" />}
              {hasAdded ? 'Added' : 'Add'}
            </button>
            <button type="button" onClick={handleShare} aria-label="Share this roll" className={`${buttonBase} ${buttonSurface}`}>
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
      </div>
      {toast ? <Toast message={toast} type="success" /> : null}
      {showAuthPrompt ? <AuthPromptModal onClose={() => setShowAuthPrompt(false)} /> : null}
      {showRarityInfo ? <RarityInfoModal onClose={() => setShowRarityInfo(false)} /> : null}
    </>
  )
}
