import { useMemo, type CSSProperties } from 'react'

// Small ember/firefly colors - indigo, teal (the app's own accent), and
// white, all rendered at low opacity via the color itself (not a shared
// opacity multiplier) so brighter ones (white) still read as slightly more
// prominent than dimmer ones (indigo) the way real embers would vary.
const COLORS = ['rgba(129, 140, 248, 0.55)', 'rgba(45, 212, 191, 0.5)', 'rgba(255, 255, 255, 0.4)']

const COUNT = 26

interface Ember {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  drift: number
  opacity: number
  color: string
}

function buildEmbers(): Ember[] {
  return Array.from({ length: COUNT }, (_, index) => ({
    id: index,
    left: Math.random() * 100, // vw %
    size: 2 + Math.random() * 4, // 2-6px - small glowing dots, not cards
    duration: 10 + Math.random() * 14, // 10-24s, slower ones read as farther away
    delay: -Math.random() * 24, // negative = already mid-flight on load
    drift: -30 + Math.random() * 60, // -30 to 30px lateral wander
    opacity: 0.25 + Math.random() * 0.35, // 0.25-0.6
    color: COLORS[index % COLORS.length],
  }))
}

// Roll a Job "game mode" decoration - embers/fireflies drifting slowly
// upward behind the cylinder, echoing FloatingJobBackground's drifting
// cards but as plain glowing dots (no card content) since this is purely
// atmospheric, not another "here's a real career" layer. Pure CSS
// animation (see .roll-ember/@keyframes ember-float in index.css) so it's
// GPU-accelerated and automatically respects reduce-motion without any
// logic here. 26 particles, well under the "20-30 max" ceiling from the
// brief - cheap even on lower-end devices since it's just opacity+transform.
export default function FloatingRollEmbers() {
  const embers = useMemo(buildEmbers, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {embers.map((ember) => (
        <span
          key={ember.id}
          className="roll-ember"
          style={
            {
              left: `${ember.left}%`,
              width: ember.size,
              height: ember.size,
              backgroundColor: ember.color,
              boxShadow: `0 0 ${ember.size * 2}px ${ember.color}`,
              animationDuration: `${ember.duration}s`,
              animationDelay: `${ember.delay}s`,
              '--ember-drift': `${ember.drift}px`,
              '--ember-opacity': ember.opacity,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
