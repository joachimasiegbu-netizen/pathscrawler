import { expect, test } from './fixtures'

/**
 * The three journeys the app is actually for: picking a persona, the quick
 * assessment, and signing up. Each is asserted on its observable outcome (the
 * URL you end up at, the screen you are shown) rather than on internals.
 *
 * No test here creates a real account. Signup is covered up to the last step
 * before the network call - the validation and the age gate, which are where
 * its real logic lives and the only parts that can regress without a backend.
 */

/** Where confirming each persona on /role must land (RoleSelectionPage's
 * chooseRole). Getting these wrong is a silent break: the carousel still
 * animates and still navigates, just to the wrong place. */
const PERSONA_DESTINATIONS: { label: string; path: string }[] = [
  { label: 'Student', path: '/subjects' },
  { label: 'Career Changer', path: '/career-changer/current-role' },
  { label: 'Mature Learner', path: '/subjects' },
  { label: 'Student Hub', path: '/student-hub' },
  { label: 'I Know My Goal', path: '/backtrack/categories' },
]

test.describe('persona carousel', () => {
  test('shows all five personas', async ({ page }) => {
    await page.goto('/role')
    await expect(page.getByRole('heading', { name: 'What describes you best?' })).toBeVisible()
    // One indicator tab per persona (PersonaCarousel's role="tablist").
    await expect(page.getByRole('tab')).toHaveCount(PERSONA_DESTINATIONS.length)
  })

  for (const persona of PERSONA_DESTINATIONS) {
    test(`"${persona.label}" leads to ${persona.path}`, async ({ page }) => {
      await page.goto('/role')

      // Rotate via the indicator tab, not by clicking the card itself. The
      // carousel lays its cards out on a 3D arc, so an off-centre card is
      // genuinely translated outside the viewport and Playwright (correctly)
      // refuses to click it - the dots are the control a real user reaches
      // for from that position anyway.
      await page.getByRole('tab', { name: persona.label, exact: true }).click()

      // Only the centred card confirms, and its accessible name is what says
      // it is centred - waiting on that name beats racing the arc animation.
      const centred = page.getByRole('button', { name: `${persona.label} - selected, tap to confirm` })
      await expect(centred).toBeVisible()

      const destination = new RegExp(`${persona.path.replace(/\//g, '\\/')}$`)

      // Retry rather than clicking once. The fixture's reduce-motion seed
      // makes the arc snap instead of springing, which is what makes this
      // clickable at all (see fixtures.ts), but `guardedClick` still
      // deliberately swallows the one click that follows a drag. Clicking
      // again when nothing happened is what a real user does, and it keeps
      // this test about the thing worth protecting - that this persona
      // reaches this route - rather than about frame timing.
      await expect(async () => {
        await centred.click({ timeout: 2_000 })
        // CONFIRM_DELAY_MS (650ms) holds the sparkle burst before navigating.
        await expect(page).toHaveURL(destination, { timeout: 3_000 })
      }).toPass({ timeout: 20_000 })
    })
  }

  test('the quick-assessment shortcut leads to /assessment', async ({ page }) => {
    await page.goto('/role')
    await page.getByRole('button', { name: /not sure|quick|quiz|assessment/i }).first().click()
    await expect(page).toHaveURL(/\/assessment$/)
  })
})

test.describe('quick assessment', () => {
  test('starts and accepts an answer', async ({ page }) => {
    await page.goto('/assessment')
    await expect(page.locator('#root')).not.toBeEmpty()

    // The flow is a sequence of choice buttons; answering the first one has
    // to visibly change the page. Asserting on "the content moved on" rather
    // than on specific question copy keeps this from breaking every time the
    // wording is edited.
    const before = await page.locator('#root').innerText()
    const choices = page.getByRole('button')
    await expect(choices.first()).toBeVisible()

    // Skip nav/header buttons by picking one inside the page's own main
    // content area where possible, falling back to the first choice.
    const answer = page.locator('main button, [class*="space-y"] button').filter({ hasNotText: /back|skip|home/i })
    const target = (await answer.count()) ? answer.first() : choices.first()
    await target.click()

    await expect
      .poll(async () => (await page.locator('#root').innerText()) !== before, { timeout: 10_000 })
      .toBe(true)
  })
})

test.describe('signup', () => {
  test('renders every field the age check needs', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible()
    await expect(page.getByLabel('Birth month')).toBeVisible()
    await expect(page.getByLabel('Birth year')).toBeVisible()
  })

  test('refuses to submit without a date of birth', async ({ page }) => {
    await page.goto('/signup')
    await page.locator('input[autocomplete="email"]').fill('smoke-test@example.com')
    await page.locator('input[autocomplete="new-password"]').first().fill('correct-horse-battery')
    await page.locator('input[autocomplete="new-password"]').nth(1).fill('correct-horse-battery')
    await page.getByRole('button', { name: /create account|sign up/i }).click()

    // Both selects carry `required`, so the browser's own form validation
    // stops this before React's handler runs - which means asserting on the
    // app's "Please choose the month and year you were born." copy would be
    // asserting on a fallback that a real browser never reaches. What matters
    // either way: the month is reported invalid and nothing was submitted.
    await expect(page.getByLabel('Birth month')).toHaveJSProperty('validity.valid', false)
    await expect(page).toHaveURL(/\/signup$/)
    // Still the form, not the under-age screen and not the "we've emailed
    // you" confirmation. (Matching bare /confirm/ here would hit the
    // "Confirm password" label on the form itself - the kind of too-loose
    // assertion that passes for the wrong reason.)
    await expect(page.getByText(/without an account/i)).toHaveCount(0)
    await expect(page.getByText(/check your email/i)).toHaveCount(0)
    await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible()
  })

  test('an under-13 date of birth gets the no-account screen, not an account', async ({ page }) => {
    // The ICO Children's Code behaviour: a neutral month/year question, and
    // under the minimum age the signup is replaced by a "use it without an
    // account" screen. This is the single most consequential branch on the
    // page, and it is entirely client-side - so it is exactly what a smoke
    // test can and should cover.
    await page.goto('/signup')
    await page.locator('input[autocomplete="email"]').fill('smoke-test@example.com')
    await page.locator('input[autocomplete="new-password"]').first().fill('correct-horse-battery')
    await page.locator('input[autocomplete="new-password"]').nth(1).fill('correct-horse-battery')
    await page.getByLabel('Birth month').selectOption('6')
    await page.getByLabel('Birth year').selectOption(String(new Date().getFullYear() - 8))
    await page.getByRole('button', { name: /create account|sign up/i }).click()

    await expect(page.getByText(/without an account/i).first()).toBeVisible()
    await expect(page).toHaveURL(/\/signup$/)
  })

  test('passwords that differ are rejected before any network call', async ({ page }) => {
    await page.goto('/signup')
    await page.locator('input[autocomplete="email"]').fill('smoke-test@example.com')
    await page.locator('input[autocomplete="new-password"]').first().fill('correct-horse-battery')
    await page.locator('input[autocomplete="new-password"]').nth(1).fill('something-else-entirely')
    await page.getByLabel('Birth month').selectOption('6')
    await page.getByLabel('Birth year').selectOption(String(new Date().getFullYear() - 30))
    await page.getByRole('button', { name: /create account|sign up/i }).click()
    await expect(page.getByText(/passwords do not match/i)).toBeVisible()
  })
})

test.describe('legal pages', () => {
  // Phase 1's whole point was that these are reachable before an account is
  // created. A footer link that silently stops rendering would undo it.
  test('privacy and terms are reachable from the signup page', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.locator('a[href="/privacy"], a[href*="privacy"]').first()).toBeVisible()
    await expect(page.locator('a[href="/terms"], a[href*="terms"]').first()).toBeVisible()
  })

  test('the figures disclaimer is on the pages that publish figures', async ({ page }) => {
    for (const path of ['/job-market/highest-paying', '/job-market/easiest', '/job-market/statistics']) {
      await page.goto(path)
      await expect(page.getByText(/aren't careers or financial advice/i).first()).toBeVisible()
    }
  })
})
