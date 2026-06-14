-- Listing lifecycle: rented / unlisted statuses + agent managers can update managed listings

alter type public.listing_status add value if not exists 'rented';
alter type public.listing_status add value if not exists 'unlisted';

create or replace function public.is_listing_agent(p_listing_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.listings l
    join public.agent_profiles ap on ap.id = l.agent_id
    where l.id = p_listing_id
      and ap.profile_id = auth.uid()
  );
$$;

create or replace function public.can_manage_listing(p_listing_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.listings l
    where l.id = p_listing_id
      and (
        l.owner_id = auth.uid()
        or public.is_listing_agent(l.id)
      )
  );
$$;

-- Agents: read / update / delete listings they manage
create policy "listings_agent_read_managed"
  on public.listings for select
  using (
    exists (
      select 1 from public.agent_profiles ap
      where ap.id = agent_id and ap.profile_id = auth.uid()
    )
  );

create policy "listings_agent_update_managed"
  on public.listings for update
  using (
    exists (
      select 1 from public.agent_profiles ap
      where ap.id = agent_id and ap.profile_id = auth.uid()
    )
  );

create policy "listings_agent_delete_managed"
  on public.listings for delete
  using (
    exists (
      select 1 from public.agent_profiles ap
      where ap.id = agent_id and ap.profile_id = auth.uid()
    )
  );

-- Agents: manage images on listings they manage
create policy "listing_images_agent_manage"
  on public.listing_images for all
  using (public.is_listing_agent(listing_id))
  with check (public.is_listing_agent(listing_id));

create policy "listing_images_agent_read"
  on public.listing_images for select
  using (public.is_listing_agent(listing_id));
