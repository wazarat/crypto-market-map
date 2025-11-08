#!/bin/bash

echo "🚀 Setting up Vercel Environment Variables for Pakistan VASP Database"
echo "=================================================================="

# Your Supabase credentials
SUPABASE_URL="https://reyjgwhlfjqykbqvqusg.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJleWpnd2hsZmpxeWticXZxdXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1OTU4NTEsImV4cCI6MjA3ODE3MTg1MX0.XkcBjVXl3rhuSCr9aUmlE36xusV2hYJnEUMp5u9DcsQ"
SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJleWpnd2hsZmpxeWticXZxdXNnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjU5NTg1MSwiZXhwIjoyMDc4MTcxODUxfQ.YSW1iUI4b7gvaR5qbZVpCgr66Ige1U9zvR9I8yKvU98"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

echo "🔧 Setting Vercel environment variables..."

# Set environment variables for all environments
echo "Setting PRODUCTION environment variables..."
vercel env add NEXT_PUBLIC_SUPABASE_URL "$SUPABASE_URL" production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY "$SUPABASE_ANON_KEY" production  
vercel env add SUPABASE_SERVICE_ROLE_KEY "$SUPABASE_SERVICE_KEY" production
vercel env add USE_MOCK_DATA "false" production

echo "Setting PREVIEW environment variables..."
vercel env add NEXT_PUBLIC_SUPABASE_URL "$SUPABASE_URL" preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY "$SUPABASE_ANON_KEY" preview
vercel env add SUPABASE_SERVICE_ROLE_KEY "$SUPABASE_SERVICE_KEY" preview
vercel env add USE_MOCK_DATA "false" preview

echo "Setting DEVELOPMENT environment variables..."
vercel env add NEXT_PUBLIC_SUPABASE_URL "$SUPABASE_URL" development
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY "$SUPABASE_ANON_KEY" development
vercel env add SUPABASE_SERVICE_ROLE_KEY "$SUPABASE_SERVICE_KEY" development
vercel env add USE_MOCK_DATA "false" development

echo ""
echo "✅ Environment variables set successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Run the SQL script in Supabase SQL Editor (scripts/create-tables.sql)"
echo "2. Deploy to Vercel: vercel --prod"
echo "3. Your Pakistan VASP database will be live!"

echo ""
echo "🔗 Your Supabase Dashboard: https://supabase.com/dashboard/project/reyjgwhlfjqykbqvqusg"
