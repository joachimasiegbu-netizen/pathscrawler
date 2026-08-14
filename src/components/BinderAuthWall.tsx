import { Lock } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import BackButton from './BackButton'
import Button from './Button'

// Shown at /binder instead of the real page whenever no one is signed in -
// MyBinderPage never renders the empty-binder state, stats panel, or grid
// to an anonymous visitor, only this. Plain app background/card styling
// (matching LoginPage), not the dark binder-texture page - a signed-out
// visitor shouldn't see any binder-specific chrome at all.
export default function BinderAuthWall() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:px-0">
      <BackButton to="/job-market" label="Job Market" />

      <div className="mt-6 space-y-5 rounded-2xl bg-white p-8 text-center shadow-soft dark:bg-slate-800">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft/60 text-primary dark:bg-primary/15 dark:text-primary-light">
          <Lock className="h-6 w-6" aria-hidden="true" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-slate-950 dark:text-slate-50">Sign in to access your Binder</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Your Career Binder is where you collect and organize careers from Roll a Job. Sign in or create an
            account to start building your collection.
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
