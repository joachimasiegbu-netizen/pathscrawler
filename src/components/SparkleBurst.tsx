import { motion } from 'framer-motion'
import { Sparkle } from 'lucide-react'

// One-shot particle burst for the spotlight reveal - a fixed ring of 10
// sparkles (deterministic angles/sizes, not randomized) shoots outward from
// center and fades as the card scales in behind it. Purely decorative
// (aria-hidden); the caller unmounts this ~900ms after firing it, comfortably
// after the last particle's own transition ends.
const PARTICLE_COUNT = 10

const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, index) => {
  const angle = (index / PARTICLE_COUNT) * Math.PI * 2
  const distance = 90 + (index % 3) * 24
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    size: 14 + (index % 3) * 6,
    delay: (index % 4) * 0.04,
    rotate: (index * 47) % 360,
  }
})

export default function SparkleBurst() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center" aria-hidden="true">
      {PARTICLES.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute text-amber-400 dark:text-amber-300"
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.3, rotate: 0 }}
          animate={{ x: particle.x, y: particle.y, opacity: [0, 1, 0], scale: 1, rotate: particle.rotate }}
          transition={{ duration: 0.8, delay: particle.delay, ease: 'easeOut' }}
        >
          <Sparkle size={particle.size} fill="currentColor" />
        </motion.div>
      ))}
    </div>
  )
}
