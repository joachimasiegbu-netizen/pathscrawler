import { useNavigate } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'
import BackButton from '../components/BackButton'
import Card from '../components/Card'
import CountUpStat from '../components/CountUpStat'
import RevealSection from '../components/RevealSection'
import ScrollToTopButton from '../components/ScrollToTopButton'
import StaggerGrid from '../components/StaggerGrid'
import { demandSkillsStats, statsSources } from '../data/ukLabourMarketStats'
import { highDemandCareersByCategory } from '../utils/labourMarketCareerExamples'

// Own page (not a dropdown) for the "Skills shortages & demand" stats on
// JobMarketUkStatsPage - all 4 of those stat cards used to open the same
// example list (the app doesn't separately track which careers count
// toward "critical" vs "elevated" national demand, only the same shared
// high-demand categories), so rather than 4 buttons to the same content,
// there's one link out here, showing the full grouped list rather than
// just a handful of examples.

const categoryGroups = highDemandCareersByCategory()

export default function JobMarketHighDemandCareersPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-8 pt-8 px-6 pb-8 sm:px-8">
      <div className="space-y-4">
        <BackButton to="/job-market/statistics/uk-numbers" label="UK Labour Market Numbers" />
        <div>
          <h2 className="flex items-center gap-3 text-4xl font-extrabold text-slate-950 dark:text-slate-50 sm:text-5xl">
            <TrendingUp className="h-8 w-8 shrink-0 text-green-600 dark:text-green-400 sm:h-9 sm:w-9" aria-hidden="true" />
            Skills Shortages & Demand
          </h2>
          <div className="mt-3 h-1.5 w-20 rounded-full bg-gradient-to-r from-green-600 to-green-400" />
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 dark:text-slate-200">
            Skills England tracks which occupations employers can't fill fast enough nationally. These are the
            PathScrawler careers that sit in those same shortage-prone fields.
          </p>
        </div>
      </div>

      <RevealSection className="rounded-3xl bg-white px-8 py-8 shadow-soft dark:bg-slate-800">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Skills England Occupations in Demand 2025</p>
        <StaggerGrid className="mt-5 grid gap-4 sm:grid-cols-2">
          {demandSkillsStats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/70">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">{stat.label}</p>
              <CountUpStat value={stat.value} className="mt-1 block text-3xl font-extrabold text-slate-950 dark:text-slate-50" />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{stat.note}</p>
            </div>
          ))}
        </StaggerGrid>
      </RevealSection>

      {categoryGroups.map(({ category, careers }) => (
        <RevealSection key={category} className="rounded-3xl bg-white px-8 py-8 shadow-soft dark:bg-slate-800">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xl font-bold text-slate-950 dark:text-slate-50">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              {category}
            </div>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800 dark:bg-green-950 dark:text-green-400">
              {careers.length} career{careers.length === 1 ? '' : 's'}
            </span>
          </div>

          <StaggerGrid className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {careers.map((career) => (
              <Card
                key={career.id}
                title={career.title}
                description={career.description}
                badge={career.salary}
                animateBadge={false}
                onClick={() => navigate(`/career/${career.id}`)}
                ariaLabel={`${career.title}, view career details`}
              />
            ))}
          </StaggerGrid>
        </RevealSection>
      ))}

      <RevealSection className="text-center text-xs text-slate-400 dark:text-slate-500">
        <p>Source: {statsSources[1]}.</p>
      </RevealSection>

      <ScrollToTopButton />
    </div>
  )
}
