import { useMemo, type ReactNode } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  BookOpen,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  FileText,
  GraduationCap,
  HeartHandshake,
  Layers,
  type LucideIcon,
  TrendingUp,
} from 'lucide-react'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import Card from '../components/Card'
import RevealSection from '../components/RevealSection'
import StaggerGrid from '../components/StaggerGrid'
import demoCareers from '../data/demoCareers'
import { usePathStore } from '../store/usePathStore'

const resourceLinks = [
  { label: 'Evenbreak', href: 'https://www.evenbreak.co.uk' },
  { label: 'Scope', href: 'https://www.scope.org.uk' },
  { label: 'Disability Rights UK', href: 'https://www.disabilityrightsuk.org' },
]

// Course-link cards read better with an action phrased around what the
// platform is for, rather than just the raw platform name every time.
function getCourseLinkText(platformName: string, careerTitle: string): string {
  switch (platformName) {
    case 'Codecademy':
      return `Learn ${careerTitle} on Codecademy`
    case 'Skillshare':
      return `${careerTitle} courses on Skillshare`
    case 'LinkedIn Learning':
      return `${careerTitle} on LinkedIn Learning`
    case 'Udemy':
      return `${careerTitle} courses on Udemy`
    default:
      return `${careerTitle} on ${platformName}`
  }
}

// Shared shell every card on this page sits in - white/slate-800, bordered,
// rounded-2xl, generous padding. An icon + title row up top gives each card
// a clear identity instead of the flat "list on gray" look this replaces.
function DetailCard({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 dark:border-slate-700">
        <Icon className="h-5 w-5 text-primary dark:text-primary-light" />
        <h3 className="text-lg font-semibold text-slate-950 dark:text-slate-50 sm:text-xl">{title}</h3>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  )
}

// Checkmark bullet list - used for the day-to-day and requirements cards,
// which read as checklists rather than an ordered sequence.
function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent dark:text-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function CareerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const selectedRole = usePathStore((state) => state.selectedRole)

  // No hardcoded `to` - this page is reached from many places (Quick
  // Assessment results, search, Career Changer results, Job Market
  // spotlight, Easiest Jobs, Highest Paying Jobs, Backtrack, ...), so a
  // fixed target would send people somewhere they didn't come from. Plain
  // browser-history back (BackButton's default with no `to`) always
  // returns to whichever of those actually linked here - the label is the
  // only thing that changes, read off router state set by the referrer.
  const referrer = (location.state as { from?: string } | null)?.from
  const backLabel =
    referrer === 'highest-paying' ? 'Highest Paying Jobs' : referrer === 'roll' ? 'Roll a Job' : 'Back'

  const career = useMemo(
    () => demoCareers.find((item) => String(item.id) === id),
    [id],
  )

  if (!career) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6 sm:px-6">
        <BackButton label={backLabel} />
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h1 className="text-3xl font-bold text-slate-950 dark:text-slate-50">Career not found</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            We couldn't find the career details for this selection.
          </p>
        </div>
      </div>
    )
  }

  const isDisabledLearner = selectedRole === 'disabled-learner'

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-6 sm:px-6">
      <BackButton label={backLabel} />

      <RevealSection className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
          {career.category}
        </p>
        <h1 className="text-3xl font-bold text-slate-950 dark:text-slate-50 sm:text-4xl">{career.title}</h1>
        <p className="text-base font-semibold text-slate-600 dark:text-slate-300">{career.salary}</p>
      </RevealSection>

      <RevealSection>
        <DetailCard icon={FileText} title="Overview">
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{career.description}</p>
        </DetailCard>
      </RevealSection>

      <StaggerGrid className="grid gap-6 sm:grid-cols-2">
        <DetailCard icon={Briefcase} title="What this role looks like">
          <CheckList items={career.dayToDay?.slice(0, 5) ?? []} />
        </DetailCard>

        <DetailCard icon={GraduationCap} title="Typical requirements">
          <CheckList items={career.requirements ?? []} />
        </DetailCard>
      </StaggerGrid>

      <RevealSection>
        <DetailCard icon={TrendingUp} title="Career progression">
          <ol className="space-y-4">
            {career.progression?.map((step: string, index: number) => (
              <li key={step} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft/70 text-xs font-bold text-primary-dark dark:bg-primary/15 dark:text-primary-light">
                  {index + 1}
                </span>
                <span className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{step}</span>
              </li>
            ))}
          </ol>
        </DetailCard>
      </RevealSection>

      <RevealSection>
        <DetailCard icon={BookOpen} title="Where to study">
          <div className="space-y-3">
            {career.whereToStudy?.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary-soft/20 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900/40 dark:hover:bg-slate-700/50"
              >
                <div>
                  <p className="text-sm font-semibold text-primary group-hover:underline dark:text-primary-light">
                    {getCourseLinkText(link.name, career.title)} →
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{link.description}</p>
                </div>
                <ExternalLink size={14} className="shrink-0 text-primary dark:text-primary-light" />
              </a>
            ))}
          </div>
        </DetailCard>
      </RevealSection>

      {isDisabledLearner ? (
        <RevealSection>
          <DetailCard icon={HeartHandshake} title="Support and adjustments">
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              This career can be supported with workplace adjustments and employer practices that help disabled talent succeed.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-900/40">
                <p className="font-semibold text-slate-900 dark:text-slate-100">Access to Work</p>
                <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-300">
                  Support for equipment, transport and workplace adjustments.
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-900/40">
                <p className="font-semibold text-slate-900 dark:text-slate-100">Disability Confident</p>
                <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-300">
                  Employers are more likely to offer supportive hiring and reasonable adjustments.
                </p>
              </div>
            </div>
            <div className="mt-4 border-t border-slate-100 pt-4 text-sm dark:border-slate-700">
              <p className="font-semibold text-slate-900 dark:text-slate-100">Useful links</p>
              <ul className="mt-3 space-y-2">
                {resourceLinks.map((link) => (
                  <li key={link.href} className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="shrink-0 text-accent dark:text-accent" />
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:text-primary-dark dark:text-primary-light"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </DetailCard>
        </RevealSection>
      ) : null}

      <RevealSection>
        <DetailCard icon={Layers} title="Similar careers">
          <StaggerGrid className="grid gap-6 sm:grid-cols-2">
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
          </StaggerGrid>
        </DetailCard>
      </RevealSection>

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row">
        <Button onClick={() => navigate('/results')} className="w-full sm:w-auto">
          Back to results
        </Button>
        {isDisabledLearner ? (
          <a
            href="https://www.gov.uk/access-to-work"
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 sm:w-auto"
          >
            Apply for Access to Work
          </a>
        ) : null}
      </div>
    </div>
  )
}
