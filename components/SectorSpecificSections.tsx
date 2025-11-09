'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Shield, Users, DollarSign, Clock, Database, Briefcase, Globe, Coins, Building } from 'lucide-react'

interface SectorSpecificData {
  [sectorSlug: string]: any
}

interface SectorSpecificSectionsProps {
  selectedSectors: string[]
  data: SectorSpecificData
  onChange: (sectorSlug: string, field: string, value: any) => void
}

const SECTOR_CONFIGS = {
  'advisory-services': {
    title: 'Advisory Services Details',
    icon: Briefcase,
    fields: [
      {
        key: 'advisory_focus_areas',
        label: 'Advisory Focus Areas',
        type: 'multi-select',
        options: [
          'Consulting on Virtual Assets',
          'Risk Management',
          'Compliance Advice',
          'PVARA License Assistance',
          'Blockchain Implementation',
          'Regulatory Strategy',
          'Due Diligence',
          'Market Analysis'
        ],
        description: 'Select all areas of advisory expertise'
      },
      {
        key: 'client_type',
        label: 'Primary Client Type',
        type: 'select',
        options: ['Retail', 'Institutional', 'VASPs', 'Mixed'],
        description: 'Main type of clients served'
      },
      {
        key: 'advisory_reports_last_year',
        label: 'Advisory Reports/Memoranda (Last Year)',
        type: 'number',
        description: 'Number of advisory reports or memoranda distributed in the last year'
      }
    ]
  },
  'broker-dealer-services': {
    title: 'Broker-Dealer Services Details',
    icon: TrendingUp,
    fields: [
      {
        key: 'trading_platforms_supported',
        label: 'Trading Platforms Supported',
        type: 'multi-select',
        options: [
          'Spot Trading',
          'Margin Trading',
          'Futures Trading',
          'Options Trading',
          'Web Platform',
          'Mobile App',
          'API Trading',
          'Algorithmic Trading'
        ],
        description: 'Select all supported trading platforms and methods'
      },
      {
        key: 'asset_types_handled',
        label: 'Asset Types Handled',
        type: 'multi-select',
        options: [
          'Bitcoin (BTC)',
          'Ethereum (ETH)',
          'Major Altcoins',
          'Stablecoins',
          'DeFi Tokens',
          'NFTs',
          'Tokenized Securities',
          'Derivatives'
        ],
        description: 'Types of digital assets handled'
      },
      {
        key: 'annual_transaction_volume_pkr',
        label: 'Annual Transaction Volume (PKR)',
        type: 'number',
        description: 'Total annual transaction volume in Pakistani Rupees'
      }
    ]
  },
  'custody-services': {
    title: 'Custody Services Details',
    icon: Shield,
    fields: [
      {
        key: 'custody_type',
        label: 'Custody Types Offered',
        type: 'multi-select',
        options: [
          'Hot Wallet Storage',
          'Cold Storage',
          'Multi-Signature Wallets',
          'Hardware Security Modules',
          'Institutional Custody',
          'Self-Custody Solutions',
          'Hybrid Solutions'
        ],
        description: 'Types of custody solutions provided'
      },
      {
        key: 'insurance_coverage',
        label: 'Insurance Coverage',
        type: 'boolean',
        description: 'Does the service include insurance coverage for custodied assets?'
      },
      {
        key: 'insurance_amount_pkr',
        label: 'Insurance Coverage Amount (PKR)',
        type: 'number',
        description: 'Total insurance coverage amount in Pakistani Rupees',
        conditional: 'insurance_coverage'
      },
      {
        key: 'audit_frequency',
        label: 'Audit Frequency for Custodied Assets',
        type: 'select',
        options: ['Monthly', 'Quarterly', 'Semi-Annually', 'Annually', 'Continuous', 'On-Demand'],
        description: 'How frequently are custodied assets audited?'
      }
    ]
  },
  'exchange-services': {
    title: 'Exchange Services Details',
    icon: Globe,
    fields: [
      {
        key: 'exchange_type',
        label: 'Exchange Type',
        type: 'select',
        options: ['Centralized', 'Decentralized', 'Hybrid'],
        description: 'Primary type of exchange operation'
      },
      {
        key: 'supported_trading_pairs',
        label: 'Supported Trading Pairs',
        type: 'multi-input',
        placeholder: 'e.g., BTC/PKR, ETH/USDT',
        description: 'List all supported trading pairs'
      },
      {
        key: 'daily_trading_volume_pkr',
        label: 'Daily Trading Volume (PKR)',
        type: 'number',
        description: 'Average daily trading volume in Pakistani Rupees'
      },
      {
        key: 'order_types_supported',
        label: 'Order Types Supported',
        type: 'multi-select',
        options: [
          'Market Orders',
          'Limit Orders',
          'Stop-Loss Orders',
          'Take-Profit Orders',
          'Trailing Stop',
          'Fill or Kill',
          'Immediate or Cancel'
        ],
        description: 'Types of trading orders supported'
      }
    ]
  },
  'lending-borrowing': {
    title: 'Lending and Borrowing Services Details',
    icon: DollarSign,
    fields: [
      {
        key: 'lending_type',
        label: 'Lending Types Offered',
        type: 'multi-select',
        options: [
          'DeFi Lending',
          'CeFi Lending',
          'Yield Generation',
          'Liquidity Mining',
          'Staking Services',
          'Peer-to-Peer Lending',
          'Institutional Lending'
        ],
        description: 'Types of lending and borrowing services'
      },
      {
        key: 'average_interest_rate',
        label: 'Average Interest/Yield Rate (%)',
        type: 'number',
        step: '0.01',
        description: 'Average annual interest or yield rate offered'
      },
      {
        key: 'collateral_requirements',
        label: 'Collateral Requirements',
        type: 'select',
        options: [
          'Over-Collateralized (>100%)',
          'Fully Collateralized (100%)',
          'Under-Collateralized (<100%)',
          'Uncollateralized',
          'Variable Based on Risk'
        ],
        description: 'Typical collateral requirements for lending'
      }
    ]
  },
  'derivatives': {
    title: 'Virtual Asset Derivatives Details',
    icon: TrendingUp,
    fields: [
      {
        key: 'derivatives_types',
        label: 'Derivatives Types Offered',
        type: 'multi-select',
        options: [
          'Futures Contracts',
          'Options Contracts',
          'Perpetual Swaps',
          'Interest Rate Swaps',
          'Currency Swaps',
          'Credit Default Swaps',
          'Synthetic Assets'
        ],
        description: 'Types of derivative instruments offered'
      },
      {
        key: 'leverage_levels',
        label: 'Leverage Levels Supported',
        type: 'multi-select',
        options: ['2x', '5x', '10x', '20x', '50x', '100x', 'Custom'],
        description: 'Available leverage multipliers'
      },
      {
        key: 'settlement_mechanism',
        label: 'Settlement Mechanism',
        type: 'select',
        options: [
          'Cash-Settled',
          'Physically Delivered',
          'Net Settlement',
          'Gross Settlement',
          'T+0 Settlement',
          'T+1 Settlement'
        ],
        description: 'How derivatives contracts are settled'
      }
    ]
  },
  'asset-management': {
    title: 'Asset Management and Investment Details',
    icon: Briefcase,
    fields: [
      {
        key: 'investment_products',
        label: 'Investment Products Offered',
        type: 'multi-select',
        options: [
          'Crypto Index Funds',
          'ETFs',
          'Managed Portfolios',
          'Hedge Funds',
          'Pension Funds',
          'Mutual Funds',
          'Private Equity',
          'Venture Capital'
        ],
        description: 'Types of investment products and services'
      },
      {
        key: 'aum_pkr',
        label: 'Assets Under Management (PKR)',
        type: 'number',
        description: 'Total assets under management in Pakistani Rupees'
      },
      {
        key: 'annual_returns_percentage',
        label: 'Average Annual Returns (%)',
        type: 'number',
        step: '0.01',
        description: 'Historical average annual returns percentage'
      },
      {
        key: 'investment_strategy',
        label: 'Investment Strategy',
        type: 'select',
        options: [
          'Active Management',
          'Passive Management',
          'Quantitative',
          'Value Investing',
          'Growth Investing',
          'Index Tracking',
          'Alternative Strategies'
        ],
        description: 'Primary investment strategy approach'
      }
    ]
  },
  'transfer-settlement': {
    title: 'Transfer and Settlement Services Details',
    icon: Clock,
    fields: [
      {
        key: 'transfer_types',
        label: 'Transfer Types Supported',
        type: 'multi-select',
        options: [
          'P2P Transfers',
          'Bill Payments',
          'Merchant Payments',
          'Remittances',
          'Cross-border Transfers',
          'Bulk Transfers',
          'Scheduled Transfers'
        ],
        description: 'Types of transfer services offered'
      },
      {
        key: 'settlement_speed',
        label: 'Settlement Speed',
        type: 'select',
        options: ['Instant', 'Near-Instant (<1 min)', 'T+0 (Same Day)', 'T+1', 'T+2', 'T+3', 'Variable'],
        description: 'Typical settlement timeframe'
      },
      {
        key: 'supported_networks',
        label: 'Supported Networks/Protocols',
        type: 'multi-select',
        options: [
          'Bitcoin Network',
          'Ethereum',
          'Binance Smart Chain',
          'Polygon',
          'Solana',
          'Cardano',
          'Lightning Network',
          'Traditional Banking',
          'SWIFT',
          '1Link (Pakistan)'
        ],
        description: 'Blockchain networks and payment systems supported'
      }
    ]
  },
  'fiat-tokens': {
    title: 'Fiat Referenced Token Issuance Details',
    icon: Coins,
    fields: [
      {
        key: 'fiat_backing',
        label: 'Fiat Currency Backing',
        type: 'multi-select',
        options: ['PKR', 'USD', 'EUR', 'GBP', 'JPY', 'AED', 'SAR', 'Multi-Currency Basket'],
        description: 'Fiat currencies backing the issued tokens'
      },
      {
        key: 'peg_mechanism',
        label: 'Peg Mechanism',
        type: 'select',
        options: [
          '1:1 Reserve Backing',
          'Algorithmic Stabilization',
          'Hybrid (Reserve + Algorithm)',
          'Overcollateralized',
          'Fractional Reserve'
        ],
        description: 'Method used to maintain price stability'
      },
      {
        key: 'redemption_policy',
        label: 'Redemption Policy',
        type: 'textarea',
        description: 'Policy and process for token redemption to fiat currency'
      },
      {
        key: 'reserve_audit_frequency',
        label: 'Reserve Audit Frequency',
        type: 'select',
        options: ['Real-time', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually'],
        description: 'How frequently are reserves audited?'
      }
    ]
  },
  'asset-tokens': {
    title: 'Asset Referenced Token Issuance Details',
    icon: Building,
    fields: [
      {
        key: 'backing_assets',
        label: 'Backing Assets',
        type: 'multi-select',
        options: [
          'Real Estate',
          'Commodities (Gold, Silver, Oil)',
          'Stocks/Equities',
          'Bonds',
          'Art and Collectibles',
          'Intellectual Property',
          'Carbon Credits',
          'Mixed Asset Baskets'
        ],
        description: 'Types of real-world assets backing the tokens'
      },
      {
        key: 'reserve_audit_frequency',
        label: 'Reserve/Asset Audit Frequency',
        type: 'select',
        options: ['Monthly', 'Quarterly', 'Semi-Annually', 'Annually', 'On-Demand', 'Continuous Monitoring'],
        description: 'How frequently are backing assets audited?'
      },
      {
        key: 'total_token_supply',
        label: 'Total Token Supply',
        type: 'text',
        description: 'Total number of tokens issued (e.g., 1,000,000 tokens)'
      },
      {
        key: 'asset_valuation_method',
        label: 'Asset Valuation Method',
        type: 'select',
        options: [
          'Market Price',
          'Independent Appraisal',
          'Book Value',
          'Fair Market Value',
          'Discounted Cash Flow',
          'Hybrid Approach'
        ],
        description: 'Method used to value backing assets'
      }
    ]
  }
}

export default function SectorSpecificSections({ selectedSectors, data, onChange }: SectorSpecificSectionsProps) {
  const [expandedSectors, setExpandedSectors] = useState<Set<string>>(new Set(selectedSectors))

  useEffect(() => {
    // Auto-expand newly selected sectors
    setExpandedSectors(prev => new Set([...Array.from(prev), ...selectedSectors]))
  }, [selectedSectors])

  const toggleSectorExpansion = (sectorSlug: string) => {
    setExpandedSectors(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectorSlug)) {
        newSet.delete(sectorSlug)
      } else {
        newSet.add(sectorSlug)
      }
      return newSet
    })
  }

  const handleFieldChange = (sectorSlug: string, field: string, value: any) => {
    onChange(sectorSlug, field, value)
  }

  const renderField = (sectorSlug: string, field: any) => {
    const sectorData = data[sectorSlug] || {}
    const fieldValue = sectorData[field.key]

    // Check conditional rendering
    if (field.conditional && !sectorData[field.conditional]) {
      return null
    }

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={fieldValue || ''}
            onChange={(e) => handleFieldChange(sectorSlug, field.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={field.placeholder}
          />
        )

      case 'number':
        return (
          <input
            type="number"
            value={fieldValue || ''}
            onChange={(e) => handleFieldChange(sectorSlug, field.key, e.target.value ? parseFloat(e.target.value) : null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            step={field.step || '1'}
            min="0"
          />
        )

      case 'select':
        return (
          <select
            value={fieldValue || ''}
            onChange={(e) => handleFieldChange(sectorSlug, field.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select an option</option>
            {field.options.map((option: string) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )

      case 'multi-select':
        const selectedValues = fieldValue || []
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {field.options.map((option: string) => (
                <label key={option} className="flex items-center p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option)}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...selectedValues, option]
                        : selectedValues.filter((v: string) => v !== option)
                      handleFieldChange(sectorSlug, field.key, newValues)
                    }}
                    className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>
        )

      case 'multi-input':
        const inputValues = fieldValue || []
        return (
          <div className="space-y-2">
            {inputValues.map((value: string, index: number) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => {
                    const newValues = [...inputValues]
                    newValues[index] = e.target.value
                    handleFieldChange(sectorSlug, field.key, newValues)
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={field.placeholder}
                />
                <button
                  type="button"
                  onClick={() => {
                    const newValues = inputValues.filter((_: any, i: number) => i !== index)
                    handleFieldChange(sectorSlug, field.key, newValues)
                  }}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newValues = [...inputValues, '']
                handleFieldChange(sectorSlug, field.key, newValues)
              }}
              className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50"
            >
              Add {field.label.split(' ').pop()}
            </button>
          </div>
        )

      case 'boolean':
        return (
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={fieldValue || false}
              onChange={(e) => handleFieldChange(sectorSlug, field.key, e.target.checked)}
              className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="text-sm">Yes</span>
          </label>
        )

      case 'textarea':
        return (
          <textarea
            value={fieldValue || ''}
            onChange={(e) => handleFieldChange(sectorSlug, field.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={3}
            placeholder={field.placeholder}
          />
        )

      default:
        return null
    }
  }

  if (selectedSectors.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-600">Select one or more sectors above to configure sector-specific details.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Sector-Specific Configuration</h3>
        <p className="text-blue-700 text-sm">
          Based on your selected sectors, please provide additional details required for regulatory compliance and market analysis.
        </p>
      </div>

      {selectedSectors.map(sectorSlug => {
        const config = SECTOR_CONFIGS[sectorSlug as keyof typeof SECTOR_CONFIGS]
        if (!config) return null

        const Icon = config.icon
        const isExpanded = expandedSectors.has(sectorSlug)

        return (
          <div key={sectorSlug} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSectorExpansion(sectorSlug)}
              className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left"
            >
              <div className="flex items-center">
                <Icon className="mr-3 h-5 w-5 text-indigo-600" />
                <span className="font-semibold text-gray-900">{config.title}</span>
              </div>
              <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                ↓
              </div>
            </button>

            {isExpanded && (
              <div className="p-6 space-y-6">
                {config.fields.map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                      {field.description && (
                        <span className="text-xs text-gray-500 block font-normal mt-1">
                          {field.description}
                        </span>
                      )}
                    </label>
                    {renderField(sectorSlug, field)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
