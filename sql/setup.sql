-- ═══════════════════════════════════════════════════════
--  FORGE — Supabase Setup
--  À exécuter dans : Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════

-- 1. Table profils publics (visible dans la recherche réseau)
create table if not exists profiles (
  user_id  uuid references auth.users(id) on delete cascade primary key,
  email    text unique not null,
  prenom   text    default '',
  nom      text    default '',
  username text    default '',
  since    date    default current_date
);

alter table profiles enable row level security;

-- Tout le monde peut lire les profils (réseau social)
create policy "profiles_select_all" on profiles
  for select using (true);

-- Chaque utilisateur gère son propre profil
create policy "profiles_manage_own" on profiles
  for all using (auth.uid() = user_id);


-- 2. Table données utilisateur (profil app, séances, programme…)
create table if not exists user_data (
  id         bigint generated always as identity primary key,
  user_id    uuid references auth.users(id) on delete cascade not null,
  key        text not null,
  value      jsonb,
  updated_at timestamptz default now(),
  unique(user_id, key)
);

alter table user_data enable row level security;

-- Chaque utilisateur n'accède qu'à ses propres données
create policy "user_data_manage_own" on user_data
  for all using (auth.uid() = user_id);


-- 3. Index pour les performances
create index if not exists user_data_user_key_idx on user_data(user_id, key);
create index if not exists profiles_email_idx on profiles(email);
