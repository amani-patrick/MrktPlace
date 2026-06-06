-- Let signed-in users read their own events (e.g. recent searches in seeker portal)

create policy "listing_events_user_read_own"
  on public.listing_events for select
  using (auth.uid() = user_id);
