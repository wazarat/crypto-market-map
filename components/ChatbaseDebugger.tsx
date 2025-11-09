'use client'

import { useState, useEffect } from 'react'
import { chatbaseContext } from '../lib/chatbase-context'

export default function ChatbaseDebugger() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)

  const runDebugCheck = () => {
    const info = {
      timestamp: new Date().toISOString(),
      environment: {
        chatbotId: process.env.NEXT_PUBLIC_CHATBOT_ID,
        chatbaseHost: process.env.NEXT_PUBLIC_CHATBASE_HOST,
        nodeEnv: process.env.NODE_ENV
      },
      chatbaseStatus: {
        scriptLoaded: !!document.querySelector('script[src*="chatbase"]'),
        windowChatbase: typeof window.chatbase !== 'undefined',
        chatbaseType: typeof window.chatbase,
        chatbaseInitialized: !!(window as any).chatbaseInitialized
      },
      context: {
        currentContext: chatbaseContext.getCurrentContext(),
        hasContext: !!chatbaseContext.getCurrentContext()
      },
      dom: {
        chatbaseIframes: document.querySelectorAll('iframe[src*="chatbase"]').length,
        chatbaseScripts: document.querySelectorAll('script[src*="chatbase"]').length
      }
    }

    setDebugInfo(info)
    console.log('🔍 Chatbase Debug Info:', info)
  }

  const testChatbaseFunction = () => {
    try {
      if (window.chatbase) {
        const context = chatbaseContext.getCurrentContext()
        if (context) {
          window.chatbase('setContext', context)
          console.log('✅ Test: Context set successfully')
          alert('Context set successfully! Check console for details.')
        } else {
          console.log('⚠️ Test: No context available')
          alert('No context available to set')
        }
      } else {
        console.log('❌ Test: Chatbase not available')
        alert('Chatbase not loaded or available')
      }
    } catch (error) {
      console.error('❌ Test error:', error)
      alert(`Test failed: ${error}`)
    }
  }

  const refreshContext = () => {
    chatbaseContext.refreshContext()
    console.log('🔄 Context refresh triggered')
    alert('Context refresh triggered - check console')
  }

  useEffect(() => {
    // Auto-run debug check on mount
    setTimeout(runDebugCheck, 1000)
  }, [])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed top-4 left-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
      >
        🔍 Chatbase Debug
      </button>
      
      {isVisible && (
        <div className="mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md max-h-96 overflow-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900">Chatbase Debugger</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-2 mb-4">
            <button
              onClick={runDebugCheck}
              className="w-full bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            >
              Run Debug Check
            </button>
            <button
              onClick={testChatbaseFunction}
              className="w-full bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
            >
              Test Context Setting
            </button>
            <button
              onClick={refreshContext}
              className="w-full bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600"
            >
              Refresh Context
            </button>
          </div>

          {debugInfo && (
            <div className="text-xs space-y-2">
              <div>
                <strong>Environment:</strong>
                <div className="ml-2 text-gray-600">
                  <div>Chatbot ID: {debugInfo.environment.chatbotId ? '✅ Set' : '❌ Missing'}</div>
                  <div>Host: {debugInfo.environment.chatbaseHost || 'Default'}</div>
                </div>
              </div>
              
              <div>
                <strong>Chatbase Status:</strong>
                <div className="ml-2 text-gray-600">
                  <div>Script: {debugInfo.chatbaseStatus.scriptLoaded ? '✅' : '❌'}</div>
                  <div>Window.chatbase: {debugInfo.chatbaseStatus.windowChatbase ? '✅' : '❌'}</div>
                  <div>Initialized: {debugInfo.chatbaseStatus.chatbaseInitialized ? '✅' : '❌'}</div>
                </div>
              </div>
              
              <div>
                <strong>Context:</strong>
                <div className="ml-2 text-gray-600">
                  <div>Has Context: {debugInfo.context.hasContext ? '✅' : '❌'}</div>
                  {debugInfo.context.currentContext && (
                    <div className="text-xs bg-gray-100 p-1 rounded mt-1">
                      Company: {debugInfo.context.currentContext.company_name}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <strong>DOM Elements:</strong>
                <div className="ml-2 text-gray-600">
                  <div>Scripts: {debugInfo.dom.chatbaseScripts}</div>
                  <div>Iframes: {debugInfo.dom.chatbaseIframes}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
