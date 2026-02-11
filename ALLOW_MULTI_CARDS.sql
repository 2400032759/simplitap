-- Allow multiple profiles per user by dropping the unique constraint on clerk_user_id

-- 1. Drop the constraint if it exists (generic name often used by Supabase/Postgres)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_clerk_user_id_key;

-- 2. Drop the index if it exists (to be safe)
DROP INDEX IF EXISTS profiles_clerk_user_id_idx;

-- 3. Create a non-unique index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_user_id ON public.profiles(clerk_user_id);
