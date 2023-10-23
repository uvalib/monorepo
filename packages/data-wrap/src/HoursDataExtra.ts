import { DateTime } from 'luxon';

const TIMEZONE = 'America/New_York';

interface DayHours {
    status: string;
    hours: Array<{
        from: string;
        to: string;
    }>;
}

interface HoursData {
    [date: string]: DayHours;
}

export function parseTime(date: string, time: string): DateTime | null {
    if (time === '12:00am') {
        time = '00:00';
    }

    const timeFormats = ['h:mm a', 'hh:mm a', 'h:mma', 'hh:mma'];

    for (let format of timeFormats) {
        const parsedTime = DateTime.fromFormat(time, format, { zone: TIMEZONE });
        if (parsedTime.isValid) {
            return parsedTime.set({ year: DateTime.fromISO(date).year, month: DateTime.fromISO(date).month, day: DateTime.fromISO(date).day });
        }
    }

    console.error(`Error converting time format: ${time}`);
    return null;
}

export function getNextOpeningTime(hours: HoursData): DateTime | null {
    const currentDate = DateTime.now().setZone(TIMEZONE);

    for (let date in hours) {
        const dayHours = hours[date];

        if (DateTime.fromISO(date) < currentDate) {
            continue;
        }

        if (dayHours.status === '24hours') {
            continue;
        }

        if (dayHours.status === 'open' && dayHours.hours[0].from !== "12:00am") {
            return parseTime(date, dayHours.hours[0].from);
        }
    }

    return null;
}

export function getNextClosingTime(hours: HoursData): DateTime | null {
    const currentDate = DateTime.now().setZone(TIMEZONE);

    for (let date in hours) {
        const dayHours = hours[date];

        if (DateTime.fromISO(date) < currentDate) {
            continue;
        }

        if (dayHours.status === 'open') {
            const nextDateStr = DateTime.fromISO(date).plus({ days: 1 }).toISODate();
            
            if (!nextDateStr) {
                continue; // Skip this iteration if nextDateStr is null or undefined
            }

            const nextDayData = hours[nextDateStr];

            if (dayHours.hours[0].to === "12:00am") {
                if (nextDayData && nextDayData.status === 'open' && nextDayData.hours[0].from !== "12:00am") {
                    return DateTime.fromISO(date).endOf('day').setZone(TIMEZONE);
                } else if (!nextDayData || nextDayData.status !== '24hours') {
                    return DateTime.fromISO(date).endOf('day').setZone(TIMEZONE);
                }
            } else {
                return parseTime(date, dayHours.hours[0].to);
            }
        }

        if (dayHours.status === '24hours') {
            const nextDateStr = DateTime.fromISO(date).plus({ days: 1 }).toISODate();
            
            if (!nextDateStr) {
                continue; // Skip this iteration if nextDateStr is null or undefined
            }
            
            const nextDayData = hours[nextDateStr];

            if (!nextDayData || nextDayData.status !== '24hours') {
                return DateTime.fromISO(date).plus({ days: 1 }).setZone(TIMEZONE);
            }
        }
    }

    return null;
}
