-- Quick Migration: Add ticker_symbol column to vasp_companies
-- Run this in Supabase SQL editor to fix the form error

-- Step 1: Add ticker_symbol column
ALTER TABLE vasp_companies 
ADD COLUMN IF NOT EXISTS ticker_symbol VARCHAR(10);

-- Step 2: Add comment for documentation
COMMENT ON COLUMN vasp_companies.ticker_symbol IS 'Stock ticker symbol for public companies (e.g., COIN, HOOD, SQ, PYPL)';

-- Step 3: Add some example ticker symbols for existing public companies
UPDATE vasp_companies 
SET ticker_symbol = CASE 
    WHEN slug = 'coinbase' THEN 'COIN'
    WHEN slug = 'robinhood' THEN 'HOOD'
    WHEN slug = 'square' OR slug = 'block' THEN 'SQ'
    WHEN slug = 'paypal' THEN 'PYPL'
    WHEN slug = 'visa' THEN 'V'
    WHEN slug = 'mastercard' THEN 'MA'
    ELSE NULL
END
WHERE public_company = true;

-- Step 4: Verify the changes
SELECT name, slug, public_company, ticker_symbol 
FROM vasp_companies 
WHERE public_company = true OR ticker_symbol IS NOT NULL
ORDER BY name;

-- Success message
SELECT 'ticker_symbol column added successfully! You can now add stock tickers to public companies.' as status;
