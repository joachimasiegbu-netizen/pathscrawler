import { CSSProperties, ReactNode, useEffect, useState } from 'react'
import { usePathStore } from '../store/usePathStore'

/** MobileContainer.tsx's page backdrop (every normal page - not the "game
 * mode" forceDarkBg pages, which keep their own dark radial gradient). Per
 * explicit request: cycle through every background pattern the user pasted
 * (a set of decorative CSS-only textures/effects), crossfading from one to
 * the next every 10 seconds, at a low enough opacity to read as background
 * texture rather than foreground decoration ("more subtle" than the single
 * static pattern this replaced).
 *
 * Each pattern is reproduced as given (same shapes/colors/keyframe timings),
 * not recolored to the app's own brand palette like the single pattern this
 * replaces was - the overall OPACITY wrapper below is what keeps the effect
 * subtle regardless of which pattern's own native colors are showing, so
 * every one of them can stay faithful to its source without a per-pattern
 * retint. Two exceptions: the rain overlay's backdrop-filter bloom and the
 * blob layer's animated/hue-cycling filter + spinning backdrop-filter were
 * all dropped (see RainBloomLayer/BlobLayer below) - animating filter or
 * backdrop-filter over content that's continuously moving underneath forces
 * a full-viewport re-blur on every frame, which is what was actually
 * causing the app-wide jank this file was reported for. */

const CYCLE_INTERVAL_MS = 10000
const FADE_MS = 1500
// Constant multiplier applied to every pattern's own native colors - this,
// not per-pattern color tuning, is what makes "all 6 of these very
// different effects" read as one consistent backdrop. History: 0.035
// (near-invisible) -> 0.12 (explicit "make background more visible") ->
// 0.07 here (explicit "all the backgrounds are gray, make them bright") -
// several of these patterns are black/grayscale-toned (herringbone, both
// rain variants) regardless of opacity, so 0.12 of them plus the page's
// own base tone was reading as an overall gray wash; splitting the
// difference keeps the texture visible without that cast, paired with
// brightening the base background token itself (tailwind.config.js).
const OVERALL_OPACITY = 0.07

// ---------------------------------------------------------------------
// Pattern 1: diagonal checker (the user's first pasted snippet)
// ---------------------------------------------------------------------
function CheckerLayer() {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          'linear-gradient(45deg, transparent 33.33%, rgba(57,144,179,0.1) 33.33%, rgba(0,0,0,0.1) 66.66%, transparent 66.66%)',
        backgroundColor: 'lightblue',
        backgroundSize: '20px 20px',
      }}
    />
  )
}

// ---------------------------------------------------------------------
// Pattern 2: scalloped corner-radial weave (second pasted snippet)
// ---------------------------------------------------------------------
const SCALLOP_STOPS =
  '#355c7d 4% 14%, #f8b195 14% 24%, #355c7d 22% 34%, #f8b195 34% 44%, #355c7d 44% 56%, ' +
  '#f8b195 56% 66%, #355c7d 66% 76%, #f8b195 76% 86%, #355c7d 86% 96%'
function ScallopLayer() {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `radial-gradient(100% 100% at 100% 0, #f8b195 4%, ${SCALLOP_STOPS}, #0008 96%, #0000), radial-gradient(100% 100% at 0 100%, #0000, #0008 4%, ${SCALLOP_STOPS}, #f8b195 96%)`,
        backgroundColor: '#f8b195',
        backgroundSize: '100px 100px',
      }}
    />
  )
}

// ---------------------------------------------------------------------
// Pattern 3: herringbone/chevron weave (third pasted snippet - identical
// across the 3 copies pasted, so only one copy is reproduced here)
// ---------------------------------------------------------------------
const HERRINGBONE_IMAGE = [
  'conic-gradient(from 122deg at 50% 85.15%, #000 0 58deg, #1e1e1e 0 116deg, #fff0 0 100%)',
  'conic-gradient(from 122deg at 50% 72.5%, #ededee 0 116deg, #fff0 0 100%)',
  'conic-gradient(from 58deg at 82.85% 50%, #1e1e1e 0 64deg, #fff0 0 100%)',
  'conic-gradient(from 58deg at 66.87% 50%, #ededee 0 64deg, #000 0 130deg, #fff0 0 100%)',
  'conic-gradient(from 238deg at 17.15% 50%, #000 0 64deg, #fff0 0 100%)',
  'conic-gradient(from 172deg at 33.13% 50%, #1e1e1e 0 66deg, #ededee 0 130deg, #fff0 0 100%)',
  'linear-gradient(98deg, #1e1e1e 0 15%, #fff0 calc(15% + 1px) 100%)',
  'linear-gradient(-98deg, #000 0 15%, #fff0 calc(15% + 1px) 100%)',
  'conic-gradient(from -58deg at 50.25% 14.85%, #1e1e1e 0 58deg, #000 0 116deg, #fff0 0 100%)',
  'conic-gradient(from -58deg at 50% 28.125%, #ededee 0 116deg, #fff0 0 100%)',
  'linear-gradient(90deg, #000 0 50%, #1e1e1e 0 100%)',
].join(', ')
function HerringboneLayer() {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: HERRINGBONE_IMAGE,
        // The source's `--gp: 50% / calc(var(--u)*16.9) calc(var(--u)*12.8)`
        // with `--u: 5px` resolves to a flat 50% position + 84.5x64px size,
        // identical for every layer above - one shared position/size pair
        // instead of repeating `var(--gp)` after each gradient.
        backgroundPosition: '50%',
        backgroundSize: '84.5px 64px',
      }}
    />
  )
}

// ---------------------------------------------------------------------
// Patterns 4 & 6: the "rain" streak effect (both pasted rain snippets
// share this exact base .container recipe - they only differ in their
// ::after overlay, built separately below). The source's own @keyframes
// gives 36 explicit from/to background-position pairs (one per streak
// layer); every one of them reduces cleanly to
// `to = from + loopMultiplier * tileHeight` (verified against all 36
// given pairs), so the table below carries just the 4 numbers per group
// that table actually varies by, instead of the full 72-pair source list.
// ---------------------------------------------------------------------
const RAIN_COLOR = '#09f'
// [tileHeight, leftEdgeFromY, middleDotFromY, loopMultiplier]
const RAIN_GROUPS: Array<[number, number, number, number]> = [
  [235, 220, 337.5, 28],
  [252, 24, 150, 54],
  [150, 16, 91, 36],
  [253, 224, 350.5, 67],
  [204, 19, 121, 25],
  [134, 120, 187, 62],
  [179, 31, 120.5, 55],
  [299, 235, 384.5, 44],
  [215, 121, 228.5, 68],
  [281, 224, 364.5, 66],
  [158, 26, 105, 32],
  [210, 75, 180, 30],
]

function buildRainLayerStyle(): CSSProperties {
  const bgImage: string[] = []
  const bgSize: string[] = []
  const fromPos: string[] = []
  const toPos: string[] = []
  RAIN_GROUPS.forEach(([tile, leftFromY, dotFromY, mult], i) => {
    const leftX = 25 * i
    const rightX = leftX + 3
    const dotX = leftX + 151.5
    bgImage.push(
      `radial-gradient(4px 100px at ${leftX}px ${tile}px, ${RAIN_COLOR}, #0000)`,
      `radial-gradient(4px 100px at ${rightX}px ${tile}px, ${RAIN_COLOR}, #0000)`,
      `radial-gradient(1.5px 1.5px at ${dotX}px ${tile / 2}px, ${RAIN_COLOR} 100%, #0000 150%)`,
    )
    bgSize.push(`300px ${tile}px`, `300px ${tile}px`, `300px ${tile}px`)
    const toLeftY = leftFromY + mult * tile
    const toDotY = dotFromY + mult * tile
    fromPos.push(`${leftX}px ${leftFromY}px`, `${rightX}px ${leftFromY}px`, `${dotX}px ${dotFromY}px`)
    toPos.push(`${leftX}px ${toLeftY}px`, `${rightX}px ${toLeftY}px`, `${dotX}px ${toDotY}px`)
  })
  return {
    position: 'absolute',
    inset: 0,
    backgroundColor: '#000',
    backgroundImage: bgImage.join(', '),
    backgroundSize: bgSize.join(', '),
    animation: 'bgCycleRain 150s linear infinite',
    ['--rain-from' as string]: fromPos.join(', '),
    ['--rain-to' as string]: toPos.join(', '),
  } as CSSProperties
}

// Pattern 4's own overlay: a soft dot-grid mask - originally through a
// heavy blur+brightness backdrop-filter for a "rain seen through a
// wet/bloomed lens" look, dropped per the perf note this comment used to
// point at: backdrop-filter over a layer that's continuously animating
// underneath it forces a full-viewport re-blur on literally every frame,
// forever, on every normal page - measurably the app's biggest source of
// jank. Same dot-grid mask, just applied directly with no backdrop
// sampling behind it.
function RainBloomLayer() {
  return (
    <>
      <div className="bg-cycle-loop absolute inset-0" style={buildRainLayerStyle()} />
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'hsl(0 0% 4% / 0.5)', backgroundImage: 'radial-gradient(circle at 50% 50%, #0000 0, #0000 2px, hsl(0 0% 4%) 2px)', backgroundSize: '8px 8px' }}
      />
    </>
  )
}

// Pattern 6's own overlay: a thin repeating ellipse "reflection" mask - no
// backdrop-filter this time, just a subtle scanline texture over the rain.
function RainReflectionLayer() {
  return (
    <>
      <div className="bg-cycle-loop absolute inset-0" style={buildRainLayerStyle()} />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(ellipse 1.5px 2px at 1.5px 50%, #0000 0, #0000 90%, #000 100%)',
          backgroundSize: '25px 8px',
        }}
      />
    </>
  )
}

// ---------------------------------------------------------------------
// Pattern 5: blurred blobs drifting across a huge virtual canvas (the last
// pasted snippet - originally hue-rotating too via a `rotaty` keyframe the
// source never actually defined; that whole hue-cycling layer is gone now,
// see BlobLayer's own comment on why).
// ---------------------------------------------------------------------
const BLOB_ELLIPSES: Array<{ w: number; h: number; sizeW: number; sizeH: number; from: [number, number]; to: [number, number] }> = [
  { w: 66, h: 50, sizeW: 726, sizeH: 576, from: [271, 478], to: [-14975, -2978] },
  { w: 77, h: 60, sizeW: 1242, sizeH: 454, from: [62, 291], to: [31112, 11187] },
  { w: 78, h: 100, sizeW: 876, sizeH: 1160, from: [67, 861], to: [-20081, 8981] },
  { w: 73, h: 96, sizeW: 691, sizeH: 873, from: [553, 413], to: [11609, -3952] },
  { w: 76, h: 77, sizeW: 914, sizeH: 550, from: [36, 392], to: [-12760, 12492] },
  { w: 66, h: 51, sizeW: 1159, sizeH: 340, from: [1077, 226], to: [-9354, 2946] },
  { w: 90, h: 57, sizeW: 1017, sizeH: 831, from: [400, 799], to: [9553, 21574] },
  { w: 89, h: 93, sizeW: 313, sizeH: 977, from: [7, 264], to: [946, 9057] },
]
function BlobLayer() {
  const blobStyle: CSSProperties = {
    position: 'absolute',
    inset: '-8em',
    zIndex: -1,
    backgroundColor: '#000',
    backgroundImage: BLOB_ELLIPSES.map((b) => `radial-gradient(ellipse ${b.w}px ${b.h}px at 50% 50%, #0f0 0%, transparent 100%)`).join(', '),
    backgroundSize: BLOB_ELLIPSES.map((b) => `${b.sizeW}px ${b.sizeH}px`).join(', '),
    // Hue-cycling the filter itself (bgCycleBlobHue) and a second spinning
    // backdrop-filter(hue-rotate) layer on top used to run alongside this -
    // both dropped: a filter that's animating forces a full re-blur of this
    // blur(7em) layer every frame on top of the background-position
    // animation already doing that, and a full-viewport backdrop-filter
    // spinning forever compounds it further. blur radius also cut from 7em
    // to 3em, since a smaller blur is meaningfully cheaper to recompute
    // each frame and barely reads as different at this layer's already-low
    // opacity. Static color now (no hue cycling), motion (bgCycleBlobsMove)
    // unchanged.
    animation: 'bgCycleBlobsMove 150s linear infinite',
    filter: 'blur(3em) brightness(5)',
    ['--blob-from' as string]: BLOB_ELLIPSES.map((b) => `${b.from[0]}px ${b.from[1]}px`).join(', '),
    ['--blob-to' as string]: BLOB_ELLIPSES.map((b) => `${b.to[0]}px ${b.to[1]}px`).join(', '),
  } as CSSProperties
  return (
    <>
      <div
        className="absolute inset-0"
        style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #0000 0, #0000 2px, hsl(0 0% 4%) 2px)', backgroundSize: '8px 8px' }}
      />
      <div className="bg-cycle-loop" style={blobStyle} />
    </>
  )
}

const PATTERNS: Array<() => ReactNode> = [
  () => <CheckerLayer />,
  () => <ScallopLayer />,
  () => <HerringboneLayer />,
  () => <RainBloomLayer />,
  () => <BlobLayer />,
  () => <RainReflectionLayer />,
]

function CycleLayer({ index, fade, animate }: { index: number; fade: 'in' | 'out'; animate: boolean }) {
  const Render = PATTERNS[index]
  // Reduced motion: skip the crossfade animation class entirely rather than
  // relying only on the CSS media-query guard (bg-cycle-loop below still
  // has that guard too, for the OS-level setting independent of this app's
  // own toggle) - render straight at its resting opacity, no transition.
  const className = animate ? `pointer-events-none absolute inset-0 ${fade === 'in' ? 'bg-cycle-fade-in' : 'bg-cycle-fade-out'}` : 'pointer-events-none absolute inset-0'
  return (
    <div className={className} style={animate ? undefined : { opacity: fade === 'in' ? 1 : 0 }} aria-hidden="true">
      <Render />
    </div>
  )
}

export default function CyclingPageBackground() {
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const [index, setIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState<number | null>(null)

  useEffect(() => {
    // Reduced motion: freeze on the first (static, no internal animation)
    // pattern - no cycling, no crossfade, no per-pattern loop animations.
    if (reduceMotion) return
    const id = setInterval(() => {
      setIndex((current) => {
        setPrevIndex(current)
        return (current + 1) % PATTERNS.length
      })
    }, CYCLE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [reduceMotion])

  useEffect(() => {
    if (prevIndex === null) return
    // Unmount the outgoing layer once its fade-out finishes, so at most 2
    // (not all 6) of these gradient/filter-heavy layers are ever mounted
    // at once.
    const timeout = setTimeout(() => setPrevIndex(null), FADE_MS + 100)
    return () => clearTimeout(timeout)
  }, [prevIndex])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ opacity: OVERALL_OPACITY }} aria-hidden="true">
      {prevIndex !== null ? <CycleLayer key={`prev-${prevIndex}`} index={prevIndex} fade="out" animate={!reduceMotion} /> : null}
      <CycleLayer key={`current-${index}`} index={index} fade="in" animate={!reduceMotion} />
    </div>
  )
}
