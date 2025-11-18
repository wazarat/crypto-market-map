'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Building2, Map, ArrowRight, Search, Zap, Shield, TrendingUp } from 'lucide-react'

const choiceOptions = [
  {
    id: 'research',
    title: 'Research Portal',
    subtitle: 'Explore the Crypto Ecosystem',
    description: 'Discover companies and projects shaping the future of digital finance across 10 key sectors.',
    features: [
      'Browse 10+ Virtual Asset Sectors',
      'Company Profiles & Analysis',
      'Market Intelligence',
      'Industry Insights'
    ],
    icon: Search,
    route: '/research',
    gradient: 'from-blue-600 via-purple-600 to-indigo-600',
    bgGradient: 'from-blue-50/50 via-purple-50/30 to-indigo-50/50',
    cardGradient: 'from-blue-500/20 via-purple-500/20 to-indigo-500/20',
    glowColor: 'hover:shadow-blue-500/25',
    accentColor: 'text-blue-600',
    buttonGradient: 'from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
  },
  {
    id: 'sandbox',
    title: 'Road to Sandbox',
    subtitle: 'Navigate Regulatory Pathway',
    description: 'Understand the Virtual Asset Regulatory Sandbox process and requirements for Pakistan.',
    features: [
      '4-Stage Regulatory Process',
      'Application Guidelines',
      'Compliance Requirements',
      'Licensing Pathway'
    ],
    icon: Shield,
    route: '/sandbox-journey',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    bgGradient: 'from-emerald-50/50 via-teal-50/30 to-cyan-50/50',
    cardGradient: 'from-emerald-500/20 via-teal-500/20 to-cyan-500/20',
    glowColor: 'hover:shadow-emerald-500/25',
    accentColor: 'text-emerald-600',
    buttonGradient: 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
  }
]

export default function LandingChoice() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white/60 backdrop-blur-xl border-b border-white/20 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-20">
            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex flex-col text-center">
                <span className="text-3xl font-bold font-inter-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  CanHav Research
                </span>
                <span className="text-sm font-medium text-gray-600 -mt-1">
                  Simplifying Crypto
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1 
            className="text-6xl md:text-7xl font-bold font-inter-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            PVARA Platform
          </motion.h1>
          <motion.p 
            className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Choose your path to explore Pakistan's virtual asset ecosystem
          </motion.p>
          <motion.p 
            className="text-lg text-gray-500 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Whether you're researching the market or navigating regulatory requirements, we've got you covered.
          </motion.p>
        </motion.div>

        {/* Choice Cards */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          {choiceOptions.map((option, index) => {
            const IconComponent = option.icon
            
            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 1.2 + index * 0.2,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                whileHover={{ 
                  scale: 1.02,
                  y: -10,
                  transition: { duration: 0.3, type: "spring", stiffness: 300 }
                }}
                className="group relative"
              >
                <Link href={option.route}>
                  <div className={`
                    relative h-full min-h-[600px] overflow-hidden rounded-3xl
                    bg-white/60 backdrop-blur-md border border-white/30
                    shadow-2xl ${option.glowColor}
                    transition-all duration-500 ease-out
                    hover:border-white/50 hover:bg-white/70
                    cursor-pointer
                  `}>
                    {/* Background Gradient */}
                    <div className={`
                      absolute inset-0 bg-gradient-to-br ${option.bgGradient}
                      opacity-40 group-hover:opacity-60 transition-opacity duration-500
                    `} />
                    
                    {/* Card Gradient Overlay */}
                    <div className={`
                      absolute inset-0 bg-gradient-to-br ${option.cardGradient}
                      opacity-30 group-hover:opacity-50 transition-opacity duration-500
                    `} />
                    
                    {/* Glow Effect */}
                    <div className="
                      absolute inset-0 opacity-0 group-hover:opacity-100
                      bg-gradient-radial from-white/20 via-transparent to-transparent
                      transition-opacity duration-500
                    " />
                    
                    {/* Content */}
                    <div className="relative h-full p-8 flex flex-col">
                      {/* Header */}
                      <div className="text-center mb-8">
                        <div className="flex justify-center mb-6">
                          <div className={`
                            w-20 h-20 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/40
                            flex items-center justify-center group-hover:bg-white/50 transition-all duration-300
                            group-hover:scale-110 group-hover:rotate-3
                          `}>
                            <IconComponent className={`w-10 h-10 ${option.accentColor}`} />
                          </div>
                        </div>
                        
                        <h2 className={`text-4xl font-bold bg-gradient-to-r ${option.gradient} bg-clip-text text-transparent mb-3`}>
                          {option.title}
                        </h2>
                        <p className="text-xl font-semibold text-gray-700 group-hover:text-gray-600 transition-colors">
                          {option.subtitle}
                        </p>
                      </div>
                      
                      {/* Description */}
                      <div className="flex-1 mb-8">
                        <p className="text-gray-600 text-lg leading-relaxed text-center mb-8 group-hover:text-gray-500 transition-colors">
                          {option.description}
                        </p>
                        
                        {/* Features */}
                        <div className="space-y-4">
                          {option.features.map((feature, featureIndex) => (
                            <motion.div
                              key={featureIndex}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ 
                                duration: 0.5, 
                                delay: 1.6 + index * 0.2 + featureIndex * 0.1 
                              }}
                              className="flex items-center space-x-3 p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 group-hover:bg-white/40 transition-all duration-300"
                            >
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${option.gradient}`}></div>
                              <span className="text-gray-700 font-medium group-hover:text-gray-600 transition-colors">
                                {feature}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      
                      {/* CTA Button */}
                      <div className="text-center">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`
                            inline-flex items-center space-x-3 px-8 py-4 rounded-2xl
                            bg-gradient-to-r ${option.buttonGradient}
                            text-white font-bold text-lg shadow-lg
                            transition-all duration-300
                          `}
                        >
                          <span>Explore {option.title}</span>
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <ArrowRight className="w-5 h-5" />
                          </motion.div>
                        </motion.div>
                      </div>
                    </div>
                    
                    {/* Floating Elements */}
                    <div className="absolute top-8 right-8 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                      <motion.div
                        animate={{ 
                          y: [0, -15, 0],
                          rotate: [0, 10, 0]
                        }}
                        transition={{ 
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-3 h-3 bg-white rounded-full"
                      />
                    </div>
                    <div className="absolute bottom-8 left-8 opacity-15 group-hover:opacity-30 transition-opacity duration-500">
                      <motion.div
                        animate={{ 
                          y: [0, -20, 0],
                          rotate: [0, -15, 0]
                        }}
                        transition={{ 
                          duration: 5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1
                        }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.0 }}
          className="text-center mt-20"
        >
          <p className="text-gray-500 text-lg">
            Powered by <span className="font-semibold text-gray-700">PVARA</span> • 
            Pakistan Virtual Asset Regulatory Authority
          </p>
        </motion.div>
      </div>
    </div>
  )
}
