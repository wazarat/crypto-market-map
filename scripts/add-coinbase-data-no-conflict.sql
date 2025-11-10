-- Add Coinbase Data (No Conflict Version)
-- This script adds Coinbase data without using ON CONFLICT

-- First, clean up any existing Coinbase data to avoid duplicates
DELETE FROM exchange_services_details WHERE company_id = (SELECT id FROM vasp_companies WHERE slug = 'coinbase');
DELETE FROM custody_services_details WHERE company_id = (SELECT id FROM vasp_companies WHERE slug = 'coinbase');
DELETE FROM broker_dealer_details WHERE company_id = (SELECT id FROM vasp_companies WHERE slug = 'coinbase');

-- 1. Add Exchange Services Details for Coinbase
INSERT INTO exchange_services_details (
    company_id,
    exchange_type,
    supported_trading_pairs,
    order_types_supported
) VALUES (
    (SELECT id FROM vasp_companies WHERE slug = 'coinbase'),
    'Centralized',
    ARRAY['BTC/USD', 'ETH/USD', 'SOL/USD', 'USDC/USD'],
    ARRAY['Market Orders', 'Limit Orders', 'Stop-Loss Orders', 'Take-Profit Orders', 'Immediate or Cancel']
);

-- 2. Add Custody Services Details for Coinbase
INSERT INTO custody_services_details (
    company_id,
    custody_type,
    insurance_coverage,
    audit_frequency
) VALUES (
    (SELECT id FROM vasp_companies WHERE slug = 'coinbase'),
    ARRAY['Hot Wallet Storage', 'Cold Storage', 'Multi-Signature Wallets', 'Hardware Security Modules', 'Institutional Custody', 'Hybrid Solutions'],
    TRUE,
    'Annually'
);

-- 3. Add Broker-Dealer Details for Coinbase
INSERT INTO broker_dealer_details (
    company_id,
    trading_platforms_supported,
    asset_types_handled
) VALUES (
    (SELECT id FROM vasp_companies WHERE slug = 'coinbase'),
    ARRAY['Spot Trading', 'Futures Trading', 'Margin Trading', 'Web Platform', 'Mobile App', 'API Trading', 'Algorithmic Trading'],
    ARRAY['Bitcoin (BTC)', 'Ethereum (ETH)', 'Major Altcoins', 'Stablecoins', 'DeFi Tokens', 'Derivatives']
);

-- 4. Ensure Coinbase is assigned to all relevant sectors
INSERT INTO company_sectors (company_id, category_id)
SELECT 
    c.id,
    cat.id
FROM vasp_companies c
CROSS JOIN vasp_categories cat
WHERE c.slug = 'coinbase'
AND cat.slug IN ('exchange-services', 'custody-services', 'broker-dealer-services')
AND NOT EXISTS (
    SELECT 1 FROM company_sectors cs 
    WHERE cs.company_id = c.id AND cs.category_id = cat.id
);

-- 5. Verification
SELECT 
    'Coinbase data verification:' as info,
    'Exchange Services' as sector,
    CASE WHEN EXISTS (SELECT 1 FROM exchange_services_details WHERE company_id = (SELECT id FROM vasp_companies WHERE slug = 'coinbase'))
         THEN 'Data exists' ELSE 'No data' END as status
UNION ALL
SELECT 
    'Coinbase data verification:' as info,
    'Custody Services' as sector,
    CASE WHEN EXISTS (SELECT 1 FROM custody_services_details WHERE company_id = (SELECT id FROM vasp_companies WHERE slug = 'coinbase'))
         THEN 'Data exists' ELSE 'No data' END as status
UNION ALL
SELECT 
    'Coinbase data verification:' as info,
    'Broker-Dealer Services' as sector,
    CASE WHEN EXISTS (SELECT 1 FROM broker_dealer_details WHERE company_id = (SELECT id FROM vasp_companies WHERE slug = 'coinbase'))
         THEN 'Data exists' ELSE 'No data' END as status;

-- 6. Show actual data inserted
SELECT 
    'Exchange data:' as type,
    exchange_type,
    array_length(supported_trading_pairs, 1) as trading_pairs_count,
    array_length(order_types_supported, 1) as order_types_count
FROM exchange_services_details 
WHERE company_id = (SELECT id FROM vasp_companies WHERE slug = 'coinbase');

SELECT 
    'Custody data:' as type,
    array_length(custody_type, 1) as custody_types_count,
    insurance_coverage,
    audit_frequency
FROM custody_services_details 
WHERE company_id = (SELECT id FROM vasp_companies WHERE slug = 'coinbase');

SELECT 
    'Broker-Dealer data:' as type,
    array_length(trading_platforms_supported, 1) as platforms_count,
    array_length(asset_types_handled, 1) as asset_types_count
FROM broker_dealer_details 
WHERE company_id = (SELECT id FROM vasp_companies WHERE slug = 'coinbase');
