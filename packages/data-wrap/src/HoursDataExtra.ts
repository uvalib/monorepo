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

export function isOpenNow(hours: HoursData): Number | null {
    const currentDate = DateTime.now().setZone(TIMEZONE);
    const currentDateString = currentDate.toISODate();

    // Make sure currentDateString is not null before proceeding.
    if (!currentDateString) {
        console.error('Error fetching the current date in ISO format.');
        return null;
    }

    const currentDayHours = hours[currentDateString];

    // If there's no data for today, it's closed.
    if (!currentDayHours) {
        return null;
    }

    // If it's marked as 24 hours for today, it's open.
    if (currentDayHours.status === '24hours') {
        return currentDate.toMillis();
    }

    // If it's marked as open, we need to check the time ranges.
    if (currentDayHours.status === 'open') {
        for (let timeRange of currentDayHours.hours) {
            const fromTime = parseTime(currentDateString, timeRange.from);
            const toTime = parseTime(currentDateString, timeRange.to);

            // If the current time is within any of the open time ranges, it's open.
            if (fromTime && toTime && currentDate >= fromTime && currentDate <= toTime) {
                return currentDate.toMillis();
            }

            // Special case for midnight closure.
            if (toTime && timeRange.to === '12:00am' && currentDate <= toTime) {
                return currentDate.toMillis();
            }
        }
    }

    // If none of the above conditions are met, it's closed.
    return null;
}
