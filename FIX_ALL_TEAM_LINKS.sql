-- MASTER FIX SCRIPT for Team Linking Issues
-- Run this in Supabase SQL Editor

-- 1. Fix ADMINT: Link Admins to the Team they created
-- (If you created a team but are still seeing "Plus" or "Free")
UPDATE public.profiles
SET 
    team_id = teams.id,
    is_premium = true,
    plan_type = 'teams'
FROM public.teams
WHERE profiles.clerk_user_id = teams.admin_id
AND (profiles.team_id IS NULL OR profiles.team_id != teams.id);

-- 2. Fix MEMBERS: Link Invited Members to their Team
-- (If you were invited but still don't see the team dashboard)
-- First, ensure status is active if they exist in profiles
UPDATE public.team_members
SET status = 'active'
FROM public.profiles
WHERE lower(team_members.email) = lower(profiles.email)
AND team_members.status = 'invited';

-- Then link the profile
UPDATE public.profiles
SET 
    team_id = team_members.team_id,
    is_premium = true,
    plan_type = 'teams'
FROM public.team_members
WHERE lower(profiles.email) = lower(team_members.email)
AND team_members.status = 'active'
AND (profiles.team_id IS NULL OR profiles.team_id != team_members.team_id);

-- 3. Verify Output
SELECT id, email, team_id, plan_type FROM public.profiles;
