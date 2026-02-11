-- HARD RESET SCRIPT
-- WARNING: This will delete ALL teams and remove ALL users from teams.
-- All users will be downgraded to the basic free plan.

BEGIN;

-- 1. Unlink all profiles from teams and downgrade to basic free plan
UPDATE public.profiles
SET team_id = NULL, is_premium = false;

-- 2. Delete all team member records
DELETE FROM public.team_members;

-- 3. Delete all teams
DELETE FROM public.teams;

COMMIT;
