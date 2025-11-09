// Setup Supabase Authentication
// This script initializes the admin user using Supabase Auth

const { supabaseAuth } = require('../lib/supabase-auth')

async function setupSupabaseAuth() {
  console.log('🚀 Setting up Supabase Authentication...')
  
  try {
    // Initialize admin user
    const result = await supabaseAuth.initializeAdmin()
    
    if (result.success) {
      console.log('✅ Admin user setup complete!')
      console.log('')
      console.log('👤 Admin Login Details:')
      console.log('📧 Email: waz@canhav.com')
      console.log('🔑 Password: admin123')
      console.log('')
      console.log('⚠️  IMPORTANT: Change the default password after first login!')
      console.log('')
      console.log('🎯 Next Steps:')
      console.log('1. Run the Supabase migration: supabase/migrations/20241109_supabase_auth.sql')
      console.log('2. Deploy your app')
      console.log('3. Login as admin and change password')
      console.log('4. Test user registration and approval flow')
    } else {
      console.log('ℹ️ ', result.message)
    }
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    process.exit(1)
  }
}

// Run the setup
setupSupabaseAuth()
  .then(() => {
    console.log('🎉 Supabase Auth setup complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Setup failed:', error)
    process.exit(1)
  })
