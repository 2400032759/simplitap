-- Add Branding Columns to Teams table
-- Run this in the Supabase SQL Editor to enable Team-wide templates and custom colors

ALTER TABLE public.teams 
ADD COLUMN IF NOT EXISTS template_id TEXT DEFAULT 'modern',
ADD COLUMN IF NOT EXISTS style JSONB DEFAULT '{}'::jsonb;

-- Optional: Migrate existing team themes to the new style object if needed
-- UPDATE public.teams SET style = jsonb_build_object('customColors', jsonb_build_object('primary', '#2563eb')); 
