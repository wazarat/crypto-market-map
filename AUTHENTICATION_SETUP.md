# Authentication System Setup Guide

## Overview

The Pakistan Crypto Council platform now includes a comprehensive authentication system with the following features:

- **User Registration**: New users can sign up but require admin approval
- **Admin Approval Workflow**: All new registrations must be approved by admin
- **Protected Routes**: Company data requires authentication to access
- **Admin Panel**: User management interface for approving/rejecting users
- **Session Management**: Secure session-based authentication

## Admin User Details

**Admin User**: Wazarat Hussain
- **Email**: waz@canhav.com
- **Username**: wazarat
- **Default Password**: admin123 (⚠️ CHANGE THIS IMMEDIATELY!)

## Setup Instructions

### 1. Database Setup

Run the database migration to create authentication tables:

```sql
-- Execute the SQL in supabase/migrations/20241109_auth_system.sql
-- This creates:
-- - users table
-- - user_sessions table
-- - user_activity_log table
-- - password_reset_tokens table
```

### 2. Initialize Admin User

```bash
# Run the admin initialization script
node scripts/init-admin.js
```

### 3. Environment Variables

Ensure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## User Flow

### For New Users

1. **Visit Homepage**: Users can see the crypto ecosystem overview
2. **Sign Up**: Click "Sign Up" to create an account
3. **Pending Approval**: Account created with "pending" status
4. **Admin Approval**: Admin reviews and approves/rejects the account
5. **Access Granted**: Once approved, user can login and access company data

### For Admin (Wazarat)

1. **Login**: Use admin credentials to login
2. **Admin Panel**: Access `/admin/users` to manage pending registrations
3. **Review Users**: See user details, company, job title, etc.
4. **Approve/Reject**: Approve users or reject with optional reason

## Authentication Features

### Public Access
- ✅ Homepage with sector overview
- ✅ Company names and logos (limited view)
- ✅ Login/Signup pages

### Protected Access (Requires Login)
- 🔒 Individual company pages
- 🔒 Detailed company information
- 🔒 Company notes and research
- 🔒 Chatbase integration with company context

### Admin Only Access
- 👑 User management panel (`/admin/users`)
- 👑 Approve/reject user registrations
- 👑 View user activity logs

## Security Features

### Password Security
- Passwords hashed with bcrypt (12 salt rounds)
- Minimum 8 character requirement
- Password confirmation on signup

### Session Management
- Secure session tokens (UUID + timestamp + random)
- 7-day session expiration
- Automatic session cleanup
- IP address and user agent tracking

### Database Security
- Row Level Security (RLS) enabled
- Users can only access their own data
- Admin-only policies for user management
- Activity logging for audit trail

## API Endpoints

### Authentication Methods

```typescript
// Login
const result = await authService.login({
  username: 'username',
  password: 'password'
})

// Signup
const result = await authService.signup({
  email: 'user@example.com',
  username: 'username',
  password: 'password',
  full_name: 'Full Name',
  company_name: 'Company Name',
  job_title: 'Job Title'
})

// Validate Session
const { valid, user } = await authService.validateSession(sessionToken)

// Logout
await authService.logout(sessionToken)
```

### Admin Methods

```typescript
// Get pending users
const pendingUsers = await authService.getPendingUsers()

// Approve user
await authService.approveUser(userId, adminId)

// Reject user
await authService.rejectUser(userId, adminId, reason)
```

## Component Protection

### Using withAuth HOC

```typescript
// Protect entire pages
export default withAuth(MyComponent)

// Require admin access
export default withAuth(AdminComponent, { requireAdmin: true })
```

### Using useAuth Hook

```typescript
function MyComponent() {
  const { user, isAuthenticated, isAdmin, login, logout } = useAuth()
  
  if (!isAuthenticated) {
    return <LoginPrompt />
  }
  
  return <ProtectedContent />
}
```

## User Management

### User States

- **Pending**: Newly registered, awaiting approval
- **Approved**: Can login and access the platform
- **Rejected**: Cannot login, registration denied
- **Suspended**: Temporarily blocked access

### Admin Actions

1. **View Pending Users**: See all users awaiting approval
2. **User Details**: Review user information before approval
3. **Approve**: Grant access to the platform
4. **Reject**: Deny access with optional reason
5. **Activity Monitoring**: Track user actions and login history

## Testing the System

### Test User Registration

1. Go to `/signup`
2. Fill out registration form
3. Submit and verify "pending approval" message
4. Check admin panel for new pending user

### Test Admin Approval

1. Login as admin (waz@canhav.com / admin123)
2. Go to `/admin/users`
3. See pending user registration
4. Approve or reject the user
5. Test user login after approval

### Test Protected Routes

1. Visit company page while logged out
2. Verify redirect to login
3. Login and verify access granted
4. Test logout functionality

## Security Considerations

### Production Deployment

1. **Change Default Admin Password**: Immediately after setup
2. **Use HTTPS**: Ensure all authentication happens over HTTPS
3. **Environment Variables**: Keep database credentials secure
4. **Session Security**: Consider shorter session timeouts for sensitive environments
5. **Rate Limiting**: Implement login attempt rate limiting
6. **Email Verification**: Consider adding email verification for new users

### Monitoring

- Monitor failed login attempts
- Track user registration patterns
- Review admin approval decisions
- Monitor session usage patterns

## Troubleshooting

### Common Issues

1. **Admin can't login**: Check if admin user was initialized correctly
2. **Users can't register**: Check database permissions and RLS policies
3. **Sessions expire quickly**: Check SESSION_DURATION setting
4. **Protected routes not working**: Verify withAuth wrapper is applied

### Debug Tools

- Check browser console for authentication errors
- Use Supabase dashboard to verify user records
- Check user_activity_log table for audit trail
- Verify environment variables are loaded correctly

## Future Enhancements

### Potential Additions

- Email verification for new users
- Password reset functionality
- Two-factor authentication (optional)
- User roles beyond admin/user
- Bulk user management actions
- Advanced user search and filtering
- Integration with external identity providers

### API Extensions

- RESTful API endpoints for mobile apps
- Webhook notifications for user events
- Advanced session management
- User preference storage
- Audit log export functionality

## Support

For issues with the authentication system:

1. Check the troubleshooting section above
2. Review browser console for errors
3. Check Supabase logs for database issues
4. Contact system administrator (Wazarat Hussain)

The authentication system is now fully integrated and ready for production use with proper admin oversight of user access.
