import { Link } from 'react-router-dom'
import { ArrowRight, HelpCircle } from 'lucide-react'
import { getFaq } from '../data/studentHubFaq'

// The block every Student Hub page ends with: one FAQ that's relevant to the
// page, answered inline, then a link into the full FAQ. Keeps each page
// short while still pointing at "more if you want it".
export default function StudentHubFaqFooter({ faqId }: { faqId?: string }) {
  const faq = faqId ? getFaq(faqId) : undefined

  return (
    <section className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4 dark:border-indigo-500/25 dark:bg-indigo-500/10">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
        <HelpCircle className="h-3.5 w-3.5" />
        Common question
      </p>
      {faq ? (
        <div className="mt-2">
          <p className="text-base font-bold text-slate-900 dark:text-white">{faq.question}</p>
          <p className="mt-1 text-[15px] leading-7 text-slate-600 dark:text-slate-300 sm:text-base">{faq.answer}</p>
        </div>
      ) : null}
      <Link
        to="/student-hub/faq"
        className="mt-3 inline-flex items-center gap-1 text-[15px] font-semibold text-indigo-600 hover:underline dark:text-indigo-300"
      >
        See all Student Hub FAQs
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}
