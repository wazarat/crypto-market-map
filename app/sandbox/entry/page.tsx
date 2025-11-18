'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Settings, Users, DollarSign, Building2, Shield } from 'lucide-react'

const entrySteps = [
  {
    step: 'Presentation & Demonstration',
    timeline: 'Within 10 days of acknowledgment of the application',
    description: 'Applicant presents the business model, technical functionality, customer benefits, and risk mitigation strategies to the Committee.',
    icon: Settings
  },
  {
    step: 'Committee Review & Decision',
    timeline: 'Within 25 working days of the presentation',
    description: 'The Committee assesses the proposal against Key Evaluation Criteria, including:',
    details: [
      'Governance (Team/UBO Fit and Proper)',
      'Problem Identification and Unique Value Proposition',
      'Readiness for Testing (with a well-defined testing plan)',
      'Risk Management and Consumer Protection'
    ],
    icon: Users
  },
  {
    step: 'Sandbox Entry',
    timeline: 'Upon approval',
    description: 'Approved applicants enter a Supervisory Agreement with PVARA. Rejected applicants receive written reasons.',
    icon: Shield
  }
]

const sandboxLimits = [
  {
    feature: 'Exchanges',
    details: 'Limited to Approved',
    example: 'Exchanges',
    icon: Building2
  },
  {
    feature: 'Ramp',
    details: '$1000/day',
    example: 'Ramp',
    icon: DollarSign
  },
  {
    feature: 'Rosts',
    details: '500 Participants',
    example: 'Rosts',
    icon: Users
  }
]

export default function EntryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link 
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Stage 2: Detailed Evaluation and Entry</h1>
              <p className="text-gray-600">Assessment for viability, risk, and benefit to Pakistan's digital economy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 p-8 rounded-3xl bg-white/60 backdrop-blur-md border border-white/20 shadow-lg"
        >
          <div className="flex items-start space-x-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 flex items-center justify-center">
              <Settings className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Detailed Evaluation and Entry</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                The proposal is assessed for viability, risk, and benefit to Pakistan's digital economy. 
                This stage involves presenting your business model to the Committee, undergoing thorough evaluation, 
                and entering the sandbox environment upon approval.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Process Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Evaluation Process</h3>
          
          <div className="space-y-6">
            {entrySteps.map((step, index) => {
              const IconComponent = step.icon
              
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/60 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Step Info */}
                    <div className="lg:col-span-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h4 className="font-bold text-gray-900">{step.step}</h4>
                      </div>
                      <div className="text-sm text-gray-600 bg-gray-50/50 rounded-lg p-3">
                        <strong>Timeline:</strong> {step.timeline}
                      </div>
                    </div>

                    {/* Description & Details */}
                    <div className="lg:col-span-8">
                      <h5 className="font-semibold text-gray-800 mb-3">Key Evaluation and Decision Criteria</h5>
                      <p className="text-gray-700 mb-4">{step.description}</p>
                      
                      {step.details && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {step.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="flex items-start space-x-3 p-3 bg-emerald-50/50 rounded-lg">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700 text-sm font-medium">{detail}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Sandbox Limits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Sandbox Entry & Limits Setting</h3>
          
          <div className="bg-white/60 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {sandboxLimits.map((limit, index) => {
                const IconComponent = limit.icon
                
                return (
                  <motion.div
                    key={limit.feature}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className="text-center p-6 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 rounded-2xl border border-emerald-200/30"
                  >
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{limit.feature}</h4>
                    <p className="text-sm text-gray-600 mb-1">{limit.details}</p>
                    <p className="text-xs text-emerald-600 font-medium">{limit.example}</p>
                  </motion.div>
                )
              })}
            </div>
            
            <div className="text-center">
              <p className="text-gray-700 leading-relaxed">
                <strong>Transaction Limits:</strong> $1000/day | 
                <strong className="ml-4">Customer Limits:</strong> 500 Participants | 
                <strong className="ml-4">Exchanges:</strong> Limited to Approved Providers
              </p>
            </div>
          </div>
        </motion.div>

        {/* Key Requirements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mb-12 p-8 rounded-3xl bg-gradient-to-r from-cyan-50/50 to-blue-50/50 border border-cyan-200/50"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Supervisory Agreement Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Entry Conditions</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0"></div>
                  <span>Approved business model and technical functionality</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0"></div>
                  <span>Well-defined testing plan with clear objectives</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0"></div>
                  <span>Demonstrated risk management capabilities</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Operational Limits</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0"></div>
                  <span>Maximum 500 customer participants</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0"></div>
                  <span>Daily transaction limit of $1,000</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0"></div>
                  <span>Approved exchange and ramp providers only</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex justify-between items-center"
        >
          <Link
            href="/sandbox/application"
            className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous: Application</span>
          </Link>
          
          <Link
            href="/sandbox/operation"
            className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
          >
            <span>Next: Operation & Monitoring</span>
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
