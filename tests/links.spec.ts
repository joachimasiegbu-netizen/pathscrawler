import { readdirSync, readFileSync } from 'node:fs'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from './fixtures'

/**
 * Do the app's own links go anywhere?
 *
 * Internal links only. Because Vercel rewrites every path to index.html
 * (vercel.json), a typo in a `to="/student-hub/faq"` does not 404 at the
 * server - it renders the astronaut page. Nothing in the build, the
 * typechecker or routes.spec.ts catches that: the route table in App.tsx and
 * the links into it are separate lists that drift apart quietly, usually when
 * a route is renamed.
 *
 * The targets are read out of the source rather than scraped from rendered
 * pages. Most navigation in this app is a <button onClick={() => navigate(…)}>
 * rather than an anchor, so a DOM crawl of a dozen pages finds about seven
 * links and would prove almost nothing.
 *
 * External links are not checked here - they depend on other people's servers
 * and would make CI fail for reasons that have nothing to do with a change.
 * `npm run check:links` does those on demand.
 */

const SRC = fileURLToPath(new URL('../src', import.meta.url))
const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx'])

/** `to="/path"`, `href="/path"` and `navigate('/path')` - the three ways a
 * destination is written here. Template literals (`to={`/career/${id}`}`) are
 * deliberately not matched: their path depends on data, and routes.spec.ts
 * already covers the :param routes with real ids. */
const LINK_PATTERNS = [/\bto="(\/[^"{}]*)"/g, /\bhref="(\/[^"{}]*)"/g, /\bnavigate\('(\/[^'{}]*)'/g]

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) return sourceFiles(full)
    return SOURCE_EXTENSIONS.has(extname(entry.name)) ? [full] : []
  })
}

function collectTargets(): Map<string, Set<string>> {
  const targets = new Map<string, Set<string>>()
  for (const file of sourceFiles(SRC)) {
    const text = readFileSync(file, 'utf8')
    for (const pattern of LINK_PATTERNS) {
      for (const match of text.matchAll(pattern)) {
        const target = match[1]
        // The skip link's own in-page fragment, and any bare "/" variants
        // with a query string, which routes.spec.ts covers.
        if (target === '' || target.startsWith('//')) continue
        if (!targets.has(target)) targets.set(target, new Set())
        targets.get(target)!.add(file.slice(SRC.length + 1))
      }
    }
  }
  return targets
}

/** NotFoundPage's heading. Its presence means the link pointed at nothing. */
const NOT_FOUND = "Looks like you've drifted off course"

/** RouteFallback's label - visible only while a lazy chunk is in flight. */
const ROUTE_FALLBACK = 'Loading…'

const TARGETS = collectTargets()

test('every internal link in the source lands on a real page', async ({ page }) => {
  // One test, ~35 sequential navigations, sharing a preview server with the
  // rest of the suite. The 30s default in playwright.config.ts is the right
  // budget for a single page load and the wrong one for a crawl: this passes
  // in 8s on its own and overran when the whole suite ran at once. Tripled
  // here rather than raised globally, so a genuinely hung test is still
  // caught everywhere else.
  test.slow()

  // A sanity floor: if the scan silently found nothing, the loop below would
  // pass and prove nothing.
  expect(TARGETS.size, 'no internal link targets were found in src/').toBeGreaterThan(20)

  const broken: string[] = []

  for (const [target, files] of TARGETS) {
    await page.goto(target)
    await expect(page.locator('#root')).not.toBeEmpty()
    // Every page is a lazy chunk, so #root fills with the header long before
    // the route's own content exists. RouteFallback's label disappearing is
    // the real "this page has painted" signal - the same sync point
    // routes.spec.ts uses. Without it, every check below races the chunk and
    // reports a page that is merely slow as a page that is missing.
    await expect(page.getByText(ROUTE_FALLBACK, { exact: true })).toHaveCount(0)

    const where = [...files].join(', ')
    if (await page.getByText(NOT_FOUND).isVisible().catch(() => false)) {
      broken.push(`${target} -> 404 page   (linked from ${where})`)
      continue
    }
    // "/privacy#your-rights" is only a working link if that id is on the page.
    // Attribute selector rather than `#id`: CSS.escape is a browser global and
    // this runs in Node.
    const hash = target.split('#')[1]
    if (hash) {
      const present = await page
        .locator(`[id="${hash}"]`)
        .first()
        .waitFor({ state: 'attached', timeout: 5000 })
        .then(() => true)
        .catch(() => false)
      if (!present) broken.push(`${target} -> no element with id="${hash}"   (linked from ${where})`)
    }
  }

  expect(broken, `internal links that go nowhere:\n${broken.join('\n')}`).toEqual([])
})
