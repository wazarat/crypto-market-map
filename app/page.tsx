'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ExternalLink, Building2, TrendingUp, LogOut, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { unifiedApiClient } from '../lib/unified-api'
import { Sector } from '../lib/api'
import EnhancedSectorCard from '../components/EnhancedSectorCard'
import { useSimpleAuth } from '../lib/simple-auth-context'

export default function HomePage() {
  const [sectors, setSectors] = useState<Sector[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { user, isAuthenticated, signOut } = useSimpleAuth()

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const data = await unifiedApiClient.getSectors()
        setSectors(data as Sector[])
      } catch (err) {
        setError('Failed to load sectors')
        console.error('Error fetching sectors:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSectors()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading crypto market map...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white/60 backdrop-blur-xl border-b border-white/20 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex flex-col">
                <span className="text-3xl font-bold font-inter-tight bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  CanHav Research
                </span>
                <span className="text-sm font-medium text-gray-600 -mt-1">
                  Simplifying Crypto
                </span>
              </div>
            </motion.div>
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex space-x-8">
                <a href="#" className="text-gray-600 hover:text-gray-900">Companies</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Research</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
                {user?.email === 'waz@canhav.com' && (
                  <Link href="/admin" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Admin
                  </Link>
                )}
              </nav>
              
              {/* Authentication Section */}
              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>{user?.email}</span>
                    </div>
                    <button
                      onClick={signOut}
                      className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link
                      href="/login"
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="text-sm bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h2 
            className="text-5xl font-bold font-inter-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Explore the Crypto Ecosystem
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Click on a sector to discover companies and projects shaping the future of digital finance.
          </motion.p>
        </motion.div>

        {/* Enhanced Sectors Grid - Controlled Layout */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {sectors.map((sector, index) => (
            <EnhancedSectorCard key={sector.id} sector={sector} index={index} />
          ))}
        </motion.div>
      </main>
    </div>
  )
}
