-- Admin moderation: suspend users, track bans

alter table public.profiles
  add column if not exists is_suspended boolean not null default false,
  add column if not exists suspended_at timestamptz,
  add column if not exists suspension_reason text;

-- Prevent suspended users from inserting listings
create or replace function public.check_user_not_suspended()
returns trigger
language plpgsql
as $$
begin
  if exists (
    select 1 from public.profiles
    where id = auth.uid() and is_suspended = true
  ) then
    raise exception 'Account suspended';
  end if;
  return new;
end;
$$;

drop trigger if exists listings_check_suspended on public.listings;
create trigger listings_check_suspended
  before insert on public.listings
  for each row execute function public.check_user_not_suspended();
