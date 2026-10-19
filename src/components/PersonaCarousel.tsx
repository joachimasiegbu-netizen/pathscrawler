import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePathStore } from '../store/usePathStore'
import { playSound } from '../utils/sound'
import PersonaCard, { type PersonaDef } from './PersonaCard'

// Matches personaSparkle's own 0.6s duration (index.css) plus a small
// margin, so the burst always finishes playing before navigation cuts it
// off.
const CONFIRM_DELAY_MS = 650
/** Angle between neighbouring personas around the curve. */
const ARC_STEP_DEG = 32
const ARC_STEP_RAD = (ARC_STEP_DEG * Math.PI) / 180
/** 1 bends the ends of the arc toward the viewer, like a curved TV - the
 * explicit request. -1 flips it into a convex drum (ends curving away)
 * with no other change. */
const CURVE = 1
const PERSPECTIVE_PX = 1400
// Spring for the ring's rotation - slightly under-damped, so a turn lands
// with a hint of physical overshoot instead of a CSS-curve stop.
const SPRING_STIFFNESS = 90
const SPRING_DAMPING = 15
/** Movement below this is a tap (confirm/select), not a drag. */
const DRAG_THRESHOLD_PX = 6
/** How far a flick carries past the release point, in seconds of velocity. */
const FLICK_SECONDS = 0.18

function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

/** Signed distance from the ring's position `pos` to item `index`, around a
 * ring of `count` - in [-count/2, count/2), and fractional mid-rotation. An
 * item crossing that wrap point jumps to the opposite end of the arc, which
 * is why opacity reaches 0 right at |offset| = count/2 (see arcStyle): it
 * leaves past one edge and comes back round from the other side. */
function ringOffset(index: number, pos: number, count: number): number {
  let offset = mod(index - pos, count)
  if (offset >= count / 2) offset -= count
  return offset
}

/** Half the width a neighbour card actually covers on screen - measured off
 * the live layout rather than derived, since the arc has already scaled it
 * to 0.88 and turned it 32deg away by the time it reaches the edge. */
const NEIGHBOUR_HALF_PX = 80
/** How much of the next card a phone shows. Enough to say "there is another
 * one behind this", small enough that no glyph of its tagline can reach the
 * screen edge. The earlier width * 0.62 showed ~35px, which landed
 * mid-tagline: both edges carried a few legible letters ("ining.", "Nam")
 * that read as a rendering fault rather than as a card behind this one. */
const PHONE_PEEK_PX = 14

/** Lateral distance between neighbours. Wide screens spread the personas
 * across the page so each gets its own space. Phones solve for the peek
 * instead of scaling with the viewport: a proportional spacing gave 17px of
 * next-card on a 360px phone and 1px on a 430px one, so the affordance
 * quietly disappeared on exactly the handsets with room for it. */
function spacingFor(width: number): number {
  if (width < 640) return width / 2 + NEIGHBOUR_HALF_PX - PHONE_PEEK_PX
  return Math.min(520, Math.max(280, width * 0.28))
}

/** Where an item sits on the curve at `offset` places from centre. The arc
 * is a circle of whatever radius puts the first neighbour `spacing` px out,
 * and every item is turned to face its axis - so the motion between any
 * two places runs along the curve rather than cutting straight across it. */
function arcStyle(offset: number, spacing: number, compact: boolean) {
  const d = Math.abs(offset)
  const radius = spacing / Math.sin(ARC_STEP_RAD)
  const theta = offset * ARC_STEP_RAD
  const x = radius * Math.sin(theta)
  const z = CURVE * radius * (1 - Math.cos(theta))
  const rotate = -CURVE * offset * ARC_STEP_DEG
  // Spotlight: the centred persona is slightly larger, fully lit and sharp;
  // the rest step back into a softer, desaturated half-light.
  const scale = d < 1 ? 1.04 - 0.16 * d : 0.88
  // A phone shows a sliver of the next card right at the screen edge, where
  // a desktop shows most of it against open page. The same half-light that
  // reads as depth on a wide screen reads as a smeared caption on a narrow
  // one, so the compact falloff is far steeper: by the time a card reaches
  // the edge it is a 22%-opacity haze, not a dimmed card.
  const near = compact ? 0.22 : 0.55
  const mid = compact ? 0.08 : 0.2
  const opacity =
    d <= 1 ? 1 - (1 - near) * d : d <= 2 ? near - (near - mid) * (d - 1) : Math.max(0, 2 * mid * (2.5 - d))
  return {
    transform: `translate3d(${x}px, 0, ${z}px) rotateY(${rotate}deg) scale(${scale})`,
    opacity,
    filter:
      d < 0.02
        ? 'none'
        : `blur(${Math.min(d, 2) * (compact ? 2.2 : 0.9)}px) saturate(${1 - 0.5 * Math.min(d, 1)})`,
  }
}

/** Full-width curved carousel for "What best describes you?". The centred
 * persona confirms on click/Enter; side personas rotate to the centre on
 * click; arrow buttons, keyboard left/right, dots, and drag/flick all turn
 * the ring.
 *
 * Positions are written straight to each item's style from one rAF spring,
 * not through React state - re-rendering the cube/globe/tree/board 60 times
 * a second would be far heavier than five transform writes. React state
 * only tracks which persona the ring is heading for. */
export default function PersonaCarousel({ personas, onConfirm }: { personas: PersonaDef[]; onConfirm: (id: string) => void }) {
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const reduceMotionRef = useRef(reduceMotion)
  reduceMotionRef.current = reduceMotion
  const [activeIndex, setActiveIndex] = useState(0)
  // Set to a persona id for a brief moment on confirm so the sparkle burst
  // is seen before navigating. Skipped under reduceMotion.
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  const count = personas.length
  const stageRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const glowRefs = useRef<(HTMLDivElement | null)[]>([])
  /** Where the ring is right now - fractional mid-rotation, and unbounded
   * (it keeps counting past the last persona rather than wrapping), so a
   * turn always goes the short way round. */
  const posRef = useRef(0)
  /** Where the ring is heading - always a whole number. */
  const targetRef = useRef(0)
  const velocityRef = useRef(0)
  const spacingRef = useRef(300)
  /** Phone-width layout. Measured alongside the spacing rather than from a
   * media query so the two can never disagree about which layout is live. */
  const compactRef = useRef(false)
  const rafRef = useRef(0)
  const lastFrameRef = useRef(0)
  // True for one click right after a drag, so releasing over a persona
  // doesn't also select it. Reset at the start of every new press.
  const suppressNextClickRef = useRef(false)

  const layout = () => {
    const pos = posRef.current
    for (let i = 0; i < count; i++) {
      const offset = ringOffset(i, pos, count)
      const d = Math.abs(offset)
      const item = itemRefs.current[i]
      if (item) {
        const s = arcStyle(offset, spacingRef.current, compactRef.current)
        item.style.transform = s.transform
        item.style.opacity = String(s.opacity)
        item.style.filter = s.filter
        item.style.zIndex = String(100 - Math.round(d * 10))
        item.style.visibility = s.opacity < 0.01 ? 'hidden' : 'visible'
        item.style.pointerEvents = d < 1.5 ? 'auto' : 'none'
      }
      // The spotlight takes on the colour of whichever persona is under it,
      // cross-fading as the ring turns.
      const glow = glowRefs.current[i]
      if (glow) glow.style.opacity = String(Math.max(0, 1 - d))
    }
  }

  const tick = (now: number) => {
    const dt = Math.min(0.05, (now - lastFrameRef.current) / 1000)
    lastFrameRef.current = now
    const displacement = posRef.current - targetRef.current
    velocityRef.current += (-SPRING_STIFFNESS * displacement - SPRING_DAMPING * velocityRef.current) * dt
    posRef.current += velocityRef.current * dt
    if (Math.abs(posRef.current - targetRef.current) < 0.0005 && Math.abs(velocityRef.current) < 0.005) {
      posRef.current = targetRef.current
      velocityRef.current = 0
      rafRef.current = 0
      layout()
      return
    }
    layout()
    rafRef.current = requestAnimationFrame(tick)
  }

  const startSpring = () => {
    if (reduceMotionRef.current) {
      posRef.current = targetRef.current
      velocityRef.current = 0
      layout()
      return
    }
    if (rafRef.current) return
    lastFrameRef.current = performance.now()
    rafRef.current = requestAnimationFrame(tick)
  }

  const stopSpring = () => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = 0
  }

  const goTo = (target: number) => {
    const changed = mod(target, count) !== mod(targetRef.current, count)
    targetRef.current = target
    setActiveIndex(mod(target, count))
    if (changed) playSound('/sounds/roll-click.mp3', undefined, 0.5)
    startSpring()
  }

  /** The short way round from wherever the ring is heading to persona `index`. */
  const goToIndex = (index: number) => goTo(targetRef.current + Math.round(ringOffset(index, targetRef.current, count)))

  const handleConfirm = (id: string) => {
    if (reduceMotion) {
      onConfirm(id)
      return
    }
    setConfirmingId(id)
    window.setTimeout(() => onConfirm(id), CONFIRM_DELAY_MS)
  }

  // Window listeners for the drag rather than setPointerCapture - capture
  // retargets the synthesized click to the capturing element, which used to
  // silently eat every click on the personas, arrows, and dots.
  const handlePointerDown = (event: React.PointerEvent) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    suppressNextClickRef.current = false
    const originTarget = targetRef.current
    const startX = event.clientX
    let startPos = posRef.current
    let dragging = false
    const samples: { t: number; x: number }[] = [{ t: event.timeStamp, x: startX }]

    const onMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX
      if (!dragging) {
        if (Math.abs(dx) < DRAG_THRESHOLD_PX) return
        // Grabbing the ring mid-turn catches it where it is.
        dragging = true
        stopSpring()
        startPos = posRef.current + DRAG_THRESHOLD_PX * Math.sign(dx) / spacingRef.current
      }
      posRef.current = startPos - dx / spacingRef.current
      samples.push({ t: moveEvent.timeStamp, x: moveEvent.clientX })
      while (samples.length > 2 && moveEvent.timeStamp - samples[0].t > 100) samples.shift()
      layout()
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      if (!dragging) return
      suppressNextClickRef.current = true
      const first = samples[0]
      const last = samples[samples.length - 1]
      const seconds = (last.t - first.t) / 1000
      const velocity = seconds > 0 ? -(last.x - first.x) / seconds / spacingRef.current : 0
      velocityRef.current = Math.max(-8, Math.min(8, velocity))
      let target = Math.round(posRef.current + velocityRef.current * FLICK_SECONDS)
      // A deliberate quarter-turn is enough to move on - without this a slow
      // drag on a phone has to cover half the screen before it commits.
      const turned = posRef.current - originTarget
      if (target === originTarget && Math.abs(turned) > 0.25) target += Math.sign(turned)
      goTo(target)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
  }

  /** Wraps every persona/arrow/dot click - swallows exactly the one click
   * immediately following a drag. */
  const guardedClick = (fn: () => void) => () => {
    if (suppressNextClickRef.current) {
      suppressNextClickRef.current = false
      return
    }
    fn()
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goTo(targetRef.current - 1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      goTo(targetRef.current + 1)
    }
  }

  // Before first paint, and again whenever the page width changes, so the
  // spacing always fits the screen it's on.
  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const measure = () => {
      spacingRef.current = spacingFor(stage.clientWidth)
      compactRef.current = stage.clientWidth < 640
      layout()
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stage)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  return (
    <div className="relative flex w-full select-none flex-col items-center py-1 sm:py-6" onKeyDown={handleKeyDown}>
      {/* Full page width. overflow-hidden keeps personas travelling past the
          edges from widening the page; the mask fades them out as they go,
          so they read as turning away round the curve rather than being
          cut off by the screen. */}
      <div
        ref={stageRef}
        // 330 on a phone, not 380: the card itself is 288 tall, so the extra
        // 92px was pure air above and below the object. Trimming it closes
        // the gap to the subtitle above and to the arrows below without
        // touching the card, which still clears its own float and the 1.04
        // centre scale (300px at its tallest).
        className="relative h-[330px] w-full overflow-hidden sm:h-[420px]"
        style={{
          perspective: `${PERSPECTIVE_PX}px`,
          touchAction: 'pan-y',
          maskImage: 'linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)',
        }}
        onPointerDown={handlePointerDown}
      >
        {/* Spotlight - fixed at centre stage, one layer per persona so its
            colour follows whoever is standing in it. */}
        {personas.map((persona, i) => (
          <div
            key={`spot-${persona.id}`}
            ref={(el) => {
              glowRefs.current[i] = el
            }}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            {/* Beam. The blur sits on the outer element so it softens the
                clipped cone's edges - on the same element, clip-path would
                cut the blur back to a hard edge. */}
            <div
              className="absolute left-1/2 top-0 w-[420px] -translate-x-1/2"
              style={{ height: 'calc(50% + 150px)', filter: 'blur(10px)' }}
            >
              <div
                className="h-full w-full"
                style={{
                  clipPath: 'polygon(43% 0, 57% 0, 84% 100%, 16% 100%)',
                  background: `linear-gradient(180deg, ${persona.accent}00, ${persona.accent}1a)`,
                  maskImage: 'linear-gradient(180deg, #000 70%, transparent)',
                  WebkitMaskImage: 'linear-gradient(180deg, #000 70%, transparent)',
                }}
              />
            </div>
            <div
              className="absolute left-1/2 top-1/2 h-[420px] w-[540px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: `radial-gradient(closest-side, ${persona.accent}26, ${persona.accent}0d 55%, transparent)` }}
            />
            <div
              className="absolute left-1/2 top-1/2 h-16 w-[340px] -translate-x-1/2 translate-y-[118px] rounded-full sm:translate-y-[134px]"
              style={{ background: `radial-gradient(closest-side, ${persona.accent}33, transparent)` }}
            />
          </div>
        ))}

        {personas.map((persona, i) => {
          const active = i === activeIndex
          return (
            // Zero-size anchor at stage centre - arcStyle's transform moves
            // and turns it, and the persona centres itself on it.
            <div
              key={persona.id}
              ref={(el) => {
                itemRefs.current[i] = el
              }}
              className="absolute left-1/2 top-1/2 h-0 w-0"
              style={{ willChange: 'transform, opacity, filter' }}
            >
              <PersonaCard
                persona={persona}
                active={active}
                reduceMotion={reduceMotion}
                floatVariant={i % 2 === 0 ? 'a' : 'b'}
                sparkling={confirmingId === persona.id}
                onClick={guardedClick(() => (active ? handleConfirm(persona.id) : goToIndex(i)))}
                style={{ transform: 'translate(-50%, -50%)' }}
              />
            </div>
          )
        })}
      </div>

      <div className="mt-3 flex items-center gap-6 sm:mt-6">
        <button
          type="button"
          onClick={guardedClick(() => goTo(targetRef.current - 1))}
          aria-label="Previous persona"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#6366f1]/40 hover:text-[#6366f1]"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        {/* Each tab is a 44px-tall tap area around its visible dot (the
            header's own h-11 touch-target convention) - free vertically,
            since the arrows either side already set this row's height, so
            nothing moves. The 3px side padding stays: it keeps the same 6px
            visual gap the dots had before, and five 44px-WIDE tabs plus the
            two arrows and their gap-6 would need ~356px, i.e. wider than a
            360px phone's content column. */}
        <div className="flex" role="tablist" aria-label="Persona indicator">
          {personas.map((persona, i) => (
            <button
              key={persona.id}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={persona.label}
              onClick={guardedClick(() => goToIndex(i))}
              className="flex h-11 items-center px-[3px]"
            >
              <span
                className="block h-1.5 rounded-full transition-all"
                style={{
                  width: i === activeIndex ? '20px' : '6px',
                  backgroundColor: i === activeIndex ? persona.accent : 'rgba(15,23,42,0.15)',
                }}
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={guardedClick(() => goTo(targetRef.current + 1))}
          aria-label="Next persona"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#6366f1]/40 hover:text-[#6366f1]"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
