-- Check what sector detail tables exist and their structure
-- This will help us understand what columns are available

-- 1. Check which sector detail tables exist
SELECT 
    'Available sector detail tables:' as info,
    table_name
FROM information_schema.tables 
WHERE table_name LIKE '%_services_details' OR table_name LIKE '%_management_details'
ORDER BY table_name;

-- 2. Check exchange_services_details structure (if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'exchange_services_details') THEN
        RAISE NOTICE 'exchange_services_details table exists - showing structure:';
    ELSE
        RAISE NOTICE 'exchange_services_details table does NOT exist';
    END IF;
END $$;

SELECT 
    'exchange_services_details columns:' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'exchange_services_details'
ORDER BY ordinal_position;

-- 3. Check custody_services_details structure (if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'custody_services_details') THEN
        RAISE NOTICE 'custody_services_details table exists - showing structure:';
    ELSE
        RAISE NOTICE 'custody_services_details table does NOT exist';
    END IF;
END $$;

SELECT 
    'custody_services_details columns:' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'custody_services_details'
ORDER BY ordinal_position;

-- 4. Check broker_dealer_services_details structure (if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'broker_dealer_services_details') THEN
        RAISE NOTICE 'broker_dealer_services_details table exists - showing structure:';
    ELSE
        RAISE NOTICE 'broker_dealer_services_details table does NOT exist';
    END IF;
END $$;

SELECT 
    'broker_dealer_services_details columns:' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'broker_dealer_services_details'
ORDER BY ordinal_position;

-- 5. Check asset_management_details structure (if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'asset_management_details') THEN
        RAISE NOTICE 'asset_management_details table exists - showing structure:';
    ELSE
        RAISE NOTICE 'asset_management_details table does NOT exist';
    END IF;
END $$;

SELECT 
    'asset_management_details columns:' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'asset_management_details'
ORDER BY ordinal_position;
