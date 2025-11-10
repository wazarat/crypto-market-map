-- Diagnostic Script: Check Company Sectors Table Status
-- Run this to understand the current state of your database

-- Check if company_sectors table exists and its structure
SELECT 
    'Table exists: company_sectors' as check_name,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'company_sectors') 
        THEN 'YES' 
        ELSE 'NO' 
    END as result;

-- Check table structure if it exists
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'company_sectors'
ORDER BY ordinal_position;

-- Check if there's any data in company_sectors
SELECT 
    'Records in company_sectors' as check_name,
    COUNT(*) as count
FROM company_sectors;

-- Check companies and their current category assignments
SELECT 
    'Companies with category_id' as check_name,
    COUNT(*) as count
FROM vasp_companies 
WHERE category_id IS NOT NULL;

-- Show current company-category assignments (legacy single category)
SELECT 
    c.name as company_name,
    c.slug as company_slug,
    cat.name as current_category,
    cat.slug as category_slug
FROM vasp_companies c
LEFT JOIN vasp_categories cat ON c.category_id = cat.id
WHERE c.category_id IS NOT NULL
ORDER BY c.name;

-- Show any existing many-to-many assignments (check what columns exist first)
DO $$
BEGIN
    -- Check if the expected columns exist in company_sectors
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'company_sectors' AND column_name = 'category_id'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'company_sectors' AND column_name = 'company_id'
    ) THEN
        -- Show many-to-many assignments if proper structure exists
        RAISE NOTICE 'company_sectors has proper structure, showing assignments:';
        PERFORM * FROM (
            SELECT 
                c.name as company_name,
                cat.name as category_name,
                cat.slug as category_slug,
                cs.created_at
            FROM company_sectors cs
            JOIN vasp_companies c ON cs.company_id = c.id
            JOIN vasp_categories cat ON cs.category_id = cat.id
            ORDER BY c.name, cat.name
            LIMIT 10
        ) subquery;
    ELSE
        RAISE NOTICE 'company_sectors table exists but has unexpected structure';
        RAISE NOTICE 'Available columns in company_sectors:';
        FOR rec IN 
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'company_sectors'
            ORDER BY ordinal_position
        LOOP
            RAISE NOTICE '  - %: %', rec.column_name, rec.data_type;
        END LOOP;
    END IF;
END $$;
