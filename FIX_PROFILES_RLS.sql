-- FIX RLS FOR PROFILES TABLE
-- Ensure users can select, insert, and update their own profiles using Clerk ID

-- 1. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop conflicting/old policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.profiles;

-- 3. Create Robust Policies

-- SELECT: Allow everyone to read all profiles (required for public cards)
-- This also ensures the logged-in user can read their own profile to verify it exists.
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

-- INSERT: Authenticated users can create a profile for themselves
-- We compare the 'clerk_user_id' column to the JWT 'sub' claim (Clerk User ID)
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK ( clerk_user_id = (select auth.jwt() ->> 'sub') );

-- UPDATE: Authenticated users can update ONLY their own profile
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING ( clerk_user_id = (select auth.jwt() ->> 'sub') );

-- DELETE: Authenticated users can delete ONLY their own profile
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
CREATE POLICY "Users can delete their own profile" 
ON public.profiles FOR DELETE 
USING ( clerk_user_id = (select auth.jwt() ->> 'sub') );
