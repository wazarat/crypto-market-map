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
    name: 'DeFi',
    slug: 'defi',
    description: 'Decentralized Finance protocols and applications',
    company_count: 8,
    companies: [
      { id: '1', name: 'Uniswap', slug: 'uniswap', logo_url: 'https://cryptologos.cc/logos/uniswap-uni-logo.png', short_summary: 'Leading decentralized exchange protocol', website: 'https://uniswap.org' },
      { id: '2', name: 'Aave', slug: 'aave', logo_url: 'https://cryptologos.cc/logos/aave-aave-logo.png', short_summary: 'Decentralized lending protocol', website: 'https://aave.com' },
      { id: '3', name: 'Compound', slug: 'compound', short_summary: 'Algorithmic money markets protocol', website: 'https://compound.finance' },
      { id: '4', name: 'MakerDAO', slug: 'makerdao', short_summary: 'Decentralized autonomous organization behind DAI stablecoin', website: 'https://makerdao.com' },
      { id: '5', name: 'Curve', slug: 'curve', short_summary: 'Decentralized exchange for stablecoins', website: 'https://curve.fi' },
      { id: '6', name: 'SushiSwap', slug: 'sushiswap', short_summary: 'Community-driven decentralized exchange', website: 'https://sushi.com' },
      { id: '7', name: 'Yearn Finance', slug: 'yearn', short_summary: 'Yield optimization protocol', website: 'https://yearn.finance' },
      { id: '8', name: 'Synthetix', slug: 'synthetix', short_summary: 'Synthetic asset protocol', website: 'https://synthetix.io' }
    ]
  },
  {
    id: '2',
    name: 'Layer 1 Blockchains',
    slug: 'layer1',
    description: 'Base layer blockchain protocols and networks',
    company_count: 6,
    companies: [
      { id: '9', name: 'Ethereum', slug: 'ethereum', logo_url: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', short_summary: 'Leading smart contract platform', website: 'https://ethereum.org' },
      { id: '10', name: 'Solana', slug: 'solana', logo_url: 'https://cryptologos.cc/logos/solana-sol-logo.png', short_summary: 'High-performance blockchain for DeFi and Web3', website: 'https://solana.com' },
      { id: '11', name: 'Cardano', slug: 'cardano', short_summary: 'Research-driven blockchain platform', website: 'https://cardano.org' },
      { id: '12', name: 'Polkadot', slug: 'polkadot', short_summary: 'Multi-chain protocol for interoperability', website: 'https://polkadot.network' },
      { id: '13', name: 'Avalanche', slug: 'avalanche', short_summary: 'Platform for decentralized applications and custom blockchains', website: 'https://avax.network' },
      { id: '14', name: 'Near Protocol', slug: 'near', short_summary: 'Developer-friendly blockchain platform', website: 'https://near.org' }
    ]
  },
  {
    id: '3',
    name: 'Layer 2 Solutions',
    slug: 'layer2',
    description: 'Scaling solutions for blockchain networks',
    company_count: 5,
    companies: [
      { id: '15', name: 'Polygon', slug: 'polygon', logo_url: 'https://cryptologos.cc/logos/polygon-matic-logo.png', short_summary: 'Ethereum scaling and infrastructure development', website: 'https://polygon.technology' },
      { id: '16', name: 'Arbitrum', slug: 'arbitrum', short_summary: 'Optimistic rollup scaling solution', website: 'https://arbitrum.io' },
      { id: '17', name: 'Optimism', slug: 'optimism', short_summary: 'Ethereum Layer 2 scaling solution', website: 'https://optimism.io' },
      { id: '18', name: 'StarkWare', slug: 'starkware', short_summary: 'Zero-knowledge proof scaling solutions', website: 'https://starkware.co' },
      { id: '19', name: 'Immutable X', slug: 'immutable', short_summary: 'NFT-focused Layer 2 solution', website: 'https://immutable.com' }
    ]
  },
  {
    id: '4',
    name: 'NFT & Gaming',
    slug: 'nft-gaming',
    description: 'Non-fungible tokens and blockchain gaming platforms',
    company_count: 6,
    companies: [
      { id: '20', name: 'OpenSea', slug: 'opensea', short_summary: 'Leading NFT marketplace', website: 'https://opensea.io' },
      { id: '21', name: 'Axie Infinity', slug: 'axie', short_summary: 'Play-to-earn blockchain game', website: 'https://axieinfinity.com' },
      { id: '22', name: 'The Sandbox', slug: 'sandbox', short_summary: 'Virtual world and gaming ecosystem', website: 'https://sandbox.game' },
      { id: '23', name: 'Decentraland', slug: 'decentraland', short_summary: 'Virtual reality platform powered by Ethereum', website: 'https://decentraland.org' },
      { id: '24', name: 'Dapper Labs', slug: 'dapper', short_summary: 'Creator of NBA Top Shot and Flow blockchain', website: 'https://dapperlabs.com' },
      { id: '25', name: 'Sorare', slug: 'sorare', short_summary: 'Fantasy football NFT game', website: 'https://sorare.com' }
    ]
  },
  {
    id: '5',
    name: 'Infrastructure',
    slug: 'infrastructure',
    description: 'Blockchain infrastructure and developer tools',
    company_count: 7,
    companies: [
      { id: '26', name: 'Chainlink', slug: 'chainlink', logo_url: 'https://cryptologos.cc/logos/chainlink-link-logo.png', short_summary: 'Decentralized oracle network', website: 'https://chain.link' },
      { id: '27', name: 'Infura', slug: 'infura', short_summary: 'Ethereum API and IPFS infrastructure', website: 'https://infura.io' },
      { id: '28', name: 'Alchemy', slug: 'alchemy', short_summary: 'Blockchain developer platform', website: 'https://alchemy.com' },
      { id: '29', name: 'The Graph', slug: 'thegraph', short_summary: 'Indexing protocol for querying blockchain data', website: 'https://thegraph.com' },
      { id: '30', name: 'Moralis', slug: 'moralis', short_summary: 'Web3 development platform', website: 'https://moralis.io' },
      { id: '31', name: 'QuickNode', slug: 'quicknode', short_summary: 'Blockchain infrastructure provider', website: 'https://quicknode.com' },
      { id: '32', name: 'Ankr', slug: 'ankr', short_summary: 'Decentralized Web3 infrastructure', website: 'https://ankr.com' }
    ]
  },
  {
    id: '6',
    name: 'Centralized Exchanges',
    slug: 'cex',
    description: 'Centralized cryptocurrency exchanges and trading platforms',
    company_count: 5,
    companies: [
      { id: '33', name: 'Binance', slug: 'binance', short_summary: 'World\'s largest cryptocurrency exchange', website: 'https://binance.com' },
      { id: '34', name: 'Coinbase', slug: 'coinbase', short_summary: 'Leading US cryptocurrency exchange', website: 'https://coinbase.com' },
      { id: '35', name: 'FTX', slug: 'ftx', short_summary: 'Cryptocurrency derivatives exchange', website: 'https://ftx.com' },
      { id: '36', name: 'Kraken', slug: 'kraken', short_summary: 'Secure cryptocurrency exchange', website: 'https://kraken.com' },
      { id: '37', name: 'Huobi', slug: 'huobi', short_summary: 'Global cryptocurrency exchange', website: 'https://huobi.com' }
    ]
  }
]

const mockCompanyDetails: { [key: string]: CompanyDetail } = {
  'uniswap': {
    id: '1',
    name: 'Uniswap',
    slug: 'uniswap',
    logo_url: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
    short_summary: 'Uniswap is a decentralized trading protocol, known for its role in facilitating automated trading of decentralized finance (DeFi) tokens. Built on Ethereum, Uniswap uses automated market makers (AMMs) instead of traditional order books.',
    website: 'https://uniswap.org',
    sector_name: 'DeFi'
  },
  'ethereum': {
    id: '9',
    name: 'Ethereum',
    slug: 'ethereum',
    logo_url: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    short_summary: 'Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether (ETH) is the native cryptocurrency of the platform and serves as the foundation for thousands of decentralized applications.',
    website: 'https://ethereum.org',
    sector_name: 'Layer 1 Blockchains'
  }
}

const mockResearch: { [key: string]: ResearchEntry[] } = {
  'uniswap': [
    {
      id: '1',
      title: 'Uniswap V4 Development Update',
      content: 'Uniswap V4 introduces hooks and singleton architecture, promising significant gas savings and enhanced customization for liquidity pools.',
      source_url: 'https://blog.uniswap.org/uniswap-v4',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'TVL Analysis Q4 2023',
      content: 'Uniswap maintains its position as the leading DEX with over $4B in total value locked, representing 60% of the DEX market share.',
      updated_at: '2024-01-10T14:30:00Z'
    }
  ],
  'ethereum': [
    {
      id: '3',
      title: 'Ethereum 2.0 Staking Rewards',
      content: 'Post-merge Ethereum staking yields have stabilized around 4-6% APR, with over 25 million ETH now staked securing the network.',
      updated_at: '2024-01-12T09:15:00Z'
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
