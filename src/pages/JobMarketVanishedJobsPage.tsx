import { ExternalLink, Ghost } from 'lucide-react'
import BackButton from '../components/BackButton'
import RevealSection from '../components/RevealSection'
import ScrollToTopButton from '../components/ScrollToTopButton'
import StaggerGrid from '../components/StaggerGrid'
import {
  ceremonialOrTinyJobs,
  extinctCraftsSource,
  extinctProductionCrafts,
  fullyExtinctJobs,
  vanishedJobsCompiledDate,
  type VanishedJob,
} from '../data/vanishedJobs'

// History/trivia page, deliberately NOT reachable from Roll a Job or any
// career-pursuit flow - see vanishedJobs.ts's top comment for why these
// don't live in demoCareers.js. Linked from JobMarketUkStatsPage.

function VanishedJobCard({ job }: { job: VanishedJob }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/70">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-base font-bold text-slate-950 dark:text-slate-50">{job.title}</h3>
        <span className="shrink-0 rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
          {job.status}
        </span>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{job.detail}</p>
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 border-t border-slate-100 pt-3 dark:border-slate-700">
        {job.sources.map((source) => (
          <a
            key={source.url}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            {source.label}
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        ))}
      </div>
    </div>
  )
}

export default function JobMarketVanishedJobsPage() {
  return (
    <div className="space-y-8 pt-8 px-6 pb-8 sm:px-8">
      <div className="space-y-4">
        <BackButton to="/job-market/statistics/uk-numbers" label="UK Labour Market Numbers" />
        <div>
          <h2 className="flex items-center gap-3 text-4xl font-extrabold text-slate-950 dark:text-slate-50 sm:text-5xl">
            <Ghost className="h-8 w-8 shrink-0 text-slate-500 dark:text-slate-400 sm:h-9 sm:w-9" aria-hidden="true" />
            Vanished Jobs
          </h2>
          <div className="mt-3 h-1.5 w-20 rounded-full bg-gradient-to-r from-slate-500 to-slate-300" />
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 dark:text-slate-200">
            Real UK jobs people simply don't do anymore - not endangered crafts you could still train for, but roles
            that automation, technology or the law made obsolete. History and trivia, not career advice: none of
            these appear in Roll a Job or anywhere else on PathScrawler you'd go to plan an actual career.
          </p>
        </div>
      </div>

      <RevealSection className="rounded-3xl bg-white px-8 py-8 shadow-soft dark:bg-slate-800">
        <StaggerGrid className="grid gap-4 sm:grid-cols-2">
          {fullyExtinctJobs.map((job) => (
            <VanishedJobCard key={job.title} job={job} />
          ))}
        </StaggerGrid>
      </RevealSection>

      <RevealSection className="rounded-3xl bg-white px-8 py-8 shadow-soft dark:bg-slate-800">
        <div className="flex items-center gap-2 text-xl font-bold text-slate-950 dark:text-slate-50">
          <Ghost className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          Reduced to ceremonial or tiny numbers
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Not extinct outright, but the working version of the job has all but disappeared.
        </p>

        <StaggerGrid className="mt-5 grid gap-4 sm:grid-cols-2">
          {ceremonialOrTinyJobs.map((job) => (
            <VanishedJobCard key={job.title} job={job} />
          ))}
        </StaggerGrid>
      </RevealSection>

      <RevealSection className="rounded-3xl bg-white px-8 py-8 shadow-soft dark:bg-slate-800">
        <div className="flex items-center gap-2 text-xl font-bold text-slate-950 dark:text-slate-50">
          <Ghost className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          Fully extinct UK production crafts
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          From the Heritage Crafts Red List's own "extinct" category - once proper paid occupations, now with zero
          active UK practitioners.
        </p>

        <StaggerGrid className="mt-5 grid gap-4 sm:grid-cols-2">
          {extinctProductionCrafts.map((craft) => (
            <VanishedJobCard key={craft.title} job={craft} />
          ))}
        </StaggerGrid>

        <a
          href={extinctCraftsSource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          Full Red List: {extinctCraftsSource.label}
          <ExternalLink className="h-3 w-3" />
        </a>
      </RevealSection>

      <RevealSection className="text-center text-xs text-slate-400 dark:text-slate-500">
        <p>Compiled {vanishedJobsCompiledDate}. Sources linked individually above.</p>
      </RevealSection>

      <ScrollToTopButton />
    </div>
  )
}
