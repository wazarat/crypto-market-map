'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import RoadToSandbox from '../../components/RoadToSandbox'

export default function SandboxJourneyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white/60 backdrop-blur-xl border-b border-white/20 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-6">
              <Link 
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
              
              <motion.div 
                className="flex items-center space-x-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="flex flex-col">
                  <span className="text-3xl font-bold font-inter-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    Road to Sandbox
                  </span>
                  <span className="text-sm font-medium text-gray-600 -mt-1">
                    Regulatory Pathway Guide
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Road to Sandbox Content */}
      <RoadToSandbox />
    </div>
  )
}
