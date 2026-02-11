-- Create Orders table to store product orders
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT, -- Clerk User ID (Foreign key constraint removed to avoid unique constraint error)
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    
    total_amount NUMERIC NOT NULL, -- This will be the MRP based amount as requested
    status TEXT DEFAULT 'pending', -- pending, paid, shipped, delivered, cancelled
    
    coupon_code TEXT, -- Store coupon code if applied
    payment_id TEXT, -- Store Razorpay Payment ID
    
    items JSONB NOT NULL, -- Stores array of cart items with customization
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policies

-- 1. Users can view their own orders
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT
    USING (auth.uid()::text = user_id);

-- 2. Users can insert their own orders (Authenticated)
CREATE POLICY "Users can create orders" ON public.orders
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

-- 3. Allow public insert for guest checkout (Optional, if you want unauthenticated users to buy)
-- If you want to allow guests, uncomment the following:
-- CREATE POLICY "Public can create orders" ON public.orders
--     FOR INSERT
--     WITH CHECK (true);

-- 4. Service Role (Server) has full access (Default in Supabase but good to be explicit mentally)

-- Grant access to authenticated users
GRANT ALL ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
