-- Remove total_funding_pkr column from vasp_companies table
-- Canhav - Clean up old funding column after migration to private/public company flags

-- Step 1: Verify the column exists and check current data
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'vasp_companies' 
AND column_name = 'total_funding_pkr';

-- Step 2: Check if any data exists in the column (optional verification)
SELECT COUNT(*) as total_rows,
       COUNT(total_funding_pkr) as rows_with_funding_data,
       COUNT(*) - COUNT(total_funding_pkr) as rows_with_null_funding
FROM vasp_companies;

-- Step 3: Show sample data before removal (optional)
SELECT slug, name, total_funding_pkr, private_company, public_company 
FROM vasp_companies 
WHERE slug IN ('coinbase','binance','bitget','gemini','okx')
ORDER BY slug;

-- Step 4: Remove the total_funding_pkr column
ALTER TABLE vasp_companies 
DROP COLUMN IF EXISTS total_funding_pkr;

-- Step 5: Verify the column has been removed
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'vasp_companies' 
AND column_name IN ('total_funding_pkr', 'private_company', 'public_company')
ORDER BY column_name;
