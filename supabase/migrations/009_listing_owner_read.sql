-- Owners (and agents via listing ownership) can view their own listings before admin approval

create policy "listings_owner_read_own"
  on public.listings for select
  using (auth.uid() = owner_id);

create policy "listing_images_owner_read"
  on public.listing_images for select
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.owner_id = auth.uid()
    )
  );
