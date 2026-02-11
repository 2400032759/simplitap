-- 1. Enable Delete Permission (Just in case)
DROP POLICY IF EXISTS "Users can delete their own profiles" ON "public"."profiles";
CREATE POLICY "Users can delete their own profiles" 
ON "public"."profiles" 
FOR DELETE 
TO authenticated 
USING (clerk_user_id = (auth.jwt() ->> 'sub'));

-- 2. Cleanup Duplicates
-- This will Keep the LATEST created card for each Job Title/Company combination
-- and delete the older duplicates.
DELETE FROM profiles
WHERE id IN (
  SELECT id
  FROM (
      SELECT id,
             ROW_NUMBER() OVER (
                 PARTITION BY clerk_user_id, job_title, company 
                 ORDER BY created_at DESC
             ) as rn
      FROM profiles
  ) t
  WHERE t.rn > 1
);
