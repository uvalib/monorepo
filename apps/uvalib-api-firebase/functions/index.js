import { initializeApp } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import fetch from 'node-fetch';
import transformJson from './json-transform.js';
import { alertsTransform, libraryAlertsTransform, alertsV2Transform } from './transforms.js';
import { onSchedule } from 'firebase-functions/v2/scheduler';

// Initialize Firebase
initializeApp();

const db = getDatabase();

export const syncAlerts = async (req, res) => {
    try {
      // Fetch and process the alerts data
      const alertsData = await fetchAndProcess('http://library.virginia.edu/alerts?_format=json', alertsTransform);
      const libraryAlertsData = await fetchAndProcess('http://library.virginia.edu/library-alerts?_format=json', libraryAlertsTransform);
      const regionalAlertsData = await fetchAndProcess('http://library.virginia.edu/alerts?_format=json', alertsV2Transform);
  
      // Write to Firebase
      await db.ref('/alerts').set(alertsData);
      await db.ref('/library-alerts').set(libraryAlertsData);
      await db.ref('/regionalalerts').set(regionalAlertsData);
  
      console.log('Alerts synced successfully');
      if (res) res.status(200).send('Alerts synced successfully');
    } catch (error) {
      console.error('Error syncing alerts:', error);
      if (res) res.status(500).send('Error syncing alerts');
    }
  };
  
  // Helper function to fetch and process the JSON data
  async function fetchAndProcess(url, transform) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}: ${response.status} ${response.statusText}`);
      }
      const items = await response.json();
      return transformJson(items, transform);
    } catch (error) {
      console.error(`Error fetching or processing data from ${url}:`, error);
      throw error;
    }
  }
  

// Schedule the syncAlerts function to run every 5 minutes
export const scheduledSyncAlerts = onSchedule('every 5 minutes', syncAlerts);
