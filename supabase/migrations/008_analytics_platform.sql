-- Tier 1–3: event tracking, UTM, audit log, quality/scam scores, alerts, district boosts

create table if not exists public.listing_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  listing_id uuid references public.listings (id) on delete set null,
  user_id uuid references public.profiles (id) on delete set null,
  session_id text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists listing_events_type_created_idx
  on public.listing_events (event_type, created_at desc);

create index if not exists listing_events_listing_idx
  on public.listing_events (listing_id, event_type, created_at desc);

create index if not exists listing_events_user_idx
  on public.listing_events (user_id, created_at desc);

alter table public.signup_surveys
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text;

create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles (id) on delete cascade,
  action text not null,
  target_type text,
  target_id text,
  details jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists admin_audit_log_created_idx
  on public.admin_audit_log (created_at desc);

create table if not exists public.rental_outcome_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  listing_id uuid references public.listings (id) on delete set null,
  agent_id uuid references public.agent_profiles (id) on delete set null,
  outcome text not null check (outcome in ('rented', 'still_looking', 'not_interested')),
  created_at timestamptz not null default now(),
  unique (user_id, listing_id)
);

create table if not exists public.alert_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  listing_id uuid not null references public.listings (id) on delete cascade,
  channel text not null default 'email',
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, listing_id, channel)
);

create table if not exists public.platform_flags (
  id uuid primary key default gen_random_uuid(),
  flag_type text not null,
  entity_type text not null,
  entity_id uuid not null,
  score smallint not null default 0,
  reason text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create index if not exists platform_flags_status_idx
  on public.platform_flags (status, created_at desc);

create table if not exists public.district_boost_config (
  district_slug text primary key,
  boost_score integer not null default 0,
  is_paid_featured boolean not null default false,
  sponsor_label text,
  updated_at timestamptz not null default now()
);

alter table public.listings
  add column if not exists quality_score smallint not null default 0,
  add column if not exists scam_risk_score smallint not null default 0;

alter table public.listing_events enable row level security;
alter table public.admin_audit_log enable row level security;
alter table public.rental_outcome_responses enable row level security;
alter table public.alert_notifications enable row level security;
alter table public.platform_flags enable row level security;
alter table public.district_boost_config enable row level security;

create policy "listing_events_insert"
  on public.listing_events for insert
  with check (true);

create policy "listing_events_admin_read"
  on public.listing_events for select
  using (public.is_admin());

create policy "listing_events_owner_read"
  on public.listing_events for select
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.owner_id = auth.uid()
    )
  );

create policy "admin_audit_log_admin"
  on public.admin_audit_log for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "rental_outcome_own"
  on public.rental_outcome_responses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "rental_outcome_admin_read"
  on public.rental_outcome_responses for select
  using (public.is_admin());

create policy "alert_notifications_own_read"
  on public.alert_notifications for select
  using (auth.uid() = user_id);

create policy "alert_notifications_service"
  on public.alert_notifications for insert
  with check (public.is_admin());

create policy "platform_flags_admin"
  on public.platform_flags for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "district_boost_public_read"
  on public.district_boost_config for select
  using (true);

create policy "district_boost_admin"
  on public.district_boost_config for all
  using (public.is_admin())
  with check (public.is_admin());

-- Seed default featured district boosts (organic; replace with paid later)
insert into public.district_boost_config (district_slug, boost_score, is_paid_featured)
values
  ('gasabo', 100, false),
  ('kicukiro', 95, false),
  ('nyarugenge', 90, false),
  ('bugesera', 70, false),
  ('musanze', 65, false),
  ('huye', 60, false)
on conflict (district_slug) do nothing;

create or replace function public.compute_listing_quality_score(p_listing_id uuid)
returns smallint
language plpgsql
security definer
set search_path = public
as $$
declare
  l record;
  score smallint := 0;
begin
  select * into l from public.listings where id = p_listing_id;
  if not found then return 0; end if;

  if l.title is not null and length(trim(l.title)) >= 10 then score := score + 15; end if;
  if l.description is not null and length(trim(l.description)) >= 50 then score := score + 20; end if;
  if l.sector is not null and length(trim(l.sector)) > 0 then score := score + 15; end if;
  if l.contact_phone is not null and length(trim(l.contact_phone)) >= 9 then score := score + 20; end if;
  if l.verification_status = 'verified' then score := score + 20; end if;
  if l.status = 'active' then score := score + 10; end if;

  return least(score, 100);
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_role public.user_role;
  ref_source text;
  district text;
  listing_pref text;
begin
  user_role := coalesce(
    (new.raw_user_meta_data ->> 'role')::public.user_role,
    'seeker'
  );

  insert into public.profiles (id, full_name, phone, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'phone'), ''), new.phone),
    new.email,
    user_role
  );

  if user_role = 'agent' then
    insert into public.agent_profiles (profile_id)
    values (new.id)
    on conflict (profile_id) do nothing;
  end if;

  ref_source := nullif(trim(new.raw_user_meta_data ->> 'referral_source'), '');
  district := coalesce(nullif(trim(new.raw_user_meta_data ->> 'primary_district'), ''), 'Unknown');
  listing_pref := nullif(trim(new.raw_user_meta_data ->> 'looking_for'), '');

  if ref_source is not null then
    insert into public.signup_surveys (
      user_id, account_type, referral_source, referral_source_other,
      primary_district, looking_for, phone, locale,
      utm_source, utm_medium, utm_campaign
    ) values (
      new.id, user_role, ref_source,
      nullif(trim(new.raw_user_meta_data ->> 'referral_source_other'), ''),
      district, listing_pref,
      nullif(trim(new.raw_user_meta_data ->> 'phone'), ''),
      nullif(trim(new.raw_user_meta_data ->> 'locale'), ''),
      nullif(trim(new.raw_user_meta_data ->> 'utm_source'), ''),
      nullif(trim(new.raw_user_meta_data ->> 'utm_medium'), ''),
      nullif(trim(new.raw_user_meta_data ->> 'utm_campaign'), '')
    );
  end if;

  if user_role = 'seeker' and listing_pref is not null then
    insert into public.user_preferences (user_id, preferred_listing_type, preferred_districts)
    values (new.id, listing_pref, array[district])
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;
