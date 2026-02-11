
-- NUCLEAR OPTION: Drop all restrictive SELECT policies and allow authenticated users to read everything (Use with caution).
-- If this works, it confirms RLS is the issue. If it doesn't, data is not being inserted.

DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;

-- Allow authenticated users to view all rows for debugging
CREATE POLICY "Allow Read All Authenticated" ON public.orders
FOR SELECT
TO authenticated
USING (true);
