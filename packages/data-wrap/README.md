# EventsData Class Usage

The `EventsData` class is part of the `data-wrap` package and is used to fetch event data from the LibCal API. It allows you to retrieve and work with event information, providing options to customize your requests with various parameters.

## Installation

You can install the `data-wrap` package using npm:

***
npm install data-wrap
***

## Importing EventsData

To use the `EventsData` class in your project, import it as follows:

***
import { EventsData } from 'data-wrap';
***

## Constructor Parameters

When creating an instance of `EventsData`, you can provide an optional initialization object to configure your data fetching needs. The available parameters are:

- `calId` (string): The calendar ID to fetch events from. Defaults to `'4299'` if not provided.
- `lid` (string): The LibCal system ID (also referred to as `iid`). Defaults to `'863'` if not provided.
- `limit` (number): The maximum number of events to fetch. Defaults to `100` if not provided.
- `category` (string): The category ID to filter events by.
- `query` (string): A search query to filter events.

## Methods

### fetchData()

Fetches the event data from the LibCal API based on the configured parameters. Returns a promise that resolves to an object containing:

- `items`: An array of `Event` objects.
- `meta`: Metadata about the fetched data (e.g., `totalResults`).

## Example Usage

Below is an example of how to use the `EventsData` class to fetch and display events:

***
import { EventsData } from 'data-wrap';

const eventsData = new EventsData({
  calId: '4299',        // Optional: Calendar ID
  lid: '863',           // Optional: LibCal system ID
  limit: 100,           // Optional: Number of events to fetch
  category: '33496',    // Optional: Category ID to filter events
  query: 'workshop',    // Optional: Search query
});

eventsData.fetchData().then(results => {
  console.log(results);
  // Process the results as needed
  results.items.forEach(event => {
    console.log(`Title: ${event.title}`);
    console.log(`Start Time: ${new Date(event.start).toLocaleString()}`);
    // Additional processing...
  });
}).catch(error => {
  console.error('Error fetching events:', error);
});
***

## HTML Example

You can also use the `EventsData` class in an HTML file with a script module:

***
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>EventsData Example</title>
</head>
<body>
  <h2>Events List</h2>
  <ul id="events"></ul>

  <script type="module">
    import { EventsData } from 'data-wrap';

    const eventsData = new EventsData({
      calId: '4299',
      category: '33496',
    });

    eventsData.fetchData().then(results => {
      const eventsList = document.getElementById('events');
      results.items.forEach(event => {
        const listItem = document.createElement('li');
        listItem.textContent = event.title;
        eventsList.appendChild(listItem);
      });
    }).catch(error => {
      console.error('Error fetching events:', error);
    });
  </script>
</body>
</html>
***

## Notes

- Ensure that you have network access to the LibCal API and the necessary permissions to fetch data.
- The API key used in the `EventsData` class is hardcoded. If you need to use a different API key, you should modify the class accordingly.

## API Reference

### EventsData Class

#### Properties

- `category?: string`
- `calId: string` (default: `'4299'`)
- `lid: string` (default: `'863'`)
- `limit: number` (default: `100`)
- `query?: string`

#### Methods

- `fetchData(): Promise<{ items: Event[], meta: any }>`

### Event Object

An `Event` object returned in the `items` array has the following properties:

- `id: number`
- `title: string`
- `allday?: boolean`
- `start?: number` (timestamp)
- `end?: number` (timestamp)
- `description?: string`
- `link?: string`
- `location?: string`
- `campusLocation?: string`
- `category?: string`
- `owner?: string`
- `calendar?: { name: string; url: string }`
- `registration?: boolean`
- `registrationOpen?: boolean`
- `registrationClosed?: boolean`
- `seats?: number`
- `seatsTaken?: number`
- `physicalSeats?: number`
- `physicalSeatsTaken?: number`
- `onlineSeats?: number`
- `onlineSeatsTaken?: number`
- `waitList?: boolean`
- `image?: string`
- `futureDates?: { id: number; start: number }[]`
- `registrationCost?: number`
- `moreInfo?: string`
- `setupTime?: number`
- `teardownTime?: number`

## Contributing

If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the project's GitHub repository.
