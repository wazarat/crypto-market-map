'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabaseAuth, UserProfile } from './supabase-auth'
import { getSubdomainConfig } from './subdomain-utils'

interface CorporateAuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  corporateClient: string | null
  signIn: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  signUp: (userData: any) => Promise<{ success: boolean; message: string }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>
  isAuthenticated: boolean
  isAdmin: boolean
  isApproved: boolean
  isCorporateUser: boolean
}

const CorporateAuthContext = createContext<CorporateAuthContextType | undefined>(undefined)

export function CorporateAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [corporateClient, setCorporateClient] = useState<string | null>(null)

  useEffect(() => {
    // Get subdomain configuration
    if (typeof window !== 'undefined') {
      const config = getSubdomainConfig(window.location.hostname)
      setCorporateClient(config.corporateClient || null)
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const session = await supabaseAuth.getSession()
        setSession(session)
        
        if (session?.user) {
          const { user: currentUser, profile: userProfile } = await supabaseAuth.getCurrentUser()
          setUser(currentUser)
          setProfile(userProfile)
          
          // For corporate subdomains, verify user belongs to the corporate client
          if (corporateClient && userProfile) {
            await validateCorporateAccess(userProfile, corporateClient)
          }
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
        console.log('Corporate auth state changed:', event, session?.user?.email)
        
        setSession(session)
        
        if (session?.user) {
          const { user: currentUser, profile: userProfile } = await supabaseAuth.getCurrentUser()
          setUser(currentUser)
          setProfile(userProfile)
          
          // Validate corporate access for new sessions
          if (corporateClient && userProfile) {
            await validateCorporateAccess(userProfile, corporateClient)
          }
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
  }, [corporateClient])

  // Validate that user has access to the corporate subdomain
  const validateCorporateAccess = async (userProfile: UserProfile, client: string) => {
    // Check if user's company matches the corporate client
    // This is a simple check - you might want more sophisticated logic
    const hasAccess = userProfile.company_name?.toLowerCase().includes(client.toLowerCase()) ||
                     userProfile.is_admin

    if (!hasAccess) {
      console.warn(`User ${userProfile.email} does not have access to ${client} corporate portal`)
      // Optionally sign out or redirect
      await signOut()
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const result = await supabaseAuth.signIn(email, password)
      
      if (result.success && result.user && result.profile) {
        // Additional validation for corporate subdomains
        if (corporateClient) {
          await validateCorporateAccess(result.profile, corporateClient)
        }
        
        setUser(result.user)
        setProfile(result.profile)
        setSession(result.session || null)
      }
      
      return { success: result.success, message: result.message }
    } catch (error) {
      console.error('Corporate sign in error:', error)
      return { success: false, message: 'An error occurred during sign in' }
    }
  }

  const signUp = async (userData: any) => {
    try {
      // For corporate subdomains, add the corporate client to the user data
      const corporateUserData = {
        ...userData,
        company_name: corporateClient || userData.company_name
      }
      
      const result = await supabaseAuth.signUp(corporateUserData)
      return { success: result.success, message: result.message }
    } catch (error) {
      console.error('Corporate sign up error:', error)
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
      console.error('Corporate sign out error:', error)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const result = await supabaseAuth.resetPassword(email)
      return { success: result.success, message: result.message }
    } catch (error) {
      console.error('Corporate reset password error:', error)
      return { success: false, message: 'An error occurred during password reset' }
    }
  }

  const value: CorporateAuthContextType = {
    user,
    profile,
    session,
    loading,
    corporateClient,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isAuthenticated: !!user && !!profile && profile.status === 'approved',
    isAdmin: profile?.is_admin || false,
    isApproved: profile?.status === 'approved',
    isCorporateUser: !!corporateClient
  }

  return <CorporateAuthContext.Provider value={value}>{children}</CorporateAuthContext.Provider>
}

export function useCorporateAuth() {
  const context = useContext(CorporateAuthContext)
  if (context === undefined) {
    throw new Error('useCorporateAuth must be used within a CorporateAuthProvider')
  }
  return context
}

// Higher-order component for protecting corporate routes
export function withCorporateAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: { requireAdmin?: boolean; requireCorporate?: boolean } = {}
) {
  return function CorporateAuthenticatedComponent(props: P) {
    const { user, profile, loading, isAuthenticated, isAdmin, isCorporateUser } = useCorporateAuth()

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please log in to access this corporate portal.</p>
            <a
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
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

    if (options.requireCorporate && !isCorporateUser) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Corporate Access Required</h2>
            <p className="text-gray-600">This page is only accessible from corporate portals.</p>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}
