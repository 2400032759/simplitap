-- 1. FIX: Ensure teams table has subscription_status column
ALTER TABLE public.teams 
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active';

-- 2. FIX: Case-Insensitive RLS for Team Members (Critical for invites)
DROP POLICY IF EXISTS "Users can check invitations" ON public.team_members;
CREATE POLICY "Users can check invitations" 
ON public.team_members FOR SELECT 
USING ( 
    lower(email) = lower(auth.jwt() ->> 'email') 
);

DROP POLICY IF EXISTS "Users can update invite status" ON public.team_members;
CREATE POLICY "Users can update invite status" 
ON public.team_members FOR UPDATE 
USING ( 
    lower(email) = lower(auth.jwt() ->> 'email') 
);

-- 3. FIX: Ensure Profiles can join teams (Update Policy)
DROP POLICY IF EXISTS "Users can join team (update profile)" ON public.profiles;
CREATE POLICY "Users can join team (update profile)"
ON public.profiles FOR UPDATE
USING ( clerk_user_id = (auth.jwt() ->> 'sub') );

-- 4. MANUAL REPAIR for 'kakkirenivishwas@gmail.com'
-- This forces the link in case the frontend logic failed or RLS blocked it previously.

DO $$
DECLARE
    target_email TEXT := 'kakkirenivishwas@gmail.com';
    found_team_id UUID;
BEGIN
    -- Find the team_id from the invite
    SELECT team_id INTO found_team_id
    FROM public.team_members
    WHERE email = target_email
    LIMIT 1;

    IF found_team_id IS NOT NULL THEN
        -- Update the profile
        UPDATE public.profiles
        SET team_id = found_team_id,
            is_premium = true,
            plan_type = 'teams'
        WHERE email = target_email
           OR card_mail = target_email;

        -- Mark invite as active
        UPDATE public.team_members
        SET status = 'active'
        WHERE email = target_email;
    END IF;
END $$;
