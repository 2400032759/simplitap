-- RUN THIS IN YOUR SUPABASE SQL EDITOR
-- This creates the missing subscriptions table that the dashboard and payment system needs.

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id TEXT PRIMARY KEY, -- Razorpay Subscription ID
    user_id TEXT NOT NULL, -- Clerk User ID
    plan_id TEXT NOT NULL,
    status TEXT NOT NULL,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own subscriptions
CREATE POLICY "Users can view their own subscriptions" 
ON public.subscriptions FOR SELECT 
USING (auth.uid()::text = user_id);

-- Optional: Add index for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
