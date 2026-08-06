import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { usePathStore } from '../../store/usePathStore'

// 2 series -> tell them apart -> categorical (slots 1-2: blue/orange).
// Validated via dataviz/scripts/validate_palette.js against this app's
// white / slate-800 surfaces (see JobMarketPage.tsx history for the run).
const COLORS_LIGHT = { nominal: '#2a78d6', real: '#eb6834' }
const COLORS_DARK = { nominal: '#3987e5', real: '#d95926' }

export interface EarningsGrowthDatum {
  category: string
  nominal: number
  real: number
}

export default function EarningsGrowthChart({ data }: { data: EarningsGrowthDatum[] }) {
  const isDark = usePathStore((state) => state.accessibilitySettings.darkMode)
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const colors = isDark ? COLORS_DARK : COLORS_LIGHT
  const gridColor = isDark ? '#2c2c2a' : '#e1e0d9'
  const tickColor = isDark ? '#c3c2b7' : '#52514e'

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={3}>
        <CartesianGrid vertical={false} stroke={gridColor} />
        <XAxis dataKey="category" tick={{ fill: tickColor, fontSize: 12 }} axisLine={{ stroke: gridColor }} tickLine={false} />
        <YAxis tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} unit="%" width={36} />
        <Tooltip
          formatter={(value: any) => [`${value}%`, undefined]}
          contentStyle={{
            background: isDark ? '#0f172a' : '#0f172a',
            border: 'none',
            borderRadius: 8,
            color: '#fff',
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: tickColor }} />
        <Bar
          dataKey="nominal"
          name="Nominal"
          fill={colors.nominal}
          radius={[6, 6, 0, 0]}
          maxBarSize={24}
          isAnimationActive={!reduceMotion}
          animationDuration={700}
          animationEasing="ease-out"
        />
        <Bar
          dataKey="real"
          name="Real (CPIH-adjusted)"
          fill={colors.real}
          radius={[6, 6, 0, 0]}
          maxBarSize={24}
          isAnimationActive={!reduceMotion}
          animationDuration={700}
          animationEasing="ease-out"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
