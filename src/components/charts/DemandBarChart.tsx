import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { usePathStore } from '../../store/usePathStore'

// This series *means* good/bad (growing vs shrinking demand), so it wears
// status-style green/red rather than a single categorical hue - the
// collision rule in dataviz/references/color-formula.md explicitly allows
// this ("when a series means good/bad it wears status tokens"). Matches the
// green-600/red-600 (dark: green-400/red-400) convention already used
// elsewhere on this page (ticker, ONS deltas).
const UP_LIGHT = '#16a34a'
const UP_DARK = '#4ade80'
const DOWN_LIGHT = '#dc2626'
const DOWN_DARK = '#f87171'

export interface DemandDatum {
  career: string
  change: number
}

export default function DemandBarChart({ data }: { data: DemandDatum[] }) {
  const isDark = usePathStore((state) => state.accessibilitySettings.darkMode)
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const gridColor = isDark ? '#2c2c2a' : '#e1e0d9'
  const tickColor = isDark ? '#c3c2b7' : '#52514e'

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 72 }}>
        <CartesianGrid vertical={false} stroke={gridColor} />
        <XAxis
          dataKey="career"
          tick={{ fill: tickColor, fontSize: 11 }}
          axisLine={{ stroke: gridColor }}
          tickLine={false}
          interval={0}
          angle={-40}
          textAnchor="end"
          height={80}
        />
        <YAxis tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} unit="%" width={40} />
        <ReferenceLine y={0} stroke={gridColor} />
        <Tooltip
          formatter={(value: any) => [`${value > 0 ? '+' : ''}${value}%`, 'Change']}
          contentStyle={{ background: '#0f172a', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }}
        />
        <Bar
          dataKey="change"
          radius={[6, 6, 6, 6]}
          maxBarSize={28}
          isAnimationActive={!reduceMotion}
          animationDuration={700}
          animationEasing="ease-out"
        >
          {data.map((entry) => (
            <Cell key={entry.career} fill={entry.change >= 0 ? (isDark ? UP_DARK : UP_LIGHT) : isDark ? DOWN_DARK : DOWN_LIGHT} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
