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

INSERT INTO asset_management_details (
    company_id
) VALUES (
    (SELECT id FROM vasp_companies WHERE slug = 'coinbase')
);

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
