-- Listing source: owner-direct vs agent-managed

create type public.listing_source as enum ('owner_direct', 'agent_managed');
create type public.contact_display as enum ('owner', 'agent', 'both');

alter table public.listings
  add column if not exists listing_source public.listing_source not null default 'owner_direct',
  add column if not exists agent_id uuid references public.agent_profiles (id) on delete set null,
  add column if not exists contact_display public.contact_display not null default 'owner';

create index if not exists listings_agent_id_idx on public.listings (agent_id);
create index if not exists listings_listing_source_idx on public.listings (listing_source);

-- Agent-managed listings must have an agent
alter table public.listings
  add constraint listings_agent_managed_requires_agent
  check (
    listing_source = 'owner_direct'
    or agent_id is not null
  );
