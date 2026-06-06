-- Admin RLS: let seeded admins read/update moderation data via anon client + session

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Listings: admins see all statuses and can moderate
create policy "listings_admin_read"
  on public.listings for select
  using (public.is_admin());

create policy "listings_admin_update"
  on public.listings for update
  using (public.is_admin());

-- Listing images: admins can read images for any listing
create policy "listing_images_admin_read"
  on public.listing_images for select
  using (public.is_admin());

-- Reports: admins manage the queue
create policy "reports_admin_read"
  on public.reports for select
  using (public.is_admin());

create policy "reports_admin_update"
  on public.reports for update
  using (public.is_admin());

-- Profiles: admins can suspend users
create policy "profiles_admin_update"
  on public.profiles for update
  using (public.is_admin());

-- Auto-create agent profile when signing up as agent
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_role public.user_role;
begin
  user_role := coalesce(
    (new.raw_user_meta_data ->> 'role')::public.user_role,
    'seeker'
  );

  insert into public.profiles (id, full_name, phone, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.phone,
    new.email,
    user_role
  );

  if user_role = 'agent' then
    insert into public.agent_profiles (profile_id)
    values (new.id)
    on conflict (profile_id) do nothing;
  end if;

  return new;
end;
$$;
