-- ============================================================================
-- ADD MISSING SECTOR TABLES (Safe Script - Handles Existing Tables)
-- ============================================================================

-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Public read access for advisory details" ON advisory_services_details;
DROP POLICY IF EXISTS "Admin write access for advisory details" ON advisory_services_details;

-- ============================================================================
-- 2. BROKER-DEALER SERVICES DETAILS
-- ============================================================================
CREATE TABLE IF NOT EXISTS broker_dealer_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    trading_platforms TEXT[] DEFAULT '{}',
    asset_types_handled TEXT[] DEFAULT '{}',
    annual_transaction_volume_pkr BIGINT,
    commission_structure TEXT,
    order_execution_methods TEXT[],
    market_making_services BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 3. CUSTODY SERVICES DETAILS
-- ============================================================================
CREATE TABLE IF NOT EXISTS custody_services_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    custody_types TEXT[] DEFAULT '{}',
    insurance_coverage BOOLEAN DEFAULT false,
    insurance_amount_pkr BIGINT,
    audit_frequency VARCHAR(50),
    security_certifications TEXT[],
    assets_under_custody_pkr BIGINT,
    segregation_policy TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 5. LENDING AND BORROWING DETAILS
-- ============================================================================
CREATE TABLE IF NOT EXISTS lending_borrowing_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    lending_types TEXT[] DEFAULT '{}',
    average_interest_rates DECIMAL(5,2),
    yield_rates DECIMAL(5,2),
    collateral_requirements VARCHAR(50),
    supported_assets TEXT[],
    loan_terms TEXT[],
    risk_management_policy TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 6. VIRTUAL ASSET DERIVATIVES DETAILS
-- ============================================================================
CREATE TABLE IF NOT EXISTS derivatives_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    derivatives_types TEXT[] DEFAULT '{}',
    leverage_levels TEXT[] DEFAULT '{}',
    settlement_mechanisms TEXT[] DEFAULT '{}',
    underlying_assets TEXT[],
    margin_requirements DECIMAL(5,2),
    risk_management_tools TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 7. ASSET MANAGEMENT DETAILS
-- ============================================================================
CREATE TABLE IF NOT EXISTS asset_management_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    investment_products TEXT[] DEFAULT '{}',
    assets_under_management_pkr BIGINT,
    average_annual_returns DECIMAL(5,2),
    investment_strategies TEXT[],
    fee_structure TEXT,
    minimum_investment_pkr BIGINT,
    portfolio_diversification TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 8. TRANSFER AND SETTLEMENT DETAILS
-- ============================================================================
CREATE TABLE IF NOT EXISTS transfer_settlement_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    transfer_types TEXT[] DEFAULT '{}',
    settlement_speed VARCHAR(50),
    supported_networks TEXT[] DEFAULT '{}',
    transaction_fees_structure TEXT,
    daily_transaction_limit_pkr BIGINT,
    cross_border_capabilities BOOLEAN DEFAULT false,
    compliance_monitoring TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 9. FIAT REFERENCED TOKENS DETAILS
-- ============================================================================
CREATE TABLE IF NOT EXISTS fiat_referenced_token_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    backing_currencies TEXT[] DEFAULT '{}',
    peg_mechanism VARCHAR(50),
    redemption_policy TEXT,
    reserve_audit_frequency VARCHAR(50),
    total_tokens_issued BIGINT,
    reserve_transparency_reports BOOLEAN DEFAULT false,
    regulatory_compliance TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 10. ASSET REFERENCED TOKENS DETAILS
-- ============================================================================
CREATE TABLE IF NOT EXISTS asset_referenced_token_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    backing_assets TEXT[] DEFAULT '{}',
    asset_valuation_methods TEXT[] DEFAULT '{}',
    reserve_audit_frequency VARCHAR(50),
    total_token_supply BIGINT,
    asset_custody_arrangements TEXT,
    liquidity_mechanisms TEXT,
    transparency_reporting BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ENABLE RLS ON NEW TABLES
-- ============================================================================
ALTER TABLE broker_dealer_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE custody_services_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE lending_borrowing_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE derivatives_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_management_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfer_settlement_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE fiat_referenced_token_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_referenced_token_details ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CREATE POLICIES FOR ALL TABLES (INCLUDING EXISTING ONES)
-- ============================================================================

-- Advisory Services (recreate policies)
CREATE POLICY "Public read access for advisory details" ON advisory_services_details FOR SELECT USING (true);
CREATE POLICY "Admin write access for advisory details" ON advisory_services_details FOR ALL USING (true);

-- Broker Dealer
CREATE POLICY "Public read access for broker dealer details" ON broker_dealer_details FOR SELECT USING (true);
CREATE POLICY "Admin write access for broker dealer details" ON broker_dealer_details FOR ALL USING (true);

-- Custody Services
CREATE POLICY "Public read access for custody details" ON custody_services_details FOR SELECT USING (true);
CREATE POLICY "Admin write access for custody details" ON custody_services_details FOR ALL USING (true);

-- Lending & Borrowing
CREATE POLICY "Public read access for lending details" ON lending_borrowing_details FOR SELECT USING (true);
CREATE POLICY "Admin write access for lending details" ON lending_borrowing_details FOR ALL USING (true);

-- Derivatives
CREATE POLICY "Public read access for derivatives details" ON derivatives_details FOR SELECT USING (true);
CREATE POLICY "Admin write access for derivatives details" ON derivatives_details FOR ALL USING (true);

-- Asset Management
CREATE POLICY "Public read access for asset management details" ON asset_management_details FOR SELECT USING (true);
CREATE POLICY "Admin write access for asset management details" ON asset_management_details FOR ALL USING (true);

-- Transfer & Settlement
CREATE POLICY "Public read access for transfer details" ON transfer_settlement_details FOR SELECT USING (true);
CREATE POLICY "Admin write access for transfer details" ON transfer_settlement_details FOR ALL USING (true);

-- Fiat Referenced Tokens
CREATE POLICY "Public read access for fiat token details" ON fiat_referenced_token_details FOR SELECT USING (true);
CREATE POLICY "Admin write access for fiat token details" ON fiat_referenced_token_details FOR ALL USING (true);

-- Asset Referenced Tokens
CREATE POLICY "Public read access for asset token details" ON asset_referenced_token_details FOR SELECT USING (true);
CREATE POLICY "Admin write access for asset token details" ON asset_referenced_token_details FOR ALL USING (true);

-- ============================================================================
-- CREATE INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_broker_dealer_company ON broker_dealer_details(company_id);
CREATE INDEX IF NOT EXISTS idx_custody_company ON custody_services_details(company_id);
CREATE INDEX IF NOT EXISTS idx_lending_company ON lending_borrowing_details(company_id);
CREATE INDEX IF NOT EXISTS idx_derivatives_company ON derivatives_details(company_id);
CREATE INDEX IF NOT EXISTS idx_asset_mgmt_company ON asset_management_details(company_id);
CREATE INDEX IF NOT EXISTS idx_transfer_company ON transfer_settlement_details(company_id);
CREATE INDEX IF NOT EXISTS idx_fiat_token_company ON fiat_referenced_token_details(company_id);
CREATE INDEX IF NOT EXISTS idx_asset_token_company ON asset_referenced_token_details(company_id);

-- ============================================================================
-- VERIFICATION - CHECK ALL TABLES EXIST
-- ============================================================================
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name LIKE '%_details'
ORDER BY table_name;
