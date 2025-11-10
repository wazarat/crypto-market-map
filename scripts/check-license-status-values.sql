-- Check what license_status values are allowed
SELECT 
    'License status constraint check:' as info,
    constraint_name,
    check_clause
FROM information_schema.check_constraints 
WHERE constraint_name LIKE '%license_status%';

-- Check existing license_status values in the table
SELECT 
    'Existing license_status values:' as info,
    license_status,
    COUNT(*) as count
FROM vasp_companies 
WHERE license_status IS NOT NULL
GROUP BY license_status
ORDER BY license_status;
