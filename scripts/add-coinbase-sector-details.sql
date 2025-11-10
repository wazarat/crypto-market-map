-- Add Sector-Specific Details for Coinbase
-- This script adds detailed information for Coinbase across multiple sectors

-- First, verify Coinbase exists and get its ID
SELECT 
    'Coinbase company verification:' as info,
    id,
    name,
    slug
FROM vasp_companies 
WHERE slug = 'coinbase';

-- Check which sector detail tables exist
SELECT 
    'Available sector detail tables:' as info,
    table_name
FROM information_schema.tables 
WHERE table_name LIKE '%_services_details' OR table_name LIKE '%_management_details'
ORDER BY table_name;

-- 1) EXCHANGE SERVICES DETAILS FOR COINBASE
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'exchange_services_details') THEN
        INSERT INTO exchange_services_details (
            company_id,
            exchange_type,
            supported_trading_pairs,
            daily_trading_volume_pkr,
            market_orders,
            limit_orders,
            stop_loss_orders,
            take_profit_orders,
            trailing_stop_orders,
            fill_or_kill,
            immediate_or_cancel
        ) VALUES (
            (SELECT id FROM vasp_companies WHERE slug = 'coinbase'),
            'Centralized',
            ARRAY['BTC/USD','ETH/USD','SOL/USD','USDC/USD'],
            NULL,                 -- fill in PKR if you want
            TRUE,                 -- market orders
            TRUE,                 -- limit orders
            TRUE,                 -- stop-loss
            TRUE,                 -- take-profit
            FALSE,                -- trailing stop (not primary on Coinbase spot)
            FALSE,                -- FOK
            TRUE                  -- IOC-type supported on advanced
        )
        ON CONFLICT (company_id)
        DO UPDATE SET
            exchange_type = EXCLUDED.exchange_type,
            supported_trading_pairs = EXCLUDED.supported_trading_pairs,
            daily_trading_volume_pkr = EXCLUDED.daily_trading_volume_pkr,
            market_orders = EXCLUDED.market_orders,
            limit_orders = EXCLUDED.limit_orders,
            stop_loss_orders = EXCLUDED.stop_loss_orders,
            take_profit_orders = EXCLUDED.take_profit_orders,
            trailing_stop_orders = EXCLUDED.trailing_stop_orders,
            fill_or_kill = EXCLUDED.fill_or_kill,
            immediate_or_cancel = EXCLUDED.immediate_or_cancel,
            updated_at = NOW();
        
        RAISE NOTICE 'Exchange services details updated for Coinbase';
    ELSE
        RAISE NOTICE 'exchange_services_details table does not exist';
    END IF;
END $$;

-- 2) CUSTODY SERVICES DETAILS FOR COINBASE
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'custody_services_details') THEN
        INSERT INTO custody_services_details (
            company_id,
            hot_wallet_storage,
            cold_storage,
            multi_sig_wallets,
            hsm_support,
            institutional_custody,
            self_custody_solutions,
            hybrid_solutions,
            insurance_coverage,
            insurance_coverage_amount_pkr,
            audit_frequency
        ) VALUES (
            (SELECT id FROM vasp_companies WHERE slug = 'coinbase'),
            TRUE,    -- hot wallet
            TRUE,    -- cold storage
            TRUE,    -- multisig/wallet controls
            TRUE,    -- HSM
            TRUE,    -- institutional custody (Coinbase Custody)
            FALSE,   -- self-custody (they have Wallet, but it's separate; keep FALSE here)
            TRUE,    -- hybrid arrangements
            TRUE,    -- insured custody
            NULL,    -- put PKR amount if you have it
            'Annual' -- or 'Quarterly' etc.
        )
        ON CONFLICT (company_id)
        DO UPDATE SET
            hot_wallet_storage = EXCLUDED.hot_wallet_storage,
            cold_storage = EXCLUDED.cold_storage,
            multi_sig_wallets = EXCLUDED.multi_sig_wallets,
            hsm_support = EXCLUDED.hsm_support,
            institutional_custody = EXCLUDED.institutional_custody,
            self_custody_solutions = EXCLUDED.self_custody_solutions,
            hybrid_solutions = EXCLUDED.hybrid_solutions,
            insurance_coverage = EXCLUDED.insurance_coverage,
            insurance_coverage_amount_pkr = EXCLUDED.insurance_coverage_amount_pkr,
            audit_frequency = EXCLUDED.audit_frequency,
            updated_at = NOW();
        
        RAISE NOTICE 'Custody services details updated for Coinbase';
    ELSE
        RAISE NOTICE 'custody_services_details table does not exist';
    END IF;
END $$;

-- 3) BROKER–DEALER SERVICES DETAILS FOR COINBASE
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'broker_dealer_services_details') THEN
        INSERT INTO broker_dealer_services_details (
            company_id,
            spot_trading,
            futures_trading,
            margin_trading,
            options_trading,
            web_platform,
            mobile_app,
            api_trading,
            algorithmic_trading,
            asset_btc,
            asset_eth,
            asset_major_altcoins,
            asset_stablecoins,
            asset_defi_tokens,
            asset_derivatives,
            annual_transaction_volume_pkr
        ) VALUES (
            (SELECT id FROM vasp_companies WHERE slug = 'coinbase'),
            TRUE,   -- spot
            TRUE,   -- futures (Coinbase Intl / derivatives)
            TRUE,   -- margin (in limited jurisdictions)
            FALSE,  -- options (not a main Coinbase spot feature)
            TRUE,   -- web
            TRUE,   -- mobile
            TRUE,   -- API
            TRUE,   -- algo via API
            TRUE,   -- BTC
            TRUE,   -- ETH
            TRUE,   -- majors
            TRUE,   -- stablecoins
            TRUE,   -- defi tokens
            TRUE,   -- derivatives
            NULL    -- put PKR value if you want
        )
        ON CONFLICT (company_id)
        DO UPDATE SET
            spot_trading = EXCLUDED.spot_trading,
            futures_trading = EXCLUDED.futures_trading,
            margin_trading = EXCLUDED.margin_trading,
            options_trading = EXCLUDED.options_trading,
            web_platform = EXCLUDED.web_platform,
            mobile_app = EXCLUDED.mobile_app,
            api_trading = EXCLUDED.api_trading,
            algorithmic_trading = EXCLUDED.algorithmic_trading,
            asset_btc = EXCLUDED.asset_btc,
            asset_eth = EXCLUDED.asset_eth,
            asset_major_altcoins = EXCLUDED.asset_major_altcoins,
            asset_stablecoins = EXCLUDED.asset_stablecoins,
            asset_defi_tokens = EXCLUDED.asset_defi_tokens,
            asset_derivatives = EXCLUDED.asset_derivatives,
            annual_transaction_volume_pkr = EXCLUDED.annual_transaction_volume_pkr,
            updated_at = NOW();
        
        RAISE NOTICE 'Broker-dealer services details updated for Coinbase';
    ELSE
        RAISE NOTICE 'broker_dealer_services_details table does not exist';
    END IF;
END $$;

-- 4) ASSET MANAGEMENT / INVESTMENT DETAILS FOR COINBASE
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'asset_management_details') THEN
        INSERT INTO asset_management_details (
            company_id,
            crypto_index_funds,
            etfs,
            managed_portfolios,
            hedge_funds,
            pension_funds,
            mutual_funds,
            private_equity,
            venture_capital,
            aum_pkr,
            avg_annual_returns_pct,
            investment_strategy
        ) VALUES (
            (SELECT id FROM vasp_companies WHERE slug = 'coinbase'),
            FALSE,
            FALSE,
            FALSE,
            FALSE,
            FALSE,
            FALSE,
            FALSE,
            FALSE,
            NULL,
            NULL,
            NULL
        )
        ON CONFLICT (company_id)
        DO UPDATE SET
            crypto_index_funds = EXCLUDED.crypto_index_funds,
            etfs = EXCLUDED.etfs,
            managed_portfolios = EXCLUDED.managed_portfolios,
            hedge_funds = EXCLUDED.hedge_funds,
            pension_funds = EXCLUDED.pension_funds,
            mutual_funds = EXCLUDED.mutual_funds,
            private_equity = EXCLUDED.private_equity,
            venture_capital = EXCLUDED.venture_capital,
            aum_pkr = EXCLUDED.aum_pkr,
            avg_annual_returns_pct = EXCLUDED.avg_annual_returns_pct,
            investment_strategy = EXCLUDED.investment_strategy,
            updated_at = NOW();
        
        RAISE NOTICE 'Asset management details updated for Coinbase';
    ELSE
        RAISE NOTICE 'asset_management_details table does not exist';
    END IF;
END $$;

-- Verification: Show what was inserted/updated
SELECT 
    'Final verification - Coinbase sector details:' as info,
    'Exchange Services' as sector,
    CASE WHEN EXISTS (SELECT 1 FROM exchange_services_details WHERE company_id = (SELECT id FROM vasp_companies WHERE slug = 'coinbase'))
         THEN 'Data exists' ELSE 'No data' END as status
UNION ALL
SELECT 
    'Final verification - Coinbase sector details:' as info,
    'Custody Services' as sector,
    CASE WHEN EXISTS (SELECT 1 FROM custody_services_details WHERE company_id = (SELECT id FROM vasp_companies WHERE slug = 'coinbase'))
         THEN 'Data exists' ELSE 'No data' END as status
UNION ALL
SELECT 
    'Final verification - Coinbase sector details:' as info,
    'Broker-Dealer Services' as sector,
    CASE WHEN EXISTS (SELECT 1 FROM broker_dealer_services_details WHERE company_id = (SELECT id FROM vasp_companies WHERE slug = 'coinbase'))
         THEN 'Data exists' ELSE 'No data' END as status
UNION ALL
SELECT 
    'Final verification - Coinbase sector details:' as info,
    'Asset Management' as sector,
    CASE WHEN EXISTS (SELECT 1 FROM asset_management_details WHERE company_id = (SELECT id FROM vasp_companies WHERE slug = 'coinbase'))
         THEN 'Data exists' ELSE 'No data' END as status;
