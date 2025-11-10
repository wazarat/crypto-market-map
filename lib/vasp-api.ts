// Enhanced VASP API Client for Canhav
import { supabase } from './supabase'
import { BaseCompany, VASPCategory } from './enhanced-company-data'

// Re-export VASPCategory for use in other components
export type { VASPCategory }

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

  // Get company by slug with sector details (supports multiple sectors)
  async getCompanyBySlug(slug: string): Promise<VASPCompanyWithDetails | null> {
    const client = this.ensureSupabase()
    
    // Get company with its primary category
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

    // Get all sectors this company is assigned to via company_sectors table
    const { data: companySectors, error: sectorsError } = await client
      .from('company_sectors')
      .select(`
        category_id,
        category:vasp_categories(slug, name)
      `)
      .eq('company_id', company.id)

    let allSectors = []
    let allSectorDetails = {}

    if (!sectorsError && companySectors && companySectors.length > 0) {
      // Company has multiple sector assignments
      allSectors = companySectors.map((cs: any) => cs.category.slug)
      
      // Fetch sector-specific details for each sector
      for (const sectorAssignment of companySectors) {
        const sectorSlug = (sectorAssignment as any).category.slug
        let sectorDetails = null

        try {
          switch (sectorSlug) {
            case 'advisory-services':
              const { data: advisoryData } = await client
                .from('advisory_services_details')
                .select('*')
                .eq('company_id', company.id)
                .single()
              sectorDetails = advisoryData
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
              const { data: custodyData } = await client
                .from('custody_services_details')
                .select('*')
                .eq('company_id', company.id)
                .single()
              sectorDetails = custodyData
              break

            case 'exchange-services':
              const { data: exchangeData } = await client
                .from('exchange_services_details')
                .select('*')
                .eq('company_id', company.id)
                .single()
              sectorDetails = exchangeData
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

          if (sectorDetails) {
            (allSectorDetails as any)[sectorSlug] = sectorDetails
          }
        } catch (error) {
          console.log(`No ${sectorSlug} details found for ${company.name}`)
        }
      }
    } else {
      // Fallback to single category if no multi-sector assignments
      allSectors = [company.category.slug]
      // Keep existing single-sector logic as fallback
    }

    return {
      ...company,
      sectors: allSectors,
      sector_details: allSectorDetails
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

  // Get companies by category (backward compatible with both old and new schema)
  async getCompaniesByCategory(categorySlug: string): Promise<VASPCompanyWithDetails[]> {
    const client = this.ensureSupabase()
    
    try {
      // Try new many-to-many approach first (if migration has been run)
      const { data: category, error: categoryError } = await client
        .from('vasp_categories')
        .select('id')
        .eq('slug', categorySlug)
        .single()
      
      if (categoryError) throw categoryError
      if (!category) return []
      
      // Try to query the junction table
      const { data, error } = await client
        .from('company_sectors')
        .select(`
          vasp_companies (
            *,
            category:vasp_categories!vasp_companies_category_id_fkey(*)
          )
        `)
        .eq('category_id', category.id)
      
      if (error) {
        // If junction table doesn't exist, fall back to old approach
        throw error
      }
      
      // Extract and return companies from many-to-many
      return data?.map((item: any) => item.vasp_companies).filter(Boolean) || []
      
    } catch (error) {
      // Fallback to old single-category approach
      console.log('📊 Using legacy single-category approach for', categorySlug)
      
      const { data, error: legacyError } = await client
        .from('vasp_companies')
        .select(`
          *,
          category:vasp_categories!inner(*)
        `)
        .eq('category.slug', categorySlug)
        .order('name')

      if (legacyError) throw legacyError
      return data || []
    }
  }

  // Admin functions for Canhav

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

  // Update company sectors (many-to-many relationship)
  async updateCompanySectors(companyId: string, sectorSlugs: string[]): Promise<void> {
    const client = this.ensureSupabase()
    
    console.log('🔧 updateCompanySectors called with:', { companyId, sectorSlugs })
    
    try {
      // First, get category IDs from slugs
      console.log('📋 Fetching category IDs for slugs:', sectorSlugs)
      const { data: categories, error: categoryError } = await client
        .from('vasp_categories')
        .select('id, slug')
        .in('slug', sectorSlugs)
      
      if (categoryError) {
        console.error('❌ Error fetching categories:', categoryError)
        throw categoryError
      }
      
      console.log('✅ Found categories:', categories)
      
      // Delete existing sector assignments for this company
      console.log('🗑️ Deleting existing assignments for company:', companyId)
      const { error: deleteError } = await client
        .from('company_sectors')
        .delete()
        .eq('company_id', companyId)
      
      if (deleteError) {
        console.error('❌ Error deleting existing assignments:', deleteError)
        // If company_sectors table doesn't exist, throw specific error
        if (deleteError.code === 'PGRST204' || deleteError.message?.includes('company_sectors')) {
          throw new Error('MIGRATION_REQUIRED: company_sectors table does not exist')
        }
        throw deleteError
      }
      
      console.log('✅ Deleted existing assignments')
      
      // Insert new sector assignments
      if (categories && categories.length > 0) {
        const sectorAssignments = categories.map(category => ({
          company_id: companyId,
          category_id: category.id
        }))
        
        console.log('➕ Inserting new assignments:', sectorAssignments)
        
        const { data: insertData, error: insertError } = await client
          .from('company_sectors')
          .insert(sectorAssignments)
          .select()
        
        if (insertError) {
          console.error('❌ Error inserting new assignments:', insertError)
          throw insertError
        }
        
        console.log('✅ Successfully inserted assignments:', insertData)
      } else {
        console.log('⚠️ No categories found for the provided slugs')
      }
      
      console.log('🎉 updateCompanySectors completed successfully')
      
    } catch (error: any) {
      console.error('💥 updateCompanySectors failed:', error)
      
      // If it's a migration-related error, throw it to trigger fallback
      if (error.message?.includes('MIGRATION_REQUIRED') || 
          error.code === 'PGRST204' || 
          error.message?.includes('company_sectors')) {
        throw new Error('MIGRATION_REQUIRED: company_sectors table does not exist')
      }
      throw error
    }
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

  // Save sector-specific data
  async saveSectorSpecificData(companyId: string, sectorSlug: string, sectorData: any) {
    const client = this.ensureSupabase()
    
    // Determine which table to update based on sector slug
    let tableName: string
    switch (sectorSlug) {
      case 'advisory-services':
        tableName = 'advisory_services_details'
        break
      case 'broker-dealer-services':
        tableName = 'broker_dealer_details'
        break
      case 'custody-services':
        tableName = 'custody_services_details'
        break
      case 'exchange-services':
        tableName = 'exchange_services_details'
        break
      case 'lending-borrowing':
        tableName = 'lending_borrowing_details'
        break
      case 'derivatives':
        tableName = 'derivatives_details'
        break
      case 'asset-management':
        tableName = 'asset_management_details'
        break
      case 'transfer-settlement':
        tableName = 'transfer_settlement_details'
        break
      case 'fiat-tokens':
        tableName = 'fiat_referenced_token_details'
        break
      case 'asset-tokens':
        tableName = 'asset_referenced_token_details'
        break
      default:
        throw new Error(`Unknown sector slug: ${sectorSlug}`)
    }

    // Prepare data for database (remove any UI-only fields)
    const cleanedData = { ...sectorData }
    delete cleanedData.id
    delete cleanedData.created_at
    delete cleanedData.updated_at

    // Try to update existing record, if not found then insert
    const { data: existingData } = await client
      .from(tableName)
      .select('id')
      .eq('company_id', companyId)
      .single()

    if (existingData) {
      // Update existing record
      const { data, error } = await client
        .from(tableName)
        .update({
          ...cleanedData,
          updated_at: new Date().toISOString()
        })
        .eq('company_id', companyId)
        .select()

      if (error) throw error
      return data
    } else {
      // Insert new record
      const { data, error } = await client
        .from(tableName)
        .insert({
          company_id: companyId,
          ...cleanedData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()

      if (error) throw error
      return data
    }
  }
}

export const vaspApiClient = new VASPApiClient()
