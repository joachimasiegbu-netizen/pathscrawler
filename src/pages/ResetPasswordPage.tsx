import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Button from '../components/Button'
import Logo from '../components/Logo'
import { useAuthStore } from '../store/useAuthStore'

// Landed on FROM the emailed reset link (ForgotPasswordPage.tsx's
// requestPasswordReset -> redirectTo). Supabase's client auto-exchanges the
// link's URL tokens into a real (recovery) session on load - detectSessionInUrl,
// on by default (supabaseClient.ts) - which is what makes currentUser
// non-null below without this page doing anything itself. isLoading gates
// the brief window while that exchange/getSession() round trip is still in
// flight, same pattern BinderAuthWall's own gating uses.
//
// Also reachable by anyone ALREADY signed in who navigates here directly -
// that's fine, not a separate code path to guard against: it just works as
// a "change my password" page for them too, same updateUser() call either
// way.
export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const currentUser = useAuthStore((state) => state.currentUser)
  const isLoading = useAuthStore((state) => state.isLoading)
  const updatePassword = useAuthStore((state) => state.updatePassword)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (isSubmitting) return
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setIsSubmitting(true)
    setError(null)
    const result = await updatePassword(password)
    setIsSubmitting(false)
    if (!result.success) {
      setError(result.error ?? 'Something went wrong.')
      return
    }
    setDone(true)
  }

  if (isLoading) return null

  if (done) {
    return (
      <div className="mx-auto w-full max-w-[430px] px-4 py-6 sm:px-0">
        <div className="space-y-5 rounded-xl bg-white p-6 pt-12 text-center shadow-soft dark:bg-slate-800">
          <div className="flex justify-center">
            <Logo size="sm" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-950 dark:text-slate-50">Password updated</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              You're signed in with your new password.
            </p>
          </div>
          <Button onClick={() => navigate('/')} className="w-full justify-center">
            Continue
          </Button>
        </div>
      </div>
    )
  }

  // No session (recovery or otherwise) - the link was already used, expired
  // (Supabase's default is 1 hour), or this page was reached directly
  // rather than from an emailed link.
  if (!currentUser) {
    return (
      <div className="mx-auto w-full max-w-[430px] px-4 py-6 sm:px-0">
        <div className="space-y-5 rounded-xl bg-white p-6 pt-12 text-center shadow-soft dark:bg-slate-800">
          <div className="flex justify-center">
            <Logo size="sm" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-950 dark:text-slate-50">Link expired or invalid</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              This reset link is no longer valid. Request a fresh one and try again.
            </p>
          </div>
          <Button onClick={() => navigate('/forgot-password')} className="w-full justify-center">
            Request a new link
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

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-dark dark:text-primary-light">
            Reset password
          </p>
          <h1 className="mt-3 text-2xl font-bold text-slate-950 dark:text-slate-50">Choose a new password</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Set a new password for <span className="font-semibold">{currentUser.email}</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">New password</span>
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
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Confirm new password</span>
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

          <Button type="submit" disabled={isSubmitting} className="w-full justify-center">
            {isSubmitting ? 'Updating…' : 'Update password'}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-600 dark:text-slate-300">
          <Link to="/login" className="font-semibold text-primary hover:text-primary-dark dark:text-primary-light">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
