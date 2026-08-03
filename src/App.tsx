import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { usePathStore } from './store/usePathStore'
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
import MobileContainer from './components/MobileContainer'

function App() {
  const location = useLocation()
  const { accessibilitySettings } = usePathStore()
  const reduceMotion = accessibilitySettings.reduceMotion
  const appClassName = `min-h-screen ${accessibilitySettings.darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#E0E7FF] text-slate-900'}`

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
      <MobileContainer>
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
