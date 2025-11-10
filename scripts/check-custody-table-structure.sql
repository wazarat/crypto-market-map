-- Check the actual structure of custody_services_details table
-- This will show us exactly what columns exist

SELECT 
    'custody_services_details table structure:' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'custody_services_details'
ORDER BY ordinal_position;

-- Also check a few other tables to see their structure
SELECT 
    'exchange_services_details table structure:' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'exchange_services_details'
ORDER BY ordinal_position;

SELECT 
    'broker_dealer_details table structure:' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'broker_dealer_details'
ORDER BY ordinal_position;
