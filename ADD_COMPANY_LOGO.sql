-- Add company_logo_url column to profiles table
ALTER TABLE "public"."profiles" 
ADD COLUMN IF NOT EXISTS "company_logo_url" TEXT;

-- Ensure RLS allows update to this column (usually covers all columns, but good to check)
-- No special policy needed if generic update is allowed.
