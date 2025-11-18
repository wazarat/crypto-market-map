'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Clock, FileText, CheckCircle, AlertCircle } from 'lucide-react'

const applicationSteps = [
  {
    step: 'Submission',
    timeline: 'Initial',
    requirements: 'Submit the application as per the prescribed form with the requisite fee.',
    status: 'pending'
  },
  {
    step: 'Acknowledgment',
    timeline: 'Within 5 working days of receipt',
    requirements: 'PVARA issues an acknowledgment confirming receipt.',
    status: 'pending'
  },
  {
    step: 'Preliminary Screening',
    timeline: 'Within 7 working days of receipt (for completeness)',
    requirements: 'PVARA reviews for completeness and eligibility. Mandatory elements must include:',
    details: [
      'Detailed model description',
      'Preliminary risk assessments (AML/CTF, cybersecurity)',
      'Evidence of innovation',
      'Shariah compliance considerations (if applicable)'
    ],
    status: 'pending'
  },
  {
    step: 'Initial Screening',
    timeline: 'Within 20 working days of acknowledgment',
    requirements: 'High-level check against exclusion criteria, focusing on whether the model involves virtual assets and no prohibited activities (e.g., unlicensed trading).',
    status: 'pending'
  }
]

export default function ApplicationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50">
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
              <h1 className="text-2xl font-bold text-gray-900">Stage 1: Application & Initial Screening</h1>
              <p className="text-gray-600">Complete mandatory information and initial assessment process</p>
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20 flex items-center justify-center">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Application and Initial Screening</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                The first phase is to ensure all mandatory information is complete and the proposed model aligns with PVARA's mandate. 
                This stage involves submitting your application, receiving acknowledgment, and undergoing preliminary screening to verify 
                completeness and eligibility.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Process Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Process Steps</h3>
          
          {applicationSteps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/60 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Step Info */}
                <div className="lg:col-span-3">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <h4 className="font-bold text-gray-900">{step.step}</h4>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{step.timeline}</span>
                  </div>
                </div>

                {/* Requirements */}
                <div className="lg:col-span-9">
                  <h5 className="font-semibold text-gray-800 mb-2">Key Requirements & Actions</h5>
                  <p className="text-gray-700 mb-3">{step.requirements}</p>
                  
                  {step.details && (
                    <div className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">{detail}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Key Requirements Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-amber-50/50 to-orange-50/50 border border-amber-200/50"
        >
          <div className="flex items-start space-x-4">
            <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Important Considerations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Mandatory Documentation</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Complete application form with requisite fees</li>
                    <li>• Detailed business model description</li>
                    <li>• Preliminary risk assessment documentation</li>
                    <li>• Evidence of innovation and unique value proposition</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Screening Criteria</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Virtual asset involvement verification</li>
                    <li>• No prohibited activities (unlicensed trading)</li>
                    <li>• Alignment with PVARA mandate</li>
                    <li>• Completeness of all required elements</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 flex justify-between items-center"
        >
          <Link
            href="/"
            className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Overview</span>
          </Link>
          
          <Link
            href="/sandbox/entry"
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
          >
            <span>Next: Sandbox Entry</span>
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
