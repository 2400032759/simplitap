-- FIX TEAM MEMBER POLICIES FOR ONBOARDING
-- 1. Ensure new users can check if they are invited
CREATE POLICY "Users can check invitations" ON public.team_members
    FOR SELECT
    USING ( email = (select auth.jwt() ->> 'email') );

-- 2. Allow users to update their status (e.g. 'invited' -> 'active')? 
-- Actually, we handled this in the backend call, but the user is authenticated.
-- The user's email in the JWT must match the row.
-- OR allow insertion of profiles with team_id

-- 3. Ensure profiles table allows team_id setting? Default insert policy is just CHECK(is owner).
-- As long as the payload matches the check, it's fine.
