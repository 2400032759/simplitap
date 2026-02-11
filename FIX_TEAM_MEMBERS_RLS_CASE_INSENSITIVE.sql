-- FIX RLS to be Case-Insensitive for Email Matching
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

-- Ensure profiles can be updated with team_id
-- (Assuming "Users can update own profile" exists and covers this, but let's be sure)
DROP POLICY IF EXISTS "Users can join team (update profile)" ON public.profiles;
CREATE POLICY "Users can join team (update profile)"
ON public.profiles FOR UPDATE
USING ( clerk_user_id = (auth.jwt() ->> 'sub') );
