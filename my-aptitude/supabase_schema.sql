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
alter table public.profiles add column if not exists weekly_xp jsonb default '{"Mon": 0, "Tue": 0, "Wed": 0, "Thu": 0, "Fri": 0, "Sat": 0, "Sun": 0}'::jsonb;

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

-- ==============================================================================
-- 9. DYNAMIC QUESTION BANK TABLE
-- ==============================================================================
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  category text not null,               -- 'math', 'puzzle', 'logic', 'memory'
  question text not null,
  options jsonb not null,               -- JSON array of 4 choices e.g. ["A", "B", "C", "D"]
  answer_index integer not null default 0, -- 0-based index of correct option
  explanation text default '',
  difficulty text default 'medium',      -- 'easy', 'medium', 'hard'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Unique index to prevent duplicate seeds
create unique index if not exists idx_questions_category_question on public.questions (category, question);
create index if not exists idx_questions_category on public.questions (category);

-- Enable RLS
alter table public.questions enable row level security;

-- Policies: Anyone can view questions for quizzes
drop policy if exists "Allow public read questions" on public.questions;
create policy "Allow public read questions" 
  on public.questions 
  for select 
  using (true);

-- Allow authenticated users / service role to insert or update questions
drop policy if exists "Allow authenticated insert questions" on public.questions;
create policy "Allow authenticated insert questions" 
  on public.questions 
  for insert 
  with check (true);

-- ==============================================================================
-- 10. SEED QUESTIONS FOR DYNAMIC QUIZ BANK
-- ==============================================================================
insert into public.questions (category, question, options, answer_index, explanation, difficulty)
values
  -- MATH
  ('math', 'A car travels 120 km in 2 hours. What is its average speed?', '["50 km/h", "60 km/h", "70 km/h", "80 km/h"]'::jsonb, 1, '120 km ÷ 2 h = 60 km/h', 'easy'),
  ('math', 'What is 15% of 240?', '["32", "36", "40", "48"]'::jsonb, 1, '15/100 × 240 = 36', 'easy'),
  ('math', '5 workers finish a job in 8 days. How long will 10 workers take?', '["6 days", "4 days", "3 days", "5 days"]'::jsonb, 1, 'Total work = 5 × 8 = 40 man-days. 10 workers take 40 ÷ 10 = 4 days.', 'medium'),
  ('math', 'A 200 m train moves at 54 km/h. How much time will it take to cross a pole?', '["10 sec", "12 sec", "13.3 sec", "15 sec"]'::jsonb, 2, '54 km/h = 15 m/s. Time = 200 ÷ 15 ≈ 13.3 sec.', 'medium'),
  ('math', 'Goods marked 25% above cost price are sold at a 10% discount. What is the profit %?', '["10%", "12.5%", "15%", "20%"]'::jsonb, 1, 'SP = 1.25 × 0.9 × CP = 1.125 CP → 12.5% profit.', 'medium'),
  ('math', 'If the ratio of A:B is 3:5 and B:C is 2:3, what is A:C?', '["3:5", "2:5", "6:15", "1:2"]'::jsonb, 1, 'A/C = (3/5) × (2/3) = 6/15 = 2/5.', 'medium'),
  ('math', 'The average of 5 consecutive integers is 24. What is the largest integer?', '["24", "25", "26", "28"]'::jsonb, 2, 'Consecutive numbers centered around 24 are 22, 23, 24, 25, 26. Largest is 26.', 'medium'),
  ('math', 'A sum triples itself in 8 years at simple interest. What is the annual interest rate?', '["20%", "25%", "15%", "12.5%"]'::jsonb, 1, 'Simple Interest = 2P in 8 years. Rate = (2P × 100) / (P × 8) = 25%.', 'hard'),

  -- PUZZLE
  ('puzzle', 'What comes next in the sequence: 2, 4, 8, 16, __ ?', '["24", "28", "32", "36"]'::jsonb, 2, 'Each number doubles the previous term: 16 × 2 = 32.', 'easy'),
  ('puzzle', 'Find the missing number: 1, 4, 9, 16, 25, __ ?', '["30", "35", "36", "40"]'::jsonb, 2, 'Perfect squares: 1², 2², 3², 4², 5², 6² = 36.', 'easy'),
  ('puzzle', 'Which fills the blank: 3, 6, 11, 18, 27, __ ?', '["36", "38", "40", "35"]'::jsonb, 1, 'Differences are +3, +5, +7, +9, +11 → 27 + 11 = 38.', 'medium'),
  ('puzzle', 'Letter series: A, C, F, J, O, __ ?', '["T", "U", "V", "W"]'::jsonb, 1, 'Gaps increase: +2, +3, +4, +5, +6 → O(15) + 6 = U(21).', 'medium'),
  ('puzzle', 'Find the odd one out: 4, 8, 12, 15, 16', '["4", "8", "12", "15"]'::jsonb, 3, '15 is not a multiple of 4; all others are multiples of 4.', 'easy'),
  ('puzzle', 'What comes next in the Fibonacci series: 1, 1, 2, 3, 5, 8, __ ?', '["11", "12", "13", "15"]'::jsonb, 2, 'Sum of preceding two terms: 5 + 8 = 13.', 'easy'),
  ('puzzle', 'Find the missing letter: B, E, H, K, __ ?', '["M", "N", "O", "P"]'::jsonb, 1, 'Positions skip by +3: 2, 5, 8, 11, 14 (N).', 'medium'),
  ('puzzle', 'Which is the odd one out: 27, 64, 125, 144, 216?', '["27", "64", "144", "216"]'::jsonb, 2, '144 is 12² (square), whereas 27, 64, 125, 216 are all cubes (3³, 4³, 5³, 6³).', 'hard'),

  -- LOGIC
  ('logic', 'All cats are animals. Some animals are pets.\n"Some cats are pets" is:', '["Definitely True", "Definitely False", "Cannot be determined", "Always False"]'::jsonb, 2, 'We do not know if the pets overlap with the cats portion of animals.', 'medium'),
  ('logic', 'If A > B and B > C, then how does A relate to C?', '["A < C", "A = C", "A > C", "Cannot say"]'::jsonb, 2, 'By the transitive property of inequality, A > B > C implies A > C.', 'easy'),
  ('logic', 'Ram is taller than Shyam. Mohan is shorter than Shyam. Who is the tallest?', '["Shyam", "Mohan", "Ram", "Cannot say"]'::jsonb, 2, 'Ram > Shyam > Mohan → Ram is the tallest.', 'easy'),
  ('logic', 'All roses are flowers. Some flowers are red.\n"Some roses are red" is:', '["True", "Maybe True", "False", "Cannot be determined"]'::jsonb, 3, 'Red flowers may or may not include roses — cannot be concluded with certainty.', 'medium'),
  ('logic', 'P is father of Q. Q is sister of R. What is P to R?', '["Uncle", "Brother", "Father", "Grandfather"]'::jsonb, 2, 'P is the father of Q, and Q and R are siblings, so P is father of R.', 'easy'),
  ('logic', 'Pointing to a photograph, Rohit says: "She is daughter of my grandfather''s only son." Who is she?', '["Sister", "Mother", "Aunt", "Daughter"]'::jsonb, 0, 'Grandfather''s only son is Rohit''s father. The daughter of Rohit''s father is his sister.', 'medium'),
  ('logic', 'If South-East becomes North and North-East becomes West, what will West become?', '["South-East", "South-West", "North-West", "East"]'::jsonb, 0, 'Each cardinal direction shifts 135° clockwise. West shifted 135° clockwise points South-East.', 'hard'),
  ('logic', 'Statements: No birds are dogs. All dogs are quadrupeds.\nConclusion: "No birds are quadrupeds" is:', '["Definitely True", "Definitely False", "Cannot be determined", "Always True"]'::jsonb, 2, 'Birds cannot be dogs, but they could still potentially be in the quadrupeds category.', 'hard'),

  -- MEMORY / NUMERICAL
  ('memory', 'What is the next prime number after 13?', '["15", "16", "17", "19"]'::jsonb, 2, '14 = 2×7, 15 = 3×5, 16 = 2⁴. 17 has no positive divisors other than 1 and itself.', 'easy'),
  ('memory', 'What is the square root of 2025?', '["40", "42", "45", "50"]'::jsonb, 2, '45 × 45 = 2025.', 'medium'),
  ('memory', 'If 3x + 7 = 22, what is the value of x?', '["4", "5", "6", "3"]'::jsonb, 1, '3x = 22 - 7 = 15 → x = 15 / 3 = 5.', 'easy'),
  ('memory', 'What is the LCM of 4, 6 and 8?', '["16", "24", "48", "12"]'::jsonb, 1, 'Multiples of 8: 8, 16, 24. 24 is divisible by both 4 and 6. LCM is 24.', 'easy'),
  ('memory', 'Calculate: 256 × 0.25 = ?', '["54", "60", "64", "68"]'::jsonb, 2, 'Multiplying by 0.25 is equivalent to dividing by 4: 256 ÷ 4 = 64.', 'easy'),
  ('memory', 'What is 18% of 50?', '["9", "8", "10", "12"]'::jsonb, 0, 'Percentage is reversible: 18% of 50 = 50% of 18 = 9.', 'medium'),
  ('memory', 'If 2^x = 128, what is x?', '["5", "6", "7", "8"]'::jsonb, 2, '2⁵ = 32, 2⁶ = 64, 2⁷ = 128. So x = 7.', 'medium'),
  ('memory', 'What is the cube of 12 (12³)?', '["1440", "1728", "1688", "1824"]'::jsonb, 1, '12 × 12 = 144, and 144 × 12 = 1728.', 'hard')
on conflict (category, question) do nothing;


