# \<site-button>

`<site-button>` is a customizable button or link webcomponent following the [open-wc](https://github.com/open-wc/open-wc) recommendation.

This component offers a variety of styling options, including alternative styles, sizes, and states. It can act as a button or a link depending on the provided attributes.

## Installation

```
bash
pnpm i @uvalib/site-button
```

## Usage

```
html
<script type="module">
  import '@uvalib/site-button/site-button.js';
</script>

<site-button></site-button>
```

### Properties/Attributes

- `label`: Sets the button's label. Default is "Push me!".
- `alt`: If true, apply the alternative button style.
- `basic`, `subtle`, `outline`, `inverse`: Apply various button styles.
- `small`, `large`: Change the size of the button.
- `disabled`: If true, disable the button.
- `href`: If provided, the component will render as an anchor tag with the provided href.

### Examples

Here are some examples of how to use the `<site-button>` component:

```
html
<!-- A basic button -->
<site-button></site-button>

<!-- A large, alternate style button -->
<site-button large alt label="Large Button"></site-button>

<!-- A small, subtle button -->
<site-button small subtle label="Small Button"></site-button>

<!-- A disabled button -->
<site-button disabled label="Disabled Button"></site-button>

<!-- A button acting as a link -->
<site-button href="https://www.example.com" label="Go to Example"></site-button>
```

## Linting and formatting

To scan the project for linting and formatting errors, run

```
bash
pnpm run lint
```

To automatically fix linting and formatting errors, run

```
bash
pnpm run format
```

## Testing with Web Test Runner

To execute a single test run:

```
bash
pnpm run test
```

To run the tests in interactive watch mode run:

```
bash
pnpm run test:watch
```

## Demoing with Storybook

To run a local instance of Storybook for your component, run

```
bash
pnpm run storybook
```

To build a production version of Storybook, run

```
bash
pnpm run storybook:build
```

## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `web-dev-server`

```
bash
pnpm start
```

To run a local development server that serves the basic demo located in `demo/index.html`
