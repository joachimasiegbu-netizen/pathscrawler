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

interface StaggerGridProps {
  children: ReactNode
  className?: string
  // whileInView's visibility threshold is checked against the WHOLE
  // container, not each row - fine for a handful of items, but a grid tall
  // enough that no viewport can ever show "enough" of it at once (e.g. 30
  // result cards) never satisfies that threshold and never reveals past the
  // first row or two, however far you scroll. revealOnMount switches that
  // grid to animate in immediately instead of waiting on scroll
  // intersection - same stagger, it just triggers on mount rather than on
  // view. Opt-in (defaults to the original scroll-reveal) so existing
  // shorter grids keep their current behavior.
  revealOnMount?: boolean
}

export default function StaggerGrid({ children, className, revealOnMount = false }: StaggerGridProps) {
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  const triggerProps = revealOnMount
    ? { animate: 'visible' }
    : { whileInView: 'visible', viewport: { once: true, margin: '-60px' } }

  return (
    <motion.div className={className} variants={container} initial="hidden" {...triggerProps}>
      {Children.map(children, (child) => (
        <motion.div variants={item}>{child}</motion.div>
      ))}
    </motion.div>
  )
}
