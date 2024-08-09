# Hours Push Application

This application automates the process of updating Google My Business hours for libraries based on data fetched from the Drupal system. It uses the Google My Business API to push regular hours for different libraries.

## Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [Environment Variables](#environment-variables)
3. [Obtaining OAuth 2.0 Credentials](#obtaining-oauth-20-credentials)
4. [Generating a Refresh Token](#generating-a-refresh-token)
5. [Mapping Library IDs](#mapping-library-ids)
6. [Running the Application](#running-the-application)
7. [Additional Notes](#additional-notes)

## Setup Instructions

1. **Clone the repository:**

   ```
   git clone <repository-url>
   cd hours-push
   ```

2. **Install dependencies:**

   Use `npm` or `pnpm` to install dependencies:

   ```
   npm install
   # or
   pnpm install
   ```

3. **Create a `.env` file:**

   Copy the `.env.example` file or manually create a `.env` file in the root directory with the following content:

   ```
   CLIENT_ID=979997990790-t87392gj7jdbudi2vnhb6gbeaub97n0e.apps.googleusercontent.com
   CLIENT_SECRET=YOUR_CLIENT_SECRET
   REDIRECT_URI=http://localhost:3000/oauth2callback
   REFRESH_TOKEN=YOUR_REFRESH_TOKEN
   DRUPAL_BASE_URL="https://library.virginia.edu"
   ```

   Replace `YOUR_CLIENT_SECRET` and `YOUR_REFRESH_TOKEN` with the appropriate values.

## Environment Variables

- **CLIENT_ID**: The client ID for your Google OAuth 2.0 application. This is available in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
- **CLIENT_SECRET**: The client secret associated with your Google OAuth 2.0 application. Keep this value secure.
- **REDIRECT_URI**: The URI where Google will redirect users after they authorize your application. This should be set to `http://localhost:3000/oauth2callback`.
- **REFRESH_TOKEN**: The refresh token obtained after authorizing the application. This token is used to obtain access tokens to interact with Google APIs.
- **DRUPAL_BASE_URL**: The base URL for the Drupal system where library hours are fetched.

## Obtaining OAuth 2.0 Credentials

To obtain the necessary OAuth 2.0 credentials, follow these steps:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) [Login with 'uvalib@gmail.com` account].
2. Navigate to **APIs & Services** > **Credentials**.
3. Create a new OAuth 2.0 Client ID credential if you don't have one.
4. Configure the OAuth consent screen, if you haven't already.
5. Make sure the **Redirect URI** is set to `http://localhost:3000/oauth2callback`.
6. Download the OAuth 2.0 Client ID JSON file or manually note down the `CLIENT_ID` and `CLIENT_SECRET`.

## Generating a Refresh Token

**Important:** The OAuth refresh token must be generated using the `uvalib@gmail.com` account. The `tokenHarvester.js` script automatically uses this account as the login hint. This script will not work with any other account, so ensure that the `uvalib@gmail.com` account is used for authentication.

1. Run the `tokenHarvester.js` script:

   ```
   node tokenHarvester.js
   ```

2. A URL will be printed in the terminal. Open this URL in your browser and authorize the application using the `uvalib@gmail.com` account.
3. After successful authorization, you'll be redirected back to `http://localhost:3000/oauth2callback`.
4. The terminal will display the `Access Token` and `Refresh Token`. Copy the `Refresh Token` and paste it into your `.env` file.

## Mapping Library IDs

The application needs to map Drupal library IDs to Google library IDs. This is done using the `listAccountsAndLocations.js` script:

1. Run the script:

   ```
   node listAccountsAndLocations.js
   ```

2. The script will list all the accounts and locations associated with the Google account.
3. Update the mappings in your application as needed by editing the `index.js` script mapping the slug property from Drupal to the Google business id.

```
const libraryNameToLocationId = {
  "clemons": "5593727798115540489",
  "main": "2775740908312360289",
  "science": "9073376664230470586"
};
```

## Running the Application

Once everything is set up, you can run the main application script to push hours to Google My Business:

```
node index.js
```

The script will fetch the latest hours from the Drupal system and update them on Google My Business.

## Additional Notes

- Ensure that your OAuth 2.0 credentials are kept secure and not exposed publicly.
- The refresh token is required to maintain long-term access to Google APIs without needing re-authorization.
- If you encounter issues with API limits or authorization errors, consider regenerating your credentials or adjusting your Google Cloud project settings.

---

This README provides a comprehensive guide to setting up and using the Hours Push Application. Ensure that you follow the steps closely and refer to the [Google API documentation](https://developers.google.com/business-communications/business-messages/guides) for any additional help.
