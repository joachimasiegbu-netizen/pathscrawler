import { Fragment, useEffect, useRef } from 'react'
import { usePathStore } from '../store/usePathStore'

/**
 * The Student Hub persona's visual on RoleSelectionPage.tsx - the way
 * StudentPersonaCube.tsx is Student's and MatureLearnerHourglass.tsx is
 * Mature Learner's. Replaces StudentHubPersonaEarth.tsx, which stays in the
 * tree unused in case the globe is wanted back.
 *
 * Why it was replaced: the earth banner was the only persona visual that
 * wasn't really 3D (a flat 250px circle with a 700x350 equirectangular
 * texture scrolled across it - fixed silhouette, no convergence at the
 * poles, no compression at the limb) and the only one carrying an embedded
 * asset, ~44 KB of base64 in index.css. Its `filter: saturate(1.3)
 * brightness(1.14)` was also load-bearing for the brightness, which is what
 * made it impossible to grow into a real volume in place: a filter anywhere
 * in a preserve-3d chain flattens everything under it.
 *
 * A library card index rather than a filing cabinet - pale ply, warm
 * cavities, a cyan label plate that doubles as the pull. Idle, one drawer
 * eases open at a time; a pointer passing over it opens all four, one
 * behind the next, which is the whole "there is a shelf of things in here"
 * claim in one gesture. Ported from the round-four specimen sheet
 * (claude.ai/code/artifact/6b8db1c4).
 *
 * GRID and CELL are the only numbers that set the build - every other
 * dimension derives from them, so the four-drawer version is
 * `{ cols: 2, rows: 2 }` at cell 76 with MARKS trimmed to its first three
 * plus the checklist, and ORDER back to [0, 3, 1, 2]. Six is what ships:
 * it fills the carousel's slot better and names six things the hub holds,
 * at the cost of a 26px mark where four gave 34px.
 *
 * No focusable children: this renders INSIDE PersonaCard.tsx's own
 * <button>, where a nested tabindex would be invalid markup and would fight
 * the carousel's arrow-key handling. Pointer hover only, exactly like the
 * cube's faces, the split-flap's board and the hourglass.
 */

const GRID = { cols: 3, rows: 2 }
const CELL = 58

/* Everything below is derived, so the two constants above are the whole
   geometry. Frame is the ply between cells and around the edge; depth is
   the carcass front-to-back; pull is how far a drawer travels. */
const FRAME = Math.round(CELL * 0.12)
const W = GRID.cols * CELL + (GRID.cols + 1) * FRAME
const H = GRID.rows * CELL + (GRID.rows + 1) * FRAME
const DEPTH = Math.round(CELL * 0.95)
const PULL = Math.round(CELL * 0.42)
const MARK = Math.round(CELL * 0.45)
/* Far enough out that a drawer only lights once it is clearly opening,
   rather than flickering on the first pixel of travel. */
const LIVE_AT = PULL * 0.42

/* Not 0,1,2,3,4,5 on purpose: a sequential order reads as a wave crossing
   the grid, this reads as different things being fetched. Each step also
   changes row, which a straight left-to-right run never does. */
const ORDER = [0, 3, 1, 4, 2, 5]
const DWELL = 1800
const STAGGER = 60
/* A spring, not an ease: it overshoots ~10% on the way out, and the clamp
   at 0 in the loop below is the drawer hitting its stop on the way in. It
   also means a hover arriving mid-close catches the drawer where it is and
   pulls it back out from there, instead of restarting the motion. */
const SPRING_K = 190
const SPRING_C = 16

const CELLS = Array.from({ length: GRID.cols * GRID.rows }, (_, i) => ({
  left: FRAME + (i % GRID.cols) * (CELL + FRAME),
  top: FRAME + Math.floor(i / GRID.cols) * (CELL + FRAME),
}))

/* One 28x28 viewBox each so the same paths serve any cell size, in cell
   order (row-major). The tagline's three things, plus the three the hub
   actually holds. */
const MARKS = [
  <>
    <rect x="6" y="4" width="16" height="20" rx="2" />
    <path d="M10 10h8" />
    <path d="M10 14h8" />
    <path d="M10 18h5" />
  </>,
  <>
    <rect x="6" y="4" width="16" height="20" rx="2" />
    <rect x="9" y="7" width="10" height="4" rx="1" />
    <circle cx="11" cy="15" r="1" />
    <circle cx="14" cy="15" r="1" />
    <circle cx="17" cy="15" r="1" />
    <circle cx="11" cy="19" r="1" />
    <circle cx="14" cy="19" r="1" />
    <circle cx="17" cy="19" r="1" />
  </>,
  <>
    <circle cx="14" cy="15" r="8" />
    <path d="M14 15v-5" />
    <path d="M14 15l4 3" />
    <path d="M11 5h6" />
  </>,
  <>
    <path d="M5 23h18" />
    <path d="M9 23v-7" />
    <path d="M14 23V10" />
    <path d="M19 23v-9" />
  </>,
  <>
    <rect x="5" y="6" width="7" height="7" rx="1.5" />
    <path d="M6.8 9.5 8.5 11.2 11 8" />
    <path d="M16 9.5h7" />
    <path d="M5 19h18" />
  </>,
  <>
    <path d="M5 6h7a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H5z" />
    <path d="M23 6h-7a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h7z" />
  </>,
]

export default function StudentHubPigeonholes({ className }: { className?: string }) {
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const hoverRef = useRef(false)
  const drawerRefs = useRef<(HTMLDivElement | null)[]>([])
  const lidRefs = useRef<(HTMLDivElement | null)[]>([])
  const wallRefs = useRef<(HTMLDivElement | null)[]>([])
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const frontRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const osReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const still = reduceMotion || osReduce

    const slides = CELLS.map(() => ({ d: 0, v: 0, target: 0, live: false }))

    // One function for every frame AND for the static reduced-motion pose,
    // so the still version can't drift from what the animation draws.
    const paint = (hovered: boolean) => {
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i]
        const drawer = drawerRefs.current[i]
        const lid = lidRefs.current[i]
        const wall = wallRefs.current[i]
        const card = cardRefs.current[i]
        const front = frontRefs.current[i]
        if (!drawer || !lid || !wall || !card || !front) continue

        const d = slide.d
        drawer.style.transform = `translateZ(${d.toFixed(2)}px)`
        // Lid and wall are hinged on the carcass and sized per frame, so
        // they always bridge the face to wherever the front has got to - a
        // fixed-depth lid would hang in mid-air over a half-open drawer.
        lid.style.height = `${d.toFixed(2)}px`
        wall.style.width = `${d.toFixed(2)}px`
        wall.style.left = `${(CELLS[i].left + CELL - d).toFixed(2)}px`
        // The card inside rises as the drawer opens, and a little further
        // while watched: an open drawer should hold something.
        card.style.top = `${(-(d * 0.42 + (hovered ? 6 : 0))).toFixed(2)}px`
        front.style.boxShadow = `0 ${(d * 0.3).toFixed(1)}px ${(d * 0.7).toFixed(1)}px -3px rgba(58, 48, 30, 0.45)`

        const live = d > LIVE_AT
        if (live !== slide.live) {
          slide.live = live
          if (live) drawer.setAttribute('data-live', 'true')
          else drawer.removeAttribute('data-live')
        }
      }
    }

    // Reduced motion: a composed pose with one drawer open, not a frozen
    // frame of a closed cabinet - the object has to still say what it is.
    if (still) {
      slides.forEach((slide, i) => {
        slide.d = i === ORDER[0] ? PULL : 0
      })
      paint(false)
      return
    }

    let step = 0
    let dwellAcc = 0
    let hoverAcc = 0
    let raf = 0
    let last = 0

    const frame = (now: number) => {
      const dt = last ? Math.min(50, now - last) : 16
      last = now
      const hovered = hoverRef.current

      if (hovered) {
        hoverAcc += dt
        dwellAcc = 0
        for (let i = 0; i < slides.length; i++) slides[i].target = hoverAcc > i * STAGGER ? PULL : 0
      } else {
        hoverAcc = 0
        dwellAcc += dt
        if (dwellAcc >= DWELL) {
          dwellAcc = 0
          step = (step + 1) % ORDER.length
        }
        for (let i = 0; i < slides.length; i++) slides[i].target = i === ORDER[step] ? PULL : 0
      }

      const dts = Math.min(0.05, dt / 1000)
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i]
        slide.v += ((slide.target - slide.d) * SPRING_K - slide.v * SPRING_C) * dts
        slide.d += slide.v * dts
        if (slide.d < 0) {
          slide.d = 0
          slide.v = 0
        }
      }
      paint(hovered)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => cancelAnimationFrame(raf)
  }, [reduceMotion])

  return (
    <div
      className={`student-hub-holes-stage ${className ?? ''}`}
      data-reduce-motion={reduceMotion ? 'true' : undefined}
      // Hover opens the whole cabinet, the way the split-flap riffles fast
      // and the hourglass drains fast. Kept on a ref rather than state: the
      // loop reads it every frame, so a re-render would buy nothing.
      onPointerEnter={() => {
        hoverRef.current = true
      }}
      onPointerLeave={() => {
        hoverRef.current = false
      }}
    >
      <div className="student-hub-holes-cam" aria-hidden="true">
        <div
          className="student-hub-holes-shadow"
          style={{
            width: W * 1.22,
            height: DEPTH * 1.7,
            marginTop: -DEPTH * 0.85,
            marginLeft: -W * 0.61,
            transform: `translateY(${H / 2 + 3}px) rotateX(90deg)`,
          }}
        />
        {/* The +X side: the one a -21deg yaw puts toward the viewer. */}
        <div
          className="student-hub-holes-side"
          style={{
            width: DEPTH,
            height: H,
            marginTop: -H / 2,
            marginLeft: -DEPTH / 2,
            transform: `translateX(${W / 2}px) rotateY(90deg)`,
          }}
        />
        <div
          className="student-hub-holes-top"
          style={{
            width: W,
            height: DEPTH,
            marginTop: -DEPTH / 2,
            marginLeft: -W / 2,
            transform: `translateY(${-H / 2}px) rotateX(90deg)`,
          }}
        />
        <div
          className="student-hub-holes-face"
          style={{
            width: W,
            height: H,
            marginTop: -H / 2,
            marginLeft: -W / 2,
            transform: `translateZ(${DEPTH / 2}px)`,
          }}
        >
          {CELLS.map((cell, i) => (
            <Fragment key={i}>
              <div
                className="student-hub-holes-hole"
                style={{ left: cell.left, top: cell.top, width: CELL, height: CELL }}
              />
              <div
                ref={(el) => {
                  lidRefs.current[i] = el
                }}
                className="student-hub-holes-lid"
                style={{ left: cell.left, top: cell.top, width: CELL }}
              />
              <div
                ref={(el) => {
                  wallRefs.current[i] = el
                }}
                className="student-hub-holes-wall"
                style={{ top: cell.top, height: CELL }}
              />
              <div
                ref={(el) => {
                  drawerRefs.current[i] = el
                }}
                className="student-hub-holes-drawer"
                style={{ left: cell.left, top: cell.top, width: CELL, height: CELL }}
              >
                <div
                  ref={(el) => {
                    cardRefs.current[i] = el
                  }}
                  className="student-hub-holes-card"
                />
                <div
                  ref={(el) => {
                    frontRefs.current[i] = el
                  }}
                  className="student-hub-holes-front"
                >
                  <svg viewBox="0 0 28 28" width={MARK} height={MARK}>
                    {MARKS[i]}
                  </svg>
                  <span className="student-hub-holes-plate" />
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
