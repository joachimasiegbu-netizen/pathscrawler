import { useMemo, type CSSProperties } from 'react'
import demoCareers from '../data/demoCareers'
import { getCareerTier } from '../utils/careerTiers'

// Muted left-border accents cycling across the app's own brand/status
// tokens - kept as plain color classes (no dark: variants) because the
// whole layer is already low-opacity and blurred, and gets dimmed further
// as a unit in dark mode (see the wrapper's dark:opacity-60 below) rather
// than fighting the hand-rolled index.css dark-mode overrides per-item.
const BORDER_COLORS = [
  'border-l-primary/60',
  'border-l-accent/60',
  'border-l-secondary/60',
  'border-l-emerald-400/60',
  'border-l-slate-400/60',
]
const DRIFTS = ['float-up-a', 'float-up-b', 'float-up-c']

// Total item count is fixed (TOTAL); the extra ones beyond MOBILE_COUNT are
// simply hidden below the `sm` breakpoint with a Tailwind class, so there's
// no resize-listener/JS needed to vary the count responsively.
const TOTAL = 48
const MOBILE_COUNT = 24

interface FloatingCard {
  id: number
  title: string
  salary: string
  left: number
  duration: number
  delay: number
  peakOpacity: number
  rotate: number
  cardScale: number
  borderColor: string
  drift: string
  mobileVisible: boolean
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// This background sits behind the whole Roll a Job page, including while
// the slot lane is actively spinning - same "sealed until you actually get
// it" reasoning as SlotMachineLane.tsx's own reel cards applies here too,
// so Mythic/Celestial careers are excluded from the pool entirely rather
// than shown-then-blanked (there's no per-card reveal moment to gate here,
// so simplest correct fix is to just never draw one).
const REVEAL_GATED_TIERS = new Set(['mythic', 'celestial'])

function buildFloatingCards(): FloatingCard[] {
  const eligibleCareers = demoCareers.filter((career) => !REVEAL_GATED_TIERS.has(getCareerTier(career)))
  const pool: typeof demoCareers = []
  // Cycle through all eligible careers, reshuffling as needed to fill TOTAL.
  while (pool.length < TOTAL) {
    const shuffled = [...eligibleCareers].sort(() => Math.random() - 0.5)
    pool.push(...shuffled)
  }

  return Array.from({ length: TOTAL }, (_, index) => {
    const duration = 16 + Math.random() * 18 // 16-34s, slow and ambient
    return {
      id: index,
      title: pool[index].title,
      salary: pool[index].salary,
      left: Math.random() * 90, // vw %, leave margin for the ~120px card width
      duration,
      delay: -Math.random() * duration, // negative = start mid-cycle
      peakOpacity: 0.15 + Math.random() * 0.1, // 0.15-0.25
      rotate: -8 + Math.random() * 16, // -8deg to 8deg
      cardScale: 0.5 + Math.random() * 0.25, // 0.5-0.75
      borderColor: pickRandom(BORDER_COLORS),
      drift: pickRandom(DRIFTS),
      mobileVisible: index < MOBILE_COUNT,
    }
  })
}

interface FloatingJobBackgroundProps {
  /** True while a result card is on screen - fades the whole layer down further so it doesn't compete with the card. */
  dimmed?: boolean
}

// Decorative only - mini job cards drift up the page on an infinite loop,
// cycling through the real career list. Pure CSS animation (see index.css)
// so it's GPU-accelerated and automatically respects the app's reduce-motion
// setting without any extra logic here. Sits behind the slot lane/roll
// button (z-0 vs their z-10) - the same layer that used to also change
// speed while a roll spun, before that job moved to the slot lane itself.
export default function FloatingJobBackground({ dimmed = false }: FloatingJobBackgroundProps) {
  const cards = useMemo(buildFloatingCards, [])

  return (
    <div
      // No negative z-index: that only reliably sits "behind" content whose
      // parent forms its own stacking context, which isn't guaranteed here.
      // Being the first child of a `relative` parent, with every other
      // section on the page explicitly `relative z-10`, achieves the same
      // "behind everything" effect without depending on an ancestor's
      // stacking context.
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden transition-opacity duration-500 ${
        dimmed ? 'opacity-[0.05]' : 'opacity-100 dark:opacity-60'
      }`}
      aria-hidden="true"
    >
      {cards.map((card) => (
        <div
          key={card.id}
          className={`floating-job-card absolute bottom-0 w-[120px] overflow-hidden rounded-xl border border-slate-200/60 bg-white/90 p-2 shadow-sm blur-sm dark:border-slate-600/60 dark:bg-slate-800/90 border-l-4 ${card.borderColor} ${
            card.mobileVisible ? '' : 'hidden sm:block'
          }`}
          style={{
            left: `${card.left}%`,
            animationName: card.drift,
            animationDuration: `${card.duration}s`,
            animationDelay: `${card.delay}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out',
            // Custom properties, read by the keyframes in index.css
            ...({
              '--peak-opacity': card.peakOpacity,
              '--rotate': `${card.rotate}deg`,
              '--card-scale': card.cardScale,
            } as CSSProperties),
          }}
        >
          <p className="truncate text-[10px] font-bold leading-tight text-slate-700 dark:text-slate-200">{card.title}</p>
          <p className="mt-1 truncate text-[9px] font-semibold leading-tight text-slate-500 dark:text-slate-400">{card.salary}</p>
        </div>
      ))}
    </div>
  )
}
