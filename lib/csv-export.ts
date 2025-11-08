// CSV Export Utility for Pakistan VASP Data
import { VASPCompanyWithDetails } from './vasp-api'

export function convertToCSV(companies: VASPCompanyWithDetails[]): string {
  if (companies.length === 0) return ''

  // Define CSV headers
  const headers = [
    'Company Name',
    'Category',
    'Year Founded',
    'Founder/CEO Name',
    'Headquarters Location',
    'Pakistan Operations',
    'Website',
    'Contact Email',
    'Contact Phone',
    'Number of Employees',
    'Total Funding (PKR)',
    'Key Partnerships',
    'Company Description',
    'Twitter Handle',
    'LinkedIn URL',
    'SECP Registration Number',
    'PVARA License Number',
    'License Status',
    'Paid-up Capital (PKR)',
    'Capital Adequacy Ratio (%)',
    'Number of Directors',
    'Director Experience (Years)',
    'Fit-and-Proper Compliance',
    'Fit-and-Proper Details',
    'Annual Supervisory Fee Status',
    'Customer Asset Segregation Policy',
    'AML/CFT Compliance Rating',
    'Market Share Estimate',
    'User Base Estimate',
    'Regulatory Compliance Status'
  ]

  // Convert companies to CSV rows
  const rows = companies.map(company => [
    escapeCsvField(company.name),
    escapeCsvField(company.category?.name || ''),
    company.year_founded?.toString() || '',
    escapeCsvField(company.founder_ceo_name || ''),
    escapeCsvField(company.headquarters_location),
    company.pakistan_operations ? 'Yes' : 'No',
    escapeCsvField(company.website || ''),
    escapeCsvField(company.contact_email || ''),
    escapeCsvField(company.contact_phone || ''),
    company.employee_count?.toString() || '',
    company.total_funding_pkr?.toString() || '',
    escapeCsvField(company.key_partnerships?.join('; ') || ''),
    escapeCsvField(company.company_description),
    escapeCsvField(company.twitter_handle || ''),
    escapeCsvField(company.linkedin_url || ''),
    escapeCsvField(company.secp_registration_number || ''),
    escapeCsvField(company.pvara_license_number || ''),
    escapeCsvField(company.license_status),
    company.paid_up_capital_pkr?.toString() || '',
    company.capital_adequacy_ratio?.toString() || '',
    company.number_of_directors?.toString() || '',
    company.director_experience_years?.toString() || '',
    company.fit_and_proper_compliance ? 'Yes' : (company.fit_and_proper_compliance === false ? 'No' : ''),
    escapeCsvField(company.fit_and_proper_details || ''),
    escapeCsvField(company.annual_supervisory_fee_status),
    escapeCsvField(company.customer_asset_segregation_policy || ''),
    escapeCsvField(company.aml_cft_compliance_rating),
    escapeCsvField(company.market_share_estimate || ''),
    escapeCsvField(company.user_base_estimate || ''),
    escapeCsvField(company.regulatory_compliance_status)
  ])

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n')

  return csvContent
}

export function convertSectorDetailsToCSV(companies: VASPCompanyWithDetails[]): string {
  if (companies.length === 0) return ''

  const rows: string[][] = []
  
  companies.forEach(company => {
    if (!company.sector_details) return

    const baseRow = [
      escapeCsvField(company.name),
      escapeCsvField(company.category?.name || ''),
      escapeCsvField(company.category?.slug || '')
    ]

    const details = company.sector_details
    const categorySlug = company.category?.slug

    switch (categorySlug) {
      case 'advisory-services':
        rows.push([
          ...baseRow,
          'Advisory Focus Areas',
          escapeCsvField(details.advisory_focus_areas?.join('; ') || ''),
          'Client Type',
          escapeCsvField(details.client_type || ''),
          'Advisory Reports (Last Year)',
          details.advisory_reports_last_year?.toString() || ''
        ])
        break

      case 'broker-dealer-services':
        rows.push([
          ...baseRow,
          'Trading Platforms',
          escapeCsvField(details.trading_platforms_supported?.join('; ') || ''),
          'Asset Types',
          escapeCsvField(details.asset_types_handled?.join('; ') || ''),
          'Annual Transaction Volume (PKR)',
          details.annual_transaction_volume_pkr?.toString() || ''
        ])
        break

      case 'exchange-services':
        rows.push([
          ...baseRow,
          'Exchange Type',
          escapeCsvField(details.exchange_type || ''),
          'Trading Pairs',
          escapeCsvField(details.supported_trading_pairs?.join('; ') || ''),
          'Daily Trading Volume (PKR)',
          details.daily_trading_volume_pkr?.toString() || ''
        ])
        break

      case 'asset-management':
        rows.push([
          ...baseRow,
          'Investment Products',
          escapeCsvField(details.investment_products?.join('; ') || ''),
          'AUM (PKR)',
          details.aum_pkr?.toString() || '',
          'Annual Returns (%)',
          details.annual_returns_percentage?.toString() || ''
        ])
        break

      case 'transfer-settlement':
        rows.push([
          ...baseRow,
          'Transfer Types',
          escapeCsvField(details.transfer_types?.join('; ') || ''),
          'Settlement Speed',
          escapeCsvField(details.settlement_speed || ''),
          'Supported Networks',
          escapeCsvField(details.supported_networks?.join('; ') || '')
        ])
        break

      // Add other sector types as needed
    }
  })

  const headers = [
    'Company Name',
    'Category',
    'Category Slug',
    'Detail Type 1',
    'Detail Value 1',
    'Detail Type 2', 
    'Detail Value 2',
    'Detail Type 3',
    'Detail Value 3'
  ]

  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n')

  return csvContent
}

function escapeCsvField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`
  }
  return field
}

export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// Generate comprehensive report for Pakistan Crypto Council
export async function generatePakistanVASPReport(companies: VASPCompanyWithDetails[]) {
  const pakistanCompanies = companies.filter(c => c.pakistan_operations)
  const internationalCompanies = companies.filter(c => !c.pakistan_operations)

  const report = {
    summary: {
      total_companies: companies.length,
      pakistan_companies: pakistanCompanies.length,
      international_companies: internationalCompanies.length,
      licensed_companies: companies.filter(c => c.license_status === 'Granted').length,
      pending_applications: companies.filter(c => c.license_status === 'Applied' || c.license_status === 'Under Review').length,
      high_aml_compliance: companies.filter(c => c.aml_cft_compliance_rating === 'High').length
    },
    by_category: {} as Record<string, any>,
    compliance_status: {
      granted: companies.filter(c => c.license_status === 'Granted'),
      applied: companies.filter(c => c.license_status === 'Applied'),
      under_review: companies.filter(c => c.license_status === 'Under Review'),
      none: companies.filter(c => c.license_status === 'None')
    }
  }

  // Group by category
  companies.forEach(company => {
    const categoryName = company.category?.name || 'Unknown'
    if (!report.by_category[categoryName]) {
      report.by_category[categoryName] = {
        total: 0,
        pakistan_based: 0,
        licensed: 0,
        companies: []
      }
    }
    
    report.by_category[categoryName].total++
    if (company.pakistan_operations) report.by_category[categoryName].pakistan_based++
    if (company.license_status === 'Granted') report.by_category[categoryName].licensed++
    report.by_category[categoryName].companies.push(company.name)
  })

  return report
}
