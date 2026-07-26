create extension if not exists pgcrypto;

create table if not exists public.project_leads (
  id uuid primary key default gen_random_uuid(),
  reference text not null,
  route_key text not null,
  route_label text not null,
  focus text not null,
  industry text not null,
  timeline text not null,
  problem_description text not null,
  contact_name text not null,
  company text,
  work_email text not null,
  source_url text,
  user_agent text,
  notification_status text not null default 'pending'
    check (notification_status in ('pending', 'sent', 'failed')),
  notification_provider_id text,
  created_at timestamptz not null default now()
);

create index if not exists project_leads_created_at_idx
  on public.project_leads (created_at desc);

create unique index if not exists project_leads_reference_idx
  on public.project_leads (reference);

create index if not exists project_leads_work_email_idx
  on public.project_leads (work_email);

alter table public.project_leads enable row level security;

revoke all on table public.project_leads from anon, authenticated;
grant select, insert, update on table public.project_leads to service_role;

comment on table public.project_leads is
  'Qualified B2B inquiries submitted through the Nouvex Scope Engine.';
