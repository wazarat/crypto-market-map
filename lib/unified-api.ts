// Unified API Client - Works with Supabase or Mock Data
import { apiClient } from './api'
import { vaspApiClient } from './vasp-api'

// Environment detection
const HAS_SUPABASE = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
const USE_SUPABASE = HAS_SUPABASE && process.env.USE_MOCK_DATA !== 'true'

console.log('🔍 Data Source Detection:', {
  HAS_SUPABASE,
  USE_SUPABASE,
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not Set',
  USE_MOCK_DATA: process.env.USE_MOCK_DATA
})

class UnifiedApiClient {
  async getSectors() {
    if (USE_SUPABASE) {
      console.log('📊 Using Supabase VASP data...')
      try {
        const categories = await vaspApiClient.getCategories()
        
        // Transform VASP categories to sector format for backward compatibility
        const sectors = await Promise.all(
          categories.map(async (category) => {
            const companies = await vaspApiClient.getCompaniesByCategory(category.slug)
            
            return {
              id: category.id,
              name: category.name,
              slug: category.slug,
              description: category.description,
              company_count: companies.length,
              companies: companies.map(company => ({
                id: company.id,
                name: company.name,
                slug: company.slug,
                logo_url: company.logo_url,
                short_summary: company.company_description.substring(0, 100) + '...',
                website: company.website
              }))
            }
          })
        )
        
        return sectors
      } catch (error) {
        console.error('❌ Supabase error, falling back to mock data:', error)
        return apiClient.getSectors()
      }
    } else {
      console.log('📝 Using mock data...')
      return apiClient.getSectors()
    }
  }

  async getSector(slug: string) {
    if (USE_SUPABASE) {
      try {
        const category = await vaspApiClient.getCategory(slug)
        if (!category) return null

        const companies = await vaspApiClient.getCompaniesByCategory(slug)
        
        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          company_count: companies.length,
          companies: companies.map(company => ({
            id: company.id,
            name: company.name,
            slug: company.slug,
            logo_url: company.logo_url,
            short_summary: (company.company_description || company.name).substring(0, 100) + '...',
            website: company.website
          }))
        }
      } catch (error) {
        console.error('❌ Supabase error, falling back to mock data:', error)
        return apiClient.getSector(slug)
      }
    } else {
      return apiClient.getSector(slug)
    }
  }

  async getCompanyDetail(slug: string) {
    if (USE_SUPABASE) {
      try {
        const company = await vaspApiClient.getCompanyBySlug(slug)
        if (!company) return null

        // Transform VASP company to company detail format
        return {
          id: company.id,
          name: company.name,
          slug: company.slug,
          logo_url: company.logo_url,
          short_summary: (company.company_description || company.name).substring(0, 200) + '...',
          website: company.website,
          sector_name: company.category?.name || '',
          // Enhanced VASP-specific data
          year_founded: company.year_founded,
          founder_ceo_name: company.founder_ceo_name,
          headquarters_location: company.headquarters_location,
          pakistan_operations: Boolean(company.pakistan_operations),
          contact_email: company.contact_email,
          contact_phone: company.contact_phone,
          employee_count: company.employee_count,
          private_company: company.private_company,
          public_company: company.public_company,
          ticker_symbol: company.ticker_symbol,
          key_partnerships: company.key_partnerships,
          secp_registration_number: company.secp_registration_number,
          pvara_license_number: company.pvara_license_number,
          license_status: company.license_status,
          aml_cft_compliance_rating: company.aml_cft_compliance_rating,
          regulatory_compliance_status: company.regulatory_compliance_status,
          sector_details: company.sector_details
        }
      } catch (error) {
        console.error('❌ Supabase error, falling back to mock data:', error)
        // Fallback to basic company info from sectors
        const sectors = await apiClient.getSectors()
        for (const sector of sectors) {
          const company = sector.companies.find(c => c.slug === slug)
          if (company) {
            return {
              ...company,
              sector_name: sector.name
            }
          }
        }
        return null
      }
    } else {
      // Use mock data - find company in sectors
      const sectors = await apiClient.getSectors()
      for (const sector of sectors) {
        const company = sector.companies.find(c => c.slug === slug)
        if (company) {
          return {
            ...company,
            sector_name: sector.name
          }
        }
      }
      return null
    }
  }

  async getCompanyResearch(companySlug: string) {
    // Research functionality not implemented yet - return empty array
    // This prevents 404 errors and localhost connection attempts
    return []
  }

  // VASP-specific methods (only available with Supabase)
  async getVASPCompanies(filters = {}) {
    if (USE_SUPABASE) {
      return vaspApiClient.getCompanies(filters)
    } else {
      throw new Error('VASP features require Supabase integration')
    }
  }

  async getRegulatoryComplianceSummary() {
    if (USE_SUPABASE) {
      return vaspApiClient.getRegulatoryComplianceSummary()
    } else {
      throw new Error('Regulatory compliance features require Supabase integration')
    }
  }

  async updateLicenseStatus(companyId: string, status: string, licenseNumber?: string) {
    if (USE_SUPABASE) {
      return vaspApiClient.updateLicenseStatus(companyId, status, licenseNumber)
    } else {
      throw new Error('License management requires Supabase integration')
    }
  }

  // Check if enhanced VASP features are available
  hasVASPFeatures(): boolean {
    return USE_SUPABASE
  }

  // Get data source info for debugging
  getDataSourceInfo() {
    return {
      source: USE_SUPABASE ? 'Supabase' : 'Mock Data',
      hasSupabase: HAS_SUPABASE,
      useSupabase: USE_SUPABASE,
      vaspFeaturesAvailable: USE_SUPABASE
    }
  }
}

export const unifiedApiClient = new UnifiedApiClient()

// Export for backward compatibility
export { apiClient, vaspApiClient }
