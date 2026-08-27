// England student loan projection model. Deliberately a simplified, yearly
// model (not the SLC's exact monthly RPI-indexed calculation) - close enough
// to show the SHAPE of a balance over time and whether it gets written off,
// which is the point of the Student Debt Calculator. Every figure the UI
// feeds in is editable and captioned "check gov.uk for current values".
//
// Two separate assumptions drive the projection, and both are estimates the
// user sets, not forecasts:
//   - inflation (rpiPct): grows future tuition and living costs year on year
//   - loan interest (loanInterestPct): the rate charged on the balance
// Keeping them apart means the app can label the interest line "estimated"
// instead of pretending it knows the rate a decade out.

export type LoanPlan = 'plan2' | 'plan5'

export interface LoanInputs {
  courseYears: number
  tuitionPerYear: number
  maintenancePerYear: number
  /** Grants / bursaries / scholarships per year that do NOT need repaying. */
  grantsPerYear: number
  plan: LoanPlan
  /** Annual inflation assumption (%), grows future tuition and living costs. */
  rpiPct: number
  /** Estimated annual loan interest (%). An assumption the user sets, not a forecast. */
  loanInterestPct: number
  /** Repayment threshold (£/yr). */
  threshold: number
  /** Percentage of income above the threshold repaid each year (9). */
  repayRatePct: number
  startingSalary: number
  /** Annual salary growth, percent. */
  salaryGrowthPct: number
  /** How many years past graduation to project (write-off still applies). */
  projectionYears: number
}

export interface LoanYear {
  /** 0 = first year of study. Negative during study, positive in repayment. */
  yearIndex: number
  label: string
  phase: 'study' | 'repay'
  salary: number
  interestAdded: number
  repaid: number
  monthlyRepayment: number
  /** Balance at END of this year. */
  balance: number
}

export interface LoanResult {
  years: LoanYear[]
  totalBorrowed: number
  totalRepaid: number
  peakBalance: number
  /** Repayment year the balance first hits £0 (null if never within the window). */
  clearedInYear: number | null
  writtenOff: boolean
  /** Balance cancelled at write-off (0 if cleared first). */
  writtenOffAmount: number
  writeOffYears: number
}

const PLAN_WRITE_OFF: Record<LoanPlan, number> = { plan2: 30, plan5: 40 }

/** `base` is the user's estimated loan-interest assumption. Plan 5 applies it
 * flat. Plan 2 charges it up to a lower income point, sliding to base + 3% at a
 * higher one; during study Plan 2 sits at the top of that band. */
function interestRate(plan: LoanPlan, base: number, salary: number, studying: boolean): number {
  if (plan === 'plan5') return base
  if (studying) return base + 3
  const lower = 28470
  const upper = 51245
  if (salary <= lower) return base
  if (salary >= upper) return base + 3
  return base + 3 * ((salary - lower) / (upper - lower))
}

export function projectLoan(input: LoanInputs): LoanResult {
  const years: LoanYear[] = []
  const writeOffYears = PLAN_WRITE_OFF[input.plan]
  let balance = 0
  let totalBorrowed = 0
  let totalRepaid = 0
  let peakBalance = 0
  let clearedInYear: number | null = null

  // --- Study phase: draw down the loan, interest accrues at the max rate ---
  for (let y = 0; y < input.courseYears; y += 1) {
    // Tuition and living costs rise with the inflation assumption each year the
    // course runs, so a later study year draws down more than the first.
    const inflator = (1 + input.rpiPct / 100) ** y
    const drawn = Math.max(0, input.tuitionPerYear + input.maintenancePerYear - input.grantsPerYear) * inflator
    balance += drawn
    totalBorrowed += drawn
    const rate = interestRate(input.plan, input.loanInterestPct, 0, true) / 100
    const interestAdded = balance * rate
    balance += interestAdded
    peakBalance = Math.max(peakBalance, balance)
    years.push({
      yearIndex: y - input.courseYears,
      label: `Study year ${y + 1}`,
      phase: 'study',
      salary: 0,
      interestAdded,
      repaid: 0,
      monthlyRepayment: 0,
      balance,
    })
  }

  // --- Repayment phase ---
  for (let r = 1; r <= input.projectionYears; r += 1) {
    if (balance <= 0 && clearedInYear !== null) break

    const salary = input.startingSalary * (1 + input.salaryGrowthPct / 100) ** (r - 1)
    const rate = interestRate(input.plan, input.loanInterestPct, salary, false) / 100
    const interestAdded = balance > 0 ? balance * rate : 0

    let repaid = Math.max(0, (salary - input.threshold) * (input.repayRatePct / 100))
    // Don't overpay past zero.
    const balanceWithInterest = balance + interestAdded
    if (repaid > balanceWithInterest) repaid = Math.max(0, balanceWithInterest)

    balance = Math.max(0, balanceWithInterest - repaid)
    totalRepaid += repaid
    peakBalance = Math.max(peakBalance, balanceWithInterest)

    if (balance <= 0 && clearedInYear === null) clearedInYear = r

    const writeOffHit = r >= writeOffYears
    if (writeOffHit) balance = 0

    years.push({
      yearIndex: r,
      label: `Year ${r} after graduating`,
      phase: 'repay',
      salary,
      interestAdded,
      repaid,
      monthlyRepayment: repaid / 12,
      balance,
    })

    if (writeOffHit) break
  }

  const lastYear = years[years.length - 1]
  const reachedWriteOff = lastYear?.phase === 'repay' && lastYear.yearIndex >= writeOffYears
  const writtenOff = reachedWriteOff && clearedInYear === null
  // Balance cancelled = the balance just before the write-off year zeroed it.
  const writtenOffAmount = writtenOff
    ? (years[years.length - 2]?.balance ?? 0) + (lastYear?.interestAdded ?? 0) - (lastYear?.repaid ?? 0)
    : 0

  return {
    years,
    totalBorrowed: Math.round(totalBorrowed),
    totalRepaid: Math.round(totalRepaid),
    peakBalance: Math.round(peakBalance),
    clearedInYear,
    writtenOff,
    writtenOffAmount: Math.max(0, Math.round(writtenOffAmount)),
    writeOffYears,
  }
}

export function gbp(n: number): string {
  return `£${Math.round(n).toLocaleString('en-GB')}`
}
