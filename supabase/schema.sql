-- Double Crown — RSVP schema.
-- Safe to re-run: every statement is idempotent.

-- gen_random_uuid() lives in pgcrypto, which Supabase enables by default.
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.rsvps (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null,
  coming     boolean     not null,
  message    text,
  created_at timestamptz not null default now()
);

-- Guest rails. Keeps a troll from pasting a novel onto the crown wall.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'rsvps_name_len') then
    alter table public.rsvps
      add constraint rsvps_name_len
      check (btrim(name) <> '' and char_length(btrim(name)) <= 40);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'rsvps_message_len') then
    alter table public.rsvps
      add constraint rsvps_message_len
      check (message is null or char_length(message) <= 180);
  end if;
end $$;

-- Case-insensitive, whitespace-insensitive uniqueness on the name.
-- A functional unique index does double duty: it enforces "no duplicates"
-- AND is the index the duplicate pre-check query uses.
create unique index if not exists rsvps_name_unique_ci
  on public.rsvps (lower(btrim(name)));

-- The wall renders oldest-first; this index keeps that ordered read cheap.
create index if not exists rsvps_created_at_idx
  on public.rsvps (created_at);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.rsvps enable row level security;

-- Anyone with the link can read the wall.
drop policy if exists rsvps_public_read on public.rsvps;
create policy rsvps_public_read
  on public.rsvps
  for select
  to anon, authenticated
  using (true);

-- Anyone with the link can add exactly one crown (uniqueness is enforced by
-- the index above, not by the policy).
drop policy if exists rsvps_public_insert on public.rsvps;
create policy rsvps_public_insert
  on public.rsvps
  for insert
  to anon, authenticated
  with check (true);

-- Deliberately NO update or delete policy for anon/authenticated.
-- With RLS on and no matching policy, those statements affect zero rows.
-- Deletes happen only through the server action, which uses the service role
-- key (service_role bypasses RLS) after checking ADMIN_PASSPHRASE.

-- Least privilege at the GRANT layer too, as a second line of defence.
revoke all on public.rsvps from anon, authenticated;
grant select, insert on public.rsvps to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Realtime — live crown wall
-- ---------------------------------------------------------------------------
-- Default replica identity (primary key) is enough: INSERT events carry the
-- full new row, and DELETE events carry the id, which is all the wall needs
-- to drop a crown.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'rsvps'
  ) then
    alter publication supabase_realtime add table public.rsvps;
  end if;
end $$;
