import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { playLoopingSound, playSound, preloadSounds, stopSound, TIER_SOUNDS } from '../utils/sound'

interface CelestialOrbitalRevealProps {
  onComplete: () => void
}

// The Celestial-tier pre-reveal animation - CelestialRevealCard.tsx renders
// this during its 'intro' phase (replacing the earlier dragon intro,
// CelestialDragonReveal.tsx, which is no longer wired in but left in place
// rather than deleted) and moves on to its own 'floating' sealed card once
// onComplete() fires.
//
// Two acts, both CSS-timed (this component's own job is just rendering
// the markup those selectors target, playing sound cues on the right
// beats, and calling onComplete once it's done). Deliberately long -
// the odds of actually landing a Celestial roll are vanishingly small,
// so this is allowed to take its time rather than rush through:
// 1. A vertical "warp-in", 0-T_DAY_END (7s) - a CSS-only speeder ship,
//    rotated fully vertical, rushing upward through streaking light
//    lines (see index.css's .cor-speeder-stage). Its OWN backdrop
//    splits in two: for the first T_DAY (4s), a direct reuse of
//    Mythic's own dread-buildup (.cor-night-sky renders Mythic's own
//    .mythic-starfield/.mythic-stars-N/.mythic-moon/.mythic-meteor/
//    .mythic-dread-pulse classes verbatim - "going Mythic to Celestial",
//    so this opens dark like Mythic before brightening - deliberately
//    without .mythic-dread-shake or the flash/blast/thunder that
//    follow it in Mythic's own reveal, neither of which belongs here).
//    Then a crossfade into this reveal's pale/angelic daytime look for
//    the remaining 3s. Once day breaks, .cor-speeder-stage's own
//    animation also pushes the camera in toward the ship's .face a step
//    further each second, ending at its closest right as this act hands
//    off. choir2.mp3 marks the very start of this whole reveal (t=0,
//    one-shot); wind, rain, and thunder all start together at that same
//    t=0 too. Wind alone keeps going for this whole 7s act; rain is cut
//    at the night-to-day crossfade (T_DAY) rather than left to run into
//    the daytime stretch. Thunder is a rolling two-layer crack: the
//    first thunder.mp3 only gets its opening 2s, and a duplicate
//    (thunder2.mp3) comes in underneath 1s in - overlapping thunder's
//    last second rather than waiting for it to finish - then plays on
//    its own. Everything is silenced again at T_DAY_END as a safety net
//    going into act 2. (An
//    earlier version of this act had a neon rings-tunnel bridge in
//    between this and the orbital core - dropped; straight from the
//    speeder to the orbital core now.)
// 2. A single gold orbital core (an earlier two-core approach/spiral/
//    merge version - CelestialDragonReveal.tsx's actual successor,
//    briefly - kept fighting its own positioning and got scrapped) fades
//    in centered once act 1 hands off at T_DAY_END - right when its own
//    tier win stinger (celestial-win.mp3, moved here from
//    JobMarketRollPage.tsx's land-time finishRoll, same move Mythic's
//    stinger got earlier) fires, and alien.mp3 (a 2s trimmed clip)
//    starts looping underneath - then runs its own ring/pulse/particle
//    animation for a held T_PAUSE (2s) beat before detonating into a big
//    screen-shaking particle burst, alien.mp3 cutting out right as the
//    blast does.
// See index.css's "Celestial orbital reveal" section for the actual
// animation.
//
// Deliberately NOT skippable (a click/tap or Enter/Space used to jump
// straight to onComplete(), same as the earlier dragon intro - removed:
// Mythic/Celestial are rare enough that any accidental interaction losing
// or cutting into the reveal is worth avoiding, so this can only run to
// completion on its own timer, same reasoning as the Add/close buttons no
// longer being removable mid-reveal on CelestialRevealCard/
// MythicRevealCard).
// Every timestamp below that matches a CSS animation-delay in index.css
// does so 1:1 - see that file's own comments on each stage for where
// each duration comes from.
const T_DAY = 4000 // night runs 4s, day runs the remaining 3s - matches
// .cor-night-sky's own corNightSkyFade crossfade midpoint (55%-59% of
// its 7s animation)
const T_DAY_END = 7000
// A held beat with the orbital core just visibly running (see index.css's
// speed-up of its own cycle - orbit-1 etc - so this pause actually reads
// as active motion, not another static hold) before it detonates, rather
// than fading in and rushing almost straight into the blast. Was 2000 -
// trimmed to 1000 per request ("make the explosion 1 second faster" -
// meaning its cue/trigger time, not the blast animation itself, which is
// untouched here).
const T_PAUSE = 1000
// Matches .cor-blast-bloom/.cor-spark's own CSS animation-delay - the
// instant the blast visual actually starts.
const T_BLAST_VISUAL = 4200 + T_DAY_END + T_PAUSE
// celestial-blast.mp3 isn't an instant hit - decoded and measured its
// waveform directly (Web Audio API, not guessed): the clip's actual peak
// amplitude doesn't land until ~715ms in, it swells up to it. Firing the
// sound exactly on T_BLAST_VISUAL therefore made the "boom" read as
// arriving late - this fires 715ms ahead of that so the sound's own
// peak, not its start, lines up with the visual.
const T_BLAST = T_BLAST_VISUAL - 715
// The sealed card used to only appear once the ENTIRE 1.9s spark burst
// had fully played out and faded away - which read as arriving well
// after the explosion was already over. onComplete() unmounts this
// whole component (shake, blast, everything) the instant it fires, so
// this can't be delayed all the way to the spark animation's own end
// without cutting the explosion off mid-flight either way; landing it
// here instead, while the bloom/sparks are still bright and expanding
// (not yet into their own fade-out tail), reads as the card being
// revealed BY the explosion rather than lagging behind it.
const TOTAL_MS = T_BLAST_VISUAL + 400

export default function CelestialOrbitalReveal({ onComplete }: CelestialOrbitalRevealProps) {
  const timeoutsRef = useRef<number[]>([])

  useEffect(() => {
    preloadSounds([
      '/sounds/choir2.mp3',
      '/sounds/wind.mp3',
      '/sounds/rain.mp3',
      '/sounds/thunder.mp3',
      '/sounds/thunder2.mp3',
      '/sounds/alien.mp3',
      '/sounds/celestial-blast.mp3',
      TIER_SOUNDS.celestial,
    ])
    // All four fire together the instant the night sky/speeder appear
    // (t=0) - see .cor-night-sky/.cor-speeder-stage in index.css. Wind
    // is capped to run the whole 7s act (measured its real length -
    // 16.8s - so it needs capping, not looping, to land exactly on
    // T_DAY_END); rain loops underneath as an overlay bed until
    // explicitly stopped below, only for the night stretch. choir2 is a
    // one-shot, not an overlay bed - it just marks the very start of
    // this whole reveal, left to finish (or get cut by the T_DAY_END
    // safety net below, same as everything else) on its own.
    playSound('/sounds/choir2.mp3')
    playSound('/sounds/wind.mp3', T_DAY_END)
    playLoopingSound('/sounds/rain.mp3')
    playSound('/sounds/thunder.mp3')
    const after = (ms: number, fn: () => void) => {
      timeoutsRef.current.push(window.setTimeout(fn, ms))
    }
    // Cuts the rain at the night-to-day crossfade rather than letting it
    // bleed into the daytime half.
    after(T_DAY, () => {
      stopSound('/sounds/rain.mp3')
    })
    // Layered rolling-thunder effect, per request: thunder.mp3 only gets
    // its first 2s (cut at 2000ms, not left to run its full length), and
    // thunder2.mp3 (an exact duplicate of the same clip, public/sounds/
    // thunder2.mp3) comes in underneath at 1000ms - overlapping the
    // first thunder's LAST second (1000-2000ms) rather than starting
    // only once it ends, so the two cracks overlap for a beat instead of
    // one cutting off before the next starts. thunder2 then plays out on
    // its own past that (belt-and-suspenders stop at T_DAY_END below,
    // same as everything else in this act).
    after(2000, () => {
      stopSound('/sounds/thunder.mp3')
    })
    after(1000, () => {
      playSound('/sounds/thunder2.mp3')
    })
    // Belt-and-suspenders silence right as the first act hands off to
    // the orbital core - wind/rain/thunder/choir2 should all already be
    // stopped/finished by T_DAY_END on their own (wind capped to
    // T_DAY_END, rain/thunder cut at T_DAY, choir2 a short one-shot), so
    // these are no-ops in the normal case, but guarantee nothing
    // carries into act 2 if any of that timing ever drifts. Fires the
    // tier's own win stinger right here too, as the orbital core act
    // begins - moved off land time (see JobMarketRollPage.tsx's
    // finishRoll) - and starts alien.mp3 looping underneath the core's
    // own run. alien.mp3 is only a 2s trimmed clip of the original
    // alien.flac (not the full ~16s file), looped for a flat 4s (see the
    // stop call below) rather than the full ~16s clip played once.
    after(T_DAY_END, () => {
      stopSound('/sounds/choir2.mp3')
      stopSound('/sounds/wind.mp3')
      stopSound('/sounds/rain.mp3')
      stopSound('/sounds/thunder.mp3')
      stopSound('/sounds/thunder2.mp3')
      playSound(TIER_SOUNDS.celestial)
      playLoopingSound('/sounds/alien.mp3')
    })
    // alien.mp3 loops for exactly 4s (T_DAY_END + 4000) per request,
    // decoupled from T_BLAST - it used to run until the blast visual
    // itself (~4.485s, however long that happened to be), but a flat 4s
    // window is easier to reason about and keep stable if T_PAUSE ever
    // shifts the blast's own timing again.
    after(T_DAY_END + 4000, () => {
      stopSound('/sounds/alien.mp3')
    })
    after(T_BLAST, () => {
      playSound('/sounds/celestial-blast.mp3')
    })
    after(TOTAL_MS, onComplete)
    return () => {
      timeoutsRef.current.forEach((id) => window.clearTimeout(id))
      stopSound('/sounds/rain.mp3')
      stopSound('/sounds/alien.mp3')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Portalled to document.body - CelestialRevealCard renders this from deep
  // inside JobMarketRollPage.tsx's full-bleed wrapper, which carries its own
  // permanent `-translate-x-1/2` transform (its full-bleed breakout trick -
  // see that file's comments). Any transform on an ancestor makes IT the
  // containing block for position:fixed descendants instead of the true
  // viewport - matching AuthPromptModal.tsx's fix for the same problem.
  return createPortal(
    <div className="celestial-orbital-reveal">
      <div className="cor-shake">
        <div className="cor-night-sky" aria-hidden="true">
          <div className="mythic-starfield">
            <div className="mythic-stars-1" />
            <div className="mythic-stars-2" />
            <div className="mythic-stars-3" />
            <div className="mythic-moon" />
            <div className="mythic-meteor mythic-meteor-1" />
            <div className="mythic-meteor mythic-meteor-2" />
            <div className="mythic-meteor mythic-meteor-3" />
          </div>
          <div className="mythic-dread-pulse" aria-hidden="true" />
          <div className="cor-thunder-flash" aria-hidden="true" />
        </div>

        {/* Same Orwellian eye + red ray Mythic uses, but its own fully
            self-contained copy (see index.css's .cor-eye-descend
            comment for why it's not a direct reuse of Mythic's own
            rules) - sweeps top-to-bottom across the first half (3.5s)
            of this act, placed here (before .cor-speeder-stage) so the
            ship's own glow paints over it as they cross paths. */}
        <div className="cor-eye-descend" aria-hidden="true">
          <div className="spotlight" />
          <div className="orwellian-loader">
            <div className="eye">
              <div className="pupil" />
            </div>
          </div>
        </div>

        <div className="cor-speeder-stage" aria-hidden="true">
          {/* Scale-only push-in wrapper, pivoting on .face instead of
              this stage's own center - see index.css's .cor-speeder-zoom
              comment for why this needed splitting out onto its own
              element. */}
          <div className="cor-speeder-zoom">
            <div className="loader">
              {/* .loader > span > span:nth-child(1-4) is a purely
                  structural selector - "any span whose parent is a span
                  whose parent is .loader" - it doesn't care which span
                  child of .loader that parent is. Splitting the fazer
                  spans and the wing triangle into separate SPAN siblings
                  (both matching .loader > span) still left the wing's
                  own span hitting that nth-child(1) rule too (it's a
                  span, its parent .base is a span child of .loader) -
                  same width:30px/height:1px-vs-width:0/height:0 collision
                  as before, just relocated. .base is a <div> specifically
                  to break that structural chain (the selector requires a
                  span in that position) - see the .loader > .base rule
                  in index.css for the position it loses by not matching
                  .loader > span directly. */}
              <span>
                <span />
                <span />
                <span />
                <span />
              </span>
              <div className="base">
                <span />
                <i className="face" />
              </div>
            </div>
            <div className="longfazers">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>

        <div className="cor-intro">
          <div className="orbital-core">
            <div className="core-system">
              <div className="core-rays" />
              <div className="core-corona" />
              <div className="core-halo" />
              <div className="core-outer-ring" />
              <div className="core-secondary-ring" />
              <div className="core-thin-ring" />
              <div className="core-inner-glow" />
              <div className="core-micro-center" />
            </div>

            <div className="pulse-system">
              <div className="pulse-ring pulse-ring-1" />
              <div className="pulse-ring pulse-ring-2" />
              <div className="pulse-ring pulse-ring-3" />
            </div>

            <div className="orbit-system orbit-1">
              <div className="orbit-path" />
              <div className="orbit-object-wrapper">
                <div className="orbit-object">
                  <div className="obj-circle" />
                  <div className="object-trail" />
                </div>
              </div>
            </div>

            <div className="orbit-system orbit-2">
              <div className="orbit-path" />
              <div className="orbit-object-wrapper">
                <div className="orbit-object">
                  <div className="obj-ring" />
                </div>
              </div>
            </div>

            <div className="orbit-system orbit-3">
              <div className="orbit-path" />
              <div className="orbit-object-wrapper">
                <div className="orbit-object">
                  <div className="obj-bright-point" />
                </div>
              </div>
            </div>

            <div className="orbit-system orbit-4">
              <div className="orbit-path" />
              <div className="orbit-object-wrapper">
                <div className="orbit-object">
                  <div className="obj-diamond" />
                </div>
              </div>
            </div>

            <div className="orbit-system orbit-5">
              <div className="orbit-path" />
              <div className="orbit-object-wrapper">
                <div className="orbit-object">
                  <div className="obj-line" />
                </div>
              </div>
            </div>

            <div className="orbit-system orbit-6">
              <div className="orbit-path" />
              <div className="orbit-object-wrapper">
                <div className="orbit-object">
                  <div className="obj-square" />
                </div>
              </div>
            </div>

            <div className="orbit-system orbit-7">
              <div className="orbit-path" />
              <div className="orbit-object-wrapper">
                <div className="orbit-object">
                  <div className="obj-fragment" />
                </div>
              </div>
            </div>

            <div className="particle-system">
              {Array.from({ length: 15 }, (_, i) => (
                <div key={i} className={`particle p${i + 1}`} />
              ))}
            </div>

            <div className="energy-fragments">
              <div className="energy-fragment ef1" />
              <div className="energy-fragment ef2" />
              <div className="energy-fragment ef3" />
            </div>
          </div>
        </div>

        <div className="cor-blast" aria-hidden="true">
          <div className="cor-blast-bloom" />
          {Array.from({ length: 160 }, (_, i) => (
            <div key={i} className="cor-spark" />
          ))}
        </div>
      </div>
    </div>,
    document.body,
  )
}
