-- 1. Change clerk_user_id to TEXT (Handling the case if it's already UUID or TEXT)
DO $$
BEGIN
    -- Drop constraint if exists (often created automatically)
    ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_clerk_user_id_check;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Alter the column to TEXT. 
-- USING clerk_user_id::text ensures that if it is currently UUID, it converts it to string format.
ALTER TABLE profiles ALTER COLUMN clerk_user_id TYPE TEXT USING clerk_user_id::text;

-- 2. Update RLS Policies to use auth.jwt() ->> 'sub' instead of auth.uid()
-- Policy for SELECT
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

-- Policy for INSERT
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK ( clerk_user_id = (select auth.jwt() ->> 'sub') );

-- Policy for UPDATE
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING ( clerk_user_id = (select auth.jwt() ->> 'sub') );

-- Policy for DELETE
DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;
CREATE POLICY "Users can delete their own profile" ON profiles
    FOR DELETE USING ( clerk_user_id = (select auth.jwt() ->> 'sub') );
