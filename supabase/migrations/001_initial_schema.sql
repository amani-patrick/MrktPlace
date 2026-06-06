-- Amnii Housing Marketplace — initial schema

create extension if not exists "pgcrypto";

-- Enums
create type public.user_role as enum ('seeker', 'owner', 'agent', 'admin');
create type public.property_type as enum (
  'apartment', 'house', 'room', 'studio', 'commercial',
  'office', 'land', 'warehouse', 'mixed_use'
);
create type public.listing_type as enum (
  'rent', 'sale', 'lease', 'short_stay', 'commercial_rent'
);
create type public.listing_status as enum (
  'draft', 'pending', 'active', 'paused', 'rejected'
);
create type public.verification_status as enum (
  'unverified', 'pending', 'verified', 'rejected'
);

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  email text,
  role public.user_role not null default 'seeker',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Agent profiles
create table public.agent_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles (id) on delete cascade,
  bio text,
  agency text,
  agency_short text,
  serves_in text[] not null default '{}',
  district text,
  languages text[] not null default '{}',
  is_verified boolean not null default false,
  total_views integer not null default 0,
  response_time_hours numeric,
  rating numeric check (rating is null or (rating >= 0 and rating <= 5)),
  rent_count integer not null default 0,
  sale_count integer not null default 0,
  whatsapp text,
  badges text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Listings
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles (id) on delete set null,
  title text not null,
  description text not null default '',
  property_type public.property_type not null,
  listing_type public.listing_type not null,
  price numeric not null check (price >= 0),
  currency text not null default 'RWF',
  bedrooms smallint,
  bathrooms smallint,
  parking_spaces smallint,
  square_meters numeric,
  district text not null,
  sector text not null,
  cell text,
  latitude numeric,
  longitude numeric,
  contact_phone text not null,
  whatsapp_number text,
  features text[] not null default '{}',
  status public.listing_status not null default 'active',
  verification_status public.verification_status not null default 'unverified',
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index listings_status_idx on public.listings (status);
create index listings_district_idx on public.listings (district);
create index listings_listing_type_idx on public.listings (listing_type);
create index listings_property_type_idx on public.listings (property_type);
create index listings_created_at_idx on public.listings (created_at desc);

-- Listing images
create table public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index listing_images_listing_id_idx on public.listing_images (listing_id, sort_order);

-- Favorites
create table public.favorites (
  user_id uuid not null references public.profiles (id) on delete cascade,
  listing_id uuid not null references public.listings (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

-- Reports
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  reporter_id uuid references public.profiles (id) on delete set null,
  reason text not null,
  details text,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

-- Listing views
create table public.listing_views (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  viewer_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.phone,
    new.email,
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'seeker')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger listings_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();

create trigger agent_profiles_updated_at
  before update on public.agent_profiles
  for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.agent_profiles enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.favorites enable row level security;
alter table public.reports enable row level security;
alter table public.listing_views enable row level security;

-- Profiles: public read (for agent cards), users update own
create policy "profiles_public_read"
  on public.profiles for select
  using (true);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Agent profiles: public read
create policy "agent_profiles_public_read"
  on public.agent_profiles for select
  using (true);

create policy "agent_profiles_update_own"
  on public.agent_profiles for update
  using (auth.uid() = profile_id);

-- Listings: public read active, owners manage own
create policy "listings_public_read_active"
  on public.listings for select
  using (status = 'active');

create policy "listings_insert_own"
  on public.listings for insert
  with check (auth.uid() = owner_id);

create policy "listings_update_own"
  on public.listings for update
  using (auth.uid() = owner_id);

create policy "listings_delete_own"
  on public.listings for delete
  using (auth.uid() = owner_id);

-- Listing images: public read for active listings
create policy "listing_images_public_read"
  on public.listing_images for select
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.status = 'active'
    )
  );

create policy "listing_images_owner_manage"
  on public.listing_images for all
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.owner_id = auth.uid()
    )
  );

-- Favorites: users manage own
create policy "favorites_own"
  on public.favorites for all
  using (auth.uid() = user_id);

-- Reports: authenticated users can create
create policy "reports_insert_auth"
  on public.reports for insert
  with check (auth.uid() is not null);

create policy "reports_read_own"
  on public.reports for select
  using (auth.uid() = reporter_id);

-- Listing views: anyone can insert (anonymous views allowed)
create policy "listing_views_insert"
  on public.listing_views for insert
  with check (true);

-- Storage bucket for listing photos
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

create policy "listing_images_storage_public_read"
  on storage.objects for select
  using (bucket_id = 'listing-images');

create policy "listing_images_storage_auth_upload"
  on storage.objects for insert
  with check (
    bucket_id = 'listing-images'
    and auth.role() = 'authenticated'
  );

create policy "listing_images_storage_owner_update"
  on storage.objects for update
  using (
    bucket_id = 'listing-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "listing_images_storage_owner_delete"
  on storage.objects for delete
  using (
    bucket_id = 'listing-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
