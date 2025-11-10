-- Bulk Company Data Update Script
-- Canhav - Safe data update with backup and rollback capability

-- Step 1: Create backup table (optional but recommended)
CREATE TABLE vasp_companies_backup AS 
SELECT * FROM vasp_companies;

-- Step 2: Update existing companies or insert new ones
INSERT INTO vasp_companies (
    slug,
    name,
    year_founded,
    founder_ceo_name,
    headquarters_location,
    website,
    company_description,
    category_id,
    pakistan_operations,
    contact_email,
    employee_count,
    private_company,
    public_company,
    license_status,
    verification_status
) VALUES 
    -- Coinbase (Public Company - NASDAQ: COIN)
    ('coinbase', 'Coinbase', 2012, 'Brian Armstrong', 'San Francisco, California, USA', 'https://www.coinbase.com',
     'US-based publicly listed cryptocurrency exchange and platform offering spot trading, custody, and institutional services.',
     (SELECT id FROM vasp_categories WHERE slug = 'exchange-services'),
     false, 'support@coinbase.com', 3800, false, true, 'None', 'Verified'),

    -- Binance (Private Company)
    ('binance', 'Binance', 2017, 'Changpeng Zhao (CZ)', 'Global / no official HQ (operates from multiple jurisdictions)', 'https://www.binance.com',
     'Global cryptocurrency exchange offering spot, margin, futures, options, launchpad and other virtual asset services.',
     (SELECT id FROM vasp_categories WHERE slug = 'exchange-services'),
     false, 'support@binance.com', 5300, true, false, 'None', 'Pending'),

    -- Bitget (Private Company)
    ('bitget', 'Bitget', 2018, 'Sandra Lou', 'Seychelles (global operations, APAC focus)', 'https://www.bitget.com',
     'Centralized crypto exchange focused on derivatives, copy trading, and structured products.',
     (SELECT id FROM vasp_categories WHERE slug = 'exchange-services'),
     false, 'support@bitget.com', 1900, true, false, 'None', 'Pending'),

    -- Gemini (Private Company)
    ('gemini', 'Gemini', 2014, 'Tyler & Cameron Winklevoss', 'New York, USA', 'https://www.gemini.com',
     'US-based regulated cryptocurrency exchange and custody platform serving retail and institutional clients.',
     (SELECT id FROM vasp_categories WHERE slug = 'exchange-services'),
     false, 'support@gemini.com', 1000, true, false, 'None', 'Verified'),

    -- OKX (Private Company)
    ('okx', 'OKX', 2013, 'Star Xu', 'San Jose, California, USA (global offices in Dubai, Singapore, HK)', 'https://www.okx.com',
     'Global digital asset exchange offering spot, futures, options, copy trading and Web3 wallet services.',
     (SELECT id FROM vasp_categories WHERE slug = 'exchange-services'),
     false, 'support@okx.com', 5000, true, false, 'None', 'Pending')

ON CONFLICT (slug) 
DO UPDATE SET
    name = EXCLUDED.name,
    year_founded = EXCLUDED.year_founded,
    founder_ceo_name = EXCLUDED.founder_ceo_name,
    headquarters_location = EXCLUDED.headquarters_location,
    website = EXCLUDED.website,
    company_description = EXCLUDED.company_description,
    category_id = EXCLUDED.category_id,
    pakistan_operations = EXCLUDED.pakistan_operations,
    contact_email = EXCLUDED.contact_email,
    employee_count = EXCLUDED.employee_count,
    private_company = EXCLUDED.private_company,
    public_company = EXCLUDED.public_company,
    license_status = EXCLUDED.license_status,
    verification_status = EXCLUDED.verification_status,
    updated_at = NOW();

-- Step 3: Add unique constraint for exchange_services_details if it doesn't exist
DO $$ 
BEGIN
    -- Add unique constraint on company_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'exchange_services_details_company_id_key'
    ) THEN
        ALTER TABLE exchange_services_details 
        ADD CONSTRAINT exchange_services_details_company_id_key UNIQUE (company_id);
    END IF;
END $$;

-- Step 4: Update sector-specific details (exchange services)
INSERT INTO exchange_services_details (
    company_id,
    exchange_type,
    supported_trading_pairs,
    daily_trading_volume_pkr
) VALUES 
    ((SELECT id FROM vasp_companies WHERE slug = 'coinbase'),
        'Centralized',
        ARRAY['BTC/USD', 'ETH/USD', 'SOL/USD'],
        NULL),
    ((SELECT id FROM vasp_companies WHERE slug = 'binance'),
        'Centralized',
        ARRAY['BTC/USDT', 'ETH/USDT', 'BNB/USDT'],
        NULL),
    ((SELECT id FROM vasp_companies WHERE slug = 'bitget'),
        'Centralized',
        ARRAY['BTC/USDT', 'ETH/USDT', 'LTC/USDT'],
        NULL),
    ((SELECT id FROM vasp_companies WHERE slug = 'gemini'),
        'Centralized',
        ARRAY['BTC/USD', 'ETH/USD'],
        NULL),
    ((SELECT id FROM vasp_companies WHERE slug = 'okx'),
        'Centralized',
        ARRAY['BTC/USDT', 'ETH/USDT', 'OKB/USDT'],
        NULL)
ON CONFLICT (company_id) 
DO UPDATE SET
    exchange_type = EXCLUDED.exchange_type,
    supported_trading_pairs = EXCLUDED.supported_trading_pairs,
    daily_trading_volume_pkr = EXCLUDED.daily_trading_volume_pkr,
    updated_at = NOW();

-- Step 5: Verify the updates
SELECT 
    slug,
    name,
    year_founded,
    headquarters_location,
    private_company,
    public_company,
    CASE 
        WHEN public_company = true THEN 'Public'
        WHEN private_company = true THEN 'Private'
        ELSE 'Unknown'
    END as company_type,
    verification_status,
    updated_at
FROM vasp_companies 
WHERE slug IN ('coinbase','binance','bitget','gemini','okx')
ORDER BY updated_at DESC;

-- Step 5: If something went wrong, rollback (uncomment to use)
-- DELETE FROM vasp_companies;
-- INSERT INTO vasp_companies SELECT * FROM vasp_companies_backup;
-- DROP TABLE vasp_companies_backup;
