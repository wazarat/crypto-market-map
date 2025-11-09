// Chatbase Identity System for Personalized Responses

export interface ChatbaseUser {
  user_id: string
  email?: string
  name?: string
  role?: string
  company_access?: string[]
  research_interests?: string[]
}

export class ChatbaseIdentityManager {
  private static instance: ChatbaseIdentityManager
  private currentUser: ChatbaseUser | null = null

  private constructor() {}

  static getInstance(): ChatbaseIdentityManager {
    if (!ChatbaseIdentityManager.instance) {
      ChatbaseIdentityManager.instance = new ChatbaseIdentityManager()
    }
    return ChatbaseIdentityManager.instance
  }

  // Set current user for Chatbase identification
  setUser(user: ChatbaseUser) {
    this.currentUser = user
    console.log('👤 Chatbase Identity: User set', { user_id: user.user_id, email: user.email })
  }

  // Get current user
  getCurrentUser(): ChatbaseUser | null {
    return this.currentUser
  }

  // Generate a simple client-side token (for demo purposes)
  // In production, this should be generated server-side with proper JWT signing
  generateClientToken(): string | null {
    if (!this.currentUser) {
      return null
    }

    // Simple base64 encoded user info (NOT secure for production)
    const payload = {
      user_id: this.currentUser.user_id,
      email: this.currentUser.email,
      name: this.currentUser.name,
      role: this.currentUser.role,
      timestamp: Date.now(),
      // Add company context if available
      company_access: this.currentUser.company_access,
      research_interests: this.currentUser.research_interests
    }

    try {
      return btoa(JSON.stringify(payload))
    } catch (error) {
      console.error('❌ Failed to generate client token:', error)
      return null
    }
  }

  // Identify user with Chatbase
  async identifyWithChatbase(companyContext?: any) {
    if (!this.currentUser || !window.chatbase) {
      console.log('⚠️ Cannot identify: No user or Chatbase not loaded')
      return
    }

    const token = this.generateClientToken()
    if (!token) {
      console.error('❌ Failed to generate identity token')
      return
    }

    try {
      // Identify user with Chatbase
      window.chatbase('identify', { token })
      
      // Set additional context if company data is available
      if (companyContext) {
        const enhancedContext = {
          ...companyContext,
          user_role: this.currentUser.role,
          user_interests: this.currentUser.research_interests,
          viewing_company: companyContext.company
        }
        
        window.chatbase('setContext', enhancedContext)
        console.log('🔗 Chatbase: Enhanced context set with user identity')
      }
      
      console.log('✅ Chatbase: User identified successfully')
    } catch (error) {
      console.error('❌ Chatbase identification failed:', error)
    }
  }

  // Create a demo user for testing
  createDemoUser(): ChatbaseUser {
    return {
      user_id: `demo_${Date.now()}`,
      email: 'researcher@pakistancrypto.council',
      name: 'VASP Researcher',
      role: 'researcher',
      company_access: ['exchange-services', 'custody-services'],
      research_interests: ['regulatory-compliance', 'market-analysis', 'due-diligence']
    }
  }

  // Set up demo user for testing
  setupDemoUser() {
    const demoUser = this.createDemoUser()
    this.setUser(demoUser)
    return demoUser
  }
}

// Export singleton instance
export const chatbaseIdentity = ChatbaseIdentityManager.getInstance()
