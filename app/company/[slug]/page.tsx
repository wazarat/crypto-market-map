'use client'

import { useState, useEffect } from 'react'

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, ExternalLink, Building2, Globe, Calendar, Plus, Trash2, Edit } from 'lucide-react'
import { unifiedApiClient } from '../../../lib/unified-api'
import { CompanyDetail, ResearchEntry } from '../../../lib/api'
import { supabase, UserNote } from '../../../lib/supabase'
import { vaspApiClient } from '../../../lib/vasp-api'
import SectorSpecificSections from '../../../components/SectorSpecificSections'
import ChatbaseWidget from '../../../components/ChatbaseWidget'
import ChatbaseWidgetAlternative from '../../../components/ChatbaseWidgetAlternative'
import ChatbaseWidgetSimple from '../../../components/ChatbaseWidgetSimple'
import ChatbaseWidgetForced from '../../../components/ChatbaseWidgetForced'
import ChatbaseWidgetOfficial from '../../../components/ChatbaseWidgetOfficial'
import EnvDebug from '../../../components/EnvDebug'
import { chatbaseIdentity } from '../../../lib/chatbase-identity'
import { chatbaseContext } from '../../../lib/chatbase-context'
import ChatbaseDebugger from '../../../components/ChatbaseDebugger'
import { withSimpleAuth } from '../../../lib/simple-auth-context'

// Mock user ID - replace with real auth later
const MOCK_USER_ID = process.env.NEXT_PUBLIC_MOCK_USER_ID || '550e8400-e29b-41d4-a716-446655440000'

function CompanyPage() {
  const params = useParams()
  const slug = params?.slug as string
  
  const [company, setCompany] = useState<any | null>(null)
  const [research, setResearch] = useState<ResearchEntry[]>([])
  const [notes, setNotes] = useState<UserNote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newNote, setNewNote] = useState('')
  const [savingNote, setSavingNote] = useState(false)
  const [sectorSpecificData, setSectorSpecificData] = useState<any>({})
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const [companyData, researchData] = await Promise.all([
          unifiedApiClient.getCompanyDetail(slug),
          unifiedApiClient.getCompanyResearch ? unifiedApiClient.getCompanyResearch(slug) : []
        ])
        
        setCompany(companyData as CompanyDetail)
        setResearch(researchData as ResearchEntry[])
        
        // Fetch sector-specific data if using Supabase
        if (companyData && unifiedApiClient.hasVASPFeatures()) {
          try {
            const vaspCompany = await vaspApiClient.getCompanyBySlug(slug)
            if (vaspCompany?.sector_details) {
              setSectorSpecificData(vaspCompany.sector_details)
            }
          } catch (err) {
            console.log('No sector-specific data found:', err)
          }
        }
        
        // Fetch user notes from Supabase
        if (companyData) {
          await fetchNotes(companyData.id)
          
          // Set up Chatbase identity for personalized responses
          const demoUser = chatbaseIdentity.setupDemoUser()
          
          // Set company context for Chatbase immediately
          chatbaseContext.setCompanyContext(companyData, companyData.name)
          
          // Wait a bit for Chatbase to load, then identify user and refresh context
          setTimeout(() => {
            const company = companyData as any
            chatbaseIdentity.identifyWithChatbase({
              company: company.name,
              sector: company.sector_name,
              website: company.website,
              license_status: company.license_status,
              verification_status: company.verification_status
            })
            
            // Refresh context to ensure it's set
            chatbaseContext.refreshContext()
          }, 3000)
        }
      } catch (err) {
        setError('Failed to load company data')
        console.error('Error fetching company data:', err)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchCompanyData()
    }
  }, [slug])

  const fetchNotes = async (companyId: string) => {
    try {
      if (!supabase) {
        console.log('Supabase not available, skipping notes fetch')
        return
      }

      const { data, error } = await supabase
        .from('user_notes')
        .select('*')
        .eq('company_id', companyId)
        .eq('user_id', MOCK_USER_ID)
        .order('created_at', { ascending: false })

      if (error) throw error
      setNotes(data || [])
    } catch (err) {
      console.error('Error fetching notes:', err)
    }
  }

  const addNote = async () => {
    if (!newNote.trim() || !company) return

    setSavingNote(true)
    try {
      if (!supabase) {
        console.log('Supabase not available, cannot save note')
        return
      }

      const { data, error } = await supabase
        .from('user_notes')
        .insert({
          user_id: MOCK_USER_ID,
          company_id: company.id,
          note_text: newNote.trim()
        })
        .select()
        .single()

      if (error) throw error

      setNotes(prev => [data, ...prev])
      setNewNote('')
    } catch (error) {
      console.error('Error saving note:', error)
    } finally {
      setSavingNote(false)
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
    if (!company) return

    setSaving(true)
    try {
      // Save sector-specific data for each sector
      for (const sectorSlug of company.sectors || []) {
        const sectorData = sectorSpecificData[sectorSlug]
        if (sectorData && Object.keys(sectorData).length > 0) {
          // In a real implementation, you would call the appropriate API endpoint
          // based on the sector type to save the sector-specific data
          console.log(`Saving ${sectorSlug} data for company ${company.id}:`, sectorData)
        }
      }

      setIsEditing(false)
      // Show success message or refresh data
    } catch (err) {
      console.error('Error saving sector data:', err)
    } finally {
      setSaving(false)
    }
  }

  const deleteNote = async (noteId: string) => {
    try {
      if (!supabase) {
        console.log('Supabase not available, cannot delete note')
        return
      }

      const { error } = await supabase
        .from('user_notes')
        .delete()
        .eq('id', noteId)

      if (error) throw error
      
      setNotes(notes.filter(note => note.id !== noteId))
    } catch (err) {
      console.error('Error deleting note:', err)
      alert('Failed to delete note. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading company details...</p>
        </div>
      </div>
    )
  }

  if (error || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Company not found'}</p>
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
      <EnvDebug />
      <ChatbaseDebugger />
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link
                href="/"
                className="mr-4 p-2 text-gray-500 hover:text-gray-700 rounded-md"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
                <p className="text-gray-600">{company.sector_name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href={`/admin/company/${slug}/edit`}
                className="inline-flex items-center px-4 py-2 border border-indigo-300 rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Company
              </Link>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Company Info & Research */}
          <div className="lg:col-span-2 space-y-8">
            {/* Company Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">About {company.name}</h2>
              <p className="text-gray-600 mb-4">{company.short_summary}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="inline-flex items-center">
                  <Building2 className="h-4 w-4 mr-1" />
                  {company.sector_name}
                </span>
                {company.website && (
                  <span className="inline-flex items-center">
                    <Globe className="h-4 w-4 mr-1" />
                    {(() => {
                      try {
                        return new URL(company.website).hostname
                      } catch {
                        return company.website
                      }
                    })()}
                  </span>
                )}
              </div>
            </div>

            {/* Detailed Company Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Company Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 mb-3">Basic Information</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Founded:</span>
                      <span className="text-gray-900">{company.year_founded || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">CEO/Founder:</span>
                      <span className="text-gray-900">{company.founder_ceo_name || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Headquarters:</span>
                      <span className="text-gray-900">{company.headquarters_location || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Pakistan Operations:</span>
                      <span className="text-gray-900">{company.pakistan_operations ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Employees:</span>
                      <span className="text-gray-900">{company.employee_count || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 mb-3">Contact Information</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Website:</span>
                      <span className="text-gray-900">
                        {company.website ? (
                          <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700">
                            Visit Website
                          </a>
                        ) : 'Not specified'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Contact Email:</span>
                      <span className="text-gray-900">{company.contact_email || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Contact Phone:</span>
                      <span className="text-gray-900">{company.contact_phone || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                {/* Regulatory Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 mb-3">Regulatory Status</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">License Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        company.license_status === 'Granted' ? 'bg-green-100 text-green-800' :
                        company.license_status === 'Applied' ? 'bg-yellow-100 text-yellow-800' :
                        company.license_status === 'Under Review' ? 'bg-blue-100 text-blue-800' :
                        company.license_status === 'Suspended' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {company.license_status || 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Verification Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        company.verification_status === 'Verified' ? 'bg-green-100 text-green-800' :
                        company.verification_status === 'Under Review' ? 'bg-blue-100 text-blue-800' :
                        company.verification_status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {company.verification_status || 'Pending'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">SECP Registration:</span>
                      <span className="text-gray-900">{company.secp_registration_number || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">PVARA License:</span>
                      <span className="text-gray-900">{company.pvara_license_number || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                {/* Company Type & Financial Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 mb-3">Company Type & Financial Information</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Company Type:</span>
                      <span className="text-gray-900">
                        {company.public_company ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Public Company
                          </span>
                        ) : company.private_company ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Private Company
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Not specified
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">AML/CFT Rating:</span>
                      <span className="text-gray-900">{company.aml_cft_compliance_rating || 'Not assessed'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Description */}
              {(company.company_description || company.company_overview) && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {company.company_description || company.company_overview}
                  </p>
                </div>
              )}

              {/* Key Partnerships */}
              {company.key_partnerships && company.key_partnerships.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-3">Key Partnerships</h3>
                  <div className="flex flex-wrap gap-2">
                    {company.key_partnerships.map((partnership: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {partnership}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sector-Specific Details Section */}
            {company.sectors && company.sectors.length > 0 && unifiedApiClient.hasVASPFeatures() && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Sector-Specific Details</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700 border border-indigo-600 rounded-md hover:bg-indigo-50"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                {isEditing ? (
                  <div className="space-y-6">
                    <SectorSpecificSections
                      selectedSectors={company.sectors}
                      data={sectorSpecificData}
                      onChange={handleSectorDataChange}
                    />
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveSectorSpecificData}
                        disabled={saving}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center"
                      >
                        {saving ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <Edit className="h-4 w-4 mr-2" />
                        )}
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {company.sectors.map((sectorSlug: string) => {
                      const sectorData = sectorSpecificData[sectorSlug]
                      if (!sectorData || Object.keys(sectorData).length === 0) {
                        return (
                          <div key={sectorSlug} className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-medium text-gray-900 mb-2 capitalize">
                              {sectorSlug.replace('-', ' ')} Details
                            </h3>
                            <p className="text-gray-500 text-sm">
                              No sector-specific details available. Click "Edit" to add information.
                            </p>
                          </div>
                        )
                      }

                      return (
                        <div key={sectorSlug} className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-medium text-gray-900 mb-3 capitalize">
                            {sectorSlug.replace('-', ' ')} Details
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Object.entries(sectorData).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-gray-500 capitalize">
                                  {key.replace(/_/g, ' ')}:
                                </span>
                                <span className="text-gray-900">
                                  {Array.isArray(value) ? value.join(', ') : String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Research Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Research & Analysis</h2>
              
              {research.length > 0 ? (
                <div className="space-y-6">
                  {research.map((entry) => (
                    <ResearchCard key={entry.id} entry={entry} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No research data available yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - User Notes */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">My Notes</h2>
              
              {/* Add New Note */}
              <div className="mb-6">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add your notes about this company..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  rows={4}
                />
                <button
                  onClick={addNote}
                  disabled={!newNote.trim() || savingNote}
                  className="mt-3 w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingNote ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Save Note
                </button>
              </div>

              {/* Existing Notes */}
              <div className="space-y-4">
                {notes.length > 0 ? (
                  notes.map((note) => (
                    <NoteCard key={note.id} note={note} onDelete={deleteNote} />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No notes yet. Add your first note above!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Chatbase Widget - Official Implementation */}
      {company && (
        <ChatbaseWidgetOfficial 
          companyName={company.name}
          companyData={company}
        />
      )}

      {/* Debug Tools */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-yellow-100 border border-yellow-300 rounded-lg p-3 text-sm">
          <div className="font-medium text-yellow-800 mb-2">Debug Tools</div>
          <Link 
            href="/admin/test-chatbase" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Test Chatbase Integration
          </Link>
        </div>
      )}
    </div>
  )
}

function ResearchCard({ entry }: { entry: ResearchEntry }) {
  return (
    <div className="border-l-4 border-indigo-200 pl-4">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-gray-900">{entry.title}</h3>
        <span className="text-xs text-gray-500 flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          {new Date(entry.updated_at).toLocaleDateString()}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-3">{entry.content}</p>
      {entry.source_url && (
        <a
          href={entry.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-xs text-indigo-600 hover:text-indigo-700"
        >
          View Source
          <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      )}
    </div>
  )
}

function NoteCard({ note, onDelete }: { note: UserNote; onDelete: (id: string) => void }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs text-gray-500 flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          {new Date(note.created_at).toLocaleDateString()}
        </span>
        <button
          onClick={() => onDelete(note.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <p className="text-gray-700 text-sm whitespace-pre-wrap">{note.note_text}</p>
    </div>
  )
}

// Export with authentication protection
export default withSimpleAuth(CompanyPage)
