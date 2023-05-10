# \<site-spinner>

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Installation

```bash
pnpm add @uvalib/site-spinner
```

## Usage

```html
<script type="module">
  import '@uvalib/site-spinner/site-spinner.js';
</script>

<site-spinner></site-spinner>
```

### Properties

- `message` (String): Custom message to display above the spinner. Default is an empty string.
- `overlay` (Boolean): Determines if the spinner should be displayed with an overlay. Default is `false`.
- `book` (Boolean): Determines if the spinner should display a book animation instead of the bouncing animation. Default is `false`.
- `role` (String): The ARIA role for the spinner, set to "status" by default.
- `label` (String): The ARIA label for the spinner, set to the value of the `message` property or "loading" by default.

### Customization

You can customize the spinner appearance using CSS variables:

- `--site-spinner-color`: Sets the color of the spinner elements.
- `--site-spinner-size`: Sets the size of the spinner elements.
- `--site-spinner-overlay-background`: Sets the background color of the overlay when `overlay` property is set to `true`.


## Linting and formatting

To scan the project for linting and formatting errors, run

```bash
npm run lint
```

To automatically fix linting and formatting errors, run

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

To run a local instance of Storybook for your component, run

```bash
npm run storybook
```

To build a production version of Storybook, run

```bash
npm run storybook:build
```


## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `web-dev-server`

```bash
npm start
```

To run a local development server that serves the basic demo located in `demo/index.html`
