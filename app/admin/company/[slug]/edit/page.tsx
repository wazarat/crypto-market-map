'use client'

import { useState, useEffect } from 'react'

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save, AlertCircle } from 'lucide-react'
import CompanyForm from '../../../../../components/CompanyForm'
import SectorSpecificSections from '../../../../../components/SectorSpecificSections'
import { vaspApiClient } from '../../../../../lib/vasp-api'

interface CompanyFormData {
  name: string
  sectors: string[]
  year_founded: number | null
  founder_ceo_name: string
  headquarters_location: string
  pakistan_operations: boolean
  website: string
  contact_email: string
  contact_phone: string
  point_of_contact_email: string
  point_of_contact_phone: string
  employee_count: number | null
  total_funding_pkr: number | null
  key_partnerships: string[]
  company_description: string
  company_overview: string
  social_media_twitter: string
  social_media_linkedin: string
  social_media_facebook: string
  secp_registration_number: string
  pvara_license_number: string
  license_status: string
  verification_status: string
  logo_url: string
}

export default function EditCompanyPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string

  const [company, setCompany] = useState<any>(null)
  const [sectorSpecificData, setSectorSpecificData] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showSectorSections, setShowSectorSections] = useState(false)
  const [formData, setFormData] = useState<CompanyFormData | null>(null)

  useEffect(() => {
    loadCompany()
  }, [slug])

  const loadCompany = async () => {
    try {
      setLoading(true)
      const companyData = await vaspApiClient.getCompanyBySlug(slug)
      
      if (!companyData) {
        setError('Company not found')
        return
      }

      setCompany(companyData)
      
      // Transform company data to form format
      const transformedData: CompanyFormData = {
        name: companyData.name || '',
        sectors: companyData.sectors || [],
        year_founded: companyData.year_founded,
        founder_ceo_name: companyData.founder_ceo_name || '',
        headquarters_location: companyData.headquarters_location || '',
        pakistan_operations: companyData.pakistan_operations || false,
        website: companyData.website || '',
        contact_email: companyData.contact_email || '',
        contact_phone: companyData.contact_phone || '',
        point_of_contact_email: companyData.point_of_contact_email || '',
        point_of_contact_phone: companyData.point_of_contact_phone || '',
        employee_count: companyData.employee_count,
        total_funding_pkr: companyData.total_funding_pkr,
        key_partnerships: companyData.key_partnerships || [],
        company_description: companyData.company_description || '',
        company_overview: companyData.company_overview || '',
        social_media_twitter: companyData.social_media_twitter || '',
        social_media_linkedin: companyData.social_media_linkedin || '',
        social_media_facebook: companyData.social_media_facebook || '',
        secp_registration_number: companyData.secp_registration_number || '',
        pvara_license_number: companyData.pvara_license_number || '',
        license_status: companyData.license_status || 'None',
        verification_status: companyData.verification_status || 'Pending',
        logo_url: companyData.logo_url || ''
      }

      setFormData(transformedData)
      setSectorSpecificData(companyData.sector_details || {})
      
    } catch (err) {
      console.error('Error loading company:', err)
      setError('Failed to load company data')
    } finally {
      setLoading(false)
    }
  }

  const handleFormSave = async (data: CompanyFormData) => {
    try {
      setSaving(true)
      setError(null)

      // Update company basic information
      await vaspApiClient.updateCompany(company.id, {
        ...data,
        license_status: data.license_status as 'Applied' | 'Granted' | 'Suspended' | 'None' | 'Under Review',
        verification_status: data.verification_status as 'Pending' | 'Verified' | 'Rejected' | 'Under Review',
        last_updated_by: 'admin@pakistancrypto.council' // In real app, get from auth
      })

      setFormData(data)
      setSuccess(true)
      setShowSectorSections(true)

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)

    } catch (err) {
      console.error('Error saving company:', err)
      setError('Failed to save company data. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleSectorDataChange = (sectorSlug: string, field: string, value: any) => {
    setSectorSpecificData((prev: any) => ({
      ...prev,
      [sectorSlug]: {
        ...prev[sectorSlug],
        [field]: value
      }
    }))
  }

  const saveSectorSpecificData = async () => {
    try {
      setSaving(true)
      setError(null)

      // Save sector-specific data for each selected sector
      for (const sectorSlug of formData?.sectors || []) {
        const sectorData = sectorSpecificData[sectorSlug]
        if (sectorData && Object.keys(sectorData).length > 0) {
          // In a real implementation, you would call the appropriate API endpoint
          // based on the sector type to save the sector-specific data
          console.log(`Saving ${sectorSlug} data:`, sectorData)
        }
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)

    } catch (err) {
      console.error('Error saving sector data:', err)
      setError('Failed to save sector-specific data. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    router.push(`/company/${slug}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading company data...</p>
        </div>
      </div>
    )
  }

  if (error && !company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/admin/companies')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Companies
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push(`/company/${slug}`)}
                className="mr-4 p-2 text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Edit Company: {company?.name}
              </h1>
            </div>
            
            {showSectorSections && (
              <button
                onClick={saveSectorSpecificData}
                disabled={saving}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save All Changes
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Changes saved successfully!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showSectorSections ? (
          // Step 1: Basic Company Information Form
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Step 1: Company Information</h2>
              <p className="text-gray-600 mt-2">
                Update the basic company information and select applicable sectors. After saving, you'll be able to configure sector-specific details.
              </p>
            </div>
            
            {formData && (
              <CompanyForm
                initialData={formData}
                onSave={handleFormSave}
                onCancel={handleCancel}
                isEditing={true}
              />
            )}
          </div>
        ) : (
          // Step 2: Sector-Specific Configuration
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Step 2: Sector-Specific Configuration</h2>
              <p className="text-gray-600 mt-2">
                Configure detailed information specific to each sector this company operates in. This information is required for regulatory compliance and market analysis.
              </p>
            </div>

            <SectorSpecificSections
              selectedSectors={formData?.sectors || []}
              data={sectorSpecificData}
              onChange={handleSectorDataChange}
            />

            {/* Navigation */}
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setShowSectorSections(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Back to Basic Information
              </button>
              
              <div className="flex space-x-4">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSectorSpecificData}
                  disabled={saving}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center"
                >
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save & Finish
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
