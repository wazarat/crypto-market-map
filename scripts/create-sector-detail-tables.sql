-- Create Sector Detail Tables
-- This script creates the missing sector detail tables with the correct structure
-- based on what the UI component expects (SectorSpecificSections.tsx)

-- 1. Create exchange_services_details table
CREATE TABLE IF NOT EXISTS exchange_services_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES vasp_companies(id) ON DELETE CASCADE,
    exchange_type VARCHAR(50),
    supported_trading_pairs TEXT[], -- Array of trading pairs like ['BTC/USD', 'ETH/USD']
    daily_trading_volume_pkr BIGINT,
    order_types_supported TEXT[], -- Array like ['Market Orders', 'Limit Orders', 'Stop-Loss Orders']
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(company_id)
);

-- 2. Create custody_services_details table  
CREATE TABLE IF NOT EXISTS custody_services_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES vasp_companies(id) ON DELETE CASCADE,
    custody_type TEXT[], -- Array like ['Hot Wallet Storage', 'Cold Storage', 'Multi-Signature Wallets']
    insurance_coverage BOOLEAN DEFAULT FALSE,
    insurance_amount_pkr BIGINT,
    audit_frequency VARCHAR(50), -- 'Monthly', 'Quarterly', 'Annually', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(company_id)
);

-- 3. Create broker_dealer_services_details table (note: code expects 'broker_dealer_details')
CREATE TABLE IF NOT EXISTS broker_dealer_services_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES vasp_companies(id) ON DELETE CASCADE,
    trading_platforms_supported TEXT[], -- Array like ['Spot Trading', 'Futures Trading', 'Web Platform']
    asset_types_handled TEXT[], -- Array like ['Bitcoin (BTC)', 'Ethereum (ETH)', 'Major Altcoins']
    annual_transaction_volume_pkr BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(company_id)
);

-- 4. Also create the table name that the code actually looks for
CREATE TABLE IF NOT EXISTS broker_dealer_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES vasp_companies(id) ON DELETE CASCADE,
    trading_platforms_supported TEXT[], -- Array like ['Spot Trading', 'Futures Trading', 'Web Platform']
    asset_types_handled TEXT[], -- Array like ['Bitcoin (BTC)', 'Ethereum (ETH)', 'Major Altcoins']
    annual_transaction_volume_pkr BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(company_id)
);

-- 5. Create asset_management_details table
CREATE TABLE IF NOT EXISTS asset_management_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES vasp_companies(id) ON DELETE CASCADE,
    services_offered TEXT[], -- Array of asset management services
    aum_pkr BIGINT, -- Assets under management in PKR
    investment_strategy TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(company_id)
);

-- 6. Create advisory_services_details table (for completeness)
CREATE TABLE IF NOT EXISTS advisory_services_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES vasp_companies(id) ON DELETE CASCADE,
    advisory_focus_areas TEXT[], -- Array like ['Consulting on Virtual Assets', 'Risk Management']
    client_type VARCHAR(50), -- 'Retail', 'Institutional', 'VASPs', 'Mixed'
    advisory_reports_last_year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(company_id)
);

-- 7. Create other sector tables that the code references
CREATE TABLE IF NOT EXISTS lending_borrowing_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES vasp_companies(id) ON DELETE CASCADE,
    lending_type TEXT[], -- Array of lending types
    average_interest_rate DECIMAL(5,2),
    collateral_requirements VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(company_id)
);

-- 8. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_exchange_services_details_company_id ON exchange_services_details(company_id);
CREATE INDEX IF NOT EXISTS idx_custody_services_details_company_id ON custody_services_details(company_id);
CREATE INDEX IF NOT EXISTS idx_broker_dealer_services_details_company_id ON broker_dealer_services_details(company_id);
CREATE INDEX IF NOT EXISTS idx_broker_dealer_details_company_id ON broker_dealer_details(company_id);
CREATE INDEX IF NOT EXISTS idx_asset_management_details_company_id ON asset_management_details(company_id);
CREATE INDEX IF NOT EXISTS idx_advisory_services_details_company_id ON advisory_services_details(company_id);
CREATE INDEX IF NOT EXISTS idx_lending_borrowing_details_company_id ON lending_borrowing_details(company_id);

-- 9. Add comments
COMMENT ON TABLE exchange_services_details IS 'Detailed information for companies offering exchange services';
COMMENT ON TABLE custody_services_details IS 'Detailed information for companies offering custody services';
COMMENT ON TABLE broker_dealer_services_details IS 'Detailed information for companies offering broker-dealer services';
COMMENT ON TABLE broker_dealer_details IS 'Alternative table name for broker-dealer details (used by code)';
COMMENT ON TABLE asset_management_details IS 'Detailed information for companies offering asset management services';
COMMENT ON TABLE advisory_services_details IS 'Detailed information for companies offering advisory services';
COMMENT ON TABLE lending_borrowing_details IS 'Detailed information for companies offering lending/borrowing services';

-- 10. Verify tables were created
SELECT 
    'Created sector detail tables:' as info,
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name LIKE '%_details'
ORDER BY table_name;
