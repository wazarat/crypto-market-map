'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, ExternalLink, Building2, Globe, Grid3X3, Table } from 'lucide-react'
import { unifiedApiClient } from '../../../lib/unified-api'
import { Sector } from '../../../lib/api'

export default function SectorPage() {
  const params = useParams()
  const slug = params?.slug as string
  
  const [sector, setSector] = useState<Sector | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  useEffect(() => {
    const fetchSector = async () => {
      try {
        const data = await unifiedApiClient.getSector(slug)
        setSector(data as Sector)
      } catch (err) {
        setError('Failed to load sector')
        console.error('Error fetching sector:', err)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchSector()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sector details...</p>
        </div>
      </div>
    )
  }

  if (error || !sector) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Sector not found'}</p>
          <Link 
            href="/" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back
              </Link>
              <Building2 className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{sector.name}</h1>
                <p className="text-sm text-gray-600">{sector.company_count} companies</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sector Description */}
        {sector.description && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">About This Sector</h2>
            <p className="text-gray-600">{sector.description}</p>
          </div>
        )}

        {/* Companies Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Companies in {sector.name}</h2>
            
            {/* View Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Table className="h-4 w-4 mr-2" />
                Table
              </button>
            </div>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sector.companies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          )}

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Year Founded
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Founder/CEO
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Headquarters
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Website
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Verification Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sector.companies.map((company: any) => (
                      <tr key={company.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {company.logo_url && (
                              <img 
                                src={company.logo_url} 
                                alt={company.name} 
                                className="w-8 h-8 rounded-lg mr-3"
                              />
                            )}
                            <Link 
                              href={`/company/${company.slug}`}
                              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                            >
                              {company.name}
                            </Link>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {company.year_founded || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {company.founder_ceo_name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {company.headquarters_location || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {company.website ? (
                            <a 
                              href={company.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-700 flex items-center"
                            >
                              <Globe className="h-4 w-4 mr-1" />
                              {(() => {
                                try {
                                  return new URL(company.website).hostname
                                } catch {
                                  return company.website
                                }
                              })()}
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            company.verification_status === 'Verified' 
                              ? 'bg-green-100 text-green-800'
                              : company.verification_status === 'Under Review'
                              ? 'bg-blue-100 text-blue-800'
                              : company.verification_status === 'Rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {company.verification_status || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function CompanyCard({ company }: { company: any }) {
  return (
    <Link href={`/company/${company.slug}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-indigo-200 transition-all duration-200 cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            {company.logo_url && (
              <img 
                src={company.logo_url} 
                alt={company.name} 
                className="w-10 h-10 rounded-lg mr-3"
              />
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
              {company.website && (
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Globe className="h-3 w-3 mr-1" />
                  <span>{(() => {
                    try {
                      return new URL(company.website).hostname
                    } catch {
                      return company.website
                    }
                  })()}</span>
                </div>
              )}
            </div>
          </div>
          <ExternalLink className="h-4 w-4 text-gray-400" />
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-3">{company.short_summary}</p>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700">
            View details
            <ExternalLink className="ml-1 h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  )
}
