'use client'

import { useState, useEffect } from 'react'
import { Check, X, Clock, User, Building2, Mail, Phone, Calendar } from 'lucide-react'
import { authService, User as UserType } from '../../../lib/auth'
import { useAuth, withAuth } from '../../../lib/auth-context'

function AdminUsersPage() {
  const [pendingUsers, setPendingUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { user } = useAuth()

  useEffect(() => {
    fetchPendingUsers()
  }, [])

  const fetchPendingUsers = async () => {
    try {
      setLoading(true)
      const users = await authService.getPendingUsers()
      setPendingUsers(users)
    } catch (error) {
      setError('Failed to fetch pending users')
      console.error('Error fetching pending users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveUser = async (userId: string) => {
    if (!user?.id) return

    try {
      setActionLoading(userId)
      setError('')
      setSuccess('')

      const result = await authService.approveUser(userId, user.id)
      
      if (result.success) {
        setSuccess('User approved successfully')
        // Remove from pending list
        setPendingUsers(prev => prev.filter(u => u.id !== userId))
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError('Failed to approve user')
      console.error('Error approving user:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleRejectUser = async (userId: string, reason?: string) => {
    if (!user?.id) return

    try {
      setActionLoading(userId)
      setError('')
      setSuccess('')

      const result = await authService.rejectUser(userId, user.id, reason)
      
      if (result.success) {
        setSuccess('User rejected successfully')
        // Remove from pending list
        setPendingUsers(prev => prev.filter(u => u.id !== userId))
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError('Failed to reject user')
      console.error('Error rejecting user:', error)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pending users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="mt-2 text-gray-600">
              Review and approve pending user registrations
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Approval</p>
                <p className="text-2xl font-semibold text-gray-900">{pendingUsers.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Users List */}
        {pendingUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Users</h3>
            <p className="text-gray-600">All user registrations have been reviewed.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Pending User Registrations</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {pendingUsers.map((pendingUser) => (
                <UserCard
                  key={pendingUser.id}
                  user={pendingUser}
                  onApprove={() => handleApproveUser(pendingUser.id)}
                  onReject={(reason) => handleRejectUser(pendingUser.id, reason)}
                  loading={actionLoading === pendingUser.id}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function UserCard({ 
  user, 
  onApprove, 
  onReject, 
  loading 
}: { 
  user: UserType
  onApprove: () => void
  onReject: (reason?: string) => void
  loading: boolean
}) {
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const handleReject = () => {
    onReject(rejectReason)
    setShowRejectModal(false)
    setRejectReason('')
  }

  return (
    <>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* User Info */}
            <div className="flex items-center mb-4">
              <div className="bg-indigo-100 rounded-full p-2 mr-3">
                <User className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{user.full_name}</h3>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {user.email}
              </div>
              
              {user.company_name && (
                <div className="flex items-center text-sm text-gray-600">
                  <Building2 className="h-4 w-4 mr-2" />
                  {user.company_name}
                </div>
              )}
              
              {user.phone_number && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {user.phone_number}
                </div>
              )}
              
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Registered: {new Date(user.created_at).toLocaleDateString()}
              </div>
            </div>

            {user.job_title && (
              <div className="mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {user.job_title}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 ml-6">
            <button
              onClick={onApprove}
              disabled={loading}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Approve
            </button>
            
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={loading}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="h-4 w-4 mr-2" />
              Reject
            </button>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Reject User Registration
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to reject {user.full_name}'s registration?
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for rejection (optional)
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  placeholder="Enter reason for rejection..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Reject User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default withAuth(AdminUsersPage, { requireAdmin: true })
