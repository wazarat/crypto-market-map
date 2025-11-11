'use client'

import { useState, useEffect, useRef } from 'react'
import { supabaseAuth, UserProfile } from '../lib/supabase-auth'
import { User } from 'lucide-react'

interface UserMentionProps {
  onMention: (username: string) => void
  trigger?: string // Default: '@'
  className?: string
}

export default function UserMention({ onMention, trigger = '@', className = '' }: UserMentionProps) {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<UserProfile[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const searchUsers = async () => {
      if (query.length < 1) {
        setUsers([])
        setIsOpen(false)
        return
      }

      try {
        const results = await supabaseAuth.searchUsersByUsername(query, 5)
        setUsers(results)
        setIsOpen(results.length > 0)
        setSelectedIndex(0)
      } catch (error) {
        console.error('Error searching users:', error)
        setUsers([])
        setIsOpen(false)
      }
    }

    const timeoutId = setTimeout(searchUsers, 300)
    return () => clearTimeout(timeoutId)
  }, [query])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    if (value.startsWith(trigger)) {
      setQuery(value.slice(1)) // Remove the @ symbol
    } else {
      setQuery('')
      setIsOpen(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % users.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + users.length) % users.length)
        break
      case 'Enter':
        e.preventDefault()
        if (users[selectedIndex]) {
          selectUser(users[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setQuery('')
        break
    }
  }

  const selectUser = (user: UserProfile) => {
    onMention(user.username)
    setQuery('')
    setIsOpen(false)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        placeholder={`Type ${trigger} to mention users...`}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {isOpen && users.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {users.map((user, index) => (
            <div
              key={user.id}
              onClick={() => selectUser(user)}
              className={`px-3 py-2 cursor-pointer flex items-center gap-2 ${
                index === selectedIndex
                  ? 'bg-blue-100 text-blue-900'
                  : 'hover:bg-gray-100'
              }`}
            >
              <User className="w-4 h-4 text-gray-500" />
              <div className="flex-1">
                <div className="font-mono text-sm">@{user.username}</div>
                <div className="text-xs text-gray-500">{user.full_name}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Hook for parsing mentions in text
export function useMentionParser() {
  const parseMentions = (text: string) => {
    const mentionRegex = /@([a-z0-9_]+)/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = mentionRegex.exec(text)) !== null) {
      // Add text before mention
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index)
        })
      }

      // Add mention
      parts.push({
        type: 'mention',
        content: match[0],
        username: match[1]
      })

      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex)
      })
    }

    return parts
  }

  const renderMentions = (text: string) => {
    const parts = parseMentions(text)
    
    return parts.map((part, index) => {
      if (part.type === 'mention') {
        return (
          <span
            key={index}
            className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded font-mono text-sm"
          >
            {part.content}
          </span>
        )
      }
      return <span key={index}>{part.content}</span>
    })
  }

  return { parseMentions, renderMentions }
}
