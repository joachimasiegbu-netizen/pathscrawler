import { useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { Bookmark, BookmarkCheck, Check, Dices, Share2, X } from 'lucide-react'
import type { Career } from '../data/demoCareers'
import type { TierKey } from '../utils/careerTiers'
import { getDisplayRarityN, getTierConfig } from '../utils/careerTiers'
import { getTierStyle } from '../utils/tierStyles'
import { useAuthStore } from '../store/useAuthStore'
import { useBinderStore } from '../store/useBinderStore'
import { useRollStore } from '../store/useRollStore'
import { usePathStore } from '../store/usePathStore'
import AuthPromptModal from './AuthPromptModal'
import CardParticles from './CardParticles'
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
  const addCard = useBinderStore((state) => state.addCard)
  const [toast, setToast] = useState<string | null>(null)
  // Sticks at true for the rest of this card's lifetime (a fresh roll is a
  // fresh RollResultCard instance - see JobMarketRollPage.tsx's
  // AnimatePresence, result always passes through null/unmount between
  // rolls), not just a brief animation flag - guards against spam-clicking
  // Add adding unlimited duplicate copies of the SAME roll. Duplicates are
  // a real, intended feature (rolling the same career again later), just
  // not from mashing the button on one result.
  const [hasAdded, setHasAdded] = useState(false)
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
    setHasAdded(true)
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

        {/* Floating tier badge - lives outside the card's own overflow-hidden
            (several tier effects clip to the card bounds for their sweep/ring),
            so "overlapping the border" doesn't get clipped away. */}
        <span
          className={`absolute -right-2 -top-3 z-20 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-lg ${style.badgeBg} ${style.badgeText}`}
          style={{ boxShadow: `0 4px 16px -2px rgba(${style.glowRgb}, 0.6)` }}
        >
          {config.emoji} {config.label}
        </span>

        <motion.div
          ref={cardRef}
          onClick={() => navigate(`/career/${career.id}`, { state: { from: 'roll' } })}
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

          <span
            className={`relative z-10 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
              isMythic ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
            }`}
          >
            {career.category}
          </span>

          <h2
            className={`relative z-10 mt-3 text-3xl font-bold leading-tight ${isMythic ? 'text-white' : 'text-slate-950 dark:text-slate-50'}`}
            style={{ textShadow: `0 2px 16px rgba(${style.glowRgb}, 0.35)` }}
          >
            {career.title}
          </h2>
          <p className={`relative z-10 mt-1 text-2xl font-extrabold ${style.salaryTextClass}`}>{career.salary}</p>

          <p className={`relative z-10 mt-3 line-clamp-2 text-sm leading-6 ${isMythic ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'}`}>
            {career.description}
          </p>

          {isHighTier ? (
            // Epic/Legendary/Mythic (by pay - see careerTiers.ts's
            // getCareerTier) gets a badge of its own rather than the plain
            // italic line below - "Mythic • 1 in 300" is the whole point of
            // rolling one of these, not a footnote. The figure is
            // getDisplayRarityN's floored value for ordinary high earners
            // (a high-paying job that's actually common in real life gets
            // bumped up to at least 1 in 300 so "Mythic" still feels rare),
            // or the exact hand-sourced rarityLabel for the handful of
            // ultra-rare heritage-craft careers that happen to also clear
            // the pay bar.
            <p
              className="relative z-10 mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-300 ring-1 ring-amber-400/40"
              style={{ boxShadow: '0 2px 12px -2px rgba(251, 191, 36, 0.35)' }}
            >
              {config.emoji} {config.label} •{' '}
              {career.rarityLabel
                ? career.rarityLabel.replace('1 in every ', '1 in ').replace(' workers', '')
                : `1 in ${getDisplayRarityN(career).toLocaleString('en-GB')}`}
            </p>
          ) : (
            <p className={`relative z-10 mt-3 text-xs font-medium italic ${isMythic ? 'text-amber-400/90' : style.badgeText}`}>
              {/* A REAL fact, not the game's roll odds relabeled - actual UK
                  employment share (career.employmentPercentage, see
                  demoCareers.d.ts/demoCareers.js for the ONS SOC 2020 / DfE
                  Occupations in Demand 2024 source, one entry per career),
                  converted to "1 in every N workers" - real figure here,
                  no scarcity floor, since that only applies to the Epic+
                  badge above. */}
              {career.rarityLabel ? `${career.rarityLabel}.` : `1 in every ${getDisplayRarityN(career).toLocaleString('en-GB')} workers.`}
            </p>
          )}

          {/* Discard was removed as redundant - the X in the top-right
              corner and clicking outside the card already close it. 3
              buttons fit a single row at every width, no 2x2/order
              reshuffling needed anymore. */}
          <div
            className="relative z-10 mt-5 grid grid-cols-3 gap-2 border-t pt-4 text-sm font-semibold"
            style={{ borderColor: isMythic ? 'rgba(255,255,255,0.1)' : `rgba(${style.glowRgb}, 0.15)` }}
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
    </>
  )
}
