-- Safe Platform-Wide Migration: Add private/public company fields
-- Canhav - Safe migration that checks for existing columns first

-- Step 1: Create backup of entire companies table
DROP TABLE IF EXISTS vasp_companies_backup_full;
CREATE TABLE vasp_companies_backup_full AS 
SELECT * FROM vasp_companies;

-- Step 2: Check current table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'vasp_companies' 
AND column_name IN ('total_funding_pkr', 'private_company', 'public_company')
ORDER BY column_name;

-- Step 3: Show current state (safe query that works regardless of columns)
SELECT COUNT(*) as total_companies FROM vasp_companies;

-- Step 4: Add new private/public company columns if they don't exist
ALTER TABLE vasp_companies 
ADD COLUMN IF NOT EXISTS private_company BOOLEAN DEFAULT NULL,
ADD COLUMN IF NOT EXISTS public_company BOOLEAN DEFAULT NULL;

-- Step 5: Set known public companies
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
);

-- Step 7: For any remaining companies without classification, you can set defaults
-- Uncomment one of these options:

-- Option A: Set all unclassified as private (conservative approach)
-- UPDATE vasp_companies 
-- SET private_company = true, public_company = false
-- WHERE private_company IS NULL AND public_company IS NULL;

-- Option B: Leave unclassified as NULL for manual review
-- (Do nothing - they remain NULL)

-- Step 8: Add comments for documentation
COMMENT ON COLUMN vasp_companies.private_company IS 'Indicates if the company is privately held (true) or not (false). NULL = unknown.';
COMMENT ON COLUMN vasp_companies.public_company IS 'Indicates if the company is publicly traded (true) or not (false). NULL = unknown.';

-- Step 9: Remove the old total_funding_pkr column if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'vasp_companies' 
        AND column_name = 'total_funding_pkr'
    ) THEN
        ALTER TABLE vasp_companies DROP COLUMN total_funding_pkr;
        RAISE NOTICE 'total_funding_pkr column removed successfully';
    ELSE
        RAISE NOTICE 'total_funding_pkr column does not exist, skipping removal';
    END IF;
END $$;

-- Step 10: Show results after migration
SELECT 
    COUNT(*) as total_companies,
    COUNT(CASE WHEN private_company = true THEN 1 END) as private_companies,
    COUNT(CASE WHEN public_company = true THEN 1 END) as public_companies,
    COUNT(CASE WHEN private_company IS NULL AND public_company IS NULL THEN 1 END) as unknown_companies
FROM vasp_companies;

-- Step 11: Show sample of migrated data
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

-- Step 12: Verify final schema
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'vasp_companies' 
AND column_name IN ('total_funding_pkr', 'private_company', 'public_company')
ORDER BY column_name;
