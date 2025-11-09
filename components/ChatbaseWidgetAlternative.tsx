'use client'

import { useEffect } from 'react'

interface ChatbaseWidgetAlternativeProps {
  companyName?: string
  companyData?: any
}

export default function ChatbaseWidgetAlternative({ 
  companyName, 
  companyData 
}: ChatbaseWidgetAlternativeProps) {
  
  useEffect(() => {
    const chatbotId = process.env.NEXT_PUBLIC_CHATBOT_ID
    
    console.log('🤖 Alternative Chatbase Debug:', {
      chatbotId: chatbotId ? 'Set' : 'Not Set',
      chatbotIdLength: chatbotId?.length,
      companyName,
      NODE_ENV: process.env.NODE_ENV
    })
    
    if (!chatbotId) {
      console.error('❌ NEXT_PUBLIC_CHATBOT_ID not found')
      return
    }

    // Method 1: Standard Chatbase embed
    const script1 = document.createElement('script')
    script1.src = 'https://www.chatbase.co/embed.min.js'
    script1.setAttribute('chatbotId', chatbotId)
    script1.setAttribute('domain', 'https://www.chatbase.co')
    script1.defer = true
    
    // Method 2: Alternative embed approach
    const script2 = document.createElement('script')
    script2.innerHTML = `
      window.embeddedChatbotConfig = {
        chatbotId: "${chatbotId}",
        domain: "https://www.chatbase.co"
      }
    `
    
    // Method 3: Direct iframe approach (fallback)
    const createIframe = () => {
      const iframe = document.createElement('iframe')
      iframe.src = `https://www.chatbase.co/chatbot-iframe/${chatbotId}`
      iframe.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 400px;
        height: 600px;
        border: none;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 1000;
        background: white;
      `
      iframe.id = 'chatbase-iframe'
      document.body.appendChild(iframe)
      console.log('📱 Chatbase: Iframe created as fallback')
    }

    // Try method 1 first
    script1.onload = () => {
      console.log('✅ Chatbase: Standard script loaded')
    }
    
    script1.onerror = () => {
      console.log('⚠️ Chatbase: Standard script failed, trying iframe fallback')
      createIframe()
    }

    // Add scripts to DOM
    document.head.appendChild(script2)
    document.body.appendChild(script1)
    
    console.log('📤 Chatbase: Scripts added to DOM')

    // Cleanup
    return () => {
      // Remove scripts
      if (script1.parentNode) script1.parentNode.removeChild(script1)
      if (script2.parentNode) script2.parentNode.removeChild(script2)
      
      // Remove iframe if exists
      const iframe = document.getElementById('chatbase-iframe')
      if (iframe) iframe.remove()
      
      // Remove any other chatbase elements
      const chatbaseElements = document.querySelectorAll('[id*="chatbase"], [class*="chatbase"]')
      chatbaseElements.forEach(el => el.remove())
      
      console.log('🧹 Chatbase: Cleanup completed')
    }
  }, [companyName, companyData])

  return null
}
