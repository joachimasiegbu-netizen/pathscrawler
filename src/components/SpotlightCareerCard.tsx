import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Copy, Sparkles, TrendingUp } from 'lucide-react'
import type { Career } from '../data/demoCareers'
import { jobMarketData } from '../data/jobMarketData'
import Button from './Button'
import Toast from './Toast'

interface SpotlightCareerCardProps {
  career: Career
  blurb: string
}

// A couple of jobMarketData.js titles are a real synonym rather than a
// formatting quirk (its formal "Registered Nurse" vs demoCareers' plain
// "Nurse") - same alias list JobMarketPage.tsx used for the reverse lookup.
const TITLE_ALIASES: Record<string, string> = {
  'Registered Nurse': 'Nurse',
}

function normalizeTitle(value: string): string {
  return value.toLowerCase().replace(/\s*\/\s*/g, '/').trim()
}

// jobMarketData only tracks ~11 titles out of demoCareers' 83, so most weeks
// won't have a real growth figure for whatever got spotlighted - "Steady"
// is an honest fallback rather than inventing a number that isn't there.
function findGrowthRate(title: string): { label: string; isReal: boolean } {
  const target = normalizeTitle(title)
  for (const item of jobMarketData.trendingUp) {
    if (normalizeTitle(TITLE_ALIASES[item.career] ?? item.career) === target) return { label: item.change, isReal: true }
  }
  for (const item of jobMarketData.trendingDown) {
    if (normalizeTitle(TITLE_ALIASES[item.career] ?? item.career) === target) return { label: item.change, isReal: true }
  }
  return { label: 'Steady', isReal: false }
}

// No explicit "entry barrier" field exists on Career - this reads it off the
// career's own real requirements text rather than inventing a rating, so
// it's a genuine (if approximate) reflection of what's actually listed.
function estimateEntryBarrier(requirements: string[]): 'Low' | 'Medium' | 'High' {
  const text = requirements.join(' ').toLowerCase()
  if (text.includes('degree') || text.includes('postgraduate') || text.includes("master's")) return 'High'
  if (text.includes('a-level') || text.includes('nvq level 3') || text.includes('apprenticeship') || text.includes('btec')) return 'Medium'
  return 'Low'
}

export default function SpotlightCareerCard({ career, blurb }: SpotlightCareerCardProps) {
  const navigate = useNavigate()
  const [showToast, setShowToast] = useState(false)

  const growth = findGrowthRate(career.title)
  const entryBarrier = estimateEntryBarrier(career.requirements)

  const handleShare = async () => {
    const url = `${window.location.origin}/job-market/spotlight`
    const text = `Check out this week's career spotlight on PathScrawler: ${url}`
    try {
      await navigator.clipboard.writeText(text)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2500)
    } catch {
      // clipboard API unavailable in this browser/context - nothing else to do
    }
  }

  return (
    <>
      {/* Gradient "border" via a padded gradient box behind a solid inner
          card - simplest reliable cross-browser way to get a soft-glowing
          purple/violet outline instead of a flat 1px border. */}
      <div className="rounded-[26px] bg-gradient-to-br from-purple-400 via-violet-400 to-purple-500 p-[1.5px] shadow-lg shadow-purple-200/60 dark:shadow-none dark:ring-2 dark:ring-purple-800/60">
        <div className="overflow-hidden rounded-[24px] bg-white dark:bg-slate-800">
          {/* Hero band - no real photography for careers, so this is a
              themed gradient + a faint oversized Sparkles watermark instead
              of a placeholder image. */}
          <div className="relative flex h-32 items-end overflow-hidden bg-gradient-to-br from-purple-500 via-violet-500 to-purple-700 px-6 py-4 sm:h-40 sm:px-8">
            {/* Inline style, not a text-white/NN class: the app-wide
                `html.dark-mode body * { color: ... !important }` rule
                overrides any class-based color (alpha included), which
                would otherwise turn this faint watermark solid white in
                dark mode. Inline styles aren't touched by that rule. */}
            <Sparkles className="absolute -right-4 -top-4 h-32 w-32" style={{ color: 'rgba(255,255,255,0.12)' }} aria-hidden="true" />
            <span className="relative inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-white backdrop-blur-sm">
              {career.category}
            </span>
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="text-2xl font-bold text-slate-950 dark:text-slate-50 sm:text-3xl">{career.title}</h2>
              <span className="shrink-0 whitespace-nowrap rounded-full bg-purple-100 px-4 py-1.5 text-lg font-bold text-purple-800 dark:bg-purple-950 dark:text-purple-200">
                {career.salary}
              </span>
            </div>

            <p className="text-base leading-7 text-slate-700 dark:text-slate-200">{career.description}</p>

            <div className="rounded-2xl border border-purple-100 bg-purple-50/60 p-5 dark:border-purple-900 dark:bg-purple-950/40">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-purple-700 dark:text-purple-300">
                <Sparkles className="h-3.5 w-3.5" />
                Why it's spotlighted
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">{blurb}</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Avg salary</p>
                <p className="mt-1 text-sm font-bold text-slate-950 dark:text-slate-50 sm:text-base">{career.salary}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Growth</p>
                <p
                  className={`mt-1 inline-flex items-center gap-1 text-sm font-bold sm:text-base ${
                    growth.isReal ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-950 dark:text-slate-50'
                  }`}
                >
                  {growth.isReal ? <TrendingUp className="h-3.5 w-3.5" /> : null}
                  {growth.label}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Entry barrier</p>
                <p className="mt-1 text-sm font-bold text-slate-950 dark:text-slate-50 sm:text-base">{entryBarrier}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button onClick={() => navigate(`/career/${career.id}`)} className="flex-1 sm:flex-none">
                Explore this career
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
              <motion.button
                type="button"
                onClick={handleShare}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                aria-label="Share this spotlight"
              >
                {showToast ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Share
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      {showToast ? <Toast message="Link copied!" type="success" /> : null}
    </>
  )
}
