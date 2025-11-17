'use client'

import { useEffect, useState } from 'react'
import { SimpleAuthProvider } from '../lib/simple-auth-context'
import { CorporateAuthProvider } from '../lib/corporate-auth-context'
import { getSubdomainConfig } from '../lib/subdomain-utils'

interface SubdomainAwareLayoutProps {
  children: React.ReactNode
}

export default function SubdomainAwareLayout({ children }: SubdomainAwareLayoutProps) {
  const [subdomainConfig, setSubdomainConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const config = getSubdomainConfig(window.location.hostname)
      setSubdomainConfig(config)
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  // For corporate subdomains, use CorporateAuthProvider
  if (subdomainConfig?.type !== 'main') {
    return (
      <CorporateAuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50/30 to-blue-100/20">
          {children}
        </div>
      </CorporateAuthProvider>
    )
  }

  // For main domain, use SimpleAuthProvider
  return (
    <SimpleAuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
        {children}
      </div>
    </SimpleAuthProvider>
  )
}
