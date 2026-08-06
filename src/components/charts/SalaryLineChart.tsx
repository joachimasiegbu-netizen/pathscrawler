import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { usePathStore } from '../../store/usePathStore'

// 4 series -> categorical, slots 1-4 (blue/orange/aqua/yellow). At 4 series
// the series-count ladder (choosing-a-form.md) requires direct labels to
// stay mandatory - Recharts' built-in Legend + Tooltip cover that here.
const COLORS_LIGHT = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100']
const COLORS_DARK = ['#3987e5', '#d95926', '#199e70', '#c98500']

const SERIES = [
  { key: 'softwareDev', name: 'Software Developer' },
  { key: 'nurse', name: 'Registered Nurse' },
  { key: 'aiEngineer', name: 'AI Engineer' },
  { key: 'graphicDesigner', name: 'Graphic Designer' },
] as const

export interface SalaryTrendDatum {
  month: string
  softwareDev: number
  nurse: number
  aiEngineer: number
  graphicDesigner: number
}

export default function SalaryLineChart({ data }: { data: SalaryTrendDatum[] }) {
  const isDark = usePathStore((state) => state.accessibilitySettings.darkMode)
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const colors = isDark ? COLORS_DARK : COLORS_LIGHT
  const gridColor = isDark ? '#2c2c2a' : '#e1e0d9'
  const tickColor = isDark ? '#c3c2b7' : '#52514e'

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={gridColor} />
        <XAxis dataKey="month" tick={{ fill: tickColor, fontSize: 11 }} axisLine={{ stroke: gridColor }} tickLine={false} />
        <YAxis
          tick={{ fill: tickColor, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={48}
          tickFormatter={(value: number) => `£${Math.round(value / 1000)}k`}
        />
        <Tooltip
          formatter={(value: any, name: any) => [`£${Number(value).toLocaleString('en-GB')}`, name]}
          contentStyle={{ background: '#0f172a', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: tickColor }} />
        {SERIES.map((series, index) => (
          <Line
            key={series.key}
            type="monotone"
            dataKey={series.key}
            name={series.name}
            stroke={colors[index]}
            strokeWidth={2}
            dot={{ r: 4, fill: colors[index], stroke: isDark ? '#1e293b' : '#ffffff', strokeWidth: 2 }}
            activeDot={{ r: 5 }}
            isAnimationActive={!reduceMotion}
            animationDuration={800}
            animationEasing="ease-out"
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
