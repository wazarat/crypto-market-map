-- Check the actual structure of vasp_companies table
-- This will show us what columns exist so we can fix the bulk insert script

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'vasp_companies'
ORDER BY ordinal_position;
