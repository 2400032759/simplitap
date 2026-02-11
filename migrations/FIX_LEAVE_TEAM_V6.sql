-- IMPROVED LEAVE TEAM FUNCTION (V6)
-- Directly updates team_members status for the email, ensuring no zombie active records remain.
-- Does not rely on profiles.team_id being present to find the team.

BEGIN;

CREATE OR REPLACE FUNCTION leave_team(user_email text DEFAULT NULL)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id text := auth.jwt() ->> 'sub';
BEGIN
  -- 1. Unlink Profile (Set team_id to NULL)
  UPDATE public.profiles
  SET team_id = NULL, is_premium = false
  WHERE (clerk_user_id = v_user_id) 
     OR (user_email IS NOT NULL AND lower(email) = lower(user_email));

  -- 2. Mark ALL active/invited roster entries as 'left' for this email
  -- This ensures that even if the profile link was broken, the member record is cleaned up.
  IF user_email IS NOT NULL THEN
      UPDATE public.team_members
      SET status = 'left', updated_at = NOW()
      WHERE lower(email) = lower(user_email)
      AND status IN ('active', 'invited');
  END IF;
  
  RETURN 'Success';

EXCEPTION WHEN OTHERS THEN
  RETURN 'Error: ' || SQLERRM;
END;
$$;

GRANT EXECUTE ON FUNCTION leave_team TO authenticated;
GRANT EXECUTE ON FUNCTION leave_team TO anon;

COMMIT;
