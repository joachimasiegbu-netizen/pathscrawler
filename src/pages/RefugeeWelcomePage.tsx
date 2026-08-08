import { useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton'
import Button from '../components/Button'

export default function RefugeeWelcomePage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-8 pt-8 px-6 pb-8 sm:px-8">
      <div className="space-y-4 rounded-[28px] bg-white p-8 shadow-soft">
        <BackButton to="/role" />
        <div>
          <h1 className="text-3xl font-bold text-slate-950">New to the UK?</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Explore pathways to build your career, improve your English, and get your qualifications recognised.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-sm font-semibold text-slate-900">ESOL is often your first step</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Improve your English so you can access more courses, work and study opportunities.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-sm font-semibold text-slate-900">Your existing qualifications may be recognised</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Your previous study could count in the UK through qualification recognition services.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Button onClick={() => navigate('/refugee/esol')} className="w-full">
            I need to improve my English first
          </Button>
          <Button onClick={() => navigate('/refugee/recognition')} className="w-full">
            I already have qualifications
          </Button>
        </div>
      </div>
    </div>
  )
}
