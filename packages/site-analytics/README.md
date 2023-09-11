# @uvalib/site-analytics

A web component for integrating site analytics using Matomo. This package also provides a mixin for easily dispatching analytics events.

## Features

- Easily integrate Matomo analytics into your web application.
- Dispatch custom analytics events using the provided mixin.
- Support for Single Page Applications (SPA).
- Customizable Matomo URL and site ID.

## Installation

```bash
pnpm add @uvalib/site-analytics
```

## Usage

### Web Component

```html
<script type="module">
  import '@uvalib/site-analytics/site-analytics.js';
</script>

<site-analytics matomoId="YOUR_MATOMO_ID"></site-analytics>
```

### Mixin

To use the `SiteAnalyticsMixin` in your LitElement-based component:

```typescript
import { SiteAnalyticsMixin } from '@uvalib/site-analytics';

class MyComponent extends SiteAnalyticsMixin(LitElement) {
  // Your component logic here
}
```

## Configuration

- `matomoURL`: The URL to your Matomo instance. Default is "https://analytics.lib.virginia.edu/".
- `matomoId`: The site ID for your Matomo instance.
- `spa`: A boolean indicating if the site is a Single Page Application. Default is `false`.
- `variables`: An object containing custom variables to be sent with analytics data.

## Development

### Linting and Formatting

Scan the project for linting and formatting errors:

```bash
pnpm run lint
```

Automatically fix linting and formatting errors:

```bash
pnpm run format
```

### Testing

Execute a single test run:

```bash
pnpm run test
```

Run the tests in interactive watch mode:

```bash
pnpm run test:watch
```

### Storybook

Run a local instance of Storybook:

```bash
pnpm run storybook
```

Build a production version of Storybook:

```bash
pnpm run storybook:build
```

### Local Development

To run a local development server:

```bash
pnpm start
```

## License

MIT
