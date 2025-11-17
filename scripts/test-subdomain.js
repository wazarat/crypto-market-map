#!/usr/bin/env node

/**
 * Test script for subdomain functionality
 * Run with: node scripts/test-subdomain.js
 */

const { extractSubdomain, getSubdomainConfig, isCorporateSubdomain } = require('../lib/subdomain-utils.ts')

// Test cases
const testCases = [
  'localhost:3000',
  'pcc.localhost:3000',
  'canhav.io',
  'pcc.canhav.io',
  'www.canhav.io',
  'newclient.canhav.io',
  '127.0.0.1:3000'
]

console.log('🧪 Testing Subdomain Detection\n')

testCases.forEach(hostname => {
  console.log(`Testing: ${hostname}`)
  
  try {
    const subdomain = extractSubdomain(hostname)
    const config = getSubdomainConfig(hostname)
    const isCorporate = isCorporateSubdomain(hostname)
    
    console.log(`  Subdomain: ${subdomain}`)
    console.log(`  Type: ${config.type}`)
    console.log(`  Display Name: ${config.displayName}`)
    console.log(`  Corporate: ${isCorporate}`)
    if (config.corporateClient) {
      console.log(`  Corporate Client: ${config.corporateClient}`)
    }
    console.log(`  Theme: ${config.theme?.brandName} (${config.theme?.primaryColor})`)
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`)
  }
  
  console.log('')
})

console.log('✅ Subdomain testing complete!')

// Test URL generation
console.log('\n🔗 Testing URL Generation\n')

const urlTests = [
  { subdomain: 'main', path: '/login' },
  { subdomain: 'pcc', path: '/corporate/login' },
  { subdomain: 'main', path: '/' }
]

urlTests.forEach(({ subdomain, path }) => {
  console.log(`Generating URL for subdomain: ${subdomain}, path: ${path}`)
  
  // Mock environment for testing
  process.env.NODE_ENV = 'development'
  
  try {
    // This would need to be adapted since getSubdomainUrl is client-side
    console.log(`  Development URL: http://${subdomain === 'main' ? 'localhost:3000' : subdomain + '.localhost:3000'}${path}`)
    console.log(`  Production URL: https://${subdomain === 'main' ? 'canhav.io' : subdomain + '.canhav.io'}${path}`)
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`)
  }
  
  console.log('')
})

console.log('✅ URL generation testing complete!')
