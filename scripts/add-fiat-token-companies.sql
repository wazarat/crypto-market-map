-- Add Fiat-Referenced Token Companies
-- Excludes Tether and Circle as they are already on the platform

-- Insert the new fiat token companies
INSERT INTO vasp_companies (
    slug, name, year_founded, founder_ceo_name, headquarters_location,
    website, company_description, category_id, pakistan_operations,
    contact_email, employee_count, total_funding_pkr, license_status, verification_status
) VALUES
('paxos', 'Paxos Trust Company', 2012, 'Charles Cascarilla', 'New York, USA', 'https://paxos.com',
 'Regulated blockchain infrastructure platform and stablecoin issuer behind Pax Dollar (USDP), Binance USD (BUSD), and PayPal USD (PYUSD).',
 (SELECT id FROM vasp_categories WHERE slug = 'fiat-tokens'), false, 'info@paxos.com', NULL, NULL, 'Regulated', 'Verified'),

('terraform-labs', 'Terraform Labs', 2018, 'Do Kwon', 'Singapore', 'https://terra.money',
 'Blockchain development company behind TerraUSD (UST) and Luna. Collapsed in 2022 after stablecoin depeg crisis.',
 (SELECT id FROM vasp_categories WHERE slug = 'fiat-tokens'), false, 'contact@terra.money', NULL, NULL, 'Revoked', 'Defunct'),

('first-digital-labs', 'First Digital Labs', 2021, 'Vincent Chok', 'Hong Kong', 'https://firstdigitallabs.com',
 'Issuer of FDUSD, a USD-backed stablecoin launched under Hong Kong regulatory oversight.',
 (SELECT id FROM vasp_categories WHERE slug = 'fiat-tokens'), false, 'info@firstdigitallabs.com', NULL, NULL, 'Registered', 'Verified'),

('archblock', 'Archblock (formerly TrustToken)', 2018, 'Rafael Cosman', 'San Francisco, USA', 'https://trueusd.com',
 'Stablecoin infrastructure provider behind TrueUSD (TUSD) and other fiat-backed tokens.',
 (SELECT id FROM vasp_categories WHERE slug = 'fiat-tokens'), false, 'support@trueusd.com', NULL, NULL, 'None', 'Verified');

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

-- Add basic fiat token details for each company
INSERT INTO fiat_referenced_token_details (
    company_id,
    token_name,
    token_symbol,
    backing_currency,
    reserve_attestation,
    regulatory_compliance
) VALUES
-- Paxos details
((SELECT id FROM vasp_companies WHERE slug = 'paxos'), 
 'Pax Dollar, Binance USD, PayPal USD', 'USDP, BUSD, PYUSD', 'USD', 
 'Monthly attestations by top-tier accounting firms', 'New York State Department of Financial Services regulated'),

-- Terraform Labs details  
((SELECT id FROM vasp_companies WHERE slug = 'terraform-labs'),
 'TerraUSD', 'UST', 'USD', 
 'Algorithmic backing (defunct)', 'Unregulated - collapsed May 2022'),

-- First Digital Labs details
((SELECT id FROM vasp_companies WHERE slug = 'first-digital-labs'),
 'First Digital USD', 'FDUSD', 'USD',
 'Real-time reserve reporting', 'Hong Kong regulatory oversight'),

-- Archblock details
((SELECT id FROM vasp_companies WHERE slug = 'archblock'),
 'TrueUSD', 'TUSD', 'USD',
 'Real-time attestations and proof-of-reserves', 'US regulatory compliance');

-- Verification: Show what was added
SELECT 
    'Added fiat token companies:' as info,
    c.name as company_name,
    c.slug as company_slug,
    c.license_status,
    c.verification_status,
    cat.name as category
FROM vasp_companies c
JOIN vasp_categories cat ON c.category_id = cat.id
WHERE c.slug IN ('paxos', 'terraform-labs', 'first-digital-labs', 'archblock')
ORDER BY c.name;

-- Show fiat token details
SELECT 
    'Fiat token details added:' as info,
    c.name as company_name,
    ftd.token_name,
    ftd.token_symbol,
    ftd.backing_currency
FROM fiat_referenced_token_details ftd
JOIN vasp_companies c ON ftd.company_id = c.id
WHERE c.slug IN ('paxos', 'terraform-labs', 'first-digital-labs', 'archblock')
ORDER BY c.name;
