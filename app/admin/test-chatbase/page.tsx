'use client'

import { useState } from 'react'

export default function TestChatbasePage() {
  const [testResults, setTestResults] = useState<any>(null)

  const runChatbaseTests = () => {
    const results = {
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_CHATBOT_ID: process.env.NEXT_PUBLIC_CHATBOT_ID,
        NEXT_PUBLIC_CHATBASE_HOST: process.env.NEXT_PUBLIC_CHATBASE_HOST,
        hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        hasSupabaseKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      },
      chatbaseConfig: {
        chatbotIdExists: Boolean(process.env.NEXT_PUBLIC_CHATBOT_ID),
        chatbotIdLength: process.env.NEXT_PUBLIC_CHATBOT_ID?.length || 0,
        chatbotIdValue: process.env.NEXT_PUBLIC_CHATBOT_ID || 'NOT SET',
        hostExists: Boolean(process.env.NEXT_PUBLIC_CHATBASE_HOST),
        hostValue: process.env.NEXT_PUBLIC_CHATBASE_HOST || 'NOT SET'
      },
      scriptTest: {
        canCreateScript: true,
        scriptSrc: 'https://www.chatbase.co/embed.min.js'
      },
      domTest: {
        canAccessDocument: typeof document !== 'undefined',
        canAccessWindow: typeof window !== 'undefined',
        existingChatbaseScripts: typeof document !== 'undefined' ? 
          document.querySelectorAll('script[src*="chatbase"]').length : 'N/A',
        existingChatbaseIframes: typeof document !== 'undefined' ? 
          document.querySelectorAll('iframe[src*="chatbase"]').length : 'N/A'
      }
    }

    console.log('🧪 Chatbase Test Results:', results)
    setTestResults(results)
  }

  const testDirectChatbaseLoad = () => {
    const chatbotId = process.env.NEXT_PUBLIC_CHATBOT_ID
    
    if (!chatbotId) {
      alert('No NEXT_PUBLIC_CHATBOT_ID found in environment variables')
      return
    }

    // Try to load Chatbase directly
    const script = document.createElement('script')
    script.src = 'https://www.chatbase.co/embed.min.js'
    script.defer = true
    script.setAttribute('chatbotId', chatbotId)
    script.setAttribute('domain', 'https://www.chatbase.co')
    
    script.onload = () => {
      console.log('✅ Direct Chatbase load successful')
      alert('Chatbase script loaded successfully!')
    }

    script.onerror = (err) => {
      console.error('❌ Direct Chatbase load failed:', err)
      alert('Failed to load Chatbase script')
    }

    document.head.appendChild(script)
    console.log('📤 Direct Chatbase script added to head')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Chatbase Integration Test</h1>
          
          <div className="space-y-4">
            <button
              onClick={runChatbaseTests}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Run Chatbase Tests
            </button>
            
            <button
              onClick={testDirectChatbaseLoad}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 ml-4"
            >
              Test Direct Chatbase Load
            </button>
          </div>

          {testResults && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h2>
              
              <div className="space-y-6">
                {/* Environment Variables */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Environment Variables</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>NODE_ENV:</span>
                      <span className="font-mono">{testResults.environment.NODE_ENV}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>NEXT_PUBLIC_CHATBOT_ID:</span>
                      <span className={`font-mono ${testResults.environment.NEXT_PUBLIC_CHATBOT_ID ? 'text-green-600' : 'text-red-600'}`}>
                        {testResults.environment.NEXT_PUBLIC_CHATBOT_ID || 'NOT SET'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>NEXT_PUBLIC_CHATBASE_HOST:</span>
                      <span className={`font-mono ${testResults.environment.NEXT_PUBLIC_CHATBASE_HOST ? 'text-green-600' : 'text-yellow-600'}`}>
                        {testResults.environment.NEXT_PUBLIC_CHATBASE_HOST || 'NOT SET (using default)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Chatbase Configuration */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Chatbase Configuration</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Chatbot ID Length:</span>
                      <span className="font-mono">{testResults.chatbaseConfig.chatbotIdLength} characters</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chatbot ID Value:</span>
                      <span className="font-mono text-xs">{testResults.chatbaseConfig.chatbotIdValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Host Value:</span>
                      <span className="font-mono">{testResults.chatbaseConfig.hostValue}</span>
                    </div>
                  </div>
                </div>

                {/* DOM Test */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">DOM & Script Test</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Can Access Document:</span>
                      <span className={`font-mono ${testResults.domTest.canAccessDocument ? 'text-green-600' : 'text-red-600'}`}>
                        {testResults.domTest.canAccessDocument ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Can Access Window:</span>
                      <span className={`font-mono ${testResults.domTest.canAccessWindow ? 'text-green-600' : 'text-red-600'}`}>
                        {testResults.domTest.canAccessWindow ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Existing Chatbase Scripts:</span>
                      <span className="font-mono">{testResults.domTest.existingChatbaseScripts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Existing Chatbase Iframes:</span>
                      <span className="font-mono">{testResults.domTest.existingChatbaseIframes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Instructions</h3>
            <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
              <li>Click "Run Chatbase Tests" to check environment variables and configuration</li>
              <li>Verify that NEXT_PUBLIC_CHATBOT_ID is set and not "your-chatbot-id-here"</li>
              <li>Click "Test Direct Chatbase Load" to try loading the Chatbase script directly</li>
              <li>Check browser console for detailed debug logs</li>
              <li>If chatbot ID is missing, update your Vercel environment variables</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
