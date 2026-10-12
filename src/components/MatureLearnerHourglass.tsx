import { useEffect, useRef } from 'react'
import { usePathStore } from '../store/usePathStore'

/**
 * The Mature Learner persona's visual on RoleSelectionPage.tsx - the way
 * StudentPersonaCube.tsx is Student's, CareerChangerSplitFlap.tsx is Career
 * Changer's, StudentHubPersonaEarth.tsx is Student Hub's and
 * KnowGoalPersonaTree.tsx is I Know My Goal's. Mature Learner was the last
 * persona still drawing its plain Lucide icon.
 *
 * An hourglass that drains, turns over, and drains again - the persona in one
 * gesture ("returning to study or training": the time didn't run out, it got
 * turned over). Built rather than ported; there is no specimen for this one
 * in the persona artifact.
 *
 * SVG with a rAF loop mutating attributes, rather than CareerChangerSplitFlap's
 * build-the-DOM-by-hand approach, because the structure here is static - only
 * a handful of numbers move, so JSX states the shape once and the loop writes
 * y/height/points straight onto nodes it holds refs to.
 *
 * No focusable children: this renders INSIDE PersonaCard.tsx's own <button>,
 * where a nested tabindex would be invalid markup and would fight the
 * carousel's arrow-key handling. Pointer hover only (drains fast), exactly
 * like the cube's faces and the split-flap's board.
 */

/* The glass, on the same 0 0 250 250 grid the other persona visuals use.
   Chamber height and the neck line are the two that matter: the sand rects
   are anchored to NECK_Y and BOT_Y and sized off CH, so every frame is
   derived from one 0..1 progress value rather than tracked separately. */
const CX = 125
const GLASS_L = 64
const GLASS_R = 186
const TOP_Y = 40
const NECK_Y = 125
const BOT_Y = 210
const CH = NECK_Y - TOP_Y
const GLASS_W = GLASS_R - GLASS_L

const DRAIN = 7000
const DRAIN_HOVER = 2600
const HOLD = 550
const FLIP = 760
const GRAINS = 11

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

interface Grain {
  y: number
  x: number
  v: number
}

export default function MatureLearnerHourglass({ className }: { className?: string }) {
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const stageRef = useRef<HTMLDivElement>(null)
  const spinRef = useRef<SVGGElement>(null)
  const topSandRef = useRef<SVGRectElement>(null)
  const botSandRef = useRef<SVGRectElement>(null)
  const coneRef = useRef<SVGPolygonElement>(null)
  const streamRef = useRef<SVGRectElement>(null)
  const grainRefs = useRef<(SVGCircleElement | null)[]>([])
  const hoverRef = useRef(false)

  useEffect(() => {
    const osReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const still = reduceMotion || osReduce

    // One function for every frame AND for the static reduced-motion pose, so
    // the still version can't drift from what the animation actually draws.
    const paint = (p: number, flowing: boolean) => {
      const topH = (1 - p) * CH
      const botH = p * CH
      const pileTop = BOT_Y - botH
      topSandRef.current?.setAttribute('y', String(NECK_Y - topH))
      topSandRef.current?.setAttribute('height', String(Math.max(0, topH)))
      botSandRef.current?.setAttribute('y', String(pileTop))
      botSandRef.current?.setAttribute('height', String(Math.max(0, botH)))
      // The mound on the pile, biggest mid-drain and gone by the end - a real
      // pile's cone does get buried as the chamber fills, and landing exactly
      // at 0 is what the flip below depends on.
      const coneH = 15 * Math.sin(Math.PI * p)
      coneRef.current?.setAttribute(
        'points',
        `${CX},${pileTop - coneH} ${CX + 31},${pileTop + 1} ${CX - 31},${pileTop + 1}`,
      )
      const stream = streamRef.current
      if (stream) {
        stream.setAttribute('y', String(NECK_Y))
        stream.setAttribute('height', String(Math.max(0, pileTop - NECK_Y)))
        stream.setAttribute('opacity', flowing ? String(Math.min(1, (1 - p) * 8)) : '0')
      }
    }

    // Reduced motion: a composed mid-drain pose, not a frozen frame of the
    // loop - no stream, no grains, no turn.
    if (still) {
      paint(0.45, false)
      grainRefs.current.forEach((g) => g?.setAttribute('opacity', '0'))
      return
    }

    const grains: Grain[] = Array.from({ length: GRAINS }, () => ({
      y: NECK_Y + Math.random() * (BOT_Y - NECK_Y),
      x: CX + (Math.random() * 5 - 2.5),
      v: 0.22 + Math.random() * 0.12,
    }))

    let phase: 'drain' | 'hold' | 'flip' = 'drain'
    let p = 0
    let acc = 0
    let angle = 0
    let baseAngle = 0
    let raf = 0
    let last = 0

    const frame = (now: number) => {
      const dt = last ? Math.min(50, now - last) : 16
      last = now

      if (phase === 'drain') {
        p += dt / (hoverRef.current ? DRAIN_HOVER : DRAIN)
        if (p >= 1) {
          p = 1
          phase = 'hold'
          acc = 0
        }
      } else if (phase === 'hold') {
        acc += dt
        if (acc >= HOLD) {
          phase = 'flip'
          acc = 0
          baseAngle = angle
        }
      } else {
        acc += dt
        const t = Math.min(1, acc / FLIP)
        angle = baseAngle + 180 * easeInOutCubic(t)
        if (t >= 1) {
          // The swap is invisible, which is the whole reason the turn works
          // without a crossfade: at p=1 the lower chamber is completely full
          // and the upper one empty, and a 180deg rotation maps one chamber
          // exactly onto the other - so "full at the bottom, rotated" and
          // "full at the top, reset" are the same picture. The cone being 0
          // at p=1 (above) is what keeps that true.
          angle = baseAngle + 180
          p = 0
          phase = 'drain'
        }
      }

      spinRef.current?.setAttribute('transform', `rotate(${angle} ${CX} ${CX})`)
      const flowing = phase === 'drain'
      paint(p, flowing)

      const pileTop = BOT_Y - p * CH
      grains.forEach((g, i) => {
        const el = grainRefs.current[i]
        if (!el) return
        if (!flowing) {
          el.setAttribute('opacity', '0')
          return
        }
        g.y += g.v * dt
        if (g.y >= pileTop) {
          g.y = NECK_Y
          g.x = CX + (Math.random() * 5 - 2.5)
        }
        el.setAttribute('cx', String(g.x))
        el.setAttribute('cy', String(g.y))
        el.setAttribute('opacity', '0.85')
      })

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => cancelAnimationFrame(raf)
  }, [reduceMotion])

  return (
    <div
      ref={stageRef}
      className={`mature-glass-stage ${className ?? ''}`}
      data-reduce-motion={reduceMotion ? 'true' : undefined}
      // Hover drains fast, the way the split-flap riffles fast. Kept on a ref
      // + a data attribute instead of state: the loop reads it every frame and
      // the warmth below is pure CSS, so a re-render would buy nothing.
      onPointerEnter={() => {
        hoverRef.current = true
        stageRef.current?.setAttribute('data-hover', 'true')
      }}
      onPointerLeave={() => {
        hoverRef.current = false
        stageRef.current?.removeAttribute('data-hover')
      }}
    >
      <div className="mature-glass-warmth" />
      <svg className="mature-glass-svg" viewBox="0 0 250 250" aria-hidden="true">
        <defs>
          <linearGradient id="matureSand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fdba74" />
            <stop offset="1" stopColor="#f97316" />
          </linearGradient>
          <linearGradient id="matureWood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a1703f" />
            <stop offset="1" stopColor="#7c5024" />
          </linearGradient>
          {/* The two chambers do all the shaping: the sand is plain rects and
              these clips give them their taper, so a "level" is one number. */}
          <clipPath id="matureTopChamber">
            <polygon points={`${GLASS_L},${TOP_Y} ${GLASS_R},${TOP_Y} ${CX + 6},${NECK_Y} ${CX - 6},${NECK_Y}`} />
          </clipPath>
          <clipPath id="matureBotChamber">
            <polygon points={`${CX - 6},${NECK_Y} ${CX + 6},${NECK_Y} ${GLASS_R},${BOT_Y} ${GLASS_L},${BOT_Y}`} />
          </clipPath>
        </defs>

        <g ref={spinRef} transform={`rotate(0 ${CX} ${CX})`}>
          <polygon
            className="mature-glass-chamber"
            points={`${GLASS_L},${TOP_Y} ${GLASS_R},${TOP_Y} ${CX + 6},${NECK_Y} ${CX - 6},${NECK_Y}`}
          />
          <polygon
            className="mature-glass-chamber"
            points={`${CX - 6},${NECK_Y} ${CX + 6},${NECK_Y} ${GLASS_R},${BOT_Y} ${GLASS_L},${BOT_Y}`}
          />

          <g clipPath="url(#matureTopChamber)">
            <rect ref={topSandRef} x={GLASS_L} width={GLASS_W} y={TOP_Y} height={CH} fill="url(#matureSand)" />
          </g>
          <g clipPath="url(#matureBotChamber)">
            <rect ref={botSandRef} x={GLASS_L} width={GLASS_W} y={BOT_Y} height={0} fill="url(#matureSand)" />
            <polygon ref={coneRef} points={`${CX},${BOT_Y} ${CX + 31},${BOT_Y} ${CX - 31},${BOT_Y}`} fill="#fb923c" />
          </g>
          <rect ref={streamRef} x={CX - 2.5} width={5} y={NECK_Y} height={0} fill="#fb923c" opacity="0" />
          {Array.from({ length: GRAINS }, (_, i) => (
            <circle
              key={i}
              ref={(el) => {
                grainRefs.current[i] = el
              }}
              r={1.5}
              cx={CX}
              cy={NECK_Y}
              fill="#fed7aa"
              opacity="0"
            />
          ))}

          {/* Glass before frame, so the highlight reads as sitting on top of
              the sand and the caps always close the ends cleanly. */}
          <path className="mature-glass-shine" d={`M ${GLASS_L + 14} ${TOP_Y + 8} L ${CX - 16} ${NECK_Y - 10}`} />
          <path className="mature-glass-shine" d={`M ${CX - 14} ${NECK_Y + 12} L ${GLASS_L + 20} ${BOT_Y - 8}`} />
          <rect x={50} y={TOP_Y - 13} width={150} height={13} rx={4} fill="url(#matureWood)" />
          <rect x={50} y={BOT_Y} width={150} height={13} rx={4} fill="url(#matureWood)" />
          <rect x={53} y={TOP_Y - 13} width={7} height={BOT_Y + 13 - (TOP_Y - 13)} rx={3.5} fill="url(#matureWood)" />
          <rect x={190} y={TOP_Y - 13} width={7} height={BOT_Y + 13 - (TOP_Y - 13)} rx={3.5} fill="url(#matureWood)" />
        </g>
      </svg>
    </div>
  )
}
