import { useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, FolderClock, GitCompare, LogIn, LogOut, Settings2, TrendingUp, Trophy, X } from 'lucide-react'
import { usePathStore } from './store/usePathStore'
import { useAuthStore } from './store/useAuthStore'
import { useCompareStore } from './store/useCompareStore'
import AccessibilitySettingsPanel from './components/AccessibilitySettingsPanel'
import SearchResultsPage from './pages/SearchResultsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import SharedPathwayPage from './pages/SharedPathwayPage'
import MyPathwaysPage from './pages/MyPathwaysPage'
import PathwayFlowPage from './pages/PathwayFlowPage'
import ComparePage from './pages/ComparePage'
import JobMarketPage from './pages/JobMarketPage'
import JobMarketSpotlightPage from './pages/JobMarketSpotlightPage'
import JobMarketStatisticsPage from './pages/JobMarketStatisticsPage'
import JobMarketUkStatsPage from './pages/JobMarketUkStatsPage'
import JobMarketHeritageCraftsPage from './pages/JobMarketHeritageCraftsPage'
import JobMarketHighDemandCareersPage from './pages/JobMarketHighDemandCareersPage'
import JobMarketVanishedJobsPage from './pages/JobMarketVanishedJobsPage'
import JobMarketAiEndangeredJobsPage from './pages/JobMarketAiEndangeredJobsPage'
import JobMarketEasiestPage from './pages/JobMarketEasiestPage'
import JobMarketHighestPayingPage from './pages/JobMarketHighestPayingPage'
import JobMarketRollPage from './pages/JobMarketRollPage'
import LeaderboardPage from './pages/LeaderboardPage'
import MythicRevealPreviewPage from './pages/MythicRevealPreviewPage'
import MyBinderPage from './pages/MyBinderPage'
import BinderComparePage from './pages/BinderComparePage'
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
import CareerPathwayStepperPage from './pages/CareerPathwayStepperPage'
import ESOLSubjectPage from './pages/ESOLSubjectPage'
import QualificationRecognitionPage from './pages/QualificationRecognitionPage'
import DisabledWelcomePage from './pages/DisabledWelcomePage'
import DisabledSupportNeedsPage from './pages/DisabledSupportNeedsPage'
import BacktrackCategoriesPage from './pages/BacktrackCategoriesPage'
import BacktrackCareersListPage from './pages/BacktrackCareersListPage'
import BacktrackPathwayOverviewPage from './pages/BacktrackPathwayOverviewPage'
import BacktrackPathwayOptionsPage from './pages/BacktrackPathwayOptionsPage'
import BacktrackSubjectSelectionPage from './pages/BacktrackSubjectSelectionPage'
import NotFoundPage from './pages/NotFoundPage'
import MobileContainer from './components/MobileContainer'
import Logo from './components/Logo'
import NavGlowOrbs from './components/NavGlowOrbs'

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const { accessibilitySettings } = usePathStore()
  const setAccessibilitySettings = usePathStore((state) => state.setAccessibilitySettings)
  const reset = usePathStore((state) => state.reset)
  const currentUser = useAuthStore((state) => state.currentUser)
  const signOut = useAuthStore((state) => state.signOut)
  const compareCount = useCompareStore((state) => state.selectedCompareCards.length)
  const compareSelectionMode = useCompareStore((state) => state.compareSelectionMode)
  const compareSourcePage = useCompareStore((state) => state.compareSourcePage)
  const exitCompareSelectionMode = useCompareStore((state) => state.exitCompareSelectionMode)
  // Roll a Job lives back inside the Job Market hub as a door tile (see
  // JobMarketPage.tsx) rather than its own nav pill - isRollActive still
  // exists on its own because the page itself needs the dark "game mode"
  // styling below regardless of how you got there, but it no longer needs
  // to be excluded from Job Market's "am I active" check.
  // Leaderboard and the Mythic reveal preview both reuse Roll a Job's same
  // full-bleed dark "game mode" shell (see LeaderboardPage.tsx /
  // MythicRevealPreviewPage.tsx), so they need the exact same header/shell
  // forcing below or they get the light-strip-above-a-dark-page gap the
  // comment just below this describes.
  const isRollActive =
    location.pathname === '/job-market/roll' || location.pathname === '/leaderboard' || location.pathname === '/preview/mythic-reveal'
  const isJobMarketActive = location.pathname.startsWith('/job-market')
  // isRollActive forces the dark look here too, not just accessibilitySettings.darkMode -
  // Roll a Job is a fixed "game mode" dark page (JobMarketRollPage.tsx)
  // regardless of the site's own toggle. Without this, the app SHELL (this
  // outermost div, which every route including the header/back-button row
  // sits on top of) stayed whatever the toggle said - so with the toggle
  // off, a light strip showed through behind the header/back button above
  // the page's own dark full-bleed section, even though that section's
  // dark: utilities were already correctly forced via the header's own
  // dark-mode scoping below. Confirmed via a real rendered screenshot, not
  // eyeballed - this is what that gap turned out to be.
  const appClassName = `min-h-screen transition-colors duration-300 ${accessibilitySettings.darkMode || isRollActive ? 'bg-background-dark text-slate-100' : 'bg-background text-slate-900'}`
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

  // Selection mode is meant to end when you actually finish with it
  // (Cancel, or leaving /compare - see CompareButton/ComparePage), not the
  // instant you navigate anywhere at all - the whole point is surviving the
  // hop from a results page to /compare. But wandering off to some
  // unrelated page mid-selection (clicking a header nav link, the logo,
  // browser back past both pages, ...) should still clean it up rather than
  // leaving gray/circled cards armed in memory for whenever that results
  // page is next visited. "Unrelated" here is just: neither the page that
  // started selection mode, nor /compare itself.
  useEffect(() => {
    if (!compareSelectionMode) return
    // compareSourcePage is pathname+search (see CompareButton) - a page
    // like /search identifies "where I was" by its query string too, not
    // just the route.
    const currentFullPath = location.pathname + location.search
    const onAllowedRoute = currentFullPath === compareSourcePage || location.pathname === '/compare'
    if (!onAllowedRoute) exitCompareSelectionMode()
  }, [location.pathname, location.search, compareSelectionMode, compareSourcePage, exitCompareSelectionMode])

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
      <MobileContainer fullBleed={isFullBleed} forceDarkBg={isRollActive}>
        {!isFullBleed ? (
          // dark-mode: Roll a Job is a fixed "game mode" dark page now
          // (JobMarketRollPage.tsx), regardless of the site's own light/dark
          // toggle - the header needs to visually match that dark backdrop
          // whenever it's showing, not just when the user has actually
          // toggled dark mode. Adding the class here (rather than actually
          // flipping accessibilitySettings.darkMode) reuses every dark:
          // utility already written throughout the header for free, via
          // Tailwind's own `.dark-mode <descendant>` selector strategy - it
          // does NOT touch the user's real persisted preference, so leaving
          // this page puts the header right back to whatever they'd actually
          // chosen. (It only covers genuine `dark:` utility classes, not
          // this file's separate hand-rolled `html.dark-mode .bg-white`-
          // style overrides elsewhere in index.css, which specifically
          // require the real <html> element - the header doesn't lean on
          // those, so that's not a gap in practice.)
          <div className={`flex items-center justify-between gap-3 px-4 pt-3 sm:px-6 ${isRollActive ? 'dark-mode' : ''}`}>
            <button
              type="button"
              onClick={() => {
                reset()
                navigate('/')
              }}
              aria-label="PathScrawler home"
              className="shrink-0 rounded-lg transition hover:opacity-80"
            >
              {/* Full lockup by default (desktop and tablet both keep the
                  wordmark) - icon-only kicks in below 480px, a true last
                  resort for phones too narrow to fit "PathScrawler" next to
                  the nav cluster on the right. That cutoff was 380px before
                  this cluster briefly carried a second persistent pill for
                  Roll a Job (since folded back into the Job Market hub as a
                  door tile - see JobMarketPage.tsx) - confirmed via a real
                  rendered overflow at common ~390px phone widths with the old
                  threshold, now covers that plus the next size up (412-428px
                  phones) with margin. Rendering both and toggling with CSS
                  (rather than one Logo with a media-query-driven prop) means
                  this collapse is scoped to the header specifically - the
                  hero and auth-page logos always show the full wordmark
                  regardless of viewport. */}
              <span className="hidden max-[480px]:inline-flex">
                <Logo showText={false} />
              </span>
              <span className="inline-flex max-[480px]:hidden">
                <Logo />
              </span>
            </button>

            {/* gap-1.5 up through the sm breakpoint, then md: for both the
                gap and every pill's own icon-only -> icon+text expansion
                below - deferred from sm (640px) to md (768px) across this
                whole cluster back when it briefly carried Roll a Job as a
                second persistent text pill alongside Job Market: at sm, the
                two of them plus Sign in all expanding to full text plus two
                icon circles genuinely overflowed a 640-767px header
                (confirmed via a real rendered scrollWidth check). Roll a Job
                has since moved back into the Job Market hub as a door tile
                (JobMarketPage.tsx), but the md threshold and the safety net
                below are left as-is - loosening them back to sm risks the
                same overflow the moment this cluster gains another item.
                Icon-only through that tablet-ish range and text from md on
                keeps every pill in this row switching in lockstep - one
                flipping to text while its neighbor stays icon-only would
                look broken mid-transition even if it technically fit.
                flex-wrap + justify-end on top of that is a safety net, not
                the primary fix: the rare compound state of signed-in AND an
                active Compare pill AND a ~700-830px width still doesn't fit
                even icon-only-until-md (confirmed via a real rendered
                scrollWidth check) - rather than keep chasing one more exact
                pixel threshold for today's exact button count, letting the
                cluster drop to a right-aligned second row if it ever runs
                out of room means a future added item can't silently push
                something off-screen again. flex-1 + min-w-0 (not shrink-0) is what actually
                makes that wrap trigger - shrink-0 alone left this div free
                to grow to its full unwrapped content width and push past
                the viewport instead of ever being constrained enough to
                wrap; flex-1 hands it "whatever space the logo didn't take"
                as a real max-width, and min-w-0 overrides a flex item's
                default min-width:auto (which would otherwise refuse to
                shrink below its content's natural width regardless). */}
            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-1.5 md:gap-3">
            {compareCount > 0 ? (
              <button
                type="button"
                onClick={() => navigate('/compare')}
                title={`Compare (${compareCount})`}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary-soft/40 text-sm font-semibold text-primary-dark shadow-sm transition hover:bg-primary-soft/70 dark:border-primary/50 dark:bg-primary/10 dark:text-primary-light dark:hover:bg-primary/20 md:h-auto md:w-auto md:px-4 md:py-2"
              >
                <GitCompare className="h-4 w-4 shrink-0" />
                <span className="md:hidden">{compareCount}</span>
                <span className="hidden md:inline">Compare ({compareCount})</span>
              </button>
            ) : null}
            {/* nav-glow-btn: the "pop" treatment (index.css) - a radial-
                gradient fill plus 12 small blurred color circles drifting
                behind the label, teal/indigo/purple themed to match the
                Roll button's own gradient rather than the yellow it started
                as. border-2 (not ring, which would fight the class's own
                literal box-shadow on the same CSS property) is the active-
                page indicator now, replacing the old solid-vs-outline swap
                that this glow background replaced. */}
            <button
              type="button"
              onClick={() => navigate('/job-market')}
              aria-current={isJobMarketActive ? 'page' : undefined}
              title="Job Market"
              className={`nav-glow-btn inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold text-white transition md:h-auto md:w-auto ${
                isJobMarketActive ? 'border-white/90' : 'border-transparent'
              }`}
            >
              <div className="glow-wrapper flex items-center justify-center gap-2 px-0 py-0 md:px-4 md:py-2">
                <span className="relative z-10 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 shrink-0" />
                  <span className="hidden md:inline">Job Market</span>
                </span>
                <NavGlowOrbs />
              </div>
            </button>
            {/* "I Know My Goal" nav pill (a brief experiment, promoted out
                of RoleSelectionPage's "Have a career in mind?" card) was
                removed again - that card is back to being the one door in,
                not duplicated in the header too. */}
            {/* "My Binder" moved out of the public nav (see the account
                dropdown below) - the Binder is account-gated now, so it no
                longer belongs next to Job Market where anyone, signed in or
                not, could reach it. */}
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
                          navigate('/binder')
                          setShowAccountMenu(false)
                        }}
                        aria-current={location.pathname === '/binder' ? 'page' : undefined}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                      >
                        <BookOpen className="h-4 w-4" />
                        My Binder
                      </button>
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
                          navigate('/leaderboard')
                          setShowAccountMenu(false)
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                      >
                        <Trophy className="h-4 w-4" />
                        Leaderboard
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
                title="Sign in"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center gap-2 rounded-full bg-white text-sm font-semibold text-primary ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-800 dark:text-primary-light dark:ring-slate-700 md:h-auto md:w-auto md:px-4 md:py-2"
              >
                <LogIn className="h-4 w-4 shrink-0" />
                <span className="hidden md:inline">Sign in</span>
              </button>
            )}
            {/* Dark mode toggle is inside the accessibility panel this opens
                (AccessibilitySettingsPanel.tsx already has a Dark mode tile
                among its other toggles) - no longer a separate standalone
                icon here too, since that was two controls doing the same
                job. */}
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
          <Route path="/career-pathway/:careerId" element={<CareerPathwayStepperPage />} />
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
          <Route path="/my-pathways/:pathwayId" element={<PathwayFlowPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/job-market" element={<JobMarketPage />} />
          <Route path="/job-market/spotlight" element={<JobMarketSpotlightPage />} />
          <Route path="/job-market/statistics" element={<JobMarketStatisticsPage />} />
          <Route path="/job-market/statistics/uk-numbers" element={<JobMarketUkStatsPage />} />
          <Route path="/job-market/statistics/uk-numbers/heritage-crafts" element={<JobMarketHeritageCraftsPage />} />
          <Route path="/job-market/statistics/uk-numbers/high-demand-careers" element={<JobMarketHighDemandCareersPage />} />
          <Route path="/job-market/statistics/uk-numbers/vanished-jobs" element={<JobMarketVanishedJobsPage />} />
          <Route path="/job-market/statistics/ai-endangered-jobs" element={<JobMarketAiEndangeredJobsPage />} />
          <Route path="/job-market/easiest" element={<JobMarketEasiestPage />} />
          <Route path="/job-market/highest-paying" element={<JobMarketHighestPayingPage />} />
          <Route path="/job-market/roll" element={<JobMarketRollPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/preview/mythic-reveal" element={<MythicRevealPreviewPage />} />
          <Route path="/binder" element={<MyBinderPage />} />
          <Route path="/binder/compare" element={<BinderComparePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MobileContainer>
    </div>
  )
}

export default App
