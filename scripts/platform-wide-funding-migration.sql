-- Platform-Wide Migration: Remove total_funding_pkr and Add private/public company fields
-- Canhav - Complete migration for ALL companies on the platform

-- Step 1: Create backup of entire companies table
DROP TABLE IF EXISTS vasp_companies_backup_full;
CREATE TABLE vasp_companies_backup_full AS 
SELECT * FROM vasp_companies;

-- Step 2: Show current state before migration
SELECT 
    COUNT(*) as total_companies,
    COUNT(total_funding_pkr) as companies_with_funding_data,
    COUNT(*) - COUNT(total_funding_pkr) as companies_without_funding_data
FROM vasp_companies;

-- Step 3: Add new private/public company columns if they don't exist
ALTER TABLE vasp_companies 
ADD COLUMN IF NOT EXISTS private_company BOOLEAN DEFAULT NULL,
ADD COLUMN IF NOT EXISTS public_company BOOLEAN DEFAULT NULL;

-- Step 4: Migrate existing total_funding_pkr data to private_company flag
-- Companies with funding data are assumed to be private companies
UPDATE vasp_companies 
SET private_company = CASE 
    WHEN total_funding_pkr IS NOT NULL AND total_funding_pkr > 0 THEN true
    ELSE NULL
END
WHERE private_company IS NULL;

-- Step 5: Set known public companies (you can add more as needed)
UPDATE vasp_companies 
SET private_company = false, public_company = true
WHERE slug IN (
    'coinbase',  -- NASDAQ: COIN
    'robinhood', -- NASDAQ: HOOD (if exists)
    'square',    -- NYSE: SQ (if exists)
    'paypal'     -- NASDAQ: PYPL (if exists)
);

-- Step 6: Set known private companies (major ones)
UPDATE vasp_companies 
SET private_company = true, public_company = false
WHERE slug IN (
    'binance',
    'bitget', 
    'gemini',
    'okx',
    'kraken',
    'crypto-com',
    'ftx',
    'kucoin',
    'huobi',
    'bybit'
) AND private_company IS NULL;

-- Step 7: For companies without specific data, set as unknown (NULL values)
-- This allows you to research and update them later

-- Step 8: Add comments for documentation
COMMENT ON COLUMN vasp_companies.private_company IS 'Indicates if the company is privately held (true) or not (false). NULL = unknown.';
COMMENT ON COLUMN vasp_companies.public_company IS 'Indicates if the company is publicly traded (true) or not (false). NULL = unknown.';

-- Step 9: Remove the old total_funding_pkr column completely
ALTER TABLE vasp_companies 
DROP COLUMN IF EXISTS total_funding_pkr;

-- Step 10: Add constraint to prevent both being true simultaneously (optional)
-- ALTER TABLE vasp_companies 
-- ADD CONSTRAINT check_not_both_private_and_public 
-- CHECK (NOT (private_company = true AND public_company = true));

-- Step 11: Show results after migration
SELECT 
    COUNT(*) as total_companies,
    COUNT(CASE WHEN private_company = true THEN 1 END) as private_companies,
    COUNT(CASE WHEN public_company = true THEN 1 END) as public_companies,
    COUNT(CASE WHEN private_company IS NULL AND public_company IS NULL THEN 1 END) as unknown_companies
FROM vasp_companies;

-- Step 12: Show sample of migrated data
SELECT 
    slug,
    name,
    private_company,
    public_company,
    CASE 
        WHEN public_company = true THEN 'Public'
        WHEN private_company = true THEN 'Private'
        ELSE 'Unknown'
    END as company_type,
    updated_at
FROM vasp_companies 
ORDER BY 
    CASE 
        WHEN public_company = true THEN 1
        WHEN private_company = true THEN 2
        ELSE 3
    END,
    name
LIMIT 20;

-- Step 13: Verify schema changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'vasp_companies' 
AND column_name IN ('total_funding_pkr', 'private_company', 'public_company')
ORDER BY column_name;
