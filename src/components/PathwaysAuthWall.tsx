import { Lock } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import BackButton from './BackButton'
import Button from './Button'

// Shown at /my-pathways instead of the real page whenever no one is signed
// in - MyPathwaysPage never renders its empty-state or grid to an
// anonymous visitor, only this. Mirrors BinderAuthWall exactly (same
// account-gating reasoning as the Binder), just worded for pathways -
// kept as its own small component rather than a shared generic one so
// each can keep copy specific to its own feature without a props API to
// thread through it.
export default function PathwaysAuthWall() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:px-0">
      <BackButton to="/job-market" label="Job Market" />

      <div className="mt-6 space-y-5 rounded-2xl bg-white p-8 text-center shadow-soft dark:bg-slate-800">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft/60 text-primary dark:bg-primary/15 dark:text-primary-light">
          <Lock className="h-6 w-6" aria-hidden="true" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-slate-950 dark:text-slate-50">Sign in to access your saved pathways</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            My saved pathways is where careers you've bookmarked with "Save pathway" live. Sign in or create an
            account to start saving.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 pt-1 sm:flex-row">
          <Button onClick={() => navigate('/login')} className="flex-1 justify-center">
            Sign In
          </Button>
          <Button variant="secondary" onClick={() => navigate('/signup')} className="flex-1 justify-center">
            Create Account
          </Button>
        </div>

        <p className="pt-1 text-xs text-slate-500 dark:text-slate-400">
          No account?{' '}
          <Link to="/job-market" className="font-semibold text-primary hover:text-primary-dark dark:text-primary-light">
            You can still explore careers without signing in.
          </Link>
        </p>
      </div>
    </div>
  )
}
