import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface CelestialDragonRevealProps {
  onComplete: () => void
}

// The white-and-gold dragon intro that now runs BEFORE CelestialRevealCard's
// existing floating/exploding/revealed sequence (see that file - it renders
// this component during a new 'intro' phase, then swaps to its normal
// 'floating' sealed-card once onComplete() fires). Four identical sealed
// Celestial card-backs fan out, the dragon rises and swirls past them
// searching, coils in on one at random, the rest scatter away, and a big
// white explosion detonates from the exact center of the screen the instant
// it arrives there - onComplete() then hands back to CelestialRevealCard,
// which fades in the REAL sealed card (still "click to reveal", untouched)
// in that same spot. Every dragon/explosion drawing routine below is ported
// straight from the standalone "Rising Dragon" animation prototype, just
// retimed as a single run instead of an infinite ambient loop.
//
// Purely decorative and skippable - a click/tap or Enter/Space anywhere
// jumps straight to onComplete(). Only ever mounted when reduceMotion is
// off (CelestialRevealCard starts straight at 'revealed' otherwise), so
// there's no reduced-motion branch to maintain in here.

const CARD_COUNT = 4

const CARDS_IN_MS = 700
const SEARCHING_MS = 3200
const SELECTING_MS = 900
const EXPLODING_MS = 1500
const FADING_MS = 600

const T_CARDS_IN = CARDS_IN_MS
const T_SEARCHING = T_CARDS_IN + SEARCHING_MS
const T_SELECTING = T_SEARCHING + SELECTING_MS // dragon fully arrives at center exactly here
const T_EXPLODING = T_SELECTING + EXPLODING_MS
const T_DONE = T_EXPLODING + FADING_MS

type Stage = 'cards-in' | 'searching' | 'selecting' | 'exploding' | 'fading'

// --- dragon geometry (ported from the Rising Dragon prototype) -------------

interface SpinePoint {
  x: number
  y: number
  ang: number
}

interface World {
  W: number
  H: number
  cx: number
  startY: number
  endY: number
  ampMax: number
  baseW: number
  spine: SpinePoint[]
}

interface Particle {
  angle: number
  maxDist: number
  size: number
  gold: boolean
  delay: number
}

const SPINE_STEPS = 400
const N_TURNS = 3.5

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}
function clamp(v: number, a: number, b: number) {
  return Math.min(b, Math.max(a, v))
}
function smooth(x: number) {
  x = clamp(x, 0, 1)
  return x * x * (3 - 2 * x)
}
function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3)
}
function easeOutExpo(x: number) {
  return x >= 1 ? 1 : 1 - Math.pow(2, -10 * x)
}

function buildWorld(W: number, H: number): World {
  const cx = W / 2
  const startY = H * 1.1
  const endY = H * 0.5 // dead center - where the chosen card also lands, and where the explosion fires from
  const ampMax = Math.min(W * 0.3, 320)
  const baseW = Math.max(16, Math.min(W, H) * 0.036)

  const spine: SpinePoint[] = []
  for (let i = 0; i <= SPINE_STEPS; i++) {
    const t = i / SPINE_STEPS
    const theta = 2 * Math.PI * N_TURNS * t
    // Tighter coil near the head, wider serpentine sway near the tail.
    const radius = ampMax * Math.pow(1 - t, 0.45)
    // Wavy at the bottom, compresses into a tight coil at the top.
    const squish = 0.08 + 0.92 * t * t
    const cy = startY - t * (startY - endY)
    const x = cx + radius * Math.cos(theta)
    const y = cy - radius * Math.sin(theta) * squish
    spine.push({ x, y, ang: 0 })
  }
  for (let k = 0; k < spine.length; k++) {
    const a = spine[Math.max(0, k - 2)]
    const b = spine[Math.min(spine.length - 1, k + 2)]
    spine[k].ang = Math.atan2(b.y - a.y, b.x - a.x)
  }

  return { W, H, cx, startY, endY, ampMax, baseW, spine }
}

function bodyRadius(u: number, baseW: number) {
  u = clamp(u, 0, 1)
  if (u < 0.06) return baseW * smooth(u / 0.06) * 0.4 // needle tail
  if (u > 0.94) return baseW * (0.9 + 0.3 * smooth((u - 0.94) / 0.06)) // bulbous head
  return baseW * (0.85 + 0.15 * Math.sin((Math.PI * (u - 0.06)) / 0.88)) // gentle swell
}

function drawDragon(ctx: CanvasRenderingContext2D, world: World, headT: number, alpha: number) {
  if (alpha <= 0.002) return
  const { spine, baseW } = world
  const bodyFraction = 0.38
  const tailT = Math.max(0, headT - bodyFraction)
  const headIdx = Math.round(headT * SPINE_STEPS)
  const tailIdx = Math.round(tailT * SPINE_STEPS)
  if (headIdx - tailIdx < 5) return

  ctx.save()
  ctx.globalAlpha = alpha

  // Body: overlapping gradient-filled scale segments along the spine
  // (rather than one filled ribbon) - each gets its own drop shadow and a
  // crescent highlight, which is what actually reads as individual scales
  // catching the light instead of a flat tube.
  const segSpacing = 3
  for (let k = tailIdx; k <= headIdx; k += segSpacing) {
    const u = (k - tailIdx) / (headIdx - tailIdx)
    const p = spine[k]
    const r = bodyRadius(u, baseW)

    ctx.beginPath()
    ctx.arc(p.x + r * 0.15, p.y + r * 0.2, r * 0.95, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(180,140,60,0.25)'
    ctx.fill()

    ctx.beginPath()
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
    const segGrad = ctx.createRadialGradient(p.x - r * 0.3, p.y - r * 0.3, r * 0.1, p.x, p.y, r)
    segGrad.addColorStop(0, '#fff8e7')
    segGrad.addColorStop(0.5, '#e8c97a')
    segGrad.addColorStop(1, '#b8923d')
    ctx.fillStyle = segGrad
    ctx.fill()

    ctx.beginPath()
    ctx.arc(p.x - r * 0.2, p.y - r * 0.2, r * 0.5, -Math.PI * 0.7, -Math.PI * 0.2)
    ctx.strokeStyle = 'rgba(255,250,235,0.4)'
    ctx.lineWidth = r * 0.12
    ctx.lineCap = 'round'
    ctx.stroke()
  }

  // Dorsal spines - small ridge fins along the back, skipped near the
  // tail tip and head where there's no body width to anchor them to.
  const spineInterval = Math.max(8, Math.floor((headIdx - tailIdx) / 18))
  for (let k = tailIdx + spineInterval; k < headIdx - 4; k += spineInterval) {
    const u = (k - tailIdx) / (headIdx - tailIdx)
    if (u < 0.15 || u > 0.88) continue
    const p = spine[k]
    const r = bodyRadius(u, baseW)
    const nx = -Math.sin(p.ang)
    const ny = Math.cos(p.ang)

    for (let s = -1; s <= 1; s++) {
      const sx = p.x + nx * (r * 0.7) + Math.cos(p.ang) * s * r * 0.4
      const sy = p.y + ny * (r * 0.7) + Math.sin(p.ang) * s * r * 0.4
      const tipX = sx + nx * r * 0.6
      const tipY = sy + ny * r * 0.6

      ctx.beginPath()
      ctx.moveTo(sx - Math.cos(p.ang) * r * 0.15, sy - Math.sin(p.ang) * r * 0.15)
      ctx.lineTo(tipX, tipY)
      ctx.lineTo(sx + Math.cos(p.ang) * r * 0.15, sy + Math.sin(p.ang) * r * 0.15)
      ctx.closePath()
      ctx.fillStyle = '#d4a843'
      ctx.fill()
    }
  }

  const legAnchors = [0.22, 0.4, 0.58, 0.76]
  const legSides = [1, -1, 1, -1]
  for (let li = 0; li < legAnchors.length; li++) {
    const t = legAnchors[li]
    if (t < tailT || t > headT) continue
    drawLeg(ctx, world, t, legSides[li], alpha)
  }

  drawHead(ctx, world, headT, alpha)
  ctx.restore()
}

function drawLeg(ctx: CanvasRenderingContext2D, world: World, t: number, side: number, alpha: number) {
  const { spine, baseW } = world
  const idx = Math.round(t * SPINE_STEPS)
  const p = spine[idx]
  const hw = bodyRadius(0.5, baseW) // mid-body thickness sets the leg's scale
  const nx = -Math.sin(p.ang)
  const ny = Math.cos(p.ang)
  const tx = Math.cos(p.ang)
  const ty = Math.sin(p.ang)

  const thighLen = baseW * 2.2
  const kneeX = p.x + nx * side * hw * 0.8 + tx * thighLen * 0.3
  const kneeY = p.y + ny * side * hw * 0.8 + ty * thighLen * 0.3
  const footX = p.x + nx * side * (hw * 0.8 + thighLen * 0.9)
  const footY = p.y + ny * side * (hw * 0.8 + thighLen * 0.9) + ty * thighLen * 0.2

  ctx.save()
  ctx.globalAlpha = alpha
  ctx.strokeStyle = '#c9a84c'
  ctx.lineWidth = baseW * 0.32
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  ctx.beginPath()
  ctx.moveTo(p.x + nx * side * hw * 0.6, p.y + ny * side * hw * 0.6)
  ctx.quadraticCurveTo(kneeX, kneeY, footX, footY)
  ctx.stroke()

  const toeLen = baseW * 0.9
  const toeAngles = [-0.55, 0, 0.55]
  for (const da of toeAngles) {
    const ang = p.ang + (Math.PI / 2) * side + da
    const clawX = footX + Math.cos(ang) * toeLen
    const clawY = footY + Math.sin(ang) * toeLen

    ctx.lineWidth = baseW * 0.18
    ctx.beginPath()
    ctx.moveTo(footX, footY)
    ctx.lineTo(clawX, clawY)
    ctx.stroke()

    ctx.fillStyle = '#a08030'
    ctx.beginPath()
    ctx.arc(clawX, clawY, baseW * 0.1, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

function drawWhiskers(ctx: CanvasRenderingContext2D, world: World, headIdx: number, alpha: number, tSec: number) {
  const { spine, baseW } = world
  const p = spine[headIdx]
  const hw = bodyRadius(1, baseW)
  const nx = -Math.sin(p.ang)
  const ny = Math.cos(p.ang)
  const tx = Math.cos(p.ang)
  const ty = Math.sin(p.ang)

  ctx.save()
  ctx.globalAlpha = alpha
  ctx.strokeStyle = 'rgba(255,248,220,0.85)'
  ctx.lineWidth = Math.max(1, baseW * 0.08)
  ctx.lineCap = 'round'

  for (let w = -1; w <= 1; w += 2) {
    const startX = p.x + tx * hw * 0.6 + nx * w * hw * 0.35
    const startY = p.y + ty * hw * 0.6 + ny * w * hw * 0.35

    ctx.beginPath()
    ctx.moveTo(startX, startY)

    for (let seg = 1; seg <= 6; seg++) {
      const segT = seg / 6
      const wave = Math.sin(tSec * 1.5 + seg * 0.8 + w) * hw * 0.15 * segT
      const wx = startX - tx * hw * segT * 2.5 + nx * w * hw * 0.5 * (1 - segT) + nx * wave
      const wy = startY - ty * hw * segT * 2.5 + ny * w * hw * 0.5 * (1 - segT) + ny * wave
      ctx.lineTo(wx, wy)
    }
    ctx.stroke()
  }
  ctx.restore()
}

function drawHead(ctx: CanvasRenderingContext2D, world: World, headT: number, alpha: number) {
  const { spine, baseW } = world
  const headIdx = Math.round(headT * SPINE_STEPS)
  const p = spine[headIdx]
  const hw = bodyRadius(1, baseW)
  const nx = -Math.sin(p.ang)
  const ny = Math.cos(p.ang)
  const tx = Math.cos(p.ang)
  const ty = Math.sin(p.ang)

  ctx.save()
  ctx.globalAlpha = alpha

  // Elongated snout
  const snoutLen = hw * 1.6
  const snoutX = p.x + tx * snoutLen
  const snoutY = p.y + ty * snoutLen

  ctx.beginPath()
  ctx.ellipse(snoutX, snoutY, hw * 0.75, hw * 0.45, p.ang, 0, Math.PI * 2)
  const snoutGrad = ctx.createRadialGradient(snoutX - tx * hw * 0.3, snoutY - ty * hw * 0.3, 2, snoutX, snoutY, hw * 0.8)
  snoutGrad.addColorStop(0, '#fffaf0')
  snoutGrad.addColorStop(0.6, '#f0cd80')
  snoutGrad.addColorStop(1, '#c9a84c')
  ctx.fillStyle = snoutGrad
  ctx.fill()

  // Cranium, behind the snout
  ctx.beginPath()
  ctx.ellipse(p.x - tx * hw * 0.2, p.y - ty * hw * 0.2, hw * 0.9, hw * 0.75, p.ang, 0, Math.PI * 2)
  const headGrad = ctx.createRadialGradient(p.x - tx * hw * 0.4, p.y - ty * hw * 0.4, 3, p.x, p.y, hw)
  headGrad.addColorStop(0, '#fff8e7')
  headGrad.addColorStop(0.5, '#e8c97a')
  headGrad.addColorStop(1, '#b8923d')
  ctx.fillStyle = headGrad
  ctx.fill()

  // Horns, curving back from the crown
  for (const side of [-1, 1]) {
    const bx = p.x + nx * side * hw * 0.4 - tx * hw * 0.3
    const by = p.y + ny * side * hw * 0.4 - ty * hw * 0.3
    const midX = bx + nx * side * hw * 1.2 - tx * hw * 0.5
    const midY = by + ny * side * hw * 1.2 - ty * hw * 0.5
    const tipX = bx + nx * side * hw * 0.8 - tx * hw * 1.8
    const tipY = by + ny * side * hw * 0.8 - ty * hw * 1.8

    ctx.strokeStyle = '#c9a84c'
    ctx.lineWidth = baseW * 0.22
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(bx, by)
    ctx.quadraticCurveTo(midX, midY, tipX, tipY)
    ctx.stroke()
  }

  // Eyes - slanted socket plus a shine
  const eyeOffset = hw * 0.35
  for (const side of [-1, 1]) {
    const exx = p.x + nx * side * eyeOffset + tx * hw * 0.15
    const eyy = p.y + ny * side * eyeOffset + ty * hw * 0.15

    ctx.fillStyle = '#2a1a08'
    ctx.beginPath()
    ctx.ellipse(exx, eyy, hw * 0.12, hw * 0.08, p.ang + side * 0.3, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.beginPath()
    ctx.arc(exx - tx * hw * 0.03, eyy - ty * hw * 0.03, hw * 0.035, 0, Math.PI * 2)
    ctx.fill()
  }

  // Nostrils
  const noseX = snoutX + tx * hw * 0.5
  const noseY = snoutY + ty * hw * 0.5
  for (const side of [-1, 1]) {
    ctx.fillStyle = '#8a6526'
    ctx.beginPath()
    ctx.arc(noseX + nx * side * hw * 0.15, noseY + ny * side * hw * 0.15, hw * 0.06, 0, Math.PI * 2)
    ctx.fill()
  }

  drawWhiskers(ctx, world, headIdx, alpha, performance.now() / 1000)
  ctx.restore()
}

function makeParticles(): Particle[] {
  const particles: Particle[] = []
  const N = 140
  for (let i = 0; i < N; i++) {
    particles.push({
      angle: Math.random() * Math.PI * 2,
      maxDist: lerp(140, 500, Math.random()),
      size: 2 + Math.random() * 7,
      gold: Math.random() < 0.28,
      delay: Math.random() * 0.15,
    })
  }
  return particles
}

function drawExplosion(ctx: CanvasRenderingContext2D, world: World, particles: Particle[], e: number, ex: number, ey: number) {
  if (e <= 0) return
  const { W, H } = world
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'

  const bloomEnv = e < 0.25 ? smooth(e / 0.25) : Math.max(0, 1 - (e - 0.25) / 0.6)
  if (bloomEnv > 0.001) {
    const R = Math.hypot(W, H) * 0.72
    const g = ctx.createRadialGradient(ex, ey, 0, ex, ey, R)
    g.addColorStop(0, `rgba(255,255,255,${(0.55 * bloomEnv).toFixed(3)})`)
    g.addColorStop(0.3, `rgba(255,244,214,${(0.28 * bloomEnv).toFixed(3)})`)
    g.addColorStop(1, 'rgba(255,244,214,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
  }

  const flashEnv = e < 0.18 ? smooth(e / 0.18) : Math.max(0, 1 - (e - 0.18) / 0.5)
  if (flashEnv > 0.001) {
    const R2 = lerp(20, Math.min(W, H) * 0.58, easeOutExpo(Math.min(1, e / 0.4)))
    const g2 = ctx.createRadialGradient(ex, ey, 0, ex, ey, R2)
    g2.addColorStop(0, `rgba(255,255,255,${flashEnv.toFixed(3)})`)
    g2.addColorStop(0.25, `rgba(255,245,220,${(flashEnv * 0.85).toFixed(3)})`)
    g2.addColorStop(0.6, `rgba(240,205,120,${(flashEnv * 0.35).toFixed(3)})`)
    g2.addColorStop(1, 'rgba(240,205,120,0)')
    ctx.fillStyle = g2
    ctx.beginPath()
    ctx.arc(ex, ey, R2, 0, Math.PI * 2)
    ctx.fill()
  }

  const ringE = clamp((e - 0.02) / 0.55, 0, 1)
  if (ringE > 0 && e < 0.9) {
    const R3 = lerp(10, Math.min(W, H) * 1.05, easeOutExpo(ringE))
    const ringAlpha = Math.max(0, 1 - ringE) * 0.8
    ctx.strokeStyle = `rgba(255,250,235,${ringAlpha.toFixed(3)})`
    ctx.lineWidth = lerp(18, 1, ringE)
    ctx.beginPath()
    ctx.arc(ex, ey, R3, 0, Math.PI * 2)
    ctx.stroke()
  }

  for (const pt of particles) {
    const pe = clamp((e - pt.delay) / (1 - pt.delay), 0, 1)
    if (pe <= 0) continue
    const dist = pt.maxDist * easeOutCubic(pe)
    const px = ex + Math.cos(pt.angle) * dist
    const py = ey + Math.sin(pt.angle) * dist
    const alphaP = pe < 0.6 ? 1 : Math.max(0, 1 - (pe - 0.6) / 0.4)
    if (alphaP <= 0.01) continue
    const size = pt.size * lerp(1, 0.35, pe)
    ctx.fillStyle = pt.gold ? `rgba(240,200,110,${alphaP.toFixed(3)})` : `rgba(255,255,255,${alphaP.toFixed(3)})`
    ctx.shadowColor = pt.gold ? 'rgba(240,200,110,0.85)' : 'rgba(255,255,255,0.9)'
    ctx.shadowBlur = size * 2.2
    ctx.beginPath()
    ctx.arc(px, py, Math.max(0.6, size), 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.shadowBlur = 0
  ctx.restore()
}

// --- component ---------------------------------------------------------

export default function CelestialDragonReveal({ onComplete }: CelestialDragonRevealProps) {
  const [stage, setStage] = useState<Stage>('cards-in')
  const [chosenIndex] = useState(() => Math.floor(Math.random() * CARD_COUNT))
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const timeouts = useRef<number[]>([])
  const rafRef = useRef<number>()
  const startRef = useRef<number | null>(null)
  const doneRef = useRef(false)

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    timeouts.current.forEach((id) => window.clearTimeout(id))
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    onComplete()
  }

  useEffect(() => {
    const after = (ms: number, fn: () => void) => {
      timeouts.current.push(window.setTimeout(fn, ms))
    }
    after(T_CARDS_IN, () => setStage('searching'))
    after(T_SEARCHING, () => setStage('selecting'))
    after(T_SELECTING, () => setStage('exploding'))
    after(T_EXPLODING, () => setStage('fading'))
    after(T_DONE, finish)

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let world = buildWorld(window.innerWidth, window.innerHeight)
    const particles = makeParticles()

    const resize = () => {
      const DPR = window.devicePixelRatio || 1
      const W = window.innerWidth
      const H = window.innerHeight
      canvas.width = Math.round(W * DPR)
      canvas.height = Math.round(H * DPR)
      canvas.style.width = `${W}px`
      canvas.style.height = `${H}px`
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      world = buildWorld(W, H)
    }
    resize()
    window.addEventListener('resize', resize)

    const frame = (now: number) => {
      if (startRef.current === null) startRef.current = now
      const elapsedMs = now - startRef.current
      ctx.clearRect(0, 0, world.W, world.H)

      if (elapsedMs < T_SELECTING) {
        const headT = easeOutCubic(clamp(elapsedMs / T_SELECTING, 0, 1))
        const dragonAlpha = Math.min(1, elapsedMs / 300)
        drawDragon(ctx, world, headT, dragonAlpha)
      } else if (elapsedMs < T_EXPLODING) {
        const ee = (elapsedMs - T_SELECTING) / EXPLODING_MS
        const dragonAlpha = Math.max(0, 1 - ee / 0.12)
        if (dragonAlpha > 0.001) drawDragon(ctx, world, 1, dragonAlpha)
        drawExplosion(ctx, world, particles, Math.min(ee, 1), world.cx, world.endY)
      }

      if (elapsedMs < T_DONE) rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)

    return () => {
      timeouts.current.forEach((id) => window.clearTimeout(id))
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Skip the reveal animation"
      onClick={finish}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') finish()
      }}
      className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-black"
    >
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {Array.from({ length: CARD_COUNT }, (_, i) => i).map((i) => {
          const isChosen = i === chosenIndex
          const offsetUnits = i - (CARD_COUNT - 1) / 2 // -1.5, -0.5, 0.5, 1.5
          const restX = `${offsetUnits * 130}%`
          const scatterX = `${offsetUnits * 220}%`

          const animate =
            stage === 'cards-in'
              ? { opacity: 1, y: 0, scale: 1, x: restX, transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' as const } }
              : stage === 'searching'
                ? { opacity: 1, y: 0, scale: 1, x: restX, transition: { duration: 0.3 } }
                : isChosen
                  ? {
                      opacity: stage === 'fading' ? 0 : 1,
                      x: 0,
                      y: 0,
                      scale: stage === 'selecting' ? 1.18 : 1.32,
                      transition: { duration: stage === 'selecting' ? 0.55 : 0.35, ease: 'easeOut' as const },
                    }
                  : {
                      opacity: 0,
                      x: scatterX,
                      y: 24,
                      scale: 0.55,
                      transition: { duration: 0.45, ease: 'easeIn' as const },
                    }

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24, scale: 0.8, x: restX }}
              animate={animate}
              className="absolute"
            >
              <div className="celestial-float-card flex h-24 w-16 flex-col items-center justify-center rounded-xl border-2 border-amber-200/60 bg-gradient-to-br from-slate-100 via-white to-amber-50 sm:h-32 sm:w-20">
                <span className="text-2xl sm:text-3xl">✨</span>
                <span className="celestial-shimmer-text mt-1 text-[9px] font-black uppercase tracking-widest sm:text-[10px]">
                  Celestial
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {stage === 'searching' ? (
        <p className="pointer-events-none absolute bottom-24 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/70 sm:bottom-28">
          A Celestial stirs...
        </p>
      ) : null}

      <p className="pointer-events-none absolute bottom-6 text-[11px] text-slate-500">Tap to skip</p>
    </div>
  )
}
