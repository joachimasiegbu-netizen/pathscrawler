-- PathScrawler - Roll a Job leaderboard schema
--
-- Run this once in your Supabase project's SQL Editor (Dashboard -> SQL
-- Editor -> New query -> paste this whole file -> Run). It's idempotent
-- (safe to re-run) via `if not exists` / `create or replace` / `drop ...
-- if exists` everywhere it matters.
--
-- Three tables:
--   rolls            - one permanent row per roll a signed-in player makes.
--                       The client only ever INSERTs here.
--   title_unlocks    - one permanent row per title a signed-in player has
--                       earned (Roll a Job's Achievements panel, titles.ts)
--                       - one row per (user_id, title_id), the client only
--                       ever INSERTs here too. Added so titles can count
--                       toward the leaderboard score - they used to be
--                       entirely local/per-browser state (useTitleProgress-
--                       Store.ts), invisible to anyone else's leaderboard
--                       view.
--   user_best_cards  - one row per player, auto-maintained by the trigger
--                       below every time a row lands in EITHER `rolls` OR
--                       `title_unlocks`: their top 4 rolls by points (kept
--                       purely for the leaderboard's "best cards" display),
--                       their lifetime roll count, and their best tier ever.
--                       The score itself is now the sum of EVERY roll
--                       they've ever made (not just those top 4) PLUS every
--                       earned title's own points - "every card you roll
--                       adds points to your standing", not just your
--                       luckiest few. This is the table the leaderboard page
--                       actually reads - the client never aggregates
--                       `rolls`/`title_unlocks` itself.

create table if not exists public.rolls (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  email text not null,
  career_id integer not null,
  title text not null,
  tier text not null,
  points integer not null,
  rolled_at timestamptz not null default now()
);

create index if not exists rolls_user_id_points_idx on public.rolls (user_id, points desc, rolled_at desc);

-- primary key (user_id, title_id) instead of a separate id column - a
-- given account can only ever earn a given title once (titles are one-way
-- latches, see useTitleProgressStore.ts), so the natural key IS the
-- uniqueness constraint; an insert conflict here is expected and harmless
-- (e.g. the same unlock re-detected on a second device) rather than an
-- error to handle specially.
create table if not exists public.title_unlocks (
  user_id uuid not null references auth.users (id) on delete cascade,
  email text not null,
  title_id text not null,
  points integer not null,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, title_id)
);

create table if not exists public.user_best_cards (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  score integer not null default 0,
  -- Array of up to 4 {careerId, title, tier, points, rolledAt} objects,
  -- already sorted best-first - see the trigger function below for exactly
  -- how these keys are built (camelCase to match the app's TS types
  -- directly, no client-side remapping needed).
  top_cards jsonb not null default '[]'::jsonb,
  total_rolls integer not null default 0,
  best_tier text,
  updated_at timestamptz not null default now()
);

alter table public.rolls enable row level security;
alter table public.title_unlocks enable row level security;
alter table public.user_best_cards enable row level security;

-- Anyone can read the leaderboard, signed in or not - that's the whole
-- point of a leaderboard. Writing is the part that's actually locked down:
-- a player can only ever insert rolls (and by extension, only ever have
-- their OWN user_best_cards row updated) under their own account.
drop policy if exists "Public can read rolls" on public.rolls;
create policy "Public can read rolls" on public.rolls
  for select using (true);

drop policy if exists "Users insert their own rolls" on public.rolls;
create policy "Users insert their own rolls" on public.rolls
  for insert to authenticated with check (auth.uid() = user_id);

-- Same public-read / own-account-insert-only shape as rolls above.
drop policy if exists "Public can read title unlocks" on public.title_unlocks;
create policy "Public can read title unlocks" on public.title_unlocks
  for select using (true);

drop policy if exists "Users insert their own title unlocks" on public.title_unlocks;
create policy "Users insert their own title unlocks" on public.title_unlocks
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Public can read the leaderboard" on public.user_best_cards;
create policy "Public can read the leaderboard" on public.user_best_cards
  for select using (true);

-- These two exist for completeness/defense-in-depth (a direct client write
-- attempt to this table would still be scoped to the caller's own row) -
-- in normal operation only the trigger below ever writes here, and it runs
-- as security definer so it isn't blocked by these policies.
drop policy if exists "Users upsert their own leaderboard row" on public.user_best_cards;
create policy "Users upsert their own leaderboard row" on public.user_best_cards
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Users update their own leaderboard row" on public.user_best_cards;
create policy "Users update their own leaderboard row" on public.user_best_cards
  for update to authenticated using (auth.uid() = user_id);

-- Recomputes ONE player's user_best_cards row from scratch, from every row
-- they have in `rolls` and `title_unlocks`, called by the trigger on
-- EITHER table (both below). Simplest correct approach for a dataset this
-- size (a demo app's roll/title history) - no incremental "is this roll
-- good enough to bump something out of the top 4" logic to get subtly
-- wrong. Was the trigger function itself, reading `new.user_id`/`new.email`
-- directly - pulled out into its own plain function taking explicit
-- params so both triggers (and the backfill at the bottom of this file)
-- can share one implementation instead of two copies that could drift.
-- security definer + a pinned search_path so it can write user_best_cards
-- regardless of the calling user's own RLS grants on that table (the
-- policies above are for direct client writes, not this trusted system
-- path).
create or replace function public.refresh_user_best_cards_for(p_user_id uuid, p_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_top jsonb;
  v_roll_score integer;
  v_title_score integer;
  v_score integer;
  v_total integer;
  v_best_tier text;
begin
  -- Still just the top 4 by points - this is ONLY for the leaderboard's
  -- "best cards" showcase now, not the score itself (see v_roll_score
  -- just below).
  select coalesce(jsonb_agg(t), '[]'::jsonb) into v_top
  from (
    select career_id as "careerId", title, tier, points, rolled_at as "rolledAt"
    from public.rolls
    where user_id = p_user_id
    order by points desc, rolled_at desc
    limit 4
  ) t;

  -- Every roll counts now, not just the best 4 - "every card you roll adds
  -- points to your standing" per explicit request. No order/limit here on
  -- purpose (that's what made this a top-4-only score before); a full sum
  -- over every row this account has ever rolled.
  select coalesce(sum(points), 0) into v_roll_score
  from public.rolls
  where user_id = p_user_id;

  -- Titles count toward the leaderboard score too now - every EARNED
  -- title's own points (titles.ts), on top of the all-rolls score above,
  -- not folded into the top_cards/top-4 set itself (titles aren't rolls,
  -- they don't have a tier to show as one of those 4 pips).
  select coalesce(sum(points), 0) into v_title_score
  from public.title_unlocks
  where user_id = p_user_id;

  v_score := v_roll_score + v_title_score;

  select count(*) into v_total from public.rolls where user_id = p_user_id;

  -- Best tier EVER (not just within the top-4-by-points set) - tier rank
  -- order matches TIERS in careerTiers.ts (common weakest -> celestial
  -- strongest), not alphabetical, hence the explicit case. Celestial was
  -- missing from this case entirely for a while (added to the app after
  -- this function was first written) - it silently fell into the `else 1`
  -- branch, tying it with Common instead of outranking everything, so a
  -- player's best-ever roll could show as "Mythic" even with a genuine
  -- Celestial sitting right there in their top 4. Fixed here; see the
  -- one-off backfill at the bottom of this file for correcting rows that
  -- were already computed wrong before this fix.
  select tier into v_best_tier
  from public.rolls
  where user_id = p_user_id
  order by case tier
    when 'celestial' then 7
    when 'mythic' then 6
    when 'legendary' then 5
    when 'epic' then 4
    when 'rare' then 3
    when 'uncommon' then 2
    else 1
  end desc
  limit 1;

  insert into public.user_best_cards (user_id, email, score, top_cards, total_rolls, best_tier, updated_at)
  values (p_user_id, p_email, v_score, v_top, v_total, v_best_tier, now())
  on conflict (user_id) do update set
    email = excluded.email,
    score = excluded.score,
    top_cards = excluded.top_cards,
    total_rolls = excluded.total_rolls,
    best_tier = excluded.best_tier,
    updated_at = now();
end;
$$;

create or replace function public.refresh_user_best_cards()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.refresh_user_best_cards_for(new.user_id, new.email);
  return new;
end;
$$;

drop trigger if exists trg_refresh_user_best_cards on public.rolls;
create trigger trg_refresh_user_best_cards
  after insert on public.rolls
  for each row execute function public.refresh_user_best_cards();

-- Same shared function, fired on a title unlock instead of a roll - a
-- title landing needs the leaderboard score recomputed exactly the same
-- way a roll does now.
create or replace function public.refresh_user_best_cards_on_title()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.refresh_user_best_cards_for(new.user_id, new.email);
  return new;
end;
$$;

drop trigger if exists trg_refresh_user_best_cards_on_title on public.title_unlocks;
create trigger trg_refresh_user_best_cards_on_title
  after insert on public.title_unlocks
  for each row execute function public.refresh_user_best_cards_on_title();

-- Realtime: lets the leaderboard page subscribe and update live across
-- devices the moment anyone's user_best_cards row changes, instead of only
-- refreshing on page load. Wrapped in a existence check (plain ALTER
-- PUBLICATION ... ADD TABLE has no IF NOT EXISTS of its own) so re-running
-- this whole script doesn't error on "table is already member of publication".
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'user_best_cards'
  ) then
    alter publication supabase_realtime add table public.user_best_cards;
  end if;
end $$;

-- One-off backfill - recomputes every existing player's row through the
-- shared function above, so anyone whose score/best_tier was already
-- computed by an older version of this file (missing titles entirely, the
-- missing-Celestial best_tier bug from before, or - as of this version -
-- the old top-4-only scoring) gets corrected immediately rather than
-- waiting on their next roll/title. Safe to re-run any time. Re-running
-- this specific version is what actually applies the "every roll counts"
-- change retroactively to everyone's existing roll history, not just
-- rolls made after this file is re-run.
do $$
declare
  r record;
begin
  for r in select distinct user_id, email from public.rolls loop
    perform public.refresh_user_best_cards_for(r.user_id, r.email);
  end loop;
end $$;


-- ===========================================================================
-- profiles - one row per player: their chosen display name and which of
-- their unlocked titles (title_unlocks / titles.ts) they've equipped to show
-- next to it. Written by the client (useUserProfileStore.ts) via upsert;
-- read publicly so the leaderboard can show every player's name + title, not
-- just the signed-in viewer's own. The client keeps a localStorage mirror
-- for its own name, but THIS table is the source of truth across devices and
-- the only place other players' names come from.
-- ===========================================================================
create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  username text not null,
  -- Title id string (e.g. 'icarus'), or null for "show no title". Not a FK -
  -- titles are app-side data (titles.ts), not a DB table.
  equipped_title_id text,
  -- True when `username` was auto-assigned because the player skipped the
  -- setup modal - the client shows a "Set your name" banner while this holds.
  is_fallback_name boolean not null default false,
  updated_at timestamptz not null default now(),
  -- Server-side backstop for the format rules the client enforces in
  -- usernameValidation.ts (3-20 chars; letters/numbers/spaces/_/-; no
  -- leading/trailing or double spaces; not digits-only; not a reserved
  -- word). The profanity deny-list is client-side only for now - a trigger
  -- or edge function reproducing that list is the follow-up backstop.
  constraint profiles_username_format check (
    char_length(username) between 3 and 20
    and username ~ '^[A-Za-z0-9_ -]+$'
    and username !~ '  '
    and username !~ '^ '
    and username !~ ' $'
    and username !~ '^[0-9]+$'
    and lower(username) <> all (array['admin', 'support', 'official', 'pathscrawler', 'mod'])
  )
);

-- Case-insensitive uniqueness: "Joachim" and "joachim" are the same handle.
create unique index if not exists profiles_username_lower_key on public.profiles (lower(username));

alter table public.profiles enable row level security;

-- Public read (the leaderboard shows everyone's name/title); a player can
-- only write their own row.
drop policy if exists "Public can read profiles" on public.profiles;
create policy "Public can read profiles" on public.profiles
  for select using (true);

drop policy if exists "Users insert their own profile" on public.profiles;
create policy "Users insert their own profile" on public.profiles
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Users update their own profile" on public.profiles;
create policy "Users update their own profile" on public.profiles
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Realtime so an equipped-title or name change shows on every open
-- leaderboard within moments, same as user_best_cards above.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'profiles'
  ) then
    alter publication supabase_realtime add table public.profiles;
  end if;
end $$;

-- Graduate title's reward (titles.ts) - a custom 120-char "yearbook quote"
-- shown under the player's name on the leaderboard once they've earned it.
-- A plain nullable column on the existing profiles table, not a new one -
-- it's one more fact about a player, same as username/equipped_title_id
-- above, not a separate collection with its own lifecycle. `add column if
-- not exists` so re-running this whole file stays idempotent like
-- everything else in it.
alter table public.profiles add column if not exists graduation_quote text;

-- Postgres has no native "add constraint if not exists" - drop-then-add is
-- the same idempotent pattern the policies above already use.
alter table public.profiles drop constraint if exists profiles_graduation_quote_length;
alter table public.profiles add constraint profiles_graduation_quote_length
  check (graduation_quote is null or char_length(graduation_quote) <= 120);

-- Once-every-7-days username rate limit (useUserProfileStore.ts) - when the
-- player last actually changed their name, so the cooldown travels with
-- their account across devices/sign-ins rather than resetting on a fresh
-- browser. null until they've ever changed it once (picking a name for the
-- very first time doesn't start the clock - see that file's own comment).
alter table public.profiles add column if not exists username_changed_at timestamptz;

-- ===========================================================================
-- Security hardening pass.
-- ===========================================================================

-- The Supabase security advisor flagged all three refresh_user_best_cards*
-- functions as callable directly by `anon`/`authenticated` via PostgREST's
-- auto-exposed /rest/v1/rpc/* endpoints - Postgres grants EXECUTE on newly
-- created functions to PUBLIC by default, and these are all SECURITY
-- DEFINER (they have to be, to write user_best_cards despite that table's
-- own RLS - see the comment above refresh_user_best_cards_for). Worst case
-- of the two trigger functions (refresh_user_best_cards,
-- refresh_user_best_cards_on_title) is low - Postgres refuses to run a
-- RETURNS TRIGGER function outside an actual trigger context - but
-- refresh_user_best_cards_for(p_user_id, p_email) has no such guard: it's a
-- plain callable function, so anyone could invoke it with a victim's real
-- user_id and an ARBITRARY p_email, which the `on conflict do update set
-- email = excluded.email` clause would then write straight into that
-- victim's user_best_cards row - a stranger overwriting another player's
-- stored email. Revoking EXECUTE from anon/authenticated/public here closes
-- that off entirely; the triggers above still work because a SECURITY
-- DEFINER function's internal `perform` calls run as ITS OWNER (not as the
-- inserting client), and the owner always has execute rights on its own
-- functions.
revoke execute on function public.refresh_user_best_cards() from public, anon, authenticated;
revoke execute on function public.refresh_user_best_cards_for(uuid, text) from public, anon, authenticated;
revoke execute on function public.refresh_user_best_cards_on_title() from public, anon, authenticated;

-- Disposable/temp email domains - maintained as a table rather than a
-- hardcoded list baked into the hook function below, so a newly-spotted
-- burner service can be blocked with a single INSERT from the SQL Editor,
-- no redeploy needed. Not exhaustive (new throwaway providers appear
-- constantly) - this is the same "minimum checklist" tradeoff as everything
-- else in this file, covering the overwhelming common case
-- (mailinator/guerrillamail/10minutemail-style services) rather than
-- chasing every one that will ever exist.
create table if not exists public.disposable_email_domains (
  domain text primary key
);
alter table public.disposable_email_domains enable row level security;
-- Deliberately NO policies - nobody needs direct client read/write access
-- (not even public read); only the hook function below touches this table,
-- running as supabase_auth_admin, which bypasses RLS entirely as part of
-- its own role privileges - same reasoning as security definer elsewhere in
-- this file, just via role membership instead of a function attribute.

insert into public.disposable_email_domains (domain) values
  ('mailinator.com'), ('mailinator.net'), ('mailinator.org'), ('sogetthis.com'),
  ('guerrillamail.com'), ('guerrillamail.net'), ('guerrillamail.org'), ('guerrillamail.biz'),
  ('guerrillamail.de'), ('guerrillamail.info'), ('guerrillamailblock.com'), ('grr.la'), ('sharklasers.com'),
  ('10minutemail.com'), ('10minutemail.net'), ('20minutemail.com'), ('anonbox.net'),
  ('tempmail.com'), ('temp-mail.org'), ('temp-mail.io'), ('tempmailo.com'), ('tempmail.net'),
  ('tempmail.plus'), ('tempmail.dev'), ('tmpmail.org'), ('tmpeml.com'), ('tmail.ws'), ('mail-temp.com'),
  ('mailtemp.info'), ('mailtemporaire.com'), ('mail-temporaire.fr'), ('correotemporal.org'),
  ('yopmail.com'), ('yopmail.net'), ('yopmail.fr'), ('cool.fr.nf'), ('jetable.fr.nf'), ('jetable.org'),
  ('throwawaymail.com'), ('trashmail.com'), ('trashmail.net'), ('trashmail.me'), ('trash-mail.com'),
  ('dispostable.com'), ('discard.email'), ('discardmail.com'), ('mytrashmail.com'), ('deadaddress.com'),
  ('getnada.com'), ('fakeinbox.com'), ('fakemailgenerator.com'), ('emailfake.com'), ('inboxkitten.com'),
  ('maildrop.cc'), ('mailnesia.com'), ('mailcatch.com'), ('mailnull.com'), ('spamgourmet.com'),
  ('moakt.com'), ('moakt.cc'), ('mohmal.com'), ('pokiemail.com'), ('spam4.me'), ('spambog.com'),
  ('spamex.com'), ('spamavert.com'), ('burnermail.io'), ('dropmail.me'), ('crazymailing.com'),
  ('mintemail.com'), ('mytemp.email'), ('emailondeck.com'), ('1secmail.com'), ('1secmail.net'),
  ('1secmail.org'), ('einrot.com'), ('kurzepost.de'), ('spoofmail.de'), ('trbvm.com'), ('tafmail.com'),
  ('boximail.com'), ('tempail.com'), ('disposablemail.com'), ('byom.de'), ('wegwerfemail.de'),
  ('wegwerfmail.de'), ('wegwerfmail.net'), ('wegwerfmail.org')
on conflict (domain) do nothing;

-- Real server-side enforcement of the deny-list above (the client-side
-- check in useAuthStore.ts's signUp is UX only - it stops a normal signup
-- form submit, but anyone can call Supabase Auth's REST API directly and
-- skip the browser entirely, so blocking disposable emails ONLY has to
-- happen here, in a Postgres "before user created" Auth Hook, to actually
-- hold). event->'user'->>'email' / the jsonb return shape (either '{}' to
-- allow, or {"error": {...}} to reject) are the exact contract Supabase
-- Auth calls this function with - see
-- https://supabase.com/docs/guides/auth/auth-hooks/before-user-created-hook.
--
-- Creating this function does NOT turn it on by itself - Auth Hooks are
-- wired up in the dashboard (Authentication -> Hooks -> "Before User
-- Created" -> Postgres function -> pick this one), not via SQL. There is
-- no API/CLI-free way to flip that toggle from here; whoever owns the
-- Supabase project has to do that one click.
create or replace function public.hook_reject_disposable_email(event jsonb)
returns jsonb
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_email text;
  v_domain text;
  v_hit int;
begin
  v_email := lower(event->'user'->>'email');
  v_domain := split_part(v_email, '@', 2);

  select count(*) into v_hit
  from public.disposable_email_domains
  where domain = v_domain;

  if v_hit > 0 then
    return jsonb_build_object(
      'error', jsonb_build_object(
        'http_code', 400,
        'message', 'Please sign up with a permanent email address - disposable/temporary email addresses are not allowed.'
      )
    );
  end if;

  return '{}'::jsonb;
end;
$$;

-- Only Supabase's own Auth service (which calls hooks as this role) may run
-- this - same reasoning/pattern as the revokes at the top of this section,
-- just the inverse (granting to auth instead of taking from everyone else).
grant execute on function public.hook_reject_disposable_email(jsonb) to supabase_auth_admin;
revoke execute on function public.hook_reject_disposable_email(jsonb) from public, anon, authenticated;
