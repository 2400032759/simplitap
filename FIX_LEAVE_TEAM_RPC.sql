-- Function to allow a user to leave their team safely
-- Bypasses complex RLS by handling logic in SECURITY DEFINER function

CREATE OR REPLACE FUNCTION leave_team()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_team_id uuid;
  v_email text;
BEGIN
  -- Get current user's team and email from profiles
  SELECT team_id, email INTO v_team_id, v_email
  FROM public.profiles
  WHERE clerk_user_id = v_user_id;

  IF v_team_id IS NULL THEN
    RAISE EXCEPTION 'User is not in a team';
  END IF;

  -- Update team_members status to 'left'
  -- We match by team_id and email since team_members might not have user_id
  UPDATE public.team_members
  SET status = 'left', updated_at = NOW()
  WHERE team_id = v_team_id 
  AND (email = v_email OR email IS NOT DISTINCT FROM v_email);

  -- Update profile to remove team association
  UPDATE public.profiles
  SET team_id = NULL, is_premium = false
  WHERE clerk_user_id = v_user_id;
  
END;
$$;
