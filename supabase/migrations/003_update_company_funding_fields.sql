-- Migration: Replace total_funding_pkr with private_company and public_company boolean fields
-- Canhav - Company funding structure update

-- Step 1: Add new boolean columns
ALTER TABLE vasp_companies 
ADD COLUMN private_company BOOLEAN DEFAULT NULL,
ADD COLUMN public_company BOOLEAN DEFAULT NULL;

-- Step 2: Add constraint to ensure at least one is specified (optional)
-- Companies should be either private, public, or both can be specified
-- ALTER TABLE vasp_companies 
-- ADD CONSTRAINT check_company_type 
-- CHECK (private_company IS NOT NULL OR public_company IS NOT NULL);

-- Step 3: Migrate existing data (if needed)
-- You can set default values based on existing total_funding_pkr data
-- For example, companies with funding data might be considered private
UPDATE vasp_companies 
SET private_company = CASE 
    WHEN total_funding_pkr IS NOT NULL AND total_funding_pkr > 0 THEN true
    ELSE NULL
END;

-- Step 4: Drop the old total_funding_pkr column (uncomment when ready)
-- ALTER TABLE vasp_companies DROP COLUMN total_funding_pkr;

-- Step 5: Add comments for documentation
COMMENT ON COLUMN vasp_companies.private_company IS 'Indicates if the company is privately held';
COMMENT ON COLUMN vasp_companies.public_company IS 'Indicates if the company is publicly traded';

-- Step 6: Update the updated_at trigger to include new columns
-- (The existing trigger will automatically handle these new columns)
