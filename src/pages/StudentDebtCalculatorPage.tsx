import { useMemo, useState } from 'react'
import { AlertTriangle, Calculator, CheckCircle2, GitCompare, Info, X } from 'lucide-react'
import BackButton from '../components/BackButton'
import PageHeader from '../components/PageHeader'
import StudentHubFaqFooter from '../components/StudentHubFaqFooter'
import CourseSearch from '../components/CourseSearch'
import LoanBalanceChart from '../components/charts/LoanBalanceChart'
import { DEFAULT_COURSE, courseById, type CoursePreset } from '../data/courseCosts'
import { gbp, projectLoan, type LoanInputs, type LoanPlan, type LoanResult } from '../utils/studentLoanModel'

const PLAN_THRESHOLD: Record<LoanPlan, number> = { plan2: 27295, plan5: 25000 }

interface Scenario {
  courseId: string
  tuitionPerYear: number
  courseYears: number
  maintenancePerYear: number
  grantsPerYear: number
  plan: LoanPlan
  /** Inflation assumption (%/yr): grows future tuition and living costs. */
  rpiPct: number
  /** Estimated loan interest (%/yr): a long-term assumption, not a forecast. */
  loanInterestPct: number
  startingSalary: number
  salaryGrowthPct: number
  projectionYears: number
}

function newScenario(plan: LoanPlan): Scenario {
  return {
    courseId: DEFAULT_COURSE.id,
    tuitionPerYear: DEFAULT_COURSE.tuitionPerYear,
    courseYears: DEFAULT_COURSE.years,
    maintenancePerYear: 10227,
    grantsPerYear: 0,
    plan,
    rpiPct: 2.9,
    loanInterestPct: 3.0,
    startingSalary: DEFAULT_COURSE.typicalStartingSalary,
    salaryGrowthPct: 3,
    projectionYears: 40,
  }
}

function toInputs(s: Scenario): LoanInputs {
  return {
    courseYears: s.courseYears,
    tuitionPerYear: s.tuitionPerYear,
    maintenancePerYear: s.maintenancePerYear,
    grantsPerYear: s.grantsPerYear,
    plan: s.plan,
    rpiPct: s.rpiPct,
    loanInterestPct: s.loanInterestPct,
    threshold: PLAN_THRESHOLD[s.plan],
    repayRatePct: 9,
    startingSalary: s.startingSalary,
    salaryGrowthPct: s.salaryGrowthPct,
    projectionYears: s.projectionYears,
  }
}

function NumberField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  prefix?: string
  suffix?: string
  step?: number
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</span>
      <span className="flex items-center rounded-xl border border-slate-200 bg-white focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400/20 dark:border-slate-700 dark:bg-slate-950">
        {prefix ? <span className="pl-3.5 text-sm text-slate-400">{prefix}</span> : null}
        <input
          type="number"
          inputMode="decimal"
          value={Number.isFinite(value) ? value : 0}
          step={step}
          min={0}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
          className="w-full bg-transparent px-3.5 py-2.5 text-sm text-slate-900 outline-none dark:text-slate-100"
        />
        {suffix ? <span className="pr-3.5 text-sm text-slate-400">{suffix}</span> : null}
      </span>
    </label>
  )
}

function ResultStat({ label, value, tone = 'default' }: { label: string; value: string; tone?: 'default' | 'good' | 'bad' }) {
  const color =
    tone === 'good' ? 'text-emerald-600 dark:text-emerald-400' : tone === 'bad' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-1 text-xl font-extrabold tabular-nums ${color}`}>{value}</p>
    </div>
  )
}

function Outcome({ result }: { result: LoanResult }) {
  if (result.clearedInYear !== null) {
    return (
      <div className="flex items-start gap-2 rounded-xl border border-emerald-300/60 bg-emerald-50 p-4 text-sm dark:border-emerald-500/30 dark:bg-emerald-500/10">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
        <p className="leading-6 text-emerald-900 dark:text-emerald-100">
          <span className="font-bold">Debt-free in year {result.clearedInYear}</span> after graduating. You repay it in
          full before the {result.writeOffYears}-year write-off, then the 9% deduction stops.
          {result.totalRepaid > result.totalBorrowed
            ? ` Total repaid (${gbp(result.totalRepaid)}) comes out above the ${gbp(result.totalBorrowed)} borrowed - about ${gbp(result.totalInterest)} of that is interest along the way, not extra borrowing.`
            : null}
        </p>
      </div>
    )
  }
  if (result.writtenOff) {
    return (
      <div className="flex items-start gap-2 rounded-xl border border-amber-300/60 bg-amber-50 p-4 text-sm dark:border-amber-500/30 dark:bg-amber-500/10">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
        <p className="leading-6 text-amber-900 dark:text-amber-100">
          On these figures the loan is <span className="font-bold">written off after {result.writeOffYears} years</span>,
          with about <span className="font-bold">{gbp(result.writtenOffAmount)}</span> of balance cancelled. You never
          repay it all. Total repaid is {gbp(result.totalRepaid)} - more than the {gbp(result.totalBorrowed)} borrowed,
          because interest kept accruing faster than the repayments could clear it (about{' '}
          {gbp(result.totalInterest)} of interest across the loan's life, not extra borrowing).
        </p>
      </div>
    )
  }
  return (
    <div className="flex items-start gap-2 rounded-xl border border-slate-300/60 bg-slate-50 p-4 text-sm dark:border-slate-600 dark:bg-slate-800">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
      <p className="leading-6 text-slate-700 dark:text-slate-200">
        Still repaying at the end of the projection window. Extend the years, or adjust the salary, to see where it lands.
      </p>
    </div>
  )
}

export default function StudentDebtCalculatorPage() {
  const [plan, setPlan] = useState<LoanPlan>('plan5')
  const [planInfoOpen, setPlanInfoOpen] = useState(false)
  const [a, setA] = useState<Scenario>(() => newScenario('plan5'))
  const [compareOn, setCompareOn] = useState(false)
  const [b, setB] = useState<Scenario>(() => newScenario('plan5'))

  const setScenario = (which: 'a' | 'b') => (patch: Partial<Scenario>) => {
    ;(which === 'a' ? setA : setB)((prev) => ({ ...prev, ...patch }))
  }

  const applyCourse = (which: 'a' | 'b', course: CoursePreset) => {
    setScenario(which)({
      courseId: course.id,
      tuitionPerYear: course.tuitionPerYear,
      courseYears: course.years,
      startingSalary: course.typicalStartingSalary,
    })
  }

  const setPlanBoth = (p: LoanPlan) => {
    setPlan(p)
    setA((prev) => ({ ...prev, plan: p }))
    setB((prev) => ({ ...prev, plan: p }))
  }

  const resultA = useMemo(() => projectLoan(toInputs(a)), [a])
  const resultB = useMemo(() => projectLoan(toInputs(b)), [b])

  const monthlyYr10 = resultA.years.find((y) => y.yearIndex === 10)?.monthlyRepayment ?? 0

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6">
      <BackButton to="/student-hub" label="Student Hub" />
      <PageHeader
        icon={Calculator}
        title="Student Debt Calculator"
        subtitle="A rough year-by-year model for England. Every figure is an editable estimate, not a forecast, and what you actually repay depends on your plan and your future earnings. Check gov.uk for current numbers."
      />

      {/* plan toggle */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Repayment plan</h2>
          <button
            type="button"
            onClick={() => setPlanInfoOpen((v) => !v)}
            aria-label="What are Plan 5 and Plan 2?"
            aria-expanded={planInfoOpen}
            className="text-slate-400 transition hover:text-indigo-500"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
        {planInfoOpen ? (
          <p className="rounded-xl bg-indigo-50 p-3 text-xs leading-5 text-slate-600 dark:bg-indigo-500/10 dark:text-slate-300">
            Which plan you repay on depends on when your course started. If you are starting one now, you will be on
            Plan 5. If you are not sure, leave it on Plan 5.
          </p>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2">
          {(['plan5', 'plan2'] as LoanPlan[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlanBoth(p)}
              className={`rounded-2xl border p-4 text-left text-sm transition ${
                plan === p
                  ? 'border-indigo-400 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-500/10'
                  : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800'
              }`}
            >
              <span className="block font-bold text-slate-900 dark:text-white">{p === 'plan5' ? 'Plan 5' : 'Plan 2'}</span>
              <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-wide text-indigo-500 dark:text-indigo-300">
                {p === 'plan5' ? 'Course started 2023 or later' : 'Course started 2012 to 2022'}
              </span>
              <span className="mt-1 block leading-5 text-slate-500 dark:text-slate-400">
                {p === 'plan5'
                  ? 'Inflation-only interest, written off after 40 years.'
                  : 'Interest up to inflation plus 3%, written off after 30 years.'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <ScenarioForm
        title={compareOn ? 'Course A' : 'Your course'}
        scenario={a}
        onChange={setScenario('a')}
        onCourse={(c) => applyCourse('a', c)}
      />

      {/* Compare toggle, made prominent */}
      {!compareOn ? (
        <button
          type="button"
          onClick={() => setCompareOn(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-indigo-300 bg-indigo-50/50 py-4 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50 dark:border-indigo-500/40 dark:bg-indigo-500/5 dark:text-indigo-300"
        >
          <GitCompare className="h-4 w-4" />
          Compare a second course side by side
        </button>
      ) : (
        <>
          <ScenarioForm title="Course B" scenario={b} onChange={setScenario('b')} onCourse={(c) => applyCourse('b', c)} accent />
          <button
            type="button"
            onClick={() => setCompareOn(false)}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="h-4 w-4" />
            Remove the comparison
          </button>
        </>
      )}

      {/* Phones only: the result is ten inputs further down, so keep the headline
          number in view while editing. Sticky (not fixed), so it docks just above
          the Result section once you scroll down to it. */}
      <div className="sticky bottom-3 z-20 sm:hidden">
        <button
          type="button"
          onClick={() => document.getElementById('debt-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 text-left shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-800/95"
        >
          {/* The label is the only part that may shrink/ellipsis (min-w-0 +
              truncate); the figure and the cue are shrink-0. All three sit at
              16px here, not text-sm, because of index.css's site-wide size
              rule - at that size "Course A repaid" + the figure + "Details ↓"
              fill a 360px column almost exactly, and under Larger text or the
              dyslexia font they overflow it, which without this left the row
              wrapping into a two/three-line block. */}
          <span className="min-w-0 truncate text-sm text-slate-500 dark:text-slate-400">{compareOn ? 'Course A repaid' : 'Total repaid'}</span>
          <span className="shrink-0 font-bold tabular-nums text-slate-900 dark:text-white">{gbp(resultA.totalRepaid)}</span>
          <span className="shrink-0 text-sm font-semibold text-indigo-600 dark:text-indigo-300">Details ↓</span>
        </button>
      </div>

      {/* Results */}
      <section id="debt-result" className="scroll-mt-4 space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/40 sm:p-6">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {compareOn ? 'Course A result' : 'Result'}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Estimated on {gbp(a.tuitionPerYear)}/yr tuition over {a.courseYears} years, {a.rpiPct}% inflation and{' '}
            {a.loanInterestPct}% loan interest.
          </p>
        </div>
        {/* "Monthly now" was removed earlier (showed a confusing £0 by
            default - see git history) and this row ran 3-wide since. Back
            to 4 now: without a visible "total interest" figure, Total
            repaid (and, once written off, Total repaid + the cancelled
            balance) can land well above Total borrowed with nothing on
            screen explaining why - reported back as "doesn't make sense",
            confirmed by testing it live (default settings alone: £61,809
            borrowed vs £79,653 repaid + £98,465 written off). This stat is
            the reconciling number: borrowed + interest = repaid +
            written-off/outstanding, always. grid-cols-2 (not 1) on mobile
            so 4 stats still read as one block instead of a long stack. */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <ResultStat label="Total borrowed" value={gbp(resultA.totalBorrowed)} />
          <ResultStat label="Total interest" value={gbp(resultA.totalInterest)} />
          <ResultStat label="Total repaid" value={gbp(resultA.totalRepaid)} tone={resultA.totalRepaid > resultA.totalBorrowed ? 'bad' : 'default'} />
          <ResultStat label="Monthly at yr 10" value={gbp(monthlyYr10)} />
        </div>
        <Outcome result={resultA} />

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <LoanBalanceChart primary={resultA} compare={compareOn ? resultB : null} writeOffYear={resultA.writeOffYears} />
          {compareOn ? (
            <p className="mt-1 text-center text-xs text-slate-400">
              Solid indigo is {courseById(a.courseId).label}, dashed amber is {courseById(b.courseId).label}
            </p>
          ) : null}
        </div>

        {compareOn ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <ScenarioSummary label="Course A" result={resultA} />
            <ScenarioSummary label="Course B" result={resultB} />
          </div>
        ) : null}
      </section>

      <p className="text-xs leading-5 text-slate-400">
        Simplified yearly model: interest and repayments are applied once per year; inflation and loan interest are flat
        long-term estimates, not predicted rates; salary grows at a constant rate. The real calculation is monthly and
        the plan you are on drives the outcome. Use this for the shape of the curve and the write-off question, not for
        financial advice.
      </p>

      <StudentHubFaqFooter faqId="rep-write-off" />
    </div>
  )
}

function ScenarioForm({
  title,
  scenario,
  onChange,
  onCourse,
  accent = false,
}: {
  title: string
  scenario: Scenario
  onChange: (patch: Partial<Scenario>) => void
  onCourse: (course: CoursePreset) => void
  accent?: boolean
}) {
  return (
    <div
      className={`space-y-5 rounded-2xl border p-5 sm:p-6 ${
        accent ? 'border-amber-300/60 dark:border-amber-500/30' : 'border-slate-200 dark:border-slate-700'
      } bg-white dark:bg-slate-800`}
    >
      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>

      <div>
        <span className="mb-1.5 block text-sm font-semibold text-slate-600 dark:text-slate-300">
          Search your course to fill in tuition, length and typical salary
        </span>
        <CourseSearch onSelect={onCourse} />
        {scenario.courseId !== DEFAULT_COURSE.id ? (
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm dark:border-indigo-500/30 dark:bg-indigo-500/10">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-500" />
            <span className="font-semibold text-slate-900 dark:text-white">{courseById(scenario.courseId).label}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{scenario.courseYears} yr</span>
            <button
              type="button"
              onClick={() => onCourse(DEFAULT_COURSE)}
              className="ml-auto text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-300"
              aria-label="Clear the selected course"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Tuition for the year" prefix="£" value={scenario.tuitionPerYear} onChange={(v) => onChange({ tuitionPerYear: v })} step={250} />
        <NumberField label="Course length (years)" value={scenario.courseYears} onChange={(v) => onChange({ courseYears: Math.min(7, Math.max(1, v)) })} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Maintenance loan for the year" prefix="£" value={scenario.maintenancePerYear} onChange={(v) => onChange({ maintenancePerYear: v })} step={100} />
        <NumberField label="Grants or bursaries for the year" prefix="£" value={scenario.grantsPerYear} onChange={(v) => onChange({ grantsPerYear: v })} step={100} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Average starting salary for this course" prefix="£" value={scenario.startingSalary} onChange={(v) => onChange({ startingSalary: v })} step={500} />
        <NumberField label="Salary growth" suffix="%/yr" value={scenario.salaryGrowthPct} onChange={(v) => onChange({ salaryGrowthPct: v })} step={0.5} />
      </div>

      <div className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Assumptions &middot; estimates, not predictions
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField label="Inflation" suffix="%/yr" value={scenario.rpiPct} onChange={(v) => onChange({ rpiPct: v })} step={0.1} />
          <NumberField label="Estimated loan interest" suffix="%/yr" value={scenario.loanInterestPct} onChange={(v) => onChange({ loanInterestPct: v })} step={0.1} />
        </div>
        <p className="text-xs leading-5 text-slate-400">
          Inflation grows future tuition and living costs. The loan interest is a long-term estimate, not the exact
          rate charged each year. On Plan 2 the rate rises by up to 3% once you are earning more.
        </p>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-slate-600 dark:text-slate-300">Project for</span>
        <div className="flex gap-1.5">
          {[10, 20, 30, 40].map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => onChange({ projectionYears: y })}
              className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition ${
                scenario.projectionYears === y ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
              }`}
            >
              {y}y
            </button>
          ))}
        </div>
      </label>
    </div>
  )
}

function ScenarioSummary({ label, result }: { label: string; result: LoanResult }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-700 dark:bg-slate-800">
      <p className="font-bold text-slate-900 dark:text-white">{label}</p>
      <dl className="mt-1.5 space-y-1 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex justify-between"><dt>Borrowed</dt><dd className="tabular-nums">{gbp(result.totalBorrowed)}</dd></div>
        <div className="flex justify-between"><dt>Interest</dt><dd className="tabular-nums">{gbp(result.totalInterest)}</dd></div>
        <div className="flex justify-between"><dt>Repaid</dt><dd className="tabular-nums">{gbp(result.totalRepaid)}</dd></div>
        <div className="flex justify-between">
          <dt>Outcome</dt>
          <dd className="font-semibold">
            {result.clearedInYear !== null ? `Clear in yr ${result.clearedInYear}` : result.writtenOff ? `Written off (${gbp(result.writtenOffAmount)})` : 'Still repaying'}
          </dd>
        </div>
      </dl>
    </div>
  )
}
