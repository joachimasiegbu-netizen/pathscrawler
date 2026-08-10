import { useMemo } from 'react'
import { useNavigate, type NavigateFunction } from 'react-router-dom'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  ExternalLink,
  LineChart as LineChartIcon,
  ListChecks,
  PieChart as PieChartIcon,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import CountUpStat from '../components/CountUpStat'
import MarketTicker from '../components/MarketTicker'
import RevealSection from '../components/RevealSection'
import ScrollToTopButton from '../components/ScrollToTopButton'
import DemandBarChart from '../components/charts/DemandBarChart'
import EarningsGrowthChart from '../components/charts/EarningsGrowthChart'
import HotSkillsChart from '../components/charts/HotSkillsChart'
import SalaryLineChart from '../components/charts/SalaryLineChart'
import SectorDonutChart from '../components/charts/SectorDonutChart'
import demoCareers from '../data/demoCareers'
import { jobMarketData } from '../data/jobMarketData'
import { earningsGrowthData, earningsHeadlineStats, earningsSource } from '../data/onsEarnings'
import { getWeeklySpotlight } from '../utils/weeklySpotlight'

// This is the original /job-market dashboard, moved here verbatim (see
// JobMarketPage.tsx for the new 4-door hub it used to live at). Only the
// header block changed - back button target/label, title text + icon, and
// the gradient bar's color, to match the Statistics hub door's blue theme.
// Everything below that line - ticker, spotlight teaser, earnings, trending
// lists, all 4 charts, the footer credit - is untouched: same components,
// same data, same layout.

interface TrendingJob {
  career: string
  change: string
  avgSalary: string
  jobPostings: string
  description: string
}

function RealDataBadge({ label = 'Real ONS data' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm shadow-green-500/30 ring-1 ring-green-400">
      <BadgeCheck className="h-4 w-4" />
      {label}
    </span>
  )
}

// Trending career titles are plain strings, not demoCareers ids, so a title
// match (ignoring "/" spacing quirks like "AI / ML" vs "AI/ML") is how we
// find a page to link to. A couple of jobMarketData.js titles are a real
// person's-job-title synonym rather than a formatting quirk (e.g. the
// formal "Registered Nurse" vs demoCareers' plain "Nurse") - those get an
// explicit alias rather than a fuzzy/guessed match, since a wrong guess
// would send someone to an unrelated career page.
const TITLE_ALIASES: Record<string, string> = {
  'Registered Nurse': 'Nurse',
}

function findCareerId(title: string): number | undefined {
  const normalize = (value: string) => value.toLowerCase().replace(/\s*\/\s*/g, '/').trim()
  const target = normalize(TITLE_ALIASES[title] ?? title)
  return demoCareers.find((career) => normalize(career.title) === target)?.id
}

function TrendingRow({ item, direction, navigate }: { item: TrendingJob; direction: 'up' | 'down'; navigate: NavigateFunction }) {
  const careerId = findCareerId(item.career)
  const isUp = direction === 'up'

  const go = () => {
    if (careerId) navigate(`/career/${careerId}`)
  }

  return (
    <div
      role={careerId ? 'button' : undefined}
      tabIndex={careerId ? 0 : undefined}
      onClick={careerId ? go : undefined}
      onKeyDown={
        careerId
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                go()
              }
            }
          : undefined
      }
      className={`flex flex-wrap items-center justify-between gap-2 rounded-r-lg border-l-4 py-3 pl-3 pr-2 transition-colors duration-150 ${
        isUp ? 'border-green-500' : 'border-red-500'
      } ${careerId ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700' : ''}`}
    >
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
          {isUp ? (
            <ArrowUpRight className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
          ) : (
            <ArrowDownRight className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
          )}
          {item.career}
        </p>
        <p className="mt-0.5 pl-[22px] text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
      </div>
      <div className="flex shrink-0 items-center gap-4 text-right">
        <span className={`text-sm font-bold ${isUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {item.change}
        </span>
        <span className="w-24 text-sm font-semibold text-slate-800 dark:text-slate-100">{item.avgSalary}</span>
        <span className="w-32 text-xs text-slate-500 dark:text-slate-400">{item.jobPostings}</span>
      </div>
    </div>
  )
}

const LAST_UPDATED = jobMarketData.lastUpdated

export default function JobMarketStatisticsPage() {
  const navigate = useNavigate()
  const spotlight = useMemo(() => getWeeklySpotlight(), [])

  const tickerItems = useMemo(
    () => [
      ...jobMarketData.trendingUp.map((item) => ({ label: `${item.career} ${item.change}`, direction: 'up' as const })),
      ...jobMarketData.trendingDown.map((item) => ({ label: `${item.career} ${item.change}`, direction: 'down' as const })),
    ],
    [],
  )

  const demandChartData = useMemo(
    () => [
      ...jobMarketData.trendingUp.map((item) => ({ career: item.career, change: Number(item.change.replace('%', '')) })),
      ...jobMarketData.trendingDown.map((item) => ({ career: item.career, change: Number(item.change.replace('%', '')) })),
    ].sort((a, b) => b.change - a.change),
    [],
  )

  return (
    <div className="space-y-8 pt-8 px-6 pb-8 sm:px-8">
      <div className="space-y-4">
        <BackButton to="/job-market" label="Job Market" />
        <div>
          <h2 className="flex items-center gap-3 text-4xl font-extrabold text-slate-950 dark:text-slate-50 sm:text-5xl">
            <BarChart3 className="h-8 w-8 shrink-0 text-blue-600 dark:text-blue-400 sm:h-9 sm:w-9" aria-hidden="true" />
            Statistics
          </h2>
          <div className="mt-3 h-1.5 w-20 rounded-full bg-gradient-to-r from-blue-600 to-blue-400" />
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 dark:text-slate-200">
            Career trends and salary insights from UK labour market data.
          </p>
        </div>
      </div>

      <MarketTicker items={tickerItems} />

      <RevealSection className="relative rounded-3xl bg-white px-8 py-9 shadow-[0_10px_40px_-14px_rgba(37,99,235,0.35)] ring-1 ring-primary/10 dark:bg-slate-800 dark:ring-primary/20">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary-dark dark:text-primary-light">
          <Sparkles className="h-4 w-4" />
          This week's spotlight
        </div>
        {/* The whole card is a secondary tap target (click anywhere to go
            through) - the Button below stays the primary, keyboard/
            screen-reader-accessible way to trigger the same navigation. */}
        <div
          onClick={() => navigate(`/career/${spotlight.career.id}`)}
          className="mt-4 cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-colors duration-150 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-700"
        >
          <p className="text-xl font-bold text-slate-950 dark:text-slate-50">{spotlight.career.title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{spotlight.blurb}</p>
          <Button onClick={() => navigate(`/career/${spotlight.career.id}`)} className="mt-4">
            Explore the pathway
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </RevealSection>

      <RevealSection className="rounded-3xl bg-gradient-to-br from-primary-soft/50 via-white to-white px-8 py-8 shadow-soft ring-1 ring-primary/10 dark:from-primary/10 dark:via-slate-800 dark:to-slate-900 dark:ring-primary/20">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xl font-bold text-slate-950 dark:text-slate-50">
            <TrendingUp className="h-5 w-5" />
            UK earnings
          </div>
          <RealDataBadge />
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">April 2025, compared with April 2024.</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {earningsHeadlineStats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/70">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">{stat.label}</p>
              <CountUpStat value={stat.value} className="mt-1 block text-3xl font-extrabold text-slate-950 dark:text-slate-50" />
              <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400">
                <TrendingUp className="h-3.5 w-3.5" />
                {stat.deltaLabel}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm font-semibold text-slate-800 dark:text-slate-100">Earnings growth by working pattern</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Annual % change in median gross weekly earnings, nominal vs inflation-adjusted (CPIH real terms).
        </p>
        <div className="mt-4">
          <EarningsGrowthChart data={earningsGrowthData} />
        </div>

        <a
          href={earningsSource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          Source: {earningsSource.label}, released {earningsSource.released}
          <ExternalLink className="h-3 w-3" />
        </a>
      </RevealSection>

      <RevealSection className="rounded-3xl bg-white px-8 py-8 shadow-soft dark:bg-slate-800">
        <div className="flex items-center gap-2 text-xl font-bold text-slate-950 dark:text-slate-50">
          <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
          Trending up
        </div>
        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
          {jobMarketData.trendingUp.map((item) => (
            <TrendingRow key={item.career} item={item} direction="up" navigate={navigate} />
          ))}
        </div>
      </RevealSection>

      <RevealSection className="rounded-3xl bg-white px-8 py-8 shadow-soft dark:bg-slate-800">
        <div className="flex items-center gap-2 text-xl font-bold text-slate-950 dark:text-slate-50">
          <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
          Trending down
        </div>
        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
          {jobMarketData.trendingDown.map((item) => (
            <TrendingRow key={item.career} item={item} direction="down" navigate={navigate} />
          ))}
        </div>
      </RevealSection>

      <RevealSection className="rounded-3xl bg-white px-8 py-8 shadow-soft dark:bg-slate-800">
        <div className="flex items-center gap-2 text-xl font-bold text-slate-950 dark:text-slate-50">
          <BarChart3 className="h-5 w-5" />
          Most in-demand careers
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Annual change in demand. Green is growing, red is declining.</p>
        <div className="mt-5">
          <DemandBarChart data={demandChartData} />
        </div>
      </RevealSection>

      <RevealSection className="rounded-3xl bg-white px-8 py-8 shadow-soft dark:bg-slate-800">
        <div className="flex items-center gap-2 text-xl font-bold text-slate-950 dark:text-slate-50">
          <LineChartIcon className="h-5 w-5" />
          Salary trends (6 months)
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Average advertised salary by role.</p>
        <div className="mt-5">
          <SalaryLineChart data={jobMarketData.salaryTrends} />
        </div>
      </RevealSection>

      <RevealSection className="rounded-3xl bg-white px-8 py-8 shadow-soft dark:bg-slate-800">
        <div className="flex items-center gap-2 text-xl font-bold text-slate-950 dark:text-slate-50">
          <ListChecks className="h-5 w-5" />
          Hot skills in demand
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Demand score, 0-100.</p>
        <div className="mt-5">
          <HotSkillsChart data={jobMarketData.hotSkills} />
        </div>
      </RevealSection>

      <RevealSection className="rounded-3xl bg-white px-8 py-8 shadow-soft dark:bg-slate-800">
        <div className="flex items-center gap-2 text-xl font-bold text-slate-950 dark:text-slate-50">
          <PieChartIcon className="h-5 w-5" />
          Career distribution by sector
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Share of UK job postings by broad sector.</p>
        <div className="mt-5">
          <SectorDonutChart data={jobMarketData.sectorDistribution} />
        </div>
      </RevealSection>

      <RevealSection className="text-center text-xs text-slate-400 dark:text-slate-500">
        <p>{jobMarketData.sourceCredit}</p>
        <p className="mt-1">
          For official statistics, visit the{' '}
          <a
            href="https://www.ons.gov.uk/employmentandlabourmarket"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary hover:underline"
          >
            Office for National Statistics
          </a>
          .
        </p>
        <p className="mt-1">Last updated: {LAST_UPDATED}</p>
      </RevealSection>

      <ScrollToTopButton />
    </div>
  )
}
