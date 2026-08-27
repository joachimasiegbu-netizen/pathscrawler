import { Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatTestimonialDate, type Testimonial } from '../data/testimonials'

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-3.5 w-3.5 ${index < rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200 dark:fill-slate-600 dark:text-slate-600'}`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

export default function TestimonialCard({
  testimonial,
  className = '',
  hideCareerBadge = false,
}: {
  testimonial: Testimonial
  className?: string
  /** On a career detail page the badge is redundant - you're already there. */
  hideCareerBadge?: boolean
}) {
  const navigate = useNavigate()
  return (
    <figure
      className={`flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: testimonial.accent }}
            aria-hidden="true"
          >
            {testimonial.initials}
          </span>
          <div className="min-w-0">
            <figcaption className="truncate text-sm font-semibold text-slate-900 dark:text-white">{testimonial.name}</figcaption>
            <p className="text-xs text-slate-400 dark:text-slate-500">{formatTestimonialDate(testimonial.date)}</p>
          </div>
        </div>
        <Stars rating={testimonial.rating} />
      </div>

      <blockquote className="flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">&ldquo;{testimonial.quote}&rdquo;</blockquote>

      {!hideCareerBadge && testimonial.careerId && testimonial.careerLabel ? (
        <button
          type="button"
          onClick={() => navigate(`/career/${testimonial.careerId}`)}
          className="self-start rounded-full border border-primary/30 bg-primary-soft/40 px-3 py-1 text-xs font-semibold text-primary-dark transition hover:bg-primary-soft/70 dark:border-primary/40 dark:bg-primary/10 dark:text-primary-light"
        >
          {testimonial.careerLabel}
        </button>
      ) : null}
    </figure>
  )
}
