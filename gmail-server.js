// RCC Gmail Server
// Backend server for Gmail API integration

const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8081;

// Load credentials
const CREDENTIALS_PATH = path.join(__dirname, 'gmail-credentials.json');
const TOKEN_PATH = path.join(__dirname, 'gmail-token.json');

let credentials = null;
let oAuth2Client = null;

// Initialize OAuth client
function initializeOAuth() {
    if (!fs.existsSync(CREDENTIALS_PATH)) {
        console.log('❌ Gmail credentials not found. Please run setup first.');
        console.log('📄 See GMAIL_SETUP.md for instructions');
        return false;
    }

    credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
    const { client_id, client_secret, redirect_uris } = credentials.web || credentials.installed;
    
    oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
    );

    // Load saved token if exists
    if (fs.existsSync(TOKEN_PATH)) {
        const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
        oAuth2Client.setCredentials(token);
        console.log('✅ Gmail token loaded');
    }

    return true;
}

// Generate auth URL
app.get('/auth/gmail', (req, res) => {
    if (!oAuth2Client) {
        return res.json({ error: 'OAuth client not initialized' });
    }

    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/gmail.modify']
    });

    res.json({ authUrl });
});

// OAuth callback
app.get('/oauth/callback', async (req, res) => {
    const { code } = req.query;
    
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        
        // Save token
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
        console.log('✅ Gmail token saved');
        
        res.send('<h1>✅ Gmail Connected!</h1><p>You can close this window and go back to RCC.</p>');
    } catch (error) {
        console.error('Error getting token:', error);
        res.send('<h1>❌ Error connecting Gmail</h1>');
    }
});

// Get emails list
app.get('/api/emails', async (req, res) => {
    try {
        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
        const response = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 20,
            labelIds: ['INBOX']
        });

        const messages = response.data.messages || [];
        const emails = [];

        // Get details for each message
        for (const message of messages) {
            const detail = await gmail.users.messages.get({
                userId: 'me',
                id: message.id,
                format: 'metadata',
                metadataHeaders: ['From', 'Subject', 'Date']
            });

            const headers = detail.data.payload.headers;
            const from = headers.find(h => h.name === 'From')?.value || '';
            const subject = headers.find(h => h.name === 'Subject')?.value || '(No Subject)';
            const date = headers.find(h => h.name === 'Date')?.value || '';

            emails.push({
                id: message.id,
                from,
                subject,
                date,
                unread: detail.data.labelIds?.includes('UNREAD')
            });
        }

        res.json({ emails });
    } catch (error) {
        console.error('Error fetching emails:', error);
        res.json({ error: 'Failed to fetch emails' });
    }
});

// Get single email
app.get('/api/email/:id', async (req, res) => {
    try {
        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
        const response = await gmail.users.messages.get({
            userId: 'me',
            id: req.params.id,
            format: 'full'
        });

        res.json({ email: response.data });
    } catch (error) {
        console.error('Error fetching email:', error);
        res.json({ error: 'Failed to fetch email' });
    }
});

// Send email
app.post('/api/send', express.json(), async (req, res) => {
    try {
        const { to, subject, body } = req.body;
        
        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
        
        const email = [
            `To: ${to}`,
            `Subject: ${subject}`,
            '',
            body
        ].join('\n');

        const encodedEmail = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');

        await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedEmail
            }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        res.json({ error: 'Failed to send email' });
    }
});

// Check auth status
app.get('/api/auth-status', (req, res) => {
    const isAuthed = oAuth2Client && oAuth2Client.credentials && oAuth2Client.credentials.access_token;
    res.json({ authenticated: !!isAuthed });
});

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Start server
if (initializeOAuth()) {
    app.listen(PORT, () => {
        console.log(`🚀 RCC Gmail Server running on http://localhost:${PORT}`);
        console.log('📧 Ready to connect Gmail!');
    });
} else {
    console.log('⚠️  Please complete Gmail API setup first');
    console.log('📄 See GMAIL_SETUP.md for instructions');
}
