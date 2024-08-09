import express from 'express';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import open from 'open';

dotenv.config();

const app = express();
const port = 3000;

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'http://localhost:3000/oauth2callback'
);

const authorizeUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/business.manage'],
  prompt: 'consent',
  login_hint: 'uvalib@gmail.com',
});

console.log(`Authorize this app by visiting this url: ${authorizeUrl}`);

// Automatically open the URL in the default browser
open(authorizeUrl);

app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    console.log('Access Token:', tokens.access_token);
    console.log('Refresh Token:', tokens.refresh_token);

    res.send('Authentication successful! You can close this window.');

    // Exit the process once we have the tokens
    process.exit(0);
  } catch (error) {
    console.error('Error retrieving access token', error);
    res.send('Error during authentication.');
  }
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
