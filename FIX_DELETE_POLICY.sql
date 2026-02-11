-- Enable deletion of profiles
-- This ensures that authenticated users can delete rows where the clerk_user_id matches their token
-- Note: We first drop the policy if it exists to avoid errors, then recreate it.

DROP POLICY IF EXISTS "Users can delete their own profiles" ON "public"."profiles";
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON "public"."profiles";

CREATE POLICY "Users can delete their own profiles"
ON "public"."profiles"
FOR DELETE
TO authenticated
USING (
  clerk_user_id = (auth.jwt() ->> 'sub')
);

-- Also ensure update/select are robust if not already
DROP POLICY IF EXISTS "Users can select their own profiles" ON "public"."profiles";
CREATE POLICY "Users can select their own profiles"
ON "public"."profiles"
FOR SELECT
TO authenticated
USING (
  clerk_user_id = (auth.jwt() ->> 'sub')
);
