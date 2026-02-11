-- =========================================================
-- SUPER CLEANUP for 'card-assets'
-- =========================================================

-- 1. DROP ALL EXISTING POLICIES (Even the auto-generated ones)
-- We need to delete them by name. 
-- Look at your screenshot: "Give users access to own folder 1eub4dc_0", etc.
DROP POLICY IF EXISTS "Give users access to own folder 1eub4dc_0" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder 1eub4dc_1" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder 1eub4dc_2" ON storage.objects;
DROP POLICY IF EXISTS "public_read_card_assets 1eub4dc_0" ON storage.objects;

-- Also drop ours just in case
DROP POLICY IF EXISTS "final_allow_upload" ON storage.objects;
DROP POLICY IF EXISTS "final_allow_update" ON storage.objects;
DROP POLICY IF EXISTS "final_allow_select" ON storage.objects;


-- 2. CREATE THE SIMPLEST "OPEN" POLICY
-- This replaces all the complicated ones.

CREATE POLICY "Allow Public Access"
ON storage.objects
FOR ALL
USING ( bucket_id = 'card-assets' )
WITH CHECK ( bucket_id = 'card-assets' );
