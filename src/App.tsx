import { AnimatePresence, motion } from 'framer-motion'
import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useRoutes } from 'react-router-dom'
import type { ReactNode } from 'react'
import { FolderClock, GitCompare, LogIn, LogOut, Settings2, TrendingUp, X } from 'lucide-react'
import { usePathStore } from './store/usePathStore'
import { useAuthStore } from './store/useAuthStore'
import { useCompareStore } from './store/useCompareStore'
import AccessibilitySettingsPanel from './components/AccessibilitySettingsPanel'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import SharedPathwayPage from './pages/SharedPathwayPage'
import MyPathwaysPage from './pages/MyPathwaysPage'
import ComparePage from './pages/ComparePage'
import JobMarketPage from './pages/JobMarketPage'
import LoadingPage from './pages/LoadingPage'
import QuickAssessmentPage from './pages/QuickAssessmentPage'
import RoleSelectionPage from './pages/RoleSelectionPage'
import SubjectSelectionPage from './pages/SubjectSelectionPage'
import SubjectDetailPage from './pages/SubjectDetailPage'
import RefugeeWelcomePage from './pages/RefugeeWelcomePage'
import RefugeeSubjectLevelsPage from './pages/RefugeeSubjectLevelsPage'
import RefugeeSubjectPage from './pages/RefugeeSubjectPage'
import TLevelSubjectPage from './pages/TLevelSubjectPage'
import ResultPage from './pages/ResultPage'
import CareerDetailPage from './pages/CareerDetailPage'
import ESOLSubjectPage from './pages/ESOLSubjectPage'
import QualificationRecognitionPage from './pages/QualificationRecognitionPage'
import DisabledWelcomePage from './pages/DisabledWelcomePage'
import DisabledSupportNeedsPage from './pages/DisabledSupportNeedsPage'
import BacktrackWelcomePage from './pages/BacktrackWelcomePage'
import BacktrackCategoriesPage from './pages/BacktrackCategoriesPage'
import BacktrackCareersListPage from './pages/BacktrackCareersListPage'
import BacktrackPathwayOverviewPage from './pages/BacktrackPathwayOverviewPage'
import BacktrackPathwayOptionsPage from './pages/BacktrackPathwayOptionsPage'
import BacktrackSubjectSelectionPage from './pages/BacktrackSubjectSelectionPage'
import MobileContainer from './components/MobileContainer'

// A plain array of {path, element} rather than JSX <Routes>/<Route> - so
// AnimatePresence's direct child below can be the single PageTransition
// motion.div this resolves to (a real forwardRef component), instead of
// <Routes> itself (a plain function component, which threw "function
// components cannot be given refs" the one time this used mode="popLayout").
const routes = [
  { path: '/', element: <LoadingPage /> },
  { path: '/assessment', element: <QuickAssessmentPage /> },
  { path: '/role', element: <RoleSelectionPage /> },
  { path: '/subjects', element: <SubjectSelectionPage /> },
  { path: '/subjects/refugee-asylum-seeker', element: <RefugeeWelcomePage /> },
  { path: '/subjects/refugee-asylum-seeker/levels', element: <RefugeeSubjectLevelsPage /> },
  { path: '/subjects/refugee-asylum-seeker/:subpage', element: <RefugeeSubjectPage /> },
  { path: '/subjects/disabled-learner', element: <DisabledWelcomePage /> },
  { path: '/subjects/disabled-learner/support', element: <DisabledSupportNeedsPage /> },
  { path: '/subjects/tlevel', element: <TLevelSubjectPage /> },
  { path: '/subjects/:level', element: <SubjectDetailPage /> },
  { path: '/refugee/esol', element: <ESOLSubjectPage /> },
  { path: '/refugee/recognition', element: <QualificationRecognitionPage /> },
  { path: '/results', element: <ResultPage /> },
  { path: '/career/:id', element: <CareerDetailPage /> },
  { path: '/backtrack', element: <BacktrackWelcomePage /> },
  { path: '/backtrack/categories', element: <BacktrackCategoriesPage /> },
  { path: '/backtrack/careers/:category', element: <BacktrackCareersListPage /> },
  { path: '/backtrack/pathway/:careerId', element: <BacktrackPathwayOverviewPage /> },
  { path: '/backtrack/options/:careerId', element: <BacktrackPathwayOptionsPage /> },
  { path: '/backtrack/subjects/:careerId/:pathway', element: <BacktrackSubjectSelectionPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/pathway/:id', element: <SharedPathwayPage /> },
  { path: '/my-pathways', element: <MyPathwaysPage /> },
  { path: '/compare', element: <ComparePage /> },
  { path: '/job-market', element: <JobMarketPage /> },
]

// '/' and '/role' are the only two routes that get the dedicated intro
// treatment; everything else keeps the plain fade.
function introKeyForPath(pathname: string): 'loading' | 'role' | undefined {
  if (pathname === '/') return 'loading'
  if (pathname === '/role') return 'role'
  return undefined
}

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const routeElement = useRoutes(routes, location)
  const { accessibilitySettings } = usePathStore()
  const reset = usePathStore((state) => state.reset)
  const currentUser = useAuthStore((state) => state.currentUser)
  const signOut = useAuthStore((state) => state.signOut)
  const compareCount = useCompareStore((state) => state.careerIds.length)
  const reduceMotion = accessibilitySettings.reduceMotion
  const appClassName = `min-h-screen ${accessibilitySettings.darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#E0E7FF] text-slate-900'}`
  const isHome = location.pathname === '/'
  // The backtrack welcome screen is a full-viewport CTA page like home -
  // it needs to touch every edge (no boxed max-w-5xl container, no
  // persistent top nav bar), so it opts into the same full-bleed treatment.
  const isFullBleed = isHome || location.pathname === '/backtrack'
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [showAccessibility, setShowAccessibility] = useState(false)

  // Loading -> Role Selection gets a dedicated fade+scale "opening up" intro
  // instead of the standard fade. It's one-directional on purpose - Loading
  // is the app's entry point, not a screen you navigate back to, so going
  // the other way (or anywhere else) just uses the plain fade below.
  //
  // This is "adjusting state during render" (React's own recommended
  // pattern for deriving state from a changed prop) rather than a
  // useEffect/useRef combo - it has to be, because App re-renders for lots
  // of unrelated reasons mid-transition (e.g. a destination page's mount
  // effect writing to the shared Zustand store), and anything that
  // recomputes the *previous* pathname as a side effect of rendering
  // (a ref mutated inside useMemo, say) breaks under StrictMode's
  // deliberate double-invocation of render-phase code - the extra
  // throwaway call advances "previous" a render early, so the real pass
  // always finds prev === current and reports 'fade'. Storing prevPathname
  // in state and only updating it via the guarded setState-in-render below
  // sidesteps that entirely: idempotent, safe to double-invoke, no stale
  // ref tricks.
  const [prevPathname, setPrevPathname] = useState(location.pathname)
  const [transitionKind, setTransitionKind] = useState<TransitionKind>('fade')
  if (location.pathname !== prevPathname) {
    const kind: TransitionKind = prevPathname === '/' && location.pathname === '/role' ? 'loading-to-role' : 'fade'
    setTransitionKind(kind)
    setPrevPathname(location.pathname)
  }

  // Client-side routing never touches window scroll on its own - the new
  // page's content just renders wherever the old page happened to leave the
  // scrollbar, which is how "Explore more" on a Results card could land on
  // Career Detail scrolled to its (shorter) bottom instead of its top.
  //
  // The obvious fix - scroll to top on PUSH, restore on POP (browser
  // back/forward) - doesn't fit how this app actually navigates: every
  // "Back" affordance here (BackButton, "Back to results") deliberately
  // calls navigate('/some-known-path') rather than navigate(-1)/history
  // back, precisely so "back" is a predictable trip to the page's logical
  // parent regardless of how the user actually arrived (deep link, shared
  // pathway, mid-flow jump) - navigate(-1) would risk leaving the app
  // entirely if there's no in-app history to pop. That means every one of
  // those "back" navigations is a PUSH, not a POP, so a POP-only restore
  // would never fire for them.
  //
  // So this keys off *pathname* instead: every page's scroll position is
  // remembered on the way out (cheap - one map entry per path), but only
  // Results reads its memory back on the way in. Every other destination,
  // including Career Detail, always starts at the top - even on a repeat
  // visit - which is what "Explore more" needs.
  const scrollPositions = useRef(new Map<string, number>())
  useLayoutEffect(() => {
    const pathname = location.pathname
    if (pathname === '/results' && scrollPositions.current.has(pathname)) {
      window.scrollTo(0, scrollPositions.current.get(pathname)!)
    } else {
      window.scrollTo(0, 0)
    }

    return () => {
      scrollPositions.current.set(pathname, window.scrollY)
    }
  }, [location.pathname])

  useEffect(() => {
    setShowAccountMenu(false)
  }, [location.pathname])

  useEffect(() => {
    const html = document.documentElement
    html.classList.toggle('reduce-motion', accessibilitySettings.reduceMotion)
    html.classList.toggle('high-contrast', accessibilitySettings.highContrast)
    html.classList.toggle('larger-text', accessibilitySettings.largerText)
    html.classList.toggle('dyslexia-font', accessibilitySettings.dyslexiaFont)
    html.classList.toggle('dark-mode', accessibilitySettings.darkMode)

    // force immediate body color mode for dark mode
    document.body.classList.toggle('dark-mode', accessibilitySettings.darkMode)
  }, [accessibilitySettings])

  return (
    <div className={appClassName}>
      <MobileContainer fullBleed={isFullBleed}>
        {!isFullBleed ? (
          <div className="flex items-center justify-between gap-3 px-4 pt-3 sm:px-6">
            <button
              type="button"
              onClick={() => {
                reset()
                navigate('/')
              }}
              aria-label="PathScrawler home"
              className="text-lg font-bold tracking-tight text-primary transition hover:text-primary-dark dark:text-primary-light dark:hover:text-white"
            >
              PathScrawler
            </button>

            <div className="flex items-center gap-3">
            {compareCount > 0 ? (
              <button
                type="button"
                onClick={() => navigate('/compare')}
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-soft/40 px-4 py-2 text-sm font-semibold text-primary-dark shadow-sm transition hover:bg-primary-soft/70 dark:border-primary/50 dark:bg-primary/10 dark:text-primary-light dark:hover:bg-primary/20"
              >
                <GitCompare className="h-4 w-4" />
                Compare ({compareCount})
              </button>
            ) : null}
            {location.pathname === '/job-market' ? null : (
              <button
                type="button"
                onClick={() => navigate('/job-market')}
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-soft/40 px-4 py-2 text-sm font-semibold text-primary-dark shadow-sm transition hover:bg-primary-soft/70 dark:border-primary/50 dark:bg-primary/10 dark:text-primary-light dark:hover:bg-primary/20"
              >
                <TrendingUp className="h-4 w-4" />
                Job Market
              </button>
            )}
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowAccountMenu((value) => !value)}
                  title={`Signed in as ${currentUser.email}`}
                  aria-label={`Account menu for ${currentUser.email}`}
                  aria-expanded={showAccountMenu}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white shadow-lg ring-1 ring-primary-dark/30 transition hover:bg-primary-dark"
                >
                  {currentUser.email.charAt(0).toUpperCase()}
                </button>
                {showAccountMenu ? (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowAccountMenu(false)} />
                    <div className="absolute right-0 top-14 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                      <p className="truncate px-3 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {currentUser.email}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          navigate('/my-pathways')
                          setShowAccountMenu(false)
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                      >
                        <FolderClock className="h-4 w-4" />
                        My saved pathways
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          signOut()
                          setShowAccountMenu(false)
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow-lg ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-800 dark:text-primary-light dark:ring-slate-700"
              >
                <LogIn className="h-4 w-4" />
                Sign in
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowAccessibility(true)}
              aria-label="Open accessibility settings"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-800 dark:text-sky-200 dark:ring-slate-700 dark:hover:bg-slate-700"
            >
              <Settings2 className="h-6 w-6 text-primary" />
            </button>
            </div>
          </div>
        ) : null}
        {showAccessibility ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6 sm:px-6">
            <div className="relative w-full max-w-2xl">
              <button
                type="button"
                onClick={() => setShowAccessibility(false)}
                className="absolute right-5 top-5 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-200 transition hover:bg-slate-700"
                aria-label="Close accessibility settings"
              >
                <X className="h-5 w-5" />
              </button>
              <AccessibilitySettingsPanel />
            </div>
          </div>
        ) : null}
        <AnimatePresence mode="wait" custom={transitionKind}>
          <PageTransition
            key={location.pathname}
            reduceMotion={reduceMotion}
            introKey={introKeyForPath(location.pathname)}
            custom={transitionKind}
          >
            {routeElement}
          </PageTransition>
        </AnimatePresence>
      </MobileContainer>
    </div>
  )
}

type TransitionKind = 'loading-to-role' | 'fade'

// Loading -> Role Selection gets a fade+scale "opening up" feel instead of
// the standard fade: Loading dissolves and shrinks slightly (opacity 1->0,
// scale 1->0.95) while Role Selection dissolves and grows in (opacity 0->1,
// scale 0.98->1), no directional movement. `introKey` identifies which side
// of that specific pair this route is; every other route omits it and keeps
// the plain fade below.
//
// `initial`/`exit` are variant *functions* here rather than plain objects so
// they can read the active `transitionKind` off AnimatePresence's `custom`
// prop - the only way an exiting page (already unmounted from Routes, no
// longer receiving fresh props) can know it should play the special exit
// rather than the default fade.
interface PageTransitionProps {
  children: React.ReactNode
  reduceMotion: boolean
  introKey?: 'loading' | 'role'
  // Not passed explicitly in JSX - AnimatePresence's `custom` prop clones
  // onto its direct child (this component) automatically. It has to be
  // re-forwarded onto the inner motion.div by hand below, or the variant
  // functions there only ever see `custom=undefined` and silently fall back
  // to the plain fade.
  custom?: TransitionKind
}

// forwardRef because this is AnimatePresence's direct child - AnimatePresence
// wants a ref-forwarding component there (mode="wait" doesn't strictly need
// it, but mode="popLayout" does, and a plain function component can't take
// that ref either way - that's the "function components cannot be given
// refs" warning). Kept forwarding to the underlying div/motion.div so the
// component works under either mode without surprises.
const PageTransition = forwardRef<HTMLDivElement, PageTransitionProps>(function PageTransition(
  { children, reduceMotion, introKey, custom },
  ref,
) {
  if (reduceMotion) {
    return (
      <div ref={ref} className="min-h-[calc(100vh-48px)]">
        {children}
      </div>
    )
  }

  if (introKey) {
    const isIntro = (kind: TransitionKind) => kind === 'loading-to-role'

    const introVariants = {
      initial: (kind: TransitionKind) =>
        introKey === 'role' && isIntro(kind) ? { opacity: 0, scale: 0.98 } : { opacity: 0, y: 10, scale: 1 },
      animate: (kind: TransitionKind) =>
        introKey === 'role' && isIntro(kind)
          ? { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
          : { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25, ease: 'easeOut' } },
      exit: (kind: TransitionKind) =>
        introKey === 'loading' && isIntro(kind)
          ? { opacity: 0, scale: 0.95, transition: { duration: 0.3, ease: 'easeOut' } }
          : { opacity: 0, transition: { duration: 0.15, ease: 'easeOut' } },
    }

    return (
      <motion.div
        ref={ref}
        custom={custom}
        variants={introVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-[calc(100vh-48px)]"
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } }}
      exit={{ opacity: 0, transition: { duration: 0.15, ease: 'easeOut' } }}
      className="min-h-[calc(100vh-48px)]"
    >
      {children}
    </motion.div>
  )
})

export default App
