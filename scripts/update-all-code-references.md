# Code Updates Required for total_funding_pkr → private_company/public_company Migration

## Files that need manual updates:

### 1. `/components/CompanyForm.tsx`
- Remove `total_funding_pkr` field from form
- Add `private_company` and `public_company` checkboxes
- Update form validation and submission logic

### 2. `/app/admin/bulk-upload/page.tsx`
- Update CSV import logic to handle new fields
- Remove total_funding_pkr column processing
- Add private_company/public_company column processing

### 3. `/app/admin/company/[slug]/edit/page.tsx`
- Update CompanyFormData interface
- Remove total_funding_pkr references
- Add private_company/public_company fields

### 4. `/app/admin/company/new/page.tsx`
- Update CompanyFormData interface
- Remove total_funding_pkr references
- Add private_company/public_company fields

### 5. `/app/company/[slug]/page.tsx`
- Update company display to show "Public" or "Private" instead of funding amount
- Add company type display logic

### 6. `/components/CSVImport.tsx`
- Update CSV parsing to handle new column names
- Remove total_funding_pkr column
- Add private_company/public_company columns

### 7. `/lib/csv-export.ts`
- Update CSV export headers
- Replace total_funding_pkr with private_company/public_company
- Update field mapping

### 8. `/lib/unified-api.ts`
- Update API calls to use new field names
- Remove total_funding_pkr from requests/responses
- Add private_company/public_company to API interface

### 9. `/scripts/quick-setup.js`
- Update any mock data or setup scripts
- Replace funding references with company type

## Database Migration Status:
✅ Database schema updated (run platform-wide-funding-migration.sql)
✅ API types updated (enhanced-company-data.ts)
❌ Frontend forms need updating
❌ CSV import/export needs updating
❌ Display components need updating

## Next Steps:
1. Run the platform-wide-funding-migration.sql script
2. Update each frontend file listed above
3. Test all forms and import/export functionality
4. Verify company display pages show correct information
