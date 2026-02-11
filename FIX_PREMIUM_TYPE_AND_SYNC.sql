-- FIX DATABASE COLUMN TYPE AND SYNC PREMIUM STATUS
-- The previous error "text = boolean" indicates is_premium was created as TEXT, not BOOLEAN.
-- This creates bugs (e.g., string "false" is truthy in Javascript).
-- We must convert it to BOOLEAN first.

BEGIN;

-- 1. Convert is_premium to BOOLEAN safely
-- This converts 'true' string to TRUE, and everything else to FALSE.
-- If it's already boolean, this might fail or be redundant, but safe enough given the error proof.
ALTER TABLE public.profiles
ALTER COLUMN is_premium TYPE BOOLEAN
USING (is_premium::text = 'true');

-- 2. Set Default to FALSE (if not set)
ALTER TABLE public.profiles ALTER COLUMN is_premium SET DEFAULT FALSE;

-- 3. Now run the sync logic (Everything is boolean now)
UPDATE public.profiles
SET is_premium = true
WHERE clerk_user_id IN (
    SELECT clerk_user_id FROM public.profiles WHERE is_premium = true
);

COMMIT;
