'use client'

import { useState, useEffect } from 'react'
import { supabaseAuth } from '../lib/supabase-auth'
import { Check, X, Edit3, User } from 'lucide-react'

interface UsernameManagerProps {
  currentUsername?: string
  userId: string
  onUsernameUpdate?: (newUsername: string) => void
}

export default function UsernameManager({ currentUsername, userId, onUsernameUpdate }: UsernameManagerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newUsername, setNewUsername] = useState(currentUsername || '')
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [error, setError] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    setNewUsername(currentUsername || '')
  }, [currentUsername])

  const checkUsernameAvailability = async (username: string) => {
    if (username === currentUsername) {
      setIsAvailable(true)
      return
    }

    if (username.length < 3) {
      setIsAvailable(false)
      setError('Username must be at least 3 characters')
      return
    }

    if (!/^[a-z0-9_]+$/.test(username)) {
      setIsAvailable(false)
      setError('Username can only contain lowercase letters, numbers, and underscores')
      return
    }

    setIsChecking(true)
    setError('')
    
    try {
      const available = await supabaseAuth.checkUsernameAvailable(username)
      setIsAvailable(available)
      if (!available) {
        setError('Username is already taken')
      }
    } catch (err) {
      setError('Error checking username availability')
      setIsAvailable(false)
    } finally {
      setIsChecking(false)
    }
  }

  const handleUsernameChange = (value: string) => {
    const cleanValue = value.toLowerCase().replace(/[^a-z0-9_]/g, '')
    setNewUsername(cleanValue)
    
    if (cleanValue !== currentUsername) {
      // Debounce the availability check
      const timeoutId = setTimeout(() => {
        checkUsernameAvailability(cleanValue)
      }, 500)
      
      return () => clearTimeout(timeoutId)
    } else {
      setIsAvailable(true)
      setError('')
    }
  }

  const handleSave = async () => {
    if (!isAvailable || newUsername === currentUsername) return

    setIsUpdating(true)
    try {
      const result = await supabaseAuth.updateUsername(userId, newUsername)
      
      if (result.success) {
        setIsEditing(false)
        onUsernameUpdate?.(newUsername)
      } else {
        setError(result.error || 'Failed to update username')
      }
    } catch (err) {
      setError('Error updating username')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancel = () => {
    setNewUsername(currentUsername || '')
    setIsEditing(false)
    setError('')
    setIsAvailable(null)
  }

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
        <User className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">Username:</span>
        <span className="font-mono text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
          @{currentUsername || 'not-set'}
        </span>
        <button
          onClick={() => setIsEditing(true)}
          className="ml-auto text-blue-600 hover:text-blue-800 p-1"
          title="Edit username"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg border-2 border-blue-200">
      <div className="flex items-center gap-2 mb-3">
        <User className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Edit Username</span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">@</span>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => handleUsernameChange(e.target.value)}
            placeholder="Enter username"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            maxLength={50}
          />
          {isChecking && (
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          )}
          {!isChecking && isAvailable === true && newUsername !== currentUsername && (
            <Check className="w-5 h-5 text-green-500" />
          )}
          {!isChecking && isAvailable === false && (
            <X className="w-5 h-5 text-red-500" />
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div className="text-xs text-gray-500">
          • 3-50 characters • Lowercase letters, numbers, and underscores only
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={!isAvailable || isUpdating || newUsername === currentUsername}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isUpdating ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
