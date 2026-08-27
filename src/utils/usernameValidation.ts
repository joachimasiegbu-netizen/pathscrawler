// Username rules for account setup (see UsernameModal.tsx) - pure
// data/logic, no store or Supabase import so it stays trivially testable and
// usable from both the modal's live validation and the store's setUsername.
//
// Format rules (from the spec):
//   - 3-20 characters
//   - letters, numbers, underscores, hyphens, and single spaces only
//   - no leading/trailing spaces, no consecutive spaces
//   - not a reserved word, not digits-only
//   - not on the profanity deny-list
//
// Case-insensitive uniqueness is checked separately against Supabase (see
// isUsernameTaken in useUserProfileStore.ts) - it needs a network round trip
// so it isn't part of this synchronous format check.

/** The one message the spec mandates for a rejected-but-well-formed name
 * (profanity, reserved, digits-only) - deliberately vague so it doesn't
 * confirm which word tripped the filter. */
export const USERNAME_UNAVAILABLE_MESSAGE = "That username isn't available. Try something else."

export const USERNAME_MIN = 3
export const USERNAME_MAX = 20

const RESERVED_WORDS = new Set(['admin', 'support', 'official', 'pathscrawler', 'mod'])

// Common English profanity + slurs, matched against a normalized form of the
// name (lower-cased, separators stripped, a few leetspeak substitutions
// undone) so "b_a_d" / "b4d" don't slip through. Kept intentionally compact -
// a deny-list is a blunt instrument, this covers the obvious cases and the
// server-side check (a Postgres constraint / trigger, or a follow-up edge
// function) is the real backstop.
const PROFANITY = [
  'fuck', 'shit', 'bitch', 'cunt', 'asshole', 'bastard', 'dick', 'piss',
  'slut', 'whore', 'nigger', 'nigga', 'faggot', 'fag', 'retard', 'spic',
  'chink', 'kike', 'coon', 'wetback', 'tranny', 'rape', 'rapist', 'nazi',
  'pedo', 'paedo', 'molest', 'kkk',
]

function normalizeForProfanity(value: string): string {
  return value
    .toLowerCase()
    .replace(/[\s_\-.]/g, '')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/0/g, 'o')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/@/g, 'a')
    .replace(/\$/g, 's')
}

export interface UsernameCheck {
  valid: boolean
  /** Present only when valid === false. Safe to show verbatim in the UI. */
  error?: string
}

/** Synchronous format + profanity + reserved check. Does NOT check
 * uniqueness (that's async - see isUsernameTaken). */
export function validateUsernameFormat(raw: string): UsernameCheck {
  const name = raw ?? ''

  if (name.length < USERNAME_MIN || name.length > USERNAME_MAX) {
    return { valid: false, error: `Use ${USERNAME_MIN}–${USERNAME_MAX} characters.` }
  }
  if (name !== name.trim()) {
    return { valid: false, error: 'No spaces at the start or end.' }
  }
  if (/ {2,}/.test(name)) {
    return { valid: false, error: 'No double spaces.' }
  }
  if (!/^[A-Za-z0-9_ -]+$/.test(name)) {
    return { valid: false, error: 'Only letters, numbers, spaces, _ and -.' }
  }
  if (/^\d+$/.test(name)) {
    return { valid: false, error: USERNAME_UNAVAILABLE_MESSAGE }
  }
  if (RESERVED_WORDS.has(name.toLowerCase())) {
    return { valid: false, error: USERNAME_UNAVAILABLE_MESSAGE }
  }
  const normalized = normalizeForProfanity(name)
  if (PROFANITY.some((word) => normalized.includes(word))) {
    return { valid: false, error: USERNAME_UNAVAILABLE_MESSAGE }
  }
  return { valid: true }
}

// Assigned when a player skips/closes the setup modal - they still get a
// spot on the leaderboard, just under a generic handle, plus a persistent
// "Set your name" banner nudging them to pick a real one (see
// SetYourNameBanner.tsx).
const FALLBACK_NAMES = [
  'Curious Explorer',
  'New Hire',
  'Trainee #4721',
  'Anonymous Applicant',
  'Prospect #88',
]

export function randomFallbackName(): string {
  return FALLBACK_NAMES[Math.floor(Math.random() * FALLBACK_NAMES.length)]
}

/** True when the given name is one of the generic skip-the-modal fallbacks -
 * used as a redundant check so an older stored profile without the
 * isFallbackName flag still surfaces the "Set your name" banner. */
export function isFallbackName(name: string): boolean {
  return FALLBACK_NAMES.includes(name)
}
