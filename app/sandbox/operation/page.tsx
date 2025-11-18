'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Eye, Clock, Users, DollarSign, Building2, Shield, AlertTriangle } from 'lucide-react'

const controlFeatures = [
  {
    feature: 'Duration of Testing',
    power: 'Shall not exceed 18 months from the date of commencement, unless extended by the Board.',
    example: 'Max 18 Months',
    icon: Clock,
    color: 'from-blue-500/20 to-indigo-500/20'
  },
  {
    feature: 'Customer Limits',
    power: 'The Authority may impose limits on customers.',
    example: 'Limit: 500 Customers',
    icon: Users,
    color: 'from-emerald-500/20 to-teal-500/20'
  },
  {
    feature: 'Transaction Limits',
    power: 'The Authority may impose limits on transactions.',
    example: 'Limit: $1,000 per Transaction',
    icon: DollarSign,
    color: 'from-amber-500/20 to-orange-500/20'
  },
  {
    feature: 'Exchanges / On & Off-Ramps',
    power: 'The Supervisory Agreement will govern the scope and parameters of testing.',
    example: 'Limit: Approved Service Providers Only',
    icon: Building2,
    color: 'from-purple-500/20 to-pink-500/20'
  },
  {
    feature: 'No-Action Relief',
    power: 'The Authority may issue no-action relief during testing, but this is not a legal immunity and may be withdrawn.',
    example: 'Conditional Legal Relief',
    icon: Shield,
    color: 'from-green-500/20 to-emerald-500/20'
  }
]

export default function OperationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-emerald-50/50">
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
              <h1 className="text-2xl font-bold text-gray-900">Stage 3: Testing and Control Limits</h1>
              <p className="text-gray-600">Controlled environment testing under supervisory agreement</p>
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20 flex items-center justify-center">
              <Eye className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Testing and Control Limits</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Testing occurs within a controlled environment under a Supervisory Agreement, and PVARA has 
                the right to set limits. This stage ensures safe and monitored operation while gathering 
                valuable data for final evaluation.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Control Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Control Features & Regulatory Powers</h3>
          
          <div className="space-y-6">
            {controlFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              
              return (
                <motion.div
                  key={feature.feature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/60 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* Feature Info */}
                    <div className="lg:col-span-4 p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-gray-700" />
                        </div>
                        <h4 className="font-bold text-gray-900">{feature.feature}</h4>
                      </div>
                      <div className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-800 mb-1">Placeholder Example for Visual</p>
                        <p className="text-lg font-bold text-green-600">{feature.example}</p>
                      </div>
                    </div>

                    {/* Regulatory Power */}
                    <div className="lg:col-span-8 p-6 bg-gradient-to-r from-gray-50/30 to-transparent">
                      <h5 className="font-semibold text-gray-800 mb-3">PVARA Regulatory Power (as per Ordinance)</h5>
                      <p className="text-gray-700 leading-relaxed">{feature.power}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Testing Environment Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-12 p-8 rounded-3xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-200/50"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Supervisory Agreement Framework</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span>Monitoring & Oversight</span>
              </h4>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <span>Continuous monitoring of all testing activities</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <span>Regular reporting requirements to PVARA</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <span>Compliance with all supervisory conditions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <span>Real-time access to testing data and metrics</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>Risk Controls</span>
              </h4>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                  <span>Strict adherence to customer and transaction limits</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                  <span>Use of approved service providers only</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                  <span>Consumer protection measures in place</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                  <span>Emergency stop mechanisms available</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Testing Parameters Overview</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/60 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center shadow-lg">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h4 className="font-bold text-gray-900 mb-1">Maximum Duration</h4>
              <p className="text-2xl font-bold text-blue-600">18 Months</p>
              <p className="text-xs text-gray-600 mt-1">Unless extended by Board</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center shadow-lg">
              <Users className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
              <h4 className="font-bold text-gray-900 mb-1">Customer Limit</h4>
              <p className="text-2xl font-bold text-emerald-600">500</p>
              <p className="text-xs text-gray-600 mt-1">Maximum participants</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center shadow-lg">
              <DollarSign className="w-8 h-8 text-amber-600 mx-auto mb-3" />
              <h4 className="font-bold text-gray-900 mb-1">Transaction Limit</h4>
              <p className="text-2xl font-bold text-amber-600">$1,000</p>
              <p className="text-xs text-gray-600 mt-1">Per transaction</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center shadow-lg">
              <Building2 className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h4 className="font-bold text-gray-900 mb-1">Service Providers</h4>
              <p className="text-2xl font-bold text-purple-600">Approved</p>
              <p className="text-xs text-gray-600 mt-1">Only authorized partners</p>
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
            href="/sandbox/entry"
            className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous: Sandbox Entry</span>
          </Link>
          
          <Link
            href="/sandbox/evaluation"
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors"
          >
            <span>Next: Evaluation & Exit</span>
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
