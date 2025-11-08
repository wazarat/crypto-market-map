-- Seed VASP Categories
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
('550e8400-e29b-41d4-a716-446655440010', 'Asset Referenced Token Issuance Services', 'asset-tokens', 'Tokenization of real-world assets and commodities', ARRAY['PVARA License', 'Asset Backing Verification', 'Transparency Requirements']);

-- Seed VASP Companies
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
 2500000000, ARRAY['Telenor Pakistan', 'State Bank of Pakistan', 'National Bank of Pakistan', 'HBL', 'UBL'], 
 'Leading mobile financial services provider in Pakistan offering digital payments, money transfers, and remittance services through mobile wallets.', 
 '@TezPakistan', 'https://linkedin.com/company/tez-pakistan', 'SECP-2016-TEZ-001', 'Applied', 
 1000000000, 15.5, 7, 12, true, 'All directors have passed SBP fit and proper criteria for payment system operators', 
 'Paid', 'Customer funds are segregated in separate escrow accounts with partner banks as per SBP guidelines', 
 'High', '25% of digital payments market in Pakistan', '10 million active users', 
 'Fully compliant with SBP Payment System Regulations, PVARA license application submitted November 2025'),

-- KTrade Securities  
('650e8400-e29b-41d4-a716-446655440002', 'KTrade Securities', 'ktrade-securities',
 '550e8400-e29b-41d4-a716-446655440002', 2001, 'Muneer Kamal (CEO)', 'Karachi, Pakistan',
 true, 'https://www.ktrade.com.pk', 'info@ktrade.com.pk', '+92-21-111-111-566', 85,
 500000000, ARRAY['Pakistan Stock Exchange', 'Central Depository Company', 'National Clearing Company'],
 'Leading brokerage house in Pakistan expanding into digital asset trading and virtual asset broker-dealer services.',
 '@KTradeSecurities', 'https://linkedin.com/company/ktrade-securities', 'SECP-2001-KTS-045', 'Under Review',
 250000000, 18.2, 5, 15, true, 'All directors are SECP approved persons with securities market experience',
 'Paid', 'Client assets segregated as per SECP broker regulations, extending to virtual assets',
 'High', '8% of retail brokerage market', '50,000 active trading accounts',
 'SECP licensed securities broker, PVARA license under review for virtual asset services'),

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
 'SECP registered consulting firm, applying for PVARA advisory services license'),

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
 'Operating internationally, no Pakistan-specific license. Users access via P2P and international platform');

-- Seed sector-specific details
INSERT INTO advisory_services_details (company_id, advisory_focus_areas, client_type, advisory_reports_last_year) VALUES
('650e8400-e29b-41d4-a716-446655440005', ARRAY['Blockchain Implementation', 'Regulatory Compliance', 'Virtual Asset Strategy', 'PVARA License Assistance'], 'Mixed', 45);

INSERT INTO broker_dealer_details (company_id, trading_platforms_supported, asset_types_handled, annual_transaction_volume_pkr) VALUES
('650e8400-e29b-41d4-a716-446655440002', ARRAY['Web Platform', 'Mobile App', 'API Trading'], ARRAY['Equities', 'Bonds', 'Virtual Assets (Planned)'], 15000000000);

INSERT INTO exchange_services_details (company_id, exchange_type, supported_trading_pairs, daily_trading_volume_pkr) VALUES
('650e8400-e29b-41d4-a716-446655440006', 'Centralized', ARRAY['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'Various Altcoins'], 50000000000);

INSERT INTO asset_management_details (company_id, investment_products, aum_pkr, annual_returns_percentage) VALUES
('650e8400-e29b-41d4-a716-446655440003', ARRAY['Digital Savings', 'Investment Plans', 'Virtual Asset Portfolios (Planned)'], 500000000, 8.5);

INSERT INTO transfer_settlement_details (company_id, transfer_types, settlement_speed, supported_networks) VALUES
('650e8400-e29b-41d4-a716-446655440001', ARRAY['P2P Transfers', 'Bill Payments', 'Merchant Payments', 'Remittances'], 'Instant', ARRAY['Telenor Network', 'Banking Network', 'Interbank']),
('650e8400-e29b-41d4-a716-446655440004', ARRAY['Card Payments', 'Bank Transfers', 'Digital Wallet', 'International Remittance'], 'Instant to T+1', ARRAY['Mastercard', 'Visa', '1Link', 'SWIFT']);

-- Sample research data
INSERT INTO company_research (company_id, title, content, source_url) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Tez Digital Payments Growth in Pakistan', 'Tez has captured 25% market share in Pakistan''s digital payments sector, processing over PKR 100 billion in transactions annually.', 'https://www.dawn.com/news/tez-growth-2024'),
('650e8400-e29b-41d4-a716-446655440002', 'KTrade Expansion into Digital Assets', 'KTrade Securities announces plans to offer virtual asset trading services pending PVARA license approval, targeting retail investors.', 'https://www.brecorder.com/ktrade-digital-assets'),
('650e8400-e29b-41d4-a716-446655440003', 'Oraan Women-Focused Fintech Success', 'Oraan has onboarded over 100,000 women users, with plans to introduce Sharia-compliant virtual asset investment products.', 'https://www.tribune.com.pk/oraan-success-story'),
('650e8400-e29b-41d4-a716-446655440005', 'Blockchain Adoption in Pakistan', 'Blockchain Pakistan Consulting reports 300% increase in corporate blockchain adoption inquiries in 2024, driven by PVARA regulations.', 'https://www.thenews.com.pk/blockchain-adoption-pakistan');
