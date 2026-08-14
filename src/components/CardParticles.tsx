import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import type { TierParticles } from '../utils/tierStyles'

interface CardParticlesProps {
  kind: TierParticles
}

const ICY_COLORS = ['#67E8F9', '#A5F3FC', '#FFFFFF', '#06B6D4']
const SMOKE_COLORS = ['#1E293B', '#334155', '#475569']

const COUNT = 14

function buildParticles(kind: TierParticles) {
  const colors = kind === 'icy' ? ICY_COLORS : SMOKE_COLORS
  return Array.from({ length: COUNT }, (_, index) => ({
    id: index,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: kind === 'icy' ? 3 + Math.random() * 4 : 8 + Math.random() * 14,
    color: colors[index % colors.length],
    duration: 3.5 + Math.random() * 2.5,
    delay: -Math.random() * 4.5, // negative = already mid-cycle on mount
    dx: (Math.random() - 0.5) * 40,
    dy: -20 - Math.random() * 30,
    opacity: kind === 'icy' ? 0.5 + Math.random() * 0.35 : 0.15 + Math.random() * 0.2,
  }))
}

// Floating dust (Legendary, icy/cyan) or smoke (Mythic, dark) orbs drifting
// around the card - decorative only, absolutely positioned across a layer
// slightly larger than the card so particles can drift beyond its edges.
// Plain CSS `animation` (see .card-particle / index.css), so it
// automatically goes still under reduce-motion; the caller skips rendering
// this component entirely in that case anyway (nothing to freeze mid-air).
export default function CardParticles({ kind }: CardParticlesProps) {
  const particles = useMemo(() => buildParticles(kind), [kind])
  if (kind === 'none') return null

  return (
    <div className="pointer-events-none absolute -inset-6 z-0 overflow-visible" aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="card-particle"
          style={
            {
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              filter: kind === 'smoke' ? 'blur(3px)' : 'blur(0.5px)',
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              '--particle-dx': `${particle.dx}px`,
              '--particle-dy': `${particle.dy}px`,
              '--particle-opacity': particle.opacity,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
