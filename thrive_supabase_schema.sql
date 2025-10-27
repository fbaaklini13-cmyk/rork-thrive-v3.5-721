-- =====================================================
-- Thrive App — Unified Supabase Schema for Integrations
-- =====================================================

-- Reference: auth.users (built-in)
-- We'll link user_id (UUID) to auth.users.id

-- ---------- PROFILES ----------
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  full_name text,
  dob date,
  sex text check (sex in ('male','female','other') or sex is null),
  height_cm numeric(5,2),
  weight_kg numeric(6,2),
  primary_sport text,
  timezone text default 'UTC'
);

create trigger trg_profiles_updated
before update on public.profiles
for each row execute procedure moddatetime(updated_at);

-- ---------- OAUTH TOKENS ----------
create table if not exists public.oauth_tokens (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null check (provider in ('strava','oura','fitbit','garmin','whoop')),
  provider_user_id text,
  access_token text not null,
  refresh_token text,
  expires_at timestamptz,
  scopes text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, provider)
);

create index if not exists idx_oauth_tokens_user_provider on public.oauth_tokens(user_id, provider);

create trigger trg_oauth_tokens_updated
before update on public.oauth_tokens
for each row execute procedure moddatetime(updated_at);

-- ---------- EXERCISES (reference for strength sets) ----------
create table if not exists public.exercises (
  id bigserial primary key,
  slug text unique,
  name text not null,
  muscle_groups text[] not null, -- e.g., {'chest','triceps'}
  equipment text[],
  is_cardio boolean default false
);

-- ---------- WORKOUTS ----------
create table if not exists public.workouts (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text check (provider in ('manual','apple_health','health_connect','strava','oura','fitbit','garmin','whoop')),
  type text not null, -- run, ride, strength, swim, sport_basketball, etc.
  name text,
  start_at timestamptz not null,
  end_at timestamptz,
  duration_s integer,
  distance_m integer,
  energy_kcal integer,
  avg_hr integer,
  max_hr integer,
  route_geojson jsonb, -- for GPS traces if available
  source_id text, -- provider activity id
  created_at timestamptz default now()
);

create index if not exists idx_workouts_user_time on public.workouts(user_id, start_at desc);
create index if not exists idx_workouts_user_type on public.workouts(user_id, type);

-- ---------- WORKOUT SETS (strength details) ----------
create table if not exists public.workout_sets (
  id bigserial primary key,
  workout_id bigint not null references public.workouts(id) on delete cascade,
  exercise_id bigint references public.exercises(id),
  muscle_groups text[] not null, -- duplicated for quick heatmap calc
  set_index int not null,
  weight_kg numeric(6,2),
  reps int,
  rir int, -- reps in reserve
  tempo text
);

create index if not exists idx_workout_sets_workout on public.workout_sets(workout_id);

-- ---------- SLEEP SESSIONS ----------
create table if not exists public.sleep_sessions (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text check (provider in ('apple_health','health_connect','oura','fitbit','garmin','whoop')),
  start_at timestamptz not null,
  end_at timestamptz not null,
  duration_s int generated always as (extract(epoch from (end_at - start_at))) stored,
  stages_json jsonb, -- e.g., {light: minutes, deep: minutes, rem: minutes, awake: minutes}
  score int, -- e.g., Oura/Whoop sleep score
  source_id text,
  created_at timestamptz default now()
);

create index if not exists idx_sleep_user_time on public.sleep_sessions(user_id, start_at desc);

-- ---------- DAILY METRICS ----------
create table if not exists public.daily_metrics (
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  steps int,
  active_kcal int,
  resting_kcal int,
  floors int,
  hrv_ms int,
  resting_hr int,
  vo2max numeric(5,2),
  strain numeric(5,2),
  recovery numeric(5,2),
  readiness numeric(5,2),
  stress numeric(5,2),
  body_battery numeric(5,2),
  provider text, -- last writer (for provenance)
  updated_at timestamptz default now(),
  primary key (user_id, date)
);

create index if not exists idx_daily_metrics_user on public.daily_metrics(user_id);

create trigger trg_daily_metrics_updated
before update on public.daily_metrics
for each row execute procedure moddatetime(updated_at);

-- ---------- PERMISSIONS LOG ----------
create table if not exists public.permissions_log (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  granted_scopes text[],
  granted_at timestamptz default now()
);

-- ---------- MATERIALIZED VIEW: MUSCLE VOLUME (for heatmap) ----------
-- Aggregates weekly/monthly volume per muscle group for quick heatmap rendering.
create table if not exists public.muscle_volume_cache (
  user_id uuid not null references auth.users(id) on delete cascade,
  bucket text not null check (bucket in ('7d','30d')), -- time window
  muscle text not null,
  total_volume numeric(12,2), -- sum(weight*reps) or another volume metric
  updated_at timestamptz default now(),
  primary key(user_id, bucket, muscle)
);

-- ---------- RLS POLICIES ----------
alter table public.profiles enable row level security;
alter table public.oauth_tokens enable row level security;
alter table public.exercises enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_sets enable row level security;
alter table public.sleep_sessions enable row level security;
alter table public.daily_metrics enable row level security;
alter table public.permissions_log enable row level security;
alter table public.muscle_volume_cache enable row level security;

-- Profiles: user can read/update own profile
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = user_id);
create policy "profiles_upsert_own" on public.profiles
  for insert with check (auth.uid() = user_id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = user_id);

-- OAuth tokens: user can read their provider connection (mask tokens at API layer), insert/update own
create policy "oauth_tokens_select_own" on public.oauth_tokens
  for select using (auth.uid() = user_id);
create policy "oauth_tokens_upsert_own" on public.oauth_tokens
  for insert with check (auth.uid() = user_id);
create policy "oauth_tokens_update_own" on public.oauth_tokens
  for update using (auth.uid() = user_id);
-- Optionally: disallow select of access_token/refresh_token by anon key (enforce in API)

-- Exercises: readable by all authenticated users (managed content)
create policy "exercises_read_all" on public.exercises
  for select using (true);

-- Workouts: user can CRUD own workouts
create policy "workouts_select_own" on public.workouts
  for select using (auth.uid() = user_id);
create policy "workouts_insert_own" on public.workouts
  for insert with check (auth.uid() = user_id);
create policy "workouts_update_own" on public.workouts
  for update using (auth.uid() = user_id);
create policy "workouts_delete_own" on public.workouts
  for delete using (auth.uid() = user_id);

-- Workout sets: same as workout owner
create policy "workout_sets_rw_own" on public.workout_sets
  for all using (
    exists(select 1 from public.workouts w 
           where w.id = workout_sets.workout_id and w.user_id = auth.uid())
  ) with check (
    exists(select 1 from public.workouts w 
           where w.id = workout_sets.workout_id and w.user_id = auth.uid())
  );

-- Sleep sessions: user owns
create policy "sleep_sessions_rw_own" on public.sleep_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Daily metrics: user owns
create policy "daily_metrics_rw_own" on public.daily_metrics
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Permissions log: user owns
create policy "permissions_log_rw_own" on public.permissions_log
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Muscle volume cache: user owns
create policy "muscle_volume_cache_rw_own" on public.muscle_volume_cache
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- UTILITIES ----------
-- Helper: auto-updated timestamp trigger function (if not present)
do $$ begin
  create extension if not exists moddatetime;
exception when others then
  -- ignore if not available; on some stacks use a custom function instead
  null;
end $$;
