'use client'

import { useState, useEffect } from 'react'
import { Save, Plus, X, Building2, Users, Calendar, Mail, Phone, Globe, Twitter, Linkedin, FileText, Shield, DollarSign, CheckCircle, AlertCircle } from 'lucide-react'

// Types for the enhanced company data
interface CompanyFormData {
  // Basic Information
  name: string
  sectors: string[] // Multiple sectors
  year_founded: number | null
  founder_ceo_name: string
  headquarters_location: string
  pakistan_operations: boolean
  
  // Contact Information
  website: string
  contact_email: string
  contact_phone: string
  point_of_contact_email: string
  point_of_contact_phone: string
  
  // Business Information
  employee_count: number | null
  private_company: boolean
  public_company: boolean
  key_partnerships: string[]
  company_description: string
  company_overview: string
  
  // Social Media
  social_media_twitter: string
  social_media_linkedin: string
  social_media_facebook: string
  
  // Regulatory Information
  secp_registration_number: string
  pvara_license_number: string
  license_status: string
  verification_status: string
  
  // Additional fields
  logo_url: string
}

interface Sector {
  id: string
  name: string
  slug: string
  description: string
}

interface CompanyFormProps {
  initialData?: Partial<CompanyFormData>
  onSave: (data: CompanyFormData) => Promise<void>
  onCancel: () => void
  isEditing?: boolean
}

const LICENSE_STATUS_OPTIONS = [
  'None',
  'Applied', 
  'Under Review',
  'Granted',
  'Suspended'
]

const VERIFICATION_STATUS_OPTIONS = [
  'Pending',
  'Verified', 
  'Under Review',
  'Rejected'
]

export default function CompanyForm({ initialData, onSave, onCancel, isEditing = false }: CompanyFormProps) {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    sectors: [],
    year_founded: null,
    founder_ceo_name: '',
    headquarters_location: '',
    pakistan_operations: true,
    website: '',
    contact_email: '',
    contact_phone: '',
    point_of_contact_email: '',
    point_of_contact_phone: '',
    employee_count: null,
    private_company: false,
    public_company: false,
    key_partnerships: [],
    company_description: '',
    company_overview: '',
    social_media_twitter: '',
    social_media_linkedin: '',
    social_media_facebook: '',
    secp_registration_number: '',
    pvara_license_number: '',
    license_status: 'None',
    verification_status: 'Pending',
    logo_url: '',
    ...initialData
  })

  const [sectors, setSectors] = useState<Sector[]>([])
  const [newPartnership, setNewPartnership] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load available sectors
  useEffect(() => {
    // Mock sectors - in real app, fetch from API
    setSectors([
      { id: '1', name: 'Advisory Services', slug: 'advisory-services', description: 'Professional advisory and consulting services' },
      { id: '2', name: 'Broker-Dealer Services', slug: 'broker-dealer-services', description: 'Licensed broker-dealer services' },
      { id: '3', name: 'Custody Services', slug: 'custody-services', description: 'Secure storage and custody solutions' },
      { id: '4', name: 'Exchange Services', slug: 'exchange-services', description: 'Cryptocurrency exchanges and trading platforms' },
      { id: '5', name: 'Lending and Borrowing Services', slug: 'lending-borrowing', description: 'DeFi and CeFi lending platforms' },
      { id: '6', name: 'Virtual Asset Derivative Services', slug: 'derivatives', description: 'Futures, options, and derivative trading' },
      { id: '7', name: 'Virtual Asset Management and Investment Services', slug: 'asset-management', description: 'Investment funds and asset management' },
      { id: '8', name: 'Virtual Asset Transfer and Settlement Services', slug: 'transfer-settlement', description: 'Payment processing and settlement' },
      { id: '9', name: 'Fiat Referenced Token Issuance Services', slug: 'fiat-tokens', description: 'Stablecoins and fiat-backed currencies' },
      { id: '10', name: 'Asset Referenced Token Issuance Services', slug: 'asset-tokens', description: 'Tokenization of real-world assets' }
    ])
  }, [])

  const handleInputChange = (field: keyof CompanyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSectorToggle = (sectorSlug: string) => {
    setFormData(prev => ({
      ...prev,
      sectors: prev.sectors.includes(sectorSlug)
        ? prev.sectors.filter(s => s !== sectorSlug)
        : [...prev.sectors, sectorSlug]
    }))
  }

  const addPartnership = () => {
    if (newPartnership.trim()) {
      setFormData(prev => ({
        ...prev,
        key_partnerships: [...prev.key_partnerships, newPartnership.trim()]
      }))
      setNewPartnership('')
    }
  }

  const removePartnership = (index: number) => {
    setFormData(prev => ({
      ...prev,
      key_partnerships: prev.key_partnerships.filter((_, i) => i !== index)
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Company name is required'
    if (formData.sectors.length === 0) newErrors.sectors = 'At least one sector must be selected'
    if (!formData.headquarters_location.trim()) newErrors.headquarters_location = 'Headquarters location is required'
    if (!formData.company_description.trim()) newErrors.company_description = 'Company description is required'

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.contact_email && !emailRegex.test(formData.contact_email)) {
      newErrors.contact_email = 'Invalid email format'
    }
    if (formData.point_of_contact_email && !emailRegex.test(formData.point_of_contact_email)) {
      newErrors.point_of_contact_email = 'Invalid email format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    try {
      await onSave(formData)
    } catch (error) {
      console.error('Error saving company:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Building2 className="mr-2 h-6 w-6 text-indigo-600" />
          {isEditing ? 'Edit Company' : 'Add New Company'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Building2 className="mr-2 h-5 w-5" />
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter company name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline mr-1 h-4 w-4" />
                Year Founded
              </label>
              <input
                type="number"
                value={formData.year_founded || ''}
                onChange={(e) => handleInputChange('year_founded', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 2020"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Founder/CEO Name
              </label>
              <input
                type="text"
                value={formData.founder_ceo_name}
                onChange={(e) => handleInputChange('founder_ceo_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter founder or CEO name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Headquarters Location *
              </label>
              <input
                type="text"
                value={formData.headquarters_location}
                onChange={(e) => handleInputChange('headquarters_location', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.headquarters_location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Karachi, Pakistan"
              />
              {errors.headquarters_location && <p className="text-red-500 text-sm mt-1">{errors.headquarters_location}</p>}
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.pakistan_operations}
                onChange={(e) => handleInputChange('pakistan_operations', e.target.checked)}
                className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Has operations in Pakistan</span>
            </label>
          </div>
        </div>

        {/* Sectors Selection */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sectors *
          </h3>
          <p className="text-sm text-gray-600 mb-4">Select all sectors this company operates in:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sectors.map((sector) => (
              <label key={sector.id} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sectors.includes(sector.slug)}
                  onChange={() => handleSectorToggle(sector.slug)}
                  className="mr-3 mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <div>
                  <div className="font-medium text-gray-900">{sector.name}</div>
                  <div className="text-sm text-gray-600">{sector.description}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.sectors && <p className="text-red-500 text-sm mt-2">{errors.sectors}</p>}
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Mail className="mr-2 h-5 w-5" />
            Contact Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Globe className="inline mr-1 h-4 w-4" />
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Mail className="inline mr-1 h-4 w-4" />
                General Contact Email
              </label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.contact_email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="info@company.com"
              />
              {errors.contact_email && <p className="text-red-500 text-sm mt-1">{errors.contact_email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="inline mr-1 h-4 w-4" />
                General Contact Phone
              </label>
              <input
                type="tel"
                value={formData.contact_phone}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="+92-21-111-000-000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Point of Contact Email
              </label>
              <input
                type="email"
                value={formData.point_of_contact_email}
                onChange={(e) => handleInputChange('point_of_contact_email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.point_of_contact_email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="contact@company.com"
              />
              {errors.point_of_contact_email && <p className="text-red-500 text-sm mt-1">{errors.point_of_contact_email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Point of Contact Phone
              </label>
              <input
                type="tel"
                value={formData.point_of_contact_phone}
                onChange={(e) => handleInputChange('point_of_contact_phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="+92-300-0000000"
              />
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Business Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Users className="inline mr-1 h-4 w-4" />
                Number of Employees
              </label>
              <input
                type="number"
                value={formData.employee_count || ''}
                onChange={(e) => handleInputChange('employee_count', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 50"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Building2 className="inline mr-1 h-4 w-4" />
                Company Type
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.private_company}
                    onChange={(e) => handleInputChange('private_company', e.target.checked)}
                    className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Private Company</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.public_company}
                    onChange={(e) => handleInputChange('public_company', e.target.checked)}
                    className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Public Company (Publicly Traded)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Description *
            </label>
            <textarea
              value={formData.company_description}
              onChange={(e) => handleInputChange('company_description', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.company_description ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={3}
              placeholder="Brief description of the company's main services and operations"
            />
            {errors.company_description && <p className="text-red-500 text-sm mt-1">{errors.company_description}</p>}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Overview
            </label>
            <textarea
              value={formData.company_overview}
              onChange={(e) => handleInputChange('company_overview', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
              placeholder="Detailed overview of company operations, market position, and strategic focus"
            />
          </div>

          {/* Key Partnerships */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key Partnerships/Alliances
            </label>
            
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newPartnership}
                onChange={(e) => setNewPartnership(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Add partnership or alliance"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPartnership())}
              />
              <button
                type="button"
                onClick={addPartnership}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              {formData.key_partnerships.map((partnership, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                  <span className="text-sm">{partnership}</span>
                  <button
                    type="button"
                    onClick={() => removePartnership(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Twitter className="mr-2 h-5 w-5" />
            Social Media Handles
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Twitter className="inline mr-1 h-4 w-4" />
                Twitter/X Handle
              </label>
              <input
                type="text"
                value={formData.social_media_twitter}
                onChange={(e) => handleInputChange('social_media_twitter', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="@company"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Linkedin className="inline mr-1 h-4 w-4" />
                LinkedIn URL
              </label>
              <input
                type="url"
                value={formData.social_media_linkedin}
                onChange={(e) => handleInputChange('social_media_linkedin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://linkedin.com/company/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook URL
              </label>
              <input
                type="url"
                value={formData.social_media_facebook}
                onChange={(e) => handleInputChange('social_media_facebook', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://facebook.com/..."
              />
            </div>
          </div>
        </div>

        {/* Regulatory Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Regulatory Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FileText className="inline mr-1 h-4 w-4" />
                SECP Registration Number
              </label>
              <input
                type="text"
                value={formData.secp_registration_number}
                onChange={(e) => handleInputChange('secp_registration_number', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="SECP-YYYY-XXX-###"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Shield className="inline mr-1 h-4 w-4" />
                PVARA License Number
              </label>
              <input
                type="text"
                value={formData.pvara_license_number}
                onChange={(e) => handleInputChange('pvara_license_number', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="PVARA-YYYY-###"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Status
              </label>
              <select
                value={formData.license_status}
                onChange={(e) => handleInputChange('license_status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {LICENSE_STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verification Status
              </label>
              <select
                value={formData.verification_status}
                onChange={(e) => handleInputChange('verification_status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {VERIFICATION_STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Saving...' : 'Save Company'}
          </button>
        </div>
      </form>
    </div>
  )
}
