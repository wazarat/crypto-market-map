'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Calendar, Reply, AtSign, Send, User } from 'lucide-react'

interface CollaborativeNote {
  id: string
  user_id: string
  user_name: string
  user_email?: string
  note_text: string
  mentioned_users?: string[]
  created_at: string
  updated_at: string
  is_edited: boolean
  reply_to_note_id?: string
  replies?: CollaborativeNote[]
}

interface PlatformUser {
  id: string
  username: string
  display_name: string
  email: string
  avatar_url?: string
  is_active: boolean
}

interface CollaborativeNotesProps {
  companyId: string
  companyName: string
}

export default function CollaborativeNotes({ companyId, companyName }: CollaborativeNotesProps) {
  const [notes, setNotes] = useState<CollaborativeNote[]>([])
  const [users, setUsers] = useState<PlatformUser[]>([])
  const [loading, setLoading] = useState(true)
  const [savingNote, setSavingNote] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [showMentions, setShowMentions] = useState(false)
  const [mentionQuery, setMentionQuery] = useState('')
  const [cursorPosition, setCursorPosition] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null)

  // Mock current user - replace with real auth
  const currentUser = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Current User',
    email: 'user@canhav.com'
  }

  useEffect(() => {
    fetchNotes()
    fetchUsers()
  }, [companyId])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/notes/${companyId}`)
      // const data = await response.json()
      // setNotes(data)

      // Mock data for now
      setNotes([
        {
          id: '1',
          user_id: 'user1',
          user_name: 'Research Analyst',
          user_email: 'research@canhav.com',
          note_text: 'Great quarterly results! The revenue growth is impressive. @analyst what are your thoughts on the regulatory outlook?',
          mentioned_users: ['analyst'],
          created_at: '2024-11-10T10:00:00Z',
          updated_at: '2024-11-10T10:00:00Z',
          is_edited: false,
          replies: [
            {
              id: '2',
              user_id: 'user2',
              user_name: 'Market Analyst',
              user_email: 'analyst@canhav.com',
              note_text: 'I think the regulatory environment is becoming more favorable. The recent policy changes should benefit the sector.',
              created_at: '2024-11-10T11:00:00Z',
              updated_at: '2024-11-10T11:00:00Z',
              is_edited: false,
              reply_to_note_id: '1'
            }
          ]
        }
      ])
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/users')
      // const data = await response.json()
      // setUsers(data)

      // Mock users for now
      setUsers([
        { id: '1', username: 'admin', display_name: 'Admin User', email: 'admin@canhav.com', is_active: true },
        { id: '2', username: 'researcher', display_name: 'Research Analyst', email: 'research@canhav.com', is_active: true },
        { id: '3', username: 'analyst', display_name: 'Market Analyst', email: 'analyst@canhav.com', is_active: true },
        { id: '4', username: 'wazarat', display_name: 'Wazarat', email: 'waz@canhav.com', is_active: true }
      ])
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleTextChange = (text: string, isReply = false) => {
    if (isReply) {
      setReplyText(text)
    } else {
      setNewNote(text)
    }

    // Check for @ mentions
    const lastAtIndex = text.lastIndexOf('@')
    if (lastAtIndex !== -1) {
      const textAfterAt = text.slice(lastAtIndex + 1)
      const spaceIndex = textAfterAt.indexOf(' ')
      const query = spaceIndex === -1 ? textAfterAt : textAfterAt.slice(0, spaceIndex)
      
      if (query.length >= 0 && spaceIndex === -1) {
        setMentionQuery(query.toLowerCase())
        setShowMentions(true)
        setCursorPosition(lastAtIndex)
      } else {
        setShowMentions(false)
      }
    } else {
      setShowMentions(false)
    }
  }

  const insertMention = (username: string, isReply = false) => {
    const currentText = isReply ? replyText : newNote
    const beforeAt = currentText.slice(0, cursorPosition)
    const afterAt = currentText.slice(cursorPosition + 1 + mentionQuery.length)
    const newText = `${beforeAt}@${username} ${afterAt}`
    
    if (isReply) {
      setReplyText(newText)
    } else {
      setNewNote(newText)
    }
    
    setShowMentions(false)
    setMentionQuery('')
  }

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g
    const mentions: string[] = []
    let match
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1])
    }
    return mentions
  }

  const addNote = async () => {
    if (!newNote.trim()) return

    setSavingNote(true)
    try {
      const mentions = extractMentions(newNote)
      
      // TODO: Replace with actual API call
      const noteData = {
        user_id: currentUser.id,
        user_name: currentUser.name,
        user_email: currentUser.email,
        note_text: newNote.trim(),
        mentioned_users: mentions,
        company_id: companyId
      }

      console.log('Adding note:', noteData)
      
      // Mock success - add to local state
      const mockNote: CollaborativeNote = {
        id: Date.now().toString(),
        ...noteData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_edited: false,
        replies: []
      }
      
      setNotes(prev => [mockNote, ...prev])
      setNewNote('')
    } catch (error) {
      console.error('Error saving note:', error)
    } finally {
      setSavingNote(false)
    }
  }

  const addReply = async (parentNoteId: string) => {
    if (!replyText.trim()) return

    try {
      const mentions = extractMentions(replyText)
      
      // TODO: Replace with actual API call
      const replyData = {
        user_id: currentUser.id,
        user_name: currentUser.name,
        user_email: currentUser.email,
        note_text: replyText.trim(),
        mentioned_users: mentions,
        reply_to_note_id: parentNoteId
      }

      console.log('Adding reply:', replyData)
      
      // Mock success - add to local state
      const mockReply: CollaborativeNote = {
        id: Date.now().toString(),
        ...replyData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_edited: false
      }
      
      setNotes(prev => prev.map(note => {
        if (note.id === parentNoteId) {
          return {
            ...note,
            replies: [...(note.replies || []), mockReply]
          }
        }
        return note
      }))
      
      setReplyText('')
      setReplyingTo(null)
    } catch (error) {
      console.error('Error adding reply:', error)
    }
  }

  const deleteNote = async (noteId: string) => {
    try {
      // TODO: Replace with actual API call
      console.log('Deleting note:', noteId)
      
      setNotes(notes.filter(note => note.id !== noteId))
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(mentionQuery) ||
    user.display_name.toLowerCase().includes(mentionQuery)
  )

  const renderNoteText = (text: string) => {
    // Replace @mentions with styled spans
    return text.replace(/@(\w+)/g, '<span class="bg-blue-100 text-blue-800 px-1 rounded">@$1</span>')
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Notes</h2>
      
      {/* Add New Note */}
      <div className="mb-6 relative">
        <textarea
          ref={textareaRef}
          value={newNote}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={`Add your notes about ${companyName}... Use @username to mention teammates`}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
        />
        
        {/* Mentions Dropdown */}
        {showMentions && filteredUsers.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
            {filteredUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => insertMention(user.username)}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center"
              >
                <AtSign className="h-4 w-4 text-gray-400 mr-2" />
                <div>
                  <div className="font-medium text-sm">{user.display_name}</div>
                  <div className="text-xs text-gray-500">@{user.username}</div>
                </div>
              </button>
            ))}
          </div>
        )}
        
        <button
          onClick={addNote}
          disabled={!newNote.trim() || savingNote}
          className="mt-3 w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {savingNote ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Add Note
        </button>
      </div>

      {/* Notes List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div key={note.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="font-medium text-sm text-gray-900">{note.user_name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(note.created_at).toLocaleDateString()}
                  </span>
                  {note.user_id === currentUser.id && (
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              
              <div 
                className="text-sm text-gray-700 whitespace-pre-wrap mb-3"
                dangerouslySetInnerHTML={{ __html: renderNoteText(note.note_text) }}
              />

              {/* Replies */}
              {note.replies && note.replies.length > 0 && (
                <div className="ml-4 border-l-2 border-gray-200 pl-4 space-y-2">
                  {note.replies.map((reply) => (
                    <div key={reply.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-xs text-gray-900">{reply.user_name}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(reply.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div 
                        className="text-xs text-gray-700"
                        dangerouslySetInnerHTML={{ __html: renderNoteText(reply.note_text) }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Form */}
              {replyingTo === note.id ? (
                <div className="mt-3 ml-4 relative">
                  <textarea
                    ref={replyTextareaRef}
                    value={replyText}
                    onChange={(e) => handleTextChange(e.target.value, true)}
                    placeholder="Write a reply... Use @username to mention"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                    rows={2}
                  />
                  
                  {/* Mentions Dropdown for Reply */}
                  {showMentions && filteredUsers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-32 overflow-y-auto">
                      {filteredUsers.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => insertMention(user.username, true)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center"
                        >
                          <AtSign className="h-3 w-3 text-gray-400 mr-2" />
                          <div>
                            <div className="font-medium text-xs">{user.display_name}</div>
                            <div className="text-xs text-gray-500">@{user.username}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="px-3 py-1 text-xs text-gray-600 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => addReply(note.id)}
                      disabled={!replyText.trim()}
                      className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Send className="h-3 w-3 mr-1" />
                      Reply
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setReplyingTo(note.id)}
                  className="mt-2 flex items-center text-xs text-gray-500 hover:text-gray-700"
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Reply
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm text-center py-4">
            No notes yet. Add the first team note above!
          </p>
        )}
      </div>
    </div>
  )
}
