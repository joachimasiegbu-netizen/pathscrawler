import { defineConfig, devices } from '@playwright/test'

// Deliberately NOT 4173: `vite.config.ts` pins the dev server to that port and
// this project's convention is to leave it running, so sharing it made
// `reuseExistingServer` below adopt the dev server and quietly test source
// instead of the build - defeating the whole point stated above.
const PORT = 4273
const BASE_URL = `http://localhost:${PORT}`

/**
 * Smoke-test config. The point of these tests is to catch the breakage that
 * actually happens in this app - a route that white-screens, a persona that
 * stops navigating, a form that stops validating - not to chase coverage.
 *
 * Tests run against `vite preview` (the real production build) rather than
 * the dev server, because the things most likely to break are build-time:
 * every page is a lazy chunk now, and a bad dynamic import works perfectly in
 * dev and fails only once Rollup has split it.
 */
export default defineConfig({
  testDir: './tests',
  // One retry in CI absorbs the genuinely flaky (a chunk request losing a
  // race on a cold server) without hiding a real failure, which will fail
  // both times. No retries locally - a flake you can see is worth knowing
  // about while you are working.
  retries: process.env.CI ? 1 : 0,
  // The suite is almost entirely independent page loads, so parallelism is
  // free; capped in CI where the runner has two cores and over-subscribing
  // makes the whole thing slower and flakier.
  workers: process.env.CI ? 2 : undefined,
  // Nothing here should take 30s. A test that does is hung, not slow.
  timeout: 30_000,
  expect: { timeout: 10_000 },
  // Fails the run if a `test.only` is committed by accident.
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Sets `prefers-reduced-motion: reduce`, which this app's CSS honours
    // (index.css). Not cosmetic: the persona cards carry an infinite 3.2s
    // float animation, so Playwright's "wait until the element is stable"
    // check before a click never resolved and every carousel test timed out.
    // Testing under a real accessibility setting the app already supports is
    // a far better answer than `click({ force: true })`, which would skip
    // that safety check everywhere and hide genuine "the user cannot hit
    // this" bugs.
    reducedMotion: 'reduce',
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    // The audience for this app is "students, largely on phones and mobile
    // data", so a phone viewport is a first-class target here, not an extra.
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    // `--strictPort` so a stale process on this port fails loudly instead of
    // the suite silently testing whatever else is listening there.
    command: `npm run preview -- --port ${PORT} --strictPort`,
    url: BASE_URL,
    // Locally this reuses the dev server if one is already up, which is the
    // common case while working. CI always starts its own.
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
