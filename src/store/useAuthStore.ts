import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// PROTOTYPE AUTH - not secure, not cross-device.
// Accounts and sessions live entirely in this browser's localStorage. There is
// no server, so signing up on one device/browser does not carry over to
// another. This exists so the sign-in/sign-up UX can be built and demoed now;
// swapping in a real provider (e.g. Supabase Auth) later means replacing the
// three functions below with real network calls - the rest of the app only
// ever talks to this store's interface (currentUser/signUp/signIn/signOut).

interface MockUser {
  id: string
  email: string
}

interface StoredAccount extends MockUser {
  passwordHash: string
}

const ACCOUNTS_KEY = 'pathscrawler-mock-accounts'

// Not cryptographically secure - just avoids storing raw plaintext passwords
// in an obviously-readable form. Do not reuse this pattern for anything real.
function hashPassword(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i += 1) {
    hash = (hash << 5) - hash + password.charCodeAt(i)
    hash |= 0
  }
  return `h${hash}`
}

function readAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)
    return raw ? (JSON.parse(raw) as StoredAccount[]) : []
  } catch {
    return []
  }
}

function writeAccounts(accounts: StoredAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

// DEV CONVENIENCE ONLY - seeds a fixed devuser/devword account into this
// browser's mock account list the first time the app loads, so it's always
// available at /login without going through Sign Up first. Gated on
// import.meta.env.DEV, which Vite statically replaces with `false` in
// production builds - this whole block (and the known credential) is dead
// code and gets tree-shaken out of what actually ships/deploys. Idempotent:
// only inserts the account if it isn't already there, so it survives across
// dev-server restarts without duplicating or resetting it.
if (import.meta.env.DEV) {
  const accounts = readAccounts()
  if (!accounts.some((account) => account.email === 'devuser')) {
    writeAccounts([...accounts, { id: 'dev-account', email: 'devuser', passwordHash: hashPassword('devword') }])
  }
}

interface AuthResult {
  success: boolean
  error?: string
}

interface AuthState {
  currentUser: MockUser | null
  // Mirrors `currentUser !== null` as an explicit field (rather than making
  // callers repeat that null-check everywhere) - kept in lockstep with
  // currentUser in every action below, never set independently.
  isAuthenticated: boolean
  /** Alias for currentUser - some call sites (e.g. binder gating) read this name. */
  user: MockUser | null
  signUp: (email: string, password: string) => AuthResult
  signIn: (email: string, password: string) => AuthResult
  signOut: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      isAuthenticated: false,
      user: null,
      signUp: (email, password) => {
        const normalizedEmail = email.trim().toLowerCase()
        if (!normalizedEmail || !password) {
          return { success: false, error: 'Enter an email and password.' }
        }
        if (password.length < 6) {
          return { success: false, error: 'Password must be at least 6 characters.' }
        }
        const accounts = readAccounts()
        if (accounts.some((account) => account.email === normalizedEmail)) {
          return { success: false, error: 'An account with that email already exists.' }
        }
        const user: MockUser = { id: crypto.randomUUID(), email: normalizedEmail }
        accounts.push({ ...user, passwordHash: hashPassword(password) })
        writeAccounts(accounts)
        set({ currentUser: user, user, isAuthenticated: true })
        return { success: true }
      },
      signIn: (email, password) => {
        const normalizedEmail = email.trim().toLowerCase()
        const accounts = readAccounts()
        const account = accounts.find((item) => item.email === normalizedEmail)
        if (!account || account.passwordHash !== hashPassword(password)) {
          return { success: false, error: 'Incorrect email or password.' }
        }
        const user: MockUser = { id: account.id, email: account.email }
        set({ currentUser: user, user, isAuthenticated: true })
        return { success: true }
      },
      signOut: () => set({ currentUser: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'pathscrawler-auth-session',
    },
  ),
)
