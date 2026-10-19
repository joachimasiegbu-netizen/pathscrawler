import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import Logo from '../components/Logo'
import { useAuthStore } from '../store/useAuthStore'
import { AGE_CHECK_SESSION_KEY, MINIMUM_ACCOUNT_AGE } from '../data/legal'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const THIS_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 100 }, (_, i) => THIS_YEAR - i)

// Month precision: someone born this month counts as having had their
// birthday, so a few days' leeway at most - fine for self-declaration.
function isUnderMinimumAge(month: number, year: number): boolean {
  const now = new Date()
  const ageInMonths = (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month)
  return ageInMonths < MINIMUM_ACCOUNT_AGE * 12
}

// Remembered for the browser session only (see legal.ts), so the age check
// can't simply be re-submitted with a different year straight away.
function failedAgeCheckThisSession(): boolean {
  try {
    return window.sessionStorage.getItem(AGE_CHECK_SESSION_KEY) === 'under-minimum'
  } catch {
    return false
  }
}

export default function SignupPage() {
  const navigate = useNavigate()
  const signUp = useAuthStore((state) => state.signUp)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  // Neutral age question (month + year, cut-off never shown) per the ICO
  // Children's Code - see MINIMUM_ACCOUNT_AGE in legal.ts for the decision.
  // Checked here in the browser only: never stored or sent to Supabase.
  const [birthMonth, setBirthMonth] = useState('')
  const [birthYear, setBirthYear] = useState('')
  const [isUnderAge, setIsUnderAge] = useState(failedAgeCheckThisSession)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Distinct from `error` - a real success outcome (the account was
  // created), just one that isn't "you're signed in now" - shown instead
  // of the form when the Supabase project has email confirmation turned on.
  const [needsConfirmation, setNeedsConfirmation] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (isSubmitting) return
    if (!birthMonth || !birthYear) {
      setError('Please choose the month and year you were born.')
      return
    }
    if (isUnderMinimumAge(Number(birthMonth), Number(birthYear))) {
      try {
        window.sessionStorage.setItem(AGE_CHECK_SESSION_KEY, 'under-minimum')
      } catch {
        // Session storage blocked - the check still applies to this attempt.
      }
      setIsUnderAge(true)
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setIsSubmitting(true)
    setError(null)
    const result = await signUp(email, password)
    setIsSubmitting(false)
    if (!result.success) {
      setError(result.error ?? 'Something went wrong.')
      return
    }
    if (result.needsEmailConfirmation) {
      setNeedsConfirmation(true)
      return
    }
    navigate('/')
  }

  if (isUnderAge) {
    return (
      <div className="mx-auto w-full max-w-[430px] px-4 py-6 sm:px-0">
        <div className="space-y-5 rounded-xl bg-white p-6 pt-12 text-center shadow-soft dark:bg-slate-800">
          <div className="flex justify-center">
            <Logo size="sm" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-950 dark:text-slate-50">You can use PathScrawler without an account</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              You need to be {MINIMUM_ACCOUNT_AGE} or older to create an account. Everything else works without one,
              and your choices are saved on this device.
            </p>
          </div>
          <Button onClick={() => navigate('/')} className="w-full justify-center">
            Continue without an account
          </Button>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <Link to="/privacy#children" className="font-semibold text-primary hover:text-primary-dark dark:text-primary-light">
              How we look after young people's information
            </Link>
          </p>
        </div>
      </div>
    )
  }

  if (needsConfirmation) {
    return (
      <div className="mx-auto w-full max-w-[430px] px-4 py-6 sm:px-0">
        <div className="space-y-5 rounded-xl bg-white p-6 pt-12 text-center shadow-soft dark:bg-slate-800">
          <div className="flex justify-center">
            <Logo size="sm" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-950 dark:text-slate-50">Check your email</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              We've sent a confirmation link to <span className="font-semibold">{email}</span>. Click it, then come
              back and sign in.
            </p>
          </div>
          <Button onClick={() => navigate('/login')} className="w-full justify-center">
            Go to sign in
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[430px] px-4 py-6 sm:px-0">
      <div className="space-y-6 rounded-xl bg-white p-6 pt-12 shadow-soft dark:bg-slate-800">
        <div className="flex justify-center">
          <Logo size="sm" />
        </div>
        <BackButton to="/" />

        <div>
          <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-50">Create an account</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Email</span>
            <input
              // text, not "email" - same reasoning as LoginPage.tsx: Supabase
              // Auth validates the address itself and returns a clear error.
              type="text"
              inputMode="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Password</span>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Confirm password</span>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </label>
          <fieldset>
            <legend className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Date of birth</legend>
            <div className="grid grid-cols-2 gap-3">
              <select
                required
                aria-label="Birth month"
                autoComplete="bday-month"
                value={birthMonth}
                onChange={(event) => setBirthMonth(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                <option value="">Month</option>
                {MONTHS.map((name, i) => (
                  <option key={name} value={i + 1}>
                    {name}
                  </option>
                ))}
              </select>
              <select
                required
                aria-label="Birth year"
                autoComplete="bday-year"
                value={birthYear}
                onChange={(event) => setBirthYear(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                <option value="">Year</option>
                {YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">We use this to check your age. It isn't saved.</p>
          </fieldset>

          {error ? <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p> : null}

          <Button type="submit" disabled={isSubmitting} className="w-full justify-center">
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </Button>
          <p className="text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="font-semibold text-primary underline dark:text-primary-light">
              Terms of use
            </Link>{' '}
            and confirm you've read our{' '}
            <Link to="/privacy" className="font-semibold text-primary underline dark:text-primary-light">
              Privacy policy
            </Link>
            .
          </p>
        </form>

        <div className="space-y-3 text-center text-sm">
          <p className="text-slate-600 dark:text-slate-300">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-primary-dark dark:text-primary-light">
              Sign in
            </Link>
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="font-semibold text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Continue as guest
          </button>
        </div>
      </div>
    </div>
  )
}
