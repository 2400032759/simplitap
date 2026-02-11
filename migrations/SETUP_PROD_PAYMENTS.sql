-- PRODUCTION PAYMENTS SCHEMA
-- 1. Subscriptions Table (Single Source of Truth)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id text PRIMARY KEY, -- razorpay_subscription_id (sub_xxxx)
    user_id text NOT NULL, -- Clerk ID (user_xxxx)
    plan_id text NOT NULL,
    status text NOT NULL DEFAULT 'created', -- created, authenticated, active, halted, cancelled, completed, expired
    current_period_start timestamptz,
    current_period_end timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 2. Payments / Webhook Events Log (Audit Trail)
CREATE TABLE IF NOT EXISTS public.payments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    payment_id text, -- razorpay_payment_id (pay_xxxx)
    subscription_id text,
    user_id text, -- Clerk ID
    amount numeric,
    currency text DEFAULT 'INR',
    status text, -- captured, failed, etc.
    method text, -- upi, card, etc.
    event_id text, -- Webhook Idempotency Key (evt_xxxx)
    created_at timestamptz DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies (Users can View Own, No Insert/Update from Client)
-- Subscriptions
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;
CREATE POLICY "Users can view own subscription" ON public.subscriptions
    FOR SELECT USING (user_id = (select auth.jwt() ->> 'sub'));

-- Payments
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (user_id = (select auth.jwt() ->> 'sub'));

-- 5. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_subs_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subs_id ON public.subscriptions(id);
CREATE INDEX IF NOT EXISTS idx_payments_sub ON public.payments(subscription_id);
