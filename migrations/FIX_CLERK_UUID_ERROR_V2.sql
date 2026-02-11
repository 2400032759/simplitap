-- 1. DROP ALL DEPENDENT POLICIES FIRST
-- We must drop them because they depend on the column we are trying to change
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON profiles;

-- 2. NOW SAFE TO ALTER COLUMN
DO $$
BEGIN
    ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_clerk_user_id_check;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE profiles ALTER COLUMN clerk_user_id TYPE TEXT USING clerk_user_id::text;

-- 3. RECREATE POLICIES WITH CORRECT LOGIC
-- SELECT: Allow everyone to read all profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

-- INSERT: Authenticated users can create a profile for themselves
CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK ( clerk_user_id = (select auth.jwt() ->> 'sub') );

-- UPDATE: Authenticated users can update ONLY their own profile
CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING ( clerk_user_id = (select auth.jwt() ->> 'sub') );

-- DELETE: Authenticated users can delete ONLY their own profile
CREATE POLICY "Users can delete their own profile" ON profiles
    FOR DELETE USING ( clerk_user_id = (select auth.jwt() ->> 'sub') );
