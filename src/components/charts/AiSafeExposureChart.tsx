import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { usePathStore } from '../../store/usePathStore'

// Same shape as HotSkillsChart, deliberately green instead of blue - this
// is the "safe" counterpart to the red trend bars elsewhere on the AI
// Endangered Jobs page, so the color itself carries meaning (green = low
// AI exposure) rather than being an arbitrary palette choice.
const COLOR_LIGHT = '#16a34a'
const COLOR_DARK = '#22c55e'

export interface SectorExposureDatum {
  sector: string
  exposure: number
}

export default function AiSafeExposureChart({ data }: { data: SectorExposureDatum[] }) {
  const isDark = usePathStore((state) => state.accessibilitySettings.darkMode)
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const gridColor = isDark ? '#2c2c2a' : '#e1e0d9'
  const tickColor = isDark ? '#c3c2b7' : '#52514e'
  const sorted = [...data].sort((a, b) => a.exposure - b.exposure)
  // On phones the 150px label column leaves the plot area too narrow for
  // the tooltip, so Recharts pins it there and it gets clipped - anchor it
  // to the chart's left edge (over the labels) instead, where it fits.
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 639px)').matches)
  useEffect(() => {
    const query = window.matchMedia('(max-width: 639px)')
    const onChange = () => setIsMobile(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  // overflow-hidden: see DemandBarChart - stops the parked tooltip wrapper
  // from widening the page on mobile.
  return (
    <div className="overflow-hidden">
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={sorted} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke={gridColor} />
        <XAxis
          type="number"
          domain={[0, 24]}
          unit="%"
          tick={{ fill: tickColor, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis type="category" dataKey="sector" tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} width={150} />
        <Tooltip
          position={isMobile ? { x: 0 } : undefined}
          formatter={(value: any) => [`${value}%`, 'AI task exposure']}
          contentStyle={{ background: '#0f172a', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, maxWidth: 200, whiteSpace: 'normal' }}
        />
        <Bar
          dataKey="exposure"
          fill={isDark ? COLOR_DARK : COLOR_LIGHT}
          radius={[0, 6, 6, 0]}
          maxBarSize={20}
          isAnimationActive={!reduceMotion}
          animationDuration={700}
          animationEasing="ease-out"
        />
      </BarChart>
    </ResponsiveContainer>
    </div>
  )
}
