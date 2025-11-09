-- ============================================================================
-- VERIFY PAKISTAN VASP DATABASE SETUP
-- Run this after the main setup to verify everything is working
-- ============================================================================

-- Check if all tables exist
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE tablename IN (
    'vasp_categories',
    'vasp_companies', 
    'company_sectors',
    'user_notes',
    'company_audit_log',
    'exchange_services_details',
    'advisory_services_details'
)
ORDER BY tablename;

-- Check categories were inserted
SELECT 
    name,
    slug,
    description
FROM vasp_categories 
ORDER BY name;

-- Check table row counts
SELECT 
    'vasp_categories' as table_name, 
    COUNT(*) as row_count 
FROM vasp_categories
UNION ALL
SELECT 
    'vasp_companies' as table_name, 
    COUNT(*) as row_count 
FROM vasp_companies
UNION ALL
SELECT 
    'company_sectors' as table_name, 
    COUNT(*) as row_count 
FROM company_sectors;

-- Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE tablename IN (
    'vasp_categories',
    'vasp_companies',
    'company_sectors',
    'user_notes'
)
ORDER BY tablename, policyname;

-- Test insert (this should work if RLS is configured correctly)
-- Uncomment the next lines to test:
/*
INSERT INTO vasp_companies (
    name, 
    slug, 
    category_id, 
    headquarters_location,
    last_updated_by
) VALUES (
    'Test Company', 
    'test-company', 
    (SELECT id FROM vasp_categories WHERE slug = 'exchange-services' LIMIT 1),
    'Karachi, Pakistan',
    'setup-test'
);

-- Clean up test data
DELETE FROM vasp_companies WHERE slug = 'test-company';
*/
