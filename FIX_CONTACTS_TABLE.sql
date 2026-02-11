-- Fix for Clerk User ID format (which is Text, not UUID)
-- Run this in your Supabase SQL Editor

-- 1. Drop existing policies that might depend on the specific type
drop policy if exists "Users can view their own contacts" on public.contacts;
drop policy if exists "Users can insert their own contacts" on public.contacts;
drop policy if exists "Users can update their own contacts" on public.contacts;
drop policy if exists "Users can delete their own contacts" on public.contacts;

-- 2. Alter the user_id column to allow text (Clerk IDs are text like 'user_xxx', not UUIDs)
alter table public.contacts alter column user_id type text;

-- 3. Re-enable RLS policies with explicit text casting just to be safe
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
