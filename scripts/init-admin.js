// Initialize Admin User Script
// Run this script to set up the admin user (Wazarat Hussain)

const { authService } = require('../lib/auth')

async function initializeAdmin() {
  console.log('🚀 Initializing admin user...')
  
  try {
    await authService.initializeAdminUser()
    console.log('✅ Admin user initialized successfully!')
    console.log('📧 Email: waz@canhav.com')
    console.log('👤 Username: wazarat')
    console.log('🔑 Password: admin123 (PLEASE CHANGE THIS!)')
    console.log('')
    console.log('⚠️  IMPORTANT: Change the default password after first login!')
  } catch (error) {
    console.error('❌ Failed to initialize admin user:', error)
    process.exit(1)
  }
}

// Run the initialization
initializeAdmin()
  .then(() => {
    console.log('🎉 Admin initialization complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Initialization failed:', error)
    process.exit(1)
  })
