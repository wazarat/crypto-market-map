-- Recreate company_sectors table with correct structure
-- This will fix the missing category_id column issue

-- Step 1: Drop the existing malformed table
DROP TABLE IF EXISTS company_sectors CASCADE;

-- Step 2: Create the table with correct structure
CREATE TABLE company_sectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES vasp_companies(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES vasp_categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique company-category pairs
    UNIQUE(company_id, category_id)
);

-- Step 3: Add indexes for performance
CREATE INDEX idx_company_sectors_company_id ON company_sectors(company_id);
CREATE INDEX idx_company_sectors_category_id ON company_sectors(category_id);

-- Step 4: Add table comments
COMMENT ON TABLE company_sectors IS 'Many-to-many relationship between companies and sectors/categories';
COMMENT ON COLUMN company_sectors.company_id IS 'Reference to the company';
COMMENT ON COLUMN company_sectors.category_id IS 'Reference to the sector/category';

-- Step 5: Migrate existing single-category assignments
-- This preserves existing company-category relationships
INSERT INTO company_sectors (company_id, category_id)
SELECT id, category_id 
FROM vasp_companies 
WHERE category_id IS NOT NULL;

-- Step 6: Verify the new structure
SELECT 
    'NEW company_sectors structure:' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'company_sectors'
ORDER BY ordinal_position;

-- Step 7: Show migrated data
SELECT 
    'Migrated company-sector assignments:' as info,
    COUNT(*) as total_assignments,
    COUNT(DISTINCT company_id) as companies_with_sectors,
    COUNT(DISTINCT category_id) as categories_used
FROM company_sectors;

-- Step 8: Show sample assignments
SELECT 
    'Sample assignments:' as info,
    c.name as company_name,
    cat.name as category_name,
    cat.slug as category_slug
FROM company_sectors cs
JOIN vasp_companies c ON cs.company_id = c.id
JOIN vasp_categories cat ON cs.category_id = cat.id
ORDER BY c.name, cat.name
LIMIT 10;
