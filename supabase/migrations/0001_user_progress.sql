-- Schema for the user_progress table used by the chemistry-flashcards
-- (and other) features for cloud-side per-user progress sync.
--
-- This file is the source-of-truth for the table; the live Supabase project
-- must match it. Run this manually against any Supabase project that needs
-- it (the repo has no Supabase CLI integration yet).

create table if not exists public.user_progress (
    user_id        uuid           not null references auth.users(id) on delete cascade,
    feature_type   text           not null,
    item_id        text           not null,
    data           jsonb          not null,
    mastery_level  text,
    next_review_at timestamptz,
    updated_at     timestamptz    not null default now(),
    primary key (user_id, feature_type, item_id)
);

create index if not exists user_progress_user_feature_idx
    on public.user_progress (user_id, feature_type);

create index if not exists user_progress_next_review_idx
    on public.user_progress (user_id, feature_type, next_review_at)
    where next_review_at is not null;

-- Row-Level Security: a user can only ever read or write their own rows.
alter table public.user_progress enable row level security;

drop policy if exists "user_progress_select_own" on public.user_progress;
create policy "user_progress_select_own"
    on public.user_progress
    for select
    using (auth.uid() = user_id);

drop policy if exists "user_progress_insert_own" on public.user_progress;
create policy "user_progress_insert_own"
    on public.user_progress
    for insert
    with check (auth.uid() = user_id);

drop policy if exists "user_progress_update_own" on public.user_progress;
create policy "user_progress_update_own"
    on public.user_progress
    for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

drop policy if exists "user_progress_delete_own" on public.user_progress;
create policy "user_progress_delete_own"
    on public.user_progress
    for delete
    using (auth.uid() = user_id);

-- Automatic updated_at maintenance.
create or replace function public.touch_user_progress_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at := now();
    return new;
end;
$$;

drop trigger if exists user_progress_touch_updated_at on public.user_progress;
create trigger user_progress_touch_updated_at
    before update on public.user_progress
    for each row
    execute function public.touch_user_progress_updated_at();

-- Realtime: publish row changes so other devices listening on a Realtime
-- channel pick up updates immediately. The supabase_realtime publication
-- exists by default in every Supabase project.
do $$
begin
    if not exists (
        select 1 from pg_publication_tables
        where pubname = 'supabase_realtime'
            and schemaname = 'public'
            and tablename = 'user_progress'
    ) then
        execute 'alter publication supabase_realtime add table public.user_progress';
    end if;
end $$;

-- REPLICA IDENTITY FULL so Realtime payloads include the full row, not just
-- the primary key.
alter table public.user_progress replica identity full;
