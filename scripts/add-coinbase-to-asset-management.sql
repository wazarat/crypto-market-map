-- Add Coinbase to Asset Management sector and add minimal data

-- 1. Ensure Coinbase is assigned to asset-management sector
INSERT INTO company_sectors (company_id, category_id)
SELECT 
    c.id,
    cat.id
FROM vasp_companies c
CROSS JOIN vasp_categories cat
WHERE c.slug = 'coinbase'
AND cat.slug = 'asset-management'
AND NOT EXISTS (
    SELECT 1 FROM company_sectors cs 
    WHERE cs.company_id = c.id AND cs.category_id = cat.id
);

-- 2. Add minimal asset management details for Coinbase
INSERT INTO asset_management_details (
    company_id,
    services_offered,
    aum_pkr,
    investment_strategy
) VALUES (
    (SELECT id FROM vasp_companies WHERE slug = 'coinbase'),
    ARRAY[], -- Empty array since Coinbase is not primarily asset management
    NULL,
    'Limited asset management services'
)
ON CONFLICT (company_id)
DO UPDATE SET
    services_offered = EXCLUDED.services_offered,
    aum_pkr = EXCLUDED.aum_pkr,
    investment_strategy = EXCLUDED.investment_strategy,
    updated_at = NOW();

-- 3. Verify Coinbase is now in all 4 sectors
SELECT 
    'Coinbase sector assignments:' as info,
    c.name as company_name,
    cat.name as sector_name,
    cat.slug as sector_slug
FROM company_sectors cs
JOIN vasp_companies c ON cs.company_id = c.id
JOIN vasp_categories cat ON cs.category_id = cat.id
WHERE c.slug = 'coinbase'
ORDER BY cat.name;
