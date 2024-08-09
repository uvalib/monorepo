import { google } from 'googleapis';
import open from 'open';
import readline from 'readline';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// Configure these with your actual credentials from the .env file
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const SCOPES = ['https://www.googleapis.com/auth/business.manage'];

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Generate the URL that will be used for authorization
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline', // Get a refresh token
  scope: SCOPES
});

console.log('Authorize this app by visiting this url:', authUrl);

// Automatically open the URL in the default browser
open(authUrl);

// Create an interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt the user to enter the code from the URL
rl.question('Enter the code from that page here: ', (code) => {
  rl.close();

  oauth2Client.getToken(code, (err, token) => {
    if (err) {
      console.error('Error retrieving access token', err);
      return;
    }
    console.log('Access Token:', token.access_token);
    console.log('Refresh Token:', token.refresh_token);

    // Save the token for future use (you can save this in a secure place)
    console.log('Please save this refresh token for future use:');
    console.log(token.refresh_token);
  });
});
