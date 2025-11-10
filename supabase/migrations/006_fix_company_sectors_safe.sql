-- Safe Company Sectors Migration - Handles Existing Table
-- This script safely handles the case where company_sectors table already exists

-- Step 1: Check if table exists and create only if it doesn't
DO $$ 
BEGIN
    -- Check if company_sectors table exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'company_sectors') THEN
        -- Create the table if it doesn't exist
        CREATE TABLE company_sectors (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
            category_id UUID REFERENCES vasp_categories(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            
            -- Ensure unique company-category pairs
            UNIQUE(company_id, category_id)
        );
        
        RAISE NOTICE 'Created company_sectors table';
    ELSE
        RAISE NOTICE 'company_sectors table already exists, skipping creation';
    END IF;
END $$;

-- Step 2: Ensure indexes exist (safe to run multiple times)
CREATE INDEX IF NOT EXISTS idx_company_sectors_company_id ON company_sectors(company_id);
CREATE INDEX IF NOT EXISTS idx_company_sectors_category_id ON company_sectors(category_id);

-- Step 3: Migrate existing single category assignments (only if not already migrated)
DO $$
DECLARE
    migration_count INTEGER;
BEGIN
    -- Check if migration has already been done
    SELECT COUNT(*) INTO migration_count FROM company_sectors;
    
    IF migration_count = 0 THEN
        -- Migrate existing single category assignments
        INSERT INTO company_sectors (company_id, category_id)
        SELECT id, category_id 
        FROM vasp_companies 
        WHERE category_id IS NOT NULL
        ON CONFLICT (company_id, category_id) DO NOTHING;
        
        GET DIAGNOSTICS migration_count = ROW_COUNT;
        RAISE NOTICE 'Migrated % existing company-category assignments', migration_count;
    ELSE
        RAISE NOTICE 'company_sectors table already has % records, skipping migration', migration_count;
    END IF;
END $$;

-- Step 4: Add comments for documentation
COMMENT ON TABLE company_sectors IS 'Many-to-many relationship between companies and sectors/categories';
COMMENT ON COLUMN company_sectors.company_id IS 'Reference to the company';
COMMENT ON COLUMN company_sectors.category_id IS 'Reference to the sector/category';

-- Step 5: Verify the setup
SELECT 
    'company_sectors table setup complete' as status,
    COUNT(*) as total_assignments,
    COUNT(DISTINCT company_id) as companies_with_sectors,
    COUNT(DISTINCT category_id) as categories_used
FROM company_sectors;

-- Show sample data
SELECT 
    c.name as company_name,
    cat.name as category_name,
    cat.slug as category_slug
FROM company_sectors cs
JOIN vasp_companies c ON cs.company_id = c.id
JOIN vasp_categories cat ON cs.category_id = cat.id
ORDER BY c.name, cat.name
LIMIT 10;
