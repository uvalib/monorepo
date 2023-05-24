import { html } from 'lit';
import { Library } from '@uvalib/data-wrap';
import { Hours } from '@uvalib/data-wrap/dist/src/Hours';

  export function printTimes(day: any) {
    if (day.hours) {
      return day.hours.map((h: { from: string; to: string; }) => html`
        ${h.from} - ${h.to}
      `);
    } 
    if (day.status) {
      return day.status.replace('24hours', '24 Hours');
    }
    return "";
  }

  export function printTimesForLibrary(lib: Library) {
    if (lib && lib.hours && lib.hours.rawDates) {
      const hours = <Hours> lib.hours;
      const today = <{hours:Array<{from: string, to: string}>|null, status:string|null}> Object.values(hours.rawDates)[0];
      if (today.hours) {
        return today.hours.map((h: { from: string; to: string; }) => html`
          ${h.from} - ${h.to}
        `);
      } 
      if (today.status) {
        return today.status.replace('24hours', '24 Hours');
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
  