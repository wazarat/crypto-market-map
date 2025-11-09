// Enhanced Chatbase Context Management
export interface CompanyContext {
  company_name: string
  company_sector: string
  company_website?: string
  company_founded?: string
  company_headquarters?: string
  license_status?: string
  verification_status?: string
  company_description?: string
  current_page: string
  page_type: string
}

export class ChatbaseContextManager {
  private static instance: ChatbaseContextManager
  private currentContext: CompanyContext | null = null
  private contextSetAttempts = 0
  private maxAttempts = 10

  private constructor() {}

  static getInstance(): ChatbaseContextManager {
    if (!ChatbaseContextManager.instance) {
      ChatbaseContextManager.instance = new ChatbaseContextManager()
    }
    return ChatbaseContextManager.instance
  }

  setCompanyContext(companyData: any, companyName: string) {
    this.currentContext = {
      company_name: companyName,
      company_sector: companyData.sector_name || companyData.category?.name || 'Exchange Services',
      company_website: companyData.website,
      company_founded: companyData.year_founded?.toString(),
      company_headquarters: companyData.headquarters_location,
      license_status: companyData.license_status,
      verification_status: companyData.verification_status,
      company_description: companyData.short_summary || companyData.company_description,
      current_page: `Company Profile: ${companyName}`,
      page_type: 'company_detail'
    }

    console.log('🏢 Company context prepared:', this.currentContext)
    this.attemptContextSetting()
  }

  private attemptContextSetting() {
    if (!this.currentContext) return

    this.contextSetAttempts++
    
    if (this.contextSetAttempts > this.maxAttempts) {
      console.error('❌ Max attempts reached for setting Chatbase context')
      return
    }

    try {
      if (typeof window !== 'undefined' && window.chatbase) {
        // Method 1: Set context directly
        window.chatbase('setContext', this.currentContext)
        
        // Method 2: Set as user attributes
        window.chatbase('set', {
          custom_data: JSON.stringify(this.currentContext),
          company: this.currentContext.company_name,
          sector: this.currentContext.company_sector,
          page_type: this.currentContext.page_type
        })

        // Method 3: Send a system message with context
        window.chatbase('system', {
          message: `User is viewing ${this.currentContext.company_name} company profile`,
          context: this.currentContext
        })

        // Method 4: Initialize conversation with context
        const contextMessage = this.generateContextMessage()
        window.chatbase('sendMessage', {
          message: contextMessage,
          context: this.currentContext,
          silent: true // Don't show this message to user
        })

        console.log('✅ Chatbase context set successfully via multiple methods')
        this.contextSetAttempts = 0 // Reset on success
        
      } else {
        console.log(`⏳ Chatbase not ready, attempt ${this.contextSetAttempts}/${this.maxAttempts}`)
        setTimeout(() => this.attemptContextSetting(), 1000)
      }
    } catch (error) {
      console.error('❌ Error setting Chatbase context:', error)
      setTimeout(() => this.attemptContextSetting(), 1000)
    }
  }

  private generateContextMessage(): string {
    if (!this.currentContext) return ''

    const { company_name, company_sector, license_status, company_description } = this.currentContext
    
    return `I am currently viewing the ${company_name} company profile. This is a ${company_sector} company with ${license_status} license status. ${company_description ? `Description: ${company_description}` : ''} Please provide relevant information about this company when asked.`
  }

  // Force context refresh
  refreshContext() {
    if (this.currentContext) {
      this.contextSetAttempts = 0
      this.attemptContextSetting()
    }
  }

  // Get current context
  getCurrentContext(): CompanyContext | null {
    return this.currentContext
  }

  // Clear context
  clearContext() {
    this.currentContext = null
    this.contextSetAttempts = 0
  }
}

// Export singleton instance
export const chatbaseContext = ChatbaseContextManager.getInstance()

// Global function to manually refresh context (for debugging)
if (typeof window !== 'undefined') {
  (window as any).refreshChatbaseContext = () => {
    chatbaseContext.refreshContext()
    console.log('🔄 Chatbase context refresh triggered')
  }
}
