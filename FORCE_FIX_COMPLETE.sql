-- COMPREHENSIVE FIX SCRIPT
-- 1. Fixes Schema (adds missing column)
-- 2. Removes duplicate team member entries
-- 3. Unlinks the user profile from any team

BEGIN;

-- STEP 1: Fix Schema (Add updated_at if missing)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'updated_at') THEN 
        ALTER TABLE public.team_members ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW(); 
    END IF; 
END $$;

-- STEP 2: Remove Team Member Entries for this email (Clean Slate)
DELETE FROM public.team_members 
WHERE email ILIKE 'yolmotarde@necub.com';

-- STEP 3: Unlink Profile (Force Downgrade)
UPDATE public.profiles
SET team_id = NULL, is_premium = false
WHERE email ILIKE 'yolmotarde@necub.com' 
   OR card_mail ILIKE 'yolmotarde@necub.com';

COMMIT;
