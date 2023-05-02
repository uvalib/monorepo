# Drupal Module Loader

Drupal Module Loader is a custom Drupal module that allows you to use Library Web Components in your Drupal content without worrying about loading modules or scripts.

## Installation

1. Download and install the Drupal Module Loader from [https://github.com/uvalib/monorepo/raw/main/packages/drupal_module_loader/drupal_module_loader.tgz](https://github.com/uvalib/monorepo/raw/main/packages/drupal_module_loader/drupal_module_loader.tgz)
2. Set the version of the component CDN build that you want to use for modules that are loaded in the `Configuration -> Performance` menu.
3. Add custom element tags to your Drupal content. These tags should be in the format `<bento-box></bento-box>`.
4. Clear the cache to ensure that the custom elements are loaded from the CDN.

## License

This module is licensed under the MIT License. See the LICENSE file for details.
