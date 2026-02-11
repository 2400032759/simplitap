-- Create a NEW contacts table version 2 to bypass the stuck "uuid" issue on the old table
-- This avoids needing to Drop the old table, and ensures a clean slate with correct TEXT user_id.

create table public.contacts_v2 (
  id uuid default gen_random_uuid() primary key,
  user_id text not null, -- CORRECT: TEXT for Clerk compatibility
  name text,
  phone text,
  email text,
  job_title text,
  company text,
  website text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.contacts_v2 enable row level security;

-- Policies
create policy "Users can view their own contacts_v2"
  on public.contacts_v2 for select
  using ( auth.uid()::text = user_id );

create policy "Users can insert their own contacts_v2"
  on public.contacts_v2 for insert
  with check ( auth.uid()::text = user_id );

create policy "Users can update their own contacts_v2"
  on public.contacts_v2 for update
  using ( auth.uid()::text = user_id );

create policy "Users can delete their own contacts_v2"
  on public.contacts_v2 for delete
  using ( auth.uid()::text = user_id );
