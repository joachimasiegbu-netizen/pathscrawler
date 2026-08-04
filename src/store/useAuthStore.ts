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

interface AuthResult {
  success: boolean
  error?: string
}

interface AuthState {
  currentUser: MockUser | null
  signUp: (email: string, password: string) => AuthResult
  signIn: (email: string, password: string) => AuthResult
  signOut: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
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
        set({ currentUser: user })
        return { success: true }
      },
      signIn: (email, password) => {
        const normalizedEmail = email.trim().toLowerCase()
        const accounts = readAccounts()
        const account = accounts.find((item) => item.email === normalizedEmail)
        if (!account || account.passwordHash !== hashPassword(password)) {
          return { success: false, error: 'Incorrect email or password.' }
        }
        set({ currentUser: { id: account.id, email: account.email } })
        return { success: true }
      },
      signOut: () => set({ currentUser: null }),
    }),
    {
      name: 'pathscrawler-auth-session',
    },
  ),
)
