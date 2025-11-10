'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, Download, Plus, Trash2, Save } from 'lucide-react'
import CSVImport from '../../../components/CSVImport'
import { vaspApiClient, VASPCategory } from '../../../lib/vasp-api'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface CompanyData {
  id?: string
  name: string
  year_founded?: number | null
  founder_ceo_name?: string
  headquarters_location?: string
  website?: string
  contact_email?: string
  contact_phone?: string
  point_of_contact_email?: string
  point_of_contact_phone?: string
  social_media_twitter?: string
  social_media_linkedin?: string
  social_media_facebook?: string
  employee_count?: number | null
  private_company?: boolean
  public_company?: boolean
  ticker_symbol?: string
  key_partnerships?: string[]
  company_description?: string
  company_overview?: string
  secp_registration_number?: string
  pvara_license_number?: string
  license_status?: string
  verification_status?: string
}

export default function BulkUploadPage() {
  const router = useRouter()
  const [companies, setCompanies] = useState<CompanyData[]>([
    { name: '', key_partnerships: [] }
  ])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [selectedSector, setSelectedSector] = useState<VASPCategory | null>(null)
  const [availableSectors, setAvailableSectors] = useState<VASPCategory[]>([])
  const [loadingSectors, setLoadingSectors] = useState(true)

  // Load available sectors on component mount
  useEffect(() => {
    const loadSectors = async () => {
      try {
        const sectors = await vaspApiClient.getCategories()
        setAvailableSectors(sectors)
        // Default to Exchange Services if available
        const exchangeServices = sectors.find(s => s.slug === 'exchange-services')
        if (exchangeServices) {
          setSelectedSector(exchangeServices)
        }
      } catch (error) {
        console.error('Failed to load sectors:', error)
        setError('Failed to load available sectors')
      } finally {
        setLoadingSectors(false)
      }
    }

    loadSectors()
  }, [])

  const addCompany = () => {
    setCompanies([...companies, { name: '', key_partnerships: [] }])
  }

  const removeCompany = (index: number) => {
    if (companies.length > 1) {
      setCompanies(companies.filter((_, i) => i !== index))
    }
  }

  const updateCompany = (index: number, field: keyof CompanyData, value: any) => {
    const updated = [...companies]
    updated[index] = { ...updated[index], [field]: value }
    setCompanies(updated)
  }

  const addPartnership = (companyIndex: number) => {
    const updated = [...companies]
    const partnerships = updated[companyIndex].key_partnerships || []
    updated[companyIndex].key_partnerships = [...partnerships, '']
    setCompanies(updated)
  }

  const updatePartnership = (companyIndex: number, partnerIndex: number, value: string) => {
    const updated = [...companies]
    const partnerships = [...(updated[companyIndex].key_partnerships || [])]
    partnerships[partnerIndex] = value
    updated[companyIndex].key_partnerships = partnerships
    setCompanies(updated)
  }

  const removePartnership = (companyIndex: number, partnerIndex: number) => {
    const updated = [...companies]
    const partnerships = updated[companyIndex].key_partnerships || []
    updated[companyIndex].key_partnerships = partnerships.filter((_, i) => i !== partnerIndex)
    setCompanies(updated)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)

      // Validate sector selection
      if (!selectedSector) {
        setError('Please select a sector before saving companies')
        return
      }

      // Validate required fields
      const invalidCompanies = companies.filter(c => !c.name.trim())
      if (invalidCompanies.length > 0) {
        setError('All companies must have a name')
        return
      }

      // Check if Supabase is available
      console.log('🔍 Checking database connection...')
      
      // Check environment variables
      const hasSupabase = Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
      console.log('🔧 Environment check:', {
        hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        hasSupabaseKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
        hasSupabase
      })

      if (!hasSupabase) {
        setError('Database connection not available. Please check environment variables or contact administrator.')
        return
      }

      // Use the selected sector's category ID
      const selectedCategoryId = selectedSector.id
      console.log('📋 Selected sector:', selectedSector.name, 'ID:', selectedCategoryId)
      
      // Save companies to database
      const savedCompanies = []
      const failedCompanies = []
      
      for (let i = 0; i < companies.length; i++) {
        const company = companies[i]
        try {
          console.log(`💾 Saving company ${i + 1}/${companies.length}: ${company.name}`)
          
          // Create slug from company name
          const slug = company.name.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()

          const companyData = {
            name: company.name,
            slug,
            sectors: [selectedSector.slug], // Use selected sector
            category_id: selectedCategoryId, // Use selected sector's ID
            pakistan_operations: true,
            year_founded: company.year_founded,
            founder_ceo_name: company.founder_ceo_name || '',
            headquarters_location: company.headquarters_location || '',
            website: company.website || '',
            contact_email: company.contact_email || '',
            contact_phone: company.contact_phone || '',
            point_of_contact_email: company.point_of_contact_email || '',
            point_of_contact_phone: company.point_of_contact_phone || '',
            social_media_twitter: company.social_media_twitter || '',
            social_media_linkedin: company.social_media_linkedin || '',
            social_media_facebook: company.social_media_facebook || '',
            employee_count: company.employee_count,
            private_company: company.private_company || false,
            public_company: company.public_company || false,
            ticker_symbol: company.ticker_symbol || '',
            key_partnerships: company.key_partnerships || [],
            company_description: company.company_description || '',
            company_overview: company.company_overview || '',
            secp_registration_number: company.secp_registration_number || '',
            pvara_license_number: company.pvara_license_number || '',
            license_status: (['Applied', 'Granted', 'Suspended', 'None', 'Under Review'].includes(company.license_status || '') ? (company.license_status || 'None') : 'None') as 'None' | 'Applied' | 'Granted' | 'Suspended' | 'Under Review',
            verification_status: (['Pending', 'Verified', 'Rejected', 'Under Review'].includes(company.verification_status || '') ? (company.verification_status || 'Pending') : 'Pending') as 'Pending' | 'Verified' | 'Rejected' | 'Under Review',
            last_updated_by: 'admin@pakistancrypto.council'
          }

          console.log('📋 Company data prepared:', { name: companyData.name, slug: companyData.slug })

          const savedCompany = await vaspApiClient.createCompany(companyData)
          savedCompanies.push(savedCompany)
          console.log(`✅ Successfully saved: ${company.name}`)
          
        } catch (companyError: any) {
          console.error(`❌ Failed to save company ${company.name}:`, companyError)
          failedCompanies.push({
            name: company.name,
            error: companyError.message || 'Unknown error'
          })
        }
      }

      if (failedCompanies.length > 0) {
        const failedNames = failedCompanies.map(f => `${f.name} (${f.error})`).join(', ')
        throw new Error(`Failed to save ${failedCompanies.length} companies: ${failedNames}`)
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/companies?sector=exchange-services')
      }, 2000)

    } catch (err: any) {
      setError(err.message || 'Failed to save companies. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCSVImport = (importedCompanies: CompanyData[]) => {
    setCompanies(importedCompanies)
    setError(null)
  }

  const exportCSV = () => {
    const headers = [
      'Company Name', 'Year Founded', 'Founder/CEO', 'Headquarters', 'Website',
      'Contact Email', 'Contact Phone', 'Point of Contact Email', 'Point of Contact Phone',
      'Twitter', 'LinkedIn', 'Facebook', 'Employees', 'Funding (PKR)',
      'Partnerships', 'Description', 'Overview', 'SECP Number', 'PVARA Number',
      'License Status', 'Verification Status'
    ]

    const csvContent = [
      headers.join(','),
      ...companies.map(company => [
        company.name || '',
        company.year_founded || '',
        company.founder_ceo_name || '',
        company.headquarters_location || '',
        company.website || '',
        company.contact_email || '',
        company.contact_phone || '',
        company.point_of_contact_email || '',
        company.point_of_contact_phone || '',
        company.social_media_twitter || '',
        company.social_media_linkedin || '',
        company.social_media_facebook || '',
        company.employee_count || '',
        company.private_company ? 'Private' : (company.public_company ? 'Public' : 'Unknown'),
        (company.key_partnerships || []).join('; '),
        company.company_description || '',
        company.company_overview || '',
        company.secp_registration_number || '',
        company.pvara_license_number || '',
        company.license_status || '',
        company.verification_status || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedSector?.slug || 'companies'}-companies.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin')}
                className="mr-4 p-2 text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Bulk Upload - {selectedSector?.name || 'Companies'}
              </h1>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={exportCSV}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save All Companies
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {success && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-sm font-medium text-green-800">
              Successfully saved {companies.length} companies! Redirecting to companies list...
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sector Selection */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Bulk Upload Companies</h2>
          <p className="text-gray-600 mt-2">
            Select a sector and add up to 100 companies. Only company name is required. All other fields are optional.
            After saving, you can add sector-specific details for each company.
          </p>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-blue-900 mb-2">
                  Select Sector *
                </label>
                {loadingSectors ? (
                  <div className="text-sm text-blue-700">Loading sectors...</div>
                ) : (
                  <select
                    value={selectedSector?.id || ''}
                    onChange={(e) => {
                      const sector = availableSectors.find(s => s.id === e.target.value)
                      setSelectedSector(sector || null)
                    }}
                    className="block w-full px-3 py-2 border border-blue-300 rounded-md bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a sector...</option>
                    {availableSectors.map((sector) => (
                      <option key={sector.id} value={sector.id}>
                        {sector.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="text-sm text-blue-800">
                <strong>Companies:</strong> {companies.length}/100
              </div>
            </div>
          </div>
        </div>

        {/* CSV Import */}
        {selectedSector && (
          <div className="mb-6">
            <CSVImport onImport={handleCSVImport} />
          </div>
        )}

        {/* Add Company Button */}
        <div className="mb-6">
          <button
            onClick={addCompany}
            disabled={companies.length >= 100 || !selectedSector}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Company ({companies.length}/100)
          </button>
          {!selectedSector && (
            <p className="text-sm text-gray-500 mt-2">Please select a sector first</p>
          )}
        </div>

        {/* Companies List */}
        {selectedSector && (
          <div className="space-y-8">
            {companies.map((company, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Company #{index + 1}
                </h3>
                {companies.length > 1 && (
                  <button
                    onClick={() => removeCompany(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Company Name - Required */}
                <div className="lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={company.name}
                    onChange={(e) => updateCompany(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter company name"
                  />
                </div>

                {/* Basic Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year Founded</label>
                  <input
                    type="number"
                    value={company.year_founded || ''}
                    onChange={(e) => updateCompany(index, 'year_founded', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 2020"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Founder/CEO Name</label>
                  <input
                    type="text"
                    value={company.founder_ceo_name || ''}
                    onChange={(e) => updateCompany(index, 'founder_ceo_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter founder/CEO name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Headquarters Location</label>
                  <input
                    type="text"
                    value={company.headquarters_location || ''}
                    onChange={(e) => updateCompany(index, 'headquarters_location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Karachi, Pakistan"
                  />
                </div>

                {/* Contact Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                  <input
                    type="url"
                    value={company.website || ''}
                    onChange={(e) => updateCompany(index, 'website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={company.contact_email || ''}
                    onChange={(e) => updateCompany(index, 'contact_email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="contact@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={company.contact_phone || ''}
                    onChange={(e) => updateCompany(index, 'contact_phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="+92-XXX-XXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Point of Contact Email</label>
                  <input
                    type="email"
                    value={company.point_of_contact_email || ''}
                    onChange={(e) => updateCompany(index, 'point_of_contact_email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="poc@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Point of Contact Phone</label>
                  <input
                    type="tel"
                    value={company.point_of_contact_phone || ''}
                    onChange={(e) => updateCompany(index, 'point_of_contact_phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="+92-XXX-XXXXXXX"
                  />
                </div>

                {/* Social Media */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Twitter/X Handle</label>
                  <input
                    type="text"
                    value={company.social_media_twitter || ''}
                    onChange={(e) => updateCompany(index, 'social_media_twitter', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="@company"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={company.social_media_linkedin || ''}
                    onChange={(e) => updateCompany(index, 'social_media_linkedin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://linkedin.com/company/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                  <input
                    type="url"
                    value={company.social_media_facebook || ''}
                    onChange={(e) => updateCompany(index, 'social_media_facebook', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://facebook.com/..."
                  />
                </div>

                {/* Business Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Employees</label>
                  <input
                    type="number"
                    value={company.employee_count || ''}
                    onChange={(e) => updateCompany(index, 'employee_count', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Type</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={company.private_company || false}
                        onChange={(e) => updateCompany(index, 'private_company', e.target.checked)}
                        className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Private Company</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={company.public_company || false}
                        onChange={(e) => updateCompany(index, 'public_company', e.target.checked)}
                        className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Public Company</span>
                    </label>
                  </div>
                </div>

                {/* Regulatory Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SECP Registration Number</label>
                  <input
                    type="text"
                    value={company.secp_registration_number || ''}
                    onChange={(e) => updateCompany(index, 'secp_registration_number', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="SECP-XXXX-XXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PVARA License Number</label>
                  <input
                    type="text"
                    value={company.pvara_license_number || ''}
                    onChange={(e) => updateCompany(index, 'pvara_license_number', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="PVARA-XXXX-XXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">License Status</label>
                  <select
                    value={company.license_status || ''}
                    onChange={(e) => updateCompany(index, 'license_status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select status</option>
                    <option value="None">None</option>
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Granted">Granted</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
                  <select
                    value={company.verification_status || ''}
                    onChange={(e) => updateCompany(index, 'verification_status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select status</option>
                    <option value="Pending">Pending</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Verified">Verified</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Descriptions */}
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
                  <textarea
                    value={company.company_description || ''}
                    onChange={(e) => updateCompany(index, 'company_description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Brief description of the company..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Overview</label>
                  <textarea
                    value={company.company_overview || ''}
                    onChange={(e) => updateCompany(index, 'company_overview', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Detailed overview of operations, services, and market position..."
                  />
                </div>

                {/* Key Partnerships */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Key Partnerships/Alliances</label>
                  <div className="space-y-2">
                    {(company.key_partnerships || []).map((partnership, partnerIndex) => (
                      <div key={partnerIndex} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={partnership}
                          onChange={(e) => updatePartnership(index, partnerIndex, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Partnership/Alliance name"
                        />
                        <button
                          onClick={() => removePartnership(index, partnerIndex)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addPartnership(index)}
                      className="flex items-center px-3 py-2 text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Partnership
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Save Button */}
        {selectedSector && (
          <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-5 w-5 mr-2" />
            )}
            Save All {companies.length} Companies
          </button>
          </div>
        )}
      </div>
    </div>
  )
}
