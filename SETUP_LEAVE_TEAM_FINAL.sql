-- FINAL SETUP: LEAVE TEAM FUNCTIONALITY
-- This script ensures the database is fully configured for the 'Leave Team' button to work automatically.
-- It fixes the schema and installs the correct logic function.
-- V3: REMOVED reference to non-existent 'card_mail' column in team_members.

BEGIN;

-- 1. Schema Fix: Ensure 'updated_at' column exists
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'updated_at') THEN 
        ALTER TABLE public.team_members ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW(); 
    END IF; 
END $$;

-- 2. Logic Fix: Install the robust 'leave_team' function
-- First, drop the old function to avoid "cannot change return type" error
DROP FUNCTION IF EXISTS leave_team();

-- Handles Clerk IDs (Text), Case-insensitive emails, and missing data gracefully.
CREATE OR REPLACE FUNCTION leave_team()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id text := auth.jwt() ->> 'sub';
  v_team_id uuid;
  v_email text;
BEGIN
  -- Check User ID
  IF v_user_id IS NULL THEN
     RETURN 'Error: Could not determine User ID from session.';
  END IF;

  -- Get current user's team and email from their profile
  SELECT team_id, email INTO v_team_id, v_email
  FROM public.profiles
  WHERE clerk_user_id = v_user_id AND team_id IS NOT NULL
  LIMIT 1;

  -- Success if already not in a team
  IF v_team_id IS NULL THEN
    RETURN 'Success: User was not in a team.';
  END IF;

  -- PRIORITY 1: Unlink from Profile (Frees the user immediately)
  UPDATE public.profiles
  SET team_id = NULL, is_premium = false
  WHERE clerk_user_id = v_user_id;

  -- PRIORITY 2: Update member status (if record exists)
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

-- 3. Permissions: Grant execution rights
GRANT EXECUTE ON FUNCTION leave_team TO authenticated;
GRANT EXECUTE ON FUNCTION leave_team TO anon;

COMMIT;
