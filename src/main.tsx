import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import RouteMeta from './components/RouteMeta'
import { installGlobalErrorHandlers } from './utils/reportError'
import { startMonitoring } from './utils/monitoring'
import './index.css'

// Catches what a React boundary structurally cannot: throws from event
// handlers, timers and rAF callbacks, plus promise rejections nobody awaited.
// Installed before render so an error during the first paint is still caught.
installGlobalErrorHandlers()

// Points those handlers (and the analytics seam) at Sentry and Plausible, but
// only when their env vars are set - see src/utils/monitoring.ts. Called after
// installGlobalErrorHandlers so the handlers exist before a reporter is
// attached to them, and before render so a first-paint throw is still sent.
startMonitoring()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* future={{ v7_startTransition, v7_relativeSplatPath }} used to opt into
        v7's behavior early, on v6 - removed, not just left as a no-op: v7
        (react-router-dom bumped as part of the 2026-08-31 pentest report's
        dependency-audit fix) made both the only behavior, and BrowserRouter
        no longer accepts a `future` prop at all - passing it is now a type
        error, not a harmless opt-in. */}
    {/* The boundary sits INSIDE BrowserRouter so its fallback can read the
        current path when reporting, and outside <App /> so it covers all 62
        routes at once rather than being wired per page. It is mounted here
        rather than in App.tsx purely so this file owns it - App.tsx is edited
        by nearly every feature, and this is a line that should never move. */}
    <BrowserRouter>
      {/* Title, description and canonical tag per route - see src/data/seo.ts. */}
      <RouteMeta />
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>,
)
