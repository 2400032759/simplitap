-- RUN THIS IN SUPABASE SQL EDITOR TO FIX THE "TABLE NOT FOUND" ERROR

CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable security but allow public access for logging
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for all users" ON public.analytics_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for owners" ON public.analytics_events
    FOR SELECT USING (
        profile_id IN (SELECT id FROM public.profiles WHERE clerk_user_id = auth.uid()::text)
    );

-- Fix the counters in profiles table too
UPDATE public.profiles SET views = '0' WHERE views IS NULL;
ALTER TABLE public.profiles ALTER COLUMN views TYPE INTEGER USING views::integer;
ALTER TABLE public.profiles ALTER COLUMN views SET DEFAULT 0;

UPDATE public.profiles SET clicks = '0' WHERE clicks IS NULL;
ALTER TABLE public.profiles ALTER COLUMN clicks TYPE INTEGER USING clicks::integer;
ALTER TABLE public.profiles ALTER COLUMN clicks SET DEFAULT 0;
