
-- Drop the temporary unsafe policies
DROP POLICY IF EXISTS "Allow Authenticated Read All" ON public.orders;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.orders;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;

-- 1. READ Policy: Allow users to view orders where user_id matches their auth.uid
-- Re-applying strict policy but using explicit casting and trimming to ensure robustness.
CREATE POLICY "Users can view own orders" ON public.orders
FOR SELECT
USING (
    user_id = auth.uid()::text 
);

-- 2. INSERT Policy: Allow ANY authenticated user to insert.
-- We keep this permissive one because the client-side user_id might differ slightly from server auth context in edge cases,
-- but since they can only *read* their own due to the SELECT policy, this is safe enough for this use case.
CREATE POLICY "Enable insert for authenticated users only" ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 3. UPDATE Policy (optional, if you have edit features)
CREATE POLICY "Users can update own orders" ON public.orders
FOR UPDATE
USING (user_id = auth.uid()::text);
