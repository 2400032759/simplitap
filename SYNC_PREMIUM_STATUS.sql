-- SYNC PREMIUM STATUS FOR ALL USERS
-- If a user has AT LEAST ONE premium card, all their cards should are marked as premium.

BEGIN;

-- Update profiles where the user has at least one premium profile
UPDATE public.profiles
SET is_premium = true
WHERE clerk_user_id IN (
    SELECT clerk_user_id
    FROM public.profiles
    WHERE is_premium = true
);

COMMIT;

-- Verify (optional query you can run to check count of updated rows locally if you were in psql)
-- SELECT count(*) FROM public.profiles WHERE is_premium = true;
