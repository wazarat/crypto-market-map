-- VASP (Virtual Asset Service Provider) Database Schema
-- Pakistan Crypto Council - PVARA Regulations 2025 Compliance

-- Categories table
CREATE TABLE vasp_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    regulatory_requirements TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Main companies table with all common columns
CREATE TABLE vasp_companies (
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
CREATE TABLE advisory_services_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    advisory_focus_areas TEXT[],
    client_type VARCHAR(50) CHECK (client_type IN ('Retail', 'Institutional', 'VASPs', 'Mixed')),
    advisory_reports_last_year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Broker-Dealer Services Details
CREATE TABLE broker_dealer_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    trading_platforms_supported TEXT[],
    asset_types_handled TEXT[],
    annual_transaction_volume_pkr BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custody Services Details
CREATE TABLE custody_services_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    custody_type TEXT[],
    insurance_coverage BOOLEAN DEFAULT false,
    insurance_amount_pkr BIGINT,
    audit_frequency VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exchange Services Details
CREATE TABLE exchange_services_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    exchange_type VARCHAR(50) CHECK (exchange_type IN ('Centralized', 'Decentralized', 'Hybrid')),
    supported_trading_pairs TEXT[],
    daily_trading_volume_pkr BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lending and Borrowing Details
CREATE TABLE lending_borrowing_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    lending_type TEXT[],
    average_interest_rate DECIMAL(5,2),
    collateral_requirements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Derivatives Details
CREATE TABLE derivatives_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    derivatives_types TEXT[],
    leverage_levels TEXT[],
    settlement_mechanism VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Asset Management Details
CREATE TABLE asset_management_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    investment_products TEXT[],
    aum_pkr BIGINT,
    annual_returns_percentage DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transfer and Settlement Details
CREATE TABLE transfer_settlement_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    transfer_types TEXT[],
    settlement_speed VARCHAR(100),
    supported_networks TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Asset Referenced Token Details
CREATE TABLE asset_referenced_token_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    backing_assets TEXT[],
    reserve_audit_frequency VARCHAR(100),
    total_token_supply VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fiat Referenced Token Details
CREATE TABLE fiat_referenced_token_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    fiat_backing TEXT[],
    peg_mechanism VARCHAR(255),
    redemption_policy TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Research entries table (existing functionality)
CREATE TABLE company_research (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    source_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User notes table (existing functionality)
CREATE TABLE user_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    note_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_vasp_companies_category ON vasp_companies(category_id);
CREATE INDEX idx_vasp_companies_slug ON vasp_companies(slug);
CREATE INDEX idx_vasp_companies_license_status ON vasp_companies(license_status);
CREATE INDEX idx_vasp_companies_pakistan_ops ON vasp_companies(pakistan_operations);

-- Update triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vasp_categories_updated_at BEFORE UPDATE ON vasp_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vasp_companies_updated_at BEFORE UPDATE ON vasp_companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_advisory_services_updated_at BEFORE UPDATE ON advisory_services_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_broker_dealer_updated_at BEFORE UPDATE ON broker_dealer_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_custody_services_updated_at BEFORE UPDATE ON custody_services_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exchange_services_updated_at BEFORE UPDATE ON exchange_services_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lending_borrowing_updated_at BEFORE UPDATE ON lending_borrowing_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_derivatives_updated_at BEFORE UPDATE ON derivatives_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_asset_management_updated_at BEFORE UPDATE ON asset_management_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transfer_settlement_updated_at BEFORE UPDATE ON transfer_settlement_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_asset_referenced_token_updated_at BEFORE UPDATE ON asset_referenced_token_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fiat_referenced_token_updated_at BEFORE UPDATE ON fiat_referenced_token_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE vasp_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vasp_companies ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY "Allow read access to categories" ON vasp_categories FOR SELECT USING (true);
CREATE POLICY "Allow read access to companies" ON vasp_companies FOR SELECT USING (true);

-- Allow insert/update/delete only to admin users (to be implemented with roles)
CREATE POLICY "Allow admin access to categories" ON vasp_categories FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin access to companies" ON vasp_companies FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
