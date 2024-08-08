require('dotenv').config();
const { google } = require('googleapis');
const fetch = require('node-fetch');

console.log('Client ID:', process.env.CLIENT_ID);
console.log('Client Secret:', process.env.CLIENT_SECRET);
console.log('Redirect URI:', process.env.REDIRECT_URI);
console.log('Refresh Token:', process.env.REFRESH_TOKEN);

// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Set refresh token
oauth2Client.setCredentials({
  scope: 'https://www.googleapis.com/auth/business.manage',
  refresh_token: process.env.REFRESH_TOKEN,
});

async function listAccountsAndLocations() {
  try {
    console.log('Obtaining access token...');
    const { token } = await oauth2Client.getAccessToken();
    console.log('Access Token:', token);

    const accountsUrl = 'https://mybusinessaccountmanagement.googleapis.com/v1/accounts';
    const accountsHeaders = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    console.log('Fetching accounts...');
    const accountsResponse = await fetch(accountsUrl, {
      method: 'GET',
      headers: accountsHeaders,
    });

    if (!accountsResponse.ok) {
      const errorText = await accountsResponse.text();
      throw new Error(`HTTP error! Status: ${accountsResponse.status}, Response: ${errorText}`);
    }

    const accountsData = await accountsResponse.json();
    console.log('Accounts:', accountsData);

    if (accountsData.accounts && accountsData.accounts.length > 0) {
      for (const account of accountsData.accounts) {
        const accountId = account.name.split('/')[1];
        const locationsUrl = `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${accountId}/locations?readMask=name,title`;
        const locationsHeaders = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        console.log(`Fetching locations for account ${accountId}...`);
        const locationsResponse = await fetch(locationsUrl, {
          method: 'GET',
          headers: locationsHeaders,
        });

        if (!locationsResponse.ok) {
          const errorText = await locationsResponse.text();
          throw new Error(`HTTP error! Status: ${locationsResponse.status}, Response: ${errorText}`);
        }

        const locationsData = await locationsResponse.json();
        console.log(`Locations for account ${accountId}:`, locationsData);
      }
    } else {
      console.log('No accounts found.');
    }
  } catch (error) {
    console.error('Error listing accounts and locations:', error.message);
  }
}

listAccountsAndLocations();
