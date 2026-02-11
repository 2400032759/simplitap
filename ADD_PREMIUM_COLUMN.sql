-- Add is_premium column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;

-- Update the RLS to allow public read of is_premium (if needed, usually public policy covers all columns unless restricted)
-- Since we usually use 'SELECT *' or specific columns, we just need to make sure we select it.
