import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { usePathStore } from '../store/usePathStore'

// Full-bleed stock-ticker banner - breaks out of the page's max-w-5xl
// container and horizontal padding to reach both viewport edges, regardless
// of nesting depth (see MobileContainer.tsx: no ancestor has overflow
// hidden, so the negative-margin technique isn't clipped). Always dark,
// independent of the app's light/dark mode toggle - a ticker reads as its
// own fixed "stock ticker" chrome, not a themed card. Up/down deltas keep
// the app's existing green-400/red-400 text convention, which already
// reads well against a dark surface.

export interface TickerItem {
  label: string
  direction?: 'up' | 'down'
}

const BREAKOUT = 'w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]'

export default function MarketTicker({ items }: { items: TickerItem[] }) {
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)

  const renderItem = (item: TickerItem, key: string) => (
    <span
      key={key}
      className="inline-flex items-center gap-1.5 whitespace-nowrap px-4 text-xs font-semibold text-slate-200 sm:text-sm"
    >
      {item.direction === 'up' ? <TrendingUp className="h-3.5 w-3.5 text-green-400" /> : null}
      {item.direction === 'down' ? <TrendingDown className="h-3.5 w-3.5 text-red-400" /> : null}
      {item.label}
    </span>
  )

  if (reduceMotion) {
    return (
      <div className={`${BREAKOUT} flex flex-wrap items-center gap-x-1 gap-y-2 rounded-none bg-slate-900 px-4 py-3`}>
        {items.map((item, index) => renderItem(item, `static-${index}`))}
      </div>
    )
  }

  return (
    <div className={`${BREAKOUT} overflow-hidden rounded-none bg-slate-900 py-3`}>
      <motion.div
        className="flex w-max"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((item, index) => renderItem(item, `a-${index}`))}
        {items.map((item, index) => renderItem(item, `b-${index}`))}
      </motion.div>
    </div>
  )
}
