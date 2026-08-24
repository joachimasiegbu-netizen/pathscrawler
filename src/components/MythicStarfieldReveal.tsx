import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { playLoopingSound, playSound, playSoundBoosted, preloadSounds, stopSound } from '../utils/sound'

interface MythicStarfieldRevealProps {
  onComplete: () => void
}

// The Mythic-tier pre-reveal animation - MythicRevealCard.tsx renders this
// during its 'intro' phase and moves on to its own sealed 'floating' card
// once onComplete() fires, same shape as Celestial's own intro
// (CelestialOrbitalReveal.tsx). The card does not exist on screen at all
// until this finishes.
//
// A near-black sky - dim stars, a blood moon, ember-colored meteors (see
// index.css's "Mythic starfield" section - the same star layers that used
// to sit as a pretty backdrop behind the card the whole time, retinted and
// now a one-shot sequence instead of a persistent background) - builds a
// slow pulsing dread for ~3.3s, cuts to black, then a 0.6s screen shake,
// then a thunder crack - a watching eye with a sweeping red ray is
// present the WHOLE time though, visible from t=0 rather than fading in
// as a late payoff (see index.css's .mythic-eye-stage rules), pushing in
// closer on it a step each second, red ray removed and gaze locking onto
// the viewer 3s before the reveal ends (a glitchy snap, not a smooth
// ease - see index.css's mythicEyeGlitch keyframe). The reveal's final
// 2s (5.2s-7.2s) push
// harder still: the eye itself turns fully red (on top of the pupil,
// already red by 4s), the zoom resumes and climbs much further ("really
// up close"), and the whole thing shakes (.mythic-eye-jitter) - ending
// in a bloom+ring+50-spark explosion at 7.2s (see .mythic-eye-explode-*)
// right as it hands off. Used to be a particle-burst explosion timed to
// land right after the thunder instead (a flash plus 70 flying sparks,
// nothing like this finale) - swapped out for the eye build-up per
// request, with this explosion added back at the very end later.
// Deliberately NOT skippable, same reasoning as CelestialOrbitalReveal.tsx:
// no accidental click should be able to cut a Mythic pull short.
//
// Sound cues, plus the tier win stinger itself: a bell right at the
// start, a rain bed looping underneath the whole thing from that same
// moment (stopped explicitly on unmount below - unlike the one-shot hits
// here, a loop left unstopped would keep going forever in the background
// after this component's gone), a thud right as the shake starts, a
// thunder crack at T_THUNDER (now BEFORE the blast, timed to land with
// the visual strike - see index.css's .mythic-thunder-sky/
// .mythic-lightning-bolt), and mythic.mp3 fired from onComplete below
// once the sealed card is actually about to appear - moved here from
// JobMarketRollPage.tsx's finishRoll, which plays every other tier's
// stinger the instant the roll lands; Mythic's used to fire that early
// too, under a black screen nobody was looking at yet. (A scream cue,
// T_EXPLODE_SOUND below, has been added and removed a few times now -
// currently back in, 2s ahead of the explosion boom itself.)
const T_SHAKE = 3300
// Thunder before the eye's own build-up, not after - per request, the
// storm strikes first.
const T_THUNDER = 3900
// The reveal's actual explosion (see index.css's .mythic-eye-explode-*
// rules) - used to fire much earlier (4700, right after the thunder)
// back when this act climaxed in a particle-burst explosion instead of
// the eye; now it's the LAST beat, right as the eye's final 2s of
// zooming/reddening/shaking finishes, matching TOTAL_MS below. Also
// read directly here now (see the sound wiring below) for a percussive
// thud right on the blast itself, on top of being the CSS
// animation-delay those rules use.
const T_EXPLODE = 7200
// Was T_EXPLODE + 600 - pushed out further per "make the explosion more
// dramatic": the bloom/ring/spark durations in index.css got longer
// alongside their bigger scale (a bigger blast that still cuts off after
// only 600ms would've read as abrupt, not dramatic), so this needed to
// stretch to match - same "reveal the card while the blast is still
// expanding, not once it's fully finished" reasoning as before, just
// giving that still-expanding blast more time to actually read as huge
// before the cut (see CelestialOrbitalReveal.tsx's own TOTAL_MS comment
// for the origin of this pattern).
const TOTAL_MS = T_EXPLODE + 750
// The scream cue, back again (added, removed, re-added, removed, now
// re-added once more on request) - same 2s-early lead-in timing as its
// last stint, so it plays as tension/dread ahead of the blast rather
// than landing exactly on it (which is what celestial-blast.mp3, T_EXPLODE
// itself, is for - see that sound-wiring comment below).
const T_EXPLODE_SOUND = T_EXPLODE - 2000

const RAIN_SRC = '/sounds/rain.mp3'
const SOUNDS = ['/sounds/bell.mp3', '/sounds/mythic-thud.mp3', '/sounds/thunder.mp3', '/sounds/scream.mp3', '/sounds/celestial-blast.mp3', RAIN_SRC]

export default function MythicStarfieldReveal({ onComplete }: MythicStarfieldRevealProps) {
  const timeoutsRef = useRef<number[]>([])

  useEffect(() => {
    preloadSounds(SOUNDS)
    playSound('/sounds/bell.mp3')
    playLoopingSound(RAIN_SRC)
    const after = (ms: number, fn: () => void) => {
      timeoutsRef.current.push(window.setTimeout(fn, ms))
    }
    after(T_SHAKE, () => playSound('/sounds/mythic-thud.mp3'))
    after(T_THUNDER, () => playSound('/sounds/thunder.mp3'))
    after(T_EXPLODE_SOUND, () => playSound('/sounds/scream.mp3'))
    // The explosion boom, right on the blast itself (T_EXPLODE), layered
    // under the scream's own 2s-early lead-in rather than replacing it:
    // scream = dread/tension ahead of the hit, this = the actual boom on
    // impact. celestial-blast.mp3 - this was actually MYTHIC's own
    // explosion sound originally. playSoundBoosted, not playSound - per
    // "increase the volume on the explosion sound":
    // a plain <audio> element already plays at its 1.0 (100%) ceiling by
    // default, so this needed real Web Audio gain amplification (1.8x)
    // rather than a `.volume` bump, and its own dedicated element rather
    // than the shared cache the rest of this file's sounds use, so it
    // doesn't also boost Celestial's own unamplified use of this same
    // file (see playSoundBoosted's own comment in sound.ts for why).
    after(T_EXPLODE, () => playSoundBoosted('/sounds/celestial-blast.mp3', 1.8))
    after(TOTAL_MS, onComplete)
    return () => {
      timeoutsRef.current.forEach((id) => window.clearTimeout(id))
      stopSound(RAIN_SRC)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Portalled to document.body for the same reason as
  // CelestialOrbitalReveal.tsx - an ancestor's transform would otherwise
  // hijack position:fixed's containing block away from the true viewport.
  return createPortal(
    <div className="mythic-starfield-reveal">
      <div className="mythic-dread-shake">
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
        <div className="mythic-flash-black" aria-hidden="true" />

        <div className="mythic-eye-stage" aria-hidden="true">
          {/* Direct child of .mythic-eye-stage, not nested inside
              .orwellian-loader like the rest - see .spotlight's own
              CSS comment for why: that loader box's overflow:hidden
              was clipping the ray to ~280px on screen no matter how
              tall it was actually set, so it had to move out to reach
              the bottom of the viewport at all. Placed BEFORE
              .mythic-eye-jitter, not after - both are z-index:auto at
              this level, so whichever comes later in source order
              paints on top; .eye's own z-index:10 doesn't help here,
              it only wins comparisons made INSIDE .mythic-eye-jitter's
              own stacking context (it has one - see its own transform-
              driving animation - so nothing inside it can be compared
              against .spotlight directly). Ray needs to render BEHIND
              the eye, not over it, so it goes first. */}
          <div className="spotlight" />
          <div className="mythic-eye-jitter">
            <div className="orwellian-loader">
              <div className="eye">
                <div className="pupil" />
              </div>
            </div>
          </div>
        </div>

        <div className="mythic-thunder-sky" aria-hidden="true" />
        <div className="mythic-lightning-bolt" aria-hidden="true" />
        <div className="mythic-lightning-bolt-2" aria-hidden="true" />
        <div className="mythic-lightning-bolt-3" aria-hidden="true" />

        {/* The reveal's final explosion, 7.2s - a sibling of
            .mythic-eye-stage, not nested inside it, so none of this
            inherits that element's own zoom (see .mythic-eye-explode-
            bloom's own CSS comment for why). */}
        <div aria-hidden="true">
          <div className="mythic-eye-explode-bloom" />
          <div className="mythic-eye-explode-ring" />
          <div className="mythic-eye-explode-ring-2" />
          <div className="mythic-eye-explode-ring-3" />
          {Array.from({ length: 50 }, (_, i) => (
            <div key={i} className="mythic-eye-explode-spark" />
          ))}
        </div>
      </div>
    </div>,
    document.body,
  )
}
