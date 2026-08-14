import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { animate, motion, useMotionValue } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import demoCareers from '../data/demoCareers'
import { getCareerTier, type TierKey } from '../utils/careerTiers'
import { usePathStore } from '../store/usePathStore'

interface ReelItem {
  id: string
  title: string
  tier: TierKey
}

export interface SlotMachineTarget {
  title: string
  tier: TierKey
}

interface SlotMachineLaneProps {
  /** The career to spin toward. Provide it and the cylinder spins toward it.
   * Pass null for a static, non-spinning idle display (a decorative random
   * placeholder) - used for the very first page load, before any roll has
   * happened. */
  target: SlotMachineTarget | null
  /** Bumped by the parent once per roll (JobMarketRollPage's `rollId`).
   * SlotMachineLane can stay mounted across a "logical new roll" - e.g. the
   * very first roll from the idle state, where the cylinder was already
   * visible and never unmounts/remounts - so the spin can't rely on a mount
   * effect alone to know a new roll has started. Watching this instead
   * (rather than forcing a remount via a changing `key`, which briefly
   * rendered the outgoing and incoming cylinder at once - two lanes
   * stacked on screen while the old one faded out) keeps exactly one
   * instance alive and just restarts its animation in place. */
  spinToken: number
  onSpinComplete: () => void
}

// A genuine 3D CSS cylinder - cards arranged in a real circle via
// rotateY(angle) + translateZ(radius) on a transform-style: preserve-3d
// parent, the whole assembly spun with an animated rotateY. This is a
// rotating drum viewed from the front: exactly one card faces the viewer
// dead-on at any moment, the others recede around the circle and vanish
// past its edges as they rotate away.
//
// The cylinder is only ever on screen for "idle, before a roll" or
// "actively spinning" (JobMarketRollPage.tsx hides it entirely, via
// AnimatePresence, the instant a result lands) - but that doesn't mean a
// fresh component instance for every appearance. On the very first roll of
// a page visit, the idle cylinder is already mounted and visible, so
// nothing ever unmounts/remounts it; the spin instead restarts via the
// `spinToken` prop changing on the SAME instance. Later "Roll Again"
// cycles genuinely do unmount (result-only) and remount (spinning again),
// which spinToken also covers correctly since its effect fires on mount
// regardless of whether the value itself is "new".
const QUANTITY = 10
const CARD_W = 132
const CARD_H = 172
// Matches the brief's own formula: translateZ = card width + card height.
// That sum (not some independently-tuned "radius") is what keeps
// EVENLY-SPACED cards from overlapping/clipping into each other as they
// swing around the circle, since it scales the circle's radius directly
// off the card's own footprint.
const RADIUS = CARD_W + CARD_H
const ANGLE_STEP = 360 / QUANTITY
const SPIN_ROTATIONS = 5
const SPIN_DURATION_S = 2.2
// Fast-start, slow-finish - same shape of curve as the previous reel's
// spin, just applied to a rotation angle now instead of a vertical offset.
const SPIN_EASE: [number, number, number, number] = [0.1, 0.6, 0.15, 1]
// Slight downward tilt so the cylinder reads as a 3D drum viewed from just
// above, not a flat card-swap - matches the brief's example value.
const TILT_DEG = -15

// Full-color rarity panels, not a dark card with a colored accent - Epic
// and Legendary keep dark text (their bg is light/bright enough that white
// text would be low-contrast); Mythic keeps the gold-on-black identity
// already established for it elsewhere in this feature.
const REEL_CARD_STYLE: Record<TierKey, { bg: string; text: string }> = {
  common: { bg: 'bg-emerald-500', text: 'text-white' },
  uncommon: { bg: 'bg-blue-500', text: 'text-white' },
  rare: { bg: 'bg-purple-500', text: 'text-white' },
  epic: { bg: 'bg-amber-400', text: 'text-slate-900' },
  legendary: { bg: 'bg-cyan-300', text: 'text-slate-900' },
  mythic: { bg: 'bg-black', text: 'text-amber-400' },
}

function randomReelItem(index: number): ReelItem {
  const career = demoCareers[Math.floor(Math.random() * demoCareers.length)]
  return { id: `filler-${index}-${career.id}-${Math.random().toString(36).slice(2, 6)}`, title: career.title, tier: getCareerTier(career) }
}

function randomTarget(): SlotMachineTarget {
  const career = demoCareers[Math.floor(Math.random() * demoCareers.length)]
  return { title: career.title, tier: getCareerTier(career) }
}

// The winner (or, in idle mode, a random decorative placeholder) is always
// placed at index 0 (angle 0deg on the cylinder, facing the viewer when the
// wrapper's own rotateY is 0/a multiple of 360deg) - a spin only ever needs
// to land the WRAPPER back on an exact multiple of -360deg, which trivially
// brings index 0 to face the viewer again regardless of which career
// actually won. No per-roll "which angle do I need to land on" math, unlike
// a reel where the winner could be at any position.
function buildCylinderReel(target: SlotMachineTarget): ReelItem[] {
  const winner: ReelItem = { id: `slot-0-${target.title}`, title: target.title, tier: target.tier }
  const fillers = Array.from({ length: QUANTITY - 1 }, (_, index) => randomReelItem(index))
  return [winner, ...fillers]
}

function ReelCard({ item, index }: { item: ReelItem; index: number }) {
  const style = REEL_CARD_STYLE[item.tier]
  const angle = ANGLE_STEP * index
  return (
    // backface-visibility hidden: without it, cards on the far side of the
    // cylinder (rotated past 90deg from the viewer) would render as
    // mirrored/backwards text bleeding through instead of just vanishing
    // as they rotate out of view, which is what an opaque physical card
    // would actually do.
    <div
      className={`absolute inset-0 flex items-center justify-center rounded-xl border-2 border-white/15 px-3 text-center shadow-lg [backface-visibility:hidden] ${style.bg}`}
      style={{ transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)` }}
    >
      <span className={`line-clamp-3 text-sm font-extrabold leading-tight sm:text-base ${style.text}`}>{item.title}</span>
    </div>
  )
}

export default function SlotMachineLane({ target, spinToken, onSpinComplete }: SlotMachineLaneProps) {
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const rotateY = useMotionValue(0)
  // Rebuilt whenever spinToken changes (a new roll), not just once at mount -
  // this same component instance can live across "a new roll started" now
  // (see spinToken's doc comment), so a reel built once at mount would keep
  // showing a stale winner/fillers from a previous roll (or the random idle
  // placeholder, for the very first real roll) instead of the actual target.
  // Recomputing via useMemo (not a setState-in-effect) means the correct
  // front-facing card is already in the DOM on the same render that starts
  // the spin, not painted-then-swapped a frame later.
  const reel = useMemo(() => buildCylinderReel(target ?? randomTarget()), [spinToken]) // eslint-disable-line react-hooks/exhaustive-deps
  const stageRef = useRef<HTMLDivElement>(null)
  const cylinderRef = useRef<HTMLDivElement>(null)
  const [verticalCorrection, setVerticalCorrection] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)

  // Tilting the cylinder (rotateX) AND pushing cards toward the viewer
  // (translateZ) at the same time is genuinely-correct 3D behaviour, but it
  // has a side effect that isn't obvious from the numbers alone: translating
  // along a TILTED z-axis has a vertical component too, so the front-facing
  // card ends up sitting well below the stage's actual center (measured:
  // ~97px low at TILT_DEG=-15/RADIUS=304/perspective=1000) even though
  // nothing here sets an explicit y-offset anywhere. Rather than hand-derive
  // that trig and bake in a magic-number pixel correction that would silently
  // go stale the moment any of those three constants change, this measures
  // the ACTUAL rendered offset once at mount (rotateY is still exactly 0
  // then) and compensates for whatever it turns out to be, so tweaking the
  // cylinder's size/tilt/perspective later can't silently reintroduce this.
  useLayoutEffect(() => {
    const stage = stageRef.current
    const cylinder = cylinderRef.current
    if (!stage || !cylinder) return
    const frontCard = cylinder.children[0] as HTMLElement | undefined
    if (!frontCard) return
    const stageRect = stage.getBoundingClientRect()
    const cardRect = frontCard.getBoundingClientRect()
    const offset = cardRect.top + cardRect.height / 2 - (stageRect.top + stageRect.height / 2)
    setVerticalCorrection(-offset)
  }, [])

  useEffect(() => {
    // No target => idle decorative display, not an active roll - stay put.
    if (!target) return

    if (reduceMotion) {
      // "Skip the spin, show the winner instantly" - jump straight there,
      // no multi-second rotation (the actual motion this setting cares
      // about).
      rotateY.set(-360 * SPIN_ROTATIONS)
      onSpinComplete()
      return
    }

    let cancelled = false
    setIsSpinning(true)
    const controls = animate(rotateY, -360 * SPIN_ROTATIONS, { duration: SPIN_DURATION_S, ease: SPIN_EASE })
    controls.then(() => {
      if (cancelled) return
      setIsSpinning(false)
      // The "clunk" - a quick settle bounce once the winner is centered
      // facing the viewer.
      if (cylinderRef.current) {
        animate(cylinderRef.current, { scale: [1, 1.02, 1] }, { duration: 0.2, ease: 'easeOut' })
      }
      onSpinComplete()
    })

    return () => {
      cancelled = true
      controls.stop()
    }
    // spinToken is the real "a new roll started" signal now, not mount
    // itself - this instance can persist across a roll (see spinToken's doc
    // comment on the props interface), so the effect needs to re-run on
    // every genuine token change, not just once at mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinToken])

  return (
    <div className="relative">
      {/* No enclosing box - just a same-sized invisible stage for
          layout/perspective/measurement, so the cards themselves are the
          only thing actually visible (no frame/casing covering them). */}
      <div
        ref={stageRef}
        // slot-cylinder-stage: purely a CSS scoping hook (index.css) for the
        // dark-mode override that keeps Epic/Legendary's intentionally-dark
        // card text from being flipped to white by the app's blanket
        // dark-mode text-color rule - not a visual class, no styling reads
        // it directly.
        className="slot-cylinder-stage relative mx-auto flex h-[280px] w-[260px] items-center justify-center sm:h-[320px] sm:w-[300px]"
      >
        {/* perspective as a plain property on this static wrapper (not
            baked into the spinning element's own transform) - the more
            standard CSS 3D technique, and it keeps the vanishing point
            fixed in the viewport while rotateY animates on the child.
            verticalCorrection (see the layout effect above) offsets this
            whole wrapper, not the spinning cylinder itself, so it stays a
            constant correction unaffected by whatever rotateY is doing. */}
        <div
          className="relative"
          style={{ perspective: 1000, perspectiveOrigin: '50% 50%', transform: `translateY(${verticalCorrection}px)` }}
        >
          <motion.div
            ref={cylinderRef}
            style={{
              width: CARD_W,
              height: CARD_H,
              transformStyle: 'preserve-3d',
              rotateX: TILT_DEG,
              rotateY,
              // GPU-accelerated properties only (transform), hinted only
              // while actually animating - leaving will-change set on an
              // otherwise-static element would just waste GPU memory for
              // no benefit.
              willChange: isSpinning ? 'transform' : 'auto',
            }}
            className="relative"
          >
            {reel.map((item, index) => (
              <ReelCard key={item.id} item={item} index={index} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Indicator - brand accent teal/cyan chevrons above/below the
          front-facing slot, not a side-pointing triangle (there's no
          "edge to point at" the way the old vertical reel had - the
          front-facing card IS the indicator here, these just frame it).
          Peaks point INWARD at the card (top one points down, bottom one
          points up) - not outward toward the screen edges, which is what
          "unrotated ChevronDown on top / rotated on bottom" used to give. */}
      <ChevronDown
        className="pointer-events-none absolute left-1/2 top-1 z-30 h-5 w-5 -translate-x-1/2 text-accent drop-shadow-[0_2px_6px_rgba(6,182,212,0.6)]"
        aria-hidden="true"
      />
      <ChevronDown
        className="pointer-events-none absolute bottom-1 left-1/2 z-30 h-5 w-5 -translate-x-1/2 rotate-180 text-accent drop-shadow-[0_2px_6px_rgba(6,182,212,0.6)]"
        aria-hidden="true"
      />
    </div>
  )
}
