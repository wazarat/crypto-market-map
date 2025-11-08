#!/bin/bash

echo "🚀 Setting up Vercel Environment Variables for Pakistan VASP Database"
echo "=================================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "📋 Please provide your Supabase credentials from the dashboard:"
echo ""

read -p "Enter your SUPABASE_URL: " SUPABASE_URL
read -p "Enter your SUPABASE_ANON_KEY: " SUPABASE_ANON_KEY
read -p "Enter your SUPABASE_JWT_SECRET: " SUPABASE_JWT_SECRET

echo ""
echo "🔧 Setting Vercel environment variables..."

# Set environment variables for all environments
vercel env add NEXT_PUBLIC_SUPABASE_URL "$SUPABASE_URL" production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY "$SUPABASE_ANON_KEY" production
vercel env add SUPABASE_SERVICE_ROLE_KEY "$SUPABASE_JWT_SECRET" production
vercel env add USE_MOCK_DATA "false" production

vercel env add NEXT_PUBLIC_SUPABASE_URL "$SUPABASE_URL" preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY "$SUPABASE_ANON_KEY" preview
vercel env add SUPABASE_SERVICE_ROLE_KEY "$SUPABASE_JWT_SECRET" preview
vercel env add USE_MOCK_DATA "false" preview

vercel env add NEXT_PUBLIC_SUPABASE_URL "$SUPABASE_URL" development
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY "$SUPABASE_ANON_KEY" development
vercel env add SUPABASE_SERVICE_ROLE_KEY "$SUPABASE_JWT_SECRET" development
vercel env add USE_MOCK_DATA "false" development

echo ""
echo "✅ Environment variables set successfully!"
echo "🚀 Now deploying to Vercel..."

# Deploy to Vercel
vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo "📊 Your Pakistan VASP database is now live on Vercel with Supabase integration!"
