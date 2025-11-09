'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, AlertCircle } from 'lucide-react'

interface CSVImportProps {
  onImport: (companies: any[]) => void
}

export default function CSVImport({ onImport }: CSVImportProps) {
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      setError('Please select a CSV file')
      return
    }

    setImporting(true)
    setError(null)

    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      
      if (lines.length < 2) {
        setError('CSV file must contain at least a header row and one data row')
        return
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
      const companies = []

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
        const company: any = { key_partnerships: [] }

        headers.forEach((header, index) => {
          const value = values[index] || ''
          
          switch (header.toLowerCase()) {
            case 'company name':
              company.name = value
              break
            case 'year founded':
              company.year_founded = value ? parseInt(value) : null
              break
            case 'founder/ceo':
              company.founder_ceo_name = value
              break
            case 'headquarters':
              company.headquarters_location = value
              break
            case 'website':
              company.website = value
              break
            case 'contact email':
              company.contact_email = value
              break
            case 'contact phone':
              company.contact_phone = value
              break
            case 'point of contact email':
              company.point_of_contact_email = value
              break
            case 'point of contact phone':
              company.point_of_contact_phone = value
              break
            case 'twitter':
              company.social_media_twitter = value
              break
            case 'linkedin':
              company.social_media_linkedin = value
              break
            case 'facebook':
              company.social_media_facebook = value
              break
            case 'employees':
              company.employee_count = value ? parseInt(value) : null
              break
            case 'funding (pkr)':
              company.total_funding_pkr = value ? parseInt(value) : null
              break
            case 'partnerships':
              company.key_partnerships = value ? value.split(';').map(p => p.trim()).filter(p => p) : []
              break
            case 'description':
              company.company_description = value
              break
            case 'overview':
              company.company_overview = value
              break
            case 'secp number':
              company.secp_registration_number = value
              break
            case 'pvara number':
              company.pvara_license_number = value
              break
            case 'license status':
              company.license_status = value
              break
            case 'verification status':
              company.verification_status = value
              break
          }
        })

        if (company.name) {
          companies.push(company)
        }
      }

      if (companies.length === 0) {
        setError('No valid companies found in CSV file')
        return
      }

      if (companies.length > 100) {
        setError(`CSV contains ${companies.length} companies. Maximum allowed is 100.`)
        return
      }

      onImport(companies)
      
    } catch (err) {
      setError('Failed to parse CSV file. Please check the format.')
    } finally {
      setImporting(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const downloadTemplate = () => {
    const headers = [
      'Company Name', 'Year Founded', 'Founder/CEO', 'Headquarters', 'Website',
      'Contact Email', 'Contact Phone', 'Point of Contact Email', 'Point of Contact Phone',
      'Twitter', 'LinkedIn', 'Facebook', 'Employees', 'Funding (PKR)',
      'Partnerships', 'Description', 'Overview', 'SECP Number', 'PVARA Number',
      'License Status', 'Verification Status'
    ]

    const sampleData = [
      'Binance Pakistan', '2017', 'Changpeng Zhao', 'Karachi, Pakistan', 'https://binance.com',
      'support@binance.pk', '+92-21-1234567', 'business@binance.pk', '+92-21-7654321',
      '@BinancePakistan', 'https://linkedin.com/company/binance', 'https://facebook.com/binance',
      '150', '5000000000', 'State Bank of Pakistan; HBL Bank', 'Leading crypto exchange',
      'Comprehensive trading platform for digital assets', 'SECP-2017-001', 'PVARA-2024-001',
      'Granted', 'Verified'
    ]

    const csvContent = [headers.join(','), sampleData.join(',')].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'exchange-companies-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Import from CSV</h3>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={downloadTemplate}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            <FileText className="h-4 w-4 mr-2" />
            Download Template
          </button>
          
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400"
            >
              {importing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                  Importing...
                </div>
              ) : (
                <div className="flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose CSV File
                </div>
              )}
            </label>
          </div>
        </div>

        {error && (
          <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        <div className="text-sm text-gray-600">
          <p><strong>CSV Format Requirements:</strong></p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>First row must contain column headers</li>
            <li>Company Name column is required</li>
            <li>Maximum 100 companies per file</li>
            <li>Use semicolons (;) to separate multiple partnerships</li>
            <li>Download the template for correct format</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
