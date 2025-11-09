-- ============================================================================
-- COMPLETE SECTOR-SPECIFIC TABLES FOR ALL 10 VASP CATEGORIES
-- Pakistan VASP Database - PVARA Regulations 2025 Compliance
-- ============================================================================

-- ============================================================================
-- 1. ADVISORY SERVICES DETAILS
-- ============================================================================
CREATE TABLE IF NOT EXISTS advisory_services_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    advisory_focus_areas TEXT[] DEFAULT '{}', -- consulting, risk management, compliance, PVARA assistance
    client_type VARCHAR(50) CHECK (client_type IN ('Retail', 'Institutional', 'VASPs', 'Mixed')),
    advisory_reports_count INTEGER DEFAULT 0,
    regulatory_expertise TEXT[],
    compliance_certifications TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 2. BROKER-DEALER SERVICES DETAILS
-- ============================================================================
CREATE TABLE IF NOT EXISTS broker_dealer_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    trading_platforms TEXT[] DEFAULT '{}', -- spot, margin, futures, web, mobile, API
    asset_types_handled TEXT[] DEFAULT '{}', -- BTC, ETH, altcoins, stablecoins, derivatives
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
    custody_types TEXT[] DEFAULT '{}', -- hot wallet, cold storage, multi-sig, HSM
    insurance_coverage BOOLEAN DEFAULT false,
    insurance_amount_pkr BIGINT,
    audit_frequency VARCHAR(50), -- monthly, quarterly, annually
    security_certifications TEXT[],
    assets_under_custody_pkr BIGINT,
    segregation_policy TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 4. EXCHANGE SERVICES DETAILS (Enhanced)
-- ============================================================================
DROP TABLE IF EXISTS exchange_services_details CASCADE;
CREATE TABLE exchange_services_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    exchange_type VARCHAR(50) CHECK (exchange_type IN ('Centralized', 'Decentralized', 'Hybrid')),
    supported_trading_pairs TEXT[] DEFAULT '{}', -- BTC/PKR, ETH/USDT, etc
    daily_trading_volume_pkr BIGINT,
    order_types_supported TEXT[] DEFAULT '{}', -- market, limit, stop-loss, etc
    settlement_mechanisms TEXT[] DEFAULT '{}', -- instant, T+0, T+1
    supported_networks TEXT[] DEFAULT '{}', -- Bitcoin, Ethereum, BSC, etc
    liquidity_sources TEXT[],
    api_access BOOLEAN DEFAULT false,
    mobile_app BOOLEAN DEFAULT false,
    web_platform BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 5. LENDING AND BORROWING DETAILS
-- ============================================================================
CREATE TABLE IF NOT EXISTS lending_borrowing_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES vasp_companies(id) ON DELETE CASCADE,
    lending_types TEXT[] DEFAULT '{}', -- DeFi, CeFi, yield generation, staking
    average_interest_rates DECIMAL(5,2),
    yield_rates DECIMAL(5,2),
    collateral_requirements VARCHAR(50) CHECK (collateral_requirements IN ('Over-collateralized', 'Under-collateralized', 'Uncollateralized')),
    supported_assets TEXT[],
    loan_terms TEXT[], -- 30 days, 90 days, 1 year, etc
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
    derivatives_types TEXT[] DEFAULT '{}', -- futures, options, perpetual swaps
    leverage_levels TEXT[] DEFAULT '{}', -- 2x, 5x, 10x, 50x, 100x
    settlement_mechanisms TEXT[] DEFAULT '{}', -- cash-settled, physically delivered
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
    investment_products TEXT[] DEFAULT '{}', -- index funds, ETFs, managed portfolios
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
    transfer_types TEXT[] DEFAULT '{}', -- P2P, bill payments, remittances, cross-border
    settlement_speed VARCHAR(50), -- instant, T+0, T+1
    supported_networks TEXT[] DEFAULT '{}', -- Bitcoin, Ethereum, BSC, traditional banking
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
    backing_currencies TEXT[] DEFAULT '{}', -- PKR, USD, EUR, multi-currency
    peg_mechanism VARCHAR(50) CHECK (peg_mechanism IN ('1:1 Reserve', 'Algorithmic', 'Hybrid')),
    redemption_policy TEXT,
    reserve_audit_frequency VARCHAR(50), -- monthly, quarterly, annually
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
    backing_assets TEXT[] DEFAULT '{}', -- real estate, commodities, stocks, art
    asset_valuation_methods TEXT[] DEFAULT '{}', -- market price, appraisal, fair value
    reserve_audit_frequency VARCHAR(50), -- monthly, quarterly, annually
    total_token_supply BIGINT,
    asset_custody_arrangements TEXT,
    liquidity_mechanisms TEXT,
    transparency_reporting BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES FOR ALL SECTOR TABLES
-- ============================================================================

-- Enable RLS on all sector tables
ALTER TABLE advisory_services_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_dealer_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE custody_services_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_services_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE lending_borrowing_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE derivatives_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_management_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfer_settlement_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE fiat_referenced_token_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_referenced_token_details ENABLE ROW LEVEL SECURITY;

-- Public read access for all sector details
CREATE POLICY "Public read access for advisory details" ON advisory_services_details FOR SELECT USING (true);
CREATE POLICY "Public read access for broker dealer details" ON broker_dealer_details FOR SELECT USING (true);
CREATE POLICY "Public read access for custody details" ON custody_services_details FOR SELECT USING (true);
CREATE POLICY "Public read access for exchange details" ON exchange_services_details FOR SELECT USING (true);
CREATE POLICY "Public read access for lending details" ON lending_borrowing_details FOR SELECT USING (true);
CREATE POLICY "Public read access for derivatives details" ON derivatives_details FOR SELECT USING (true);
CREATE POLICY "Public read access for asset management details" ON asset_management_details FOR SELECT USING (true);
CREATE POLICY "Public read access for transfer details" ON transfer_settlement_details FOR SELECT USING (true);
CREATE POLICY "Public read access for fiat token details" ON fiat_referenced_token_details FOR SELECT USING (true);
CREATE POLICY "Public read access for asset token details" ON asset_referenced_token_details FOR SELECT USING (true);

-- Admin write access for all sector details
CREATE POLICY "Admin write access for advisory details" ON advisory_services_details FOR ALL USING (true);
CREATE POLICY "Admin write access for broker dealer details" ON broker_dealer_details FOR ALL USING (true);
CREATE POLICY "Admin write access for custody details" ON custody_services_details FOR ALL USING (true);
CREATE POLICY "Admin write access for exchange details" ON exchange_services_details FOR ALL USING (true);
CREATE POLICY "Admin write access for lending details" ON lending_borrowing_details FOR ALL USING (true);
CREATE POLICY "Admin write access for derivatives details" ON derivatives_details FOR ALL USING (true);
CREATE POLICY "Admin write access for asset management details" ON asset_management_details FOR ALL USING (true);
CREATE POLICY "Admin write access for transfer details" ON transfer_settlement_details FOR ALL USING (true);
CREATE POLICY "Admin write access for fiat token details" ON fiat_referenced_token_details FOR ALL USING (true);
CREATE POLICY "Admin write access for asset token details" ON asset_referenced_token_details FOR ALL USING (true);

-- ============================================================================
-- PERFORMANCE INDEXES FOR ALL SECTOR TABLES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_advisory_company ON advisory_services_details(company_id);
CREATE INDEX IF NOT EXISTS idx_broker_dealer_company ON broker_dealer_details(company_id);
CREATE INDEX IF NOT EXISTS idx_custody_company ON custody_services_details(company_id);
CREATE INDEX IF NOT EXISTS idx_exchange_company ON exchange_services_details(company_id);
CREATE INDEX IF NOT EXISTS idx_lending_company ON lending_borrowing_details(company_id);
CREATE INDEX IF NOT EXISTS idx_derivatives_company ON derivatives_details(company_id);
CREATE INDEX IF NOT EXISTS idx_asset_mgmt_company ON asset_management_details(company_id);
CREATE INDEX IF NOT EXISTS idx_transfer_company ON transfer_settlement_details(company_id);
CREATE INDEX IF NOT EXISTS idx_fiat_token_company ON fiat_referenced_token_details(company_id);
CREATE INDEX IF NOT EXISTS idx_asset_token_company ON asset_referenced_token_details(company_id);

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================
-- Check that all sector tables exist
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name LIKE '%_details'
ORDER BY table_name;

-- ============================================================================
-- COMPLETE! ALL 10 SECTOR TABLES CREATED
-- ============================================================================
-- The following sector-specific tables are now available:
-- 1. advisory_services_details
-- 2. broker_dealer_details  
-- 3. custody_services_details
-- 4. exchange_services_details (enhanced)
-- 5. lending_borrowing_details
-- 6. derivatives_details
-- 7. asset_management_details
-- 8. transfer_settlement_details
-- 9. fiat_referenced_token_details
-- 10. asset_referenced_token_details
-- ============================================================================
