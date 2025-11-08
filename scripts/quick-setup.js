// Quick setup script for Pakistan VASP database
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log('🇵🇰 Setting up Pakistan VASP Database...')
  
  try {
    // Create categories table and insert data
    console.log('📊 Creating categories...')
    
    const { error: categoriesError } = await supabase
      .from('vasp_categories')
      .upsert([
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'Advisory Services',
          slug: 'advisory-services',
          description: 'Professional advisory and consulting services for virtual assets',
          regulatory_requirements: ['PVARA License', 'Fit and Proper Assessment', 'Capital Requirements']
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          name: 'Broker-Dealer Services',
          slug: 'broker-dealer-services',
          description: 'Licensed broker-dealer services for virtual asset trading',
          regulatory_requirements: ['PVARA License', 'Capital Adequacy', 'Customer Protection']
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440004',
          name: 'Exchange Services',
          slug: 'exchange-services',
          description: 'Centralized and decentralized cryptocurrency exchanges and trading platforms',
          regulatory_requirements: ['PVARA License', 'Market Surveillance', 'AML/CFT Compliance']
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440007',
          name: 'Virtual Asset Management and Investment Services',
          slug: 'asset-management',
          description: 'Investment funds, ETFs, and asset management services',
          regulatory_requirements: ['PVARA License', 'Fund Management Rules', 'Investor Protection']
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440008',
          name: 'Virtual Asset Transfer and Settlement Services',
          slug: 'transfer-settlement',
          description: 'Payment processing, remittance, and settlement services',
          regulatory_requirements: ['PVARA License', 'Payment System Rules', 'Cross-border Compliance']
        }
      ])

    if (categoriesError) {
      console.log('ℹ️  Categories may already exist:', categoriesError.message)
    } else {
      console.log('✅ Categories created successfully')
    }

    // Create sample companies
    console.log('🏢 Creating sample companies...')
    
    const { error: companiesError } = await supabase
      .from('vasp_companies')
      .upsert([
        {
          id: '650e8400-e29b-41d4-a716-446655440001',
          name: 'Tez Financial Services',
          slug: 'tez-financial',
          category_id: '550e8400-e29b-41d4-a716-446655440008',
          year_founded: 2016,
          founder_ceo_name: 'Irfan Wahab Khan (CEO)',
          headquarters_location: 'Islamabad, Pakistan',
          pakistan_operations: true,
          website: 'https://www.telenor.com.pk/tez',
          contact_email: 'support@tez.pk',
          contact_phone: '+92-51-111-345-100',
          employee_count: 150,
          total_funding_pkr: 2500000000,
          key_partnerships: ['Telenor Pakistan', 'State Bank of Pakistan', 'National Bank of Pakistan'],
          company_description: 'Leading mobile financial services provider in Pakistan offering digital payments, money transfers, and remittance services through mobile wallets.',
          twitter_handle: '@TezPakistan',
          linkedin_url: 'https://linkedin.com/company/tez-pakistan',
          secp_registration_number: 'SECP-2016-TEZ-001',
          license_status: 'Applied',
          paid_up_capital_pkr: 1000000000,
          capital_adequacy_ratio: 15.5,
          number_of_directors: 7,
          director_experience_years: 12,
          fit_and_proper_compliance: true,
          fit_and_proper_details: 'All directors have passed SBP fit and proper criteria for payment system operators',
          annual_supervisory_fee_status: 'Paid',
          customer_asset_segregation_policy: 'Customer funds are segregated in separate escrow accounts with partner banks as per SBP guidelines',
          aml_cft_compliance_rating: 'High',
          market_share_estimate: '25% of digital payments market in Pakistan',
          user_base_estimate: '10 million active users',
          regulatory_compliance_status: 'Fully compliant with SBP Payment System Regulations, PVARA license application submitted November 2025'
        },
        {
          id: '650e8400-e29b-41d4-a716-446655440006',
          name: 'Binance',
          slug: 'binance',
          category_id: '550e8400-e29b-41d4-a716-446655440004',
          year_founded: 2017,
          founder_ceo_name: 'Richard Teng (Current CEO)',
          headquarters_location: 'Dubai, UAE (Pakistan Operations: Karachi)',
          pakistan_operations: true,
          website: 'https://www.binance.com',
          contact_email: 'support@binance.com',
          contact_phone: '+971-4-000-0000',
          employee_count: 8000,
          total_funding_pkr: null,
          key_partnerships: ['Various Pakistani Payment Providers', 'Local Banks for P2P'],
          company_description: 'World\'s largest cryptocurrency exchange by trading volume, serving Pakistani users through P2P trading and international services.',
          twitter_handle: '@binance',
          linkedin_url: 'https://linkedin.com/company/binance',
          secp_registration_number: null,
          license_status: 'None',
          paid_up_capital_pkr: null,
          capital_adequacy_ratio: null,
          number_of_directors: null,
          director_experience_years: null,
          fit_and_proper_compliance: null,
          fit_and_proper_details: 'Not applicable - international exchange',
          annual_supervisory_fee_status: 'N/A',
          customer_asset_segregation_policy: 'SAFU fund and segregated customer assets as per international standards',
          aml_cft_compliance_rating: 'High',
          market_share_estimate: '60% of Pakistani crypto trading volume (estimated)',
          user_base_estimate: '2+ million Pakistani users (estimated)',
          regulatory_compliance_status: 'Operating internationally, no Pakistan-specific license. Users access via P2P and international platform'
        }
      ])

    if (companiesError) {
      console.log('ℹ️  Companies may already exist:', companiesError.message)
    } else {
      console.log('✅ Companies created successfully')
    }

    // Test the connection
    console.log('🔍 Testing database connection...')
    const { data: categories, error: testError } = await supabase
      .from('vasp_categories')
      .select('*')
      .limit(5)

    if (testError) {
      console.error('❌ Database test failed:', testError)
    } else {
      console.log('✅ Database connection successful!')
      console.log(`📊 Found ${categories.length} categories`)
    }

    console.log('\n🎉 Pakistan VASP Database setup complete!')
    console.log('🚀 You can now run: npm run dev')
    
  } catch (error) {
    console.error('❌ Setup failed:', error)
  }
}

setupDatabase()
