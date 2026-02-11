-- Function to allow a user to leave their team safely
-- V4 FIX: Correctly handles Clerk User ID as TEXT (not UUID) to prevent type mismatch errors.

CREATE OR REPLACE FUNCTION leave_team()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  -- Extract the Clerk User ID from the JWT 'sub' claim.
  -- We treat it as TEXT because Clerk IDs are strings (e.g. "user_2..."), not UUIDs.
  v_user_id text := auth.jwt() ->> 'sub';
  
  v_team_id uuid;
  v_email text;
BEGIN
  -- 1. Get current user's team and email from their profile
  SELECT team_id, email INTO v_team_id, v_email
  FROM public.profiles
  WHERE clerk_user_id = v_user_id AND team_id IS NOT NULL
  LIMIT 1;

  -- If no team link found, we consider it a success (already left)
  IF v_team_id IS NULL THEN
    RETURN;
  END IF;

  -- 2. Update ALL profiles for this user to remove team association immediately
  UPDATE public.profiles
  SET team_id = NULL, is_premium = false
  WHERE clerk_user_id = v_user_id;

  -- 3. Try to update team_members status to 'left'
  -- We use ILIKE for case-insensitive email matching
  UPDATE public.team_members
  SET status = 'left', updated_at = NOW()
  WHERE team_id = v_team_id 
  AND (lower(email) = lower(v_email));
  
END;
$$;

-- Grant resolve permission just in case
GRANT EXECUTE ON FUNCTION leave_team TO authenticated;
GRANT EXECUTE ON FUNCTION leave_team TO anon;
