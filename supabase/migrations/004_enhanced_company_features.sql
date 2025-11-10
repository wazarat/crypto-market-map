-- Enhanced Company Features Migration
-- Canhav - TradingView, Research Feed, and Collaborative Notes

-- Step 1: Add ticker_symbol to vasp_companies for TradingView integration
ALTER TABLE vasp_companies 
ADD COLUMN IF NOT EXISTS ticker_symbol VARCHAR(10);

COMMENT ON COLUMN vasp_companies.ticker_symbol IS 'Stock ticker symbol for public companies (e.g., COIN, HOOD)';

-- Step 2: Create research_items table for uploadable research
CREATE TABLE IF NOT EXISTS research_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_slug VARCHAR(255) NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(1000) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- 'pdf', 'docx', 'doc'
    file_size_bytes BIGINT,
    submitted_by_user_id UUID,
    submitted_by_name VARCHAR(255) NOT NULL,
    submitted_by_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_public BOOLEAN DEFAULT true,
    download_count INTEGER DEFAULT 0
);

-- Add indexes for research_items
CREATE INDEX IF NOT EXISTS idx_research_items_company_slug ON research_items(company_slug);
CREATE INDEX IF NOT EXISTS idx_research_items_created_at ON research_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_research_items_submitted_by ON research_items(submitted_by_user_id);

-- Step 3: Create research_comments table for comments on research items
CREATE TABLE IF NOT EXISTS research_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    research_item_id UUID NOT NULL REFERENCES research_items(id) ON DELETE CASCADE,
    user_id UUID,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255),
    comment_text TEXT NOT NULL,
    mentioned_users TEXT[], -- Array of @mentioned usernames
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_edited BOOLEAN DEFAULT false
);

-- Add indexes for research_comments
CREATE INDEX IF NOT EXISTS idx_research_comments_research_item ON research_comments(research_item_id);
CREATE INDEX IF NOT EXISTS idx_research_comments_created_at ON research_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_research_comments_user ON research_comments(user_id);

-- Step 4: Update user_notes table for enhanced collaborative features
ALTER TABLE user_notes 
ADD COLUMN IF NOT EXISTS user_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS user_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS mentioned_users TEXT[], -- Array of @mentioned usernames
ADD COLUMN IF NOT EXISTS is_edited BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS reply_to_note_id UUID REFERENCES user_notes(id);

-- Add indexes for enhanced user_notes
CREATE INDEX IF NOT EXISTS idx_user_notes_mentioned_users ON user_notes USING GIN(mentioned_users);
CREATE INDEX IF NOT EXISTS idx_user_notes_reply_to ON user_notes(reply_to_note_id);

-- Step 5: Create users table for @mentions autocomplete (if not exists)
CREATE TABLE IF NOT EXISTS platform_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for platform_users
CREATE INDEX IF NOT EXISTS idx_platform_users_username ON platform_users(username);
CREATE INDEX IF NOT EXISTS idx_platform_users_email ON platform_users(email);
CREATE INDEX IF NOT EXISTS idx_platform_users_active ON platform_users(is_active) WHERE is_active = true;

-- Step 6: Insert some demo users for @mentions
INSERT INTO platform_users (username, display_name, email, is_active) VALUES
    ('admin', 'Admin User', 'admin@canhav.com', true),
    ('researcher', 'Research Analyst', 'research@canhav.com', true),
    ('analyst', 'Market Analyst', 'analyst@canhav.com', true),
    ('wazarat', 'Wazarat', 'waz@canhav.com', true)
ON CONFLICT (username) DO NOTHING;

-- Step 7: Add some example ticker symbols for public companies
UPDATE vasp_companies 
SET ticker_symbol = CASE 
    WHEN slug = 'coinbase' THEN 'COIN'
    WHEN slug = 'robinhood' THEN 'HOOD'
    WHEN slug = 'square' THEN 'SQ'
    WHEN slug = 'paypal' THEN 'PYPL'
    ELSE NULL
END
WHERE public_company = true;

-- Step 8: Create updated_at triggers for new tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
DROP TRIGGER IF EXISTS update_research_items_updated_at ON research_items;
CREATE TRIGGER update_research_items_updated_at 
    BEFORE UPDATE ON research_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_research_comments_updated_at ON research_comments;
CREATE TRIGGER update_research_comments_updated_at 
    BEFORE UPDATE ON research_comments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 9: Add RLS policies for security
ALTER TABLE research_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_users ENABLE ROW LEVEL SECURITY;

-- Allow public read access to research items and comments
CREATE POLICY "Allow public read access to research items" ON research_items FOR SELECT USING (is_public = true);
CREATE POLICY "Allow public read access to research comments" ON research_comments FOR SELECT USING (true);
CREATE POLICY "Allow public read access to active users" ON platform_users FOR SELECT USING (is_active = true);

-- Allow authenticated users to insert/update their own content
CREATE POLICY "Allow authenticated users to insert research items" ON research_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated users to insert comments" ON research_comments FOR INSERT WITH CHECK (true);

-- Step 10: Add comments for documentation
COMMENT ON TABLE research_items IS 'Stores uploadable research documents (PDF, Word) for companies';
COMMENT ON TABLE research_comments IS 'Comments and discussions on research items with @mention support';
COMMENT ON TABLE platform_users IS 'Platform users for @mentions and attribution';

COMMENT ON COLUMN research_items.company_slug IS 'Links research to company via slug';
COMMENT ON COLUMN research_items.file_path IS 'Storage path for uploaded research file';
COMMENT ON COLUMN research_items.submitted_by_name IS 'Name of person who submitted the research';

COMMENT ON COLUMN research_comments.mentioned_users IS 'Array of @mentioned usernames in the comment';
COMMENT ON COLUMN user_notes.mentioned_users IS 'Array of @mentioned usernames in the note';
COMMENT ON COLUMN user_notes.reply_to_note_id IS 'ID of note this is replying to (for threading)';
