import dotenv from 'dotenv';
import { transformHoursForGoogle, updateBusinessHours } from '@uvalib/data-wrap/GoogleAPIsHelper.js';
import { LibrariesData } from '@uvalib/data-wrap/LibrariesData.js';

dotenv.config();

const libraryNameToLocationId = {
  "clemons": "5593727798115540489",
  "main": "2775740908312360289",
  "science": "9073376664230470586",
  "harrison": ["9145152052087650144","5658702455840637440"],
  "fine-arts": "3728675324704815655",
  "music": "17792018800555508764"
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

async function main() {
  try {
    const libraryHours = await fetchLibraryHours();

    const googleFormattedHours = transformHoursForGoogle(libraryHours, libraryNameToLocationId);
    console.log('Google Formatted Hours:', JSON.stringify(googleFormattedHours, null, 2));

    for (const [locationId, data] of Object.entries(googleFormattedHours)) {
      await updateBusinessHours(locationId, data.regularHours.periods);
    }
  } catch (error) {
    console.error('Error fetching or updating library hours:', error.message);
  }
}


main();
