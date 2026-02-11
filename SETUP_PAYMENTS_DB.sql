
-- Add columns to profiles for subscription management
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS razorpay_subscription_id text,
ADD COLUMN IF NOT EXISTS razorpay_customer_id text,
ADD COLUMN IF NOT EXISTS plan_type text DEFAULT 'free', -- 'free', 'plus', 'teams'
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'inactive', -- 'active', 'authenticated', 'cancelled', 'expired'
ADD COLUMN IF NOT EXISTS current_period_end timestamptz;

-- Create a table for payment history (optional but recommended)
CREATE TABLE IF NOT EXISTS payment_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  razorpay_payment_id text,
  razorpay_subscription_id text,
  amount numeric,
  currency text DEFAULT 'INR',
  status text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own history
CREATE POLICY "Users can view own payment history" 
ON payment_history FOR SELECT 
USING (auth.uid() = user_id);
