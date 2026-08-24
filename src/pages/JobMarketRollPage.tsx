import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Dices } from 'lucide-react'
import BackButton from '../components/BackButton'
import ConfettiBurst from '../components/ConfettiBurst'
import FloatingJobBackground from '../components/FloatingJobBackground'
import CelestialRevealCard from '../components/CelestialRevealCard'
import FloatingRollEmbers from '../components/FloatingRollEmbers'
import LegendaryRevealCard from '../components/LegendaryRevealCard'
import MythicRevealCard from '../components/MythicRevealCard'
import RollResultCard from '../components/RollResultCard'
import RollStatsPanel from '../components/RollStatsPanel'
import RollTutorialTooltip from '../components/RollTutorialTooltip'
import SlotMachineLane from '../components/SlotMachineLane'
import demoCareers from '../data/demoCareers'
import { getOddsForCareer, rollForCareer, type RollOutcome } from '../utils/rollEngine'
import { playSound, preloadSounds, stopAllSounds, TIER_SOUNDS } from '../utils/sound'
import { getTierStyle } from '../utils/tierStyles'
import { usePathStore } from '../store/usePathStore'
import { recordRoll as recordLeaderboardRoll } from '../store/useLeaderboardStore'
import { useRollStore } from '../store/useRollStore'

// The cylinder (SlotMachineLane.tsx) is visible for two states only: idle
// (before the first roll, static/decorative) and actively spinning. The
// instant a result lands, `showCylinder` goes false and it fades out via
// AnimatePresence, leaving just the result card - it reappears (and starts
// spinning immediately, since `pendingOutcome` is already set by the time
// it remounts) the moment Roll Again/dismiss brings the controls back. The
// outcome is still decided (rollForCareer()) BEFORE the spin starts, not
// after a fixed delay - the cylinder needs to know which career to land on
// so it can place it on the reel and actually end there, rather than an
// animation unrelated to the result. SlotMachineLane owns its own animation
// timing and calls back via onSpinComplete when it's physically landed, so
// the result reveal is never out of sync with what's on screen (no
// separate guessed setTimeout duration to keep in step with the visual).
// No sound: silent is fine per the brief. No loading spinner: demoCareers.js
// is a static bundled import, never actually async.
export default function JobMarketRollPage() {
  const navigate = useNavigate()
  const [isSpinning, setIsSpinning] = useState(false)
  const [pendingOutcome, setPendingOutcome] = useState<RollOutcome | null>(null)
  const [showCylinder, setShowCylinder] = useState(true)
  // Bumped once per handleRoll() call, passed to SlotMachineLane as
  // `spinToken` so it knows a new roll started even when it stays mounted
  // the whole time (the very first roll: showCylinder is already true, so
  // setShowCylinder(true) is a no-op and the component never
  // unmounts/remounts - forcing a remount via a changing `key` instead
  // briefly rendered the outgoing and incoming cylinder at once, showing as
  // two stacked lanes while the old one faded out).
  const [rollId, setRollId] = useState(0)
  const [result, setResult] = useState<RollOutcome | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showFlashText, setShowFlashText] = useState(false)
  const [showMythicOverlay, setShowMythicOverlay] = useState(false)
  const [showEpicFlash, setShowEpicFlash] = useState(false)
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const getRollContext = useRollStore((state) => state.getRollContext)
  const recordRoll = useRollStore((state) => state.recordRoll)
  const hasSeenRollTutorial = useRollStore((state) => state.hasSeenRollTutorial)
  const dismissTutorial = useRollStore((state) => state.dismissTutorial)
  const timeouts = useRef<number[]>([])
  // Synchronous re-entry guard for handleRoll, separate from isSpinning
  // state below - "make it so it only registers 1 click instead of a
  // bunch" (a grinding player mashing Roll/Roll Again repeatedly).
  // isSpinning alone isn't enough: React state updates are async/batched,
  // so two clicks that both fire before the FIRST click's setIsSpinning
  // (true) has actually re-rendered can both still read the OLD isSpinning
  // (false) from their own stale closures and both slip past that guard,
  // firing two rolls from what should read as one. A ref mutates
  // immediately and is shared across every closure that captured it
  // (however stale), so the second click's check always sees the first
  // click's write, even within the same tick.
  const isRollingRef = useRef(false)
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 639px)').matches)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const query = window.matchMedia('(max-width: 639px)')
    const onChange = () => setIsMobile(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  // Fetch/decode every roll sound the moment this page mounts, well before
  // anyone can click Roll - a cold `new Audio(src).play()` on the actual
  // click has to fetch+decode first, which is a real, noticeable lag on
  // the very first play. Just a .load() each (no playback attempt), so
  // this isn't subject to autoplay-policy blocking the way an unprompted
  // .play() would be.
  useEffect(() => {
    preloadSounds(['/sounds/roll-click.mp3', '/sounds/card-burst.mp3', ...Object.values(TIER_SOUNDS)])
  }, [])

  useEffect(() => {
    return () => {
      timeouts.current.forEach((id) => window.clearTimeout(id))
    }
  }, [])

  // Shared-link view: someone opened /job-market/roll?career=ID&tier=X
  // (the link the Share button builds). This just DISPLAYS that career's
  // card - it's not a roll this visitor made, so it skips the spin,
  // confetti, and recordRoll entirely. Runs once on mount only; a
  // subsequent Roll/Roll Again replaces `result` with a real roll and the
  // stale query params are cleared so they don't get re-read.
  useEffect(() => {
    const careerId = Number(searchParams.get('career'))
    if (!careerId) return
    const career = demoCareers.find((item) => item.id === careerId)
    if (!career) return
    const odds = getOddsForCareer(career)
    if (!odds) return
    setResult({ career, tier: odds.tier, rollWeight: odds.rollWeight, totalWeight: odds.totalWeight, oddsDenominator: odds.oddsDenominator })
    setShowCylinder(false)
    setSearchParams({}, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const after = (ms: number, fn: () => void) => {
    timeouts.current.push(window.setTimeout(fn, ms))
  }

  // Called once the lane has physically landed on `outcome` (or
  // immediately, under reduce-motion) - this is the moment the roll
  // becomes "official": recorded, celebrated, and revealed.
  const finishRoll = (outcome: RollOutcome) => {
    // Releases isRollingRef's guard (see its own comment) the moment a
    // roll is actually done landing, same lifecycle isSpinning already
    // follows just below - Roll Again becomes clickable again right as
    // the result appears, and this makes sure a click on it actually
    // registers instead of still being blocked by the previous roll.
    isRollingRef.current = false
    setIsSpinning(false)
    setPendingOutcome(null)
    setResult(outcome)
    // The cylinder's job is done the moment the winner lands - hide it
    // (AnimatePresence fades it out below) so only the result card remains.
    setShowCylinder(false)
    recordRoll(outcome.career.id, outcome.tier)
    // Fire-and-forget - this is a real network write to Supabase now (see
    // useLeaderboardStore.ts), not a synchronous local store update. Errors
    // are logged inside recordLeaderboardRoll itself rather than surfaced
    // here; a failed leaderboard write shouldn't interrupt the roll reveal
    // the player is actually watching. Signed-out rolls no-op inside it.
    void recordLeaderboardRoll(outcome.career, outcome.tier)

    // The tier's own win stinger plays the moment the roll actually lands
    // (right here) for every tier except Mythic and Celestial - it marks
    // the instant you HAVE one, independent of whether/when you click to
    // open the sealed card. card-burst.mp3 is a separate sound gated on
    // that click instead (see MythicRevealCard/CelestialRevealCard's own
    // reveal()), not this one. Both Mythic's and Celestial's stingers
    // moved later, each into its own reveal sequence instead: Mythic's
    // fires once its sealed card actually appears on screen
    // (MythicRevealCard.tsx, right after MythicStarfieldReveal's dread/
    // explosion intro hands off); Celestial's fires when its own orbital
    // core act begins (CelestialOrbitalReveal.tsx, T_RINGS_END - after
    // the speeder and rings-tunnel acts, not at land time).
    if (outcome.tier !== 'mythic' && outcome.tier !== 'celestial') playSound(TIER_SOUNDS[outcome.tier])

    // Mythic and Celestial each get their own dedicated float -> explode ->
    // reveal sequence (MythicRevealCard/CelestialRevealCard, rendered below
    // instead of RollResultCard for these tiers) - their VISUAL celebration
    // (confetti/flash-text/screen-darken) still waits for the click, so
    // none of that should fire here too or it'd double up.
    if (outcome.tier === 'mythic' || outcome.tier === 'celestial') return

    const style = getTierStyle(outcome.tier)
    setShowConfetti(true)
    after(style.confettiDurationMs + 300, () => setShowConfetti(false))
    if (style.flashText) {
      setShowFlashText(true)
      after(1700, () => setShowFlashText(false))
    }
    if (style.dramatic) {
      setShowMythicOverlay(true)
      after(2400, () => setShowMythicOverlay(false))
    }
    // Epic/Legendary get an extra beat of drama on top of confetti/flash-
    // text - a brief camera-flash across the whole screen right as the
    // card lands. Mythic and Celestial would normally join this list (it's
    // additive to style.dramatic's sustained darken overlay, not a
    // replacement for it) but the early return above already sends both
    // down their own click-triggered celebration instead, so neither can
    // actually reach this line - excluded here rather than listed and
    // unreachable.
    if (outcome.tier === 'epic' || outcome.tier === 'legendary') {
      setShowEpicFlash(true)
      after(450, () => setShowEpicFlash(false))
    }
  }

  const handleRoll = () => {
    // isRollingRef first, synchronously, before anything else - see its
    // own declaration comment for why isSpinning alone can't fully cover
    // a rapid-click burst. Both checked together (belt-and-suspenders,
    // not strictly redundant): the ref only exists to bridge the narrow
    // window before isSpinning's own state update has actually
    // re-rendered - once it has, isSpinning alone would already be
    // enough, but there's no simple way to release the ref right at that
    // exact moment, so it just stays held for the ref's whole lifecycle
    // (released in finishRoll below, same as isSpinning).
    if (isRollingRef.current || isSpinning) return
    isRollingRef.current = true
    // "when they click out all sound is cut immediately" - stops
    // whatever the PREVIOUS roll left playing (a stinger, thunder, the
    // explosion boom, the rain bed, ...) before this new roll's own
    // sounds start, so a grinding player spamming Roll Again never hears
    // two rolls' worth of audio overlapping.
    stopAllSounds()
    playSound('/sounds/roll-click.mp3')
    setResult(null)
    setShowConfetti(false)
    setShowFlashText(false)
    setShowMythicOverlay(false)
    setShowEpicFlash(false)

    // The outcome is decided up front now, not after a fixed delay - the
    // cylinder needs to know the winner before it starts spinning so it
    // can place it on the reel and actually land there. pendingOutcome is
    // set BEFORE showCylinder flips to true, so when SlotMachineLane
    // (re)mounts a moment later it already has a real target and spins
    // immediately - no idle flash in between. SlotMachineLane reads
    // accessibilitySettings.reduceMotion itself and skips straight to the
    // landed state instead of a real spin when it's on.
    const outcome = rollForCareer(getRollContext())
    setPendingOutcome(outcome)
    setShowCylinder(true)
    setRollId((id) => id + 1)
    setIsSpinning(true)
  }

  const handleSpinComplete = () => {
    if (pendingOutcome) finishRoll(pendingOutcome)
  }

  const dismiss = () => {
    // "when they click out all sound is cut immediately" - same reasoning
    // as handleRoll's own call to this: closing a card mid-sound (a
    // stinger still ringing, etc.) shouldn't let it keep playing once the
    // card itself is gone.
    stopAllSounds()
    setResult(null)
    setShowConfetti(false)
    setShowFlashText(false)
    setShowMythicOverlay(false)
    setShowEpicFlash(false)
    // Back to the idle cylinder (no target - see SlotMachineLane, this
    // renders the static decorative display rather than spinning) rather
    // than a bare Roll button, same as the very first page load.
    setShowCylinder(true)
  }

  const tierStyle = result ? getTierStyle(result.tier) : null

  // Escape discards; Space/Enter rolls (or rolls again if a card's open).
  // Suppressed when focus already sits on some other interactive element
  // (it handles its own Enter/Space natively - firing this too would
  // double-trigger it). Escape is a no-op for Mythic/Celestial/Legendary
  // specifically - same reasoning as their cards dropping their close
  // buttons (see MythicRevealCard.tsx/CelestialRevealCard.tsx/
  // LegendaryRevealCard.tsx) - a stray Escape shouldn't be able to lose or
  // cut short a pull that rare.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const active = document.activeElement
      const focusIsElsewhere = active instanceof HTMLElement && active !== document.body && active.matches('button, a, input, textarea, select, [tabindex]')
      if (event.key === 'Escape') {
        if (result && result.tier !== 'mythic' && result.tier !== 'celestial' && result.tier !== 'legendary') {
          event.preventDefault()
          dismiss()
        }
        return
      }
      if (focusIsElsewhere) return
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault()
        handleRoll()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [result, isSpinning])

  // Button's entrance/exit stays the simple fade+scale from earlier chunks.
  const resultMotionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' as const } },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2, ease: 'easeOut' as const } },
      }

  // The result card gets a punchier "pop" - spring overshoot (bounce)
  // scaling up from half-size with a slight rotation settling to 0,
  // 600-800ms per the brief. Exit stays a quick, un-bouncy fade+shrink -
  // the overshoot is for arriving with impact, not leaving.
  const cardEntranceMotionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.5, rotate: -5 },
        animate: { opacity: 1, scale: 1, rotate: 0, transition: { type: 'spring' as const, bounce: 0.45, duration: 0.7 } },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2, ease: 'easeOut' as const } },
      }

  return (
    // Fragment, not a single root div: the Back button needs to sit in the
    // NORMAL (non-full-bleed) `mx-auto max-w-5xl` column every route renders
    // inside (see MobileContainer.tsx) - the same column the shared header
    // (App.tsx)'s logo sits in - so its left edge lines up with the logo's.
    // It used to be nested inside the full-bleed div below instead, whose
    // own independent px-4 padding (relative to the true viewport edge, not
    // this centered column) put it ~190px further left than the logo at
    // wide viewports - confirmed via real rendered getBoundingClientRect()
    // on both, not eyeballed. (A same-row vertical pull via negative margin
    // was tried too, but it visually collided with the logo/nav row itself
    // - a few px lower, left-aligned with it, reads as "belongs to the
    // header" without literally overlapping it.)
    <>
      {/* dark-mode: same "game mode" scoping trick as the header (App.tsx) -
          BackButton had no dark: variant of its own to begin with (fixed:
          it does now), and even with one, this div sat outside any
          .dark-mode ancestor, so nothing here was picking it up regardless
          of the site's real toggle - confirmed via a real rendered
          screenshot showing near-invisible dark-on-dark text, not
          eyeballed. */}
      <div className="dark-mode px-4 pt-3 sm:px-6">
        <BackButton to="/job-market" label="Job Market" />
      </div>

      {/* left-1/2 w-screen -translate-x-1/2 is the standard full-bleed
          breakout: every route in this app renders inside a shared
          `mx-auto max-w-5xl` wrapper, which would otherwise confine this
          page to that column instead of the true viewport edge-to-edge width.

          dark-mode: Roll a Job is a fixed "game mode" dark page now,
          regardless of the site's own light/dark toggle (see the matching
          comment on the header in App.tsx) - this activates every dark:
          utility already written throughout this page's children
          (RollResultCard, RollStatsPanel, FloatingJobBackground, ...) so
          they render their dark look unconditionally here, without needing
          a second literal-class copy of each.

          bg-[radial-gradient(...)]: a focused vignette rather than a flat
          fill - indigo glowing out from center fading through slate to
          black at the edges - reads as "arcade cabinet spotlight" rather
          than just a dark rectangle, and naturally draws the eye toward the
          cylinder sitting at that same center point.

          initial/animate opacity: the page fades in from transparent (over
          the app's normal light chrome peeking through for an instant) to
          this full dark scene over 300ms on arrival, rather than snapping
          straight to it - no exit animation (leaving this route just swaps
          instantly back), since animating an EXIT would need this page's
          route wrapped in its own AnimatePresence at the router level,
          which every other route would also start participating in. */}
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } }}
        // No background here anymore - MobileContainer.tsx's own
        // forceDarkBg gradient (bg-fixed, viewport-anchored) already
        // paints this exact same gradient behind everything, header
        // included. This div CAN'T reliably paint its own bg-fixed copy on
        // top of that and have the two align: -translate-x-1/2 just below
        // is a `transform`, and per the CSS spec, `background-attachment:
        // fixed` reverts to normal scroll/element-anchored behavior on any
        // element that has its own transform - confirmed via a real
        // rendered screenshot showing a hard seam right at this div's own
        // top edge, not eyeballed. Leaving this transparent and relying
        // entirely on the one correctly-fixed layer underneath is what
        // actually gets a seamless result, not two competing gradients.
        className="dark-mode relative left-1/2 w-screen min-h-screen -translate-x-1/2 flex flex-col overflow-hidden"
      >
      <FloatingJobBackground dimmed={isSpinning || result !== null} />
      {!reduceMotion ? <FloatingRollEmbers /> : null}

      {/* z-[6]: below the page content (z-10) that holds the lane/card,
          above the plain background - darkens/spotlights the scene behind
          the card without ever covering it. The vignette shows for any
          result; the mythic full darken is additional, rarer drama
          layered on top of it, not a replacement for it. Deeper than the
          old 0.16 peak (a "reward reveal" wants the surroundings to
          properly recede, not just a light shade) - 0.6 at the edges,
          center left lighter since the glowing card itself sits there. */}
      {result ? (
        <div
          className="pointer-events-none absolute inset-0 z-[6] transition-opacity duration-500"
          style={{ background: 'radial-gradient(circle at 50% 45%, rgba(0,0,0,0.25), rgba(0,0,0,0.6) 100%)' }}
          aria-hidden="true"
        />
      ) : null}
      {showMythicOverlay ? (
        <div className="mythic-screen-darken pointer-events-none fixed inset-0 z-[5] bg-black" aria-hidden="true" />
      ) : null}
      {/* Epic+ (Epic/Legendary/Mythic) camera-flash - brief and additive,
          distinct from the sustained Mythic-only darken above. */}
      {showEpicFlash ? (
        <div className="epic-screen-flash pointer-events-none fixed inset-0 z-[8] bg-white" aria-hidden="true" />
      ) : null}

      <div
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-16"
        // Dismiss the result by clicking anywhere in this empty surrounding
        // area - RollResultCard stops propagation on its own click, so this
        // only fires for genuine "outside" clicks.
        onClick={() => {
          if (result) dismiss()
        }}
      >
        <AnimatePresence>
          {showFlashText && result && tierStyle?.flashText ? (
            <motion.p
              key="flash-text"
              initial={{ opacity: 0, y: 12, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`mb-3 font-extrabold tracking-wide drop-shadow-sm ${tierStyle.flashTextClass} ${
                result.tier === 'mythic' ? 'text-3xl sm:text-4xl' : 'text-xl sm:text-2xl'
              }`}
            >
              {tierStyle.flashText}
            </motion.p>
          ) : null}
        </AnimatePresence>

        {/* "Above the cylinder" decoration - only while the cylinder itself
            is showing (idle or spinning), gone the instant a result lands
            alongside it. */}
        {showCylinder ? (
          <div className="mb-3 flex flex-col items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200/70">🎲 Roll for a random career</p>
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />
          </div>
        ) : null}

        {/* Cylinder only exists in the DOM for "idle, before a roll" and
            "actively spinning" - the instant a result lands, showCylinder
            goes false and this fades out (300ms) rather than staying
            visible, leaving only the result card. AnimatePresence handles
            the "remove from the DOM once the fade finishes" cleanup itself -
            no manual display:none/setTimeout needed. pointer-events-none
            throughout since nothing on the cylinder is ever meant to be
            clickable anyway (belt-and-braces for while it's fading out). */}
        <AnimatePresence>
          {showCylinder ? (
            <motion.div
              key="cylinder"
              initial={reduceMotion ? undefined : { opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } }}
              exit={reduceMotion ? undefined : { opacity: 0, transition: { duration: 0.35, ease: 'easeOut' } }}
              className="pointer-events-none relative"
            >
              {/* Ambient glow behind the cylinder - two layered, very subtle
                  blurred circles (large indigo, smaller teal/accent),
                  rendered BEFORE the cylinder in DOM order rather than via
                  negative z-index so they reliably paint behind it without
                  depending on this div forming its own stacking context
                  (same reasoning FloatingJobBackground.tsx uses for its own
                  layer). animate-pulse is Tailwind's built-in breathing
                  opacity animation - already covered by the app's global
                  reduce-motion CSS rules, no extra guard needed here. */}
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl animate-pulse"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-2xl animate-pulse"
                style={{ animationDelay: '1.1s' }}
                aria-hidden="true"
              />

              <SlotMachineLane
                target={
                  pendingOutcome
                    ? { title: pendingOutcome.career.title, tier: pendingOutcome.tier, category: pendingOutcome.career.category }
                    : null
                }
                spinToken={rollId}
                onSpinComplete={handleSpinComplete}
              />

              {/* Stage/platform - a faint floor ring the cylinder sits just
                  above, so it reads as standing on a surface rather than
                  floating in empty space. Positioned at the cylinder's own
                  footprint bottom (matches SlotMachineLane's stage height:
                  h-[280px]/sm:h-[320px]), not the whole animated wrapper's
                  bounds (which also includes the glow circles above). */}
              <div
                className="pointer-events-none absolute left-1/2 top-[276px] h-16 w-64 -translate-x-1/2 rounded-[100%] border-2 border-indigo-500/20 bg-indigo-500/5 blur-[2px] sm:top-[316px]"
                aria-hidden="true"
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {result ? (
            <motion.div key="result" {...cardEntranceMotionProps} className="mt-6 w-full max-w-md px-4 sm:px-0">
              {/* key={rollId} on every branch below - without it, two
                  consecutive rolls landing the SAME tier (very much what
                  a player grinding for Mythic/Celestial is doing) render
                  the same component type in the same tree position, so
                  React treats the second one as a PROP UPDATE to the
                  first instance rather than a fresh mount. For
                  Mythic/Celestial/Legendary specifically, that meant
                  their own internal `phase` state (already sitting at
                  'revealed' from the previous pull) never reset, so the
                  entire intro/floating/exploding cutscene silently got
                  skipped on the very next matching roll - "the next roll
                  shouldn't be skipped". rollId already exists and bumps
                  once per handleRoll() call, so it's a ready-made value
                  that's guaranteed to differ between any two rolls,
                  same-tier repeat or not. */}
              {result.tier === 'celestial' ? (
                <CelestialRevealCard key={rollId} career={result.career} onRollAgain={handleRoll} />
              ) : result.tier === 'mythic' ? (
                <MythicRevealCard key={rollId} career={result.career} onRollAgain={handleRoll} />
              ) : result.tier === 'legendary' ? (
                <LegendaryRevealCard key={rollId} career={result.career} onRollAgain={handleRoll} />
              ) : (
                <RollResultCard
                  key={rollId}
                  career={result.career}
                  tier={result.tier}
                  onDismiss={dismiss}
                  onRollAgain={handleRoll}
                />
              )}
            </motion.div>
          ) : (
            <motion.div key="controls" {...resultMotionProps} className="mt-6 flex w-full flex-col items-center gap-6 px-4 sm:px-0">
              <button
                type="button"
                onClick={handleRoll}
                disabled={isSpinning}
                aria-label="Roll for a random career"
                // Hidden (not unmounted) while spinning - opacity-0 +
                // pointer-events-none keeps its layout space reserved so
                // nothing else jumps around when it disappears/reappears,
                // and stops it being clicked (or tabbed to) mid-spin.
                // roll-button: idle breathing glow (index.css). tier-shimmer:
                // reuses the same diagonal light-sweep effect Epic+ result
                // cards get (index.css, previously unused as a standalone
                // class) - overflow-hidden on that class combined with
                // rounded-full here clips the sweep to the circle correctly.
                className={`roll-button tier-shimmer flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white ring-4 ring-indigo-500/30 transition-all duration-200 hover:scale-110 hover:ring-8 hover:ring-purple-500/40 active:scale-95 disabled:hover:scale-100 disabled:hover:ring-4 sm:h-32 sm:w-32 ${
                  isSpinning ? 'pointer-events-none opacity-0' : 'opacity-100'
                }`}
              >
                <span className="relative z-10 flex flex-col items-center gap-1">
                  <Dices className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
                  <span className="text-2xl font-black tracking-wider sm:text-3xl">ROLL!</span>
                </span>
              </button>

              {!hasSeenRollTutorial && !isSpinning ? <RollTutorialTooltip onDismiss={dismissTutorial} /> : null}
            </motion.div>
          )}
        </AnimatePresence>

        <RollStatsPanel />
      </div>

      {showConfetti && tierStyle && !reduceMotion ? (
        // "Reward reveal" gets MORE confetti than the plain per-tier count
        // used to give - 1.5x, still tier-scaled and still halved on mobile
        // (same reasoning as before: cramped viewport, more particles read
        // as clutter rather than celebration there).
        <ConfettiBurst
          colors={tierStyle.confettiColors}
          count={Math.round(tierStyle.confettiCount * 1.5 * (isMobile ? 0.6 : 1))}
          durationMs={tierStyle.confettiDurationMs}
        />
      ) : null}
      </motion.div>
    </>
  )
}
