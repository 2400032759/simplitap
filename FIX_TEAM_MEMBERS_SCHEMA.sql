-- Fix missing column 'updated_at' in 'team_members' table
-- This error caused the 'leave_team' function to fail.

ALTER TABLE public.team_members 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
