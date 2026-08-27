import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import { usePathStore } from '../store/usePathStore'

// Rebuilt matcher. The old version summed one "vote" per question with no
// constraints, so e.g. "Under 16" could still surface Undergraduate and
// Mature Learner. Now: age and situation are HARD GATES that rule roles in
// or out, then a small weighting picks the single best remaining fit. Two
// answers (leaving the forces / new to the UK) override everything, because
// those routes are specific and the app has dedicated flows for them.

type RoleKey =
  | 'student'
  | 'apprentice'
  | 'graduate'
  | 'career-changer'
  | 'mature-learner'
  | 'armed-forces-leaver'
  | 'refugee-asylum-seeker'
  | 'disabled-learner'

const roleProfiles: Record<RoleKey, { name: string; lead: string }> = {
  student: { name: 'Student', lead: "You're planning school or college choices, so we'll start with subjects and the routes they open." },
  apprentice: { name: 'Apprentice', lead: "You want to earn while you learn, so we'll point you at apprenticeships and fast vocational routes." },
  graduate: { name: 'Undergraduate', lead: "You're heading for or already at university, so we'll focus on degree-level study and early career steps." },
  'career-changer': { name: 'Career Changer', lead: "You're switching fields, so we'll work from where you are now to a new direction." },
  'mature-learner': { name: 'Mature Learner', lead: "You're coming back to study after time away, so we'll keep the options flexible and realistic." },
  'armed-forces-leaver': { name: 'Armed Forces Leaver', lead: "You're moving from military service to civilian study and work, and there's a route built for exactly that." },
  'refugee-asylum-seeker': { name: 'Immigrant / Asylum Seeker', lead: "You're building a career after arriving in the UK, so we'll cover English, recognising your qualifications, and next steps." },
  'disabled-learner': { name: 'Disabled Learner', lead: "You told us you need accessibility support, so we'll surface accessible options and the help you're entitled to." },
}

interface AssessmentOption {
  id: string
  label: string
}
interface AssessmentQuestion {
  id: string
  question: string
  optional?: boolean
  options: AssessmentOption[]
}

const questions: AssessmentQuestion[] = [
  {
    id: 'age',
    question: 'How old are you?',
    options: [
      { id: 'under-16', label: 'Under 16' },
      { id: '16-18', label: '16 to 18' },
      { id: '19-21', label: '19 to 21' },
      { id: '22-30', label: '22 to 30' },
      { id: '31-plus', label: '31 or older' },
    ],
  },
  {
    id: 'situation',
    question: 'Where are you right now?',
    options: [
      { id: 'in-school', label: 'In school or sixth form' },
      { id: 'at-college', label: 'At college or on a course' },
      { id: 'at-uni', label: 'At university' },
      { id: 'working', label: 'Working' },
      { id: 'not-working', label: 'Not working right now' },
      { id: 'forces', label: 'Leaving, or recently left, the armed forces' },
      { id: 'new-uk', label: 'New to the UK in the last few years' },
    ],
  },
  {
    id: 'finished',
    question: 'What have you finished so far?',
    options: [
      { id: 'none-yet', label: 'Nothing yet, still at school' },
      { id: 'gcses', label: 'GCSEs' },
      { id: 'level3', label: 'A-levels, BTEC or a T-Level' },
      { id: 'apprenticeship', label: 'An apprenticeship' },
      { id: 'degree', label: 'A degree' },
    ],
  },
  {
    id: 'learning',
    question: 'How do you want to learn?',
    options: [
      { id: 'classroom', label: 'In a classroom' },
      { id: 'on-job', label: 'On the job, earning while I learn' },
      { id: 'online', label: 'Online and flexible' },
      { id: 'mix', label: 'A mix' },
    ],
  },
  {
    id: 'support',
    question: 'Do you need accessibility support to study or work?',
    optional: true,
    options: [
      { id: 'yes', label: 'Yes: a disability, health condition or learning difference' },
      { id: 'no', label: 'No' },
    ],
  },
]

type Answers = Record<string, string>

const AGE_ORDER = ['under-16', '16-18', '19-21', '22-30', '31-plus']
function ageAtLeast(age: string | undefined, min: string): boolean {
  if (!age) return false
  return AGE_ORDER.indexOf(age) >= AGE_ORDER.indexOf(min)
}

/** Returns roles that are actually possible given age + situation. Order
 * doesn't matter here; scoreRoles picks the winner. */
function eligibleRoles(a: Answers): RoleKey[] {
  const age = a.age
  const sit = a.situation
  const finished = a.finished
  const roles = new Set<RoleKey>()

  // Study-planning route: only really makes sense for the youngest, or
  // anyone still in school/college who hasn't finished Level 3.
  if (age === 'under-16' || age === '16-18' || sit === 'in-school' || (sit === 'at-college' && finished !== 'level3' && finished !== 'degree')) {
    roles.add('student')
  }

  // Apprenticeships: 16+ only. Not while you're at university.
  if (ageAtLeast(age, '16-18') && sit !== 'at-uni') {
    roles.add('apprentice')
  }

  // Undergraduate: 16+, don't already have a degree.
  if (ageAtLeast(age, '16-18') && finished !== 'degree') {
    if (sit === 'at-uni' || sit === 'in-school' || sit === 'at-college' || finished === 'level3') roles.add('graduate')
  }

  // Career changer: adults already in work / between jobs, with something
  // behind them.
  if (ageAtLeast(age, '19-21') && (sit === 'working' || sit === 'not-working') && finished !== 'none-yet') {
    roles.add('career-changer')
  }

  // Mature learner: 22+, coming back to study, not currently a school/uni
  // student.
  if (ageAtLeast(age, '22-30') && sit !== 'in-school' && sit !== 'at-uni') {
    roles.add('mature-learner')
  }

  // Never leave someone with nothing.
  if (roles.size === 0) roles.add(ageAtLeast(age, '22-30') ? 'mature-learner' : 'student')
  return [...roles]
}

function scoreRoles(a: Answers, eligible: RoleKey[]): RoleKey[] {
  const s: Record<string, number> = {}
  const bump = (r: RoleKey, n: number) => {
    if (eligible.includes(r)) s[r] = (s[r] ?? 0) + n
  }

  // Age pull
  if (a.age === 'under-16') bump('student', 5)
  if (a.age === '16-18') { bump('student', 2); bump('apprentice', 2); bump('graduate', 2) }
  if (a.age === '19-21') { bump('graduate', 3); bump('apprentice', 2) }
  if (a.age === '22-30') { bump('career-changer', 3); bump('mature-learner', 2); bump('apprentice', 1) }
  if (a.age === '31-plus') { bump('mature-learner', 3); bump('career-changer', 3) }

  // Situation pull
  if (a.situation === 'in-school') { bump('student', 3); bump('graduate', 1) }
  if (a.situation === 'at-college') { bump('student', 2); bump('apprentice', 2) }
  if (a.situation === 'at-uni') bump('graduate', 6)
  if (a.situation === 'working') { bump('career-changer', 3); bump('apprentice', 1) }
  if (a.situation === 'not-working') { bump('apprentice', 3); bump('career-changer', 2); bump('mature-learner', 1) }

  // What they've finished
  if (a.finished === 'none-yet') bump('student', 3)
  if (a.finished === 'gcses') { bump('apprentice', 2); bump('student', 1) }
  if (a.finished === 'level3') { bump('graduate', 3); bump('apprentice', 1) }
  if (a.finished === 'apprenticeship') { bump('career-changer', 2); bump('apprentice', 1) }
  if (a.finished === 'degree') { bump('career-changer', 3); bump('mature-learner', 2) }

  // How they want to learn
  if (a.learning === 'classroom') { bump('graduate', 2); bump('student', 1) }
  if (a.learning === 'on-job') { bump('apprentice', 4); bump('career-changer', 1) }
  if (a.learning === 'online') { bump('mature-learner', 3); bump('career-changer', 1) }
  if (a.learning === 'mix') { bump('apprentice', 1); bump('career-changer', 1) }

  return eligible
    .map((r) => [r, s[r] ?? 0] as [RoleKey, number])
    .sort((x, y) => y[1] - x[1])
    .map(([r]) => r)
}

interface Match {
  primary: RoleKey
  alternatives: RoleKey[]
  reason: string
}

function evaluate(a: Answers): Match {
  // Hard overrides: the most specific answer wins outright.
  if (a.situation === 'forces') {
    const study = scoreRoles(a, eligibleRoles(a))
    return { primary: 'armed-forces-leaver', alternatives: study.slice(0, 2), reason: "You told us you're leaving the armed forces." }
  }
  if (a.situation === 'new-uk') {
    const study = scoreRoles(a, eligibleRoles(a))
    return { primary: 'refugee-asylum-seeker', alternatives: study.slice(0, 2), reason: "You told us you're new to the UK." }
  }

  const eligible = eligibleRoles(a)
  const ranked = scoreRoles(a, eligible)

  if (a.support === 'yes') {
    return {
      primary: 'disabled-learner',
      alternatives: ranked.slice(0, 2),
      reason: 'You told us you need accessibility support, so this is the route that surfaces it.',
    }
  }

  return {
    primary: ranked[0] ?? 'student',
    alternatives: ranked.slice(1, 3),
    reason: 'Based on your age, where you are now, and how you want to learn.',
  }
}

export default function QuickAssessmentPage() {
  const navigate = useNavigate()
  const setSelectedRole = usePathStore((state) => state.setSelectedRole)
  const setAssessmentCompleted = usePathStore((state) => state.setAssessmentCompleted)
  const setMatchedRoles = usePathStore((state) => state.setMatchedRoles)
  const setRecommendedRole = usePathStore((state) => state.setRecommendedRole)
  const setCurrentPath = usePathStore((state) => state.setCurrentPath)
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)

  const [answers, setAnswers] = useState<Answers>({})
  const [questionIndex, setQuestionIndex] = useState(0)
  const [chosen, setChosen] = useState<RoleKey | null>(null)
  const [showAlternatives, setShowAlternatives] = useState(false)

  const currentQuestion = questions[questionIndex]
  const isReview = questionIndex >= questions.length
  const progressValue = Math.min(((questionIndex + 1) / (questions.length + 1)) * 100, 100)

  const match = useMemo(() => evaluate(answers), [answers])
  const primary = chosen ?? match.primary

  const motionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, x: 40 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -40 },
        transition: { duration: 0.3 },
      }

  const next = () => setQuestionIndex((i) => i + 1)

  // Single-select questions: picking an answer records it and moves straight
  // to the next question (a short beat so the tap registers first). No Next
  // button. The guard stops a fast double-tap skipping a question.
  const advancingRef = useRef(false)
  const select = (optionId: string) => {
    if (advancingRef.current) return
    advancingRef.current = true
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }))
    window.setTimeout(() => {
      next()
      advancingRef.current = false
    }, 170)
  }

  const goToPath = () => {
    setAssessmentCompleted(true)
    setMatchedRoles([primary, ...match.alternatives])
    setRecommendedRole(primary)
    setSelectedRole(primary)
    setCurrentPath('education')
    navigate('/subjects')
  }

  return (
    <div className="mx-auto w-full max-w-[430px] px-4 py-6 sm:px-0">
      <div className="rounded-[32px] bg-white p-6 pt-12 shadow-soft dark:bg-slate-800">
        <div className="mb-6">
          <BackButton to="/role" />
        </div>
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-dark dark:text-primary-light">Quick assessment</p>
          <h1 className="mt-3 text-2xl font-bold text-slate-950 dark:text-white">Find your path in 60 seconds</h1>
        </div>

        <div className="mb-6 rounded-full bg-slate-100 p-1 dark:bg-slate-700">
          <div className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary transition-all" style={{ width: `${progressValue}%` }} />
        </div>

        <div className="mb-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>{isReview ? 'Your result' : `Question ${questionIndex + 1} of ${questions.length}`}</span>
          <span>{Math.round(progressValue)}%</span>
        </div>

        <AnimatePresence mode="wait">
          {isReview ? (
            <motion.div key="review" {...motionProps} className="space-y-5">
              <div className="rounded-[24px] border-2 border-primary bg-primary/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-dark dark:text-primary-light">Your path</p>
                <h2 className="mt-1.5 text-xl font-bold text-slate-950 dark:text-white">{roleProfiles[primary].name}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{roleProfiles[primary].lead}</p>
                <Button onClick={goToPath} className="mt-4 w-full justify-center py-3">
                  Continue as {roleProfiles[primary].name}
                </Button>
              </div>

              {match.alternatives.length > 0 ? (
                <div>
                  {!showAlternatives ? (
                    <button
                      type="button"
                      onClick={() => setShowAlternatives(true)}
                      className="text-sm font-semibold text-primary hover:underline dark:text-primary-light"
                    >
                      Not quite right? See {match.alternatives.length === 1 ? 'the other option' : 'other options'}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      {match.alternatives.map((roleId) => (
                        <button
                          key={roleId}
                          type="button"
                          onClick={() => setChosen(roleId)}
                          className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left transition ${
                            primary === roleId
                              ? 'border-primary bg-primary/5'
                              : 'border-slate-200 bg-white hover:border-primary/50 dark:border-slate-700 dark:bg-slate-800'
                          }`}
                        >
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">{roleProfiles[roleId].name}</span>
                          <span className="text-xs font-semibold text-primary dark:text-primary-light">
                            {primary === roleId ? 'Selected' : 'Pick this'}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </motion.div>
          ) : (
            <motion.div key={currentQuestion.id} {...motionProps} className="space-y-5">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-primary-dark dark:text-primary-light">
                  {currentQuestion.optional ? 'Optional' : 'Question'}
                </p>
                <h2 className="text-xl font-semibold text-slate-950 dark:text-white">{currentQuestion.question}</h2>
              </div>

              <div className="grid gap-3">
                {currentQuestion.options.map((option) => {
                  const active = answers[currentQuestion.id] === option.id
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => select(option.id)}
                      className={`rounded-[20px] border p-4 text-left text-sm font-semibold transition ${
                        active
                          ? 'border-primary bg-primary/5 text-slate-900 shadow-sm dark:text-white'
                          : 'border-slate-200 bg-white text-slate-900 hover:border-primary/50 hover:bg-primary/5 dark:border-slate-700 dark:bg-slate-800 dark:text-white'
                      }`}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>

              {currentQuestion.optional ? (
                <button
                  type="button"
                  onClick={next}
                  className="w-full text-center text-sm font-semibold text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-300"
                >
                  Skip this question
                </button>
              ) : (
                <p className="text-center text-xs text-slate-400">Tap an answer to continue</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
