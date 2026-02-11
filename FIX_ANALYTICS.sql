-- ==========================================
-- COMPLETE ANALYTICS REPAIR SCRIPT
-- ==========================================

-- 1. Ensure columns exist in profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS clicks INTEGER DEFAULT 0;

-- 2. Create analytics events table if not exists
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- 4. Allow ANYONE to insert events (public view tracking)
DROP POLICY IF EXISTS "Public insert analytics" ON public.analytics_events;
CREATE POLICY "Public insert analytics" ON public.analytics_events
    FOR INSERT
    WITH CHECK (true);

-- 5. Allow users to see their OWN analytics
DROP POLICY IF EXISTS "Owner view analytics" ON public.analytics_events;
CREATE POLICY "Owner view analytics" ON public.analytics_events
    FOR SELECT
    USING (
         profile_id IN (
            SELECT id FROM public.profiles 
            WHERE clerk_user_id = auth.uid()::text
         )
    );

-- 6. Re-create RPC functions with SECURITY DEFINER (Bypasses RLS)
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

-- 7. Grant public permissions to functions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.analytics_events TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_view(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_click(uuid) TO anon, authenticated;
