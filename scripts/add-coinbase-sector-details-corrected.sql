-- Add Sector-Specific Details for Coinbase (Corrected Version)
-- This script uses the correct field names that match the UI component expectations

-- First, verify Coinbase exists and get its ID
SELECT 
    'Coinbase company verification:' as info,
    id,
    name,
    slug
FROM vasp_companies 
WHERE slug = 'coinbase';

-- 1) EXCHANGE SERVICES DETAILS FOR COINBASE
-- Using the correct field names from SectorSpecificSections.tsx
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'exchange_services_details') THEN
        INSERT INTO exchange_services_details (
            company_id,
            exchange_type,
            supported_trading_pairs,
            daily_trading_volume_pkr,
            order_types_supported
        ) VALUES (
            (SELECT id FROM vasp_companies WHERE slug = 'coinbase'),
            'Centralized',
            ARRAY['BTC/USD','ETH/USD','SOL/USD','USDC/USD'],
            NULL,  -- daily trading volume in PKR
            ARRAY['Market Orders', 'Limit Orders', 'Stop-Loss Orders', 'Take-Profit Orders', 'Immediate or Cancel']
        )
        ON CONFLICT (company_id)
        DO UPDATE SET
            exchange_type = EXCLUDED.exchange_type,
            supported_trading_pairs = EXCLUDED.supported_trading_pairs,
            daily_trading_volume_pkr = EXCLUDED.daily_trading_volume_pkr,
            order_types_supported = EXCLUDED.order_types_supported,
            updated_at = NOW();
        
        RAISE NOTICE 'Exchange services details updated for Coinbase';
    ELSE
        RAISE NOTICE 'exchange_services_details table does not exist';
    END IF;
END $$;

-- 2) CUSTODY SERVICES DETAILS FOR COINBASE
-- Using the correct field names from SectorSpecificSections.tsx
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'custody_services_details') THEN
        INSERT INTO custody_services_details (
            company_id,
            custody_type,
            insurance_coverage,
            insurance_amount_pkr,
            audit_frequency
        ) VALUES (
            (SELECT id FROM vasp_companies WHERE slug = 'coinbase'),
            ARRAY['Hot Wallet Storage', 'Cold Storage', 'Multi-Signature Wallets', 'Hardware Security Modules', 'Institutional Custody', 'Hybrid Solutions'],
            TRUE,    -- insurance coverage
            NULL,    -- insurance amount in PKR (can be filled in later)
            'Annually'
        )
        ON CONFLICT (company_id)
        DO UPDATE SET
            custody_type = EXCLUDED.custody_type,
            insurance_coverage = EXCLUDED.insurance_coverage,
            insurance_amount_pkr = EXCLUDED.insurance_amount_pkr,
            audit_frequency = EXCLUDED.audit_frequency,
            updated_at = NOW();
        
        RAISE NOTICE 'Custody services details updated for Coinbase';
    ELSE
        RAISE NOTICE 'custody_services_details table does not exist';
    END IF;
END $$;

-- 3) BROKER–DEALER SERVICES DETAILS FOR COINBASE
-- Using the correct field names from SectorSpecificSections.tsx
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'broker_dealer_services_details') THEN
        INSERT INTO broker_dealer_services_details (
            company_id,
            trading_platforms_supported,
            asset_types_handled,
            annual_transaction_volume_pkr
        ) VALUES (
            (SELECT id FROM vasp_companies WHERE slug = 'coinbase'),
            ARRAY['Spot Trading', 'Futures Trading', 'Margin Trading', 'Web Platform', 'Mobile App', 'API Trading', 'Algorithmic Trading'],
            ARRAY['Bitcoin (BTC)', 'Ethereum (ETH)', 'Major Altcoins', 'Stablecoins', 'DeFi Tokens', 'Derivatives'],
            NULL  -- annual transaction volume in PKR
        )
        ON CONFLICT (company_id)
        DO UPDATE SET
            trading_platforms_supported = EXCLUDED.trading_platforms_supported,
            asset_types_handled = EXCLUDED.asset_types_handled,
            annual_transaction_volume_pkr = EXCLUDED.annual_transaction_volume_pkr,
            updated_at = NOW();
        
        RAISE NOTICE 'Broker-dealer services details updated for Coinbase';
    ELSE
        RAISE NOTICE 'broker_dealer_services_details table does not exist';
    END IF;
END $$;

-- 4) ASSET MANAGEMENT DETAILS FOR COINBASE
-- Coinbase has limited asset management services, so keeping minimal
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'asset_management_details') THEN
        -- Check what columns exist in asset_management_details first
        RAISE NOTICE 'Attempting to insert asset management details for Coinbase';
        
        -- Simple insert with minimal data since Coinbase is not primarily an asset manager
        INSERT INTO asset_management_details (
            company_id
        ) VALUES (
            (SELECT id FROM vasp_companies WHERE slug = 'coinbase')
        )
        ON CONFLICT (company_id)
        DO UPDATE SET
            updated_at = NOW();
        
        RAISE NOTICE 'Asset management details updated for Coinbase (minimal entry)';
    ELSE
        RAISE NOTICE 'asset_management_details table does not exist';
    END IF;
END $$;

-- 5) Also ensure Coinbase is properly assigned to all relevant sectors in company_sectors table
INSERT INTO company_sectors (company_id, category_id)
SELECT 
    c.id,
    cat.id
FROM vasp_companies c
CROSS JOIN vasp_categories cat
WHERE c.slug = 'coinbase'
AND cat.slug IN ('exchange-services', 'custody-services', 'broker-dealer-services', 'asset-management')
ON CONFLICT (company_id, category_id) DO NOTHING;

-- Verification: Show what was inserted/updated
SELECT 
    'Final verification - Coinbase sector details:' as info,
    'Exchange Services' as sector,
    CASE WHEN EXISTS (SELECT 1 FROM exchange_services_details WHERE company_id = (SELECT id FROM vasp_companies WHERE slug = 'coinbase'))
         THEN 'Data exists' ELSE 'No data' END as status
UNION ALL
SELECT 
    'Final verification - Coinbase sector details:' as info,
    'Custody Services' as sector,
    CASE WHEN EXISTS (SELECT 1 FROM custody_services_details WHERE company_id = (SELECT id FROM vasp_companies WHERE slug = 'coinbase'))
         THEN 'Data exists' ELSE 'No data' END as status
UNION ALL
SELECT 
    'Final verification - Coinbase sector details:' as info,
    'Broker-Dealer Services' as sector,
    CASE WHEN EXISTS (SELECT 1 FROM broker_dealer_services_details WHERE company_id = (SELECT id FROM vasp_companies WHERE slug = 'coinbase'))
         THEN 'Data exists' ELSE 'No data' END as status
UNION ALL
SELECT 
    'Final verification - Coinbase sector details:' as info,
    'Asset Management' as sector,
    CASE WHEN EXISTS (SELECT 1 FROM asset_management_details WHERE company_id = (SELECT id FROM vasp_companies WHERE slug = 'coinbase'))
         THEN 'Data exists' ELSE 'No data' END as status;

-- Show Coinbase sector assignments
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
