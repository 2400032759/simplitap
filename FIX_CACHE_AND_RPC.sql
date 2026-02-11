-- 1. Force the API to refresh its cache of your database structure
NOTIFY pgrst, 'reload schema';

-- 2. Explicitly re-grant permissions to the public (fixes 404 Not Found)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.analytics_events TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_view(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_click(uuid) TO anon, authenticated;

-- 3. Ensure metadata column exists
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
