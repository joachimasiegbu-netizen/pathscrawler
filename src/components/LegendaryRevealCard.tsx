import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bookmark, BookmarkCheck, Check, Dices, Flame, Hammer, Info, Share2, Shield, Swords, Zap } from 'lucide-react'
import type { Career } from '../data/demoCareers'
import { getDisplayRarityN, getTierConfig } from '../utils/careerTiers'
import { formatSalaryRange } from '../utils/formatSalary'
import { useAuthStore } from '../store/useAuthStore'
import { useBinderStore, useMyBinderCards } from '../store/useBinderStore'
import { useRollStore } from '../store/useRollStore'
import { usePathStore } from '../store/usePathStore'
import AuthPromptModal from './AuthPromptModal'
import RarityInfoModal from './RarityInfoModal'
import Toast from './Toast'

interface LegendaryRevealCardProps {
  career: Career
  onRollAgain: () => void
}

// "do it the same as mythic and celestial but dont put the cutscenes" -
// same reveal-CARD design as MythicRevealCard.tsx/CelestialRevealCard.tsx
// (idle-bob icon that grows/rotates into the corner on hover while the
// title/salary/etc slide in from off-card - see .legendary-reveal-card in
// index.css for the animation), same no-close-button/auto-add-to-binder
// treatment those two use - but with neither of their pre-roll cutscenes:
// no fullscreen intro sequence (MythicStarfieldReveal/
// CelestialOrbitalReveal) and no floating "click to reveal" sealed-card
// gate first. This renders straight in its final revealed state the
// instant JobMarketRollPage mounts it, same as RollResultCard.tsx always
// has for every tier below this one - Legendary is common enough (1 in
// 200, not 1 in 1,000+) that a whole extra reveal ceremony read as
// overkill, just not the sealed-card gimmick itself.
//
// JobMarketRollPage.tsx renders this INSTEAD of RollResultCard
// specifically when the landed tier is 'legendary' - its own land-time
// confetti/flash-text/epic-flash celebration still fires normally for
// this tier (only Mythic/Celestial are excluded from that, since THEIR
// components own a click-triggered celebration instead - this one
// doesn't, so it relies on that land-time celebration same as every
// other non-Mythic/Celestial tier always has).
//
// "for the icons use weapons from legends like thors hammer" - a small
// set of mythical-weapon icons (not the profession-based getCareerIcon
// Mythic/Celestial use), picked deterministically off career.id rather
// than randomly per view, so the same career always shows the same
// weapon.
const LEGENDARY_WEAPONS = [Hammer, Swords, Shield, Zap, Flame]

export default function LegendaryRevealCard({ career, onRollAgain }: LegendaryRevealCardProps) {
  const navigate = useNavigate()
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const currentUser = useAuthStore((state) => state.currentUser)
  const addCard = useBinderStore((state) => state.addCard)
  const binderCards = useMyBinderCards()

  // justAdded: sticky per-mount flag for the manual Add button + the
  // auto-add effect below - kept separate from the ref that actually
  // guards the auto-add effect (autoAddedRef below) so this can safely
  // start true (already in the Binder) without also disabling that
  // effect's own always-runs-once-per-mount behavior.
  const [justAdded, setJustAdded] = useState(false)
  // Rolling a career you've already got shows "Added" immediately, not
  // "Add" - per explicit request, same fix as RollResultCard.tsx.
  const hasAdded = justAdded || binderCards.some((card) => card.careerId === career.id)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const [showRarityInfo, setShowRarityInfo] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const Icon = LEGENDARY_WEAPONS[career.id % LEGENDARY_WEAPONS.length]
  const config = getTierConfig('legendary')

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
    const result = addCard(career, 'legendary', attemptNumber)
    if (result === 'full') {
      flashToast('Binder full!')
      return
    }
    if (result === 'unauthenticated') {
      setShowAuthPrompt(true)
      return
    }
    setJustAdded(true)
    flashToast(result === 'duplicate' ? 'You already have this card! Duplicate added.' : 'Added to binder!')
  }

  // Auto-saves to the binder the moment this card mounts, for whoever's
  // signed in - same treatment MythicRevealCard/CelestialRevealCard give
  // their own tiers, just triggered immediately here since there's no
  // 'revealed' phase transition to gate on. Guarded by its own ref, NOT
  // the display-facing `hasAdded` above - this always runs once per mount
  // regardless of whether the career's already in the Binder (rolling the
  // same Legendary again is meant to add another real copy, same as every
  // other tier), so it can't be gated by the same flag that now starts
  // true for an already-owned career.
  const autoAddedRef = useRef(false)
  useEffect(() => {
    if (autoAddedRef.current || !currentUser) return
    autoAddedRef.current = true
    const attemptNumber = useRollStore.getState().lifetimeTotalRolls
    const result = addCard(career, 'legendary', attemptNumber)
    if (result === 'full') {
      flashToast('Binder full - this Legendary could not be auto-saved!')
      return
    }
    if (result === 'unauthenticated') return // shouldn't happen given the currentUser check above
    setJustAdded(true)
    flashToast(result === 'duplicate' ? 'Legendary! Duplicate auto-added to your binder.' : 'Legendary! Auto-added to your binder.')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleShare = async (event: MouseEvent) => {
    event.stopPropagation()
    const url = `${window.location.origin}/job-market/roll?career=${career.id}&tier=legendary`
    const text = `I just rolled a LEGENDARY - ${career.title} on PathScrawler! 💎 ${url}`
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

  return (
    <>
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, scale: 0.4, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: 0, transition: { type: 'spring', bounce: 0.5, duration: 0.7 } }}
        className="relative mx-auto flex w-full max-w-md flex-col items-center"
      >
        <div
          onClick={() => navigate(`/career/${career.id}`, { state: { from: 'roll' } })}
          className="legendary-reveal-card tier-holographic bg-gradient-to-br from-cyan-50 via-white to-cyan-100 dark:from-slate-900 dark:via-slate-950 dark:to-cyan-950"
        >
          <Icon className="legendary-reveal-icon" aria-hidden="true" />

          <div className="legendary-reveal-info">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-accent-dark/80 dark:text-accent/80">{career.category}</p>
            <h3 className="mt-1 text-xl font-extrabold leading-tight text-slate-950 dark:text-slate-50">{career.title}</h3>
            <p className="mt-2 text-sm font-bold text-accent-dark dark:text-accent">{formatSalaryRange(career.salary)}</p>
            <p className="mt-3 line-clamp-5 text-[11px] leading-5 text-slate-600 dark:text-slate-300">{career.description}</p>
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-accent-dark ring-1 ring-accent/40 dark:text-accent">
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
                className="text-accent-dark/70 transition hover:text-accent-dark dark:text-accent/70 dark:hover:text-accent"
              >
                <Info className="h-3.5 w-3.5" />
              </button>
            </p>
          </div>
        </div>

        {/* Same 3-button pattern every other tier's card uses. Width pinned
            to exactly match .legendary-reveal-card (300px) - see
            CelestialRevealCard.tsx's own comment on this same pattern for
            why (a flex item doesn't stretch to match a sibling's width on
            its own). */}
        <div className="mt-4 grid w-[300px] grid-cols-3 gap-2 text-sm font-semibold">
          <button
            type="button"
            onClick={handleAddToBinder}
            disabled={hasAdded}
            aria-label={hasAdded ? 'Already added to your career binder' : 'Add to your career binder'}
            className="tier-action-btn inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-accent/40 bg-white/70 px-3 py-2.5 text-slate-700 transition-all duration-150 hover:scale-105 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {hasAdded ? <BookmarkCheck className="h-4 w-4 shrink-0" /> : <Bookmark className="h-4 w-4 shrink-0" />}
            {hasAdded ? 'Added' : 'Add'}
          </button>
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share this roll"
            className="tier-action-btn inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-accent/40 bg-white/70 px-3 py-2.5 text-slate-700 transition-all duration-150 hover:scale-105 hover:bg-white dark:bg-slate-800/60 dark:text-slate-200 dark:hover:bg-slate-800"
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

      {toast ? <Toast message={toast} type="success" /> : null}
      {showAuthPrompt ? <AuthPromptModal onClose={() => setShowAuthPrompt(false)} /> : null}
      {showRarityInfo ? <RarityInfoModal onClose={() => setShowRarityInfo(false)} /> : null}
    </>
  )
}
