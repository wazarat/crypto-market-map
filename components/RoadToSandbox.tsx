'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, FileText, Eye, Settings, CheckCircle } from 'lucide-react'

const sandboxStages = [
  {
    id: '01',
    title: 'Application & Assessment',
    description: 'Submit application and complete initial screening process with PVARA',
    icon: FileText,
    color: 'from-blue-500/20 via-indigo-500/20 to-purple-500/20',
    glow: 'hover:shadow-blue-500/25',
    route: '/sandbox/application'
  },
  {
    id: '02', 
    title: 'Sandbox Entry & Limits Setting',
    description: 'Enter controlled testing environment with defined parameters and limits',
    icon: Settings,
    color: 'from-emerald-500/20 via-teal-500/20 to-cyan-500/20',
    glow: 'hover:shadow-emerald-500/25',
    route: '/sandbox/entry'
  },
  {
    id: '03',
    title: 'Operation & Monitoring',
    description: 'Conduct testing under supervisory agreement with continuous monitoring',
    icon: Eye,
    color: 'from-green-500/20 via-emerald-500/20 to-teal-500/20',
    glow: 'hover:shadow-green-500/25',
    route: '/sandbox/operation'
  },
  {
    id: '04',
    title: 'Evaluation & Exit',
    description: 'Final assessment and determination for full license or extension',
    icon: CheckCircle,
    color: 'from-purple-500/20 via-indigo-500/20 to-blue-500/20',
    glow: 'hover:shadow-purple-500/25',
    route: '/sandbox/evaluation'
  }
]

export default function RoadToSandbox() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2 
          className="text-5xl font-bold font-inter-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Road to Sandbox
        </motion.h2>
        <motion.p 
          className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Navigate the Virtual Asset Regulatory Sandbox pathway and understand each stage of the approval process.
        </motion.p>
      </motion.div>

      {/* Workflow Overview */}
      <motion.div
        className="mb-12 p-8 rounded-3xl bg-gradient-to-r from-slate-50/50 to-gray-50/50 backdrop-blur-sm border border-gray-200/50"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Virtual Asset Regulatory Sandbox Pathway
        </h3>
        
        {/* Workflow Steps */}
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 lg:space-x-4">
          {sandboxStages.map((stage, index) => (
            <div key={stage.id} className="flex flex-col lg:flex-row items-center">
              {/* Stage Circle */}
              <div className="flex flex-col items-center text-center lg:text-left">
                <div className={`
                  w-16 h-16 rounded-full bg-gradient-to-br ${stage.color}
                  border-2 border-white/50 shadow-lg
                  flex items-center justify-center mb-3
                `}>
                  <span className="text-2xl font-bold text-gray-700">{stage.id}</span>
                </div>
                <div className="max-w-[200px]">
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">{stage.title}</h4>
                  <p className="text-xs text-gray-600 leading-tight">{stage.description}</p>
                </div>
              </div>
              
              {/* Arrow (except for last item) */}
              {index < sandboxStages.length - 1 && (
                <motion.div 
                  className="hidden lg:block mx-6"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Interactive Stage Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        {sandboxStages.map((stage, index) => {
          const IconComponent = stage.icon
          
          return (
            <motion.div
              key={stage.id}
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
              className="group relative w-full min-h-[280px] h-full"
            >
              <Link href={stage.route}>
                <div className={`
                  relative h-full overflow-hidden rounded-2xl
                  bg-white/40 backdrop-blur-md border border-white/20
                  shadow-lg hover:shadow-2xl ${stage.glow}
                  transition-all duration-500 ease-out
                  hover:border-white/40 hover:bg-white/50
                  cursor-pointer
                `}>
                  {/* Gradient Overlay */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-br ${stage.color}
                    opacity-60 group-hover:opacity-90 transition-opacity duration-500
                  `} />
                  
                  {/* Glow Effect */}
                  <div className="
                    absolute inset-0 opacity-0 group-hover:opacity-100
                    bg-gradient-radial from-white/15 via-transparent to-transparent
                    transition-opacity duration-500
                  " />
                  
                  {/* Content */}
                  <div className="relative h-full p-6 flex flex-col">
                    {/* Stage Number & Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="
                        w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30
                        flex items-center justify-center group-hover:bg-white/40 transition-all duration-300
                      ">
                        <span className="text-lg font-bold text-gray-700">{stage.id}</span>
                      </div>
                      <IconComponent className="w-8 h-8 text-gray-600 group-hover:text-gray-500 transition-colors" />
                    </div>
                    
                    {/* Title */}
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-0 group-hover:text-gray-800 transition-colors leading-tight">
                        {stage.title}
                      </h3>
                    </div>
                    
                    {/* Description */}
                    <div className="flex-1 mb-4">
                      <p className="text-gray-700 text-sm leading-relaxed group-hover:text-gray-600 transition-colors">
                        {stage.description}
                      </p>
                    </div>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between mt-auto">
                      <span className="
                        inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                        bg-white/30 backdrop-blur-sm border border-white/20
                        text-gray-800 group-hover:bg-white/50 transition-all duration-300
                      ">
                        Learn More
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
                        <motion.div
                          animate={{
                            x: [0, 3, 0],
                            transition: {
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }
                          }}
                        >
                          <ArrowRight className="w-4 h-4 text-gray-700 group-hover:text-gray-600" />
                        </motion.div>
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
                </div>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
