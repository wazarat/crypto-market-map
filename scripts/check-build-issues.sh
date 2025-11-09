#!/bin/bash

echo "🔍 Checking for potential Vercel build issues..."
echo "=================================================="

# Check for direct supabase usage without null checks
echo "1. Checking for direct supabase usage..."
grep -r "await supabase" --include="*.tsx" --include="*.ts" . || echo "✅ No direct supabase usage found"

# Check for required environment variables
echo "2. Checking for required environment variables..."
grep -r "process\.env\.[A-Z_]*!" --include="*.tsx" --include="*.ts" . || echo "✅ No required env vars found"

# Check for static generation issues
echo "3. Checking for pages without dynamic export..."
find app -name "page.tsx" -exec grep -L "export const dynamic" {} \; | while read file; do
  if grep -q "supabase\|vaspApiClient" "$file"; then
    echo "⚠️  $file uses Supabase but doesn't have dynamic export"
  fi
done

# Check for missing null checks in API clients
echo "4. Checking API clients for null safety..."
if grep -q "supabase\." lib/vasp-api.ts; then
  echo "⚠️  Direct supabase usage found in vasp-api.ts"
else
  echo "✅ VASP API client looks safe"
fi

# Check for build-time console.log that might cause issues
echo "5. Checking for problematic console.log statements..."
grep -r "console\.log.*process\.env" --include="*.tsx" --include="*.ts" . || echo "✅ No problematic console.log found"

echo ""
echo "🎯 Build Safety Recommendations:"
echo "- All pages using Supabase should have 'export const dynamic = \"force-dynamic\"'"
echo "- All Supabase calls should check 'if (!supabase) return' first"
echo "- Environment variables should not use '!' assertion operator"
echo "- API clients should use helper methods for null safety"

echo ""
echo "✅ Build check complete!"
