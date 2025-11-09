'use client'

import { useEffect, useState } from 'react'

interface ChatbaseWidgetForcedProps {
  companyName?: string
  companyData?: any
}

export default function ChatbaseWidgetForced({ companyName, companyData }: ChatbaseWidgetForcedProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const chatbotId = process.env.NEXT_PUBLIC_CHATBOT_ID
    
    if (!chatbotId || chatbotId === 'your-chatbot-id-here') {
      setError('Invalid chatbot ID')
      return
    }

    // Remove any existing Chatbase elements
    const existingScripts = document.querySelectorAll('script[src*="chatbase"]')
    const existingIframes = document.querySelectorAll('iframe[src*="chatbase"]')
    const existingWidgets = document.querySelectorAll('[id*="chatbase"], [class*="chatbase"]')
    
    existingScripts.forEach(el => el.remove())
    existingIframes.forEach(el => el.remove())
    existingWidgets.forEach(el => el.remove())

    // Create a container for the chatbot
    const container = document.createElement('div')
    container.id = 'chatbase-container'
    container.style.cssText = `
      position: fixed !important;
      bottom: 20px !important;
      right: 20px !important;
      z-index: 999999 !important;
      width: 400px !important;
      height: 600px !important;
      background: white !important;
      border: 2px solid #3B82F6 !important;
      border-radius: 12px !important;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2) !important;
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
    `
    document.body.appendChild(container)

    // Set up global Chatbase configuration
    window.embeddedChatbotConfig = {
      chatbotId: chatbotId,
      domain: 'https://www.chatbase.co',
      container: '#chatbase-container'
    }

    // Add company context
    if (companyName && companyData) {
      window.chatbaseContext = {
        company: companyName,
        sector: companyData.sector_name || 'Exchange Services',
        website: companyData.website,
        description: companyData.short_summary
      }
    }

    // Load Chatbase script
    const script = document.createElement('script')
    script.src = 'https://www.chatbase.co/embed.min.js'
    script.defer = true
    script.setAttribute('chatbotId', chatbotId)
    script.setAttribute('domain', 'https://www.chatbase.co')
    
    script.onload = () => {
      console.log('✅ Forced Chatbase: Script loaded')
      setIsLoaded(true)
      
      // Force widget initialization after a delay
      setTimeout(() => {
        // Try different initialization methods
        if (window.Chatbase) {
          if (typeof window.Chatbase.init === 'function') {
            window.Chatbase.init(window.embeddedChatbotConfig)
          }
          if (typeof window.Chatbase.show === 'function') {
            window.Chatbase.show()
          }
        }
        
        // Check if iframe was created
        const iframe = document.querySelector('iframe[src*="chatbase"]') as HTMLIFrameElement
        if (iframe) {
          console.log('✅ Chatbase iframe found:', iframe)
          // Ensure iframe is visible
          iframe.style.cssText = `
            width: 100% !important;
            height: 100% !important;
            border: none !important;
            display: block !important;
            visibility: visible !important;
          `
        } else {
          console.log('⚠️ No Chatbase iframe found after initialization')
        }
      }, 2000)
    }

    script.onerror = (err) => {
      console.error('❌ Forced Chatbase: Script failed to load', err)
      setError('Failed to load chatbot script')
    }

    document.head.appendChild(script)

    // Cleanup
    return () => {
      const containerEl = document.getElementById('chatbase-container')
      if (containerEl) {
        containerEl.remove()
      }
      
      const scriptEl = document.querySelector('script[src*="chatbase"]')
      if (scriptEl) {
        scriptEl.remove()
      }
      
      delete window.embeddedChatbotConfig
      delete window.chatbaseContext
    }
  }, [companyName, companyData])

  return (
    <div className="fixed bottom-4 left-4 bg-blue-100 border border-blue-300 rounded-lg p-3 text-sm max-w-xs">
      <div className="font-medium text-blue-800 mb-1">Chatbase Status</div>
      {error ? (
        <div className="text-red-600">Error: {error}</div>
      ) : isLoaded ? (
        <div className="text-green-600">✅ Loaded - Check bottom right</div>
      ) : (
        <div className="text-yellow-600">⏳ Loading...</div>
      )}
    </div>
  )
}

// Extend Window interface
declare global {
  interface Window {
    embeddedChatbotConfig?: any
    chatbaseContext?: any
    Chatbase?: any
  }
}
