-- Add Coinbase Data (Simple Version)
-- This script adds Coinbase data after the table columns have been fixed

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
)
ON CONFLICT (company_id)
DO UPDATE SET
    exchange_type = EXCLUDED.exchange_type,
    supported_trading_pairs = EXCLUDED.supported_trading_pairs,
    order_types_supported = EXCLUDED.order_types_supported,
    updated_at = NOW();

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
)
ON CONFLICT (company_id)
DO UPDATE SET
    custody_type = EXCLUDED.custody_type,
    insurance_coverage = EXCLUDED.insurance_coverage,
    audit_frequency = EXCLUDED.audit_frequency,
    updated_at = NOW();

-- 3. Add Broker-Dealer Details for Coinbase
INSERT INTO broker_dealer_details (
    company_id,
    trading_platforms_supported,
    asset_types_handled
) VALUES (
    (SELECT id FROM vasp_companies WHERE slug = 'coinbase'),
    ARRAY['Spot Trading', 'Futures Trading', 'Margin Trading', 'Web Platform', 'Mobile App', 'API Trading', 'Algorithmic Trading'],
    ARRAY['Bitcoin (BTC)', 'Ethereum (ETH)', 'Major Altcoins', 'Stablecoins', 'DeFi Tokens', 'Derivatives']
)
ON CONFLICT (company_id)
DO UPDATE SET
    trading_platforms_supported = EXCLUDED.trading_platforms_supported,
    asset_types_handled = EXCLUDED.asset_types_handled,
    updated_at = NOW();

-- 4. Ensure Coinbase is assigned to all relevant sectors
INSERT INTO company_sectors (company_id, category_id)
SELECT 
    c.id,
    cat.id
FROM vasp_companies c
CROSS JOIN vasp_categories cat
WHERE c.slug = 'coinbase'
AND cat.slug IN ('exchange-services', 'custody-services', 'broker-dealer-services')
ON CONFLICT (company_id, category_id) DO NOTHING;

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
