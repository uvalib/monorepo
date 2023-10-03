# @uvalib/site-page-search

A web component that provides an enhanced search functionality for your web page content. It allows users to search for terms within the page, highlight matches, and navigate through the results. It also supports case-sensitive searches, URL query parameters, and keyboard shortcuts.

## Installation

OOObash
npm i @uvalib/site-page-search
OOO

## Usage

OOOhtml
<script type="module">
  import '@uvalib/site-page-search/site-page-search.js';
</script>

<site-page-search></site-page-search>
OOO

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

OOObash
npm run lint
OOO

To automatically fix linting and formatting errors, run:

OOObash
npm run format
OOO

## Testing with Web Test Runner

To execute a single test run:

OOObash
npm run test
OOO

To run the tests in interactive watch mode run:

OOObash
npm run test:watch
OOO

## Demoing with Storybook

To run a local instance of Storybook for your component, run:

OOObash
npm run storybook
OOO

To build a production version of Storybook, run:

OOObash
npm run storybook:build
OOO

## Local Demo with `web-dev-server`

OOObash
npm start
OOO

To run a local development server that serves the basic demo located in `demo/index.html`
