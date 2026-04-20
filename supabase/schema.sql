-- =====================================================================
-- SCHEMA MON BUDGET — Supabase
-- À exécuter dans l'éditeur SQL de Supabase
-- =====================================================================

-- Enable extensions
create extension if not exists "uuid-ossp";

-- =====================================================================
-- TABLES
-- =====================================================================

-- Table des enveloppes
create table if not exists public.envelopes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  budget numeric(10, 2) not null default 0,
  color text not null default '#6366f1',
  position int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists envelopes_user_id_idx on public.envelopes(user_id);
create index if not exists envelopes_position_idx on public.envelopes(user_id, position);

-- Table des dépenses
create table if not exists public.expenses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  envelope_id uuid references public.envelopes(id) on delete set null,
  amount numeric(10, 2) not null check (amount > 0),
  note text,
  spent_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists expenses_user_id_idx on public.expenses(user_id);
create index if not exists expenses_spent_at_idx on public.expenses(user_id, spent_at desc);
create index if not exists expenses_envelope_id_idx on public.expenses(envelope_id);

-- =====================================================================
-- ROW LEVEL SECURITY (chaque utilisateur ne voit que ses propres données)
-- =====================================================================

alter table public.envelopes enable row level security;
alter table public.expenses enable row level security;

-- Policies ENVELOPPES
drop policy if exists "envelopes_select_own" on public.envelopes;
create policy "envelopes_select_own" on public.envelopes
  for select using (auth.uid() = user_id);

drop policy if exists "envelopes_insert_own" on public.envelopes;
create policy "envelopes_insert_own" on public.envelopes
  for insert with check (auth.uid() = user_id);

drop policy if exists "envelopes_update_own" on public.envelopes;
create policy "envelopes_update_own" on public.envelopes
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "envelopes_delete_own" on public.envelopes;
create policy "envelopes_delete_own" on public.envelopes
  for delete using (auth.uid() = user_id);

-- Policies DEPENSES
drop policy if exists "expenses_select_own" on public.expenses;
create policy "expenses_select_own" on public.expenses
  for select using (auth.uid() = user_id);

drop policy if exists "expenses_insert_own" on public.expenses;
create policy "expenses_insert_own" on public.expenses
  for insert with check (auth.uid() = user_id);

drop policy if exists "expenses_update_own" on public.expenses;
create policy "expenses_update_own" on public.expenses
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "expenses_delete_own" on public.expenses;
create policy "expenses_delete_own" on public.expenses
  for delete using (auth.uid() = user_id);
