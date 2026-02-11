
-- Drop ALL potential existing policies to ensure a clean slate
DROP POLICY IF EXISTS "Allow Authenticated Read All" ON public.orders;
DROP POLICY IF EXISTS "Allow Read All Authenticated" ON public.orders; -- Just in case variation
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.orders;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update own orders" ON public.orders; -- FIX: Ensure this is dropped too

-- 1. READ Policy: Allow users to view orders where user_id matches their auth.uid
CREATE POLICY "Users can view own orders" ON public.orders
FOR SELECT
USING (
    user_id = auth.uid()::text 
);

-- 2. INSERT Policy: Allow ANY authenticated user to insert.
CREATE POLICY "Enable insert for authenticated users only" ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 3. UPDATE Policy
CREATE POLICY "Users can update own orders" ON public.orders
FOR UPDATE
USING (user_id = auth.uid()::text);

-- Ensure RLS is enabled
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
