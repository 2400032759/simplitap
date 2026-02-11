-- CRITICAL DATABASE UPDATE FOR MULTI-CARD SUPPORT
-- You MUST run this script in your Supabase SQL Editor to allow creating multiple cards.

-- 1. Drop the unique constraint on clerk_user_id (Only one card per user meant this was UNIQUE)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_clerk_user_id_key;

-- 2. Drop the unique index if it exists
DROP INDEX IF EXISTS profiles_clerk_user_id_idx;

-- 3. Create a standard index for performance (non-unique)
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_user_id ON public.profiles(clerk_user_id);

-- 4. Ensure username is still unique (optional, but good practice if not already set)
-- ALTER TABLE public.profiles ADD CONSTRAINT profiles_username_key UNIQUE (username);
