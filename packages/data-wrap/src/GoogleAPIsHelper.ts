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

interface Time {
  hours: number;
  minutes: number;
}

interface Period {
  openDay: string;
  closeDay: string;
  openTime: Time;
  closeTime: Time;
}

interface RegularHours {
  regularHours: {
    periods: Period[];
  };
}

export async function updateBusinessHours(locationId: string, hours: RegularHours): Promise<void> {
  try {
    console.log('Obtaining access token...');
    const { token } = await oauth2Client.getAccessToken();
    console.log('Access Token:', token);

    const url = `https://mybusinessbusinessinformation.googleapis.com/v1/locations/${locationId}?updateMask=regularHours`;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const body = JSON.stringify(hours);

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
    if (error instanceof Error) {
      console.error('Error updating business hours:', error.message);
    } else {
      console.error('Error updating business hours:', error);
    }
  }
}

export function transformHoursForGoogle(libraryHours: Record<string, any>, libraryNameToLocationId: Record<string, string>): Record<string, RegularHours> {
  const transformed: Record<string, RegularHours> = {};

  for (const [library, hours] of Object.entries(libraryHours)) {
    const locationId = libraryNameToLocationId[library];
    if (!locationId) continue;

    const periods: Period[] = Object.entries(hours).map(([date, info]: [string, any]) => {
      const dayOfWeek = getDayOfWeekInTimezone(date, 'America/New_York');
      if (info.status === 'open' && info.hours && info.hours.length > 0) {
        return {
          openDay: dayOfWeekToGoogle(dayOfWeek),
          closeDay: dayOfWeekToGoogle(dayOfWeek),
          openTime: timeStringToGoogleTime(info.hours[0].from),
          closeTime: timeStringToGoogleTime(info.hours[0].to),
        };
      } else {
        return null;
      }
    }).filter((period): period is Period => period !== null); // Filter out closed days

    transformed[locationId] = {
      regularHours: {
        periods: periods,
      },
    };
  }

  return transformed;
}

function dayOfWeekToGoogle(day: number): string {
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  return days[day];
}

function getDayOfWeekInTimezone(dateStr: string, timeZone: string): number {
  const date = new Date(dateStr + 'T00:00:00');
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', timeZone: timeZone };
  const dayOfWeekStr = new Intl.DateTimeFormat('en-US', options).format(date);
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(dayOfWeekStr);
}

function timeStringToGoogleTime(timeStr: string): Time {
  const [time, modifier] = timeStr.split(/(am|pm)/i);
  let [hours, minutes] = time.split(':');
  if (modifier.toLowerCase() === 'pm' && hours !== '12') {
    hours = (parseInt(hours, 10) + 12).toString();
  }
  if (modifier.toLowerCase() === 'am' && hours === '12') {
    hours = '0';
  }
  return { hours: parseInt(hours, 10), minutes: parseInt(minutes || '0', 10) };
}
