ALTER TABLE public.teams 
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active';

-- Optional: Update existing teams if any (though usually defaults handle it on insert)
UPDATE public.teams SET subscription_status = 'active' WHERE subscription_status IS NULL;
