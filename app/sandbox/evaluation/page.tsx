'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Clock, XCircle, RotateCcw, Award, AlertCircle } from 'lucide-react'

const outcomes = [
  {
    outcome: 'Full License',
    decision: 'Recommended by the Steering Committee to the PVARA Board',
    criteria: 'Participant has met Key Performance Indicators (KPIs), demonstrated adequate risk management, and shown commercial viability.',
    icon: Award,
    color: 'from-green-500/20 to-emerald-500/20',
    textColor: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    outcome: 'Extension',
    decision: 'Recommended by the Steering Committee to the PVARA Board',
    criteria: 'Innovation requires more data, or minor issues remain unresolved. The extension shall not exceed six (6) months.',
    icon: RotateCcw,
    color: 'from-amber-500/20 to-orange-500/20',
    textColor: 'text-amber-600',
    bgColor: 'bg-amber-100'
  },
  {
    outcome: 'Discontinuation',
    decision: 'Directed by the Committee',
    criteria: 'Testing has revealed unmanageable risks or commercial infeasibility.',
    icon: XCircle,
    color: 'from-red-500/20 to-pink-500/20',
    textColor: 'text-red-600',
    bgColor: 'bg-red-100'
  }
]

export default function EvaluationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-white to-indigo-50/50">
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
              <h1 className="text-2xl font-bold text-gray-900">Stage 4: Exit and Final Determination</h1>
              <p className="text-gray-600">Final evaluation and licensing decision process</p>
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 via-indigo-500/20 to-blue-500/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Exit and Final Determination</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                At the conclusion of the testing period, the participant submits a final report for evaluation. 
                The Steering Committee reviews performance against key indicators and makes recommendations 
                to the PVARA Board for final licensing decisions.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Possible Outcomes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Possible Outcomes</h3>
          
          <div className="space-y-6">
            {outcomes.map((outcome, index) => {
              const IconComponent = outcome.icon
              
              return (
                <motion.div
                  key={outcome.outcome}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="bg-white/60 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* Outcome Info */}
                    <div className="lg:col-span-3 p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`w-12 h-12 rounded-xl ${outcome.bgColor} flex items-center justify-center`}>
                          <IconComponent className={`w-6 h-6 ${outcome.textColor}`} />
                        </div>
                        <h4 className="font-bold text-gray-900">{outcome.outcome}</h4>
                      </div>
                      <div className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-800 mb-1">Decision Authority</p>
                        <p className="text-sm text-gray-700">{outcome.decision}</p>
                      </div>
                    </div>

                    {/* Criteria */}
                    <div className={`lg:col-span-9 p-6 bg-gradient-to-r ${outcome.color}`}>
                      <h5 className="font-semibold text-gray-800 mb-3">Criteria for Recommendation</h5>
                      <p className="text-gray-700 leading-relaxed">{outcome.criteria}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Evaluation Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-12 p-8 rounded-3xl bg-gradient-to-r from-indigo-50/50 to-purple-50/50 border border-indigo-200/50"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Final Evaluation Process</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-indigo-600" />
                <span>Key Performance Indicators (KPIs)</span>
              </h4>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                  <span>Technical functionality and system reliability</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                  <span>Risk management effectiveness</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                  <span>Consumer protection measures</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                  <span>Commercial viability demonstration</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-purple-600" />
                <span>Assessment Criteria</span>
              </h4>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                  <span>Compliance with supervisory conditions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                  <span>Innovation value and market impact</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                  <span>Operational readiness for full licensing</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                  <span>Stakeholder feedback and market response</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Timeline & Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Final Report & Decision Timeline</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/60 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center shadow-lg">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-blue-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Final Report Submission</h4>
              <p className="text-sm text-gray-600 mb-3">Comprehensive testing results and performance analysis</p>
              <p className="text-xs font-medium text-blue-600">At conclusion of testing period</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center shadow-lg">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-purple-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Committee Review</h4>
              <p className="text-sm text-gray-600 mb-3">Steering Committee evaluation and recommendation</p>
              <p className="text-xs font-medium text-purple-600">Within 30 working days</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center shadow-lg">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-green-100 flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">PVARA Board Decision</h4>
              <p className="text-sm text-gray-600 mb-3">Final licensing determination and next steps</p>
              <p className="text-xs font-medium text-green-600">Following committee recommendation</p>
            </div>
          </div>
        </motion.div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mb-12 p-8 rounded-3xl bg-gradient-to-r from-amber-50/50 to-yellow-50/50 border border-amber-200/50"
        >
          <div className="flex items-start space-x-4">
            <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Important Considerations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Extension Limitations</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Any extension granted shall not exceed six (6) months and is subject to Board approval.
                  </p>
                  <h4 className="font-semibold text-gray-800 mb-2">Performance Standards</h4>
                  <p className="text-sm text-gray-700">
                    Participants must demonstrate clear progress toward commercial viability and regulatory compliance.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Risk Management</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Unmanageable risks or commercial infeasibility may result in immediate discontinuation.
                  </p>
                  <h4 className="font-semibold text-gray-800 mb-2">Transition Support</h4>
                  <p className="text-sm text-gray-700">
                    PVARA provides guidance for transitioning to full licensing or orderly wind-down procedures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="flex justify-between items-center"
        >
          <Link
            href="/sandbox/operation"
            className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous: Operation & Monitoring</span>
          </Link>
          
          <Link
            href="/"
            className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
          >
            <span>Back to Home</span>
            <CheckCircle className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
