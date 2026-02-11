-- Add is_locked column to profiles table
ALTER TABLE profiles 
ADD COLUMN is_locked BOOLEAN DEFAULT FALSE;
