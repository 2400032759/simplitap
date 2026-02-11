-- FINAL V5: LEAVE TEAM FUNCTIONALITY (Logic Fix)
-- Fixes a critical bug where having multiple profiles (one without a team) caused the function to exit early.
-- Now performs the Unlink FIRST and captures the team_id from that, ensuring we always catch the active link.

BEGIN;

-- 1. Schema Check
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'updated_at') THEN 
        ALTER TABLE public.team_members ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW(); 
    END IF; 
END $$;

-- 2. Drop duplicates
DROP FUNCTION IF EXISTS leave_team();
DROP FUNCTION IF EXISTS leave_team(text);

-- 3. Create the robust function
CREATE OR REPLACE FUNCTION leave_team(user_email text DEFAULT NULL)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id text := auth.jwt() ->> 'sub';
  v_removed_teams uuid[]; -- Array to store teams we unlinked from
  v_team_id_iter uuid;
BEGIN
  -- Strict Check
  IF v_user_id IS NULL AND user_email IS NULL THEN
     RETURN 'Error: No user identity (ID or Email) provided.';
  END IF;

  -- 1. DIRECT UPDATE PROFILES (The "Nuke" approach)
  -- We don't ask "are you in a team?", we just say "You are now NOT in any team".
  -- We use RETURNING to find out which team they *were* in, so we can update the roster.
  WITH updated_rows AS (
      UPDATE public.profiles
      SET team_id = NULL, is_premium = false
      WHERE (clerk_user_id = v_user_id) 
         OR (user_email IS NOT NULL AND lower(email) = lower(user_email))
      RETURNING team_id
  )
  SELECT array_agg(DISTINCT team_id) INTO v_removed_teams FROM updated_rows WHERE team_id IS NOT NULL;

  -- 2. UPDATE ROSTER (Cleanup)
  -- If we actually unlinked from any teams, mark those member records as 'left'
  IF v_removed_teams IS NOT NULL THEN
      FOREACH v_team_id_iter IN ARRAY v_removed_teams
      LOOP
          UPDATE public.team_members
          SET status = 'left', updated_at = NOW()
          WHERE team_id = v_team_id_iter 
          AND (
             (user_email IS NOT NULL AND lower(email) = lower(user_email))
          );
          -- Note: We can't easily match by ID in team_members as it only stores email usually.
          -- So we rely on the email passed in.
      END LOOP;
  END IF;
  
  RETURN 'Success';

EXCEPTION WHEN OTHERS THEN
  RETURN 'Error: ' || SQLERRM;
END;
$$;

-- 4. Permissions
GRANT EXECUTE ON FUNCTION leave_team TO authenticated;
GRANT EXECUTE ON FUNCTION leave_team TO anon;

COMMIT;
