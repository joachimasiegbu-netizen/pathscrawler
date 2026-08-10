import { useMemo, useState } from 'react'
import { Crown } from 'lucide-react'
import BackButton from '../components/BackButton'
import EmptyState from '../components/EmptyState'
import HighestPayingCareerCard from '../components/HighestPayingCareerCard'
import HighestPayingFilterBar from '../components/HighestPayingFilterBar'
import PageHeader from '../components/PageHeader'
import StaggerGrid from '../components/StaggerGrid'
import { getHighestPayingCareers, type FilterOption, type SortOption } from '../utils/highestPayingCareers'

export default function JobMarketHighestPayingPage() {
  const [sort, setSort] = useState<SortOption>('salary-desc')
  const [filter, setFilter] = useState<FilterOption>('all')

  const entries = useMemo(() => getHighestPayingCareers(sort, filter), [sort, filter])
  const totalVerified = entries[0]?.totalCareers ?? entries.length

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
      <BackButton to="/job-market" label="Job Market" />
      <PageHeader icon={Crown} title="Highest Paying Jobs" subtitle="Careers where the investment pays off" />

      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
        Showing {entries.length} of {totalVerified} verified highest paying careers
      </p>

      <HighestPayingFilterBar sort={sort} filter={filter} onSortChange={setSort} onFilterChange={setFilter} />

      {entries.length === 0 ? (
        <EmptyState
          icon={Crown}
          title="No careers match yet"
          message="Try a different filter to see more careers."
          actionLabel="Back to all categories"
          onAction={() => setFilter('all')}
        />
      ) : (
        <StaggerGrid revealOnMount className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {entries.map((entry) => (
            <HighestPayingCareerCard key={entry.career.id} entry={entry} />
          ))}
        </StaggerGrid>
      )}

      <p className="border-t border-slate-100 pt-4 text-xs leading-5 text-slate-400 dark:border-slate-700 dark:text-slate-500">
        Salary data sourced from ONS ASHE 2025 and industry reports. Figures are median full-time gross annual pay and
        the top 10% of earners in each role. Actual earnings vary by location, employer and experience.
      </p>
    </div>
  )
}
