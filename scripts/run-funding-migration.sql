-- Run this FIRST before running the bulk-update-companies.sql
-- This script adds the new private_company and public_company columns

-- Step 1: Add new boolean columns
ALTER TABLE vasp_companies 
ADD COLUMN IF NOT EXISTS private_company BOOLEAN DEFAULT NULL,
ADD COLUMN IF NOT EXISTS public_company BOOLEAN DEFAULT NULL;

-- Step 2: Add comments for documentation
COMMENT ON COLUMN vasp_companies.private_company IS 'Indicates if the company is privately held';
COMMENT ON COLUMN vasp_companies.public_company IS 'Indicates if the company is publicly traded';

-- Step 3: Verify the columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'vasp_companies' 
AND column_name IN ('private_company', 'public_company');

-- Optional: Drop the old total_funding_pkr column (uncomment when ready)
-- ALTER TABLE vasp_companies DROP COLUMN IF EXISTS total_funding_pkr;
