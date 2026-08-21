import { ArrowRight, BadgeCheck, Dices, Ghost, Hammer, TrendingUp, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import BackButton from '../components/BackButton'
import CountUpStat from '../components/CountUpStat'
import RevealSection from '../components/RevealSection'
import ScrollToTopButton from '../components/ScrollToTopButton'
import StaggerGrid from '../components/StaggerGrid'
import demoCareers from '../data/demoCareers'
import type { Career } from '../data/demoCareers'
import {
  coreLabourMarketStats,
  demandSkillsStats,
  heritageCraftStats,
  newEndangeredCrafts2025,
  standoutOccupations,
  statsCompiledDate,
  statsSources,
  type StatEntry,
} from '../data/ukLabourMarketStats'
import { ceremonialOrTinyJobs, extinctProductionCrafts, fullyExtinctJobs } from '../data/vanishedJobs'

// A second, more reference-y stats page linked from JobMarketStatisticsPage
// ("See more UK labour market numbers"). Deliberately doesn't repeat that
// page's earnings/trending-careers/demand-chart content - see
// ukLabourMarketStats.ts's top comment for what was left out and why. This
// page is the wider economy context those per-career numbers sit inside.
//
// Each stat card here is plain, non-interactive display (not a dropdown) -
// the 5 heritage-craft stats all point at the same 7 careers and the 4
// demand stats all point at the same high-demand categories (the app has
// no data to tell them apart individually), so rather than several buttons
// opening identical content, each section gets ONE link out to its own
// dedicated page (JobMarketHeritageCraftsPage, JobMarketHighDemandCareersPage).

function StatCard({ stat }: { stat: StatEntry }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/70">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">{stat.label}</p>
      <CountUpStat value={stat.value} className="mt-1 block text-3xl font-extrabold text-slate-950 dark:text-slate-50" />
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{stat.note}</p>
    </div>
  )
}

function SectionLinkCard({ to, title, description }: { to: string; title: string; description: string }) {
  return (
    <Link
      to={to}
      className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-primary-soft/40 p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md dark:border-primary/30 dark:bg-primary/10"
    >
      <span>
        <span className="block text-sm font-bold text-slate-950 dark:text-slate-50">{title}</span>
        <span className="mt-0.5 block text-xs text-slate-600 dark:text-slate-300">{description}</span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
    </Link>
  )
}

function findCareer(id: number): Career | undefined {
  return demoCareers.find((career) => career.id === id)
}

// The two "largest occupation" stats map 1:1 to a real demoCareers entry
// (see standoutOccupations' careerId in ukLabourMarketStats.ts), so these
// go straight to that career's own page on click - no dropdown needed,
// there's nothing to disambiguate, the card already *is* that career.
function StandoutOccupationCard({ occupation }: { occupation: (typeof standoutOccupations)[number] }) {
  const career = findCareer(occupation.careerId)
  const content = (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">{occupation.label}</p>
      <p className="mt-1 text-lg font-bold text-slate-950 dark:text-slate-50">{occupation.title}</p>
      <p className="mt-0.5 text-sm font-semibold text-primary">{occupation.value}</p>
      {career ? (
        <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary">
          View {career.title} on PathScrawler
          <ArrowRight className="h-3 w-3 shrink-0" />
        </p>
      ) : null}
    </>
  )

  if (!career) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/70">{content}</div>
    )
  }

  return (
    <Link
      to={`/career/${career.id}`}
      className="block rounded-2xl border border-slate-200 bg-white/70 p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/70 dark:hover:border-primary/50"
    >
      {content}
    </Link>
  )
}

export default function JobMarketUkStatsPage() {
  return (
    <div className="space-y-8 pt-8 px-6 pb-8 sm:px-8">
      <div className="space-y-4">
        <BackButton to="/job-market/statistics" label="Statistics" />
        <div>
          <h2 className="flex items-center gap-3 text-4xl font-extrabold text-slate-950 dark:text-slate-50 sm:text-5xl">
            <Users className="h-8 w-8 shrink-0 text-blue-600 dark:text-blue-400 sm:h-9 sm:w-9" aria-hidden="true" />
            UK Labour Market Numbers
          </h2>
          <div className="mt-3 h-1.5 w-20 rounded-full bg-gradient-to-r from-blue-600 to-blue-400" />
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 dark:text-slate-200">
            The wider economy behind PathScrawler's career data - how big the UK workforce actually is, which crafts
            are disappearing, and which occupations employers can't fill fast enough.
          </p>
        </div>
      </div>

      <RevealSection className="rounded-3xl bg-gradient-to-br from-primary-soft/50 via-white to-white px-8 py-8 shadow-soft ring-1 ring-primary/10 dark:from-primary/10 dark:via-slate-800 dark:to-slate-900 dark:ring-primary/20">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xl font-bold text-slate-950 dark:text-slate-50">
            <Users className="h-5 w-5" />
            The workforce
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm shadow-green-500/30 ring-1 ring-green-400">
            <BadgeCheck className="h-4 w-4" />
            Real ONS data
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">ONS Labour Market release, Apr-Jun 2026.</p>

        <StaggerGrid className="mt-5 grid gap-4 sm:grid-cols-2">
          {coreLabourMarketStats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </StaggerGrid>

        <p className="mt-5 flex items-start gap-2 rounded-2xl border border-primary/20 bg-primary-soft/40 p-4 text-sm leading-6 text-slate-700 dark:border-primary/30 dark:bg-primary/10 dark:text-slate-200">
          <Dices className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span>
            That ~34.47 million is the real denominator behind every "1 in every N workers" figure you see on{' '}
            <Link to="/job-market/roll" className="font-semibold text-primary hover:underline">
              Roll a Job
            </Link>{' '}
            and career pages across PathScrawler.
          </span>
        </p>
      </RevealSection>

      <RevealSection className="rounded-3xl bg-white px-8 py-8 shadow-soft dark:bg-slate-800">
        <div className="flex items-center gap-2 text-xl font-bold text-slate-950 dark:text-slate-50">
          <Hammer className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          Endangered & heritage crafts
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Heritage Crafts Red List 2025.</p>

        <StaggerGrid className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {heritageCraftStats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </StaggerGrid>

        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/40">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-amber-700 dark:text-amber-400">
            {newEndangeredCrafts2025.label}
          </p>
          <CountUpStat
            value={newEndangeredCrafts2025.value}
            className="mt-1 block text-3xl font-extrabold text-slate-950 dark:text-slate-50"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {newEndangeredCrafts2025.examples.map((example) => (
              <Link
                key={example.label}
                to={`/career/${example.careerId}`}
                className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 transition hover:bg-amber-200 dark:bg-amber-900/60 dark:text-amber-300 dark:hover:bg-amber-900"
              >
                {example.label}
              </Link>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{newEndangeredCrafts2025.source}</p>
        </div>

        <SectionLinkCard
          to="/job-market/statistics/uk-numbers/heritage-crafts"
          title="See the heritage crafts on PathScrawler →"
          description="10 of the 165 at-risk crafts have full career profiles here - the rest of the Red List isn't in PathScrawler's data yet."
        />
      </RevealSection>

      <RevealSection className="rounded-3xl bg-white px-8 py-8 shadow-soft dark:bg-slate-800">
        <div className="flex items-center gap-2 text-xl font-bold text-slate-950 dark:text-slate-50">
          <Ghost className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          Jobs that no longer exist
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Not endangered - actually gone, or nearly gone. History, not career advice.
        </p>

        <StaggerGrid className="mt-5 grid gap-4 sm:grid-cols-3">
          <StatCard stat={{ label: 'Fully or almost extinct jobs', value: String(fullyExtinctJobs.length), note: 'Lighthouse Keeper, Lamplighter, Switchboard Operator...' }} />
          <StatCard stat={{ label: 'Reduced to ceremonial or tiny numbers', value: String(ceremonialOrTinyJobs.length), note: 'Town Crier, Traditional Milkman' }} />
          <StatCard stat={{ label: 'Extinct crafts, zero UK practitioners', value: String(extinctProductionCrafts.length), note: 'Heritage Crafts Red List' }} />
        </StaggerGrid>

        <SectionLinkCard
          to="/job-market/statistics/uk-numbers/vanished-jobs"
          title="See the vanished jobs →"
          description="What each job was, why it disappeared, and the real sources behind it."
        />
      </RevealSection>

      <RevealSection className="rounded-3xl bg-white px-8 py-8 shadow-soft dark:bg-slate-800">
        <div className="flex items-center gap-2 text-xl font-bold text-slate-950 dark:text-slate-50">
          <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
          Skills shortages & demand
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Skills England Occupations in Demand 2025 - how many jobs nationally, not just the named careers trending
          on the Statistics page.
        </p>

        <StaggerGrid className="mt-5 grid gap-4 sm:grid-cols-2">
          {demandSkillsStats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </StaggerGrid>

        <SectionLinkCard
          to="/job-market/statistics/uk-numbers/high-demand-careers"
          title="See high-demand careers on PathScrawler →"
          description="Every career in a real UK skills-shortage field, grouped by category."
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {standoutOccupations.map((occupation) => (
            <StandoutOccupationCard key={occupation.label} occupation={occupation} />
          ))}
        </div>
      </RevealSection>

      <RevealSection className="text-center text-xs text-slate-400 dark:text-slate-500">
        <p>Compiled {statsCompiledDate} from {statsSources.join(', ')}.</p>
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
      </RevealSection>

      <ScrollToTopButton />
    </div>
  )
}
