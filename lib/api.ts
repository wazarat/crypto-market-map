const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const USE_MOCK_DATA = !process.env.NEXT_PUBLIC_API_URL

export interface Company {
  id: string
  name: string
  slug: string
  logo_url?: string
  short_summary: string
  website?: string
}

export interface Sector {
  id: string
  name: string
  slug: string
  description?: string
  company_count: number
  companies: Company[]
}

export interface ResearchEntry {
  id: string
  title: string
  content: string
  source_url?: string
  updated_at: string
}

export interface CompanyDetail {
  id: string
  name: string
  slug: string
  logo_url?: string
  short_summary: string
  website?: string
  sector_name: string
}

// Mock data for demo purposes
const mockSectors: Sector[] = [
  {
    id: '1',
    name: 'Advisory Services',
    slug: 'advisory-services',
    description: 'Professional advisory and consulting services for virtual assets',
    company_count: 6,
    companies: [
      { id: '1', name: 'Deloitte Digital Assets', slug: 'deloitte-digital', short_summary: 'Enterprise blockchain and digital asset advisory', website: 'https://deloitte.com' },
      { id: '2', name: 'PwC Digital Assets', slug: 'pwc-digital', short_summary: 'Tax, regulatory, and strategic crypto advisory', website: 'https://pwc.com' },
      { id: '3', name: 'EY Blockchain', slug: 'ey-blockchain', short_summary: 'Enterprise blockchain solutions and advisory', website: 'https://ey.com' },
      { id: '4', name: 'KPMG Digital Assets', slug: 'kpmg-digital', short_summary: 'Audit and advisory for digital assets', website: 'https://kpmg.com' },
      { id: '5', name: 'ConsenSys', slug: 'consensys', short_summary: 'Ethereum ecosystem development and advisory', website: 'https://consensys.net' },
      { id: '6', name: 'Chainalysis', slug: 'chainalysis', short_summary: 'Blockchain analytics and compliance solutions', website: 'https://chainalysis.com' }
    ]
  },
  {
    id: '2',
    name: 'Broker-Dealer Services',
    slug: 'broker-dealer-services',
    description: 'Licensed broker-dealer services for virtual asset trading',
    company_count: 5,
    companies: [
      { id: '7', name: 'Robinhood Crypto', slug: 'robinhood-crypto', short_summary: 'Commission-free crypto trading platform', website: 'https://robinhood.com' },
      { id: '8', name: 'Interactive Brokers', slug: 'interactive-brokers', short_summary: 'Professional trading platform with crypto access', website: 'https://interactivebrokers.com' },
      { id: '9', name: 'Charles Schwab', slug: 'charles-schwab', short_summary: 'Traditional broker expanding into crypto', website: 'https://schwab.com' },
      { id: '10', name: 'Fidelity Digital Assets', slug: 'fidelity-digital', short_summary: 'Institutional crypto trading and custody', website: 'https://fidelitydigitalassets.com' },
      { id: '11', name: 'TradeStation Crypto', slug: 'tradestation-crypto', short_summary: 'Advanced crypto trading platform', website: 'https://tradestation.com' }
    ]
  },
  {
    id: '3',
    name: 'Custody Services',
    slug: 'custody-services',
    description: 'Secure storage and custody solutions for virtual assets',
    company_count: 7,
    companies: [
      { id: '12', name: 'Coinbase Custody', slug: 'coinbase-custody', short_summary: 'Institutional-grade crypto custody', website: 'https://custody.coinbase.com' },
      { id: '13', name: 'BitGo', slug: 'bitgo', short_summary: 'Multi-signature wallet and custody services', website: 'https://bitgo.com' },
      { id: '14', name: 'Fireblocks', slug: 'fireblocks', short_summary: 'Digital asset custody and transfer platform', website: 'https://fireblocks.com' },
      { id: '15', name: 'Anchorage Digital', slug: 'anchorage', short_summary: 'Federally chartered digital asset bank', website: 'https://anchorage.com' },
      { id: '16', name: 'Copper', slug: 'copper', short_summary: 'Institutional crypto custody and prime services', website: 'https://copper.co' },
      { id: '17', name: 'Gemini Custody', slug: 'gemini-custody', short_summary: 'Regulated crypto custody solutions', website: 'https://gemini.com' },
      { id: '18', name: 'Ledger Enterprise', slug: 'ledger-enterprise', short_summary: 'Hardware-based custody solutions', website: 'https://ledger.com' }
    ]
  },
  {
    id: '4',
    name: 'Exchange Services (Centralized)',
    slug: 'exchange-centralized',
    description: 'Centralized cryptocurrency exchanges and trading platforms',
    company_count: 8,
    companies: [
      { id: '19', name: 'Binance', slug: 'binance', short_summary: 'World\'s largest cryptocurrency exchange', website: 'https://binance.com' },
      { id: '20', name: 'Coinbase', slug: 'coinbase', logo_url: 'https://cryptologos.cc/logos/coinbase-coin-logo.png', short_summary: 'Leading US cryptocurrency exchange', website: 'https://coinbase.com' },
      { id: '21', name: 'Kraken', slug: 'kraken', short_summary: 'Secure cryptocurrency exchange', website: 'https://kraken.com' },
      { id: '22', name: 'Bitstamp', slug: 'bitstamp', short_summary: 'European cryptocurrency exchange', website: 'https://bitstamp.net' },
      { id: '23', name: 'Gemini', slug: 'gemini', short_summary: 'Regulated crypto exchange and custody', website: 'https://gemini.com' },
      { id: '24', name: 'KuCoin', slug: 'kucoin', short_summary: 'Global cryptocurrency exchange', website: 'https://kucoin.com' },
      { id: '25', name: 'Huobi', slug: 'huobi', short_summary: 'Global cryptocurrency exchange', website: 'https://huobi.com' },
      { id: '26', name: 'OKX', slug: 'okx', short_summary: 'Global crypto exchange and Web3 platform', website: 'https://okx.com' }
    ]
  },
  {
    id: '5',
    name: 'Exchange Services (Decentralized)',
    slug: 'exchange-decentralized',
    description: 'Decentralized exchanges and automated market makers',
    company_count: 6,
    companies: [
      { id: '27', name: 'Uniswap', slug: 'uniswap', logo_url: 'https://cryptologos.cc/logos/uniswap-uni-logo.png', short_summary: 'Leading decentralized exchange protocol', website: 'https://uniswap.org' },
      { id: '28', name: 'SushiSwap', slug: 'sushiswap', short_summary: 'Community-driven decentralized exchange', website: 'https://sushi.com' },
      { id: '29', name: 'PancakeSwap', slug: 'pancakeswap', short_summary: 'Leading DEX on Binance Smart Chain', website: 'https://pancakeswap.finance' },
      { id: '30', name: 'Curve Finance', slug: 'curve', short_summary: 'Decentralized exchange for stablecoins', website: 'https://curve.fi' },
      { id: '31', name: 'Balancer', slug: 'balancer', short_summary: 'Automated portfolio manager and DEX', website: 'https://balancer.fi' },
      { id: '32', name: '1inch', slug: 'oneinch', short_summary: 'DEX aggregator and liquidity protocol', website: 'https://1inch.io' }
    ]
  },
  {
    id: '6',
    name: 'Lending and Borrowing Services',
    slug: 'lending-borrowing',
    description: 'DeFi and CeFi lending, borrowing, and yield generation platforms',
    company_count: 7,
    companies: [
      { id: '33', name: 'Aave', slug: 'aave', logo_url: 'https://cryptologos.cc/logos/aave-aave-logo.png', short_summary: 'Decentralized lending protocol', website: 'https://aave.com' },
      { id: '34', name: 'Compound', slug: 'compound', short_summary: 'Algorithmic money markets protocol', website: 'https://compound.finance' },
      { id: '35', name: 'MakerDAO', slug: 'makerdao', short_summary: 'Decentralized lending and DAI stablecoin', website: 'https://makerdao.com' },
      { id: '36', name: 'BlockFi', slug: 'blockfi', short_summary: 'Crypto lending and interest accounts', website: 'https://blockfi.com' },
      { id: '37', name: 'Celsius', slug: 'celsius', short_summary: 'Crypto lending and borrowing platform', website: 'https://celsius.network' },
      { id: '38', name: 'Nexo', slug: 'nexo', short_summary: 'Instant crypto-backed loans', website: 'https://nexo.io' },
      { id: '39', name: 'Yearn Finance', slug: 'yearn', short_summary: 'Yield optimization protocol', website: 'https://yearn.finance' }
    ]
  },
  {
    id: '7',
    name: 'Virtual Asset Derivative Services',
    slug: 'derivatives',
    description: 'Futures, options, and derivative trading platforms',
    company_count: 5,
    companies: [
      { id: '40', name: 'CME Group', slug: 'cme-group', short_summary: 'Bitcoin and Ethereum futures trading', website: 'https://cmegroup.com' },
      { id: '41', name: 'Deribit', slug: 'deribit', short_summary: 'Bitcoin and Ethereum options exchange', website: 'https://deribit.com' },
      { id: '42', name: 'FTX Derivatives', slug: 'ftx-derivatives', short_summary: 'Crypto futures and options platform', website: 'https://ftx.com' },
      { id: '43', name: 'BitMEX', slug: 'bitmex', short_summary: 'Cryptocurrency derivatives exchange', website: 'https://bitmex.com' },
      { id: '44', name: 'Bybit', slug: 'bybit', short_summary: 'Crypto derivatives trading platform', website: 'https://bybit.com' }
    ]
  },
  {
    id: '8',
    name: 'Virtual Asset Management and Investment Services',
    slug: 'asset-management',
    description: 'Investment funds, ETFs, and asset management services',
    company_count: 6,
    companies: [
      { id: '45', name: 'Grayscale', slug: 'grayscale', short_summary: 'Digital asset investment products', website: 'https://grayscale.com' },
      { id: '46', name: 'BlackRock', slug: 'blackrock', short_summary: 'Bitcoin ETF and digital asset strategies', website: 'https://blackrock.com' },
      { id: '47', name: 'Bitwise', slug: 'bitwise', short_summary: 'Crypto index funds and ETFs', website: 'https://bitwiseinvestments.com' },
      { id: '48', name: 'Galaxy Digital', slug: 'galaxy-digital', short_summary: 'Digital asset investment management', website: 'https://galaxydigital.io' },
      { id: '49', name: 'Pantera Capital', slug: 'pantera', short_summary: 'Blockchain investment firm', website: 'https://panteracapital.com' },
      { id: '50', name: 'Coinshares', slug: 'coinshares', short_summary: 'Digital asset investment products', website: 'https://coinshares.com' }
    ]
  },
  {
    id: '9',
    name: 'Virtual Asset Transfer and Settlement Services',
    slug: 'transfer-settlement',
    description: 'Payment processing, remittance, and settlement services',
    company_count: 5,
    companies: [
      { id: '51', name: 'Ripple', slug: 'ripple', short_summary: 'Cross-border payment solutions', website: 'https://ripple.com' },
      { id: '52', name: 'Circle', slug: 'circle', short_summary: 'USDC stablecoin and payment infrastructure', website: 'https://circle.com' },
      { id: '53', name: 'Stellar', slug: 'stellar', short_summary: 'Cross-border payment network', website: 'https://stellar.org' },
      { id: '54', name: 'BitPay', slug: 'bitpay', short_summary: 'Bitcoin payment processing', website: 'https://bitpay.com' },
      { id: '55', name: 'Paxos', slug: 'paxos', short_summary: 'Blockchain infrastructure for payments', website: 'https://paxos.com' }
    ]
  },
  {
    id: '10',
    name: 'Fiat Referenced Token Issuance Services',
    slug: 'fiat-tokens',
    description: 'Stablecoins and fiat-backed digital currencies',
    company_count: 4,
    companies: [
      { id: '56', name: 'Tether', slug: 'tether', short_summary: 'USDT stablecoin issuer', website: 'https://tether.to' },
      { id: '57', name: 'Circle (USDC)', slug: 'circle-usdc', short_summary: 'USD Coin stablecoin issuer', website: 'https://centre.io' },
      { id: '58', name: 'Paxos (USDP)', slug: 'paxos-usdp', short_summary: 'Pax Dollar stablecoin issuer', website: 'https://paxos.com' },
      { id: '59', name: 'Gemini (GUSD)', slug: 'gemini-gusd', short_summary: 'Gemini Dollar stablecoin issuer', website: 'https://gemini.com' }
    ]
  },
  {
    id: '11',
    name: 'Asset Referenced Token Issuance Services',
    slug: 'asset-tokens',
    description: 'Tokenization of real-world assets and commodities',
    company_count: 4,
    companies: [
      { id: '60', name: 'Paxos Gold', slug: 'paxos-gold', short_summary: 'Gold-backed digital tokens', website: 'https://paxos.com' },
      { id: '61', name: 'Tether Gold', slug: 'tether-gold', short_summary: 'Gold-backed stablecoin', website: 'https://gold.tether.to' },
      { id: '62', name: 'Synthetix', slug: 'synthetix', short_summary: 'Synthetic asset protocol', website: 'https://synthetix.io' },
      { id: '63', name: 'Mirror Protocol', slug: 'mirror', short_summary: 'Synthetic stock tokens', website: 'https://mirror.finance' }
    ]
  }
]

const mockCompanyDetails: { [key: string]: CompanyDetail } = {
  'uniswap': {
    id: '27',
    name: 'Uniswap',
    slug: 'uniswap',
    logo_url: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
    short_summary: 'Uniswap is a decentralized trading protocol, known for its role in facilitating automated trading of decentralized finance (DeFi) tokens. Built on Ethereum, Uniswap uses automated market makers (AMMs) instead of traditional order books, enabling permissionless and non-custodial trading.',
    website: 'https://uniswap.org',
    sector_name: 'Exchange Services (Decentralized)'
  },
  'coinbase': {
    id: '20',
    name: 'Coinbase',
    slug: 'coinbase',
    logo_url: 'https://cryptologos.cc/logos/coinbase-coin-logo.png',
    short_summary: 'Coinbase is a leading cryptocurrency exchange platform that provides secure and compliant digital asset trading services. Founded in 2012, it serves both retail and institutional clients with a comprehensive suite of crypto financial services.',
    website: 'https://coinbase.com',
    sector_name: 'Exchange Services (Centralized)'
  },
  'aave': {
    id: '33',
    name: 'Aave',
    slug: 'aave',
    logo_url: 'https://cryptologos.cc/logos/aave-aave-logo.png',
    short_summary: 'Aave is a decentralized non-custodial liquidity protocol where users can participate as depositors or borrowers. It enables users to earn interest on deposits and borrow assets in an over-collateralized or under-collateralized fashion.',
    website: 'https://aave.com',
    sector_name: 'Lending and Borrowing Services'
  },
  'chainalysis': {
    id: '6',
    name: 'Chainalysis',
    slug: 'chainalysis',
    short_summary: 'Chainalysis provides blockchain analytics and compliance solutions for government agencies, exchanges, and financial institutions. Their platform helps organizations investigate cryptocurrency transactions and ensure regulatory compliance.',
    website: 'https://chainalysis.com',
    sector_name: 'Advisory Services'
  }
}

const mockResearch: { [key: string]: ResearchEntry[] } = {
  'uniswap': [
    {
      id: '1',
      title: 'Uniswap V4 Development Update',
      content: 'Uniswap V4 introduces hooks and singleton architecture, promising significant gas savings and enhanced customization for liquidity pools. The new version allows for custom pool logic and more efficient capital utilization.',
      source_url: 'https://blog.uniswap.org/uniswap-v4',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'DEX Market Share Analysis Q4 2023',
      content: 'Uniswap maintains its position as the leading decentralized exchange with over $4B in total value locked, representing approximately 60% of the DEX market share across all chains.',
      updated_at: '2024-01-10T14:30:00Z'
    }
  ],
  'coinbase': [
    {
      id: '3',
      title: 'Institutional Adoption Report',
      content: 'Coinbase reported a 40% increase in institutional trading volume in Q4 2023, with major corporations and pension funds entering the crypto market through their platform.',
      updated_at: '2024-01-12T09:15:00Z'
    },
    {
      id: '4',
      title: 'Regulatory Compliance Framework',
      content: 'Coinbase has implemented enhanced KYC/AML procedures and obtained additional licenses in key jurisdictions, positioning itself as a compliant gateway for traditional finance.',
      updated_at: '2024-01-08T16:45:00Z'
    }
  ],
  'aave': [
    {
      id: '5',
      title: 'Aave V3 Cross-Chain Expansion',
      content: 'Aave V3 has successfully deployed on multiple chains including Polygon, Avalanche, and Arbitrum, enabling cross-chain lending and borrowing with improved capital efficiency.',
      updated_at: '2024-01-14T11:20:00Z'
    },
    {
      id: '6',
      title: 'GHO Stablecoin Launch Analysis',
      content: 'The launch of GHO, Aave\'s native stablecoin, has added $500M in new borrowing capacity and strengthened the protocol\'s position in the DeFi lending market.',
      updated_at: '2024-01-11T13:30:00Z'
    }
  ],
  'chainalysis': [
    {
      id: '7',
      title: 'Crypto Crime Report 2024',
      content: 'Chainalysis reports that cryptocurrency-based crime fell to $20.1 billion in 2023, down from $39.6 billion in 2022, indicating improved compliance and monitoring across the industry.',
      updated_at: '2024-01-16T08:00:00Z'
    },
    {
      id: '8',
      title: 'Government Partnerships Expansion',
      content: 'Chainalysis has expanded partnerships with law enforcement agencies globally, providing blockchain analytics tools to over 70 government agencies across 40 countries.',
      updated_at: '2024-01-09T14:15:00Z'
    }
  ]
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string): Promise<T> {
    if (USE_MOCK_DATA) {
      // Return mock data instead of making HTTP requests
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
      return this.getMockData<T>(endpoint)
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`)
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }
    return response.json()
  }

  private getMockData<T>(endpoint: string): T {
    if (endpoint === '/sectors') {
      return mockSectors as T
    }
    
    if (endpoint.startsWith('/sectors/')) {
      const slug = endpoint.split('/')[2]
      const sector = mockSectors.find(s => s.slug === slug)
      if (!sector) throw new Error('Sector not found')
      return sector as T
    }
    
    if (endpoint.startsWith('/companies/') && endpoint.endsWith('/research')) {
      const slug = endpoint.split('/')[2]
      return (mockResearch[slug] || []) as T
    }
    
    if (endpoint.startsWith('/companies/')) {
      const slug = endpoint.split('/')[2]
      const company = mockCompanyDetails[slug]
      if (!company) {
        // Create a basic company detail from the sector data
        for (const sector of mockSectors) {
          const found = sector.companies.find(c => c.slug === slug)
          if (found) {
            return {
              ...found,
              sector_name: sector.name
            } as T
          }
        }
        throw new Error('Company not found')
      }
      return company as T
    }
    
    throw new Error('Mock endpoint not found')
  }

  async getSectors(): Promise<Sector[]> {
    return this.request<Sector[]>('/sectors')
  }

  async getSector(slug: string): Promise<Sector> {
    return this.request<Sector>(`/sectors/${slug}`)
  }

  async getCompany(slug: string): Promise<CompanyDetail> {
    return this.request<CompanyDetail>(`/companies/${slug}`)
  }

  async getCompanyResearch(slug: string): Promise<ResearchEntry[]> {
    return this.request<ResearchEntry[]>(`/companies/${slug}/research`)
  }
}

export const apiClient = new ApiClient()
