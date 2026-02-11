-- 1. Add the missing is_premium column (safe to run even if it exists)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;

-- 2. Force enable Premium for your specific user (username = 'test')
UPDATE public.profiles 
SET is_premium = TRUE 
WHERE username = 'test';

-- 3. (Optional) Force enable for ALL users if you just want to test everything unlocked
-- UPDATE public.profiles SET is_premium = TRUE;
