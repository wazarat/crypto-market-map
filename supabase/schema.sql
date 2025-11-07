-- Crypto Market Map Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sectors table
CREATE TABLE sectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Companies table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sector_id UUID NOT NULL REFERENCES sectors(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    short_summary TEXT,
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company research table
CREATE TABLE company_research (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    source_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User notes table
CREATE TABLE user_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- Will be linked to auth.users later
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    note_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_companies_sector_id ON companies(sector_id);
CREATE INDEX idx_company_research_company_id ON company_research(company_id);
CREATE INDEX idx_user_notes_company_id ON user_notes(company_id);
CREATE INDEX idx_user_notes_user_id ON user_notes(user_id);

-- Sample data
INSERT INTO sectors (name, slug, description) VALUES
    ('Exchanges / On-Off Ramps', 'exchanges-on-off-ramps', 'Cryptocurrency exchanges and fiat on/off ramp services'),
    ('Stablecoin Issuers', 'stablecoin-issuers', 'Companies that issue and maintain stablecoins'),
    ('Yield', 'yield', 'DeFi protocols and services focused on yield generation'),
    ('B2B Payments', 'b2b-payments', 'Business-to-business payment solutions using crypto'),
    ('Cross Border', 'cross-border', 'Cross-border payment and remittance services'),
    ('Wallets', 'wallets', 'Cryptocurrency wallet providers and custody solutions');

-- Sample companies for each sector
INSERT INTO companies (sector_id, name, slug, logo_url, short_summary, website) VALUES
    -- Exchanges / On-Off Ramps
    ((SELECT id FROM sectors WHERE slug = 'exchanges-on-off-ramps'), 'Coinbase', 'coinbase', 'https://via.placeholder.com/40', 'Leading US cryptocurrency exchange', 'https://coinbase.com'),
    ((SELECT id FROM sectors WHERE slug = 'exchanges-on-off-ramps'), 'Binance', 'binance', 'https://via.placeholder.com/40', 'World''s largest cryptocurrency exchange', 'https://binance.com'),
    ((SELECT id FROM sectors WHERE slug = 'exchanges-on-off-ramps'), 'Kraken', 'kraken', 'https://via.placeholder.com/40', 'Secure and compliant crypto exchange', 'https://kraken.com'),
    
    -- Stablecoin Issuers
    ((SELECT id FROM sectors WHERE slug = 'stablecoin-issuers'), 'Circle', 'circle', 'https://via.placeholder.com/40', 'Issuer of USDC stablecoin', 'https://circle.com'),
    ((SELECT id FROM sectors WHERE slug = 'stablecoin-issuers'), 'Tether', 'tether', 'https://via.placeholder.com/40', 'Issuer of USDT stablecoin', 'https://tether.to'),
    ((SELECT id FROM sectors WHERE slug = 'stablecoin-issuers'), 'MakerDAO', 'makerdao', 'https://via.placeholder.com/40', 'Decentralized stablecoin protocol (DAI)', 'https://makerdao.com'),
    
    -- Yield
    ((SELECT id FROM sectors WHERE slug = 'yield'), 'Aave', 'aave', 'https://via.placeholder.com/40', 'Decentralized lending protocol', 'https://aave.com'),
    ((SELECT id FROM sectors WHERE slug = 'yield'), 'Compound', 'compound', 'https://via.placeholder.com/40', 'Algorithmic money market protocol', 'https://compound.finance'),
    ((SELECT id FROM sectors WHERE slug = 'yield'), 'Yearn Finance', 'yearn-finance', 'https://via.placeholder.com/40', 'Yield optimization protocol', 'https://yearn.finance'),
    
    -- B2B Payments
    ((SELECT id FROM sectors WHERE slug = 'b2b-payments'), 'BitPay', 'bitpay', 'https://via.placeholder.com/40', 'Bitcoin payment processor', 'https://bitpay.com'),
    ((SELECT id FROM sectors WHERE slug = 'b2b-payments'), 'Ripple', 'ripple', 'https://via.placeholder.com/40', 'Enterprise blockchain solutions', 'https://ripple.com'),
    
    -- Cross Border
    ((SELECT id FROM sectors WHERE slug = 'cross-border'), 'Stellar', 'stellar', 'https://via.placeholder.com/40', 'Cross-border payment network', 'https://stellar.org'),
    ((SELECT id FROM sectors WHERE slug = 'cross-border'), 'Remitly', 'remitly', 'https://via.placeholder.com/40', 'Digital remittance service', 'https://remitly.com'),
    
    -- Wallets
    ((SELECT id FROM sectors WHERE slug = 'wallets'), 'MetaMask', 'metamask', 'https://via.placeholder.com/40', 'Popular Ethereum wallet', 'https://metamask.io'),
    ((SELECT id FROM sectors WHERE slug = 'wallets'), 'Ledger', 'ledger', 'https://via.placeholder.com/40', 'Hardware wallet manufacturer', 'https://ledger.com'),
    ((SELECT id FROM sectors WHERE slug = 'wallets'), 'Trust Wallet', 'trust-wallet', 'https://via.placeholder.com/40', 'Multi-currency mobile wallet', 'https://trustwallet.com');

-- Sample research data
INSERT INTO company_research (company_id, title, content, source_url) VALUES
    ((SELECT id FROM companies WHERE slug = 'coinbase'), 'Coinbase Q3 2023 Earnings', 'Coinbase reported strong Q3 results with increased trading volume and institutional adoption...', 'https://investor.coinbase.com'),
    ((SELECT id FROM companies WHERE slug = 'circle'), 'USDC Market Analysis', 'Circle''s USDC maintains its position as the second-largest stablecoin by market cap...', 'https://circle.com/blog'),
    ((SELECT id FROM companies WHERE slug = 'aave'), 'Aave V3 Protocol Update', 'Aave V3 introduces new features including cross-chain functionality and improved capital efficiency...', 'https://aave.com/blog');
