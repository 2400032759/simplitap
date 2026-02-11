
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.orders;
DROP POLICY IF EXISTS "Users can update own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow Authenticated Read All" ON public.orders; -- Cleanup

-- 1. READ Policy: Allow users to view orders where user_id matches the JWT 'sub' claim (Clerk ID)
-- We use auth.jwt() ->> 'sub' because auth.uid() sometimes expects a UUID, but Clerk IDs are strings (e.g. user_2...).
CREATE POLICY "Users can view own orders" ON public.orders
FOR SELECT
USING (
    user_id = (auth.jwt() ->> 'sub')
);

-- 2. INSERT Policy: Allow ANY authenticated user to insert.
CREATE POLICY "Enable insert for authenticated users only" ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 3. UPDATE Policy
CREATE POLICY "Users can update own orders" ON public.orders
FOR UPDATE
USING (
    user_id = (auth.jwt() ->> 'sub')
);

-- Ensure RLS is enabled
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
