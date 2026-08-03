import { useMemo } from 'react'
import { ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import Card from '../components/Card'
import { usePathStore } from '../store/usePathStore'

const providers = [
  { name: 'British Council', description: "Learn English with the world's English experts. Online and face-to-face courses.", url: 'https://www.britishcouncil.org/english' },
  { name: 'ESOL Entry (UK Government)', description: 'Free English courses for speakers of other languages at local colleges.', url: 'https://www.gov.uk/guidance/english-for-speakers-of-other-languages-esol' },
  { name: 'OpenLearn (The Open University)', description: 'Free online English language courses at all levels.', url: 'https://www.open.edu/openlearn/languages' },
  { name: 'BBC Learning English', description: 'Free online English lessons, videos, and quizzes for all levels.', url: 'https://www.bbc.co.uk/learningenglish' },
  { name: 'FutureLearn', description: 'Online English courses from top universities and institutions.', url: 'https://www.futurelearn.com/subjects/english-language-courses' },
  { name: 'Coursera', description: 'English for career development and academic study from global universities.', url: 'https://www.coursera.org/browse/language-learning/learning-english' },
  { name: 'Duolingo', description: 'Free app-based English learning with gamified lessons.', url: 'https://www.duolingo.com/course/en/en/Learn-English' },
  { name: 'Cambridge English', description: 'Official Cambridge English preparation and testing resources.', url: 'https://www.cambridgeenglish.org/learning-english/' },
  { name: 'IELTS Official', description: 'Free IELTS preparation materials and practice tests.', url: 'https://www.ielts.org/for-test-takers/prepare' },
  { name: 'UK ENIC', description: 'Information on English language requirements for UK study and work.', url: 'https://www.enic.org.uk/' },
]

export default function ESOLSubjectPage() {
  const navigate = useNavigate()

  const openAssessment = () => {
    navigate('/assessment')
  }

  return (
    <div className="space-y-6 pt-8 px-6 pb-8 sm:px-8">
      <div className="space-y-4">
        <BackButton to="/subjects/refugee-asylum-seeker" />
        <div>
          <h2 className="text-3xl font-bold text-slate-950">ESOL & English Language Resources</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Trusted places to learn and improve your English</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {providers.map((p) => (
          <div key={p.name} className="rounded-xl bg-white p-5 shadow-soft">
            <div className="mb-3">
              <h3 className="text-base font-semibold text-slate-900">{p.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{p.description}</p>
            </div>
            <div>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                <span className="text-primary">Visit website</span>
                <ExternalLink className="h-4 w-4 text-primary" />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4">
        <Button onClick={openAssessment} className="w-full">I've improved my English — continue</Button>
      </div>
    </div>
  )
}
