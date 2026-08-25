import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import Logo from '../components/Logo'
import { useAuthStore } from '../store/useAuthStore'

// Step one of the reset flow: collect the email, trigger Supabase's own
// reset email. Step two (ResetPasswordPage.tsx) is a separate page/route,
// since it only exists to be landed on FROM that emailed link.
export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const requestPasswordReset = useAuthStore((state) => state.requestPasswordReset)
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    setError(null)
    const result = await requestPasswordReset(email)
    setIsSubmitting(false)
    if (!result.success) {
      setError(result.error ?? 'Something went wrong.')
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="mx-auto w-full max-w-[430px] px-4 py-6 sm:px-0">
        <div className="space-y-5 rounded-xl bg-white p-6 pt-12 text-center shadow-soft dark:bg-slate-800">
          <div className="flex justify-center">
            <Logo size="sm" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-950 dark:text-slate-50">Check your email</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              If an account exists for <span className="font-semibold">{email}</span>, we've sent a link to reset its
              password. Click it to choose a new one.
            </p>
          </div>
          <Button onClick={() => navigate('/login')} className="w-full justify-center">
            Back to sign in
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
        <BackButton to="/login" label="Sign in" />

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-dark dark:text-primary-light">
            Reset password
          </p>
          <h1 className="mt-3 text-2xl font-bold text-slate-950 dark:text-slate-50">Forgot your password?</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Enter your email and we'll send you a link to set a new one.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Email</span>
            <input
              type="text"
              inputMode="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </label>

          {error ? <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p> : null}

          <Button type="submit" disabled={isSubmitting} className="w-full justify-center">
            {isSubmitting ? 'Sending…' : 'Send reset link'}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-600 dark:text-slate-300">
          Remembered it?{' '}
          <Link to="/login" className="font-semibold text-primary hover:text-primary-dark dark:text-primary-light">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
