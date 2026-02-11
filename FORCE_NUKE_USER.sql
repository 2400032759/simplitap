-- FORCE NUKE USER SCRIPT (EMAIL BASED)
-- This script performs a hard reset on the specific user email provided.
-- It ignores all potential ID mismatches and targets the human-readable email address.

BEGIN;

-- 1. Remove the 'active' team status from ALL profiles associated with this email
-- (Handles case where user might have multiple profiles for the same email)
UPDATE public.profiles
SET team_id = NULL, is_premium = false
WHERE (email = 'alt.bi-2ozi8j3c@yopmail.com' OR card_mail = 'alt.bi-2ozi8j3c@yopmail.com');

-- 2. Mark ALL team member occurrences of this email as 'left'
UPDATE public.team_members
SET status = 'left', updated_at = NOW()
WHERE email = 'alt.bi-2ozi8j3c@yopmail.com';

COMMIT;
