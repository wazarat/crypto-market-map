'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, ExternalLink, Building2, Globe, Grid3X3, Table, Search, Filter, MapPin, Calendar, User, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { unifiedApiClient } from '../../../lib/unified-api'
import { Sector } from '../../../lib/api'

export default function SectorPage() {
  const params = useParams()
  const slug = params?.slug as string
  
  const [sector, setSector] = useState<Sector | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [yearFilter, setYearFilter] = useState('')

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

  // Filter companies based on search and filter criteria
  const filteredCompanies = sector?.companies.filter((company: any) => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (company.founder_ceo_name && company.founder_ceo_name.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesLocation = !locationFilter || 
                           (company.headquarters_location && company.headquarters_location.toLowerCase().includes(locationFilter.toLowerCase()))
    
    const matchesStatus = !statusFilter || company.verification_status === statusFilter
    
    const matchesYear = !yearFilter || 
                       (company.year_founded && company.year_founded.toString() === yearFilter)
    
    return matchesSearch && matchesLocation && matchesStatus && matchesYear
  }) || []

  // Get unique values for filter options
  const uniqueLocations = sector ? Array.from(new Set(sector.companies.map((c: any) => c.headquarters_location).filter(Boolean))) : []
  const uniqueStatuses = sector ? Array.from(new Set(sector.companies.map((c: any) => c.verification_status).filter(Boolean))) : []
  const uniqueYears = sector ? Array.from(new Set(sector.companies.map((c: any) => c.year_founded).filter(Boolean))).sort((a, b) => b - a) : []

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Enhanced Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white/60 backdrop-blur-xl border-b border-white/20 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 mr-6 transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="font-medium">Back</span>
              </Link>
              
              <div className="flex items-center">
                <motion.div 
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-4 shadow-lg"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Building2 className="h-6 w-6 text-white" />
                </motion.div>
                <div>
                  <motion.h1 
                    className="text-2xl font-bold font-inter-tight bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    {sector.name}
                  </motion.h1>
                  <motion.p 
                    className="text-sm text-gray-600 flex items-center mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-2">
                      {filteredCompanies.length} companies
                    </span>
                    {filteredCompanies.length !== sector.company_count && (
                      <span className="text-xs text-gray-500">
                        (filtered from {sector.company_count})
                      </span>
                    )}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sector Description */}
        {sector.description && (
          <motion.div 
            className="bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-3">About This Sector</h2>
            <p className="text-gray-600 leading-relaxed">{sector.description}</p>
          </motion.div>
        )}

        {/* Search and Filters */}
        <motion.div 
          className="bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search companies or founders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-sm"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-sm"
              >
                <option value="">All Statuses</option>
                {uniqueStatuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-sm"
              >
                <option value="">All Years</option>
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              {(searchTerm || locationFilter || statusFilter || yearFilter) && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setLocationFilter('')
                    setStatusFilter('')
                    setYearFilter('')
                  }}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Companies Section */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-inter-tight bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
              Companies in {sector.name}
            </h2>
            
            {/* View Toggle */}
            <div className="flex items-center space-x-2 bg-white/40 backdrop-blur-md border border-white/20 rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-white/80 text-gray-900 shadow-sm backdrop-blur-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/20'
                }`}
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  viewMode === 'table'
                    ? 'bg-white/80 text-gray-900 shadow-sm backdrop-blur-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/20'
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
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company, index) => (
                  <motion.div
                    key={company.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <CompanyCard company={company} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No companies match your current filters.</p>
                </div>
              )}
            </div>
          )}

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200/50">
                  <thead className="bg-gray-50/50 backdrop-blur-sm">
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
                  <tbody className="bg-white/20 backdrop-blur-sm divide-y divide-gray-200/50">
                    {filteredCompanies.length > 0 ? (
                      filteredCompanies.map((company: any, index) => (
                        <motion.tr 
                          key={company.id} 
                          className="hover:bg-white/30 transition-colors duration-200"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
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
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                              >
                                {company.name}
                              </Link>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                              {company.year_founded || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-gray-400" />
                              {company.founder_ceo_name || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                              {company.headquarters_location || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {company.website ? (
                              <a 
                                href={company.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-700 flex items-center transition-colors"
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
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                              company.verification_status === 'Verified' 
                                ? 'bg-green-100 text-green-800'
                                : company.verification_status === 'Under Review'
                                ? 'bg-blue-100 text-blue-800'
                                : company.verification_status === 'Rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {company.verification_status === 'Verified' && <CheckCircle className="h-3 w-3 mr-1" />}
                              {company.verification_status === 'Under Review' && <Clock className="h-3 w-3 mr-1" />}
                              {company.verification_status === 'Rejected' && <XCircle className="h-3 w-3 mr-1" />}
                              {(!company.verification_status || company.verification_status === 'Pending') && <AlertCircle className="h-3 w-3 mr-1" />}
                              {company.verification_status || 'Pending'}
                            </span>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          No companies match your current filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}

function CompanyCard({ company }: { company: any }) {
  return (
    <Link href={`/company/${company.slug}`}>
      <motion.div 
        className="group relative bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 hover:shadow-xl hover:border-white/40 hover:bg-white/50 transition-all duration-300 cursor-pointer overflow-hidden"
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center flex-1">
              {company.logo_url && (
                <motion.img 
                  src={company.logo_url} 
                  alt={company.name} 
                  className="w-12 h-12 rounded-xl mr-4 shadow-sm"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-900 transition-colors leading-tight">
                  {company.name}
                </h3>
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
                {company.headquarters_location && (
                  <div className="flex items-center text-xs text-gray-400 mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{company.headquarters_location}</span>
                  </div>
                )}
              </div>
            </div>
            <motion.div
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              whileHover={{ scale: 1.2, rotate: 15 }}
            >
              <ExternalLink className="h-4 w-4 text-indigo-500" />
            </motion.div>
          </div>
          
          {company.short_summary && (
            <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
              {company.short_summary}
            </p>
          )}

          <div className="flex items-center justify-between">
            {company.verification_status && (
              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                company.verification_status === 'Verified' 
                  ? 'bg-green-100 text-green-800'
                  : company.verification_status === 'Under Review'
                  ? 'bg-blue-100 text-blue-800'
                  : company.verification_status === 'Rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {company.verification_status === 'Verified' && <CheckCircle className="h-3 w-3 mr-1" />}
                {company.verification_status === 'Under Review' && <Clock className="h-3 w-3 mr-1" />}
                {company.verification_status === 'Rejected' && <XCircle className="h-3 w-3 mr-1" />}
                {(!company.verification_status || company.verification_status === 'Pending') && <AlertCircle className="h-3 w-3 mr-1" />}
                {company.verification_status || 'Pending'}
              </span>
            )}
            
            <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700 transition-colors">
              View details →
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
