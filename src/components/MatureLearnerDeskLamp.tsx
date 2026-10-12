import { useEffect, useRef } from 'react'
import { usePathStore } from '../store/usePathStore'

/**
 * The Mature Learner persona's visual on RoleSelectionPage.tsx - the way
 * StudentPersonaCube.tsx is Student's, CareerChangerSplitFlap.tsx is Career
 * Changer's, StudentHubPigeonholes.tsx is Student Hub's and
 * KnowGoalPersonaTree.tsx is I Know My Goal's.
 *
 * "Evening class": a desk lamp comes on over an open book after dark - the
 * hour mature learners actually study in. Picked off a spec sheet of four
 * candidates (claude.ai/code/artifact/effc911e-6343-4742-84d7-14791e18b642)
 * over a date-due library card, a kintsugi bowl, and a staircase upgrade to
 * the turning hourglass it replaces; MatureLearnerHourglass.tsx and
 * PersonaCard's `glass` branch both stay in the tree to switch back to, the
 * same way the earth banner the pigeonholes took over from did.
 *
 * Real volume, not a drawing of one. The first build of this was flat SVG
 * and read as exactly that next to the cube and the cabinet, so it is now
 * the same idiom they use: CSS planes in one preserve-3d chain under a
 * perspective camera, with the scene on a slow yaw so the depth is a fact
 * you can see rather than a shading trick. Two cones do the heavy lifting -
 * the shade and the beam are each a radial fan of trapezoid planes
 * (conePlanes below), which is what keeps their silhouettes correct as the
 * camera turns instead of pivoting like a cardboard cut-out.
 *
 * Nothing in the 3D chain may use filter/overflow/opacity-on-a-group: each
 * one flattens everything under it (see index.css's own note on the
 * pigeonholes). That is why the glow is radial-gradient rather than blur,
 * and why the loop writes opacity onto the beam's planes one at a time
 * rather than once onto their wrapper.
 *
 * No focusable children: this renders INSIDE PersonaCard.tsx's own <button>.
 * Pointer hover only - it shortens the night and turns the scene toward you,
 * like the hourglass's fast drain and the split-flap's fast riffle.
 */

/* ---- The scene, in px on the camera's own axes. +Y is down, +Z is toward
   the viewer, and the origin sits at the middle of the desk's front edge
   height, so the desk surface being at +46 is "below the middle". Every
   other number derives from these. ---- */
const DESK_W = 178
const DESK_D = 98
const DESK_T = 10
const DESK_Y = 46

const BOOK_W = 66
const BOOK_H = 50
/** How far each page lifts off the desk toward the spine. */
const PAGE_TILT = 9

const LAMP_X = 62
const POST_TOP = -40
const BASE_R = 21

/* The shade is a cone: SHADE_TOP down to SHADE_TOP + SHADE_H, flaring from
   SHADE_R_TOP to SHADE_R_BOT. Its mouth is where the beam starts, so the
   two cones always meet exactly. */
const SHADE_X = -4
const SHADE_Z = -4
const SHADE_TOP = -94
const SHADE_H = 28
const SHADE_R_TOP = 12
const SHADE_R_BOT = 32
const MOUTH_Y = SHADE_TOP + SHADE_H

/* The beam: the same cone maths from the shade's mouth down to the desk. */
const BEAM_R_TOP = 26
const BEAM_R_BOT = 58
const BEAM_H = DESK_Y - MOUTH_Y
/** Per-plane, not on their wrapper - opacity on a group flattens it. Low,
 *  because seven planes overlap: at 0.15 the cone stopped reading as light
 *  and started reading as smoke. */
const BEAM_PLANE_OPACITY = 0.13

/* The night, in milliseconds. FLICKS alternates on/off from its first entry,
   so an odd length always lands on "on" and hands a lit lamp to SETTLE -
   adding an entry changes the rhythm, not the ending. */
const OFF = 600
const FLICKS = [90, 70, 110, 60, 130]
const SETTLE = 520
const STEADY = 4400
const FADE = 480
/** Hover runs the clock fast rather than keeping a second set of durations -
    it speeds the dust and the flicker up with everything else for free. */
const HOT = 2.6

/* The camera's idle drift. Small on purpose: this is a lit scene being
   looked at, not an object on a turntable. The pitch is shallow because the
   shade points at the desk - look down much harder than this and the whole
   head turns into a closed cone with no light visible anywhere in it. */
const PITCH = -10
const YAW_BASE = -17
const YAW_SWING = 9
const YAW_PERIOD = 4200
/** Where hover pulls the camera - rounder onto the beam, and a touch lower. */
const YAW_HOVER = -4
const PITCH_HOVER = -6

/* Dust in the beam, in cone space: a height fraction (1 at the desk, 0 at
   the mouth), an angle, and how far out it floats. */
const MOTES = 9

/** Page colour at lights-out and at full lamplight, as RGB triples rather
 *  than hex: the loop lerps between them every frame, and parsing the same
 *  six numbers out of a string 60 times a second is work for nothing. */
const PAGE_DARK = [24, 32, 49]
const PAGE_LIT = [255, 247, 229]

interface Mote {
  t: number
  angle: number
  spread: number
  v: number
}

interface ConePlane {
  angle: number
  width: number
  height: number
  radius: number
  tilt: number
  clip: string
}

/** One ring of trapezoid planes that together read as a cone: each plane
 *  spans the full slant, sits at the mid-radius facing outward, and leans by
 *  the cone's own half-angle so the bottom edge flares. A clip-path narrows
 *  its top edge to the cone's top radius - the planes are leaves, so the
 *  flattening clip-path forces costs nothing here. */
function conePlanes(count: number, rTop: number, rBot: number, height: number): ConePlane[] {
  const slant = Math.hypot(height, rBot - rTop)
  const tilt = (Math.atan2(rBot - rTop, height) * 180) / Math.PI
  const width = 2 * rBot * Math.tan(Math.PI / count)
  const topPct = 50 * (rTop / rBot)
  return Array.from({ length: count }, (_, i) => ({
    angle: (360 / count) * i,
    width,
    height: slant,
    radius: (rTop + rBot) / 2,
    tilt,
    clip: `polygon(${50 - topPct}% 0%, ${50 + topPct}% 0%, 100% 100%, 0% 100%)`,
  }))
}

/* 16, not 12: at 12 the panel seams read as spokes on a parasol. The
   overlap each panel gets below (+1.6px of width) is the other half of that
   fix - butted edges leave a hairline of the dark behind them. */
const SHADE_PLANES = conePlanes(16, SHADE_R_TOP, SHADE_R_BOT, SHADE_H)
const BEAM_PLANES = conePlanes(7, BEAM_R_TOP, BEAM_R_BOT, BEAM_H)

/* Fixed key light, baked per plane - CSS can't relight as the camera turns,
   and a cone of identical panels reads as a drum. The angle is in the fan's
   own frame, where 0 is the panel facing +Z (the viewer) and 90 is +X: at
   214 the lit side sat round the back where nothing ever sees it, which is
   only obvious once the dark end of the ramp is near-black. 320 is front
   left, the quarter the camera spends all its time in. */
const KEY_DEG = 320
const SHADE_DARK = [20, 25, 36]
const SHADE_LIT = [142, 157, 183]

function mix(a: number[], b: number[], t: number) {
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(
    a[2] + (b[2] - a[2]) * t,
  )})`
}

/** Centres a plane on the camera's zero-size anchor, so the transforms the
 *  component writes stay purely positional and never re-state the centring -
 *  the same arrangement StudentHubPigeonholes.tsx uses. */
function plane(w: number, h: number) {
  return { width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2 }
}

/* The arm runs from the top of the post to the knuckle on top of the shade;
   both its length and its lean come from those two points, so moving either
   end can't leave the arm hanging in mid-air. It stops at the cone's top rim
   rather than at the cone's axis - run it to the axis and the last 12px
   crosses the shade, which CSS's per-plane depth sorting then shows IN FRONT
   of the cone about half the time. */
const KNUCKLE_X = SHADE_X + SHADE_R_TOP * 0.8
const ARM_DX = KNUCKLE_X - LAMP_X
const ARM_DY = SHADE_TOP + 1 - POST_TOP
const ARM_LEN = Math.hypot(ARM_DX, ARM_DY)
const ARM_DEG = (Math.atan2(ARM_DX, -ARM_DY) * 180) / Math.PI
const ARM_MID_X = LAMP_X + ARM_DX / 2
const ARM_MID_Y = POST_TOP + ARM_DY / 2
const POST_H = DESK_Y - POST_TOP

export default function MatureLearnerDeskLamp({ className }: { className?: string }) {
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const stageRef = useRef<HTMLDivElement>(null)
  const camRef = useRef<HTMLDivElement>(null)
  const beamRefs = useRef<(HTMLDivElement | null)[]>([])
  const poolRef = useRef<HTMLDivElement>(null)
  const haloRef = useRef<HTMLDivElement>(null)
  const mouthRef = useRef<HTMLDivElement>(null)
  const bulbRef = useRef<HTMLDivElement>(null)
  const pageLRef = useRef<HTMLDivElement>(null)
  const pageRRef = useRef<HTMLDivElement>(null)
  const rulesLRef = useRef<HTMLDivElement>(null)
  const rulesRRef = useRef<HTMLDivElement>(null)
  const moteRefs = useRef<(HTMLDivElement | null)[]>([])
  const postRef = useRef<HTMLDivElement>(null)
  const armRef = useRef<HTMLDivElement>(null)
  const knuckleRef = useRef<HTMLDivElement>(null)
  const hoverRef = useRef(false)

  useEffect(() => {
    const osReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const still = reduceMotion || osReduce

    // One function for the whole scene's light level AND for the static
    // reduced-motion pose, so the still version can't drift from what the
    // animation draws. Everything warm in here is a function of L.
    const light = (L: number) => {
      for (let i = 0; i < BEAM_PLANES.length; i++) {
        const el = beamRefs.current[i]
        if (el) el.style.opacity = String(BEAM_PLANE_OPACITY * L)
      }
      if (poolRef.current) poolRef.current.style.opacity = String(L)
      if (bulbRef.current) bulbRef.current.style.opacity = String(L)
      // The halo is the only evidence of the source itself: the camera looks
      // down at a shade pointing at the desk, so the mouth and the bulb
      // inside it are hidden by the cone almost all the time. This is the
      // spill around the shade's lower rim, and it is what actually reads as
      // "the lamp is on" from up here.
      if (haloRef.current) haloRef.current.style.opacity = String(L * 0.9)
      // Never fully dark: an unlit shade still catches a little of the room.
      if (mouthRef.current) mouthRef.current.style.opacity = String(0.1 + 0.9 * L)
      const paper = mix(PAGE_DARK, PAGE_LIT, L)
      if (pageLRef.current) pageLRef.current.style.background = paper
      if (pageRRef.current) pageRRef.current.style.background = paper
      if (rulesLRef.current) rulesLRef.current.style.opacity = String(L * 0.5)
      if (rulesRRef.current) rulesRRef.current.style.opacity = String(L * 0.5)
    }

    // The camera, and with it the three parts that have to face it. A lamp's
    // post, arm and joint are round bars; a single plane counter-rotated by
    // the camera's own yaw reads as one from any angle, where the obvious
    // alternative - two planes crossed at 90deg - shows its cross as a seam
    // down the bar at every angle except dead-on.
    const aim = (yaw: number, pitch: number) => {
      if (camRef.current) camRef.current.style.transform = `rotateX(${pitch}deg) rotateY(${yaw}deg)`
      const face = `rotateY(${-yaw}deg)`
      if (postRef.current) {
        postRef.current.style.transform = `translate3d(${LAMP_X}px, ${POST_TOP + POST_H / 2}px, ${SHADE_Z}px) ${face}`
      }
      if (armRef.current) {
        armRef.current.style.transform = `translate3d(${ARM_MID_X}px, ${ARM_MID_Y}px, ${SHADE_Z}px) ${face} rotateZ(${ARM_DEG}deg)`
      }
      if (knuckleRef.current) {
        knuckleRef.current.style.transform = `translate3d(${KNUCKLE_X}px, ${SHADE_TOP + 1}px, ${SHADE_Z}px) ${face}`
      }
    }

    // Reduced motion: lit, settled, square-on enough to read, and no dust
    // caught mid-drift - a composed pose rather than a frozen frame.
    if (still) {
      aim(YAW_BASE, PITCH)
      light(1)
      moteRefs.current.forEach((m) => {
        if (m) m.style.opacity = '0'
      })
      return
    }

    const motes: Mote[] = Array.from({ length: MOTES }, () => ({
      t: Math.random(),
      angle: Math.random() * Math.PI * 2,
      spread: 0.25 + Math.random() * 0.6,
      v: 0.00006 + Math.random() * 0.00009,
    }))

    let phase: 'off' | 'flick' | 'settle' | 'steady' | 'fade' = 'off'
    let acc = 0
    let flickIdx = 0
    let breathe = 0
    let swing = 0
    /** 0 at rest, 1 fully hovered - eased so the camera doesn't snap. */
    let pull = 0
    let raf = 0
    let last = 0

    const frame = (now: number) => {
      const real = last ? Math.min(50, now - last) : 16
      last = now
      const hovered = hoverRef.current
      const dt = real * (hovered ? HOT : 1)
      acc += dt

      if (phase === 'off') {
        light(0)
        if (acc >= OFF) {
          acc = 0
          flickIdx = 0
          phase = 'flick'
        }
      } else if (phase === 'flick') {
        light(flickIdx % 2 === 0 ? 0.75 : 0.05)
        if (acc >= FLICKS[flickIdx]) {
          acc = 0
          flickIdx += 1
          if (flickIdx >= FLICKS.length) phase = 'settle'
        }
      } else if (phase === 'settle') {
        const t = Math.min(1, acc / SETTLE)
        light(0.05 + 0.95 * (1 - Math.pow(1 - t, 3)))
        if (acc >= SETTLE) {
          acc = 0
          breathe = 0
          phase = 'steady'
        }
      } else if (phase === 'steady') {
        // A filament doesn't hold perfectly still, and the slow breathe is
        // what keeps a four-second hold from reading as a static image.
        breathe += dt
        light(0.94 + 0.06 * Math.sin(breathe / 900))
        if (acc >= STEADY) {
          acc = 0
          phase = 'fade'
        }
      } else {
        const t = Math.min(1, acc / FADE)
        light(1 - t * t * t)
        if (acc >= FADE) {
          acc = 0
          phase = 'off'
        }
      }

      // The drift runs on real time, not the hover-scaled clock: hover is
      // meant to shorten the night, not spin the room.
      swing += real
      pull += ((hovered ? 1 : 0) - pull) * Math.min(1, real / 260)
      const idleYaw = YAW_BASE + YAW_SWING * Math.sin(swing / YAW_PERIOD)
      aim(idleYaw + (YAW_HOVER - idleYaw) * pull, PITCH + (PITCH_HOVER - PITCH) * pull)

      // Dust only exists while there's a beam to catch it. It rises through
      // the cone in cone space, so it stays inside the beam at every height
      // instead of needing the beam to clip it.
      const lit = phase === 'settle' || phase === 'steady'
      for (let i = 0; i < motes.length; i++) {
        const el = moteRefs.current[i]
        if (!el) continue
        if (!lit) {
          el.style.opacity = '0'
          continue
        }
        const m = motes[i]
        m.t -= m.v * dt
        m.angle += dt * 0.00022
        if (m.t <= 0) {
          m.t = 1
          m.angle = Math.random() * Math.PI * 2
          m.spread = 0.25 + Math.random() * 0.6
        }
        const r = (BEAM_R_TOP + (BEAM_R_BOT - BEAM_R_TOP) * m.t) * m.spread
        const x = SHADE_X + Math.sin(m.angle) * r
        const z = SHADE_Z + Math.cos(m.angle) * r
        const y = MOUTH_Y + BEAM_H * m.t
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px)`
        // Fades out at both ends of its run so none of them pop.
        el.style.opacity = String(0.5 * Math.sin(Math.PI * m.t))
      }

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => cancelAnimationFrame(raf)
  }, [reduceMotion])

  return (
    <div
      ref={stageRef}
      className={`mature-lamp-stage ${className ?? ''}`}
      data-reduce-motion={reduceMotion ? 'true' : undefined}
      // Kept on a ref + a data attribute instead of state: the loop reads the
      // ref every frame and the warmth below is pure CSS, so a re-render
      // would buy nothing.
      onPointerEnter={() => {
        hoverRef.current = true
        stageRef.current?.setAttribute('data-hover', 'true')
      }}
      onPointerLeave={() => {
        hoverRef.current = false
        stageRef.current?.removeAttribute('data-hover')
      }}
    >
      <div className="mature-lamp-warmth" />
      <div ref={camRef} className="mature-lamp-cam" aria-hidden="true">
        {/* No backdrop plane in here: the room is a vignette painted on the
            stage behind the camera (see index.css). As a plane it yawed with
            everything else, which read as a dark cloud swinging behind the
            desk rather than as a room standing still around it. */}
        <div
          className="mature-lamp-desk-top"
          style={{ ...plane(DESK_W, DESK_D), transform: `translateY(${DESK_Y}px) rotateX(90deg)` }}
        />
        <div
          className="mature-lamp-desk-front"
          style={{ ...plane(DESK_W, DESK_T), transform: `translate3d(0, ${DESK_Y + DESK_T / 2}px, ${DESK_D / 2}px)` }}
        />
        <div
          className="mature-lamp-desk-side"
          style={{
            ...plane(DESK_D, DESK_T),
            transform: `translate3d(${DESK_W / 2}px, ${DESK_Y + DESK_T / 2}px, 0) rotateY(90deg)`,
          }}
        />

        {/* Light on the desk before the book, so the book's own shadow sits
            on top of the pool rather than under it. */}
        <div
          ref={poolRef}
          className="mature-lamp-pool"
          style={{
            ...plane(BEAM_R_BOT * 2.3, BEAM_R_BOT * 2.3),
            transform: `translate3d(${SHADE_X}px, ${DESK_Y - 0.8}px, ${SHADE_Z}px) rotateX(90deg)`,
            opacity: 0,
          }}
        />
        {/* Only just bigger than the book. The first pass at this was half
            the desk wide and sat on top of the pool, which quietly cancelled
            the one piece of evidence that the lamp is lit at all. */}
        <div
          className="mature-lamp-contact"
          style={{
            ...plane(BOOK_W * 1.45, BOOK_H * 1.05),
            transform: `translate3d(${SHADE_X}px, ${DESK_Y - 1.6}px, ${SHADE_Z}px) rotateX(90deg)`,
          }}
        />

        {/* The open book: two planes hinged at the spine. Both take their
            colour from the loop, which is the whole lighting trick - the
            paper warms instead of a second set of "lit" shapes fading in. */}
        <div
          ref={pageLRef}
          className="mature-lamp-page"
          style={{
            ...plane(BOOK_W, BOOK_H),
            transform: `translate3d(${SHADE_X - BOOK_W / 2 + 1}px, ${DESK_Y - 4}px, ${SHADE_Z}px) rotateZ(${-PAGE_TILT}deg) rotateX(90deg)`,
          }}
        >
          <div ref={rulesLRef} className="mature-lamp-rules" style={{ opacity: 0 }}>
            <span style={{ top: '26%', left: '14%', width: '68%' }} />
            <span style={{ top: '42%', left: '14%', width: '72%' }} />
            <span style={{ top: '58%', left: '14%', width: '60%' }} />
            <span style={{ top: '74%', left: '14%', width: '66%' }} />
          </div>
        </div>
        <div
          ref={pageRRef}
          className="mature-lamp-page"
          style={{
            ...plane(BOOK_W, BOOK_H),
            transform: `translate3d(${SHADE_X + BOOK_W / 2 - 1}px, ${DESK_Y - 4}px, ${SHADE_Z}px) rotateZ(${PAGE_TILT}deg) rotateX(90deg)`,
          }}
        >
          <div ref={rulesRRef} className="mature-lamp-rules" style={{ opacity: 0 }}>
            <span style={{ top: '26%', left: '18%', width: '68%' }} />
            <span style={{ top: '42%', left: '14%', width: '72%' }} />
            <span style={{ top: '58%', left: '26%', width: '60%' }} />
            <span style={{ top: '74%', left: '18%', width: '66%' }} />
          </div>
        </div>

        {/* The spine, raised by the page tilt - without it the two pages read
            as one folded sheet rather than as a book. */}
        <div
          className="mature-lamp-spine"
          style={{
            ...plane(7, BOOK_H),
            // Just BELOW where the two inner page edges meet, so it fills the
            // crack between them. A hair above and it stands proud of the
            // pages as a dark bar across the middle of the book.
            transform: `translate3d(${SHADE_X}px, ${DESK_Y - (BOOK_W / 2) * Math.sin((PAGE_TILT * Math.PI) / 180) + 0.8}px, ${SHADE_Z}px) rotateX(90deg)`,
          }}
        />

        {/* Post, arm and the joint between them: one plane each, turned to
            face the camera every frame by aim() above. Their shading is a
            left-to-right gradient, which is what turns a flat strip into a
            round bar once it always faces you. */}
        <div ref={postRef} className="mature-lamp-bar" style={plane(7, POST_H)} />
        <div ref={armRef} className="mature-lamp-bar" style={plane(7, ARM_LEN)} />
        <div ref={knuckleRef} className="mature-lamp-knuckle" style={plane(13, 13)} />
        <div
          className="mature-lamp-base"
          style={{
            ...plane(BASE_R * 2, BASE_R * 2),
            transform: `translate3d(${LAMP_X}px, ${DESK_Y - 1.2}px, ${SHADE_Z}px) rotateX(90deg)`,
          }}
        />

        {/* The shade - a real cone, so its silhouette changes with the yaw
            instead of pivoting like a cut-out. */}
        <div
          className="mature-lamp-cone"
          style={{ transform: `translate3d(${SHADE_X}px, ${SHADE_TOP + SHADE_H / 2}px, ${SHADE_Z}px)` }}
        >
          {SHADE_PLANES.map((p, i) => (
            <div
              key={i}
              className="mature-lamp-shade-panel"
              style={{
                ...plane(p.width + 1.6, p.height),
                clipPath: p.clip,
                background: mix(SHADE_DARK, SHADE_LIT, Math.max(0, Math.cos(((p.angle - KEY_DEG) * Math.PI) / 180)) ** 0.8),
                transform: `rotateY(${p.angle}deg) translateZ(${p.radius}px) rotateX(${p.tilt}deg)`,
              }}
            />
          ))}
        </div>

        {/* The beam, the same cone maths from the shade's mouth to the desk.
            Overlapping translucent planes thicken toward the axis, which is
            what makes it read as a volume of light rather than a shape. */}
        <div
          className="mature-lamp-cone"
          style={{ transform: `translate3d(${SHADE_X}px, ${MOUTH_Y + BEAM_H / 2}px, ${SHADE_Z}px)` }}
        >
          {BEAM_PLANES.map((p, i) => (
            <div
              key={i}
              ref={(node) => {
                beamRefs.current[i] = node
              }}
              className="mature-lamp-beam-panel"
              style={{
                ...plane(p.width, p.height),
                clipPath: p.clip,
                opacity: 0,
                transform: `rotateY(${p.angle}deg) translateZ(${p.radius}px) rotateX(${p.tilt}deg)`,
              }}
            />
          ))}
        </div>

        <div
          ref={haloRef}
          className="mature-lamp-halo"
          style={{
            ...plane(SHADE_R_BOT * 4.2, SHADE_R_BOT * 4.2),
            transform: `translate3d(${SHADE_X}px, ${MOUTH_Y + 1}px, ${SHADE_Z}px) rotateX(90deg)`,
            opacity: 0,
          }}
        />
        <div
          ref={mouthRef}
          className="mature-lamp-mouth"
          style={{
            ...plane(SHADE_R_BOT * 2 - 4, SHADE_R_BOT * 2 - 4),
            transform: `translate3d(${SHADE_X}px, ${MOUTH_Y - 1}px, ${SHADE_Z}px) rotateX(90deg)`,
            opacity: 0.1,
          }}
        />
        <div
          ref={bulbRef}
          className="mature-lamp-bulb"
          style={{
            ...plane(26, 26),
            transform: `translate3d(${SHADE_X}px, ${MOUTH_Y - 9}px, ${SHADE_Z}px) rotateX(90deg)`,
            opacity: 0,
          }}
        />

        {Array.from({ length: MOTES }, (_, i) => (
          <div
            key={`mote-${i}`}
            ref={(node) => {
              moteRefs.current[i] = node
            }}
            className="mature-lamp-mote"
            style={{ ...plane(i % 3 === 0 ? 4 : 3, i % 3 === 0 ? 4 : 3), opacity: 0 }}
          />
        ))}
      </div>
    </div>
  )
}
