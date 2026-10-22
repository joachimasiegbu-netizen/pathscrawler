import { test as base, expect } from '@playwright/test'

/**
 * Shared setup for the interaction tests.
 *
 * Playwright's own `reducedMotion: 'reduce'` (playwright.config.ts) only sets
 * the CSS media query, which handles the cards' float animation. It does NOT
 * reach the app's own accessibility toggle in `usePathStore` - and that is
 * the one the persona carousel reads.
 *
 * Why that matters: the carousel positions its cards with a spring simulated
 * in a requestAnimationFrame loop, settling only once displacement drops
 * below 0.0005 (PersonaCarousel's `tick`). The tail of that spring moves the
 * cards by fractions of a pixel for a long time, and Playwright's "wait until
 * the element is stable before clicking" check compares exact bounding boxes
 * between frames - so a card that looks motionless is still, correctly,
 * reported as not stable, and every click on it times out.
 *
 * With the app's own reduceMotion set, `startSpring` snaps straight to the
 * target and `handleConfirm` skips its 650ms sparkle delay. The carousel then
 * behaves deterministically, which is what a smoke test wants. The animated
 * path is a visual nicety; the thing worth protecting is "this persona leads
 * to this route", and that is identical either way.
 */

/** zustand/persist's envelope for `usePathStore` - no `version` is configured
 * on that store, so it defaults to 0. Only the fields being overridden need
 * to be present; the store merges this over its own defaults on rehydrate. */
const PATH_STORE_SEED = {
  state: {
    accessibilitySettings: {
      reduceMotion: true,
      highContrast: false,
      largerText: false,
      dyslexiaFont: false,
      darkMode: false,
    },
  },
  version: 0,
}

export const test = base.extend({
  page: async ({ page }, use) => {
    // addInitScript runs before any of the page's own scripts on every
    // navigation, so the store sees this on its very first rehydrate rather
    // than after a frame of animated layout.
    await page.addInitScript(
      ([storeSeed, noticeKey]) => {
        try {
          window.localStorage.setItem('pathscrawler-storage', JSON.stringify(storeSeed))
          // Dismiss the first-visit device-storage notice so its fixed bottom
          // banner can't sit over anything a test needs to click.
          window.localStorage.setItem(noticeKey as string, '1')
        } catch {
          // Storage blocked - tests still run, just without the seed.
        }
      },
      [PATH_STORE_SEED, 'pathscrawler-storage-notice'] as const,
    )
    await use(page)
  },
})

export { expect }
