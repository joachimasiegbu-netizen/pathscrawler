import { motion } from 'framer-motion'

interface ConfettiBurstProps {
  colors: string[]
  count?: number
  durationMs?: number
}

// One-shot particle burst, same "deterministic fixed array, framer-motion,
// caller unmounts it after the fact" shape as SparkleBurst.tsx - just more
// particles, an upward+outward confetti-cannon spread with a bit of gravity
// drop, and a caller-supplied color palette so it can match the roll's tier.
export default function ConfettiBurst({ colors, count = 36, durationMs = 1400 }: ConfettiBurstProps) {
  const particles = Array.from({ length: count }, (_, index) => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.4 // mostly upward, wide spread
    const distance = 120 + Math.random() * 180
    return {
      id: index,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance + 60, // gravity drop past the burst apex
      rotate: Math.random() * 720 - 360,
      size: 5 + Math.random() * 6,
      color: colors[index % colors.length],
      delay: Math.random() * 0.15,
      isCircle: index % 3 === 0,
    }
  })

  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center" aria-hidden="true">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className={particle.isCircle ? 'absolute rounded-full' : 'absolute rounded-[1px]'}
          style={{ width: particle.size, height: particle.size * (particle.isCircle ? 1 : 2.2), backgroundColor: particle.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.6 }}
          animate={{ x: particle.x, y: particle.y, opacity: [1, 1, 0], rotate: particle.rotate, scale: 1 }}
          transition={{ duration: durationMs / 1000, delay: particle.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}
