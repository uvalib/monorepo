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

async function updateBusinessHours() {
  try {
    console.log('Obtaining access token...');
    const { token } = await oauth2Client.getAccessToken();
    console.log('Access Token:', token);

    const url = `https://mybusinessbusinessinformation.googleapis.com/v1/locations/${process.env.LOCATION_ID}?updateMask=regularHours`;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    const body = JSON.stringify({
      regularHours: {
        periods: [
          {
            openDay: 'SUNDAY',
            closeDay: 'SUNDAY',
            openTime: { hours: 13 },
            closeTime: { hours: 20 },
          },
          {
            openDay: 'MONDAY',
            closeDay: 'MONDAY',
            openTime: { hours: 9 },
            closeTime: { hours: 20 },
          },
          {
            openDay: 'TUESDAY',
            closeDay: 'TUESDAY',
            openTime: { hours: 9 },
            closeTime: { hours: 20 },
          },
          {
            openDay: 'WEDNESDAY',
            closeDay: 'WEDNESDAY',
            openTime: { hours: 9 },
            closeTime: { hours: 20 },
          },
          {
            openDay: 'THURSDAY',
            closeDay: 'THURSDAY',
            openTime: { hours: 9 },
            closeTime: { hours: 20 },
          },
          {
            openDay: 'FRIDAY',
            closeDay: 'FRIDAY',
            openTime: { hours: 9 },
            closeTime: { hours: 18 },
          },
          {
            openDay: 'SATURDAY',
            closeDay: 'SATURDAY',
            openTime: { hours: 13 },
            closeTime: { hours: 17 },
          },
        ],
      },
    });

    console.log('Making PATCH request...');
    console.log('URL:', url);
    console.log('Headers:', headers);
    console.log('Body:', body);

    const response = await fetch(url, {
      method: 'PATCH',
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
    }

    const data = await response.json();
    console.log('Update successful:', data);
  } catch (error) {
    console.error('Error updating business hours:', error.message);
  }
}

updateBusinessHours();
