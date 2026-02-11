-- FINAL V4: LEAVE TEAM FUNCTIONALITY (Double-Lock Mechanism)
-- This version accepts an optional email parameter from the frontend.
-- It matches the user by EITHER their Clerk ID OR their Email.
-- This ensures that even if IDs are mismatched, the correct profile is found and unlinked.

BEGIN;

-- 1. Schema Fix (Just in case)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'updated_at') THEN 
        ALTER TABLE public.team_members ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW(); 
    END IF; 
END $$;

-- 2. Drop old function to allow signature change
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
  v_team_id uuid;
  v_resolved_email text := user_email;
BEGIN
  -- Strict Check: We need at least one identifier
  IF v_user_id IS NULL AND v_resolved_email IS NULL THEN
     RETURN 'Error: No user identity (ID or Email) provided.';
  END IF;

  -- 1. IDENTIFY THE TEAM TO LEAVE
  -- We prioritize finding the team via ID, then fallback to Email
  SELECT team_id INTO v_team_id
  FROM public.profiles
  WHERE (clerk_user_id = v_user_id) 
     OR (email IS NOT NULL AND lower(email) = lower(v_resolved_email))
     AND team_id IS NOT NULL
  LIMIT 1;

  -- If still no team found, we are already free
  IF v_team_id IS NULL THEN
    RETURN 'Success: User was not in a team.';
  END IF;

  -- 2. UNLINK PROFILE (The Critical Step)
  -- We unlink ANY profile matching the ID OR the Email
  UPDATE public.profiles
  SET team_id = NULL, is_premium = false
  WHERE (clerk_user_id = v_user_id)
     OR (v_resolved_email IS NOT NULL AND lower(email) = lower(v_resolved_email));

  -- 3. UPDATE MEMBER STATUS
  -- Mark as left in the team roster
  IF v_resolved_email IS NOT NULL THEN
      UPDATE public.team_members
      SET status = 'left', updated_at = NOW()
      WHERE team_id = v_team_id 
      AND (lower(email) = lower(v_resolved_email));
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
