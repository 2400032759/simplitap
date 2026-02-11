-- FIX SCRIPT: Create Missing Profile & Link Team
-- Run this in Supabase SQL Editor

DO $$
DECLARE
    target_clerk_id TEXT := 'user_377gmmQBujKcqPmrjdg69LxP1Eu';
    target_email TEXT := 'kakkirenivishwas@gmail.com';
    found_team_id UUID;
    new_profile_id UUID;
BEGIN
    -- 1. Find the pending/active team invite to get the Team ID
    SELECT team_id INTO found_team_id
    FROM public.team_members
    WHERE lower(email) = lower(target_email)
    LIMIT 1;

    -- 2. Check if profile exists, if not INSERT
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE clerk_user_id = target_clerk_id) THEN
        INSERT INTO public.profiles (
            clerk_user_id,
            email,
            first_name,
            last_name,
            team_id,
            is_premium,
            plan_type,
            job_title,
            company
        ) VALUES (
            target_clerk_id,
            target_email,
            'Vishwas', -- Placeholder first name
            '',        -- Placeholder last name
            found_team_id, -- Link to team immediately if found
            (found_team_id IS NOT NULL), -- Set premium if team found
            CASE WHEN found_team_id IS NOT NULL THEN 'teams' ELSE 'free' END,
            'Team Member',
            'My Company'
        )
        RETURNING id INTO new_profile_id;
        
        RAISE NOTICE 'Created new profile with ID: %', new_profile_id;
    ELSE
        -- Profile exists but maybe didn't link? Update it.
        UPDATE public.profiles
        SET 
            team_id = COALESCE(team_id, found_team_id),
            is_premium = CASE WHEN found_team_id IS NOT NULL THEN true ELSE is_premium END,
            plan_type = CASE WHEN found_team_id IS NOT NULL THEN 'teams' ELSE plan_type END
        WHERE clerk_user_id = target_clerk_id;
        
        RAISE NOTICE 'Updated existing profile for %', target_email;
    END IF;

    -- 3. Ensure Team Member status is 'active'
    IF found_team_id IS NOT NULL THEN
        UPDATE public.team_members
        SET status = 'active'
        WHERE team_id = found_team_id AND lower(email) = lower(target_email);
    END IF;

END $$;
