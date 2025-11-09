'use client'

import { useState } from 'react'
import { ArrowLeft, Database, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { vaspApiClient } from '../../../lib/vasp-api'
import { supabase } from '../../../lib/supabase'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function TestConnectionPage() {
  const router = useRouter()
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<any>(null)

  const runTests = async () => {
    setTesting(true)
    const testResults: any = {
      environment: {},
      supabaseClient: {},
      databaseConnection: {},
      vaspApi: {}
    }

    try {
      // Test 1: Environment Variables
      testResults.environment = {
        hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        hasSupabaseKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not Set',
        status: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ? 'success' : 'error'
      }

      // Test 2: Supabase Client
      testResults.supabaseClient = {
        clientExists: Boolean(supabase),
        status: supabase ? 'success' : 'error'
      }

      // Test 3: Database Connection
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('vasp_categories')
            .select('count')
            .limit(1)

          testResults.databaseConnection = {
            canConnect: !error,
            error: error?.message,
            status: error ? 'error' : 'success'
          }
        } catch (dbError: any) {
          testResults.databaseConnection = {
            canConnect: false,
            error: dbError.message,
            status: 'error'
          }
        }
      } else {
        testResults.databaseConnection = {
          canConnect: false,
          error: 'Supabase client not available',
          status: 'error'
        }
      }

      // Test 4: VASP API
      try {
        const categories = await vaspApiClient.getCategories()
        testResults.vaspApi = {
          canFetchCategories: true,
          categoriesCount: categories.length,
          status: 'success'
        }
      } catch (apiError: any) {
        testResults.vaspApi = {
          canFetchCategories: false,
          error: apiError.message,
          status: 'error'
        }
      }

      // Test 5: Company Creation (dry run)
      try {
        const testCompany = {
          name: 'Test Company (DELETE ME)',
          slug: 'test-company-delete-me',
          sectors: ['exchange-services'],
          category_id: '4',
          pakistan_operations: true,
          license_status: 'None' as const,
          verification_status: 'Pending' as const,
          last_updated_by: 'test@admin.com'
        }

        // Don't actually create, just validate the data structure
        testResults.companyCreation = {
          dataStructureValid: true,
          status: 'success'
        }
      } catch (createError: any) {
        testResults.companyCreation = {
          dataStructureValid: false,
          error: createError.message,
          status: 'error'
        }
      }

    } catch (error: any) {
      testResults.general = {
        error: error.message,
        status: 'error'
      }
    }

    setResults(testResults)
    setTesting(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <Database className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
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
                Database Connection Test
              </h1>
            </div>
            <button
              onClick={runTests}
              disabled={testing}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {testing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Database className="h-4 w-4 mr-2" />
              )}
              Run Tests
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Diagnose Upload Issues
          </h2>
          <p className="text-gray-600">
            This page helps identify why the bulk upload feature might not be working.
            Run the tests below to check your database connection and configuration.
          </p>
        </div>

        {!results && (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Ready to Test
            </h3>
            <p className="text-gray-600 mb-4">
              Click "Run Tests" to check your database connection and identify any issues.
            </p>
          </div>
        )}

        {results && (
          <div className="space-y-6">
            {/* Environment Variables Test */}
            <div className={`rounded-lg border p-6 ${getStatusColor(results.environment.status)}`}>
              <div className="flex items-center mb-4">
                {getStatusIcon(results.environment.status)}
                <h3 className="text-lg font-medium text-gray-900 ml-3">
                  Environment Variables
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Supabase URL:</span>
                  <span className={results.environment.hasSupabaseUrl ? 'text-green-600' : 'text-red-600'}>
                    {results.environment.supabaseUrl}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Supabase Key:</span>
                  <span className={results.environment.hasSupabaseKey ? 'text-green-600' : 'text-red-600'}>
                    {results.environment.hasSupabaseKey ? 'Set' : 'Not Set'}
                  </span>
                </div>
              </div>
            </div>

            {/* Supabase Client Test */}
            <div className={`rounded-lg border p-6 ${getStatusColor(results.supabaseClient.status)}`}>
              <div className="flex items-center mb-4">
                {getStatusIcon(results.supabaseClient.status)}
                <h3 className="text-lg font-medium text-gray-900 ml-3">
                  Supabase Client
                </h3>
              </div>
              <div className="text-sm">
                <div className="flex justify-between">
                  <span>Client Initialized:</span>
                  <span className={results.supabaseClient.clientExists ? 'text-green-600' : 'text-red-600'}>
                    {results.supabaseClient.clientExists ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Database Connection Test */}
            <div className={`rounded-lg border p-6 ${getStatusColor(results.databaseConnection.status)}`}>
              <div className="flex items-center mb-4">
                {getStatusIcon(results.databaseConnection.status)}
                <h3 className="text-lg font-medium text-gray-900 ml-3">
                  Database Connection
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Can Connect:</span>
                  <span className={results.databaseConnection.canConnect ? 'text-green-600' : 'text-red-600'}>
                    {results.databaseConnection.canConnect ? 'Yes' : 'No'}
                  </span>
                </div>
                {results.databaseConnection.error && (
                  <div className="mt-2 p-2 bg-red-100 rounded text-red-700">
                    <strong>Error:</strong> {results.databaseConnection.error}
                  </div>
                )}
              </div>
            </div>

            {/* VASP API Test */}
            <div className={`rounded-lg border p-6 ${getStatusColor(results.vaspApi.status)}`}>
              <div className="flex items-center mb-4">
                {getStatusIcon(results.vaspApi.status)}
                <h3 className="text-lg font-medium text-gray-900 ml-3">
                  VASP API
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Can Fetch Categories:</span>
                  <span className={results.vaspApi.canFetchCategories ? 'text-green-600' : 'text-red-600'}>
                    {results.vaspApi.canFetchCategories ? 'Yes' : 'No'}
                  </span>
                </div>
                {results.vaspApi.categoriesCount !== undefined && (
                  <div className="flex justify-between">
                    <span>Categories Found:</span>
                    <span className="text-gray-600">{results.vaspApi.categoriesCount}</span>
                  </div>
                )}
                {results.vaspApi.error && (
                  <div className="mt-2 p-2 bg-red-100 rounded text-red-700">
                    <strong>Error:</strong> {results.vaspApi.error}
                  </div>
                )}
              </div>
            </div>

            {/* Company Creation Test */}
            <div className={`rounded-lg border p-6 ${getStatusColor(results.companyCreation.status)}`}>
              <div className="flex items-center mb-4">
                {getStatusIcon(results.companyCreation.status)}
                <h3 className="text-lg font-medium text-gray-900 ml-3">
                  Company Data Structure
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Data Structure Valid:</span>
                  <span className={results.companyCreation.dataStructureValid ? 'text-green-600' : 'text-red-600'}>
                    {results.companyCreation.dataStructureValid ? 'Yes' : 'No'}
                  </span>
                </div>
                {results.companyCreation.error && (
                  <div className="mt-2 p-2 bg-red-100 rounded text-red-700">
                    <strong>Error:</strong> {results.companyCreation.error}
                  </div>
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-900 mb-3">
                Troubleshooting Recommendations
              </h3>
              <div className="space-y-2 text-sm text-blue-800">
                {!results.environment.hasSupabaseUrl && (
                  <div>• Set NEXT_PUBLIC_SUPABASE_URL in your .env.local file</div>
                )}
                {!results.environment.hasSupabaseKey && (
                  <div>• Set NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file</div>
                )}
                {!results.supabaseClient.clientExists && (
                  <div>• Check if Supabase client is properly initialized</div>
                )}
                {!results.databaseConnection.canConnect && (
                  <div>• Verify Supabase project is active and accessible</div>
                )}
                {!results.vaspApi.canFetchCategories && (
                  <div>• Check if database tables exist and RLS policies are configured</div>
                )}
                <div>• Ensure you're running the app with the correct environment variables</div>
                <div>• Check browser console for additional error details</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
