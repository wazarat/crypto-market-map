-- Bulk Company Data Update Script for Exchange Services (Fixed Version)
-- Removes non-existent columns like total_funding_pkr

-- 1) Backup
CREATE TABLE IF NOT EXISTS vasp_companies_backup AS
SELECT * FROM vasp_companies;

-- 2) Upsert companies (using only existing columns)
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
    license_status,
    verification_status
) VALUES
    -- dYdX
    ('dydx', 'dYdX', 2017, 'Antonio Juliano', 'Remote / United States', 'https://dydx.exchange',
     'Decentralized perpetuals exchange initially built on Ethereum/StarkEx, migrating to its own appchain.', 
     (SELECT id FROM vasp_categories WHERE slug = 'exchange-services'),
     false, 'support@dydx.exchange', NULL, 'None', 'Pending'),

    -- GMX
    ('gmx', 'GMX', 2021, 'Core contributors (decentralized)', 'Decentralized / Arbitrum & Avalanche ecosystem', 'https://gmx.io',
     'On-chain spot and perpetual DEX offering low-fee swaps and GLP liquidity model on Arbitrum and Avalanche.',
     (SELECT id FROM vasp_categories WHERE slug = 'exchange-services'),
     false, 'contact@gmx.io', NULL, 'None', 'Pending'),

    -- Aster (not enough public data – placeholder)
    ('aster-exchange', 'Aster', NULL, NULL, NULL, 'https://aster.finance',
     'Exchange / trading platform listed under Exchange Services on Canhav.io. Update this record when more data is available.',
     (SELECT id FROM vasp_categories WHERE slug = 'exchange-services'),
     false, NULL, NULL, 'None', 'Pending'),

    -- SynFutures
    ('synfutures', 'SynFutures', 2021, 'Rachel Lin', 'Singapore', 'https://www.synfutures.com',
     'Decentralized derivatives platform enabling permissionless listing of futures and perps on long-tail assets.',
     (SELECT id FROM vasp_categories WHERE slug = 'exchange-services'),
     false, 'hello@synfutures.com', NULL, 'None', 'Pending'),

    -- Vertex Protocol
    ('vertex-protocol', 'Vertex Protocol', 2023, 'Core team (Singapore)', 'Singapore', 'https://vertexprotocol.com',
     'Cross-margin derivatives and spot DEX (Arbitrum) with on-chain orderbook and unified account.',
     (SELECT id FROM vasp_categories WHERE slug = 'exchange-services'),
     false, 'info@vertexprotocol.com', NULL, 'None', 'Pending'),

    -- Myriad Markets
    ('myriad-markets', 'Myriad Markets', NULL, NULL, NULL, 'https://www.myriadmarkets.com',
     'On-chain / crypto trading venue listed in Exchange Services; complete company details to be added.',
     (SELECT id FROM vasp_categories WHERE slug = 'exchange-services'),
     false, NULL, NULL, 'None', 'Pending'),

    -- Polymarket
    ('polymarket', 'Polymarket', 2020, 'Shayne Coplan', 'USA (operations often offshore)', 'https://polymarket.com',
     'Information markets / prediction exchange for real-world events, settling on-chain.',
     (SELECT id FROM vasp_categories WHERE slug = 'exchange-services'),
     false, 'support@polymarket.com', NULL, 'None', 'Pending'),

    -- ApolloX
    ('apollox', 'ApolloX', 2021, 'Chengpeng (APAC team)', 'Singapore', 'https://www.apollox.finance',
     'CeDeFi-style derivatives exchange offering perps, copy trading and liquidity solutions.',
     (SELECT id FROM vasp_categories WHERE slug = 'exchange-services'),
     false, 'support@apollox.finance', NULL, 'None', 'Pending'),

    -- Level Finance
    ('level-finance', 'Level Finance', 2023, 'Anonymous core team', 'Decentralized / BNB Chain', 'https://level.finance',
     'Perpetual DEX on BNB Chain with tranching model for LPs and dynamic fee structure.',
     (SELECT id FROM vasp_categories WHERE slug = 'exchange-services'),
     false, NULL, NULL, 'None', 'Pending')

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
    license_status = EXCLUDED.license_status,
    verification_status = EXCLUDED.verification_status,
    updated_at = NOW();

-- 3) Add companies to company_sectors table for many-to-many support
-- This ensures they appear in the Exchange Services sector
INSERT INTO company_sectors (company_id, category_id)
SELECT 
    c.id,
    cat.id
FROM vasp_companies c
CROSS JOIN vasp_categories cat
WHERE c.slug IN (
    'dydx','gmx','aster-exchange','synfutures','vertex-protocol',
    'myriad-markets','polymarket','apollox','level-finance'
)
AND cat.slug = 'exchange-services'
ON CONFLICT (company_id, category_id) DO NOTHING;

-- 4) Exchange-services extra details (only if the table exists)
-- Check if exchange_services_details table exists first
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'exchange_services_details') THEN
        INSERT INTO exchange_services_details (
            company_id,
            exchange_type,
            supported_trading_pairs,
            daily_trading_volume_pkr
        ) VALUES
            ((SELECT id FROM vasp_companies WHERE slug = 'dydx'),
                'Decentralized', ARRAY['ETH-USD-PERP','BTC-USD-PERP'], NULL),
            ((SELECT id FROM vasp_companies WHERE slug = 'gmx'),
                'Decentralized', ARRAY['BTC/USD','ETH/USD','AVAX/USD'], NULL),
            ((SELECT id FROM vasp_companies WHERE slug = 'synfutures'),
                'Decentralized', ARRAY['ETH/USDC','Long-tail perps'], NULL),
            ((SELECT id FROM vasp_companies WHERE slug = 'vertex-protocol'),
                'Decentralized', ARRAY['BTC/USDC','ETH/USDC','ARB/USDC'], NULL),
            ((SELECT id FROM vasp_companies WHERE slug = 'polymarket'),
                'Prediction / info markets', ARRAY['Event markets'], NULL),
            ((SELECT id FROM vasp_companies WHERE slug = 'apollox'),
                'Centralized / hybrid', ARRAY['BTC/USDT','ETH/USDT'], NULL),
            ((SELECT id FROM vasp_companies WHERE slug = 'level-finance'),
                'Decentralized', ARRAY['BTC/BUSD','ETH/BUSD'], NULL)
        ON CONFLICT (company_id)
        DO UPDATE SET
            exchange_type = EXCLUDED.exchange_type,
            supported_trading_pairs = EXCLUDED.supported_trading_pairs,
            daily_trading_volume_pkr = EXCLUDED.daily_trading_volume_pkr,
            updated_at = NOW();
        
        RAISE NOTICE 'Exchange services details updated';
    ELSE
        RAISE NOTICE 'exchange_services_details table does not exist, skipping sector-specific data';
    END IF;
END $$;

-- 5) Verify results
SELECT 
    'Inserted companies:' as info,
    slug, 
    name, 
    website, 
    updated_at
FROM vasp_companies
WHERE slug IN (
    'dydx','gmx','aster-exchange','synfutures','vertex-protocol',
    'myriad-markets','polymarket','apollox','level-finance'
)
ORDER BY updated_at DESC;

-- 6) Verify many-to-many assignments
SELECT 
    'Company-sector assignments:' as info,
    c.name as company_name,
    cat.name as sector_name
FROM company_sectors cs
JOIN vasp_companies c ON cs.company_id = c.id
JOIN vasp_categories cat ON cs.category_id = cat.id
WHERE c.slug IN (
    'dydx','gmx','aster-exchange','synfutures','vertex-protocol',
    'myriad-markets','polymarket','apollox','level-finance'
)
ORDER BY c.name;
