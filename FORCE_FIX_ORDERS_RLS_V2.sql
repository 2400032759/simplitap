
-- Drop potential conflicting policies again to be sure
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.orders;
DROP POLICY IF EXISTS "Users can update own orders" ON public.orders;

-- 1. READ Policy: Allow users to view orders where user_id matches their auth.uid
CREATE POLICY "Users can view own orders" ON public.orders
FOR SELECT
USING (
    user_id = auth.uid()::text 
);

-- 2. INSERT Policy: Allow ANY authenticated user to insert ANY row.
CREATE POLICY "Enable insert for authenticated users only" ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 3. UPDATE/DELETE Policy: Only own orders
CREATE POLICY "Users can update own orders" ON public.orders
FOR UPDATE
USING (user_id = auth.uid()::text);

-- Grant privileges (sometimes this is missed)
GRANT ALL ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
