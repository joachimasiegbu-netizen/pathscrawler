import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Compass, Home, LogIn, LogOut } from 'lucide-react'
import { usePathStore } from './store/usePathStore'
import { useAuthStore } from './store/useAuthStore'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import SharedPathwayPage from './pages/SharedPathwayPage'
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

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const { accessibilitySettings } = usePathStore()
  const reset = usePathStore((state) => state.reset)
  const currentUser = useAuthStore((state) => state.currentUser)
  const signOut = useAuthStore((state) => state.signOut)
  const reduceMotion = accessibilitySettings.reduceMotion
  const appClassName = `min-h-screen ${accessibilitySettings.darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#E0E7FF] text-slate-900'}`
  const isHome = location.pathname === '/'
  const [showAccountMenu, setShowAccountMenu] = useState(false)

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
      <MobileContainer fullBleed={isHome}>
        {!isHome ? (
          <div className="sticky top-0 z-40 flex items-center justify-end gap-3 px-4 pt-3 sm:px-6">
            {location.pathname === '/role' ? (
              <button
                type="button"
                onClick={() => navigate('/backtrack')}
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-soft/40 px-4 py-2 text-sm font-semibold text-primary-dark shadow-sm transition hover:bg-primary-soft/70 dark:border-primary/50 dark:bg-primary/10 dark:text-primary-light dark:hover:bg-primary/20"
              >
                <Compass className="h-4 w-4" />
                How do I get there?
              </button>
            ) : null}
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
              onClick={() => {
                reset()
                navigate('/')
              }}
              aria-label="Restart from home"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary shadow-lg ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-800 dark:text-primary-light dark:ring-slate-700"
            >
              <Home className="h-5 w-5" />
            </button>
          </div>
        ) : null}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition reduceMotion={reduceMotion}><LoadingPage /></PageTransition>} />
            <Route path="/assessment" element={<PageTransition reduceMotion={reduceMotion}><QuickAssessmentPage /></PageTransition>} />
            <Route path="/role" element={<PageTransition reduceMotion={reduceMotion}><RoleSelectionPage /></PageTransition>} />
            <Route path="/subjects" element={<PageTransition reduceMotion={reduceMotion}><SubjectSelectionPage /></PageTransition>} />
            <Route path="/subjects/refugee-asylum-seeker" element={<PageTransition reduceMotion={reduceMotion}><RefugeeWelcomePage /></PageTransition>} />
            <Route path="/subjects/refugee-asylum-seeker/levels" element={<PageTransition reduceMotion={reduceMotion}><RefugeeSubjectLevelsPage /></PageTransition>} />
            <Route path="/subjects/refugee-asylum-seeker/:subpage" element={<PageTransition reduceMotion={reduceMotion}><RefugeeSubjectPage /></PageTransition>} />
            <Route path="/subjects/disabled-learner" element={<PageTransition reduceMotion={reduceMotion}><DisabledWelcomePage /></PageTransition>} />
            <Route path="/subjects/disabled-learner/support" element={<PageTransition reduceMotion={reduceMotion}><DisabledSupportNeedsPage /></PageTransition>} />
            <Route path="/subjects/tlevel" element={<PageTransition reduceMotion={reduceMotion}><TLevelSubjectPage /></PageTransition>} />
            <Route path="/subjects/:level" element={<PageTransition reduceMotion={reduceMotion}><SubjectDetailPage /></PageTransition>} />
            <Route path="/refugee/esol" element={<PageTransition reduceMotion={reduceMotion}><ESOLSubjectPage /></PageTransition>} />
            <Route path="/refugee/recognition" element={<PageTransition reduceMotion={reduceMotion}><QualificationRecognitionPage /></PageTransition>} />
            <Route path="/results" element={<PageTransition reduceMotion={reduceMotion}><ResultPage /></PageTransition>} />
            <Route path="/career/:id" element={<PageTransition reduceMotion={reduceMotion}><CareerDetailPage /></PageTransition>} />
            <Route path="/backtrack" element={<PageTransition reduceMotion={reduceMotion}><BacktrackWelcomePage /></PageTransition>} />
            <Route path="/backtrack/categories" element={<PageTransition reduceMotion={reduceMotion}><BacktrackCategoriesPage /></PageTransition>} />
            <Route path="/backtrack/careers/:category" element={<PageTransition reduceMotion={reduceMotion}><BacktrackCareersListPage /></PageTransition>} />
            <Route path="/backtrack/pathway/:careerId" element={<PageTransition reduceMotion={reduceMotion}><BacktrackPathwayOverviewPage /></PageTransition>} />
            <Route path="/backtrack/options/:careerId" element={<PageTransition reduceMotion={reduceMotion}><BacktrackPathwayOptionsPage /></PageTransition>} />
            <Route path="/backtrack/subjects/:careerId/:pathway" element={<PageTransition reduceMotion={reduceMotion}><BacktrackSubjectSelectionPage /></PageTransition>} />
            <Route path="/login" element={<PageTransition reduceMotion={reduceMotion}><LoginPage /></PageTransition>} />
            <Route path="/signup" element={<PageTransition reduceMotion={reduceMotion}><SignupPage /></PageTransition>} />
            <Route path="/pathway/:encoded" element={<PageTransition reduceMotion={reduceMotion}><SharedPathwayPage /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </MobileContainer>
    </div>
  )
}

function PageTransition({ children, reduceMotion }: { children: React.ReactNode; reduceMotion: boolean }) {
  if (reduceMotion) {
    return <div className="min-h-[calc(100vh-48px)]">{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.32, ease: 'easeOut' }}
      className="min-h-[calc(100vh-48px)]"
    >
      {children}
    </motion.div>
  )
}

export default App
