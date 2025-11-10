-- Add Fiat-Referenced Token Companies (Basic Version)
-- Only includes essential data, leaves constrained fields as NULL

-- First, verify the fiat-tokens category exists
SELECT 
    'Fiat tokens category check:' as info,
    id,
    name,
    slug
FROM vasp_categories 
WHERE slug = 'fiat-tokens';

-- Insert the new fiat token companies with only essential fields
INSERT INTO vasp_companies (
    slug, name, year_founded, founder_ceo_name, headquarters_location,
    website, company_description, category_id, pakistan_operations,
    contact_email
) VALUES
('paxos', 'Paxos Trust Company', 2012, 'Charles Cascarilla', 'New York, USA', 'https://paxos.com',
 'Regulated blockchain infrastructure platform and stablecoin issuer behind Pax Dollar (USDP), Binance USD (BUSD), and PayPal USD (PYUSD).',
 (SELECT id FROM vasp_categories WHERE slug = 'fiat-tokens'), false, 'info@paxos.com'),

('terraform-labs', 'Terraform Labs', 2018, 'Do Kwon', 'Singapore', 'https://terra.money',
 'Blockchain development company behind TerraUSD (UST) and Luna. Collapsed in 2022 after stablecoin depeg crisis.',
 (SELECT id FROM vasp_categories WHERE slug = 'fiat-tokens'), false, 'contact@terra.money'),

('first-digital-labs', 'First Digital Labs', 2021, 'Vincent Chok', 'Hong Kong', 'https://firstdigitallabs.com',
 'Issuer of FDUSD, a USD-backed stablecoin launched under Hong Kong regulatory oversight.',
 (SELECT id FROM vasp_categories WHERE slug = 'fiat-tokens'), false, 'info@firstdigitallabs.com'),

('archblock', 'Archblock (formerly TrustToken)', 2018, 'Rafael Cosman', 'San Francisco, USA', 'https://trueusd.com',
 'Stablecoin infrastructure provider behind TrueUSD (TUSD) and other fiat-backed tokens.',
 (SELECT id FROM vasp_categories WHERE slug = 'fiat-tokens'), false, 'support@trueusd.com');

-- Assign companies to the fiat-tokens sector in company_sectors table
INSERT INTO company_sectors (company_id, category_id)
SELECT 
    c.id,
    cat.id
FROM vasp_companies c
CROSS JOIN vasp_categories cat
WHERE c.slug IN ('paxos', 'terraform-labs', 'first-digital-labs', 'archblock')
AND cat.slug = 'fiat-tokens'
AND NOT EXISTS (
    SELECT 1 FROM company_sectors cs 
    WHERE cs.company_id = c.id AND cs.category_id = cat.id
);

-- Verification: Show what was added
SELECT 
    'Added fiat token companies:' as info,
    c.name as company_name,
    c.slug as company_slug,
    c.year_founded,
    c.headquarters_location,
    cat.name as category
FROM vasp_companies c
JOIN vasp_categories cat ON c.category_id = cat.id
WHERE c.slug IN ('paxos', 'terraform-labs', 'first-digital-labs', 'archblock')
ORDER BY c.name;

-- Show company_sectors assignments
SELECT 
    'Company sector assignments:' as info,
    c.name as company_name,
    cat.name as sector_name
FROM company_sectors cs
JOIN vasp_companies c ON cs.company_id = c.id
JOIN vasp_categories cat ON cs.category_id = cat.id
WHERE c.slug IN ('paxos', 'terraform-labs', 'first-digital-labs', 'archblock')
ORDER BY c.name;
