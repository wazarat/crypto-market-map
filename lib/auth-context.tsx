'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { authService, User } from './auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => Promise<void>
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const sessionToken = localStorage.getItem('session_token')
      if (sessionToken) {
        const { valid, user: sessionUser } = await authService.validateSession(sessionToken)
        if (valid && sessionUser) {
          setUser(sessionUser)
        } else {
          localStorage.removeItem('session_token')
        }
      }
    } catch (error) {
      console.error('Session check error:', error)
      localStorage.removeItem('session_token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (username: string, password: string) => {
    try {
      const result = await authService.login(
        { username, password },
        undefined, // IP address - could be obtained from request
        navigator.userAgent
      )

      if (result.success && result.user && result.sessionToken) {
        setUser(result.user)
        localStorage.setItem('session_token', result.sessionToken)
      }

      return { success: result.success, message: result.message }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'An error occurred during login' }
    }
  }

  const logout = async () => {
    try {
      const sessionToken = localStorage.getItem('session_token')
      if (sessionToken) {
        await authService.logout(sessionToken)
        localStorage.removeItem('session_token')
      }
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
      // Still clear local state even if server logout fails
      localStorage.removeItem('session_token')
      setUser(null)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.is_admin || false
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protecting routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: { requireAdmin?: boolean } = {}
) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading, isAuthenticated, isAdmin } = useAuth()

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please log in to access this page.</p>
            <a
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Go to Login
            </a>
          </div>
        </div>
      )
    }

    if (options.requireAdmin && !isAdmin) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Required</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}
