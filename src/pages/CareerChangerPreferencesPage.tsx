import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { usePathStore } from '../store/usePathStore'
import BackButton from '../components/BackButton'
import PageHeader from '../components/PageHeader'

const questions = [
  {
    id: 'workLocation',
    question: 'Where do you want to work?',
    options: [
      { id: 'office', label: 'In an office / workplace' },
      { id: 'remote', label: 'From home / remotely' },
      { id: 'hybrid', label: 'A mix of both (hybrid)' },
      { id: 'all', label: 'All of the above' },
      { id: 'not-sure', label: 'Not sure' },
    ],
  },
  {
    id: 'workStyle',
    question: 'What kind of work do you prefer?',
    options: [
      { id: 'hands-on', label: 'Hands-on / practical work' },
      { id: 'digital', label: 'Digital / screen-based work' },
      { id: 'mix', label: 'A mix of both' },
      { id: 'all', label: 'All of the above' },
      { id: 'not-sure', label: 'Not sure' },
    ],
  },
  {
    id: 'problemSolving',
    question: 'How do you like to solve problems?',
    options: [
      { id: 'people', label: 'Working with people (teams, customers, patients)' },
      { id: 'data', label: 'Working with data (numbers, analysis, systems)' },
      { id: 'things', label: 'Working with things (tools, materials, equipment)' },
      { id: 'all', label: 'All of the above' },
      { id: 'not-sure', label: 'Not sure' },
    ],
  },
  {
    id: 'pace',
    question: 'What pace suits you?',
    options: [
      { id: 'fast-paced', label: 'Fast-paced, varied days' },
      { id: 'steady', label: 'Steady, predictable routine' },
      { id: 'project-based', label: 'Project-based, deadlines' },
      { id: 'all', label: 'All of the above' },
      { id: 'not-sure', label: 'Not sure' },
    ],
  },
  {
    id: 'motivation',
    question: 'What motivates you?',
    options: [
      { id: 'helping', label: 'Helping others (care, education, support)' },
      { id: 'building', label: 'Building or creating something' },
      { id: 'earning', label: 'Earning and progressing' },
      { id: 'all', label: 'All of the above' },
      { id: 'not-sure', label: 'Not sure' },
    ],
  },
]

export default function CareerChangerPreferencesPage() {
  const navigate = useNavigate()
  const currentJob = usePathStore((state) => state.currentJob)
  const qualityPreferences = usePathStore((state) => state.qualityPreferences)
  const setQualityPreferenceAnswer = usePathStore((state) => state.setQualityPreferenceAnswer)
  const reduceMotion = usePathStore((state) => state.accessibilitySettings.reduceMotion)

  const [questionIndex, setQuestionIndex] = useState(0)

  // currentJob is set either by the job-button grid or by SearchBar2 (see
  // usePathStore.ts) - either way, getting here without it means someone
  // jumped straight to this URL. Send them back to pick one first.
  useEffect(() => {
    if (!currentJob) {
      navigate('/career-changer/current-role', { replace: true })
    }
  }, [currentJob, navigate])

  if (!currentJob) return null

  const currentQuestion = questions[questionIndex]
  const progressValue = ((questionIndex + 1) / questions.length) * 100

  const handleAnswer = (answerId: string) => {
    setQualityPreferenceAnswer(currentQuestion.id, answerId)
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((prev) => prev + 1)
    } else {
      navigate('/career-changer/results')
    }
  }

  const motionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, x: 40 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -40 },
        transition: { duration: 0.32 },
      }

  return (
    <div className="mx-auto w-full max-w-[560px] space-y-6 px-4 py-6 sm:px-0">
      <BackButton to="/career-changer/current-role" />

      <PageHeader
        title="What matters in your next career?"
        subtitle="Pick what sounds like you. 'Not sure' is fine."
      />

      <div className="rounded-full bg-slate-100 p-1 dark:bg-slate-800">
        <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${progressValue}%` }} />
      </div>
      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <span>Question {questionIndex + 1} of {questions.length}</span>
        <span>{Math.round(progressValue)}%</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentQuestion.id} {...motionProps}>
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-slate-950 dark:text-slate-50">{currentQuestion.question}</h2>

            <div className="grid gap-3">
              {currentQuestion.options.map((option) => {
                const active = qualityPreferences[currentQuestion.id] === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleAnswer(option.id)}
                    className={`rounded-2xl border p-4 text-left transition-all duration-200 ${
                      active
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{option.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
