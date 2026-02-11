-- FORCE FIX ANALYTICS AND COLUMNS

-- 1. Fix columns in profiles (Convert TEXT to INTEGER if needed)
-- First, turn NULLs to '0'
UPDATE public.profiles SET views = '0' WHERE views IS NULL;
UPDATE public.profiles SET clicks = '0' WHERE clicks IS NULL;

-- Now alter types (using USING to cast)
ALTER TABLE public.profiles 
ALTER COLUMN views TYPE INTEGER USING views::integer;

ALTER TABLE public.profiles 
ALTER COLUMN clicks TYPE INTEGER USING clicks::integer;

-- Ensure defaults
ALTER TABLE public.profiles ALTER COLUMN views SET DEFAULT 0;
ALTER TABLE public.profiles ALTER COLUMN clicks SET DEFAULT 0;


-- 2. RESET Analytics Events Table (Drop and Recreate to fix 404/Schema issues)
DROP TABLE IF EXISTS public.analytics_events CASCADE;

CREATE TABLE public.analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Open Permissions (RLS)
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow INSERT by anyone (Anonymous included)
CREATE POLICY "Enable insert for all users" ON public.analytics_events
    FOR INSERT
    WITH CHECK (true);

-- Allow SELECT by owner
CREATE POLICY "Enable select for users based on profile_id" ON public.analytics_events
    FOR SELECT
    USING (
         profile_id IN (
            SELECT id FROM public.profiles 
            WHERE clerk_user_id = auth.uid()::text
         )
    );

-- 4. Re-create Counters (RPC)
DROP FUNCTION IF EXISTS increment_view(uuid);
CREATE OR REPLACE FUNCTION increment_view(row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET views = COALESCE(views, 0) + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP FUNCTION IF EXISTS increment_click(uuid);
CREATE OR REPLACE FUNCTION increment_click(row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET clicks = COALESCE(clicks, 0) + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Grant permissions
GRANT ALL ON public.analytics_events TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
