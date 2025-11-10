-- Simple Diagnostic: Check Current Database State
-- This script safely checks what exists without causing errors

-- 1. Check if company_sectors table exists
SELECT 
    'company_sectors table exists' as status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'company_sectors') 
        THEN 'YES' 
        ELSE 'NO' 
    END as result;

-- 2. Show structure of company_sectors table (if it exists)
SELECT 
    'Column: ' || column_name as info,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'company_sectors'
ORDER BY ordinal_position;

-- 3. Count records in company_sectors (if table exists)
SELECT 
    'Records in company_sectors' as info,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'company_sectors')
        THEN (SELECT COUNT(*)::text FROM company_sectors)
        ELSE 'Table does not exist'
    END as count;

-- 4. Show companies and their current single category assignments
SELECT 
    'Companies with single category' as info,
    COUNT(*)::text as count
FROM vasp_companies 
WHERE category_id IS NOT NULL;

-- 5. Show sample companies with their categories
SELECT 
    c.name as company_name,
    c.slug as company_slug,
    COALESCE(cat.name, 'No category') as current_category,
    COALESCE(cat.slug, 'none') as category_slug
FROM vasp_companies c
LEFT JOIN vasp_categories cat ON c.category_id = cat.id
ORDER BY c.name
LIMIT 10;
