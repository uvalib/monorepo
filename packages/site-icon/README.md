# \<site-icon>

This is a web component for displaying SVG icons. It follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

The `site-icon` component imports SVG icons dynamically from a specified path, based on the given `name` attribute. The SVG icons need to be TypeScript files exported as JavaScript string.

## Installation

'''bash
pnpm i site-icon
'''

## Usage

First, import the `site-icon` component.

'''html
<script type="module">
  import 'site-icon/site-icon.js';
</script>
'''

Then you can use the `site-icon` element in your HTML. To display an icon, add the `name` attribute with the value being the name of the icon.

'''html
<site-icon name="home"></site-icon>
'''

## Styling

You can use CSS variables to style the `site-icon` component.

'''css
site-icon {
  --site-icon-fill: black;
  --site-icon-width: 24px;
  --site-icon-height: 24px;
}
'''

## Testing with Web Test Runner

To execute a single test run:

'''bash
pnpm run test
'''

To run the tests in interactive watch mode run:

'''bash
pnpm run test:watch
'''

## Local Demo with `web-dev-server`

'''bash
pnpm start
'''

To run a local development server that serves the basic demo located in `demo/index.html`
