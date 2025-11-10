-- Fix custody_services_details table by adding missing columns
-- This script will add any missing columns that the Coinbase insert script expects

-- Add custody_type column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'custody_services_details' 
        AND column_name = 'custody_type'
    ) THEN
        ALTER TABLE custody_services_details 
        ADD COLUMN custody_type TEXT[];
        RAISE NOTICE 'Added custody_type column to custody_services_details';
    ELSE
        RAISE NOTICE 'custody_type column already exists';
    END IF;
END $$;

-- Add insurance_coverage column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'custody_services_details' 
        AND column_name = 'insurance_coverage'
    ) THEN
        ALTER TABLE custody_services_details 
        ADD COLUMN insurance_coverage BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added insurance_coverage column to custody_services_details';
    ELSE
        RAISE NOTICE 'insurance_coverage column already exists';
    END IF;
END $$;

-- Add insurance_amount_pkr column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'custody_services_details' 
        AND column_name = 'insurance_amount_pkr'
    ) THEN
        ALTER TABLE custody_services_details 
        ADD COLUMN insurance_amount_pkr BIGINT;
        RAISE NOTICE 'Added insurance_amount_pkr column to custody_services_details';
    ELSE
        RAISE NOTICE 'insurance_amount_pkr column already exists';
    END IF;
END $$;

-- Add audit_frequency column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'custody_services_details' 
        AND column_name = 'audit_frequency'
    ) THEN
        ALTER TABLE custody_services_details 
        ADD COLUMN audit_frequency VARCHAR(50);
        RAISE NOTICE 'Added audit_frequency column to custody_services_details';
    ELSE
        RAISE NOTICE 'audit_frequency column already exists';
    END IF;
END $$;

-- Also fix exchange_services_details table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'exchange_services_details' 
        AND column_name = 'order_types_supported'
    ) THEN
        ALTER TABLE exchange_services_details 
        ADD COLUMN order_types_supported TEXT[];
        RAISE NOTICE 'Added order_types_supported column to exchange_services_details';
    ELSE
        RAISE NOTICE 'order_types_supported column already exists';
    END IF;
END $$;

-- Fix broker_dealer_details table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'broker_dealer_details' 
        AND column_name = 'trading_platforms_supported'
    ) THEN
        ALTER TABLE broker_dealer_details 
        ADD COLUMN trading_platforms_supported TEXT[];
        RAISE NOTICE 'Added trading_platforms_supported column to broker_dealer_details';
    ELSE
        RAISE NOTICE 'trading_platforms_supported column already exists';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'broker_dealer_details' 
        AND column_name = 'asset_types_handled'
    ) THEN
        ALTER TABLE broker_dealer_details 
        ADD COLUMN asset_types_handled TEXT[];
        RAISE NOTICE 'Added asset_types_handled column to broker_dealer_details';
    ELSE
        RAISE NOTICE 'asset_types_handled column already exists';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'broker_dealer_details' 
        AND column_name = 'annual_transaction_volume_pkr'
    ) THEN
        ALTER TABLE broker_dealer_details 
        ADD COLUMN annual_transaction_volume_pkr BIGINT;
        RAISE NOTICE 'Added annual_transaction_volume_pkr column to broker_dealer_details';
    ELSE
        RAISE NOTICE 'annual_transaction_volume_pkr column already exists';
    END IF;
END $$;

-- Show the final structure
SELECT 
    'Final custody_services_details structure:' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'custody_services_details'
ORDER BY ordinal_position;
