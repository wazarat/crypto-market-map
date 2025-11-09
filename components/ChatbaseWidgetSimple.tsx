'use client'

import { useEffect } from 'react'

interface ChatbaseWidgetSimpleProps {
  companyName?: string
  companyData?: any
}

export default function ChatbaseWidgetSimple({ companyName, companyData }: ChatbaseWidgetSimpleProps) {
  useEffect(() => {
    const chatbotId = process.env.NEXT_PUBLIC_CHATBOT_ID
    
    console.log('🤖 Simple Chatbase Widget:', {
      chatbotId,
      companyName,
      hasCompanyData: !!companyData,
      environment: process.env.NODE_ENV
    })
    
    // Skip if no chatbot ID or if it's the placeholder value
    if (!chatbotId || chatbotId === 'your-chatbot-id-here') {
      console.log('⚠️ Chatbase: Invalid or missing chatbot ID')
      return
    }

    // Check if Chatbase is already loaded
    if (document.querySelector('#chatbase-script')) {
      console.log('🔄 Chatbase: Already loaded')
      return
    }

    // Create and load the Chatbase script
    const script = document.createElement('script')
    script.id = 'chatbase-script'
    script.src = 'https://www.chatbase.co/embed.min.js'
    script.defer = true
    script.setAttribute('chatbotId', chatbotId)
    script.setAttribute('domain', 'https://www.chatbase.co')
    
    // Add company context if available
    if (companyName && companyData) {
      const context = {
        company: companyName,
        sector: companyData.sector_name || 'Exchange Services',
        website: companyData.website,
        description: companyData.short_summary || companyData.company_description
      }
      
      // Set global context for Chatbase
      window.chatbaseContext = context
      console.log('📝 Chatbase context set:', context)
    }

    script.onload = () => {
      console.log('✅ Chatbase: Script loaded successfully')
      
      // Try to initialize Chatbase if it has an init function
      if (window.Chatbase && typeof window.Chatbase.init === 'function') {
        window.Chatbase.init({
          chatbotId,
          context: window.chatbaseContext
        })
      }
    }

    script.onerror = (error) => {
      console.error('❌ Chatbase: Script failed to load', error)
    }

    document.head.appendChild(script)
    console.log('📤 Chatbase: Script added to head')

    // Cleanup
    return () => {
      const scriptElement = document.querySelector('#chatbase-script')
      if (scriptElement) {
        scriptElement.remove()
        console.log('🧹 Chatbase: Script removed')
      }
      
      // Remove any Chatbase iframes
      const chatbaseIframes = document.querySelectorAll('iframe[src*="chatbase"]')
      chatbaseIframes.forEach(iframe => iframe.remove())
      
      // Clean up global context
      delete window.chatbaseContext
    }
  }, [companyName, companyData])

  return null
}

// Extend Window interface
declare global {
  interface Window {
    Chatbase?: any
    chatbaseContext?: any
  }
}
