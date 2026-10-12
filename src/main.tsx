import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* future={{ v7_startTransition, v7_relativeSplatPath }} used to opt into
        v7's behavior early, on v6 - removed, not just left as a no-op: v7
        (react-router-dom bumped as part of the 2026-08-31 pentest report's
        dependency-audit fix) made both the only behavior, and BrowserRouter
        no longer accepts a `future` prop at all - passing it is now a type
        error, not a harmless opt-in. */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
