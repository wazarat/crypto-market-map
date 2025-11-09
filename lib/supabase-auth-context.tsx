'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabaseAuth, UserProfile } from './supabase-auth'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  signUp: (userData: any) => Promise<{ success: boolean; message: string }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>
  isAuthenticated: boolean
  isAdmin: boolean
  isApproved: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const session = await supabaseAuth.getSession()
        setSession(session)
        
        if (session?.user) {
          const { user: currentUser, profile: userProfile } = await supabaseAuth.getCurrentUser()
          setUser(currentUser)
          setProfile(userProfile)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabaseAuth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        setSession(session)
        
        if (session?.user) {
          const { user: currentUser, profile: userProfile } = await supabaseAuth.getCurrentUser()
          setUser(currentUser)
          setProfile(userProfile)
        } else {
          setUser(null)
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const result = await supabaseAuth.signIn(email, password)
      
      if (result.success && result.user && result.profile) {
        setUser(result.user)
        setProfile(result.profile)
        setSession(result.session || null)
      }
      
      return { success: result.success, message: result.message }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, message: 'An error occurred during sign in' }
    }
  }

  const signUp = async (userData: any) => {
    try {
      const result = await supabaseAuth.signUp(userData)
      return { success: result.success, message: result.message }
    } catch (error) {
      console.error('Sign up error:', error)
      return { success: false, message: 'An error occurred during sign up' }
    }
  }

  const signOut = async () => {
    try {
      await supabaseAuth.signOut()
      setUser(null)
      setProfile(null)
      setSession(null)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const result = await supabaseAuth.resetPassword(email)
      return { success: result.success, message: result.message }
    } catch (error) {
      console.error('Reset password error:', error)
      return { success: false, message: 'An error occurred during password reset' }
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isAuthenticated: !!user && !!profile && profile.status === 'approved',
    isAdmin: profile?.is_admin || false,
    isApproved: profile?.status === 'approved'
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useSupabaseAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider')
  }
  return context
}

// Higher-order component for protecting routes
export function withSupabaseAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: { requireAdmin?: boolean } = {}
) {
  return function AuthenticatedComponent(props: P) {
    const { user, profile, loading, isAuthenticated, isAdmin } = useSupabaseAuth()

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
