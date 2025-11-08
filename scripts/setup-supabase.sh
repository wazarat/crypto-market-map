#!/bin/bash

# Setup script for Pakistan VASP Supabase database
echo "🇵🇰 Setting up Pakistan VASP Database on Supabase..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Installing Supabase CLI..."
    npm install -g supabase
fi

# Login to Supabase (if not already logged in)
echo "Please ensure you're logged into Supabase CLI..."
supabase login

# Initialize Supabase in project (if not already done)
if [ ! -f "supabase/config.toml" ]; then
    echo "Initializing Supabase..."
    supabase init
fi

# Link to your Supabase project
echo "Please enter your Supabase project reference ID:"
read -p "Project Ref (from Supabase dashboard URL): " PROJECT_REF

supabase link --project-ref $PROJECT_REF

# Push database schema
echo "Creating VASP database schema..."
supabase db push

# Seed with sample data
echo "Seeding with Pakistan VASP sample data..."
supabase db reset --linked

echo "✅ Supabase setup complete!"
echo "📋 Next steps:"
echo "1. Copy your Supabase URL and anon key from the dashboard"
echo "2. Add them to your Vercel environment variables"
echo "3. Deploy to Vercel"
