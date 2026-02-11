# Fixing Supabase Storage for Clerk

Since Clerk uses text-based User IDs (`user_...`) and Supabase Storage expects UUIDs for the `owner_id` column, authenticated uploads often fail with:
`invalid input syntax for type uuid`

To fix this, we are using **Anonymous Uploads** in the code. However, this requires you to update tour Storage Policies to allow anonymous uploads.

## Step 1: Go to Supabase Dashboard
1. Open your project.
2. Go to **Storage** -> **Policies**.
3. Find the `card-assets` bucket.

## Step 2: Add Policy for Anonymous Uploads
Create a new policy under `card-assets` with the following settings:
- **Policy Name**: `Allow Public Uploads`
- **Allowed Operations**: `INSERT`, `UPDATE`, `SELECT`
- **Target Roles**: `anon` (or check "Select for all roles")
- **USING expression**: `bucket_id = 'card-assets'`
- **WITH CHECK expression**: `bucket_id = 'card-assets'`

## SQL Command (Alternative)
You can run this in the SQL Editor:

```sql
-- Allow anonymous inserts/updates to card-assets
CREATE POLICY "Public Uploads"
ON storage.objects
FOR INSERT
TO public
WITH CHECK ( bucket_id = 'card-assets' );

CREATE POLICY "Public Updates"
ON storage.objects
FOR UPDATE
TO public
USING ( bucket_id = 'card-assets' );
```

Once this is applied, the upload feature will work perfectly!
