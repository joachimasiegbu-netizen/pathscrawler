import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import BackButton from '../components/BackButton'
import PageHeader from '../components/PageHeader'
import Accordion, { type AccordionItemData } from '../components/Accordion'
import StudentHubFaqFooter from '../components/StudentHubFaqFooter'
import { faqsForTopic, getFaq } from '../data/studentHubFaq'
import { sectionByTopic } from '../data/studentHubSections'

// One component for all five FAQ topic pages, routed by :topic. Renders the
// questions as a scan-and-expand list (Accordion), any "go here next" links,
// then the standard end-of-page FAQ callout + link.
export default function StudentHubTopicPage() {
  const { topic } = useParams<{ topic: string }>()
  const section = topic ? sectionByTopic(topic) : undefined

  if (!section || !section.topic) return <Navigate to="/student-hub" replace />

  const faqs = faqsForTopic(section.topic)
  const items: AccordionItemData[] = faqs.map((faq) => ({
    id: faq.id,
    title: faq.question,
    body: <p>{faq.answer}</p>,
  }))

  // The end-of-page callout must never repeat a question already listed
  // above - only use the spotlight when it resolves to a FAQ from a
  // different topic.
  const spotlight = getFaq(section.spotlightFaqId ?? '')
  const footerFaqId = spotlight && spotlight.topic !== section.topic ? spotlight.id : undefined

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
      <BackButton to="/student-hub" label="Student Hub" />
      <PageHeader icon={section.icon} title={section.title} subtitle={section.subtitle} />

      <Accordion items={items} defaultOpenId={items[0]?.id} />

      {section.relatedLinks && section.relatedLinks.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {section.relatedLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-900 transition hover:border-indigo-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:border-indigo-700"
            >
              {link.label}
              <ArrowRight className="h-4 w-4 shrink-0 text-indigo-500" />
            </Link>
          ))}
        </div>
      ) : null}

      <StudentHubFaqFooter faqId={footerFaqId} />
    </div>
  )
}
