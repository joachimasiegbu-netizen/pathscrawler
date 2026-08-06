import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { usePathStore } from '../store/usePathStore'

// Fades + slides a section in as it scrolls into view. `once: true` means it
// never re-triggers on scroll-back-up (subtle, not distracting). Respects
// the app's reduceMotion setting the same way every other animated piece on
// this page does - renders a plain wrapper with no animation.

export default function RevealSection({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}
