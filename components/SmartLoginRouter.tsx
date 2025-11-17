'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSubdomainConfig } from '../lib/subdomain-utils'

export default function SmartLoginRouter() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const config = getSubdomainConfig(window.location.hostname)
      
      // If on a corporate subdomain, redirect to corporate login
      if (config.type !== 'main') {
        router.replace('/corporate/login')
      }
      // If on main domain and somehow ended up here, stay on regular login
      // This component should only be used as a redirect mechanism
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  )
}
