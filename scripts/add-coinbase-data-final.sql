-- Add Coinbase Sector-Specific Data (Final Version)
-- This script adds Coinbase data to the properly structured sector detail tables

-- Verify Coinbase exists
SELECT 
    'Coinbase verification:' as info,
    id,
    name,
    slug,
    category_id
FROM vasp_companies 
WHERE slug = 'coinbase';

-- 1. Add Exchange Services Details for Coinbase
INSERT INTO exchange_services_details (
    company_id,
    exchange_type,
    supported_trading_pairs,
    daily_trading_volume_pkr,
    order_types_supported
) VALUES (
    (SELECT id FROM vasp_companies WHERE slug = 'coinbase'),
    'Centralized',
    ARRAY['BTC/USD', 'ETH/USD', 'SOL/USD', 'USDC/USD', 'ADA/USD', 'DOT/USD'],
    NULL, -- Can be filled with actual PKR volume later
    ARRAY['Market Orders', 'Limit Orders', 'Stop-Loss Orders', 'Take-Profit Orders', 'Immediate or Cancel']
)
ON CONFLICT (company_id)
DO UPDATE SET
    exchange_type = EXCLUDED.exchange_type,
    supported_trading_pairs = EXCLUDED.supported_trading_pairs,
    daily_trading_volume_pkr = EXCLUDED.daily_trading_volume_pkr,
    order_types_supported = EXCLUDED.order_types_supported,
    updated_at = NOW();

-- 2. Add Custody Services Details for Coinbase
INSERT INTO custody_services_details (
    company_id,
    custody_type,
    insurance_coverage,
    insurance_amount_pkr,
    audit_frequency
) VALUES (
    (SELECT id FROM vasp_companies WHERE slug = 'coinbase'),
    ARRAY['Hot Wallet Storage', 'Cold Storage', 'Multi-Signature Wallets', 'Hardware Security Modules', 'Institutional Custody', 'Hybrid Solutions'],
    TRUE,
    NULL, -- Can be filled with actual PKR insurance amount later
    'Annually'
)
ON CONFLICT (company_id)
DO UPDATE SET
    custody_type = EXCLUDED.custody_type,
    insurance_coverage = EXCLUDED.insurance_coverage,
    insurance_amount_pkr = EXCLUDED.insurance_amount_pkr,
    audit_frequency = EXCLUDED.audit_frequency,
    updated_at = NOW();

-- 3. Add Broker-Dealer Services Details for Coinbase (both table names for compatibility)
INSERT INTO broker_dealer_services_details (
    company_id,
    trading_platforms_supported,
    asset_types_handled,
    annual_transaction_volume_pkr
) VALUES (
    (SELECT id FROM vasp_companies WHERE slug = 'coinbase'),
    ARRAY['Spot Trading', 'Futures Trading', 'Margin Trading', 'Web Platform', 'Mobile App', 'API Trading', 'Algorithmic Trading'],
    ARRAY['Bitcoin (BTC)', 'Ethereum (ETH)', 'Major Altcoins', 'Stablecoins', 'DeFi Tokens', 'Derivatives'],
    NULL -- Can be filled with actual PKR volume later
)
ON CONFLICT (company_id)
DO UPDATE SET
    trading_platforms_supported = EXCLUDED.trading_platforms_supported,
    asset_types_handled = EXCLUDED.asset_types_handled,
    annual_transaction_volume_pkr = EXCLUDED.annual_transaction_volume_pkr,
    updated_at = NOW();

-- Also insert into the table name that the code actually looks for
INSERT INTO broker_dealer_details (
    company_id,
    trading_platforms_supported,
    asset_types_handled,
    annual_transaction_volume_pkr
) VALUES (
    (SELECT id FROM vasp_companies WHERE slug = 'coinbase'),
    ARRAY['Spot Trading', 'Futures Trading', 'Margin Trading', 'Web Platform', 'Mobile App', 'API Trading', 'Algorithmic Trading'],
    ARRAY['Bitcoin (BTC)', 'Ethereum (ETH)', 'Major Altcoins', 'Stablecoins', 'DeFi Tokens', 'Derivatives'],
    NULL
)
ON CONFLICT (company_id)
DO UPDATE SET
    trading_platforms_supported = EXCLUDED.trading_platforms_supported,
    asset_types_handled = EXCLUDED.asset_types_handled,
    annual_transaction_volume_pkr = EXCLUDED.annual_transaction_volume_pkr,
    updated_at = NOW();

-- 4. Add Asset Management Details for Coinbase (minimal, since it's not their primary focus)
INSERT INTO asset_management_details (
    company_id,
    services_offered,
    aum_pkr,
    investment_strategy
) VALUES (
    (SELECT id FROM vasp_companies WHERE slug = 'coinbase'),
    ARRAY[], -- Empty array since Coinbase is not primarily asset management
    NULL,
    NULL
)
ON CONFLICT (company_id)
DO UPDATE SET
    services_offered = EXCLUDED.services_offered,
    aum_pkr = EXCLUDED.aum_pkr,
    investment_strategy = EXCLUDED.investment_strategy,
    updated_at = NOW();

-- 5. Ensure Coinbase is assigned to all relevant sectors in company_sectors table
INSERT INTO company_sectors (company_id, category_id)
SELECT 
    c.id,
    cat.id
FROM vasp_companies c
CROSS JOIN vasp_categories cat
WHERE c.slug = 'coinbase'
AND cat.slug IN ('exchange-services', 'custody-services', 'broker-dealer-services', 'asset-management')
ON CONFLICT (company_id, category_id) DO NOTHING;

-- 6. Verification - Show what was created
SELECT 
    'Coinbase sector data verification:' as info,
    'Exchange Services' as sector,
    CASE WHEN EXISTS (SELECT 1 FROM exchange_services_details WHERE company_id = (SELECT id FROM vasp_companies WHERE slug = 'coinbase'))
         THEN 'Data exists' ELSE 'No data' END as status
UNION ALL
SELECT 
    'Coinbase sector data verification:' as info,
    'Custody Services' as sector,
    CASE WHEN EXISTS (SELECT 1 FROM custody_services_details WHERE company_id = (SELECT id FROM vasp_companies WHERE slug = 'coinbase'))
         THEN 'Data exists' ELSE 'No data' END as status
UNION ALL
SELECT 
    'Coinbase sector data verification:' as info,
    'Broker-Dealer Services' as sector,
    CASE WHEN EXISTS (SELECT 1 FROM broker_dealer_details WHERE company_id = (SELECT id FROM vasp_companies WHERE slug = 'coinbase'))
         THEN 'Data exists' ELSE 'No data' END as status
UNION ALL
SELECT 
    'Coinbase sector data verification:' as info,
    'Asset Management' as sector,
    CASE WHEN EXISTS (SELECT 1 FROM asset_management_details WHERE company_id = (SELECT id FROM vasp_companies WHERE slug = 'coinbase'))
         THEN 'Data exists' ELSE 'No data' END as status;

-- 7. Show Coinbase sector assignments
SELECT 
    'Coinbase sector assignments:' as info,
    c.name as company_name,
    cat.name as sector_name,
    cat.slug as sector_slug
FROM company_sectors cs
JOIN vasp_companies c ON cs.company_id = c.id
JOIN vasp_categories cat ON cs.category_id = cat.id
WHERE c.slug = 'coinbase'
ORDER BY cat.name;

-- 8. Show sample of the actual data inserted
SELECT 
    'Exchange Services Data Sample:' as info,
    exchange_type,
    array_length(supported_trading_pairs, 1) as trading_pairs_count,
    array_length(order_types_supported, 1) as order_types_count
FROM exchange_services_details 
WHERE company_id = (SELECT id FROM vasp_companies WHERE slug = 'coinbase');

SELECT 
    'Custody Services Data Sample:' as info,
    array_length(custody_type, 1) as custody_types_count,
    insurance_coverage,
    audit_frequency
FROM custody_services_details 
WHERE company_id = (SELECT id FROM vasp_companies WHERE slug = 'coinbase');
