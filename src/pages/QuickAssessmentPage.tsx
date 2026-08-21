import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CheckSquare, Square } from 'lucide-react'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import { usePathStore } from '../store/usePathStore'

// `multiSelect` questions store an array of chosen option ids instead of a
// single one. Each multi-select question also gets one option flagged
// `isSkip: true` (e.g. "I'm not sure yet") - picking it is mutually
// exclusive with every other option in that question (like a "None of the
// above" checkbox), and it deliberately maps to no roles in scoringMap, so
// picking it applies no preference filter at all.
//
// Explicitly typed rather than left to inference: none of the 3 remaining
// questions (after removing the old work-style/priority/barriers ones)
// happens to use subtitle/optional/multiSelect/description/isSkip, so
// TypeScript would otherwise narrow the inferred array type to exclude
// those fields entirely - and the render code below still reads all of
// them generically, for whichever question (now or later) does use them.
interface AssessmentOption {
  id: string
  label: string
  description?: string
  isSkip?: boolean
}
interface AssessmentQuestion {
  id: string
  question: string
  subtitle?: string
  optional?: boolean
  multiSelect?: boolean
  options: AssessmentOption[]
}
const questions: AssessmentQuestion[] = [
  {
    id: 'situation',
    question: 'What best describes your current situation?',
    options: [
      { id: 'in-school', label: 'In school' },
      { id: 'working', label: 'Working' },
      { id: 'unemployed', label: 'Unemployed' },
      { id: 'looking-to-change', label: 'Looking to change' },
    ],
  },
  {
    id: 'age',
    question: 'What age group are you in?',
    options: [
      { id: 'under-16', label: 'Under 16' },
      { id: '16-18', label: '16-18' },
      { id: '19-25', label: '19-25' },
      { id: '26-40', label: '26-40' },
      { id: '40-plus', label: '40+' },
    ],
  },
  {
    id: 'learning-style',
    question: 'How do you prefer to learn?',
    options: [
      { id: 'classroom', label: 'Classroom/studying' },
      { id: 'on-job', label: 'On-the-job training' },
      { id: 'online', label: 'Online/self-paced' },
      { id: 'mixed', label: 'Mix of all' },
    ],
  },
]

type RoleKey =
  | 'student'
  | 'apprentice'
  | 'graduate'
  | 'career-changer'
  | 'mature-learner'
  | 'armed-forces-leaver'
  | 'refugee-asylum-seeker'
  | 'disabled-learner'

const roleProfiles: Record<RoleKey, { name: string; description: string }> = {
  student: {
    name: 'Student',
    description: 'Best if you’re planning school or college choices with a clear study focus.',
  },
  apprentice: {
    name: 'Apprentice',
    description: 'Ideal for hands-on, work-based learning and fast-entry vocational training.',
  },
  graduate: {
    name: 'Undergraduate',
    description: 'Good for university-level study and early career progression.',
  },
  'career-changer': {
    name: 'Career Changer',
    description: 'Good for adults switching fields and looking for a fresh start.',
  },
  'mature-learner': {
    name: 'Mature Learner',
    description: 'A strong fit for learners returning to study after time away.',
  },
  'armed-forces-leaver': {
    name: 'Armed Forces Leaver',
    description: 'Suitable for military veterans transitioning to civilian learning and careers.',
  },
  'refugee-asylum-seeker': {
    name: 'Immigrant / Asylum Seeker',
    description: 'Designed for people new to the UK seeking stable learning and career routes.',
  },
  'disabled-learner': {
    name: 'Disabled Learner',
    description: 'Supports learners who need accessible options and tailored support.',
  },
}

const scoringMap: Record<string, Record<string, RoleKey[]>> = {
  situation: {
    'in-school': ['student', 'graduate'],
    working: ['career-changer'],
    unemployed: ['apprentice', 'career-changer'],
    'looking-to-change': ['career-changer'],
  },
  age: {
    'under-16': ['student'],
    '16-18': ['student', 'apprentice'],
    '19-25': ['apprentice', 'graduate'],
    '26-40': ['career-changer', 'mature-learner'],
    '40-plus': ['mature-learner', 'career-changer'],
  },
  'learning-style': {
    classroom: ['student', 'graduate'],
    'on-job': ['apprentice', 'career-changer'],
    online: ['mature-learner'],
    mixed: ['career-changer', 'apprentice'],
  },
}

// Multi-select questions contribute a score for every role mapped to every
// option the user picked - i.e. picking both "Data" and "Things" broadens
// the match rather than narrowing it to a single preference.
function getSortedRoles(answers: Record<string, string[]>): RoleKey[] {
  const scores = Object.keys(roleProfiles).reduce(
    (acc, key) => ({ ...acc, [key as RoleKey]: 0 }),
    {} as Record<RoleKey, number>,
  )

  Object.entries(answers).forEach(([questionId, answerIds]) => {
    answerIds.forEach((answerId) => {
      const mapped = scoringMap[questionId]?.[answerId] || []
      mapped.forEach((roleId) => {
        scores[roleId] = (scores[roleId] ?? 0) + 1
      })
    })
  })

  return (Object.entries(scores) as Array<[RoleKey, number]>)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, score]) => score > 0)
    .map(([roleId]) => roleId)
}

export default function QuickAssessmentPage() {
  const navigate = useNavigate()
  const setSelectedRole = usePathStore((state) => state.setSelectedRole)
  const setAssessmentCompleted = usePathStore((state) => state.setAssessmentCompleted)
  const setMatchedRoles = usePathStore((state) => state.setMatchedRoles)
  const setRecommendedRole = usePathStore((state) => state.setRecommendedRole)
  const setCurrentPath = usePathStore((state) => state.setCurrentPath)

  const [answers, setAnswers] = useState<Record<string, string[]>>({
    situation: [],
    age: [],
    'learning-style': [],
  })
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)

  const currentQuestion = questions[questionIndex]
  const isReview = questionIndex >= questions.length
  const progressValue = Math.min(((questionIndex + 1) / (questions.length + 1)) * 100, 100)

    const accessibilitySettings = usePathStore((state) => state.accessibilitySettings)
  const reduceMotion = accessibilitySettings.reduceMotion
  const sortedRoles = useMemo<RoleKey[]>(() => getSortedRoles(answers), [answers])
  const recommendedRoles = useMemo<RoleKey[]>(() => {
    if (sortedRoles.length === 0) {
      return ['student', 'apprentice', 'career-changer']
    }
    return sortedRoles.slice(0, 3)
  }, [sortedRoles])
  const motionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, x: 40 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -40 },
        transition: { duration: 0.32 },
      }

  const handleOptionSelect = (optionId: string) => {
    const question = currentQuestion
    const option = question.options.find((item) => item.id === optionId)

    setAnswers((prev) => {
      const current = prev[question.id] ?? []

      if (!question.multiSelect) {
        return { ...prev, [question.id]: [optionId] }
      }

      if (option && 'isSkip' in option && option.isSkip) {
        // The skip option ("I'm not sure yet" / "None") is exclusive with
        // every other option in this question - tap it again to deselect.
        return { ...prev, [question.id]: current.includes(optionId) ? [] : [optionId] }
      }

      const withoutSkip = current.filter((id) => {
        const opt = question.options.find((item) => item.id === id)
        return !(opt && 'isSkip' in opt && opt.isSkip)
      })
      const next = withoutSkip.includes(optionId)
        ? withoutSkip.filter((id) => id !== optionId)
        : [...withoutSkip, optionId]
      return { ...prev, [question.id]: next }
    })
  }

  const handleNext = () => {
    if (questionIndex < questions.length) {
      setQuestionIndex((prev) => prev + 1)
    }
  }

  const handleSubmit = () => {
    const topRole = selectedRoleId ?? recommendedRoles[0]
    if (!topRole) {
      return
    }

    setAssessmentCompleted(true)
    setMatchedRoles(recommendedRoles)
    setRecommendedRole(topRole)
    setSelectedRole(topRole)
    setCurrentPath('education')
    navigate('/subjects')
  }

  const canProceed =
    isReview ||
    currentQuestion.optional ||
    (answers[currentQuestion.id]?.length ?? 0) > 0

  return (
    <div className="mx-auto w-full max-w-[430px] px-4 py-6 sm:px-0">
      <div className="rounded-[32px] bg-white p-6 shadow-soft pt-12">
        <div className="mb-6">
          <BackButton to="/role" />
        </div>
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-dark">Quick assessment</p>
          <h1 className="mt-3 text-2xl font-bold text-slate-950">Find your path in 60 seconds</h1>
        </div>

        <div className="mb-6 rounded-full bg-slate-100 p-1">
          <div className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary transition-all" style={{ width: `${progressValue}%` }} />
        </div>

        <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
          <span>{isReview ? 'Review' : `Question ${questionIndex + 1} of ${questions.length}`}</span>
          <span>{Math.round(progressValue)}%</span>
        </div>

        <AnimatePresence mode="wait">
          {isReview ? (
            <motion.div key="review" {...motionProps}>
              <div className="space-y-5">
                <div className="rounded-[28px] bg-primary-soft/70 p-5 text-slate-700">
                  <h2 className="text-lg font-semibold text-slate-950">Recommended paths</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    These roles best match your answers so far. Pick one to continue to subject selection.
                  </p>
                </div>

                <div className="space-y-4">
                  {recommendedRoles.map((roleId) => {
                    const role = roleProfiles[roleId]
                    const selected = selectedRoleId === roleId
                    return (
                      <div
                        key={roleId}
                        className={`rounded-[24px] border p-5 transition ${
                          selected ? 'border-primary bg-primary/5 shadow-lg' : 'border-slate-200 bg-white hover:border-primary/50 hover:shadow-md'
                        }`}
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="text-base font-semibold text-slate-900">{role.name}</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">{role.description}</p>
                          </div>
                          <Button
                            variant={selected ? 'primary' : 'secondary'}
                            onClick={() => setSelectedRoleId(roleId)}
                            className="min-w-[148px] justify-center"
                          >
                            {selected ? 'Selected' : 'Select this path'}
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={handleSubmit}
                    className="w-full justify-center transition-all duration-300 hover:scale-[1.02] cursor-pointer sm:w-auto sm:min-w-[220px]"
                  >
                    See my results
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key={currentQuestion.id} {...motionProps}>
              <div className="space-y-5">
                <div>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-primary-dark">
                    {currentQuestion.optional ? 'Optional question' : 'Question'}
                  </p>
                  <h2 className="text-xl font-semibold text-slate-950">{currentQuestion.question}</h2>
                  {currentQuestion.subtitle ? (
                    <p className="mt-1.5 text-sm leading-6 text-slate-500">{currentQuestion.subtitle}</p>
                  ) : null}
                </div>

                <div className="grid gap-3">
                  {currentQuestion.options.map((option) => {
                    const active = (answers[currentQuestion.id] ?? []).includes(option.id)
                    const isSkipOption = 'isSkip' in option && option.isSkip
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleOptionSelect(option.id)}
                        className={`rounded-[24px] border p-4 text-left transition-all duration-300 ${
                          active
                            ? 'border-primary bg-primary/5 shadow-lg'
                            : 'border-slate-200 bg-white hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm'
                        } cursor-pointer`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            {currentQuestion.multiSelect ? (
                              active ? (
                                <CheckSquare className="h-5 w-5 shrink-0 text-primary" />
                              ) : (
                                <Square className="h-5 w-5 shrink-0 text-slate-300" />
                              )
                            ) : null}
                            <div>
                              <span
                                className={`text-sm font-semibold ${isSkipOption ? 'text-slate-500' : 'text-slate-900'}`}
                              >
                                {option.label}
                              </span>
                              {'description' in option && option.description ? (
                                <p className="mt-0.5 text-xs leading-5 text-slate-500">{option.description}</p>
                              ) : null}
                            </div>
                          </div>
                          {!currentQuestion.multiSelect && active ? (
                            <span className="text-sm font-semibold text-primary">✓</span>
                          ) : null}
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed}
                    className="w-full justify-center transition-all duration-300 hover:scale-[1.02] cursor-pointer sm:w-auto sm:min-w-[220px]"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
