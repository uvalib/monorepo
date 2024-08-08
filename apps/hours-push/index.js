import dotenv from 'dotenv';
import { LibrariesData } from '@uvalib/data-wrap/LibrariesData.js';
import { transformHoursForGoogle, updateBusinessHours } from '@uvalib/data-wrap/GoogleAPIsHelper.js';

dotenv.config();

// Mapping of library names to Google Location IDs
const libraryNameToLocationId = {
  "clemons": "5593727798115540489",
  "main": "2775740908312360289",
  "science": "7587690153343274973"
};

async function fetchLibraryHours() {
  const librariesData = new LibrariesData();
  const today = new Date();
  const weekStart = today.toISOString().split('T')[0];

  const libraries = Object.keys(libraryNameToLocationId);

  const libraryHours = {};

  for (const library of libraries) {
    const lib = await librariesData.getLibrary(library, true);
    if (lib) {
      const ids = lib.getHoursCalIds();
      await librariesData.fetchHours(today, 6, ids);
      libraryHours[library] = lib.hours.rawDates;
    }
  }

  return libraryHours;
}

async function logAndPushLibraryHours() {
  try {
    const libraryHours = await fetchLibraryHours();

    const googleFormattedHours = transformHoursForGoogle(libraryHours, libraryNameToLocationId);
    console.log('Google Formatted Hours:', JSON.stringify(googleFormattedHours, null, 2));

    for (const [locationId, hours] of Object.entries(googleFormattedHours)) {
      await updateBusinessHours(locationId, hours);
    }
  } catch (error) {
    console.error('Error fetching or updating library hours:', error.message);
  }
}

logAndPushLibraryHours();
