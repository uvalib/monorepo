import { html } from 'lit';
import { Library } from '@uvalib/data-wrap';
import { Hours } from '@uvalib/data-wrap/dist/src/Hours';

  export function formatTime(time: string) {
    // Separating the hours and minutes from the "am" or "pm" portion
    const timeParts = time.match(/(\d+):(\d+)(am|pm)/);
    if (timeParts) {
      const hours = timeParts[1];
      const minutes = timeParts[2];
      const ampm = timeParts[3];
      
      // Only showing the minute if it is not ":00"
      if (minutes === "00") {
        return `${hours}${ampm}`;
      }
      return `${hours}:${minutes}${ampm}`;
    }
    // If the time string does not match the expected format, return it unchanged
    return time;
  }

  export function printTimes(day: any) {
    if (day.hours) {
      return day.hours.map((h: { from: string; to: string; }) => html`
        ${formatTime(h.from)} - ${formatTime(h.to)}
      `);
    } 
    if (day.status) {
      return day.status.replace('24hours', '24 Hours').replace('ByApp', 'By Appt');
    }
    return "";
  }

  export function printTimesForLibrary(lib: Library) {
    if (lib && lib.hours && lib.hours.rawDates) {
      const hours = <Hours> lib.hours;
      const today = <{hours:Array<{from: string, to: string}>|null, status:string|null}> Object.values(hours.rawDates)[0];
      if (today.hours) {
        return today.hours.map((h: { from: string; to: string; }) => html`
          ${formatTime(h.from)} - ${formatTime(h.to)}
        `);
      } 
      if (today.status) {
        return today.status.replace('24hours', '24 Hours').replace('ByApp', 'By Appt');
      }
    }
    return "";
  }
  
  export function stringDateFormat(dateString: string, format: number) {
    const dateObj = new Date(dateString);
    const formats: Intl.DateTimeFormatOptions[] = [
      { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' },
      { month: 'short', day: 'numeric', timeZone: 'UTC' },
      { weekday: 'short', timeZone: 'UTC' }
    ]
    return dateObj.toLocaleDateString('en-US', formats[format]);
  }
  
  export function sortLibraries(libraries: Library[]) {
    return libraries.sort((a, b) => ((a.title ? a.title : '') > (b.title ? b.title : '')) ? 1 : -1);
  }
  