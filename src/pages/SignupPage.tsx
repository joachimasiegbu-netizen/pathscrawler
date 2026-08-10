import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import Logo from '../components/Logo'
import { useAuthStore } from '../store/useAuthStore'

export default function SignupPage() {
  const navigate = useNavigate()
  const signUp = useAuthStore((state) => state.signUp)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    const result = signUp(email, password)
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
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-dark dark:text-primary-light">Get started</p>
          <h1 className="mt-3 text-2xl font-bold text-slate-950 dark:text-slate-50">Create an account</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            This is a demo sign-up stored only in this browser - not a real account system yet.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Email</span>
            <input
              type="email"
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

          {error ? <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p> : null}

          <Button type="submit" className="w-full justify-center">
            Create account
          </Button>
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
