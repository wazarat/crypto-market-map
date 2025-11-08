# Pakistan VASP Database Setup Guide

## Overview

This document provides comprehensive setup instructions for the Pakistan Virtual Asset Service Provider (VASP) database system, designed to comply with PVARA Regulations 2025 and serve the Pakistan Crypto Council.

## Database Schema

### Core Tables

1. **vasp_categories** - 10 service categories as per PVARA regulations
2. **vasp_companies** - Main company information with Pakistan-specific regulatory data
3. **Sector-specific detail tables** - Additional data for each service category
4. **company_research** - Research and analysis data
5. **user_notes** - User-generated notes and comments

### Key Features

- **Pakistan-specific compliance tracking** (SECP registration, PVARA licenses)
- **Regulatory status monitoring** (license applications, approvals, suspensions)
- **AML/CFT compliance ratings**
- **Capital adequacy and fit-and-proper assessments**
- **Sector-specific operational details**

## Supabase Setup Instructions

### 1. Create Supabase Project

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Initialize project (if not already done)
supabase init

# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF
```

### 2. Run Database Migrations

```bash
# Apply the VASP database schema
supabase db push

# Or run migrations individually
supabase migration up
```

### 3. Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Row Level Security (RLS) Setup

The database includes RLS policies:
- **Read access**: Available to all authenticated users
- **Write access**: Restricted to admin users only

To set up admin access:

```sql
-- Create admin role
INSERT INTO auth.users (email, role) VALUES ('admin@pakistancrypto.council', 'admin');

-- Grant admin permissions (run as service role)
UPDATE auth.users SET raw_user_meta_data = '{"role": "admin"}' 
WHERE email = 'admin@pakistancrypto.council';
```

## Data Structure

### Company Information Includes:

#### Basic Details
- Company name, founding year, CEO/founder
- Headquarters location, Pakistan operations status
- Contact information, employee count
- Funding information (PKR equivalent)

#### Regulatory Compliance (Pakistan-Specific)
- SECP registration number
- PVARA license number and status
- Paid-up capital (PKR)
- Capital adequacy ratio
- Director information and fit-and-proper compliance
- AML/CFT compliance rating
- Customer asset segregation policies

#### Sector-Specific Details
Each category has tailored fields:

**Advisory Services:**
- Advisory focus areas
- Client types (Retail/Institutional/VASPs)
- Number of advisory reports

**Exchange Services:**
- Exchange type (Centralized/Decentralized)
- Supported trading pairs
- Daily trading volume (PKR)

**Custody Services:**
- Custody types (Hot/Cold/Multi-sig)
- Insurance coverage details
- Audit frequency

*[Additional sectors follow similar patterns]*

## API Usage

### Basic Queries

```typescript
import { vaspApiClient } from './lib/vasp-api'

// Get all categories
const categories = await vaspApiClient.getCategories()

// Get companies with filters
const pakistanCompanies = await vaspApiClient.getCompanies({
  pakistan_operations: true,
  license_status: 'Granted'
})

// Get company details with sector-specific information
const company = await vaspApiClient.getCompanyBySlug('tez-financial')

// Get regulatory compliance summary
const summary = await vaspApiClient.getRegulatoryComplianceSummary()
```

### Admin Operations

```typescript
// Update license status
await vaspApiClient.updateLicenseStatus(
  'company-id', 
  'Granted', 
  'PVARA-2025-001'
)

// Create new company
const newCompany = await vaspApiClient.createCompany({
  name: 'New VASP Company',
  category_id: 'category-uuid',
  pakistan_operations: true,
  // ... other fields
})
```

## Data Export Features

### CSV Export

```typescript
import { convertToCSV, downloadCSV } from './lib/csv-export'

// Export all company data
const companies = await vaspApiClient.getCompanies()
const csvContent = convertToCSV(companies)
downloadCSV(csvContent, 'pakistan-vasp-companies.csv')

// Generate comprehensive report
const report = await generatePakistanVASPReport(companies)
```

## Sample Data

The system includes sample data for:

### Pakistani Companies:
1. **Tez Financial Services** - Transfer & Settlement (SBP licensed)
2. **KTrade Securities** - Broker-Dealer (SECP licensed, PVARA pending)
3. **Oraan Financial Services** - Asset Management (Women-focused fintech)
4. **Sadapay** - Transfer & Settlement (Digital bank)
5. **Blockchain Pakistan Consulting** - Advisory Services

### International Companies with Pakistan Operations:
1. **Binance** - Exchange Services (P2P trading)

## Regulatory Compliance Features

### License Status Tracking
- **Applied**: License application submitted
- **Under Review**: Application being processed
- **Granted**: License approved and active
- **Suspended**: License temporarily suspended
- **None**: No license application

### AML/CFT Compliance Ratings
- **High**: Full compliance with international standards
- **Medium**: Substantial compliance with minor gaps
- **Low**: Significant compliance deficiencies
- **Not Assessed**: No assessment conducted

### Capital Requirements Monitoring
- Paid-up capital in PKR
- Capital adequacy ratios
- Ongoing compliance status

## Integration with Existing Application

The enhanced VASP database integrates seamlessly with the existing crypto market map:

1. **Backward Compatibility**: Existing mock data system remains functional
2. **Progressive Enhancement**: Supabase integration adds advanced features
3. **Dual Mode Operation**: Works with or without Supabase connection

### Environment Detection

```typescript
// Automatically detects available data source
const USE_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (USE_SUPABASE) {
  // Use Supabase with full VASP data
  const data = await vaspApiClient.getCompanies()
} else {
  // Fallback to mock data
  const data = await apiClient.getSectors()
}
```

## Security Considerations

1. **Row Level Security**: Prevents unauthorized data access
2. **Admin Role Verification**: Write operations require admin privileges
3. **API Key Management**: Separate keys for public/admin access
4. **Audit Logging**: All changes tracked with timestamps
5. **Data Encryption**: Sensitive information encrypted at rest

## Maintenance and Updates

### Regular Tasks:
1. **License Status Updates**: Monitor PVARA applications and approvals
2. **Compliance Ratings**: Update AML/CFT assessments quarterly
3. **Company Information**: Maintain current contact and operational data
4. **Regulatory Changes**: Adapt schema for new PVARA requirements

### Backup and Recovery:
```bash
# Backup database
supabase db dump > pakistan_vasp_backup.sql

# Restore from backup
supabase db reset
supabase db push
psql -h your-db-host -U postgres -d postgres < pakistan_vasp_backup.sql
```

## Support and Documentation

For technical support or questions about the Pakistan VASP database system:

- **Technical Issues**: Contact development team
- **Regulatory Questions**: Consult with Pakistan Crypto Council
- **Data Updates**: Submit through admin interface or API

## Compliance Statement

This system is designed to support compliance with:
- **VASP Regulations 2025** (Pakistan)
- **SECP Guidelines** for digital asset services
- **State Bank of Pakistan** payment system regulations
- **International AML/CFT Standards** (FATF recommendations)

---

**Last Updated**: November 8, 2025  
**Version**: 1.0  
**Maintained by**: Pakistan Crypto Council Technical Team
