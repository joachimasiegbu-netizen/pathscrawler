import { useEffect, useRef } from 'react'
import { usePathStore } from '../store/usePathStore'

/**
 * Verbatim port of the "Isometric Hue Cube" CSS/JS artifact
 * (claude.ai/code/artifact/c07e7041) - a real 3x3x3 lattice of voxels, each
 * with 5 real 3D faces, that spins on its Y axis while the full hue wheel
 * cycles over it and random rows/columns twist a quarter-turn at a time like
 * a Rubik's cube. The original was one standalone HTML page; here the <style>
 * lives in index.css (classes prefixed `student-cube-*`, keyframes renamed,
 * so nothing collides with the source's generic `.face` / `@keyframes
 * animate`) and the DOM-building script is the useEffect below.
 *
 * Used on RoleSelectionPage.tsx as the Student persona - shown standalone on
 * the page rather than inside a PersonaCard, per explicit request.
 */

const UNIT = 42
const GAP = 14
const SPACING = UNIT + GAP
const HALF = UNIT / 2
const AXIS = [-SPACING, 0, SPACING]
const SIDE_NAMES = ['front', 'right', 'back', 'left']
const TURN_DURATION = 650

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// Rotates a 2D pair around the origin - row turns rotate a voxel's (x, z)
// around Y, column turns rotate (y, z) around X. z is shared since depth is
// the axis every turn pivots around regardless of which other it belongs to.
function rotate2D(a: number, b: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)
  return [a * cos - b * sin, a * sin + b * cos]
}

// Trig on a 90deg multiple leaves tiny float error (55.99999998, not 56)
// that would compound with every later turn - snap back onto the exact
// lattice value once a turn finishes instead of trusting the raw float.
function snapToAxis(value: number) {
  let nearest = AXIS[0]
  AXIS.forEach((candidate) => {
    if (Math.abs(candidate - value) < Math.abs(nearest - value)) nearest = candidate
  })
  return nearest
}

interface Voxel {
  x: number
  y: number
  z: number
  faces: HTMLDivElement[]
}

export default function StudentPersonaCube({ className }: { className?: string }) {
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const prefersReducedMotion =
      reduceMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function buildFace(faceClass: string, localTransform: string) {
      const face = document.createElement('div')
      face.className = 'student-cube-face ' + faceClass
      face.dataset.local = localTransform
      return face
    }

    // Writes one voxel's CURRENT x/y/z (its lattice slot, mutated by
    // turnLayer) out to its 5 real DOM faces. extraTransform is the
    // in-progress layer-turn rotation while this voxel's row/column is
    // actively turning, omitted once it's settled.
    function renderVoxel(voxel: Voxel, extraTransform?: string) {
      const base =
        'translate3d(' +
        (voxel.x - HALF) +
        'px,' +
        (voxel.y - HALF) +
        'px,' +
        voxel.z +
        'px) ' +
        (extraTransform || '')
      voxel.faces.forEach((face) => {
        face.style.transform = base + (face.dataset.local || '')
      })
    }

    // 27 lattice positions x 5 faces each (4 sides + top) = 135 faces, all
    // direct siblings under one preserve-3d level.
    const voxels: Voxel[] = []
    const frag = document.createDocumentFragment()
    AXIS.forEach((x) => {
      AXIS.forEach((y) => {
        AXIS.forEach((z) => {
          const faces: HTMLDivElement[] = []
          for (let i = 0; i < 4; i++) {
            const side = buildFace(
              SIDE_NAMES[i],
              'rotateY(' + 90 * i + 'deg) translateZ(' + HALF + 'px)',
            )
            faces.push(side)
            frag.appendChild(side)
          }
          const top = buildFace('top', 'rotateX(90deg) translateZ(' + HALF + 'px)')
          faces.push(top)
          frag.appendChild(top)
          const voxel: Voxel = { x, y, z, faces }
          voxels.push(voxel)
          renderVoxel(voxel)
        })
      })
    })
    mount.appendChild(frag)

    let timeoutId = 0
    let rafId = 0

    // Layer turns: the "rows and columns move independently" mechanic,
    // driven by JS since CSS keyframes can't reassign which voxels belong to
    // a group at runtime the way a real cube's turning face does.
    function turnLayer(
      axis: 'row' | 'column',
      layerValue: number,
      direction: number,
      onDone?: () => void,
    ) {
      const group = voxels.filter((v) => (axis === 'row' ? v.y === layerValue : v.x === layerValue))
      // Each voxel's own starting pair, captured once - rotate2D is applied
      // fresh from this fixed starting point every frame (angle grows from
      // 0), not accumulated frame-over-frame, so there's nothing to drift.
      const origins = group.map((v) => (axis === 'row' ? [v.x, v.z] : [v.y, v.z]))
      const start = performance.now()

      function tick(now: number) {
        const progress = Math.min((now - start) / TURN_DURATION, 1)
        const angle = direction * 90 * easeInOutCubic(progress)
        const turnPrefix = (axis === 'row' ? 'rotateY(' : 'rotateX(') + angle + 'deg) '
        group.forEach((voxel, i) => {
          const pair = rotate2D(origins[i][0], origins[i][1], angle)
          if (axis === 'row') {
            voxel.x = pair[0]
            voxel.z = pair[1]
          } else {
            voxel.y = pair[0]
            voxel.z = pair[1]
          }
          renderVoxel(voxel, turnPrefix)
        })
        if (progress < 1) {
          rafId = requestAnimationFrame(tick)
          return
        }
        // Snap to the exact lattice and drop the temporary turn rotation -
        // faces land on a fresh standard orientation after every turn, which
        // makes colors shuffle around the same way a real scrambled cube's
        // do (a face's color here is tied to a fixed direction class, not to
        // a physical "sticker").
        group.forEach((voxel) => {
          voxel.x = snapToAxis(voxel.x)
          voxel.y = snapToAxis(voxel.y)
          voxel.z = snapToAxis(voxel.z)
          renderVoxel(voxel)
        })
        if (onDone) onDone()
      }
      rafId = requestAnimationFrame(tick)
    }

    // Auto-scrambles forever: pick a random row or column layer, turn it a
    // quarter turn one way or the other, pause, repeat. Turns run strictly
    // one at a time (the next is only scheduled from the previous one's
    // onDone) so a voxel is never mid-turn on two axes at once.
    function scheduleNextTurn() {
      timeoutId = window.setTimeout(
        () => {
          const axis: 'row' | 'column' = Math.random() < 0.5 ? 'row' : 'column'
          const layerValue = AXIS[Math.floor(Math.random() * AXIS.length)]
          const direction = Math.random() < 0.5 ? 1 : -1
          turnLayer(axis, layerValue, direction, scheduleNextTurn)
        },
        900 + Math.random() * 600,
      )
    }

    if (!prefersReducedMotion) {
      scheduleNextTurn()
    }

    return () => {
      window.clearTimeout(timeoutId)
      cancelAnimationFrame(rafId)
      mount.replaceChildren()
    }
  }, [reduceMotion])

  return (
    <div className={`student-cube-stage ${className ?? ''}`}>
      {/* perspective lives on .student-cube-scene (an ancestor), never on
          the preserve-3d element itself. The hue-rotate filter is one level
          further out still, on .student-cube-stage - animating filter on
          either the preserve-3d element or the one carrying perspective
          flattens the 3D rendering context and breaks depth-sorting across
          the 135 faces. */}
      <div className="student-cube-scene" data-reduce-motion={reduceMotion ? 'true' : undefined}>
        <div className="student-cube-trail" />
        <div className="student-cube-rubik" ref={mountRef} />
      </div>
    </div>
  )
}
