import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { usePathStore } from '../../store/usePathStore'

// Single series magnitude -> one hue (categorical slot 1, "blue"), no
// legend needed. Same validated palette as the other charts on this page.
const COLOR_LIGHT = '#2a78d6'
const COLOR_DARK = '#3987e5'

export interface HotSkillDatum {
  skill: string
  demandScore: number
}

export default function HotSkillsChart({ data }: { data: HotSkillDatum[] }) {
  const isDark = usePathStore((state) => state.accessibilitySettings.darkMode)
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const gridColor = isDark ? '#2c2c2a' : '#e1e0d9'
  const tickColor = isDark ? '#c3c2b7' : '#52514e'
  const sorted = [...data].sort((a, b) => a.demandScore - b.demandScore)

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={sorted} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 0 }}>
        <CartesianGrid horizontal={false} stroke={gridColor} />
        <XAxis type="number" domain={[0, 100]} tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="skill"
          tick={{ fill: tickColor, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={160}
        />
        <Tooltip
          formatter={(value: any) => [value, 'Demand score']}
          contentStyle={{ background: '#0f172a', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }}
        />
        <Bar
          dataKey="demandScore"
          fill={isDark ? COLOR_DARK : COLOR_LIGHT}
          radius={[0, 6, 6, 0]}
          maxBarSize={20}
          isAnimationActive={!reduceMotion}
          animationDuration={700}
          animationEasing="ease-out"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
