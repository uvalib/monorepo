import { G as GeneralSearchResult } from './GeneralSearchResult-835c7dd8.js';
import { G as GeneralData } from './ArticlesData-9f3aa85f.js';

function requiredArgs(required, args) {
  if (args.length < required) {
    throw new TypeError(required + ' argument' + (required > 1 ? 's' : '') + ' required, but only ' + args.length + ' present');
  }
}

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
/**
 * @name toDate
 * @category Common Helpers
 * @summary Convert the given argument to an instance of Date.
 *
 * @description
 * Convert the given argument to an instance of Date.
 *
 * If the argument is an instance of Date, the function returns its clone.
 *
 * If the argument is a number, it is treated as a timestamp.
 *
 * If the argument is none of the above, the function returns Invalid Date.
 *
 * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
 *
 * @param {Date|Number} argument - the value to convert
 * @returns {Date} the parsed date in the local time zone
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // Clone the date:
 * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
 * //=> Tue Feb 11 2014 11:30:30
 *
 * @example
 * // Convert the timestamp to date:
 * const result = toDate(1392098430000)
 * //=> Tue Feb 11 2014 11:30:30
 */

function toDate(argument) {
  requiredArgs(1, arguments);
  var argStr = Object.prototype.toString.call(argument); // Clone the date

  if (argument instanceof Date || _typeof(argument) === 'object' && argStr === '[object Date]') {
    // Prevent the date to lose the milliseconds when passed to new Date() in IE10
    return new Date(argument.getTime());
  } else if (typeof argument === 'number' || argStr === '[object Number]') {
    return new Date(argument);
  } else {
    if ((typeof argument === 'string' || argStr === '[object String]') && typeof console !== 'undefined') {
      // eslint-disable-next-line no-console
      console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#string-arguments"); // eslint-disable-next-line no-console

      console.warn(new Error().stack);
    }

    return new Date(NaN);
  }
}

/**
 * @name parseJSON
 * @category Common Helpers
 * @summary Parse a JSON date string
 *
 * @description
 * Converts a complete ISO date string in UTC time, the typical format for transmitting
 * a date in JSON, to a JavaScript `Date` instance.
 *
 * This is a minimal implementation for converting dates retrieved from a JSON API to
 * a `Date` instance which can be used with other functions in the `date-fns` library.
 * The following formats are supported:
 *
 * - `2000-03-15T05:20:10.123Z`: The output of `.toISOString()` and `JSON.stringify(new Date())`
 * - `2000-03-15T05:20:10Z`: Without milliseconds
 * - `2000-03-15T05:20:10+00:00`: With a zero offset, the default JSON encoded format in some other languages
 * - `2000-03-15T05:20:10+05:45`: With a positive or negative offset, the default JSON encoded format in some other languages
 * - `2000-03-15T05:20:10+0000`: With a zero offset without a colon
 * - `2000-03-15T05:20:10`: Without a trailing 'Z' symbol
 * - `2000-03-15T05:20:10.1234567`: Up to 7 digits in milliseconds field. Only first 3 are taken into account since JS does not allow fractional milliseconds
 * - `2000-03-15 05:20:10`: With a space instead of a 'T' separator for APIs returning a SQL date without reformatting
 *
 * For convenience and ease of use these other input types are also supported
 * via [toDate]{@link https://date-fns.org/docs/toDate}:
 *
 * - A `Date` instance will be cloned
 * - A `number` will be treated as a timestamp
 *
 * Any other input type or invalid date strings will return an `Invalid Date`.
 *
 * @param {String|Number|Date} argument A fully formed ISO8601 date string to convert
 * @returns {Date} the parsed date in the local time zone
 * @throws {TypeError} 1 argument required
 */

function parseJSON(argument) {
  requiredArgs(1, arguments);

  if (typeof argument === 'string') {
    var parts = argument.match(/(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})(?:\.(\d{0,7}))?(?:Z|(.)(\d{2}):?(\d{2})?)?/);

    if (parts) {
      // Group 8 matches the sign
      return new Date(Date.UTC(+parts[1], +parts[2] - 1, +parts[3], +parts[4] - (+parts[9] || 0) * (parts[8] == '-' ? -1 : 1), +parts[5] - (+parts[10] || 0) * (parts[8] == '-' ? -1 : 1), +parts[6], +((parts[7] || '0') + '00').substring(0, 3)));
    }

    return new Date(NaN);
  }

  return toDate(argument);
}

/* eslint-disable camelcase */
class Event extends GeneralSearchResult {
    constructor(init) {
        super(init);
    }
}
function parseEvent(event) {
    return {
        id: event.id,
        title: event.title,
        allday: event.allday,
        start: event.start ? parseJSON(event.start).getTime() : null,
        end: event.end ? parseJSON(event.end).getTime() : null,
        description: event.description,
        link: event.url.public,
        location: event.location.name,
        campusLocation: event.campus,
        category: event.category.name,
        owner: event.owner.name,
        calendar: { name: event.calendar.name, url: event.calendar.public },
        registration: event.registration,
        registrationOpen: event.has_registration_opened,
        registrationClosed: event.has_registration_closed,
        seats: event.seats,
        seatsTaken: event.seats_taken,
        physicalSeats: event.physical_seats,
        physicalSeatsTaken: event.physical_seats_taken,
        onlineSeats: event.online_seats,
        onlineSeatsTaken: event.online_seats_taken,
        waitList: event.wait_list,
        image: event.featured_image,
        futureDates: event.future_dates.map((fe) => ({
            id: fe.event_id,
            start: parseJSON(fe.start).getTime(),
        })),
        registrationCost: event.registration_cost,
        moreInfo: event.more_info,
        setupTime: event.setup_time,
        teardownTime: event.teardown_time,
    };
}

/* eslint-disable camelcase */
const eventsEndpointURL = 'https://api2.libcal.com/1.0/events?key=c45a1428103ed000ba4025e9970edf54&iid=863&cal_id=4299&limit=600&campus=&category=&days=365';
const eventsSearchEndpointURL = 'https://api2.libcal.com/1.0/event_search?key=c45a1428103ed000ba4025e9970edf54&iid=863&cal_id=4299&limit=600&campus=&category=&days=365';
class EventsData extends GeneralData {
    constructor(init) {
        super();
        this.items = [];
        Object.assign(this, init);
    }
    endpointURL() {
        let params = this.query ? `&search=${this.query}` : '';
        params += this.limit ? `&limit=${this.limit}` : '';
        params += this.category ? `&category=${this.category}` : '';
        return this.query
            ? `${eventsSearchEndpointURL}${params}`
            : `${eventsEndpointURL}${params}`;
    }
    async fetchData() {
        return this.fetchWithRetry(this.endpointURL())
            .then((r) => r.json())
            .then((data) => {
            this._parseResults(data);
            return { items: this.items, meta: this.meta };
        });
    }
    _parseResults(d) {
        // Setup Library results
        this.items = d.events.map(parseEvent);
        this.meta.totalResults = d.events.length;
    }
}

export { EventsData as E, Event as a };
