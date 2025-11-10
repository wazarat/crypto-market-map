# 🚀 Vercel + Supabase Deployment Guide

## Quick Setup Steps

### 1. **Database Schema Setup**

In your Supabase dashboard:

1. Go to **SQL Editor**
2. Copy and paste the contents of `scripts/setup-database-schema.sql`
3. Click **Run** to create all tables and sample data

### 2. **Get Supabase Credentials**

From your Supabase project settings:

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **Anon key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **Service role key** (SUPABASE_SERVICE_ROLE_KEY)

### 3. **Configure Vercel Environment Variables**

In your Vercel dashboard:

1. Go to your project → **Settings** → **Environment Variables**
2. Add these variables for **Production**, **Preview**, and **Development**:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
USE_MOCK_DATA=false
```

### 4. **Deploy to Vercel**

Option A - **Automatic (Recommended):**
```bash
git add .
git commit -m "Add Supabase integration"
git push
```
Vercel will auto-deploy from your GitHub repository.

Option B - **Manual:**
```bash
npx vercel --prod
```

## 🎯 What You'll Get

### **Enhanced Features with Supabase:**
- ✅ **Real Pakistan VASP data** instead of mock data
- ✅ **Regulatory compliance tracking** (PVARA licenses)
- ✅ **Admin dashboard** for Canhav
- ✅ **CSV export** for regulatory reporting
- ✅ **Advanced filtering** and search
- ✅ **Real-time updates** and data management

### **Backward Compatibility:**
- ✅ **Automatic fallback** to mock data if Supabase unavailable
- ✅ **Same user interface** with enhanced functionality
- ✅ **Progressive enhancement** approach

## 🔍 Verification Steps

After deployment, verify everything works:

1. **Visit your Vercel URL**
2. **Check browser console** for data source confirmation:
   ```
   🔍 Data Source Detection: { source: 'Supabase', hasSupabase: true }
   ```
3. **Test company pages** - should show enhanced VASP data
4. **Verify sector filtering** works with new categories

## 🛠 Troubleshooting

### **If you see mock data instead of Supabase data:**

1. **Check environment variables** are set correctly in Vercel
2. **Verify Supabase URL** and keys are valid
3. **Check browser console** for error messages
4. **Ensure database schema** was created successfully

### **Common Issues:**

**"VASP features require Supabase integration"**
- Environment variables not set properly
- Supabase connection failed

**"Failed to load sectors"**
- Database schema not created
- RLS policies blocking access
- Invalid Supabase credentials

## 🇵🇰 Pakistan-Specific Features

Once deployed with Supabase, you'll have access to:

### **Regulatory Compliance Dashboard:**
- License status tracking (Applied/Granted/Suspended)
- SECP registration monitoring
- AML/CFT compliance ratings
- Capital adequacy reporting

### **Pakistan Companies Included:**
- **Tez Financial Services** - Digital payments leader
- **KTrade Securities** - Expanding into crypto
- **Oraan** - Women-focused fintech
- **Sadapay** - Digital banking
- **Blockchain Pakistan** - Advisory services

### **Export & Reporting:**
- CSV export for regulatory submissions
- Compliance summary reports
- Company data management
- Real-time license status updates

## 📞 Support

If you encounter issues:

1. **Check the browser console** for detailed error messages
2. **Verify environment variables** in Vercel dashboard
3. **Test Supabase connection** directly in their dashboard
4. **Review database logs** in Supabase for any errors

---

**🎉 Congratulations!** Your Pakistan VASP database is now live on Vercel with full Supabase integration!
