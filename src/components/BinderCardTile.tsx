import { Check } from 'lucide-react'
import demoCareers from '../data/demoCareers'
import { getTierConfig, type TierKey } from '../utils/careerTiers'
import { getTierStyle } from '../utils/tierStyles'
import type { GroupedBinderCard } from '../utils/binderGrouping'

interface BinderCardTileProps {
  entry: GroupedBinderCard
  onClick: () => void
  /** Google-Photos-style multi-select is active - tapping toggles selection instead of opening the detail modal. */
  selectionMode?: boolean
  selected?: boolean
  onToggleSelect?: () => void
}

// Mini trading-card version of RollResultCard - same tier border/tint/
// badge language, shrunk down for a grid, plus the duplicate-count badge.
// Outside selection mode it's also a hover-flip card (desktop/mouse only -
// see .binder-card-flip in index.css): the front is this same badge/title/
// salary face, the back reveals a category + description teaser and a
// "view details" prompt in a saturated tier-colored gradient, foil-card
// style. Selection mode skips the flip entirely and shows the front face
// only - dimmed cards mid-3D-transform would make the selection circle
// harder to read/hit than it needs to be.
export default function BinderCardTile({ entry, onClick, selectionMode = false, selected = false, onToggleSelect }: BinderCardTileProps) {
  const { latest, count } = entry
  const tier: TierKey = latest.tier
  const config = getTierConfig(tier)
  const style = getTierStyle(tier)
  const isMythic = tier === 'mythic'
  const career = demoCareers.find((item) => item.id === latest.careerId)

  const handleClick = () => {
    if (selectionMode) {
      onToggleSelect?.()
      return
    }
    onClick()
  }

  // Shared "look" (border/tint/background) for the front face - shared
  // between the flip version (needs the absolute-positioned .binder-card-face
  // hook, see index.css) and the plain selection-mode version (just a
  // normal block filling the button, no 3D stack underneath it).
  // ring-1 (a box-shadow, not a border) gives every card a visible all-round
  // edge without fighting border-l-4's own color on the left side the way a
  // real `border` utility would - needed because the card's own background
  // is near-white/near-slate-800, close enough to the grid panel behind it
  // (MyBinderPage.tsx) that shadow-sm alone wasn't enough separation.
  const frontFaceLook = `flex h-full w-full flex-col rounded-2xl border-l-4 p-3 text-left shadow-md ring-1 ring-slate-900/10 dark:ring-white/10 ${style.cardBorder} ${
    isMythic ? 'bg-slate-950' : `bg-white ${style.cardTint} dark:bg-slate-800`
  }`

  const frontFaceContent = (
    <>
      {count > 1 ? (
        <span className="absolute right-2 top-2 rounded-full bg-slate-900/80 px-1.5 py-0.5 text-[10px] font-bold text-white">
          x{count}
        </span>
      ) : null}

      <span className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${style.badgeBg} ${style.badgeText}`}>
        {config.emoji} {config.label}
      </span>

      <p className={`mt-2 line-clamp-2 flex-1 text-sm font-bold leading-tight ${isMythic ? 'text-white' : 'text-slate-950 dark:text-slate-50'}`}>
        {latest.title}
      </p>

      <p className={`mt-1 text-[11px] font-semibold ${isMythic ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>{latest.salary}</p>
    </>
  )

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={selectionMode ? selected : undefined}
      // Dimmed (not re-colored) in selection mode - the tier background/tint
      // stays exactly as-is underneath, just at slightly lower opacity, so
      // cards stay fully readable while clearly reading as "in a different
      // mode" than normal browsing. The hover lift/shadow/flip is
      // normal-mode only - selection mode uses the circle toggle as its
      // only affordance.
      className={`group relative block aspect-[3/4] w-full text-left transition-all duration-200 ${
        selectionMode ? 'opacity-90' : 'hover:-translate-y-1 hover:shadow-xl'
      }`}
    >
      {selectionMode ? (
        <span
          className={`absolute left-2 top-2 z-20 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 shadow-sm transition-colors sm:h-6 sm:w-6 ${
            selected ? 'border-green-500 bg-green-500' : 'border-slate-300 bg-white'
          }`}
          aria-hidden="true"
        >
          {selected ? <Check className="h-3 w-3 text-white sm:h-3.5 sm:w-3.5" strokeWidth={3} /> : null}
        </span>
      ) : null}

      {selectionMode ? (
        <div className={`relative ${frontFaceLook}`}>{frontFaceContent}</div>
      ) : (
        <div className="binder-card-flip h-full w-full">
          <div className="binder-card-flip-inner">
            <div className={`binder-card-face relative ${frontFaceLook}`}>{frontFaceContent}</div>

            <div className={`binder-card-face binder-card-face-back flex flex-col rounded-2xl p-3 text-left shadow-md ring-1 ring-black/10 ${style.flipBackClass}`}>
              <span className="inline-flex w-fit items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                {config.emoji} {config.label}
              </span>
              {career ? (
                <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-wide opacity-80">{career.category}</p>
              ) : null}
              <p className="mt-1.5 line-clamp-4 flex-1 text-[11px] leading-snug opacity-95">
                {career?.description ?? 'Tap for full details on this career.'}
              </p>
              <p className="mt-1.5 text-[11px] font-bold">View details →</p>
            </div>
          </div>
        </div>
      )}
    </button>
  )
}
