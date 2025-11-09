// Enhanced Company Data Structure for Pakistan VASP Regulations 2025

export interface BaseCompany {
  // Basic Information
  id: string
  name: string
  slug: string
  category_id: string
  sectors: string[] // Multiple sectors support
  
  // Company Details
  year_founded: number | null
  founder_ceo_name: string | null
  headquarters_location: string
  pakistan_operations: boolean
  website: string | null
  contact_email: string | null
  contact_phone: string | null
  point_of_contact_email: string | null
  point_of_contact_phone: string | null
  employee_count: number | null
  total_funding_pkr: number | null
  
  // Business Information
  key_partnerships: string[]
  company_description: string
  company_overview: string | null
  logo_url: string | null
  
  // Social Media
  twitter_handle: string | null
  linkedin_url: string | null
  social_media_twitter: string | null
  social_media_linkedin: string | null
  social_media_facebook: string | null
  
  // Regulatory Information (Pakistan Specific)
  secp_registration_number: string | null
  pvara_license_number: string | null
  license_status: 'Applied' | 'Granted' | 'Suspended' | 'None' | 'Under Review'
  verification_status: 'Pending' | 'Verified' | 'Rejected' | 'Under Review'
  paid_up_capital_pkr: number | null
  capital_adequacy_ratio: number | null
  number_of_directors: number | null
  director_experience_years: number | null
  fit_and_proper_compliance: boolean | null
  fit_and_proper_details: string | null
  annual_supervisory_fee_status: 'Paid' | 'Pending' | 'Overdue' | 'N/A'
  customer_asset_segregation_policy: string | null
  aml_cft_compliance_rating: 'High' | 'Medium' | 'Low' | 'Not Assessed'
  
  // Market Information
  market_share_estimate: string | null
  user_base_estimate: string | null
  regulatory_compliance_status: string
  
  // Audit fields
  last_updated_by: string | null
  
  created_at: string
  updated_at: string
}

// Sector-Specific Interfaces

export interface AdvisoryServicesDetails {
  company_id: string
  advisory_focus_areas: string[]
  client_type: 'Retail' | 'Institutional' | 'VASPs' | 'Mixed'
  advisory_reports_last_year: number | null
}

export interface BrokerDealerDetails {
  company_id: string
  trading_platforms_supported: string[]
  asset_types_handled: string[]
  annual_transaction_volume_pkr: number | null
}

export interface CustodyServicesDetails {
  company_id: string
  custody_type: string[]
  insurance_coverage: boolean
  insurance_amount_pkr: number | null
  audit_frequency: string
}

export interface ExchangeServicesDetails {
  company_id: string
  exchange_type: 'Centralized' | 'Decentralized' | 'Hybrid'
  supported_trading_pairs: string[]
  daily_trading_volume_pkr: number | null
}

export interface LendingBorrowingDetails {
  company_id: string
  lending_type: string[]
  average_interest_rate: number | null
  collateral_requirements: string
}

export interface DerivativesDetails {
  company_id: string
  derivatives_types: string[]
  leverage_levels: string[]
  settlement_mechanism: string
}

export interface AssetManagementDetails {
  company_id: string
  investment_products: string[]
  aum_pkr: number | null
  annual_returns_percentage: number | null
}

export interface TransferSettlementDetails {
  company_id: string
  transfer_types: string[]
  settlement_speed: string
  supported_networks: string[]
}

export interface AssetReferencedTokenDetails {
  company_id: string
  backing_assets: string[]
  reserve_audit_frequency: string
  total_token_supply: string | null
}

export interface FiatReferencedTokenDetails {
  company_id: string
  fiat_backing: string[]
  peg_mechanism: string
  redemption_policy: string
}

export interface VASPCategory {
  id: string
  name: string
  slug: string
  description: string
  regulatory_requirements: string[]
}

// Sample enhanced company data structure
export const enhancedCompanyData: BaseCompany[] = [
  {
    id: '1',
    name: 'Tez Financial Services',
    slug: 'tez-financial',
    category_id: '8', // Transfer and Settlement
    sectors: ['transfer-settlement'],
    year_founded: 2016,
    founder_ceo_name: 'Telenor Pakistan',
    headquarters_location: 'Islamabad, Pakistan',
    pakistan_operations: true,
    website: 'https://www.telenor.com.pk/tez',
    contact_email: 'support@tez.pk',
    contact_phone: '+92-345-0000000',
    point_of_contact_email: 'business@tez.pk',
    point_of_contact_phone: '+92-51-111-345-100',
    employee_count: 150,
    total_funding_pkr: 2500000000, // 2.5 billion PKR
    key_partnerships: ['Telenor Pakistan', 'State Bank of Pakistan', 'Various Banks'],
    company_description: 'Leading mobile financial services provider in Pakistan offering digital payments and remittance services.',
    company_overview: 'Tez Financial Services is Pakistan\'s leading mobile financial services provider, offering comprehensive digital payment solutions including P2P transfers, bill payments, merchant payments, and international remittances through a secure mobile wallet platform.',
    logo_url: null,
    twitter_handle: '@TezPakistan',
    linkedin_url: 'https://linkedin.com/company/tez-pakistan',
    social_media_twitter: '@TezPakistan',
    social_media_linkedin: 'https://linkedin.com/company/tez-pakistan',
    social_media_facebook: 'https://facebook.com/TezPakistan',
    secp_registration_number: 'SECP-2016-001',
    pvara_license_number: null,
    license_status: 'Applied',
    verification_status: 'Under Review',
    paid_up_capital_pkr: 1000000000,
    capital_adequacy_ratio: 15.5,
    number_of_directors: 7,
    director_experience_years: 12,
    fit_and_proper_compliance: true,
    fit_and_proper_details: 'All directors have passed SBP fit and proper criteria',
    annual_supervisory_fee_status: 'Paid',
    customer_asset_segregation_policy: 'Customer funds are segregated in separate accounts with partner banks',
    aml_cft_compliance_rating: 'High',
    market_share_estimate: '25% of digital payments market in Pakistan',
    user_base_estimate: '10 million active users',
    regulatory_compliance_status: 'Fully compliant with SBP regulations, applying for PVARA license',
    last_updated_by: 'admin@pakistancrypto.council',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-11-08T00:00:00Z'
  }
  // More companies will be added...
]

export const vaspCategories: VASPCategory[] = [
  {
    id: '1',
    name: 'Advisory Services',
    slug: 'advisory-services',
    description: 'Professional advisory and consulting services for virtual assets',
    regulatory_requirements: ['PVARA License', 'Fit and Proper Assessment', 'Capital Requirements']
  },
  {
    id: '2',
    name: 'Broker-Dealer Services',
    slug: 'broker-dealer-services',
    description: 'Licensed broker-dealer services for virtual asset trading',
    regulatory_requirements: ['PVARA License', 'Capital Adequacy', 'Customer Protection']
  },
  {
    id: '3',
    name: 'Custody Services',
    slug: 'custody-services',
    description: 'Secure storage and custody solutions for virtual assets',
    regulatory_requirements: ['PVARA License', 'Insurance Requirements', 'Segregation of Assets']
  },
  {
    id: '4',
    name: 'Exchange Services',
    slug: 'exchange-services',
    description: 'Centralized and decentralized cryptocurrency exchanges and trading platforms',
    regulatory_requirements: ['PVARA License', 'Market Surveillance', 'AML/CFT Compliance']
  },
  {
    id: '5',
    name: 'Lending and Borrowing Services',
    slug: 'lending-borrowing',
    description: 'DeFi and CeFi lending, borrowing, and yield generation platforms',
    regulatory_requirements: ['PVARA License', 'Risk Management', 'Disclosure Requirements']
  },
  {
    id: '6',
    name: 'Virtual Asset Derivative Services',
    slug: 'derivatives',
    description: 'Futures, options, and derivative trading platforms',
    regulatory_requirements: ['PVARA License', 'Risk Controls', 'Position Limits']
  },
  {
    id: '7',
    name: 'Virtual Asset Management and Investment Services',
    slug: 'asset-management',
    description: 'Investment funds, ETFs, and asset management services',
    regulatory_requirements: ['PVARA License', 'Fund Management Rules', 'Investor Protection']
  },
  {
    id: '8',
    name: 'Virtual Asset Transfer and Settlement Services',
    slug: 'transfer-settlement',
    description: 'Payment processing, remittance, and settlement services',
    regulatory_requirements: ['PVARA License', 'Payment System Rules', 'Cross-border Compliance']
  },
  {
    id: '9',
    name: 'Fiat Referenced Token Issuance Services',
    slug: 'fiat-tokens',
    description: 'Stablecoins and fiat-backed digital currencies',
    regulatory_requirements: ['PVARA License', 'Reserve Requirements', 'Audit and Reporting']
  },
  {
    id: '10',
    name: 'Asset Referenced Token Issuance Services',
    slug: 'asset-tokens',
    description: 'Tokenization of real-world assets and commodities',
    regulatory_requirements: ['PVARA License', 'Asset Backing Verification', 'Transparency Requirements']
  }
]
