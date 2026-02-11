-- DANGER: This will delete all existing contacts.
-- Use this if the previous fix didn't work.

DROP TABLE IF EXISTS public.contacts;

create table public.contacts (
  id uuid default gen_random_uuid() primary key,
  user_id text not null, -- This must be TEXT to support Clerk IDs
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
alter table public.contacts enable row level security;

-- Policies
create policy "Users can view their own contacts"
  on public.contacts for select
  using ( auth.uid()::text = user_id );

create policy "Users can insert their own contacts"
  on public.contacts for insert
  with check ( auth.uid()::text = user_id );

create policy "Users can update their own contacts"
  on public.contacts for update
  using ( auth.uid()::text = user_id );

create policy "Users can delete their own contacts"
  on public.contacts for delete
  using ( auth.uid()::text = user_id );
