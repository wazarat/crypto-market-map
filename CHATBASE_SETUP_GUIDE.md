# Chatbase Integration Setup Guide

## Problem Identified

The chatbase is unable to provide information about companies because:

1. **Invalid Chatbot ID**: The `NEXT_PUBLIC_CHATBOT_ID` is set to placeholder value `"your-chatbot-id-here"`
2. **Missing Training Data**: The chatbot hasn't been trained with VASP company data
3. **Configuration Issues**: Environment variables not properly configured

## Solution Steps

### 1. Create and Configure Chatbase Chatbot

#### Step 1: Create Chatbase Account
1. Go to [https://www.chatbase.co](https://www.chatbase.co)
2. Sign up or log in to your account
3. Create a new chatbot

#### Step 2: Train Your Chatbot
Upload the following data sources to train your chatbot:

**Company Data Sources:**
- Export company data from Supabase as CSV/JSON
- Include key fields: name, description, sector, website, license_status
- Add regulatory information and compliance data

**Sample Training Data Format:**
```json
{
  "companies": [
    {
      "name": "ApolloX",
      "sector": "Exchange Services",
      "description": "Cryptocurrency exchange platform",
      "website": "https://www.apollox.finance",
      "license_status": "Pending",
      "verification_status": "Pending",
      "headquarters": "Not specified",
      "founded": "2021"
    }
  ]
}
```

#### Step 3: Get Chatbot ID
1. After creating and training your chatbot
2. Go to your chatbot settings/dashboard
3. Copy the Chatbot ID (format: usually starts with letters/numbers like `abc123def456`)

### 2. Update Environment Configuration

#### Update .env.local file:
```bash
# Replace 'your-actual-chatbot-id' with the real ID from Chatbase
NEXT_PUBLIC_CHATBOT_ID=your-actual-chatbot-id
NEXT_PUBLIC_CHATBASE_HOST=https://www.chatbase.co
```

#### For Vercel Deployment:
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add/Update:
   - `NEXT_PUBLIC_CHATBOT_ID` = your actual chatbot ID
   - `NEXT_PUBLIC_CHATBASE_HOST` = https://www.chatbase.co

### 3. Verify Integration

#### Test Locally:
```bash
# Start development server
npm run dev

# Visit any company page, e.g.:
# http://localhost:3000/company/apollox

# Check browser console for Chatbase logs
```

#### Use Test Page:
Visit: `http://localhost:3000/admin/test-chatbase`
- Click "Run Chatbase Tests"
- Verify NEXT_PUBLIC_CHATBOT_ID is not "your-chatbot-id-here"
- Check that script loads successfully

### 4. Data Context Configuration

The system automatically passes company context to Chatbase:

```javascript
const context = {
  company: "ApolloX",
  sector: "Exchange Services", 
  website: "https://www.apollox.finance",
  founded: "2021",
  headquarters: "Not specified",
  license_status: "Pending",
  verification_status: "Pending",
  description: "Cryptocurrency exchange platform"
}
```

### 5. Troubleshooting

#### Common Issues:

**Issue 1: Chatbot says "I don't have information"**
- **Cause**: Chatbot not trained with company data
- **Solution**: Upload comprehensive company database to Chatbase training

**Issue 2: Chatbot doesn't load**
- **Cause**: Invalid or missing chatbot ID
- **Solution**: Verify NEXT_PUBLIC_CHATBOT_ID in environment variables

**Issue 3: Context not working**
- **Cause**: Company data not being passed correctly
- **Solution**: Check browser console for context logs

#### Debug Commands:
```bash
# Check environment variables
echo $NEXT_PUBLIC_CHATBOT_ID

# Check if chatbot ID is set correctly
grep -r "NEXT_PUBLIC_CHATBOT_ID" .env*
```

### 6. Training Data Recommendations

#### Essential Company Information:
- Company name and aliases
- Business description and services
- Regulatory status and licenses
- Contact information
- Financial information (if public)
- Compliance ratings
- Pakistan operations status

#### Sample Training Prompts:
```
Q: What does ApolloX do?
A: ApolloX is a cryptocurrency exchange platform that provides trading services. It was founded in 2021 and currently has a pending license status with Pakistani regulators.

Q: What is ApolloX's regulatory status?
A: ApolloX has a pending license status and pending verification status with Pakistani crypto regulators.

Q: Where is ApolloX headquartered?
A: ApolloX's headquarters location is not currently specified in our database.
```

### 7. Advanced Configuration

#### Custom Context for Specific Pages:
The system automatically detects which company page the user is viewing and provides relevant context to the chatbot.

#### Identity Management:
The system includes user identity features for personalized responses based on user role (researcher, regulator, etc.).

## Next Steps

1. **Create Chatbase account and get real chatbot ID**
2. **Update environment variables with real chatbot ID**
3. **Train chatbot with comprehensive VASP company data**
4. **Test integration on company pages**
5. **Monitor chatbot responses and refine training data**

## Files Modified

- `components/ChatbaseWidgetOfficial.tsx` - Fixed hardcoded chatbot ID
- Environment configuration needs real chatbot ID

## Support

If you encounter issues:
1. Check browser console for error messages
2. Use the test page at `/admin/test-chatbase`
3. Verify environment variables are set correctly
4. Ensure chatbot is properly trained with company data
