-- Pakistan VASP Database - Quick Setup
-- Copy and paste this entire script into Supabase SQL Editor and click RUN

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE IF NOT EXISTS vasp_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    regulatory_requirements TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Main companies table
CREATE TABLE IF NOT EXISTS vasp_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    category_id UUID REFERENCES vasp_categories(id),
    year_founded INTEGER,
    founder_ceo_name VARCHAR(255),
    headquarters_location VARCHAR(255) NOT NULL,
    pakistan_operations BOOLEAN DEFAULT false,
    website VARCHAR(500),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    employee_count INTEGER,
    total_funding_pkr BIGINT,
    key_partnerships TEXT[],
    company_description TEXT NOT NULL,
    logo_url VARCHAR(500),
    twitter_handle VARCHAR(100),
    linkedin_url VARCHAR(500),
    secp_registration_number VARCHAR(100),
    pvara_license_number VARCHAR(100),
    license_status VARCHAR(50) CHECK (license_status IN ('Applied', 'Granted', 'Suspended', 'None', 'Under Review')) DEFAULT 'None',
    paid_up_capital_pkr BIGINT,
    capital_adequacy_ratio DECIMAL(5,2),
    number_of_directors INTEGER,
    director_experience_years INTEGER,
    fit_and_proper_compliance BOOLEAN,
    fit_and_proper_details TEXT,
    annual_supervisory_fee_status VARCHAR(50) CHECK (annual_supervisory_fee_status IN ('Paid', 'Pending', 'Overdue', 'N/A')) DEFAULT 'N/A',
    customer_asset_segregation_policy TEXT,
    aml_cft_compliance_rating VARCHAR(50) CHECK (aml_cft_compliance_rating IN ('High', 'Medium', 'Low', 'Not Assessed')) DEFAULT 'Not Assessed',
    market_share_estimate VARCHAR(255),
    user_base_estimate VARCHAR(255),
    regulatory_compliance_status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Research entries table
CREATE TABLE IF NOT EXISTS company_research (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    source_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User notes table
CREATE TABLE IF NOT EXISTS user_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    note_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE vasp_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vasp_companies ENABLE ROW LEVEL SECURITY;

-- Allow read access to all
CREATE POLICY IF NOT EXISTS "Allow read access to categories" ON vasp_categories FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow read access to companies" ON vasp_companies FOR SELECT USING (true);

-- Insert sample categories
INSERT INTO vasp_categories (id, name, slug, description, regulatory_requirements) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Advisory Services', 'advisory-services', 'Professional advisory and consulting services for virtual assets', ARRAY['PVARA License', 'Fit and Proper Assessment']),
('550e8400-e29b-41d4-a716-446655440002', 'Broker-Dealer Services', 'broker-dealer-services', 'Licensed broker-dealer services for virtual asset trading', ARRAY['PVARA License', 'Capital Adequacy']),
('550e8400-e29b-41d4-a716-446655440003', 'Custody Services', 'custody-services', 'Secure storage and custody solutions for virtual assets', ARRAY['PVARA License', 'Insurance Requirements']),
('550e8400-e29b-41d4-a716-446655440004', 'Exchange Services', 'exchange-services', 'Centralized and decentralized cryptocurrency exchanges and trading platforms', ARRAY['PVARA License', 'Market Surveillance']),
('550e8400-e29b-41d4-a716-446655440005', 'Lending and Borrowing Services', 'lending-borrowing', 'DeFi and CeFi lending, borrowing, and yield generation platforms', ARRAY['PVARA License', 'Risk Management']),
('550e8400-e29b-41d4-a716-446655440006', 'Virtual Asset Derivative Services', 'derivatives', 'Futures, options, and derivative trading platforms', ARRAY['PVARA License', 'Risk Controls']),
('550e8400-e29b-41d4-a716-446655440007', 'Virtual Asset Management and Investment Services', 'asset-management', 'Investment funds, ETFs, and asset management services', ARRAY['PVARA License', 'Fund Management Rules']),
('550e8400-e29b-41d4-a716-446655440008', 'Virtual Asset Transfer and Settlement Services', 'transfer-settlement', 'Payment processing, remittance, and settlement services', ARRAY['PVARA License', 'Payment System Rules']),
('550e8400-e29b-41d4-a716-446655440009', 'Fiat Referenced Token Issuance Services', 'fiat-tokens', 'Stablecoins and fiat-backed digital currencies', ARRAY['PVARA License', 'Reserve Requirements']),
('550e8400-e29b-41d4-a716-446655440010', 'Asset Referenced Token Issuance Services', 'asset-tokens', 'Tokenization of real-world assets and commodities', ARRAY['PVARA License', 'Asset Backing Verification'])
ON CONFLICT (id) DO NOTHING;

-- Insert sample Pakistani companies
INSERT INTO vasp_companies (
    id, name, slug, category_id, year_founded, founder_ceo_name, headquarters_location, 
    pakistan_operations, website, contact_email, contact_phone, employee_count, 
    total_funding_pkr, key_partnerships, company_description, twitter_handle, 
    linkedin_url, secp_registration_number, license_status, paid_up_capital_pkr, 
    capital_adequacy_ratio, number_of_directors, director_experience_years, 
    fit_and_proper_compliance, fit_and_proper_details, annual_supervisory_fee_status, 
    customer_asset_segregation_policy, aml_cft_compliance_rating, market_share_estimate, 
    user_base_estimate, regulatory_compliance_status
) VALUES
-- Tez Financial Services
('650e8400-e29b-41d4-a716-446655440001', 'Tez Financial Services', 'tez-financial', 
 '550e8400-e29b-41d4-a716-446655440008', 2016, 'Irfan Wahab Khan (CEO)', 'Islamabad, Pakistan', 
 true, 'https://www.telenor.com.pk/tez', 'support@tez.pk', '+92-51-111-345-100', 150, 
 2500000000, ARRAY['Telenor Pakistan', 'State Bank of Pakistan', 'National Bank of Pakistan'], 
 'Leading mobile financial services provider in Pakistan offering digital payments, money transfers, and remittance services through mobile wallets.', 
 '@TezPakistan', 'https://linkedin.com/company/tez-pakistan', 'SECP-2016-TEZ-001', 'Applied', 
 1000000000, 15.5, 7, 12, true, 'All directors have passed SBP fit and proper criteria for payment system operators', 
 'Paid', 'Customer funds are segregated in separate escrow accounts with partner banks as per SBP guidelines', 
 'High', '25% of digital payments market in Pakistan', '10 million active users', 
 'Fully compliant with SBP Payment System Regulations, PVARA license application submitted November 2025'),

-- Sadapay
('650e8400-e29b-41d4-a716-446655440004', 'Sadapay', 'sadapay',
 '550e8400-e29b-41d4-a716-446655440008', 2019, 'Brandon Timinsky (CEO & Founder)', 'Karachi, Pakistan',
 true, 'https://www.sadapay.pk', 'support@sadapay.pk', '+92-21-111-723-273', 200,
 2200000000, ARRAY['Mastercard', 'State Bank of Pakistan', 'Visa', 'JazzCash'],
 'Digital-first bank offering payment cards, transfers, and planning to expand into virtual asset transfer and settlement services.',
 '@SadaPayPK', 'https://linkedin.com/company/sadapay', 'SECP-2019-SDP-156', 'Applied',
 1500000000, 16.7, 6, 10, true, 'All directors approved by SBP for digital banking operations',
 'Paid', 'Customer deposits protected under SBP deposit protection scheme',
 'High', '15% of digital banking market', '2 million active users',
 'SBP licensed digital bank, PVARA application submitted for virtual asset services'),

-- Oraan Financial Services
('650e8400-e29b-41d4-a716-446655440003', 'Oraan Financial Services', 'oraan-financial',
 '550e8400-e29b-41d4-a716-446655440007', 2018, 'Halima Iqbal (CEO & Founder)', 'Karachi, Pakistan',
 true, 'https://www.oraan.com', 'hello@oraan.com', '+92-21-111-672-26', 45,
 300000000, ARRAY['Visa', 'Mastercard', 'Karandaaz Pakistan', 'Women''s World Banking'],
 'Pakistan''s first women-focused fintech platform expanding into virtual asset management and investment services for female investors.',
 '@OraanPK', 'https://linkedin.com/company/oraan', 'SECP-2018-OFS-089', 'Applied',
 100000000, 12.8, 4, 8, true, 'Directors meet SECP and SBP fit and proper requirements for financial services',
 'Paid', 'Investment funds segregated through custodian arrangements with licensed banks',
 'Medium', '5% of women-focused financial services', '100,000 registered users',
 'SBP EMI license holder, applying for PVARA license for virtual asset investment services'),

-- Binance (International with Pakistan operations)
('650e8400-e29b-41d4-a716-446655440006', 'Binance', 'binance',
 '550e8400-e29b-41d4-a716-446655440004', 2017, 'Richard Teng (Current CEO)', 'Dubai, UAE (Pakistan Operations: Karachi)',
 true, 'https://www.binance.com', 'support@binance.com', '+971-4-000-0000', 8000,
 NULL, ARRAY['Various Pakistani Payment Providers', 'Local Banks for P2P'],
 'World''s largest cryptocurrency exchange by trading volume, serving Pakistani users through P2P trading and international services.',
 '@binance', 'https://linkedin.com/company/binance', NULL, 'None',
 NULL, NULL, NULL, NULL, NULL, 'Not applicable - international exchange',
 'N/A', 'SAFU fund and segregated customer assets as per international standards',
 'High', '60% of Pakistani crypto trading volume (estimated)', '2+ million Pakistani users (estimated)',
 'Operating internationally, no Pakistan-specific license. Users access via P2P and international platform'),

-- Blockchain Pakistan Consulting
('650e8400-e29b-41d4-a716-446655440005', 'Blockchain Pakistan Consulting', 'blockchain-pakistan',
 '550e8400-e29b-41d4-a716-446655440001', 2017, 'Waqas Mir (CEO & Founder)', 'Lahore, Pakistan',
 true, 'https://www.blockchainpakistan.com', 'info@blockchainpakistan.com', '+92-42-111-252-462', 25,
 50000000, ARRAY['Pakistan Software Houses Association', 'LUMS', 'NED University', 'Govt of Punjab'],
 'Leading blockchain and virtual asset advisory firm providing consulting, compliance, and regulatory guidance to Pakistani businesses.',
 '@BlockchainPK', 'https://linkedin.com/company/blockchain-pakistan', 'SECP-2017-BPC-234', 'Applied',
 25000000, NULL, 3, 12, true, 'Directors have relevant blockchain and financial advisory experience',
 'N/A', 'Advisory services only - no customer asset custody',
 'Medium', '30% of blockchain consulting market in Pakistan', '150+ corporate clients',
 'SECP registered consulting firm, applying for PVARA advisory services license')
ON CONFLICT (id) DO NOTHING;

-- Insert sample research data
INSERT INTO company_research (company_id, title, content, source_url) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Tez Digital Payments Growth in Pakistan', 'Tez has captured 25% market share in Pakistan''s digital payments sector, processing over PKR 100 billion in transactions annually. The platform has become essential infrastructure for digital financial inclusion in Pakistan.', 'https://www.dawn.com/news/tez-growth-2024'),
('650e8400-e29b-41d4-a716-446655440006', 'Binance P2P Trading in Pakistan', 'Binance facilitates significant cryptocurrency trading volume in Pakistan through its P2P platform, with an estimated 2+ million Pakistani users. The exchange provides access to global crypto markets despite regulatory uncertainties.', 'https://www.coindesk.com/binance-pakistan-trading'),
('650e8400-e29b-41d4-a716-446655440003', 'Oraan Women-Focused Fintech Success', 'Oraan has onboarded over 100,000 women users, with plans to introduce Sharia-compliant virtual asset investment products. The platform addresses the gender gap in financial services in Pakistan.', 'https://www.tribune.com.pk/oraan-success-story'),
('650e8400-e29b-41d4-a716-446655440005', 'Blockchain Adoption in Pakistan', 'Blockchain Pakistan Consulting reports 300% increase in corporate blockchain adoption inquiries in 2024, driven by PVARA regulations and government digitization initiatives.', 'https://www.thenews.com.pk/blockchain-adoption-pakistan')
ON CONFLICT DO NOTHING;
