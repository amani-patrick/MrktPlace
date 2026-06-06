-- User preferences, agent onboarding, reviews, agent reports, feedback

create table if not exists public.user_preferences (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  preferred_listing_type text check (preferred_listing_type in ('rent', 'sale', 'both')),
  preferred_districts text[] not null default '{}',
  preferred_property_types text[] not null default '{}',
  max_budget numeric,
  updated_at timestamptz not null default now()
);

alter table public.agent_profiles
  add column if not exists onboarding_status text not null default 'pending'
    check (onboarding_status in ('pending', 'submitted', 'approved', 'rejected')),
  add column if not exists license_number text,
  add column if not exists license_doc_url text,
  add column if not exists id_doc_url text,
  add column if not exists years_experience smallint,
  add column if not exists rejection_reason text;

create table if not exists public.agent_reviews (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agent_profiles (id) on delete cascade,
  reviewer_id uuid not null references public.profiles (id) on delete cascade,
  listing_id uuid references public.listings (id) on delete set null,
  rating smallint not null check (rating >= 1 and rating <= 5),
  comment text not null default '',
  created_at timestamptz not null default now(),
  unique (reviewer_id, agent_id, listing_id)
);

create table if not exists public.agent_reports (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agent_profiles (id) on delete cascade,
  reporter_id uuid references public.profiles (id) on delete set null,
  reason text not null,
  details text,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists public.feedback_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  rating smallint check (rating >= 1 and rating <= 5),
  comment text,
  trigger_type text not null,
  page_path text,
  created_at timestamptz not null default now()
);

alter table public.user_preferences enable row level security;
alter table public.agent_reviews enable row level security;
alter table public.agent_reports enable row level security;
alter table public.feedback_submissions enable row level security;

create policy "user_preferences_own"
  on public.user_preferences for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "agent_reviews_public_read"
  on public.agent_reviews for select
  using (true);

create policy "agent_reviews_insert_auth"
  on public.agent_reviews for insert
  with check (auth.uid() = reviewer_id);

create policy "agent_reports_insert_auth"
  on public.agent_reports for insert
  with check (auth.uid() is not null);

create policy "agent_reports_admin_read"
  on public.agent_reports for select
  using (public.is_admin());

create policy "agent_reports_admin_update"
  on public.agent_reports for update
  using (public.is_admin());

create policy "feedback_insert_auth"
  on public.feedback_submissions for insert
  with check (auth.uid() is not null);

create policy "feedback_admin_read"
  on public.feedback_submissions for select
  using (public.is_admin());

-- Agents can update own onboarding fields while pending/submitted
create policy "agent_profiles_onboarding_update_own"
  on public.agent_profiles for update
  using (auth.uid() = profile_id and onboarding_status in ('pending', 'submitted', 'rejected'));

create policy "agent_profiles_admin_update"
  on public.agent_profiles for update
  using (public.is_admin());

-- Existing verified agents stay visible
update public.agent_profiles
set onboarding_status = 'approved'
where is_verified = true and onboarding_status = 'pending';
