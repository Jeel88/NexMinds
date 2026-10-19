-- ============================================================
-- NexMinds MyAptitude — Complete Supabase Database Setup & Fix
-- Run this script in: https://supabase.com -> SQL Editor -> New Query
-- ============================================================

-- 1. Create Profiles Table if it doesn't exist
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- 2. Safely ADD any missing columns to existing table (Fixes: column "avatar" does not exist)
alter table public.profiles add column if not exists name text;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists avatar text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists xp integer default 0 not null;
alter table public.profiles add column if not exists level integer default 1 not null;
alter table public.profiles add column if not exists streak integer default 0 not null;
alter table public.profiles add column if not exists today_xp integer default 0 not null;
alter table public.profiles add column if not exists sessions_count integer default 0 not null;
alter table public.profiles add column if not exists created_at timestamp with time zone default now();
alter table public.profiles add column if not exists updated_at timestamp with time zone default now();
alter table public.profiles add column if not exists ratings jsonb default '{"math": 1200, "puzzle": 1200, "logic": 1200, "memory": 1200}'::jsonb;
alter table public.profiles add column if not exists rating_trends jsonb default '{"math": "+0 —", "puzzle": "+0 —", "logic": "+0 —", "memory": "+0 —"}'::jsonb;
alter table public.profiles add column if not exists college text;
alter table public.profiles add column if not exists degree text;
alter table public.profiles add column if not exists age integer;
alter table public.profiles add column if not exists target_exam text;
alter table public.profiles add column if not exists city text;
alter table public.profiles add column if not exists bio text;

-- 3. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 4. Clean up any existing policies
drop policy if exists "Allow public read for leaderboard" on public.profiles;
drop policy if exists "Allow users to update own profile" on public.profiles;
drop policy if exists "Allow users to insert own profile" on public.profiles;
drop policy if exists "Allow users full access to own profile" on public.profiles;
drop policy if exists "Allow service role full access" on public.profiles;

-- 5. Recreate RLS Policies
-- Allow anyone to read profiles (needed for the Global Arena Leaderboard)
create policy "Allow public read for leaderboard"
  on public.profiles
  for select
  using (true);

-- Allow authenticated users full control over their own profile (insert, update, select)
create policy "Allow users full access to own profile"
  on public.profiles
  for all
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 6. Safe Automatic Trigger on New User Signup (Creates Profile Row Automatically)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id, 
    name, 
    full_name,
    email, 
    avatar, 
    avatar_url,
    xp, 
    level, 
    streak, 
    today_xp, 
    sessions_count, 
    ratings,
    rating_trends,
    created_at, 
    updated_at
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1), 'Thinker'),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1), 'Thinker'),
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', null),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', null),
    0,
    1,
    0,
    0,
    0,
    coalesce(new.raw_user_meta_data->'ratings', '{"math": 1200, "puzzle": 1200, "logic": 1200, "memory": 1200}'::jsonb),
    coalesce(new.raw_user_meta_data->'rating_trends', '{"math": "+0 —", "puzzle": "+0 —", "logic": "+0 —", "memory": "+0 —"}'::jsonb),
    now(),
    now()
  )
  on conflict (id) do update set
    name = coalesce(public.profiles.name, excluded.name),
    avatar = coalesce(public.profiles.avatar, excluded.avatar),
    email = coalesce(public.profiles.email, excluded.email),
    ratings = coalesce(public.profiles.ratings, excluded.ratings),
    rating_trends = coalesce(public.profiles.rating_trends, excluded.rating_trends),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 7. Backfill existing auth users into profiles table
insert into public.profiles (
  id, 
  name, 
  full_name,
  email, 
  avatar, 
  avatar_url,
  xp, 
  level, 
  streak, 
  today_xp, 
  sessions_count, 
  ratings,
  rating_trends,
  created_at, 
  updated_at
)
select 
  u.id,
  coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(u.email, '@', 1), 'Thinker'),
  coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(u.email, '@', 1), 'Thinker'),
  u.email,
  coalesce(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture', null),
  coalesce(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture', null),
  0,
  1,
  0,
  0,
  0,
  coalesce(u.raw_user_meta_data->'ratings', '{"math": 1200, "puzzle": 1200, "logic": 1200, "memory": 1200}'::jsonb),
  coalesce(u.raw_user_meta_data->'rating_trends', '{"math": "+0 —", "puzzle": "+0 —", "logic": "+0 —", "memory": "+0 —"}'::jsonb),
  now(),
  now()
from auth.users u
where not exists (
  select 1 from public.profiles p where p.id = u.id
)
on conflict (id) do nothing;

-- 8. Backfill default ratings for any existing profiles that have null ratings
update public.profiles
set
  ratings = coalesce(ratings, '{"math": 1200, "puzzle": 1200, "logic": 1200, "memory": 1200}'::jsonb),
  rating_trends = coalesce(rating_trends, '{"math": "+0 —", "puzzle": "+0 —", "logic": "+0 —", "memory": "+0 —"}'::jsonb)
where ratings is null or rating_trends is null;

