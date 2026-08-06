import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { usePathStore } from '../store/usePathStore'

// Animates a formatted value like "£766.60" or "£39,039" counting up from 0
// once it scrolls into view. Parses the numeric part out, animates it with
// an eased requestAnimationFrame loop, and re-formats with the same prefix/
// suffix and decimal precision as the source string - no third-party
// count-up library needed for a one-shot stat animation.

interface CountUpStatProps {
  value: string
  duration?: number
  className?: string
}

function parseValue(value: string) {
  const match = value.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/)
  if (!match) return null
  const [, prefix, numStr, suffix] = match
  const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0
  const target = parseFloat(numStr.replace(/,/g, ''))
  return { prefix, suffix, decimals, target }
}

function format(prefix: string, suffix: string, decimals: number, current: number) {
  return `${prefix}${current.toLocaleString('en-GB', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}${suffix}`
}

export default function CountUpStat({ value, duration = 1000, className }: CountUpStatProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const parsed = parseValue(value)
  const [display, setDisplay] = useState(() => {
    if (reduceMotion || !parsed) return value
    return format(parsed.prefix, parsed.suffix, parsed.decimals, 0)
  })

  useEffect(() => {
    // Reduced motion shows the real value immediately, independent of scroll
    // position - there's nothing to animate, so it shouldn't wait on
    // visibility either (that would leave it stuck at "0" off-screen).
    if (reduceMotion) {
      setDisplay(value)
      return
    }
    if (!inView || !parsed) return
    const { prefix, suffix, decimals, target } = parsed
    const start = performance.now()
    let raf: number
    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - (1 - progress) ** 3 // ease-out cubic
      setDisplay(format(prefix, suffix, decimals, target * eased))
      if (progress < 1) {
        raf = requestAnimationFrame(tick)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value, duration, reduceMotion])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}
