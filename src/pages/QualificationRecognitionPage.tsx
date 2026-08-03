import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import Card from '../components/Card'
import { usePathStore } from '../store/usePathStore'

const qualificationOptions = ['High School', "Bachelor's", "Master's", 'Vocational', 'Professional', 'Other']

const countryOptions = ['Afghanistan', 'Syria', 'Iraq', 'Iran', 'Eritrea', 'Somalia', 'Pakistan', 'Other']

export default function QualificationRecognitionPage() {
  const navigate = useNavigate()
  const setPreviousQualifications = usePathStore((s) => s.setPreviousQualifications)

  const [qualification, setQualification] = useState<string | null>(null)
  const [country, setCountry] = useState<string | null>(null)

  const equivalence = useMemo(() => {
    if (!qualification) return null
    if (qualification === 'High School') return { text: "High School ≈ UK GCSEs / A-Levels", route: '/subjects/gcse' }
    if (qualification === "Bachelor's") return { text: "Bachelor's ≈ UK Bachelor's degree", route: '/subjects/university' }
    if (qualification === "Master's") return { text: "Master's ≈ UK Master's degree", route: '/subjects/university' }
    if (qualification === 'Vocational' || qualification === 'Professional') return { text: `${qualification} ≈ UK vocational qualifications`, route: '/subjects/vocational' }
    return { text: "We'll suggest appropriate UK pathways", route: '/subjects' }
  }, [qualification])

  const continueAction = () => {
    if (!qualification || !country) return
    setPreviousQualifications({ country, level: qualification })
    if (equivalence) {
      navigate(equivalence.route)
    } else {
      navigate('/subjects')
    }
  }

  return (
    <div className="space-y-6 pt-8 px-6 pb-8 sm:px-8">
      <div className="space-y-4">
        <BackButton to="/subjects/refugee-asylum-seeker" />
        <div>
          <h2 className="text-3xl font-bold text-slate-950">Tell us about your qualifications</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">We'll suggest UK equivalent pathways based on your answers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <div className="mb-2 text-sm font-semibold text-slate-700">What is your highest qualification?</div>
          <select value={qualification ?? ''} onChange={(e) => setQualification(e.target.value || null)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none">
            <option value="">Select</option>
            {qualificationOptions.map((q) => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <div className="mb-2 text-sm font-semibold text-slate-700">Which country did you study in?</div>
          <select value={country ?? ''} onChange={(e) => setCountry(e.target.value || null)} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none">
            <option value="">Select country</option>
            {countryOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <Card title="How this helps" description="We'll suggest UK equivalent pathways based on your answers"> 
          <div className="mt-2 text-sm text-slate-600">Examples:</div>
          <ul className="mt-3 list-disc pl-5 text-sm text-slate-600 space-y-2">
            <li>Bachelor's from Syria ≈ UK Bachelor's degree → University subjects</li>
            <li>High School from Afghanistan ≈ UK GCSEs → GCSE/A-Level subjects</li>
          </ul>
        </Card>
      </div>

      {equivalence ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">{equivalence.text}</div>
      ) : null}

      <div className="pt-4">
        <Button onClick={continueAction} disabled={!qualification || !country} className="w-full">Continue</Button>
      </div>
    </div>
  )
}
