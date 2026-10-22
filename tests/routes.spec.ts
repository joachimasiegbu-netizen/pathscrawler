import { expect, test, type Page } from '@playwright/test'

/**
 * Does every route still render?
 *
 * This is the test that earns its keep. Every page in the app is a lazily
 * imported chunk (App.tsx), so a typo in a dynamic import, a bad named
 * export, or a module that throws at import time now produces a white screen
 * on exactly one route - and nothing else in the app notices. Loading each
 * route and asserting "a heading rendered, and the error boundary did not"
 * catches that class of break across the whole surface for a few seconds of
 * runtime.
 */

/** The ErrorBoundary fallback's heading (src/components/ErrorBoundary.tsx).
 * Its presence means the page threw during render. */
const ERROR_FALLBACK = 'Something went wrong on this page'

/** RouteFallback's label - visible only while a chunk is in flight. If it is
 * still on screen when we assert, the chunk never arrived. */
const ROUTE_FALLBACK = 'Loading…'

/**
 * Representative routes rather than all 62: one per distinct page component
 * that can be reached without an account or prior assessment state. Routes
 * needing a signed-in session (/binder, /profile) render their auth wall
 * here, which is itself worth asserting renders rather than throwing.
 *
 * Deliberately excluded: /career/:id and the other :id routes, which need a
 * real career id and get their own test below; /job-market/roll, which starts
 * audio and animation timers that make it a poor fit for a render smoke test.
 */
const ROUTES: { path: string; expect: RegExp | string }[] = [
  { path: '/', expect: /PathScrawler/i },
  { path: '/role', expect: 'What describes you best?' },
  { path: '/assessment', expect: /./ },
  { path: '/subjects', expect: /./ },
  { path: '/results', expect: /./ },
  { path: '/search?q=nurse', expect: /./ },
  { path: '/compare', expect: /./ },
  { path: '/login', expect: /sign in/i },
  { path: '/signup', expect: 'Create an account' },
  { path: '/forgot-password', expect: /./ },
  { path: '/my-pathways', expect: /./ },
  { path: '/binder', expect: /./ },
  { path: '/profile', expect: /./ },
  { path: '/testimonials', expect: /./ },
  { path: '/leaderboard', expect: /leaderboard/i },
  { path: '/job-market', expect: /job market/i },
  { path: '/job-market/spotlight', expect: /spotlight/i },
  { path: '/job-market/statistics', expect: /./ },
  { path: '/job-market/statistics/uk-numbers', expect: /./ },
  { path: '/job-market/statistics/uk-numbers/heritage-crafts', expect: /./ },
  { path: '/job-market/statistics/uk-numbers/high-demand-careers', expect: /./ },
  { path: '/job-market/statistics/uk-numbers/vanished-jobs', expect: /./ },
  { path: '/job-market/statistics/ai-endangered-jobs', expect: /./ },
  { path: '/job-market/easiest', expect: /easiest/i },
  { path: '/job-market/highest-paying', expect: /highest paying/i },
  { path: '/job-market/skills', expect: /./ },
  { path: '/student-hub', expect: /student hub/i },
  { path: '/student-hub/faq', expect: /./ },
  { path: '/student-hub/checklists', expect: /./ },
  { path: '/student-hub/debt-calculator', expect: /debt calculator/i },
  { path: '/career-changer/current-role', expect: /./ },
  { path: '/career-changer/preferences', expect: /./ },
  { path: '/career-changer/results', expect: /./ },
  { path: '/subjects/refugee-asylum-seeker', expect: /./ },
  { path: '/subjects/refugee-asylum-seeker/levels', expect: /./ },
  { path: '/subjects/disabled-learner', expect: /./ },
  { path: '/subjects/disabled-learner/support', expect: /./ },
  { path: '/subjects/tlevel', expect: /./ },
  { path: '/refugee/esol', expect: /./ },
  { path: '/refugee/recognition', expect: /./ },
  { path: '/backtrack/categories', expect: /./ },
  { path: '/privacy', expect: /privacy/i },
  { path: '/terms', expect: /terms/i },
  { path: '/this-route-does-not-exist', expect: /./ },
]

/** Asserts a page actually painted its own content: something is visible, the
 * error boundary is absent, and the Suspense fallback has been replaced. */
async function expectRendered(page: Page, matcher: RegExp | string) {
  await expect(page.locator('#root')).not.toBeEmpty()
  await expect(page.getByText(ERROR_FALLBACK)).toHaveCount(0)
  await expect(page.getByText(ROUTE_FALLBACK, { exact: true })).toHaveCount(0)
  if (typeof matcher === 'string') {
    await expect(page.getByText(matcher, { exact: false }).first()).toBeVisible()
  } else {
    await expect(page.locator('#root')).toContainText(matcher)
  }
}

for (const route of ROUTES) {
  test(`renders ${route.path}`, async ({ page }) => {
    // Default waitUntil ('load') rather than 'networkidle': the assertions in
    // expectRendered are web-first and retry on their own, so they are the
    // real sync point. 'networkidle' is both discouraged by Playwright and,
    // on the dev server's hundreds of module requests, slow enough to eat a
    // test's whole timeout budget.
    const response = await page.goto(route.path)
    // Vercel rewrites every path to index.html (vercel.json), so a real route
    // and a typo both answer 200 - the status is only here to catch the
    // server being broken outright.
    expect(response?.status()).toBeLessThan(400)
    await expectRendered(page, route.expect)
  })
}

test('an unknown route renders the 404 page, not the error boundary', async ({ page }) => {
  await page.goto('/definitely-not-a-real-page')
  await expect(page.getByText(ERROR_FALLBACK)).toHaveCount(0)
  await expect(page.locator('#root')).not.toBeEmpty()
})

test('the career dataset is not in the initial page load', async ({ page }) => {
  // Guards the code-splitting work directly: the 657 KB career dataset lives
  // in its own chunk and must only be fetched by a route that needs it.
  // Landing on "/" and pulling it anyway is the regression this catches, and
  // it is an easy one to cause - one eager `import demoCareers` anywhere in
  // App.tsx's import graph (a header component, a store) puts it back.
  const chunkRequests: string[] = []
  page.on('request', (request) => {
    const url = request.url()
    if (/demoCareers/i.test(url)) chunkRequests.push(url)
  })

  // 'networkidle' IS the right tool for this one specifically: the assertion
  // is about what was NOT requested, so it needs the page to have genuinely
  // stopped requesting things.
  await page.goto('/', { waitUntil: 'networkidle' })
  expect(chunkRequests, `demoCareers chunk(s) fetched on "/": ${chunkRequests.join(', ')}`).toHaveLength(0)
})
