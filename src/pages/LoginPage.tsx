import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import Logo from '../components/Logo'
import { useAuthStore } from '../store/useAuthStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const signIn = useAuthStore((state) => state.signIn)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    setError(null)
    const result = await signIn(email, password)
    setIsSubmitting(false)
    if (!result.success) {
      setError(result.error ?? 'Something went wrong.')
      return
    }
    navigate('/')
  }

  return (
    <div className="mx-auto w-full max-w-[430px] px-4 py-6 sm:px-0">
      <div className="space-y-6 rounded-xl bg-white p-6 pt-12 shadow-soft dark:bg-slate-800">
        <div className="flex justify-center">
          <Logo size="sm" />
        </div>
        <BackButton to="/" />

        <div>
          <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-50">Sign in</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Email</span>
            <input
              // text, not "email" - Supabase Auth itself validates and
              // returns a clear error for a malformed address, so this
              // doesn't need the browser's own type="email" gate in front
              // of it too.
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
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Password</span>
              <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:text-primary-dark dark:text-primary-light">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </label>

          {error ? <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p> : null}

          <Button type="submit" disabled={isSubmitting} className="w-full justify-center">
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <div className="space-y-3 text-center text-sm">
          <p className="text-slate-600 dark:text-slate-300">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-primary hover:text-primary-dark dark:text-primary-light">
              Sign up
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
