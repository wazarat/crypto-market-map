'use client'

import { useEffect, useState } from 'react'

interface ChatbaseWidgetProps {
  chatbotId?: string
  companyName?: string
  companyData?: any
}

export default function ChatbaseWidget({ 
  chatbotId, 
  companyName, 
  companyData 
}: ChatbaseWidgetProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    // Get chatbot configuration from environment variables
    const chatbotIdFromEnv = process.env.NEXT_PUBLIC_CHATBOT_ID
    const chatbaseHost = process.env.NEXT_PUBLIC_CHATBASE_HOST || 'https://www.chatbase.co'
    
    const finalChatbotId = chatbotId || chatbotIdFromEnv
    
    console.log('🤖 Chatbase Debug:', {
      chatbotIdFromEnv,
      chatbaseHost,
      finalChatbotId,
      companyName,
      hasCompanyData: !!companyData
    })
    
    if (!finalChatbotId) {
      console.error('❌ Chatbase: No chatbot ID provided')
      setError('No chatbot ID configured')
      setIsLoading(false)
      return
    }

    // Check if script already exists
    const existingScript = document.querySelector(`script[data-chatbot-id="${finalChatbotId}"]`)
    if (existingScript) {
      console.log('🔄 Chatbase: Script already loaded')
      setIsLoading(false)
      return
    }

    // Create chatbot configuration
    const chatbotConfig = {
      chatbotId: finalChatbotId,
      domain: chatbaseHost
    }

    // Set up the chatbot configuration globally
    window.embeddedChatbotConfig = chatbotConfig

    // Load Chatbase script with proper error handling
    const script = document.createElement('script')
    script.src = 'https://www.chatbase.co/embed.min.js'
    script.defer = true
    script.setAttribute('data-chatbot-id', finalChatbotId)
    script.setAttribute('chatbotId', finalChatbotId)
    script.setAttribute('domain', chatbaseHost)
    
    // Add company context as data attributes if available
    if (companyName) {
      script.setAttribute('data-company', companyName)
      if (companyData) {
        const contextData = {
          companyName,
          sector: companyData.sector_name,
          website: companyData.website,
          headquarters: companyData.headquarters_location,
          founded: companyData.year_founded,
          description: companyData.company_description || companyData.short_summary
        }
        script.setAttribute('data-context', JSON.stringify(contextData))
      }
    }

    script.onload = () => {
      console.log('✅ Chatbase: Script loaded successfully')
      setIsLoading(false)
    }

    script.onerror = (err) => {
      console.error('❌ Chatbase: Failed to load script', err)
      setError('Failed to load chatbot')
      setIsLoading(false)
    }

    document.body.appendChild(script)
    console.log('📤 Chatbase: Script added to DOM')

    // Cleanup function
    return () => {
      const scriptToRemove = document.querySelector(`script[data-chatbot-id="${finalChatbotId}"]`)
      if (scriptToRemove) {
        document.body.removeChild(scriptToRemove)
        console.log('🧹 Chatbase: Script removed from DOM')
      }
      
      // Remove chatbot iframe if it exists
      const chatbotFrame = document.querySelector('iframe[src*="chatbase.co"]')
      if (chatbotFrame) {
        chatbotFrame.remove()
        console.log('🧹 Chatbase: Iframe removed')
      }
      
      // Clean up global config
      delete window.embeddedChatbotConfig
    }
  }, [chatbotId, companyName, companyData])

  // Show debug info in development
  if (process.env.NODE_ENV === 'development' && (isLoading || error)) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-lg text-sm max-w-xs">
        {isLoading && (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Loading Chatbase...
          </div>
        )}
        {error && (
          <div className="text-red-300">
            Chatbase Error: {error}
          </div>
        )}
      </div>
    )
  }

  // Return null as the chatbot is injected via script
  return null
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    embeddedChatbotConfig?: any
  }
}
