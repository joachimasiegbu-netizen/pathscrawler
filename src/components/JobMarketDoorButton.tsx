import { motion } from 'framer-motion'
import { type LucideIcon, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { usePathStore } from '../store/usePathStore'

// Each "door" gets a distinct, saturated stock Tailwind hue rather than the
// app's own primary/secondary/accent tokens - deliberately, this is a
// wayfinding pattern (4 destinations that need to read as clearly different
// at a glance), the same job the search category dots do elsewhere, not app
// chrome. Same reasoning the earlier brand pass already carved out an
// exception for.
const THEME = {
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950',
    border: 'border-purple-200 hover:border-purple-300 dark:border-purple-800 dark:hover:border-purple-700',
    glow: 'hover:shadow-lg hover:shadow-purple-200/60 dark:hover:shadow-purple-950/60',
    accent: 'text-purple-600 dark:text-purple-400',
    title: 'text-purple-900 dark:text-purple-100',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    border: 'border-blue-200 hover:border-blue-300 dark:border-blue-800 dark:hover:border-blue-700',
    glow: 'hover:shadow-lg hover:shadow-blue-200/60 dark:hover:shadow-blue-950/60',
    accent: 'text-blue-600 dark:text-blue-400',
    title: 'text-blue-900 dark:text-blue-100',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950',
    border: 'border-emerald-200 hover:border-emerald-300 dark:border-emerald-800 dark:hover:border-emerald-700',
    glow: 'hover:shadow-lg hover:shadow-emerald-200/60 dark:hover:shadow-emerald-950/60',
    accent: 'text-emerald-600 dark:text-emerald-400',
    title: 'text-emerald-900 dark:text-emerald-100',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950',
    border: 'border-amber-200 hover:border-amber-300 dark:border-amber-800 dark:hover:border-amber-700',
    glow: 'hover:shadow-lg hover:shadow-amber-200/60 dark:hover:shadow-amber-950/60',
    accent: 'text-amber-600 dark:text-amber-400',
    title: 'text-amber-900 dark:text-amber-100',
  },
} as const

export type DoorAccent = keyof typeof THEME

interface JobMarketDoorButtonProps {
  icon: LucideIcon
  title: string
  subtitle: string
  href: string
  accent: DoorAccent
  index: number
}

export default function JobMarketDoorButton({ icon: Icon, title, subtitle, href, accent, index }: JobMarketDoorButtonProps) {
  const navigate = useNavigate()
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const theme = THEME[accent]

  const motionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: index * 0.1, ease: 'easeOut' as const },
      }

  return (
    <motion.button
      type="button"
      onClick={() => navigate(href)}
      {...motionProps}
      className={`group flex h-28 w-full items-center gap-4 rounded-2xl border p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-95 sm:h-36 sm:gap-5 sm:p-6 ${theme.bg} ${theme.border} ${theme.glow}`}
    >
      <Icon className={`h-8 w-8 shrink-0 sm:h-9 sm:w-9 ${theme.accent}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <h3 className={`text-lg font-bold sm:text-2xl ${theme.title}`}>{title}</h3>
        <p className={`mt-1 text-sm opacity-80 sm:text-base ${theme.accent}`}>{subtitle}</p>
      </div>
      <ChevronRight
        className={`h-6 w-6 shrink-0 transition-transform duration-200 group-hover:translate-x-1 ${theme.accent}`}
        aria-hidden="true"
      />
    </motion.button>
  )
}
