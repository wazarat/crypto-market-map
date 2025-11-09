'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Building2, Settings, CheckCircle } from 'lucide-react'
import SectorSpecificSections from '../../../components/SectorSpecificSections'
import { vaspApiClient } from '../../../lib/vasp-api'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface Company {
  id: string
  name: string
  slug: string
  sectors: string[]
}

export default function SectorDataPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sector = searchParams.get('sector') || 'exchange-services'
  
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [sectorData, setSectorData] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [completedCompanies, setCompletedCompanies] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadCompanies()
  }, [sector])

  const loadCompanies = async () => {
    try {
      setLoading(true)
      // Get companies by sector
      const companiesData = await vaspApiClient.getCompaniesByCategory('exchange-services')
      setCompanies(companiesData.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        sectors: c.sectors || ['exchange-services']
      })))
      
      if (companiesData.length > 0) {
        setSelectedCompany({
          id: companiesData[0].id,
          name: companiesData[0].name,
          slug: companiesData[0].slug,
          sectors: companiesData[0].sectors || ['exchange-services']
        })
      }
    } catch (err) {
      setError('Failed to load companies')
    } finally {
      setLoading(false)
    }
  }

  const handleSectorDataChange = (sectorSlug: string, field: string, value: any) => {
    if (!selectedCompany) return
    
    setSectorData((prev: any) => ({
      ...prev,
      [selectedCompany.id]: {
        ...prev[selectedCompany.id],
        [sectorSlug]: {
          ...prev[selectedCompany.id]?.[sectorSlug],
          [field]: value
        }
      }
    }))
  }

  const saveSectorData = async () => {
    if (!selectedCompany) return

    try {
      setSaving(true)
      setError(null)

      const companyData = sectorData[selectedCompany.id]
      if (!companyData) {
        setError('No data to save')
        return
      }

      // Save sector-specific data
      for (const sectorSlug of selectedCompany.sectors) {
        const data = companyData[sectorSlug]
        if (data && Object.keys(data).length > 0) {
          // In a real implementation, save to appropriate sector-specific table
          console.log(`Saving ${sectorSlug} data for ${selectedCompany.name}:`, data)
        }
      }

      setCompletedCompanies(prev => new Set([...Array.from(prev), selectedCompany.id]))
      setSuccess(`Sector data saved for ${selectedCompany.name}`)
      
      setTimeout(() => setSuccess(null), 3000)

    } catch (err) {
      setError('Failed to save sector data')
    } finally {
      setSaving(false)
    }
  }

  const selectNextCompany = () => {
    if (!selectedCompany) return
    
    const currentIndex = companies.findIndex(c => c.id === selectedCompany.id)
    const nextIndex = (currentIndex + 1) % companies.length
    setSelectedCompany(companies[nextIndex])
  }

  const getSectorDisplayName = (slug: string) => {
    const sectorNames: { [key: string]: string } = {
      'exchange-services': 'Exchange Services',
      'advisory-services': 'Advisory Services',
      'broker-dealer-services': 'Broker-Dealer Services',
      'custody-services': 'Custody Services',
      'lending-borrowing': 'Lending & Borrowing',
      'derivatives': 'Virtual Asset Derivatives',
      'asset-management': 'Asset Management',
      'transfer-settlement': 'Transfer & Settlement',
      'fiat-tokens': 'Fiat Referenced Tokens',
      'asset-tokens': 'Asset Referenced Tokens'
    }
    return sectorNames[slug] || slug
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
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
                onClick={() => router.push('/admin')}
                className="mr-4 p-2 text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Sector-Specific Data Configuration
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {success && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Company List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-medium text-gray-900">
                  {getSectorDisplayName(sector)} Companies
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {completedCompanies.size}/{companies.length} completed
                </p>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {companies.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => setSelectedCompany(company)}
                    className={`w-full text-left p-4 border-b hover:bg-gray-50 flex items-center justify-between ${
                      selectedCompany?.id === company.id ? 'bg-indigo-50 border-indigo-200' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{company.name}</p>
                        <p className="text-sm text-gray-500">{company.sectors.length} sector(s)</p>
                      </div>
                    </div>
                    {completedCompanies.has(company.id) && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sector Data Form */}
          <div className="lg:col-span-3">
            {selectedCompany ? (
              <div>
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {selectedCompany.name}
                      </h2>
                      <p className="text-gray-600">
                        Configure sector-specific data for regulatory compliance
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={selectNextCompany}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        Next Company
                      </button>
                      <button
                        onClick={saveSectorData}
                        disabled={saving}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center"
                      >
                        {saving ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <Settings className="h-4 w-4 mr-2" />
                        )}
                        Save Data
                      </button>
                    </div>
                  </div>
                </div>

                <SectorSpecificSections
                  selectedSectors={selectedCompany.sectors}
                  data={sectorData[selectedCompany.id] || {}}
                  onChange={handleSectorDataChange}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Company Selected
                </h3>
                <p className="text-gray-600">
                  Select a company from the list to configure its sector-specific data.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
