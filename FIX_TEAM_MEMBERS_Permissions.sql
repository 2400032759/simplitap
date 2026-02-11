-- FIX TEAM MEMBER PERMISSIONS FOR NEW JOINEES

-- 1. Ensure Team Members can be read by their email owner
-- This allows the new user to check if they have a pending invite
DROP POLICY IF EXISTS "Users can check invitations" ON public.team_members;
CREATE POLICY "Users can check invitations" 
ON public.team_members FOR SELECT 
USING ( email = (select auth.jwt() ->> 'email') );

-- 2. Ensure Team Members can update their status (join)
-- This allows the new user to set themselves to 'Active'
DROP POLICY IF EXISTS "Users can update invite status" ON public.team_members;
CREATE POLICY "Users can update invite status" 
ON public.team_members FOR UPDATE 
USING ( email = (select auth.jwt() ->> 'email') );

-- 3. Ensure Profiles can be UPDATED with team_id
-- We need to make sure the user can link themselves to a team.
-- The existing "Users can update their own profile" policy should cover this
-- as long as it's just checking user_id.

-- 4. Ensure Profiles can be INSERTED with team_id
-- Same, standard insert policy should handle this.
