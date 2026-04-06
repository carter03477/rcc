# Gmail API Setup for RCC

## For Dad (Darren):

Carter wants to add Gmail integration to his RCC dashboard. This will let him read, send, and manage his Gmail directly from RCC.

### What We Need:

**Google Cloud Project Setup:**
1. Go to https://console.cloud.google.com
2. Create a new project called "RCC Email Client"
3. Enable the Gmail API
4. Create OAuth 2.0 credentials
5. Download the credentials JSON file

### Security Notes:

- OAuth 2.0 means Carter logs in with his Gmail once
- A secure token is stored (NOT his password)
- Token only works for this specific app
- Can be revoked anytime from Google account settings
- All email data stays on the Mac mini (not sent to any external servers)
- Rocky (the AI) can help Carter read/send emails but won't store credentials

### Detailed Steps:

1. **Create Google Cloud Project:**
   - Visit: https://console.cloud.google.com
   - Click "Select a project" → "New Project"
   - Name: "RCC Email Client"
   - Click "Create"

2. **Enable Gmail API:**
   - In the project dashboard, go to "APIs & Services" → "Library"
   - Search for "Gmail API"
   - Click it and press "Enable"

3. **Create OAuth Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Name: "RCC Gmail Client"
   - Authorized redirect URIs: `http://localhost:8080/oauth/callback`
   - Click "Create"

4. **Download Credentials:**
   - Click the download button next to your new credentials
   - Save as `gmail-credentials.json`
   - Put it in: `/Users/darrens/.openclaw/workspace-rocky/RCC/gmail-credentials.json`

### What Carter Will Be Able To Do:

✅ Read emails  
✅ Send emails  
✅ Reply to emails  
✅ Delete/archive emails  
✅ Search emails  
✅ See unread count  

All within his RCC dashboard!

---

**Questions?** Ask Rocky or let Carter know if you need help with any step!
