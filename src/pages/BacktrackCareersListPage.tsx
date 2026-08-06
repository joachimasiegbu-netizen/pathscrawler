import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import demoCareers from '../data/demoCareers'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'
import StaggerGrid from '../components/StaggerGrid'
import { careersForCategory, getBacktrackCategory } from '../data/backtrackCategories'

export default function BacktrackCareersListPage() {
  const navigate = useNavigate()
  const { category } = useParams<{ category: string }>()

  const categoryInfo = getBacktrackCategory(category)
  const careers = useMemo(() => careersForCategory(category, demoCareers), [category])

  if (!categoryInfo) {
    return (
      <div className="space-y-6 pt-8 px-6 pb-8 sm:px-8">
        <BackButton to="/backtrack/categories" />
        <p className="text-sm text-slate-600 dark:text-slate-300">We couldn't find that career area.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 pt-8 px-6 pb-8 sm:px-8">
      <div className="space-y-4">
        <BackButton to="/backtrack/categories" />
        <PageHeader title={`${categoryInfo.label} careers`} subtitle={categoryInfo.description} />
      </div>

      <StaggerGrid className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {careers.map((career) => (
          <Card key={career.id} title={career.title} description={career.description} badge={career.salary}>
            <Button
              onClick={() => navigate(`/backtrack/pathway/${career.id}`)}
              className="mt-4 w-full justify-center"
            >
              See pathway
            </Button>
          </Card>
        ))}
      </StaggerGrid>

      {careers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          <p className="font-semibold">No careers listed in this area yet.</p>
          <p className="mt-2 text-sm">Try a different career area.</p>
        </div>
      ) : null}
    </div>
  )
}
