# @uvalib/site-page-search

A web component that provides an enhanced search functionality for your web page content. It allows users to search for terms within the page, highlight matches, and navigate through the results. It also supports case-sensitive searches, URL query parameters, and keyboard shortcuts.

## Installation

```bash
npm i @uvalib/site-page-search
```

## Usage

```html
<script type="module">
  import '@uvalib/site-page-search/site-page-search.js';
</script>

<site-page-search></site-page-search>
```

### Attributes/Properties

- `case-sensitive`: A boolean attribute that enables case-sensitive search.
- `query`: A string that sets/updates the search query.
- `query-string-param`: A string that specifies the GET query string parameter from the URL to be used as the search query.
- `disabled`: A boolean attribute that hides the search box and removes any marks in the light DOM.

### Keyboard Shortcuts

- `Cmd/Ctrl + F`: Activate the search input.
- `Enter`: Navigate to the next search result.
- `Shift + Enter`: Navigate to the previous search result.

## Linting and formatting

To scan the project for linting and formatting errors, run:

```bash
npm run lint
```

To automatically fix linting and formatting errors, run:

```bash
npm run format
```

## Testing with Web Test Runner

To execute a single test run:

```bash
npm run test
```

To run the tests in interactive watch mode run:

```bash
npm run test:watch
```

## Demoing with Storybook

To run a local instance of Storybook for your component, run:

```bash
npm run storybook
```

To build a production version of Storybook, run:

```bash
npm run storybook:build
```

## Local Demo with `web-dev-server`

```bash
npm start
```

To run a local development server that serves the basic demo located in `demo/index.html`
