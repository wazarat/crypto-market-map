# Subdomain Corporate Portal Setup

This document explains how to set up and use the subdomain-based corporate portal system for CanHav.

## Overview

The system supports multiple subdomains for different corporate clients:
- **Main Domain**: `canhav.io` - Regular user portal
- **Corporate Subdomains**: `pcc.canhav.io` - PCC corporate portal
- **Future Subdomains**: `[client].canhav.io` - Other enterprise clients

## Architecture

### 1. Subdomain Detection
- `lib/subdomain-utils.ts` - Handles subdomain detection and configuration
- `middleware.ts` - Next.js middleware for subdomain routing
- `components/SubdomainAwareLayout.tsx` - Layout component that switches auth providers

### 2. Authentication Systems
- **Main Domain**: Uses `SimpleAuthProvider` (existing system)
- **Corporate Subdomains**: Uses `CorporateAuthProvider` (new system)
- Both systems use the same Supabase backend but with different validation logic

### 3. Corporate Features
- Separate login/signup pages for corporate users
- Company-specific branding and theming
- Access validation based on company affiliation
- Corporate admin approval workflow

## Development Setup

### 1. Local Development with Subdomains

To test subdomains locally, you need to modify your hosts file:

```bash
# Edit your hosts file
sudo nano /etc/hosts

# Add these lines
127.0.0.1 pcc.localhost
127.0.0.1 localhost
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Access Different Portals

- **Main Portal**: `http://localhost:3000`
- **PCC Corporate Portal**: `http://pcc.localhost:3000`

## Production Deployment

### 1. DNS Configuration

Set up DNS records for your subdomains:

```
Type: CNAME
Name: pcc
Value: canhav.io
TTL: 300
```

### 2. Vercel Configuration

If using Vercel, add domains in your project settings:
- `canhav.io`
- `pcc.canhav.io`
- `*.canhav.io` (for wildcard support)

### 3. Environment Variables

Ensure these environment variables are set:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Adding New Corporate Clients

### 1. Update Subdomain Configuration

Edit `lib/subdomain-utils.ts`:

```typescript
export const SUBDOMAIN_CONFIGS: Record<string, SubdomainConfig> = {
  // ... existing configs
  'newclient': {
    type: 'enterprise',
    name: 'newclient',
    displayName: 'New Client Corporate Portal',
    corporateClient: 'New Client Corp',
    theme: {
      primaryColor: 'green',
      brandName: 'New Client Portal'
    }
  }
}
```

### 2. DNS Setup

Add DNS record for the new subdomain:
```
Type: CNAME
Name: newclient
Value: canhav.io
```

### 3. Update Domain Lists

Add to `next.config.js`:
```javascript
domains: [..., 'newclient.canhav.io']
```

## User Management

### Corporate User Workflow

1. **User Registration**: Users visit `pcc.canhav.io/corporate/signup`
2. **Company Validation**: System pre-fills company name based on subdomain
3. **Admin Approval**: Corporate admin approves/rejects requests
4. **Access Control**: Users can only access their designated corporate portal

### Admin Functions

Admins can:
- Approve/reject corporate user requests
- View corporate user activity
- Manage corporate-specific settings

## Security Features

### 1. Access Validation
- Users must belong to the correct company to access corporate portals
- Company affiliation is validated on login
- Session validation includes corporate access checks

### 2. Subdomain Isolation
- Each corporate portal operates independently
- Users cannot cross-access other corporate portals
- Separate authentication contexts prevent data leakage

### 3. Audit Trail
- All corporate user activities are logged
- Login attempts and access patterns are tracked
- Admin actions are recorded for compliance

## API Endpoints

### Corporate-Specific Endpoints

The system uses the same backend APIs but with additional validation:

```typescript
// Example: Corporate user validation
const validateCorporateAccess = async (userProfile: UserProfile, client: string) => {
  const hasAccess = userProfile.company_name?.toLowerCase().includes(client.toLowerCase()) ||
                   userProfile.is_admin
  return hasAccess
}
```

## Troubleshooting

### Common Issues

1. **Subdomain not working locally**
   - Check hosts file configuration
   - Ensure you're using the correct port (3000)
   - Clear browser cache

2. **Corporate login redirects to main login**
   - Verify subdomain detection in browser dev tools
   - Check middleware configuration
   - Ensure SubdomainAwareLayout is properly configured

3. **User cannot access corporate portal**
   - Verify company name in user profile matches subdomain
   - Check user approval status
   - Validate corporate access logic

### Debug Mode

Enable debug logging by adding to your environment:

```env
NEXT_PUBLIC_DEBUG_SUBDOMAIN=true
```

This will log subdomain detection and routing decisions to the browser console.

## Future Enhancements

### Planned Features

1. **Multi-tenant Database**: Separate data isolation per corporate client
2. **Custom Branding**: Upload custom logos and themes per subdomain
3. **SSO Integration**: Single Sign-On for corporate clients
4. **Advanced Analytics**: Corporate-specific usage analytics
5. **API Rate Limiting**: Per-subdomain rate limiting

### Scalability Considerations

- Database partitioning for large corporate clients
- CDN configuration for subdomain assets
- Load balancing for high-traffic corporate portals
- Caching strategies for corporate-specific data

## Support

For technical support or questions about the subdomain system:
1. Check this documentation first
2. Review the troubleshooting section
3. Contact the development team with specific error messages and reproduction steps
