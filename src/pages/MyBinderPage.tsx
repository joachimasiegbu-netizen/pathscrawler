import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Check, Dices, GitCompare, Share2, X } from 'lucide-react'
import BackButton from '../components/BackButton'
import BinderAuthWall from '../components/BinderAuthWall'
import BinderCardTile from '../components/BinderCardTile'
import BinderStatsPanel from '../components/BinderStatsPanel'
import FloatingCompareButton from '../components/FloatingCompareButton'
import Toast from '../components/Toast'
import Button from '../components/Button'
import { useAuthStore } from '../store/useAuthStore'
import { useBinderStore, useMyBinderCards } from '../store/useBinderStore'
import { groupBinderCards, type GroupedBinderCard } from '../utils/binderGrouping'
import { TIERS, parseSalaryAvg, type TierKey } from '../utils/careerTiers'

type TabKey = 'all' | TierKey
type SortKey = 'newest' | 'rarest' | 'salary' | 'alpha'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'newest', label: 'Newest first' },
  { key: 'rarest', label: 'Rarest first' },
  { key: 'salary', label: 'Salary (high-low)' },
  { key: 'alpha', label: 'A-Z' },
]

function tierRank(tier: TierKey): number {
  return TIERS.findIndex((t) => t.key === tier)
}

// My Binder is the Roll a Job trading-card collection - a different
// feature from "My saved pathways" (useSavedPathwaysStore, the "Save
// pathway" button used on Results/Search/Career Changer/Easiest Jobs/
// Highest Paying Jobs cards elsewhere in this app): this one allows
// duplicates and is scoped specifically to what you've rolled, so it gets
// its own store (useBinderStore) and its own page rather than reusing
// that one. The literal multi-page/flip/swipe "binder
// pages" from the brief are simplified to a single responsive scrolling
// grid inside a page-styled panel - a real page-turn/flip implementation
// (drag gesture handling, 3D flip transforms, per-page state) would be a
// standalone feature on its own; a continuous grid gets the same
// view/organize/click value with a fraction of the risk. Likewise, "cards
// fly from the roll page into the binder" is explicitly called optional in
// the brief and is left as just the toast feedback, and "share generates
// an image" is explicitly a future TODO there too - the Share button here
// follows the same plain-text-link pattern already used elsewhere.
export default function MyBinderPage() {
  const navigate = useNavigate()
  const currentUser = useAuthStore((state) => state.currentUser)
  const isAuthLoading = useAuthStore((state) => state.isLoading)
  const cards = useMyBinderCards()
  const binderSelectionMode = useBinderStore((state) => state.binderSelectionMode)
  const selectedBinderCards = useBinderStore((state) => state.selectedBinderCards)
  const enterSelectionMode = useBinderStore((state) => state.enterSelectionMode)
  const exitSelectionMode = useBinderStore((state) => state.exitSelectionMode)
  const toggleBinderSelection = useBinderStore((state) => state.toggleBinderSelection)
  const [activeTab, setActiveTab] = useState<TabKey>('all')
  const [sort, setSort] = useState<SortKey>('newest')
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  const allGrouped = useMemo(() => groupBinderCards(cards), [cards])

  const visible = useMemo(() => {
    let list = allGrouped
    if (activeTab !== 'all') list = list.filter((entry) => entry.latest.tier === activeTab)
    if (search.trim()) {
      const query = search.trim().toLowerCase()
      list = list.filter((entry) => entry.latest.title.toLowerCase().includes(query))
    }
    const sorted = [...list]
    switch (sort) {
      case 'newest':
        sorted.sort((a, b) => b.latest.dateRolled - a.latest.dateRolled)
        break
      case 'rarest':
        sorted.sort((a, b) => tierRank(b.latest.tier) - tierRank(a.latest.tier))
        break
      case 'salary':
        sorted.sort((a, b) => parseSalaryAvg(b.latest.salary) - parseSalaryAvg(a.latest.salary))
        break
      case 'alpha':
        sorted.sort((a, b) => a.latest.title.localeCompare(b.latest.title))
        break
    }
    return sorted
  }, [allGrouped, activeTab, search, sort])

  const flashToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast((current) => (current === message ? null : current)), 2500)
  }

  const handleToggleSelect = (careerId: number) => {
    const result = toggleBinderSelection(careerId)
    if (result === 'max-reached') {
      flashToast('You can only compare up to 3 careers at once')
    }
  }

  const handleShare = async () => {
    const rarest = allGrouped.reduce<GroupedBinderCard | null>((best, entry) => {
      if (!best || tierRank(entry.latest.tier) > tierRank(best.latest.tier)) return entry
      return best
    }, null)
    const text = `I collected ${cards.length} careers in my PathScrawler Binder! Rarest: ${rarest ? rarest.latest.title : 'none yet'} 🎴 ${window.location.origin}/job-market/roll`

    if (navigator.share) {
      try {
        await navigator.share({ title: 'My PathScrawler Binder', text })
        return
      } catch {
        // dismissed or unsupported - fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(text)
      flashToast('Collection link copied to clipboard!')
    } catch {
      // clipboard API unavailable - nothing else to do
    }
  }

  // The Binder is account-gated - every hook above is still called
  // unconditionally on every render (cards resolves to an empty array while
  // signed out via useMyBinderCards), so this branch is safe to put after
  // them without breaking the rules of hooks. Signed-out visitors never see
  // the empty-binder state, the grid, or any binder chrome - just the wall.
  //
  // isAuthLoading guards the brief window while useAuthStore is still
  // restoring a real Supabase session from storage on first load -
  // currentUser reads null during that window too, so without this a
  // signed-in visitor would see BinderAuthWall flash before their actual
  // Binder appears a moment later.
  if (isAuthLoading) {
    return null
  }
  if (!currentUser) {
    return <BinderAuthWall />
  }

  return (
    // Fragment, not a single root div: `-translate-x-1/2` below (the
    // full-bleed breakout every route in this app with an edge-to-edge
    // background needs, since the shared page wrapper has no padding of
    // its own to escape) is a CSS transform, and a transform on an
    // ancestor creates a new containing block for `position: fixed`
    // descendants - anything fixed *inside* that div stops tracking the
    // real viewport and tracks that div's own (possibly much taller,
    // scrollable) box instead. Confirmed concretely: with a tall card grid,
    // FloatingCompareButton/Toast rendered inside it were landing off-
    // screen below the fold at scroll-top, only drifting into the visible
    // "bottom-6" position once the page was scrolled all the way down. Both
    // are pulled out as siblings of the translated div below, outside its
    // containing-block reach, so they stay genuinely pinned to the
    // viewport at any scroll position.
    <>
      <div className="binder-texture relative left-1/2 w-screen min-h-screen -translate-x-1/2 bg-background px-4 py-8 dark:bg-background-dark sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <BackButton to="/job-market" label="Job Market" />

        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 shrink-0 text-accent" aria-hidden="true" />
          <div>
            <h1 className="text-2xl font-bold text-slate-950 dark:text-white sm:text-3xl">My Career Binder</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Careers you've collected from Roll a Job</p>
          </div>
        </div>

        {/* Track order matches visual order (main content first/wide,
            stats second/narrow) - CSS Grid auto-placement fills tracks in
            `order`-adjusted sequence, not DOM sequence, so defining tracks
            [280px 1fr] while re-ordering the narrower item to appear first
            would hand it the wide track instead of the narrow one. */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
          <div className="lg:order-2">
            <BinderStatsPanel grouped={allGrouped} />
          </div>

          {/* min-w-0: without it, a grid item defaults to min-width: auto,
              so the tab row's intrinsic (unwrapped) width would stretch
              this column - and the whole page's scrollWidth with it -
              instead of respecting the 1fr track and scrolling internally
              via the tab row's own overflow-x-auto. */}
          <div className="min-w-0 space-y-4 lg:order-1">
            {cards.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center dark:border-white/15 dark:bg-white/5">
                <BookOpen className="mx-auto h-10 w-10 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                <p className="mt-4 text-base font-semibold text-slate-900 dark:text-white">Your binder is empty.</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Roll careers to start your collection!</p>
                <Button onClick={() => navigate('/job-market/roll')} className="mx-auto mt-5">
                  <Dices className="mr-1.5 h-4 w-4" />
                  Roll a Job
                </Button>
              </div>
            ) : (
              <>
                <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="tablist" aria-label="Filter by tier">
                  {(['all', ...TIERS.map((t) => t.key)] as TabKey[]).map((key) => {
                    const isActive = activeTab === key
                    const label = key === 'all' ? 'All Cards' : TIERS.find((t) => t.key === key)!.label
                    return (
                      <button
                        key={key}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setActiveTab(key)}
                        className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                          isActive
                            ? 'border-accent bg-accent text-white'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100 dark:border-white/15 dark:bg-white/5 dark:text-slate-300 dark:hover:border-white/30 dark:hover:bg-white/10'
                        }`}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search your binder..."
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-accent focus:outline-none dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
                  />
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value as SortKey)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 focus:border-accent focus:outline-none dark:border-white/15 dark:bg-white/5 dark:text-slate-200"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.key} value={option.key} className="bg-white dark:bg-slate-800">
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                  >
                    {toast ? <Check className="h-4 w-4 shrink-0" /> : <Share2 className="h-4 w-4 shrink-0" />}
                    Share my collection
                  </button>

                  {/* Outline/gray to sit apart from Share's filled-ish look -
                      matches the tab row's own inactive-pill styling above. */}
                  {binderSelectionMode ? (
                    <>
                      <button
                        type="button"
                        onClick={exitSelectionMode}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                      >
                        <X className="h-4 w-4 shrink-0" />
                        Cancel
                      </button>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        Select 2-3 careers to compare ({selectedBinderCards.length}/3)
                      </span>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={enterSelectionMode}
                      disabled={visible.length < 2}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-transparent px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent dark:border-slate-400/60 dark:text-slate-300 dark:hover:border-slate-300 dark:hover:bg-white/10"
                    >
                      <GitCompare className="h-4 w-4 shrink-0" />
                      Compare
                    </button>
                  )}
                </div>

                {visible.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500 dark:border-white/15 dark:bg-white/5 dark:text-slate-400">
                    No cards match this filter.
                  </p>
                ) : (
                  // Real trading-card "page" panel with a slight shadow/curve,
                  // holding the grid - the flip/swipe multi-page mechanic
                  // itself is simplified to a single scrolling grid (see the
                  // note at the top of this file).
                  <div className="rounded-3xl border border-slate-200 bg-slate-100 p-4 shadow-soft dark:border-white/10 dark:bg-slate-800/60 dark:shadow-2xl dark:shadow-black/40 sm:p-6">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {visible.map((entry) => (
                        <BinderCardTile
                          key={entry.latest.careerId}
                          entry={entry}
                          onClick={() => navigate(`/career/${entry.latest.careerId}`, { state: { from: 'binder' } })}
                          selectionMode={binderSelectionMode}
                          selected={selectedBinderCards.includes(entry.latest.careerId)}
                          onToggleSelect={() => handleToggleSelect(entry.latest.careerId)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      </div>

      {toast ? <Toast message={toast} type="success" /> : null}

      {/* Reads selection state straight from useBinderStore itself - see
          FloatingCompareButton.tsx. Navigates to /binder/compare, which is
          the point selection mode actually clears (see that page's
          backToBinder) - NOT this page's unmount, so the selection
          survives the /binder -> /binder/compare hop. */}
      <FloatingCompareButton />
    </>
  )
}
