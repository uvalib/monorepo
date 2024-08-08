import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

export async function getAccessToken() {
  try {
    const { token } = await oauth2Client.getAccessToken();
    if (!token) throw new Error('Failed to obtain access token');
    return token;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error obtaining access token:', error.message);
    } else {
      console.error('Error obtaining access token:', error);
    }
    throw error;
  }
}

async function fetchWithRetry(url: string, options: any, retries: number = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, options);
    if (response.ok) {
      return response;
    } else if (response.status === 503) {
      console.log(`Service unavailable, retrying... (${i + 1}/${retries})`);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
    } else {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
    }
  }
  throw new Error('Service unavailable after multiple retries');
}

export async function listAccountsAndLocations() {
  try {
    const token = await getAccessToken();

    const accountsUrl = 'https://mybusinessaccountmanagement.googleapis.com/v1/accounts';
    const accountsHeaders = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const accountsResponse = await fetchWithRetry(accountsUrl, {
      method: 'GET',
      headers: accountsHeaders,
    });

    const accountsData = await accountsResponse.json();

    if (accountsData.accounts && accountsData.accounts.length > 0) {
      const locationsData: { [key: string]: any } = {};

      for (const account of accountsData.accounts) {
        const accountId = account.name.split('/')[1];
        const locationsUrl = `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${accountId}/locations?readMask=name,title`;
        const locationsHeaders = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        const locationsResponse = await fetchWithRetry(locationsUrl, {
          method: 'GET',
          headers: locationsHeaders,
        });

        locationsData[accountId] = await locationsResponse.json();
      }

      return { accounts: accountsData, locations: locationsData };
    } else {
      console.log('No accounts found.');
      return null;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error listing accounts and locations:', error.message);
    } else {
      console.error('Error listing accounts and locations:', error);
    }
    throw error;
  }
}
