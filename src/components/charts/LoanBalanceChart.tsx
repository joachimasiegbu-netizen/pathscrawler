import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { usePathStore } from '../../store/usePathStore'
import type { LoanResult } from '../../utils/studentLoanModel'
import { gbp } from '../../utils/studentLoanModel'

interface ChartRow {
  year: string
  balance: number
  compare?: number
}

export default function LoanBalanceChart({
  primary,
  compare,
  writeOffYear,
}: {
  primary: LoanResult
  compare?: LoanResult | null
  writeOffYear: number
}) {
  const isDark = usePathStore((state) => state.accessibilitySettings.darkMode)
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)
  const gridColor = isDark ? '#2c2c2a' : '#e1e0d9'
  const tickColor = isDark ? '#c3c2b7' : '#52514e'

  const rows: ChartRow[] = primary.years
    .filter((y) => y.phase === 'repay')
    .map((y, i) => ({
      year: String(y.yearIndex),
      balance: Math.round(y.balance),
      compare: compare?.years.filter((c) => c.phase === 'repay')[i]?.balance,
    }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={rows} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={gridColor} vertical={false} />
        <XAxis
          dataKey="year"
          tick={{ fill: tickColor, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          label={{ value: 'Years after graduating', position: 'insideBottom', offset: -2, fill: tickColor, fontSize: 11 }}
        />
        <YAxis
          tick={{ fill: tickColor, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={64}
          tickFormatter={(v: number) => (v >= 1000 ? `£${Math.round(v / 1000)}k` : `£${v}`)}
        />
        <Tooltip
          formatter={(value: number, name: string) => [gbp(value), name === 'compare' ? 'Scenario B' : 'Balance']}
          labelFormatter={(l: string) => `Year ${l}`}
          contentStyle={{ background: '#0f172a', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }}
        />
        {writeOffYear <= rows.length ? (
          <ReferenceLine
            x={String(writeOffYear)}
            stroke="#dc2626"
            strokeDasharray="4 3"
            label={{ value: 'Write-off', fill: '#dc2626', fontSize: 10, position: 'insideTopRight' }}
          />
        ) : null}
        <Area
          type="monotone"
          dataKey="balance"
          stroke="#6366f1"
          strokeWidth={2}
          fill="url(#balanceFill)"
          isAnimationActive={!reduceMotion}
        />
        {compare ? (
          <Line
            type="monotone"
            dataKey="compare"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 4"
            isAnimationActive={!reduceMotion}
          />
        ) : null}
      </AreaChart>
    </ResponsiveContainer>
  )
}
