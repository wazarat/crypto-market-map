'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sector } from '../lib/api'

interface EnhancedSectorCardProps {
  sector: Sector
  index: number
}

const sectorGradients = {
  'advisory-services': 'from-blue-500/20 via-violet-500/20 to-purple-500/20',
  'broker-dealer-services': 'from-emerald-500/20 via-teal-500/20 to-cyan-500/20',
  'custody-services': 'from-teal-500/20 via-green-500/20 to-emerald-500/20',
  'exchange-services': 'from-orange-500/20 via-red-500/20 to-pink-500/20',
  'lending-borrowing': 'from-purple-500/20 via-indigo-500/20 to-blue-500/20',
  'derivatives': 'from-rose-500/20 via-pink-500/20 to-fuchsia-500/20',
  'asset-management': 'from-amber-500/20 via-yellow-500/20 to-orange-500/20',
  'transfer-settlement': 'from-indigo-500/20 via-blue-500/20 to-cyan-500/20',
  'fiat-tokens': 'from-green-500/20 via-emerald-500/20 to-teal-500/20',
  'asset-tokens': 'from-violet-500/20 via-purple-500/20 to-indigo-500/20',
}

const sectorGlows = {
  'advisory-services': 'hover:shadow-blue-500/25',
  'broker-dealer-services': 'hover:shadow-emerald-500/25',
  'custody-services': 'hover:shadow-teal-500/25',
  'exchange-services': 'hover:shadow-orange-500/25',
  'lending-borrowing': 'hover:shadow-purple-500/25',
  'derivatives': 'hover:shadow-rose-500/25',
  'asset-management': 'hover:shadow-amber-500/25',
  'transfer-settlement': 'hover:shadow-indigo-500/25',
  'fiat-tokens': 'hover:shadow-green-500/25',
  'asset-tokens': 'hover:shadow-violet-500/25',
}

export default function EnhancedSectorCard({ sector, index }: EnhancedSectorCardProps) {
  const gradient = sectorGradients[sector.slug as keyof typeof sectorGradients] || 'from-gray-500/20 to-slate-500/20'
  const glow = sectorGlows[sector.slug as keyof typeof sectorGlows] || 'hover:shadow-gray-500/25'

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ 
        scale: 1.02,
        y: -8,
        transition: { duration: 0.3, type: "spring", stiffness: 300 }
      }}
      className="group relative w-full min-h-[200px] h-full"
    >
      <Link href={`/sector/${sector.slug}`}>
        <div className={`
          relative h-full overflow-hidden rounded-2xl
          bg-white/40 backdrop-blur-md border border-white/20
          shadow-lg hover:shadow-2xl ${glow}
          transition-all duration-500 ease-out
          hover:border-white/40 hover:bg-white/50
          cursor-pointer
        `}>
          {/* Gradient Overlay */}
          <div className={`
            absolute inset-0 bg-gradient-to-br ${gradient}
            opacity-60 group-hover:opacity-90 transition-opacity duration-500
          `} />
          
          {/* Glow Effect */}
          <div className="
            absolute inset-0 opacity-0 group-hover:opacity-100
            bg-gradient-radial from-white/15 via-transparent to-transparent
            transition-opacity duration-500
          " />
          
          {/* Content with Consistent Vertical Rhythm */}
          <div className="relative h-full p-6 flex flex-col">
            {/* Title */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-0 group-hover:text-gray-800 transition-colors leading-tight">
                {sector.name}
              </h3>
            </div>
            
            {/* Description - Flexible Space */}
            <div className="flex-1 mb-4">
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-3 group-hover:text-gray-600 transition-colors">
                {sector.description}
              </p>
            </div>
            
            {/* Footer - Always at Bottom */}
            <div className="flex items-center justify-between mt-auto">
              <span className="
                inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                bg-white/30 backdrop-blur-sm border border-white/20
                text-gray-800 group-hover:bg-white/50 transition-all duration-300
              ">
                {sector.company_count} companies
              </span>
              
              <motion.div
                className="
                  w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30
                  flex items-center justify-center group-hover:bg-white/40 transition-all duration-300
                "
                whileHover={{ scale: 1.15, rotate: 15 }}
                animate={{ 
                  x: [0, 2, 0],
                  transition: { 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.svg 
                  className="w-4 h-4 text-gray-700 group-hover:text-gray-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{
                    x: [0, 3, 0],
                    transition: {
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </motion.svg>
              </motion.div>
            </div>
          </div>
          
          {/* Floating Particles Effect */}
          <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-2 h-2 bg-white rounded-full"
            />
          </div>
          <div className="absolute top-8 right-8 opacity-15 group-hover:opacity-30 transition-opacity duration-500">
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, -8, 0]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
