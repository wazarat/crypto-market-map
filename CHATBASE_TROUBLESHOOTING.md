# Chatbase Integration Troubleshooting Guide

## Current Issue Analysis

Based on your Vercel environment variables, the chatbot ID (`-jDdVmTLLPOcK3BzQBBsi`) appears to be valid, but the chatbot is still responding with "I don't have information on ApolloX."

## Root Causes & Solutions

### 1. **Context Not Being Passed Properly**
**Problem**: The chatbot isn't receiving company-specific context when users visit company pages.

**Solutions Applied**:
- ✅ Enhanced context setting with multiple methods
- ✅ Added retry mechanism for context setting
- ✅ Created dedicated context manager (`chatbase-context.ts`)
- ✅ Added debugging tools

### 2. **Chatbot Training Data Missing**
**Problem**: Your Chatbase chatbot likely hasn't been trained with your VASP company database.

**Solution Steps**:
1. **Export Company Data**:
   ```bash
   # Run this to export your company data
   npm run export-companies
   ```

2. **Train Your Chatbase Chatbot**:
   - Go to [Chatbase.co](https://www.chatbase.co)
   - Login to your account
   - Find your chatbot (ID: `-jDdVmTLLPOcK3BzQBBsi`)
   - Upload training data with company information
   - Include ApolloX and other company details

### 3. **Context Format Issues**
**Problem**: Chatbase might not be interpreting the context correctly.

**Solutions Applied**:
- ✅ Standardized context format
- ✅ Added multiple context setting methods
- ✅ Enhanced error handling and retries

## Testing & Debugging

### 1. **Use the Debug Tools**
When you visit any company page (e.g., `/company/apollox`):

1. **Look for the purple "🔍 Chatbase Debug" button** in the top-left corner
2. Click it and run the debug checks
3. Verify:
   - ✅ Chatbot ID is set correctly
   - ✅ Script is loaded
   - ✅ Context is being set
   - ✅ Window.chatbase is available

### 2. **Check Browser Console**
Look for these log messages:
```
✅ Official Chatbase: Script loaded successfully
✅ Chatbase context set successfully: {company_name: "ApolloX", ...}
🏢 Company context prepared: {...}
```

### 3. **Manual Context Refresh**
If the context isn't working, you can manually refresh it:
```javascript
// In browser console
refreshChatbaseContext()
```

## Expected Behavior After Fixes

### Before Fix:
- Chatbot: "I'm sorry, but I don't have information on ApolloX"

### After Fix:
- Chatbot should know you're viewing ApolloX
- Should provide relevant information about the company
- Should understand the company context

## Training Data Format

Your Chatbase chatbot should be trained with data like this:

```json
{
  "company": "ApolloX",
  "sector": "Exchange Services",
  "description": "Cryptocurrency exchange platform",
  "license_status": "Pending",
  "verification_status": "Pending",
  "website": "https://www.apollox.finance",
  "founded": "2021",
  "headquarters": "Not specified"
}
```

### Sample Training Q&A:
```
Q: What is ApolloX?
A: ApolloX is a cryptocurrency exchange platform that provides trading services. It was founded in 2021 and currently has a pending license status with Pakistani regulators.

Q: What services does ApolloX offer?
A: ApolloX offers exchange services in the cryptocurrency sector.

Q: What is ApolloX's regulatory status?
A: ApolloX has a pending license status and pending verification status with Pakistani crypto regulators.
```

## Implementation Details

### Context Setting Methods:
1. **Standard Context**: `window.chatbase('setContext', context)`
2. **User Attributes**: `window.chatbase('set', {custom_data: context})`
3. **System Message**: `window.chatbase('system', {message, context})`
4. **Initial Message**: `window.chatbase('sendMessage', {message, context})`

### Retry Mechanism:
- Attempts to set context up to 10 times
- 1-second delays between attempts
- Multiple context setting methods
- Comprehensive error logging

## Next Steps

### Immediate Actions:
1. **Visit a company page** (e.g., `/company/apollox`)
2. **Use the debug tool** to verify integration
3. **Check browser console** for context logs
4. **Train your Chatbase chatbot** with company data

### If Still Not Working:

1. **Check Chatbase Dashboard**:
   - Verify chatbot ID is correct
   - Ensure chatbot is published/active
   - Check if context API is enabled

2. **Re-deploy with Environment Variables**:
   - Ensure Vercel environment variables are applied
   - Trigger a new deployment

3. **Contact Chatbase Support**:
   - If context setting still fails
   - Verify API compatibility

## Files Modified

- `components/ChatbaseWidgetOfficial.tsx` - Enhanced context setting
- `lib/chatbase-context.ts` - New context manager
- `app/company/[slug]/page.tsx` - Added context integration
- `components/ChatbaseDebugger.tsx` - New debugging tool

## Success Indicators

✅ **Debug tool shows all green checkmarks**
✅ **Console shows "Context set successfully" messages**
✅ **Chatbot responds with company-specific information**
✅ **No "I don't have information" responses for known companies**

The integration should now properly pass company context to your Chatbase chatbot. The main remaining step is ensuring your chatbot is trained with the company data from your database.
