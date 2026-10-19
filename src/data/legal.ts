// Shared facts for the Privacy policy (/privacy), Terms of use (/terms), the
// device-storage notice and the signup age check - kept in one place so the
// pages can't drift apart from each other or from what the code really does.
// If you add a new localStorage/sessionStorage key anywhere in the app, add
// it to DEVICE_STORAGE below too: the privacy policy promises this list is
// complete.

// TODO before launch: fill these two in. Until then both legal pages show a
// visible "[... to be added]" placeholder so the gap can't go unnoticed. UK
// GDPR requires the controller's identity and contact details in the policy.
export const OPERATOR_NAME = ''
export const CONTACT_EMAIL = ''

export const LEGAL_LAST_UPDATED = '12 October 2026'

export const operatorNameText = () => OPERATOR_NAME || '[operator name to be added]'
export const contactEmailText = () => CONTACT_EMAIL || '[contact email to be added]'

// Minimum age for creating an account - decided 12 October 2026.
//
// 13, the UK age of digital consent (UK GDPR Art. 8 as set by the Data
// Protection Act 2018 s.9). Under 13, an online service relying on consent
// needs verified parental consent, which PathScrawler has no way to collect.
// Accounts are also what put a username, title and quote on the public
// leaderboard, so the age line sits exactly where personal data starts
// leaving the device.
//
// Under-13s can still use everything that doesn't need an account (guest
// mode) - their choices are only ever saved on their own device and never
// sent to us. The app explicitly invites school pupils ("At school, college,
// uni"), so the service is "likely to be accessed by children" and the ICO's
// Age Appropriate Design Code applies to 13-17 year olds who do sign up.
//
// What this means for signup (SignupPage.tsx): a neutral month/year-of-birth
// question that doesn't reveal the cut-off, checked in the browser only and
// never stored or sent anywhere; under-13s get a friendly "use it without an
// account" screen, remembered for the browser session (AGE_CHECK_SESSION_KEY)
// so it can't be retried straight away with a different year.
export const MINIMUM_ACCOUNT_AGE = 13
export const AGE_CHECK_SESSION_KEY = 'pathscrawler-age-check'
export const STORAGE_NOTICE_KEY = 'pathscrawler-storage-notice'

export interface DeviceStorageItem {
  key: string
  where: 'Local storage' | 'Session storage' | 'Local or session storage'
  what: string
  whenSaved: string
}

// Everything PathScrawler itself writes to the user's device. All of it is
// strictly necessary for a feature the user chose to use (or a setting they
// picked), so it needs disclosure under PECR rather than consent. There are
// no analytics, advertising or tracking cookies - keep it that way, or this
// list (and the consent position) has to change.
export const DEVICE_STORAGE: DeviceStorageItem[] = [
  {
    key: 'pathscrawler-storage',
    where: 'Local storage',
    what: 'Your journey so far: the starting point you picked (for example Student or Career Changer), your qualification level and subjects, any support needs you chose, your quick-assessment results, and your accessibility and sound settings.',
    whenSaved: 'As you make choices',
  },
  {
    key: 'pathscrawler-compare-careers',
    where: 'Local storage',
    what: 'The careers you added to Compare.',
    whenSaved: 'When you add a career to Compare',
  },
  {
    key: 'pathscrawler-saved-pathways',
    where: 'Local storage',
    what: 'Pathways you saved. If you are signed in, this is a copy of the ones stored with your account.',
    whenSaved: 'When you save a pathway',
  },
  {
    key: 'pathscrawler-roll',
    where: 'Local storage',
    what: 'Your Roll a Job totals on this device (how many of each tier you have rolled, your best tier) and whether you have seen the Roll a Job tutorial.',
    whenSaved: 'When you roll',
  },
  {
    key: 'pathscrawler-binder',
    where: 'Local storage',
    what: 'Your Career Binder collection, kept separately for each account that signs in on this device. If you are signed in, this is a copy of the Binder stored with your account.',
    whenSaved: 'When you add a card to your Binder',
  },
  {
    key: 'pathscrawler-title-progress',
    where: 'Local storage',
    what: 'Your progress towards Roll a Job titles.',
    whenSaved: 'When you roll',
  },
  {
    key: 'pathscrawler-skill-progress',
    where: 'Local storage',
    what: 'Skills you marked as "learning" or "learned" on the Skills page.',
    whenSaved: 'When you mark a skill',
  },
  {
    key: 'pathscrawler-user-profile',
    where: 'Local storage',
    what: 'A copy of your username, title and quote, so they show straight away without waiting for our server.',
    whenSaved: 'When you are signed in',
  },
  {
    key: 'pathscrawler-remember-me',
    where: 'Local storage',
    what: 'Whether you ticked "Remember me" when signing in.',
    whenSaved: 'When you sign in',
  },
  {
    key: 'sb-…-auth-token',
    where: 'Local or session storage',
    what: 'Keeps you signed in. Saved in local storage if you ticked "Remember me", otherwise in session storage, which your browser deletes when you close it.',
    whenSaved: 'When you sign in',
  },
  {
    key: 'pathscrawler-preview-original-equip',
    where: 'Local storage',
    what: 'Remembers which title you had equipped while you preview a different one, so it can be put back. Deleted when the preview ends.',
    whenSaved: 'When you preview a title',
  },
  {
    key: STORAGE_NOTICE_KEY,
    where: 'Local storage',
    what: 'Remembers that you have seen the notice about device storage, so it doesn\'t keep appearing.',
    whenSaved: 'When you close the notice',
  },
  {
    key: AGE_CHECK_SESSION_KEY,
    where: 'Session storage',
    what: 'Remembers, until you close your browser, that the age check on the sign-up page said you are under 13. It does not store your date of birth.',
    whenSaved: 'Only if the age check says you are under 13',
  },
]
