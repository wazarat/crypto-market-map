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
        const script = document.createElement("script")
        script.src = "https://www.chatbase.co/embed.min.js"
        script.id = "-jDdVmTLLPOcK3BzQBBsi"
        script.setAttribute('domain', "www.chatbase.co")
        
        script.onload = () => {
          console.log('✅ Official Chatbase: Script loaded successfully')
          
          // Set company context if available
          if (companyName && companyData) {
            const context = {
              company: companyName,
              sector: companyData.sector_name || 'Exchange Services',
              website: companyData.website,
              founded: companyData.year_founded,
              headquarters: companyData.headquarters_location,
              license_status: companyData.license_status,
              verification_status: companyData.verification_status,
              description: companyData.short_summary || companyData.company_description
            }
            
            // Set context for Chatbase
            if (window.chatbase) {
              window.chatbase('setContext', context)
              console.log('📝 Chatbase context set:', context)
            }
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
