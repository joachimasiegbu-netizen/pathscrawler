import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { animate, motion, useMotionValue } from 'framer-motion'
import { ChevronDown, type LucideIcon } from 'lucide-react'
import demoCareers from '../data/demoCareers'
import { getCareerIcon } from '../utils/careerIcons'
import { getCareerTier, type TierKey } from '../utils/careerTiers'
import { usePathStore } from '../store/usePathStore'

interface ReelItem {
  id: string
  title: string
  tier: TierKey
  /** Computed once at build time (getCareerIcon needs title+category, and
   * a ReelItem doesn't otherwise carry category) - shown INSTEAD of the
   * title for sealed (Mythic/Celestial) cards, see ReelCard below. */
  icon: LucideIcon
}

export interface SlotMachineTarget {
  title: string
  tier: TierKey
  category: string
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

// "Glass Marble" rarity panels - a two-stop same-hue gradient (not a flat
// fill) plus the .reel-marble-card CSS class (index.css, same layered-
// shadow/glow-blob/glossy-streak technique as the ROLL! button itself) for
// the actual glass depth; this object only carries the per-tier colors
// that technique needs. fillFrom/fillTo are "R, G, B" (not hex/Tailwind
// classes) since they feed CSS custom properties consumed by rgb()/rgba()
// in that class. common/uncommon/rare reuse the EXACT same gradient
// tierStyles.ts's flipBackClass already uses for these three tiers
// (Binder card flip face) - genuine consistency, not a coincidence.
// epic/legendary/celestial intentionally use LIGHTER stops than
// flipBackClass's own (which pairs those with WHITE text) to preserve
// this card's own established dark-text-for-contrast choice below -
// Epic and Legendary keep dark text (their bg is light/bright enough that
// white text would be low-contrast); Mythic keeps its own black+red
// identity (overriding --highlight to red instead of the shared gold)
// already established for it elsewhere in this feature.
const REEL_CARD_STYLE: Record<TierKey, { fillFrom: string; fillTo: string; text: string; highlight?: string }> = {
  common: { fillFrom: '52, 211, 153', fillTo: '5, 150, 105', text: 'text-white' },
  uncommon: { fillFrom: '96, 165, 250', fillTo: '37, 99, 235', text: 'text-white' },
  rare: { fillFrom: '192, 132, 252', fillTo: '147, 51, 234', text: 'text-white' },
  epic: { fillFrom: '252, 211, 77', fillTo: '245, 158, 11', text: 'text-slate-900' },
  legendary: { fillFrom: '165, 243, 252', fillTo: '34, 211, 238', text: 'text-slate-900' },
  mythic: { fillFrom: '15, 23, 42', fillTo: '0, 0, 0', text: 'text-red-500', highlight: '220, 38, 38' },
  celestial: { fillFrom: '241, 245, 249', fillTo: '254, 243, 199', text: 'text-slate-900', highlight: '251, 191, 36' },
}

function randomReelItem(index: number): ReelItem {
  const career = demoCareers[Math.floor(Math.random() * demoCareers.length)]
  return {
    id: `filler-${index}-${career.id}-${Math.random().toString(36).slice(2, 6)}`,
    title: career.title,
    tier: getCareerTier(career),
    icon: getCareerIcon(career),
  }
}

function randomTarget(): SlotMachineTarget {
  const career = demoCareers[Math.floor(Math.random() * demoCareers.length)]
  return { title: career.title, tier: getCareerTier(career), category: career.category }
}

// The winner (or, in idle mode, a random decorative placeholder) is always
// placed at index 0 (angle 0deg on the cylinder, facing the viewer when the
// wrapper's own rotateY is 0/a multiple of 360deg) - a spin only ever needs
// to land the WRAPPER back on an exact multiple of -360deg, which trivially
// brings index 0 to face the viewer again regardless of which career
// actually won. No per-roll "which angle do I need to land on" math, unlike
// a reel where the winner could be at any position.
function buildCylinderReel(target: SlotMachineTarget): ReelItem[] {
  const winner: ReelItem = { id: `slot-0-${target.title}`, title: target.title, tier: target.tier, icon: getCareerIcon(target) }
  const fillers = Array.from({ length: QUANTITY - 1 }, (_, index) => randomReelItem(index))
  return [winner, ...fillers]
}

// Mythic/Celestial stay sealed on the wheel itself - MythicRevealCard/
// CelestialRevealCard's whole "floats, click to reveal" mechanic only
// works as a surprise if the name was never readable a moment earlier
// while it was still spinning past (true for a filler card glimpsed in
// passing, and doubly true for the actual winner, which sits front-and-
// center, fully readable, for the last second or so as the wheel
// decelerates onto it). The tier's own card color still shows (that's not
// "written" information, and losing it would make every sealed card look
// identical mid-spin) - the title text is swapped for the career's own
// icon (careerIcons.ts) instead, a visual hint without giving the actual
// name away.
const SEALED_TIERS = new Set<TierKey>(['mythic', 'celestial'])

// Icon color for sealed cards specifically - NOT just style.text reused,
// which would render Celestial's icon in text-slate-900 (near-black,
// meant for regular title text on its white card) rather than the gold
// this tier is meant to read as everywhere else in the app. Mythic's own
// style.text (text-amber-400) already happens to be gold, so only
// Celestial actually needs a different value here.
const SEALED_ICON_COLOR: Partial<Record<TierKey, string>> = {
  celestial: 'text-amber-500',
}

function ReelCard({ item, index }: { item: ReelItem; index: number }) {
  const style = REEL_CARD_STYLE[item.tier]
  const angle = ANGLE_STEP * index
  const isSealed = SEALED_TIERS.has(item.tier)
  const Icon = item.icon
  return (
    // backface-visibility hidden: without it, cards on the far side of the
    // cylinder (rotated past 90deg from the viewer) would render as
    // mirrored/backwards text bleeding through instead of just vanishing
    // as they rotate out of view, which is what an opaque physical card
    // would actually do.
    //
    // reel-marble-card: the glass depth (index.css) -
    // --fill-from/--fill-to/--highlight feed that class via inline custom
    // properties since they're per-tier values a CSS class alone can't
    // parametrize. overflow-hidden clips the glow-blob/glossy-streak
    // pseudo-elements (which intentionally extend past the card's own
    // box) to this card's own rounded corners.
    //
    // Deliberately NOT also using .card-noise here (unlike the final
    // reveal cards, RollResultCard.tsx) - that class hardcodes
    // `position: relative`, and since it's defined AFTER Tailwind's own
    // utilities in index.css, it silently beat this card's required
    // `absolute` (equal specificity, later rule wins) and knocked every
    // card out of the 3D cylinder into normal document flow - confirmed
    // via a real rendered screenshot showing cards scattered down the
    // page instead of arranged in the circle. Not worth chasing a
    // grain-texture-on-an-absolutely-positioned-element variant for a
    // subtle effect nobody's going to see mid-spin anyway.
    <div
      className="reel-marble-card absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl border border-white/20 px-3 text-center [backface-visibility:hidden]"
      style={
        {
          transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
          '--fill-from': style.fillFrom,
          '--fill-to': style.fillTo,
          ...(style.highlight ? { '--highlight': style.highlight } : {}),
        } as CSSProperties
      }
    >
      {/* z-[2]: above both the noise layer (.card-noise::before, z-index:1)
          and the glow/streak pseudo-elements (z-index:auto, same paint
          layer as the noise) - guarantees the icon/title stays legible on
          top of all of it. */}
      <div className="relative z-[2]">
        {isSealed ? (
          <Icon className={`h-10 w-10 ${SEALED_ICON_COLOR[item.tier] ?? style.text}`} aria-hidden="true" />
        ) : (
          <span className={`line-clamp-3 text-sm font-extrabold leading-tight sm:text-base ${style.text}`}>{item.title}</span>
        )}
      </div>
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

    // Target is RELATIVE to wherever rotateY currently sits, not a fixed
    // absolute angle - "when i click before a transition or animation is
    // done the next roll goes straight to the card reveal... rather than
    // showing the rolling animation": this component is DESIGNED to stay
    // mounted across rolls rather than always remounting fresh (see
    // spinToken's own doc comment) - normally the cylinder's exit-fade
    // (350ms, in JobMarketRollPage.tsx) finishes and removes it from the
    // DOM before Roll Again is clicked again, so the NEXT roll does get a
    // genuinely fresh instance (rotateY back at its initial 0) either way
    // - but clicking fast enough to land inside that 350ms window means
    // the SAME instance (same AnimatePresence key, still mid-exit) gets
    // reused instead, rotateY and all. A fixed absolute target
    // (-360*SPIN_ROTATIONS) is a no-op the second time round in that
    // case - rotateY is ALREADY sitting there from the previous spin, so
    // there's zero angular distance left to animate through, and the
    // "spin" resolves with no visible motion at all. Computing the
    // target off rotateY.get() at the moment each spin actually starts
    // guarantees a full SPIN_ROTATIONS of real travel every time,
    // reused instance or not - and since any past target was always a
    // multiple of 360 itself, subtracting another full 360*N from it
    // keeps landing on one too, so "index 0 faces the viewer at rest"
    // still holds regardless of how much total rotation has piled up.
    if (reduceMotion) {
      // "Skip the spin, show the winner instantly" - jump straight there,
      // no multi-second rotation (the actual motion this setting cares
      // about).
      rotateY.set(rotateY.get() - 360 * SPIN_ROTATIONS)
      onSpinComplete()
      return
    }

    let cancelled = false
    setIsSpinning(true)
    const controls = animate(rotateY, rotateY.get() - 360 * SPIN_ROTATIONS, { duration: SPIN_DURATION_S, ease: SPIN_EASE })
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
