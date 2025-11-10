-- Simple check to see what sector detail tables exist and their actual structure

-- 1. List all tables that might be sector-related
SELECT 
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public'
AND (
    table_name LIKE '%services%' OR 
    table_name LIKE '%details%' OR 
    table_name LIKE '%management%' OR
    table_name LIKE '%exchange%' OR
    table_name LIKE '%custody%' OR
    table_name LIKE '%broker%'
)
ORDER BY table_name;

-- 2. Check if any of the expected tables exist
SELECT 
    'Table existence check:' as info,
    'exchange_services_details' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'exchange_services_details')
         THEN 'EXISTS' ELSE 'DOES NOT EXIST' END as status
UNION ALL
SELECT 
    'Table existence check:' as info,
    'custody_services_details' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'custody_services_details')
         THEN 'EXISTS' ELSE 'DOES NOT EXIST' END as status
UNION ALL
SELECT 
    'Table existence check:' as info,
    'broker_dealer_services_details' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'broker_dealer_services_details')
         THEN 'EXISTS' ELSE 'DOES NOT EXIST' END as status
UNION ALL
SELECT 
    'Table existence check:' as info,
    'asset_management_details' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'asset_management_details')
         THEN 'EXISTS' ELSE 'DOES NOT EXIST' END as status;
