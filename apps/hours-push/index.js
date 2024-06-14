import { google } from 'googleapis';
import { config } from 'dotenv';
import fs from 'fs';

config();

const SERVICE_ACCOUNT_KEY_PATH = process.env.SERVICE_ACCOUNT_KEY_PATH;
const LOCATION_ID = process.env.LOCATION_ID;

async function getAuthenticatedClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/business.manage'],
  });

  const authClient = await auth.getClient();
  google.options({ auth: authClient });
  return authClient;
}

async function updateHours() {
  try {
    const authClient = await getAuthenticatedClient();
    const myBusiness = google.mybusinessbusinessinformation({
      version: 'v1',
      auth: authClient,
    });

    const hoursData = [
      {
        openDay: 'SUNDAY',
        openTime: {
          hours: 13,
          minutes: 0,
        },
        closeTime: {
          hours: 20,
          minutes: 0,
        },
      },
      // Add more periods here
    ];

    const response = await myBusiness.locations.patch({
      name: `locations/${LOCATION_ID}`,
      updateMask: 'regularHours',
      requestBody: {
        regularHours: {
          periods: hoursData,
        },
      },
    });

    console.log('Hours updated successfully:', response.data);
  } catch (error) {
    console.error('Error updating hours:', error);
    if (error.response) {
      console.error('Error details:', error.response.data);
    }
  }
}

// Run the update function
updateHours();
