// Authentication System for Pakistan Crypto Council
import bcrypt from 'bcryptjs'
import { supabase } from './supabase'
import { v4 as uuidv4 } from 'uuid'

export interface User {
  id: string
  email: string
  username: string
  full_name: string
  company_name?: string
  job_title?: string
  phone_number?: string
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  is_admin: boolean
  email_verified: boolean
  created_at: string
  last_login?: string
}

export interface SignupData {
  email: string
  username: string
  password: string
  full_name: string
  company_name?: string
  job_title?: string
  phone_number?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface UserSession {
  id: string
  user_id: string
  session_token: string
  expires_at: string
  user?: User
}

class AuthService {
  private readonly SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

  private ensureSupabase() {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }
    return supabase
  }

  // Hash password
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return bcrypt.hash(password, saltRounds)
  }

  // Verify password
  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  // Generate session token
  private generateSessionToken(): string {
    return uuidv4() + '-' + Date.now() + '-' + Math.random().toString(36).substring(2)
  }

  // Sign up new user (pending approval)
  async signup(userData: SignupData): Promise<{ success: boolean; message: string; userId?: string }> {
    try {
      // Check if email or username already exists
      const client = this.ensureSupabase()
      const { data: existingUser } = await client
        .from('users')
        .select('id, email, username')
        .or(`email.eq.${userData.email},username.eq.${userData.username}`)
        .single()

      if (existingUser) {
        return {
          success: false,
          message: existingUser.email === userData.email 
            ? 'Email already registered' 
            : 'Username already taken'
        }
      }

      // Hash password
      const passwordHash = await this.hashPassword(userData.password)

      // Insert new user
      const { data: newUser, error } = await client
        .from('users')
        .insert({
          email: userData.email,
          username: userData.username,
          password_hash: passwordHash,
          full_name: userData.full_name,
          company_name: userData.company_name,
          job_title: userData.job_title,
          phone_number: userData.phone_number,
          status: 'pending'
        })
        .select('id')
        .single()

      if (error) {
        console.error('Signup error:', error)
        return { success: false, message: 'Failed to create account' }
      }

      // Log activity
      await this.logActivity(newUser.id, 'user_signup', {
        email: userData.email,
        username: userData.username
      })

      return {
        success: true,
        message: 'Account created successfully. Please wait for admin approval.',
        userId: newUser.id
      }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, message: 'An error occurred during signup' }
    }
  }

  // Login user
  async login(credentials: LoginCredentials, ipAddress?: string, userAgent?: string): Promise<{
    success: boolean
    message: string
    user?: User
    sessionToken?: string
  }> {
    try {
      // Find user by username
      const client = this.ensureSupabase()
      const { data: user, error } = await client
        .from('users')
        .select('*')
        .eq('username', credentials.username)
        .single()

      if (error || !user) {
        return { success: false, message: 'Invalid username or password' }
      }

      // Check if user is approved
      if (user.status !== 'approved') {
        const statusMessages = {
          pending: 'Your account is pending admin approval',
          rejected: 'Your account has been rejected',
          suspended: 'Your account has been suspended'
        }
        return { 
          success: false, 
          message: statusMessages[user.status as keyof typeof statusMessages] || 'Account access denied'
        }
      }

      // Verify password
      const isValidPassword = await this.verifyPassword(credentials.password, user.password_hash)
      if (!isValidPassword) {
        return { success: false, message: 'Invalid username or password' }
      }

      // Create session
      const sessionToken = this.generateSessionToken()
      const expiresAt = new Date(Date.now() + this.SESSION_DURATION)

      const { error: sessionError } = await client
        .from('user_sessions')
        .insert({
          user_id: user.id,
          session_token: sessionToken,
          expires_at: expiresAt.toISOString(),
          ip_address: ipAddress,
          user_agent: userAgent
        })

      if (sessionError) {
        console.error('Session creation error:', sessionError)
        return { success: false, message: 'Failed to create session' }
      }

      // Update last login
      await client
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id)

      // Log activity
      await this.logActivity(user.id, 'user_login', { ip_address: ipAddress })

      // Remove password hash from response
      const { password_hash, ...userWithoutPassword } = user

      return {
        success: true,
        message: 'Login successful',
        user: userWithoutPassword as User,
        sessionToken
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'An error occurred during login' }
    }
  }

  // Validate session
  async validateSession(sessionToken: string): Promise<{ valid: boolean; user?: User }> {
    try {
      const client = this.ensureSupabase()
      const { data: session, error } = await client
        .from('user_sessions')
        .select(`
          *,
          user:users(*)
        `)
        .eq('session_token', sessionToken)
        .gt('expires_at', new Date().toISOString())
        .single()

      if (error || !session || !session.user) {
        return { valid: false }
      }

      // Update last accessed
      await client
        .from('user_sessions')
        .update({ last_accessed: new Date().toISOString() })
        .eq('session_token', sessionToken)

      const { password_hash, ...userWithoutPassword } = session.user
      return { valid: true, user: userWithoutPassword as User }
    } catch (error) {
      console.error('Session validation error:', error)
      return { valid: false }
    }
  }

  // Logout user
  async logout(sessionToken: string): Promise<{ success: boolean }> {
    try {
      const client = this.ensureSupabase()
      const { error } = await client
        .from('user_sessions')
        .delete()
        .eq('session_token', sessionToken)

      return { success: !error }
    } catch (error) {
      console.error('Logout error:', error)
      return { success: false }
    }
  }

  // Get pending users (admin only)
  async getPendingUsers(): Promise<User[]> {
    try {
      const client = this.ensureSupabase()
      const { data, error } = await client
        .from('users')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching pending users:', error)
        return []
      }

      return data.map(user => {
        const { password_hash, ...userWithoutPassword } = user
        return userWithoutPassword as User
      })
    } catch (error) {
      console.error('Error fetching pending users:', error)
      return []
    }
  }

  // Approve user (admin only)
  async approveUser(userId: string, adminId: string): Promise<{ success: boolean; message: string }> {
    try {
      const client = this.ensureSupabase()
      const { error } = await client
        .from('users')
        .update({
          status: 'approved',
          approved_by: adminId,
          approved_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        console.error('User approval error:', error)
        return { success: false, message: 'Failed to approve user' }
      }

      // Log activity
      await this.logActivity(adminId, 'user_approved', { approved_user_id: userId })

      return { success: true, message: 'User approved successfully' }
    } catch (error) {
      console.error('User approval error:', error)
      return { success: false, message: 'An error occurred while approving user' }
    }
  }

  // Reject user (admin only)
  async rejectUser(userId: string, adminId: string, reason?: string): Promise<{ success: boolean; message: string }> {
    try {
      const client = this.ensureSupabase()
      const { error } = await client
        .from('users')
        .update({
          status: 'rejected',
          approved_by: adminId,
          approved_at: new Date().toISOString(),
          rejection_reason: reason
        })
        .eq('id', userId)

      if (error) {
        console.error('User rejection error:', error)
        return { success: false, message: 'Failed to reject user' }
      }

      // Log activity
      await this.logActivity(adminId, 'user_rejected', { 
        rejected_user_id: userId, 
        reason 
      })

      return { success: true, message: 'User rejected successfully' }
    } catch (error) {
      console.error('User rejection error:', error)
      return { success: false, message: 'An error occurred while rejecting user' }
    }
  }

  // Log user activity
  private async logActivity(
    userId: string, 
    action: string, 
    details?: any, 
    ipAddress?: string, 
    userAgent?: string
  ): Promise<void> {
    try {
      const client = this.ensureSupabase()
      await client
        .from('user_activity_log')
        .insert({
          user_id: userId,
          action,
          details,
          ip_address: ipAddress,
          user_agent: userAgent
        })
    } catch (error) {
      console.error('Activity logging error:', error)
    }
  }

  // Clean expired sessions
  async cleanExpiredSessions(): Promise<void> {
    try {
      const client = this.ensureSupabase()
      await client
        .from('user_sessions')
        .delete()
        .lt('expires_at', new Date().toISOString())
    } catch (error) {
      console.error('Session cleanup error:', error)
    }
  }

  // Initialize admin user
  async initializeAdminUser(): Promise<void> {
    try {
      const adminEmail = 'waz@canhav.com'
      const adminPassword = 'admin123' // Change this in production!
      
      // Check if admin exists
      const client = this.ensureSupabase()
      const { data: existingAdmin } = await client
        .from('users')
        .select('id')
        .eq('email', adminEmail)
        .single()

      if (!existingAdmin) {
        const passwordHash = await this.hashPassword(adminPassword)
        
        await client
          .from('users')
          .insert({
            email: adminEmail,
            username: 'wazarat',
            password_hash: passwordHash,
            full_name: 'Wazarat Hussain',
            company_name: 'CanHav Research',
            job_title: 'Founder & CEO',
            status: 'approved',
            is_admin: true,
            email_verified: true,
            approved_at: new Date().toISOString()
          })

        console.log('Admin user initialized')
      }
    } catch (error) {
      console.error('Admin initialization error:', error)
    }
  }
}

export const authService = new AuthService()
