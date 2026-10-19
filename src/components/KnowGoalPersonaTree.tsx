import { useEffect, useState } from 'react'
import { usePathStore } from '../store/usePathStore'

/**
 * The "I Know My Goal" persona's visual on RoleSelectionPage.tsx - the way
 * StudentPersonaCube.tsx is Student's and StudentHubPigeonholes.tsx is
 * Student Hub's.
 *
 * A constellation: a branching tree of stars rooted at "you are here", with
 * a line that draws itself up the branches to a goal star, lighting every
 * waypoint as it passes. Which is the persona in one gesture - name the
 * destination, see the exact path that reaches it. Descended from the route
 * map in the persona specimen artifact (claude.ai/code/artifact/3997e334),
 * though little of that version's styling survives.
 *
 * It is drawn ON A SKY, which is the one thing that makes it read as a
 * constellation rather than as a branching diagram (explicit request: "make
 * it look like a constellation"). Slate lines and outlined dots on the
 * card's white ground are a flowchart no matter how they're arranged; the
 * same points as glowing stars over a dark field are a star chart
 * immediately. The sky is a radial wash that fades to fully transparent
 * well before the stage's edge, so it sits as a patch of night ON the
 * bright card rather than as a dark panel cut into it - no hard edge
 * anywhere, which is also why it doesn't fight the light/bright identity
 * the rest of the carousel keeps.
 *
 * Star brightness carries the meaning, the way it does on a real chart: the
 * six ending points and the root are the bright ones (bigger, glowing, with
 * four-point diffraction spikes), and the waypoints between them are faint
 * until a route lights them.
 *
 * No focusable children here, deliberately: this renders INSIDE
 * PersonaCard.tsx's own <button>, where a nested tabindex would be invalid
 * markup and would also fight the carousel's arrow-key handling. Pointer
 * hover only, exactly like the cube's faces.
 */

type Pt = [number, number]

/* A tree, not a scatter: every node past the root hangs off exactly ONE
   parent, and depth reads straight off y. The left subtree is held to
   x <= 116 and the right to x >= 142, which is what guarantees no two
   branches can ever cross. Coordinates are on a 0 0 250 250 grid; the
   viewBox below crops it. */
const NODES: Pt[] = [
  [124, 230], /*  0  root - you are here */
  [86, 190], [166, 186], /*  1-2   depth 1 */
  [44, 154], [100, 148], [148, 142], [204, 156], /*  3-6   depth 2 */
  [28, 112], [74, 106], [112, 100], [142, 96], [186, 112], [228, 120], /*  7-12  depth 3 */
  [34, 64], [58, 48], [116, 52], [158, 36], [196, 66], /* 13-17  depth 4 */
]

/** parent -> child, the whole skeleton. Some nodes carry one child and some
 * two: a tree that forks identically everywhere reads as a diagram. */
const EDGES: [number, number][] = [
  [0, 1], [0, 2],
  [1, 3], [1, 4], [2, 5], [2, 6],
  [3, 7], [4, 8], [4, 9], [5, 10], [6, 11], [6, 12],
  [7, 13], [8, 14], [9, 15], [10, 16], [11, 17],
]

/** The field the chart hangs in: x, y, radius. Deliberately much smaller
 * and dimmer than any charted star, and scattered across the whole frame
 * rather than kept to the margins - a constellation without a field behind
 * it is just a shape, and at this size there's no risk of mistaking a
 * 0.8-unit speck for a 3.4-unit star with a glow on it. */
const FIELD: [number, number, number][] = [
  [8, 30, 0.8], [26, 76, 1.1], [18, 130, 0.7], [12, 190, 1], [30, 222, 0.8],
  [52, 14, 0.9], [44, 96, 0.7], [62, 170, 1.1], [70, 236, 0.8], [88, 40, 0.7],
  [96, 122, 1], [80, 200, 0.7], [108, 16, 1.1], [118, 70, 0.8], [104, 174, 0.9],
  [122, 210, 0.7], [136, 46, 1], [130, 122, 0.8], [144, 180, 0.7], [152, 228, 1.1],
  [166, 24, 0.8], [160, 98, 0.7], [174, 146, 1], [182, 196, 0.8], [196, 36, 1.1],
  [190, 88, 0.7], [204, 128, 0.9], [212, 176, 0.7], [224, 60, 1], [232, 104, 0.8],
  [238, 150, 1.1], [228, 206, 0.7], [244, 34, 0.9], [246, 190, 0.8],
]

const PARENT: number[] = NODES.map(() => -1)
EDGES.forEach(([from, to]) => {
  PARENT[to] = from
})
const HAS_CHILD = new Set(EDGES.map(([from]) => from))

interface Route {
  /** The tip this route ends at - also its id, since one tip has one route. */
  tip: number
  ids: number[]
  points: string
  /** Arrival time at each node, in ms from the start of the draw - what
   * lets the waypoints light in sequence with nothing but a CSS delay. */
  at: number[]
  ms: number
}

/** Every ending part of the tree: a node nothing hangs off. Each one is a
 * bright star you can pick, and each gets its own route back to the root. */
const ROUTES: Route[] = NODES.map((_, i) => i)
  .filter((i) => i !== 0 && !HAS_CHILD.has(i))
  .map((tip) => {
    const ids: number[] = []
    for (let i = tip; i >= 0; i = PARENT[i]) ids.unshift(i)
    const cum = [0]
    let total = 0
    for (let i = 1; i < ids.length; i++) {
      const a = NODES[ids[i - 1]]
      const b = NODES[ids[i]]
      total += Math.hypot(b[0] - a[0], b[1] - a[1])
      cum.push(total)
    }
    const ms = Math.round(Math.min(1800, Math.max(720, total * 5.52)))
    return {
      tip,
      ids,
      points: ids.map((id) => `${NODES[id][0]},${NODES[id][1]}`).join(' '),
      at: cum.map((c) => Math.round((c / total) * ms)),
      ms,
    }
  })

/** How long a traced route holds before the idle cycle moves on. Tight
 * against the longest draw (1800ms) on purpose: the next destination should
 * start naming itself almost as soon as the last one lands. */
const CYCLE_MS = 2400
/** Four-point diffraction spikes, drawn around 0,0 so they can just be
 * translated onto whichever star they belong to. What a bright star looks
 * like through a telescope, and the cheapest possible signal for "this one
 * is a destination" on a chart where everything else is a dot. */
const SPIKES = 'M0,-13 Q1.6,-1.6 13,0 Q1.6,1.6 0,13 Q-1.6,1.6 -13,0 Q-1.6,-1.6 0,-13 Z'

export default function KnowGoalPersonaTree({ className }: { className?: string }) {
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  // Which star the pointer is on - holds its route on screen (and stops the
  // idle cycle) for as long as it's there, so picking a destination sticks.
  const [hovered, setHovered] = useState<number | null>(null)
  const [idle, setIdle] = useState(0)

  useEffect(() => {
    if (reduceMotion || hovered !== null) return
    const timer = window.setInterval(() => setIdle((i) => (i + 1) % ROUTES.length), CYCLE_MS)
    return () => window.clearInterval(timer)
  }, [reduceMotion, hovered])

  // Under reduce-motion `idle` never advances and the CSS drops every
  // transition, so this is simply one route shown already drawn - the same
  // "posed, not animated" fallback the other persona visuals use.
  const active = ROUTES.find((r) => r.tip === hovered) ?? ROUTES[idle % ROUTES.length]
  // node id -> when the line reaches it. Anything not in here is unlit.
  const arrivals = new Map(active.ids.map((id, i) => [id, active.at[i]]))

  return (
    <div className={`goal-tree-stage ${className ?? ''}`} data-reduce-motion={reduceMotion ? 'true' : undefined}>
      <span className="goal-tree-sky" aria-hidden="true" />

      {/* Cropped to the drawing itself (plus room for the glows and the
          arrival pulse) rather than framed at the full 250x250 the
          coordinates are authored on - that last sliver of empty margin is
          what otherwise makes this read as a smaller object than the cube
          and the earth beside it. Crops, so no coordinate has to move. */}
      <svg className="goal-tree-svg" viewBox="14 16 232 232" aria-hidden="true">
        <defs>
          {/* Soft halation around a bright star - a filled radial fade, not
              a stroked ring, which is the difference between a star and a
              target symbol. */}
          <radialGradient id="goalStarGlow">
            <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.85" />
            <stop offset="38%" stopColor="#c7d2fe" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#a5b4fc" stopOpacity="0" />
          </radialGradient>
          {/* Indigo at the root, pale violet at the tip. In bounding-box
              units, so one gradient serves every route regardless of which
              way it leans - they all travel bottom to top. */}
          <linearGradient id="goalTreeRouteGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#e9d5ff" />
          </linearGradient>
        </defs>

        {FIELD.map(([x, y, r], i) => (
          <circle
            key={`field-${i}`}
            className="goal-tree-field"
            cx={x}
            cy={y}
            r={r}
            style={{ animationDelay: `${(i * 370) % 4200}ms`, animationDuration: `${3400 + (i % 5) * 420}ms` }}
          />
        ))}

        {/* Skeleton first, so the bright stroke always lands on top of the
            branch it is travelling along rather than beside it. */}
        {EDGES.map(([from, to]) => (
          <line
            key={`edge-${from}-${to}`}
            className="goal-tree-branch"
            x1={NODES[from][0]}
            y1={NODES[from][1]}
            x2={NODES[to][0]}
            y2={NODES[to][1]}
          />
        ))}

        {ROUTES.map((route) => {
          const on = route.tip === active.tip
          // pathLength=1 normalises every route to the same dash space, so
          // the draw is pure CSS (dashoffset 1 -> 0) with no per-frame JS at
          // all; the real length only comes back in as the duration.
          const style = { transitionDuration: `${route.ms}ms, 540ms` }
          return (
            <g key={`route-${route.tip}`}>
              <polyline className="goal-tree-route glow" points={route.points} pathLength={1} data-active={on} style={style} />
              <polyline className="goal-tree-route" points={route.points} pathLength={1} data-active={on} style={style} />
            </g>
          )
        })}

        {NODES.map((p, i) => {
          const arrival = arrivals.get(i)
          // The root is the one fixed point - it always reads as lit.
          const lit = i === 0 || arrival !== undefined
          const tip = i !== 0 && !HAS_CHILD.has(i)
          const bright = tip || i === 0
          const delay = { transitionDelay: i === 0 ? '0ms' : `${arrival ?? 0}ms` }
          const landed = tip && i === active.tip
          return (
            <g key={`star-${i}`}>
              {bright ? <circle className="goal-tree-glow" cx={p[0]} cy={p[1]} r={13} data-lit={lit} style={delay} /> : null}
              {landed && !reduceMotion ? (
                <circle
                  className="goal-tree-pulse"
                  cx={p[0]}
                  cy={p[1]}
                  r={5}
                  style={{ animationDelay: `${active.ms}ms` }}
                />
              ) : null}
              {/* The translate lives on a wrapping <g>, not on the path
                  itself: the spikes scale up as they flare, and CSS composes
                  the individual `scale` property BEFORE an element's own
                  `transform` - so a translate on the path would be scaled
                  along with it and drag the spikes off their star towards
                  the viewBox origin. Split across two elements, each
                  transform is on its own. */}
              {bright ? (
                <g transform={`translate(${p[0]} ${p[1]})`}>
                  <path className="goal-tree-spikes" d={SPIKES} data-lit={lit} style={delay} />
                </g>
              ) : null}
              <circle
                className="goal-tree-star"
                cx={p[0]}
                cy={p[1]}
                r={tip ? 3.4 : i === 0 ? 3.6 : 2}
                data-lit={lit}
                data-kind={tip ? 'tip' : i === 0 ? 'root' : 'waypoint'}
                style={delay}
              />
              {tip ? (
                <circle
                  className="goal-tree-hit"
                  cx={p[0]}
                  cy={p[1]}
                  r={14}
                  onPointerEnter={() => setHovered(i)}
                  onPointerLeave={() => setHovered(null)}
                />
              ) : null}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
