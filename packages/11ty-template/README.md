# UVA Library 11ty Template

This 11ty template serves as a starting point for creating new static sites within the University of Virginia Library. The template includes the proper header/footer, styles, filters, and best practices for the institution. Projects using this template as a dependency can overwrite any of the templates from the template project to make their site unique.

## Requirements

- Node.js 14.x or later
- pnpm

## Getting Started

1. Create a new directory for your project:

    ```bash
    mkdir my-new-site
    cd my-new-site
    ```

    Replace `my-new-site` with the desired name for your new project.

2. Initialize a new `package.json` file:

    ```bash
    pnpm init
    ```

3. Add the 11ty template as a dependency:

    Replace `@uvalib/11ty-template` with the correct package name and version for your template.

    ```bash
    pnpm add @uvalib/11ty-template
    ```

4. Create a `.eleventy.js` (or `.eleventy.ts` if you prefer TypeScript) file in your project's root directory with the following content:

    ```javascript
    const templateConfig = require('@uvalib/11ty-template');

    module.exports = function (eleventyConfig) {
      templateConfig(eleventyConfig);

      // Add your custom configuration, filters, or plugins here

      return {
        dir: {
          input: 'src',
          output: '_site',
        },
      };
    };
    ```

5. Create the `src` directory with the following structure:

    ```
    src/
      |_ layouts/
      |_ pages/
      |_ static/
    ```

6. Add your content, templates, and static assets to the `src` directory. Make sure to extend or include the layouts from the template where necessary.

7. Run the development server:

    ```bash
    pnpm start
    ```

    Your site should now be running at `http://localhost:8080`. Changes you make to the source files will automatically trigger a rebuild, and the browser will refresh the page.

## Building for Production

To build the site for production, run:

    ```bash
    pnpm build
    ```

    The built files will be placed in the `_site` directory.

## Updating the Template

To update the template to a newer version, simply update the `@uvalib/11ty-template` dependency in your `package.json` file and run the installation command again:

    ```bash
    pnpm update @uvalib/11ty-template
    ```

This will ensure that your project is using the latest version of the template, which includes any updates or fixes made to it.
