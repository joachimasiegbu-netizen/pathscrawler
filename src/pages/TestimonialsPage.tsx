import { useMemo, useState } from 'react'
import { MessageSquareQuote, Star } from 'lucide-react'
import BackButton from '../components/BackButton'
import PageHeader from '../components/PageHeader'
import TestimonialCard from '../components/TestimonialCard'
import {
  TESTIMONIALS,
  TESTIMONIAL_CATEGORIES,
  categoryOfTestimonial,
} from '../data/testimonials'

export default function TestimonialsPage() {
  const [category, setCategory] = useState<string>('all')

  const shown = useMemo(() => {
    if (category === 'all') return TESTIMONIALS
    return TESTIMONIALS.filter((t) => categoryOfTestimonial(t) === category)
  }, [category])

  const avgRating = (TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0) / TESTIMONIALS.length).toFixed(1)
  const careerCount = new Set(TESTIMONIALS.map((t) => t.careerId)).size

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <BackButton to="/role" label="Home" />

      <div className="mt-6 space-y-6">
        <PageHeader
          icon={MessageSquareQuote}
          title="What people say about the jobs"
          subtitle={'Honest reactions to specific careers — the good, the lukewarm and the "glad I found out first". Every job page has its own.'}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {avgRating} avg · {TESTIMONIALS.length} reviews across {careerCount} jobs
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {['all', ...TESTIMONIAL_CATEGORIES].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(key)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                category === key
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {key === 'all' ? 'All jobs' : key}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {shown.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </div>
  )
}
