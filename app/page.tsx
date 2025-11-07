'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ExternalLink, Building2, TrendingUp } from 'lucide-react'
import { apiClient, Sector } from '../lib/api'

export default function HomePage() {
  const [sectors, setSectors] = useState<Sector[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const data = await apiClient.getSectors()
        setSectors(data)
      } catch (err) {
        setError('Failed to load sectors')
        console.error('Error fetching sectors:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSectors()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading crypto market map...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
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
              <Building2 className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Crypto Market Map</h1>
            </div>
            <div className="flex items-center space-x-4">
              <TrendingUp className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">Industry Overview</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore the Crypto Ecosystem
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Click on a sector to discover companies and projects shaping the future of digital finance.
          </p>
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectors.map((sector) => (
            <SectorCard key={sector.id} sector={sector} />
          ))}
        </div>
      </main>
    </div>
  )
}

function SectorCard({ sector }: { sector: Sector }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-indigo-200 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{sector.name}</h3>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {sector.company_count} companies
        </span>
      </div>
      
      {sector.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{sector.description}</p>
      )}

      {/* Company Pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {sector.companies.slice(0, 6).map((company) => (
          <Link
            key={company.id}
            href={`/company/${company.slug}`}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            {company.logo_url && (
              <img 
                src={company.logo_url} 
                alt={company.name} 
                className="w-4 h-4 rounded-full mr-1"
              />
            )}
            {company.name}
          </Link>
        ))}
        {sector.companies.length > 6 && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            +{sector.companies.length - 6} more
          </span>
        )}
      </div>

      {/* View All Button */}
      <Link
        href={`/sector/${sector.slug}`}
        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        View all companies
        <ExternalLink className="ml-1 h-4 w-4" />
      </Link>
    </div>
  )
}
