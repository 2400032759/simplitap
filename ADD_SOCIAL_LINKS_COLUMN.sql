-- Add social_links column to profiles table to support dynamic, rich social media links
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '[]'::jsonb;

-- Comment on column
COMMENT ON COLUMN profiles.social_links IS 'Array of social link objects: { platform, url, label, active, order }';
