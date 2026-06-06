-- Rate limiting, alerts, storage for uploads

create table if not exists public.action_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  action_type text not null,
  created_at timestamptz not null default now()
);

create index if not exists action_logs_user_action_idx
  on public.action_logs (user_id, action_type, created_at desc);

alter table public.user_preferences
  add column if not exists alerts_enabled boolean not null default false;

alter table public.action_logs enable row level security;

create policy "action_logs_insert_own"
  on public.action_logs for insert
  with check (auth.uid() = user_id);

create policy "action_logs_read_own"
  on public.action_logs for select
  using (auth.uid() = user_id);

-- Agent documents bucket
insert into storage.buckets (id, name, public)
values ('agent-documents', 'agent-documents', false)
on conflict (id) do nothing;

create policy "agent_documents_auth_upload"
  on storage.objects for insert
  with check (
    bucket_id = 'agent-documents'
    and auth.role() = 'authenticated'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "agent_documents_owner_read"
  on storage.objects for select
  using (
    bucket_id = 'agent-documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "agent_documents_admin_read"
  on storage.objects for select
  using (
    bucket_id = 'agent-documents'
    and public.is_admin()
  );
