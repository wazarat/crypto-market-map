'use client'

import Link from 'next/link'
import { Upload, Building2, Settings, Database, FileText, Users } from 'lucide-react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function AdminDashboard() {
  const adminFeatures = [
    {
      title: 'Bulk Upload Companies',
      description: 'Add up to 100 exchange services companies with comprehensive data fields',
      icon: Upload,
      href: '/admin/bulk-upload',
      color: 'bg-blue-500',
      features: [
        'CSV import/export functionality',
        'Only company name required',
        'Pre-selected Exchange Services sector',
        'All regulatory fields included'
      ]
    },
    {
      title: 'Sector-Specific Data',
      description: 'Configure detailed sector-specific information for regulatory compliance',
      icon: Settings,
      href: '/admin/sector-data?sector=exchange-services',
      color: 'bg-green-500',
      features: [
        'Exchange-specific configurations',
        'Trading platform details',
        'Volume and asset tracking',
        'Compliance monitoring'
      ]
    },
    {
      title: 'Company Management',
      description: 'View, edit, and manage individual company profiles',
      icon: Building2,
      href: '/admin/companies',
      color: 'bg-purple-500',
      features: [
        'Individual company editing',
        'License status tracking',
        'Verification workflows',
        'Audit trail management'
      ]
    },
    {
      title: 'Database Overview',
      description: 'Monitor database health and regulatory compliance summary',
      icon: Database,
      href: '/admin/database',
      color: 'bg-orange-500',
      features: [
        'Compliance statistics',
        'License status overview',
        'Data quality metrics',
        'Export capabilities'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Pakistan VASP Database - Admin Panel
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">PVARA Regulations 2025</span>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to the Admin Dashboard
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl">
            Manage Pakistan's virtual asset service provider ecosystem with comprehensive tools for 
            regulatory compliance, data management, and market analysis. Built specifically for 
            PVARA Regulations 2025 requirements.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Companies</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Licensed VASPs</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Settings className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Database className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Exchange Services</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {adminFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Link
                key={index}
                href={feature.href}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 ${feature.color} rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {feature.features.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      Click to access →
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Workflow Guide */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Recommended Workflow for Exchange Services Companies
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Bulk Upload</h4>
              <p className="text-sm text-gray-600">
                Start by uploading up to 100 exchange companies with basic information. 
                Use CSV import for faster data entry.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-green-600">2</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Sector Configuration</h4>
              <p className="text-sm text-gray-600">
                Configure exchange-specific data including trading platforms, 
                supported assets, and volume metrics.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-purple-600">3</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Review & Verify</h4>
              <p className="text-sm text-gray-600">
                Review individual company profiles, update license statuses, 
                and maintain regulatory compliance tracking.
              </p>
            </div>
          </div>
        </div>

        {/* Regulatory Compliance Note */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-blue-900">
                PVARA Regulations 2025 Compliance
              </h3>
              <p className="mt-2 text-blue-800">
                This system is designed to help Canhav maintain comprehensive 
                records as required by the Virtual Asset Service Provider Regulations 2025. 
                All data fields align with Schedule III requirements for fit-and-proper assessments, 
                minimum capital requirements, and ongoing supervision obligations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
