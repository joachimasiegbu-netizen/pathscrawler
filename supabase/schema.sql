-- PathScrawler - Roll a Job leaderboard schema
--
-- Run this once in your Supabase project's SQL Editor (Dashboard -> SQL
-- Editor -> New query -> paste this whole file -> Run). It's idempotent
-- (safe to re-run) via `if not exists` / `create or replace` / `drop ...
-- if exists` everywhere it matters.
--
-- Two tables:
--   rolls            - one permanent row per roll a signed-in player makes.
--                       The client only ever INSERTs here.
--   user_best_cards  - one row per player, auto-maintained by the trigger
--                       below every time a row lands in `rolls`: their top
--                       4 rolls by points, the score those sum to, their
--                       lifetime roll count, and their best tier ever. This
--                       is the table the leaderboard page actually reads -
--                       the client never aggregates `rolls` itself.

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
-- they have in `rolls`, every time a new roll of theirs lands. Simplest
-- correct approach for a dataset this size (a demo app's roll history) -
-- no incremental "is this roll good enough to bump something out of the
-- top 4" logic to get subtly wrong. security definer + a pinned search_path
-- so it can write user_best_cards regardless of the calling user's own RLS
-- grants on that table (the policies above are for direct client writes,
-- not this trusted system path).
create or replace function public.refresh_user_best_cards()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_top jsonb;
  v_score integer;
  v_total integer;
  v_best_tier text;
begin
  select coalesce(jsonb_agg(t), '[]'::jsonb) into v_top
  from (
    select career_id as "careerId", title, tier, points, rolled_at as "rolledAt"
    from public.rolls
    where user_id = new.user_id
    order by points desc, rolled_at desc
    limit 4
  ) t;

  select coalesce(sum(points), 0) into v_score
  from (
    select points from public.rolls
    where user_id = new.user_id
    order by points desc, rolled_at desc
    limit 4
  ) top4;

  select count(*) into v_total from public.rolls where user_id = new.user_id;

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
  where user_id = new.user_id
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
  values (new.user_id, new.email, v_score, v_top, v_total, v_best_tier, now())
  on conflict (user_id) do update set
    email = excluded.email,
    score = excluded.score,
    top_cards = excluded.top_cards,
    total_rolls = excluded.total_rolls,
    best_tier = excluded.best_tier,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists trg_refresh_user_best_cards on public.rolls;
create trigger trg_refresh_user_best_cards
  after insert on public.rolls
  for each row execute function public.refresh_user_best_cards();

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

-- One-off backfill for the best_tier bug above - the trigger only
-- recomputes a row when that player rolls again, so anyone whose
-- best_tier was already computed with the old (missing-Celestial) case
-- expression stays wrong until they roll again unless this runs once.
-- Safe to re-run any time (recomputes from scratch, same as the trigger).
update public.user_best_cards ubc
set best_tier = ranked.tier
from (
  select distinct on (user_id) user_id, tier
  from public.rolls
  order by user_id, case tier
    when 'celestial' then 7
    when 'mythic' then 6
    when 'legendary' then 5
    when 'epic' then 4
    when 'rare' then 3
    when 'uncommon' then 2
    else 1
  end desc
) ranked
where ubc.user_id = ranked.user_id
  and ubc.best_tier is distinct from ranked.tier;
