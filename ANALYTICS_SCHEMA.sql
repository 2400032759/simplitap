-- Analytics Tables and Functions

-- 1. Create table for tracking individual events (views, clicks)
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'view', 'click_linkedin', 'click_web', 'click_phone', etc.
    metadata JSONB DEFAULT '{}'::jsonb, -- Store extra info like country, user_agent if needed
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Add indexes for faster querying
CREATE INDEX IF NOT EXISTS idx_analytics_profile_id ON public.analytics_events(profile_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics_events(created_at);

-- 3. Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- 4. Policies
-- Allow anyone to INSERT events (public card views)
CREATE POLICY "Allow public insert analytics" ON public.analytics_events
    FOR INSERT
    WITH CHECK (true);

-- Allow users to SELECT their OWN analytics
-- We need to join with profiles to check ownership, or just rely on profile_id match if profile_id is somehow linked to auth.uid()
-- simpler: user can select events where profile_id belongs to a profile they own.
CREATE POLICY "Allow owners to view analytics" ON public.analytics_events
    FOR SELECT
    USING (
        exists (
            select 1 from public.profiles
            where profiles.id = analytics_events.profile_id
            and profiles.clerk_user_id = auth.uid()::text -- distinct type mismatch fix if needed, assuming clerk_user_id is text
        )
    );

-- 5. RPC Function to increment counters (Optional, if we want fast aggregate reads from profiles table)
-- We can add 'views' and 'clicks' columns to profiles for caching totals.

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS clicks INTEGER DEFAULT 0;

-- Function to increment view count safely
CREATE OR REPLACE FUNCTION increment_view(row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET views = views + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment click count safely
CREATE OR REPLACE FUNCTION increment_click(row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET clicks = clicks + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
