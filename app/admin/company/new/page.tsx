'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import CompanyForm from '../../../../components/CompanyForm'
import SectorSpecificSections from '../../../../components/SectorSpecificSections'
import { vaspApiClient } from '../../../../lib/vasp-api'

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

export default function NewCompanyPage() {
  const router = useRouter()
  
  const [sectorSpecificData, setSectorSpecificData] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showSectorSections, setShowSectorSections] = useState(false)
  const [formData, setFormData] = useState<CompanyFormData | null>(null)
  const [createdCompanyId, setCreatedCompanyId] = useState<string | null>(null)

  const handleFormSave = async (data: CompanyFormData) => {
    try {
      setSaving(true)
      setError(null)

      // Create new company
      const newCompany = await vaspApiClient.createCompany({
        ...data,
        license_status: data.license_status as 'Applied' | 'Granted' | 'Suspended' | 'None' | 'Under Review',
        verification_status: data.verification_status as 'Pending' | 'Verified' | 'Rejected' | 'Under Review',
        last_updated_by: 'admin@pakistancrypto.council' // In real app, get from auth
      })

      setCreatedCompanyId(newCompany.id)
      setFormData(data)
      setSuccess(true)
      setShowSectorSections(true)

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)

    } catch (err) {
      console.error('Error creating company:', err)
      setError('Failed to create company. Please try again.')
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
          console.log(`Saving ${sectorSlug} data for company ${createdCompanyId}:`, sectorData)
        }
      }

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        // Redirect to the company detail page
        if (createdCompanyId) {
          router.push(`/company/${formData?.name.toLowerCase().replace(/\s+/g, '-')}`)
        }
      }, 2000)

    } catch (err) {
      console.error('Error saving sector data:', err)
      setError('Failed to save sector-specific data. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/companies')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin/companies')}
                className="mr-4 p-2 text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Add New Company
              </h1>
            </div>
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
                  {showSectorSections ? 'Company created successfully! Complete the sector-specific details below.' : 'All data saved successfully!'}
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
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
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
                Enter the basic company information and select applicable sectors. After saving, you'll be able to configure sector-specific details.
              </p>
            </div>
            
            <CompanyForm
              onSave={handleFormSave}
              onCancel={handleCancel}
              isEditing={false}
            />
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
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  Complete & Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
