'use client'

import { useState, useEffect } from 'react'

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, ExternalLink, Building2, Globe, Calendar, Plus, Trash2, Edit } from 'lucide-react'
import { apiClient, CompanyDetail, ResearchEntry } from '../../../lib/api'
import { supabase, UserNote } from '../../../lib/supabase'
import ChatbaseWidget from '../../../components/ChatbaseWidget'

// Mock user ID - replace with real auth later
const MOCK_USER_ID = process.env.NEXT_PUBLIC_MOCK_USER_ID || '550e8400-e29b-41d4-a716-446655440000'

export default function CompanyPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [company, setCompany] = useState<CompanyDetail | null>(null)
  const [research, setResearch] = useState<ResearchEntry[]>([])
  const [notes, setNotes] = useState<UserNote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newNote, setNewNote] = useState('')
  const [savingNote, setSavingNote] = useState(false)

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const [companyData, researchData] = await Promise.all([
          apiClient.getCompany(slug),
          apiClient.getCompanyResearch(slug)
        ])
        
        setCompany(companyData)
        setResearch(researchData)
        
        // Fetch user notes from Supabase
        await fetchNotes(companyData.id)
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

  const saveNote = async () => {
    if (!newNote.trim() || !company) return

    if (!supabase) {
      console.log('Supabase not available, cannot save note')
      return
    }

    setSavingNote(true)
    try {
      const { data, error } = await supabase
        .from('user_notes')
        .insert([
          {
            user_id: MOCK_USER_ID,
            company_id: company.id,
            note_text: newNote.trim()
          }
        ])
        .select()

      if (error) throw error
      
      if (data && data[0]) {
        setNotes([data[0], ...notes])
        setNewNote('')
      }
    } catch (err) {
      console.error('Error saving note:', err)
      alert('Failed to save note. Please try again.')
    } finally {
      setSavingNote(false)
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
                    {new URL(company.website).hostname}
                  </span>
                )}
              </div>
            </div>

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
                  onClick={saveNote}
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

      {/* Chatbase Widget */}
      {company && (
        <ChatbaseWidget 
          companyName={company.name}
          companyData={company}
        />
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
