import { Link } from 'react-router-dom'

// Site-wide legal links (App.tsx renders this under every route except the
// splash page, Roll a Job's full-screen game view and the /preview/* QA
// routes). onDark is for the forced-dark "game mode" pages like the
// leaderboard, which ignore the site's own light/dark toggle.

const LINKS = [
  { to: '/privacy', label: 'Privacy policy' },
  { to: '/terms', label: 'Terms of use' },
  { to: '/privacy#device-storage', label: 'Device storage' },
]

export default function SiteFooter({ onDark = false }: { onDark?: boolean }) {
  return (
    <footer className="px-4 pb-8 pt-10 sm:px-6">
      <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-6">
        {LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`py-3 text-sm font-medium underline-offset-4 transition hover:underline ${
              onDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </footer>
  )
}
