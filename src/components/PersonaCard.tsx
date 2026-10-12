import type { CSSProperties, ComponentType } from 'react'
import StudentPersonaCube from './StudentPersonaCube'
import StudentHubPersonaEarth from './StudentHubPersonaEarth'
import KnowGoalPersonaTree from './KnowGoalPersonaTree'
import CareerChangerSplitFlap from './CareerChangerSplitFlap'
import MatureLearnerHourglass from './MatureLearnerHourglass'
import MatureLearnerDeskLamp from './MatureLearnerDeskLamp'
import StudentHubPigeonholes from './StudentHubPigeonholes'

export interface PersonaDef {
  id: string
  label: string
  tagline: string
  icon: ComponentType<{ className?: string }>
  /** Hex accent - corner brackets, category label tint, and (only the
   * active/centered card) the glow/border. */
  accent: string
  /** Student Hub only, currently - a soft always-on pulse to draw the eye
   * to it among the "which describes you" set (persona_carousel_prompt.txt
   * spec: "Slight pulse glow on the border to draw attention"). */
  pulse?: boolean
  /** Render the animated 3D hue cube (StudentPersonaCube.tsx) as this card's
   * visual instead of `icon` - the Student persona only, currently. Drops
   * ALL card chrome (panel, border, shadow, brackets, "Persona" eyebrow,
   * confirm sparkle) per explicit request: just the cube, the label, and the
   * tagline. Still a carousel item - centered into the arc by the same
   * `style` transform and confirms-to-select like every other card. */
  cube?: boolean
  /** Render the drawer cabinet (StudentHubPigeonholes.tsx) as this card's
   * visual instead of `icon` - the Student Hub persona only. Took over
   * from `earth` below, which stays here (with its component) in case the
   * globe is wanted back. Same chrome-less treatment as the rest. */
  holes?: boolean
  /** Render the rotating-earth banner (StudentHubPersonaEarth.tsx) as this
   * card's visual instead of `icon` - was the Student Hub persona's, now
   * superseded by `holes` above and unused. Same chrome-less treatment as
   * `cube` above (drops panel,
   * border, shadow, brackets, "Persona" eyebrow, confirm sparkle - just the
   * banner, the label, and the tagline), so the two special persona
   * visuals read as one consistent design language rather than one styled
   * and one not. */
  earth?: boolean
  /** Render the line-drawn tree (KnowGoalPersonaTree.tsx) as this card's
   * visual instead of `icon` - the "I Know My Goal" persona only,
   * currently. Same chrome-less treatment as `cube`/`earth` above, so all
   * three special persona visuals read as one design language. */
  tree?: boolean
  /** Render the split-flap board (CareerChangerSplitFlap.tsx) as this card's
   * visual instead of `icon` - the Career Changer persona only, currently.
   * Same chrome-less treatment as `cube`/`earth`/`tree` above. */
  flap?: boolean
  /** Render the turning hourglass (MatureLearnerHourglass.tsx) as this card's
   * visual instead of `icon` - was the Mature Learner persona's, now
   * superseded by `lamp` below and unused. Same chrome-less treatment as
   * `cube`/`earth`/`tree`/`flap` above. It stays here, with its component,
   * in case the hourglass is wanted back. */
  glass?: boolean
  /** Render the desk lamp coming on over a book (MatureLearnerDeskLamp.tsx)
   * as this card's visual instead of `icon` - the Mature Learner persona
   * only. Took over from `glass` above. Same chrome-less treatment as the
   * rest; with this one set, every persona in the carousel has its own
   * visual and the plain-icon branch at the bottom of this file is no longer
   * reachable from RoleSelectionPage - it stays for any persona added
   * later. */
  lamp?: boolean
}

/** One card in PersonaCarousel.tsx. The carousel owns all 3D positioning
 * (rotateY/translateX/scale/opacity/z-index by offset-from-center) via the
 * `style` prop - this component only knows how to render ITS OWN content
 * and "am I the active one" styling, not where it sits in the arc. */
export default function PersonaCard({
  persona,
  active,
  reduceMotion,
  floatVariant,
  sparkling = false,
  style,
  onClick,
}: {
  persona: PersonaDef
  active: boolean
  reduceMotion: boolean
  floatVariant: 'a' | 'b'
  /** Brief burst on confirm (spec: "confetti/sparkle burst... on select") -
   * PersonaCarousel.tsx holds this true for CONFIRM_DELAY_MS before actually
   * navigating, so the burst has time to be seen. */
  sparkling?: boolean
  style?: CSSProperties
  onClick: () => void
}) {
  const Icon = persona.icon
  const floatClass = reduceMotion ? '' : floatVariant === 'a' ? 'persona-float' : 'persona-float-alt'

  // Cube persona: no card at all - just the cube and its text, standing on
  // the page background the way the earlier standalone version did. Keeps
  // only the carousel-positioning shell (absolute + left/top-1/2 + the
  // `style` transform) and the click-to-confirm behaviour.
  if (persona.cube) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-current={active ? 'true' : undefined}
        aria-label={active ? `${persona.label} - selected, tap to confirm` : `Show ${persona.label}`}
        className="persona-card group absolute left-1/2 top-1/2 flex h-72 w-56 flex-col items-center justify-center text-center sm:h-80 sm:w-64"
        style={style}
      >
        <span className={`flex flex-col items-center ${floatClass}`}>
          {/* The cube's own stage is a fixed ~260px square; scaled down here
              rather than resizing StudentPersonaCube itself. overflow-visible
              so the spinning cube is never sliced against a rectangular edge
              - that hard crop read as "a box around it". No pointer-events-none:
              the faces need pointer hits for their :hover (pin red + glow), and
              a click on one still bubbles to this button to select the persona. */}
          <span
            aria-hidden="true"
            className="flex h-44 w-full shrink-0 items-center justify-center overflow-visible"
          >
            <span className="shrink-0" style={{ transform: 'scale(0.72)', transformOrigin: 'center' }}>
              <StudentPersonaCube />
            </span>
          </span>
          <span
            className="persona-title-text mt-3 text-xl font-semibold text-slate-900"
            style={{ letterSpacing: '-0.01em' }}
          >
            {persona.label}
          </span>
          <span className="persona-tagline-text mt-2 text-sm leading-5 text-slate-500">{persona.tagline}</span>
        </span>
      </button>
    )
  }

  // Pigeonholes persona: same chrome-less treatment as the cube branch
  // above. The cabinet's own stage owns the pointer hover that opens every
  // drawer at once, and a hit on a drawer still bubbles to this button to
  // select the persona - exactly how the cube's faces behave.
  if (persona.holes) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-current={active ? 'true' : undefined}
        aria-label={active ? `${persona.label} - selected, tap to confirm` : `Show ${persona.label}`}
        className="persona-card group absolute left-1/2 top-1/2 flex h-72 w-56 flex-col items-center justify-center text-center sm:h-80 sm:w-64"
        style={style}
      >
        <span className={`flex flex-col items-center ${floatClass}`}>
          {/* Same scale-down-a-fixed-size-stage approach as the branches
              below, at the same 0.72 (its own stage is a fixed 250x250
              square). The cabinet derives its whole size from its own GRID
              and CELL and stays inside that stage at this scale. */}
          <span
            aria-hidden="true"
            className="flex h-44 w-full shrink-0 items-center justify-center overflow-visible"
          >
            <span className="shrink-0" style={{ transform: 'scale(0.72)', transformOrigin: 'center' }}>
              <StudentHubPigeonholes />
            </span>
          </span>
          <span
            className="persona-title-text mt-3 text-xl font-semibold text-slate-900"
            style={{ letterSpacing: '-0.01em' }}
          >
            {persona.label}
          </span>
          <span className="persona-tagline-text mt-2 text-sm leading-5 text-slate-500">{persona.tagline}</span>
        </span>
      </button>
    )
  }

  // Earth persona: same chrome-less treatment as the cube branch above,
  // just swapping in the rotating-earth banner as the visual. Superseded by
  // the `holes` branch above and no longer reached from RoleSelectionPage -
  // kept in case the globe is wanted back.
  if (persona.earth) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-current={active ? 'true' : undefined}
        aria-label={active ? `${persona.label} - selected, tap to confirm` : `Show ${persona.label}`}
        className="persona-card group absolute left-1/2 top-1/2 flex h-72 w-56 flex-col items-center justify-center text-center sm:h-80 sm:w-64"
        style={style}
      >
        <span className={`flex flex-col items-center ${floatClass}`}>
          {/* Same scale-down-a-fixed-size-stage approach as the cube branch
              above (its own stage is a fixed 250x250 circle). */}
          <span
            aria-hidden="true"
            className="flex h-44 w-full shrink-0 items-center justify-center overflow-visible"
          >
            <span className="shrink-0" style={{ transform: 'scale(0.72)', transformOrigin: 'center' }}>
              <StudentHubPersonaEarth />
            </span>
          </span>
          <span
            className="persona-title-text mt-3 text-xl font-semibold text-slate-900"
            style={{ letterSpacing: '-0.01em' }}
          >
            {persona.label}
          </span>
          <span className="persona-tagline-text mt-2 text-sm leading-5 text-slate-500">{persona.tagline}</span>
        </span>
      </button>
    )
  }

  // Tree persona: same chrome-less treatment as the two branches above. The
  // tree's balls need pointer hits for their own hover (trace the route to
  // that tip), and a hit on one still bubbles to this button to select the
  // persona - exactly how the cube's faces behave.
  if (persona.tree) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-current={active ? 'true' : undefined}
        aria-label={active ? `${persona.label} - selected, tap to confirm` : `Show ${persona.label}`}
        className="persona-card group absolute left-1/2 top-1/2 flex h-72 w-56 flex-col items-center justify-center text-center sm:h-80 sm:w-64"
        style={style}
      >
        <span className={`flex flex-col items-center ${floatClass}`}>
          {/* Same scale-down-a-fixed-size-stage approach as the two branches
              above (its own stage is a fixed 250x250 square), at the same
              0.72 - the constellation fills its stage from its own viewBox
              instead, so it doesn't need a different scale here to hold its
              own beside them. */}
          <span
            aria-hidden="true"
            className="flex h-44 w-full shrink-0 items-center justify-center overflow-visible"
          >
            <span className="shrink-0" style={{ transform: 'scale(0.72)', transformOrigin: 'center' }}>
              <KnowGoalPersonaTree />
            </span>
          </span>
          <span
            className="persona-title-text mt-3 text-xl font-semibold text-slate-900"
            style={{ letterSpacing: '-0.01em' }}
          >
            {persona.label}
          </span>
          <span className="persona-tagline-text mt-2 text-sm leading-5 text-slate-500">{persona.tagline}</span>
        </span>
      </button>
    )
  }

  // Split-flap persona: same chrome-less treatment as the three branches
  // above. The board needs pointer hits for its own hover (riffle fast), and
  // a click on it still bubbles to this button to select the persona.
  if (persona.flap) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-current={active ? 'true' : undefined}
        aria-label={active ? `${persona.label} - selected, tap to confirm` : `Show ${persona.label}`}
        className="persona-card group absolute left-1/2 top-1/2 flex h-72 w-56 flex-col items-center justify-center text-center sm:h-80 sm:w-64"
        style={style}
      >
        <span className={`flex flex-col items-center ${floatClass}`}>
          {/* Same scale-down-a-fixed-size-stage approach as the branches
              above, at the same 0.72. Its stage is 400x250, not the 250x250
              square the other three use - the board was made bigger in CSS
              (see .career-flap-stage) rather than by scaling up here, so a
              6-cell row of 50px cells had to be given room to lay out
              without flex squeezing it. */}
          <span
            aria-hidden="true"
            className="flex h-44 w-full shrink-0 items-center justify-center overflow-visible"
          >
            <span className="shrink-0" style={{ transform: 'scale(0.72)', transformOrigin: 'center' }}>
              <CareerChangerSplitFlap />
            </span>
          </span>
          <span
            className="persona-title-text mt-3 text-xl font-semibold text-slate-900"
            style={{ letterSpacing: '-0.01em' }}
          >
            {persona.label}
          </span>
          <span className="persona-tagline-text mt-2 text-sm leading-5 text-slate-500">{persona.tagline}</span>
        </span>
      </button>
    )
  }

  // Desk lamp persona: same chrome-less treatment as the branches above. Its
  // stage owns the pointer hover that shortens the night, and a click on it
  // still bubbles to this button to select the persona - exactly how the
  // split-flap board and the cube's faces behave.
  if (persona.lamp) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-current={active ? 'true' : undefined}
        aria-label={active ? `${persona.label} - selected, tap to confirm` : `Show ${persona.label}`}
        className="persona-card group absolute left-1/2 top-1/2 flex h-72 w-56 flex-col items-center justify-center text-center sm:h-80 sm:w-64"
        style={style}
      >
        <span className={`flex flex-col items-center ${floatClass}`}>
          {/* Same scale-down-a-fixed-size-stage approach as the branches
              above, at the same 0.72 (its own stage is a fixed 250x250
              square). */}
          <span
            aria-hidden="true"
            className="flex h-44 w-full shrink-0 items-center justify-center overflow-visible"
          >
            <span className="shrink-0" style={{ transform: 'scale(0.72)', transformOrigin: 'center' }}>
              <MatureLearnerDeskLamp />
            </span>
          </span>
          <span
            className="persona-title-text mt-3 text-xl font-semibold text-slate-900"
            style={{ letterSpacing: '-0.01em' }}
          >
            {persona.label}
          </span>
          <span className="persona-tagline-text mt-2 text-sm leading-5 text-slate-500">{persona.tagline}</span>
        </span>
      </button>
    )
  }

  // Hourglass persona: the lamp branch above took this persona over, so this
  // is now unreachable from RoleSelectionPage - kept to switch back to. Its
  // stage owns the pointer hover that drains it fast, and a click on it still
  // bubbles to this button to select the persona.
  if (persona.glass) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-current={active ? 'true' : undefined}
        aria-label={active ? `${persona.label} - selected, tap to confirm` : `Show ${persona.label}`}
        className="persona-card group absolute left-1/2 top-1/2 flex h-72 w-56 flex-col items-center justify-center text-center sm:h-80 sm:w-64"
        style={style}
      >
        <span className={`flex flex-col items-center ${floatClass}`}>
          {/* Same scale-down-a-fixed-size-stage approach as the branches
              above, at the same 0.72 (its own stage is a fixed 250x250
              square). */}
          <span
            aria-hidden="true"
            className="flex h-44 w-full shrink-0 items-center justify-center overflow-visible"
          >
            <span className="shrink-0" style={{ transform: 'scale(0.72)', transformOrigin: 'center' }}>
              <MatureLearnerHourglass />
            </span>
          </span>
          <span
            className="persona-title-text mt-3 text-xl font-semibold text-slate-900"
            style={{ letterSpacing: '-0.01em' }}
          >
            {persona.label}
          </span>
          <span className="persona-tagline-text mt-2 text-sm leading-5 text-slate-500">{persona.tagline}</span>
        </span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'true' : undefined}
      aria-label={active ? `${persona.label} - selected, tap to confirm` : `Show ${persona.label}`}
      // Centering (left-1/2 top-1/2 + the translate(-50%,-50%) baked into
      // every `style.transform` the carousel passes below) has to travel
      // together in ONE transform value - style.transform is a full
      // replacement, not a merge with Tailwind's own translate utilities,
      // so a plain -translate-x-1/2 class here would just get clobbered by
      // the carousel's inline transform the instant it's applied. The float
      // animation (transform: translateY, see index.css) can't live on
      // THIS element for the exact same reason in reverse: a running CSS
      // animation's value for a property always wins over any other source
      // for that property, inline style included - it would silently
      // replace the carousel's whole positioning transform with just the
      // float's own tiny translateY, confirmed live (computed transform
      // was a bare translateY, the -50%/rotateY/scale all gone). The float
      // lives on the inner wrapper below instead, a separate element with
      // its own independent `transform`, so the two never fight over it.
      className={`persona-card group absolute left-1/2 top-1/2 flex h-72 w-56 flex-col items-center justify-center rounded-3xl border p-6 text-center shadow-sm backdrop-blur-md sm:h-80 sm:w-64 ${
        persona.pulse && !reduceMotion ? 'persona-pulse' : ''
      }`}
      style={{
        // Bright/light glass, not the earlier dark theme - explicit
        // request ("why is the page so dark, make it brighter, happy but
        // professional colours"). White-ish translucent panel over
        // whatever page background sits behind it, same backdrop-blur
        // approach as before, just flipped from dark to light.
        background: 'rgba(255, 255, 255, 0.88)',
        borderColor: active ? `${persona.accent}55` : 'rgba(15, 23, 42, 0.08)',
        boxShadow: active
          ? `0 0 0 1px ${persona.accent}22, 0 20px 45px -15px ${persona.accent}45, 0 4px 16px -4px rgba(15,23,42,0.12)`
          : '0 4px 16px -6px rgba(15,23,42,0.10)',
        ...style,
      }}
    >
      {sparkling && !reduceMotion ? (
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
          {/* A handful of small dots at different positions/delays, not one
              big shape - reads as a scatter/burst rather than a single blob
              fading in and out. */}
          {[
            { top: '20%', left: '25%', delay: '0ms', size: 8 },
            { top: '30%', left: '75%', delay: '80ms', size: 6 },
            { top: '60%', left: '15%', delay: '140ms', size: 5 },
            { top: '70%', left: '80%', delay: '40ms', size: 7 },
            { top: '45%', left: '50%', delay: '110ms', size: 6 },
          ].map((dot, i) => (
            <span
              key={i}
              className="persona-sparkle absolute rounded-full"
              style={{
                top: dot.top,
                left: dot.left,
                width: dot.size,
                height: dot.size,
                backgroundColor: persona.accent,
                animationDelay: dot.delay,
              }}
            />
          ))}
        </span>
      ) : null}

      {/* Corner brackets, accent-tinted (spec: "L-shaped bracket lines...
          top-left and bottom-right"). Pure CSS border-clipping, no SVG. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-3 h-5 w-5 rounded-tl-lg border-l-2 border-t-2"
        style={{ borderColor: `${persona.accent}99` }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 right-3 h-5 w-5 rounded-br-lg border-b-2 border-r-2"
        style={{ borderColor: `${persona.accent}99` }}
      />

      <span className={`flex flex-col items-center ${floatClass}`}>
        <span
          className="persona-accent-text flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${persona.accent}1f`, color: persona.accent, ['--persona-accent' as string]: persona.accent }}
        >
          <Icon className="h-8 w-8" />
        </span>

        <span className="persona-label-text mt-5 text-[10px] font-medium uppercase tracking-[0.15em]" style={{ color: '#6366f1' }}>
          Persona
        </span>
        <span className="persona-title-text mt-1 text-xl font-semibold text-slate-900" style={{ letterSpacing: '-0.01em' }}>
          {persona.label}
        </span>

        {active ? <span className="persona-tagline-text mt-3 text-sm leading-5 text-slate-500">{persona.tagline}</span> : null}
      </span>
    </button>
  )
}
