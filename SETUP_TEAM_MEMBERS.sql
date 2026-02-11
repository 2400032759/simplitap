-- 1. Create Team Invites / Members Table
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'member', -- 'admin', 'member'
    status TEXT DEFAULT 'invited', -- 'invited', 'active'
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(team_id, email)
);

-- 2. RLS for Team Members
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Admins can view/insert/delete members of THEIR team
DROP POLICY IF EXISTS "Admins manage members" ON public.team_members;
CREATE POLICY "Admins manage members" ON public.team_members
    FOR ALL
    USING (
        exists (
            select 1 from public.teams
            where teams.id = team_members.team_id
            and teams.admin_id = (select auth.jwt() ->> 'sub')
        )
    );
