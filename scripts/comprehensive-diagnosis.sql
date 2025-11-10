-- Comprehensive Database Diagnosis
-- This will give us clear information about the current state

-- Check 1: Does company_sectors table exist?
SELECT 
    'CHECK 1: Table Existence' as test_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'company_sectors'
        ) 
        THEN 'company_sectors table EXISTS' 
        ELSE 'company_sectors table DOES NOT EXIST' 
    END as result;

-- Check 2: What tables do we have that contain 'company' or 'sector'?
SELECT 
    'CHECK 2: Related Tables' as test_name,
    table_name as result
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (table_name LIKE '%company%' OR table_name LIKE '%sector%')
ORDER BY table_name;

-- Check 3: Structure of vasp_companies table
SELECT 
    'CHECK 3: vasp_companies columns' as test_name,
    column_name as result
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'vasp_companies'
ORDER BY ordinal_position;

-- Check 4: Structure of vasp_categories table  
SELECT 
    'CHECK 4: vasp_categories columns' as test_name,
    column_name as result
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'vasp_categories'
ORDER BY ordinal_position;

-- Check 5: How many companies exist?
SELECT 
    'CHECK 5: Total Companies' as test_name,
    COUNT(*)::text as result
FROM vasp_companies;

-- Check 6: How many companies have a category_id assigned?
SELECT 
    'CHECK 6: Companies with category_id' as test_name,
    COUNT(*)::text as result
FROM vasp_companies 
WHERE category_id IS NOT NULL;

-- Check 7: Show sample companies with their current categories
SELECT 
    'CHECK 7: Sample company-category assignments' as test_name,
    c.name || ' -> ' || COALESCE(cat.name, 'NO CATEGORY') as result
FROM vasp_companies c
LEFT JOIN vasp_categories cat ON c.category_id = cat.id
ORDER BY c.name
LIMIT 5;
