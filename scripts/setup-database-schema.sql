-- Pakistan VASP Database Schema Setup
-- Run this in your Supabase SQL Editor

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

-- Main companies table with all common columns
CREATE TABLE IF NOT EXISTS vasp_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    category_id UUID REFERENCES vasp_categories(id),
    
    -- Company Details
    year_founded INTEGER,
    founder_ceo_name VARCHAR(255),
    headquarters_location VARCHAR(255) NOT NULL,
    pakistan_operations BOOLEAN DEFAULT false,
    website VARCHAR(500),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    employee_count INTEGER,
    total_funding_pkr BIGINT,
    
    -- Business Information
    key_partnerships TEXT[],
    company_description TEXT NOT NULL,
    logo_url VARCHAR(500),
    
    -- Social Media
    twitter_handle VARCHAR(100),
    linkedin_url VARCHAR(500),
    
    -- Regulatory Information (Pakistan Specific)
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
    
    -- Market Information
    market_share_estimate VARCHAR(255),
    user_base_estimate VARCHAR(255),
    regulatory_compliance_status TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sector-specific detail tables

-- Advisory Services Details
CREATE TABLE IF NOT EXISTS advisory_services_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    advisory_focus_areas TEXT[],
    client_type VARCHAR(50) CHECK (client_type IN ('Retail', 'Institutional', 'VASPs', 'Mixed')),
    advisory_reports_last_year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exchange Services Details
CREATE TABLE IF NOT EXISTS exchange_services_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    exchange_type VARCHAR(50) CHECK (exchange_type IN ('Centralized', 'Decentralized', 'Hybrid')),
    supported_trading_pairs TEXT[],
    daily_trading_volume_pkr BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transfer and Settlement Details
CREATE TABLE IF NOT EXISTS transfer_settlement_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    transfer_types TEXT[],
    settlement_speed VARCHAR(100),
    supported_networks TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Asset Management Details
CREATE TABLE IF NOT EXISTS asset_management_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    investment_products TEXT[],
    aum_pkr BIGINT,
    annual_returns_percentage DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Broker-Dealer Details
CREATE TABLE IF NOT EXISTS broker_dealer_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    trading_platforms_supported TEXT[],
    asset_types_handled TEXT[],
    annual_transaction_volume_pkr BIGINT,
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

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vasp_companies_category ON vasp_companies(category_id);
CREATE INDEX IF NOT EXISTS idx_vasp_companies_slug ON vasp_companies(slug);
CREATE INDEX IF NOT EXISTS idx_vasp_companies_license_status ON vasp_companies(license_status);
CREATE INDEX IF NOT EXISTS idx_vasp_companies_pakistan_ops ON vasp_companies(pakistan_operations);

-- Update triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_vasp_categories_updated_at') THEN
        CREATE TRIGGER update_vasp_categories_updated_at BEFORE UPDATE ON vasp_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_vasp_companies_updated_at') THEN
        CREATE TRIGGER update_vasp_companies_updated_at BEFORE UPDATE ON vasp_companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Row Level Security (RLS) policies
ALTER TABLE vasp_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vasp_companies ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY IF NOT EXISTS "Allow read access to categories" ON vasp_categories FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Allow read access to companies" ON vasp_companies FOR SELECT USING (true);

-- Allow insert/update/delete only to admin users
CREATE POLICY IF NOT EXISTS "Allow admin access to categories" ON vasp_categories FOR ALL USING (
    auth.jwt() ->> 'email' = 'admin@pakistancrypto.council' OR 
    auth.jwt() ->> 'role' = 'admin'
);

CREATE POLICY IF NOT EXISTS "Allow admin access to companies" ON vasp_companies FOR ALL USING (
    auth.jwt() ->> 'email' = 'admin@pakistancrypto.council' OR 
    auth.jwt() ->> 'role' = 'admin'
);

-- Insert sample categories
INSERT INTO vasp_categories (id, name, slug, description, regulatory_requirements) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Advisory Services', 'advisory-services', 'Professional advisory and consulting services for virtual assets', ARRAY['PVARA License', 'Fit and Proper Assessment', 'Capital Requirements']),
('550e8400-e29b-41d4-a716-446655440002', 'Broker-Dealer Services', 'broker-dealer-services', 'Licensed broker-dealer services for virtual asset trading', ARRAY['PVARA License', 'Capital Adequacy', 'Customer Protection']),
('550e8400-e29b-41d4-a716-446655440003', 'Custody Services', 'custody-services', 'Secure storage and custody solutions for virtual assets', ARRAY['PVARA License', 'Insurance Requirements', 'Segregation of Assets']),
('550e8400-e29b-41d4-a716-446655440004', 'Exchange Services', 'exchange-services', 'Centralized and decentralized cryptocurrency exchanges and trading platforms', ARRAY['PVARA License', 'Market Surveillance', 'AML/CFT Compliance']),
('550e8400-e29b-41d4-a716-446655440005', 'Lending and Borrowing Services', 'lending-borrowing', 'DeFi and CeFi lending, borrowing, and yield generation platforms', ARRAY['PVARA License', 'Risk Management', 'Disclosure Requirements']),
('550e8400-e29b-41d4-a716-446655440006', 'Virtual Asset Derivative Services', 'derivatives', 'Futures, options, and derivative trading platforms', ARRAY['PVARA License', 'Risk Controls', 'Position Limits']),
('550e8400-e29b-41d4-a716-446655440007', 'Virtual Asset Management and Investment Services', 'asset-management', 'Investment funds, ETFs, and asset management services', ARRAY['PVARA License', 'Fund Management Rules', 'Investor Protection']),
('550e8400-e29b-41d4-a716-446655440008', 'Virtual Asset Transfer and Settlement Services', 'transfer-settlement', 'Payment processing, remittance, and settlement services', ARRAY['PVARA License', 'Payment System Rules', 'Cross-border Compliance']),
('550e8400-e29b-41d4-a716-446655440009', 'Fiat Referenced Token Issuance Services', 'fiat-tokens', 'Stablecoins and fiat-backed digital currencies', ARRAY['PVARA License', 'Reserve Requirements', 'Audit and Reporting']),
('550e8400-e29b-41d4-a716-446655440010', 'Asset Referenced Token Issuance Services', 'asset-tokens', 'Tokenization of real-world assets and commodities', ARRAY['PVARA License', 'Asset Backing Verification', 'Transparency Requirements'])
ON CONFLICT (id) DO NOTHING;

-- Insert sample companies
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
 'Operating internationally, no Pakistan-specific license. Users access via P2P and international platform')
ON CONFLICT (id) DO NOTHING;

-- Insert sector-specific details
INSERT INTO transfer_settlement_details (company_id, transfer_types, settlement_speed, supported_networks) VALUES
('650e8400-e29b-41d4-a716-446655440001', ARRAY['P2P Transfers', 'Bill Payments', 'Merchant Payments', 'Remittances'], 'Instant', ARRAY['Telenor Network', 'Banking Network', 'Interbank'])
ON CONFLICT DO NOTHING;

INSERT INTO exchange_services_details (company_id, exchange_type, supported_trading_pairs, daily_trading_volume_pkr) VALUES
('650e8400-e29b-41d4-a716-446655440006', 'Centralized', ARRAY['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'Various Altcoins'], 50000000000)
ON CONFLICT DO NOTHING;

-- Insert sample research data
INSERT INTO company_research (company_id, title, content, source_url) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Tez Digital Payments Growth in Pakistan', 'Tez has captured 25% market share in Pakistan''s digital payments sector, processing over PKR 100 billion in transactions annually. The platform has become essential infrastructure for digital financial inclusion in Pakistan.', 'https://www.dawn.com/news/tez-growth-2024'),
('650e8400-e29b-41d4-a716-446655440006', 'Binance P2P Trading in Pakistan', 'Binance facilitates significant cryptocurrency trading volume in Pakistan through its P2P platform, with an estimated 2+ million Pakistani users. The exchange provides access to global crypto markets despite regulatory uncertainties.', 'https://www.coindesk.com/binance-pakistan-trading')
ON CONFLICT DO NOTHING;
