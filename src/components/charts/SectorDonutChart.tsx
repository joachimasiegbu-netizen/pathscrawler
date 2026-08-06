import { useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { usePathStore } from '../../store/usePathStore'

// 9 slices exceeds the categorical ladder's safe ceiling (dataviz
// anti-patterns.md: "past ~7 bins, adjacent classes blur" and a pie/donut is
// an all-pairs form where only the first 3 documented slots validate
// pairwise CVD safety in both modes). Rather than force a 9th generated hue
// (explicitly forbidden - "a generated 9th hue is indistinguishable from an
// existing one under CVD"), the 8 named sectors take the 8 documented
// categorical hues (validated adjacent-pairs PASS in both modes) and the
// catch-all "Other" bucket takes neutral gray, the conventional treatment
// for a miscellaneous slice. Every slice is also direct-labeled below the
// chart (name + percentage) as the required secondary encoding, since
// several slots sit under 3:1 contrast against the surface.
const COLORS_LIGHT = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948', '#94a3b8']
const COLORS_DARK = ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#008300', '#9085e9', '#e66767', '#94a3b8']

export interface SectorDatum {
  sector: string
  percentage: number
}

export default function SectorDonutChart({ data }: { data: SectorDatum[] }) {
  const isDark = usePathStore((state) => state.accessibilitySettings.darkMode)
  const colors = isDark ? COLORS_DARK : COLORS_LIGHT
  const textColor = isDark ? '#e2e8f0' : '#334155'
  // Recharts' built-in <Tooltip> never activated on this Pie in testing
  // (bar/line charts on this same page work fine with the same Tooltip
  // component - this is specific to Pie's item-hover wiring here), so hover
  // is wired directly on <Pie>'s own onMouseEnter/onMouseLeave instead,
  // which Pie forwards to every sector regardless (see Pie.js
  // renderSectorsStatically -> adaptEventsOfChild). Highlighting the
  // matching legend row is more useful here anyway, since every value is
  // already direct-labeled below - hover just needs to correlate slice to row.
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  return (
    <div>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="percentage"
            nameKey="sector"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            stroke={isDark ? '#1e293b' : '#ffffff'}
            strokeWidth={2}
            isAnimationActive={false}
            onMouseEnter={(_data: unknown, index: number) => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.sector}
                fill={colors[index % colors.length]}
                opacity={hoverIndex === null || hoverIndex === index ? 1 : 0.35}
                style={{ cursor: 'pointer', transition: 'opacity 120ms ease' }}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Direct labels for every slice - the required secondary encoding at
          this many categories, and doubles as the table-view twin. Hovering
          a slice above highlights its row here. */}
      <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
        {data.map((entry, index) => (
          <div
            key={entry.sector}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
            className={`flex items-center gap-2 rounded-md px-1.5 py-0.5 text-xs transition-colors ${
              hoverIndex === index ? 'bg-slate-100 dark:bg-slate-700' : ''
            }`}
          >
            <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: colors[index % colors.length] }} />
            <span style={{ color: textColor }} className="truncate">{entry.sector}</span>
            <span className="ml-auto shrink-0 font-semibold tabular-nums" style={{ color: textColor }}>{entry.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
