-- Function to allow a Team Admin to delete their team
-- FIX V2: Uses 'admin_id' column (correct) instead of 'owner_id' (incorrect)
-- FIX V2: Uses TEXT type for user ID to match Clerk ID format

CREATE OR REPLACE FUNCTION delete_team()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id text := auth.jwt() ->> 'sub';
  v_team_id uuid;
BEGIN
  -- Verify the user is the owner (admin) of a team
  SELECT id INTO v_team_id
  FROM public.teams
  WHERE admin_id = v_user_id;

  IF v_team_id IS NULL THEN
    RAISE EXCEPTION 'Permission denied: User is not a team admin';
  END IF;

  -- 1. Downgrade all profiles associated with this team
  -- Set team_id to NULL and is_premium to false for ALL members (including the admin themselves)
  UPDATE public.profiles
  SET team_id = NULL, is_premium = false
  WHERE team_id = v_team_id;

  -- 2. Remove all member records
  DELETE FROM public.team_members
  WHERE team_id = v_team_id;

  -- 3. Delete the team record
  DELETE FROM public.teams
  WHERE id = v_team_id;

END;
$$;
