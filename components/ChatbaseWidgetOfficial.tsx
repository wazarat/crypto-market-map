'use client'

import { useEffect } from 'react'

interface ChatbaseWidgetOfficialProps {
  companyName?: string
  companyData?: any
}

export default function ChatbaseWidgetOfficial({ companyName, companyData }: ChatbaseWidgetOfficialProps) {
  useEffect(() => {
    // Official Chatbase widget setup script
    const initializeChatbase = () => {
      // Prevent multiple initializations
      if (window.chatbaseInitialized) {
        console.log('🔄 Chatbase: Already initialized')
        return
      }

      // Official Chatbase initialization script
      if (!window.chatbase || window.chatbase("getState") !== "initialized") {
        window.chatbase = (...args: any[]) => {
          if (!window.chatbase.q) {
            window.chatbase.q = []
          }
          window.chatbase.q.push(args)
        }
        
        window.chatbase = new Proxy(window.chatbase, {
          get(target: any, prop: string) {
            if (prop === "q") {
              return target.q
            }
            return (...args: any[]) => target(prop, ...args)
          }
        })
      }

      const onLoad = () => {
        const chatbotId = process.env.NEXT_PUBLIC_CHATBOT_ID
        
        if (!chatbotId || chatbotId === 'your-chatbot-id-here') {
          console.error('❌ Chatbase: Invalid or missing NEXT_PUBLIC_CHATBOT_ID')
          return
        }

        const script = document.createElement("script")
        script.src = "https://www.chatbase.co/embed.min.js"
        script.id = chatbotId
        script.setAttribute('chatbotId', chatbotId)
        script.setAttribute('domain', "www.chatbase.co")
        
        script.onload = () => {
          console.log('✅ Official Chatbase: Script loaded successfully')
          
          // Set company context if available
          if (companyName && companyData) {
            const context = {
              company_name: companyName,
              company_sector: companyData.sector_name || 'Exchange Services',
              company_website: companyData.website,
              company_founded: companyData.year_founded,
              company_headquarters: companyData.headquarters_location,
              license_status: companyData.license_status,
              verification_status: companyData.verification_status,
              company_description: companyData.short_summary || companyData.company_description,
              current_page: `Company Profile: ${companyName}`,
              page_type: 'company_detail'
            }
            
            // Multiple attempts to set context with different methods
            const setContextWithRetry = (attempt = 1) => {
              if (attempt > 5) {
                console.error('❌ Failed to set Chatbase context after 5 attempts')
                return
              }
              
              try {
                if (window.chatbase) {
                  // Method 1: Standard setContext
                  window.chatbase('setContext', context)
                  
                  // Method 2: Set user attributes
                  window.chatbase('set', {
                    'custom_data': JSON.stringify(context)
                  })
                  
                  // Method 3: Send initial message with context
                  window.chatbase('sendMessage', {
                    message: `I am currently viewing the ${companyName} company profile. Please provide information about this company.`,
                    context: context
                  })
                  
                  console.log('✅ Chatbase context set successfully:', context)
                } else {
                  console.log(`⏳ Chatbase not ready, retrying attempt ${attempt}...`)
                  setTimeout(() => setContextWithRetry(attempt + 1), 1000)
                }
              } catch (error) {
                console.error('❌ Error setting Chatbase context:', error)
                setTimeout(() => setContextWithRetry(attempt + 1), 1000)
              }
            }
            
            // Start context setting with delay
            setTimeout(() => setContextWithRetry(), 500)
          }
          
          // Mark as initialized
          window.chatbaseInitialized = true
        }
        
        script.onerror = (error) => {
          console.error('❌ Official Chatbase: Script failed to load', error)
        }
        
        document.body.appendChild(script)
        console.log('📤 Official Chatbase: Script added to DOM')
      }

      if (document.readyState === "complete") {
        onLoad()
      } else {
        window.addEventListener("load", onLoad)
      }
    }

    // Initialize Chatbase
    initializeChatbase()

    // Cleanup function
    return () => {
      // Remove event listeners and reset state
      window.chatbaseInitialized = false
    }
  }, [companyName, companyData])

  return null
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    chatbase?: any
    chatbaseInitialized?: boolean
  }
}
