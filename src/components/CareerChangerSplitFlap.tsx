import { useEffect, useRef } from 'react'
import { usePathStore } from '../store/usePathStore'

/**
 * The Career Changer persona's visual on RoleSelectionPage.tsx - the way
 * StudentPersonaCube.tsx is Student's and KnowGoalPersonaTree.tsx is I Know
 * My Goal's. Port of the "Split-flap board" specimen in the persona artifact
 * (claude.ai/code/artifact/3997e334): a six-cell Solari board riffling
 * between real job titles, one change of field per flip.
 *
 * Driven imperatively in one rAF loop, like the specimen - each flip mounts
 * a short-lived half-flap element, which is far cheaper as raw DOM than as
 * React state re-rendering every 58ms.
 *
 * No focusable children: this renders INSIDE PersonaCard.tsx's own
 * <button>. Pointer hover only - flips now, then keeps riffling fast.
 */

/* Interleaved by sector so consecutive flips read as a change of field.
   WELDER first: the board initialises from WORDS[0], and at six letters it
   fills every cell, so the smiley arrives as something that happens rather
   than as a permanent sixth character. Keep new titles to five or six
   letters - a four-letter one reads as a gap, not a sign-off. */
const WORDS = [
  'WELDER', 'NURSE', 'CODER', 'DRIVER', 'MEDIC', 'BAKER',
  'TAILOR', 'TUTOR', 'CARER', 'DOCTOR', 'MINER', 'MASON',
  'LAWYER', 'SMITH', 'JUDGE', 'FARMER', 'COACH', 'ACTOR',
  'JOINER', 'TILER', 'GUARD', 'ARTIST', 'CLERK', 'AGENT',
  'SAILOR', 'BUYER', 'GUIDE', 'RANGER', 'SCOUT', 'DIVER',
  'WRITER', 'MODEL', 'NANNY', 'BARBER', 'USHER', 'VALET',
  'FITTER', 'CADET', 'RIDER', 'ROOFER', 'PILOT', 'BROKER',
]
const POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
/* U+263A, the text-presentation smiley rather than the emoji, so it takes
   the cell's phosphor green and mono metrics. Fills the spare flap on a
   five-letter title so it reads as deliberate, not truncated. */
const SMILEY = '☺'
const CELLS = 6
const STEP = 58
const STAGGER = 52
const IDLE = 2400
const HOVER_IDLE = 650

function charAt(word: string, i: number) {
  return i < word.length ? word[i] : SMILEY
}

interface CellState {
  el: HTMLSpanElement
  glyph: HTMLSpanElement
  queue: string[]
  acc: number
  wait: number
}

export default function CareerChangerSplitFlap({ className }: { className?: string }) {
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const boardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const board = boardRef.current
    if (!board) return
    const osReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const still = reduceMotion || osReduce

    board.replaceChildren()
    const cells: CellState[] = []
    for (let i = 0; i < CELLS; i++) {
      const el = document.createElement('span')
      el.className = 'career-flap-cell'
      const glyph = document.createElement('span')
      glyph.className = 'career-flap-glyph'
      glyph.textContent = charAt(WORDS[0], i)
      el.appendChild(glyph)
      board.appendChild(el)
      cells.push({ el, glyph, queue: [], acc: 0, wait: 0 })
    }

    // Reduced motion: a composed static board (the full six-letter first
    // title), not a frozen mid-riffle frame.
    if (still) return () => board.replaceChildren()

    const setChar = (c: CellState, ch: string) => {
      const old = c.glyph.textContent ?? ''
      c.glyph.textContent = ch
      if (old === ch) return
      const flap = document.createElement('span')
      flap.className = 'career-flap-flap'
      const inner = document.createElement('span')
      inner.className = 'career-flap-glyph'
      inner.textContent = old
      flap.appendChild(inner)
      c.el.appendChild(flap)
      flap.addEventListener('animationend', () => flap.remove())
    }

    let wordIdx = 0
    let idleAcc = 0
    let hovered = false

    const advance = () => {
      wordIdx = (wordIdx + 1) % WORDS.length
      const word = WORDS[wordIdx]
      cells.forEach((c, i) => {
        const steps = 3 + Math.floor(Math.random() * 4)
        c.queue = []
        for (let s = 0; s < steps; s++) c.queue.push(POOL[Math.floor(Math.random() * POOL.length)])
        c.queue.push(charAt(word, i))
        c.acc = 0
        c.wait = i * STAGGER
      })
      idleAcc = 0
    }

    const onEnter = () => {
      hovered = true
      advance()
    }
    const onLeave = () => {
      hovered = false
    }
    board.addEventListener('pointerenter', onEnter)
    board.addEventListener('pointerleave', onLeave)

    let raf = 0
    let last = 0
    const frame = (now: number) => {
      const dt = last ? Math.min(50, now - last) : 16
      last = now
      let busy = false
      cells.forEach((c) => {
        if (c.wait > 0) {
          c.wait -= dt
          busy = true
          return
        }
        if (!c.queue.length) return
        busy = true
        c.acc += dt
        while (c.acc >= STEP && c.queue.length) {
          c.acc -= STEP
          setChar(c, c.queue.shift() as string)
        }
      })
      if (!busy) {
        idleAcc += dt
        if (idleAcc >= (hovered ? HOVER_IDLE : IDLE)) advance()
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      board.removeEventListener('pointerenter', onEnter)
      board.removeEventListener('pointerleave', onLeave)
      board.replaceChildren()
    }
  }, [reduceMotion])

  return (
    <div className={`career-flap-stage ${className ?? ''}`}>
      <div ref={boardRef} className="career-flap-board" aria-hidden="true" />
    </div>
  )
}
