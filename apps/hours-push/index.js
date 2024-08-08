import dotenv from 'dotenv';
import { LibrariesData } from '@uvalib/data-wrap/LibrariesData.js';

dotenv.config();

// Mapping of library names to Google Location IDs
const libraryNameToLocationId = {
  "clemons": "5593727798115540489"
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

function transformHoursForGoogle(libraryHours) {
  const transformed = {};

  for (const [library, hours] of Object.entries(libraryHours)) {
    const locationId = libraryNameToLocationId[library];
    if (!locationId) continue;

    const periods = Object.entries(hours).map(([date, info]) => {
      const dayOfWeek = getDayOfWeekInTimezone(date, 'America/New_York');
      if (info.status === 'open' && info.hours && info.hours.length > 0) {
        return {
          openDay: dayOfWeekToGoogle(dayOfWeek),
          closeDay: dayOfWeekToGoogle(dayOfWeek),
          openTime: timeStringToGoogleTime(info.hours[0].from),
          closeTime: timeStringToGoogleTime(info.hours[0].to)
        };
      } else {
        // Return null to filter out later
        return null;
      }
    }).filter(period => period !== null); // Filter out closed days

    transformed[locationId] = {
      regularHours: {
        periods: periods
      }
    };
  }

  return transformed;
}

function dayOfWeekToGoogle(day) {
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  return days[day];
}

function getDayOfWeekInTimezone(dateStr, timeZone) {
  const date = new Date(dateStr + 'T00:00:00');
  const options = { weekday: 'long', timeZone: timeZone };
  const dayOfWeekStr = new Intl.DateTimeFormat('en-US', options).format(date);
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(dayOfWeekStr);
}

function timeStringToGoogleTime(timeStr) {
  const [time, modifier] = timeStr.split(/(am|pm)/i);
  let [hours, minutes] = time.split(':');
  if (modifier.toLowerCase() === 'pm' && hours !== '12') {
    hours = parseInt(hours, 10) + 12;
  }
  if (modifier.toLowerCase() === 'am' && hours === '12') {
    hours = 0;
  }
  return { hours: parseInt(hours, 10), minutes: parseInt(minutes || '0', 10) };
}

async function logLibraryHours() {
  try {
    const libraryHours = await fetchLibraryHours();

    const googleFormattedHours = transformHoursForGoogle(libraryHours);
    console.log('Google Formatted Hours:', JSON.stringify(googleFormattedHours, null, 2));
  } catch (error) {
    console.error('Error fetching library hours:', error.message);
  }
}

logLibraryHours();
