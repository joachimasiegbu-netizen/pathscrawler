import { AlertTriangle, ArrowRight, Ghost, Hammer, ShieldCheck, TrendingUp } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton'
import RevealSection from '../components/RevealSection'
import ScrollToTopButton from '../components/ScrollToTopButton'
import StaggerGrid from '../components/StaggerGrid'
import AiSafeExposureChart from '../components/charts/AiSafeExposureChart'
import demoCareers from '../data/demoCareers'
import { aiEndangeredJobs, aiEndangeredNotes } from '../data/aiEndangeredJobs'
import {
  aiSafeCategories,
  aiSafeExposure,
  aiSafeHeadlineStat,
  aiSafeReasons,
  aiSafeSource,
} from '../data/aiSafeCareers'

// The new front door out of JobMarketStatisticsPage - replaced "See more UK
// labour market numbers" (see that page's history), which now sits behind
// this one instead. Its other 3 destinations (Heritage Crafts, High-Demand
// Careers, Vanished Jobs) would otherwise become unreachable from the
// Statistics page, so this page links out to those at the bottom. The
// general UK Labour Market Numbers hub itself (workforce size/employment
// rate) is deliberately NOT linked here - it's still a real route
// (/job-market/statistics/uk-numbers), just without a nav entry point for
// now.
//
// Two halves, red vs green: "Jobs Most at Risk from AI" (aiEndangeredJobs,
// the original content) and "Careers Least at Risk from AI" (aiSafeCareers,
// the mirror-image content) - same page, deliberately paired so a visitor
// gets the full picture rather than only the alarming half.

function findCareer(id: number) {
  return demoCareers.find((career) => career.id === id)
}

function AiJobCard({ job }: { job: (typeof aiEndangeredJobs)[number] }) {
  const career = job.careerId ? findCareer(job.careerId) : undefined

  if (!career) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/70">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{job.title}</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">No matching PathScrawler career page yet.</p>
      </div>
    )
  }

  return (
    <Link
      to={`/career/${career.id}`}
      className="block rounded-2xl border border-slate-200 bg-white/70 p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-red-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/70 dark:hover:border-red-800"
    >
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{job.title}</p>
      <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
        View {career.title} on PathScrawler
        <ArrowRight className="h-3 w-3 shrink-0" />
      </p>
    </Link>
  )
}

// Reference-list pill: name only, no salary/detail (this is a "here's the
// category" list, not a set of actionable cards like AiJobCard above) -
// clickable only for the handful with a real, honestly-matched
// PathScrawler career (see aiSafeCareers.ts), plain text otherwise.
function SafeOccupationPill({ name, careerId }: { name: string; careerId?: number }) {
  const career = careerId ? findCareer(careerId) : undefined
  const className =
    'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ' +
    (career
      ? 'border-green-200 bg-green-50 text-green-800 transition hover:bg-green-100 dark:border-green-900 dark:bg-green-950/40 dark:text-green-400 dark:hover:bg-green-950/70'
      : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200')

  if (!career) {
    return <span className={className}>{name}</span>
  }

  return (
    <Link to={`/career/${career.id}`} className={className}>
      {name}
    </Link>
  )
}

const MORE_PAGES = [
  {
    to: '/job-market/statistics/uk-numbers/heritage-crafts',
    icon: Hammer,
    title: 'Endangered & Heritage Crafts',
    description: 'Real crafts dying out - and the ones you can still train for.',
  },
  {
    to: '/job-market/statistics/uk-numbers/high-demand-careers',
    icon: TrendingUp,
    title: 'Skills Shortages & Demand',
    description: 'Every PathScrawler career in a genuine UK skills-shortage field.',
  },
  {
    to: '/job-market/statistics/uk-numbers/vanished-jobs',
    icon: Ghost,
    title: 'Vanished Jobs',
    description: 'Jobs that used to exist and simply don’t anymore.',
  },
]

export default function JobMarketAiEndangeredJobsPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-8 pt-8 px-6 pb-8 sm:px-8">
      <div className="space-y-4">
        <BackButton to="/job-market/statistics" label="Statistics" />
        <div>
          <h2 className="flex items-center gap-3 text-4xl font-extrabold text-slate-950 dark:text-slate-50 sm:text-5xl">
            <AlertTriangle className="h-8 w-8 shrink-0 text-red-600 dark:text-red-400 sm:h-9 sm:w-9" aria-hidden="true" />
            Jobs Endangered by AI
          </h2>
          <div className="mt-3 h-1.5 w-20 rounded-full bg-gradient-to-r from-red-600 to-red-300" />
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 dark:text-slate-200">
            Which real UK roles are most exposed to AI right now, and which ones aren't going anywhere.
          </p>
        </div>
      </div>

      <RevealSection className="rounded-3xl bg-white px-8 py-8 shadow-soft dark:bg-slate-800">
        <div className="flex items-center gap-2 text-xl font-bold text-slate-950 dark:text-slate-50">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          Jobs Most at Risk from AI
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Real UK job categories most exposed to AI and automation right now (2025-2026) - several of these also
          show up in <span className="font-semibold">Trending down</span> on the Statistics page.
        </p>

        <StaggerGrid className="mt-5 grid gap-4 sm:grid-cols-2">
          {aiEndangeredJobs.map((job) => (
            <AiJobCard key={job.title} job={job} />
          ))}
        </StaggerGrid>

        <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500 dark:border-slate-700 dark:text-slate-400">
          {aiEndangeredNotes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>
      </RevealSection>

      {/* Divider between the "at risk" (red) and "safe" (green) halves - a
          plain rule rather than another card, so it reads as a seam
          between two contrasting sections rather than a third section. */}
      <div className="flex items-center gap-3" aria-hidden="true">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-slate-200 dark:via-slate-700 dark:to-slate-700" />
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-200 to-slate-200 dark:via-slate-700 dark:to-slate-700" />
      </div>

      <RevealSection className="rounded-3xl bg-white px-8 py-8 shadow-soft dark:bg-slate-800">
        <div className="flex items-center gap-2 text-xl font-bold text-slate-950 dark:text-slate-50">
          <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
          Careers Least at Risk from AI
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Jobs where human skills - physical, emotional, and adaptive - can't be replaced.
        </p>

        <p className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-400">
          <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
          {aiSafeHeadlineStat}
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div className="rounded-2xl border border-green-200 bg-green-50/60 p-5 dark:border-green-900 dark:bg-green-950/20">
            <p className="text-sm font-bold text-slate-950 dark:text-slate-50">Why these jobs are AI-safe</p>
            <ul className="mt-3 space-y-3">
              {aiSafeReasons.map((reason) => (
                <li key={reason.label}>
                  <p className="text-sm font-semibold text-green-800 dark:text-green-400">{reason.label}</p>
                  <p className="mt-0.5 text-xs leading-5 text-slate-600 dark:text-slate-300">{reason.detail}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            {aiSafeCategories.map((category) => (
              <div key={category.name}>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
                  {category.name}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {category.occupations.map((occupation) => (
                    <SafeOccupationPill key={occupation.name} name={occupation.name} careerId={occupation.careerId} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-sm font-semibold text-slate-800 dark:text-slate-100">AI task exposure by sector</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Estimated share of tasks exposed to AI - low across the board.</p>
        <div className="mt-4">
          <AiSafeExposureChart data={aiSafeExposure} />
        </div>

        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">{aiSafeSource}</p>
      </RevealSection>

      <RevealSection className="rounded-3xl bg-white px-8 py-8 shadow-soft dark:bg-slate-800">
        <div className="text-xl font-bold text-slate-950 dark:text-slate-50">More UK labour market data</div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          The rest of PathScrawler's labour-market deep dives.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {MORE_PAGES.map(({ to, icon: Icon, title, description }) => (
            <button
              key={to}
              type="button"
              onClick={() => navigate(to)}
              className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/70 dark:hover:border-primary/50"
            >
              <span className="flex items-center gap-3">
                <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  <span className="block text-sm font-bold text-slate-950 dark:text-slate-50">{title}</span>
                  <span className="mt-0.5 block text-xs text-slate-600 dark:text-slate-300">{description}</span>
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            </button>
          ))}
        </div>
      </RevealSection>

      <ScrollToTopButton />
    </div>
  )
}
