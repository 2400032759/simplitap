-- Function to allow a user to leave their team safely
-- V5 FIX: Returns TEXT for better error debugging. Handles exceptions gracefully.

CREATE OR REPLACE FUNCTION leave_team()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  -- Extract the Clerk User ID from the JWT 'sub' claim.
  v_user_id text := auth.jwt() ->> 'sub';
  
  v_team_id uuid;
  v_email text;
BEGIN
  -- Strict checking for User ID
  IF v_user_id IS NULL THEN
     RETURN 'Error: Could not determine User ID from session.';
  END IF;

  -- 1. Get current user's team and email from their profile
  SELECT team_id, email INTO v_team_id, v_email
  FROM public.profiles
  WHERE clerk_user_id = v_user_id AND team_id IS NOT NULL
  LIMIT 1;

  -- If no team link found, we consider it a success (already left)
  IF v_team_id IS NULL THEN
    RETURN 'Success: User was not in a team.';
  END IF;

  -- 2. Update ALL profiles for this user to remove team association immediately
  UPDATE public.profiles
  SET team_id = NULL, is_premium = false
  WHERE clerk_user_id = v_user_id;

  -- 3. Try to update team_members status to 'left'
  -- We use ILIKE for case-insensitive email matching
  IF v_email IS NOT NULL THEN
      UPDATE public.team_members
      SET status = 'left', updated_at = NOW()
      WHERE team_id = v_team_id 
      AND (lower(email) = lower(v_email));
  END IF;
  
  RETURN 'Success';

EXCEPTION WHEN OTHERS THEN
  RETURN 'Error: ' || SQLERRM;
END;
$$;

-- Grant resolve permission just in case
GRANT EXECUTE ON FUNCTION leave_team TO authenticated;
GRANT EXECUTE ON FUNCTION leave_team TO anon;
