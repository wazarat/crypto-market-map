'use client'

import { useState, useEffect } from 'react'
import { Upload, FileText, Download, MessageCircle, User, Calendar, Plus, Send, ExternalLink, Link } from 'lucide-react'

interface ResearchItem {
  id: string
  title: string
  description?: string
  file_name: string
  file_path: string
  file_type: string
  file_size_bytes: number
  submitted_by_name: string
  submitted_by_email?: string
  created_at: string
  download_count: number
  comments?: ResearchComment[]
}

interface ResearchComment {
  id: string
  user_name: string
  user_email?: string
  comment_text: string
  mentioned_users?: string[]
  created_at: string
  is_edited: boolean
}

interface ResearchFeedProps {
  companySlug: string
}

export default function ResearchFeed({ companySlug }: ResearchFeedProps) {
  const [researchItems, setResearchItems] = useState<ResearchItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
  const [newComments, setNewComments] = useState<Record<string, string>>({})

  // Upload form state
  const [uploadType, setUploadType] = useState<'file' | 'link'>('file')
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    submitterName: '',
    department: '',
    file: null as File | null,
    link: '',
    linkType: 'article' as 'article' | 'report' | 'analysis' | 'news' | 'other'
  })

  useEffect(() => {
    fetchResearchItems()
  }, [companySlug])

  const fetchResearchItems = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/research/${companySlug}`)
      // const data = await response.json()
      // setResearchItems(data)
      
      // No mock data - start with empty research feed
      setResearchItems([])
    } catch (error) {
      console.error('Error fetching research items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitResearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields based on upload type
    if (!uploadForm.title || !uploadForm.submitterName) return
    if (uploadType === 'file' && !uploadForm.file) return
    if (uploadType === 'link' && !uploadForm.link) return

    setUploading(true)
    try {
      if (uploadType === 'file') {
        // Handle file upload
        const formData = new FormData()
        formData.append('file', uploadForm.file!)
        formData.append('title', uploadForm.title)
        formData.append('description', uploadForm.description)
        formData.append('submitterName', uploadForm.submitterName)
        formData.append('department', uploadForm.department)
        formData.append('companySlug', companySlug)
        formData.append('type', 'file')

        // const response = await fetch('/api/research/upload', {
        //   method: 'POST',
        //   body: formData
        // })

        console.log('File upload would happen here:', formData)
      } else {
        // Handle link submission
        const linkData = {
          title: uploadForm.title,
          description: uploadForm.description,
          submitterName: uploadForm.submitterName,
          department: uploadForm.department,
          companySlug: companySlug,
          link: uploadForm.link,
          linkType: uploadForm.linkType,
          type: 'link'
        }

        // const response = await fetch('/api/research/link', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(linkData)
        // })

        console.log('Link submission would happen here:', linkData)
      }
      
      // Reset form
      setUploadForm({
        title: '',
        description: '',
        submitterName: '',
        department: '',
        file: null,
        link: '',
        linkType: 'article'
      })
      setShowUploadForm(false)
      
      // Refresh research items
      await fetchResearchItems()
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleAddComment = async (researchId: string) => {
    const commentText = newComments[researchId]?.trim()
    if (!commentText) return

    try {
      // TODO: Implement actual comment submission
      console.log('Adding comment:', { researchId, commentText })
      
      // Clear comment input
      setNewComments(prev => ({ ...prev, [researchId]: '' }))
      
      // Refresh research items to get new comment
      await fetchResearchItems()
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const toggleComments = (researchId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev)
      if (newSet.has(researchId)) {
        newSet.delete(researchId)
      } else {
        newSet.add(researchId)
      }
      return newSet
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Research & Analysis</h2>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Research
        </button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <form onSubmit={handleSubmitResearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Research Title *
                </label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Q3 2024 Financial Analysis"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={uploadForm.submitterName}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, submitterName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={uploadForm.description}
                onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Brief description of the research content..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                value={uploadForm.department}
                onChange={(e) => setUploadForm(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Department</option>
                <option value="Pakistan Crypto Council">Pakistan Crypto Council</option>
                <option value="Securities and Exchange Commission of Pakistan">Securities and Exchange Commission of Pakistan</option>
                <option value="State Bank of Pakistan">State Bank of Pakistan</option>
                <option value="Other (Federal Govt Employees)">Other (Federal Govt Employees)</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Upload Type Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Research Type *
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="file"
                    checked={uploadType === 'file'}
                    onChange={(e) => setUploadType(e.target.value as 'file' | 'link')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Upload File (PDF, Word)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="link"
                    checked={uploadType === 'link'}
                    onChange={(e) => setUploadType(e.target.value as 'file' | 'link')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Share Link</span>
                </label>
              </div>
            </div>

            {/* Conditional Fields Based on Upload Type */}
            {uploadType === 'file' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Research File * (PDF, Word)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setUploadForm(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={uploadType === 'file'}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, DOC, DOCX (max 10MB)
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Research Link *
                  </label>
                  <input
                    type="url"
                    value={uploadForm.link}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, link: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/research-article"
                    required={uploadType === 'link'}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Link to research article, report, analysis, or relevant content
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link Type
                  </label>
                  <select
                    value={uploadForm.linkType}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, linkType: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="article">Article</option>
                    <option value="report">Report</option>
                    <option value="analysis">Analysis</option>
                    <option value="news">News</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  uploading || 
                  !uploadForm.title || 
                  !uploadForm.submitterName ||
                  (uploadType === 'file' && !uploadForm.file) ||
                  (uploadType === 'link' && !uploadForm.link)
                }
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {uploading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                {uploadType === 'file' ? 'Upload Research' : 'Share Link'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Research Items */}
      <div className="space-y-6">
        {researchItems.length > 0 ? (
          researchItems.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
                  {item.description && (
                    <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                  )}
                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <span className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {item.submitted_by_name}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <FileText className="h-3 w-3 mr-1" />
                      {item.file_type.toUpperCase()} • {formatFileSize(item.file_size_bytes)}
                    </span>
                    <span>{item.download_count} downloads</span>
                  </div>
                </div>
                <button className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-600 rounded-md hover:bg-blue-50">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </button>
              </div>

              {/* Comments Section */}
              <div className="border-t border-gray-200 pt-3">
                <button
                  onClick={() => toggleComments(item.id)}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-700 mb-3"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {item.comments?.length || 0} comments
                </button>

                {expandedComments.has(item.id) && (
                  <div className="space-y-3">
                    {/* Existing Comments */}
                    {item.comments?.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm text-gray-900">{comment.user_name}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.comment_text}</p>
                      </div>
                    ))}

                    {/* Add Comment */}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newComments[item.id] || ''}
                        onChange={(e) => setNewComments(prev => ({ ...prev, [item.id]: e.target.value }))}
                        placeholder="Add a comment... Use @username to mention someone"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <button
                        onClick={() => handleAddComment(item.id)}
                        disabled={!newComments[item.id]?.trim()}
                        className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">No research documents yet</p>
            <p className="text-gray-400 text-sm">Upload the first research document to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
