-- Jalankan di Supabase: SQL Editor -> New query -> Run

create table if not exists public.messages (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  message text not null,
  ip_hash text
);

create table if not exists public.publications (
  id text primary key check (id ~ '^[a-z0-9]{6}$'),
  title text not null default 'Tanpa judul',
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  secret_hash text not null,       -- hash kode rahasia edit (kodenya sendiri tidak disimpan)
  size integer not null default 0,
  paths text[] not null default '{}',
  hidden boolean not null default false,
  ip_hash text
);
create index if not exists publications_ip_idx on public.publications (ip_hash, created_at);

create table if not exists public.reports (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  publication_id text not null references public.publications(id) on delete cascade,
  reason text,
  ip_hash text,
  unique (publication_id, ip_hash)
);

-- RLS aktif tanpa policy: hanya server (service role key) yang bisa baca/tulis.
alter table public.messages enable row level security;
alter table public.publications enable row level security;
alter table public.reports enable row level security;

-- Bucket privat untuk file situs (diakses lewat /s/<id>, bukan link langsung)
insert into storage.buckets (id, name, public) values ('sites', 'sites', false) on conflict do nothing;
