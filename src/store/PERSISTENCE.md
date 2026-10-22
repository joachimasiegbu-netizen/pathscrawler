# What syncs, what stays in the browser

Every store in this folder now makes this an explicit decision rather than an
accident of when it was written. Each file carries a one-line `LOCAL` /
`SYNCED` note near the top; this is the whole set in one place.

"Synced" always means the same two-layer arrangement, never remote-only:
zustand/persist to localStorage as the instant, offline, per-device mirror,
plus Supabase as the source of truth across devices. The local write happens
first so no interaction waits on a round trip, and the Supabase write is
fire-and-forget (logs on failure, never throws).

| Store | | Why |
| --- | --- | --- |
| `useBinderStore` | **SYNCED** → `binder_cards` | The clearest "my stuff" surface in the app and the most painful to lose. A collection you built over weeks shouldn't die with a cleared cache. |
| `useSavedPathwaysStore` | **SYNCED** → `saved_pathways` | A pathway is the end product of the whole assessment flow — the one thing the product is actually for. |
| `useUserProfileStore` | **SYNCED** → `profiles` | Your name and equipped title are how *other* players see you; they have to be global by definition. |
| `useTitleProgressStore` | **SYNCED** → `title_unlocks` | Titles count toward the leaderboard score, so they can't be per-browser. The local copy keeps the one-way-latch logic and `syncedTitleIds` tracks what's been pushed. |
| `useLeaderboardStore` | **SERVER-READ** | No local persistence at all: it reads `user_best_cards` + `profiles` live (and subscribes to realtime). Nothing to decide — there is no local copy to lose. |
| `useAuthStore` | **SESSION** | No zustand/persist of its own. Supabase's client durably persists the real session/JWT (see `supabaseClient.ts`'s remember-me storage); this store only mirrors it into reactive state. |
| `useRollStore` | **LOCAL** | Lifetime tier/career tallies and the tutorial flag. The authoritative roll history is already server-side in `rolls` (and `user_best_cards.total_rolls`), so these are a per-device stats-panel convenience, not the record. A fresh browser showing zero local rolls while the leaderboard still shows your real total is the accepted cost. |
| `useCompareStore` | **LOCAL** | A 3-item worklist for the side-by-side you're building *right now*. Syncing it would push a half-finished comparison onto your other devices. |
| `usePathStore` | **LOCAL** | The in-flight assessment (selected subjects/level/progress) plus accessibility settings. The assessment is deliberately scratch — it's reset on entering `/role` anyway. Accessibility settings are the one genuine sync candidate in here: a reduced-motion or dark-mode preference arguably belongs to the person, not the browser. |
| `useSkillProgressStore` | **LOCAL** | A personal "am I learning this" checklist on the Skills page. Flagged as the **next sync candidate**: unlike compare lists and in-flight assessments, this is real accumulated progress, and the only reason it isn't synced yet is that it has no account scoping at all (one flat `status` map per browser, not `byUser`), so syncing it needs that refactor first. |

## The first-login merge

Both newly-synced collections (`useBinderStore`, `useSavedPathwaysStore`) keep
a persisted `mergedUserIds` latch. The first time `hydrateFromSupabase()` runs
for an account, the merge is a **union** — everything this browser holds is
kept and the local-only half is uploaded — because all of it predates the
table and a remote-wins read would delete a collection that was never backed
up. Once an account is in the latch, the remote copy is authoritative, so an
entry deleted on another device stays deleted instead of being resurrected
from a stale local mirror.

One limit worth stating plainly: because both collections are account-gated
(writes return `unauthenticated` while signed out, and `MyBinderPage` sits
behind `BinderAuthWall`), there is no anonymous data to adopt at signup. The
merge covers the case that actually exists — a signed-in device whose data
predates the sync — not "build a binder logged out, then sign up", which the
product doesn't allow in the first place.

## Deleting an account

Erasure has to cover both layers, and they are cleared by different code.

Server-side is one call: `useAuthStore.deleteAccount()` runs the
`delete_own_account()` RPC (`supabase/schema.sql`), which deletes the caller's
`auth.users` row. Every table in that file references `auth.users (id)`
**`on delete cascade`**, so `rolls`, `title_unlocks`, `user_best_cards`,
`profiles`, `binder_cards` and `saved_pathways` all go with it in the same
statement. There is no per-table delete list to keep in sync here — which is
the practical reason a new user-scoped table must carry that same cascade.

Locally, the four account-keyed stores above are still mirrored in
localStorage under the deleted user's id, so `clearLocalAccountData(userId)`
(`src/utils/clearLocalAccountData.ts`) removes that account's slice from
`useBinderStore`, `useSavedPathwaysStore`, `useTitleProgressStore` and
`useUserProfileStore`, including its `mergedUserIds` entry. It lives outside
`useAuthStore` because all four of those stores import `useAuthStore`, and it
takes the id as an argument because the session is already cleared by the time
it runs. `DeleteAccountPanel` is the one caller.

The **LOCAL** stores are deliberately left alone: they hold no account-scoped
data (`useRollStore`'s tallies and `usePathStore`'s settings are per-browser
and not attributable to an account), so clearing them would be wiping a
different person's settings on a shared device, not honouring an erasure
request.
