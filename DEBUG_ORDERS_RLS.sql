
-- Drop the SELECT policy
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;

-- Relax the SELECT policy to allow users to view ANY order that has their user_id
-- We remove the auth.uid() check temporarily to debug if it's a type mismatch issue.
-- Instead, we can verify if the user is authenticated.

CREATE POLICY "Users can view own orders" ON public.orders
FOR SELECT
USING (
    user_id = auth.uid()::text 
    OR 
    -- If user_id was saved with quotes or whitespace, trim it.
    trim(both '"' from user_id) = auth.uid()::text
);

-- DEBUGGING: Allow reading ALL orders for now to confirm data exists.
-- UNCOMMENT THE BELOW LINE IF NOTHING WORKS. THIS IS INSECURE BUT GOOD FOR DEBUGGING.
-- CREATE POLICY "Allow Read All" ON public.orders FOR SELECT USING (true);
