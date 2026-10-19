import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePathStore } from '../store/usePathStore'
import PersonaCarousel from '../components/PersonaCarousel'
import type { PersonaDef } from '../components/PersonaCard'
import { ArrowLeftRight, BookOpen, Compass, Lightbulb, Target, Wand2 } from 'lucide-react'

// Redesigned per persona_carousel_prompt_updated.txt - supersedes the
// earlier 8-persona version (persona_carousel_prompt.txt). The doc itself
// (persona list + acceptance criteria 1/2) folds Apprentice/Undergraduate/
// New to the UK into "Student"; Armed Forces Leaver wasn't accounted for
// there at all (it simply isn't one of the doc's 4 named personas) - a
// follow-up explicit request placed it under Career Changer instead
// (leaving service for civilian work reads closer to "switching fields"
// than to "at school/college/uni"). Unlike the FIRST version's persona
// list, which silently dropped two real personas the spec's author
// evidently didn't know existed, both of these are deliberate, named
// merges, so followed as written rather than preserved as their own cards.
// That does mean this screen can no longer route an apprentice/university/
// refugee/forces-leaver applicant to their own dedicated /subjects/* (or
// equivalent) flow - they all get the same generic /subjects picker
// Student always used, or Career Changer's own flow.
// Color palette deliberately does NOT match this doc's own (still-dark)
// section - kept on the bright/light theme from the prior explicit request
// ("why is the page so dark, make it brighter"), confirmed with the user
// before implementing the rest of this update.
const personas: PersonaDef[] = [
  {
    id: 'student',
    label: 'Student',
    tagline: 'At school, college, uni, or new to the UK.',
    icon: BookOpen,
    accent: '#3b82f6',
    // Renders the animated 3D hue cube (StudentPersonaCube.tsx) as this
    // card's visual instead of the BookOpen icon - it still rides in the
    // carousel arc and confirms-to-select like every other card.
    cube: true,
  },
  {
    id: 'career-changer',
    label: 'Career Changer',
    tagline: 'Switching fields, starting fresh.',
    icon: ArrowLeftRight,
    accent: '#10b981',
    // Renders the split-flap board (CareerChangerSplitFlap.tsx) as this
    // card's visual instead of the ArrowLeftRight icon.
    flap: true,
  },
  {
    id: 'mature-learner',
    label: 'Mature Learner',
    tagline: 'Returning to study or training.',
    icon: Lightbulb,
    accent: '#f97316',
    // Renders the desk lamp (MatureLearnerDeskLamp.tsx) as this card's
    // visual instead of the Lightbulb icon - it clicks on over an open book
    // after dark, which is the hour this persona actually studies in. Picked
    // off a spec sheet of four candidates
    // (claude.ai/code/artifact/effc911e-6343-4742-84d7-14791e18b642) over a
    // date-due library card, a kintsugi bowl, and a staircase upgrade to the
    // turning hourglass it replaces - that one (MatureLearnerHourglass.tsx,
    // `glass: true`) has since been deleted along with its PersonaCard
    // branch and CSS; it is in git history if it is ever wanted back.
    lamp: true,
  },
  {
    id: 'student-hub',
    label: 'Student Hub',
    tagline: 'Guides, calculators, and study tools.',
    icon: Compass,
    // Cyan, not the earlier pink - explicit request for a different
    // spotlight colour; picked to suit the globe and stay distinct from the
    // other four personas' blue/green/orange/violet.
    accent: '#06b6d4',
    // Renders the drawer cabinet (StudentHubPigeonholes.tsx) as this card's
    // visual instead of the Compass icon - drops the pulse glow along with
    // the rest of the card chrome (see PersonaCard.tsx's `holes` branch),
    // so `pulse` no longer applies here. Took over from the rotating-earth
    // banner (StudentHubPersonaEarth.tsx, `earth: true`), which was the one
    // persona visual that wasn't really 3D and the only one carrying an
    // embedded ~44 KB texture; it has since been deleted along with its
    // PersonaCard branch and CSS, and is in git history if wanted back.
    holes: true,
  },
  // Was its own block below the carousel ("If you already know the job you
  // want... Work backwards from a career") - explicit request to make it a
  // card like the rest instead, and remove it from the bottom.
  {
    id: 'know-my-goal',
    label: 'I Know My Goal',
    tagline: "Name the career, we'll trace the exact steps that get you there.",
    icon: Target,
    accent: '#8b5cf6',
    // Renders the line-drawn tree (KnowGoalPersonaTree.tsx) as this card's
    // visual instead of the Target icon - every branch and root tip is an
    // interactive ball that traces the route to it from the base.
    tree: true,
  },
]

export default function RoleSelectionPage() {
  const navigate = useNavigate()
  const setCurrentPath = usePathStore((state) => state.setCurrentPath)
  const setSelectedRole = usePathStore((state) => state.setSelectedRole)
  const setSelectedSubjects = usePathStore((state) => state.setSelectedSubjects)
  const setSelectedLevel = usePathStore((state) => state.setSelectedLevel)
  const setProgress = usePathStore((state) => state.setProgress)
  const setMatchedRoles = usePathStore((state) => state.setMatchedRoles)
  const setRecommendedRole = usePathStore((state) => state.setRecommendedRole)
  const setAssessmentCompleted = usePathStore((state) => state.setAssessmentCompleted)

  useEffect(() => {
    setSelectedSubjects([])
    setSelectedLevel(null)
    setProgress(0)
    setMatchedRoles([])
    setRecommendedRole(null)
    setAssessmentCompleted(false)
  }, [setMatchedRoles, setProgress, setRecommendedRole, setSelectedLevel, setSelectedSubjects, setAssessmentCompleted])

  const chooseRole = (id: string) => {
    // Student Hub and "I Know My Goal" aren't career-path personas - each
    // navigates straight to its own destination and never touches
    // selectedRole/currentPath, same as before either was a plain button.
    if (id === 'student-hub') {
      navigate('/student-hub')
      return
    }
    if (id === 'know-my-goal') {
      navigate('/backtrack/categories')
      return
    }

    setSelectedRole(id)
    setCurrentPath('education')

    // Career Changer is the only remaining persona with its own dedicated
    // flow - Student and Mature Learner both go to the generic picker
    // (Student always did; the apprentice/university/refugee-specific
    // routes that used to branch off Student are gone now that those are
    // folded into it rather than separate cards - see this file's own
    // top comment).
    if (id === 'career-changer') {
      navigate('/career-changer/current-role')
      return
    }
    navigate('/subjects')
  }

  return (
    // Normal page, not a forced-dark full-bleed scene - explicit request
    // ("why is the page so dark, make it brighter, happy but professional
    // colours"). Same layout shell every other page in the app uses, so it
    // inherits the site's own light/dark toggle (and MobileContainer's
    // cycling background) instead of overriding it. The carousel itself
    // (PersonaCard.tsx/PersonaCarousel.tsx) keeps one fixed bright identity
    // regardless of the toggle, deliberately - a hero-like featured
    // section, same idea as the landing page's own always-bright gradient
    // elsewhere in this app. No BackButton anywhere on this page - explicit
    // request ("NO back button ... user must pick a persona to proceed").
    // Full width so the carousel can use the whole page; the heading and the
    // quiz link keep their own narrow centred column.
    // Tighter rhythm on phones: at the desktop py-8/space-y-8 the carousel's
    // arrows and dots fell just under the fold on a 667px-tall handset, so
    // the one control that says "there are five of these" was invisible
    // until you scrolled. 28px back is enough to lift them above it.
    <div className="w-full space-y-6 py-5 sm:space-y-8 sm:py-8">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl" style={{ letterSpacing: '-0.02em' }}>
          What describes you best?
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
          Pick the one that sounds most like you right now. It just sets your starting point, and you can change it
          whenever.
        </p>
      </div>

      <PersonaCarousel personas={personas} onConfirm={chooseRole} />

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <button
          type="button"
          onClick={() => navigate('/assessment')}
          className="flex w-full items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary-soft/40 px-5 py-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-soft/70 hover:shadow-md dark:border-primary/40 dark:bg-primary/10"
        >
          <span className="flex items-center gap-2.5 text-sm font-semibold text-primary-dark dark:text-primary-light">
            <Wand2 className="h-4 w-4 shrink-0" />
            Not sure? Answer 5 quick questions and we&rsquo;ll pick your path for you.
          </span>
          <span className="shrink-0 text-sm font-bold text-primary-dark dark:text-primary-light">Start &rarr;</span>
        </button>
      </div>
    </div>
  )
}
