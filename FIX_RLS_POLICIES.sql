-- CRITICAL FIX FOR CLERK + SUPABASE
-- The error "invalid input syntax for type uuid" is happening inside the RLS Policy.
-- Supabase's helper function `auth.uid()` tries to cast the user ID to a UUID.
-- Since Clerk IDs are text (e.g. "user_123"), this cast fails.
-- WE MUST USE `(auth.jwt() ->> 'sub')` INSTEAD OF `auth.uid()`.

-- 1. Drop old policies that used auth.uid()
drop policy if exists "allow_select" on public.contacts_v2;
drop policy if exists "allow_insert" on public.contacts_v2;
drop policy if exists "allow_update" on public.contacts_v2;
drop policy if exists "allow_delete" on public.contacts_v2;
drop policy if exists "allow_my_select" on public.contacts_v2;
drop policy if exists "allow_my_insert" on public.contacts_v2;
drop policy if exists "allow_my_update" on public.contacts_v2;
drop policy if exists "allow_my_delete" on public.contacts_v2;
drop policy if exists "Users can view their own contacts_v2" on public.contacts_v2;
drop policy if exists "Users can insert their own contacts_v2" on public.contacts_v2;
drop policy if exists "Users can update their own contacts_v2" on public.contacts_v2;
drop policy if exists "Users can delete their own contacts_v2" on public.contacts_v2;

-- 2. Create new policies using raw JWT subject (safe for text IDs)
create policy "clerk_select" on public.contacts_v2 for select 
using ( (select auth.jwt() ->> 'sub') = user_id );

create policy "clerk_insert" on public.contacts_v2 for insert 
with check ( (select auth.jwt() ->> 'sub') = user_id );

create policy "clerk_update" on public.contacts_v2 for update 
using ( (select auth.jwt() ->> 'sub') = user_id );

create policy "clerk_delete" on public.contacts_v2 for delete 
using ( (select auth.jwt() ->> 'sub') = user_id );
