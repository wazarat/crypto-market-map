-- Add missing sectors column to vasp_companies table
-- This column will store an array of sector slugs for easier querying

ALTER TABLE vasp_companies 
ADD COLUMN IF NOT EXISTS sectors TEXT[] DEFAULT '{}';

-- Create an index on the sectors column for better performance
CREATE INDEX IF NOT EXISTS idx_companies_sectors ON vasp_companies USING GIN (sectors);

-- Update existing companies to populate the sectors column from company_sectors table
-- (This will be empty initially since no companies exist yet)
UPDATE vasp_companies 
SET sectors = (
    SELECT ARRAY_AGG(sector_slug) 
    FROM company_sectors 
    WHERE company_sectors.company_id = vasp_companies.id
)
WHERE EXISTS (
    SELECT 1 FROM company_sectors 
    WHERE company_sectors.company_id = vasp_companies.id
);

-- Create a trigger to keep sectors column in sync with company_sectors table
CREATE OR REPLACE FUNCTION sync_company_sectors()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Add sector to the company's sectors array
        UPDATE vasp_companies 
        SET sectors = ARRAY_APPEND(
            COALESCE(sectors, '{}'), 
            NEW.sector_slug
        )
        WHERE id = NEW.company_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Remove sector from the company's sectors array
        UPDATE vasp_companies 
        SET sectors = ARRAY_REMOVE(sectors, OLD.sector_slug)
        WHERE id = OLD.company_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to keep the sectors column in sync
DROP TRIGGER IF EXISTS sync_sectors_insert ON company_sectors;
CREATE TRIGGER sync_sectors_insert
    AFTER INSERT ON company_sectors
    FOR EACH ROW EXECUTE FUNCTION sync_company_sectors();

DROP TRIGGER IF EXISTS sync_sectors_delete ON company_sectors;
CREATE TRIGGER sync_sectors_delete
    AFTER DELETE ON company_sectors
    FOR EACH ROW EXECUTE FUNCTION sync_company_sectors();

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'vasp_companies' 
AND column_name = 'sectors';
