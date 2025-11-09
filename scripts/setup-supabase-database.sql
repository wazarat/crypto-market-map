-- ============================================================================
-- PAKISTAN VASP DATABASE SETUP
-- Complete schema for Pakistan Crypto Council - PVARA Regulations 2025
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. CATEGORIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS vasp_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    regulatory_requirements TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 2. MAIN COMPANIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS vasp_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    category_id UUID REFERENCES vasp_categories(id),
    
    -- Company Details
    year_founded INTEGER,
    founder_ceo_name VARCHAR(255),
    headquarters_location VARCHAR(255) NOT NULL DEFAULT 'Pakistan',
    pakistan_operations BOOLEAN DEFAULT true,
    website VARCHAR(500),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    point_of_contact_email VARCHAR(255),
    point_of_contact_phone VARCHAR(50),
    employee_count INTEGER,
    total_funding_pkr BIGINT,
    
    -- Business Information
    key_partnerships TEXT[],
    company_description TEXT,
    company_overview TEXT,
    logo_url VARCHAR(500),
    
    -- Social Media
    social_media_twitter VARCHAR(255),
    social_media_linkedin VARCHAR(500),
    social_media_facebook VARCHAR(500),
    
    -- Regulatory Information (Pakistan Specific)
    secp_registration_number VARCHAR(100),
    pvara_license_number VARCHAR(100),
    license_status VARCHAR(50) DEFAULT 'None' CHECK (license_status IN ('Applied', 'Granted', 'Suspended', 'None', 'Under Review')),
    verification_status VARCHAR(50) DEFAULT 'Pending' CHECK (verification_status IN ('Pending', 'Verified', 'Rejected', 'Under Review')),
    paid_up_capital_pkr BIGINT,
    capital_adequacy_ratio DECIMAL(5,2),
    number_of_directors INTEGER,
    director_experience_years INTEGER,
    fit_and_proper_compliance BOOLEAN,
    fit_and_proper_details TEXT,
    annual_supervisory_fee_status VARCHAR(20) DEFAULT 'N/A' CHECK (annual_supervisory_fee_status IN ('Paid', 'Pending', 'Overdue', 'N/A')),
    customer_asset_segregation_policy TEXT,
    aml_cft_compliance_rating VARCHAR(20) DEFAULT 'Not Assessed' CHECK (aml_cft_compliance_rating IN ('High', 'Medium', 'Low', 'Not Assessed')),
    
    -- Market Information
    market_share_estimate VARCHAR(100),
    user_base_estimate VARCHAR(100),
    regulatory_compliance_status TEXT,
    
    -- Audit fields
    last_updated_by VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 3. COMPANY SECTORS (Many-to-Many Relationship)
-- ============================================================================
CREATE TABLE IF NOT EXISTS company_sectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    sector_slug VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, sector_slug)
);

-- ============================================================================
-- 4. USER NOTES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    note_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 5. COMPANY AUDIT LOG
-- ============================================================================
CREATE TABLE IF NOT EXISTS company_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    field_name VARCHAR(100),
    old_value TEXT,
    new_value TEXT,
    changed_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 6. SECTOR-SPECIFIC TABLES
-- ============================================================================

-- Exchange Services Details
CREATE TABLE IF NOT EXISTS exchange_services_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    exchange_type VARCHAR(50) CHECK (exchange_type IN ('Centralized', 'Decentralized', 'Hybrid')),
    supported_trading_pairs TEXT[],
    daily_trading_volume_pkr BIGINT,
    order_types_supported TEXT[],
    settlement_mechanisms TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Advisory Services Details
CREATE TABLE IF NOT EXISTS advisory_services_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    advisory_focus_areas TEXT[],
    client_type VARCHAR(50) CHECK (client_type IN ('Retail', 'Institutional', 'VASPs', 'Mixed')),
    advisory_reports_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 7. INSERT SAMPLE CATEGORIES
-- ============================================================================
INSERT INTO vasp_categories (name, slug, description) VALUES
('Advisory Services', 'advisory-services', 'Providing consultation and advisory services for virtual assets'),
('Broker-Dealer Services', 'broker-dealer-services', 'Facilitating trading and brokerage of virtual assets'),
('Custody Services', 'custody-services', 'Safekeeping and storage of virtual assets'),
('Exchange Services', 'exchange-services', 'Operating virtual asset trading platforms'),
('Lending and Borrowing', 'lending-borrowing', 'Providing lending and borrowing services for virtual assets'),
('Virtual Asset Derivatives', 'derivatives', 'Trading in virtual asset derivatives and structured products'),
('Asset Management', 'asset-management', 'Managing virtual asset portfolios and investment funds'),
('Transfer and Settlement', 'transfer-settlement', 'Facilitating transfer and settlement of virtual assets'),
('Fiat Referenced Tokens', 'fiat-tokens', 'Issuing tokens referenced to fiat currencies'),
('Asset Referenced Tokens', 'asset-tokens', 'Issuing tokens referenced to other assets')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE vasp_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vasp_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_services_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE advisory_services_details ENABLE ROW LEVEL SECURITY;

-- Public read access for categories and companies
CREATE POLICY "Public read access for categories" ON vasp_categories FOR SELECT USING (true);
CREATE POLICY "Public read access for companies" ON vasp_companies FOR SELECT USING (true);
CREATE POLICY "Public read access for company sectors" ON company_sectors FOR SELECT USING (true);
CREATE POLICY "Public read access for exchange details" ON exchange_services_details FOR SELECT USING (true);
CREATE POLICY "Public read access for advisory details" ON advisory_services_details FOR SELECT USING (true);

-- Admin write access (you can modify this based on your auth setup)
CREATE POLICY "Admin write access for companies" ON vasp_companies FOR ALL USING (true);
CREATE POLICY "Admin write access for company sectors" ON company_sectors FOR ALL USING (true);
CREATE POLICY "Admin write access for exchange details" ON exchange_services_details FOR ALL USING (true);
CREATE POLICY "Admin write access for advisory details" ON advisory_services_details FOR ALL USING (true);

-- User-specific access for notes
CREATE POLICY "Users can manage their own notes" ON user_notes FOR ALL USING (true);

-- Audit log read access
CREATE POLICY "Public read access for audit log" ON company_audit_log FOR SELECT USING (true);
CREATE POLICY "Admin write access for audit log" ON company_audit_log FOR INSERT WITH CHECK (true);

-- ============================================================================
-- 9. INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_companies_category ON vasp_companies(category_id);
CREATE INDEX IF NOT EXISTS idx_companies_slug ON vasp_companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_license_status ON vasp_companies(license_status);
CREATE INDEX IF NOT EXISTS idx_company_sectors_company ON company_sectors(company_id);
CREATE INDEX IF NOT EXISTS idx_company_sectors_sector ON company_sectors(sector_slug);
CREATE INDEX IF NOT EXISTS idx_user_notes_company ON user_notes(company_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_user ON user_notes(user_id);

-- ============================================================================
-- 10. TRIGGERS FOR AUDIT LOGGING
-- ============================================================================
CREATE OR REPLACE FUNCTION audit_company_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        INSERT INTO company_audit_log (company_id, action, changed_by)
        VALUES (NEW.id, 'UPDATE', NEW.last_updated_by);
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO company_audit_log (company_id, action, changed_by)
        VALUES (NEW.id, 'INSERT', NEW.last_updated_by);
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER company_audit_trigger
    AFTER INSERT OR UPDATE ON vasp_companies
    FOR EACH ROW EXECUTE FUNCTION audit_company_changes();

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================
-- Your Pakistan VASP database is now ready!
-- 
-- Next steps:
-- 1. Check that all tables were created successfully
-- 2. Test the connection from your app
-- 3. Use the bulk upload feature to add companies
-- 
-- Tables created:
-- - vasp_categories (10 categories inserted)
-- - vasp_companies (ready for your company data)
-- - company_sectors (many-to-many relationships)
-- - user_notes (for user research notes)
-- - company_audit_log (tracks all changes)
-- - exchange_services_details (sector-specific data)
-- - advisory_services_details (sector-specific data)
-- ============================================================================
