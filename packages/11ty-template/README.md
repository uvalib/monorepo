# @uvalib/11ty-template

This is a template for creating a site using the 11ty static site generator with custom web components.

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

* You have installed the latest version of [Node.js](https://nodejs.org/en/download/).
* You have installed [pnpm](https://pnpm.io/installation) (optional but recommended for better performance and disk space utilization).

### Using @uvalib/11ty-template

To use @uvalib/11ty-template in your project, follow these steps:

1. Create a new project directory and navigate into it.

2. Initialize a new Node.js project with the following command:

```
pnpm init
```

3. Add @uvalib/11ty-template as a dependency:

```
pnpm add @uvalib/11ty-template
```

4. Update your `package.json` to include the start and build scripts:

```
{
  "scripts": {
    "start": "eleventy --serve --watch",
    "build": "eleventy"
  }
}
```

5. Create a `.eleventy.js` configuration file in your project root. Here's an example:

```
const templateConfig = require("@uvalib/11ty-template");

module.exports = function(eleventyConfig) {
  // Use the configuration from the template
  templateConfig(eleventyConfig);

  // Add your own additional configuration here

  // For example, add a passthrough copy for additional static assets
  eleventyConfig.addPassthroughCopy('src/my-assets');
}
```

6. Customize your site by adding your own `.html`, `.md`, `.liquid`, etc. files in a `src` directory (or any directory of your choice as specified in your `.eleventy.js` configuration).

7. To start the development server, use the following command:

```
pnpm start
```

8. To build your site for production, use the following command:

```
pnpm run build
```

The output will be in a `_site` directory (or any directory of your choice as specified in your `.eleventy.js` configuration).
