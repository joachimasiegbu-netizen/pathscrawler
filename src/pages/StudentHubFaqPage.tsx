import { HelpCircle } from 'lucide-react'
import BackButton from '../components/BackButton'
import PageHeader from '../components/PageHeader'
import Accordion, { type AccordionItemData } from '../components/Accordion'
import { FAQS, FAQ_TOPIC_LABEL, STUDENT_HUB_SOURCES, type FaqTopic } from '../data/studentHubFaq'

const TOPIC_ORDER: FaqTopic[] = ['student-finance', 'ucas', 'repaying', 'maintenance', 'apprenticeship-or-uni']

export default function StudentHubFaqPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
      <BackButton to="/student-hub" label="Student Hub" />
      <PageHeader icon={HelpCircle} title="Student Hub FAQ" subtitle="Every question from across the hub, grouped by topic." />

      {/* jump nav */}
      <nav className="flex flex-wrap gap-1.5">
        {TOPIC_ORDER.map((t) => (
          <a
            key={t}
            href={`#${t}`}
            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            {FAQ_TOPIC_LABEL[t]}
          </a>
        ))}
      </nav>

      {TOPIC_ORDER.map((t) => {
        const items: AccordionItemData[] = FAQS.filter((f) => f.topic === t).map((f) => ({
          id: f.id,
          title: f.question,
          body: <p>{f.answer}</p>,
        }))
        return (
          <section key={t} id={t} className="scroll-mt-6 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{FAQ_TOPIC_LABEL[t]}</h2>
            <Accordion items={items} />
          </section>
        )
      })}

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Check the current figures</p>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
          {STUDENT_HUB_SOURCES.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-300">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
