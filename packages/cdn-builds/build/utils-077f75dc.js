import { y } from './query-assigned-elements-cb6980e1.js';

function printTimes(day) {
    if (day.hours) {
        return day.hours.map((h) => y `
        ${h.from} - ${h.to}
      `);
    }
    if (day.status) {
        return day.status.replace('24hours', '24 Hours');
    }
    return "";
}
function printTimesForLibrary(lib) {
    if (lib && lib.hours && lib.hours.rawDates) {
        const hours = lib.hours;
        const today = Object.values(hours.rawDates)[0];
        if (today.hours) {
            return today.hours.map((h) => y `
          ${h.from} - ${h.to}
        `);
        }
        if (today.status) {
            return today.status.replace('24hours', '24 Hours');
        }
    }
    return "";
}
function stringDateFormat(dateString, format) {
    const dateObj = new Date(dateString);
    const formats = [
        { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' },
        { month: 'short', day: 'numeric', timeZone: 'UTC' },
        { weekday: 'long', timeZone: 'UTC' }
    ];
    return dateObj.toLocaleDateString('en-US', formats[format]);
}
function sortLibraries(libraries) {
    return libraries.sort((a, b) => ((a.title ? a.title : '') > (b.title ? b.title : '')) ? 1 : -1);
}

export { sortLibraries as a, printTimesForLibrary as b, printTimes as p, stringDateFormat as s };
