'use client'

import { useEffect } from 'react'

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
  
  useEffect(() => {
    // Get chatbot configuration from environment variables
    const chatbotIdFromEnv = process.env.NEXT_PUBLIC_CHATBOT_ID
    const chatbaseHost = process.env.NEXT_PUBLIC_CHATBASE_HOST || 'https://www.chatbase.co'
    
    const finalChatbotId = chatbotId || chatbotIdFromEnv
    
    if (!finalChatbotId) {
      console.log('Chatbase: No chatbot ID provided')
      return
    }

    // Create chatbot configuration
    const chatbotConfig = {
      chatbotId: finalChatbotId,
      domain: chatbaseHost,
      // Pass company context to the chatbot
      context: companyName ? {
        companyName,
        pageType: 'company-profile',
        companyData: companyData ? {
          sector: companyData.sector_name,
          website: companyData.website,
          headquarters: companyData.headquarters_location,
          founded: companyData.year_founded,
          description: companyData.company_description
        } : null
      } : null
    }

    // Load Chatbase script
    const script = document.createElement('script')
    script.src = 'https://www.chatbase.co/embed.min.js'
    script.defer = true
    script.setAttribute('chatbotId', finalChatbotId)
    script.setAttribute('domain', chatbaseHost)
    
    // Add company context as data attributes
    if (companyName) {
      script.setAttribute('data-company', companyName)
      script.setAttribute('data-context', JSON.stringify(chatbotConfig.context))
    }

    // Set up the chatbot configuration
    window.embeddedChatbotConfig = chatbotConfig

    document.body.appendChild(script)

    // Cleanup function
    return () => {
      const existingScript = document.querySelector(`script[chatbotId="${finalChatbotId}"]`)
      if (existingScript) {
        document.body.removeChild(existingScript)
      }
      
      // Remove chatbot iframe if it exists
      const chatbotFrame = document.querySelector('iframe[src*="chatbase.co"]')
      if (chatbotFrame) {
        chatbotFrame.remove()
      }
      
      // Clean up global config
      delete window.embeddedChatbotConfig
    }
  }, [chatbotId, companyName, companyData])

  // Return null as the chatbot is injected via script
  return null
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    embeddedChatbotConfig?: any
  }
}
