import { useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { FolderClock, GitCompare, LogIn, LogOut, Settings2, TrendingUp, X } from 'lucide-react'
import { usePathStore } from './store/usePathStore'
import { useAuthStore } from './store/useAuthStore'
import { useCompareStore } from './store/useCompareStore'
import AccessibilitySettingsPanel from './components/AccessibilitySettingsPanel'
import SearchResultsPage from './pages/SearchResultsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import SharedPathwayPage from './pages/SharedPathwayPage'
import MyPathwaysPage from './pages/MyPathwaysPage'
import ComparePage from './pages/ComparePage'
import JobMarketPage from './pages/JobMarketPage'
import LoadingPage from './pages/LoadingPage'
import QuickAssessmentPage from './pages/QuickAssessmentPage'
import RoleSelectionPage from './pages/RoleSelectionPage'
import CareerChangerCurrentRolePage from './pages/CareerChangerCurrentRolePage'
import CareerChangerPreferencesPage from './pages/CareerChangerPreferencesPage'
import CareerChangerResultsPage from './pages/CareerChangerResultsPage'
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
  const compareCount = useCompareStore((state) => state.careerIds.length)
  const appClassName = `min-h-screen ${accessibilitySettings.darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#E0E7FF] text-slate-900'}`
  const isHome = location.pathname === '/'
  const isFullBleed = isHome
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [showAccessibility, setShowAccessibility] = useState(false)

  // Client-side routing never touches window scroll on its own - every new
  // page just renders wherever the old page happened to leave the
  // scrollbar. Force every navigation to start at the top.
  useEffect(() => {
    window.scrollTo(0, 0)
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
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-800 dark:text-primary-light dark:ring-slate-700"
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
        <Routes>
          <Route path="/" element={<LoadingPage />} />
          <Route path="/assessment" element={<QuickAssessmentPage />} />
          <Route path="/role" element={<RoleSelectionPage />} />
          <Route path="/career-changer/current-role" element={<CareerChangerCurrentRolePage />} />
          <Route path="/career-changer/preferences" element={<CareerChangerPreferencesPage />} />
          <Route path="/career-changer/results" element={<CareerChangerResultsPage />} />
          <Route path="/subjects" element={<SubjectSelectionPage />} />
          <Route path="/subjects/refugee-asylum-seeker" element={<RefugeeWelcomePage />} />
          <Route path="/subjects/refugee-asylum-seeker/levels" element={<RefugeeSubjectLevelsPage />} />
          <Route path="/subjects/refugee-asylum-seeker/:subpage" element={<RefugeeSubjectPage />} />
          <Route path="/subjects/disabled-learner" element={<DisabledWelcomePage />} />
          <Route path="/subjects/disabled-learner/support" element={<DisabledSupportNeedsPage />} />
          <Route path="/subjects/tlevel" element={<TLevelSubjectPage />} />
          <Route path="/subjects/:level" element={<SubjectDetailPage />} />
          <Route path="/refugee/esol" element={<ESOLSubjectPage />} />
          <Route path="/refugee/recognition" element={<QualificationRecognitionPage />} />
          <Route path="/results" element={<ResultPage />} />
          <Route path="/career/:id" element={<CareerDetailPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/backtrack/categories" element={<BacktrackCategoriesPage />} />
          <Route path="/backtrack/careers/:category" element={<BacktrackCareersListPage />} />
          <Route path="/backtrack/pathway/:careerId" element={<BacktrackPathwayOverviewPage />} />
          <Route path="/backtrack/options/:careerId" element={<BacktrackPathwayOptionsPage />} />
          <Route path="/backtrack/subjects/:careerId/:pathway" element={<BacktrackSubjectSelectionPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/pathway/:id" element={<SharedPathwayPage />} />
          <Route path="/my-pathways" element={<MyPathwaysPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/job-market" element={<JobMarketPage />} />
        </Routes>
      </MobileContainer>
    </div>
  )
}

export default App
