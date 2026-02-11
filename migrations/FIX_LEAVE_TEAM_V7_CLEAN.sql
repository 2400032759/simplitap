-- FIX: CLEAN UP DUPLICATE FUNCTIONS FIRST
-- The error "function name is not unique" means there are multiple versions (overloads).
-- We must drop them all explicitly before creating the new one.

BEGIN;

-- 1. Drop ALL possible variations of the function to clear the conflict
DROP FUNCTION IF EXISTS public.leave_team();      -- Drop version with no arguments
DROP FUNCTION IF EXISTS public.leave_team(text);  -- Drop version with text argument

-- 2. Create the robust V6 function
CREATE OR REPLACE FUNCTION public.leave_team(user_email text DEFAULT NULL)
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

-- 3. Grant Permissions
GRANT EXECUTE ON FUNCTION public.leave_team(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.leave_team(text) TO anon;

COMMIT;
