-- 1. Create Teams Table
-- Stores team configuration and admin mapping
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    name TEXT NOT NULL DEFAULT 'My Team',
    admin_id TEXT NOT NULL, -- Linked to Clerk User ID (auth.jwt() ->> 'sub')
    plan_type TEXT NOT NULL DEFAULT 'free', -- 'free', 'evangelist', 'pro'
    total_seats INT NOT NULL DEFAULT 0,
    seats_used INT NOT NULL DEFAULT 0,
    theme_color TEXT DEFAULT 'classic-white',
    subscription_status TEXT DEFAULT 'active',
    logo_url TEXT,
    company_name TEXT
);

-- Index for fast lookup by admin
CREATE INDEX IF NOT EXISTS idx_teams_admin_id ON public.teams(admin_id);

-- 2. Link Profiles to Teams
-- Add team_id to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES public.teams(id);

-- 3. RLS Policies for Teams Table
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read team data (needed for public profiles displaying team branding)
DROP POLICY IF EXISTS "Public can view teams" ON public.teams;
CREATE POLICY "Public can view teams" ON public.teams
    FOR SELECT USING (true);

-- Policy: Only the Team Admin can insert, update, or delete their team
DROP POLICY IF EXISTS "Admins can manage their team" ON public.teams;
CREATE POLICY "Admins can manage their team" ON public.teams
    FOR ALL USING ( (select auth.jwt() ->> 'sub') = admin_id );
