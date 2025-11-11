'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabaseAuth, UserProfile } from '../../../lib/supabase-auth'
import { User, Calendar, Building, Briefcase, Mail, Shield } from 'lucide-react'
import Link from 'next/link'

export default function UserProfilePage() {
  const params = useParams()
  const username = params?.username as string
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      if (!username) return

      try {
        setLoading(true)
        const userData = await supabaseAuth.getUserByUsername(username)
        
        if (!userData) {
          setError('User not found')
        } else {
          setUser(userData)
        }
      } catch (err) {
        console.error('Error fetching user:', err)
        setError('Failed to load user profile')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [username])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {error || 'User Not Found'}
              </h1>
              <p className="text-gray-600 mb-4">
                The user @{username} could not be found or may not be publicly visible.
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.full_name}
                  </h1>
                  {user.is_admin && (
                    <div className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                      <Shield className="w-3 h-3" />
                      Admin
                    </div>
                  )}
                </div>
                
                <div className="font-mono text-lg text-blue-600 mb-2">
                  @{user.username}
                </div>
                
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <div className={`w-2 h-2 rounded-full ${
                    user.status === 'approved' ? 'bg-green-500' : 
                    user.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
            
            <div className="space-y-4">
              {user.company_name && (
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Company</div>
                    <div className="font-medium">{user.company_name}</div>
                  </div>
                </div>
              )}
              
              {user.job_title && (
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Job Title</div>
                    <div className="font-medium">{user.job_title}</div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium">{user.email}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Member Since</div>
                  <div className="font-medium">{formatDate(user.created_at)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-800"
            >
              ← Back to Market Map
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
