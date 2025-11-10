-- Add Many-to-Many Relationship for Company Sectors
-- This allows companies to operate in multiple sectors simultaneously

-- Create junction table for company-sector relationships
CREATE TABLE company_sectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    category_id UUID REFERENCES vasp_categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique company-category pairs
    UNIQUE(company_id, category_id)
);

-- Add indexes for better performance
CREATE INDEX idx_company_sectors_company_id ON company_sectors(company_id);
CREATE INDEX idx_company_sectors_category_id ON company_sectors(category_id);

-- Migrate existing single category assignments to the new many-to-many table
INSERT INTO company_sectors (company_id, category_id)
SELECT id, category_id 
FROM vasp_companies 
WHERE category_id IS NOT NULL;

-- Add comment for documentation
COMMENT ON TABLE company_sectors IS 'Many-to-many relationship between companies and sectors/categories';
COMMENT ON COLUMN company_sectors.company_id IS 'Reference to the company';
COMMENT ON COLUMN company_sectors.category_id IS 'Reference to the sector/category';

-- Note: We keep the original category_id column for backward compatibility
-- but new sector assignments should use the company_sectors table
