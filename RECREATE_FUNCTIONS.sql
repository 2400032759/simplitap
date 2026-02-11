-- ALMOST THERE!
-- The previous error happened because the functions were missing.
-- This script creates them AND fixes the permissions.

-- 1. Create the View Counter Function
CREATE OR REPLACE FUNCTION increment_view(row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET views = COALESCE(views, 0) + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the Click Counter Function
CREATE OR REPLACE FUNCTION increment_click(row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET clicks = COALESCE(clicks, 0) + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Grant Public Access (Fixes the 404 Errors)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.analytics_events TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_view(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_click(uuid) TO anon, authenticated;

-- 4. Reload API Cache
NOTIFY pgrst, 'reload schema';
