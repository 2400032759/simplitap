-- FINAL REPAIR SCRIPT
-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Nuke everything related to contacts to start fresh and remove bad tables
DROP TABLE IF EXISTS public.contacts_v2;
DROP TABLE IF EXISTS public.contacts;

-- 2. Create the table with EXPLICIT text type for user_id
create table public.contacts_v2 (
  id uuid default gen_random_uuid() primary key,
  user_id text not null, -- IS TEXT, NOT UUID
  name text,
  phone text,
  email text,
  job_title text,
  company text,
  website text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable Security
alter table public.contacts_v2 enable row level security;

-- 4. Create Policies (Casting strictly to text)
create policy "allow_select" on public.contacts_v2 for select using ( auth.uid()::text = user_id );
create policy "allow_insert" on public.contacts_v2 for insert with check ( auth.uid()::text = user_id );
create policy "allow_update" on public.contacts_v2 for update using ( auth.uid()::text = user_id );
create policy "allow_delete" on public.contacts_v2 for delete using ( auth.uid()::text = user_id );
