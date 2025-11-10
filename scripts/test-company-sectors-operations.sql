-- Test Company Sectors Operations
-- This script tests the exact operations that the API is trying to perform

-- Step 1: Check current structure of company_sectors table
SELECT 
    'company_sectors table structure:' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'company_sectors'
ORDER BY ordinal_position;

-- Step 2: Check if Coinbase exists and get its ID
SELECT 
    'Coinbase company info:' as info,
    id as company_id,
    name,
    slug,
    category_id as current_category_id
FROM vasp_companies 
WHERE slug = 'coinbase';

-- Step 3: Get category IDs for the sectors we want to assign
SELECT 
    'Category IDs for sectors:' as info,
    id as category_id,
    name,
    slug
FROM vasp_categories 
WHERE slug IN ('exchange-services', 'custody-services', 'broker-dealer-services', 'asset-management')
ORDER BY slug;

-- Step 4: Check current assignments for Coinbase in company_sectors
SELECT 
    'Current company_sectors assignments for Coinbase:' as info,
    cs.id,
    cs.company_id,
    cs.category_id,
    c.name as company_name,
    cat.name as category_name,
    cat.slug as category_slug
FROM company_sectors cs
JOIN vasp_companies c ON cs.company_id = c.id
JOIN vasp_categories cat ON cs.category_id = cat.id
WHERE c.slug = 'coinbase';

-- Step 5: Test insert operation (simulate what the API does)
-- First, let's try to insert a test record to see if it works
DO $$
DECLARE
    coinbase_id UUID;
    custody_category_id UUID;
BEGIN
    -- Get Coinbase ID
    SELECT id INTO coinbase_id FROM vasp_companies WHERE slug = 'coinbase';
    
    -- Get Custody Services category ID
    SELECT id INTO custody_category_id FROM vasp_categories WHERE slug = 'custody-services';
    
    IF coinbase_id IS NOT NULL AND custody_category_id IS NOT NULL THEN
        -- Try to insert (with conflict handling)
        INSERT INTO company_sectors (company_id, category_id)
        VALUES (coinbase_id, custody_category_id)
        ON CONFLICT (company_id, category_id) DO NOTHING;
        
        RAISE NOTICE 'Successfully inserted/updated Coinbase -> Custody Services assignment';
        RAISE NOTICE 'Coinbase ID: %', coinbase_id;
        RAISE NOTICE 'Custody Category ID: %', custody_category_id;
    ELSE
        RAISE NOTICE 'Could not find Coinbase (%) or Custody Services (%)', coinbase_id, custody_category_id;
    END IF;
END $$;

-- Step 6: Show final state
SELECT 
    'Final company_sectors state for Coinbase:' as info,
    cs.id,
    c.name as company_name,
    cat.name as category_name,
    cat.slug as category_slug,
    cs.created_at
FROM company_sectors cs
JOIN vasp_companies c ON cs.company_id = c.id
JOIN vasp_categories cat ON cs.category_id = cat.id
WHERE c.slug = 'coinbase'
ORDER BY cat.name;
