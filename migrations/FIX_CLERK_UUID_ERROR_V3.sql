-- FIX: Drop dependent policies from OTHER tables first
DROP POLICY IF EXISTS "Card owners can view their exchanges" ON contact_exchanges;

-- FIX: Drop policies on PROFILES table
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON profiles;

-- NOW SAFE TO ALTER COLUMN
DO $$
BEGIN
    ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_clerk_user_id_check;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE profiles ALTER COLUMN clerk_user_id TYPE TEXT USING clerk_user_id::text;

-- RESTORE POLICIES

-- 1. Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK ( clerk_user_id = (select auth.jwt() ->> 'sub') );

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING ( clerk_user_id = (select auth.jwt() ->> 'sub') );

CREATE POLICY "Users can delete their own profile" ON profiles
    FOR DELETE USING ( clerk_user_id = (select auth.jwt() ->> 'sub') );

-- 2. Restore Contact Exchanges Policy (The one that caused the dependency error)
-- We reconstruct it assuming it links via card_owner_id -> profiles.id
CREATE POLICY "Card owners can view their own exchanges" ON contact_exchanges
    FOR SELECT 
    USING ( 
        card_owner_id IN (
            SELECT id FROM profiles 
            WHERE clerk_user_id = (select auth.jwt() ->> 'sub')
        ) 
    );
