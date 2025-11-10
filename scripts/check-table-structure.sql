-- Check the actual structure of company_sectors table
-- This will show us what columns exist vs what we expect

-- What columns actually exist in company_sectors?
SELECT 
    'ACTUAL company_sectors columns:' as check_type,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'company_sectors'
ORDER BY ordinal_position;

-- Count records in the table
SELECT 
    'Records in company_sectors:' as check_type,
    COUNT(*)::text as count,
    ''::text as data_type,
    ''::text as is_nullable,
    ''::text as column_default
FROM company_sectors;

-- Show sample records (if any exist)
SELECT 
    'Sample records from company_sectors:' as check_type,
    *
FROM company_sectors 
LIMIT 5;
