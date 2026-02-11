-- FORCE LEAVE SCRIPT
-- Forcefully removes a specific user from any team by Email
-- Use this to unstick the user 'yolmotarde@necub.com'

BEGIN;

-- 1. Unlink from Profiles (Primary Fix)
UPDATE public.profiles
SET team_id = NULL, is_premium = false
WHERE email = 'yolmotarde@necub.com' 
   OR card_mail = 'yolmotarde@necub.com';

-- 2. Mark as 'left' in team_members
UPDATE public.team_members
SET status = 'left', updated_at = NOW()
WHERE email = 'yolmotarde@necub.com';

COMMIT;
