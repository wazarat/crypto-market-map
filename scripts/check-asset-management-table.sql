-- Check the actual structure of asset_management_details table

SELECT 
    'asset_management_details table structure:' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'asset_management_details'
ORDER BY ordinal_position;
