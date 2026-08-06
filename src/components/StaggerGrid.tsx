import { Children, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { usePathStore } from '../store/usePathStore'

// Wraps a set of grid/list items so they fade+slide in one after another as
// the group scrolls into view, instead of the whole block appearing at once.
// Drop-in replacement for a plain `<div className="grid ...">{items}</div>` -
// pass the same className, map your items as children as usual.

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function StaggerGrid({ children, className }: { children: ReactNode; className?: string }) {
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {Children.map(children, (child) => (
        <motion.div variants={item}>{child}</motion.div>
      ))}
    </motion.div>
  )
}
