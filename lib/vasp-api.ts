// Enhanced VASP API Client for Pakistan Crypto Council
import { supabase } from './supabase'
import { BaseCompany, VASPCategory } from './enhanced-company-data'

export interface VASPCompanyWithDetails extends BaseCompany {
  category: VASPCategory
  sector_details?: any
}

export interface CompanyFilters {
  category_id?: string
  pakistan_operations?: boolean
  license_status?: string
  aml_cft_compliance_rating?: string
  search?: string
}

class VASPApiClient {
  private ensureSupabase() {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check environment variables.')
    }
    return supabase
  }

  // Get all categories
  async getCategories(): Promise<VASPCategory[]> {
    const client = this.ensureSupabase()

    const { data, error } = await client
      .from('vasp_categories')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  }

  // Get category by slug
  async getCategory(slug: string): Promise<VASPCategory | null> {
    const client = this.ensureSupabase()
    const { data, error } = await client
      .from('vasp_categories')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data
  }

  // Get companies with filters
  async getCompanies(filters: CompanyFilters = {}): Promise<VASPCompanyWithDetails[]> {
    const client = this.ensureSupabase()
    let query = client
      .from('vasp_companies')
      .select(`
        *,
        category:vasp_categories(*)
      `)

    // Apply filters
    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id)
    }
    
    if (filters.pakistan_operations !== undefined) {
      query = query.eq('pakistan_operations', filters.pakistan_operations)
    }
    
    if (filters.license_status) {
      query = query.eq('license_status', filters.license_status)
    }
    
    if (filters.aml_cft_compliance_rating) {
      query = query.eq('aml_cft_compliance_rating', filters.aml_cft_compliance_rating)
    }
    
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,company_description.ilike.%${filters.search}%`)
    }

    const { data, error } = await query.order('name')

    if (error) throw error
    return data || []
  }

  // Get company by slug with sector details
  async getCompanyBySlug(slug: string): Promise<VASPCompanyWithDetails | null> {
    const client = this.ensureSupabase()
    const { data: company, error: companyError } = await client
      .from('vasp_companies')
      .select(`
        *,
        category:vasp_categories(*)
      `)
      .eq('slug', slug)
      .single()

    if (companyError) throw companyError
    if (!company) return null

    // Get sector-specific details based on category
    let sectorDetails = null
    const categorySlug = company.category.slug

    try {
      switch (categorySlug) {
        case 'advisory-services':
          try {
            const { data: advisoryData, error } = await client
              .from('advisory_services_details')
              .select('*')
              .eq('company_id', company.id)
              .single()
            if (!error) {
              sectorDetails = advisoryData
            }
          } catch (err) {
            console.log('No advisory services details found for company:', company.id)
            sectorDetails = null
          }
          break

        case 'broker-dealer-services':
          const { data: brokerData } = await client
            .from('broker_dealer_details')
            .select('*')
            .eq('company_id', company.id)
            .single()
          sectorDetails = brokerData
          break

        case 'custody-services':
          try {
            const { data: custodyData, error } = await client
              .from('custody_services_details')
              .select('*')
              .eq('company_id', company.id)
              .single()
            if (!error) {
              sectorDetails = custodyData
            }
                     } catch (err) {
            console.log('No custody services details found for company:', company.id)
            sectorDetails = null
          }
          break

        case 'exchange-services':
          try {
            const { data: exchangeData, error } = await client
              .from('exchange_services_details')
              .select('*')
              .eq('company_id', company.id)
              .single()
            if (!error) {
              sectorDetails = exchangeData
            }
          } catch (err) {
            console.log('No exchange services details found for company:', company.id)
            sectorDetails = null
          }
          break

        case 'lending-borrowing':
          const { data: lendingData } = await client
            .from('lending_borrowing_details')
            .select('*')
            .eq('company_id', company.id)
            .single()
          sectorDetails = lendingData
          break

        case 'derivatives':
          const { data: derivativesData } = await client
            .from('derivatives_details')
            .select('*')
            .eq('company_id', company.id)
            .single()
          sectorDetails = derivativesData
          break

        case 'asset-management':
          const { data: assetMgmtData } = await client
            .from('asset_management_details')
            .select('*')
            .eq('company_id', company.id)
            .single()
          sectorDetails = assetMgmtData
          break

        case 'transfer-settlement':
          const { data: transferData } = await client
            .from('transfer_settlement_details')
            .select('*')
            .eq('company_id', company.id)
            .single()
          sectorDetails = transferData
          break

        case 'fiat-tokens':
          const { data: fiatTokenData } = await client
            .from('fiat_referenced_token_details')
            .select('*')
            .eq('company_id', company.id)
            .single()
          sectorDetails = fiatTokenData
          break

        case 'asset-tokens':
          const { data: assetTokenData } = await client
            .from('asset_referenced_token_details')
            .select('*')
            .eq('company_id', company.id)
            .single()
          sectorDetails = assetTokenData
          break
      }
    } catch (error) {
      // Sector details not found - this is okay
      console.log(`No sector details found for ${company.name}`)
    }

    return {
      ...company,
      sector_details: sectorDetails
    }
  }

  // Get company research
  async getCompanyResearch(companyId: string) {
    const client = this.ensureSupabase()
    const { data, error } = await client
      .from('company_research')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Get companies by category
  async getCompaniesByCategory(categorySlug: string): Promise<VASPCompanyWithDetails[]> {
    const client = this.ensureSupabase()
    const { data, error } = await client
      .from('vasp_companies')
      .select(`
        *,
        category:vasp_categories!inner(*)
      `)
      .eq('category.slug', categorySlug)
      .order('name')

    if (error) throw error
    return data || []
  }

  // Admin functions for Pakistan Crypto Council

  // Create company
  async createCompany(companyData: Partial<BaseCompany>): Promise<BaseCompany> {
    const client = this.ensureSupabase()
    const { data, error } = await client
      .from('vasp_companies')
      .insert(companyData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Update company
  async updateCompany(id: string, updates: Partial<BaseCompany>): Promise<BaseCompany> {
    const client = this.ensureSupabase()
    const { data, error } = await client
      .from('vasp_companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Delete company
  async deleteCompany(id: string): Promise<void> {
    const client = this.ensureSupabase()
    const { error } = await client
      .from('vasp_companies')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Update license status
  async updateLicenseStatus(
    companyId: string, 
    licenseStatus: string, 
    licenseNumber?: string
  ): Promise<void> {
    const updates: any = { license_status: licenseStatus }
    if (licenseNumber) {
      updates.pvara_license_number = licenseNumber
    }

    const client = this.ensureSupabase()
    const { error } = await client
      .from('vasp_companies')
      .update(updates)
      .eq('id', companyId)

    if (error) throw error
  }

  // Get regulatory compliance summary
  async getRegulatoryComplianceSummary() {
    const client = this.ensureSupabase()
    const { data, error } = await client
      .from('vasp_companies')
      .select(`
        license_status,
        aml_cft_compliance_rating,
        pakistan_operations,
        category:vasp_categories(name)
      `)

    if (error) throw error

    // Process data for summary statistics
    const summary = {
      total_companies: data?.length || 0,
      pakistan_companies: data?.filter((c: any) => c.pakistan_operations).length || 0,
      licensed_companies: data?.filter((c: any) => c.license_status === 'Granted').length || 0,
      pending_applications: data?.filter((c: any) => c.license_status === 'Applied' || c.license_status === 'Under Review').length || 0,
      high_aml_compliance: data?.filter((c: any) => c.aml_cft_compliance_rating === 'High').length || 0,
      by_category: {} as Record<string, number>
    }

    // Count by category
    data?.forEach((company: any) => {
      if (company.category && company.category.name) {
        const categoryName = company.category.name
        summary.by_category[categoryName] = (summary.by_category[categoryName] || 0) + 1
      }
    })

    return summary
  }

  // Search companies with advanced filters
  async searchCompanies(searchTerm: string, filters: CompanyFilters = {}) {
    return this.getCompanies({
      ...filters,
      search: searchTerm
    })
  }
}

export const vaspApiClient = new VASPApiClient()
