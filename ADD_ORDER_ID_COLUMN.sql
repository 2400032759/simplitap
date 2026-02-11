-- Add razorpay_order_id to orders table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'razorpay_order_id') THEN 
        ALTER TABLE public.orders ADD COLUMN razorpay_order_id TEXT; 
    END IF; 
END $$;
