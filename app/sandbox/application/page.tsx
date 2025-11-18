'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Clock, FileText, CheckCircle, AlertCircle } from 'lucide-react'

const applicationSteps = [
  {
    step: 'Submission',
    timeline: 'Initial',
    description: 'This is the initial action taken by the applicant to formally begin the sandbox application process.',
    requirements: 'Key Requirements & Actions:',
    details: [
      'Application Form Completion: Fill out the official PVARA Sandbox application form in its entirety. Ensure all mandatory fields are completed accurately.',
      'Requisite Fee Payment: Submit the specified, non-refundable application fee as outlined by PVARA. Attach proof of payment.',
      'Supporting Documentation: Include any additional documents explicitly requested in the application form (e.g., company registration, business plan summary).',
      'Submission Method: Submit the complete application package through the designated channel (e.g., online portal, secure email, physical submission).'
    ],
    status: 'pending'
  },
  {
    step: 'Acknowledgment',
    timeline: 'Within 5 working days of receipt',
    description: 'This step confirms that PVARA has successfully received the application.',
    requirements: 'Key Requirements & Actions (PVARA\'s Actions):',
    details: [
      'Receipt Confirmation: PVARA will issue an official acknowledgment of receipt for the submitted application.',
      'Communication Channel: The acknowledgment will be sent to the primary contact person/email address provided in the application form.',
      'Purpose: To inform the applicant that their submission has been successfully logged and will proceed to the next stage.'
    ],
    status: 'pending'
  },
  {
    step: 'Preliminary Screening',
    timeline: 'Within 7 working days of receipt (for completeness)',
    description: 'This stage is an initial check by PVARA to ensure the application is complete and meets fundamental eligibility criteria before a deeper review.',
    requirements: 'Key Requirements & Actions (PVARA\'s Focus & Applicant\'s Preparation):',
    details: [
      'Completeness Check: Verification that all mandatory sections of the application form are filled out and all required supporting documents have been attached.',
      'Detailed Model Description: A clear explanation of the proposed virtual asset business model, its purpose, and how it operates.',
      'Preliminary Risk Assessments: Initial assessment covering Anti-Money Laundering (AML) / Counter-Terrorist Financing (CTF) and Cybersecurity measures.',
      'Evidence of Innovation: Clearly articulate how the proposed solution is innovative, new to the Pakistani market, or offers significant improvements over existing solutions.',
      'Shariah Compliance Considerations (If Applicable): If the model involves Islamic finance principles, initial considerations and approaches to ensure compliance should be presented.',
      'Feedback Process: If the application is deemed incomplete, PVARA may request additional information or clarification from the applicant within this timeframe.'
    ],
    status: 'pending'
  },
  {
    step: 'Initial Screening',
    timeline: 'Within 20 working days of acknowledgment',
    description: 'This screening dives slightly deeper to ensure the proposed model fundamentally aligns with PVARA\'s regulatory scope and doesn\'t involve prohibited activities.',
    requirements: 'Key Requirements & Actions (PVARA\'s Focus & Applicant\'s Clarity):',
    details: [
      'Virtual Asset Involvement: Confirm that the proposed model genuinely involves virtual assets as defined by PVARA.',
      'Prohibited Activities Check: Ensure the model does not involve activities explicitly prohibited by PVARA regulations or Pakistani law (e.g., operating an unlicensed exchange outside the sandbox).',
      'Regulatory Scope: Confirm the project falls within the general purview and mandate of PVARA\'s regulatory authority.',
      'Innovation & Benefit Justification: PVARA will assess if the project truly has the potential to offer genuine innovation and tangible benefits to the Pakistani financial ecosystem.',
      'Decision: Based on this screening, the application will either be moved forward for detailed evaluation or rejected if it clearly falls outside the sandbox\'s scope.'
    ],
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
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed mb-4">{step.description}</p>
                  </div>
                  
                  <h5 className="font-semibold text-gray-800 mb-3">{step.requirements}</h5>
                  
                  {step.details && (
                    <div className="space-y-3">
                      {step.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-start space-x-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100/50">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm leading-relaxed">{detail}</span>
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
