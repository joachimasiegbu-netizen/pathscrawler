import { useId } from 'react'

// Brand mark: the original concept, polished rather than replaced - a
// winding path rising in two S-curve sweeps into an arrowhead, in white,
// inside a dark indigo circle badge (gradient + soft shadow for depth).
// Self-contained badge (own background + a fixed white glyph), so unlike a
// bare line-art mark it doesn't need its own light/dark color swap - only
// the wordmark next to it does. Geometry is mirrored (flat hex, no React)
// in public/favicon.svg for the browser tab.
//
// useId() keeps the circle's gradient id unique per instance: the header
// logo and the small auth-page logo both mount at once on /login and
// /signup, and two <linearGradient> defs sharing one id would collide.
const CIRCLE_SIZE_CLASS = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-16 w-16',
} as const

const TEXT_SIZE_CLASS = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-3xl',
} as const

const GAP_CLASS = {
  sm: 'gap-2',
  md: 'gap-2.5',
  lg: 'gap-3',
} as const

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const gradientId = useId()

  return (
    <span className={`inline-flex shrink-0 items-center ${GAP_CLASS[size]} ${className}`}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${CIRCLE_SIZE_CLASS[size]} shrink-0 drop-shadow-md`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3A6693" />
            <stop offset="100%" stopColor="#0F1E33" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="29" fill={`url(#${gradientId})`} />
        {/* Winding path: two S-curve sweeps rising left-to-right. */}
        <path
          d="M22 48C22 38 33 40 33 31C33 22 44 26 44 17"
          stroke="#FFFFFF"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Arrowhead, continuing straight up from where the path ends. */}
        <path d="M44 7L50 16L38 16Z" fill="#FFFFFF" />
      </svg>
      {showText ? (
        <span className={`whitespace-nowrap font-bold tracking-tight ${TEXT_SIZE_CLASS[size]}`}>
          <span className="text-primary dark:text-primary-light">Path</span>
          <span className="text-slate-800 dark:text-white">Scrawler</span>
        </span>
      ) : null}
    </span>
  )
}
