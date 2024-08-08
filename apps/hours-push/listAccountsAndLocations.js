import dotenv from 'dotenv';
import { listAccountsAndLocations } from '@uvalib/data-wrap/GoogleAPIsHelper.js';

dotenv.config();

async function main() {
  try {
    const data = await listAccountsAndLocations();
    if (data) {
      const { accounts, locations } = data;
      console.log('Accounts:', accounts);
      for (const [accountId, locationsData] of Object.entries(locations)) {
        console.log(`Locations for account ${accountId}:`, locationsData);
      }
    }
  } catch (error) {
    console.error('Error listing accounts and locations:', error.message);
  }
}

main();
