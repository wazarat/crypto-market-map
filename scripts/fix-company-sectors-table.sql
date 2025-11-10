-- Fix Company Sectors Table - Drop and Recreate with Correct Structure
-- Run this if the existing company_sectors table has wrong structure

-- Step 1: Drop existing company_sectors table if it exists
DROP TABLE IF EXISTS company_sectors CASCADE;

-- Step 2: Create company_sectors table with correct structure
CREATE TABLE company_sectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    category_id UUID REFERENCES vasp_categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique company-category pairs
    UNIQUE(company_id, category_id)
);

-- Step 3: Add indexes for better performance
CREATE INDEX idx_company_sectors_company_id ON company_sectors(company_id);
CREATE INDEX idx_company_sectors_category_id ON company_sectors(category_id);

-- Step 4: Migrate existing single category assignments to many-to-many
INSERT INTO company_sectors (company_id, category_id)
SELECT id, category_id 
FROM vasp_companies 
WHERE category_id IS NOT NULL;

-- Step 5: Add comments for documentation
COMMENT ON TABLE company_sectors IS 'Many-to-many relationship between companies and sectors/categories';
COMMENT ON COLUMN company_sectors.company_id IS 'Reference to the company';
COMMENT ON COLUMN company_sectors.category_id IS 'Reference to the sector/category';

-- Step 6: Show results
SELECT 
    'company_sectors table recreated successfully' as status,
    COUNT(*) as total_assignments,
    COUNT(DISTINCT company_id) as companies_with_sectors,
    COUNT(DISTINCT category_id) as categories_used
FROM company_sectors;

-- Step 7: Show sample data to verify
SELECT 
    c.name as company_name,
    cat.name as category_name,
    cat.slug as category_slug
FROM company_sectors cs
JOIN vasp_companies c ON cs.company_id = c.id
JOIN vasp_categories cat ON cs.category_id = cat.id
ORDER BY c.name, cat.name
LIMIT 10;
