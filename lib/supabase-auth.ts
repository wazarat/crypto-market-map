// Supabase Authentication Service
import { supabase } from './supabase'
import type { User, Session } from '@supabase/supabase-js'

export interface UserProfile {
  id: string
  email: string
  full_name: string
  company_name?: string
  job_title?: string
  phone_number?: string
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  is_admin: boolean
  created_at: string
  approved_by?: string
  approved_at?: string
}

export interface SignupData {
  email: string
  password: string
  full_name: string
  company_name?: string
  job_title?: string
  phone_number?: string
}

class SupabaseAuthService {
  private ensureSupabase() {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }
    return supabase
  }
  // Sign up new user (will be pending approval)
  async signUp(userData: SignupData) {
    try {
      // 1. Create auth user with Supabase Auth
      const client = this.ensureSupabase()
      const { data: authData, error: authError } = await client.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name,
            company_name: userData.company_name,
            job_title: userData.job_title,
            phone_number: userData.phone_number
          }
        }
      })

      if (authError) {
        return { success: false, message: authError.message }
      }

      if (!authData.user) {
        return { success: false, message: 'Failed to create user' }
      }

      // 2. Create user profile (pending approval)
      const { error: profileError } = await client
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          email: userData.email,
          full_name: userData.full_name,
          company_name: userData.company_name,
          job_title: userData.job_title,
          phone_number: userData.phone_number,
          status: 'pending',
          is_admin: false
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        return { success: false, message: 'Failed to create user profile' }
      }

      return {
        success: true,
        message: 'Account created successfully. Please wait for admin approval.',
        user: authData.user
      }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, message: 'An error occurred during signup' }
    }
  }

  // Sign in user
  async signIn(email: string, password: string) {
    try {
      const client = this.ensureSupabase()
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return { success: false, message: error.message }
      }

      if (!data.user) {
        return { success: false, message: 'Login failed' }
      }

      // Check user status
      const { data: profile, error: profileError } = await client
        .from('user_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError || !profile) {
        return { success: false, message: 'User profile not found' }
      }

      if (profile.status !== 'approved') {
        // Sign out the user since they're not approved
        await client.auth.signOut()
        
        const statusMessages = {
          pending: 'Your account is pending admin approval',
          rejected: 'Your account has been rejected',
          suspended: 'Your account has been suspended'
        }
        return { 
          success: false, 
          message: statusMessages[profile.status as keyof typeof statusMessages] || 'Account access denied'
        }
      }

      return {
        success: true,
        message: 'Login successful',
        user: data.user,
        session: data.session,
        profile
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'An error occurred during login' }
    }
  }

  // Sign out user
  async signOut() {
    const client = this.ensureSupabase()
    const { error } = await client.auth.signOut()
    return { success: !error }
  }

  // Get current session
  async getSession() {
    const client = this.ensureSupabase()
    const { data: { session } } = await client.auth.getSession()
    return session
  }

  // Get current user with profile
  async getCurrentUser(): Promise<{ user: User | null; profile: UserProfile | null }> {
    const client = this.ensureSupabase()
    const { data: { user } } = await client.auth.getUser()
    
    if (!user) {
      return { user: null, profile: null }
    }

    const { data: profile } = await client
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return { user, profile }
  }

  // Admin: Get pending users
  async getPendingUsers(): Promise<UserProfile[]> {
    const client = this.ensureSupabase()
    const { data, error } = await client
      .from('user_profiles')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching pending users:', error)
      return []
    }

    return data || []
  }

  // Admin: Approve user
  async approveUser(userId: string, adminId: string) {
    try {
      const client = this.ensureSupabase()
      const { error } = await client
        .from('user_profiles')
        .update({
          status: 'approved',
          approved_by: adminId,
          approved_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        return { success: false, message: 'Failed to approve user' }
      }

      return { success: true, message: 'User approved successfully' }
    } catch (error) {
      console.error('User approval error:', error)
      return { success: false, message: 'An error occurred while approving user' }
    }
  }

  // Admin: Reject user
  async rejectUser(userId: string, adminId: string, reason?: string) {
    try {
      const client = this.ensureSupabase()
      const { error } = await client
        .from('user_profiles')
        .update({
          status: 'rejected',
          approved_by: adminId,
          approved_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        return { success: false, message: 'Failed to reject user' }
      }

      return { success: true, message: 'User rejected successfully' }
    } catch (error) {
      console.error('User rejection error:', error)
      return { success: false, message: 'An error occurred while rejecting user' }
    }
  }

  // Initialize admin user
  async initializeAdmin() {
    try {
      const adminEmail = 'waz@canhav.com'
      const adminPassword = 'admin123' // Change this!

      // Check if admin already exists
      const client = this.ensureSupabase()
      const { data: existingProfile } = await client
        .from('user_profiles')
        .select('id')
        .eq('email', adminEmail)
        .single()

      if (existingProfile) {
        console.log('Admin user already exists')
        return { success: true, message: 'Admin user already exists' }
      }

      // Create admin auth user
      const { data: authData, error: authError } = await client.auth.signUp({
        email: adminEmail,
        password: adminPassword,
        options: {
          data: {
            full_name: 'Wazarat Hussain',
            company_name: 'CanHav Research',
            job_title: 'Founder & CEO'
          }
        }
      })

      if (authError) {
        return { success: false, message: authError.message }
      }

      if (!authData.user) {
        return { success: false, message: 'Failed to create admin user' }
      }

      // Create admin profile
      const { error: profileError } = await client
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          email: adminEmail,
          full_name: 'Wazarat Hussain',
          company_name: 'CanHav Research',
          job_title: 'Founder & CEO',
          status: 'approved',
          is_admin: true,
          approved_at: new Date().toISOString()
        })

      if (profileError) {
        return { success: false, message: 'Failed to create admin profile' }
      }

      return { success: true, message: 'Admin user created successfully' }
    } catch (error) {
      console.error('Admin initialization error:', error)
      return { success: false, message: 'Failed to initialize admin user' }
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    const client = this.ensureSupabase()
    return client.auth.onAuthStateChange(callback)
  }
}

export const supabaseAuth = new SupabaseAuthService()
