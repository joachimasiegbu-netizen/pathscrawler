import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Compass } from 'lucide-react'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import Card from '../components/Card'
import demoCareers from '../data/demoCareers'
import { usePathStore } from '../store/usePathStore'

const resourceLinks = [
  { label: 'Evenbreak', href: 'https://www.evenbreak.co.uk' },
  { label: 'Scope', href: 'https://www.scope.org.uk' },
  { label: 'Disability Rights UK', href: 'https://www.disabilityrightsuk.org' },
]

export default function CareerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const selectedRole = usePathStore((state) => state.selectedRole)

  const career = useMemo(
    () => demoCareers.find((item) => String(item.id) === id),
    [id],
  )

  if (!career) {
    return (
      <div className="mx-auto w-full max-w-[430px] px-4 py-6 sm:px-0">
        <div className="space-y-6 rounded-[32px] bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <BackButton to="/results" />
            <span className="text-sm text-slate-500">Career detail</span>
          </div>
          <div className="space-y-4 pt-2">
            <h1 className="text-3xl font-bold text-slate-950">Career not found</h1>
            <p className="text-sm leading-6 text-slate-600">We couldn’t find the career details for this selection.</p>
          </div>
        </div>
      </div>
    )
  }

  const isDisabledLearner = selectedRole === 'disabled-learner'

  return (
    <div className="mx-auto w-full max-w-[700px] px-4 py-6 sm:px-0">
      <div className="space-y-6 rounded-[32px] bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <BackButton to="/results" />
          <span className="text-sm text-slate-500">Career detail</span>
        </div>

        <div className="space-y-4">
          <div className="rounded-[28px] bg-slate-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-dark">{career.category}</p>
            <h1 className="mt-4 text-3xl font-bold text-slate-950">{career.title}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">{career.salary}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-950">Overview</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{career.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <section className="rounded-[24px] bg-slate-100 p-5">
              <h3 className="text-lg font-semibold text-slate-950">What this role looks like</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {career.dayToDay?.slice(0, 5).map((item: string) => (
                  <li key={item} className="list-disc pl-5">{item}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-[24px] bg-slate-100 p-5">
              <h3 className="text-lg font-semibold text-slate-950">Typical requirements</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {career.requirements?.map((requirement: string) => (
                  <li key={requirement} className="list-disc pl-5">{requirement}</li>
                ))}
              </ul>
            </section>
          </div>

          <section>
            <h3 className="text-lg font-semibold text-slate-950">Career progression</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {career.progression?.map((step: string) => (
                <li key={step} className="list-disc pl-5">{step}</li>
              ))}
            </ul>
          </section>

          {isDisabledLearner ? (
            <section className="rounded-[28px] border border-primary/20 bg-primary-soft/70 p-6">
              <h3 className="text-lg font-semibold text-slate-950">Support and adjustments</h3>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                This career can be supported with workplace adjustments and employer practices that help disabled talent succeed.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-white p-4 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">Access to Work</p>
                  <p className="mt-2 text-slate-600">Support for equipment, transport and workplace adjustments.</p>
                </div>
                <div className="rounded-3xl bg-white p-4 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">Disability Confident</p>
                  <p className="mt-2 text-slate-600">Employers are more likely to offer supportive hiring and reasonable adjustments.</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">Useful links</p>
                <ul className="mt-2 list-disc pl-5">
                  {resourceLinks.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} target="_blank" rel="noreferrer" className="text-primary hover:text-primary-dark">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ) : null}

          <section>
            <h3 className="text-lg font-semibold text-slate-950">Similar careers</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {(career.similarCareers || [])
                .map((similarId: string | number) => demoCareers.find((item) => String(item.id) === String(similarId)))
                .filter(Boolean)
                .slice(0, 4)
                .map((similarCareer: any) => (
                  <Card
                    key={similarCareer?.id}
                    title={similarCareer?.title || ''}
                    description={similarCareer?.description || ''}
                    badge={similarCareer?.salary || ''}
                  >
                    <div className="mt-3">
                      <Button
                        variant="secondary"
                        onClick={() => navigate(`/career/${similarCareer?.id}`)}
                        className="w-full"
                      >
                        View career
                      </Button>
                    </div>
                  </Card>
                ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => navigate('/results')} className="w-full sm:w-auto">
            Back to results
          </Button>
          <button
            type="button"
            onClick={() => navigate('/backtrack')}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:w-auto"
          >
            <Compass className="h-4 w-4" />
            How do I get there?
          </button>
          <a
            href="https://www.gov.uk/access-to-work"
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:w-auto"
          >
            Apply for Access to Work
          </a>
        </div>
      </div>
    </div>
  )
}
