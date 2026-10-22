import { expect, test } from './fixtures'

/**
 * The accessibility basics that a page can lose silently.
 *
 * Not a full audit - no colour contrast, no screen-reader transcript. These
 * are the three structural things that (a) every page needs, (b) break
 * without anyone noticing on a sighted mouse pass, and (c) a build audit kept
 * flagging: one main landmark, a working skip link, and a name on every
 * control. An icon-only button with no aria-label announces as "button" and
 * nothing else, which is indistinguishable from a broken page if you cannot
 * see the icon.
 */

/** A spread of real pages: plain content, a form, a data-backed page, a
 * full-bleed page with no header, and the 404. Enough shapes to catch a
 * regression without re-running the whole route table from routes.spec.ts. */
const SAMPLE_ROUTES = [
  '/role',
  '/job-market',
  '/job-market/easiest',
  '/student-hub',
  '/student-hub/faq',
  '/signup',
  '/login',
  '/privacy',
  '/terms',
  '/leaderboard',
  '/subjects',
  '/this-route-does-not-exist',
]

for (const route of SAMPLE_ROUTES) {
  test(`${route} has exactly one main landmark`, async ({ page }) => {
    await page.goto(route)
    // Declared once in App.tsx around <Routes>, so the count is really
    // asserting that no page has started rendering its own second <main>.
    await expect(page.locator('main#main-content')).toHaveCount(1)
    await expect(page.locator('main')).toHaveCount(1)
  })
}

for (const route of SAMPLE_ROUTES) {
  test(`every control on ${route} has an accessible name`, async ({ page }) => {
    await page.goto(route)
    // Wait for the lazy route chunk to have painted something before counting.
    await expect(page.locator('#root')).not.toBeEmpty()

    const unnamed = await page.$$eval('a[href], button', (elements) =>
      elements
        .filter((el) => {
          // Hidden from the accessibility tree, or not rendered at all -
          // either way it is not a control anybody can reach.
          if (el.closest('[aria-hidden="true"]')) return false
          const style = getComputedStyle(el)
          if (style.display === 'none' || style.visibility === 'hidden') return false

          const labelledBy = el.getAttribute('aria-labelledby')
          const name = [
            el.getAttribute('aria-label') ?? '',
            labelledBy ? (document.getElementById(labelledBy)?.textContent ?? '') : '',
            el.getAttribute('title') ?? '',
            el.textContent ?? '',
          ]
            .join(' ')
            .trim()
          return name === ''
        })
        // Enough to find it in the source without dumping whole elements.
        .map((el) => `<${el.tagName.toLowerCase()} class="${String(el.getAttribute('class') ?? '').slice(0, 70)}">`),
    )

    expect(unnamed, `controls with no accessible name on ${route}:\n${unnamed.join('\n')}`).toEqual([])
  })
}

test('the skip link is the first thing you reach, and it moves focus to main', async ({ page }) => {
  // Deliberately not "/" - the splash navigates itself to /role on a timer,
  // which would pull focus out from under the assertions.
  await page.goto('/job-market')
  await expect(page.locator('#root')).not.toBeEmpty()

  await page.keyboard.press('Tab')
  const first = page.locator(':focus')
  await expect(first).toHaveText('Skip to main content')
  // sr-only until focused: if this is still clipped to a 1px box, sighted
  // keyboard users cannot see where they are.
  await expect(first).toBeVisible()

  await page.keyboard.press('Enter')
  // tabIndex={-1} on <main> is what lets the fragment jump land focus here
  // rather than leaving it on the link, which is the usual silent failure.
  await expect(page.locator('main#main-content')).toBeFocused()
})
