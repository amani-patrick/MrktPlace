-- Sign-up survey for growth analytics (referral source, district, intent)

create table if not exists public.signup_surveys (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  account_type public.user_role not null,
  referral_source text not null,
  referral_source_other text,
  primary_district text not null,
  looking_for text check (looking_for is null or looking_for in ('rent', 'buy', 'both')),
  phone text,
  locale text,
  created_at timestamptz not null default now()
);

create index if not exists signup_surveys_referral_idx
  on public.signup_surveys (referral_source);

create index if not exists signup_surveys_created_idx
  on public.signup_surveys (created_at desc);

alter table public.signup_surveys enable row level security;

create policy "signup_surveys_own_read"
  on public.signup_surveys for select
  using (auth.uid() = user_id);

create policy "signup_surveys_admin_read"
  on public.signup_surveys for select
  using (public.is_admin());

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
      user_id,
      account_type,
      referral_source,
      referral_source_other,
      primary_district,
      looking_for,
      phone,
      locale
    ) values (
      new.id,
      user_role,
      ref_source,
      nullif(trim(new.raw_user_meta_data ->> 'referral_source_other'), ''),
      district,
      listing_pref,
      nullif(trim(new.raw_user_meta_data ->> 'phone'), ''),
      nullif(trim(new.raw_user_meta_data ->> 'locale'), '')
    );
  end if;

  if user_role = 'seeker' and listing_pref is not null then
    insert into public.user_preferences (user_id, preferred_listing_type, preferred_districts)
    values (
      new.id,
      listing_pref,
      array[district]
    )
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;
