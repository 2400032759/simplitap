-- Create contact_exchanges table
CREATE TABLE IF NOT EXISTS contact_exchanges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    card_owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    visitor_name TEXT NOT NULL,
    visitor_email TEXT NOT NULL,
    visitor_job_title TEXT,
    visitor_company TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes for better query performance
    CONSTRAINT contact_exchanges_email_check CHECK (visitor_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create index on card_owner_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_contact_exchanges_owner ON contact_exchanges(card_owner_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_contact_exchanges_created_at ON contact_exchanges(created_at DESC);

-- Enable Row Level Security
ALTER TABLE contact_exchanges ENABLE ROW LEVEL SECURITY;

-- Policy: Card owners can view their own exchanges
CREATE POLICY "Card owners can view their exchanges"
    ON contact_exchanges
    FOR SELECT
    USING (card_owner_id IN (
        SELECT id FROM profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
    ));

-- Policy: Anyone can insert (for public card visitors)
CREATE POLICY "Anyone can insert contact exchanges"
    ON contact_exchanges
    FOR INSERT
    WITH CHECK (true);

-- Policy: Card owners can delete their exchanges
CREATE POLICY "Card owners can delete their exchanges"
    ON contact_exchanges
    FOR DELETE
    USING (card_owner_id IN (
        SELECT id FROM profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
    ));
