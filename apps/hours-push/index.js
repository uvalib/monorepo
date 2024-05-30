import { google } from 'googleapis';
import { config } from 'dotenv';
import fs from 'fs';

// Load environment variables from AWS Lambda environment
config();

const SCOPES = ['https://www.googleapis.com/auth/business.manage'];
const TOKEN_PATH = process.env.TOKEN_PATH || '/tmp/token.json'; // Use the environment variable or default to /tmp/token.json

async function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  throw new Error('OAuth2 authentication requires manual intervention');
}

async function authenticate() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = process.env;
  const oAuth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);

  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
    oAuth2Client.setCredentials(token);
  } else {
    await getAccessToken(oAuth2Client);
  }

  return oAuth2Client;
}

async function fetchLibraryHours() {
  const response = await fetch(`https://cal.lib.virginia.edu/api/1.0/hours/[[calIds]]?iid=863&key=${process.env.SPRINGSHARE_API_KEY}`);
  const data = await response.json();
  return data;
}

function parseLibcalHours(libcalData) {
  const hoursData = {};

  libcalData.forEach(library => {
    const { name, dates } = library;
    const specialHours = [];

    for (const [date, details] of Object.entries(dates)) {
      if (details.status === 'open') {
        details.hours.forEach(timeRange => {
          specialHours.push({
            startDate: date,
            endDate: date,
            openTime: timeRange.from,
            closeTime: timeRange.to,
          });
        });
      }
    }

    hoursData[name] = specialHours;
  });

  return hoursData;
}

async function updateGoogleBusinessHours(auth, libraryName, specialHours) {
  const mybusiness = google.mybusiness('v4');

  const request = {
    name: `accounts/${process.env.ACCOUNT_ID}/locations/${libraryName}`, // Replace ACCOUNT_ID with actual account ID
    updateMask: 'specialHours',
    resource: {
      specialHours,
    },
    auth,
  };

  try {
    const response = await mybusiness.accounts.locations.patch(request);
    console.log(`Successfully updated hours for ${libraryName}`);
    console.log(response.data);
  } catch (error) {
    console.error(`Failed to update hours for ${libraryName}`, error);
  }
}

async function main() {
  const auth = await authenticate();
  const libcalData = await fetchLibraryHours();
  const parsedHours = parseLibcalHours(libcalData);

  for (const [libraryName, specialHours] of Object.entries(parsedHours)) {
    await updateGoogleBusinessHours(auth, libraryName, specialHours);
  }
}

// Lambda handler
export const handler = async (event) => {
  try {
    await main();
    return {
      statusCode: 200,
      body: JSON.stringify('Successfully updated Google Business Hours'),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify('Failed to update Google Business Hours'),
    };
  }
};
