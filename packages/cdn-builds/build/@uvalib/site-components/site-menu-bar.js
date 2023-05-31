import { o, i, _ as __decorate, e, s, x } from '../../query-assigned-elements-66a11629.js';

/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Dummy custom element used for collecting
 * development time usage statistics.
 *
 * @private
 */
class Lumo extends HTMLElement {
  static get version() {
    return '24.0.0';
  }
}

customElements.define('vaadin-lumo-styles', Lumo);

/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
/**
 * @polymerMixin
 */
const ThemePropertyMixin = (superClass) =>
  class VaadinThemePropertyMixin extends superClass {
    static get properties() {
      return {
        /**
         * Helper property with theme attribute value facilitating propagation
         * in shadow DOM.
         *
         * Enables the component implementation to propagate the `theme`
         * attribute value to the sub-components in Shadow DOM by binding
         * the sub-component's "theme" attribute to the `theme` property of
         * the host.
         *
         * **NOTE:** Extending the mixin only provides the property for binding,
         * and does not make the propagation alone.
         *
         * See [Styling Components: Sub-components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components/#sub-components).
         * page for more information.
         *
         * @protected
         */
        _theme: {
          type: String,
          readOnly: true,
        },
      };
    }

    static get observedAttributes() {
      return [...super.observedAttributes, 'theme'];
    }

    /** @protected */
    attributeChangedCallback(name, oldValue, newValue) {
      super.attributeChangedCallback(name, oldValue, newValue);

      if (name === 'theme') {
        this._set_theme(newValue);
      }
    }
  };

/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @typedef {Object} Theme
 * @property {string} themeFor
 * @property {CSSResult[]} styles
 * @property {string | string[]} [include]
 * @property {string} [moduleId]
 *
 * @typedef {CSSResult[] | CSSResult} CSSResultGroup
 */

/**
 * @type {Theme[]}
 */
const themeRegistry = [];

/**
 * Check if the custom element type has themes applied.
 * @param {Function} elementClass
 * @returns {boolean}
 */
function classHasThemes(elementClass) {
  return elementClass && Object.prototype.hasOwnProperty.call(elementClass, '__themes');
}

/**
 * Check if the custom element type has themes applied.
 * @param {string} tagName
 * @returns {boolean}
 */
function hasThemes(tagName) {
  return classHasThemes(customElements.get(tagName));
}

/**
 * Flattens the styles into a single array of styles.
 * @param {CSSResultGroup} styles
 * @param {CSSResult[]} result
 * @returns {CSSResult[]}
 */
function flattenStyles(styles = []) {
  return [styles].flat(Infinity).filter((style) => {
    if (style instanceof o) {
      return true;
    }
    console.warn('An item in styles is not of type CSSResult. Use `unsafeCSS` or `css`.');
    return false;
  });
}

/**
 * Registers CSS styles for a component type. Make sure to register the styles before
 * the first instance of a component of the type is attached to DOM.
 *
 * @param {string} themeFor The local/tag name of the component type to register the styles for
 * @param {CSSResultGroup} styles The CSS style rules to be registered for the component type
 * matching themeFor and included in the local scope of each component instance
 * @param {{moduleId?: string, include?: string | string[]}} options Additional options
 * @return {void}
 */
function registerStyles(themeFor, styles, options = {}) {
  if (themeFor) {
    if (hasThemes(themeFor)) {
      console.warn(`The custom element definition for "${themeFor}"
      was finalized before a style module was registered.
      Make sure to add component specific style modules before
      importing the corresponding custom element.`);
    }
  }

  styles = flattenStyles(styles);

  if (window.Vaadin && window.Vaadin.styleModules) {
    window.Vaadin.styleModules.registerStyles(themeFor, styles, options);
  } else {
    themeRegistry.push({
      themeFor,
      styles,
      include: options.include,
      moduleId: options.moduleId,
    });
  }
}

/**
 * Returns all registered themes. By default the themeRegistry is returned as is.
 * In case the style-modules adapter is imported, the themes are obtained from there instead
 * @returns {Theme[]}
 */
function getAllThemes() {
  if (window.Vaadin && window.Vaadin.styleModules) {
    return window.Vaadin.styleModules.getAllThemes();
  }
  return themeRegistry;
}

/**
 * Returns true if the themeFor string matches the tag name
 * @param {string} themeFor
 * @param {string} tagName
 * @returns {boolean}
 */
function matchesThemeFor(themeFor, tagName) {
  return (themeFor || '').split(' ').some((themeForToken) => {
    return new RegExp(`^${themeForToken.split('*').join('.*')}$`, 'u').test(tagName);
  });
}

/**
 * Maps the moduleName to an include priority number which is used for
 * determining the order in which styles are applied.
 * @param {string} moduleName
 * @returns {number}
 */
function getIncludePriority(moduleName = '') {
  let includePriority = 0;
  if (moduleName.startsWith('lumo-') || moduleName.startsWith('material-')) {
    includePriority = 1;
  } else if (moduleName.startsWith('vaadin-')) {
    includePriority = 2;
  }
  return includePriority;
}

/**
 * Gets an array of CSSResults matching the include property of the theme.
 * @param {Theme} theme
 * @returns {CSSResult[]}
 */
function getIncludedStyles(theme) {
  const includedStyles = [];
  if (theme.include) {
    [].concat(theme.include).forEach((includeModuleId) => {
      const includedTheme = getAllThemes().find((s) => s.moduleId === includeModuleId);
      if (includedTheme) {
        includedStyles.push(...getIncludedStyles(includedTheme), ...includedTheme.styles);
      } else {
        console.warn(`Included moduleId ${includeModuleId} not found in style registry`);
      }
    }, theme.styles);
  }
  return includedStyles;
}

/**
 * Includes the styles to the template.
 * @param {CSSResult[]} styles
 * @param {HTMLTemplateElement} template
 */
function addStylesToTemplate(styles, template) {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = styles.map((style) => style.cssText).join('\n');
  template.content.appendChild(styleEl);
}

/**
 * Returns an array of themes that should be used for styling a component matching
 * the tag name. The array is sorted by the include order.
 * @param {string} tagName
 * @returns {Theme[]}
 */
function getThemes(tagName) {
  const defaultModuleName = `${tagName}-default-theme`;

  const themes = getAllThemes()
    // Filter by matching themeFor properties
    .filter((theme) => theme.moduleId !== defaultModuleName && matchesThemeFor(theme.themeFor, tagName))
    .map((theme) => ({
      ...theme,
      // Prepend styles from included themes
      styles: [...getIncludedStyles(theme), ...theme.styles],
      // Map moduleId to includePriority
      includePriority: getIncludePriority(theme.moduleId),
    }))
    // Sort by includePriority
    .sort((themeA, themeB) => themeB.includePriority - themeA.includePriority);

  if (themes.length > 0) {
    return themes;
  }
  // No theme modules found, return the default module if it exists
  return getAllThemes().filter((theme) => theme.moduleId === defaultModuleName);
}

/**
 * @polymerMixin
 * @mixes ThemePropertyMixin
 */
const ThemableMixin = (superClass) =>
  class VaadinThemableMixin extends ThemePropertyMixin(superClass) {
    /**
     * Covers PolymerElement based component styling
     * @protected
     */
    static finalize() {
      super.finalize();

      // Make sure not to run the logic intended for PolymerElement when LitElement is used.
      if (this.elementStyles) {
        return;
      }

      const template = this.prototype._template;
      if (!template || classHasThemes(this)) {
        return;
      }

      addStylesToTemplate(this.getStylesForThis(), template);
    }

    /**
     * Covers LitElement based component styling
     *
     * @protected
     */
    static finalizeStyles(styles) {
      // The "styles" object originates from the "static get styles()" function of
      // a LitElement based component. The theme styles are added after it
      // so that they can override the component styles.
      const themeStyles = this.getStylesForThis();
      return styles ? [...super.finalizeStyles(styles), ...themeStyles] : themeStyles;
    }

    /**
     * Get styles for the component type
     *
     * @private
     */
    static getStylesForThis() {
      const parent = Object.getPrototypeOf(this.prototype);
      const inheritedThemes = (parent ? parent.constructor.__themes : []) || [];
      this.__themes = [...inheritedThemes, ...getThemes(this.is)];
      const themeStyles = this.__themes.flatMap((theme) => theme.styles);
      // Remove duplicates
      return themeStyles.filter((style, index) => index === themeStyles.lastIndexOf(style));
    }
  };

/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const colorBase = i`
  :host {
    /* Base (background) */
    --lumo-base-color: #fff;

    /* Tint */
    --lumo-tint-5pct: hsla(0, 0%, 100%, 0.3);
    --lumo-tint-10pct: hsla(0, 0%, 100%, 0.37);
    --lumo-tint-20pct: hsla(0, 0%, 100%, 0.44);
    --lumo-tint-30pct: hsla(0, 0%, 100%, 0.5);
    --lumo-tint-40pct: hsla(0, 0%, 100%, 0.57);
    --lumo-tint-50pct: hsla(0, 0%, 100%, 0.64);
    --lumo-tint-60pct: hsla(0, 0%, 100%, 0.7);
    --lumo-tint-70pct: hsla(0, 0%, 100%, 0.77);
    --lumo-tint-80pct: hsla(0, 0%, 100%, 0.84);
    --lumo-tint-90pct: hsla(0, 0%, 100%, 0.9);
    --lumo-tint: #fff;

    /* Shade */
    --lumo-shade-5pct: hsla(214, 61%, 25%, 0.05);
    --lumo-shade-10pct: hsla(214, 57%, 24%, 0.1);
    --lumo-shade-20pct: hsla(214, 53%, 23%, 0.16);
    --lumo-shade-30pct: hsla(214, 50%, 22%, 0.26);
    --lumo-shade-40pct: hsla(214, 47%, 21%, 0.38);
    --lumo-shade-50pct: hsla(214, 45%, 20%, 0.52);
    --lumo-shade-60pct: hsla(214, 43%, 19%, 0.6);
    --lumo-shade-70pct: hsla(214, 42%, 18%, 0.69);
    --lumo-shade-80pct: hsla(214, 41%, 17%, 0.83);
    --lumo-shade-90pct: hsla(214, 40%, 16%, 0.94);
    --lumo-shade: hsl(214, 35%, 15%);

    /* Contrast */
    --lumo-contrast-5pct: var(--lumo-shade-5pct);
    --lumo-contrast-10pct: var(--lumo-shade-10pct);
    --lumo-contrast-20pct: var(--lumo-shade-20pct);
    --lumo-contrast-30pct: var(--lumo-shade-30pct);
    --lumo-contrast-40pct: var(--lumo-shade-40pct);
    --lumo-contrast-50pct: var(--lumo-shade-50pct);
    --lumo-contrast-60pct: var(--lumo-shade-60pct);
    --lumo-contrast-70pct: var(--lumo-shade-70pct);
    --lumo-contrast-80pct: var(--lumo-shade-80pct);
    --lumo-contrast-90pct: var(--lumo-shade-90pct);
    --lumo-contrast: var(--lumo-shade);

    /* Text */
    --lumo-header-text-color: var(--lumo-contrast);
    --lumo-body-text-color: var(--lumo-contrast-90pct);
    --lumo-secondary-text-color: var(--lumo-contrast-70pct);
    --lumo-tertiary-text-color: var(--lumo-contrast-50pct);
    --lumo-disabled-text-color: var(--lumo-contrast-30pct);

    /* Primary */
    --lumo-primary-color: hsl(214, 100%, 48%);
    --lumo-primary-color-50pct: hsla(214, 100%, 49%, 0.76);
    --lumo-primary-color-10pct: hsla(214, 100%, 60%, 0.13);
    --lumo-primary-text-color: hsl(214, 100%, 43%);
    --lumo-primary-contrast-color: #fff;

    /* Error */
    --lumo-error-color: hsl(3, 85%, 48%);
    --lumo-error-color-50pct: hsla(3, 85%, 49%, 0.5);
    --lumo-error-color-10pct: hsla(3, 85%, 49%, 0.1);
    --lumo-error-text-color: hsl(3, 89%, 42%);
    --lumo-error-contrast-color: #fff;

    /* Success */
    --lumo-success-color: hsl(145, 72%, 30%);
    --lumo-success-color-50pct: hsla(145, 72%, 31%, 0.5);
    --lumo-success-color-10pct: hsla(145, 72%, 31%, 0.1);
    --lumo-success-text-color: hsl(145, 85%, 25%);
    --lumo-success-contrast-color: #fff;
  }
`;

const $tpl$4 = document.createElement('template');
$tpl$4.innerHTML = `<style>${colorBase.toString().replace(':host', 'html')}</style>`;
document.head.appendChild($tpl$4.content);

const color = i`
  [theme~='dark'] {
    /* Base (background) */
    --lumo-base-color: hsl(214, 35%, 21%);

    /* Tint */
    --lumo-tint-5pct: hsla(214, 65%, 85%, 0.06);
    --lumo-tint-10pct: hsla(214, 60%, 80%, 0.14);
    --lumo-tint-20pct: hsla(214, 64%, 82%, 0.23);
    --lumo-tint-30pct: hsla(214, 69%, 84%, 0.32);
    --lumo-tint-40pct: hsla(214, 73%, 86%, 0.41);
    --lumo-tint-50pct: hsla(214, 78%, 88%, 0.5);
    --lumo-tint-60pct: hsla(214, 82%, 90%, 0.58);
    --lumo-tint-70pct: hsla(214, 87%, 92%, 0.69);
    --lumo-tint-80pct: hsla(214, 91%, 94%, 0.8);
    --lumo-tint-90pct: hsla(214, 96%, 96%, 0.9);
    --lumo-tint: hsl(214, 100%, 98%);

    /* Shade */
    --lumo-shade-5pct: hsla(214, 0%, 0%, 0.07);
    --lumo-shade-10pct: hsla(214, 4%, 2%, 0.15);
    --lumo-shade-20pct: hsla(214, 8%, 4%, 0.23);
    --lumo-shade-30pct: hsla(214, 12%, 6%, 0.32);
    --lumo-shade-40pct: hsla(214, 16%, 8%, 0.41);
    --lumo-shade-50pct: hsla(214, 20%, 10%, 0.5);
    --lumo-shade-60pct: hsla(214, 24%, 12%, 0.6);
    --lumo-shade-70pct: hsla(214, 28%, 13%, 0.7);
    --lumo-shade-80pct: hsla(214, 32%, 13%, 0.8);
    --lumo-shade-90pct: hsla(214, 33%, 13%, 0.9);
    --lumo-shade: hsl(214, 33%, 13%);

    /* Contrast */
    --lumo-contrast-5pct: var(--lumo-tint-5pct);
    --lumo-contrast-10pct: var(--lumo-tint-10pct);
    --lumo-contrast-20pct: var(--lumo-tint-20pct);
    --lumo-contrast-30pct: var(--lumo-tint-30pct);
    --lumo-contrast-40pct: var(--lumo-tint-40pct);
    --lumo-contrast-50pct: var(--lumo-tint-50pct);
    --lumo-contrast-60pct: var(--lumo-tint-60pct);
    --lumo-contrast-70pct: var(--lumo-tint-70pct);
    --lumo-contrast-80pct: var(--lumo-tint-80pct);
    --lumo-contrast-90pct: var(--lumo-tint-90pct);
    --lumo-contrast: var(--lumo-tint);

    /* Text */
    --lumo-header-text-color: var(--lumo-contrast);
    --lumo-body-text-color: var(--lumo-contrast-90pct);
    --lumo-secondary-text-color: var(--lumo-contrast-70pct);
    --lumo-tertiary-text-color: var(--lumo-contrast-50pct);
    --lumo-disabled-text-color: var(--lumo-contrast-30pct);

    /* Primary */
    --lumo-primary-color: hsl(214, 90%, 48%);
    --lumo-primary-color-50pct: hsla(214, 90%, 70%, 0.69);
    --lumo-primary-color-10pct: hsla(214, 90%, 55%, 0.13);
    --lumo-primary-text-color: hsl(214, 90%, 77%);
    --lumo-primary-contrast-color: #fff;

    /* Error */
    --lumo-error-color: hsl(3, 79%, 49%);
    --lumo-error-color-50pct: hsla(3, 75%, 62%, 0.5);
    --lumo-error-color-10pct: hsla(3, 75%, 62%, 0.14);
    --lumo-error-text-color: hsl(3, 100%, 80%);

    /* Success */
    --lumo-success-color: hsl(145, 72%, 30%);
    --lumo-success-color-50pct: hsla(145, 92%, 51%, 0.5);
    --lumo-success-color-10pct: hsla(145, 92%, 51%, 0.1);
    --lumo-success-text-color: hsl(145, 85%, 46%);
  }

  html {
    color: var(--lumo-body-text-color);
    background-color: var(--lumo-base-color);
    color-scheme: light;
  }

  [theme~='dark'] {
    color: var(--lumo-body-text-color);
    background-color: var(--lumo-base-color);
    color-scheme: dark;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: var(--lumo-header-text-color);
  }

  a:where(:any-link) {
    color: var(--lumo-primary-text-color);
  }

  a:not(:any-link) {
    color: var(--lumo-disabled-text-color);
  }

  blockquote {
    color: var(--lumo-secondary-text-color);
  }

  code,
  pre {
    background-color: var(--lumo-contrast-10pct);
    border-radius: var(--lumo-border-radius-m);
  }
`;

registerStyles('', color, { moduleId: 'lumo-color' });

/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const sizing = i`
  :host {
    --lumo-size-xs: 1.625rem;
    --lumo-size-s: 1.875rem;
    --lumo-size-m: 2.25rem;
    --lumo-size-l: 2.75rem;
    --lumo-size-xl: 3.5rem;

    /* Icons */
    --lumo-icon-size-s: 1.25em;
    --lumo-icon-size-m: 1.5em;
    --lumo-icon-size-l: 2.25em;
    /* For backwards compatibility */
    --lumo-icon-size: var(--lumo-icon-size-m);
  }
`;

const $tpl$3 = document.createElement('template');
$tpl$3.innerHTML = `<style>${sizing.toString().replace(':host', 'html')}</style>`;
document.head.appendChild($tpl$3.content);

/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const spacing = i`
  :host {
    /* Square */
    --lumo-space-xs: 0.25rem;
    --lumo-space-s: 0.5rem;
    --lumo-space-m: 1rem;
    --lumo-space-l: 1.5rem;
    --lumo-space-xl: 2.5rem;

    /* Wide */
    --lumo-space-wide-xs: calc(var(--lumo-space-xs) / 2) var(--lumo-space-xs);
    --lumo-space-wide-s: calc(var(--lumo-space-s) / 2) var(--lumo-space-s);
    --lumo-space-wide-m: calc(var(--lumo-space-m) / 2) var(--lumo-space-m);
    --lumo-space-wide-l: calc(var(--lumo-space-l) / 2) var(--lumo-space-l);
    --lumo-space-wide-xl: calc(var(--lumo-space-xl) / 2) var(--lumo-space-xl);

    /* Tall */
    --lumo-space-tall-xs: var(--lumo-space-xs) calc(var(--lumo-space-xs) / 2);
    --lumo-space-tall-s: var(--lumo-space-s) calc(var(--lumo-space-s) / 2);
    --lumo-space-tall-m: var(--lumo-space-m) calc(var(--lumo-space-m) / 2);
    --lumo-space-tall-l: var(--lumo-space-l) calc(var(--lumo-space-l) / 2);
    --lumo-space-tall-xl: var(--lumo-space-xl) calc(var(--lumo-space-xl) / 2);
  }
`;

const $tpl$2 = document.createElement('template');
$tpl$2.innerHTML = `<style>${spacing.toString().replace(':host', 'html')}</style>`;
document.head.appendChild($tpl$2.content);

/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const style = i`
  :host {
    /* Border radius */
    --lumo-border-radius-s: 0.25em; /* Checkbox, badge, date-picker year indicator, etc */
    --lumo-border-radius-m: var(--lumo-border-radius, 0.25em); /* Button, text field, menu overlay, etc */
    --lumo-border-radius-l: 0.5em; /* Dialog, notification, etc */

    /* Shadow */
    --lumo-box-shadow-xs: 0 1px 4px -1px var(--lumo-shade-50pct);
    --lumo-box-shadow-s: 0 2px 4px -1px var(--lumo-shade-20pct), 0 3px 12px -1px var(--lumo-shade-30pct);
    --lumo-box-shadow-m: 0 2px 6px -1px var(--lumo-shade-20pct), 0 8px 24px -4px var(--lumo-shade-40pct);
    --lumo-box-shadow-l: 0 3px 18px -2px var(--lumo-shade-20pct), 0 12px 48px -6px var(--lumo-shade-40pct);
    --lumo-box-shadow-xl: 0 4px 24px -3px var(--lumo-shade-20pct), 0 18px 64px -8px var(--lumo-shade-40pct);

    /* Clickable element cursor */
    --lumo-clickable-cursor: default;
  }
`;

/**
 * Default values for component-specific custom properties.
 */
i`
  html {
    --vaadin-checkbox-size: calc(var(--lumo-size-m) / 2);
    --vaadin-radio-button-size: calc(var(--lumo-size-m) / 2);
    --vaadin-input-field-border-radius: var(--lumo-border-radius-m);
  }
`;

const $tpl$1 = document.createElement('template');
$tpl$1.innerHTML = `<style>${style.toString().replace(':host', 'html')}$</style>`;
document.head.appendChild($tpl$1.content);

/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const font = i`
  :host {
    /* prettier-ignore */
    --lumo-font-family: -apple-system, BlinkMacSystemFont, 'Roboto', 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';

    /* Font sizes */
    --lumo-font-size-xxs: 0.75rem;
    --lumo-font-size-xs: 0.8125rem;
    --lumo-font-size-s: 0.875rem;
    --lumo-font-size-m: 1rem;
    --lumo-font-size-l: 1.125rem;
    --lumo-font-size-xl: 1.375rem;
    --lumo-font-size-xxl: 1.75rem;
    --lumo-font-size-xxxl: 2.5rem;

    /* Line heights */
    --lumo-line-height-xs: 1.25;
    --lumo-line-height-s: 1.375;
    --lumo-line-height-m: 1.625;
  }
`;

const typography = i`
  body,
  :host {
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size-m);
    line-height: var(--lumo-line-height-m);
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  small,
  [theme~='font-size-s'] {
    font-size: var(--lumo-font-size-s);
    line-height: var(--lumo-line-height-s);
  }

  [theme~='font-size-xs'] {
    font-size: var(--lumo-font-size-xs);
    line-height: var(--lumo-line-height-xs);
  }

  :where(h1, h2, h3, h4, h5, h6) {
    font-weight: 600;
    line-height: var(--lumo-line-height-xs);
    margin: 0;
  }

  :where(h1) {
    font-size: var(--lumo-font-size-xxxl);
  }

  :where(h2) {
    font-size: var(--lumo-font-size-xxl);
  }

  :where(h3) {
    font-size: var(--lumo-font-size-xl);
  }

  :where(h4) {
    font-size: var(--lumo-font-size-l);
  }

  :where(h5) {
    font-size: var(--lumo-font-size-m);
  }

  :where(h6) {
    font-size: var(--lumo-font-size-xs);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  p,
  blockquote {
    margin-top: 0.5em;
    margin-bottom: 0.75em;
  }

  a {
    text-decoration: none;
  }

  a:where(:any-link):hover {
    text-decoration: underline;
  }

  hr {
    display: block;
    align-self: stretch;
    height: 1px;
    border: 0;
    padding: 0;
    margin: var(--lumo-space-s) calc(var(--lumo-border-radius-m) / 2);
    background-color: var(--lumo-contrast-10pct);
  }

  blockquote {
    border-left: 2px solid var(--lumo-contrast-30pct);
  }

  b,
  strong {
    font-weight: 600;
  }

  /* RTL specific styles */
  blockquote[dir='rtl'] {
    border-left: none;
    border-right: 2px solid var(--lumo-contrast-30pct);
  }
`;

registerStyles('', typography, { moduleId: 'lumo-typography' });

const $tpl = document.createElement('template');
$tpl.innerHTML = `<style>${font.toString().replace(':host', 'html')}</style>`;
document.head.appendChild($tpl.content);

const button = i`
  :host {
    /* Sizing */
    --lumo-button-size: var(--lumo-size-m);
    min-width: calc(var(--lumo-button-size) * 2);
    height: var(--lumo-button-size);
    padding: 0 calc(var(--lumo-button-size) / 3 + var(--lumo-border-radius-m) / 2);
    margin: var(--lumo-space-xs) 0;
    box-sizing: border-box;
    /* Style */
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size-m);
    font-weight: 500;
    color: var(--_lumo-button-color, var(--lumo-primary-text-color));
    background-color: var(--_lumo-button-background-color, var(--lumo-contrast-5pct));
    border-radius: var(--lumo-border-radius-m);
    cursor: var(--lumo-clickable-cursor);
    -webkit-tap-highlight-color: transparent;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    flex-shrink: 0;
  }

  /* Set only for the internal parts so we don't affect the host vertical alignment */
  [part='label'],
  [part='prefix'],
  [part='suffix'] {
    line-height: var(--lumo-line-height-xs);
  }

  [part='label'] {
    padding: calc(var(--lumo-button-size) / 6) 0;
  }

  :host([theme~='small']) {
    font-size: var(--lumo-font-size-s);
    --lumo-button-size: var(--lumo-size-s);
  }

  :host([theme~='large']) {
    font-size: var(--lumo-font-size-l);
    --lumo-button-size: var(--lumo-size-l);
  }

  /* For interaction states */
  :host::before,
  :host::after {
    content: '';
    /* We rely on the host always being relative */
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: currentColor;
    border-radius: inherit;
    opacity: 0;
    pointer-events: none;
  }

  /* Hover */

  @media (any-hover: hover) {
    :host(:hover)::before {
      opacity: 0.02;
    }
  }

  /* Active */

  :host::after {
    transition: opacity 1.4s, transform 0.1s;
    filter: blur(8px);
  }

  :host([active])::before {
    opacity: 0.05;
    transition-duration: 0s;
  }

  :host([active])::after {
    opacity: 0.1;
    transition-duration: 0s, 0s;
    transform: scale(0);
  }

  /* Keyboard focus */

  :host([focus-ring]) {
    box-shadow: 0 0 0 2px var(--lumo-primary-color-50pct);
  }

  :host([theme~='primary'][focus-ring]) {
    box-shadow: 0 0 0 1px var(--lumo-base-color), 0 0 0 3px var(--lumo-primary-color-50pct);
  }

  /* Types (primary, tertiary, tertiary-inline */

  :host([theme~='tertiary']),
  :host([theme~='tertiary-inline']) {
    background-color: transparent !important;
    min-width: 0;
  }

  :host([theme~='tertiary']) {
    padding: 0 calc(var(--lumo-button-size) / 6);
  }

  :host([theme~='tertiary-inline'])::before {
    display: none;
  }

  :host([theme~='tertiary-inline']) {
    margin: 0;
    height: auto;
    padding: 0;
    line-height: inherit;
    font-size: inherit;
  }

  :host([theme~='tertiary-inline']) [part='label'] {
    padding: 0;
    overflow: visible;
    line-height: inherit;
  }

  :host([theme~='primary']) {
    background-color: var(--_lumo-button-primary-background-color, var(--lumo-primary-color));
    color: var(--_lumo-button-primary-color, var(--lumo-primary-contrast-color));
    font-weight: 600;
    min-width: calc(var(--lumo-button-size) * 2.5);
  }

  :host([theme~='primary'])::before {
    background-color: black;
  }

  @media (any-hover: hover) {
    :host([theme~='primary']:hover)::before {
      opacity: 0.05;
    }
  }

  :host([theme~='primary'][active])::before {
    opacity: 0.1;
  }

  :host([theme~='primary'][active])::after {
    opacity: 0.2;
  }

  /* Colors (success, error, contrast) */

  :host([theme~='success']) {
    color: var(--lumo-success-text-color);
  }

  :host([theme~='success'][theme~='primary']) {
    background-color: var(--lumo-success-color);
    color: var(--lumo-success-contrast-color);
  }

  :host([theme~='error']) {
    color: var(--lumo-error-text-color);
  }

  :host([theme~='error'][theme~='primary']) {
    background-color: var(--lumo-error-color);
    color: var(--lumo-error-contrast-color);
  }

  :host([theme~='contrast']) {
    color: var(--lumo-contrast);
  }

  :host([theme~='contrast'][theme~='primary']) {
    background-color: var(--lumo-contrast);
    color: var(--lumo-base-color);
  }

  /* Disabled state. Keep selectors after other color variants. */

  :host([disabled]) {
    pointer-events: none;
    color: var(--lumo-disabled-text-color);
  }

  :host([theme~='primary'][disabled]) {
    background-color: var(--lumo-contrast-30pct);
    color: var(--lumo-base-color);
  }

  :host([theme~='primary'][disabled]) [part] {
    opacity: 0.7;
  }

  /* Icons */

  [part] ::slotted(vaadin-icon) {
    display: inline-block;
    width: var(--lumo-icon-size-m);
    height: var(--lumo-icon-size-m);
  }

  /* Vaadin icons are based on a 16x16 grid (unlike Lumo and Material icons with 24x24), so they look too big by default */
  [part] ::slotted(vaadin-icon[icon^='vaadin:']) {
    padding: 0.25em;
    box-sizing: border-box !important;
  }

  [part='prefix'] {
    margin-left: -0.25em;
    margin-right: 0.25em;
  }

  [part='suffix'] {
    margin-left: 0.25em;
    margin-right: -0.25em;
  }

  /* Icon-only */

  :host([theme~='icon']:not([theme~='tertiary-inline'])) {
    min-width: var(--lumo-button-size);
    padding-left: calc(var(--lumo-button-size) / 4);
    padding-right: calc(var(--lumo-button-size) / 4);
  }

  :host([theme~='icon']) [part='prefix'],
  :host([theme~='icon']) [part='suffix'] {
    margin-left: 0;
    margin-right: 0;
  }

  /* RTL specific styles */

  :host([dir='rtl']) [part='prefix'] {
    margin-left: 0.25em;
    margin-right: -0.25em;
  }

  :host([dir='rtl']) [part='suffix'] {
    margin-left: -0.25em;
    margin-right: 0.25em;
  }

  :host([dir='rtl'][theme~='icon']) [part='prefix'],
  :host([dir='rtl'][theme~='icon']) [part='suffix'] {
    margin-left: 0;
    margin-right: 0;
  }
`;

registerStyles('vaadin-button', button, { moduleId: 'lumo-button' });

const menuBarButton = i`
  :host {
    margin: calc(var(--lumo-space-xs) / 2);
    margin-left: 0;
    border-radius: 0;
  }

  [part='label'] {
    width: 100%;
  }

  /* NOTE(web-padawan): avoid using shorthand padding property for IE11 */
  [part='label'] ::slotted(vaadin-menu-bar-item) {
    justify-content: center;
    background-color: transparent;
    height: var(--lumo-button-size);
    margin: 0 calc((var(--lumo-size-m) / 3 + var(--lumo-border-radius-m) / 2) * -1);
    padding-left: calc(var(--lumo-size-m) / 3 + var(--lumo-border-radius-m) / 2);
    padding-right: calc(var(--lumo-size-m) / 3 + var(--lumo-border-radius-m) / 2);
  }

  :host([theme~='small']) [part='label'] ::slotted(vaadin-menu-bar-item) {
    min-height: var(--lumo-size-s);
    margin: 0 calc((var(--lumo-size-s) / 3 + var(--lumo-border-radius-m) / 2) * -1);
    padding-left: calc(var(--lumo-size-s) / 3 + var(--lumo-border-radius-m) / 2);
    padding-right: calc(var(--lumo-size-s) / 3 + var(--lumo-border-radius-m) / 2);
  }

  :host([theme~='tertiary']) [part='label'] ::slotted(vaadin-menu-bar-item) {
    margin: 0 calc((var(--lumo-button-size) / 6) * -1);
    padding-left: calc(var(--lumo-button-size) / 6);
    padding-right: calc(var(--lumo-button-size) / 6);
  }

  :host([theme~='tertiary-inline']) {
    margin-top: calc(var(--lumo-space-xs) / 2);
    margin-bottom: calc(var(--lumo-space-xs) / 2);
    margin-right: calc(var(--lumo-space-xs) / 2);
  }

  :host([theme~='tertiary-inline']) [part='label'] ::slotted(vaadin-menu-bar-item) {
    margin: 0;
    padding: 0;
  }

  :host(:first-of-type) {
    border-radius: var(--lumo-border-radius-m) 0 0 var(--lumo-border-radius-m);

    /* Needed to retain the focus-ring with border-radius */
    margin-left: calc(var(--lumo-space-xs) / 2);
  }

  :host(:nth-last-of-type(2)),
  :host([slot='overflow']) {
    border-radius: 0 var(--lumo-border-radius-m) var(--lumo-border-radius-m) 0;
  }

  :host([theme~='tertiary']),
  :host([theme~='tertiary-inline']) {
    border-radius: var(--lumo-border-radius-m);
  }

  :host([slot='overflow']) {
    min-width: var(--lumo-button-size);
    padding-left: calc(var(--lumo-button-size) / 4);
    padding-right: calc(var(--lumo-button-size) / 4);
  }

  :host([slot='overflow']) ::slotted(*) {
    font-size: var(--lumo-font-size-xl);
  }

  :host([slot='overflow']) [part='prefix'],
  :host([slot='overflow']) [part='suffix'] {
    margin-left: 0;
    margin-right: 0;
  }

  /* RTL styles */
  :host([dir='rtl']) {
    margin-left: calc(var(--lumo-space-xs) / 2);
    margin-right: 0;
    border-radius: 0;
  }

  :host([dir='rtl']:first-of-type) {
    border-radius: 0 var(--lumo-border-radius-m) var(--lumo-border-radius-m) 0;
    margin-right: calc(var(--lumo-space-xs) / 2);
  }

  :host([dir='rtl']:nth-last-of-type(2)),
  :host([dir='rtl'][slot='overflow']) {
    border-radius: var(--lumo-border-radius-m) 0 0 var(--lumo-border-radius-m);
  }
`;

registerStyles('vaadin-menu-bar-button', [button, menuBarButton], {
  moduleId: 'lumo-menu-bar-button',
});

/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/* eslint-disable no-unused-vars */
/**
 * When using Closure Compiler, JSCompiler_renameProperty(property, object) is replaced by the munged name for object[property]
 * We cannot alias this function, so we have to use a small shim that has the same behavior when not compiling.
 *
 * @param {?} prop Property name
 * @param {*} obj Reference object
 * @return {string} Potentially renamed property name
 */
window.JSCompiler_renameProperty = function(prop, obj) {
  return prop;
};

/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

let CSS_URL_RX = /(url\()([^)]*)(\))/g;
let ABS_URL = /(^\/[^\/])|(^#)|(^[\w-\d]*:)/;
let workingURL;
let resolveDoc;
/**
 * Resolves the given URL against the provided `baseUri'.
 *
 * Note that this function performs no resolution for URLs that start
 * with `/` (absolute URLs) or `#` (hash identifiers).  For general purpose
 * URL resolution, use `window.URL`.
 *
 * @param {string} url Input URL to resolve
 * @param {?string=} baseURI Base URI to resolve the URL against
 * @return {string} resolved URL
 */
function resolveUrl(url, baseURI) {
  if (url && ABS_URL.test(url)) {
    return url;
  }
  if (url === '//') {
    return url;
  }
  // Lazy feature detection.
  if (workingURL === undefined) {
    workingURL = false;
    try {
      const u = new URL('b', 'http://a');
      u.pathname = 'c%20d';
      workingURL = (u.href === 'http://a/c%20d');
    } catch (e) {
      // silently fail
    }
  }
  if (!baseURI) {
    baseURI = document.baseURI || window.location.href;
  }
  if (workingURL) {
    try {
      return (new URL(url, baseURI)).href;
    } catch (e) {
      // Bad url or baseURI structure. Do not attempt to resolve.
      return url;
    }
  }
  // Fallback to creating an anchor into a disconnected document.
  if (!resolveDoc) {
    resolveDoc = document.implementation.createHTMLDocument('temp');
    resolveDoc.base = resolveDoc.createElement('base');
    resolveDoc.head.appendChild(resolveDoc.base);
    resolveDoc.anchor = resolveDoc.createElement('a');
    resolveDoc.body.appendChild(resolveDoc.anchor);
  }
  resolveDoc.base.href = baseURI;
  resolveDoc.anchor.href = url;
  return resolveDoc.anchor.href || url;

}

/**
 * Resolves any relative URL's in the given CSS text against the provided
 * `ownerDocument`'s `baseURI`.
 *
 * @param {string} cssText CSS text to process
 * @param {string} baseURI Base URI to resolve the URL against
 * @return {string} Processed CSS text with resolved URL's
 */
function resolveCss(cssText, baseURI) {
  return cssText.replace(CSS_URL_RX, function(m, pre, url, post) {
    return pre + '\'' +
      resolveUrl(url.replace(/["']/g, ''), baseURI) +
      '\'' + post;
  });
}

/**
 * Returns a path from a given `url`. The path includes the trailing
 * `/` from the url.
 *
 * @param {string} url Input URL to transform
 * @return {string} resolved path
 */
function pathFromUrl(url) {
  return url.substring(0, url.lastIndexOf('/') + 1);
}

/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
const useShadow = !(window.ShadyDOM) || !(window.ShadyDOM.inUse);
Boolean(!window.ShadyCSS || window.ShadyCSS.nativeCss);
const supportsAdoptingStyleSheets = useShadow &&
    ('adoptedStyleSheets' in Document.prototype) &&
    ('replaceSync' in CSSStyleSheet.prototype) &&
    // Since spec may change, feature detect exact API we need
    (() => {
      try {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync('');
        const host = document.createElement('div');
        host.attachShadow({mode: 'open'});
        host.shadowRoot.adoptedStyleSheets = [sheet];
        return (host.shadowRoot.adoptedStyleSheets[0] === sheet);
      } catch(e) {
        return false;
      }
    })();

/**
 * Globally settable property that is automatically assigned to
 * `ElementMixin` instances, useful for binding in templates to
 * make URL's relative to an application's root.  Defaults to the main
 * document URL, but can be overridden by users.  It may be useful to set
 * `rootPath` to provide a stable application mount path when
 * using client side routing.
 */
let rootPath = window.Polymer && window.Polymer.rootPath ||
  pathFromUrl(document.baseURI || window.location.href);

/**
 * A global callback used to sanitize any value before inserting it into the DOM.
 * The callback signature is:
 *
 *  function sanitizeDOMValue(value, name, type, node) { ... }
 *
 * Where:
 *
 * `value` is the value to sanitize.
 * `name` is the name of an attribute or property (for example, href).
 * `type` indicates where the value is being inserted: one of property, attribute, or text.
 * `node` is the node where the value is being inserted.
 *
 * @type {(function(*,string,string,?Node):*)|undefined}
 */
let sanitizeDOMValue =
  window.Polymer && window.Polymer.sanitizeDOMValue || undefined;

/**
 * Globally settable property to make Polymer Gestures use passive TouchEvent listeners when recognizing gestures.
 * When set to `true`, gestures made from touch will not be able to prevent scrolling, allowing for smoother
 * scrolling performance.
 * Defaults to `false` for backwards compatibility.
 */
window.Polymer && window.Polymer.setPassiveTouchGestures || false;

/**
 * Setting to ensure Polymer template evaluation only occurs based on tempates
 * defined in trusted script.  When true, `<dom-module>` re-registration is
 * disallowed, `<dom-bind>` is disabled, and `<dom-if>`/`<dom-repeat>`
 * templates will only evaluate in the context of a trusted element template.
 */
let strictTemplatePolicy =
  window.Polymer && window.Polymer.strictTemplatePolicy || false;

/**
 * Setting to enable dom-module lookup from Polymer.Element.  By default,
 * templates must be defined in script using the `static get template()`
 * getter and the `html` tag function.  To enable legacy loading of templates
 * via dom-module, set this flag to true.
 */
let allowTemplateFromDomModule =
  window.Polymer && window.Polymer.allowTemplateFromDomModule || false;

/**
 * Setting to skip processing style includes and re-writing urls in css styles.
 * Normally "included" styles are pulled into the element and all urls in styles
 * are re-written to be relative to the containing script url.
 * If no includes or relative urls are used in styles, these steps can be
 * skipped as an optimization.
 */
let legacyOptimizations =
  window.Polymer && window.Polymer.legacyOptimizations || false;

/**
 * Setting to add warnings useful when migrating from Polymer 1.x to 2.x.
 */
let legacyWarnings =
  window.Polymer && window.Polymer.legacyWarnings || false;

/**
 * Setting to perform initial rendering synchronously when running under ShadyDOM.
 * This matches the behavior of Polymer 1.
 */
let syncInitialRender =
  window.Polymer && window.Polymer.syncInitialRender || false;

/**
 * Setting to retain the legacy Polymer 1 behavior for multi-property
 * observers around undefined values. Observers and computed property methods
 * are not called until no argument is undefined.
 */
let legacyUndefined =
  window.Polymer && window.Polymer.legacyUndefined || false;

/**
 * Setting to ensure computed properties are computed in order to ensure
 * re-computation never occurs in a given turn.
 */
let orderedComputed =
  window.Polymer && window.Polymer.orderedComputed || false;

/**
 * Setting to remove nested templates inside `dom-if` and `dom-repeat` as
 * part of element template parsing.  This is a performance optimization that
 * eliminates most of the tax of needing two elements due to the loss of
 * type-extended templates as a result of the V1 specification changes.
 */
let removeNestedTemplates =
  window.Polymer && window.Polymer.removeNestedTemplates || false;

/**
 * Setting to place `dom-if` elements in a performance-optimized mode that takes
 * advantage of lighter-weight host runtime template stamping to eliminate the
 * need for an intermediate Templatizer `TemplateInstance` to mange the nodes
 * stamped by `dom-if`.  Under this setting, any Templatizer-provided API's
 * such as `modelForElement` will not be available for nodes stamped by
 * `dom-if`.
 */
let fastDomIf = window.Polymer && window.Polymer.fastDomIf || false;

/**
 * Setting to disable `dom-change` and `rendered-item-count` events from
 * `dom-if` and `dom-repeat`. Users can opt back into `dom-change` events by
 * setting the `notify-dom-change` attribute (`notifyDomChange: true` property)
 * to `dom-if`/`don-repeat` instances.
 */
window.Polymer && window.Polymer.suppressTemplateNotifications || false;

/**
 * Setting to disable use of dynamic attributes. This is an optimization
 * to avoid setting `observedAttributes`. Instead attributes are read
 * once at create time and set/removeAttribute are patched.
 */
window.Polymer && window.Polymer.legacyNoObservedAttributes || false;

/**
 * Setting to enable use of `adoptedStyleSheets` for sharing style sheets
 * between component instances' shadow roots, if the app uses built Shady CSS
 * styles.
 */
let useAdoptedStyleSheetsWithBuiltCSS =
  window.Polymer && window.Polymer.useAdoptedStyleSheetsWithBuiltCSS || false;

/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

// unique global id for deduping mixins.
let dedupeId$1 = 0;

/* eslint-disable valid-jsdoc */
/**
 * Wraps an ES6 class expression mixin such that the mixin is only applied
 * if it has not already been applied its base argument. Also memoizes mixin
 * applications.
 *
 * @template T
 * @param {T} mixin ES6 class expression mixin to wrap
 * @return {T}
 * @suppress {invalidCasts}
 */
const dedupingMixin = function(mixin) {
  let mixinApplications = /** @type {!MixinFunction} */(mixin).__mixinApplications;
  if (!mixinApplications) {
    mixinApplications = new WeakMap();
    /** @type {!MixinFunction} */(mixin).__mixinApplications = mixinApplications;
  }
  // maintain a unique id for each mixin
  let mixinDedupeId = dedupeId$1++;
  function dedupingMixin(base) {
    let baseSet = /** @type {!MixinFunction} */(base).__mixinSet;
    if (baseSet && baseSet[mixinDedupeId]) {
      return base;
    }
    let map = mixinApplications;
    let extended = map.get(base);
    if (!extended) {
      extended = /** @type {!Function} */(mixin)(base);
      map.set(base, extended);
      // copy inherited mixin set from the extended class, or the base class
      // NOTE: we avoid use of Set here because some browser (IE11)
      // cannot extend a base Set via the constructor.
      let mixinSet = Object.create(/** @type {!MixinFunction} */(extended).__mixinSet || baseSet || null);
      mixinSet[mixinDedupeId] = true;
      /** @type {!MixinFunction} */(extended).__mixinSet = mixinSet;
    }
    return extended;
  }

  return dedupingMixin;
};
/* eslint-enable valid-jsdoc */

/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

let modules = {};
let lcModules = {};
/**
 * Sets a dom-module into the global registry by id.
 *
 * @param {string} id dom-module id
 * @param {DomModule} module dom-module instance
 * @return {void}
 */
function setModule(id, module) {
  // store id separate from lowercased id so that
  // in all cases mixedCase id will stored distinctly
  // and lowercase version is a fallback
  modules[id] = lcModules[id.toLowerCase()] = module;
}
/**
 * Retrieves a dom-module from the global registry by id.
 *
 * @param {string} id dom-module id
 * @return {DomModule!} dom-module instance
 */
function findModule(id) {
  return modules[id] || lcModules[id.toLowerCase()];
}

function styleOutsideTemplateCheck(inst) {
  if (inst.querySelector('style')) {
    console.warn('dom-module %s has style outside template', inst.id);
  }
}

/**
 * The `dom-module` element registers the dom it contains to the name given
 * by the module's id attribute. It provides a unified database of dom
 * accessible via its static `import` API.
 *
 * A key use case of `dom-module` is for providing custom element `<template>`s
 * via HTML imports that are parsed by the native HTML parser, that can be
 * relocated during a bundling pass and still looked up by `id`.
 *
 * Example:
 *
 *     <dom-module id="foo">
 *       <img src="stuff.png">
 *     </dom-module>
 *
 * Then in code in some other location that cannot access the dom-module above
 *
 *     let img = customElements.get('dom-module').import('foo', 'img');
 *
 * @customElement
 * @extends HTMLElement
 * @summary Custom element that provides a registry of relocatable DOM content
 *   by `id` that is agnostic to bundling.
 * @unrestricted
 */
class DomModule extends HTMLElement {

  /** @override */
  static get observedAttributes() { return ['id']; }

  /**
   * Retrieves the element specified by the css `selector` in the module
   * registered by `id`. For example, this.import('foo', 'img');
   * @param {string} id The id of the dom-module in which to search.
   * @param {string=} selector The css selector by which to find the element.
   * @return {Element} Returns the element which matches `selector` in the
   * module registered at the specified `id`.
   *
   * @export
   * @nocollapse Referred to indirectly in style-gather.js
   */
  static import(id, selector) {
    if (id) {
      let m = findModule(id);
      if (m && selector) {
        return m.querySelector(selector);
      }
      return m;
    }
    return null;
  }

  /* eslint-disable no-unused-vars */
  /**
   * @param {string} name Name of attribute.
   * @param {?string} old Old value of attribute.
   * @param {?string} value Current value of attribute.
   * @param {?string} namespace Attribute namespace.
   * @return {void}
   * @override
   */
  attributeChangedCallback(name, old, value, namespace) {
    if (old !== value) {
      this.register();
    }
  }
  /* eslint-enable no-unused-args */

  /**
   * The absolute URL of the original location of this `dom-module`.
   *
   * This value will differ from this element's `ownerDocument` in the
   * following ways:
   * - Takes into account any `assetpath` attribute added during bundling
   *   to indicate the original location relative to the bundled location
   * - Uses the HTMLImports polyfill's `importForElement` API to ensure
   *   the path is relative to the import document's location since
   *   `ownerDocument` is not currently polyfilled
   */
  get assetpath() {
    // Don't override existing assetpath.
    if (!this.__assetpath) {
      // note: assetpath set via an attribute must be relative to this
      // element's location; accommodate polyfilled HTMLImports
      const owner = window.HTMLImports && HTMLImports.importForElement ?
        HTMLImports.importForElement(this) || document : this.ownerDocument;
      const url = resolveUrl(
        this.getAttribute('assetpath') || '', owner.baseURI);
      this.__assetpath = pathFromUrl(url);
    }
    return this.__assetpath;
  }

  /**
   * Registers the dom-module at a given id. This method should only be called
   * when a dom-module is imperatively created. For
   * example, `document.createElement('dom-module').register('foo')`.
   * @param {string=} id The id at which to register the dom-module.
   * @return {void}
   */
  register(id) {
    id = id || this.id;
    if (id) {
      // Under strictTemplatePolicy, reject and null out any re-registered
      // dom-module since it is ambiguous whether first-in or last-in is trusted
      if (strictTemplatePolicy && findModule(id) !== undefined) {
        setModule(id, null);
        throw new Error(`strictTemplatePolicy: dom-module ${id} re-registered`);
      }
      this.id = id;
      setModule(id, this);
      styleOutsideTemplateCheck(this);
    }
  }
}

DomModule.prototype['modules'] = modules;

customElements.define('dom-module', DomModule);

/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/


const MODULE_STYLE_LINK_SELECTOR = 'link[rel=import][type~=css]';
const INCLUDE_ATTR = 'include';
const SHADY_UNSCOPED_ATTR = 'shady-unscoped';

/**
 * @param {string} moduleId .
 * @return {?DomModule} .
 */
function importModule(moduleId) {
  return /** @type {?DomModule} */(DomModule.import(moduleId));
}

function styleForImport(importDoc) {
  // NOTE: polyfill affordance.
  // under the HTMLImports polyfill, there will be no 'body',
  // but the import pseudo-doc can be used directly.
  let container = importDoc.body ? importDoc.body : importDoc;
  const importCss = resolveCss(container.textContent,
    importDoc.baseURI);
  const style = document.createElement('style');
  style.textContent = importCss;
  return style;
}


/**
 * Returns a list of <style> elements in a space-separated list of `dom-module`s.
 *
 * @function
 * @param {string} moduleIds List of dom-module id's within which to
 * search for css.
 * @return {!Array<!HTMLStyleElement>} Array of contained <style> elements
 */
function stylesFromModules(moduleIds) {
 const modules = moduleIds.trim().split(/\s+/);
 const styles = [];
 for (let i=0; i < modules.length; i++) {
   styles.push(...stylesFromModule(modules[i]));
 }
 return styles;
}

/**
 * Returns a list of <style> elements in a given `dom-module`.
 * Styles in a `dom-module` can come either from `<style>`s within the
 * first `<template>`, or else from one or more
 * `<link rel="import" type="css">` links outside the template.
 *
 * @param {string} moduleId dom-module id to gather styles from
 * @return {!Array<!HTMLStyleElement>} Array of contained styles.
 */
function stylesFromModule(moduleId) {
  const m = importModule(moduleId);

  if (!m) {
    console.warn('Could not find style data in module named', moduleId);
    return [];
  }

  if (m._styles === undefined) {
    const styles = [];
    // module imports: <link rel="import" type="css">
    styles.push(..._stylesFromModuleImports(m));
    // include css from the first template in the module
    const template = /** @type {?HTMLTemplateElement} */(
        m.querySelector('template'));
    if (template) {
      styles.push(...stylesFromTemplate(template,
        /** @type {templateWithAssetPath} */(m).assetpath));
    }

    m._styles = styles;
  }

  return m._styles;
}

/**
 * Returns the `<style>` elements within a given template.
 *
 * @param {!HTMLTemplateElement} template Template to gather styles from
 * @param {string=} baseURI baseURI for style content
 * @return {!Array<!HTMLStyleElement>} Array of styles
 */
function stylesFromTemplate(template, baseURI) {
  if (!template._styles) {
    const styles = [];
    // if element is a template, get content from its .content
    const e$ = template.content.querySelectorAll('style');
    for (let i=0; i < e$.length; i++) {
      let e = e$[i];
      // support style sharing by allowing styles to "include"
      // other dom-modules that contain styling
      let include = e.getAttribute(INCLUDE_ATTR);
      if (include) {
        styles.push(...stylesFromModules(include).filter(function(item, index, self) {
          return self.indexOf(item) === index;
        }));
      }
      if (baseURI) {
        e.textContent =
            resolveCss(e.textContent, /** @type {string} */ (baseURI));
      }
      styles.push(e);
    }
    template._styles = styles;
  }
  return template._styles;
}

/**
 * Returns a list of <style> elements  from stylesheets loaded via `<link rel="import" type="css">` links within the specified `dom-module`.
 *
 * @param {string} moduleId Id of `dom-module` to gather CSS from
 * @return {!Array<!HTMLStyleElement>} Array of contained styles.
 */
function stylesFromModuleImports(moduleId) {
 let m = importModule(moduleId);
 return m ? _stylesFromModuleImports(m) : [];
}

/**
 * @param {!HTMLElement} module dom-module element that could contain `<link rel="import" type="css">` styles
 * @return {!Array<!HTMLStyleElement>} Array of contained styles
 */
function _stylesFromModuleImports(module) {
  const styles = [];
  const p$ = module.querySelectorAll(MODULE_STYLE_LINK_SELECTOR);
  for (let i=0; i < p$.length; i++) {
    let p = p$[i];
    if (p.import) {
      const importDoc = p.import;
      const unscoped = p.hasAttribute(SHADY_UNSCOPED_ATTR);
      if (unscoped && !importDoc._unscopedStyle) {
        const style = styleForImport(importDoc);
        style.setAttribute(SHADY_UNSCOPED_ATTR, '');
        importDoc._unscopedStyle = style;
      } else if (!importDoc._style) {
        importDoc._style = styleForImport(importDoc);
      }
      styles.push(unscoped ? importDoc._unscopedStyle : importDoc._style);
    }
  }
  return styles;
}

/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/* eslint-disable valid-jsdoc */
/**
 * Node wrapper to ensure ShadowDOM safe operation regardless of polyfill
 * presence or mode. Note that with the introduction of `ShadyDOM.noPatch`,
 * a node wrapper must be used to access ShadowDOM API.
 * This is similar to using `Polymer.dom` but relies exclusively
 * on the presence of the ShadyDOM polyfill rather than requiring the loading
 * of legacy (Polymer.dom) API.
 * @type {function(Node):Node}
 */
const wrap$1 = (window['ShadyDOM'] && window['ShadyDOM']['noPatch'] && window['ShadyDOM']['wrap']) ?
  window['ShadyDOM']['wrap'] :
  (window['ShadyDOM'] ? (n) => ShadyDOM['patch'](n) : (n) => n);

/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/**
 * Module with utilities for manipulating structured data path strings.
 *
 * @summary Module with utilities for manipulating structured data path strings.
 */

/**
 * Returns true if the given string is a structured data path (has dots).
 *
 * Example:
 *
 * ```
 * isPath('foo.bar.baz') // true
 * isPath('foo')         // false
 * ```
 *
 * @param {string} path Path string
 * @return {boolean} True if the string contained one or more dots
 */
function isPath(path) {
  return path.indexOf('.') >= 0;
}

/**
 * Returns the root property name for the given path.
 *
 * Example:
 *
 * ```
 * root('foo.bar.baz') // 'foo'
 * root('foo')         // 'foo'
 * ```
 *
 * @param {string} path Path string
 * @return {string} Root property name
 */
function root(path) {
  let dotIndex = path.indexOf('.');
  if (dotIndex === -1) {
    return path;
  }
  return path.slice(0, dotIndex);
}

/**
 * Given `base` is `foo.bar`, `foo` is an ancestor, `foo.bar` is not
 * Returns true if the given path is an ancestor of the base path.
 *
 * Example:
 *
 * ```
 * isAncestor('foo.bar', 'foo')         // true
 * isAncestor('foo.bar', 'foo.bar')     // false
 * isAncestor('foo.bar', 'foo.bar.baz') // false
 * ```
 *
 * @param {string} base Path string to test against.
 * @param {string} path Path string to test.
 * @return {boolean} True if `path` is an ancestor of `base`.
 */
function isAncestor(base, path) {
  //     base.startsWith(path + '.');
  return base.indexOf(path + '.') === 0;
}

/**
 * Given `base` is `foo.bar`, `foo.bar.baz` is an descendant
 *
 * Example:
 *
 * ```
 * isDescendant('foo.bar', 'foo.bar.baz') // true
 * isDescendant('foo.bar', 'foo.bar')     // false
 * isDescendant('foo.bar', 'foo')         // false
 * ```
 *
 * @param {string} base Path string to test against.
 * @param {string} path Path string to test.
 * @return {boolean} True if `path` is a descendant of `base`.
 */
function isDescendant(base, path) {
  //     path.startsWith(base + '.');
  return path.indexOf(base + '.') === 0;
}

/**
 * Replaces a previous base path with a new base path, preserving the
 * remainder of the path.
 *
 * User must ensure `path` has a prefix of `base`.
 *
 * Example:
 *
 * ```
 * translate('foo.bar', 'zot', 'foo.bar.baz') // 'zot.baz'
 * ```
 *
 * @param {string} base Current base string to remove
 * @param {string} newBase New base string to replace with
 * @param {string} path Path to translate
 * @return {string} Translated string
 */
function translate(base, newBase, path) {
  return newBase + path.slice(base.length);
}

/**
 * Converts array-based paths to flattened path.  String-based paths
 * are returned as-is.
 *
 * Example:
 *
 * ```
 * normalize(['foo.bar', 0, 'baz'])  // 'foo.bar.0.baz'
 * normalize('foo.bar.0.baz')        // 'foo.bar.0.baz'
 * ```
 *
 * @param {string | !Array<string|number>} path Input path
 * @return {string} Flattened path
 */
function normalize(path) {
  if (Array.isArray(path)) {
    let parts = [];
    for (let i=0; i<path.length; i++) {
      let args = path[i].toString().split('.');
      for (let j=0; j<args.length; j++) {
        parts.push(args[j]);
      }
    }
    return parts.join('.');
  } else {
    return path;
  }
}

/**
 * Splits a path into an array of property names. Accepts either arrays
 * of path parts or strings.
 *
 * Example:
 *
 * ```
 * split(['foo.bar', 0, 'baz'])  // ['foo', 'bar', '0', 'baz']
 * split('foo.bar.0.baz')        // ['foo', 'bar', '0', 'baz']
 * ```
 *
 * @param {string | !Array<string|number>} path Input path
 * @return {!Array<string>} Array of path parts
 * @suppress {checkTypes}
 */
function split(path) {
  if (Array.isArray(path)) {
    return normalize(path).split('.');
  }
  return path.toString().split('.');
}

/**
 * Reads a value from a path.  If any sub-property in the path is `undefined`,
 * this method returns `undefined` (will never throw.
 *
 * @param {Object} root Object from which to dereference path from
 * @param {string | !Array<string|number>} path Path to read
 * @param {Object=} info If an object is provided to `info`, the normalized
 *  (flattened) path will be set to `info.path`.
 * @return {*} Value at path, or `undefined` if the path could not be
 *  fully dereferenced.
 */
function get(root, path, info) {
  let prop = root;
  let parts = split(path);
  // Loop over path parts[0..n-1] and dereference
  for (let i=0; i<parts.length; i++) {
    if (!prop) {
      return;
    }
    let part = parts[i];
    prop = prop[part];
  }
  if (info) {
    info.path = parts.join('.');
  }
  return prop;
}

/**
 * Sets a value to a path.  If any sub-property in the path is `undefined`,
 * this method will no-op.
 *
 * @param {Object} root Object from which to dereference path from
 * @param {string | !Array<string|number>} path Path to set
 * @param {*} value Value to set to path
 * @return {string | undefined} The normalized version of the input path
 */
function set(root, path, value) {
  let prop = root;
  let parts = split(path);
  let last = parts[parts.length-1];
  if (parts.length > 1) {
    // Loop over path parts[0..n-2] and dereference
    for (let i=0; i<parts.length-1; i++) {
      let part = parts[i];
      prop = prop[part];
      if (!prop) {
        return;
      }
    }
    // Set value to object at end of path
    prop[last] = value;
  } else {
    // Simple property set
    prop[path] = value;
  }
  return parts.join('.');
}

/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

const caseMap = {};
const DASH_TO_CAMEL = /-[a-z]/g;
const CAMEL_TO_DASH = /([A-Z])/g;

/**
 * @fileoverview Module with utilities for converting between "dash-case" and
 * "camelCase" identifiers.
 */

/**
 * Converts "dash-case" identifier (e.g. `foo-bar-baz`) to "camelCase"
 * (e.g. `fooBarBaz`).
 *
 * @param {string} dash Dash-case identifier
 * @return {string} Camel-case representation of the identifier
 */
function dashToCamelCase(dash) {
  return caseMap[dash] || (
    caseMap[dash] = dash.indexOf('-') < 0 ? dash : dash.replace(DASH_TO_CAMEL,
      (m) => m[1].toUpperCase()
    )
  );
}

/**
 * Converts "camelCase" identifier (e.g. `fooBarBaz`) to "dash-case"
 * (e.g. `foo-bar-baz`).
 *
 * @param {string} camel Camel-case identifier
 * @return {string} Dash-case representation of the identifier
 */
function camelToDashCase(camel) {
  return caseMap[camel] || (
    caseMap[camel] = camel.replace(CAMEL_TO_DASH, '-$1').toLowerCase()
  );
}

/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/


// Microtask implemented using Mutation Observer
let microtaskCurrHandle$1 = 0;
let microtaskLastHandle$1 = 0;
let microtaskCallbacks$1 = [];
let microtaskNodeContent$1 = 0;
let microtaskScheduled$1 = false;
let microtaskNode$1 = document.createTextNode('');
new window.MutationObserver(microtaskFlush$1).observe(microtaskNode$1, {characterData: true});

function microtaskFlush$1() {
  microtaskScheduled$1 = false;
  const len = microtaskCallbacks$1.length;
  for (let i = 0; i < len; i++) {
    let cb = microtaskCallbacks$1[i];
    if (cb) {
      try {
        cb();
      } catch (e) {
        setTimeout(() => { throw e; });
      }
    }
  }
  microtaskCallbacks$1.splice(0, len);
  microtaskLastHandle$1 += len;
}

/**
 * Async interface for enqueuing callbacks that run at microtask timing.
 *
 * Note that microtask timing is achieved via a single `MutationObserver`,
 * and thus callbacks enqueued with this API will all run in a single
 * batch, and not interleaved with other microtasks such as promises.
 * Promises are avoided as an implementation choice for the time being
 * due to Safari bugs that cause Promises to lack microtask guarantees.
 *
 * @namespace
 * @summary Async interface for enqueuing callbacks that run at microtask
 *   timing.
 */
const microTask$1 = {

  /**
   * Enqueues a function called at microtask timing.
   *
   * @memberof microTask
   * @param {!Function=} callback Callback to run
   * @return {number} Handle used for canceling task
   */
  run(callback) {
    if (!microtaskScheduled$1) {
      microtaskScheduled$1 = true;
      microtaskNode$1.textContent = microtaskNodeContent$1++;
    }
    microtaskCallbacks$1.push(callback);
    return microtaskCurrHandle$1++;
  },

  /**
   * Cancels a previously enqueued `microTask` callback.
   *
   * @memberof microTask
   * @param {number} handle Handle returned from `run` of callback to cancel
   * @return {void}
   */
  cancel(handle) {
    const idx = handle - microtaskLastHandle$1;
    if (idx >= 0) {
      if (!microtaskCallbacks$1[idx]) {
        throw new Error('invalid async handle: ' + handle);
      }
      microtaskCallbacks$1[idx] = null;
    }
  }

};

/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/** @const {!AsyncInterface} */
const microtask = microTask$1;

/**
 * Element class mixin that provides basic meta-programming for creating one
 * or more property accessors (getter/setter pair) that enqueue an async
 * (batched) `_propertiesChanged` callback.
 *
 * For basic usage of this mixin, call `MyClass.createProperties(props)`
 * once at class definition time to create property accessors for properties
 * named in props, implement `_propertiesChanged` to react as desired to
 * property changes, and implement `static get observedAttributes()` and
 * include lowercase versions of any property names that should be set from
 * attributes. Last, call `this._enableProperties()` in the element's
 * `connectedCallback` to enable the accessors.
 *
 * @mixinFunction
 * @polymer
 * @summary Element class mixin for reacting to property changes from
 *   generated property accessors.
 * @template T
 * @param {function(new:T)} superClass Class to apply mixin to.
 * @return {function(new:T)} superClass with mixin applied.
 */
const PropertiesChanged = dedupingMixin(
    /**
     * @template T
     * @param {function(new:T)} superClass Class to apply mixin to.
     * @return {function(new:T)} superClass with mixin applied.
     */
    (superClass) => {

  /**
   * @polymer
   * @mixinClass
   * @implements {Polymer_PropertiesChanged}
   * @unrestricted
   */
  class PropertiesChanged extends superClass {

    /**
     * Creates property accessors for the given property names.
     * @param {!Object} props Object whose keys are names of accessors.
     * @return {void}
     * @protected
     * @nocollapse
     */
    static createProperties(props) {
      const proto = this.prototype;
      for (let prop in props) {
        // don't stomp an existing accessor
        if (!(prop in proto)) {
          proto._createPropertyAccessor(prop);
        }
      }
    }

    /**
     * Returns an attribute name that corresponds to the given property.
     * The attribute name is the lowercased property name. Override to
     * customize this mapping.
     * @param {string} property Property to convert
     * @return {string} Attribute name corresponding to the given property.
     *
     * @protected
     * @nocollapse
     */
    static attributeNameForProperty(property) {
      return property.toLowerCase();
    }

    /**
     * Override point to provide a type to which to deserialize a value to
     * a given property.
     * @param {string} name Name of property
     *
     * @protected
     * @nocollapse
     */
    static typeForProperty(name) { } //eslint-disable-line no-unused-vars

    /**
     * Creates a setter/getter pair for the named property with its own
     * local storage.  The getter returns the value in the local storage,
     * and the setter calls `_setProperty`, which updates the local storage
     * for the property and enqueues a `_propertiesChanged` callback.
     *
     * This method may be called on a prototype or an instance.  Calling
     * this method may overwrite a property value that already exists on
     * the prototype/instance by creating the accessor.
     *
     * @param {string} property Name of the property
     * @param {boolean=} readOnly When true, no setter is created; the
     *   protected `_setProperty` function must be used to set the property
     * @return {void}
     * @protected
     * @override
     */
    _createPropertyAccessor(property, readOnly) {
      this._addPropertyToAttributeMap(property);
      if (!this.hasOwnProperty(JSCompiler_renameProperty('__dataHasAccessor', this))) {
        this.__dataHasAccessor = Object.assign({}, this.__dataHasAccessor);
      }
      if (!this.__dataHasAccessor[property]) {
        this.__dataHasAccessor[property] = true;
        this._definePropertyAccessor(property, readOnly);
      }
    }

    /**
     * Adds the given `property` to a map matching attribute names
     * to property names, using `attributeNameForProperty`. This map is
     * used when deserializing attribute values to properties.
     *
     * @param {string} property Name of the property
     * @override
     */
    _addPropertyToAttributeMap(property) {
      if (!this.hasOwnProperty(JSCompiler_renameProperty('__dataAttributes', this))) {
        this.__dataAttributes = Object.assign({}, this.__dataAttributes);
      }
      // This check is technically not correct; it's an optimization that
      // assumes that if a _property_ name is already in the map (note this is
      // an attr->property map), the property mapped directly to the attribute
      // and it has already been mapped.  This would fail if
      // `attributeNameForProperty` were overridden such that this was not the
      // case.
      let attr = this.__dataAttributes[property];
      if (!attr) {
        attr = this.constructor.attributeNameForProperty(property);
        this.__dataAttributes[attr] = property;
      }
      return attr;
    }

    /**
     * Defines a property accessor for the given property.
     * @param {string} property Name of the property
     * @param {boolean=} readOnly When true, no setter is created
     * @return {void}
     * @override
     */
     _definePropertyAccessor(property, readOnly) {
      Object.defineProperty(this, property, {
        /* eslint-disable valid-jsdoc */
        /** @this {PropertiesChanged} */
        get() {
          // Inline for perf instead of using `_getProperty`
          return this.__data[property];
        },
        /** @this {PropertiesChanged} */
        set: readOnly ? function () {} : function (value) {
          // Inline for perf instead of using `_setProperty`
          if (this._setPendingProperty(property, value, true)) {
            this._invalidateProperties();
          }
        }
        /* eslint-enable */
      });
    }

    constructor() {
      super();
      /** @type {boolean} */
      this.__dataEnabled = false;
      this.__dataReady = false;
      this.__dataInvalid = false;
      this.__data = {};
      this.__dataPending = null;
      this.__dataOld = null;
      this.__dataInstanceProps = null;
      /** @type {number} */
      // NOTE: used to track re-entrant calls to `_flushProperties`
      this.__dataCounter = 0;
      this.__serializing = false;
      this._initializeProperties();
    }

    /**
     * Lifecycle callback called when properties are enabled via
     * `_enableProperties`.
     *
     * Users may override this function to implement behavior that is
     * dependent on the element having its property data initialized, e.g.
     * from defaults (initialized from `constructor`, `_initializeProperties`),
     * `attributeChangedCallback`, or values propagated from host e.g. via
     * bindings.  `super.ready()` must be called to ensure the data system
     * becomes enabled.
     *
     * @return {void}
     * @public
     * @override
     */
    ready() {
      this.__dataReady = true;
      this._flushProperties();
    }

    /**
     * Initializes the local storage for property accessors.
     *
     * Provided as an override point for performing any setup work prior
     * to initializing the property accessor system.
     *
     * @return {void}
     * @protected
     * @override
     */
    _initializeProperties() {
      // Capture instance properties; these will be set into accessors
      // during first flush. Don't set them here, since we want
      // these to overwrite defaults/constructor assignments
      for (let p in this.__dataHasAccessor) {
        if (this.hasOwnProperty(p)) {
          this.__dataInstanceProps = this.__dataInstanceProps || {};
          this.__dataInstanceProps[p] = this[p];
          delete this[p];
        }
      }
    }

    /**
     * Called at ready time with bag of instance properties that overwrote
     * accessors when the element upgraded.
     *
     * The default implementation sets these properties back into the
     * setter at ready time.  This method is provided as an override
     * point for customizing or providing more efficient initialization.
     *
     * @param {Object} props Bag of property values that were overwritten
     *   when creating property accessors.
     * @return {void}
     * @protected
     * @override
     */
    _initializeInstanceProperties(props) {
      Object.assign(this, props);
    }

    /**
     * Updates the local storage for a property (via `_setPendingProperty`)
     * and enqueues a `_proeprtiesChanged` callback.
     *
     * @param {string} property Name of the property
     * @param {*} value Value to set
     * @return {void}
     * @protected
     * @override
     */
    _setProperty(property, value) {
      if (this._setPendingProperty(property, value)) {
        this._invalidateProperties();
      }
    }

    /**
     * Returns the value for the given property.
     * @param {string} property Name of property
     * @return {*} Value for the given property
     * @protected
     * @override
     */
    _getProperty(property) {
      return this.__data[property];
    }

    /* eslint-disable no-unused-vars */
    /**
     * Updates the local storage for a property, records the previous value,
     * and adds it to the set of "pending changes" that will be passed to the
     * `_propertiesChanged` callback.  This method does not enqueue the
     * `_propertiesChanged` callback.
     *
     * @param {string} property Name of the property
     * @param {*} value Value to set
     * @param {boolean=} ext Not used here; affordance for closure
     * @return {boolean} Returns true if the property changed
     * @protected
     * @override
     */
    _setPendingProperty(property, value, ext) {
      let old = this.__data[property];
      let changed = this._shouldPropertyChange(property, value, old);
      if (changed) {
        if (!this.__dataPending) {
          this.__dataPending = {};
          this.__dataOld = {};
        }
        // Ensure old is captured from the last turn
        if (this.__dataOld && !(property in this.__dataOld)) {
          this.__dataOld[property] = old;
        }
        this.__data[property] = value;
        this.__dataPending[property] = value;
      }
      return changed;
    }
    /* eslint-enable */

    /**
     * @param {string} property Name of the property
     * @return {boolean} Returns true if the property is pending.
     */
    _isPropertyPending(property) {
      return !!(this.__dataPending && this.__dataPending.hasOwnProperty(property));
    }

    /**
     * Marks the properties as invalid, and enqueues an async
     * `_propertiesChanged` callback.
     *
     * @return {void}
     * @protected
     * @override
     */
    _invalidateProperties() {
      if (!this.__dataInvalid && this.__dataReady) {
        this.__dataInvalid = true;
        microtask.run(() => {
          if (this.__dataInvalid) {
            this.__dataInvalid = false;
            this._flushProperties();
          }
        });
      }
    }

    /**
     * Call to enable property accessor processing. Before this method is
     * called accessor values will be set but side effects are
     * queued. When called, any pending side effects occur immediately.
     * For elements, generally `connectedCallback` is a normal spot to do so.
     * It is safe to call this method multiple times as it only turns on
     * property accessors once.
     *
     * @return {void}
     * @protected
     * @override
     */
    _enableProperties() {
      if (!this.__dataEnabled) {
        this.__dataEnabled = true;
        if (this.__dataInstanceProps) {
          this._initializeInstanceProperties(this.__dataInstanceProps);
          this.__dataInstanceProps = null;
        }
        this.ready();
      }
    }

    /**
     * Calls the `_propertiesChanged` callback with the current set of
     * pending changes (and old values recorded when pending changes were
     * set), and resets the pending set of changes. Generally, this method
     * should not be called in user code.
     *
     * @return {void}
     * @protected
     * @override
     */
    _flushProperties() {
      this.__dataCounter++;
      const props = this.__data;
      const changedProps = this.__dataPending;
      const old = this.__dataOld;
      if (this._shouldPropertiesChange(props, changedProps, old)) {
        this.__dataPending = null;
        this.__dataOld = null;
        this._propertiesChanged(props, changedProps, old);
      }
      this.__dataCounter--;
    }

    /**
     * Called in `_flushProperties` to determine if `_propertiesChanged`
     * should be called. The default implementation returns true if
     * properties are pending. Override to customize when
     * `_propertiesChanged` is called.
     * @param {!Object} currentProps Bag of all current accessor values
     * @param {?Object} changedProps Bag of properties changed since the last
     *   call to `_propertiesChanged`
     * @param {?Object} oldProps Bag of previous values for each property
     *   in `changedProps`
     * @return {boolean} true if changedProps is truthy
     * @override
     */
    _shouldPropertiesChange(currentProps, changedProps, oldProps) { // eslint-disable-line no-unused-vars
      return Boolean(changedProps);
    }

    /**
     * Callback called when any properties with accessors created via
     * `_createPropertyAccessor` have been set.
     *
     * @param {!Object} currentProps Bag of all current accessor values
     * @param {?Object} changedProps Bag of properties changed since the last
     *   call to `_propertiesChanged`
     * @param {?Object} oldProps Bag of previous values for each property
     *   in `changedProps`
     * @return {void}
     * @protected
     * @override
     */
    _propertiesChanged(currentProps, changedProps, oldProps) { // eslint-disable-line no-unused-vars
    }

    /**
     * Method called to determine whether a property value should be
     * considered as a change and cause the `_propertiesChanged` callback
     * to be enqueued.
     *
     * The default implementation returns `true` if a strict equality
     * check fails. The method always returns false for `NaN`.
     *
     * Override this method to e.g. provide stricter checking for
     * Objects/Arrays when using immutable patterns.
     *
     * @param {string} property Property name
     * @param {*} value New property value
     * @param {*} old Previous property value
     * @return {boolean} Whether the property should be considered a change
     *   and enqueue a `_proeprtiesChanged` callback
     * @protected
     * @override
     */
    _shouldPropertyChange(property, value, old) {
      return (
        // Strict equality check
        (old !== value &&
          // This ensures (old==NaN, value==NaN) always returns false
          (old === old || value === value))
      );
    }

    /**
     * Implements native Custom Elements `attributeChangedCallback` to
     * set an attribute value to a property via `_attributeToProperty`.
     *
     * @param {string} name Name of attribute that changed
     * @param {?string} old Old attribute value
     * @param {?string} value New attribute value
     * @param {?string} namespace Attribute namespace.
     * @return {void}
     * @suppress {missingProperties} Super may or may not implement the callback
     * @override
     */
    attributeChangedCallback(name, old, value, namespace) {
      if (old !== value) {
        this._attributeToProperty(name, value);
      }
      if (super.attributeChangedCallback) {
        super.attributeChangedCallback(name, old, value, namespace);
      }
    }

    /**
     * Deserializes an attribute to its associated property.
     *
     * This method calls the `_deserializeValue` method to convert the string to
     * a typed value.
     *
     * @param {string} attribute Name of attribute to deserialize.
     * @param {?string} value of the attribute.
     * @param {*=} type type to deserialize to, defaults to the value
     * returned from `typeForProperty`
     * @return {void}
     * @override
     */
    _attributeToProperty(attribute, value, type) {
      if (!this.__serializing) {
        const map = this.__dataAttributes;
        const property = map && map[attribute] || attribute;
        this[property] = this._deserializeValue(value, type ||
          this.constructor.typeForProperty(property));
      }
    }

    /**
     * Serializes a property to its associated attribute.
     *
     * @suppress {invalidCasts} Closure can't figure out `this` is an element.
     *
     * @param {string} property Property name to reflect.
     * @param {string=} attribute Attribute name to reflect to.
     * @param {*=} value Property value to refect.
     * @return {void}
     * @override
     */
    _propertyToAttribute(property, attribute, value) {
      this.__serializing = true;
      value = (arguments.length < 3) ? this[property] : value;
      this._valueToNodeAttribute(/** @type {!HTMLElement} */(this), value,
        attribute || this.constructor.attributeNameForProperty(property));
      this.__serializing = false;
    }

    /**
     * Sets a typed value to an HTML attribute on a node.
     *
     * This method calls the `_serializeValue` method to convert the typed
     * value to a string.  If the `_serializeValue` method returns `undefined`,
     * the attribute will be removed (this is the default for boolean
     * type `false`).
     *
     * @param {Element} node Element to set attribute to.
     * @param {*} value Value to serialize.
     * @param {string} attribute Attribute name to serialize to.
     * @return {void}
     * @override
     */
    _valueToNodeAttribute(node, value, attribute) {
      const str = this._serializeValue(value);
      if (attribute === 'class' || attribute === 'name' || attribute === 'slot') {
        node = /** @type {?Element} */(wrap$1(node));
      }
      if (str === undefined) {
        node.removeAttribute(attribute);
      } else {
        node.setAttribute(
            attribute,
            // Closure's type for `setAttribute`'s second parameter incorrectly
            // excludes `TrustedScript`.
            (str === '' && window.trustedTypes) ?
                /** @type {?} */ (window.trustedTypes.emptyScript) :
                str);
      }
    }

    /**
     * Converts a typed JavaScript value to a string.
     *
     * This method is called when setting JS property values to
     * HTML attributes.  Users may override this method to provide
     * serialization for custom types.
     *
     * @param {*} value Property value to serialize.
     * @return {string | undefined} String serialized from the provided
     * property  value.
     * @override
     */
    _serializeValue(value) {
      switch (typeof value) {
        case 'boolean':
          return value ? '' : undefined;
        default:
          return value != null ? value.toString() : undefined;
      }
    }

    /**
     * Converts a string to a typed JavaScript value.
     *
     * This method is called when reading HTML attribute values to
     * JS properties.  Users may override this method to provide
     * deserialization for custom `type`s. Types for `Boolean`, `String`,
     * and `Number` convert attributes to the expected types.
     *
     * @param {?string} value Value to deserialize.
     * @param {*=} type Type to deserialize the string to.
     * @return {*} Typed value deserialized from the provided string.
     * @override
     */
    _deserializeValue(value, type) {
      switch (type) {
        case Boolean:
          return (value !== null);
        case Number:
          return Number(value);
        default:
          return value;
      }
    }

  }

  return PropertiesChanged;
});

/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

// Save map of native properties; this forms a blacklist or properties
// that won't have their values "saved" by `saveAccessorValue`, since
// reading from an HTMLElement accessor from the context of a prototype throws
const nativeProperties = {};
let proto = HTMLElement.prototype;
while (proto) {
  let props = Object.getOwnPropertyNames(proto);
  for (let i=0; i<props.length; i++) {
    nativeProperties[props[i]] = true;
  }
  proto = Object.getPrototypeOf(proto);
}

const isTrustedType = (() => {
  if (!window.trustedTypes) {
    return () => false;
  }
  return (val) => trustedTypes.isHTML(val) ||
        trustedTypes.isScript(val) || trustedTypes.isScriptURL(val);
})();

/**
 * Used to save the value of a property that will be overridden with
 * an accessor. If the `model` is a prototype, the values will be saved
 * in `__dataProto`, and it's up to the user (or downstream mixin) to
 * decide how/when to set these values back into the accessors.
 * If `model` is already an instance (it has a `__data` property), then
 * the value will be set as a pending property, meaning the user should
 * call `_invalidateProperties` or `_flushProperties` to take effect
 *
 * @param {Object} model Prototype or instance
 * @param {string} property Name of property
 * @return {void}
 * @private
 */
function saveAccessorValue(model, property) {
  // Don't read/store value for any native properties since they could throw
  if (!nativeProperties[property]) {
    let value = model[property];
    if (value !== undefined) {
      if (model.__data) {
        // Adding accessor to instance; update the property
        // It is the user's responsibility to call _flushProperties
        model._setPendingProperty(property, value);
      } else {
        // Adding accessor to proto; save proto's value for instance-time use
        if (!model.__dataProto) {
          model.__dataProto = {};
        } else if (!model.hasOwnProperty(JSCompiler_renameProperty('__dataProto', model))) {
          model.__dataProto = Object.create(model.__dataProto);
        }
        model.__dataProto[property] = value;
      }
    }
  }
}

/**
 * Element class mixin that provides basic meta-programming for creating one
 * or more property accessors (getter/setter pair) that enqueue an async
 * (batched) `_propertiesChanged` callback.
 *
 * For basic usage of this mixin:
 *
 * -   Declare attributes to observe via the standard `static get
 *     observedAttributes()`. Use `dash-case` attribute names to represent
 *     `camelCase` property names.
 * -   Implement the `_propertiesChanged` callback on the class.
 * -   Call `MyClass.createPropertiesForAttributes()` **once** on the class to
 *     generate property accessors for each observed attribute. This must be
 *     called before the first instance is created, for example, by calling it
 *     before calling `customElements.define`. It can also be called lazily from
 *     the element's `constructor`, as long as it's guarded so that the call is
 *     only made once, when the first instance is created.
 * -   Call `this._enableProperties()` in the element's `connectedCallback` to
 *     enable the accessors.
 *
 * Any `observedAttributes` will automatically be
 * deserialized via `attributeChangedCallback` and set to the associated
 * property using `dash-case`-to-`camelCase` convention.
 *
 * @mixinFunction
 * @polymer
 * @appliesMixin PropertiesChanged
 * @summary Element class mixin for reacting to property changes from
 *   generated property accessors.
 * @template T
 * @param {function(new:T)} superClass Class to apply mixin to.
 * @return {function(new:T)} superClass with mixin applied.
 */
const PropertyAccessors = dedupingMixin(superClass => {

  /**
   * @constructor
   * @implements {Polymer_PropertiesChanged}
   * @unrestricted
   * @private
   */
   const base = PropertiesChanged(superClass);

  /**
   * @polymer
   * @mixinClass
   * @implements {Polymer_PropertyAccessors}
   * @extends {base}
   * @unrestricted
   */
  class PropertyAccessors extends base {

    /**
     * Generates property accessors for all attributes in the standard
     * static `observedAttributes` array.
     *
     * Attribute names are mapped to property names using the `dash-case` to
     * `camelCase` convention
     *
     * @return {void}
     * @nocollapse
     */
    static createPropertiesForAttributes() {
      let a$ =  /** @type {?} */ (this).observedAttributes;
      for (let i=0; i < a$.length; i++) {
        this.prototype._createPropertyAccessor(dashToCamelCase(a$[i]));
      }
    }

    /**
     * Returns an attribute name that corresponds to the given property.
     * By default, converts camel to dash case, e.g. `fooBar` to `foo-bar`.
     * @param {string} property Property to convert
     * @return {string} Attribute name corresponding to the given property.
     *
     * @protected
     * @nocollapse
     */
    static attributeNameForProperty(property) {
      return camelToDashCase(property);
    }

    /**
     * Overrides PropertiesChanged implementation to initialize values for
     * accessors created for values that already existed on the element
     * prototype.
     *
     * @return {void}
     * @protected
     * @override
     */
    _initializeProperties() {
      if (this.__dataProto) {
        this._initializeProtoProperties(this.__dataProto);
        this.__dataProto = null;
      }
      super._initializeProperties();
    }

    /**
     * Called at instance time with bag of properties that were overwritten
     * by accessors on the prototype when accessors were created.
     *
     * The default implementation sets these properties back into the
     * setter at instance time.  This method is provided as an override
     * point for customizing or providing more efficient initialization.
     *
     * @param {Object} props Bag of property values that were overwritten
     *   when creating property accessors.
     * @return {void}
     * @protected
     * @override
     */
    _initializeProtoProperties(props) {
      for (let p in props) {
        this._setProperty(p, props[p]);
      }
    }

    /**
     * Ensures the element has the given attribute. If it does not,
     * assigns the given value to the attribute.
     *
     * @suppress {invalidCasts} Closure can't figure out `this` is infact an
     *     element
     *
     * @param {string} attribute Name of attribute to ensure is set.
     * @param {string} value of the attribute.
     * @return {void}
     * @override
     */
    _ensureAttribute(attribute, value) {
      const el = /** @type {!HTMLElement} */(this);
      if (!el.hasAttribute(attribute)) {
        this._valueToNodeAttribute(el, value, attribute);
      }
    }

    /**
     * Overrides PropertiesChanged implemention to serialize objects as JSON.
     *
     * @param {*} value Property value to serialize.
     * @return {string | undefined} String serialized from the provided property
     *     value.
     * @override
     */
    _serializeValue(value) {
      /* eslint-disable no-fallthrough */
      switch (typeof value) {
        case 'object':
          if (value instanceof Date) {
            return value.toString();
          } else if (value) {
            if (isTrustedType(value)) {
              /**
               * Here `value` isn't actually a string, but it should be
               * passed into APIs that normally expect a string, like
               * elem.setAttribute.
               */
              return /** @type {?} */ (value);
            }
            try {
              return JSON.stringify(value);
            } catch(x) {
              return '';
            }
          }

        default:
          return super._serializeValue(value);
      }
    }

    /**
     * Converts a string to a typed JavaScript value.
     *
     * This method is called by Polymer when reading HTML attribute values to
     * JS properties.  Users may override this method on Polymer element
     * prototypes to provide deserialization for custom `type`s.  Note,
     * the `type` argument is the value of the `type` field provided in the
     * `properties` configuration object for a given property, and is
     * by convention the constructor for the type to deserialize.
     *
     *
     * @param {?string} value Attribute value to deserialize.
     * @param {*=} type Type to deserialize the string to.
     * @return {*} Typed value deserialized from the provided string.
     * @override
     */
    _deserializeValue(value, type) {
      /**
       * @type {*}
       */
      let outValue;
      switch (type) {
        case Object:
          try {
            outValue = JSON.parse(/** @type {string} */(value));
          } catch(x) {
            // allow non-JSON literals like Strings and Numbers
            outValue = value;
          }
          break;
        case Array:
          try {
            outValue = JSON.parse(/** @type {string} */(value));
          } catch(x) {
            outValue = null;
            console.warn(`Polymer::Attributes: couldn't decode Array as JSON: ${value}`);
          }
          break;
        case Date:
          outValue = isNaN(value) ? String(value) : Number(value);
          outValue = new Date(outValue);
          break;
        default:
          outValue = super._deserializeValue(value, type);
          break;
      }
      return outValue;
    }
    /* eslint-enable no-fallthrough */

    /**
     * Overrides PropertiesChanged implementation to save existing prototype
     * property value so that it can be reset.
     * @param {string} property Name of the property
     * @param {boolean=} readOnly When true, no setter is created
     *
     * When calling on a prototype, any overwritten values are saved in
     * `__dataProto`, and it is up to the subclasser to decide how/when
     * to set those properties back into the accessor.  When calling on an
     * instance, the overwritten value is set via `_setPendingProperty`,
     * and the user should call `_invalidateProperties` or `_flushProperties`
     * for the values to take effect.
     * @protected
     * @return {void}
     * @override
     */
    _definePropertyAccessor(property, readOnly) {
      saveAccessorValue(this, property);
      super._definePropertyAccessor(property, readOnly);
    }

    /**
     * Returns true if this library created an accessor for the given property.
     *
     * @param {string} property Property name
     * @return {boolean} True if an accessor was created
     * @override
     */
    _hasAccessor(property) {
      return this.__dataHasAccessor && this.__dataHasAccessor[property];
    }

    /**
     * Returns true if the specified property has a pending change.
     *
     * @param {string} prop Property name
     * @return {boolean} True if property has a pending change
     * @protected
     * @override
     */
    _isPropertyPending(prop) {
      return Boolean(this.__dataPending && (prop in this.__dataPending));
    }

  }

  return PropertyAccessors;

});

/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

// 1.x backwards-compatible auto-wrapper for template type extensions
// This is a clear layering violation and gives favored-nation status to
// dom-if and dom-repeat templates.  This is a conceit we're choosing to keep
// a.) to ease 1.x backwards-compatibility due to loss of `is`, and
// b.) to maintain if/repeat capability in parser-constrained elements
//     (e.g. table, select) in lieu of native CE type extensions without
//     massive new invention in this space (e.g. directive system)
const templateExtensions = {
  'dom-if': true,
  'dom-repeat': true
};

let placeholderBugDetect = false;
let placeholderBug = false;

function hasPlaceholderBug() {
  if (!placeholderBugDetect) {
    placeholderBugDetect = true;
    const t = document.createElement('textarea');
    t.placeholder = 'a';
    placeholderBug = t.placeholder === t.textContent;
  }
  return placeholderBug;
}

/**
 * Some browsers have a bug with textarea, where placeholder text is copied as
 * a textnode child of the textarea.
 *
 * If the placeholder is a binding, this can break template stamping in two
 * ways.
 *
 * One issue is that when the `placeholder` attribute is removed when the
 * binding is processed, the textnode child of the textarea is deleted, and the
 * template info tries to bind into that node.
 *
 * With `legacyOptimizations` in use, when the template is stamped and the
 * `textarea.textContent` binding is processed, no corresponding node is found
 * because it was removed during parsing. An exception is generated when this
 * binding is updated.
 *
 * With `legacyOptimizations` not in use, the template is cloned before
 * processing and this changes the above behavior. The cloned template also has
 * a value property set to the placeholder and textContent. This prevents the
 * removal of the textContent when the placeholder attribute is removed.
 * Therefore the exception does not occur. However, there is an extra
 * unnecessary binding.
 *
 * @param {!Node} node Check node for placeholder bug
 * @return {void}
 */
function fixPlaceholder(node) {
  if (hasPlaceholderBug() && node.localName === 'textarea' && node.placeholder
        && node.placeholder === node.textContent) {
    node.textContent = null;
  }
}

/**
 * Copies an attribute from one element to another, converting the value to a
 * `TrustedScript` if it is named like a Polymer template event listener.
 *
 * @param {!Element} dest The element to set the attribute on
 * @param {!Element} src The element to read the attribute from
 * @param {string} name The name of the attribute
 */
const copyAttributeWithTemplateEventPolicy = (() => {
  /**
   * This `TrustedTypePolicy` is used to work around a Chrome bug in the Trusted
   * Types API where any attribute that starts with `on` may only be set to a
   * `TrustedScript` value, even if that attribute would not cause an event
   * listener to be created. (See https://crbug.com/993268 for details.)
   *
   * Polymer's template system allows `<dom-if>` and `<dom-repeat>` to be
   * written using the `<template is="...">` syntax, even if there is no UA
   * support for custom element extensions of built-in elements. In doing so, it
   * copies attributes from the original `<template>` to a newly created
   * `<dom-if>` or `<dom-repeat>`, which can trigger the bug mentioned above if
   * any of those attributes uses Polymer's `on-` syntax for event listeners.
   * (Note, the value of these `on-` listeners is not evaluated as script: it is
   * the name of a member function of a component that will be used as the event
   * listener.)
   *
   * @type {!TrustedTypePolicy|undefined}
   */
  const polymerTemplateEventAttributePolicy = window.trustedTypes &&
      window.trustedTypes.createPolicy(
          'polymer-template-event-attribute-policy', {
            createScript: x => x,
          });

  return (dest, src, name) => {
    const value = src.getAttribute(name);

    if (polymerTemplateEventAttributePolicy && name.startsWith('on-')) {
      dest.setAttribute(
          name, polymerTemplateEventAttributePolicy.createScript(value, name));
      return;
    }

    dest.setAttribute(name, value);
  };
})();

function wrapTemplateExtension(node) {
  let is = node.getAttribute('is');
  if (is && templateExtensions[is]) {
    let t = node;
    t.removeAttribute('is');
    node = t.ownerDocument.createElement(is);
    t.parentNode.replaceChild(node, t);
    node.appendChild(t);
    while(t.attributes.length) {
      const {name} = t.attributes[0];
      copyAttributeWithTemplateEventPolicy(node, t, name);
      t.removeAttribute(name);
    }
  }
  return node;
}

function findTemplateNode(root, nodeInfo) {
  // recursively ascend tree until we hit root
  let parent = nodeInfo.parentInfo && findTemplateNode(root, nodeInfo.parentInfo);
  // unwind the stack, returning the indexed node at each level
  if (parent) {
    // note: marginally faster than indexing via childNodes
    // (http://jsperf.com/childnodes-lookup)
    for (let n=parent.firstChild, i=0; n; n=n.nextSibling) {
      if (nodeInfo.parentIndex === i++) {
        return n;
      }
    }
  } else {
    return root;
  }
}

// construct `$` map (from id annotations)
function applyIdToMap(inst, map, node, nodeInfo) {
  if (nodeInfo.id) {
    map[nodeInfo.id] = node;
  }
}

// install event listeners (from event annotations)
function applyEventListener(inst, node, nodeInfo) {
  if (nodeInfo.events && nodeInfo.events.length) {
    for (let j=0, e$=nodeInfo.events, e; (j<e$.length) && (e=e$[j]); j++) {
      inst._addMethodEventListenerToNode(node, e.name, e.value, inst);
    }
  }
}

// push configuration references at configure time
function applyTemplateInfo(inst, node, nodeInfo, parentTemplateInfo) {
  if (nodeInfo.templateInfo) {
    // Give the node an instance of this templateInfo and set its parent
    node._templateInfo = nodeInfo.templateInfo;
    node._parentTemplateInfo = parentTemplateInfo;
  }
}

function createNodeEventHandler(context, eventName, methodName) {
  // Instances can optionally have a _methodHost which allows redirecting where
  // to find methods. Currently used by `templatize`.
  context = context._methodHost || context;
  let handler = function(e) {
    if (context[methodName]) {
      context[methodName](e, e.detail);
    } else {
      console.warn('listener method `' + methodName + '` not defined');
    }
  };
  return handler;
}

/**
 * Element mixin that provides basic template parsing and stamping, including
 * the following template-related features for stamped templates:
 *
 * - Declarative event listeners (`on-eventname="listener"`)
 * - Map of node id's to stamped node instances (`this.$.id`)
 * - Nested template content caching/removal and re-installation (performance
 *   optimization)
 *
 * @mixinFunction
 * @polymer
 * @summary Element class mixin that provides basic template parsing and stamping
 */
const TemplateStamp = dedupingMixin(
    /**
     * @template T
     * @param {function(new:T)} superClass Class to apply mixin to.
     * @return {function(new:T)} superClass with mixin applied.
     */
    (superClass) => {

  /**
   * @polymer
   * @mixinClass
   * @implements {Polymer_TemplateStamp}
   */
  class TemplateStamp extends superClass {

    /**
     * Scans a template to produce template metadata.
     *
     * Template-specific metadata are stored in the object returned, and node-
     * specific metadata are stored in objects in its flattened `nodeInfoList`
     * array.  Only nodes in the template that were parsed as nodes of
     * interest contain an object in `nodeInfoList`.  Each `nodeInfo` object
     * contains an `index` (`childNodes` index in parent) and optionally
     * `parent`, which points to node info of its parent (including its index).
     *
     * The template metadata object returned from this method has the following
     * structure (many fields optional):
     *
     * ```js
     *   {
     *     // Flattened list of node metadata (for nodes that generated metadata)
     *     nodeInfoList: [
     *       {
     *         // `id` attribute for any nodes with id's for generating `$` map
     *         id: {string},
     *         // `on-event="handler"` metadata
     *         events: [
     *           {
     *             name: {string},   // event name
     *             value: {string},  // handler method name
     *           }, ...
     *         ],
     *         // Notes when the template contained a `<slot>` for shady DOM
     *         // optimization purposes
     *         hasInsertionPoint: {boolean},
     *         // For nested `<template>`` nodes, nested template metadata
     *         templateInfo: {object}, // nested template metadata
     *         // Metadata to allow efficient retrieval of instanced node
     *         // corresponding to this metadata
     *         parentInfo: {number},   // reference to parent nodeInfo>
     *         parentIndex: {number},  // index in parent's `childNodes` collection
     *         infoIndex: {number},    // index of this `nodeInfo` in `templateInfo.nodeInfoList`
     *       },
     *       ...
     *     ],
     *     // When true, the template had the `strip-whitespace` attribute
     *     // or was nested in a template with that setting
     *     stripWhitespace: {boolean},
     *     // For nested templates, nested template content is moved into
     *     // a document fragment stored here; this is an optimization to
     *     // avoid the cost of nested template cloning
     *     content: {DocumentFragment}
     *   }
     * ```
     *
     * This method kicks off a recursive treewalk as follows:
     *
     * ```
     *    _parseTemplate <---------------------+
     *      _parseTemplateContent              |
     *        _parseTemplateNode  <------------|--+
     *          _parseTemplateNestedTemplate --+  |
     *          _parseTemplateChildNodes ---------+
     *          _parseTemplateNodeAttributes
     *            _parseTemplateNodeAttribute
     *
     * ```
     *
     * These methods may be overridden to add custom metadata about templates
     * to either `templateInfo` or `nodeInfo`.
     *
     * Note that this method may be destructive to the template, in that
     * e.g. event annotations may be removed after being noted in the
     * template metadata.
     *
     * @param {!HTMLTemplateElement} template Template to parse
     * @param {TemplateInfo=} outerTemplateInfo Template metadata from the outer
     *   template, for parsing nested templates
     * @return {!TemplateInfo} Parsed template metadata
     * @nocollapse
     */
    static _parseTemplate(template, outerTemplateInfo) {
      // since a template may be re-used, memo-ize metadata
      if (!template._templateInfo) {
        // TODO(rictic): fix typing
        let /** ? */ templateInfo = template._templateInfo = {};
        templateInfo.nodeInfoList = [];
        templateInfo.nestedTemplate = Boolean(outerTemplateInfo);
        templateInfo.stripWhiteSpace =
          (outerTemplateInfo && outerTemplateInfo.stripWhiteSpace) ||
          (template.hasAttribute && template.hasAttribute('strip-whitespace'));
         // TODO(rictic): fix typing
         this._parseTemplateContent(
             template, templateInfo, /** @type {?} */ ({parent: null}));
      }
      return template._templateInfo;
    }

    /**
     * See docs for _parseTemplateNode.
     *
     * @param {!HTMLTemplateElement} template .
     * @param {!TemplateInfo} templateInfo .
     * @param {!NodeInfo} nodeInfo .
     * @return {boolean} .
     * @nocollapse
     */
    static _parseTemplateContent(template, templateInfo, nodeInfo) {
      return this._parseTemplateNode(template.content, templateInfo, nodeInfo);
    }

    /**
     * Parses template node and adds template and node metadata based on
     * the current node, and its `childNodes` and `attributes`.
     *
     * This method may be overridden to add custom node or template specific
     * metadata based on this node.
     *
     * @param {Node} node Node to parse
     * @param {!TemplateInfo} templateInfo Template metadata for current template
     * @param {!NodeInfo} nodeInfo Node metadata for current template.
     * @return {boolean} `true` if the visited node added node-specific
     *   metadata to `nodeInfo`
     * @nocollapse
     */
    static _parseTemplateNode(node, templateInfo, nodeInfo) {
      let noted = false;
      let element = /** @type {!HTMLTemplateElement} */ (node);
      if (element.localName == 'template' && !element.hasAttribute('preserve-content')) {
        noted = this._parseTemplateNestedTemplate(element, templateInfo, nodeInfo) || noted;
      } else if (element.localName === 'slot') {
        // For ShadyDom optimization, indicating there is an insertion point
        templateInfo.hasInsertionPoint = true;
      }
      fixPlaceholder(element);
      if (element.firstChild) {
        this._parseTemplateChildNodes(element, templateInfo, nodeInfo);
      }
      if (element.hasAttributes && element.hasAttributes()) {
        noted = this._parseTemplateNodeAttributes(element, templateInfo, nodeInfo) || noted;
      }
      // Checking `nodeInfo.noted` allows a child node of this node (who gets
      // access to `parentInfo`) to cause the parent to be noted, which
      // otherwise has no return path via `_parseTemplateChildNodes` (used by
      // some optimizations)
      return noted || nodeInfo.noted;
    }

    /**
     * Parses template child nodes for the given root node.
     *
     * This method also wraps whitelisted legacy template extensions
     * (`is="dom-if"` and `is="dom-repeat"`) with their equivalent element
     * wrappers, collapses text nodes, and strips whitespace from the template
     * if the `templateInfo.stripWhitespace` setting was provided.
     *
     * @param {Node} root Root node whose `childNodes` will be parsed
     * @param {!TemplateInfo} templateInfo Template metadata for current template
     * @param {!NodeInfo} nodeInfo Node metadata for current template.
     * @return {void}
     */
    static _parseTemplateChildNodes(root, templateInfo, nodeInfo) {
      if (root.localName === 'script' || root.localName === 'style') {
        return;
      }
      for (let node=root.firstChild, parentIndex=0, next; node; node=next) {
        // Wrap templates
        if (node.localName == 'template') {
          node = wrapTemplateExtension(node);
        }
        // collapse adjacent textNodes: fixes an IE issue that can cause
        // text nodes to be inexplicably split =(
        // note that root.normalize() should work but does not so we do this
        // manually.
        next = node.nextSibling;
        if (node.nodeType === Node.TEXT_NODE) {
          let /** Node */ n = next;
          while (n && (n.nodeType === Node.TEXT_NODE)) {
            node.textContent += n.textContent;
            next = n.nextSibling;
            root.removeChild(n);
            n = next;
          }
          // optionally strip whitespace
          if (templateInfo.stripWhiteSpace && !node.textContent.trim()) {
            root.removeChild(node);
            continue;
          }
        }
        let childInfo =
            /** @type {!NodeInfo} */ ({parentIndex, parentInfo: nodeInfo});
        if (this._parseTemplateNode(node, templateInfo, childInfo)) {
          childInfo.infoIndex = templateInfo.nodeInfoList.push(childInfo) - 1;
        }
        // Increment if not removed
        if (node.parentNode) {
          parentIndex++;
        }
      }
    }

    /**
     * Parses template content for the given nested `<template>`.
     *
     * Nested template info is stored as `templateInfo` in the current node's
     * `nodeInfo`. `template.content` is removed and stored in `templateInfo`.
     * It will then be the responsibility of the host to set it back to the
     * template and for users stamping nested templates to use the
     * `_contentForTemplate` method to retrieve the content for this template
     * (an optimization to avoid the cost of cloning nested template content).
     *
     * @param {HTMLTemplateElement} node Node to parse (a <template>)
     * @param {TemplateInfo} outerTemplateInfo Template metadata for current template
     *   that includes the template `node`
     * @param {!NodeInfo} nodeInfo Node metadata for current template.
     * @return {boolean} `true` if the visited node added node-specific
     *   metadata to `nodeInfo`
     * @nocollapse
     */
    static _parseTemplateNestedTemplate(node, outerTemplateInfo, nodeInfo) {
      // TODO(rictic): the type of node should be non-null
      let element = /** @type {!HTMLTemplateElement} */ (node);
      let templateInfo = this._parseTemplate(element, outerTemplateInfo);
      let content = templateInfo.content =
          element.content.ownerDocument.createDocumentFragment();
      content.appendChild(element.content);
      nodeInfo.templateInfo = templateInfo;
      return true;
    }

    /**
     * Parses template node attributes and adds node metadata to `nodeInfo`
     * for nodes of interest.
     *
     * @param {Element} node Node to parse
     * @param {!TemplateInfo} templateInfo Template metadata for current
     *     template
     * @param {!NodeInfo} nodeInfo Node metadata for current template.
     * @return {boolean} `true` if the visited node added node-specific
     *   metadata to `nodeInfo`
     * @nocollapse
     */
    static _parseTemplateNodeAttributes(node, templateInfo, nodeInfo) {
      // Make copy of original attribute list, since the order may change
      // as attributes are added and removed
      let noted = false;
      let attrs = Array.from(node.attributes);
      for (let i=attrs.length-1, a; (a=attrs[i]); i--) {
        noted = this._parseTemplateNodeAttribute(node, templateInfo, nodeInfo, a.name, a.value) || noted;
      }
      return noted;
    }

    /**
     * Parses a single template node attribute and adds node metadata to
     * `nodeInfo` for attributes of interest.
     *
     * This implementation adds metadata for `on-event="handler"` attributes
     * and `id` attributes.
     *
     * @param {Element} node Node to parse
     * @param {!TemplateInfo} templateInfo Template metadata for current template
     * @param {!NodeInfo} nodeInfo Node metadata for current template.
     * @param {string} name Attribute name
     * @param {string} value Attribute value
     * @return {boolean} `true` if the visited node added node-specific
     *   metadata to `nodeInfo`
     * @nocollapse
     */
    static _parseTemplateNodeAttribute(node, templateInfo, nodeInfo, name, value) {
      // events (on-*)
      if (name.slice(0, 3) === 'on-') {
        node.removeAttribute(name);
        nodeInfo.events = nodeInfo.events || [];
        nodeInfo.events.push({
          name: name.slice(3),
          value
        });
        return true;
      }
      // static id
      else if (name === 'id') {
        nodeInfo.id = value;
        return true;
      }
      return false;
    }

    /**
     * Returns the `content` document fragment for a given template.
     *
     * For nested templates, Polymer performs an optimization to cache nested
     * template content to avoid the cost of cloning deeply nested templates.
     * This method retrieves the cached content for a given template.
     *
     * @param {HTMLTemplateElement} template Template to retrieve `content` for
     * @return {DocumentFragment} Content fragment
     * @nocollapse
     */
    static _contentForTemplate(template) {
      let templateInfo = /** @type {HTMLTemplateElementWithInfo} */ (template)._templateInfo;
      return (templateInfo && templateInfo.content) || template.content;
    }

    /**
     * Clones the provided template content and returns a document fragment
     * containing the cloned dom.
     *
     * The template is parsed (once and memoized) using this library's
     * template parsing features, and provides the following value-added
     * features:
     * * Adds declarative event listeners for `on-event="handler"` attributes
     * * Generates an "id map" for all nodes with id's under `$` on returned
     *   document fragment
     * * Passes template info including `content` back to templates as
     *   `_templateInfo` (a performance optimization to avoid deep template
     *   cloning)
     *
     * Note that the memoized template parsing process is destructive to the
     * template: attributes for bindings and declarative event listeners are
     * removed after being noted in notes, and any nested `<template>.content`
     * is removed and stored in notes as well.
     *
     * @param {!HTMLTemplateElement} template Template to stamp
     * @param {TemplateInfo=} templateInfo Optional template info associated
     *   with the template to be stamped; if omitted the template will be
     *   automatically parsed.
     * @return {!StampedTemplate} Cloned template content
     * @override
     */
    _stampTemplate(template, templateInfo) {
      // Polyfill support: bootstrap the template if it has not already been
      if (template && !template.content &&
          window.HTMLTemplateElement && HTMLTemplateElement.decorate) {
        HTMLTemplateElement.decorate(template);
      }
      // Accepting the `templateInfo` via an argument allows for creating
      // instances of the `templateInfo` by the caller, useful for adding
      // instance-time information to the prototypical data
      templateInfo = templateInfo || this.constructor._parseTemplate(template);
      let nodeInfo = templateInfo.nodeInfoList;
      let content = templateInfo.content || template.content;
      let dom = /** @type {DocumentFragment} */ (document.importNode(content, true));
      // NOTE: ShadyDom optimization indicating there is an insertion point
      dom.__noInsertionPoint = !templateInfo.hasInsertionPoint;
      let nodes = dom.nodeList = new Array(nodeInfo.length);
      dom.$ = {};
      for (let i=0, l=nodeInfo.length, info; (i<l) && (info=nodeInfo[i]); i++) {
        let node = nodes[i] = findTemplateNode(dom, info);
        applyIdToMap(this, dom.$, node, info);
        applyTemplateInfo(this, node, info, templateInfo);
        applyEventListener(this, node, info);
      }
      dom = /** @type {!StampedTemplate} */(dom); // eslint-disable-line no-self-assign
      return dom;
    }

    /**
     * Adds an event listener by method name for the event provided.
     *
     * This method generates a handler function that looks up the method
     * name at handling time.
     *
     * @param {!EventTarget} node Node to add listener on
     * @param {string} eventName Name of event
     * @param {string} methodName Name of method
     * @param {*=} context Context the method will be called on (defaults
     *   to `node`)
     * @return {Function} Generated handler function
     * @override
     */
    _addMethodEventListenerToNode(node, eventName, methodName, context) {
      context = context || node;
      let handler = createNodeEventHandler(context, eventName, methodName);
      this._addEventListenerToNode(node, eventName, handler);
      return handler;
    }

    /**
     * Override point for adding custom or simulated event handling.
     *
     * @param {!EventTarget} node Node to add event listener to
     * @param {string} eventName Name of event
     * @param {function(!Event):void} handler Listener function to add
     * @return {void}
     * @override
     */
    _addEventListenerToNode(node, eventName, handler) {
      node.addEventListener(eventName, handler);
    }

    /**
     * Override point for adding custom or simulated event handling.
     *
     * @param {!EventTarget} node Node to remove event listener from
     * @param {string} eventName Name of event
     * @param {function(!Event):void} handler Listener function to remove
     * @return {void}
     * @override
     */
    _removeEventListenerFromNode(node, eventName, handler) {
      node.removeEventListener(eventName, handler);
    }

  }

  return TemplateStamp;

});

/**
 * @fileoverview
 * @suppress {checkPrototypalTypes}
 * @license Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 * at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 * be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 * Google as part of the polymer project is also subject to an additional IP
 * rights grant found at http://polymer.github.io/PATENTS.txt
 */


// Monotonically increasing unique ID used for de-duping effects triggered
// from multiple properties in the same turn
let dedupeId = 0;

const NOOP = [];

/**
 * Property effect types; effects are stored on the prototype using these keys
 * @enum {string}
 */
const TYPES = {
  COMPUTE: '__computeEffects',
  REFLECT: '__reflectEffects',
  NOTIFY: '__notifyEffects',
  PROPAGATE: '__propagateEffects',
  OBSERVE: '__observeEffects',
  READ_ONLY: '__readOnly'
};

const COMPUTE_INFO = '__computeInfo';

/** @const {!RegExp} */
const capitalAttributeRegex = /[A-Z]/;

/**
 * Ensures that the model has an own-property map of effects for the given type.
 * The model may be a prototype or an instance.
 *
 * Property effects are stored as arrays of effects by property in a map,
 * by named type on the model. e.g.
 *
 *   __computeEffects: {
 *     foo: [ ... ],
 *     bar: [ ... ]
 *   }
 *
 * If the model does not yet have an effect map for the type, one is created
 * and returned.  If it does, but it is not an own property (i.e. the
 * prototype had effects), the the map is deeply cloned and the copy is
 * set on the model and returned, ready for new effects to be added.
 *
 * @param {Object} model Prototype or instance
 * @param {string} type Property effect type
 * @param {boolean=} cloneArrays Clone any arrays assigned to the map when
 *   extending a superclass map onto this subclass
 * @return {Object} The own-property map of effects for the given type
 * @private
 */
function ensureOwnEffectMap(model, type, cloneArrays) {
  let effects = model[type];
  if (!effects) {
    effects = model[type] = {};
  } else if (!model.hasOwnProperty(type)) {
    effects = model[type] = Object.create(model[type]);
    if (cloneArrays) {
      for (let p in effects) {
        let protoFx = effects[p];
        // Perf optimization over Array.slice
        let instFx = effects[p] = Array(protoFx.length);
        for (let i=0; i<protoFx.length; i++) {
          instFx[i] = protoFx[i];
        }
      }
    }
  }
  return effects;
}

// -- effects ----------------------------------------------

/**
 * Runs all effects of a given type for the given set of property changes
 * on an instance.
 *
 * @param {!Polymer_PropertyEffects} inst The instance with effects to run
 * @param {?Object} effects Object map of property-to-Array of effects
 * @param {?Object} props Bag of current property changes
 * @param {?Object=} oldProps Bag of previous values for changed properties
 * @param {boolean=} hasPaths True with `props` contains one or more paths
 * @param {*=} extraArgs Additional metadata to pass to effect function
 * @return {boolean} True if an effect ran for this property
 * @private
 */
function runEffects(inst, effects, props, oldProps, hasPaths, extraArgs) {
  if (effects) {
    let ran = false;
    const id = dedupeId++;
    for (let prop in props) {
      // Inline `runEffectsForProperty` for perf.
      let rootProperty = hasPaths ? root(prop) : prop;
      let fxs = effects[rootProperty];
      if (fxs) {
        for (let i=0, l=fxs.length, fx; (i<l) && (fx=fxs[i]); i++) {
          if ((!fx.info || fx.info.lastRun !== id) &&
              (!hasPaths || pathMatchesTrigger(prop, fx.trigger))) {
            if (fx.info) {
              fx.info.lastRun = id;
            }
            fx.fn(inst, prop, props, oldProps, fx.info, hasPaths, extraArgs);
            ran = true;
          }
        }
      }
    }
    return ran;
  }
  return false;
}

/**
 * Runs a list of effects for a given property.
 *
 * @param {!Polymer_PropertyEffects} inst The instance with effects to run
 * @param {!Object} effects Object map of property-to-Array of effects
 * @param {number} dedupeId Counter used for de-duping effects
 * @param {string} prop Name of changed property
 * @param {*} props Changed properties
 * @param {*} oldProps Old properties
 * @param {boolean=} hasPaths True with `props` contains one or more paths
 * @param {*=} extraArgs Additional metadata to pass to effect function
 * @return {boolean} True if an effect ran for this property
 * @private
 */
function runEffectsForProperty(inst, effects, dedupeId, prop, props, oldProps, hasPaths, extraArgs) {
  let ran = false;
  let rootProperty = hasPaths ? root(prop) : prop;
  let fxs = effects[rootProperty];
  if (fxs) {
    for (let i=0, l=fxs.length, fx; (i<l) && (fx=fxs[i]); i++) {
      if ((!fx.info || fx.info.lastRun !== dedupeId) &&
          (!hasPaths || pathMatchesTrigger(prop, fx.trigger))) {
        if (fx.info) {
          fx.info.lastRun = dedupeId;
        }
        fx.fn(inst, prop, props, oldProps, fx.info, hasPaths, extraArgs);
        ran = true;
      }
    }
  }
  return ran;
}

/**
 * Determines whether a property/path that has changed matches the trigger
 * criteria for an effect.  A trigger is a descriptor with the following
 * structure, which matches the descriptors returned from `parseArg`.
 * e.g. for `foo.bar.*`:
 * ```
 * trigger: {
 *   name: 'a.b',
 *   structured: true,
 *   wildcard: true
 * }
 * ```
 * If no trigger is given, the path is deemed to match.
 *
 * @param {string} path Path or property that changed
 * @param {?DataTrigger} trigger Descriptor
 * @return {boolean} Whether the path matched the trigger
 */
function pathMatchesTrigger(path, trigger) {
  if (trigger) {
    let triggerPath = /** @type {string} */ (trigger.name);
    return (triggerPath == path) ||
        !!(trigger.structured && isAncestor(triggerPath, path)) ||
        !!(trigger.wildcard && isDescendant(triggerPath, path));
  } else {
    return true;
  }
}

/**
 * Implements the "observer" effect.
 *
 * Calls the method with `info.methodName` on the instance, passing the
 * new and old values.
 *
 * @param {!Polymer_PropertyEffects} inst The instance the effect will be run on
 * @param {string} property Name of property
 * @param {Object} props Bag of current property changes
 * @param {Object} oldProps Bag of previous values for changed properties
 * @param {?} info Effect metadata
 * @return {void}
 * @private
 */
function runObserverEffect(inst, property, props, oldProps, info) {
  let fn = typeof info.method === "string" ? inst[info.method] : info.method;
  let changedProp = info.property;
  if (fn) {
    fn.call(inst, inst.__data[changedProp], oldProps[changedProp]);
  } else if (!info.dynamicFn) {
    console.warn('observer method `' + info.method + '` not defined');
  }
}

/**
 * Runs "notify" effects for a set of changed properties.
 *
 * This method differs from the generic `runEffects` method in that it
 * will dispatch path notification events in the case that the property
 * changed was a path and the root property for that path didn't have a
 * "notify" effect.  This is to maintain 1.0 behavior that did not require
 * `notify: true` to ensure object sub-property notifications were
 * sent.
 *
 * @param {!Polymer_PropertyEffects} inst The instance with effects to run
 * @param {Object} notifyProps Bag of properties to notify
 * @param {Object} props Bag of current property changes
 * @param {Object} oldProps Bag of previous values for changed properties
 * @param {boolean} hasPaths True with `props` contains one or more paths
 * @return {void}
 * @private
 */
function runNotifyEffects(inst, notifyProps, props, oldProps, hasPaths) {
  // Notify
  let fxs = inst[TYPES.NOTIFY];
  let notified;
  let id = dedupeId++;
  // Try normal notify effects; if none, fall back to try path notification
  for (let prop in notifyProps) {
    if (notifyProps[prop]) {
      if (fxs && runEffectsForProperty(inst, fxs, id, prop, props, oldProps, hasPaths)) {
        notified = true;
      } else if (hasPaths && notifyPath(inst, prop, props)) {
        notified = true;
      }
    }
  }
  // Flush host if we actually notified and host was batching
  // And the host has already initialized clients; this prevents
  // an issue with a host observing data changes before clients are ready.
  let host;
  if (notified && (host = inst.__dataHost) && host._invalidateProperties) {
    host._invalidateProperties();
  }
}

/**
 * Dispatches {property}-changed events with path information in the detail
 * object to indicate a sub-path of the property was changed.
 *
 * @param {!Polymer_PropertyEffects} inst The element from which to fire the
 *     event
 * @param {string} path The path that was changed
 * @param {Object} props Bag of current property changes
 * @return {boolean} Returns true if the path was notified
 * @private
 */
function notifyPath(inst, path, props) {
  let rootProperty = root(path);
  if (rootProperty !== path) {
    let eventName = camelToDashCase(rootProperty) + '-changed';
    dispatchNotifyEvent(inst, eventName, props[path], path);
    return true;
  }
  return false;
}

/**
 * Dispatches {property}-changed events to indicate a property (or path)
 * changed.
 *
 * @param {!Polymer_PropertyEffects} inst The element from which to fire the
 *     event
 * @param {string} eventName The name of the event to send
 *     ('{property}-changed')
 * @param {*} value The value of the changed property
 * @param {string | null | undefined} path If a sub-path of this property
 *     changed, the path that changed (optional).
 * @return {void}
 * @private
 * @suppress {invalidCasts}
 */
function dispatchNotifyEvent(inst, eventName, value, path) {
  let detail = {
    value: value,
    queueProperty: true
  };
  if (path) {
    detail.path = path;
  }
  // As a performance optimization, we could elide the wrap here since notifying
  // events are non-bubbling and shouldn't need retargeting. However, a very
  // small number of internal tests failed in obscure ways, which may indicate
  // user code relied on timing differences resulting from ShadyDOM flushing
  // as a result of the wrapped `dispatchEvent`.
  wrap$1(/** @type {!HTMLElement} */(inst)).dispatchEvent(new CustomEvent(eventName, { detail }));
}

/**
 * Implements the "notify" effect.
 *
 * Dispatches a non-bubbling event named `info.eventName` on the instance
 * with a detail object containing the new `value`.
 *
 * @param {!Polymer_PropertyEffects} inst The instance the effect will be run on
 * @param {string} property Name of property
 * @param {Object} props Bag of current property changes
 * @param {Object} oldProps Bag of previous values for changed properties
 * @param {?} info Effect metadata
 * @param {boolean} hasPaths True with `props` contains one or more paths
 * @return {void}
 * @private
 */
function runNotifyEffect(inst, property, props, oldProps, info, hasPaths) {
  let rootProperty = hasPaths ? root(property) : property;
  let path = rootProperty != property ? property : null;
  let value = path ? get(inst, path) : inst.__data[property];
  if (path && value === undefined) {
    value = props[property];  // specifically for .splices
  }
  dispatchNotifyEvent(inst, info.eventName, value, path);
}

/**
 * Handler function for 2-way notification events. Receives context
 * information captured in the `addNotifyListener` closure from the
 * `__notifyListeners` metadata.
 *
 * Sets the value of the notified property to the host property or path.  If
 * the event contained path information, translate that path to the host
 * scope's name for that path first.
 *
 * @param {CustomEvent} event Notification event (e.g. '<property>-changed')
 * @param {!Polymer_PropertyEffects} inst Host element instance handling the
 *     notification event
 * @param {string} fromProp Child element property that was bound
 * @param {string} toPath Host property/path that was bound
 * @param {boolean} negate Whether the binding was negated
 * @return {void}
 * @private
 */
function handleNotification(event, inst, fromProp, toPath, negate) {
  let value;
  let detail = /** @type {Object} */(event.detail);
  let fromPath = detail && detail.path;
  if (fromPath) {
    toPath = translate(fromProp, toPath, fromPath);
    value = detail && detail.value;
  } else {
    value = event.currentTarget[fromProp];
  }
  value = negate ? !value : value;
  if (!inst[TYPES.READ_ONLY] || !inst[TYPES.READ_ONLY][toPath]) {
    if (inst._setPendingPropertyOrPath(toPath, value, true, Boolean(fromPath))
      && (!detail || !detail.queueProperty)) {
      inst._invalidateProperties();
    }
  }
}

/**
 * Implements the "reflect" effect.
 *
 * Sets the attribute named `info.attrName` to the given property value.
 *
 * @param {!Polymer_PropertyEffects} inst The instance the effect will be run on
 * @param {string} property Name of property
 * @param {Object} props Bag of current property changes
 * @param {Object} oldProps Bag of previous values for changed properties
 * @param {?} info Effect metadata
 * @return {void}
 * @private
 */
function runReflectEffect(inst, property, props, oldProps, info) {
  let value = inst.__data[property];
  if (sanitizeDOMValue) {
    value = sanitizeDOMValue(value, info.attrName, 'attribute', /** @type {Node} */(inst));
  }
  inst._propertyToAttribute(property, info.attrName, value);
}

/**
 * Runs "computed" effects for a set of changed properties.
 *
 * This method differs from the generic `runEffects` method in that it
 * continues to run computed effects based on the output of each pass until
 * there are no more newly computed properties.  This ensures that all
 * properties that will be computed by the initial set of changes are
 * computed before other effects (binding propagation, observers, and notify)
 * run.
 *
 * @param {!Polymer_PropertyEffects} inst The instance the effect will be run on
 * @param {?Object} changedProps Bag of changed properties
 * @param {?Object} oldProps Bag of previous values for changed properties
 * @param {boolean} hasPaths True with `props` contains one or more paths
 * @return {void}
 * @private
 */
function runComputedEffects(inst, changedProps, oldProps, hasPaths) {
  let computeEffects = inst[TYPES.COMPUTE];
  if (computeEffects) {
    if (orderedComputed) {
      // Runs computed effects in efficient order by keeping a topologically-
      // sorted queue of compute effects to run, and inserting subsequently
      // invalidated effects as they are run
      dedupeId++;
      const order = getComputedOrder(inst);
      const queue = [];
      for (let p in changedProps) {
        enqueueEffectsFor(p, computeEffects, queue, order, hasPaths);
      }
      let info;
      while ((info = queue.shift())) {
        if (runComputedEffect(inst, '', changedProps, oldProps, info)) {
          enqueueEffectsFor(info.methodInfo, computeEffects, queue, order, hasPaths);
        }
      }
      Object.assign(/** @type {!Object} */ (oldProps), inst.__dataOld);
      Object.assign(/** @type {!Object} */ (changedProps), inst.__dataPending);
      inst.__dataPending = null;
    } else {
      // Original Polymer 2.x computed effects order, which continues running
      // effects until no further computed properties have been invalidated
      let inputProps = changedProps;
      while (runEffects(inst, computeEffects, inputProps, oldProps, hasPaths)) {
        Object.assign(/** @type {!Object} */ (oldProps), inst.__dataOld);
        Object.assign(/** @type {!Object} */ (changedProps), inst.__dataPending);
        inputProps = inst.__dataPending;
        inst.__dataPending = null;
      }
    }
  }
}

/**
 * Inserts a computed effect into a queue, given the specified order. Performs
 * the insert using a binary search.
 *
 * Used by `orderedComputed: true` computed property algorithm.
 *
 * @param {Object} info Property effects metadata
 * @param {Array<Object>} queue Ordered queue of effects
 * @param {Map<string,number>} order Map of computed property name->topological
 *   sort order
 */
const insertEffect = (info, queue, order) => {
  let start = 0;
  let end = queue.length - 1;
  let idx = -1;
  while (start <= end) {
    const mid = (start + end) >> 1;
    // Note `methodInfo` is where the computed property name is stored in
    // the effect metadata
    const cmp = order.get(queue[mid].methodInfo) - order.get(info.methodInfo);
    if (cmp < 0) {
      start = mid + 1;
    } else if (cmp > 0) {
      end = mid - 1;
    } else {
      idx = mid;
      break;
    }
  }
  if (idx < 0) {
    idx = end + 1;
  }
  queue.splice(idx, 0, info);
};

/**
 * Inserts all downstream computed effects invalidated by the specified property
 * into the topologically-sorted queue of effects to be run.
 *
 * Used by `orderedComputed: true` computed property algorithm.
 *
 * @param {string} prop Property name
 * @param {Object} computeEffects Computed effects for this element
 * @param {Array<Object>} queue Topologically-sorted queue of computed effects
 *   to be run
 * @param {Map<string,number>} order Map of computed property name->topological
 *   sort order
 * @param {boolean} hasPaths True with `changedProps` contains one or more paths
 */
const enqueueEffectsFor = (prop, computeEffects, queue, order, hasPaths) => {
  const rootProperty = hasPaths ? root(prop) : prop;
  const fxs = computeEffects[rootProperty];
  if (fxs) {
    for (let i=0; i<fxs.length; i++) {
      const fx = fxs[i];
      if ((fx.info.lastRun !== dedupeId) &&
          (!hasPaths || pathMatchesTrigger(prop, fx.trigger))) {
        fx.info.lastRun = dedupeId;
        insertEffect(fx.info, queue, order);
      }
    }
  }
};

/**
 * Generates and retrieves a memoized map of computed property name to its
 * topologically-sorted order.
 *
 * The map is generated by first assigning a "dependency count" to each property
 * (defined as number properties it depends on, including its method for
 * "dynamic functions"). Any properties that have no dependencies are added to
 * the `ready` queue, which are properties whose order can be added to the final
 * order map. Properties are popped off the `ready` queue one by one and a.) added as
 * the next property in the order map, and b.) each property that it is a
 * dependency for has its dep count decremented (and if that property's dep
 * count goes to zero, it is added to the `ready` queue), until all properties
 * have been visited and ordered.
 *
 * Used by `orderedComputed: true` computed property algorithm.
 *
 * @param {!Polymer_PropertyEffects} inst The instance to retrieve the computed
 *   effect order for.
 * @return {Map<string,number>} Map of computed property name->topological sort
 *   order
 */
function getComputedOrder(inst) {
  let ordered = inst.constructor.__orderedComputedDeps;
  if (!ordered) {
    ordered = new Map();
    const effects = inst[TYPES.COMPUTE];
    let {counts, ready, total} = dependencyCounts(inst);
    let curr;
    while ((curr = ready.shift())) {
      ordered.set(curr, ordered.size);
      const computedByCurr = effects[curr];
      if (computedByCurr) {
        computedByCurr.forEach(fx => {
          // Note `methodInfo` is where the computed property name is stored
          const computedProp = fx.info.methodInfo;
          --total;
          if (--counts[computedProp] === 0) {
            ready.push(computedProp);
          }
        });
      }
    }
    if (total !== 0) {
      const el = /** @type {HTMLElement} */ (inst);
      console.warn(`Computed graph for ${el.localName} incomplete; circular?`);
    }
    inst.constructor.__orderedComputedDeps = ordered;
  }
  return ordered;
}

/**
 * Generates a map of property-to-dependency count (`counts`, where "dependency
 * count" is the number of dependencies a given property has assuming it is a
 * computed property, otherwise 0).  It also returns a pre-populated list of
 * `ready` properties that have no dependencies and a `total` count, which is
 * used for error-checking the graph.
 *
 * Used by `orderedComputed: true` computed property algorithm.
 *
 * @param {!Polymer_PropertyEffects} inst The instance to generate dependency
 *   counts for.
 * @return {!Object} Object containing `counts` map (property-to-dependency
 *   count) and pre-populated `ready` array of properties that had zero
 *   dependencies.
 */
function dependencyCounts(inst) {
  const infoForComputed = inst[COMPUTE_INFO];
  const counts = {};
  const computedDeps = inst[TYPES.COMPUTE];
  const ready = [];
  let total = 0;
  // Count dependencies for each computed property
  for (let p in infoForComputed) {
    const info = infoForComputed[p];
    // Be sure to add the method name itself in case of "dynamic functions"
    total += counts[p] =
      info.args.filter(a => !a.literal).length + (info.dynamicFn ? 1 : 0);
  }
  // Build list of ready properties (that aren't themselves computed)
  for (let p in computedDeps) {
    if (!infoForComputed[p]) {
      ready.push(p);
    }
  }
  return {counts, ready, total};
}

/**
 * Implements the "computed property" effect by running the method with the
 * values of the arguments specified in the `info` object and setting the
 * return value to the computed property specified.
 *
 * @param {!Polymer_PropertyEffects} inst The instance the effect will be run on
 * @param {string} property Name of property
 * @param {?Object} changedProps Bag of current property changes
 * @param {?Object} oldProps Bag of previous values for changed properties
 * @param {?} info Effect metadata
 * @return {boolean} True when the property being computed changed
 * @private
 */
function runComputedEffect(inst, property, changedProps, oldProps, info) {
  // Dirty check dependencies and run if any invalid
  let result = runMethodEffect(inst, property, changedProps, oldProps, info);
  // Abort if method returns a no-op result
  if (result === NOOP) {
    return false;
  }
  let computedProp = info.methodInfo;
  if (inst.__dataHasAccessor && inst.__dataHasAccessor[computedProp]) {
    return inst._setPendingProperty(computedProp, result, true);
  } else {
    inst[computedProp] = result;
    return false;
  }
}

/**
 * Computes path changes based on path links set up using the `linkPaths`
 * API.
 *
 * @param {!Polymer_PropertyEffects} inst The instance whose props are changing
 * @param {string} path Path that has changed
 * @param {*} value Value of changed path
 * @return {void}
 * @private
 */
function computeLinkedPaths(inst, path, value) {
  let links = inst.__dataLinkedPaths;
  if (links) {
    let link;
    for (let a in links) {
      let b = links[a];
      if (isDescendant(a, path)) {
        link = translate(a, b, path);
        inst._setPendingPropertyOrPath(link, value, true, true);
      } else if (isDescendant(b, path)) {
        link = translate(b, a, path);
        inst._setPendingPropertyOrPath(link, value, true, true);
      }
    }
  }
}

// -- bindings ----------------------------------------------

/**
 * Adds binding metadata to the current `nodeInfo`, and binding effects
 * for all part dependencies to `templateInfo`.
 *
 * @param {Function} constructor Class that `_parseTemplate` is currently
 *   running on
 * @param {TemplateInfo} templateInfo Template metadata for current template
 * @param {NodeInfo} nodeInfo Node metadata for current template node
 * @param {string} kind Binding kind, either 'property', 'attribute', or 'text'
 * @param {string} target Target property name
 * @param {!Array<!BindingPart>} parts Array of binding part metadata
 * @param {string=} literal Literal text surrounding binding parts (specified
 *   only for 'property' bindings, since these must be initialized as part
 *   of boot-up)
 * @return {void}
 * @private
 */
function addBinding(constructor, templateInfo, nodeInfo, kind, target, parts, literal) {
  // Create binding metadata and add to nodeInfo
  nodeInfo.bindings = nodeInfo.bindings || [];
  let /** Binding */ binding = { kind, target, parts, literal, isCompound: (parts.length !== 1) };
  nodeInfo.bindings.push(binding);
  // Add listener info to binding metadata
  if (shouldAddListener(binding)) {
    let {event, negate} = binding.parts[0];
    binding.listenerEvent = event || (camelToDashCase(target) + '-changed');
    binding.listenerNegate = negate;
  }
  // Add "propagate" property effects to templateInfo
  let index = templateInfo.nodeInfoList.length;
  for (let i=0; i<binding.parts.length; i++) {
    let part = binding.parts[i];
    part.compoundIndex = i;
    addEffectForBindingPart(constructor, templateInfo, binding, part, index);
  }
}

/**
 * Adds property effects to the given `templateInfo` for the given binding
 * part.
 *
 * @param {Function} constructor Class that `_parseTemplate` is currently
 *   running on
 * @param {TemplateInfo} templateInfo Template metadata for current template
 * @param {!Binding} binding Binding metadata
 * @param {!BindingPart} part Binding part metadata
 * @param {number} index Index into `nodeInfoList` for this node
 * @return {void}
 */
function addEffectForBindingPart(constructor, templateInfo, binding, part, index) {
  if (!part.literal) {
    if (binding.kind === 'attribute' && binding.target[0] === '-') {
      console.warn('Cannot set attribute ' + binding.target +
        ' because "-" is not a valid attribute starting character');
    } else {
      let dependencies = part.dependencies;
      let info = { index, binding, part, evaluator: constructor };
      for (let j=0; j<dependencies.length; j++) {
        let trigger = dependencies[j];
        if (typeof trigger == 'string') {
          trigger = parseArg(trigger);
          trigger.wildcard = true;
        }
        constructor._addTemplatePropertyEffect(templateInfo, trigger.rootProperty, {
          fn: runBindingEffect,
          info, trigger
        });
      }
    }
  }
}

/**
 * Implements the "binding" (property/path binding) effect.
 *
 * Note that binding syntax is overridable via `_parseBindings` and
 * `_evaluateBinding`.  This method will call `_evaluateBinding` for any
 * non-literal parts returned from `_parseBindings`.  However,
 * there is no support for _path_ bindings via custom binding parts,
 * as this is specific to Polymer's path binding syntax.
 *
 * @param {!Polymer_PropertyEffects} inst The instance the effect will be run on
 * @param {string} path Name of property
 * @param {Object} props Bag of current property changes
 * @param {Object} oldProps Bag of previous values for changed properties
 * @param {?} info Effect metadata
 * @param {boolean} hasPaths True with `props` contains one or more paths
 * @param {Array} nodeList List of nodes associated with `nodeInfoList` template
 *   metadata
 * @return {void}
 * @private
 */
function runBindingEffect(inst, path, props, oldProps, info, hasPaths, nodeList) {
  let node = nodeList[info.index];
  let binding = info.binding;
  let part = info.part;
  // Subpath notification: transform path and set to client
  // e.g.: foo="{{obj.sub}}", path: 'obj.sub.prop', set 'foo.prop'=obj.sub.prop
  if (hasPaths && part.source && (path.length > part.source.length) &&
      (binding.kind == 'property') && !binding.isCompound &&
      node.__isPropertyEffectsClient &&
      node.__dataHasAccessor && node.__dataHasAccessor[binding.target]) {
    let value = props[path];
    path = translate(part.source, binding.target, path);
    if (node._setPendingPropertyOrPath(path, value, false, true)) {
      inst._enqueueClient(node);
    }
  } else {
    let value = info.evaluator._evaluateBinding(inst, part, path, props, oldProps, hasPaths);
    // Propagate value to child
    // Abort if value is a no-op result
    if (value !== NOOP) {
      applyBindingValue(inst, node, binding, part, value);
    }
  }
}

/**
 * Sets the value for an "binding" (binding) effect to a node,
 * either as a property or attribute.
 *
 * @param {!Polymer_PropertyEffects} inst The instance owning the binding effect
 * @param {Node} node Target node for binding
 * @param {!Binding} binding Binding metadata
 * @param {!BindingPart} part Binding part metadata
 * @param {*} value Value to set
 * @return {void}
 * @private
 */
function applyBindingValue(inst, node, binding, part, value) {
  value = computeBindingValue(node, value, binding, part);
  if (sanitizeDOMValue) {
    value = sanitizeDOMValue(value, binding.target, binding.kind, node);
  }
  if (binding.kind == 'attribute') {
    // Attribute binding
    inst._valueToNodeAttribute(/** @type {Element} */(node), value, binding.target);
  } else {
    // Property binding
    let prop = binding.target;
    if (node.__isPropertyEffectsClient &&
        node.__dataHasAccessor && node.__dataHasAccessor[prop]) {
      if (!node[TYPES.READ_ONLY] || !node[TYPES.READ_ONLY][prop]) {
        if (node._setPendingProperty(prop, value)) {
          inst._enqueueClient(node);
        }
      }
    } else {
      // In legacy no-batching mode, bindings applied before dataReady are
      // equivalent to the "apply config" phase, which only set managed props
      inst._setUnmanagedPropertyToNode(node, prop, value);
    }
  }
}

/**
 * Transforms an "binding" effect value based on compound & negation
 * effect metadata, as well as handling for special-case properties
 *
 * @param {Node} node Node the value will be set to
 * @param {*} value Value to set
 * @param {!Binding} binding Binding metadata
 * @param {!BindingPart} part Binding part metadata
 * @return {*} Transformed value to set
 * @private
 */
function computeBindingValue(node, value, binding, part) {
  if (binding.isCompound) {
    let storage = node.__dataCompoundStorage[binding.target];
    storage[part.compoundIndex] = value;
    value = storage.join('');
  }
  if (binding.kind !== 'attribute') {
    // Some browsers serialize `undefined` to `"undefined"`
    if (binding.target === 'textContent' ||
        (binding.target === 'value' &&
          (node.localName === 'input' || node.localName === 'textarea'))) {
      value = value == undefined ? '' : value;
    }
  }
  return value;
}

/**
 * Returns true if a binding's metadata meets all the requirements to allow
 * 2-way binding, and therefore a `<property>-changed` event listener should be
 * added:
 * - used curly braces
 * - is a property (not attribute) binding
 * - is not a textContent binding
 * - is not compound
 *
 * @param {!Binding} binding Binding metadata
 * @return {boolean} True if 2-way listener should be added
 * @private
 */
function shouldAddListener(binding) {
  return Boolean(binding.target) &&
         binding.kind != 'attribute' &&
         binding.kind != 'text' &&
         !binding.isCompound &&
         binding.parts[0].mode === '{';
}

/**
 * Setup compound binding storage structures, notify listeners, and dataHost
 * references onto the bound nodeList.
 *
 * @param {!Polymer_PropertyEffects} inst Instance that bas been previously
 *     bound
 * @param {TemplateInfo} templateInfo Template metadata
 * @return {void}
 * @private
 */
function setupBindings(inst, templateInfo) {
  // Setup compound storage, dataHost, and notify listeners
  let {nodeList, nodeInfoList} = templateInfo;
  if (nodeInfoList.length) {
    for (let i=0; i < nodeInfoList.length; i++) {
      let info = nodeInfoList[i];
      let node = nodeList[i];
      let bindings = info.bindings;
      if (bindings) {
        for (let i=0; i<bindings.length; i++) {
          let binding = bindings[i];
          setupCompoundStorage(node, binding);
          addNotifyListener(node, inst, binding);
        }
      }
      // This ensures all bound elements have a host set, regardless
      // of whether they upgrade synchronous to creation
      node.__dataHost = inst;
    }
  }
}

/**
 * Initializes `__dataCompoundStorage` local storage on a bound node with
 * initial literal data for compound bindings, and sets the joined
 * literal parts to the bound property.
 *
 * When changes to compound parts occur, they are first set into the compound
 * storage array for that property, and then the array is joined to result in
 * the final value set to the property/attribute.
 *
 * @param {Node} node Bound node to initialize
 * @param {Binding} binding Binding metadata
 * @return {void}
 * @private
 */
function setupCompoundStorage(node, binding) {
  if (binding.isCompound) {
    // Create compound storage map
    let storage = node.__dataCompoundStorage ||
      (node.__dataCompoundStorage = {});
    let parts = binding.parts;
    // Copy literals from parts into storage for this binding
    let literals = new Array(parts.length);
    for (let j=0; j<parts.length; j++) {
      literals[j] = parts[j].literal;
    }
    let target = binding.target;
    storage[target] = literals;
    // Configure properties with their literal parts
    if (binding.literal && binding.kind == 'property') {
      // Note, className needs style scoping so this needs wrapping.
      // We may also want to consider doing this for `textContent` and
      // `innerHTML`.
      if (target === 'className') {
        node = wrap$1(node);
      }
      node[target] = binding.literal;
    }
  }
}

/**
 * Adds a 2-way binding notification event listener to the node specified
 *
 * @param {Object} node Child element to add listener to
 * @param {!Polymer_PropertyEffects} inst Host element instance to handle
 *     notification event
 * @param {Binding} binding Binding metadata
 * @return {void}
 * @private
 */
function addNotifyListener(node, inst, binding) {
  if (binding.listenerEvent) {
    let part = binding.parts[0];
    node.addEventListener(binding.listenerEvent, function(e) {
      handleNotification(e, inst, binding.target, part.source, part.negate);
    });
  }
}

// -- for method-based effects (complexObserver & computed) --------------

/**
 * Adds property effects for each argument in the method signature (and
 * optionally, for the method name if `dynamic` is true) that calls the
 * provided effect function.
 *
 * @param {Element | Object} model Prototype or instance
 * @param {!MethodSignature} sig Method signature metadata
 * @param {string} type Type of property effect to add
 * @param {Function} effectFn Function to run when arguments change
 * @param {*=} methodInfo Effect-specific information to be included in
 *   method effect metadata
 * @param {boolean|Object=} dynamicFn Boolean or object map indicating whether
 *   method names should be included as a dependency to the effect. Note,
 *   defaults to true if the signature is static (sig.static is true).
 * @return {!Object} Effect metadata for this method effect
 * @private
 */
function createMethodEffect(model, sig, type, effectFn, methodInfo, dynamicFn) {
  dynamicFn = sig.static || (dynamicFn &&
    (typeof dynamicFn !== 'object' || dynamicFn[sig.methodName]));
  let info = {
    methodName: sig.methodName,
    args: sig.args,
    methodInfo,
    dynamicFn
  };
  for (let i=0, arg; (i<sig.args.length) && (arg=sig.args[i]); i++) {
    if (!arg.literal) {
      model._addPropertyEffect(arg.rootProperty, type, {
        fn: effectFn, info: info, trigger: arg
      });
    }
  }
  if (dynamicFn) {
    model._addPropertyEffect(sig.methodName, type, {
      fn: effectFn, info: info
    });
  }
  return info;
}

/**
 * Calls a method with arguments marshaled from properties on the instance
 * based on the method signature contained in the effect metadata.
 *
 * Multi-property observers, computed properties, and inline computing
 * functions call this function to invoke the method, then use the return
 * value accordingly.
 *
 * @param {!Polymer_PropertyEffects} inst The instance the effect will be run on
 * @param {string} property Name of property
 * @param {Object} props Bag of current property changes
 * @param {Object} oldProps Bag of previous values for changed properties
 * @param {?} info Effect metadata
 * @return {*} Returns the return value from the method invocation
 * @private
 */
function runMethodEffect(inst, property, props, oldProps, info) {
  // Instances can optionally have a _methodHost which allows redirecting where
  // to find methods. Currently used by `templatize`.
  let context = inst._methodHost || inst;
  let fn = context[info.methodName];
  if (fn) {
    let args = inst._marshalArgs(info.args, property, props);
    return args === NOOP ? NOOP : fn.apply(context, args);
  } else if (!info.dynamicFn) {
    console.warn('method `' + info.methodName + '` not defined');
  }
}

const emptyArray = [];

// Regular expressions used for binding
const IDENT  = '(?:' + '[a-zA-Z_$][\\w.:$\\-*]*' + ')';
const NUMBER = '(?:' + '[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?' + ')';
const SQUOTE_STRING = '(?:' + '\'(?:[^\'\\\\]|\\\\.)*\'' + ')';
const DQUOTE_STRING = '(?:' + '"(?:[^"\\\\]|\\\\.)*"' + ')';
const STRING = '(?:' + SQUOTE_STRING + '|' + DQUOTE_STRING + ')';
const ARGUMENT = '(?:(' + IDENT + '|' + NUMBER + '|' +  STRING + ')\\s*' + ')';
const ARGUMENTS = '(?:' + ARGUMENT + '(?:,\\s*' + ARGUMENT + ')*' + ')';
const ARGUMENT_LIST = '(?:' + '\\(\\s*' +
                              '(?:' + ARGUMENTS + '?' + ')' +
                            '\\)\\s*' + ')';
const BINDING = '(' + IDENT + '\\s*' + ARGUMENT_LIST + '?' + ')'; // Group 3
const OPEN_BRACKET = '(\\[\\[|{{)' + '\\s*';
const CLOSE_BRACKET = '(?:]]|}})';
const NEGATE = '(?:(!)\\s*)?'; // Group 2
const EXPRESSION = OPEN_BRACKET + NEGATE + BINDING + CLOSE_BRACKET;
const bindingRegex = new RegExp(EXPRESSION, "g");

/**
 * Create a string from binding parts of all the literal parts
 *
 * @param {!Array<BindingPart>} parts All parts to stringify
 * @return {string} String made from the literal parts
 */
function literalFromParts(parts) {
  let s = '';
  for (let i=0; i<parts.length; i++) {
    let literal = parts[i].literal;
    s += literal || '';
  }
  return s;
}

/**
 * Parses an expression string for a method signature, and returns a metadata
 * describing the method in terms of `methodName`, `static` (whether all the
 * arguments are literals), and an array of `args`
 *
 * @param {string} expression The expression to parse
 * @return {?MethodSignature} The method metadata object if a method expression was
 *   found, otherwise `undefined`
 * @private
 */
function parseMethod(expression) {
  // tries to match valid javascript property names
  let m = expression.match(/([^\s]+?)\(([\s\S]*)\)/);
  if (m) {
    let methodName = m[1];
    let sig = { methodName, static: true, args: emptyArray };
    if (m[2].trim()) {
      // replace escaped commas with comma entity, split on un-escaped commas
      let args = m[2].replace(/\\,/g, '&comma;').split(',');
      return parseArgs(args, sig);
    } else {
      return sig;
    }
  }
  return null;
}

/**
 * Parses an array of arguments and sets the `args` property of the supplied
 * signature metadata object. Sets the `static` property to false if any
 * argument is a non-literal.
 *
 * @param {!Array<string>} argList Array of argument names
 * @param {!MethodSignature} sig Method signature metadata object
 * @return {!MethodSignature} The updated signature metadata object
 * @private
 */
function parseArgs(argList, sig) {
  sig.args = argList.map(function(rawArg) {
    let arg = parseArg(rawArg);
    if (!arg.literal) {
      sig.static = false;
    }
    return arg;
  }, this);
  return sig;
}

/**
 * Parses an individual argument, and returns an argument metadata object
 * with the following fields:
 *
 *   {
 *     value: 'prop',        // property/path or literal value
 *     literal: false,       // whether argument is a literal
 *     structured: false,    // whether the property is a path
 *     rootProperty: 'prop', // the root property of the path
 *     wildcard: false       // whether the argument was a wildcard '.*' path
 *   }
 *
 * @param {string} rawArg The string value of the argument
 * @return {!MethodArg} Argument metadata object
 * @private
 */
function parseArg(rawArg) {
  // clean up whitespace
  let arg = rawArg.trim()
    // replace comma entity with comma
    .replace(/&comma;/g, ',')
    // repair extra escape sequences; note only commas strictly need
    // escaping, but we allow any other char to be escaped since its
    // likely users will do this
    .replace(/\\(.)/g, '$1')
    ;
  // basic argument descriptor
  let a = {
    name: arg,
    value: '',
    literal: false
  };
  // detect literal value (must be String or Number)
  let fc = arg[0];
  if (fc === '-') {
    fc = arg[1];
  }
  if (fc >= '0' && fc <= '9') {
    fc = '#';
  }
  switch(fc) {
    case "'":
    case '"':
      a.value = arg.slice(1, -1);
      a.literal = true;
      break;
    case '#':
      a.value = Number(arg);
      a.literal = true;
      break;
  }
  // if not literal, look for structured path
  if (!a.literal) {
    a.rootProperty = root(arg);
    // detect structured path (has dots)
    a.structured = isPath(arg);
    if (a.structured) {
      a.wildcard = (arg.slice(-2) == '.*');
      if (a.wildcard) {
        a.name = arg.slice(0, -2);
      }
    }
  }
  return a;
}

function getArgValue(data, props, path) {
  let value = get(data, path);
  // when data is not stored e.g. `splices`, get the value from changedProps
  // TODO(kschaaf): Note, this can cause a rare issue where the wildcard
  // info.value could pull a stale value out of changedProps during a reentrant
  // change that sets the value back to undefined.
  // https://github.com/Polymer/polymer/issues/5479
  if (value === undefined) {
    value = props[path];
  }
  return value;
}

// data api

/**
 * Sends array splice notifications (`.splices` and `.length`)
 *
 * Note: this implementation only accepts normalized paths
 *
 * @param {!Polymer_PropertyEffects} inst Instance to send notifications to
 * @param {Array} array The array the mutations occurred on
 * @param {string} path The path to the array that was mutated
 * @param {Array} splices Array of splice records
 * @return {void}
 * @private
 */
function notifySplices(inst, array, path, splices) {
  const splicesData = { indexSplices: splices };
  // Legacy behavior stored splices in `__data__` so it was *not* ephemeral.
  // To match this behavior, we store splices directly on the array.
  if (legacyUndefined && !inst._overrideLegacyUndefined) {
    array.splices = splicesData;
  }
  inst.notifyPath(path + '.splices', splicesData);
  inst.notifyPath(path + '.length', array.length);
  // Clear splice data only when it's stored on the array.
  if (legacyUndefined && !inst._overrideLegacyUndefined) {
    splicesData.indexSplices = [];
  }
}

/**
 * Creates a splice record and sends an array splice notification for
 * the described mutation
 *
 * Note: this implementation only accepts normalized paths
 *
 * @param {!Polymer_PropertyEffects} inst Instance to send notifications to
 * @param {Array} array The array the mutations occurred on
 * @param {string} path The path to the array that was mutated
 * @param {number} index Index at which the array mutation occurred
 * @param {number} addedCount Number of added items
 * @param {Array} removed Array of removed items
 * @return {void}
 * @private
 */
function notifySplice(inst, array, path, index, addedCount, removed) {
  notifySplices(inst, array, path, [{
    index: index,
    addedCount: addedCount,
    removed: removed,
    object: array,
    type: 'splice'
  }]);
}

/**
 * Returns an upper-cased version of the string.
 *
 * @param {string} name String to uppercase
 * @return {string} Uppercased string
 * @private
 */
function upper(name) {
  return name[0].toUpperCase() + name.substring(1);
}

/**
 * Element class mixin that provides meta-programming for Polymer's template
 * binding and data observation (collectively, "property effects") system.
 *
 * This mixin uses provides the following key static methods for adding
 * property effects to an element class:
 * - `addPropertyEffect`
 * - `createPropertyObserver`
 * - `createMethodObserver`
 * - `createNotifyingProperty`
 * - `createReadOnlyProperty`
 * - `createReflectedProperty`
 * - `createComputedProperty`
 * - `bindTemplate`
 *
 * Each method creates one or more property accessors, along with metadata
 * used by this mixin's implementation of `_propertiesChanged` to perform
 * the property effects.
 *
 * Underscored versions of the above methods also exist on the element
 * prototype for adding property effects on instances at runtime.
 *
 * Note that this mixin overrides several `PropertyAccessors` methods, in
 * many cases to maintain guarantees provided by the Polymer 1.x features;
 * notably it changes property accessors to be synchronous by default
 * whereas the default when using `PropertyAccessors` standalone is to be
 * async by default.
 *
 * @mixinFunction
 * @polymer
 * @appliesMixin TemplateStamp
 * @appliesMixin PropertyAccessors
 * @summary Element class mixin that provides meta-programming for Polymer's
 * template binding and data observation system.
 */
const PropertyEffects = dedupingMixin(superClass => {

  /**
   * @constructor
   * @implements {Polymer_PropertyAccessors}
   * @implements {Polymer_TemplateStamp}
   * @unrestricted
   * @private
   */
  const propertyEffectsBase = TemplateStamp(PropertyAccessors(superClass));

  /**
   * @polymer
   * @mixinClass
   * @implements {Polymer_PropertyEffects}
   * @extends {propertyEffectsBase}
   * @unrestricted
   */
  class PropertyEffects extends propertyEffectsBase {

    constructor() {
      super();
      /** @type {boolean} */
      // Used to identify users of this mixin, ala instanceof
      this.__isPropertyEffectsClient = true;
      /** @type {boolean} */
      this.__dataClientsReady;
      /** @type {Array} */
      this.__dataPendingClients;
      /** @type {Object} */
      this.__dataToNotify;
      /** @type {Object} */
      this.__dataLinkedPaths;
      /** @type {boolean} */
      this.__dataHasPaths;
      /** @type {Object} */
      this.__dataCompoundStorage;
      /** @type {Polymer_PropertyEffects} */
      this.__dataHost;
      /** @type {!Object} */
      this.__dataTemp;
      /** @type {boolean} */
      this.__dataClientsInitialized;
      /** @type {!Object} */
      this.__data;
      /** @type {!Object|null} */
      this.__dataPending;
      /** @type {!Object} */
      this.__dataOld;
      /** @type {Object} */
      this.__computeEffects;
      /** @type {Object} */
      this.__computeInfo;
      /** @type {Object} */
      this.__reflectEffects;
      /** @type {Object} */
      this.__notifyEffects;
      /** @type {Object} */
      this.__propagateEffects;
      /** @type {Object} */
      this.__observeEffects;
      /** @type {Object} */
      this.__readOnly;
      /** @type {!TemplateInfo} */
      this.__templateInfo;
      /** @type {boolean} */
      this._overrideLegacyUndefined;
    }

    get PROPERTY_EFFECT_TYPES() {
      return TYPES;
    }

    /**
     * @override
     * @return {void}
     */
    _initializeProperties() {
      super._initializeProperties();
      this._registerHost();
      this.__dataClientsReady = false;
      this.__dataPendingClients = null;
      this.__dataToNotify = null;
      this.__dataLinkedPaths = null;
      this.__dataHasPaths = false;
      // May be set on instance prior to upgrade
      this.__dataCompoundStorage = this.__dataCompoundStorage || null;
      this.__dataHost = this.__dataHost || null;
      this.__dataTemp = {};
      this.__dataClientsInitialized = false;
    }

    _registerHost() {
      if (hostStack.length) {
        let host = hostStack[hostStack.length-1];
        host._enqueueClient(this);
        // This ensures even non-bound elements have a host set, as
        // long as they upgrade synchronously
        this.__dataHost = host;
      }
    }

    /**
     * Overrides `PropertyAccessors` implementation to provide a
     * more efficient implementation of initializing properties from
     * the prototype on the instance.
     *
     * @override
     * @param {Object} props Properties to initialize on the prototype
     * @return {void}
     */
    _initializeProtoProperties(props) {
      this.__data = Object.create(props);
      this.__dataPending = Object.create(props);
      this.__dataOld = {};
    }

    /**
     * Overrides `PropertyAccessors` implementation to avoid setting
     * `_setProperty`'s `shouldNotify: true`.
     *
     * @override
     * @param {Object} props Properties to initialize on the instance
     * @return {void}
     */
    _initializeInstanceProperties(props) {
      let readOnly = this[TYPES.READ_ONLY];
      for (let prop in props) {
        if (!readOnly || !readOnly[prop]) {
          this.__dataPending = this.__dataPending || {};
          this.__dataOld = this.__dataOld || {};
          this.__data[prop] = this.__dataPending[prop] = props[prop];
        }
      }
    }

    // Prototype setup ----------------------------------------

    /**
     * Equivalent to static `addPropertyEffect` API but can be called on
     * an instance to add effects at runtime.  See that method for
     * full API docs.
     *
     * @override
     * @param {string} property Property that should trigger the effect
     * @param {string} type Effect type, from this.PROPERTY_EFFECT_TYPES
     * @param {Object=} effect Effect metadata object
     * @return {void}
     * @protected
     */
    _addPropertyEffect(property, type, effect) {
      this._createPropertyAccessor(property, type == TYPES.READ_ONLY);
      // effects are accumulated into arrays per property based on type
      let effects = ensureOwnEffectMap(this, type, true)[property];
      if (!effects) {
        effects = this[type][property] = [];
      }
      effects.push(effect);
    }

    /**
     * Removes the given property effect.
     *
     * @override
     * @param {string} property Property the effect was associated with
     * @param {string} type Effect type, from this.PROPERTY_EFFECT_TYPES
     * @param {Object=} effect Effect metadata object to remove
     * @return {void}
     */
    _removePropertyEffect(property, type, effect) {
      let effects = ensureOwnEffectMap(this, type, true)[property];
      let idx = effects.indexOf(effect);
      if (idx >= 0) {
        effects.splice(idx, 1);
      }
    }

    /**
     * Returns whether the current prototype/instance has a property effect
     * of a certain type.
     *
     * @override
     * @param {string} property Property name
     * @param {string=} type Effect type, from this.PROPERTY_EFFECT_TYPES
     * @return {boolean} True if the prototype/instance has an effect of this
     *     type
     * @protected
     */
    _hasPropertyEffect(property, type) {
      let effects = this[type];
      return Boolean(effects && effects[property]);
    }

    /**
     * Returns whether the current prototype/instance has a "read only"
     * accessor for the given property.
     *
     * @override
     * @param {string} property Property name
     * @return {boolean} True if the prototype/instance has an effect of this
     *     type
     * @protected
     */
    _hasReadOnlyEffect(property) {
      return this._hasPropertyEffect(property, TYPES.READ_ONLY);
    }

    /**
     * Returns whether the current prototype/instance has a "notify"
     * property effect for the given property.
     *
     * @override
     * @param {string} property Property name
     * @return {boolean} True if the prototype/instance has an effect of this
     *     type
     * @protected
     */
    _hasNotifyEffect(property) {
      return this._hasPropertyEffect(property, TYPES.NOTIFY);
    }

    /**
     * Returns whether the current prototype/instance has a "reflect to
     * attribute" property effect for the given property.
     *
     * @override
     * @param {string} property Property name
     * @return {boolean} True if the prototype/instance has an effect of this
     *     type
     * @protected
     */
    _hasReflectEffect(property) {
      return this._hasPropertyEffect(property, TYPES.REFLECT);
    }

    /**
     * Returns whether the current prototype/instance has a "computed"
     * property effect for the given property.
     *
     * @override
     * @param {string} property Property name
     * @return {boolean} True if the prototype/instance has an effect of this
     *     type
     * @protected
     */
    _hasComputedEffect(property) {
      return this._hasPropertyEffect(property, TYPES.COMPUTE);
    }

    // Runtime ----------------------------------------

    /**
     * Sets a pending property or path.  If the root property of the path in
     * question had no accessor, the path is set, otherwise it is enqueued
     * via `_setPendingProperty`.
     *
     * This function isolates relatively expensive functionality necessary
     * for the public API (`set`, `setProperties`, `notifyPath`, and property
     * change listeners via {{...}} bindings), such that it is only done
     * when paths enter the system, and not at every propagation step.  It
     * also sets a `__dataHasPaths` flag on the instance which is used to
     * fast-path slower path-matching code in the property effects host paths.
     *
     * `path` can be a path string or array of path parts as accepted by the
     * public API.
     *
     * @override
     * @param {string | !Array<number|string>} path Path to set
     * @param {*} value Value to set
     * @param {boolean=} shouldNotify Set to true if this change should
     *  cause a property notification event dispatch
     * @param {boolean=} isPathNotification If the path being set is a path
     *   notification of an already changed value, as opposed to a request
     *   to set and notify the change.  In the latter `false` case, a dirty
     *   check is performed and then the value is set to the path before
     *   enqueuing the pending property change.
     * @return {boolean} Returns true if the property/path was enqueued in
     *   the pending changes bag.
     * @protected
     */
    _setPendingPropertyOrPath(path, value, shouldNotify, isPathNotification) {
      if (isPathNotification ||
          root(Array.isArray(path) ? path[0] : path) !== path) {
        // Dirty check changes being set to a path against the actual object,
        // since this is the entry point for paths into the system; from here
        // the only dirty checks are against the `__dataTemp` cache to prevent
        // duplicate work in the same turn only. Note, if this was a notification
        // of a change already set to a path (isPathNotification: true),
        // we always let the change through and skip the `set` since it was
        // already dirty checked at the point of entry and the underlying
        // object has already been updated
        if (!isPathNotification) {
          let old = get(this, path);
          path = /** @type {string} */ (set(this, path, value));
          // Use property-accessor's simpler dirty check
          if (!path || !super._shouldPropertyChange(path, value, old)) {
            return false;
          }
        }
        this.__dataHasPaths = true;
        if (this._setPendingProperty(/**@type{string}*/(path), value, shouldNotify)) {
          computeLinkedPaths(this, /**@type{string}*/ (path), value);
          return true;
        }
      } else {
        if (this.__dataHasAccessor && this.__dataHasAccessor[path]) {
          return this._setPendingProperty(/**@type{string}*/(path), value, shouldNotify);
        } else {
          this[path] = value;
        }
      }
      return false;
    }

    /**
     * Applies a value to a non-Polymer element/node's property.
     *
     * The implementation makes a best-effort at binding interop:
     * Some native element properties have side-effects when
     * re-setting the same value (e.g. setting `<input>.value` resets the
     * cursor position), so we do a dirty-check before setting the value.
     * However, for better interop with non-Polymer custom elements that
     * accept objects, we explicitly re-set object changes coming from the
     * Polymer world (which may include deep object changes without the
     * top reference changing), erring on the side of providing more
     * information.
     *
     * Users may override this method to provide alternate approaches.
     *
     * @override
     * @param {!Node} node The node to set a property on
     * @param {string} prop The property to set
     * @param {*} value The value to set
     * @return {void}
     * @protected
     */
    _setUnmanagedPropertyToNode(node, prop, value) {
      // It is a judgment call that resetting primitives is
      // "bad" and resettings objects is also "good"; alternatively we could
      // implement a whitelist of tag & property values that should never
      // be reset (e.g. <input>.value && <select>.value)
      if (value !== node[prop] || typeof value == 'object') {
        // Note, className needs style scoping so this needs wrapping.
        if (prop === 'className') {
          node = /** @type {!Node} */(wrap$1(node));
        }
        node[prop] = value;
      }
    }

    /**
     * Overrides the `PropertiesChanged` implementation to introduce special
     * dirty check logic depending on the property & value being set:
     *
     * 1. Any value set to a path (e.g. 'obj.prop': 42 or 'obj.prop': {...})
     *    Stored in `__dataTemp`, dirty checked against `__dataTemp`
     * 2. Object set to simple property (e.g. 'prop': {...})
     *    Stored in `__dataTemp` and `__data`, dirty checked against
     *    `__dataTemp` by default implementation of `_shouldPropertyChange`
     * 3. Primitive value set to simple property (e.g. 'prop': 42)
     *    Stored in `__data`, dirty checked against `__data`
     *
     * The dirty-check is important to prevent cycles due to two-way
     * notification, but paths and objects are only dirty checked against any
     * previous value set during this turn via a "temporary cache" that is
     * cleared when the last `_propertiesChanged` exits. This is so:
     * a. any cached array paths (e.g. 'array.3.prop') may be invalidated
     *    due to array mutations like shift/unshift/splice; this is fine
     *    since path changes are dirty-checked at user entry points like `set`
     * b. dirty-checking for objects only lasts one turn to allow the user
     *    to mutate the object in-place and re-set it with the same identity
     *    and have all sub-properties re-propagated in a subsequent turn.
     *
     * The temp cache is not necessarily sufficient to prevent invalid array
     * paths, since a splice can happen during the same turn (with pathological
     * user code); we could introduce a "fixup" for temporarily cached array
     * paths if needed: https://github.com/Polymer/polymer/issues/4227
     *
     * @override
     * @param {string} property Name of the property
     * @param {*} value Value to set
     * @param {boolean=} shouldNotify True if property should fire notification
     *   event (applies only for `notify: true` properties)
     * @return {boolean} Returns true if the property changed
     */
    _setPendingProperty(property, value, shouldNotify) {
      let propIsPath = this.__dataHasPaths && isPath(property);
      let prevProps = propIsPath ? this.__dataTemp : this.__data;
      if (this._shouldPropertyChange(property, value, prevProps[property])) {
        if (!this.__dataPending) {
          this.__dataPending = {};
          this.__dataOld = {};
        }
        // Ensure old is captured from the last turn
        if (!(property in this.__dataOld)) {
          this.__dataOld[property] = this.__data[property];
        }
        // Paths are stored in temporary cache (cleared at end of turn),
        // which is used for dirty-checking, all others stored in __data
        if (propIsPath) {
          this.__dataTemp[property] = value;
        } else {
          this.__data[property] = value;
        }
        // All changes go into pending property bag, passed to _propertiesChanged
        this.__dataPending[property] = value;
        // Track properties that should notify separately
        if (propIsPath || (this[TYPES.NOTIFY] && this[TYPES.NOTIFY][property])) {
          this.__dataToNotify = this.__dataToNotify || {};
          this.__dataToNotify[property] = shouldNotify;
        }
        return true;
      }
      return false;
    }

    /**
     * Overrides base implementation to ensure all accessors set `shouldNotify`
     * to true, for per-property notification tracking.
     *
     * @override
     * @param {string} property Name of the property
     * @param {*} value Value to set
     * @return {void}
     */
    _setProperty(property, value) {
      if (this._setPendingProperty(property, value, true)) {
        this._invalidateProperties();
      }
    }

    /**
     * Overrides `PropertyAccessor`'s default async queuing of
     * `_propertiesChanged`: if `__dataReady` is false (has not yet been
     * manually flushed), the function no-ops; otherwise flushes
     * `_propertiesChanged` synchronously.
     *
     * @override
     * @return {void}
     */
    _invalidateProperties() {
      if (this.__dataReady) {
        this._flushProperties();
      }
    }

    /**
     * Enqueues the given client on a list of pending clients, whose
     * pending property changes can later be flushed via a call to
     * `_flushClients`.
     *
     * @override
     * @param {Object} client PropertyEffects client to enqueue
     * @return {void}
     * @protected
     */
    _enqueueClient(client) {
      this.__dataPendingClients = this.__dataPendingClients || [];
      if (client !== this) {
        this.__dataPendingClients.push(client);
      }
    }

    /**
     * Flushes any clients previously enqueued via `_enqueueClient`, causing
     * their `_flushProperties` method to run.
     *
     * @override
     * @return {void}
     * @protected
     */
    _flushClients() {
      if (!this.__dataClientsReady) {
        this.__dataClientsReady = true;
        this._readyClients();
        // Override point where accessors are turned on; importantly,
        // this is after clients have fully readied, providing a guarantee
        // that any property effects occur only after all clients are ready.
        this.__dataReady = true;
      } else {
        this.__enableOrFlushClients();
      }
    }

    // NOTE: We ensure clients either enable or flush as appropriate. This
    // handles two corner cases:
    // (1) clients flush properly when connected/enabled before the host
    // enables; e.g.
    //   (a) Templatize stamps with no properties and does not flush and
    //   (b) the instance is inserted into dom and
    //   (c) then the instance flushes.
    // (2) clients enable properly when not connected/enabled when the host
    // flushes; e.g.
    //   (a) a template is runtime stamped and not yet connected/enabled
    //   (b) a host sets a property, causing stamped dom to flush
    //   (c) the stamped dom enables.
    __enableOrFlushClients() {
      let clients = this.__dataPendingClients;
      if (clients) {
        this.__dataPendingClients = null;
        for (let i=0; i < clients.length; i++) {
          let client = clients[i];
          if (!client.__dataEnabled) {
            client._enableProperties();
          } else if (client.__dataPending) {
            client._flushProperties();
          }
        }
      }
    }

    /**
     * Perform any initial setup on client dom. Called before the first
     * `_flushProperties` call on client dom and before any element
     * observers are called.
     *
     * @override
     * @return {void}
     * @protected
     */
    _readyClients() {
      this.__enableOrFlushClients();
    }

    /**
     * Sets a bag of property changes to this instance, and
     * synchronously processes all effects of the properties as a batch.
     *
     * Property names must be simple properties, not paths.  Batched
     * path propagation is not supported.
     *
     * @override
     * @param {Object} props Bag of one or more key-value pairs whose key is
     *   a property and value is the new value to set for that property.
     * @param {boolean=} setReadOnly When true, any private values set in
     *   `props` will be set. By default, `setProperties` will not set
     *   `readOnly: true` root properties.
     * @return {void}
     * @public
     */
    setProperties(props, setReadOnly) {
      for (let path in props) {
        if (setReadOnly || !this[TYPES.READ_ONLY] || !this[TYPES.READ_ONLY][path]) {
          //TODO(kschaaf): explicitly disallow paths in setProperty?
          // wildcard observers currently only pass the first changed path
          // in the `info` object, and you could do some odd things batching
          // paths, e.g. {'foo.bar': {...}, 'foo': null}
          this._setPendingPropertyOrPath(path, props[path], true);
        }
      }
      this._invalidateProperties();
    }

    /**
     * Overrides `PropertyAccessors` so that property accessor
     * side effects are not enabled until after client dom is fully ready.
     * Also calls `_flushClients` callback to ensure client dom is enabled
     * that was not enabled as a result of flushing properties.
     *
     * @override
     * @return {void}
     */
    ready() {
      // It is important that `super.ready()` is not called here as it
      // immediately turns on accessors. Instead, we wait until `readyClients`
      // to enable accessors to provide a guarantee that clients are ready
      // before processing any accessors side effects.
      this._flushProperties();
      // If no data was pending, `_flushProperties` will not `flushClients`
      // so ensure this is done.
      if (!this.__dataClientsReady) {
        this._flushClients();
      }
      // Before ready, client notifications do not trigger _flushProperties.
      // Therefore a flush is necessary here if data has been set.
      if (this.__dataPending) {
        this._flushProperties();
      }
    }

    /**
     * Implements `PropertyAccessors`'s properties changed callback.
     *
     * Runs each class of effects for the batch of changed properties in
     * a specific order (compute, propagate, reflect, observe, notify).
     *
     * @override
     * @param {!Object} currentProps Bag of all current accessor values
     * @param {?Object} changedProps Bag of properties changed since the last
     *   call to `_propertiesChanged`
     * @param {?Object} oldProps Bag of previous values for each property
     *   in `changedProps`
     * @return {void}
     */
    _propertiesChanged(currentProps, changedProps, oldProps) {
      // ----------------------------
      // let c = Object.getOwnPropertyNames(changedProps || {});
      // window.debug && console.group(this.localName + '#' + this.id + ': ' + c);
      // if (window.debug) { debugger; }
      // ----------------------------
      let hasPaths = this.__dataHasPaths;
      this.__dataHasPaths = false;
      let notifyProps;
      // Compute properties
      runComputedEffects(this, changedProps, oldProps, hasPaths);
      // Clear notify properties prior to possible reentry (propagate, observe),
      // but after computing effects have a chance to add to them
      notifyProps = this.__dataToNotify;
      this.__dataToNotify = null;
      // Propagate properties to clients
      this._propagatePropertyChanges(changedProps, oldProps, hasPaths);
      // Flush clients
      this._flushClients();
      // Reflect properties
      runEffects(this, this[TYPES.REFLECT], changedProps, oldProps, hasPaths);
      // Observe properties
      runEffects(this, this[TYPES.OBSERVE], changedProps, oldProps, hasPaths);
      // Notify properties to host
      if (notifyProps) {
        runNotifyEffects(this, notifyProps, changedProps, oldProps, hasPaths);
      }
      // Clear temporary cache at end of turn
      if (this.__dataCounter == 1) {
        this.__dataTemp = {};
      }
      // ----------------------------
      // window.debug && console.groupEnd(this.localName + '#' + this.id + ': ' + c);
      // ----------------------------
    }

    /**
     * Called to propagate any property changes to stamped template nodes
     * managed by this element.
     *
     * @override
     * @param {Object} changedProps Bag of changed properties
     * @param {Object} oldProps Bag of previous values for changed properties
     * @param {boolean} hasPaths True with `props` contains one or more paths
     * @return {void}
     * @protected
     */
    _propagatePropertyChanges(changedProps, oldProps, hasPaths) {
      if (this[TYPES.PROPAGATE]) {
        runEffects(this, this[TYPES.PROPAGATE], changedProps, oldProps, hasPaths);
      }
      if (this.__templateInfo) {
        this._runEffectsForTemplate(this.__templateInfo, changedProps, oldProps, hasPaths);
      }
    }

    _runEffectsForTemplate(templateInfo, changedProps, oldProps, hasPaths) {
      const baseRunEffects = (changedProps, hasPaths) => {
        runEffects(this, templateInfo.propertyEffects, changedProps, oldProps,
          hasPaths, templateInfo.nodeList);
        for (let info=templateInfo.firstChild; info; info=info.nextSibling) {
          this._runEffectsForTemplate(info, changedProps, oldProps, hasPaths);
        }
      };
      if (templateInfo.runEffects) {
        templateInfo.runEffects(baseRunEffects, changedProps, hasPaths);
      } else {
        baseRunEffects(changedProps, hasPaths);
      }
    }

    /**
     * Aliases one data path as another, such that path notifications from one
     * are routed to the other.
     *
     * @override
     * @param {string | !Array<string|number>} to Target path to link.
     * @param {string | !Array<string|number>} from Source path to link.
     * @return {void}
     * @public
     */
    linkPaths(to, from) {
      to = normalize(to);
      from = normalize(from);
      this.__dataLinkedPaths = this.__dataLinkedPaths || {};
      this.__dataLinkedPaths[to] = from;
    }

    /**
     * Removes a data path alias previously established with `_linkPaths`.
     *
     * Note, the path to unlink should be the target (`to`) used when
     * linking the paths.
     *
     * @override
     * @param {string | !Array<string|number>} path Target path to unlink.
     * @return {void}
     * @public
     */
    unlinkPaths(path) {
      path = normalize(path);
      if (this.__dataLinkedPaths) {
        delete this.__dataLinkedPaths[path];
      }
    }

    /**
     * Notify that an array has changed.
     *
     * Example:
     *
     *     this.items = [ {name: 'Jim'}, {name: 'Todd'}, {name: 'Bill'} ];
     *     ...
     *     this.items.splice(1, 1, {name: 'Sam'});
     *     this.items.push({name: 'Bob'});
     *     this.notifySplices('items', [
     *       { index: 1, removed: [{name: 'Todd'}], addedCount: 1,
     *         object: this.items, type: 'splice' },
     *       { index: 3, removed: [], addedCount: 1,
     *         object: this.items, type: 'splice'}
     *     ]);
     *
     * @param {string} path Path that should be notified.
     * @param {Array} splices Array of splice records indicating ordered
     *   changes that occurred to the array. Each record should have the
     *   following fields:
     *    * index: index at which the change occurred
     *    * removed: array of items that were removed from this index
     *    * addedCount: number of new items added at this index
     *    * object: a reference to the array in question
     *    * type: the string literal 'splice'
     *
     *   Note that splice records _must_ be normalized such that they are
     *   reported in index order (raw results from `Object.observe` are not
     *   ordered and must be normalized/merged before notifying).
     *
     * @override
     * @return {void}
     * @public
     */
    notifySplices(path, splices) {
      let info = {path: ''};
      let array = /** @type {Array} */(get(this, path, info));
      notifySplices(this, array, info.path, splices);
    }

    /**
     * Convenience method for reading a value from a path.
     *
     * Note, if any part in the path is undefined, this method returns
     * `undefined` (this method does not throw when dereferencing undefined
     * paths).
     *
     * @override
     * @param {(string|!Array<(string|number)>)} path Path to the value
     *   to read.  The path may be specified as a string (e.g. `foo.bar.baz`)
     *   or an array of path parts (e.g. `['foo.bar', 'baz']`).  Note that
     *   bracketed expressions are not supported; string-based path parts
     *   *must* be separated by dots.  Note that when dereferencing array
     *   indices, the index may be used as a dotted part directly
     *   (e.g. `users.12.name` or `['users', 12, 'name']`).
     * @param {Object=} root Root object from which the path is evaluated.
     * @return {*} Value at the path, or `undefined` if any part of the path
     *   is undefined.
     * @public
     */
    get(path, root) {
      return get(root || this, path);
    }

    /**
     * Convenience method for setting a value to a path and notifying any
     * elements bound to the same path.
     *
     * Note, if any part in the path except for the last is undefined,
     * this method does nothing (this method does not throw when
     * dereferencing undefined paths).
     *
     * @override
     * @param {(string|!Array<(string|number)>)} path Path to the value
     *   to write.  The path may be specified as a string (e.g. `'foo.bar.baz'`)
     *   or an array of path parts (e.g. `['foo.bar', 'baz']`).  Note that
     *   bracketed expressions are not supported; string-based path parts
     *   *must* be separated by dots.  Note that when dereferencing array
     *   indices, the index may be used as a dotted part directly
     *   (e.g. `'users.12.name'` or `['users', 12, 'name']`).
     * @param {*} value Value to set at the specified path.
     * @param {Object=} root Root object from which the path is evaluated.
     *   When specified, no notification will occur.
     * @return {void}
     * @public
     */
    set(path, value, root) {
      if (root) {
        set(root, path, value);
      } else {
        if (!this[TYPES.READ_ONLY] || !this[TYPES.READ_ONLY][/** @type {string} */(path)]) {
          if (this._setPendingPropertyOrPath(path, value, true)) {
            this._invalidateProperties();
          }
        }
      }
    }

    /**
     * Adds items onto the end of the array at the path specified.
     *
     * The arguments after `path` and return value match that of
     * `Array.prototype.push`.
     *
     * This method notifies other paths to the same array that a
     * splice occurred to the array.
     *
     * @override
     * @param {string | !Array<string|number>} path Path to array.
     * @param {...*} items Items to push onto array
     * @return {number} New length of the array.
     * @public
     */
    push(path, ...items) {
      let info = {path: ''};
      let array = /** @type {Array}*/(get(this, path, info));
      let len = array.length;
      let ret = array.push(...items);
      if (items.length) {
        notifySplice(this, array, info.path, len, items.length, []);
      }
      return ret;
    }

    /**
     * Removes an item from the end of array at the path specified.
     *
     * The arguments after `path` and return value match that of
     * `Array.prototype.pop`.
     *
     * This method notifies other paths to the same array that a
     * splice occurred to the array.
     *
     * @override
     * @param {string | !Array<string|number>} path Path to array.
     * @return {*} Item that was removed.
     * @public
     */
    pop(path) {
      let info = {path: ''};
      let array = /** @type {Array} */(get(this, path, info));
      let hadLength = Boolean(array.length);
      let ret = array.pop();
      if (hadLength) {
        notifySplice(this, array, info.path, array.length, 0, [ret]);
      }
      return ret;
    }

    /**
     * Starting from the start index specified, removes 0 or more items
     * from the array and inserts 0 or more new items in their place.
     *
     * The arguments after `path` and return value match that of
     * `Array.prototype.splice`.
     *
     * This method notifies other paths to the same array that a
     * splice occurred to the array.
     *
     * @override
     * @param {string | !Array<string|number>} path Path to array.
     * @param {number} start Index from which to start removing/inserting.
     * @param {number=} deleteCount Number of items to remove.
     * @param {...*} items Items to insert into array.
     * @return {!Array} Array of removed items.
     * @public
     */
    splice(path, start, deleteCount, ...items) {
      let info = {path : ''};
      let array = /** @type {Array} */(get(this, path, info));
      // Normalize fancy native splice handling of crazy start values
      if (start < 0) {
        start = array.length - Math.floor(-start);
      } else if (start) {
        start = Math.floor(start);
      }
      // array.splice does different things based on the number of arguments
      // you pass in. Therefore, array.splice(0) and array.splice(0, undefined)
      // do different things. In the former, the whole array is cleared. In the
      // latter, no items are removed.
      // This means that we need to detect whether 1. one of the arguments
      // is actually passed in and then 2. determine how many arguments
      // we should pass on to the native array.splice
      //
      let ret;
      // Omit any additional arguments if they were not passed in
      if (arguments.length === 2) {
        ret = array.splice(start);
      // Either start was undefined and the others were defined, but in this
      // case we can safely pass on all arguments
      //
      // Note: this includes the case where none of the arguments were passed in,
      // e.g. this.splice('array'). However, if both start and deleteCount
      // are undefined, array.splice will not modify the array (as expected)
      } else {
        ret = array.splice(start, deleteCount, ...items);
      }
      // At the end, check whether any items were passed in (e.g. insertions)
      // or if the return array contains items (e.g. deletions).
      // Only notify if items were added or deleted.
      if (items.length || ret.length) {
        notifySplice(this, array, info.path, start, items.length, ret);
      }
      return ret;
    }

    /**
     * Removes an item from the beginning of array at the path specified.
     *
     * The arguments after `path` and return value match that of
     * `Array.prototype.pop`.
     *
     * This method notifies other paths to the same array that a
     * splice occurred to the array.
     *
     * @override
     * @param {string | !Array<string|number>} path Path to array.
     * @return {*} Item that was removed.
     * @public
     */
    shift(path) {
      let info = {path: ''};
      let array = /** @type {Array} */(get(this, path, info));
      let hadLength = Boolean(array.length);
      let ret = array.shift();
      if (hadLength) {
        notifySplice(this, array, info.path, 0, 0, [ret]);
      }
      return ret;
    }

    /**
     * Adds items onto the beginning of the array at the path specified.
     *
     * The arguments after `path` and return value match that of
     * `Array.prototype.push`.
     *
     * This method notifies other paths to the same array that a
     * splice occurred to the array.
     *
     * @override
     * @param {string | !Array<string|number>} path Path to array.
     * @param {...*} items Items to insert info array
     * @return {number} New length of the array.
     * @public
     */
    unshift(path, ...items) {
      let info = {path: ''};
      let array = /** @type {Array} */(get(this, path, info));
      let ret = array.unshift(...items);
      if (items.length) {
        notifySplice(this, array, info.path, 0, items.length, []);
      }
      return ret;
    }

    /**
     * Notify that a path has changed.
     *
     * Example:
     *
     *     this.item.user.name = 'Bob';
     *     this.notifyPath('item.user.name');
     *
     * @override
     * @param {string} path Path that should be notified.
     * @param {*=} value Value at the path (optional).
     * @return {void}
     * @public
     */
    notifyPath(path, value) {
      /** @type {string} */
      let propPath;
      if (arguments.length == 1) {
        // Get value if not supplied
        let info = {path: ''};
        value = get(this, path, info);
        propPath = info.path;
      } else if (Array.isArray(path)) {
        // Normalize path if needed
        propPath = normalize(path);
      } else {
        propPath = /** @type{string} */(path);
      }
      if (this._setPendingPropertyOrPath(propPath, value, true, true)) {
        this._invalidateProperties();
      }
    }

    /**
     * Equivalent to static `createReadOnlyProperty` API but can be called on
     * an instance to add effects at runtime.  See that method for
     * full API docs.
     *
     * @override
     * @param {string} property Property name
     * @param {boolean=} protectedSetter Creates a custom protected setter
     *   when `true`.
     * @return {void}
     * @protected
     */
    _createReadOnlyProperty(property, protectedSetter) {
      this._addPropertyEffect(property, TYPES.READ_ONLY);
      if (protectedSetter) {
        this['_set' + upper(property)] = /** @this {PropertyEffects} */function(value) {
          this._setProperty(property, value);
        };
      }
    }

    /**
     * Equivalent to static `createPropertyObserver` API but can be called on
     * an instance to add effects at runtime.  See that method for
     * full API docs.
     *
     * @override
     * @param {string} property Property name
     * @param {string|function(*,*)} method Function or name of observer method
     *     to call
     * @param {boolean=} dynamicFn Whether the method name should be included as
     *   a dependency to the effect.
     * @return {void}
     * @protected
     */
    _createPropertyObserver(property, method, dynamicFn) {
      let info = { property, method, dynamicFn: Boolean(dynamicFn) };
      this._addPropertyEffect(property, TYPES.OBSERVE, {
        fn: runObserverEffect, info, trigger: {name: property}
      });
      if (dynamicFn) {
        this._addPropertyEffect(/** @type {string} */(method), TYPES.OBSERVE, {
          fn: runObserverEffect, info, trigger: {name: method}
        });
      }
    }

    /**
     * Equivalent to static `createMethodObserver` API but can be called on
     * an instance to add effects at runtime.  See that method for
     * full API docs.
     *
     * @override
     * @param {string} expression Method expression
     * @param {boolean|Object=} dynamicFn Boolean or object map indicating
     *   whether method names should be included as a dependency to the effect.
     * @return {void}
     * @protected
     */
    _createMethodObserver(expression, dynamicFn) {
      let sig = parseMethod(expression);
      if (!sig) {
        throw new Error("Malformed observer expression '" + expression + "'");
      }
      createMethodEffect(this, sig, TYPES.OBSERVE, runMethodEffect, null, dynamicFn);
    }

    /**
     * Equivalent to static `createNotifyingProperty` API but can be called on
     * an instance to add effects at runtime.  See that method for
     * full API docs.
     *
     * @override
     * @param {string} property Property name
     * @return {void}
     * @protected
     */
    _createNotifyingProperty(property) {
      this._addPropertyEffect(property, TYPES.NOTIFY, {
        fn: runNotifyEffect,
        info: {
          eventName: camelToDashCase(property) + '-changed',
          property: property
        }
      });
    }

    /**
     * Equivalent to static `createReflectedProperty` API but can be called on
     * an instance to add effects at runtime.  See that method for
     * full API docs.
     *
     * @override
     * @param {string} property Property name
     * @return {void}
     * @protected
     * @suppress {missingProperties} go/missingfnprops
     */
    _createReflectedProperty(property) {
      let attr = this.constructor.attributeNameForProperty(property);
      if (attr[0] === '-') {
        console.warn('Property ' + property + ' cannot be reflected to attribute ' +
          attr + ' because "-" is not a valid starting attribute name. Use a lowercase first letter for the property instead.');
      } else {
        this._addPropertyEffect(property, TYPES.REFLECT, {
          fn: runReflectEffect,
          info: {
            attrName: attr
          }
        });
      }
    }

    /**
     * Equivalent to static `createComputedProperty` API but can be called on
     * an instance to add effects at runtime.  See that method for
     * full API docs.
     *
     * @override
     * @param {string} property Name of computed property to set
     * @param {string} expression Method expression
     * @param {boolean|Object=} dynamicFn Boolean or object map indicating
     *   whether method names should be included as a dependency to the effect.
     * @return {void}
     * @protected
     */
    _createComputedProperty(property, expression, dynamicFn) {
      let sig = parseMethod(expression);
      if (!sig) {
        throw new Error("Malformed computed expression '" + expression + "'");
      }
      const info = createMethodEffect(this, sig, TYPES.COMPUTE, runComputedEffect, property, dynamicFn);
      // Effects are normally stored as map of dependency->effect, but for
      // ordered computation, we also need tree of computedProp->dependencies
      ensureOwnEffectMap(this, COMPUTE_INFO)[property] = info;
    }

    /**
     * Gather the argument values for a method specified in the provided array
     * of argument metadata.
     *
     * The `path` and `value` arguments are used to fill in wildcard descriptor
     * when the method is being called as a result of a path notification.
     *
     * @param {!Array<!MethodArg>} args Array of argument metadata
     * @param {string} path Property/path name that triggered the method effect
     * @param {Object} props Bag of current property changes
     * @return {!Array<*>} Array of argument values
     * @private
     */
    _marshalArgs(args, path, props) {
      const data = this.__data;
      const values = [];
      for (let i=0, l=args.length; i<l; i++) {
        let {name, structured, wildcard, value, literal} = args[i];
        if (!literal) {
          if (wildcard) {
            const matches = isDescendant(name, path);
            const pathValue = getArgValue(data, props, matches ? path : name);
            value = {
              path: matches ? path : name,
              value: pathValue,
              base: matches ? get(data, name) : pathValue
            };
          } else {
            value = structured ? getArgValue(data, props, name) : data[name];
          }
        }
        // When the `legacyUndefined` flag is enabled, pass a no-op value
        // so that the observer, computed property, or compound binding is aborted.
        if (legacyUndefined && !this._overrideLegacyUndefined && value === undefined && args.length > 1) {
          return NOOP;
        }
        values[i] = value;
      }
      return values;
    }

    // -- static class methods ------------

    /**
     * Ensures an accessor exists for the specified property, and adds
     * to a list of "property effects" that will run when the accessor for
     * the specified property is set.  Effects are grouped by "type", which
     * roughly corresponds to a phase in effect processing.  The effect
     * metadata should be in the following form:
     *
     *     {
     *       fn: effectFunction, // Reference to function to call to perform effect
     *       info: { ... }       // Effect metadata passed to function
     *       trigger: {          // Optional triggering metadata; if not provided
     *         name: string      // the property is treated as a wildcard
     *         structured: boolean
     *         wildcard: boolean
     *       }
     *     }
     *
     * Effects are called from `_propertiesChanged` in the following order by
     * type:
     *
     * 1. COMPUTE
     * 2. PROPAGATE
     * 3. REFLECT
     * 4. OBSERVE
     * 5. NOTIFY
     *
     * Effect functions are called with the following signature:
     *
     *     effectFunction(inst, path, props, oldProps, info, hasPaths)
     *
     * @param {string} property Property that should trigger the effect
     * @param {string} type Effect type, from this.PROPERTY_EFFECT_TYPES
     * @param {Object=} effect Effect metadata object
     * @return {void}
     * @protected
     * @nocollapse
     */
    static addPropertyEffect(property, type, effect) {
      this.prototype._addPropertyEffect(property, type, effect);
    }

    /**
     * Creates a single-property observer for the given property.
     *
     * @param {string} property Property name
     * @param {string|function(*,*)} method Function or name of observer method to call
     * @param {boolean=} dynamicFn Whether the method name should be included as
     *   a dependency to the effect.
     * @return {void}
     * @protected
     * @nocollapse
     */
    static createPropertyObserver(property, method, dynamicFn) {
      this.prototype._createPropertyObserver(property, method, dynamicFn);
    }

    /**
     * Creates a multi-property "method observer" based on the provided
     * expression, which should be a string in the form of a normal JavaScript
     * function signature: `'methodName(arg1, [..., argn])'`.  Each argument
     * should correspond to a property or path in the context of this
     * prototype (or instance), or may be a literal string or number.
     *
     * @param {string} expression Method expression
     * @param {boolean|Object=} dynamicFn Boolean or object map indicating
     * @return {void}
     *   whether method names should be included as a dependency to the effect.
     * @protected
     * @nocollapse
     */
    static createMethodObserver(expression, dynamicFn) {
      this.prototype._createMethodObserver(expression, dynamicFn);
    }

    /**
     * Causes the setter for the given property to dispatch `<property>-changed`
     * events to notify of changes to the property.
     *
     * @param {string} property Property name
     * @return {void}
     * @protected
     * @nocollapse
     */
    static createNotifyingProperty(property) {
      this.prototype._createNotifyingProperty(property);
    }

    /**
     * Creates a read-only accessor for the given property.
     *
     * To set the property, use the protected `_setProperty` API.
     * To create a custom protected setter (e.g. `_setMyProp()` for
     * property `myProp`), pass `true` for `protectedSetter`.
     *
     * Note, if the property will have other property effects, this method
     * should be called first, before adding other effects.
     *
     * @param {string} property Property name
     * @param {boolean=} protectedSetter Creates a custom protected setter
     *   when `true`.
     * @return {void}
     * @protected
     * @nocollapse
     */
    static createReadOnlyProperty(property, protectedSetter) {
      this.prototype._createReadOnlyProperty(property, protectedSetter);
    }

    /**
     * Causes the setter for the given property to reflect the property value
     * to a (dash-cased) attribute of the same name.
     *
     * @param {string} property Property name
     * @return {void}
     * @protected
     * @nocollapse
     */
    static createReflectedProperty(property) {
      this.prototype._createReflectedProperty(property);
    }

    /**
     * Creates a computed property whose value is set to the result of the
     * method described by the given `expression` each time one or more
     * arguments to the method changes.  The expression should be a string
     * in the form of a normal JavaScript function signature:
     * `'methodName(arg1, [..., argn])'`
     *
     * @param {string} property Name of computed property to set
     * @param {string} expression Method expression
     * @param {boolean|Object=} dynamicFn Boolean or object map indicating whether
     *   method names should be included as a dependency to the effect.
     * @return {void}
     * @protected
     * @nocollapse
     */
    static createComputedProperty(property, expression, dynamicFn) {
      this.prototype._createComputedProperty(property, expression, dynamicFn);
    }

    /**
     * Parses the provided template to ensure binding effects are created
     * for them, and then ensures property accessors are created for any
     * dependent properties in the template.  Binding effects for bound
     * templates are stored in a linked list on the instance so that
     * templates can be efficiently stamped and unstamped.
     *
     * @param {!HTMLTemplateElement} template Template containing binding
     *   bindings
     * @return {!TemplateInfo} Template metadata object
     * @protected
     * @nocollapse
     */
    static bindTemplate(template) {
      return this.prototype._bindTemplate(template);
    }

    // -- binding ----------------------------------------------

    /*
     * Overview of binding flow:
     *
     * During finalization (`instanceBinding==false`, `wasPreBound==false`):
     *  `_bindTemplate(t, false)` called directly during finalization - parses
     *  the template (for the first time), and then assigns that _prototypical_
     *  template info to `__preboundTemplateInfo` _on the prototype_; note in
     *  this case `wasPreBound` is false; this is the first time we're binding
     *  it, thus we create accessors.
     *
     * During first stamping (`instanceBinding==true`, `wasPreBound==true`):
     *   `_stampTemplate` calls `_bindTemplate(t, true)`: the `templateInfo`
     *   returned matches the prebound one, and so this is `wasPreBound == true`
     *   state; thus we _skip_ creating accessors, but _do_ create an instance
     *   of the template info to serve as the start of our linked list (needs to
     *   be an instance, not the prototypical one, so that we can add `nodeList`
     *   to it to contain the `nodeInfo`-ordered list of instance nodes for
     *   bindings, and so we can chain runtime-stamped template infos off of
     *   it). At this point, the call to `_stampTemplate` calls
     *   `applyTemplateInfo` for each nested `<template>` found during parsing
     *   to hand prototypical `_templateInfo` to them; we also pass the _parent_
     *   `templateInfo` to the `<template>` so that we have the instance-time
     *   parent to link the `templateInfo` under in the case it was
     *   runtime-stamped.
     *
     * During subsequent runtime stamping (`instanceBinding==true`,
     *   `wasPreBound==false`): `_stampTemplate` calls `_bindTemplate(t, true)`
     *   - here `templateInfo` is guaranteed to _not_ match the prebound one,
     *   because it was either a different template altogether, or even if it
     *   was the same template, the step above created a instance of the info;
     *   in this case `wasPreBound == false`, so we _do_ create accessors, _and_
     *   link a instance into the linked list.
     */

    /**
     * Equivalent to static `bindTemplate` API but can be called on an instance
     * to add effects at runtime.  See that method for full API docs.
     *
     * This method may be called on the prototype (for prototypical template
     * binding, to avoid creating accessors every instance) once per prototype,
     * and will be called with `runtimeBinding: true` by `_stampTemplate` to
     * create and link an instance of the template metadata associated with a
     * particular stamping.
     *
     * @override
     * @param {!HTMLTemplateElement} template Template containing binding
     * bindings
     * @param {boolean=} instanceBinding When false (default), performs
     * "prototypical" binding of the template and overwrites any previously
     * bound template for the class. When true (as passed from
     * `_stampTemplate`), the template info is instanced and linked into the
     * list of bound templates.
     * @return {!TemplateInfo} Template metadata object; for `runtimeBinding`,
     * this is an instance of the prototypical template info
     * @protected
     * @suppress {missingProperties} go/missingfnprops
     */
    _bindTemplate(template, instanceBinding) {
      let templateInfo = this.constructor._parseTemplate(template);
      let wasPreBound = this.__preBoundTemplateInfo == templateInfo;
      // Optimization: since this is called twice for proto-bound templates,
      // don't attempt to recreate accessors if this template was pre-bound
      if (!wasPreBound) {
        for (let prop in templateInfo.propertyEffects) {
          this._createPropertyAccessor(prop);
        }
      }
      if (instanceBinding) {
        // For instance-time binding, create instance of template metadata
        // and link into tree of templates if necessary
        templateInfo = /** @type {!TemplateInfo} */(Object.create(templateInfo));
        templateInfo.wasPreBound = wasPreBound;
        if (!this.__templateInfo) {
          // Set the info to the root of the tree
          this.__templateInfo = templateInfo;
        } else {
          // Append this template info onto the end of its parent template's
          // list, which will determine the tree structure via which property
          // effects are run; if this template was not nested in another
          // template, use the root template (the first stamped one) as the
          // parent. Note, `parent` is the `templateInfo` instance for this
          // template's parent (containing) template, which was set up in
          // `applyTemplateInfo`.  While a given template's `parent` is set
          // apriori, it is only added to the parent's child list at the point
          // that it is being bound, since a template may or may not ever be
          // stamped, and may be stamped more than once (in which case instances
          // of the template info will be in the tree under its parent more than
          // once).
          const parent = template._parentTemplateInfo || this.__templateInfo;
          const previous = parent.lastChild;
          templateInfo.parent = parent;
          parent.lastChild = templateInfo;
          templateInfo.previousSibling = previous;
          if (previous) {
            previous.nextSibling = templateInfo;
          } else {
            parent.firstChild = templateInfo;
          }
        }
      } else {
        this.__preBoundTemplateInfo = templateInfo;
      }
      return templateInfo;
    }

    /**
     * Adds a property effect to the given template metadata, which is run
     * at the "propagate" stage of `_propertiesChanged` when the template
     * has been bound to the element via `_bindTemplate`.
     *
     * The `effect` object should match the format in `_addPropertyEffect`.
     *
     * @param {Object} templateInfo Template metadata to add effect to
     * @param {string} prop Property that should trigger the effect
     * @param {Object=} effect Effect metadata object
     * @return {void}
     * @protected
     * @nocollapse
     */
    static _addTemplatePropertyEffect(templateInfo, prop, effect) {
      let hostProps = templateInfo.hostProps = templateInfo.hostProps || {};
      hostProps[prop] = true;
      let effects = templateInfo.propertyEffects = templateInfo.propertyEffects || {};
      let propEffects = effects[prop] = effects[prop] || [];
      propEffects.push(effect);
    }

    /**
     * Stamps the provided template and performs instance-time setup for
     * Polymer template features, including data bindings, declarative event
     * listeners, and the `this.$` map of `id`'s to nodes.  A document fragment
     * is returned containing the stamped DOM, ready for insertion into the
     * DOM.
     *
     * This method may be called more than once; however note that due to
     * `shadycss` polyfill limitations, only styles from templates prepared
     * using `ShadyCSS.prepareTemplate` will be correctly polyfilled (scoped
     * to the shadow root and support CSS custom properties), and note that
     * `ShadyCSS.prepareTemplate` may only be called once per element. As such,
     * any styles required by in runtime-stamped templates must be included
     * in the main element template.
     *
     * @param {!HTMLTemplateElement} template Template to stamp
     * @param {TemplateInfo=} templateInfo Optional bound template info associated
     *   with the template to be stamped; if omitted the template will be
     *   automatically bound.
     * @return {!StampedTemplate} Cloned template content
     * @override
     * @protected
     */
    _stampTemplate(template, templateInfo) {
      templateInfo =  templateInfo || /** @type {!TemplateInfo} */(this._bindTemplate(template, true));
      // Ensures that created dom is `_enqueueClient`'d to this element so
      // that it can be flushed on next call to `_flushProperties`
      hostStack.push(this);
      let dom = super._stampTemplate(template, templateInfo);
      hostStack.pop();
      // Add template-instance-specific data to instanced templateInfo
      templateInfo.nodeList = dom.nodeList;
      // Capture child nodes to allow unstamping of non-prototypical templates
      if (!templateInfo.wasPreBound) {
        let nodes = templateInfo.childNodes = [];
        for (let n=dom.firstChild; n; n=n.nextSibling) {
          nodes.push(n);
        }
      }
      dom.templateInfo = templateInfo;
      // Setup compound storage, 2-way listeners, and dataHost for bindings
      setupBindings(this, templateInfo);
      // Flush properties into template nodes; the check on `__dataClientsReady`
      // ensures we don't needlessly run effects for an element's initial
      // prototypical template stamping since they will happen as a part of the
      // first call to `_propertiesChanged`. This flag is set to true
      // after running the initial propagate effects, and immediately before
      // flushing clients. Since downstream clients could cause stamping on
      // this host (e.g. a fastDomIf `dom-if` being forced to render
      // synchronously), this flag ensures effects for runtime-stamped templates
      // are run at this point during the initial element boot-up.
      if (this.__dataClientsReady) {
        this._runEffectsForTemplate(templateInfo, this.__data, null, false);
        this._flushClients();
      }
      return dom;
    }

    /**
     * Removes and unbinds the nodes previously contained in the provided
     * DocumentFragment returned from `_stampTemplate`.
     *
     * @override
     * @param {!StampedTemplate} dom DocumentFragment previously returned
     *   from `_stampTemplate` associated with the nodes to be removed
     * @return {void}
     * @protected
     */
    _removeBoundDom(dom) {
      // Unlink template info; Note that while the child is unlinked from its
      // parent list, a template's `parent` reference is never removed, since
      // this is is determined by the tree structure and applied at
      // `applyTemplateInfo` time.
      const templateInfo = dom.templateInfo;
      const {previousSibling, nextSibling, parent} = templateInfo;
      if (previousSibling) {
        previousSibling.nextSibling = nextSibling;
      } else if (parent) {
        parent.firstChild = nextSibling;
      }
      if (nextSibling) {
        nextSibling.previousSibling = previousSibling;
      } else if (parent) {
        parent.lastChild = previousSibling;
      }
      templateInfo.nextSibling = templateInfo.previousSibling = null;
      // Remove stamped nodes
      let nodes = templateInfo.childNodes;
      for (let i=0; i<nodes.length; i++) {
        let node = nodes[i];
        wrap$1(wrap$1(node).parentNode).removeChild(node);
      }
    }

    /**
     * Overrides default `TemplateStamp` implementation to add support for
     * parsing bindings from `TextNode`'s' `textContent`.  A `bindings`
     * array is added to `nodeInfo` and populated with binding metadata
     * with information capturing the binding target, and a `parts` array
     * with one or more metadata objects capturing the source(s) of the
     * binding.
     *
     * @param {Node} node Node to parse
     * @param {TemplateInfo} templateInfo Template metadata for current template
     * @param {NodeInfo} nodeInfo Node metadata for current template node
     * @return {boolean} `true` if the visited node added node-specific
     *   metadata to `nodeInfo`
     * @protected
     * @suppress {missingProperties} Interfaces in closure do not inherit statics, but classes do
     * @nocollapse
     */
    static _parseTemplateNode(node, templateInfo, nodeInfo) {
      // TODO(https://github.com/google/closure-compiler/issues/3240):
      //     Change back to just super.methodCall()
      let noted = propertyEffectsBase._parseTemplateNode.call(
        this, node, templateInfo, nodeInfo);
      if (node.nodeType === Node.TEXT_NODE) {
        let parts = this._parseBindings(node.textContent, templateInfo);
        if (parts) {
          // Initialize the textContent with any literal parts
          // NOTE: default to a space here so the textNode remains; some browsers
          // (IE) omit an empty textNode following cloneNode/importNode.
          node.textContent = literalFromParts(parts) || ' ';
          addBinding(this, templateInfo, nodeInfo, 'text', 'textContent', parts);
          noted = true;
        }
      }
      return noted;
    }

    /**
     * Overrides default `TemplateStamp` implementation to add support for
     * parsing bindings from attributes.  A `bindings`
     * array is added to `nodeInfo` and populated with binding metadata
     * with information capturing the binding target, and a `parts` array
     * with one or more metadata objects capturing the source(s) of the
     * binding.
     *
     * @param {Element} node Node to parse
     * @param {TemplateInfo} templateInfo Template metadata for current template
     * @param {NodeInfo} nodeInfo Node metadata for current template node
     * @param {string} name Attribute name
     * @param {string} value Attribute value
     * @return {boolean} `true` if the visited node added node-specific
     *   metadata to `nodeInfo`
     * @protected
     * @suppress {missingProperties} Interfaces in closure do not inherit statics, but classes do
     * @nocollapse
     */
    static _parseTemplateNodeAttribute(node, templateInfo, nodeInfo, name, value) {
      let parts = this._parseBindings(value, templateInfo);
      if (parts) {
        // Attribute or property
        let origName = name;
        let kind = 'property';
        // The only way we see a capital letter here is if the attr has
        // a capital letter in it per spec. In this case, to make sure
        // this binding works, we go ahead and make the binding to the attribute.
        if (capitalAttributeRegex.test(name)) {
          kind = 'attribute';
        } else if (name[name.length-1] == '$') {
          name = name.slice(0, -1);
          kind = 'attribute';
        }
        // Initialize attribute bindings with any literal parts
        let literal = literalFromParts(parts);
        if (literal && kind == 'attribute') {
          // Ensure a ShadyCSS template scoped style is not removed
          // when a class$ binding's initial literal value is set.
          if (name == 'class' && node.hasAttribute('class')) {
            literal += ' ' + node.getAttribute(name);
          }
          node.setAttribute(name, literal);
        }
        // support disable-upgrade
        if (kind == 'attribute' && origName == 'disable-upgrade$') {
          node.setAttribute(name, '');
        }
        // Clear attribute before removing, since IE won't allow removing
        // `value` attribute if it previously had a value (can't
        // unconditionally set '' before removing since attributes with `$`
        // can't be set using setAttribute)
        if (node.localName === 'input' && origName === 'value') {
          node.setAttribute(origName, '');
        }
        // Remove annotation
        node.removeAttribute(origName);
        // Case hackery: attributes are lower-case, but bind targets
        // (properties) are case sensitive. Gambit is to map dash-case to
        // camel-case: `foo-bar` becomes `fooBar`.
        // Attribute bindings are excepted.
        if (kind === 'property') {
          name = dashToCamelCase(name);
        }
        addBinding(this, templateInfo, nodeInfo, kind, name, parts, literal);
        return true;
      } else {
        // TODO(https://github.com/google/closure-compiler/issues/3240):
        //     Change back to just super.methodCall()
        return propertyEffectsBase._parseTemplateNodeAttribute.call(
          this, node, templateInfo, nodeInfo, name, value);
      }
    }

    /**
     * Overrides default `TemplateStamp` implementation to add support for
     * binding the properties that a nested template depends on to the template
     * as `_host_<property>`.
     *
     * @param {Node} node Node to parse
     * @param {TemplateInfo} templateInfo Template metadata for current template
     * @param {NodeInfo} nodeInfo Node metadata for current template node
     * @return {boolean} `true` if the visited node added node-specific
     *   metadata to `nodeInfo`
     * @protected
     * @suppress {missingProperties} Interfaces in closure do not inherit statics, but classes do
     * @nocollapse
     */
    static _parseTemplateNestedTemplate(node, templateInfo, nodeInfo) {
      // TODO(https://github.com/google/closure-compiler/issues/3240):
      //     Change back to just super.methodCall()
      let noted = propertyEffectsBase._parseTemplateNestedTemplate.call(
        this, node, templateInfo, nodeInfo);
      const parent = node.parentNode;
      const nestedTemplateInfo = nodeInfo.templateInfo;
      const isDomIf = parent.localName === 'dom-if';
      const isDomRepeat = parent.localName === 'dom-repeat';
      // Remove nested template and redirect its host bindings & templateInfo
      // onto the parent (dom-if/repeat element)'s nodeInfo
      if (removeNestedTemplates && (isDomIf || isDomRepeat)) {
        parent.removeChild(node);
        // Use the parent's nodeInfo (for the dom-if/repeat) to record the
        // templateInfo, and use that for any host property bindings below
        nodeInfo = nodeInfo.parentInfo;
        nodeInfo.templateInfo = nestedTemplateInfo;
        // Ensure the parent dom-if/repeat is noted since it now may have host
        // bindings; it may not have been if it did not have its own bindings
        nodeInfo.noted = true;
        noted = false;
      }
      // Merge host props into outer template and add bindings
      let hostProps = nestedTemplateInfo.hostProps;
      if (fastDomIf && isDomIf) {
        // `fastDomIf` mode uses runtime-template stamping to add accessors/
        // effects to properties used in its template; as such we don't need to
        // tax the host element with `_host_` bindings for the `dom-if`.
        // However, in the event it is nested in a `dom-repeat`, it is still
        // important that its host properties are added to the
        // TemplateInstance's `hostProps` so that they are forwarded to the
        // TemplateInstance.
        if (hostProps) {
          templateInfo.hostProps =
            Object.assign(templateInfo.hostProps || {}, hostProps);
          // Ensure the dom-if is noted so that it has a __dataHost, since
          // `fastDomIf` uses the host for runtime template stamping; note this
          // was already ensured above in the `removeNestedTemplates` case
          if (!removeNestedTemplates) {
            nodeInfo.parentInfo.noted = true;
          }
        }
      } else {
        let mode = '{';
        for (let source in hostProps) {
          let parts = [{ mode, source, dependencies: [source], hostProp: true }];
          addBinding(this, templateInfo, nodeInfo, 'property', '_host_' + source, parts);
        }
      }
      return noted;
    }

    /**
     * Called to parse text in a template (either attribute values or
     * textContent) into binding metadata.
     *
     * Any overrides of this method should return an array of binding part
     * metadata  representing one or more bindings found in the provided text
     * and any "literal" text in between.  Any non-literal parts will be passed
     * to `_evaluateBinding` when any dependencies change.  The only required
     * fields of each "part" in the returned array are as follows:
     *
     * - `dependencies` - Array containing trigger metadata for each property
     *   that should trigger the binding to update
     * - `literal` - String containing text if the part represents a literal;
     *   in this case no `dependencies` are needed
     *
     * Additional metadata for use by `_evaluateBinding` may be provided in
     * each part object as needed.
     *
     * The default implementation handles the following types of bindings
     * (one or more may be intermixed with literal strings):
     * - Property binding: `[[prop]]`
     * - Path binding: `[[object.prop]]`
     * - Negated property or path bindings: `[[!prop]]` or `[[!object.prop]]`
     * - Two-way property or path bindings (supports negation):
     *   `{{prop}}`, `{{object.prop}}`, `{{!prop}}` or `{{!object.prop}}`
     * - Inline computed method (supports negation):
     *   `[[compute(a, 'literal', b)]]`, `[[!compute(a, 'literal', b)]]`
     *
     * The default implementation uses a regular expression for best
     * performance. However, the regular expression uses a white-list of
     * allowed characters in a data-binding, which causes problems for
     * data-bindings that do use characters not in this white-list.
     *
     * Instead of updating the white-list with all allowed characters,
     * there is a StrictBindingParser (see lib/mixins/strict-binding-parser)
     * that uses a state machine instead. This state machine is able to handle
     * all characters. However, it is slightly less performant, therefore we
     * extracted it into a separate optional mixin.
     *
     * @param {string} text Text to parse from attribute or textContent
     * @param {Object} templateInfo Current template metadata
     * @return {Array<!BindingPart>} Array of binding part metadata
     * @protected
     * @nocollapse
     */
    static _parseBindings(text, templateInfo) {
      let parts = [];
      let lastIndex = 0;
      let m;
      // Example: "literal1{{prop}}literal2[[!compute(foo,bar)]]final"
      // Regex matches:
      //        Iteration 1:  Iteration 2:
      // m[1]: '{{'          '[['
      // m[2]: ''            '!'
      // m[3]: 'prop'        'compute(foo,bar)'
      while ((m = bindingRegex.exec(text)) !== null) {
        // Add literal part
        if (m.index > lastIndex) {
          parts.push({literal: text.slice(lastIndex, m.index)});
        }
        // Add binding part
        let mode = m[1][0];
        let negate = Boolean(m[2]);
        let source = m[3].trim();
        let customEvent = false, notifyEvent = '', colon = -1;
        if (mode == '{' && (colon = source.indexOf('::')) > 0) {
          notifyEvent = source.substring(colon + 2);
          source = source.substring(0, colon);
          customEvent = true;
        }
        let signature = parseMethod(source);
        let dependencies = [];
        if (signature) {
          // Inline computed function
          let {args, methodName} = signature;
          for (let i=0; i<args.length; i++) {
            let arg = args[i];
            if (!arg.literal) {
              dependencies.push(arg);
            }
          }
          let dynamicFns = templateInfo.dynamicFns;
          if (dynamicFns && dynamicFns[methodName] || signature.static) {
            dependencies.push(methodName);
            signature.dynamicFn = true;
          }
        } else {
          // Property or path
          dependencies.push(source);
        }
        parts.push({
          source, mode, negate, customEvent, signature, dependencies,
          event: notifyEvent
        });
        lastIndex = bindingRegex.lastIndex;
      }
      // Add a final literal part
      if (lastIndex && lastIndex < text.length) {
        let literal = text.substring(lastIndex);
        if (literal) {
          parts.push({
            literal: literal
          });
        }
      }
      if (parts.length) {
        return parts;
      } else {
        return null;
      }
    }

    /**
     * Called to evaluate a previously parsed binding part based on a set of
     * one or more changed dependencies.
     *
     * @param {!Polymer_PropertyEffects} inst Element that should be used as
     *     scope for binding dependencies
     * @param {BindingPart} part Binding part metadata
     * @param {string} path Property/path that triggered this effect
     * @param {Object} props Bag of current property changes
     * @param {Object} oldProps Bag of previous values for changed properties
     * @param {boolean} hasPaths True with `props` contains one or more paths
     * @return {*} Value the binding part evaluated to
     * @protected
     * @nocollapse
     */
    static _evaluateBinding(inst, part, path, props, oldProps, hasPaths) {
      let value;
      if (part.signature) {
        value = runMethodEffect(inst, path, props, oldProps, part.signature);
      } else if (path != part.source) {
        value = get(inst, part.source);
      } else {
        if (hasPaths && isPath(path)) {
          value = get(inst, path);
        } else {
          value = inst.__data[path];
        }
      }
      if (part.negate) {
        value = !value;
      }
      return value;
    }

  }

  return PropertyEffects;
});

/**
 * Stack for enqueuing client dom created by a host element.
 *
 * By default elements are flushed via `_flushProperties` when
 * `connectedCallback` is called. Elements attach their client dom to
 * themselves at `ready` time which results from this first flush.
 * This provides an ordering guarantee that the client dom an element
 * creates is flushed before the element itself (i.e. client `ready`
 * fires before host `ready`).
 *
 * However, if `_flushProperties` is called *before* an element is connected,
 * as for example `Templatize` does, this ordering guarantee cannot be
 * satisfied because no elements are connected. (Note: Bound elements that
 * receive data do become enqueued clients and are properly ordered but
 * unbound elements are not.)
 *
 * To maintain the desired "client before host" ordering guarantee for this
 * case we rely on the "host stack. Client nodes registers themselves with
 * the creating host element when created. This ensures that all client dom
 * is readied in the proper order, maintaining the desired guarantee.
 *
 * @private
 */
const hostStack = [];

/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/


/**
 * Registers a class prototype for telemetry purposes.
 * @param {!PolymerElementConstructor} prototype Element prototype to register
 * @protected
 */
function register$1(prototype) {
}

/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/**
 * Creates a copy of `props` with each property normalized such that
 * upgraded it is an object with at least a type property { type: Type}.
 *
 * @param {!Object} props Properties to normalize
 * @return {!Object} Copy of input `props` with normalized properties that
 * are in the form {type: Type}
 * @private
 */
function normalizeProperties(props) {
  const output = {};
  for (let p in props) {
    const o = props[p];
    output[p] = (typeof o === 'function') ? {type: o} : o;
  }
  return output;
}

/**
 * Mixin that provides a minimal starting point to using the PropertiesChanged
 * mixin by providing a mechanism to declare properties in a static
 * getter (e.g. static get properties() { return { foo: String } }). Changes
 * are reported via the `_propertiesChanged` method.
 *
 * This mixin provides no specific support for rendering. Users are expected
 * to create a ShadowRoot and put content into it and update it in whatever
 * way makes sense. This can be done in reaction to properties changing by
 * implementing `_propertiesChanged`.
 *
 * @mixinFunction
 * @polymer
 * @appliesMixin PropertiesChanged
 * @summary Mixin that provides a minimal starting point for using
 * the PropertiesChanged mixin by providing a declarative `properties` object.
 * @template T
 * @param {function(new:T)} superClass Class to apply mixin to.
 * @return {function(new:T)} superClass with mixin applied.
 */
const PropertiesMixin = dedupingMixin(superClass => {

 /**
  * @constructor
  * @implements {Polymer_PropertiesChanged}
  * @private
  */
 const base = PropertiesChanged(superClass);

 /**
  * Returns the super class constructor for the given class, if it is an
  * instance of the PropertiesMixin.
  *
  * @param {!PropertiesMixinConstructor} constructor PropertiesMixin constructor
  * @return {?PropertiesMixinConstructor} Super class constructor
  */
 function superPropertiesClass(constructor) {
   const superCtor = Object.getPrototypeOf(constructor);

   // Note, the `PropertiesMixin` class below only refers to the class
   // generated by this call to the mixin; the instanceof test only works
   // because the mixin is deduped and guaranteed only to apply once, hence
   // all constructors in a proto chain will see the same `PropertiesMixin`
   return (superCtor.prototype instanceof PropertiesMixin) ?
     /** @type {!PropertiesMixinConstructor} */ (superCtor) : null;
 }

 /**
  * Returns a memoized version of the `properties` object for the
  * given class. Properties not in object format are converted to at
  * least {type}.
  *
  * @param {PropertiesMixinConstructor} constructor PropertiesMixin constructor
  * @return {Object} Memoized properties object
  */
 function ownProperties(constructor) {
   if (!constructor.hasOwnProperty(JSCompiler_renameProperty('__ownProperties', constructor))) {
     let props = null;

     if (constructor.hasOwnProperty(JSCompiler_renameProperty('properties', constructor))) {
       const properties = constructor.properties;

       if (properties) {
        props = normalizeProperties(properties);
       }
     }

     constructor.__ownProperties = props;
   }
   return constructor.__ownProperties;
 }

 /**
  * @polymer
  * @mixinClass
  * @extends {base}
  * @implements {Polymer_PropertiesMixin}
  * @unrestricted
  */
 class PropertiesMixin extends base {

   /**
    * Implements standard custom elements getter to observes the attributes
    * listed in `properties`.
    * @suppress {missingProperties} Interfaces in closure do not inherit statics, but classes do
    * @nocollapse
    */
   static get observedAttributes() {
     if (!this.hasOwnProperty(JSCompiler_renameProperty('__observedAttributes', this))) {
       register$1(this.prototype);
       const props = this._properties;
       this.__observedAttributes = props ? Object.keys(props).map(p => this.prototype._addPropertyToAttributeMap(p)) : [];
     }
     return this.__observedAttributes;
   }

   /**
    * Finalizes an element definition, including ensuring any super classes
    * are also finalized. This includes ensuring property
    * accessors exist on the element prototype. This method calls
    * `_finalizeClass` to finalize each constructor in the prototype chain.
    * @return {void}
    * @nocollapse
    */
   static finalize() {
     if (!this.hasOwnProperty(JSCompiler_renameProperty('__finalized', this))) {
       const superCtor = superPropertiesClass(/** @type {!PropertiesMixinConstructor} */(this));
       if (superCtor) {
         superCtor.finalize();
       }
       this.__finalized = true;
       this._finalizeClass();
     }
   }

   /**
    * Finalize an element class. This includes ensuring property
    * accessors exist on the element prototype. This method is called by
    * `finalize` and finalizes the class constructor.
    *
    * @protected
    * @nocollapse
    */
   static _finalizeClass() {
     const props = ownProperties(/** @type {!PropertiesMixinConstructor} */(this));
     if (props) {
       /** @type {?} */ (this).createProperties(props);
     }
   }

   /**
    * Returns a memoized version of all properties, including those inherited
    * from super classes. Properties not in object format are converted to
    * at least {type}.
    *
    * @return {Object} Object containing properties for this class
    * @protected
    * @nocollapse
    */
   static get _properties() {
     if (!this.hasOwnProperty(
       JSCompiler_renameProperty('__properties', this))) {
       const superCtor = superPropertiesClass(/** @type {!PropertiesMixinConstructor} */(this));
       this.__properties = Object.assign({},
         superCtor && superCtor._properties,
         ownProperties(/** @type {PropertiesMixinConstructor} */(this)));
     }
     return this.__properties;
   }

   /**
    * Overrides `PropertiesChanged` method to return type specified in the
    * static `properties` object for the given property.
    * @param {string} name Name of property
    * @return {*} Type to which to deserialize attribute
    *
    * @protected
    * @nocollapse
    */
   static typeForProperty(name) {
     const info = this._properties[name];
     return info && info.type;
   }

   /**
    * Overrides `PropertiesChanged` method and adds a call to
    * `finalize` which lazily configures the element's property accessors.
    * @override
    * @return {void}
    */
   _initializeProperties() {
     this.constructor.finalize();
     super._initializeProperties();
   }

   /**
    * Called when the element is added to a document.
    * Calls `_enableProperties` to turn on property system from
    * `PropertiesChanged`.
    * @suppress {missingProperties} Super may or may not implement the callback
    * @return {void}
    * @override
    */
   connectedCallback() {
     if (super.connectedCallback) {
       super.connectedCallback();
     }
     this._enableProperties();
   }

   /**
    * Called when the element is removed from a document
    * @suppress {missingProperties} Super may or may not implement the callback
    * @return {void}
    * @override
    */
   disconnectedCallback() {
     if (super.disconnectedCallback) {
       super.disconnectedCallback();
     }
   }

 }

 return PropertiesMixin;

});

/**
 * @fileoverview
 * @suppress {checkPrototypalTypes}
 * @license Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 * at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 * be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 * Google as part of the polymer project is also subject to an additional IP
 * rights grant found at http://polymer.github.io/PATENTS.txt
 */

/**
 * Current Polymer version in Semver notation.
 * @type {string} Semver notation of the current version of Polymer.
 */
const version = '3.5.1';

const builtCSS = window.ShadyCSS && window.ShadyCSS['cssBuild'];

/**
 * Element class mixin that provides the core API for Polymer's meta-programming
 * features including template stamping, data-binding, attribute deserialization,
 * and property change observation.
 *
 * Subclassers may provide the following static getters to return metadata
 * used to configure Polymer's features for the class:
 *
 * - `static get is()`: When the template is provided via a `dom-module`,
 *   users should return the `dom-module` id from a static `is` getter.  If
 *   no template is needed or the template is provided directly via the
 *   `template` getter, there is no need to define `is` for the element.
 *
 * - `static get template()`: Users may provide the template directly (as
 *   opposed to via `dom-module`) by implementing a static `template` getter.
 *   The getter must return an `HTMLTemplateElement`.
 *
 * - `static get properties()`: Should return an object describing
 *   property-related metadata used by Polymer features (key: property name
 *   value: object containing property metadata). Valid keys in per-property
 *   metadata include:
 *   - `type` (String|Number|Object|Array|...): Used by
 *     `attributeChangedCallback` to determine how string-based attributes
 *     are deserialized to JavaScript property values.
 *   - `notify` (boolean): Causes a change in the property to fire a
 *     non-bubbling event called `<property>-changed`. Elements that have
 *     enabled two-way binding to the property use this event to observe changes.
 *   - `readOnly` (boolean): Creates a getter for the property, but no setter.
 *     To set a read-only property, use the private setter method
 *     `_setProperty(property, value)`.
 *   - `observer` (string): Observer method name that will be called when
 *     the property changes. The arguments of the method are
 *     `(value, previousValue)`.
 *   - `computed` (string): String describing method and dependent properties
 *     for computing the value of this property (e.g. `'computeFoo(bar, zot)'`).
 *     Computed properties are read-only by default and can only be changed
 *     via the return value of the computing method.
 *
 * - `static get observers()`: Array of strings describing multi-property
 *   observer methods and their dependent properties (e.g.
 *   `'observeABC(a, b, c)'`).
 *
 * The base class provides default implementations for the following standard
 * custom element lifecycle callbacks; users may override these, but should
 * call the super method to ensure
 * - `constructor`: Run when the element is created or upgraded
 * - `connectedCallback`: Run each time the element is connected to the
 *   document
 * - `disconnectedCallback`: Run each time the element is disconnected from
 *   the document
 * - `attributeChangedCallback`: Run each time an attribute in
 *   `observedAttributes` is set or removed (note: this element's default
 *   `observedAttributes` implementation will automatically return an array
 *   of dash-cased attributes based on `properties`)
 *
 * @mixinFunction
 * @polymer
 * @appliesMixin PropertyEffects
 * @appliesMixin PropertiesMixin
 * @property rootPath {string} Set to the value of `rootPath`,
 *   which defaults to the main document path
 * @property importPath {string} Set to the value of the class's static
 *   `importPath` property, which defaults to the path of this element's
 *   `dom-module` (when `is` is used), but can be overridden for other
 *   import strategies.
 * @summary Element class mixin that provides the core API for Polymer's
 * meta-programming features.
 * @template T
 * @param {function(new:T)} superClass Class to apply mixin to.
 * @return {function(new:T)} superClass with mixin applied.
 */
const ElementMixin$1 = dedupingMixin(base => {
  /**
   * @constructor
   * @implements {Polymer_PropertyEffects}
   * @implements {Polymer_PropertiesMixin}
   * @extends {HTMLElement}
   * @private
   */
  const polymerElementBase = PropertiesMixin(PropertyEffects(base));

  /**
   * Returns a list of properties with default values.
   * This list is created as an optimization since it is a subset of
   * the list returned from `_properties`.
   * This list is used in `_initializeProperties` to set property defaults.
   *
   * @param {PolymerElementConstructor} constructor Element class
   * @return {PolymerElementProperties} Flattened properties for this class
   *   that have default values
   * @private
   */
  function propertyDefaults(constructor) {
    if (!constructor.hasOwnProperty(
      JSCompiler_renameProperty('__propertyDefaults', constructor))) {
      constructor.__propertyDefaults = null;
      let props = constructor._properties;
      for (let p in props) {
        let info = props[p];
        if ('value' in info) {
          constructor.__propertyDefaults = constructor.__propertyDefaults || {};
          constructor.__propertyDefaults[p] = info;
        }
      }
    }
    return constructor.__propertyDefaults;
  }

  /**
   * Returns a memoized version of the `observers` array.
   * @param {PolymerElementConstructor} constructor Element class
   * @return {Array} Array containing own observers for the given class
   * @protected
   */
  function ownObservers(constructor) {
    if (!constructor.hasOwnProperty(
      JSCompiler_renameProperty('__ownObservers', constructor))) {
      constructor.__ownObservers =
          constructor.hasOwnProperty(
              JSCompiler_renameProperty('observers', constructor)) ?
          /** @type {PolymerElementConstructor} */ (constructor).observers :
          null;
    }
    return constructor.__ownObservers;
  }

  /**
   * Creates effects for a property.
   *
   * Note, once a property has been set to
   * `readOnly`, `computed`, `reflectToAttribute`, or `notify`
   * these values may not be changed. For example, a subclass cannot
   * alter these settings. However, additional `observers` may be added
   * by subclasses.
   *
   * The info object should contain property metadata as follows:
   *
   * * `type`: {function} type to which an attribute matching the property
   * is deserialized. Note the property is camel-cased from a dash-cased
   * attribute. For example, 'foo-bar' attribute is deserialized to a
   * property named 'fooBar'.
   *
   * * `readOnly`: {boolean} creates a readOnly property and
   * makes a private setter for the private of the form '_setFoo' for a
   * property 'foo',
   *
   * * `computed`: {string} creates a computed property. A computed property
   * is also automatically set to `readOnly: true`. The value is calculated
   * by running a method and arguments parsed from the given string. For
   * example 'compute(foo)' will compute a given property when the
   * 'foo' property changes by executing the 'compute' method. This method
   * must return the computed value.
   *
   * * `reflectToAttribute`: {boolean} If true, the property value is reflected
   * to an attribute of the same name. Note, the attribute is dash-cased
   * so a property named 'fooBar' is reflected as 'foo-bar'.
   *
   * * `notify`: {boolean} sends a non-bubbling notification event when
   * the property changes. For example, a property named 'foo' sends an
   * event named 'foo-changed' with `event.detail` set to the value of
   * the property.
   *
   * * observer: {string} name of a method that runs when the property
   * changes. The arguments of the method are (value, previousValue).
   *
   * Note: Users may want control over modifying property
   * effects via subclassing. For example, a user might want to make a
   * reflectToAttribute property not do so in a subclass. We've chosen to
   * disable this because it leads to additional complication.
   * For example, a readOnly effect generates a special setter. If a subclass
   * disables the effect, the setter would fail unexpectedly.
   * Based on feedback, we may want to try to make effects more malleable
   * and/or provide an advanced api for manipulating them.
   *
   * @param {!PolymerElement} proto Element class prototype to add accessors
   *   and effects to
   * @param {string} name Name of the property.
   * @param {Object} info Info object from which to create property effects.
   * Supported keys:
   * @param {Object} allProps Flattened map of all properties defined in this
   *   element (including inherited properties)
   * @return {void}
   * @private
   */
  function createPropertyFromConfig(proto, name, info, allProps) {
    // computed forces readOnly...
    if (info.computed) {
      info.readOnly = true;
    }
    // Note, since all computed properties are readOnly, this prevents
    // adding additional computed property effects (which leads to a confusing
    // setup where multiple triggers for setting a property)
    // While we do have `hasComputedEffect` this is set on the property's
    // dependencies rather than itself.
    if (info.computed) {
      if (proto._hasReadOnlyEffect(name)) {
        console.warn(`Cannot redefine computed property '${name}'.`);
      } else {
        proto._createComputedProperty(name, info.computed, allProps);
      }
    }
    if (info.readOnly && !proto._hasReadOnlyEffect(name)) {
      proto._createReadOnlyProperty(name, !info.computed);
    } else if (info.readOnly === false && proto._hasReadOnlyEffect(name)) {
      console.warn(`Cannot make readOnly property '${name}' non-readOnly.`);
    }
    if (info.reflectToAttribute && !proto._hasReflectEffect(name)) {
      proto._createReflectedProperty(name);
    } else if (info.reflectToAttribute === false && proto._hasReflectEffect(name)) {
      console.warn(`Cannot make reflected property '${name}' non-reflected.`);
    }
    if (info.notify && !proto._hasNotifyEffect(name)) {
      proto._createNotifyingProperty(name);
    } else if (info.notify === false && proto._hasNotifyEffect(name)) {
      console.warn(`Cannot make notify property '${name}' non-notify.`);
    }
    // always add observer
    if (info.observer) {
      proto._createPropertyObserver(name, info.observer, allProps[info.observer]);
    }
    // always create the mapping from attribute back to property for deserialization.
    proto._addPropertyToAttributeMap(name);
  }

  /**
   * Process all style elements in the element template. Styles with the
   * `include` attribute are processed such that any styles in
   * the associated "style modules" are included in the element template.
   * @param {PolymerElementConstructor} klass Element class
   * @param {!HTMLTemplateElement} template Template to process
   * @param {string} is Name of element
   * @param {string} baseURI Base URI for element
   * @private
   */
  function processElementStyles(klass, template, is, baseURI) {
    if (!builtCSS) {
      const templateStyles = template.content.querySelectorAll('style');
      const stylesWithImports = stylesFromTemplate(template);
      // insert styles from <link rel="import" type="css"> at the top of the template
      const linkedStyles = stylesFromModuleImports(is);
      const firstTemplateChild = template.content.firstElementChild;
      for (let idx = 0; idx < linkedStyles.length; idx++) {
        let s = linkedStyles[idx];
        s.textContent = klass._processStyleText(s.textContent, baseURI);
        template.content.insertBefore(s, firstTemplateChild);
      }
      // keep track of the last "concrete" style in the template we have encountered
      let templateStyleIndex = 0;
      // ensure all gathered styles are actually in this template.
      for (let i = 0; i < stylesWithImports.length; i++) {
        let s = stylesWithImports[i];
        let templateStyle = templateStyles[templateStyleIndex];
        // if the style is not in this template, it's been "included" and
        // we put a clone of it in the template before the style that included it
        if (templateStyle !== s) {
          s = s.cloneNode(true);
          templateStyle.parentNode.insertBefore(s, templateStyle);
        } else {
          templateStyleIndex++;
        }
        s.textContent = klass._processStyleText(s.textContent, baseURI);
      }
    }
    if (window.ShadyCSS) {
      window.ShadyCSS.prepareTemplate(template, is);
    }
    // Support for `adoptedStylesheets` relies on using native Shadow DOM
    // and built CSS. Built CSS is required because runtime transformation of
    // `@apply` is not supported. This is because ShadyCSS relies on being able
    // to update a `style` element in the element template and this is
    // removed when using `adoptedStyleSheets`.
    // Note, it would be more efficient to allow style includes to become
    // separate stylesheets; however, because of `@apply` these are
    // potentially not shareable and sharing the ones that could be shared
    // would require some coordination. To keep it simple, all the includes
    // and styles are collapsed into a single shareable stylesheet.
    if (useAdoptedStyleSheetsWithBuiltCSS && builtCSS &&
        supportsAdoptingStyleSheets) {
      // Remove styles in template and make a shareable stylesheet
      const styles = template.content.querySelectorAll('style');
      if (styles) {
        let css = '';
        Array.from(styles).forEach(s => {
          css += s.textContent;
          s.parentNode.removeChild(s);
        });
        klass._styleSheet = new CSSStyleSheet();
        klass._styleSheet.replaceSync(css);
      }
    }
  }

  /**
   * Look up template from dom-module for element
   *
   * @param {string} is Element name to look up
   * @return {?HTMLTemplateElement|undefined} Template found in dom module, or
   *   undefined if not found
   * @protected
   */
  function getTemplateFromDomModule(is) {
    let template = null;
    // Under strictTemplatePolicy in 3.x+, dom-module lookup is only allowed
    // when opted-in via allowTemplateFromDomModule
    if (is && (!strictTemplatePolicy || allowTemplateFromDomModule)) {
      template = /** @type {?HTMLTemplateElement} */ (
          DomModule.import(is, 'template'));
      // Under strictTemplatePolicy, require any element with an `is`
      // specified to have a dom-module
      if (strictTemplatePolicy && !template) {
        throw new Error(`strictTemplatePolicy: expecting dom-module or null template for ${is}`);
      }
    }
    return template;
  }

  /**
   * @polymer
   * @mixinClass
   * @unrestricted
   * @implements {Polymer_ElementMixin}
   * @extends {polymerElementBase}
   */
  class PolymerElement extends polymerElementBase {

    /**
     * Current Polymer version in Semver notation.
     * @type {string} Semver notation of the current version of Polymer.
     * @nocollapse
     */
    static get polymerElementVersion() {
      return version;
    }

    /**
     * Override of PropertiesMixin _finalizeClass to create observers and
     * find the template.
     * @return {void}
     * @protected
     * @suppress {missingProperties} Interfaces in closure do not inherit statics, but classes do
     * @nocollapse
     */
    static _finalizeClass() {
      // TODO(https://github.com/google/closure-compiler/issues/3240):
      //     Change back to just super.methodCall()
      polymerElementBase._finalizeClass.call(this);
      const observers = ownObservers(this);
      if (observers) {
        this.createObservers(observers, this._properties);
      }
      this._prepareTemplate();
    }

    /** @nocollapse */
    static _prepareTemplate() {
      // note: create "working" template that is finalized at instance time
      let template = /** @type {PolymerElementConstructor} */ (this).template;
      if (template) {
        if (typeof template === 'string') {
          console.error('template getter must return HTMLTemplateElement');
          template = null;
        } else if (!legacyOptimizations) {
          template = template.cloneNode(true);
        }
      }

      /** @override */
      this.prototype._template = template;
    }

    /**
     * Override of PropertiesChanged createProperties to create accessors
     * and property effects for all of the properties.
     * @param {!Object} props .
     * @return {void}
     * @protected
     * @nocollapse
     */
    static createProperties(props) {
      for (let p in props) {
        createPropertyFromConfig(
            /** @type {?} */ (this.prototype), p, props[p], props);
      }
    }

    /**
     * Creates observers for the given `observers` array.
     * Leverages `PropertyEffects` to create observers.
     * @param {Object} observers Array of observer descriptors for
     *   this class
     * @param {Object} dynamicFns Object containing keys for any properties
     *   that are functions and should trigger the effect when the function
     *   reference is changed
     * @return {void}
     * @protected
     * @nocollapse
     */
    static createObservers(observers, dynamicFns) {
      const proto = this.prototype;
      for (let i=0; i < observers.length; i++) {
        proto._createMethodObserver(observers[i], dynamicFns);
      }
    }

    /**
     * Returns the template that will be stamped into this element's shadow root.
     *
     * If a `static get is()` getter is defined, the default implementation will
     * return the first `<template>` in a `dom-module` whose `id` matches this
     * element's `is` (note that a `_template` property on the class prototype
     * takes precedence over the `dom-module` template, to maintain legacy
     * element semantics; a subclass will subsequently fall back to its super
     * class template if neither a `prototype._template` or a `dom-module` for
     * the class's `is` was found).
     *
     * Users may override this getter to return an arbitrary template
     * (in which case the `is` getter is unnecessary). The template returned
     * must be an `HTMLTemplateElement`.
     *
     * Note that when subclassing, if the super class overrode the default
     * implementation and the subclass would like to provide an alternate
     * template via a `dom-module`, it should override this getter and
     * return `DomModule.import(this.is, 'template')`.
     *
     * If a subclass would like to modify the super class template, it should
     * clone it rather than modify it in place.  If the getter does expensive
     * work such as cloning/modifying a template, it should memoize the
     * template for maximum performance:
     *
     *   let memoizedTemplate;
     *   class MySubClass extends MySuperClass {
     *     static get template() {
     *       if (!memoizedTemplate) {
     *         memoizedTemplate = super.template.cloneNode(true);
     *         let subContent = document.createElement('div');
     *         subContent.textContent = 'This came from MySubClass';
     *         memoizedTemplate.content.appendChild(subContent);
     *       }
     *       return memoizedTemplate;
     *     }
     *   }
     *
     * @return {!HTMLTemplateElement|string} Template to be stamped
     * @nocollapse
     */
    static get template() {
      // Explanation of template-related properties:
      // - constructor.template (this getter): the template for the class.
      //     This can come from the prototype (for legacy elements), from a
      //     dom-module, or from the super class's template (or can be overridden
      //     altogether by the user)
      // - constructor._template: memoized version of constructor.template
      // - prototype._template: working template for the element, which will be
      //     parsed and modified in place. It is a cloned version of
      //     constructor.template, saved in _finalizeClass(). Note that before
      //     this getter is called, for legacy elements this could be from a
      //     _template field on the info object passed to Polymer(), a behavior,
      //     or set in registered(); once the static getter runs, a clone of it
      //     will overwrite it on the prototype as the working template.
      if (!this.hasOwnProperty(JSCompiler_renameProperty('_template', this))) {
        let protoTemplate = this.prototype.hasOwnProperty(
          JSCompiler_renameProperty('_template', this.prototype)) ?
          this.prototype._template : undefined;
        // Accept a function for the legacy Polymer({_template:...}) field for
        // lazy parsing
        if (typeof protoTemplate === 'function') {
          protoTemplate = protoTemplate();
        }
        this._template =
          // If user has put template on prototype (e.g. in legacy via registered
          // callback or info object), prefer that first. Note that `null` is
          // used as a sentinel to indicate "no template" and can be used to
          // override a super template, whereas `undefined` is used as a
          // sentinel to mean "fall-back to default template lookup" via
          // dom-module and/or super.template.
          protoTemplate !== undefined ? protoTemplate :
          // Look in dom-module associated with this element's is
          ((this.hasOwnProperty(JSCompiler_renameProperty('is', this)) &&
          (getTemplateFromDomModule(/** @type {PolymerElementConstructor}*/ (this).is))) ||
          // Next look for superclass template (call the super impl this
          // way so that `this` points to the superclass)
          Object.getPrototypeOf(/** @type {PolymerElementConstructor}*/ (this).prototype).constructor.template);
      }
      return this._template;
    }

    /**
     * Set the template.
     *
     * @param {!HTMLTemplateElement|string} value Template to set.
     * @nocollapse
     */
    static set template(value) {
      this._template = value;
    }

    /**
     * Path matching the url from which the element was imported.
     *
     * This path is used to resolve url's in template style cssText.
     * The `importPath` property is also set on element instances and can be
     * used to create bindings relative to the import path.
     *
     * For elements defined in ES modules, users should implement
     * `static get importMeta() { return import.meta; }`, and the default
     * implementation of `importPath` will  return `import.meta.url`'s path.
     * For elements defined in HTML imports, this getter will return the path
     * to the document containing a `dom-module` element matching this
     * element's static `is` property.
     *
     * Note, this path should contain a trailing `/`.
     *
     * @return {string} The import path for this element class
     * @suppress {missingProperties}
     * @nocollapse
     */
    static get importPath() {
      if (!this.hasOwnProperty(JSCompiler_renameProperty('_importPath', this))) {
        const meta = this.importMeta;
        if (meta) {
          this._importPath = pathFromUrl(meta.url);
        } else {
          const module = DomModule.import(/** @type {PolymerElementConstructor} */ (this).is);
          this._importPath = (module && module.assetpath) ||
            Object.getPrototypeOf(/** @type {PolymerElementConstructor}*/ (this).prototype).constructor.importPath;
        }
      }
      return this._importPath;
    }

    constructor() {
      super();
      /** @type {HTMLTemplateElement} */
      this._template;
      /** @type {string} */
      this._importPath;
      /** @type {string} */
      this.rootPath;
      /** @type {string} */
      this.importPath;
      /** @type {StampedTemplate | HTMLElement | ShadowRoot} */
      this.root;
      /** @type {!Object<string, !Element>} */
      this.$;
    }

    /**
     * Overrides the default `PropertyAccessors` to ensure class
     * metaprogramming related to property accessors and effects has
     * completed (calls `finalize`).
     *
     * It also initializes any property defaults provided via `value` in
     * `properties` metadata.
     *
     * @return {void}
     * @override
     * @suppress {invalidCasts,missingProperties} go/missingfnprops
     */
    _initializeProperties() {
      this.constructor.finalize();
      // note: finalize template when we have access to `localName` to
      // avoid dependence on `is` for polyfilling styling.
      this.constructor._finalizeTemplate(/** @type {!HTMLElement} */(this).localName);
      super._initializeProperties();
      // set path defaults
      this.rootPath = rootPath;
      this.importPath = this.constructor.importPath;
      // apply property defaults...
      let p$ = propertyDefaults(this.constructor);
      if (!p$) {
        return;
      }
      for (let p in p$) {
        let info = p$[p];
        if (this._canApplyPropertyDefault(p)) {
          let value = typeof info.value == 'function' ?
            info.value.call(this) :
            info.value;
          // Set via `_setProperty` if there is an accessor, to enable
          // initializing readOnly property defaults
          if (this._hasAccessor(p)) {
            this._setPendingProperty(p, value, true);
          } else {
            this[p] = value;
          }
        }
      }
    }

    /**
     * Determines if a property dfeault can be applied. For example, this
     * prevents a default from being applied when a property that has no
     * accessor is overridden by its host before upgrade (e.g. via a binding).
     * @override
     * @param {string} property Name of the property
     * @return {boolean} Returns true if the property default can be applied.
     */
    _canApplyPropertyDefault(property) {
      return !this.hasOwnProperty(property);
    }

    /**
     * Gather style text for a style element in the template.
     *
     * @param {string} cssText Text containing styling to process
     * @param {string} baseURI Base URI to rebase CSS paths against
     * @return {string} The processed CSS text
     * @protected
     * @nocollapse
     */
    static _processStyleText(cssText, baseURI) {
      return resolveCss(cssText, baseURI);
    }

    /**
    * Configures an element `proto` to function with a given `template`.
    * The element name `is` and extends `ext` must be specified for ShadyCSS
    * style scoping.
    *
    * @param {string} is Tag name (or type extension name) for this element
    * @return {void}
    * @protected
    * @nocollapse
    */
    static _finalizeTemplate(is) {
      /** @const {HTMLTemplateElement} */
      const template = this.prototype._template;
      if (template && !template.__polymerFinalized) {
        template.__polymerFinalized = true;
        const importPath = this.importPath;
        const baseURI = importPath ? resolveUrl(importPath) : '';
        // e.g. support `include="module-name"`, and ShadyCSS
        processElementStyles(this, template, is, baseURI);
        this.prototype._bindTemplate(template);
      }
    }

    /**
     * Provides a default implementation of the standard Custom Elements
     * `connectedCallback`.
     *
     * The default implementation enables the property effects system and
     * flushes any pending properties, and updates shimmed CSS properties
     * when using the ShadyCSS scoping/custom properties polyfill.
     *
     * @override
     * @suppress {missingProperties, invalidCasts} Super may or may not
     *     implement the callback
     * @return {void}
     */
    connectedCallback() {
      if (window.ShadyCSS && this._template) {
        window.ShadyCSS.styleElement(/** @type {!HTMLElement} */(this));
      }
      super.connectedCallback();
    }

    /**
     * Stamps the element template.
     *
     * @return {void}
     * @override
     */
    ready() {
      if (this._template) {
        this.root = this._stampTemplate(this._template);
        this.$ = this.root.$;
      }
      super.ready();
    }

    /**
     * Implements `PropertyEffects`'s `_readyClients` call. Attaches
     * element dom by calling `_attachDom` with the dom stamped from the
     * element's template via `_stampTemplate`. Note that this allows
     * client dom to be attached to the element prior to any observers
     * running.
     *
     * @return {void}
     * @override
     */
    _readyClients() {
      if (this._template) {
        this.root = this._attachDom(/** @type {StampedTemplate} */(this.root));
      }
      // The super._readyClients here sets the clients initialized flag.
      // We must wait to do this until after client dom is created/attached
      // so that this flag can be checked to prevent notifications fired
      // during this process from being handled before clients are ready.
      super._readyClients();
    }


    /**
     * Attaches an element's stamped dom to itself. By default,
     * this method creates a `shadowRoot` and adds the dom to it.
     * However, this method may be overridden to allow an element
     * to put its dom in another location.
     *
     * @override
     * @throws {Error}
     * @suppress {missingReturn}
     * @param {StampedTemplate} dom to attach to the element.
     * @return {ShadowRoot} node to which the dom has been attached.
     */
    _attachDom(dom) {
      const n = wrap$1(this);
      if (n.attachShadow) {
        if (dom) {
          if (!n.shadowRoot) {
            n.attachShadow({mode: 'open', shadyUpgradeFragment: dom});
            n.shadowRoot.appendChild(dom);
            // When `adoptedStyleSheets` is supported a stylesheet is made
            // available on the element constructor.
            if (this.constructor._styleSheet) {
              n.shadowRoot.adoptedStyleSheets = [this.constructor._styleSheet];
            }
          }
          if (syncInitialRender && window.ShadyDOM) {
            window.ShadyDOM.flushInitial(n.shadowRoot);
          }
          return n.shadowRoot;
        }
        return null;
      } else {
        throw new Error('ShadowDOM not available. ' +
          // TODO(sorvell): move to compile-time conditional when supported
        'PolymerElement can create dom as children instead of in ' +
        'ShadowDOM by setting `this.root = this;\` before \`ready\`.');
      }
    }

    /**
     * When using the ShadyCSS scoping and custom property shim, causes all
     * shimmed styles in this element (and its subtree) to be updated
     * based on current custom property values.
     *
     * The optional parameter overrides inline custom property styles with an
     * object of properties where the keys are CSS properties, and the values
     * are strings.
     *
     * Example: `this.updateStyles({'--color': 'blue'})`
     *
     * These properties are retained unless a value of `null` is set.
     *
     * Note: This function does not support updating CSS mixins.
     * You can not dynamically change the value of an `@apply`.
     *
     * @override
     * @param {Object=} properties Bag of custom property key/values to
     *   apply to this element.
     * @return {void}
     * @suppress {invalidCasts}
     */
    updateStyles(properties) {
      if (window.ShadyCSS) {
        window.ShadyCSS.styleSubtree(/** @type {!HTMLElement} */(this), properties);
      }
    }

    /**
     * Rewrites a given URL relative to a base URL. The base URL defaults to
     * the original location of the document containing the `dom-module` for
     * this element. This method will return the same URL before and after
     * bundling.
     *
     * Note that this function performs no resolution for URLs that start
     * with `/` (absolute URLs) or `#` (hash identifiers).  For general purpose
     * URL resolution, use `window.URL`.
     *
     * @override
     * @param {string} url URL to resolve.
     * @param {string=} base Optional base URL to resolve against, defaults
     * to the element's `importPath`
     * @return {string} Rewritten URL relative to base
     */
    resolveUrl(url, base) {
      if (!base && this.importPath) {
        base = resolveUrl(this.importPath);
      }
      return resolveUrl(url, base);
    }

    /**
     * Overrides `PropertyEffects` to add map of dynamic functions on
     * template info, for consumption by `PropertyEffects` template binding
     * code. This map determines which method templates should have accessors
     * created for them.
     *
     * @param {!HTMLTemplateElement} template Template
     * @param {!TemplateInfo} templateInfo Template metadata for current template
     * @param {!NodeInfo} nodeInfo Node metadata for current template.
     * @return {boolean} .
     * @suppress {missingProperties} Interfaces in closure do not inherit statics, but classes do
     * @nocollapse
     */
    static _parseTemplateContent(template, templateInfo, nodeInfo) {
      templateInfo.dynamicFns = templateInfo.dynamicFns || this._properties;
      // TODO(https://github.com/google/closure-compiler/issues/3240):
      //     Change back to just super.methodCall()
      return polymerElementBase._parseTemplateContent.call(
        this, template, templateInfo, nodeInfo);
    }

    /**
     * Overrides `PropertyEffects` to warn on use of undeclared properties in
     * template.
     *
     * @param {Object} templateInfo Template metadata to add effect to
     * @param {string} prop Property that should trigger the effect
     * @param {Object=} effect Effect metadata object
     * @return {void}
     * @protected
     * @suppress {missingProperties} Interfaces in closure do not inherit statics, but classes do
     * @nocollapse
     */
    static _addTemplatePropertyEffect(templateInfo, prop, effect) {
      // Warn if properties are used in template without being declared.
      // Properties must be listed in `properties` to be included in
      // `observedAttributes` since CE V1 reads that at registration time, and
      // since we want to keep template parsing lazy, we can't automatically
      // add undeclared properties used in templates to `observedAttributes`.
      // The warning is only enabled in `legacyOptimizations` mode, since
      // we don't want to spam existing users who might have adopted the
      // shorthand when attribute deserialization is not important.
      if (legacyWarnings && !(prop in this._properties) &&
          // Methods used in templates with no dependencies (or only literal
          // dependencies) become accessors with template effects; ignore these
          !(effect.info.part.signature && effect.info.part.signature.static) &&
          // Warnings for bindings added to nested templates are handled by
          // templatizer so ignore both the host-to-template bindings
          // (`hostProp`) and TemplateInstance-to-child bindings
          // (`nestedTemplate`)
          !effect.info.part.hostProp && !templateInfo.nestedTemplate) {
        console.warn(`Property '${prop}' used in template but not declared in 'properties'; ` +
          `attribute will not be observed.`);
      }
      // TODO(https://github.com/google/closure-compiler/issues/3240):
      //     Change back to just super.methodCall()
      return polymerElementBase._addTemplatePropertyEffect.call(
        this, templateInfo, prop, effect);
    }

  }

  return PolymerElement;
});

/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/**
 * Our TrustedTypePolicy for HTML which is declared using the Polymer html
 * template tag function.
 *
 * That HTML is a developer-authored constant, and is parsed with innerHTML
 * before any untrusted expressions have been mixed in. Therefor it is
 * considered safe by construction.
 *
 * @type {!TrustedTypePolicy|undefined}
 */
const policy = window.trustedTypes &&
    trustedTypes.createPolicy('polymer-html-literal', {createHTML: (s) => s});

/**
 * Class representing a static string value which can be used to filter
 * strings by asseting that they have been created via this class. The
 * `value` property returns the string passed to the constructor.
 */
class LiteralString {
  /**
   * @param {!ITemplateArray} strings Constant parts of tagged template literal
   * @param {!Array<*>} values Variable parts of tagged template literal
   */
  constructor(strings, values) {
    assertValidTemplateStringParameters(strings, values);
    const string = values.reduce(
        (acc, v, idx) => acc + literalValue(v) + strings[idx + 1], strings[0]);
    /** @type {string} */
    this.value = string.toString();
  }
  /**
   * @return {string} LiteralString string value
   * @override
   */
  toString() {
    return this.value;
  }
}

/**
 * @param {*} value Object to stringify into HTML
 * @return {string} HTML stringified form of `obj`
 */
function literalValue(value) {
  if (value instanceof LiteralString) {
    return /** @type {!LiteralString} */(value).value;
  } else {
    throw new Error(
        `non-literal value passed to Polymer's htmlLiteral function: ${value}`
    );
  }
}

/**
 * @param {*} value Object to stringify into HTML
 * @return {string} HTML stringified form of `obj`
 */
function htmlValue(value) {
  if (value instanceof HTMLTemplateElement) {
    // This might be an mXSS risk – mainly in the case where this template
    // contains untrusted content that was believed to be sanitized.
    // However we can't just use the XMLSerializer here because it misencodes
    // `>` characters inside style tags.
    // For an example of an actual case that hit this encoding issue,
    // see b/198592167
    return /** @type {!HTMLTemplateElement } */(value).innerHTML;
  } else if (value instanceof LiteralString) {
    return literalValue(value);
  } else {
    throw new Error(
        `non-template value passed to Polymer's html function: ${value}`);
  }
}

/**
 * A template literal tag that creates an HTML <template> element from the
 * contents of the string.
 *
 * This allows you to write a Polymer Template in JavaScript.
 *
 * Templates can be composed by interpolating `HTMLTemplateElement`s in
 * expressions in the JavaScript template literal. The nested template's
 * `innerHTML` is included in the containing template.  The only other
 * values allowed in expressions are those returned from `htmlLiteral`
 * which ensures only literal values from JS source ever reach the HTML, to
 * guard against XSS risks.
 *
 * All other values are disallowed in expressions to help prevent XSS
 * attacks; however, `htmlLiteral` can be used to compose static
 * string values into templates. This is useful to compose strings into
 * places that do not accept html, like the css text of a `style`
 * element.
 *
 * Example:
 *
 *     static get template() {
 *       return html`
 *         <style>:host{ content:"..." }</style>
 *         <div class="shadowed">${this.partialTemplate}</div>
 *         ${super.template}
 *       `;
 *     }
 *     static get partialTemplate() { return html`<span>Partial!</span>`; }
 *
 * @param {!ITemplateArray} strings Constant parts of tagged template literal
 * @param {...*} values Variable parts of tagged template literal
 * @return {!HTMLTemplateElement} Constructed HTMLTemplateElement
 */
const html = function html(strings, ...values) {
  assertValidTemplateStringParameters(strings, values);
  const template =
      /** @type {!HTMLTemplateElement} */ (document.createElement('template'));
  let value = values.reduce(
      (acc, v, idx) => acc + htmlValue(v) + strings[idx + 1], strings[0]);
  if (policy) {
    value = policy.createHTML(value);
  }
  template.innerHTML = value;
  return template;
};

/**
 * @param {!ITemplateArray} strings Constant parts of tagged template literal
 * @param {!Array<*>} values Array of values from quasis
 */
const assertValidTemplateStringParameters = (strings, values) => {
  // Note: if/when https://github.com/tc39/proposal-array-is-template-object
  // is standardized, use that instead when available, as it can perform an
  // unforgable check (though of course, the function itself can be forged).
  if (!Array.isArray(strings) || !Array.isArray(strings.raw) ||
      (values.length !== strings.length - 1)) {
    // This is either caused by a browser bug, a compiler bug, or someone
    // calling the html template tag function as a regular function.
    //
    throw new TypeError('Invalid call to the html template tag');
  }
};

/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/


/**
 * Base class that provides the core API for Polymer's meta-programming
 * features including template stamping, data-binding, attribute deserialization,
 * and property change observation.
 *
 * @customElement
 * @polymer
 * @constructor
 * @implements {Polymer_ElementMixin}
 * @extends HTMLElement
 * @appliesMixin ElementMixin
 * @summary Custom element base class that provides the core API for Polymer's
 *   key meta-programming features including template stamping, data-binding,
 *   attribute deserialization, and property change observation
 */
const PolymerElement = ElementMixin$1(HTMLElement);

/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @typedef ReactiveController
 * @type {import('lit').ReactiveController}
 */

/**
 * A mixin for connecting controllers to the element.
 *
 * @polymerMixin
 */
const ControllerMixin = dedupingMixin(
  (superClass) =>
    class ControllerMixinClass extends superClass {
      constructor() {
        super();

        /**
         * @type {Set<ReactiveController>}
         */
        this.__controllers = new Set();
      }

      /** @protected */
      connectedCallback() {
        super.connectedCallback();

        this.__controllers.forEach((c) => {
          if (c.hostConnected) {
            c.hostConnected();
          }
        });
      }

      /** @protected */
      disconnectedCallback() {
        super.disconnectedCallback();

        this.__controllers.forEach((c) => {
          if (c.hostDisconnected) {
            c.hostDisconnected();
          }
        });
      }

      /**
       * Registers a controller to participate in the element update cycle.
       *
       * @param {ReactiveController} controller
       * @protected
       */
      addController(controller) {
        this.__controllers.add(controller);
        // Call hostConnected if a controller is added after the element is attached.
        if (this.$ !== undefined && this.isConnected && controller.hostConnected) {
          controller.hostConnected();
        }
      }

      /**
       * Removes a controller from the element.
       *
       * @param {ReactiveController} controller
       * @protected
       */
      removeController(controller) {
        this.__controllers.delete(controller);
      }
    },
);

const DEV_MODE_CODE_REGEXP =
  /\/\*\*\s+vaadin-dev-mode:start([\s\S]*)vaadin-dev-mode:end\s+\*\*\//i;

const FlowClients = window.Vaadin && window.Vaadin.Flow && window.Vaadin.Flow.clients;

function isMinified() {
  function test() {
    /** vaadin-dev-mode:start
    return false;
    vaadin-dev-mode:end **/
    return true;
  }
  return uncommentAndRun(test);
}

function isDevelopmentMode() {
  try {
    if (isForcedDevelopmentMode()) {
      return true;
    }

    if (!isLocalhost()) {
      return false;
    }

    if (FlowClients) {
      return !isFlowProductionMode();
    }

    return !isMinified();
  } catch (e) {
    // Some error in this code, assume production so no further actions will be taken
    return false;
  }
}

function isForcedDevelopmentMode() {
  return localStorage.getItem("vaadin.developmentmode.force");
}

function isLocalhost() {
  return (["localhost","127.0.0.1"].indexOf(window.location.hostname) >= 0);
}

function isFlowProductionMode() {
  if (FlowClients) {
    const productionModeApps = Object.keys(FlowClients)
      .map(key => FlowClients[key])
      .filter(client => client.productionMode);
    if (productionModeApps.length > 0) {
      return true;
    }
  }
  return false;
}

function uncommentAndRun(callback, args) {
  if (typeof callback !== 'function') {
    return;
  }

  const match = DEV_MODE_CODE_REGEXP.exec(callback.toString());
  if (match) {
    try {
      // requires CSP: script-src 'unsafe-eval'
      callback = new Function(match[1]);
    } catch (e) {
      // eat the exception
      console.log('vaadin-development-mode-detector: uncommentAndRun() failed', e);
    }
  }

  return callback(args);
}

// A guard against polymer-modulizer removing the window.Vaadin
// initialization above.
window['Vaadin'] = window['Vaadin'] || {};

/**
 * Inspects the source code of the given `callback` function for
 * specially-marked _commented_ code. If such commented code is found in the
 * callback source, uncomments and runs that code instead of the callback
 * itself. Otherwise runs the callback as is.
 *
 * The optional arguments are passed into the callback / uncommented code,
 * the result is returned.
 *
 * See the `isMinified()` function source code in this file for an example.
 *
 */
const runIfDevelopmentMode = function(callback, args) {
  if (window.Vaadin.developmentMode) {
    return uncommentAndRun(callback, args);
  }
};

if (window.Vaadin.developmentMode === undefined) {
  window.Vaadin.developmentMode = isDevelopmentMode();
}

/* This file is autogenerated from src/vaadin-usage-statistics.tpl.html */
/*

This script gathers usage statistics from the application running in development mode.

Statistics gathering is automatically disabled and excluded from production builds.

For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.

*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/

function maybeGatherAndSendStats() {
  /** vaadin-dev-mode:start
  (function () {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var getPolymerVersion = function getPolymerVersion() {
  return window.Polymer && window.Polymer.version;
};

var StatisticsGatherer = function () {
  function StatisticsGatherer(logger) {
    classCallCheck(this, StatisticsGatherer);

    this.now = new Date().getTime();
    this.logger = logger;
  }

  createClass(StatisticsGatherer, [{
    key: 'frameworkVersionDetectors',
    value: function frameworkVersionDetectors() {
      return {
        'Flow': function Flow() {
          if (window.Vaadin && window.Vaadin.Flow && window.Vaadin.Flow.clients) {
            var flowVersions = Object.keys(window.Vaadin.Flow.clients).map(function (key) {
              return window.Vaadin.Flow.clients[key];
            }).filter(function (client) {
              return client.getVersionInfo;
            }).map(function (client) {
              return client.getVersionInfo().flow;
            });
            if (flowVersions.length > 0) {
              return flowVersions[0];
            }
          }
        },
        'Vaadin Framework': function VaadinFramework() {
          if (window.vaadin && window.vaadin.clients) {
            var frameworkVersions = Object.values(window.vaadin.clients).filter(function (client) {
              return client.getVersionInfo;
            }).map(function (client) {
              return client.getVersionInfo().vaadinVersion;
            });
            if (frameworkVersions.length > 0) {
              return frameworkVersions[0];
            }
          }
        },
        'AngularJs': function AngularJs() {
          if (window.angular && window.angular.version && window.angular.version) {
            return window.angular.version.full;
          }
        },
        'Angular': function Angular() {
          if (window.ng) {
            var tags = document.querySelectorAll("[ng-version]");
            if (tags.length > 0) {
              return tags[0].getAttribute("ng-version");
            }
            return "Unknown";
          }
        },
        'Backbone.js': function BackboneJs() {
          if (window.Backbone) {
            return window.Backbone.VERSION;
          }
        },
        'React': function React() {
          var reactSelector = '[data-reactroot], [data-reactid]';
          if (!!document.querySelector(reactSelector)) {
            // React does not publish the version by default
            return "unknown";
          }
        },
        'Ember': function Ember() {
          if (window.Em && window.Em.VERSION) {
            return window.Em.VERSION;
          } else if (window.Ember && window.Ember.VERSION) {
            return window.Ember.VERSION;
          }
        },
        'jQuery': function (_jQuery) {
          function jQuery() {
            return _jQuery.apply(this, arguments);
          }

          jQuery.toString = function () {
            return _jQuery.toString();
          };

          return jQuery;
        }(function () {
          if (typeof jQuery === 'function' && jQuery.prototype.jquery !== undefined) {
            return jQuery.prototype.jquery;
          }
        }),
        'Polymer': function Polymer() {
          var version = getPolymerVersion();
          if (version) {
            return version;
          }
        },
        'LitElement': function LitElement() {
          var version = window.litElementVersions && window.litElementVersions[0];
          if (version) {
            return version;
          }
        },
        'LitHtml': function LitHtml() {
          var version = window.litHtmlVersions && window.litHtmlVersions[0];
          if (version) {
            return version;
          }
        },
        'Vue.js': function VueJs() {
          if (window.Vue) {
            return window.Vue.version;
          }
        }
      };
    }
  }, {
    key: 'getUsedVaadinElements',
    value: function getUsedVaadinElements(elements) {
      var version = getPolymerVersion();
      var elementClasses = void 0;
      // NOTE: In case you edit the code here, YOU MUST UPDATE any statistics reporting code in Flow.
      // Check all locations calling the method getEntries() in
      // https://github.com/vaadin/flow/blob/master/flow-server/src/main/java/com/vaadin/flow/internal/UsageStatistics.java#L106
      // Currently it is only used by BootstrapHandler.
      if (version && version.indexOf('2') === 0) {
        // Polymer 2: components classes are stored in window.Vaadin
        elementClasses = Object.keys(window.Vaadin).map(function (c) {
          return window.Vaadin[c];
        }).filter(function (c) {
          return c.is;
        });
      } else {
        // Polymer 3: components classes are stored in window.Vaadin.registrations
        elementClasses = window.Vaadin.registrations || [];
      }
      elementClasses.forEach(function (klass) {
        var version = klass.version ? klass.version : "0.0.0";
        elements[klass.is] = { version: version };
      });
    }
  }, {
    key: 'getUsedVaadinThemes',
    value: function getUsedVaadinThemes(themes) {
      ['Lumo', 'Material'].forEach(function (themeName) {
        var theme;
        var version = getPolymerVersion();
        if (version && version.indexOf('2') === 0) {
          // Polymer 2: themes are stored in window.Vaadin
          theme = window.Vaadin[themeName];
        } else {
          // Polymer 3: themes are stored in custom element registry
          theme = customElements.get('vaadin-' + themeName.toLowerCase() + '-styles');
        }
        if (theme && theme.version) {
          themes[themeName] = { version: theme.version };
        }
      });
    }
  }, {
    key: 'getFrameworks',
    value: function getFrameworks(frameworks) {
      var detectors = this.frameworkVersionDetectors();
      Object.keys(detectors).forEach(function (framework) {
        var detector = detectors[framework];
        try {
          var version = detector();
          if (version) {
            frameworks[framework] = { version: version };
          }
        } catch (e) {}
      });
    }
  }, {
    key: 'gather',
    value: function gather(storage) {
      var storedStats = storage.read();
      var gatheredStats = {};
      var types = ["elements", "frameworks", "themes"];

      types.forEach(function (type) {
        gatheredStats[type] = {};
        if (!storedStats[type]) {
          storedStats[type] = {};
        }
      });

      var previousStats = JSON.stringify(storedStats);

      this.getUsedVaadinElements(gatheredStats.elements);
      this.getFrameworks(gatheredStats.frameworks);
      this.getUsedVaadinThemes(gatheredStats.themes);

      var now = this.now;
      types.forEach(function (type) {
        var keys = Object.keys(gatheredStats[type]);
        keys.forEach(function (key) {
          if (!storedStats[type][key] || _typeof(storedStats[type][key]) != _typeof({})) {
            storedStats[type][key] = { firstUsed: now };
          }
          // Discards any previously logged version number
          storedStats[type][key].version = gatheredStats[type][key].version;
          storedStats[type][key].lastUsed = now;
        });
      });

      var newStats = JSON.stringify(storedStats);
      storage.write(newStats);
      if (newStats != previousStats && Object.keys(storedStats).length > 0) {
        this.logger.debug("New stats: " + newStats);
      }
    }
  }]);
  return StatisticsGatherer;
}();

var StatisticsStorage = function () {
  function StatisticsStorage(key) {
    classCallCheck(this, StatisticsStorage);

    this.key = key;
  }

  createClass(StatisticsStorage, [{
    key: 'read',
    value: function read() {
      var localStorageStatsString = localStorage.getItem(this.key);
      try {
        return JSON.parse(localStorageStatsString ? localStorageStatsString : '{}');
      } catch (e) {
        return {};
      }
    }
  }, {
    key: 'write',
    value: function write(data) {
      localStorage.setItem(this.key, data);
    }
  }, {
    key: 'clear',
    value: function clear() {
      localStorage.removeItem(this.key);
    }
  }, {
    key: 'isEmpty',
    value: function isEmpty() {
      var storedStats = this.read();
      var empty = true;
      Object.keys(storedStats).forEach(function (key) {
        if (Object.keys(storedStats[key]).length > 0) {
          empty = false;
        }
      });

      return empty;
    }
  }]);
  return StatisticsStorage;
}();

var StatisticsSender = function () {
  function StatisticsSender(url, logger) {
    classCallCheck(this, StatisticsSender);

    this.url = url;
    this.logger = logger;
  }

  createClass(StatisticsSender, [{
    key: 'send',
    value: function send(data, errorHandler) {
      var logger = this.logger;

      if (navigator.onLine === false) {
        logger.debug("Offline, can't send");
        errorHandler();
        return;
      }
      logger.debug("Sending data to " + this.url);

      var req = new XMLHttpRequest();
      req.withCredentials = true;
      req.addEventListener("load", function () {
        // Stats sent, nothing more to do
        logger.debug("Response: " + req.responseText);
      });
      req.addEventListener("error", function () {
        logger.debug("Send failed");
        errorHandler();
      });
      req.addEventListener("abort", function () {
        logger.debug("Send aborted");
        errorHandler();
      });
      req.open("POST", this.url);
      req.setRequestHeader("Content-Type", "application/json");
      req.send(data);
    }
  }]);
  return StatisticsSender;
}();

var StatisticsLogger = function () {
  function StatisticsLogger(id) {
    classCallCheck(this, StatisticsLogger);

    this.id = id;
  }

  createClass(StatisticsLogger, [{
    key: '_isDebug',
    value: function _isDebug() {
      return localStorage.getItem("vaadin." + this.id + ".debug");
    }
  }, {
    key: 'debug',
    value: function debug(msg) {
      if (this._isDebug()) {
        console.info(this.id + ": " + msg);
      }
    }
  }]);
  return StatisticsLogger;
}();

var UsageStatistics = function () {
  function UsageStatistics() {
    classCallCheck(this, UsageStatistics);

    this.now = new Date();
    this.timeNow = this.now.getTime();
    this.gatherDelay = 10; // Delay between loading this file and gathering stats
    this.initialDelay = 24 * 60 * 60;

    this.logger = new StatisticsLogger("statistics");
    this.storage = new StatisticsStorage("vaadin.statistics.basket");
    this.gatherer = new StatisticsGatherer(this.logger);
    this.sender = new StatisticsSender("https://tools.vaadin.com/usage-stats/submit", this.logger);
  }

  createClass(UsageStatistics, [{
    key: 'maybeGatherAndSend',
    value: function maybeGatherAndSend() {
      var _this = this;

      if (localStorage.getItem(UsageStatistics.optOutKey)) {
        return;
      }
      this.gatherer.gather(this.storage);
      setTimeout(function () {
        _this.maybeSend();
      }, this.gatherDelay * 1000);
    }
  }, {
    key: 'lottery',
    value: function lottery() {
      return true;
    }
  }, {
    key: 'currentMonth',
    value: function currentMonth() {
      return this.now.getYear() * 12 + this.now.getMonth();
    }
  }, {
    key: 'maybeSend',
    value: function maybeSend() {
      var firstUse = Number(localStorage.getItem(UsageStatistics.firstUseKey));
      var monthProcessed = Number(localStorage.getItem(UsageStatistics.monthProcessedKey));

      if (!firstUse) {
        // Use a grace period to avoid interfering with tests, incognito mode etc
        firstUse = this.timeNow;
        localStorage.setItem(UsageStatistics.firstUseKey, firstUse);
      }

      if (this.timeNow < firstUse + this.initialDelay * 1000) {
        this.logger.debug("No statistics will be sent until the initial delay of " + this.initialDelay + "s has passed");
        return;
      }
      if (this.currentMonth() <= monthProcessed) {
        this.logger.debug("This month has already been processed");
        return;
      }
      localStorage.setItem(UsageStatistics.monthProcessedKey, this.currentMonth());
      // Use random sampling
      if (this.lottery()) {
        this.logger.debug("Congratulations, we have a winner!");
      } else {
        this.logger.debug("Sorry, no stats from you this time");
        return;
      }

      this.send();
    }
  }, {
    key: 'send',
    value: function send() {
      // Ensure we have the latest data
      this.gatherer.gather(this.storage);

      // Read, send and clean up
      var data = this.storage.read();
      data["firstUse"] = Number(localStorage.getItem(UsageStatistics.firstUseKey));
      data["usageStatisticsVersion"] = UsageStatistics.version;
      var info = 'This request contains usage statistics gathered from the application running in development mode. \n\nStatistics gathering is automatically disabled and excluded from production builds.\n\nFor details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.\n\n\n\n';
      var self = this;
      this.sender.send(info + JSON.stringify(data), function () {
        // Revert the 'month processed' flag
        localStorage.setItem(UsageStatistics.monthProcessedKey, self.currentMonth() - 1);
      });
    }
  }], [{
    key: 'version',
    get: function get$1() {
      return '2.1.2';
    }
  }, {
    key: 'firstUseKey',
    get: function get$1() {
      return 'vaadin.statistics.firstuse';
    }
  }, {
    key: 'monthProcessedKey',
    get: function get$1() {
      return 'vaadin.statistics.monthProcessed';
    }
  }, {
    key: 'optOutKey',
    get: function get$1() {
      return 'vaadin.statistics.optout';
    }
  }]);
  return UsageStatistics;
}();

try {
  window.Vaadin = window.Vaadin || {};
  window.Vaadin.usageStatsChecker = window.Vaadin.usageStatsChecker || new UsageStatistics();
  window.Vaadin.usageStatsChecker.maybeGatherAndSend();
} catch (e) {
  // Intentionally ignored as this is not a problem in the app being developed
}

}());

  vaadin-dev-mode:end **/
}

const usageStatistics = function() {
  if (typeof runIfDevelopmentMode === 'function') {
    return runIfDevelopmentMode(maybeGatherAndSendStats);
  }
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

/**
 * @fileoverview
 *
 * This module provides a number of strategies for enqueuing asynchronous
 * tasks. Each sub-module provides a standard `run(fn)` interface that returns a
 * handle, and a `cancel(handle)` interface for canceling async tasks before
 * they run.
 *
 * @summary Module that provides a number of strategies for enqueuing
 * asynchronous tasks.
 */

// Microtask implemented using Mutation Observer
let microtaskCurrHandle = 0;
let microtaskLastHandle = 0;
const microtaskCallbacks = [];
let microtaskNodeContent = 0;
let microtaskScheduled = false;
const microtaskNode = document.createTextNode('');

function microtaskFlush() {
  microtaskScheduled = false;
  const len = microtaskCallbacks.length;
  for (let i = 0; i < len; i++) {
    const cb = microtaskCallbacks[i];
    if (cb) {
      try {
        cb();
      } catch (e) {
        setTimeout(() => {
          throw e;
        });
      }
    }
  }
  microtaskCallbacks.splice(0, len);
  microtaskLastHandle += len;
}

new window.MutationObserver(microtaskFlush).observe(microtaskNode, { characterData: true });

/**
 * Async interface wrapper around `setTimeout`.
 *
 * @namespace
 * @summary Async interface wrapper around `setTimeout`.
 */
const timeOut = {
  /**
   * Returns a sub-module with the async interface providing the provided
   * delay.
   *
   * @memberof timeOut
   * @param {number=} delay Time to wait before calling callbacks in ms
   * @return {!AsyncInterface} An async timeout interface
   */
  after(delay) {
    return {
      run(fn) {
        return window.setTimeout(fn, delay);
      },
      cancel(handle) {
        window.clearTimeout(handle);
      },
    };
  },
  /**
   * Enqueues a function called in the next task.
   *
   * @memberof timeOut
   * @param {!Function} fn Callback to run
   * @param {number=} delay Delay in milliseconds
   * @return {number} Handle used for canceling task
   */
  run(fn, delay) {
    return window.setTimeout(fn, delay);
  },
  /**
   * Cancels a previously enqueued `timeOut` callback.
   *
   * @memberof timeOut
   * @param {number} handle Handle returned from `run` of callback to cancel
   * @return {void}
   */
  cancel(handle) {
    window.clearTimeout(handle);
  },
};

/**
 * Async interface wrapper around `requestIdleCallback`.  Falls back to
 * `setTimeout` on browsers that do not support `requestIdleCallback`.
 *
 * @namespace
 * @summary Async interface wrapper around `requestIdleCallback`.
 */
const idlePeriod = {
  /**
   * Enqueues a function called at `requestIdleCallback` timing.
   *
   * @memberof idlePeriod
   * @param {function(!IdleDeadline):void} fn Callback to run
   * @return {number} Handle used for canceling task
   */
  run(fn) {
    return window.requestIdleCallback ? window.requestIdleCallback(fn) : window.setTimeout(fn, 16);
  },
  /**
   * Cancels a previously enqueued `idlePeriod` callback.
   *
   * @memberof idlePeriod
   * @param {number} handle Handle returned from `run` of callback to cancel
   * @return {void}
   */
  cancel(handle) {
    if (window.cancelIdleCallback) {
      window.cancelIdleCallback(handle);
    } else {
      window.clearTimeout(handle);
    }
  },
};

/**
 * Async interface for enqueuing callbacks that run at microtask timing.
 *
 * Note that microtask timing is achieved via a single `MutationObserver`,
 * and thus callbacks enqueued with this API will all run in a single
 * batch, and not interleaved with other microtasks such as promises.
 * Promises are avoided as an implementation choice for the time being
 * due to Safari bugs that cause Promises to lack microtask guarantees.
 *
 * @namespace
 * @summary Async interface for enqueuing callbacks that run at microtask
 *   timing.
 */
const microTask = {
  /**
   * Enqueues a function called at microtask timing.
   *
   * @memberof microTask
   * @param {!Function=} callback Callback to run
   * @return {number} Handle used for canceling task
   */
  run(callback) {
    if (!microtaskScheduled) {
      microtaskScheduled = true;
      microtaskNode.textContent = microtaskNodeContent;
      microtaskNodeContent += 1;
    }
    microtaskCallbacks.push(callback);
    const result = microtaskCurrHandle;
    microtaskCurrHandle += 1;
    return result;
  },

  /**
   * Cancels a previously enqueued `microTask` callback.
   *
   * @memberof microTask
   * @param {number} handle Handle returned from `run` of callback to cancel
   * @return {void}
   */
  cancel(handle) {
    const idx = handle - microtaskLastHandle;
    if (idx >= 0) {
      if (!microtaskCallbacks[idx]) {
        throw new Error(`invalid async handle: ${handle}`);
      }
      microtaskCallbacks[idx] = null;
    }
  },
};

/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

const debouncerQueue = new Set();

/**
 * @summary Collapse multiple callbacks into one invocation after a timer.
 */
class Debouncer {
  /**
   * Creates a debouncer if no debouncer is passed as a parameter
   * or it cancels an active debouncer otherwise. The following
   * example shows how a debouncer can be called multiple times within a
   * microtask and "debounced" such that the provided callback function is
   * called once. Add this method to a custom element:
   *
   * ```js
   * import {microTask} from '@vaadin/component-base/src/async.js';
   * import {Debouncer} from '@vaadin/component-base/src/debounce.js';
   * // ...
   *
   * _debounceWork() {
   *   this._debounceJob = Debouncer.debounce(this._debounceJob,
   *       microTask, () => this._doWork());
   * }
   * ```
   *
   * If the `_debounceWork` method is called multiple times within the same
   * microtask, the `_doWork` function will be called only once at the next
   * microtask checkpoint.
   *
   * Note: In testing it is often convenient to avoid asynchrony. To accomplish
   * this with a debouncer, you can use `enqueueDebouncer` and
   * `flush`. For example, extend the above example by adding
   * `enqueueDebouncer(this._debounceJob)` at the end of the
   * `_debounceWork` method. Then in a test, call `flush` to ensure
   * the debouncer has completed.
   *
   * @param {Debouncer?} debouncer Debouncer object.
   * @param {!AsyncInterface} asyncModule Object with Async interface
   * @param {function()} callback Callback to run.
   * @return {!Debouncer} Returns a debouncer object.
   */
  static debounce(debouncer, asyncModule, callback) {
    if (debouncer instanceof Debouncer) {
      // Cancel the async callback, but leave in debouncerQueue if it was
      // enqueued, to maintain 1.x flush order
      debouncer._cancelAsync();
    } else {
      debouncer = new Debouncer();
    }
    debouncer.setConfig(asyncModule, callback);
    return debouncer;
  }

  constructor() {
    this._asyncModule = null;
    this._callback = null;
    this._timer = null;
  }

  /**
   * Sets the scheduler; that is, a module with the Async interface,
   * a callback and optional arguments to be passed to the run function
   * from the async module.
   *
   * @param {!AsyncInterface} asyncModule Object with Async interface.
   * @param {function()} callback Callback to run.
   * @return {void}
   */
  setConfig(asyncModule, callback) {
    this._asyncModule = asyncModule;
    this._callback = callback;
    this._timer = this._asyncModule.run(() => {
      this._timer = null;
      debouncerQueue.delete(this);
      this._callback();
    });
  }

  /**
   * Cancels an active debouncer and returns a reference to itself.
   *
   * @return {void}
   */
  cancel() {
    if (this.isActive()) {
      this._cancelAsync();
      // Canceling a debouncer removes its spot from the flush queue,
      // so if a debouncer is manually canceled and re-debounced, it
      // will reset its flush order (this is a very minor difference from 1.x)
      // Re-debouncing via the `debounce` API retains the 1.x FIFO flush order
      debouncerQueue.delete(this);
    }
  }

  /**
   * Cancels a debouncer's async callback.
   *
   * @return {void}
   */
  _cancelAsync() {
    if (this.isActive()) {
      this._asyncModule.cancel(/** @type {number} */ (this._timer));
      this._timer = null;
    }
  }

  /**
   * Flushes an active debouncer and returns a reference to itself.
   *
   * @return {void}
   */
  flush() {
    if (this.isActive()) {
      this.cancel();
      this._callback();
    }
  }

  /**
   * Returns true if the debouncer is active.
   *
   * @return {boolean} True if active.
   */
  isActive() {
    return this._timer != null;
  }
}

/**
 * Adds a `Debouncer` to a list of globally flushable tasks.
 *
 * @param {!Debouncer} debouncer Debouncer to enqueue
 * @return {void}
 */
function enqueueDebouncer(debouncer) {
  debouncerQueue.add(debouncer);
}

/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Array of Vaadin custom element classes that have been subscribed to the dir changes.
 */
const directionSubscribers = [];

function alignDirs(element, documentDir, elementDir = element.getAttribute('dir')) {
  if (documentDir) {
    element.setAttribute('dir', documentDir);
  } else if (elementDir != null) {
    element.removeAttribute('dir');
  }
}

function getDocumentDir() {
  return document.documentElement.getAttribute('dir');
}

function directionUpdater() {
  const documentDir = getDocumentDir();
  directionSubscribers.forEach((element) => {
    alignDirs(element, documentDir);
  });
}

const directionObserver = new MutationObserver(directionUpdater);
directionObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });

/**
 * A mixin to handle `dir` attribute based on the one set on the `<html>` element.
 *
 * @polymerMixin
 */
const DirMixin = (superClass) =>
  class VaadinDirMixin extends superClass {
    static get properties() {
      return {
        /**
         * @protected
         */
        dir: {
          type: String,
          value: '',
          reflectToAttribute: true,
          converter: {
            fromAttribute: (attr) => {
              return !attr ? '' : attr;
            },
            toAttribute: (prop) => {
              return prop === '' ? null : prop;
            },
          },
        },
      };
    }

    /**
     * @return {boolean}
     * @protected
     */
    get __isRTL() {
      return this.getAttribute('dir') === 'rtl';
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      if (!this.hasAttribute('dir') || this.__restoreSubscription) {
        this.__subscribe();
        alignDirs(this, getDocumentDir(), null);
      }
    }

    /** @protected */
    attributeChangedCallback(name, oldValue, newValue) {
      super.attributeChangedCallback(name, oldValue, newValue);
      if (name !== 'dir') {
        return;
      }

      const documentDir = getDocumentDir();

      // New value equals to the document direction and the element is not subscribed to the changes
      const newValueEqlDocDir = newValue === documentDir && directionSubscribers.indexOf(this) === -1;
      // Value was emptied and the element is not subscribed to the changes
      const newValueEmptied = !newValue && oldValue && directionSubscribers.indexOf(this) === -1;
      // New value is different and the old equals to document direction and the element is not subscribed to the changes
      const newDiffValue = newValue !== documentDir && oldValue === documentDir;

      if (newValueEqlDocDir || newValueEmptied) {
        this.__subscribe();
        alignDirs(this, documentDir, newValue);
      } else if (newDiffValue) {
        this.__unsubscribe();
      }
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();
      this.__restoreSubscription = directionSubscribers.includes(this);
      this.__unsubscribe();
    }

    /** @protected */
    _valueToNodeAttribute(node, value, attribute) {
      // Override default Polymer attribute reflection to match native behavior of HTMLElement.dir property
      // If the property contains an empty string then it should not create an empty attribute
      if (attribute === 'dir' && value === '' && !node.hasAttribute('dir')) {
        return;
      }
      super._valueToNodeAttribute(node, value, attribute);
    }

    /** @protected */
    _attributeToProperty(attribute, value, type) {
      // Override default Polymer attribute reflection to match native behavior of HTMLElement.dir property
      // If the attribute is removed, then the dir property should contain an empty string instead of null
      if (attribute === 'dir' && !value) {
        this.dir = '';
      } else {
        super._attributeToProperty(attribute, value, type);
      }
    }

    /** @private */
    __subscribe() {
      if (!directionSubscribers.includes(this)) {
        directionSubscribers.push(this);
      }
    }

    /** @private */
    __unsubscribe() {
      if (directionSubscribers.includes(this)) {
        directionSubscribers.splice(directionSubscribers.indexOf(this), 1);
      }
    }
  };

/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

if (!window.Vaadin) {
  window.Vaadin = {};
}

/**
 * Array of Vaadin custom element classes that have been finalized.
 */
if (!window.Vaadin.registrations) {
  window.Vaadin.registrations = [];
}

if (!window.Vaadin.developmentModeCallback) {
  window.Vaadin.developmentModeCallback = {};
}

window.Vaadin.developmentModeCallback['vaadin-usage-statistics'] = function () {
  usageStatistics();
};

let statsJob;

const registered = new Set();

/**
 * @polymerMixin
 * @mixes DirMixin
 */
const ElementMixin = (superClass) =>
  class VaadinElementMixin extends DirMixin(superClass) {
    static get version() {
      return '24.0.0';
    }

    /** @protected */
    static finalize() {
      super.finalize();

      const { is } = this;

      // Registers a class prototype for telemetry purposes.
      if (is && !registered.has(is)) {
        window.Vaadin.registrations.push(this);
        registered.add(is);

        if (window.Vaadin.developmentModeCallback) {
          statsJob = Debouncer.debounce(statsJob, idlePeriod, () => {
            window.Vaadin.developmentModeCallback['vaadin-usage-statistics']();
          });
          enqueueDebouncer(statsJob);
        }
      }
    }

    constructor() {
      super();

      if (document.doctype === null) {
        console.warn(
          'Vaadin components require the "standards mode" declaration. Please add <!DOCTYPE html> to the HTML document.',
        );
      }
    }
  };

/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

function newSplice(index, removed, addedCount) {
  return {
    index: index,
    removed: removed,
    addedCount: addedCount
  };
}

const EDIT_LEAVE = 0;
const EDIT_UPDATE = 1;
const EDIT_ADD = 2;
const EDIT_DELETE = 3;

// Note: This function is *based* on the computation of the Levenshtein
// "edit" distance. The one change is that "updates" are treated as two
// edits - not one. With Array splices, an update is really a delete
// followed by an add. By retaining this, we optimize for "keeping" the
// maximum array items in the original array. For example:
//
//   'xxxx123' -> '123yyyy'
//
// With 1-edit updates, the shortest path would be just to update all seven
// characters. With 2-edit updates, we delete 4, leave 3, and add 4. This
// leaves the substring '123' intact.
function calcEditDistances(current, currentStart, currentEnd,
                            old, oldStart, oldEnd) {
  // "Deletion" columns
  let rowCount = oldEnd - oldStart + 1;
  let columnCount = currentEnd - currentStart + 1;
  let distances = new Array(rowCount);

  // "Addition" rows. Initialize null column.
  for (let i = 0; i < rowCount; i++) {
    distances[i] = new Array(columnCount);
    distances[i][0] = i;
  }

  // Initialize null row
  for (let j = 0; j < columnCount; j++)
    distances[0][j] = j;

  for (let i = 1; i < rowCount; i++) {
    for (let j = 1; j < columnCount; j++) {
      if (equals(current[currentStart + j - 1], old[oldStart + i - 1]))
        distances[i][j] = distances[i - 1][j - 1];
      else {
        let north = distances[i - 1][j] + 1;
        let west = distances[i][j - 1] + 1;
        distances[i][j] = north < west ? north : west;
      }
    }
  }

  return distances;
}

// This starts at the final weight, and walks "backward" by finding
// the minimum previous weight recursively until the origin of the weight
// matrix.
function spliceOperationsFromEditDistances(distances) {
  let i = distances.length - 1;
  let j = distances[0].length - 1;
  let current = distances[i][j];
  let edits = [];
  while (i > 0 || j > 0) {
    if (i == 0) {
      edits.push(EDIT_ADD);
      j--;
      continue;
    }
    if (j == 0) {
      edits.push(EDIT_DELETE);
      i--;
      continue;
    }
    let northWest = distances[i - 1][j - 1];
    let west = distances[i - 1][j];
    let north = distances[i][j - 1];

    let min;
    if (west < north)
      min = west < northWest ? west : northWest;
    else
      min = north < northWest ? north : northWest;

    if (min == northWest) {
      if (northWest == current) {
        edits.push(EDIT_LEAVE);
      } else {
        edits.push(EDIT_UPDATE);
        current = northWest;
      }
      i--;
      j--;
    } else if (min == west) {
      edits.push(EDIT_DELETE);
      i--;
      current = west;
    } else {
      edits.push(EDIT_ADD);
      j--;
      current = north;
    }
  }

  edits.reverse();
  return edits;
}

/**
 * Splice Projection functions:
 *
 * A splice map is a representation of how a previous array of items
 * was transformed into a new array of items. Conceptually it is a list of
 * tuples of
 *
 *   <index, removed, addedCount>
 *
 * which are kept in ascending index order of. The tuple represents that at
 * the |index|, |removed| sequence of items were removed, and counting forward
 * from |index|, |addedCount| items were added.
 */

/**
 * Lacking individual splice mutation information, the minimal set of
 * splices can be synthesized given the previous state and final state of an
 * array. The basic approach is to calculate the edit distance matrix and
 * choose the shortest path through it.
 *
 * Complexity: O(l * p)
 *   l: The length of the current array
 *   p: The length of the old array
 *
 * @param {!Array} current The current "changed" array for which to
 * calculate splices.
 * @param {number} currentStart Starting index in the `current` array for
 * which splices are calculated.
 * @param {number} currentEnd Ending index in the `current` array for
 * which splices are calculated.
 * @param {!Array} old The original "unchanged" array to compare `current`
 * against to determine splices.
 * @param {number} oldStart Starting index in the `old` array for
 * which splices are calculated.
 * @param {number} oldEnd Ending index in the `old` array for
 * which splices are calculated.
 * @return {!Array} Returns an array of splice record objects. Each of these
 * contains: `index` the location where the splice occurred; `removed`
 * the array of removed items from this location; `addedCount` the number
 * of items added at this location.
 */
function calcSplices(current, currentStart, currentEnd,
                      old, oldStart, oldEnd) {
  let prefixCount = 0;
  let suffixCount = 0;
  let splice;

  let minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);
  if (currentStart == 0 && oldStart == 0)
    prefixCount = sharedPrefix(current, old, minLength);

  if (currentEnd == current.length && oldEnd == old.length)
    suffixCount = sharedSuffix(current, old, minLength - prefixCount);

  currentStart += prefixCount;
  oldStart += prefixCount;
  currentEnd -= suffixCount;
  oldEnd -= suffixCount;

  if (currentEnd - currentStart == 0 && oldEnd - oldStart == 0)
    return [];

  if (currentStart == currentEnd) {
    splice = newSplice(currentStart, [], 0);
    while (oldStart < oldEnd)
      splice.removed.push(old[oldStart++]);

    return [ splice ];
  } else if (oldStart == oldEnd)
    return [ newSplice(currentStart, [], currentEnd - currentStart) ];

  let ops = spliceOperationsFromEditDistances(
      calcEditDistances(current, currentStart, currentEnd,
                             old, oldStart, oldEnd));

  splice = undefined;
  let splices = [];
  let index = currentStart;
  let oldIndex = oldStart;
  for (let i = 0; i < ops.length; i++) {
    switch(ops[i]) {
      case EDIT_LEAVE:
        if (splice) {
          splices.push(splice);
          splice = undefined;
        }

        index++;
        oldIndex++;
        break;
      case EDIT_UPDATE:
        if (!splice)
          splice = newSplice(index, [], 0);

        splice.addedCount++;
        index++;

        splice.removed.push(old[oldIndex]);
        oldIndex++;
        break;
      case EDIT_ADD:
        if (!splice)
          splice = newSplice(index, [], 0);

        splice.addedCount++;
        index++;
        break;
      case EDIT_DELETE:
        if (!splice)
          splice = newSplice(index, [], 0);

        splice.removed.push(old[oldIndex]);
        oldIndex++;
        break;
    }
  }

  if (splice) {
    splices.push(splice);
  }
  return splices;
}

function sharedPrefix(current, old, searchLength) {
  for (let i = 0; i < searchLength; i++)
    if (!equals(current[i], old[i]))
      return i;
  return searchLength;
}

function sharedSuffix(current, old, searchLength) {
  let index1 = current.length;
  let index2 = old.length;
  let count = 0;
  while (count < searchLength && equals(current[--index1], old[--index2]))
    count++;

  return count;
}

/**
 * Returns an array of splice records indicating the minimum edits required
 * to transform the `previous` array into the `current` array.
 *
 * Splice records are ordered by index and contain the following fields:
 * - `index`: index where edit started
 * - `removed`: array of removed items from this index
 * - `addedCount`: number of items added at this index
 *
 * This function is based on the Levenshtein "minimum edit distance"
 * algorithm. Note that updates are treated as removal followed by addition.
 *
 * The worst-case time complexity of this algorithm is `O(l * p)`
 *   l: The length of the current array
 *   p: The length of the previous array
 *
 * However, the worst-case complexity is reduced by an `O(n)` optimization
 * to detect any shared prefix & suffix between the two arrays and only
 * perform the more expensive minimum edit distance calculation over the
 * non-shared portions of the arrays.
 *
 * @function
 * @param {!Array} current The "changed" array for which splices will be
 * calculated.
 * @param {!Array} previous The "unchanged" original array to compare
 * `current` against to determine the splices.
 * @return {!Array} Returns an array of splice record objects. Each of these
 * contains: `index` the location where the splice occurred; `removed`
 * the array of removed items from this location; `addedCount` the number
 * of items added at this location.
 */
function calculateSplices(current, previous) {
  return calcSplices(current, 0, current.length, previous, 0,
                          previous.length);
}

function equals(currentValue, previousValue) {
  return currentValue === previousValue;
}

/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/**
 * Returns true if `node` is a slot element
 * @param {!Node} node Node to test.
 * @return {boolean} Returns true if the given `node` is a slot
 * @private
 */
function isSlot(node) {
  return (node.localName === 'slot');
}

/**
 * Class that listens for changes (additions or removals) to
 * "flattened nodes" on a given `node`. The list of flattened nodes consists
 * of a node's children and, for any children that are `<slot>` elements,
 * the expanded flattened list of `assignedNodes`.
 * For example, if the observed node has children `<a></a><slot></slot><b></b>`
 * and the `<slot>` has one `<div>` assigned to it, then the flattened
 * nodes list is `<a></a><div></div><b></b>`. If the `<slot>` has other
 * `<slot>` elements assigned to it, these are flattened as well.
 *
 * The provided `callback` is called whenever any change to this list
 * of flattened nodes occurs, where an addition or removal of a node is
 * considered a change. The `callback` is called with one argument, an object
 * containing an array of any `addedNodes` and `removedNodes`.
 *
 * Note: the callback is called asynchronous to any changes
 * at a microtask checkpoint. This is because observation is performed using
 * `MutationObserver` and the `<slot>` element's `slotchange` event which
 * are asynchronous.
 *
 * An example:
 * ```js
 * class TestSelfObserve extends PolymerElement {
 *   static get is() { return 'test-self-observe';}
 *   connectedCallback() {
 *     super.connectedCallback();
 *     this._observer = new FlattenedNodesObserver(this, (info) => {
 *       this.info = info;
 *     });
 *   }
 *   disconnectedCallback() {
 *     super.disconnectedCallback();
 *     this._observer.disconnect();
 *   }
 * }
 * customElements.define(TestSelfObserve.is, TestSelfObserve);
 * ```
 *
 * @summary Class that listens for changes (additions or removals) to
 * "flattened nodes" on a given `node`.
 * @implements {PolymerDomApi.ObserveHandle}
 */
let FlattenedNodesObserver = class {

  /**
   * Returns the list of flattened nodes for the given `node`.
   * This list consists of a node's children and, for any children
   * that are `<slot>` elements, the expanded flattened list of `assignedNodes`.
   * For example, if the observed node has children `<a></a><slot></slot><b></b>`
   * and the `<slot>` has one `<div>` assigned to it, then the flattened
   * nodes list is `<a></a><div></div><b></b>`. If the `<slot>` has other
   * `<slot>` elements assigned to it, these are flattened as well.
   *
   * @param {!HTMLElement|!HTMLSlotElement} node The node for which to
   *      return the list of flattened nodes.
   * @return {!Array<!Node>} The list of flattened nodes for the given `node`.
   * @nocollapse See https://github.com/google/closure-compiler/issues/2763
   */
  // eslint-disable-next-line
  static getFlattenedNodes(node) {
    const wrapped = wrap$1(node);
    if (isSlot(node)) {
      node = /** @type {!HTMLSlotElement} */(node); // eslint-disable-line no-self-assign
      return wrapped.assignedNodes({flatten: true});
    } else {
      return Array.from(wrapped.childNodes).map((node) => {
        if (isSlot(node)) {
          node = /** @type {!HTMLSlotElement} */(node); // eslint-disable-line no-self-assign
          return wrap$1(node).assignedNodes({flatten: true});
        } else {
          return [node];
        }
      }).reduce((a, b) => a.concat(b), []);
    }
  }

  /**
   * @param {!HTMLElement} target Node on which to listen for changes.
   * @param {?function(this: Element, { target: !HTMLElement, addedNodes: !Array<!Element>, removedNodes: !Array<!Element> }):void} callback Function called when there are additions
   * or removals from the target's list of flattened nodes.
   */
  // eslint-disable-next-line
  constructor(target, callback) {
    /**
     * @type {MutationObserver}
     * @private
     */
    this._shadyChildrenObserver = null;
    /**
     * @type {MutationObserver}
     * @private
     */
    this._nativeChildrenObserver = null;
    this._connected = false;
    /**
     * @type {!HTMLElement}
     * @private
     */
    this._target = target;
    this.callback = callback;
    this._effectiveNodes = [];
    this._observer = null;
    this._scheduled = false;
    /**
     * @type {function()}
     * @private
     */
    this._boundSchedule = () => {
      this._schedule();
    };
    this.connect();
    this._schedule();
  }

  /**
   * Activates an observer. This method is automatically called when
   * a `FlattenedNodesObserver` is created. It should only be called to
   * re-activate an observer that has been deactivated via the `disconnect` method.
   *
   * @return {void}
   */
  connect() {
    if (isSlot(this._target)) {
      this._listenSlots([this._target]);
    } else if (wrap$1(this._target).children) {
      this._listenSlots(
          /** @type {!NodeList<!Node>} */ (wrap$1(this._target).children));
      if (window.ShadyDOM) {
        this._shadyChildrenObserver =
          window.ShadyDOM.observeChildren(this._target, (mutations) => {
            this._processMutations(mutations);
          });
      } else {
        this._nativeChildrenObserver =
          new MutationObserver((mutations) => {
            this._processMutations(mutations);
          });
        this._nativeChildrenObserver.observe(this._target, {childList: true});
      }
    }
    this._connected = true;
  }

  /**
   * Deactivates the flattened nodes observer. After calling this method
   * the observer callback will not be called when changes to flattened nodes
   * occur. The `connect` method may be subsequently called to reactivate
   * the observer.
   *
   * @return {void}
   * @override
   */
  disconnect() {
    if (isSlot(this._target)) {
      this._unlistenSlots([this._target]);
    } else if (wrap$1(this._target).children) {
      this._unlistenSlots(
          /** @type {!NodeList<!Node>} */ (wrap$1(this._target).children));
      if (window.ShadyDOM && this._shadyChildrenObserver) {
        window.ShadyDOM.unobserveChildren(this._shadyChildrenObserver);
        this._shadyChildrenObserver = null;
      } else if (this._nativeChildrenObserver) {
        this._nativeChildrenObserver.disconnect();
        this._nativeChildrenObserver = null;
      }
    }
    this._connected = false;
  }

  /**
   * @return {void}
   * @private
   */
  _schedule() {
    if (!this._scheduled) {
      this._scheduled = true;
      microTask$1.run(() => this.flush());
    }
  }

  /**
   * @param {Array<MutationRecord>} mutations Mutations signaled by the mutation observer
   * @return {void}
   * @private
   */
  _processMutations(mutations) {
    this._processSlotMutations(mutations);
    this.flush();
  }

  /**
   * @param {Array<MutationRecord>} mutations Mutations signaled by the mutation observer
   * @return {void}
   * @private
   */
  _processSlotMutations(mutations) {
    if (mutations) {
      for (let i=0; i < mutations.length; i++) {
        let mutation = mutations[i];
        if (mutation.addedNodes) {
          this._listenSlots(mutation.addedNodes);
        }
        if (mutation.removedNodes) {
          this._unlistenSlots(mutation.removedNodes);
        }
      }
    }
  }

  /**
   * Flushes the observer causing any pending changes to be immediately
   * delivered the observer callback. By default these changes are delivered
   * asynchronously at the next microtask checkpoint.
   *
   * @return {boolean} Returns true if any pending changes caused the observer
   * callback to run.
   */
  flush() {
    if (!this._connected) {
      return false;
    }
    if (window.ShadyDOM) {
      ShadyDOM.flush();
    }
    if (this._nativeChildrenObserver) {
      this._processSlotMutations(this._nativeChildrenObserver.takeRecords());
    } else if (this._shadyChildrenObserver) {
      this._processSlotMutations(this._shadyChildrenObserver.takeRecords());
    }
    this._scheduled = false;
    let info = {
      target: this._target,
      addedNodes: [],
      removedNodes: []
    };
    let newNodes = this.constructor.getFlattenedNodes(this._target);
    let splices = calculateSplices(newNodes,
      this._effectiveNodes);
    // process removals
    for (let i=0, s; (i<splices.length) && (s=splices[i]); i++) {
      for (let j=0, n; (j < s.removed.length) && (n=s.removed[j]); j++) {
        info.removedNodes.push(n);
      }
    }
    // process adds
    for (let i=0, s; (i<splices.length) && (s=splices[i]); i++) {
      for (let j=s.index; j < s.index + s.addedCount; j++) {
        info.addedNodes.push(newNodes[j]);
      }
    }
    // update cache
    this._effectiveNodes = newNodes;
    let didFlush = false;
    if (info.addedNodes.length || info.removedNodes.length) {
      didFlush = true;
      this.callback.call(this._target, info);
    }
    return didFlush;
  }

  /**
   * @param {!Array<!Node>|!NodeList<!Node>} nodeList Nodes that could change
   * @return {void}
   * @private
   */
  _listenSlots(nodeList) {
    for (let i=0; i < nodeList.length; i++) {
      let n = nodeList[i];
      if (isSlot(n)) {
        n.addEventListener('slotchange', this._boundSchedule);
      }
    }
  }

  /**
   * @param {!Array<!Node>|!NodeList<!Node>} nodeList Nodes that could change
   * @return {void}
   * @private
   */
  _unlistenSlots(nodeList) {
    for (let i=0; i < nodeList.length; i++) {
      let n = nodeList[i];
      if (isSlot(n)) {
        n.removeEventListener('slotchange', this._boundSchedule);
      }
    }
  }

};

/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Returns an array of ancestor root nodes for the given node.
 *
 * A root node is either a document node or a document fragment node (Shadow Root).
 * The array is collected by a bottom-up DOM traversing that starts with the given node
 * and involves both the light DOM and ancestor shadow DOM trees.
 *
 * @param {Node} node
 * @return {Node[]}
 */
function getAncestorRootNodes(node) {
  const result = [];

  while (node) {
    if (node.nodeType === Node.DOCUMENT_NODE) {
      result.push(node);
      break;
    }

    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      result.push(node);
      node = node.host;
      continue;
    }

    if (node.assignedSlot) {
      node = node.assignedSlot;
      continue;
    }

    node = node.parentNode;
  }

  return result;
}

/**
 * Returns true if the given node is an empty text node, false otherwise.
 *
 * @param {Node} node
 * @return {boolean}
 */
function isEmptyTextNode(node) {
  return node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '';
}

/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

let uniqueId = 0;

/**
 * Returns a unique integer id.
 *
 * @return {number}
 */
function generateUniqueId() {
  // eslint-disable-next-line no-plusplus
  return uniqueId++;
}

/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A controller for providing content to slot element and observing changes.
 */
class SlotController extends EventTarget {
  /**
   * Ensure that every instance has unique ID.
   *
   * @param {HTMLElement} host
   * @param {string} slotName
   * @return {string}
   * @protected
   */
  static generateId(host, slotName) {
    const prefix = slotName || 'default';
    return `${prefix}-${host.localName}-${generateUniqueId()}`;
  }

  constructor(host, slotName, tagName, config = {}) {
    super();

    const { initializer, multiple, observe, useUniqueId } = config;

    this.host = host;
    this.slotName = slotName;
    this.tagName = tagName;
    this.observe = typeof observe === 'boolean' ? observe : true;
    this.multiple = typeof multiple === 'boolean' ? multiple : false;
    this.slotInitializer = initializer;

    if (multiple) {
      this.nodes = [];
    }

    // Only generate the default ID if requested by the controller.
    if (useUniqueId) {
      this.defaultId = this.constructor.generateId(host, slotName);
    }
  }

  hostConnected() {
    if (!this.initialized) {
      if (this.multiple) {
        this.initMultiple();
      } else {
        this.initSingle();
      }

      if (this.observe) {
        this.observeSlot();
      }

      this.initialized = true;
    }
  }

  /** @protected */
  initSingle() {
    let node = this.getSlotChild();

    if (!node) {
      node = this.attachDefaultNode();
      this.initNode(node);
    } else {
      this.node = node;
      this.initAddedNode(node);
    }
  }

  /** @protected */
  initMultiple() {
    const children = this.getSlotChildren();

    if (children.length === 0) {
      const defaultNode = this.attachDefaultNode();
      this.nodes = [defaultNode];
      this.initNode(defaultNode);
    } else {
      this.nodes = children;
      children.forEach((node) => {
        this.initAddedNode(node);
      });
    }
  }

  /**
   * Create and attach default node using the provided tag name, if any.
   * @return {Node | undefined}
   * @protected
   */
  attachDefaultNode() {
    const { host, slotName, tagName } = this;

    // Check if the node was created previously and if so, reuse it.
    let node = this.defaultNode;

    // Tag name is optional, sometimes we don't init default content.
    if (!node && tagName) {
      node = document.createElement(tagName);
      if (node instanceof Element) {
        if (slotName !== '') {
          node.setAttribute('slot', slotName);
        }
        this.node = node;
        this.defaultNode = node;
      }
    }

    if (node) {
      host.appendChild(node);
    }

    return node;
  }

  /**
   * Return the list of nodes matching the slot managed by the controller.
   * @return {Node}
   */
  getSlotChildren() {
    const { slotName } = this;
    return Array.from(this.host.childNodes).filter((node) => {
      // Either an element (any slot) or a text node (only un-named slot).
      return (
        (node.nodeType === Node.ELEMENT_NODE && node.slot === slotName) ||
        (node.nodeType === Node.TEXT_NODE && node.textContent.trim() && slotName === '')
      );
    });
  }

  /**
   * Return a reference to the node managed by the controller.
   * @return {Node}
   */
  getSlotChild() {
    return this.getSlotChildren()[0];
  }

  /**
   * Run `slotInitializer` for the node managed by the controller.
   *
   * @param {Node} node
   * @protected
   */
  initNode(node) {
    const { slotInitializer } = this;
    // Don't try to bind `this` to initializer (normally it's arrow function).
    // Instead, pass the host as a first argument to access component's state.
    if (slotInitializer) {
      slotInitializer(node, this.host);
    }
  }

  /**
   * Override to initialize the newly added custom node.
   *
   * @param {Node} _node
   * @protected
   */
  initCustomNode(_node) {}

  /**
   * Override to teardown slotted node when it's removed.
   *
   * @param {Node} _node
   * @protected
   */
  teardownNode(_node) {}

  /**
   * Run both `initCustomNode` and `initNode` for a custom slotted node.
   *
   * @param {Node} node
   * @protected
   */
  initAddedNode(node) {
    if (node !== this.defaultNode) {
      this.initCustomNode(node);
      this.initNode(node);
    }
  }

  /**
   * Setup the observer to manage slot content changes.
   * @protected
   */
  observeSlot() {
    const { slotName } = this;
    const selector = slotName === '' ? 'slot:not([name])' : `slot[name=${slotName}]`;
    const slot = this.host.shadowRoot.querySelector(selector);

    this.__slotObserver = new FlattenedNodesObserver(slot, (info) => {
      const current = this.multiple ? this.nodes : [this.node];

      // Calling `slot.assignedNodes()` includes whitespace text nodes in case of default slot:
      // unlike comment nodes, they are not filtered out. So we need to manually ignore them.
      const newNodes = info.addedNodes.filter((node) => !isEmptyTextNode(node) && !current.includes(node));

      if (info.removedNodes.length) {
        info.removedNodes.forEach((node) => {
          this.teardownNode(node);
        });
      }

      if (newNodes && newNodes.length > 0) {
        // Custom node is added, remove the current one.
        current.forEach((node) => {
          if (node && node.isConnected) {
            node.parentNode.removeChild(node);
          }
        });

        if (this.multiple) {
          this.nodes = newNodes;
          newNodes.forEach((node) => {
            this.initAddedNode(node);
          });
        } else {
          this.node = newNodes[0];
          this.initAddedNode(this.node);
        }
      }
    });
  }
}

/**
 * @license
 * Copyright (c) 2022 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A controller that manages the slotted tooltip element.
 */
class TooltipController extends SlotController {
  constructor(host) {
    // Do not provide slot factory to create tooltip lazily.
    super(host, 'tooltip');

    this.setTarget(host);
  }

  /**
   * Override to initialize the newly added custom tooltip.
   *
   * @param {Node} tooltipNode
   * @protected
   * @override
   */
  initCustomNode(tooltipNode) {
    tooltipNode.target = this.target;

    if (this.context !== undefined) {
      tooltipNode.context = this.context;
    }

    if (this.manual !== undefined) {
      tooltipNode.manual = this.manual;
    }

    if (this.opened !== undefined) {
      tooltipNode.opened = this.opened;
    }

    if (this.position !== undefined) {
      tooltipNode._position = this.position;
    }

    if (this.shouldShow !== undefined) {
      tooltipNode.shouldShow = this.shouldShow;
    }
  }

  /**
   * Set a context object to be used by generator.
   * @param {object} context
   */
  setContext(context) {
    this.context = context;

    const tooltipNode = this.node;
    if (tooltipNode) {
      tooltipNode.context = context;
    }
  }

  /**
   * Toggle manual state on the slotted tooltip.
   * @param {boolean} manual
   */
  setManual(manual) {
    this.manual = manual;

    const tooltipNode = this.node;
    if (tooltipNode) {
      tooltipNode.manual = manual;
    }
  }

  /**
   * Toggle opened state on the slotted tooltip.
   * @param {boolean} opened
   */
  setOpened(opened) {
    this.opened = opened;

    const tooltipNode = this.node;
    if (tooltipNode) {
      tooltipNode.opened = opened;
    }
  }

  /**
   * Set default position for the slotted tooltip.
   * This can be overridden by setting the position
   * using corresponding property or attribute.
   * @param {string} position
   */
  setPosition(position) {
    this.position = position;

    const tooltipNode = this.node;
    if (tooltipNode) {
      tooltipNode._position = position;
    }
  }

  /**
   * Set function used to detect whether to show
   * the tooltip based on a condition.
   * @param {Function} shouldShow
   */
  setShouldShow(shouldShow) {
    this.shouldShow = shouldShow;

    const tooltipNode = this.node;
    if (tooltipNode) {
      tooltipNode.shouldShow = shouldShow;
    }
  }

  /**
   * Set an HTML element to attach the tooltip to.
   * @param {HTMLElement} target
   */
  setTarget(target) {
    this.target = target;

    const tooltipNode = this.node;
    if (tooltipNode) {
      tooltipNode.target = target;
    }
  }
}

/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const buttonStyles = i`
  :host {
    display: inline-block;
    position: relative;
    outline: none;
    white-space: nowrap;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* Aligns the button with form fields when placed on the same line.
  Note, to make it work, the form fields should have the same "::before" pseudo-element. */
  .vaadin-button-container::before {
    content: '\\2003';
    display: inline-block;
    width: 0;
    max-height: 100%;
  }

  .vaadin-button-container {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    height: 100%;
    min-height: inherit;
    text-shadow: inherit;
  }

  [part='prefix'],
  [part='suffix'] {
    flex: none;
  }

  [part='label'] {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const buttonTemplate = (html) => html`
  <div class="vaadin-button-container">
    <span part="prefix" aria-hidden="true">
      <slot name="prefix"></slot>
    </span>
    <span part="label">
      <slot></slot>
    </span>
    <span part="suffix" aria-hidden="true">
      <slot name="suffix"></slot>
    </span>
  </div>
  <slot name="tooltip"></slot>
`;

/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin to provide disabled property for field components.
 *
 * @polymerMixin
 */
const DisabledMixin = dedupingMixin(
  (superclass) =>
    class DisabledMixinClass extends superclass {
      static get properties() {
        return {
          /**
           * If true, the user cannot interact with this element.
           */
          disabled: {
            type: Boolean,
            value: false,
            observer: '_disabledChanged',
            reflectToAttribute: true,
          },
        };
      }

      /**
       * @param {boolean} disabled
       * @protected
       */
      _disabledChanged(disabled) {
        this._setAriaDisabled(disabled);
      }

      /**
       * @param {boolean} disabled
       * @protected
       */
      _setAriaDisabled(disabled) {
        if (disabled) {
          this.setAttribute('aria-disabled', 'true');
        } else {
          this.removeAttribute('aria-disabled');
        }
      }

      /**
       * Overrides the default element `click` method in order to prevent
       * firing the `click` event when the element is disabled.
       * @protected
       * @override
       */
      click() {
        if (!this.disabled) {
          super.click();
        }
      }
    },
);

/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/


const passiveTouchGestures = false;
const wrap = (node) => node;

// Detect native touch action support
const HAS_NATIVE_TA = typeof document.head.style.touchAction === 'string';
const GESTURE_KEY = '__polymerGestures';
const HANDLED_OBJ = '__polymerGesturesHandled';
const TOUCH_ACTION = '__polymerGesturesTouchAction';
// Radius for tap and track
const TAP_DISTANCE = 25;
const TRACK_DISTANCE = 5;
// Number of last N track positions to keep
const TRACK_LENGTH = 2;

const MOUSE_EVENTS = ['mousedown', 'mousemove', 'mouseup', 'click'];
// An array of bitmask values for mapping MouseEvent.which to MouseEvent.buttons
const MOUSE_WHICH_TO_BUTTONS = [0, 1, 4, 2];
const MOUSE_HAS_BUTTONS = (function () {
  try {
    return new MouseEvent('test', { buttons: 1 }).buttons === 1;
  } catch (e) {
    return false;
  }
})();

/**
 * @param {string} name Possible mouse event name
 * @return {boolean} true if mouse event, false if not
 */
function isMouseEvent(name) {
  return MOUSE_EVENTS.indexOf(name) > -1;
}

/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
// check for passive event listeners
let supportsPassive = false;
(function () {
  try {
    const opts = Object.defineProperty({}, 'passive', {
      // eslint-disable-next-line getter-return
      get() {
        supportsPassive = true;
      },
    });
    window.addEventListener('test', null, opts);
    window.removeEventListener('test', null, opts);
  } catch (e) {}
})();

/**
 * Generate settings for event listeners, dependant on `passiveTouchGestures`
 *
 * @param {string} eventName Event name to determine if `{passive}` option is
 *   needed
 * @return {{passive: boolean} | undefined} Options to use for addEventListener
 *   and removeEventListener
 */
function PASSIVE_TOUCH(eventName) {
  if (isMouseEvent(eventName) || eventName === 'touchend') {
    return;
  }
  if (HAS_NATIVE_TA && supportsPassive && passiveTouchGestures) {
    return { passive: true };
  }
}

// Check for touch-only devices
const IS_TOUCH_ONLY = navigator.userAgent.match(/iP(?:[oa]d|hone)|Android/u);

// Defined at https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#enabling-and-disabling-form-controls:-the-disabled-attribute
/** @type {!Object<boolean>} */
const canBeDisabled = {
  button: true,
  command: true,
  fieldset: true,
  input: true,
  keygen: true,
  optgroup: true,
  option: true,
  select: true,
  textarea: true,
};

/**
 * @param {MouseEvent} ev event to test for left mouse button down
 * @return {boolean} has left mouse button down
 */
function hasLeftMouseButton(ev) {
  const type = ev.type;
  // Exit early if the event is not a mouse event
  if (!isMouseEvent(type)) {
    return false;
  }
  // Ev.button is not reliable for mousemove (0 is overloaded as both left button and no buttons)
  // instead we use ev.buttons (bitmask of buttons) or fall back to ev.which (deprecated, 0 for no buttons, 1 for left button)
  if (type === 'mousemove') {
    // Allow undefined for testing events
    let buttons = ev.buttons === undefined ? 1 : ev.buttons;
    if (ev instanceof window.MouseEvent && !MOUSE_HAS_BUTTONS) {
      buttons = MOUSE_WHICH_TO_BUTTONS[ev.which] || 0;
    }
    // Buttons is a bitmask, check that the left button bit is set (1)
    return Boolean(buttons & 1);
  }
  // Allow undefined for testing events
  const button = ev.button === undefined ? 0 : ev.button;
  // Ev.button is 0 in mousedown/mouseup/click for left button activation
  return button === 0;
}

function isSyntheticClick(ev) {
  if (ev.type === 'click') {
    // Ev.detail is 0 for HTMLElement.click in most browsers
    if (ev.detail === 0) {
      return true;
    }
    // In the worst case, check that the x/y position of the click is within
    // the bounding box of the target of the event
    // Thanks IE 10 >:(
    const t = _findOriginalTarget(ev);
    // Make sure the target of the event is an element so we can use getBoundingClientRect,
    // if not, just assume it is a synthetic click
    if (!t.nodeType || /** @type {Element} */ (t).nodeType !== Node.ELEMENT_NODE) {
      return true;
    }
    const bcr = /** @type {Element} */ (t).getBoundingClientRect();
    // Use page x/y to account for scrolling
    const x = ev.pageX,
      y = ev.pageY;
    // Ev is a synthetic click if the position is outside the bounding box of the target
    return !(x >= bcr.left && x <= bcr.right && y >= bcr.top && y <= bcr.bottom);
  }
  return false;
}

const POINTERSTATE = {
  mouse: {
    target: null,
    mouseIgnoreJob: null,
  },
  touch: {
    x: 0,
    y: 0,
    id: -1,
    scrollDecided: false,
  },
};

function firstTouchAction(ev) {
  let ta = 'auto';
  const path = getComposedPath(ev);
  for (let i = 0, n; i < path.length; i++) {
    n = path[i];
    if (n[TOUCH_ACTION]) {
      ta = n[TOUCH_ACTION];
      break;
    }
  }
  return ta;
}

function trackDocument(stateObj, movefn, upfn) {
  stateObj.movefn = movefn;
  stateObj.upfn = upfn;
  document.addEventListener('mousemove', movefn);
  document.addEventListener('mouseup', upfn);
}

function untrackDocument(stateObj) {
  document.removeEventListener('mousemove', stateObj.movefn);
  document.removeEventListener('mouseup', stateObj.upfn);
  stateObj.movefn = null;
  stateObj.upfn = null;
}

/**
 * Returns the composedPath for the given event.
 * @param {Event} event to process
 * @return {!Array<!EventTarget>} Path of the event
 */
const getComposedPath =
  window.ShadyDOM && window.ShadyDOM.noPatch
    ? window.ShadyDOM.composedPath
    : (event) => (event.composedPath && event.composedPath()) || [];

/** @type {!Object<string, !GestureRecognizer>} */
const gestures = {};

/** @type {!Array<!GestureRecognizer>} */
const recognizers = [];

/**
 * Finds the element rendered on the screen at the provided coordinates.
 *
 * Similar to `document.elementFromPoint`, but pierces through
 * shadow roots.
 *
 * @param {number} x Horizontal pixel coordinate
 * @param {number} y Vertical pixel coordinate
 * @return {Element} Returns the deepest shadowRoot inclusive element
 * found at the screen position given.
 */
function deepTargetFind(x, y) {
  let node = document.elementFromPoint(x, y);
  let next = node;
  // This code path is only taken when native ShadowDOM is used
  // if there is a shadowroot, it may have a node at x/y
  // if there is not a shadowroot, exit the loop
  while (next && next.shadowRoot && !window.ShadyDOM) {
    // If there is a node at x/y in the shadowroot, look deeper
    const oldNext = next;
    next = next.shadowRoot.elementFromPoint(x, y);
    // On Safari, elementFromPoint may return the shadowRoot host
    if (oldNext === next) {
      break;
    }
    if (next) {
      node = next;
    }
  }
  return node;
}

/**
 * A cheaper check than ev.composedPath()[0];
 *
 * @private
 * @param {Event|Touch} ev Event.
 * @return {EventTarget} Returns the event target.
 */
function _findOriginalTarget(ev) {
  const path = getComposedPath(/** @type {?Event} */ (ev));
  // It shouldn't be, but sometimes path is empty (window on Safari).
  return path.length > 0 ? path[0] : ev.target;
}

/**
 * @private
 * @param {Event} ev Event.
 * @return {void}
 */
function _handleNative(ev) {
  const type = ev.type;
  const node = ev.currentTarget;
  const gobj = node[GESTURE_KEY];
  if (!gobj) {
    return;
  }
  const gs = gobj[type];
  if (!gs) {
    return;
  }
  if (!ev[HANDLED_OBJ]) {
    ev[HANDLED_OBJ] = {};
    if (type.startsWith('touch')) {
      const t = ev.changedTouches[0];
      if (type === 'touchstart') {
        // Only handle the first finger
        if (ev.touches.length === 1) {
          POINTERSTATE.touch.id = t.identifier;
        }
      }
      if (POINTERSTATE.touch.id !== t.identifier) {
        return;
      }
      if (!HAS_NATIVE_TA) {
        if (type === 'touchstart' || type === 'touchmove') {
          _handleTouchAction(ev);
        }
      }
    }
  }
  const handled = ev[HANDLED_OBJ];
  // Used to ignore synthetic mouse events
  if (handled.skip) {
    return;
  }
  // Reset recognizer state
  for (let i = 0, r; i < recognizers.length; i++) {
    r = recognizers[i];
    if (gs[r.name] && !handled[r.name]) {
      if (r.flow && r.flow.start.indexOf(ev.type) > -1 && r.reset) {
        r.reset();
      }
    }
  }
  // Enforce gesture recognizer order
  for (let i = 0, r; i < recognizers.length; i++) {
    r = recognizers[i];
    if (gs[r.name] && !handled[r.name]) {
      handled[r.name] = true;
      r[type](ev);
    }
  }
}

/**
 * @private
 * @param {TouchEvent} ev Event.
 * @return {void}
 */
function _handleTouchAction(ev) {
  const t = ev.changedTouches[0];
  const type = ev.type;
  if (type === 'touchstart') {
    POINTERSTATE.touch.x = t.clientX;
    POINTERSTATE.touch.y = t.clientY;
    POINTERSTATE.touch.scrollDecided = false;
  } else if (type === 'touchmove') {
    if (POINTERSTATE.touch.scrollDecided) {
      return;
    }
    POINTERSTATE.touch.scrollDecided = true;
    const ta = firstTouchAction(ev);
    let shouldPrevent = false;
    const dx = Math.abs(POINTERSTATE.touch.x - t.clientX);
    const dy = Math.abs(POINTERSTATE.touch.y - t.clientY);
    if (!ev.cancelable) ; else if (ta === 'none') {
      shouldPrevent = true;
    } else if (ta === 'pan-x') {
      shouldPrevent = dy > dx;
    } else if (ta === 'pan-y') {
      shouldPrevent = dx > dy;
    }
    if (shouldPrevent) {
      ev.preventDefault();
    } else {
      prevent('track');
    }
  }
}

/**
 * Adds an event listener to a node for the given gesture type.
 *
 * @param {!EventTarget} node Node to add listener on
 * @param {string} evType Gesture type: `down`, `up`, `track`, or `tap`
 * @param {!function(!Event):void} handler Event listener function to call
 * @return {boolean} Returns true if a gesture event listener was added.
 */
function addListener(node, evType, handler) {
  if (gestures[evType]) {
    _add(node, evType, handler);
    return true;
  }
  return false;
}

/**
 * Removes an event listener from a node for the given gesture type.
 *
 * @param {!EventTarget} node Node to remove listener from
 * @param {string} evType Gesture type: `down`, `up`, `track`, or `tap`
 * @param {!function(!Event):void} handler Event listener function previously passed to
 *  `addListener`.
 * @return {boolean} Returns true if a gesture event listener was removed.
 */
function removeListener(node, evType, handler) {
  if (gestures[evType]) {
    _remove(node, evType, handler);
    return true;
  }
  return false;
}

/**
 * Automate the event listeners for the native events
 *
 * @private
 * @param {!EventTarget} node Node on which to add the event.
 * @param {string} evType Event type to add.
 * @param {function(!Event)} handler Event handler function.
 * @return {void}
 */
function _add(node, evType, handler) {
  const recognizer = gestures[evType];
  const deps = recognizer.deps;
  const name = recognizer.name;
  let gobj = node[GESTURE_KEY];
  if (!gobj) {
    node[GESTURE_KEY] = gobj = {};
  }
  for (let i = 0, dep, gd; i < deps.length; i++) {
    dep = deps[i];
    // Don't add mouse handlers on iOS because they cause gray selection overlays
    if (IS_TOUCH_ONLY && isMouseEvent(dep) && dep !== 'click') {
      continue;
    }
    gd = gobj[dep];
    if (!gd) {
      gobj[dep] = gd = { _count: 0 };
    }
    if (gd._count === 0) {
      node.addEventListener(dep, _handleNative, PASSIVE_TOUCH(dep));
    }
    gd[name] = (gd[name] || 0) + 1;
    gd._count = (gd._count || 0) + 1;
  }
  node.addEventListener(evType, handler);
  if (recognizer.touchAction) {
    setTouchAction(node, recognizer.touchAction);
  }
}

/**
 * Automate event listener removal for native events
 *
 * @private
 * @param {!EventTarget} node Node on which to remove the event.
 * @param {string} evType Event type to remove.
 * @param {function(!Event): void} handler Event handler function.
 * @return {void}
 */
function _remove(node, evType, handler) {
  const recognizer = gestures[evType];
  const deps = recognizer.deps;
  const name = recognizer.name;
  const gobj = node[GESTURE_KEY];
  if (gobj) {
    for (let i = 0, dep, gd; i < deps.length; i++) {
      dep = deps[i];
      gd = gobj[dep];
      if (gd && gd[name]) {
        gd[name] = (gd[name] || 1) - 1;
        gd._count = (gd._count || 1) - 1;
        if (gd._count === 0) {
          node.removeEventListener(dep, _handleNative, PASSIVE_TOUCH(dep));
        }
      }
    }
  }
  node.removeEventListener(evType, handler);
}

/**
 * Registers a new gesture event recognizer for adding new custom
 * gesture event types.
 *
 * @param {!GestureRecognizer} recog Gesture recognizer descriptor
 * @return {void}
 */
function register(recog) {
  recognizers.push(recog);
  recog.emits.forEach((emit) => {
    gestures[emit] = recog;
  });
}

/**
 * @private
 * @param {string} evName Event name.
 * @return {Object} Returns the gesture for the given event name.
 */
function _findRecognizerByEvent(evName) {
  for (let i = 0, r; i < recognizers.length; i++) {
    r = recognizers[i];
    for (let j = 0, n; j < r.emits.length; j++) {
      n = r.emits[j];
      if (n === evName) {
        return r;
      }
    }
  }
  return null;
}

/**
 * Sets scrolling direction on node.
 *
 * This value is checked on first move, thus it should be called prior to
 * adding event listeners.
 *
 * @param {!EventTarget} node Node to set touch action setting on
 * @param {string} value Touch action value
 * @return {void}
 */
function setTouchAction(node, value) {
  if (HAS_NATIVE_TA && node instanceof HTMLElement) {
    // NOTE: add touchAction async so that events can be added in
    // custom element constructors. Otherwise we run afoul of custom
    // elements restriction against settings attributes (style) in the
    // constructor.
    microTask.run(() => {
      node.style.touchAction = value;
    });
  }
  node[TOUCH_ACTION] = value;
}

/**
 * Dispatches an event on the `target` element of `type` with the given
 * `detail`.
 * @private
 * @param {!EventTarget} target The element on which to fire an event.
 * @param {string} type The type of event to fire.
 * @param {!Object=} detail The detail object to populate on the event.
 * @return {void}
 */
function _fire(target, type, detail) {
  const ev = new Event(type, { bubbles: true, cancelable: true, composed: true });
  ev.detail = detail;
  wrap(/** @type {!Node} */ (target)).dispatchEvent(ev);
  // Forward `preventDefault` in a clean way
  if (ev.defaultPrevented) {
    const preventer = detail.preventer || detail.sourceEvent;
    if (preventer && preventer.preventDefault) {
      preventer.preventDefault();
    }
  }
}

/**
 * Prevents the dispatch and default action of the given event name.
 *
 * @param {string} evName Event name.
 * @return {void}
 */
function prevent(evName) {
  const recognizer = _findRecognizerByEvent(evName);
  if (recognizer.info) {
    recognizer.info.prevent = true;
  }
}

register({
  name: 'downup',
  deps: ['mousedown', 'touchstart', 'touchend'],
  flow: {
    start: ['mousedown', 'touchstart'],
    end: ['mouseup', 'touchend'],
  },
  emits: ['down', 'up'],

  info: {
    movefn: null,
    upfn: null,
  },

  /**
   * @this {GestureRecognizer}
   * @return {void}
   */
  reset() {
    untrackDocument(this.info);
  },

  /**
   * @this {GestureRecognizer}
   * @param {MouseEvent} e
   * @return {void}
   */
  mousedown(e) {
    if (!hasLeftMouseButton(e)) {
      return;
    }
    const t = _findOriginalTarget(e);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    const movefn = (e) => {
      if (!hasLeftMouseButton(e)) {
        downupFire('up', t, e);
        untrackDocument(self.info);
      }
    };
    const upfn = (e) => {
      if (hasLeftMouseButton(e)) {
        downupFire('up', t, e);
      }
      untrackDocument(self.info);
    };
    trackDocument(this.info, movefn, upfn);
    downupFire('down', t, e);
  },

  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchstart(e) {
    downupFire('down', _findOriginalTarget(e), e.changedTouches[0], e);
  },

  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchend(e) {
    downupFire('up', _findOriginalTarget(e), e.changedTouches[0], e);
  },
});

/**
 * @param {string} type
 * @param {EventTarget} target
 * @param {Event|Touch} event
 * @param {Event=} preventer
 * @return {void}
 */
function downupFire(type, target, event, preventer) {
  if (!target) {
    return;
  }
  _fire(target, type, {
    x: event.clientX,
    y: event.clientY,
    sourceEvent: event,
    preventer,
    prevent(e) {
      return prevent(e);
    },
  });
}

register({
  name: 'track',
  touchAction: 'none',
  deps: ['mousedown', 'touchstart', 'touchmove', 'touchend'],
  flow: {
    start: ['mousedown', 'touchstart'],
    end: ['mouseup', 'touchend'],
  },
  emits: ['track'],

  info: {
    x: 0,
    y: 0,
    state: 'start',
    started: false,
    moves: [],
    /** @this {GestureInfo} */
    addMove(move) {
      if (this.moves.length > TRACK_LENGTH) {
        this.moves.shift();
      }
      this.moves.push(move);
    },
    movefn: null,
    upfn: null,
    prevent: false,
  },

  /**
   * @this {GestureRecognizer}
   * @return {void}
   */
  reset() {
    this.info.state = 'start';
    this.info.started = false;
    this.info.moves = [];
    this.info.x = 0;
    this.info.y = 0;
    this.info.prevent = false;
    untrackDocument(this.info);
  },

  /**
   * @this {GestureRecognizer}
   * @param {MouseEvent} e
   * @return {void}
   */
  mousedown(e) {
    if (!hasLeftMouseButton(e)) {
      return;
    }
    const t = _findOriginalTarget(e);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    const movefn = (e) => {
      const x = e.clientX,
        y = e.clientY;
      if (trackHasMovedEnough(self.info, x, y)) {
        // First move is 'start', subsequent moves are 'move', mouseup is 'end'
        self.info.state = self.info.started ? (e.type === 'mouseup' ? 'end' : 'track') : 'start';
        if (self.info.state === 'start') {
          // If and only if tracking, always prevent tap
          prevent('tap');
        }
        self.info.addMove({ x, y });
        if (!hasLeftMouseButton(e)) {
          // Always fire "end"
          self.info.state = 'end';
          untrackDocument(self.info);
        }
        if (t) {
          trackFire(self.info, t, e);
        }
        self.info.started = true;
      }
    };
    const upfn = (e) => {
      if (self.info.started) {
        movefn(e);
      }

      // Remove the temporary listeners
      untrackDocument(self.info);
    };
    // Add temporary document listeners as mouse retargets
    trackDocument(this.info, movefn, upfn);
    this.info.x = e.clientX;
    this.info.y = e.clientY;
  },

  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchstart(e) {
    const ct = e.changedTouches[0];
    this.info.x = ct.clientX;
    this.info.y = ct.clientY;
  },

  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchmove(e) {
    const t = _findOriginalTarget(e);
    const ct = e.changedTouches[0];
    const x = ct.clientX,
      y = ct.clientY;
    if (trackHasMovedEnough(this.info, x, y)) {
      if (this.info.state === 'start') {
        // If and only if tracking, always prevent tap
        prevent('tap');
      }
      this.info.addMove({ x, y });
      trackFire(this.info, t, ct);
      this.info.state = 'track';
      this.info.started = true;
    }
  },

  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchend(e) {
    const t = _findOriginalTarget(e);
    const ct = e.changedTouches[0];
    // Only trackend if track was started and not aborted
    if (this.info.started) {
      // Reset started state on up
      this.info.state = 'end';
      this.info.addMove({ x: ct.clientX, y: ct.clientY });
      trackFire(this.info, t, ct);
    }
  },
});

/**
 * @param {!GestureInfo} info
 * @param {number} x
 * @param {number} y
 * @return {boolean}
 */
function trackHasMovedEnough(info, x, y) {
  if (info.prevent) {
    return false;
  }
  if (info.started) {
    return true;
  }
  const dx = Math.abs(info.x - x);
  const dy = Math.abs(info.y - y);
  return dx >= TRACK_DISTANCE || dy >= TRACK_DISTANCE;
}

/**
 * @param {!GestureInfo} info
 * @param {?EventTarget} target
 * @param {Touch} touch
 * @return {void}
 */
function trackFire(info, target, touch) {
  if (!target) {
    return;
  }
  const secondlast = info.moves[info.moves.length - 2];
  const lastmove = info.moves[info.moves.length - 1];
  const dx = lastmove.x - info.x;
  const dy = lastmove.y - info.y;
  let ddx,
    ddy = 0;
  if (secondlast) {
    ddx = lastmove.x - secondlast.x;
    ddy = lastmove.y - secondlast.y;
  }
  _fire(target, 'track', {
    state: info.state,
    x: touch.clientX,
    y: touch.clientY,
    dx,
    dy,
    ddx,
    ddy,
    sourceEvent: touch,
    hover() {
      return deepTargetFind(touch.clientX, touch.clientY);
    },
  });
}

register({
  name: 'tap',
  deps: ['mousedown', 'click', 'touchstart', 'touchend'],
  flow: {
    start: ['mousedown', 'touchstart'],
    end: ['click', 'touchend'],
  },
  emits: ['tap'],
  info: {
    x: NaN,
    y: NaN,
    prevent: false,
  },

  /**
   * @this {GestureRecognizer}
   * @return {void}
   */
  reset() {
    this.info.x = NaN;
    this.info.y = NaN;
    this.info.prevent = false;
  },

  /**
   * @this {GestureRecognizer}
   * @param {MouseEvent} e
   * @return {void}
   */
  mousedown(e) {
    if (hasLeftMouseButton(e)) {
      this.info.x = e.clientX;
      this.info.y = e.clientY;
    }
  },

  /**
   * @this {GestureRecognizer}
   * @param {MouseEvent} e
   * @return {void}
   */
  click(e) {
    if (hasLeftMouseButton(e)) {
      trackForward(this.info, e);
    }
  },

  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchstart(e) {
    const touch = e.changedTouches[0];
    this.info.x = touch.clientX;
    this.info.y = touch.clientY;
  },

  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchend(e) {
    trackForward(this.info, e.changedTouches[0], e);
  },
});

/**
 * @param {!GestureInfo} info
 * @param {Event | Touch} e
 * @param {Event=} preventer
 * @return {void}
 */
function trackForward(info, e, preventer) {
  const dx = Math.abs(e.clientX - info.x);
  const dy = Math.abs(e.clientY - info.y);
  // Find original target from `preventer` for TouchEvents, or `e` for MouseEvents
  const t = _findOriginalTarget(preventer || e);
  if (!t || (canBeDisabled[/** @type {!HTMLElement} */ (t).localName] && t.hasAttribute('disabled'))) {
    return;
  }
  // Dx,dy can be NaN if `click` has been simulated and there was no `down` for `start`
  if (isNaN(dx) || isNaN(dy) || (dx <= TAP_DISTANCE && dy <= TAP_DISTANCE) || isSyntheticClick(e)) {
    // Prevent taps from being generated if an event has canceled them
    if (!info.prevent) {
      _fire(t, 'tap', {
        x: e.clientX,
        y: e.clientY,
        sourceEvent: e,
        preventer,
      });
    }
  }
}

/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin that manages keyboard handling.
 * The mixin subscribes to the keyboard events while an actual implementation
 * for the event handlers is left to the client (a component or another mixin).
 *
 * @polymerMixin
 */
const KeyboardMixin = dedupingMixin(
  (superclass) =>
    class KeyboardMixinClass extends superclass {
      /** @protected */
      ready() {
        super.ready();

        this.addEventListener('keydown', (event) => {
          this._onKeyDown(event);
        });

        this.addEventListener('keyup', (event) => {
          this._onKeyUp(event);
        });
      }

      /**
       * A handler for the `keydown` event. By default, it calls
       * separate methods for handling "Enter" and "Escape" keys.
       * Override the method to implement your own behavior.
       *
       * @param {KeyboardEvent} event
       * @protected
       */
      _onKeyDown(event) {
        switch (event.key) {
          case 'Enter':
            this._onEnter(event);
            break;
          case 'Escape':
            this._onEscape(event);
            break;
        }
      }

      /**
       * A handler for the `keyup` event. By default, it does nothing.
       * Override the method to implement your own behavior.
       *
       * @param {KeyboardEvent} _event
       * @protected
       */
      _onKeyUp(_event) {
        // To be implemented.
      }

      /**
       * A handler for the "Enter" key. By default, it does nothing.
       * Override the method to implement your own behavior.
       *
       * @param {KeyboardEvent} _event
       * @protected
       */
      _onEnter(_event) {
        // To be implemented.
      }

      /**
       * A handler for the "Escape" key. By default, it does nothing.
       * Override the method to implement your own behavior.
       *
       * @param {KeyboardEvent} _event
       * @protected
       */
      _onEscape(_event) {
        // To be implemented.
      }
    },
);

/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin to toggle the `active` attribute.
 *
 * The attribute is set whenever the user activates the element by a pointer
 * or presses an activation key on the element from the keyboard.
 *
 * The attribute is removed as soon as the element is deactivated
 * by the pointer or by releasing the activation key.
 *
 * @polymerMixin
 */
const ActiveMixin = (superclass) =>
  class ActiveMixinClass extends DisabledMixin(KeyboardMixin(superclass)) {
    /**
     * An array of activation keys.
     *
     * See possible values here:
     * https://developer.mozilla.org/ru/docs/Web/API/KeyboardEvent/key/Key_Values
     *
     * @protected
     * @return {!Array<!string>}
     */
    get _activeKeys() {
      return [' '];
    }

    /** @protected */
    ready() {
      super.ready();

      addListener(this, 'down', (event) => {
        if (this._shouldSetActive(event)) {
          this._setActive(true);
        }
      });

      addListener(this, 'up', () => {
        this._setActive(false);
      });
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      // When the element is disconnecting from the DOM at the moment being active,
      // the `active` attribute needs to be manually removed from the element.
      // Otherwise, it will preserve on the element until the element is activated once again.
      // The case reproduces for `<vaadin-date-picker>` when closing on `Cancel` or `Today` click.
      this._setActive(false);
    }

    /**
     * @param {KeyboardEvent | MouseEvent} _event
     * @protected
     */
    _shouldSetActive(_event) {
      return !this.disabled;
    }

    /**
     * Sets the `active` attribute on the element if an activation key is pressed.
     *
     * @param {KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyDown(event) {
      super._onKeyDown(event);

      if (this._shouldSetActive(event) && this._activeKeys.includes(event.key)) {
        this._setActive(true);

        // Element can become hidden before the `keyup` event, e.g. on button click.
        // Use document listener to ensure `active` attribute is removed correctly.
        document.addEventListener(
          'keyup',
          (e) => {
            if (this._activeKeys.includes(e.key)) {
              this._setActive(false);
            }
          },
          { once: true },
        );
      }
    }

    /**
     * Toggles the `active` attribute on the element.
     *
     * @param {boolean} active
     * @protected
     */
    _setActive(active) {
      this.toggleAttribute('active', active);
    }
  };

/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

// We consider the keyboard to be active if the window has received a keydown
// event since the last mousedown event.
let keyboardActive = false;

// Listen for top-level keydown and mousedown events.
// Use capture phase so we detect events even if they're handled.
window.addEventListener(
  'keydown',
  () => {
    keyboardActive = true;
  },
  { capture: true },
);

window.addEventListener(
  'mousedown',
  () => {
    keyboardActive = false;
  },
  { capture: true },
);

/**
 * Returns true if the window has received a keydown
 * event since the last mousedown event.
 *
 * @return {boolean}
 */
function isKeyboardActive() {
  return keyboardActive;
}

/**
 * Returns true if the element is hidden directly with `display: none` or `visibility: hidden`,
 * false otherwise.
 *
 * The method doesn't traverse the element's ancestors, it only checks for the CSS properties
 * set directly to or inherited by the element.
 *
 * @param {HTMLElement} element
 * @return {boolean}
 */
function isElementHiddenDirectly(element) {
  // Check inline style first to save a re-flow.
  const style = element.style;
  if (style.visibility === 'hidden' || style.display === 'none') {
    return true;
  }

  const computedStyle = window.getComputedStyle(element);
  if (computedStyle.visibility === 'hidden' || computedStyle.display === 'none') {
    return true;
  }

  return false;
}

/**
 * Returns if element `a` has lower tab order compared to element `b`
 * (both elements are assumed to be focusable and tabbable).
 * Elements with tabindex = 0 have lower tab order compared to elements
 * with tabindex > 0.
 * If both have same tabindex, it returns false.
 *
 * @param {HTMLElement} a
 * @param {HTMLElement} b
 * @return {boolean}
 */
function hasLowerTabOrder(a, b) {
  // Normalize tabIndexes
  // e.g. in Firefox `<div contenteditable>` has `tabIndex = -1`
  const ati = Math.max(a.tabIndex, 0);
  const bti = Math.max(b.tabIndex, 0);
  return ati === 0 || bti === 0 ? bti > ati : ati > bti;
}

/**
 * Merge sort iterator, merges the two arrays into one, sorted by tabindex.
 *
 * @param {HTMLElement[]} left
 * @param {HTMLElement[]} right
 * @return {HTMLElement[]}
 */
function mergeSortByTabIndex(left, right) {
  const result = [];
  while (left.length > 0 && right.length > 0) {
    if (hasLowerTabOrder(left[0], right[0])) {
      result.push(right.shift());
    } else {
      result.push(left.shift());
    }
  }

  return result.concat(left, right);
}

/**
 * Sorts an array of elements by tabindex. Returns a new array.
 *
 * @param {HTMLElement[]} elements
 * @return {HTMLElement[]}
 */
function sortElementsByTabIndex(elements) {
  // Implement a merge sort as Array.prototype.sort does a non-stable sort
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  const len = elements.length;
  if (len < 2) {
    return elements;
  }
  const pivot = Math.ceil(len / 2);
  const left = sortElementsByTabIndex(elements.slice(0, pivot));
  const right = sortElementsByTabIndex(elements.slice(pivot));

  return mergeSortByTabIndex(left, right);
}

/**
 * Returns true if the element is hidden, false otherwise.
 *
 * An element is treated as hidden when any of the following conditions are met:
 * - the element itself or one of its ancestors has `display: none`.
 * - the element has or inherits `visibility: hidden`.
 *
 * @param {HTMLElement} element
 * @return {boolean}
 */
function isElementHidden(element) {
  // `offsetParent` is `null` when the element itself
  // or one of its ancestors is hidden with `display: none`.
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
  if (element.offsetParent === null) {
    return true;
  }

  return isElementHiddenDirectly(element);
}

/**
 * Returns true if the element is focusable, otherwise false.
 *
 * The list of focusable elements is taken from http://stackoverflow.com/a/1600194/4228703.
 * However, there isn't a definite list, it's up to the browser.
 * The only standard we have is DOM Level 2 HTML https://www.w3.org/TR/DOM-Level-2-HTML/html.html,
 * according to which the only elements that have a `focus()` method are:
 * - HTMLInputElement
 * - HTMLSelectElement
 * - HTMLTextAreaElement
 * - HTMLAnchorElement
 *
 * This notably omits HTMLButtonElement and HTMLAreaElement.
 * Referring to these tests with tabbables in different browsers
 * http://allyjs.io/data-tables/focusable.html
 *
 * @param {HTMLElement} element
 * @return {boolean}
 */
function isElementFocusable(element) {
  // The element cannot be focused if its `tabindex` attribute is set to `-1`.
  if (element.matches('[tabindex="-1"]')) {
    return false;
  }

  // Elements that cannot be focused if they have a `disabled` attribute.
  if (element.matches('input, select, textarea, button, object')) {
    return element.matches(':not([disabled])');
  }

  // Elements that can be focused even if they have a `disabled` attribute.
  return element.matches('a[href], area[href], iframe, [tabindex], [contentEditable]');
}

/**
 * Returns true if the element is focused, false otherwise.
 *
 * @param {HTMLElement} element
 * @return {boolean}
 */
function isElementFocused(element) {
  return element.getRootNode().activeElement === element;
}

/**
 * Returns the normalized element tabindex. If not focusable, returns -1.
 * It checks for the attribute "tabindex" instead of the element property
 * `tabIndex` since browsers assign different values to it.
 * e.g. in Firefox `<div contenteditable>` has `tabIndex = -1`
 *
 * @param {HTMLElement} element
 * @return {number}
 */
function normalizeTabIndex(element) {
  if (!isElementFocusable(element)) {
    return -1;
  }

  const tabIndex = element.getAttribute('tabindex') || 0;
  return Number(tabIndex);
}

/**
 * Searches for nodes that are tabbable and adds them to the `result` array.
 * Returns if the `result` array needs to be sorted by tabindex.
 *
 * @param {Node} node The starting point for the search; added to `result` if tabbable.
 * @param {HTMLElement[]} result
 * @return {boolean}
 * @private
 */
function collectFocusableNodes(node, result) {
  if (node.nodeType !== Node.ELEMENT_NODE || isElementHiddenDirectly(node)) {
    // Don't traverse children if the node is not an HTML element or not visible.
    return false;
  }

  const element = /** @type {HTMLElement} */ (node);
  const tabIndex = normalizeTabIndex(element);
  let needsSort = tabIndex > 0;
  if (tabIndex >= 0) {
    result.push(element);
  }

  let children = [];
  if (element.localName === 'slot') {
    children = element.assignedNodes({ flatten: true });
  } else {
    // Use shadow root if possible, will check for distributed nodes.
    children = (element.shadowRoot || element).children;
  }
  [...children].forEach((child) => {
    // Ensure method is always invoked to collect focusable children.
    needsSort = collectFocusableNodes(child, result) || needsSort;
  });
  return needsSort;
}

/**
 * Returns a tab-ordered array of focusable elements for a root element.
 * The resulting array will include the root element if it is focusable.
 *
 * The method traverses nodes in shadow DOM trees too if any.
 *
 * @param {HTMLElement} element
 * @return {HTMLElement[]}
 */
function getFocusableElements(element) {
  const focusableElements = [];
  const needsSortByTabIndex = collectFocusableNodes(element, focusableElements);
  // If there is at least one element with tabindex > 0,
  // we need to sort the final array by tabindex.
  if (needsSortByTabIndex) {
    return sortElementsByTabIndex(focusableElements);
  }
  return focusableElements;
}

/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin to handle `focused` and `focus-ring` attributes based on focus.
 *
 * @polymerMixin
 */
const FocusMixin = dedupingMixin(
  (superclass) =>
    class FocusMixinClass extends superclass {
      /**
       * @protected
       * @return {boolean}
       */
      get _keyboardActive() {
        return isKeyboardActive();
      }

      /** @protected */
      ready() {
        this.addEventListener('focusin', (e) => {
          if (this._shouldSetFocus(e)) {
            this._setFocused(true);
          }
        });

        this.addEventListener('focusout', (e) => {
          if (this._shouldRemoveFocus(e)) {
            this._setFocused(false);
          }
        });

        // In super.ready() other 'focusin' and 'focusout' listeners might be
        // added, so we call it after our own ones to ensure they execute first.
        // Issue to watch out: when incorrect, <vaadin-combo-box> refocuses the
        // input field on iOS after "Done" is pressed.
        super.ready();
      }

      /** @protected */
      disconnectedCallback() {
        super.disconnectedCallback();

        // In non-Chrome browsers, blur does not fire on the element when it is disconnected.
        // reproducible in `<vaadin-date-picker>` when closing on `Cancel` or `Today` click.
        if (this.hasAttribute('focused')) {
          this._setFocused(false);
        }
      }

      /**
       * Override to change how focused and focus-ring attributes are set.
       *
       * @param {boolean} focused
       * @protected
       */
      _setFocused(focused) {
        this.toggleAttribute('focused', focused);

        // Focus-ring is true when the element was focused from the keyboard.
        // Focus Ring [A11ycasts]: https://youtu.be/ilj2P5-5CjI
        this.toggleAttribute('focus-ring', focused && this._keyboardActive);
      }

      /**
       * Override to define if the field receives focus based on the event.
       *
       * @param {FocusEvent} _event
       * @return {boolean}
       * @protected
       */
      _shouldSetFocus(_event) {
        return true;
      }

      /**
       * Override to define if the field loses focus based on the event.
       *
       * @param {FocusEvent} _event
       * @return {boolean}
       * @protected
       */
      _shouldRemoveFocus(_event) {
        return true;
      }
    },
);

/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin to toggle the `tabindex` attribute.
 *
 * The attribute is set to -1 whenever the user disables the element
 * and restored with the last known value once the element is enabled.
 *
 * @polymerMixin
 * @mixes DisabledMixin
 */
const TabindexMixin = (superclass) =>
  class TabindexMixinClass extends DisabledMixin(superclass) {
    static get properties() {
      return {
        /**
         * Indicates whether the element can be focused and where it participates in sequential keyboard navigation.
         *
         * @protected
         */
        tabindex: {
          type: Number,
          reflectToAttribute: true,
          observer: '_tabindexChanged',
        },

        /**
         * Stores the last known tabindex since the element has been disabled.
         *
         * @protected
         */
        _lastTabIndex: {
          type: Number,
        },
      };
    }

    /**
     * When the element gets disabled, the observer saves the last known tabindex
     * and makes the element not focusable by setting tabindex to -1.
     * As soon as the element gets enabled, the observer restores the last known tabindex
     * so that the element can be focusable again.
     *
     * @protected
     * @override
     */
    _disabledChanged(disabled, oldDisabled) {
      super._disabledChanged(disabled, oldDisabled);

      if (disabled) {
        if (this.tabindex !== undefined) {
          this._lastTabIndex = this.tabindex;
        }
        this.tabindex = -1;
      } else if (oldDisabled) {
        this.tabindex = this._lastTabIndex;
      }
    }

    /**
     * When the user has changed tabindex while the element is disabled,
     * the observer reverts tabindex to -1 and rather saves the new tabindex value to apply it later.
     * The new value will be applied as soon as the element becomes enabled.
     *
     * @protected
     */
    _tabindexChanged(tabindex) {
      if (this.disabled && tabindex !== -1) {
        this._lastTabIndex = tabindex;
        this.tabindex = -1;
      }
    }
  };

/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin providing common button functionality.
 *
 * @polymerMixin
 * @mixes ActiveMixin
 * @mixes FocusMixin
 * @mixes TabindexMixin
 */
const ButtonMixin = (superClass) =>
  class ButtonMixinClass extends ActiveMixin(TabindexMixin(FocusMixin(superClass))) {
    static get properties() {
      return {
        /**
         * Indicates whether the element can be focused and where it participates in sequential keyboard navigation.
         *
         * @override
         * @protected
         */
        tabindex: {
          type: Number,
          value: 0,
          reflectToAttribute: true,
        },
      };
    }

    /**
     * By default, `Space` is the only possible activation key for a focusable HTML element.
     * Nonetheless, the button is an exception as it can be also activated by pressing `Enter`.
     * See the "Keyboard Support" section in https://www.w3.org/TR/wai-aria-practices/examples/button/button.html.
     *
     * @protected
     * @override
     */
    get _activeKeys() {
      return ['Enter', ' '];
    }

    /** @protected */
    ready() {
      super.ready();

      // By default, if the user hasn't provided a custom role,
      // the role attribute is set to "button".
      if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'button');
      }
    }

    /**
     * Since the button component is designed on the base of the `[role=button]` attribute,
     * and doesn't have a native <button> inside, in order to be fully accessible from the keyboard,
     * it should manually fire the `click` event once an activation key is pressed,
     * as it follows from the WAI-ARIA specifications:
     * https://www.w3.org/TR/wai-aria-practices-1.1/#button
     *
     * According to the UI Events specifications,
     * the `click` event should be fired exactly on `keydown`:
     * https://www.w3.org/TR/uievents/#event-type-keydown
     *
     * @param {KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyDown(event) {
      super._onKeyDown(event);

      if (this._activeKeys.includes(event.key)) {
        event.preventDefault();

        // `DisabledMixin` overrides the standard `click()` method
        // so that it doesn't fire the `click` event when the element is disabled.
        this.click();
      }
    }
  };

/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

registerStyles('vaadin-button', buttonStyles, { moduleId: 'vaadin-button-styles' });

/**
 * `<vaadin-button>` is an accessible and customizable button that allows users to perform actions.
 *
 * ```html
 * <vaadin-button>Press me</vaadin-button>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|-------------
 * `label`   | The label (text) inside the button.
 * `prefix`  | A slot for content before the label (e.g. an icon).
 * `suffix`  | A slot for content after the label (e.g. an icon).
 *
 * The following attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|-------------
 * `active`     | Set when the button is pressed down, either with mouse, touch or the keyboard.
 * `disabled`   | Set when the button is disabled.
 * `focus-ring` | Set when the button is focused using the keyboard.
 * `focused`    | Set when the button is focused.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
 * @extends HTMLElement
 * @mixes ButtonMixin
 * @mixes ControllerMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class Button extends ButtonMixin(ElementMixin(ThemableMixin(ControllerMixin(PolymerElement)))) {
  static get is() {
    return 'vaadin-button';
  }

  static get template() {
    return buttonTemplate(html);
  }

  /** @protected */
  ready() {
    super.ready();

    this._tooltipController = new TooltipController(this);
    this.addController(this._tooltipController);
  }
}

customElements.define(Button.is, Button);

/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

registerStyles(
  'vaadin-menu-bar-button',
  i`
    :host {
      flex-shrink: 0;
    }

    :host([slot='overflow']) {
      margin-inline-end: 0;
    }

    [part='label'] ::slotted(vaadin-menu-bar-item) {
      position: relative;
      z-index: 1;
    }
  `,
  { moduleId: 'vaadin-menu-bar-button-styles' },
);

/**
 * An element used internally by `<vaadin-menu-bar>`. Not intended to be used separately.
 *
 * @extends Button
 * @private
 */
class MenuBarButton extends Button {
  static get is() {
    return 'vaadin-menu-bar-button';
  }
}

customElements.define(MenuBarButton.is, MenuBarButton);

/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const template = document.createElement('template');

template.innerHTML = `
  <style>
    @font-face {
      font-family: 'lumo-icons';
      src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAABEgAAsAAAAAIjQAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAADsAAABUIIslek9TLzIAAAFEAAAAQwAAAFZAIUuKY21hcAAAAYgAAAD4AAADrsCU8d5nbHlmAAACgAAAC2cAABeAWri7U2hlYWQAAA3oAAAAMAAAADZa/6SsaGhlYQAADhgAAAAdAAAAJAbpA35obXR4AAAOOAAAABAAAACspBAAAGxvY2EAAA5IAAAAWAAAAFh57oA4bWF4cAAADqAAAAAfAAAAIAFKAXBuYW1lAAAOwAAAATEAAAIuUUJZCHBvc3QAAA/0AAABKwAAAelm8SzVeJxjYGRgYOBiMGCwY2BycfMJYeDLSSzJY5BiYGGAAJA8MpsxJzM9kYEDxgPKsYBpDiBmg4gCACY7BUgAeJxjYGS+yDiBgZWBgamKaQ8DA0MPhGZ8wGDIyAQUZWBlZsAKAtJcUxgcXjG+0mIO+p/FEMUcxDANKMwIkgMABn8MLQB4nO3SWW6DMABF0UtwCEnIPM/zhLK8LqhfXRybSP14XUYtHV9hGYQwQBNIo3cUIPkhQeM7rib1ekqnXg981XuC1qvy84lzojleh3puxL0hPjGjRU473teloEefAUNGjJkwZcacBUtWrNmwZceeA0dOnLlw5cadB09elPGhGf+j0NTI/65KfXerT6JhqKnpRKtgOpuqaTrtKjPUlqHmhto21I7pL6i6hlqY3q7qGWrfUAeGOjTUkaGODXViqFNDnRnq3FAXhro01JWhrg11Y6hbQ90Z6t5QD4Z6NNSToZ4N9WKoV0O9GerdUB+G+jTUl6GWRvkL24BkEXictVh9bFvVFb/nxvbz+7Rf/N6zHcd2bCfP+Wic1Z9N0jpNHCD9SNqqoVBgbQoMjY+pjA4hNnWa2pV1rHSIif0DGkyT2k10Kmu1Cag6huj4ZpqYBHSqJsTEJgZCG3TaVBFv595nO3ZIv4RIrPPuvefe884599zzO/cRF8G/tgn6CFFImNgkR0ggX8wlspbhSSWSdrC5ozd30s2dw5afzvgtyz9/zG9t1hV4RtF1pXolowvtzc2z6L2aYUQM45jKH9WDTvd1LRDoDASYWhfTzTyvboXz6uZX4ARX5wrF39y+HM2+CJ8d0pkyqBIqoze3D12ez4DrFoYzxI8dWwMrDlZ2DMqQAR9AROsJU+2smlTPaTTco52BVxXa2a2+I8vvqd2dVHm1LoPeTn/AZPRYGthDYOeZjBjKoFsVGulR3lGU95SeCK44oHU7MhWUGUKZDT3oSUcG2GWuh+EDDfUYA/jhIhl0TOsJNYSEu7mQmi3UzfXwZKA4BsVsHLXQYGgJW95qEtpJ1VcW9HiTriZBlFEqxsDjA09yCNUoQxxwd7KWSTt2y3GTKifkqHRCoWZc3m11Wa/dKdFgXD4kSYfkeJBKd8KMz7J8dZn/cGRCcLGDnA2Ge3bKzcvlnTDNthFWLH7Xt80ua5FMjA4WKelWv5Xo16vHuYzpRbJhhdVlftuRK0VlR27D9lu5TF0DPBi60OrHNO0AfP/uRWvhn/U3LXICE+nh+3IHPUJ8JE6GyBjZQLbjGchlrSgYngF8zyrIF4NJD3atUcgWsWunGN/UHX5B5/yg7uF87Nqp4Gf52F3gH73DjEZNRoqCKAr9giQJp5rGJABpiVE2htNhW9R8nw0jqYjCYcY4LIjwYNScf4WN06IZnZCEqsI4cFaQbo4Z1TsZBx40YhXkHOecaYE5oY37IIQ+iJJ+UsDYSun5MuRSBRZRUUhlY2DqOGajOR6zrSU/5My6l2DnusH1GQgnw5BZP7iuYM/ahcfQ7Z8y51ddfutvuwNqWQ0cBYr8fj0U0vsHpwerVaB2sWhXT2NExi2r1KUE2tUuVMnkepVQrxTmpQrZTG4iu8he8iPyM3KcPE/+RP5KPoE2CEAKclCBzXATxkYOtUY/o961PWRqsj0chRrHFBbtrjP9/P0ven5pcbRdpL94vfsy33e5+izuwz3nFLFPVNayPZx/jdG1fOChflFRvYzsW6L18efgLrSWIgvcqnGJYi4skO4xREURjbDuxKke5v0T3Mrzkt2fi31uyZlLLrqIpEuXXsMlgw442Jb0GAxjS1DM20kBoCzHLXm/jEm0IltdcvU0fEW24jgiwwRjVd9u4NJHcIyoHJcwvyVqgqj5hqBJ1ZWSJryh9p56UWhX1XbhRbW2ZopuZWsQd5y8mEQ8M+C6xjRYxZbDKWf5AgY+Qq/l6wSPk16zDFjowYuu+wjx13mfkxbyDDxadYT/LijZyI0THB+6yfLaWsRcO82zo9mWTNtpO18qlorZoIVMwSN40tky5DOQ1MCIAe24mvlsuwIIxPb10+uXDQ4uWz/9m3rj+ql7p6bufZARuPVq5tXtsn6KwfP8Jy0TeWOyNhUJN6mhX5rkUTtUppQWEMNTqEdaCGKFYKJaQrCE4JtDLYOlNEKmO5kBTPGY2A0N2sY3+dVlo1N9ycBsIGtOjQ2p/tlZvzo0ur4v6cOh8NTospB7U/X40KahoU3bGIH97dnwmtHlYffVG3R1YOwKM2vNhrPhCT5zk64sG53oS4b31aYjqe/B7+kQiXBN+b6h21hNUPMq29B8CU4elINdygMPKF1B+WBTG7Z9ZshpN/xwEuuDQZR+nuoo4CDaAiiwXmLpmukMQyPf/JMclqgL1ixZQ/nnP2VbdUODFGt2fgBvL123rlLYu/6A9ckb7F3K0/CyBMEu6aQoPscroCcacVehvyQyCZAsizsWWBkoLC+WAiWnOksLKaeuQDzGuqSk42aiYTiJ4zf9afl17SrqaTO1f+XlZAfIuYcq7/IqYMaMrksOJ6vHkOCPDq943xcCnHqVD9pHFRpMqSPXrIua1WNs+tOz1U+ciTCDpPk+c4QYJIHnYhxP/kVPAq+ahFpVhPcHp8qyarhiF+HsBU9Hrl+UZa876fbKipL0KqB6OdUveErgtOI97fZ63ae9SvWU6k2w1JfwqnUbHsYcFCJFrC/W12zIMMirWYEHxMPs6LGYSdkSZ5TsNP9PCpwnWC3HKZ1lydNjWHC2Mn3l6vL0dHn1ldP3LTSrX+vKrBqv7KmMr8p0SR6P1NqF63or6XRlIyO90f7+kf7+myOhvt4tq7f09oUiTc2/dycGgqFQcCDRLYmi1NL7fk0CknVMxEg/cdfs/TnpJMNkgqwj17B8beVazSrVbU4lG67IZYOCnWrYy3yBR9cyWcChywos3LJBEdhhFoAdYjiw0rLGm0xU5OzoGm5/ZfmHjVZpNNg6SznzGKDdwv2cCtVn6Eaxo12cfxLprpVtTcZ6hVx6dow7Yq7e8LXO8PY9Jgjoze9yCtU5FNbegcKkQMdCbt9au/te4Ebe0jkc0ukUL32eYnTpNs20h0KpUOhZPYwVcfhZnfdqeCvDfXiuCbAoYWcXERPc/mDQD3/hdF+wK4i/xv3kYfprIpAuMkk2kW3kdtS0kBIKpZwp8KxmsCyfM1MFzAss9LBkDxRyThiaqTLwKYKJVTwmWTudMyz+yks09346MDh4m72yOxCKrt1XMlQ1qPVlTEVVQ1ofdK/sCWjtZu9qGwZ8YZ9PPWlo1IV3eW3+U0aXblP39zrt+JPf6UhEQ1rUjNBULN+utyuaDNW34kpAVuSOeMTyWbSNWnooFu+QFNWQ4d/Ox4IPWx41fP/fB/Rjeoz08ezPA9TysMtmnOXfGN7Ui3xIYLDALrlDLOP09qtJuY2OeL0+QZXdRnR1nxRVBF/SOyKKPpcrn9mWzH4rH9IidE+PTNU2182+hOgSItrE1slByS24vaLvJpxOqe4Pduf3HJkZ+jLqUz9rRzB7p8gKcgWZwV1L8JtUS5Z2JxZSOCuBoMTQihMzLbCPA0KqGMAljRQjONklW/wjnXKy8vxT/Elvm3/KiMUMOoV0/vnDYlhec0SMKtt3/kKMyOt33tj2bqxQLsTjSGLl+EAsNhCnTyRGktW55EgCn/A4PlnWn+Mg8bgZrWqHxTbPwMuyy1u5YeZF2SUM7JRhddwRgiRuxpmgJmxn9ZW7XpcF3ViX/ar6ptRpGJ0S9Adg4qhb9sI3vbL7qNJV/y4i07t5TZBiho1imFoMz3gED+CtjYUxvP4SOxov4bFoNPg5aR1e+G4UgDPoedJTpogyCJ7oYvRqoVS0MQAy+CoNEdTDUjok5ZHZL/WtjV7rFj3PKQE3iKp7ou+rIxN3b9LB1dGjeT4cvKo3FrnWpYpuaFd/h3dtV8UeKN1Y9hpR3dt4p0H/zKuPQq0kZQUIIpuDfoiETsnIk+gCWMJZUXHtE8V9LkUc2TE8vOMbO4ax/MACabzyaGXc7u3FBr11ThBdB8SIeMAlCntG2KThHSPsaj2Dc9KNyY2a0KZ7ODaTHoRiFkeYz+shZBpCS4X6471KKKnuHd84edfk5F37d1XO5bbkcltu2ZLNbvnPXiUVAnVvprJrP+NObryjxrllS65md6Tm6wzFHRR4dY3QUUjb7MgxaIixU8hspi98fl/Xc+IB4iU66eCVL9YfAfahiSUt4TONS8x0D8W7u8vd3fGWx6OXlM/U1IoU/s61PGhpyXRFa3eReq2qG56lvmYtXavCC1iN7lbiBpWxXHU+cSlztVLVz0tVN600fVsLxaVDknhYioeoXP3t4lqV1r79MAw0GCI1FTL1YIGzPL1MMlJ9ZsN9P7lvA2yr9ZFUzwzPrVgxN/x/SS+chwB4nGNgZGBgAOLPrYdY4vltvjJwM78AijDUqG5oRND/XzNPZboF5HIwMIFEAU/lC+J4nGNgZGBgDvqfBSRfMAAB81QGRgZUoA0AVvYDbwAAAHicY2BgYGB+MTQwAM8EJo8AAAAAAE4AmgDoAQoBLAFOAXABmgHEAe4CGgKcAugEmgS8BNYE8gUOBSoFegXQBf4GRAZmBrYHGAeQCBgIUghqCP4JRgm+CdoKBAo+CoQKugr0C1QLmgvAeJxjYGRgYNBmTGEQZQABJiDmAkIGhv9gPgMAGJQBvAB4nG2RPU7DMBiG3/QP0UoIBGJh8QILavozdmRo9w7d09RpUzlx5LgVvQMn4BAcgoEzcAgOwVvzSZVQbcnf48fvFysJgGt8IcJxROiG9TgauODuj5ukG+EW+UG4jR4ehTv0Q+EunjER7uEWmk+IWpc0d3gVbuAKb8JN+nfhFvlDuI17fAp36L+Fu1jgR7iHp+jF7Arbz1Nb1nO93pnEncSJFtrVuS3VKB6e5EyX2iVer9TyoOr9eux9pjJnCzW1pdfGWFU5u9WpjzfeV5PBIBMfp7aAwQ4FLPrIkbKWqDHn+67pDRK4s4lzbsEux5qHvcIIMb/nueSMyTKkE3jWFdNLHLjW2PPmMa1Hxn3GjGW/wjT0HtOG09JU4WxLk9LH2ISuiv9twJn9y8fh9uIXI+BknAAAAHicbY7ZboMwEEW5CVBCSLrv+76kfJRjTwHFsdGAG+Xvy5JUfehIHp0rnxmNN/D6ir3/a4YBhvARIMQOIowQY4wEE0yxiz3s4wCHOMIxTnCKM5zjApe4wjVucIs73OMBj3jCM17wije84wMzfHqJ0EVmUkmmJo77oOmrHvfIRZbXsTCZplTZldlgb3TYGVHProwFs11t1A57tcON2rErR3PBqcwF1/6ctI6k0GSU4JHMSS6WghdJQ99sTbfuN7QLJ9vQ37dNrgyktnIxlDYLJNuqitpRbYWKFNuyDT6pog6oOYKHtKakeakqKjHXpPwlGRcsC+OqxLIiJpXqoqqDMreG2l5bv9Ri3TRX+c23DZna9WFFgmXuO6Ps1Jm/w6ErW8N3FbHn/QC444j0AA==) format('woff');
      font-weight: normal;
      font-style: normal;
    }

    html {
      --lumo-icons-align-center: "\\ea01";
      --lumo-icons-align-left: "\\ea02";
      --lumo-icons-align-right: "\\ea03";
      --lumo-icons-angle-down: "\\ea04";
      --lumo-icons-angle-left: "\\ea05";
      --lumo-icons-angle-right: "\\ea06";
      --lumo-icons-angle-up: "\\ea07";
      --lumo-icons-arrow-down: "\\ea08";
      --lumo-icons-arrow-left: "\\ea09";
      --lumo-icons-arrow-right: "\\ea0a";
      --lumo-icons-arrow-up: "\\ea0b";
      --lumo-icons-bar-chart: "\\ea0c";
      --lumo-icons-bell: "\\ea0d";
      --lumo-icons-calendar: "\\ea0e";
      --lumo-icons-checkmark: "\\ea0f";
      --lumo-icons-chevron-down: "\\ea10";
      --lumo-icons-chevron-left: "\\ea11";
      --lumo-icons-chevron-right: "\\ea12";
      --lumo-icons-chevron-up: "\\ea13";
      --lumo-icons-clock: "\\ea14";
      --lumo-icons-cog: "\\ea15";
      --lumo-icons-cross: "\\ea16";
      --lumo-icons-download: "\\ea17";
      --lumo-icons-dropdown: "\\ea18";
      --lumo-icons-edit: "\\ea19";
      --lumo-icons-error: "\\ea1a";
      --lumo-icons-eye: "\\ea1b";
      --lumo-icons-eye-disabled: "\\ea1c";
      --lumo-icons-menu: "\\ea1d";
      --lumo-icons-minus: "\\ea1e";
      --lumo-icons-ordered-list: "\\ea1f";
      --lumo-icons-phone: "\\ea20";
      --lumo-icons-photo: "\\ea21";
      --lumo-icons-play: "\\ea22";
      --lumo-icons-plus: "\\ea23";
      --lumo-icons-redo: "\\ea24";
      --lumo-icons-reload: "\\ea25";
      --lumo-icons-search: "\\ea26";
      --lumo-icons-undo: "\\ea27";
      --lumo-icons-unordered-list: "\\ea28";
      --lumo-icons-upload: "\\ea29";
      --lumo-icons-user: "\\ea2a";
    }
  </style>
`;

document.head.appendChild(template.content);

const item = i`
  :host {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size-m);
    line-height: var(--lumo-line-height-xs);
    padding: 0.5em calc(var(--lumo-space-l) + var(--lumo-border-radius-m) / 4) 0.5em
      var(--_lumo-list-box-item-padding-left, calc(var(--lumo-border-radius-m) / 4));
    min-height: var(--lumo-size-m);
    outline: none;
    border-radius: var(--lumo-border-radius-m);
    cursor: var(--lumo-clickable-cursor);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: var(--lumo-primary-color-10pct);
  }

  /* Checkmark */
  [part='checkmark']::before {
    display: var(--_lumo-item-selected-icon-display, none);
    content: var(--lumo-icons-checkmark);
    font-family: lumo-icons;
    font-size: var(--lumo-icon-size-m);
    line-height: 1;
    font-weight: normal;
    width: 1em;
    height: 1em;
    margin: calc((1 - var(--lumo-line-height-xs)) * var(--lumo-font-size-m) / 2) 0;
    color: var(--lumo-primary-text-color);
    flex: none;
    opacity: 0;
    transition: transform 0.2s cubic-bezier(0.12, 0.32, 0.54, 2), opacity 0.1s;
  }

  :host([selected]) [part='checkmark']::before {
    opacity: 1;
  }

  :host([active]:not([selected])) [part='checkmark']::before {
    transform: scale(0.8);
    opacity: 0;
    transition-duration: 0s;
  }

  [part='content'] {
    flex: auto;
  }

  /* Disabled */
  :host([disabled]) {
    color: var(--lumo-disabled-text-color);
    cursor: default;
    pointer-events: none;
  }

  /* TODO a workaround until we have "focus-follows-mouse". After that, use the hover style for focus-ring as well */
  @media (any-hover: hover) {
    :host(:hover:not([disabled])) {
      background-color: var(--lumo-primary-color-10pct);
    }

    :host([focus-ring]:not([disabled])) {
      box-shadow: inset 0 0 0 2px var(--lumo-primary-color-50pct);
    }
  }

  /* RTL specific styles */
  :host([dir='rtl']) {
    padding-left: calc(var(--lumo-space-l) + var(--lumo-border-radius-m) / 4);
    padding-right: var(--_lumo-list-box-item-padding-left, calc(var(--lumo-border-radius-m) / 4));
  }

  /* Slotted icons */
  :host ::slotted(vaadin-icon) {
    width: var(--lumo-icon-size-m);
    height: var(--lumo-icon-size-m);
  }
`;

registerStyles('vaadin-item', item, { moduleId: 'lumo-item' });

const contextMenuItem = i`
  /* :hover needed to workaround https://github.com/vaadin/web-components/issues/3133 */
  :host(:hover) {
    user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
  }

  :host([role='menuitem'][menu-item-checked]) [part='checkmark']::before {
    opacity: 1;
  }

  :host([aria-haspopup='true'])::after {
    font-family: lumo-icons;
    font-size: var(--lumo-icon-size-xs);
    content: var(--lumo-icons-angle-right);
    color: var(--lumo-tertiary-text-color);
  }

  :host(:not([dir='rtl'])[aria-haspopup='true'])::after {
    margin-right: calc(var(--lumo-space-m) * -1);
    padding-left: var(--lumo-space-m);
  }

  :host([expanded]) {
    background-color: var(--lumo-primary-color-10pct);
  }

  /* RTL styles */
  :host([dir='rtl'][aria-haspopup='true'])::after {
    content: var(--lumo-icons-angle-left);
    margin-left: calc(var(--lumo-space-m) * -1);
    padding-right: var(--lumo-space-m);
  }
`;

registerStyles('vaadin-context-menu-item', [item, contextMenuItem], { moduleId: 'lumo-context-menu-item' });

const menuBarItem = i`
  [part='content'] {
    display: flex;
    /* tweak to inherit centering from menu bar button */
    align-items: inherit;
    justify-content: inherit;
  }

  [part='content'] ::slotted(vaadin-icon) {
    display: inline-block;
    width: var(--lumo-icon-size-m);
    height: var(--lumo-icon-size-m);
  }

  [part='content'] ::slotted(vaadin-icon[icon^='vaadin:']) {
    padding: var(--lumo-space-xs);
    box-sizing: border-box !important;
  }
`;

registerStyles('vaadin-menu-bar-item', [item, contextMenuItem, menuBarItem], { moduleId: 'lumo-menu-bar-item' });

const listBox = i`
  :host {
    -webkit-tap-highlight-color: transparent;
    --_lumo-item-selected-icon-display: var(--_lumo-list-box-item-selected-icon-display, block);
  }

  /* Dividers */
  [part='items'] ::slotted(hr) {
    height: 1px;
    border: 0;
    padding: 0;
    margin: var(--lumo-space-s) var(--lumo-border-radius-m);
    background-color: var(--lumo-contrast-10pct);
  }
`;

registerStyles('vaadin-list-box', listBox, { moduleId: 'lumo-list-box' });

const contextMenuListBox = i`
  :host {
    --_lumo-list-box-item-selected-icon-display: block;
  }

  /* Normal item */
  [part='items'] ::slotted([role='menuitem']) {
    -webkit-tap-highlight-color: var(--lumo-primary-color-10pct);
    cursor: default;
    outline: none;
    border-radius: var(--lumo-border-radius-m);
    padding-left: calc(var(--lumo-border-radius-m) / 4);
    padding-right: calc(var(--lumo-space-l) + var(--lumo-border-radius-m) / 4);
  }

  /* Hovered item */
  /* TODO a workaround until we have "focus-follows-mouse". After that, use the hover style for focus-ring as well */
  [part='items'] ::slotted([role='menuitem']:hover:not([disabled])),
  [part='items'] ::slotted([role='menuitem'][expanded]:not([disabled])) {
    background-color: var(--lumo-primary-color-10pct);
  }

  /* RTL styles */
  :host([dir='rtl']) [part='items'] ::slotted([role='menuitem']) {
    padding-left: calc(var(--lumo-space-l) + var(--lumo-border-radius-m) / 4);
    padding-right: calc(var(--lumo-border-radius-m) / 4);
  }

  /* Focused item */
  @media (pointer: coarse) {
    [part='items'] ::slotted([role='menuitem']:hover:not([expanded]):not([disabled])) {
      background-color: transparent;
    }
  }
`;

registerStyles('vaadin-context-menu-list-box', [listBox, contextMenuListBox], {
  moduleId: 'lumo-context-menu-list-box',
});

registerStyles('vaadin-menu-bar-list-box', [listBox, contextMenuListBox], { moduleId: 'lumo-menu-bar-list-box' });

/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const overlay = i`
  :host {
    top: var(--lumo-space-m);
    right: var(--lumo-space-m);
    bottom: var(--lumo-space-m);
    left: var(--lumo-space-m);
    /* Workaround for Edge issue (only on Surface), where an overflowing vaadin-list-box inside vaadin-select-overlay makes the overlay transparent */
    /* stylelint-disable-next-line */
    outline: 0px solid transparent;
  }

  [part='overlay'] {
    background-color: var(--lumo-base-color);
    background-image: linear-gradient(var(--lumo-tint-5pct), var(--lumo-tint-5pct));
    border-radius: var(--lumo-border-radius-m);
    box-shadow: 0 0 0 1px var(--lumo-shade-5pct), var(--lumo-box-shadow-m);
    color: var(--lumo-body-text-color);
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size-m);
    font-weight: 400;
    line-height: var(--lumo-line-height-m);
    letter-spacing: 0;
    text-transform: none;
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  [part='content'] {
    padding: var(--lumo-space-xs);
  }

  [part='backdrop'] {
    background-color: var(--lumo-shade-20pct);
    animation: 0.2s lumo-overlay-backdrop-enter both;
    will-change: opacity;
  }

  @keyframes lumo-overlay-backdrop-enter {
    0% {
      opacity: 0;
    }
  }

  :host([closing]) [part='backdrop'] {
    animation: 0.2s lumo-overlay-backdrop-exit both;
  }

  @keyframes lumo-overlay-backdrop-exit {
    100% {
      opacity: 0;
    }
  }

  @keyframes lumo-overlay-dummy-animation {
    0% {
      opacity: 1;
    }

    100% {
      opacity: 1;
    }
  }
`;

registerStyles('', overlay, { moduleId: 'lumo-overlay' });

/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const menuOverlayCore = i`
  :host([opening]),
  :host([closing]) {
    animation: 0.14s lumo-overlay-dummy-animation;
  }

  [part='overlay'] {
    will-change: opacity, transform;
  }

  :host([opening]) [part='overlay'] {
    animation: 0.1s lumo-menu-overlay-enter ease-out both;
  }

  @keyframes lumo-menu-overlay-enter {
    0% {
      opacity: 0;
      transform: translateY(-4px);
    }
  }

  :host([closing]) [part='overlay'] {
    animation: 0.1s lumo-menu-overlay-exit both;
  }

  @keyframes lumo-menu-overlay-exit {
    100% {
      opacity: 0;
    }
  }
`;

registerStyles('', menuOverlayCore, { moduleId: 'lumo-menu-overlay-core' });

const menuOverlayExt = i`
  /* Small viewport (bottom sheet) styles */
  /* Use direct media queries instead of the state attributes ([phone] and [fullscreen]) provided by the elements */
  @media (max-width: 420px), (max-height: 420px) {
    :host {
      top: 0 !important;
      right: 0 !important;
      bottom: var(--vaadin-overlay-viewport-bottom, 0) !important;
      left: 0 !important;
      align-items: stretch !important;
      justify-content: flex-end !important;
    }

    [part='overlay'] {
      max-height: 50vh;
      width: 100vw;
      border-radius: 0;
      box-shadow: var(--lumo-box-shadow-xl);
    }

    /* The content part scrolls instead of the overlay part, because of the gradient fade-out */
    [part='content'] {
      padding: 30px var(--lumo-space-m);
      max-height: inherit;
      box-sizing: border-box;
      -webkit-overflow-scrolling: touch;
      overflow: auto;
      -webkit-mask-image: linear-gradient(transparent, #000 40px, #000 calc(100% - 40px), transparent);
      mask-image: linear-gradient(transparent, #000 40px, #000 calc(100% - 40px), transparent);
    }

    [part='backdrop'] {
      display: block;
    }

    /* Animations */

    :host([opening]) [part='overlay'] {
      animation: 0.2s lumo-mobile-menu-overlay-enter cubic-bezier(0.215, 0.61, 0.355, 1) both;
    }

    :host([closing]),
    :host([closing]) [part='backdrop'] {
      animation-delay: 0.14s;
    }

    :host([closing]) [part='overlay'] {
      animation: 0.14s 0.14s lumo-mobile-menu-overlay-exit cubic-bezier(0.55, 0.055, 0.675, 0.19) both;
    }
  }

  @keyframes lumo-mobile-menu-overlay-enter {
    0% {
      transform: translateY(150%);
    }
  }

  @keyframes lumo-mobile-menu-overlay-exit {
    100% {
      transform: translateY(150%);
    }
  }
`;

const menuOverlay = [overlay, menuOverlayCore, menuOverlayExt];

registerStyles('', menuOverlay, { moduleId: 'lumo-menu-overlay' });

const contextMenuOverlay = i`
  :host([phone]) {
    top: 0 !important;
    right: 0 !important;
    bottom: var(--vaadin-overlay-viewport-bottom) !important;
    left: 0 !important;
    align-items: stretch;
    justify-content: flex-end;
  }

  /* TODO These style overrides should not be needed.
   We should instead offer a way to have non-selectable items inside the context menu. */

  :host {
    --_lumo-list-box-item-selected-icon-display: none;
    --_lumo-list-box-item-padding-left: calc(var(--lumo-space-m) + var(--lumo-border-radius-m) / 4);
  }

  [part='overlay'] {
    outline: none;
  }
`;

registerStyles('vaadin-context-menu-overlay', [menuOverlay, contextMenuOverlay], {
  moduleId: 'lumo-context-menu-overlay',
});

const menuBarOverlay = i`
  :host(:first-of-type) {
    padding-top: var(--lumo-space-xs);
  }
`;

registerStyles('vaadin-menu-bar-overlay', [menuOverlay, contextMenuOverlay, menuBarOverlay], {
  moduleId: 'lumo-menu-bar-overlay',
});

registerStyles(
  'vaadin-menu-bar',
  i`
    :host([has-single-button]) ::slotted(vaadin-menu-bar-button) {
      border-radius: var(--lumo-border-radius-m);
    }

    :host([theme~='end-aligned']) ::slotted(vaadin-menu-bar-button:first-of-type),
    :host([theme~='end-aligned'][has-single-button]) ::slotted(vaadin-menu-bar-button) {
      margin-inline-start: auto;
    }
  `,
  { moduleId: 'lumo-menu-bar' },
);

registerStyles('vaadin-overlay', overlay, { moduleId: 'lumo-vaadin-overlay' });

/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/


let scheduled = false;
let beforeRenderQueue = [];
let afterRenderQueue = [];

function schedule() {
  scheduled = true;
  // before next render
  requestAnimationFrame(function() {
    scheduled = false;
    flushQueue(beforeRenderQueue);
    // after the render
    setTimeout(function() {
      runQueue(afterRenderQueue);
    });
  });
}

function flushQueue(queue) {
  while (queue.length) {
    callMethod(queue.shift());
  }
}

function runQueue(queue) {
  for (let i=0, l=queue.length; i < l; i++) {
    callMethod(queue.shift());
  }
}

function callMethod(info) {
  const context = info[0];
  const callback = info[1];
  const args = info[2];
  try {
    callback.apply(context, args);
  } catch(e) {
    setTimeout(() => {
      throw e;
    });
  }
}

/**
 * Enqueues a callback which will be run after the next render, equivalent
 * to one task (`setTimeout`) after the next `requestAnimationFrame`.
 *
 * This method is useful for tuning the first-render performance of an
 * element or application by deferring non-critical work until after the
 * first paint.  Typical non-render-critical work may include adding UI
 * event listeners and aria attributes.
 *
 * @param {*} context Context object the callback function will be bound to
 * @param {function(...*):void} callback Callback function
 * @param {!Array=} args An array of arguments to call the callback function with
 * @return {void}
 */
function afterNextRender(context, callback, args) {
  if (!scheduled) {
    schedule();
  }
  afterRenderQueue.push([context, callback, args]);
}

/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const testUserAgent = (regexp) => regexp.test(navigator.userAgent);

const testPlatform = (regexp) => regexp.test(navigator.platform);

const testVendor = (regexp) => regexp.test(navigator.vendor);

testUserAgent(/Android/u);

testUserAgent(/Chrome/u) && testVendor(/Google Inc/u);

testUserAgent(/Firefox/u);

// IPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
const isIPad = testPlatform(/^iPad/u) || (testPlatform(/^Mac/u) && navigator.maxTouchPoints > 1);

const isIPhone = testPlatform(/^iPhone/u);

const isIOS = isIPhone || isIPad;

testUserAgent(/^((?!chrome|android).)*safari/iu);

const isTouch = (() => {
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (e) {
    return false;
  }
})();

/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const instances = [];

/**
 * A controller for trapping focus within a DOM node.
 */
class FocusTrapController {
  /**
   * @param {HTMLElement} host
   */
  constructor(host) {
    /**
     * The controller host element.
     *
     * @type {HTMLElement}
     */
    this.host = host;

    /**
     * A node for trapping focus in.
     *
     * @type {HTMLElement | null}
     * @private
     */
    this.__trapNode = null;

    this.__onKeyDown = this.__onKeyDown.bind(this);
  }

  /**
   * An array of tab-ordered focusable elements inside the trap node.
   *
   * @return {HTMLElement[]}
   * @private
   */
  get __focusableElements() {
    return getFocusableElements(this.__trapNode);
  }

  /**
   * The index of the element inside the trap node that currently has focus.
   *
   * @return {HTMLElement | undefined}
   * @private
   */
  get __focusedElementIndex() {
    const focusableElements = this.__focusableElements;
    return focusableElements.indexOf(focusableElements.filter(isElementFocused).pop());
  }

  hostConnected() {
    document.addEventListener('keydown', this.__onKeyDown);
  }

  hostDisconnected() {
    document.removeEventListener('keydown', this.__onKeyDown);
  }

  /**
   * Activates a focus trap for a DOM node that will prevent focus from escaping the node.
   * The trap can be deactivated with the `.releaseFocus()` method.
   *
   * If focus is initially outside the trap, the method will move focus inside,
   * on the first focusable element of the trap in the tab order.
   * The first focusable element can be the trap node itself if it is focusable
   * and comes first in the tab order.
   *
   * If there are no focusable elements, the method will throw an exception
   * and the trap will not be set.
   *
   * @param {HTMLElement} trapNode
   */
  trapFocus(trapNode) {
    this.__trapNode = trapNode;

    if (this.__focusableElements.length === 0) {
      this.__trapNode = null;
      throw new Error('The trap node should have at least one focusable descendant or be focusable itself.');
    }

    instances.push(this);

    if (this.__focusedElementIndex === -1) {
      this.__focusableElements[0].focus();
    }
  }

  /**
   * Deactivates the focus trap set with the `.trapFocus()` method
   * so that it becomes possible to tab outside the trap node.
   */
  releaseFocus() {
    this.__trapNode = null;

    instances.pop();
  }

  /**
   * A `keydown` event handler that manages tabbing navigation when the trap is enabled.
   *
   * - Moves focus to the next focusable element of the trap on `Tab` press.
   * When no next element to focus, the method moves focus to the first focusable element.
   * - Moves focus to the prev focusable element of the trap on `Shift+Tab` press.
   * When no prev element to focus, the method moves focus to the last focusable element.
   *
   * @param {KeyboardEvent} event
   * @private
   */
  __onKeyDown(event) {
    if (!this.__trapNode) {
      return;
    }

    // Only handle events for the last instance
    if (this !== Array.from(instances).pop()) {
      return;
    }

    if (event.key === 'Tab') {
      event.preventDefault();

      const backward = event.shiftKey;
      this.__focusNextElement(backward);
    }
  }

  /**
   * - Moves focus to the next focusable element if `backward === false`.
   * When no next element to focus, the method moves focus to the first focusable element.
   * - Moves focus to the prev focusable element if `backward === true`.
   * When no prev element to focus the method moves focus to the last focusable element.
   *
   * If no focusable elements, the method returns immediately.
   *
   * @param {boolean} backward
   * @private
   */
  __focusNextElement(backward = false) {
    const focusableElements = this.__focusableElements;
    const step = backward ? -1 : 1;
    const currentIndex = this.__focusedElementIndex;
    const nextIndex = (focusableElements.length + currentIndex + step) % focusableElements.length;
    const element = focusableElements[nextIndex];
    element.focus();
    if (element.localName === 'input') {
      element.select();
    }
  }
}

/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Passes the component to the template renderer callback if the template renderer is imported.
 * Otherwise, if there is a template, it warns that the template renderer needs to be imported.
 *
 * @param {HTMLElement} component
 */
function processTemplates(component) {
  if (window.Vaadin && window.Vaadin.templateRendererCallback) {
    window.Vaadin.templateRendererCallback(component);
    return;
  }

  if (component.querySelector('template')) {
    console.warn(
      `WARNING: <template> inside <${component.localName}> is no longer supported. Import @vaadin/polymer-legacy-adapter/template-renderer.js to enable compatibility.`,
    );
  }
}

/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * `<vaadin-overlay>` is a Web Component for creating overlays. The content of the overlay
 * can be populated imperatively by using `renderer` callback function.
 *
 * ### Rendering
 *
 * The renderer function provides `root`, `owner`, `model` arguments when applicable.
 * Generate DOM content by using `model` object properties if needed, append it to the `root`
 * element and control the state of the host element by accessing `owner`. Before generating new
 * content, users are able to check if there is already content in `root` for reusing it.
 *
 * ```html
 * <vaadin-overlay id="overlay"></vaadin-overlay>
 * ```
 * ```js
 * const overlay = document.querySelector('#overlay');
 * overlay.renderer = function(root) {
 *  root.textContent = "Overlay content";
 * };
 * ```
 *
 * Renderer is called on the opening of the overlay and each time the related model is updated.
 * DOM generated during the renderer call can be reused
 * in the next renderer call and will be provided with the `root` argument.
 * On first call it will be empty.
 *
 * ### Styling
 *
 * The following Shadow DOM parts are available for styling:
 *
 * Part name  | Description
 * -----------|---------------------------------------------------------|
 * `backdrop` | Backdrop of the overlay
 * `overlay`  | Container for position/sizing/alignment of the content
 * `content`  | Content of the overlay
 *
 * The following state attributes are available for styling:
 *
 * Attribute | Description | Part
 * ---|---|---
 * `opening` | Applied just after the overlay is attached to the DOM. You can apply a CSS @keyframe animation for this state. | `:host`
 * `closing` | Applied just before the overlay is detached from the DOM. You can apply a CSS @keyframe animation for this state. | `:host`
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property | Description | Default value
 * ---|---|---
 * `--vaadin-overlay-viewport-bottom` | Bottom offset of the visible viewport area | `0` or detected offset
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} vaadin-overlay-open - Fired after the overlay is opened.
 * @fires {CustomEvent} vaadin-overlay-close - Fired when the opened overlay is about to be closed. Calling `preventDefault()` on the event cancels the closing.
 * @fires {CustomEvent} vaadin-overlay-closing - Fired when the overlay starts to close. Closing the overlay can be asynchronous depending on the animation.
 * @fires {CustomEvent} vaadin-overlay-closed - Fired after the overlay is closed.
 * @fires {CustomEvent} vaadin-overlay-outside-click - Fired before the overlay is closed on outside click. Calling `preventDefault()` on the event cancels the closing.
 * @fires {CustomEvent} vaadin-overlay-escape-press - Fired before the overlay is closed on Escape key press. Calling `preventDefault()` on the event cancels the closing.
 *
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes DirMixin
 * @mixes ControllerMixin
 */
class Overlay extends ThemableMixin(DirMixin(ControllerMixin(PolymerElement))) {
  static get template() {
    return html`
      <style>
        :host {
          z-index: 200;
          position: fixed;

          /* Despite of what the names say, <vaadin-overlay> is just a container
          for position/sizing/alignment. The actual overlay is the overlay part. */

          /* Default position constraints: the entire viewport. Note: themes can
          override this to introduce gaps between the overlay and the viewport. */
          top: 0;
          right: 0;
          bottom: var(--vaadin-overlay-viewport-bottom);
          left: 0;

          /* Use flexbox alignment for the overlay part. */
          display: flex;
          flex-direction: column; /* makes dropdowns sizing easier */
          /* Align to center by default. */
          align-items: center;
          justify-content: center;

          /* Allow centering when max-width/max-height applies. */
          margin: auto;

          /* The host is not clickable, only the overlay part is. */
          pointer-events: none;

          /* Remove tap highlight on touch devices. */
          -webkit-tap-highlight-color: transparent;

          /* CSS API for host */
          --vaadin-overlay-viewport-bottom: 0;
        }

        :host([hidden]),
        :host(:not([opened]):not([closing])) {
          display: none !important;
        }

        [part='overlay'] {
          -webkit-overflow-scrolling: touch;
          overflow: auto;
          pointer-events: auto;

          /* Prevent overflowing the host in MSIE 11 */
          max-width: 100%;
          box-sizing: border-box;

          -webkit-tap-highlight-color: initial; /* reenable tap highlight inside */
        }

        [part='backdrop'] {
          z-index: -1;
          content: '';
          background: rgba(0, 0, 0, 0.5);
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          pointer-events: auto;
        }
      </style>

      <div id="backdrop" part="backdrop" hidden$="[[!withBackdrop]]"></div>
      <div part="overlay" id="overlay" tabindex="0">
        <div part="content" id="content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  static get is() {
    return 'vaadin-overlay';
  }

  static get properties() {
    return {
      /**
       * When true, the overlay is visible and attached to body.
       */
      opened: {
        type: Boolean,
        notify: true,
        observer: '_openedChanged',
        reflectToAttribute: true,
      },

      /**
       * Owner element passed with renderer function
       * @type {HTMLElement}
       */
      owner: Element,

      /**
       * Custom function for rendering the content of the overlay.
       * Receives three arguments:
       *
       * - `root` The root container DOM element. Append your content to it.
       * - `owner` The host element of the renderer function.
       * - `model` The object with the properties related with rendering.
       * @type {OverlayRenderer | null | undefined}
       */
      renderer: Function,

      /**
       * When true the overlay has backdrop on top of content when opened.
       * @type {boolean}
       */
      withBackdrop: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },

      /**
       * Object with properties that is passed to `renderer` function
       */
      model: Object,

      /**
       * When true the overlay won't disable the main content, showing
       * it doesn't change the functionality of the user interface.
       * @type {boolean}
       */
      modeless: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        observer: '_modelessChanged',
      },

      /**
       * When set to true, the overlay is hidden. This also closes the overlay
       * immediately in case there is a closing animation in progress.
       * @type {boolean}
       */
      hidden: {
        type: Boolean,
        reflectToAttribute: true,
        observer: '_hiddenChanged',
      },

      /**
       * When true move focus to the first focusable element in the overlay,
       * or to the overlay if there are no focusable elements.
       * @type {boolean}
       */
      focusTrap: {
        type: Boolean,
        value: false,
      },

      /**
       * Set to true to enable restoring of focus when overlay is closed.
       * @type {boolean}
       */
      restoreFocusOnClose: {
        type: Boolean,
        value: false,
      },

      /**
       * Set to specify the element which should be focused on overlay close,
       * if `restoreFocusOnClose` is set to true.
       * @type {HTMLElement}
       */
      restoreFocusNode: {
        type: HTMLElement,
      },

      /** @private */
      _mouseDownInside: {
        type: Boolean,
      },

      /** @private */
      _mouseUpInside: {
        type: Boolean,
      },

      /** @private */
      _oldOwner: Element,

      /** @private */
      _oldModel: Object,

      /** @private */
      _oldRenderer: Object,

      /** @private */
      _oldOpened: Boolean,
    };
  }

  static get observers() {
    return ['_rendererOrDataChanged(renderer, owner, model, opened)'];
  }

  /**
   * Returns all attached overlays in visual stacking order.
   * @private
   */
  static get __attachedInstances() {
    return Array.from(document.body.children)
      .filter((el) => el instanceof Overlay && !el.hasAttribute('closing'))
      .sort((a, b) => a.__zIndex - b.__zIndex || 0);
  }

  constructor() {
    super();
    this._boundMouseDownListener = this._mouseDownListener.bind(this);
    this._boundMouseUpListener = this._mouseUpListener.bind(this);
    this._boundOutsideClickListener = this._outsideClickListener.bind(this);
    this._boundKeydownListener = this._keydownListener.bind(this);

    /* c8 ignore next 3 */
    if (isIOS) {
      this._boundIosResizeListener = () => this._detectIosNavbar();
    }

    this.__focusTrapController = new FocusTrapController(this);
  }

  /**
   * Returns true if this is the last one in the opened overlays stack
   * @return {boolean}
   * @protected
   */
  get _last() {
    return this === Overlay.__attachedInstances.pop();
  }

  /** @protected */
  ready() {
    super.ready();

    // Need to add dummy click listeners to this and the backdrop or else
    // the document click event listener (_outsideClickListener) may never
    // get invoked on iOS Safari (reproducible in <vaadin-dialog>
    // and <vaadin-context-menu>).
    this.addEventListener('click', () => {});
    this.$.backdrop.addEventListener('click', () => {});

    this.addController(this.__focusTrapController);

    processTemplates(this);
  }

  /** @private */
  _detectIosNavbar() {
    /* c8 ignore next 15 */
    if (!this.opened) {
      return;
    }

    const innerHeight = window.innerHeight;
    const innerWidth = window.innerWidth;

    const landscape = innerWidth > innerHeight;

    const clientHeight = document.documentElement.clientHeight;

    if (landscape && clientHeight > innerHeight) {
      this.style.setProperty('--vaadin-overlay-viewport-bottom', `${clientHeight - innerHeight}px`);
    } else {
      this.style.setProperty('--vaadin-overlay-viewport-bottom', '0');
    }
  }

  /**
   * @param {Event=} sourceEvent
   */
  close(sourceEvent) {
    const evt = new CustomEvent('vaadin-overlay-close', {
      bubbles: true,
      cancelable: true,
      detail: { sourceEvent },
    });
    this.dispatchEvent(evt);
    if (!evt.defaultPrevented) {
      this.opened = false;
    }
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    /* c8 ignore next 3 */
    if (this._boundIosResizeListener) {
      this._detectIosNavbar();
      window.addEventListener('resize', this._boundIosResizeListener);
    }
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();

    /* c8 ignore next 3 */
    if (this._boundIosResizeListener) {
      window.removeEventListener('resize', this._boundIosResizeListener);
    }
  }

  /**
   * Requests an update for the content of the overlay.
   * While performing the update, it invokes the renderer passed in the `renderer` property.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate() {
    if (this.renderer) {
      this.renderer.call(this.owner, this, this.owner, this.model);
    }
  }

  /** @private */
  _mouseDownListener(event) {
    this._mouseDownInside = event.composedPath().indexOf(this.$.overlay) >= 0;
  }

  /** @private */
  _mouseUpListener(event) {
    this._mouseUpInside = event.composedPath().indexOf(this.$.overlay) >= 0;
  }

  /**
   * Whether to close the overlay on outside click or not.
   * Override this method to customize the closing logic.
   *
   * @param {Event} _event
   * @return {boolean}
   * @protected
   */
  _shouldCloseOnOutsideClick(_event) {
    return this._last;
  }

  /**
   * Outside click listener used in capture phase to close the overlay before
   * propagating the event to the listener on the element that triggered it.
   * Otherwise, calling `open()` would result in closing and re-opening.
   *
   * @private
   */
  _outsideClickListener(event) {
    if (event.composedPath().includes(this.$.overlay) || this._mouseDownInside || this._mouseUpInside) {
      this._mouseDownInside = false;
      this._mouseUpInside = false;
      return;
    }

    if (!this._shouldCloseOnOutsideClick(event)) {
      return;
    }

    const evt = new CustomEvent('vaadin-overlay-outside-click', {
      bubbles: true,
      cancelable: true,
      detail: { sourceEvent: event },
    });
    this.dispatchEvent(evt);

    if (this.opened && !evt.defaultPrevented) {
      this.close(event);
    }
  }

  /**
   * Listener used to close whe overlay on Escape press, if it is the last one.
   * @private
   */
  _keydownListener(event) {
    if (!this._last) {
      return;
    }

    // Only close modeless overlay on Esc press when it contains focus
    if (this.modeless && !event.composedPath().includes(this.$.overlay)) {
      return;
    }

    if (event.key === 'Escape') {
      const evt = new CustomEvent('vaadin-overlay-escape-press', {
        bubbles: true,
        cancelable: true,
        detail: { sourceEvent: event },
      });
      this.dispatchEvent(evt);

      if (this.opened && !evt.defaultPrevented) {
        this.close(event);
      }
    }
  }

  /** @private */
  _openedChanged(opened, wasOpened) {
    if (opened) {
      // Store focused node.
      this.__restoreFocusNode = this._getActiveElement();
      this._animatedOpening();

      afterNextRender(this, () => {
        if (this.focusTrap) {
          this.__focusTrapController.trapFocus(this.$.overlay);
        }

        const evt = new CustomEvent('vaadin-overlay-open', { bubbles: true });
        this.dispatchEvent(evt);
      });

      document.addEventListener('keydown', this._boundKeydownListener);

      if (!this.modeless) {
        this._addGlobalListeners();
      }
    } else if (wasOpened) {
      if (this.focusTrap) {
        this.__focusTrapController.releaseFocus();
      }

      this._animatedClosing();

      document.removeEventListener('keydown', this._boundKeydownListener);

      if (!this.modeless) {
        this._removeGlobalListeners();
      }
    }
  }

  /** @private */
  _hiddenChanged(hidden) {
    if (hidden && this.hasAttribute('closing')) {
      this._flushAnimation('closing');
    }
  }

  /**
   * @return {boolean}
   * @private
   */
  _shouldAnimate() {
    const style = getComputedStyle(this);
    const name = style.getPropertyValue('animation-name');
    const hidden = style.getPropertyValue('display') === 'none';
    return !hidden && name && name !== 'none';
  }

  /**
   * @param {string} type
   * @param {Function} callback
   * @private
   */
  _enqueueAnimation(type, callback) {
    const handler = `__${type}Handler`;
    const listener = (event) => {
      if (event && event.target !== this) {
        return;
      }
      callback();
      this.removeEventListener('animationend', listener);
      delete this[handler];
    };
    this[handler] = listener;
    this.addEventListener('animationend', listener);
  }

  /**
   * @param {string} type
   * @protected
   */
  _flushAnimation(type) {
    const handler = `__${type}Handler`;
    if (typeof this[handler] === 'function') {
      this[handler]();
    }
  }

  /** @private */
  _animatedOpening() {
    if (this.parentNode === document.body && this.hasAttribute('closing')) {
      this._flushAnimation('closing');
    }
    this._attachOverlay();
    if (!this.modeless) {
      this._enterModalState();
    }
    this.setAttribute('opening', '');

    if (this._shouldAnimate()) {
      this._enqueueAnimation('opening', () => {
        this._finishOpening();
      });
    } else {
      this._finishOpening();
    }
  }

  /** @private */
  _attachOverlay() {
    this._placeholder = document.createComment('vaadin-overlay-placeholder');
    this.parentNode.insertBefore(this._placeholder, this);
    document.body.appendChild(this);
    this.bringToFront();
  }

  /** @private */
  _finishOpening() {
    this.removeAttribute('opening');
  }

  /** @private */
  _finishClosing() {
    this._detachOverlay();
    this.$.overlay.style.removeProperty('pointer-events');
    this.removeAttribute('closing');
    this.dispatchEvent(new CustomEvent('vaadin-overlay-closed'));
  }

  /** @private */
  _animatedClosing() {
    if (this.hasAttribute('opening')) {
      this._flushAnimation('opening');
    }
    if (this._placeholder) {
      this._exitModalState();

      // Use this.restoreFocusNode if specified, otherwise fallback to the node
      // which was focused before opening the overlay.
      const restoreFocusNode = this.restoreFocusNode || this.__restoreFocusNode;

      if (this.restoreFocusOnClose && restoreFocusNode) {
        // If the activeElement is `<body>` or inside the overlay,
        // we are allowed to restore the focus. In all the other
        // cases focus might have been moved elsewhere by another
        // component or by the user interaction (e.g. click on a
        // button outside the overlay).
        const activeElement = this._getActiveElement();

        if (activeElement === document.body || this._deepContains(activeElement)) {
          // Focusing the restoreFocusNode doesn't always work synchronously on Firefox and Safari
          // (e.g. combo-box overlay close on outside click).
          setTimeout(() => restoreFocusNode.focus());
        }
        this.__restoreFocusNode = null;
      }

      this.setAttribute('closing', '');
      this.dispatchEvent(new CustomEvent('vaadin-overlay-closing'));

      if (this._shouldAnimate()) {
        this._enqueueAnimation('closing', () => {
          this._finishClosing();
        });
      } else {
        this._finishClosing();
      }
    }
  }

  /** @private */
  _detachOverlay() {
    this._placeholder.parentNode.insertBefore(this, this._placeholder);
    this._placeholder.parentNode.removeChild(this._placeholder);
  }

  /** @private */
  _modelessChanged(modeless) {
    if (!modeless) {
      if (this.opened) {
        this._addGlobalListeners();
        this._enterModalState();
      }
    } else {
      this._removeGlobalListeners();
      this._exitModalState();
    }
  }

  /** @private */
  _addGlobalListeners() {
    document.addEventListener('mousedown', this._boundMouseDownListener);
    document.addEventListener('mouseup', this._boundMouseUpListener);
    // Firefox leaks click to document on contextmenu even if prevented
    // https://bugzilla.mozilla.org/show_bug.cgi?id=990614
    document.documentElement.addEventListener('click', this._boundOutsideClickListener, true);
  }

  /** @private */
  _enterModalState() {
    if (document.body.style.pointerEvents !== 'none') {
      // Set body pointer-events to 'none' to disable mouse interactions with
      // other document nodes.
      this._previousDocumentPointerEvents = document.body.style.pointerEvents;
      document.body.style.pointerEvents = 'none';
    }

    // Disable pointer events in other attached overlays
    Overlay.__attachedInstances.forEach((el) => {
      if (el !== this) {
        el.shadowRoot.querySelector('[part="overlay"]').style.pointerEvents = 'none';
      }
    });
  }

  /** @private */
  _removeGlobalListeners() {
    document.removeEventListener('mousedown', this._boundMouseDownListener);
    document.removeEventListener('mouseup', this._boundMouseUpListener);
    document.documentElement.removeEventListener('click', this._boundOutsideClickListener, true);
  }

  /** @private */
  _exitModalState() {
    if (this._previousDocumentPointerEvents !== undefined) {
      // Restore body pointer-events
      document.body.style.pointerEvents = this._previousDocumentPointerEvents;
      delete this._previousDocumentPointerEvents;
    }

    // Restore pointer events in the previous overlay(s)
    const instances = Overlay.__attachedInstances;
    let el;
    // Use instances.pop() to ensure the reverse order
    while ((el = instances.pop())) {
      if (el === this) {
        // Skip the current instance
        continue;
      }
      el.shadowRoot.querySelector('[part="overlay"]').style.removeProperty('pointer-events');
      if (!el.modeless) {
        // Stop after the last modal
        break;
      }
    }
  }

  /** @private */
  _rendererOrDataChanged(renderer, owner, model, opened) {
    const ownerOrModelChanged = this._oldOwner !== owner || this._oldModel !== model;
    this._oldModel = model;
    this._oldOwner = owner;

    const rendererChanged = this._oldRenderer !== renderer;
    this._oldRenderer = renderer;

    const openedChanged = this._oldOpened !== opened;
    this._oldOpened = opened;

    if (rendererChanged) {
      this.innerHTML = '';
      // Whenever a Lit-based renderer is used, it assigns a Lit part to the node it was rendered into.
      // When clearing the rendered content, this part needs to be manually disposed of.
      // Otherwise, using a Lit-based renderer on the same node will throw an exception or render nothing afterward.
      delete this._$litPart$;
    }

    if (opened && renderer && (rendererChanged || openedChanged || ownerOrModelChanged)) {
      this.requestContentUpdate();
    }
  }

  /**
   * @return {!Element}
   * @private
   */
  _getActiveElement() {
    // Document.activeElement can be null
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/activeElement
    let active = document.activeElement || document.body;
    while (active.shadowRoot && active.shadowRoot.activeElement) {
      active = active.shadowRoot.activeElement;
    }
    return active;
  }

  /**
   * @param {!Node} node
   * @return {boolean}
   * @private
   */
  _deepContains(node) {
    if (this.contains(node)) {
      return true;
    }
    let n = node;
    const doc = node.ownerDocument;
    // Walk from node to `this` or `document`
    while (n && n !== doc && n !== this) {
      n = n.parentNode || n.host;
    }
    return n === this;
  }

  /**
   * Brings the overlay as visually the frontmost one
   */
  bringToFront() {
    let zIndex = '';
    const frontmost = Overlay.__attachedInstances.filter((o) => o !== this).pop();
    if (frontmost) {
      const frontmostZIndex = frontmost.__zIndex;
      zIndex = frontmostZIndex + 1;
    }
    this.style.zIndex = zIndex;
    this.__zIndex = zIndex || parseFloat(getComputedStyle(this).zIndex);
  }

  /**
   * @event vaadin-overlay-open
   * Fired after the overlay is opened.
   */

  /**
   * @event vaadin-overlay-close
   * Fired when the opened overlay is about to be closed.
   * Calling `preventDefault()` on the event cancels the closing.
   */

  /**
   * @event vaadin-overlay-closing
   * Fired when the overlay starts to close.
   * Closing the overlay can be asynchronous depending on the animation.
   */

  /**
   * @event vaadin-overlay-closed
   * Fired after the overlay is closed.
   */

  /**
   * @event vaadin-overlay-escape-press
   * Fired before the overlay is closed on Escape key press.
   * Calling `preventDefault()` on the event cancels the closing.
   */

  /**
   * @event vaadin-overlay-outside-click
   * Fired before the overlay is closed on outside click.
   * Calling `preventDefault()` on the event cancels the closing.
   */
}

customElements.define(Overlay.is, Overlay);

/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin providing `focused`, `focus-ring`, `active`, `disabled` and `selected`.
 *
 * `focused`, `active` and `focus-ring` are set as only as attributes.
 * @polymerMixin
 */
const ItemMixin = (superClass) =>
  class VaadinItemMixin extends ActiveMixin(FocusMixin(superClass)) {
    static get properties() {
      return {
        /**
         * Used for mixin detection because `instanceof` does not work with mixins.
         * e.g. in VaadinListMixin it filters items by using the
         * `element._hasVaadinItemMixin` condition.
         * @type {boolean}
         */
        _hasVaadinItemMixin: {
          value: true,
        },

        /**
         * If true, the item is in selected state.
         * @type {boolean}
         */
        selected: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          observer: '_selectedChanged',
        },

        /** @private */
        _value: String,
      };
    }

    /**
     * By default, `Space` is the only possible activation key for a focusable HTML element.
     * Nonetheless, the item is an exception as it can be also activated by pressing `Enter`.
     * See the "Keyboard Support" section in https://www.w3.org/TR/wai-aria-practices/examples/menubar/menubar-1/menubar-1.html.
     *
     * @protected
     * @override
     */
    get _activeKeys() {
      return ['Enter', ' '];
    }

    /**
     * @return {string}
     */
    get value() {
      return this._value !== undefined ? this._value : this.textContent.trim();
    }

    /**
     * @param {string} value
     */
    set value(value) {
      this._value = value;
    }

    /** @protected */
    ready() {
      super.ready();

      const attrValue = this.getAttribute('value');
      if (attrValue !== null) {
        this.value = attrValue;
      }
    }

    /**
     * Override native `focus` to set focused attribute
     * when focusing the item programmatically.
     * @protected
     * @override
     */
    focus() {
      if (this.disabled) {
        return;
      }

      super.focus();
      this._setFocused(true);
    }

    /**
     * @param {KeyboardEvent | MouseEvent} _event
     * @protected
     * @override
     */
    _shouldSetActive(event) {
      return !this.disabled && !(event.type === 'keydown' && event.defaultPrevented);
    }

    /** @private */
    _selectedChanged(selected) {
      this.setAttribute('aria-selected', selected);
    }

    /**
     * Override an observer from `DisabledMixin`.
     * @protected
     * @override
     */
    _disabledChanged(disabled) {
      super._disabledChanged(disabled);

      if (disabled) {
        this.selected = false;
        this.blur();
      }
    }

    /**
     * In order to be fully accessible from the keyboard, the item should
     * manually fire the `click` event once an activation key is pressed.
     *
     * According to the UI Events specifications,
     * the `click` event should be fired exactly on `keydown`:
     * https://www.w3.org/TR/uievents/#event-type-keydown
     *
     * @param {KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyDown(event) {
      super._onKeyDown(event);

      if (this._activeKeys.includes(event.key) && !event.defaultPrevented) {
        event.preventDefault();

        // `DisabledMixin` overrides the standard `click()` method
        // so that it doesn't fire the `click` event when the element is disabled.
        this.click();
      }
    }
  };

/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * An element used internally by `<vaadin-menu-bar>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes DirMixin
 * @mixes ItemMixin
 * @mixes ThemableMixin
 * @protected
 */
class MenuBarItem extends ItemMixin(ThemableMixin(DirMixin(PolymerElement))) {
  static get is() {
    return 'vaadin-menu-bar-item';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
        }

        :host([hidden]) {
          display: none !important;
        }
      </style>
      <span part="checkmark" aria-hidden="true"></span>
      <div part="content">
        <slot></slot>
      </div>
    `;
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    // Set role in `connectedCallback()` instead of `ready()`
    // because the role is removed when teleporting to button.
    this.setAttribute('role', 'menuitem');
  }
}

customElements.define(MenuBarItem.is, MenuBarItem);

/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Get the scrollLeft value of the element relative to the direction
 *
 * @param {HTMLElement} element
 * @param {string} direction current direction of the element
 * @return {number} the scrollLeft value.
 */
function getNormalizedScrollLeft(element, direction) {
  const { scrollLeft } = element;
  if (direction !== 'rtl') {
    return scrollLeft;
  }

  return element.scrollWidth - element.clientWidth + scrollLeft;
}

/**
 * Set the scrollLeft value of the element relative to the direction
 *
 * @param {HTMLElement} element
 * @param {string} direction current direction of the element
 * @param {number} scrollLeft the scrollLeft value to be set
 */
function setNormalizedScrollLeft(element, direction, scrollLeft) {
  if (direction !== 'rtl') {
    element.scrollLeft = scrollLeft;
  } else {
    element.scrollLeft = element.clientWidth - element.scrollWidth + scrollLeft;
  }
}

/**
 * @license
 * Copyright (c) 2022 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin for navigating items with keyboard.
 *
 * @polymerMixin
 * @mixes KeyboardMixin
 */
const KeyboardDirectionMixin = (superclass) =>
  class KeyboardDirectionMixinClass extends KeyboardMixin(superclass) {
    /**
     * @return {Element | null}
     * @protected
     */
    get focused() {
      return (this._getItems() || []).find(isElementFocused);
    }

    /**
     * @return {boolean}
     * @protected
     */
    get _vertical() {
      return true;
    }

    /** @protected */
    focus() {
      const items = this._getItems();
      if (Array.isArray(items)) {
        const idx = this._getAvailableIndex(items, 0, null, (item) => !isElementHidden(item));
        if (idx >= 0) {
          items[idx].focus();
        }
      }
    }

    /**
     * Get the list of items participating in keyboard navigation.
     * By default, it treats all the light DOM children as items.
     * Override this method to provide custom list of elements.
     *
     * @return {Element[]}
     * @protected
     */
    _getItems() {
      return Array.from(this.children);
    }

    /**
     * Override an event listener from `KeyboardMixin`.
     *
     * @param {!KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyDown(event) {
      super._onKeyDown(event);

      if (event.metaKey || event.ctrlKey) {
        return;
      }

      const { key } = event;
      const items = this._getItems() || [];
      const currentIdx = items.indexOf(this.focused);

      let idx;
      let increment;

      const isRTL = !this._vertical && this.getAttribute('dir') === 'rtl';
      const dirIncrement = isRTL ? -1 : 1;

      if (this.__isPrevKey(key)) {
        increment = -dirIncrement;
        idx = currentIdx - dirIncrement;
      } else if (this.__isNextKey(key)) {
        increment = dirIncrement;
        idx = currentIdx + dirIncrement;
      } else if (key === 'Home') {
        increment = 1;
        idx = 0;
      } else if (key === 'End') {
        increment = -1;
        idx = items.length - 1;
      }

      idx = this._getAvailableIndex(items, idx, increment, (item) => !isElementHidden(item));

      if (idx >= 0) {
        event.preventDefault();
        this._focus(idx, true);
      }
    }

    /**
     * @param {string} key
     * @return {boolean}
     * @private
     */
    __isPrevKey(key) {
      return this._vertical ? key === 'ArrowUp' : key === 'ArrowLeft';
    }

    /**
     * @param {string} key
     * @return {boolean}
     * @private
     */
    __isNextKey(key) {
      return this._vertical ? key === 'ArrowDown' : key === 'ArrowRight';
    }

    /**
     * Focus the item at given index. Override this method to add custom logic.
     *
     * @param {number} index
     * @param {boolean} navigating
     * @protected
     */
    _focus(index, navigating = false) {
      const items = this._getItems();

      this._focusItem(items[index], navigating);
    }

    /**
     * Focus the given item. Override this method to add custom logic.
     *
     * @param {Element} item
     * @param {boolean} navigating
     * @protected
     */
    _focusItem(item) {
      if (item) {
        item.focus();

        // Generally, the items are expected to implement `FocusMixin`
        // that would set this attribute based on the `keydown` event.
        // We set it manually to handle programmatic focus() calls.
        item.setAttribute('focus-ring', '');
      }
    }

    /**
     * Returns index of the next item that satisfies the given condition,
     * based on the index of the current item and a numeric increment.
     *
     * @param {Element[]} items - array of items to iterate over
     * @param {number} index - index of the current item
     * @param {number} increment - numeric increment, can be either 1 or -1
     * @param {Function} condition - function used to check the item
     * @return {number}
     * @protected
     */
    _getAvailableIndex(items, index, increment, condition) {
      const totalItems = items.length;
      let idx = index;
      for (let i = 0; typeof idx === 'number' && i < totalItems; i += 1, idx += increment || 1) {
        if (idx < 0) {
          idx = totalItems - 1;
        } else if (idx >= totalItems) {
          idx = 0;
        }

        const item = items[idx];

        if (!item.hasAttribute('disabled') && this.__isMatchingItem(item, condition)) {
          return idx;
        }
      }
      return -1;
    }

    /**
     * Returns true if the item matches condition.
     *
     * @param {Element} item - item to check
     * @param {Function} condition - function used to check the item
     * @return {number}
     * @private
     */
    __isMatchingItem(item, condition) {
      return typeof condition === 'function' ? condition(item) : true;
    }
  };

/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin for list elements, facilitating navigation and selection of items.
 *
 * @polymerMixin
 * @mixes KeyboardDirectionMixin
 */
const ListMixin = (superClass) =>
  class ListMixinClass extends KeyboardDirectionMixin(superClass) {
    static get properties() {
      return {
        /**
         * Used for mixin detection because `instanceof` does not work with mixins.
         * @type {boolean}
         */
        _hasVaadinListMixin: {
          value: true,
        },

        /**
         * If true, the user cannot interact with this element.
         * When the element is disabled, the selected item is
         * not updated when `selected` property is changed.
         */
        disabled: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
        },

        /**
         * The index of the item selected in the items array.
         * Note: Not updated when used in `multiple` selection mode.
         */
        selected: {
          type: Number,
          reflectToAttribute: true,
          notify: true,
        },

        /**
         * Define how items are disposed in the dom.
         * Possible values are: `horizontal|vertical`.
         * It also changes navigation keys from left/right to up/down.
         * @type {!ListOrientation}
         */
        orientation: {
          type: String,
          reflectToAttribute: true,
          value: '',
        },

        /**
         * The list of items from which a selection can be made.
         * It is populated from the elements passed to the light DOM,
         * and updated dynamically when adding or removing items.
         *
         * The item elements must implement `Vaadin.ItemMixin`.
         *
         * Note: unlike `<vaadin-combo-box>`, this property is read-only,
         * so if you want to provide items by iterating array of data,
         * you have to use `dom-repeat` and place it to the light DOM.
         * @type {!Array<!Element> | undefined}
         */
        items: {
          type: Array,
          readOnly: true,
          notify: true,
        },

        /**
         * The search buffer for the keyboard selection feature.
         * @private
         */
        _searchBuf: {
          type: String,
          value: '',
        },
      };
    }

    static get observers() {
      return ['_enhanceItems(items, orientation, selected, disabled)'];
    }

    /**
     * @return {boolean}
     * @protected
     */
    get _isRTL() {
      return !this._vertical && this.getAttribute('dir') === 'rtl';
    }

    /**
     * @return {!HTMLElement}
     * @protected
     */
    get _scrollerElement() {
      // Returning scroller element of the component
      console.warn(`Please implement the '_scrollerElement' property in <${this.localName}>`);
      return this;
    }

    /**
     * @return {boolean}
     * @protected
     */
    get _vertical() {
      return this.orientation !== 'horizontal';
    }

    focus() {
      // In initialization (e.g vaadin-select) observer might not been run yet.
      if (this._observer) {
        this._observer.flush();
      }
      const firstItem = this.querySelector('[tabindex="0"]') || (this.items ? this.items[0] : null);
      this._focusItem(firstItem);
    }

    /** @protected */
    ready() {
      super.ready();

      this.addEventListener('click', (e) => this._onClick(e));

      this._observer = new FlattenedNodesObserver(this, () => {
        this._setItems(this._filterItems(FlattenedNodesObserver.getFlattenedNodes(this)));
      });
    }

    /**
     * Override method inherited from `KeyboardDirectionMixin`
     * to use the stored list of item elements.
     *
     * @return {Element[]}
     * @protected
     * @override
     */
    _getItems() {
      return this.items;
    }

    /** @private */
    _enhanceItems(items, orientation, selected, disabled) {
      if (!disabled) {
        if (items) {
          this.setAttribute('aria-orientation', orientation || 'vertical');
          items.forEach((item) => {
            if (orientation) {
              item.setAttribute('orientation', orientation);
            } else {
              item.removeAttribute('orientation');
            }
          });

          this._setFocusable(selected || 0);

          const itemToSelect = items[selected];
          items.forEach((item) => {
            item.selected = item === itemToSelect;
          });
          if (itemToSelect && !itemToSelect.disabled) {
            this._scrollToItem(selected);
          }
        }
      }
    }

    /**
     * @param {!Array<!Element>} array
     * @return {!Array<!Element>}
     * @protected
     */
    _filterItems(array) {
      return array.filter((e) => e._hasVaadinItemMixin);
    }

    /**
     * @param {!MouseEvent} event
     * @protected
     */
    _onClick(event) {
      if (event.metaKey || event.shiftKey || event.ctrlKey || event.defaultPrevented) {
        return;
      }

      const item = this._filterItems(event.composedPath())[0];
      let idx;
      if (item && !item.disabled && (idx = this.items.indexOf(item)) >= 0) {
        this.selected = idx;
      }
    }

    /**
     * @param {number} currentIdx
     * @param {string} key
     * @return {number}
     * @protected
     */
    _searchKey(currentIdx, key) {
      this._searchReset = Debouncer.debounce(this._searchReset, timeOut.after(500), () => {
        this._searchBuf = '';
      });
      this._searchBuf += key.toLowerCase();

      if (!this.items.some((item) => this.__isMatchingKey(item))) {
        this._searchBuf = key.toLowerCase();
      }

      const idx = this._searchBuf.length === 1 ? currentIdx + 1 : currentIdx;
      return this._getAvailableIndex(
        this.items,
        idx,
        1,
        (item) => this.__isMatchingKey(item) && getComputedStyle(item).display !== 'none',
      );
    }

    /** @private */
    __isMatchingKey(item) {
      return item.textContent
        .replace(/[^\p{L}\p{Nd}]/gu, '')
        .toLowerCase()
        .startsWith(this._searchBuf);
    }

    /**
     * Override an event listener from `KeyboardMixin`
     * to search items by key.
     *
     * @param {!KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyDown(event) {
      if (event.metaKey || event.ctrlKey) {
        return;
      }

      const key = event.key;

      const currentIdx = this.items.indexOf(this.focused);
      if (/[a-zA-Z0-9]/u.test(key) && key.length === 1) {
        const idx = this._searchKey(currentIdx, key);
        if (idx >= 0) {
          this._focus(idx);
        }
        return;
      }

      super._onKeyDown(event);
    }

    /**
     * @param {!Element} item
     * @return {boolean}
     * @protected
     */
    _isItemHidden(item) {
      return getComputedStyle(item).display === 'none';
    }

    /**
     * @param {number} idx
     * @protected
     */
    _setFocusable(idx) {
      idx = this._getAvailableIndex(this.items, idx, 1);
      const item = this.items[idx];
      this.items.forEach((e) => {
        e.tabIndex = e === item ? 0 : -1;
      });
    }

    /**
     * @param {number} idx
     * @protected
     */
    _focus(idx) {
      this.items.forEach((e, index) => {
        e.focused = index === idx;
      });
      this._setFocusable(idx);
      this._scrollToItem(idx);
      super._focus(idx);
    }

    /**
     * Scroll the container to have the next item by the edge of the viewport.
     * @param {number} idx
     * @protected
     */
    _scrollToItem(idx) {
      const item = this.items[idx];
      if (!item) {
        return;
      }

      const props = this._vertical ? ['top', 'bottom'] : this._isRTL ? ['right', 'left'] : ['left', 'right'];

      const scrollerRect = this._scrollerElement.getBoundingClientRect();
      const nextItemRect = (this.items[idx + 1] || item).getBoundingClientRect();
      const prevItemRect = (this.items[idx - 1] || item).getBoundingClientRect();

      let scrollDistance = 0;
      if (
        (!this._isRTL && nextItemRect[props[1]] >= scrollerRect[props[1]]) ||
        (this._isRTL && nextItemRect[props[1]] <= scrollerRect[props[1]])
      ) {
        scrollDistance = nextItemRect[props[1]] - scrollerRect[props[1]];
      } else if (
        (!this._isRTL && prevItemRect[props[0]] <= scrollerRect[props[0]]) ||
        (this._isRTL && prevItemRect[props[0]] >= scrollerRect[props[0]])
      ) {
        scrollDistance = prevItemRect[props[0]] - scrollerRect[props[0]];
      }

      this._scroll(scrollDistance);
    }

    /**
     * @param {number} pixels
     * @protected
     */
    _scroll(pixels) {
      if (this._vertical) {
        this._scrollerElement.scrollTop += pixels;
      } else {
        const dir = this.getAttribute('dir') || 'ltr';
        const scrollLeft = getNormalizedScrollLeft(this._scrollerElement, dir) + pixels;
        setNormalizedScrollLeft(this._scrollerElement, dir, scrollLeft);
      }
    }

    /**
     * Fired when the selection is changed.
     * Not fired when used in `multiple` selection mode.
     *
     * @event selected-changed
     * @param {Object} detail
     * @param {Object} detail.value the index of the item selected in the items array.
     */
  };

/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * An element used internally by `<vaadin-menu-bar>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes ControllerMixin
 * @mixes DirMixin
 * @mixes ListMixin
 * @mixes ThemableMixin
 * @protected
 */
class MenuBarListBox extends ListMixin(ThemableMixin(DirMixin(ControllerMixin(PolymerElement)))) {
  static get is() {
    return 'vaadin-menu-bar-list-box';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: flex;
        }

        :host([hidden]) {
          display: none !important;
        }

        [part='items'] {
          height: 100%;
          width: 100%;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
      </style>
      <div part="items">
        <slot></slot>
      </div>
    `;
  }

  static get properties() {
    return {
      // We don't need to define this property since super default is vertical,
      // but we don't want it to be modified, or be shown in the API docs.
      /** @private */
      orientation: {
        readOnly: true,
      },
    };
  }

  /**
   * @return {!HTMLElement}
   * @protected
   * @override
   */
  get _scrollerElement() {
    return this.shadowRoot.querySelector('[part="items"]');
  }

  /** @protected */
  ready() {
    super.ready();

    this.setAttribute('role', 'menu');
  }
}

customElements.define(MenuBarListBox.is, MenuBarListBox);

/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const PROP_NAMES_VERTICAL = {
  start: 'top',
  end: 'bottom',
};

const PROP_NAMES_HORIZONTAL = {
  start: 'left',
  end: 'right',
};

const targetResizeObserver = new ResizeObserver((entries) => {
  setTimeout(() => {
    entries.forEach((entry) => {
      if (entry.target.__overlay) {
        entry.target.__overlay._updatePosition();
      }
    });
  });
});

/**
 * @polymerMixin
 */
const PositionMixin = (superClass) =>
  class PositionMixin extends superClass {
    static get properties() {
      return {
        /**
         * The element next to which this overlay should be aligned.
         * The position of the overlay relative to the positionTarget can be adjusted
         * with properties `horizontalAlign`, `verticalAlign`, `noHorizontalOverlap`
         * and `noVerticalOverlap`.
         */
        positionTarget: {
          type: Object,
          value: null,
        },

        /**
         * When `positionTarget` is set, this property defines whether to align the overlay's
         * left or right side to the target element by default.
         * Possible values are `start` and `end`.
         * RTL is taken into account when interpreting the value.
         * The overlay is automatically flipped to the opposite side when it doesn't fit into
         * the default side defined by this property.
         *
         * @attr {start|end} horizontal-align
         */
        horizontalAlign: {
          type: String,
          value: 'start',
        },

        /**
         * When `positionTarget` is set, this property defines whether to align the overlay's
         * top or bottom side to the target element by default.
         * Possible values are `top` and `bottom`.
         * The overlay is automatically flipped to the opposite side when it doesn't fit into
         * the default side defined by this property.
         *
         * @attr {top|bottom} vertical-align
         */
        verticalAlign: {
          type: String,
          value: 'top',
        },

        /**
         * When `positionTarget` is set, this property defines whether the overlay should overlap
         * the target element in the x-axis, or be positioned right next to it.
         *
         * @attr {boolean} no-horizontal-overlap
         */
        noHorizontalOverlap: {
          type: Boolean,
          value: false,
        },

        /**
         * When `positionTarget` is set, this property defines whether the overlay should overlap
         * the target element in the y-axis, or be positioned right above/below it.
         *
         * @attr {boolean} no-vertical-overlap
         */
        noVerticalOverlap: {
          type: Boolean,
          value: false,
        },

        /**
         * If the overlay content has no intrinsic height, this property can be used to set
         * the minimum vertical space (in pixels) required by the overlay. Setting a value to
         * the property effectively disables the content measurement in favor of using this
         * fixed value for determining the open direction.
         *
         * @attr {number} required-vertical-space
         */
        requiredVerticalSpace: {
          type: Number,
          value: 0,
        },
      };
    }

    static get observers() {
      return [
        '__positionSettingsChanged(horizontalAlign, verticalAlign, noHorizontalOverlap, noVerticalOverlap, requiredVerticalSpace)',
        '__overlayOpenedChanged(opened, positionTarget)',
      ];
    }

    constructor() {
      super();

      this.__onScroll = this.__onScroll.bind(this);
      this._updatePosition = this._updatePosition.bind(this);
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      if (this.opened) {
        this.__addUpdatePositionEventListeners();
      }
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();
      this.__removeUpdatePositionEventListeners();
    }

    /** @private */
    __addUpdatePositionEventListeners() {
      window.addEventListener('resize', this._updatePosition);

      this.__positionTargetAncestorRootNodes = getAncestorRootNodes(this.positionTarget);
      this.__positionTargetAncestorRootNodes.forEach((node) => {
        node.addEventListener('scroll', this.__onScroll, true);
      });
    }

    /** @private */
    __removeUpdatePositionEventListeners() {
      window.removeEventListener('resize', this._updatePosition);

      if (this.__positionTargetAncestorRootNodes) {
        this.__positionTargetAncestorRootNodes.forEach((node) => {
          node.removeEventListener('scroll', this.__onScroll, true);
        });
        this.__positionTargetAncestorRootNodes = null;
      }
    }

    /** @private */
    __overlayOpenedChanged(opened, positionTarget) {
      this.__removeUpdatePositionEventListeners();

      if (positionTarget) {
        positionTarget.__overlay = null;
        targetResizeObserver.unobserve(positionTarget);

        if (opened) {
          this.__addUpdatePositionEventListeners();
          positionTarget.__overlay = this;
          targetResizeObserver.observe(positionTarget);
        }
      }

      if (opened) {
        const computedStyle = getComputedStyle(this);
        if (!this.__margins) {
          this.__margins = {};
          ['top', 'bottom', 'left', 'right'].forEach((propName) => {
            this.__margins[propName] = parseInt(computedStyle[propName], 10);
          });
        }
        this.setAttribute('dir', computedStyle.direction);

        this._updatePosition();
        // Schedule another position update (to cover virtual keyboard opening for example)
        requestAnimationFrame(() => this._updatePosition());
      }
    }

    __positionSettingsChanged() {
      this._updatePosition();
    }

    /** @private */
    __onScroll(e) {
      // If the scroll event occurred inside the overlay, ignore it.
      if (!this.contains(e.target)) {
        this._updatePosition();
      }
    }

    _updatePosition() {
      if (!this.positionTarget || !this.opened) {
        return;
      }

      const targetRect = this.positionTarget.getBoundingClientRect();

      // Detect the desired alignment and update the layout accordingly
      const shouldAlignStartVertically = this.__shouldAlignStartVertically(targetRect);
      this.style.justifyContent = shouldAlignStartVertically ? 'flex-start' : 'flex-end';

      const isRTL = this.__isRTL;
      const shouldAlignStartHorizontally = this.__shouldAlignStartHorizontally(targetRect, isRTL);
      const flexStart = (!isRTL && shouldAlignStartHorizontally) || (isRTL && !shouldAlignStartHorizontally);
      this.style.alignItems = flexStart ? 'flex-start' : 'flex-end';

      // Get the overlay rect after possible overlay alignment changes
      const overlayRect = this.getBoundingClientRect();

      // Obtain vertical positioning properties
      const verticalProps = this.__calculatePositionInOneDimension(
        targetRect,
        overlayRect,
        this.noVerticalOverlap,
        PROP_NAMES_VERTICAL,
        this,
        shouldAlignStartVertically,
      );

      // Obtain horizontal positioning properties
      const horizontalProps = this.__calculatePositionInOneDimension(
        targetRect,
        overlayRect,
        this.noHorizontalOverlap,
        PROP_NAMES_HORIZONTAL,
        this,
        shouldAlignStartHorizontally,
      );

      // Apply the positioning properties to the overlay
      Object.assign(this.style, verticalProps, horizontalProps);

      this.toggleAttribute('bottom-aligned', !shouldAlignStartVertically);
      this.toggleAttribute('top-aligned', shouldAlignStartVertically);

      this.toggleAttribute('end-aligned', !flexStart);
      this.toggleAttribute('start-aligned', flexStart);
    }

    __shouldAlignStartHorizontally(targetRect, rtl) {
      // Using previous size to fix a case where window resize may cause the overlay to be squeezed
      // smaller than its current space before the fit-calculations.
      const contentWidth = Math.max(this.__oldContentWidth || 0, this.$.overlay.offsetWidth);
      this.__oldContentWidth = this.$.overlay.offsetWidth;

      const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
      const defaultAlignLeft = (!rtl && this.horizontalAlign === 'start') || (rtl && this.horizontalAlign === 'end');

      return this.__shouldAlignStart(
        targetRect,
        contentWidth,
        viewportWidth,
        this.__margins,
        defaultAlignLeft,
        this.noHorizontalOverlap,
        PROP_NAMES_HORIZONTAL,
      );
    }

    __shouldAlignStartVertically(targetRect) {
      // Using previous size to fix a case where window resize may cause the overlay to be squeezed
      // smaller than its current space before the fit-calculations.
      const contentHeight =
        this.requiredVerticalSpace || Math.max(this.__oldContentHeight || 0, this.$.overlay.offsetHeight);
      this.__oldContentHeight = this.$.overlay.offsetHeight;

      const viewportHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
      const defaultAlignTop = this.verticalAlign === 'top';

      return this.__shouldAlignStart(
        targetRect,
        contentHeight,
        viewportHeight,
        this.__margins,
        defaultAlignTop,
        this.noVerticalOverlap,
        PROP_NAMES_VERTICAL,
      );
    }

    // eslint-disable-next-line max-params
    __shouldAlignStart(targetRect, contentSize, viewportSize, margins, defaultAlignStart, noOverlap, propNames) {
      const spaceForStartAlignment =
        viewportSize - targetRect[noOverlap ? propNames.end : propNames.start] - margins[propNames.end];
      const spaceForEndAlignment = targetRect[noOverlap ? propNames.start : propNames.end] - margins[propNames.start];

      const spaceForDefaultAlignment = defaultAlignStart ? spaceForStartAlignment : spaceForEndAlignment;
      const spaceForOtherAlignment = defaultAlignStart ? spaceForEndAlignment : spaceForStartAlignment;

      const shouldGoToDefaultSide =
        spaceForDefaultAlignment > spaceForOtherAlignment || spaceForDefaultAlignment > contentSize;

      return defaultAlignStart === shouldGoToDefaultSide;
    }

    /**
     * Returns an adjusted value after resizing the browser window,
     * to avoid wrong calculations when e.g. previously set `bottom`
     * CSS property value is larger than the updated viewport height.
     * See https://github.com/vaadin/web-components/issues/4604
     */
    __adjustBottomProperty(cssPropNameToSet, propNames, currentValue) {
      let adjustedProp;

      if (cssPropNameToSet === propNames.end) {
        // Adjust horizontally
        if (propNames.end === PROP_NAMES_VERTICAL.end) {
          const viewportHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);

          if (currentValue > viewportHeight && this.__oldViewportHeight) {
            const heightDiff = this.__oldViewportHeight - viewportHeight;
            adjustedProp = currentValue - heightDiff;
          }

          this.__oldViewportHeight = viewportHeight;
        }

        // Adjust vertically
        if (propNames.end === PROP_NAMES_HORIZONTAL.end) {
          const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);

          if (currentValue > viewportWidth && this.__oldViewportWidth) {
            const widthDiff = this.__oldViewportWidth - viewportWidth;
            adjustedProp = currentValue - widthDiff;
          }

          this.__oldViewportWidth = viewportWidth;
        }
      }

      return adjustedProp;
    }

    /**
     * Returns an object with CSS position properties to set,
     * e.g. { top: "100px" }
     */
    // eslint-disable-next-line max-params
    __calculatePositionInOneDimension(targetRect, overlayRect, noOverlap, propNames, overlay, shouldAlignStart) {
      const cssPropNameToSet = shouldAlignStart ? propNames.start : propNames.end;
      const cssPropNameToClear = shouldAlignStart ? propNames.end : propNames.start;

      const currentValue = parseFloat(overlay.style[cssPropNameToSet] || getComputedStyle(overlay)[cssPropNameToSet]);
      const adjustedValue = this.__adjustBottomProperty(cssPropNameToSet, propNames, currentValue);

      const diff =
        overlayRect[shouldAlignStart ? propNames.start : propNames.end] -
        targetRect[noOverlap === shouldAlignStart ? propNames.end : propNames.start];

      const valueToSet = adjustedValue
        ? `${adjustedValue}px`
        : `${currentValue + diff * (shouldAlignStart ? -1 : 1)}px`;

      return {
        [cssPropNameToSet]: valueToSet,
        [cssPropNameToClear]: '',
      };
    }
  };

/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
const MenuOverlayMixin = (superClass) =>
  class MenuOverlayMixin extends PositionMixin(superClass) {
    static get properties() {
      return {
        /**
         * @protected
         */
        parentOverlay: {
          type: Object,
          readOnly: true,
        },
      };
    }

    static get observers() {
      return ['_themeChanged(_theme)'];
    }

    /** @protected */
    ready() {
      super.ready();

      this.addEventListener('keydown', (e) => {
        if (!e.defaultPrevented && e.composedPath()[0] === this.$.overlay && [38, 40].indexOf(e.keyCode) > -1) {
          const child = this.getFirstChild();
          if (child && Array.isArray(child.items) && child.items.length) {
            e.preventDefault();
            if (e.keyCode === 38) {
              child.items[child.items.length - 1].focus();
            } else {
              child.focus();
            }
          }
        }
      });
    }

    /**
     * Returns the first element in the overlay content.
     *
     * @returns {HTMLElement}
     */
    getFirstChild() {
      return this.querySelector(':not(style):not(slot)');
    }

    /** @private */
    _themeChanged() {
      this.close();
    }

    /**
     * Returns the adjusted boundaries of the overlay.
     *
     * @returns {object}
     */
    getBoundaries() {
      // Measure actual overlay and content sizes
      const overlayRect = this.getBoundingClientRect();
      const contentRect = this.$.overlay.getBoundingClientRect();

      // Maximum x and y values are imposed by content size and overlay limits.
      let yMax = overlayRect.bottom - contentRect.height;

      // Adjust constraints to ensure bottom-aligned applies to sub-menu.
      const parent = this.parentOverlay;
      if (parent && parent.hasAttribute('bottom-aligned')) {
        const parentStyle = getComputedStyle(parent);
        yMax = yMax - parseFloat(parentStyle.bottom) - parseFloat(parentStyle.height);
      }

      return {
        xMax: overlayRect.right - contentRect.width,
        xMin: overlayRect.left + contentRect.width,
        yMax,
      };
    }

    /**
     * @protected
     * @override
     */
    _updatePosition() {
      super._updatePosition();

      if (this.positionTarget && this.parentOverlay) {
        // This overlay is positioned by a parent menu item,
        // adjust the position by the overlay content paddings
        const content = this.$.content;
        const style = getComputedStyle(content);

        // Horizontal adjustment
        const isLeftAligned = !!this.style.left;
        if (isLeftAligned) {
          this.style.left = `${parseFloat(this.style.left) + parseFloat(style.paddingLeft)}px`;
        } else {
          this.style.right = `${parseFloat(this.style.right) + parseFloat(style.paddingRight)}px`;
        }

        // Vertical adjustment
        const isBottomAligned = !!this.style.bottom;
        if (isBottomAligned) {
          this.style.bottom = `${parseFloat(this.style.bottom) - parseFloat(style.paddingBottom)}px`;
        } else {
          this.style.top = `${parseFloat(this.style.top) - parseFloat(style.paddingTop)}px`;
        }
      }
    }
  };

/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const styles = i`
  :host {
    align-items: flex-start;
    justify-content: flex-start;
  }

  :host([right-aligned]),
  :host([end-aligned]) {
    align-items: flex-end;
  }

  :host([bottom-aligned]) {
    justify-content: flex-end;
  }

  [part='overlay'] {
    background-color: #fff;
  }
`;

/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

registerStyles('vaadin-menu-bar-overlay', styles, { moduleId: 'vaadin-menu-bar-overlay-styles' });

/**
 * An element used internally by `<vaadin-menu-bar>`. Not intended to be used separately.
 *
 * @extends Overlay
 * @mixes MenuOverlayMixin
 * @private
 */
class MenuBarOverlay extends MenuOverlayMixin(Overlay) {
  static get is() {
    return 'vaadin-menu-bar-overlay';
  }
}

customElements.define(MenuBarOverlay.is, MenuBarOverlay);

/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

register({
  name: 'vaadin-contextmenu',
  deps: ['touchstart', 'touchmove', 'touchend', 'contextmenu'],
  flow: {
    start: ['touchstart', 'contextmenu'],
    end: ['contextmenu'],
  },

  emits: ['vaadin-contextmenu'],

  info: {
    sourceEvent: null,
  },

  reset() {
    this.info.sourceEvent = null;
    this._cancelTimer();
    this.info.touchJob = null;
    this.info.touchStartCoords = null;
  },

  _cancelTimer() {
    if (this._timerId) {
      clearTimeout(this._timerId);
      delete this._fired;
    }
  },

  _setSourceEvent(e) {
    this.info.sourceEvent = e;

    const path = e.composedPath();

    // Calling `sourceEvent.composedPath()` after a timeout would return an empty array.
    // This is especially problematic on iOS where we configure the timer on touchstart.
    // Store the composed path to be used by `grid.getEventContext(event)` so it works.
    this.info.sourceEvent.__composedPath = path;
  },

  touchstart(e) {
    this._setSourceEvent(e);

    this.info.touchStartCoords = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };

    // After timeout event is already retargeted to the parent element in case there is one.
    // So we are assigning the target synchronously on event dispatched.
    const t = e.composedPath()[0] || e.target;

    this._timerId = setTimeout(() => {
      const ct = e.changedTouches[0];
      if (!e.shiftKey) {
        if (isIOS) {
          this._fired = true;
          this.fire(t, ct.clientX, ct.clientY);
        }

        // Needed to prevent any 'tap' gesture events from firing
        // which could potentially cancel/close the overlay.
        prevent('tap');
      }
    }, 500); // Default setting for Android and iOS.
  },

  touchmove(e) {
    const moveThreshold = 15;
    const touchStartCoords = this.info.touchStartCoords;
    if (
      Math.abs(touchStartCoords.x - e.changedTouches[0].clientX) > moveThreshold ||
      Math.abs(touchStartCoords.y - e.changedTouches[0].clientY) > moveThreshold
    ) {
      this._cancelTimer();
    }
  },

  touchend(e) {
    if (this._fired) {
      e.preventDefault();
    }
    this._cancelTimer();
  },

  contextmenu(e) {
    if (!e.shiftKey) {
      this._setSourceEvent(e);
      this.fire(e.target, e.clientX, e.clientY);
      prevent('tap');
    }
  },

  fire(target, x, y) {
    // NOTE(web-padawan): the code below is copied from `Polymer.Gestures._fire`,
    // which is not exported from `gestures.js` module for Polymer 3.
    const sourceEvent = this.info.sourceEvent;
    const ev = new Event('vaadin-contextmenu', { bubbles: true, cancelable: true, composed: true });
    ev.detail = { x, y, sourceEvent };
    target.dispatchEvent(ev);
    // Forward `preventDefault` in a clean way
    if (ev.defaultPrevented && sourceEvent && sourceEvent.preventDefault) {
      sourceEvent.preventDefault();
    }
  },
});

/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

registerStyles('vaadin-context-menu-overlay', styles, { moduleId: 'vaadin-context-menu-overlay-styles' });

/**
 * An element used internally by `<vaadin-context-menu>`. Not intended to be used separately.
 *
 * @extends Overlay
 * @mixes MenuOverlayMixin
 * @protected
 */
class ContextMenuOverlay extends MenuOverlayMixin(Overlay) {
  static get is() {
    return 'vaadin-context-menu-overlay';
  }
}

customElements.define(ContextMenuOverlay.is, ContextMenuOverlay);

/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A controller for listening on media query changes.
 */
class MediaQueryController {
  constructor(query, callback) {
    /**
     * The CSS media query to evaluate.
     *
     * @type {string}
     * @protected
     */
    this.query = query;

    /**
     * Function to call when media query changes.
     *
     * @type {Function}
     * @protected
     */
    this.callback = callback;

    this._boundQueryHandler = this._queryHandler.bind(this);
  }

  hostConnected() {
    this._removeListener();

    this._mediaQuery = window.matchMedia(this.query);

    this._addListener();

    this._queryHandler(this._mediaQuery);
  }

  hostDisconnected() {
    this._removeListener();
  }

  /** @private */
  _addListener() {
    if (this._mediaQuery) {
      this._mediaQuery.addListener(this._boundQueryHandler);
    }
  }

  /** @private */
  _removeListener() {
    if (this._mediaQuery) {
      this._mediaQuery.removeListener(this._boundQueryHandler);
    }

    this._mediaQuery = null;
  }

  /** @private */
  _queryHandler(mediaQuery) {
    if (typeof this.callback === 'function') {
      this.callback(mediaQuery.matches);
    }
  }
}

/**
 * @license
 * Copyright (c) 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin that forwards CSS class names to the internal overlay element
 * by setting the `overlayClass` property or `overlay-class` attribute.
 *
 * @polymerMixin
 */
const OverlayClassMixin = (superclass) =>
  class OverlayClassMixinClass extends superclass {
    static get properties() {
      return {
        /**
         * A space-delimited list of CSS class names to set on the overlay element.
         * This property does not affect other CSS class names set manually via JS.
         *
         * Note, if the CSS class name was set with this property, clearing it will
         * remove it from the overlay, even if the same class name was also added
         * manually, e.g. by using `classList.add()` in the `renderer` function.
         *
         * @attr {string} overlay-class
         */
        overlayClass: {
          type: String,
        },

        /**
         * An overlay element on which CSS class names are set.
         *
         * @protected
         */
        _overlayElement: {
          type: Object,
        },
      };
    }

    static get observers() {
      return ['__updateOverlayClassNames(overlayClass, _overlayElement)'];
    }

    /** @private */
    __updateOverlayClassNames(overlayClass, overlayElement) {
      if (!overlayElement) {
        return;
      }

      // Overlay is set but overlayClass is not set
      if (overlayClass === undefined) {
        return;
      }

      const { classList } = overlayElement;

      if (!this.__initialClasses) {
        this.__initialClasses = new Set(classList);
      }

      if (Array.isArray(this.__previousClasses)) {
        // Remove old classes that no longer apply
        const classesToRemove = this.__previousClasses.filter((name) => !this.__initialClasses.has(name));
        if (classesToRemove.length > 0) {
          classList.remove(...classesToRemove);
        }
      }

      // Add new classes based on the overlayClass
      const classesToAdd = typeof overlayClass === 'string' ? overlayClass.split(' ') : [];
      if (classesToAdd.length > 0) {
        classList.add(...classesToAdd);
      }

      this.__previousClasses = classesToAdd;
    }
  };

/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * An element used internally by `<vaadin-context-menu>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes DirMixin
 * @mixes ItemMixin
 * @mixes ThemableMixin
 * @protected
 */
class ContextMenuItem extends ItemMixin(ThemableMixin(DirMixin(PolymerElement))) {
  static get is() {
    return 'vaadin-context-menu-item';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
        }

        :host([hidden]) {
          display: none !important;
        }
      </style>
      <span part="checkmark" aria-hidden="true"></span>
      <div part="content">
        <slot></slot>
      </div>
    `;
  }

  /** @protected */
  ready() {
    super.ready();

    this.setAttribute('role', 'menuitem');
  }
}

customElements.define(ContextMenuItem.is, ContextMenuItem);

/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * An element used internally by `<vaadin-context-menu>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes ControllerMixin
 * @mixes DirMixin
 * @mixes ListMixin
 * @mixes ThemableMixin
 * @protected
 */
class ContextMenuListBox extends ListMixin(ThemableMixin(DirMixin(ControllerMixin(PolymerElement)))) {
  static get is() {
    return 'vaadin-context-menu-list-box';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: flex;
        }

        :host([hidden]) {
          display: none !important;
        }

        [part='items'] {
          height: 100%;
          width: 100%;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
      </style>
      <div part="items">
        <slot></slot>
      </div>
    `;
  }

  static get properties() {
    return {
      // We don't need to define this property since super default is vertical,
      // but we don't want it to be modified, or be shown in the API docs.
      /** @private */
      orientation: {
        readOnly: true,
      },
    };
  }

  /**
   * @return {!HTMLElement}
   * @protected
   * @override
   */
  get _scrollerElement() {
    return this.shadowRoot.querySelector('[part="items"]');
  }

  /** @protected */
  ready() {
    super.ready();

    this.setAttribute('role', 'menu');
  }
}

customElements.define(ContextMenuListBox.is, ContextMenuListBox);

/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
const ItemsMixin = (superClass) =>
  class ItemsMixin extends superClass {
    static get properties() {
      return {
        /**
         * @typedef ContextMenuItem
         * @type {object}
         * @property {string} text - Text to be set as the menu item component's textContent
         * @property {union: string | object} component - The component to represent the item.
         * Either a tagName or an element instance. Defaults to "vaadin-context-menu-item".
         * @property {boolean} disabled - If true, the item is disabled and cannot be selected
         * @property {boolean} checked - If true, the item shows a checkmark next to it
         * @property {union: string | string[]} theme - If set, sets the given theme(s) as an attribute to the menu item component, overriding any theme set on the context menu.
         * @property {MenuItem[]} children - Array of child menu items
         */

        /**
         * Defines a (hierarchical) menu structure for the component.
         * If a menu item has a non-empty `children` set, a sub-menu with the child items is opened
         * next to the parent menu on mouseover, tap or a right arrow keypress.
         *
         * The items API can't be used together with a renderer!
         *
         * #### Example
         *
         * ```javascript
         * contextMenu.items = [
         *   { text: 'Menu Item 1', theme: 'primary', children:
         *     [
         *       { text: 'Menu Item 1-1', checked: true },
         *       { text: 'Menu Item 1-2' }
         *     ]
         *   },
         *   { component: 'hr' },
         *   { text: 'Menu Item 2', children:
         *     [
         *       { text: 'Menu Item 2-1' },
         *       { text: 'Menu Item 2-2', disabled: true }
         *     ]
         *   },
         *   { text: 'Menu Item 3', disabled: true }
         * ];
         * ```
         *
         * @type {!Array<!ContextMenuItem> | undefined}
         *
         *
         * ### Styling
         *
         * The `<vaadin-context-menu-item>` sub-menu elements have the following additional state attributes on top of
         * the built-in `<vaadin-item>` state attributes (see `<vaadin-item>` documentation for full listing).
         *
         * Part name | Attribute | Description
         * ----------------|----------------|----------------
         * `:host` | expanded | Expanded parent item
         */
        items: Array,
      };
    }

    /**
     * Tag name prefix used by overlay, list-box and items.
     * @protected
     * @return {string}
     */
    get _tagNamePrefix() {
      return 'vaadin-context-menu';
    }

    /** @protected */
    ready() {
      super.ready();

      // Overlay's outside click listener doesn't work with modeless
      // overlays (submenus) so we need additional logic for it
      this.__itemsOutsideClickListener = (e) => {
        if (!e.composedPath().some((el) => el.localName === `${this._tagNamePrefix}-overlay`)) {
          this.dispatchEvent(new CustomEvent('items-outside-click'));
        }
      };
      this.addEventListener('items-outside-click', () => this.items && this.close());
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();
      // Firefox leaks click to document on contextmenu even if prevented
      // https://bugzilla.mozilla.org/show_bug.cgi?id=990614
      document.documentElement.addEventListener('click', this.__itemsOutsideClickListener);
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();
      document.documentElement.removeEventListener('click', this.__itemsOutsideClickListener);
    }

    /** @protected */
    __forwardFocus() {
      const overlay = this.$.overlay;
      const child = overlay.getFirstChild();
      // If parent item is not focused, do not focus submenu
      if (overlay.parentOverlay) {
        const parent = overlay.parentOverlay.querySelector('[expanded]');
        if (parent && parent.hasAttribute('focused') && child) {
          child.focus();
        } else {
          overlay.$.overlay.focus();
        }
      } else if (child) {
        child.focus();
      }
    }

    /** @private */
    __openSubMenu(subMenu, itemElement, overlayClass) {
      subMenu.items = itemElement._item.children;
      subMenu.listenOn = itemElement;
      subMenu.overlayClass = overlayClass;

      const parent = this.$.overlay;

      const subMenuOverlay = subMenu.$.overlay;
      subMenuOverlay.positionTarget = itemElement;
      subMenuOverlay.noHorizontalOverlap = true;
      // Store the reference parent overlay
      subMenuOverlay._setParentOverlay(parent);

      // Set theme attribute from parent element
      if (parent.hasAttribute('theme')) {
        subMenu.setAttribute('theme', parent.getAttribute('theme'));
      } else {
        subMenu.removeAttribute('theme');
      }

      const content = subMenu.$.overlay.$.content;
      content.style.minWidth = '';

      itemElement.dispatchEvent(
        new CustomEvent('opensubmenu', {
          detail: {
            children: itemElement._item.children,
          },
        }),
      );
    }

    /**
     * @param {!ContextMenuItem} item
     * @return {HTMLElement}
     * @private
     */
    __createComponent(item) {
      let component;

      if (item.component instanceof HTMLElement) {
        component = item.component;
      } else {
        component = document.createElement(item.component || `${this._tagNamePrefix}-item`);
      }

      // Support menu-bar / context-menu item
      if (component._hasVaadinItemMixin) {
        component.setAttribute('role', 'menuitem');
      }

      if (component.localName === 'hr') {
        component.setAttribute('role', 'separator');
      } else {
        // Accept not `menuitem` elements e.g. `<button>`
        component.setAttribute('aria-haspopup', 'false');
      }

      this._setMenuItemTheme(component, item, this._theme);

      component._item = item;

      if (item.text) {
        component.textContent = item.text;
      }

      this.__toggleMenuComponentAttribute(component, 'menu-item-checked', item.checked);
      this.__toggleMenuComponentAttribute(component, 'disabled', item.disabled);

      if (item.children && item.children.length) {
        this.__updateExpanded(component, false);
        component.setAttribute('aria-haspopup', 'true');
      }

      return component;
    }

    /** @private */
    __initListBox() {
      const listBox = document.createElement(`${this._tagNamePrefix}-list-box`);

      if (this._theme) {
        listBox.setAttribute('theme', this._theme);
      }

      listBox.addEventListener('selected-changed', (event) => {
        const { value } = event.detail;
        if (typeof value === 'number') {
          const item = listBox.items[value]._item;
          if (!item.children) {
            this.dispatchEvent(new CustomEvent('item-selected', { detail: { value: item } }));
          }
          listBox.selected = null;
        }
      });

      return listBox;
    }

    /** @private */
    __initOverlay() {
      const overlay = this.$.overlay;

      overlay.$.backdrop.addEventListener('click', () => {
        this.close();
      });

      // Open a submenu on click event when a touch device is used.
      // On desktop, a submenu opens on hover.
      overlay.addEventListener(isTouch ? 'click' : 'mouseover', (event) => {
        this.__showSubMenu(event);
      });

      overlay.addEventListener('keydown', (event) => {
        const { key } = event;
        const isRTL = this.__isRTL;

        const isArrowRight = key === 'ArrowRight';
        const isArrowLeft = key === 'ArrowLeft';

        if ((!isRTL && isArrowRight) || (isRTL && isArrowLeft) || key === 'Enter' || key === ' ') {
          // Open a sub-menu
          this.__showSubMenu(event);
        } else if ((!isRTL && isArrowLeft) || (isRTL && isArrowRight)) {
          // Close the menu
          this.close();
          this.listenOn.focus();
        } else if (key === 'Escape' || key === 'Tab') {
          // Close all menus
          this.dispatchEvent(new CustomEvent('close-all-menus'));
        }
      });
    }

    /** @private */
    __initSubMenu() {
      const subMenu = document.createElement(this.constructor.is);

      subMenu._modeless = true;
      subMenu.openOn = 'opensubmenu';

      // Sub-menu doesn't have a target to wrap,
      // so there is no need to keep it visible.
      subMenu.setAttribute('hidden', '');

      // Close sub-menu when the parent menu closes.
      this.addEventListener('opened-changed', (event) => {
        if (!event.detail.value) {
          this._subMenu.close();
        }
      });

      // Forward event to the parent menu element.
      subMenu.addEventListener('close-all-menus', () => {
        this.dispatchEvent(new CustomEvent('close-all-menus'));
      });

      // Forward event to the parent menu element.
      subMenu.addEventListener('item-selected', (event) => {
        const { detail } = event;
        this.dispatchEvent(new CustomEvent('item-selected', { detail }));
      });

      // Listen to the forwarded event from sub-menu.
      this.addEventListener('close-all-menus', () => {
        this.close();
      });

      // Listen to the forwarded event from sub-menu.
      this.addEventListener('item-selected', () => {
        this.close();
      });

      // Mark parent item as collapsed when closing.
      subMenu.addEventListener('opened-changed', (event) => {
        if (!event.detail.value) {
          const expandedItem = this._listBox.querySelector('[expanded]');
          if (expandedItem) {
            this.__updateExpanded(expandedItem, false);
          }
        }
      });

      return subMenu;
    }

    /** @private */
    __showSubMenu(event, item = event.composedPath().find((node) => node.localName === `${this._tagNamePrefix}-item`)) {
      // Delay enabling the mouseover listener to avoid it from triggering on parent menu open
      if (!this.__openListenerActive) {
        return;
      }

      // Don't open sub-menus while the menu is still opening
      if (this.$.overlay.hasAttribute('opening')) {
        requestAnimationFrame(() => {
          this.__showSubMenu(event, item);
        });

        return;
      }

      const subMenu = this._subMenu;

      if (item) {
        const { children } = item._item;

        if (subMenu.items !== children) {
          subMenu.close();
        }
        if (!this.opened) {
          return;
        }

        if (children && children.length) {
          this.__updateExpanded(item, true);

          // Forward parent overlay class
          const { overlayClass } = this;
          this.__openSubMenu(subMenu, item, overlayClass);
        } else {
          subMenu.listenOn.focus();
        }
      }
    }

    /**
     * @param {!HTMLElement} root
     * @param {!ContextMenu} menu
     * @param {!ContextMenuRendererContext} context
     * @protected
     */
    __itemsRenderer(root, menu, { detail }) {
      this.__initMenu(root, menu);

      const subMenu = root.querySelector(this.constructor.is);
      subMenu.closeOn = menu.closeOn;

      const listBox = root.querySelector(`${this._tagNamePrefix}-list-box`);
      listBox.innerHTML = '';

      [...(detail.children || menu.items)].forEach((item) => {
        const component = this.__createComponent(item);
        listBox.appendChild(component);
      });
    }

    /** @protected */
    _setMenuItemTheme(component, item, hostTheme) {
      // Use existing component theme when it is provided
      let theme = component.getAttribute('theme') || hostTheme;

      // Item theme takes precedence over host theme / component theme
      // even if it's empty, as long as it's not undefined or null
      if (item.theme != null) {
        theme = Array.isArray(item.theme) ? item.theme.join(' ') : item.theme;
      }

      this.__updateTheme(component, theme);
    }

    /** @private */
    __toggleMenuComponentAttribute(component, attribute, on) {
      if (on) {
        component.setAttribute(attribute, '');
        component[`__has-${attribute}`] = true;
      } else if (component[`__has-${attribute}`]) {
        component.removeAttribute(attribute);
        component[`__has-${attribute}`] = false;
      }
    }

    /** @private */
    __initMenu(root, menu) {
      // NOTE: in this method, `menu` and `this` reference the same element,
      // so we can use either of those. Original implementation used `menu`.
      if (!root.firstElementChild) {
        this.__initOverlay();

        const listBox = this.__initListBox();
        this._listBox = listBox;
        root.appendChild(listBox);

        const subMenu = this.__initSubMenu();
        this._subMenu = subMenu;
        root.appendChild(subMenu);

        requestAnimationFrame(() => {
          this.__openListenerActive = true;
        });
      } else {
        this.__updateTheme(this._listBox, this._theme);
      }
    }

    /** @private */
    __updateExpanded(component, expanded) {
      component.setAttribute('aria-expanded', expanded.toString());
      component.toggleAttribute('expanded', expanded);
    }

    /** @private */
    __updateTheme(component, theme) {
      if (theme) {
        component.setAttribute('theme', theme);
      } else {
        component.removeAttribute('theme');
      }
    }
  };

/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * `<vaadin-context-menu>` is a Web Component for creating context menus.
 *
 * ### Items
 *
 * Items is a higher level convenience API for defining a (hierarchical) menu structure for the component.
 * If a menu item has a non-empty `children` set, a sub-menu with the child items is opened
 * next to the parent menu on mouseover, tap or a right arrow keypress.
 *
 * When an item is selected, `<vaadin-context-menu>` dispatches an "item-selected" event
 * with the selected item as `event.detail.value` property.
 *
 * ```javascript
 * contextMenu.items = [
 *   { text: 'Menu Item 1', theme: 'primary', children:
 *     [
 *       { text: 'Menu Item 1-1', checked: true },
 *       { text: 'Menu Item 1-2' }
 *     ]
 *   },
 *   { component: 'hr' },
 *   { text: 'Menu Item 2', children:
 *     [
 *       { text: 'Menu Item 2-1' },
 *       { text: 'Menu Item 2-2', disabled: true }
 *     ]
 *   },
 *   { text: 'Menu Item 3', disabled: true }
 * ];
 *
 * contextMenu.addEventListener('item-selected', e => {
 *   const item = e.detail.value;
 *   console.log(`${item.text} selected`);
 * });
 * ```
 *
 * **NOTE:** when the `items` array is defined, the renderer cannot be used.
 *
 * ### Rendering
 *
 * The content of the menu can be populated by using the renderer callback function.
 *
 * The renderer function provides `root`, `contextMenu`, `model` arguments when applicable.
 * Generate DOM content by using `model` object properties if needed, append it to the `root`
 * element and control the state of the host element by accessing `contextMenu`. Before generating
 * new content, the renderer function should check if there is already content in `root` for reusing it.
 *
 * ```html
 * <vaadin-context-menu id="contextMenu">
 *  <p>This paragraph has a context menu.</p>
 * </vaadin-context-menu>
 * ```
 * ```js
 * const contextMenu = document.querySelector('#contextMenu');
 * contextMenu.renderer = (root, contextMenu, context) => {
 *   let listBox = root.firstElementChild;
 *   if (!listBox) {
 *     listBox = document.createElement('vaadin-list-box');
 *     root.appendChild(listBox);
 *   }
 *
 *   let item = listBox.querySelector('vaadin-item');
 *   if (!item) {
 *     item = document.createElement('vaadin-item');
 *     listBox.appendChild(item);
 *   }
 *   item.textContent = 'Content of the selector: ' + context.target.textContent;
 * };
 * ```
 *
 * You can access the menu context inside the renderer using
 * `context.target` and `context.detail`.
 *
 * Renderer is called on the opening of the context-menu and each time the related context is updated.
 * DOM generated during the renderer call can be reused
 * in the next renderer call and will be provided with the `root` argument.
 * On first call it will be empty.
 *
 * ### `vaadin-contextmenu` Gesture Event
 *
 * `vaadin-contextmenu` is a gesture event (a custom event),
 * which is dispatched after either `contextmenu` or long touch events.
 * This enables support for both mouse and touch environments in a uniform way.
 *
 * `<vaadin-context-menu>` opens the menu overlay on the `vaadin-contextmenu`
 * event by default.
 *
 * ### Menu Listener
 *
 * By default, the `<vaadin-context-menu>` element listens for the menu opening
 * event on itself. In case if you do not want to wrap the target, you can listen for
 * events on an element outside the `<vaadin-context-menu>` by setting the
 * `listenOn` property:
 *
 * ```html
 * <vaadin-context-menu id="contextMenu"></vaadin-context-menu>
 *
 * <div id="menuListener">The element that listens for the contextmenu event.</div>
 * ```
 * ```javascript
 * const contextMenu = document.querySelector('#contextMenu');
 * contextMenu.listenOn = document.querySelector('#menuListener');
 * ```
 *
 * ### Filtering Menu Targets
 *
 * By default, the listener element and all its descendants open the context
 * menu. You can filter the menu targets to a smaller set of elements inside
 * the listener element by setting the `selector` property.
 *
 * In the following example, only the elements matching `.has-menu` will open the context menu:
 *
 * ```html
 * <vaadin-context-menu selector=".has-menu">
 *   <p class="has-menu">This paragraph opens the context menu</p>
 *   <p>This paragraph does not open the context menu</p>
 * </vaadin-context-menu>
 * ```
 *
 * ### Menu Context
 *
 * The following properties are available in the `context` argument:
 *
 * - `target` is the menu opening event target, which is the element that
 * the user has called the context menu for
 * - `detail` is the menu opening event detail
 *
 * In the following example, the menu item text is composed with the contents
 * of the element that opened the menu:
 *
 * ```html
 * <vaadin-context-menu selector="li" id="contextMenu">
 *   <ul>
 *     <li>Foo</li>
 *     <li>Bar</li>
 *     <li>Baz</li>
 *   </ul>
 * </vaadin-context-menu>
 * ```
 * ```js
 * const contextMenu = document.querySelector('#contextMenu');
 * contextMenu.renderer = (root, contextMenu, context) => {
 *   let listBox = root.firstElementChild;
 *   if (!listBox) {
 *     listBox = document.createElement('vaadin-list-box');
 *     root.appendChild(listBox);
 *   }
 *
 *   let item = listBox.querySelector('vaadin-item');
 *   if (!item) {
 *     item = document.createElement('vaadin-item');
 *     listBox.appendChild(item);
 *   }
 *   item.textContent = 'The menu target: ' + context.target.textContent;
 * };
 * ```
 *
 * ### Styling
 *
 * `<vaadin-context-menu>` uses `<vaadin-context-menu-overlay>` internal
 * themable component as the actual visible context menu overlay.
 *
 * See [`<vaadin-overlay>`](#/elements/vaadin-overlay)
 * documentation for `<vaadin-context-menu-overlay>` stylable parts.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
 * ### Internal components
 *
 * When using `items` API, in addition `<vaadin-context-menu-overlay>`, the following
 * internal components are themable:
 *
 * - `<vaadin-context-menu-item>` - has the same API as [`<vaadin-item>`](#/elements/vaadin-item).
 * - `<vaadin-context-menu-list-box>` - has the same API as [`<vaadin-list-box>`](#/elements/vaadin-list-box).
 *
 * Note: the `theme` attribute value set on `<vaadin-context-menu>` is
 * propagated to the internal components listed above.
 *
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} item-selected - Fired when an item is selected when the context menu is populated using the `items` API.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ControllerMixin
 * @mixes OverlayClassMixin
 * @mixes ThemePropertyMixin
 * @mixes ItemsMixin
 */
class ContextMenu extends OverlayClassMixin(
  ControllerMixin(ElementMixin(ThemePropertyMixin(ItemsMixin(PolymerElement)))),
) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none !important;
        }
      </style>

      <slot id="slot"></slot>

      <vaadin-context-menu-overlay
        id="overlay"
        on-opened-changed="_onOverlayOpened"
        on-vaadin-overlay-open="_onVaadinOverlayOpen"
        modeless="[[_modeless]]"
        with-backdrop="[[_phone]]"
        phone$="[[_phone]]"
        model="[[_context]]"
        theme$="[[_theme]]"
      ></vaadin-context-menu-overlay>
    `;
  }

  static get is() {
    return 'vaadin-context-menu';
  }

  static get properties() {
    return {
      /**
       * CSS selector that can be used to target any child element
       * of the context menu to listen for `openOn` events.
       */
      selector: {
        type: String,
      },

      /**
       * True if the overlay is currently displayed.
       * @type {boolean}
       */
      opened: {
        type: Boolean,
        value: false,
        notify: true,
        readOnly: true,
      },

      /**
       * Event name to listen for opening the context menu.
       * @attr {string} open-on
       * @type {string}
       */
      openOn: {
        type: String,
        value: 'vaadin-contextmenu',
      },

      /**
       * The target element that's listened to for context menu opening events.
       * By default the vaadin-context-menu listens to the target's `vaadin-contextmenu`
       * events.
       * @type {!HTMLElement}
       * @default self
       */
      listenOn: {
        type: Object,
        value() {
          return this;
        },
      },

      /**
       * Event name to listen for closing the context menu.
       * @attr {string} close-on
       * @type {string}
       */
      closeOn: {
        type: String,
        value: 'click',
        observer: '_closeOnChanged',
      },

      /**
       * Custom function for rendering the content of the menu overlay.
       * Receives three arguments:
       *
       * - `root` The root container DOM element. Append your content to it.
       * - `contextMenu` The reference to the `<vaadin-context-menu>` element.
       * - `context` The object with the menu context, contains:
       *   - `context.target`  the target of the menu opening event,
       *   - `context.detail` the menu opening event detail.
       * @type {ContextMenuRenderer | undefined}
       */
      renderer: {
        type: Function,
      },

      /**
       * When true, the menu overlay is modeless.
       * @protected
       */
      _modeless: {
        type: Boolean,
      },

      /** @private */
      _context: Object,

      /** @private */
      _phone: {
        type: Boolean,
      },

      /** @private */
      _touch: {
        type: Boolean,
        value: isTouch,
      },

      /** @private */
      _wide: {
        type: Boolean,
      },

      /** @private */
      _wideMediaQuery: {
        type: String,
        value: '(min-device-width: 750px)',
      },
    };
  }

  static get observers() {
    return [
      '_openedChanged(opened)',
      '_targetOrOpenOnChanged(listenOn, openOn)',
      '_rendererChanged(renderer, items)',
      '_touchOrWideChanged(_touch, _wide)',
    ];
  }

  constructor() {
    super();
    this._boundOpen = this.open.bind(this);
    this._boundClose = this.close.bind(this);
    this._boundPreventDefault = this._preventDefault.bind(this);
    this._boundOnGlobalContextMenu = this._onGlobalContextMenu.bind(this);
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    this.__boundOnScroll = this.__onScroll.bind(this);
    window.addEventListener('scroll', this.__boundOnScroll, true);
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();

    window.removeEventListener('scroll', this.__boundOnScroll, true);
    this.close();
  }

  /** @protected */
  ready() {
    super.ready();

    this._overlayElement = this.$.overlay;

    this.addController(
      new MediaQueryController(this._wideMediaQuery, (matches) => {
        this._wide = matches;
      }),
    );

    processTemplates(this);
  }

  /**
   * Runs before overlay is fully rendered
   * @private
   */
  _onOverlayOpened(e) {
    this._setOpened(e.detail.value);
    this.__alignOverlayPosition();
  }

  /**
   * Runs after overlay is fully rendered
   * @private
   */
  _onVaadinOverlayOpen() {
    this.__alignOverlayPosition();
    this.$.overlay.style.opacity = '';
    this.__forwardFocus();
  }

  /** @private */
  _targetOrOpenOnChanged(listenOn, openOn) {
    if (this._oldListenOn && this._oldOpenOn) {
      this._unlisten(this._oldListenOn, this._oldOpenOn, this._boundOpen);

      this._oldListenOn.style.webkitTouchCallout = '';
      this._oldListenOn.style.webkitUserSelect = '';
      this._oldListenOn.style.userSelect = '';

      this._oldListenOn = null;
      this._oldOpenOn = null;
    }

    if (listenOn && openOn) {
      this._listen(listenOn, openOn, this._boundOpen);

      this._oldListenOn = listenOn;
      this._oldOpenOn = openOn;
    }
  }

  /** @private */
  _touchOrWideChanged(touch, wide) {
    this._phone = !wide && touch;
  }

  /** @private */
  _setListenOnUserSelect(value) {
    // Note: these styles don't seem to work in Firefox on iOS.
    this.listenOn.style.webkitTouchCallout = value;
    this.listenOn.style.webkitUserSelect = value; // Chrome, Safari, Firefox
    this.listenOn.style.userSelect = value;

    // Note: because user-selection is disabled on the overlay
    // before opening the menu the text could be already selected
    // so we need to clear that selection
    document.getSelection().removeAllRanges();
  }

  /** @private */
  _closeOnChanged(closeOn, oldCloseOn) {
    // Outside click event from overlay
    const evtOverlay = 'vaadin-overlay-outside-click';

    const overlay = this.$.overlay;

    if (oldCloseOn) {
      this._unlisten(overlay, oldCloseOn, this._boundClose);
    }
    if (closeOn) {
      this._listen(overlay, closeOn, this._boundClose);
      overlay.removeEventListener(evtOverlay, this._boundPreventDefault);
    } else {
      overlay.addEventListener(evtOverlay, this._boundPreventDefault);
    }
  }

  /** @private */
  _preventDefault(e) {
    e.preventDefault();
  }

  /** @private */
  _openedChanged(opened) {
    if (opened) {
      document.documentElement.addEventListener('contextmenu', this._boundOnGlobalContextMenu, true);
      this._setListenOnUserSelect('none');
    } else {
      document.documentElement.removeEventListener('contextmenu', this._boundOnGlobalContextMenu, true);
      this._setListenOnUserSelect('');
    }

    // Has to be set after instance has been created
    this.$.overlay.opened = opened;
  }

  /**
   * Requests an update for the content of the menu overlay.
   * While performing the update, it invokes the renderer passed in the `renderer` property.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate() {
    if (!this._overlayElement || !this.renderer) {
      return;
    }

    this._overlayElement.requestContentUpdate();
  }

  /** @private */
  _rendererChanged(renderer, items) {
    if (items) {
      if (renderer) {
        throw new Error('The items API cannot be used together with a renderer');
      }

      if (this.closeOn === 'click') {
        this.closeOn = '';
      }

      renderer = this.__itemsRenderer;
    }

    this.$.overlay.setProperties({ owner: this, renderer });
  }

  /**
   * Closes the overlay.
   */
  close() {
    this._setOpened(false);
  }

  /** @private */
  _contextTarget(e) {
    if (this.selector) {
      const targets = this.listenOn.querySelectorAll(this.selector);

      return Array.prototype.filter.call(targets, (el) => {
        return e.composedPath().indexOf(el) > -1;
      })[0];
    }
    return e.target;
  }

  /**
   * Opens the overlay.
   * @param {!Event | undefined} e used as the context for the menu. Overlay coordinates are taken from this event.
   */
  open(e) {
    if (e && !this.opened) {
      this._context = {
        detail: e.detail,
        target: this._contextTarget(e),
      };

      if (this._context.target) {
        e.preventDefault();
        e.stopPropagation();

        // Used in alignment which is delayed until overlay is rendered
        this.__x = this._getEventCoordinate(e, 'x');
        this.__pageXOffset = window.pageXOffset;

        this.__y = this._getEventCoordinate(e, 'y');
        this.__pageYOffset = window.pageYOffset;

        this.$.overlay.style.opacity = '0';
        this._setOpened(true);
      }
    }
  }

  /** @private */
  __onScroll() {
    if (!this.opened) {
      return;
    }

    const yDiff = window.pageYOffset - this.__pageYOffset;
    const xDiff = window.pageXOffset - this.__pageXOffset;

    this.__adjustPosition('left', -xDiff);
    this.__adjustPosition('right', xDiff);

    this.__adjustPosition('top', -yDiff);
    this.__adjustPosition('bottom', yDiff);

    this.__pageYOffset += yDiff;
    this.__pageXOffset += xDiff;
  }

  /** @private */
  __adjustPosition(coord, diff) {
    const overlay = this.$.overlay;
    const style = overlay.style;

    style[coord] = `${(parseInt(style[coord]) || 0) + diff}px`;
  }

  /** @private */
  __alignOverlayPosition() {
    const overlay = this.$.overlay;

    if (overlay.positionTarget) {
      // The overlay is positioned relative to another node, for example, a
      // menu item in a nested submenu structure where this overlay lists
      // the items for another submenu.
      // It means that the overlay positioning is controlled by
      // vaadin-overlay-position-mixin so no manual alignment is needed.
      return;
    }

    const style = overlay.style;

    // Reset all properties before measuring
    ['top', 'right', 'bottom', 'left'].forEach((prop) => style.removeProperty(prop));
    ['right-aligned', 'end-aligned', 'bottom-aligned'].forEach((attr) => overlay.removeAttribute(attr));

    // Maximum x and y values are imposed by content size and overlay limits.
    const { xMax, xMin, yMax } = overlay.getBoundaries();
    // Reuse saved x and y event values, in order to this method be used async
    // in the `vaadin-overlay-change` which guarantees that overlay is ready.
    // The valus represent an anchor position on the page where the contextmenu
    // event took place.
    const x = this.__x;
    const y = this.__y;

    // Select one overlay corner and move to the event x/y position.
    // Then set styling attrs for flex-aligning the content appropriately.
    const wdthVport = document.documentElement.clientWidth;
    const hghtVport = document.documentElement.clientHeight;

    if (!this.__isRTL) {
      if (x < wdthVport / 2 || x < xMax) {
        // Menu is displayed in the right side of the anchor
        style.left = `${x}px`;
      } else {
        // Menu is displayed in the left side of the anchor
        style.right = `${Math.max(0, wdthVport - x)}px`;
        this._setEndAligned(overlay);
      }
    } else if (x > wdthVport / 2 || x > xMin) {
      // Menu is displayed in the right side of the anchor
      style.right = `${Math.max(0, wdthVport - x)}px`;
    } else {
      // Menu is displayed in the left side of the anchor
      style.left = `${x}px`;
      this._setEndAligned(overlay);
    }

    if (y < hghtVport / 2 || y < yMax) {
      style.top = `${y}px`;
    } else {
      style.bottom = `${Math.max(0, hghtVport - y)}px`;
      overlay.setAttribute('bottom-aligned', '');
    }
  }

  /** @private */
  _setEndAligned(element) {
    element.setAttribute('end-aligned', '');
    if (!this.__isRTL) {
      element.setAttribute('right-aligned', '');
    }
  }

  /** @private */
  _getEventCoordinate(event, coord) {
    if (event.detail instanceof Object) {
      if (event.detail[coord]) {
        // Polymer gesture events, get coordinate from detail
        return event.detail[coord];
      } else if (event.detail.sourceEvent) {
        // Unwrap detailed event
        return this._getEventCoordinate(event.detail.sourceEvent, coord);
      }
    } else {
      const prop = `client${coord.toUpperCase()}`;
      const position = event.changedTouches ? event.changedTouches[0][prop] : event[prop];

      if (position === 0) {
        // Native keyboard event
        const rect = event.target.getBoundingClientRect();
        return coord === 'x' ? rect.left : rect.top + rect.height;
      }
      // Native mouse or touch event
      return position;
    }
  }

  /** @private */
  _listen(node, evType, handler) {
    if (gestures[evType]) {
      addListener(node, evType, handler);
    } else {
      node.addEventListener(evType, handler);
    }
  }

  /** @private */
  _unlisten(node, evType, handler) {
    if (gestures[evType]) {
      removeListener(node, evType, handler);
    } else {
      node.removeEventListener(evType, handler);
    }
  }

  /** @private */
  _onGlobalContextMenu(e) {
    if (!e.shiftKey) {
      e.preventDefault();
      this.close();
    }
  }

  /**
   * Fired when an item is selected when the context menu is populated using the `items` API.
   *
   * @event item-selected
   * @param {Object} detail
   * @param {Object} detail.value the selected menu item
   */
}

customElements.define(ContextMenu.is, ContextMenu);

/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * An element used internally by `<vaadin-menu-bar>`. Not intended to be used separately.
 *
 * @extends ContextMenu
 * @protected
 */
class MenuBarSubmenu extends ContextMenu {
  static get is() {
    return 'vaadin-menu-bar-submenu';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none !important;
        }
      </style>

      <slot id="slot"></slot>

      <vaadin-menu-bar-overlay
        id="overlay"
        on-opened-changed="_onOverlayOpened"
        on-vaadin-overlay-open="_onVaadinOverlayOpen"
        modeless="[[_modeless]]"
        with-backdrop="[[_phone]]"
        phone$="[[_phone]]"
        model="[[_context]]"
        theme$="[[_theme]]"
      ></vaadin-menu-bar-overlay>
    `;
  }

  constructor() {
    super();

    this.openOn = 'opensubmenu';
  }

  /**
   * Tag name prefix used by overlay, list-box and items.
   * @protected
   * @return {string}
   */
  get _tagNamePrefix() {
    return 'vaadin-menu-bar';
  }

  /**
   * Overriding the observer to not add global "contextmenu" listener.
   */
  _openedChanged(opened) {
    this.$.overlay.opened = opened;
  }

  /**
   * Overriding the public method to reset expanded button state.
   */
  close() {
    super.close();

    // Only handle 1st level submenu
    if (this.hasAttribute('is-root')) {
      this.getRootNode().host._close();
    }
  }
}

customElements.define(MenuBarSubmenu.is, MenuBarSubmenu);

/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const observer = new ResizeObserver((entries) => {
  setTimeout(() => {
    entries.forEach((entry) => {
      // Notify child resizables, if any
      if (entry.target.resizables) {
        entry.target.resizables.forEach((resizable) => {
          resizable._onResize(entry.contentRect);
        });
      } else {
        entry.target._onResize(entry.contentRect);
      }
    });
  });
});

/**
 * A mixin that uses a ResizeObserver to listen to host size changes.
 *
 * @polymerMixin
 */
const ResizeMixin = dedupingMixin(
  (superclass) =>
    class ResizeMixinClass extends superclass {
      /**
       * When true, the parent element resize will be also observed.
       * Override this getter and return `true` to enable this.
       *
       * @protected
       */
      get _observeParent() {
        return false;
      }

      /** @protected */
      connectedCallback() {
        super.connectedCallback();
        observer.observe(this);

        if (this._observeParent) {
          const parent = this.parentNode instanceof ShadowRoot ? this.parentNode.host : this.parentNode;

          if (!parent.resizables) {
            parent.resizables = new Set();
            observer.observe(parent);
          }

          parent.resizables.add(this);
          this.__parent = parent;
        }
      }

      /** @protected */
      disconnectedCallback() {
        super.disconnectedCallback();
        observer.unobserve(this);

        const parent = this.__parent;
        if (this._observeParent && parent) {
          const resizables = parent.resizables;

          if (resizables) {
            resizables.delete(this);

            if (resizables.size === 0) {
              observer.unobserve(parent);
            }
          }

          this.__parent = null;
        }
      }

      /**
       * A handler invoked on host resize. By default, it does nothing.
       * Override the method to implement your own behavior.
       *
       * @protected
       */
      _onResize(_contentRect) {
        // To be implemented.
      }
    },
);

/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 * @mixes ControllerMixin
 * @mixes FocusMixin
 * @mixes KeyboardDirectionMixin
 * @mixes ResizeMixin
 */
const MenuBarMixin = (superClass) =>
  class MenuBarMixinClass extends KeyboardDirectionMixin(ResizeMixin(FocusMixin(ControllerMixin(superClass)))) {
    static get properties() {
      return {
        /**
         * If true, the submenu will open on hover (mouseover) instead of click.
         * @attr {boolean} open-on-hover
         */
        openOnHover: {
          type: Boolean,
        },

        /**
         * @type {boolean}
         * @protected
         */
        _hasOverflow: {
          type: Boolean,
          value: false,
        },

        /** @protected */
        _overflow: {
          type: Object,
        },

        /** @protected */
        _container: {
          type: Object,
        },
      };
    }

    static get observers() {
      return [
        '_itemsChanged(items, items.splices)',
        '__hasOverflowChanged(_hasOverflow, _overflow)',
        '__i18nChanged(i18n, _overflow)',
        '_menuItemsChanged(items, _overflow, _container, items.splices)',
      ];
    }

    constructor() {
      super();
      this.__boundOnContextMenuKeydown = this.__onContextMenuKeydown.bind(this);
    }

    /**
     * Override getter from `KeyboardDirectionMixin`
     * to use expanded button for arrow navigation
     * when the sub-menu is opened and has focus.
     *
     * @return {Element | null}
     * @protected
     * @override
     */
    get focused() {
      return (this._getItems() || []).find(isElementFocused) || this._expandedButton;
    }

    /**
     * Override getter from `KeyboardDirectionMixin`.
     *
     * @return {boolean}
     * @protected
     * @override
     */
    get _vertical() {
      return false;
    }

    /**
     * Override getter from `ResizeMixin` to observe parent.
     *
     * @protected
     * @override
     */
    get _observeParent() {
      return true;
    }

    /**
     * @return {!Array<!HTMLElement>}
     * @protected
     */
    get _buttons() {
      return Array.from(this.querySelectorAll('vaadin-menu-bar-button'));
    }

    /** @private */
    get _subMenu() {
      return this.shadowRoot.querySelector('vaadin-menu-bar-submenu');
    }

    /** @protected */
    ready() {
      super.ready();

      this.setAttribute('role', 'menubar');

      this._overflowController = new SlotController(this, 'overflow', 'vaadin-menu-bar-button', {
        initializer: (btn) => {
          btn.setAttribute('hidden', '');

          const dots = document.createElement('div');
          dots.setAttribute('aria-hidden', 'true');
          dots.innerHTML = '&centerdot;'.repeat(3);
          btn.appendChild(dots);

          this._overflow = btn;
          this._initButtonAttrs(btn);
        },
      });
      this.addController(this._overflowController);

      this.addEventListener('mousedown', () => this._hideTooltip());
      this.addEventListener('mouseleave', () => this._hideTooltip());

      this._subMenu.addEventListener('item-selected', this.__onItemSelected.bind(this));
      this._subMenu.addEventListener('close-all-menus', this.__onEscapeClose.bind(this));

      const overlay = this._subMenu.$.overlay;
      overlay.addEventListener('keydown', this.__boundOnContextMenuKeydown);

      const container = this.shadowRoot.querySelector('[part="container"]');
      container.addEventListener('click', this.__onButtonClick.bind(this));
      container.addEventListener('mouseover', (e) => this._onMouseOver(e));

      this._container = container;
    }

    /**
     * Override method inherited from `KeyboardDirectionMixin`
     * to use the list of menu-bar buttons as items.
     *
     * @return {Element[]}
     * @protected
     * @override
     */
    _getItems() {
      return this._buttons;
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();
      this._hideTooltip(true);
    }

    /**
     * Implement callback from `ResizeMixin` to update buttons
     * and detect whether to show or hide the overflow button.
     *
     * @protected
     * @override
     */
    _onResize() {
      this.__detectOverflow();
    }

    /** @private */
    __hasOverflowChanged(hasOverflow, overflow) {
      if (overflow) {
        overflow.toggleAttribute('hidden', !hasOverflow);
      }
    }

    /** @private */
    _menuItemsChanged(items, overflow, container) {
      if (!overflow || !container) {
        return;
      }

      if (items !== this._oldItems) {
        this._oldItems = items;
        this.__renderButtons(items);
      }
    }

    /** @private */
    __i18nChanged(i18n, overflow) {
      if (overflow && i18n && i18n.moreOptions !== undefined) {
        if (i18n.moreOptions) {
          overflow.setAttribute('aria-label', i18n.moreOptions);
        } else {
          overflow.removeAttribute('aria-label');
        }
      }
    }

    /** @private */
    __getOverflowCount(overflow) {
      // We can't use optional chaining due to webpack 4
      return (overflow.item && overflow.item.children && overflow.item.children.length) || 0;
    }

    /** @private */
    __restoreButtons(buttons) {
      buttons.forEach((button) => {
        button.disabled = (button.item && button.item.disabled) || this.disabled;
        button.style.visibility = '';
        button.style.position = '';

        // Teleport item component back from "overflow" sub-menu
        const item = button.item && button.item.component;
        if (item instanceof HTMLElement && item.getAttribute('role') === 'menuitem') {
          this.__restoreItem(button, item);
        }
      });
      this.__updateOverflow([]);
    }

    /** @private */
    __restoreItem(button, item) {
      button.appendChild(item);
      item.removeAttribute('role');
      item.removeAttribute('aria-expanded');
      item.removeAttribute('aria-haspopup');
      item.removeAttribute('tabindex');
    }

    /** @private */
    __updateOverflow(items) {
      this._overflow.item = { children: items };
      this._hasOverflow = items.length > 0;
    }

    /** @private */
    __setOverflowItems(buttons, overflow) {
      const container = this._container;

      if (container.offsetWidth < container.scrollWidth) {
        this._hasOverflow = true;

        const isRTL = this.__isRTL;

        let i;
        for (i = buttons.length; i > 0; i--) {
          const btn = buttons[i - 1];
          const btnStyle = getComputedStyle(btn);

          // If this button isn't overflowing, then the rest aren't either
          if (
            (!isRTL && btn.offsetLeft + btn.offsetWidth < container.offsetWidth - overflow.offsetWidth) ||
            (isRTL && btn.offsetLeft >= overflow.offsetWidth)
          ) {
            break;
          }

          btn.disabled = true;
          btn.style.visibility = 'hidden';
          btn.style.position = 'absolute';
          // Save width for buttons with component
          btn.style.width = btnStyle.width;
        }
        const items = buttons.filter((_, idx) => idx >= i).map((b) => b.item);
        this.__updateOverflow(items);
      }
    }

    /** @private */
    __detectOverflow() {
      const overflow = this._overflow;
      const buttons = this._buttons.filter((btn) => btn !== overflow);
      const oldOverflowCount = this.__getOverflowCount(overflow);

      // Reset all buttons in the menu bar and the overflow button
      this.__restoreButtons(buttons);

      // Hide any overflowing buttons and put them in the 'overflow' button
      this.__setOverflowItems(buttons, overflow);

      const newOverflowCount = this.__getOverflowCount(overflow);
      if (oldOverflowCount !== newOverflowCount && this._subMenu.opened) {
        this._subMenu.close();
      }

      const isSingleButton = newOverflowCount === buttons.length || (newOverflowCount === 0 && buttons.length === 1);
      this.toggleAttribute('has-single-button', isSingleButton);
    }

    /** @protected */
    _removeButtons() {
      this._buttons.forEach((button) => {
        if (button !== this._overflow) {
          this.removeChild(button);
        }
      });
    }

    /** @protected */
    _initButton(item) {
      const button = document.createElement('vaadin-menu-bar-button');

      const itemCopy = { ...item };
      button.item = itemCopy;

      if (item.component) {
        const component = this.__getComponent(itemCopy);
        itemCopy.component = component;
        // Save item for overflow menu
        component.item = itemCopy;
        button.appendChild(component);
      } else if (item.text) {
        button.textContent = item.text;
      }

      return button;
    }

    /** @protected */
    _initButtonAttrs(button) {
      button.setAttribute('role', 'menuitem');

      if (button === this._overflow || (button.item && button.item.children)) {
        button.setAttribute('aria-haspopup', 'true');
        button.setAttribute('aria-expanded', 'false');
      }
    }

    /** @protected */
    _setButtonDisabled(button, disabled) {
      button.disabled = disabled;
      button.setAttribute('tabindex', disabled ? '-1' : '0');
    }

    /** @protected */
    _setButtonTheme(btn, hostTheme) {
      let theme = hostTheme;

      // Item theme takes precedence over host theme even if it's empty, as long as it's not undefined or null
      const itemTheme = btn.item && btn.item.theme;
      if (itemTheme != null) {
        theme = Array.isArray(itemTheme) ? itemTheme.join(' ') : itemTheme;
      }

      if (theme) {
        btn.setAttribute('theme', theme);
      } else {
        btn.removeAttribute('theme');
      }
    }

    /** @private */
    __getComponent(item) {
      const itemComponent = item.component;
      let component;

      const isElement = itemComponent instanceof HTMLElement;
      // Use existing item component, if any
      if (isElement && itemComponent.localName === 'vaadin-menu-bar-item') {
        component = itemComponent;
      } else {
        component = document.createElement('vaadin-menu-bar-item');
        component.appendChild(isElement ? itemComponent : document.createElement(itemComponent));
      }
      if (item.text) {
        const node = component.firstChild || component;
        node.textContent = item.text;
      }
      return component;
    }

    /** @private */
    __renderButtons(items = []) {
      this._removeButtons();

      /* Empty array, do nothing */
      if (items.length === 0) {
        return;
      }

      items.forEach((item) => {
        const button = this._initButton(item);
        this.insertBefore(button, this._overflow);
        this._setButtonDisabled(button, item.disabled);
        this._initButtonAttrs(button);
        this._setButtonTheme(button, this._theme);
      });

      this.__detectOverflow();
    }

    /**
     * @param {HTMLElement} button
     * @protected
     */
    _showTooltip(button, isHover) {
      // Check if there is a slotted vaadin-tooltip element.
      const tooltip = this._tooltipController.node;
      if (tooltip && tooltip.isConnected) {
        // If the tooltip element doesn't have a generator assigned, use a default one
        // that reads the `tooltip` property of an item.
        if (tooltip.generator === undefined) {
          tooltip.generator = ({ item }) => item && item.tooltip;
        }

        if (!this._subMenu.opened) {
          this._tooltipController.setTarget(button);
          this._tooltipController.setContext({ item: button.item });

          // Trigger opening using the corresponding delay.
          tooltip._stateController.open({
            hover: isHover,
            focus: !isHover,
          });
        }
      }
    }

    /** @protected */
    _hideTooltip(immediate) {
      const tooltip = this._tooltipController && this._tooltipController.node;
      if (tooltip) {
        tooltip._stateController.close(immediate);
      }
    }

    /** @protected */
    _setExpanded(button, expanded) {
      button.toggleAttribute('expanded', expanded);
      button.toggleAttribute('active', expanded);
      button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    }

    /** @protected */
    _setTabindex(button, focused) {
      button.setAttribute('tabindex', focused ? '0' : '-1');
    }

    /**
     * Override method inherited from `KeyboardDirectionMixin`
     * to close the submenu for the previously focused button
     * and open another one for the newly focused button.
     *
     * @param {Element} item
     * @param {boolean} navigating
     * @protected
     * @override
     */
    _focusItem(item, navigating) {
      const wasExpanded = navigating && this.focused === this._expandedButton;
      if (wasExpanded) {
        this._close();
      }

      super._focusItem(item, navigating);

      this._buttons.forEach((btn) => {
        this._setTabindex(btn, btn === item);
      });

      if (wasExpanded && item.item && item.item.children) {
        this.__openSubMenu(item, true, { keepFocus: true });
      } else if (item === this._overflow) {
        this._hideTooltip();
      } else {
        this._showTooltip(item);
      }
    }

    /** @private */
    _getButtonFromEvent(e) {
      return Array.from(e.composedPath()).find((el) => el.localName === 'vaadin-menu-bar-button');
    }

    /**
     * Override method inherited from `FocusMixin`
     *
     * @param {boolean} focused
     * @override
     * @protected
     */
    _setFocused(focused) {
      if (focused) {
        const target = this.querySelector('[tabindex="0"]');
        if (target) {
          this._buttons.forEach((btn) => {
            this._setTabindex(btn, btn === target);
            if (btn === target && btn !== this._overflow && isKeyboardActive()) {
              this._showTooltip(btn);
            }
          });
        }
      } else {
        this._hideTooltip();
      }
    }

    /**
     * @param {!KeyboardEvent} event
     * @private
     */
    _onArrowDown(event) {
      // Prevent page scroll.
      event.preventDefault();

      const button = this._getButtonFromEvent(event);
      if (button === this._expandedButton) {
        // Menu opened previously, focus first item
        this._focusFirstItem();
      } else {
        this.__openSubMenu(button, true);
      }
    }

    /**
     * @param {!KeyboardEvent} event
     * @private
     */
    _onArrowUp(event) {
      // Prevent page scroll.
      event.preventDefault();

      const button = this._getButtonFromEvent(event);
      if (button === this._expandedButton) {
        // Menu opened previously, focus last item
        this._focusLastItem();
      } else {
        this.__openSubMenu(button, true, { focusLast: true });
      }
    }

    /**
     * Override an event listener from `KeyboardMixin`:
     * - to close the sub-menu for expanded button,
     * - to close a tooltip for collapsed button.
     *
     * @param {!KeyboardEvent} event
     * @protected
     * @override
     */
    _onEscape(event) {
      if (event.composedPath().includes(this._expandedButton)) {
        this._close(true);
      }

      this._hideTooltip(true);
    }

    /**
     * Override an event listener from `KeyboardMixin`.
     *
     * @param {!KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyDown(event) {
      switch (event.key) {
        case 'ArrowDown':
          this._onArrowDown(event);
          break;
        case 'ArrowUp':
          this._onArrowUp(event);
          break;
        default:
          super._onKeyDown(event);
          break;
      }
    }

    /** @private */
    _itemsChanged() {
      const subMenu = this._subMenu;
      if (subMenu && subMenu.opened) {
        subMenu.close();
      }
    }

    /**
     * @param {!MouseEvent} e
     * @protected
     */
    _onMouseOver(e) {
      const button = this._getButtonFromEvent(e);
      if (!button) {
        // Hide tooltip on mouseover to disabled button
        this._hideTooltip();
      } else if (button !== this._expandedButton) {
        const isOpened = this._subMenu.opened;
        if (button.item.children && (this.openOnHover || isOpened)) {
          this.__openSubMenu(button, false);
        } else if (isOpened) {
          this._close();
        }

        if (button === this._overflow || (this.openOnHover && button.item.children)) {
          this._hideTooltip();
        } else {
          this._showTooltip(button, true);
        }
      }
    }

    /** @private */
    __onContextMenuKeydown(e) {
      const item = Array.from(e.composedPath()).find((el) => el._item);
      if (item) {
        const list = item.parentNode;
        if (e.keyCode === 38 && item === list.items[0]) {
          this._close(true);
        }
        // ArrowLeft, or ArrowRight on non-parent submenu item
        if (e.keyCode === 37 || (e.keyCode === 39 && !item._item.children)) {
          // Prevent ArrowLeft from being handled in context-menu
          e.stopImmediatePropagation();
          this._onKeyDown(e);
        }
      }
    }

    /** @private */
    __fireItemSelected(value) {
      this.dispatchEvent(new CustomEvent('item-selected', { detail: { value } }));
    }

    /** @private */
    __onButtonClick(e) {
      e.stopPropagation();
      const button = this._getButtonFromEvent(e);
      if (button) {
        this.__openSubMenu(button, false);
      }
    }

    /** @private */
    __openSubMenu(button, keydown, options = {}) {
      const subMenu = this._subMenu;
      const item = button.item;

      if (subMenu.opened) {
        this._close();
        if (subMenu.listenOn === button) {
          return;
        }
      }

      const items = item && item.children;
      if (!items || items.length === 0) {
        this.__fireItemSelected(item);
        return;
      }

      subMenu.items = items;
      subMenu.listenOn = button;
      const overlay = subMenu.$.overlay;
      overlay.positionTarget = button;
      overlay.noVerticalOverlap = true;

      this._expandedButton = button;

      requestAnimationFrame(() => {
        button.dispatchEvent(
          new CustomEvent('opensubmenu', {
            detail: {
              children: items,
            },
          }),
        );
        this._hideTooltip(true);

        this._setExpanded(button, true);
      });

      this.style.pointerEvents = 'auto';

      overlay.addEventListener(
        'vaadin-overlay-open',
        () => {
          if (options.focusLast) {
            this._focusLastItem();
          }

          if (options.keepFocus) {
            this._focusItem(this._expandedButton, false);
          }

          // Do not focus item when open not from keyboard
          if (!keydown) {
            overlay.$.overlay.focus();
          }

          overlay._updatePosition();
        },
        { once: true },
      );
    }

    /** @private */
    _focusFirstItem() {
      const list = this._subMenu.$.overlay.firstElementChild;
      list.focus();
    }

    /** @private */
    _focusLastItem() {
      const list = this._subMenu.$.overlay.firstElementChild;
      const item = list.items[list.items.length - 1];
      if (item) {
        item.focus();
      }
    }

    /** @private */
    __onItemSelected(e) {
      e.stopPropagation();
      this._close();
      this.__fireItemSelected(e.detail.value);
    }

    /** @private */
    __onEscapeClose() {
      this.__deactivateButton(true);
    }

    /** @private */
    __deactivateButton(restoreFocus) {
      const button = this._expandedButton;
      if (button && button.hasAttribute('expanded')) {
        this._setExpanded(button, false);
        if (restoreFocus) {
          this._focusItem(button, false);
        }
        this._expandedButton = null;
      }
    }

    /**
     * @param {boolean} restoreFocus
     * @protected
     */
    _close(restoreFocus) {
      this.style.pointerEvents = '';
      this.__deactivateButton(restoreFocus);
      if (this._subMenu.opened) {
        this._subMenu.close();
      }
    }
  };

/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * `<vaadin-menu-bar>` is a Web Component providing a set of horizontally stacked buttons offering
 * the user quick access to a consistent set of commands. Each button can toggle a submenu with
 * support for additional levels of nested menus.
 *
 * To create the menu bar, first add the component to the page:
 *
 * ```
 * <vaadin-menu-bar></vaadin-menu-bar>
 * ```
 *
 * And then use [`items`](#/elements/vaadin-menu-bar#property-items) property to initialize the structure:
 *
 * ```
 * document.querySelector('vaadin-menu-bar').items = [{text: 'File'}, {text: 'Edit'}];
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are exposed for styling:
 *
 * Part name         | Description
 * ------------------|----------------
 * `container`       | The container wrapping menu bar buttons.
 *
 * The following state attributes are available for styling:
 *
 * Attribute           | Description
 * --------------------|----------------------------------
 * `disabled`          | Set when the menu bar is disabled
 * `has-single-button` | Set when there is only one button visible
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
 * ### Internal components
 *
 * In addition to `<vaadin-menu-bar>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-menu-bar-button>` - has the same API as [`<vaadin-button>`](#/elements/vaadin-button).
 * - `<vaadin-menu-bar-item>` - has the same API as [`<vaadin-item>`](#/elements/vaadin-item).
 * - `<vaadin-menu-bar-list-box>` - has the same API as [`<vaadin-list-box>`](#/elements/vaadin-list-box).
 * - `<vaadin-menu-bar-overlay>` - has the same API as [`<vaadin-overlay>`](#/elements/vaadin-overlay).
 *
 * @fires {CustomEvent<boolean>} item-selected - Fired when a submenu item or menu bar button without children is clicked.
 *
 * @extends HTMLElement
 * @mixes DisabledMixin
 * @mixes ElementMixin
 * @mixes MenuBarMixin
 * @mixes ThemableMixin
 */
class MenuBar extends MenuBarMixin(DisabledMixin(ElementMixin(ThemableMixin(PolymerElement)))) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none !important;
        }

        [part='container'] {
          position: relative;
          display: flex;
          width: 100%;
          flex-wrap: nowrap;
          overflow: hidden;
        }
      </style>

      <div part="container">
        <slot></slot>
        <slot name="overflow"></slot>
      </div>
      <vaadin-menu-bar-submenu is-root overlay-class="[[overlayClass]]"></vaadin-menu-bar-submenu>

      <slot name="tooltip"></slot>
    `;
  }

  static get is() {
    return 'vaadin-menu-bar';
  }

  static get properties() {
    return {
      /**
       * @typedef MenuBarItem
       * @type {object}
       * @property {string} text - Text to be set as the menu button component's textContent.
       * @property {string} tooltip - Text to be set as the menu button's tooltip.
       * Requires a `<vaadin-tooltip slot="tooltip">` element to be added inside the `<vaadin-menu-bar>`.
       * @property {union: string | object} component - The component to represent the button content.
       * Either a tagName or an element instance. Defaults to "vaadin-menu-bar-item".
       * @property {boolean} disabled - If true, the button is disabled and cannot be activated.
       * @property {union: string | string[]} theme - Theme(s) to be set as the theme attribute of the button, overriding any theme set on the menu bar.
       * @property {SubMenuItem[]} children - Array of submenu items.
       */

      /**
       * @typedef SubMenuItem
       * @type {object}
       * @property {string} text - Text to be set as the menu item component's textContent.
       * @property {union: string | object} component - The component to represent the item.
       * Either a tagName or an element instance. Defaults to "vaadin-menu-bar-item".
       * @property {boolean} disabled - If true, the item is disabled and cannot be selected.
       * @property {boolean} checked - If true, the item shows a checkmark next to it.
       * @property {SubMenuItem[]} children - Array of child submenu items.
       */

      /**
       * Defines a hierarchical structure, where root level items represent menu bar buttons,
       * and `children` property configures a submenu with items to be opened below
       * the button on click, Enter, Space, Up and Down arrow keys.
       *
       * #### Example
       *
       * ```js
       * menubar.items = [
       *   {
       *     text: 'File',
       *     children: [
       *       {text: 'Open'}
       *       {text: 'Auto Save', checked: true},
       *     ]
       *   },
       *   {component: 'hr'},
       *   {
       *     text: 'Edit',
       *     children: [
       *       {text: 'Undo', disabled: true},
       *       {text: 'Redo'}
       *     ]
       *   },
       *   {text: 'Help'}
       * ];
       * ```
       *
       * @type {!Array<!MenuBarItem>}
       */
      items: {
        type: Array,
        value: () => [],
      },

      /**
       * The object used to localize this component.
       * To change the default localization, replace the entire
       * `i18n` object with a custom one.
       *
       * To update individual properties, extend the existing i18n object like so:
       * ```
       * menuBar.i18n = {
       *   ...menuBar.i18n,
       *   moreOptions: 'More options'
       * }
       * ```
       *
       * The object has the following JSON structure and default values:
       * ```
       * {
       *   moreOptions: 'More options'
       * }
       * ```
       *
       * @type {!MenuBarI18n}
       * @default {English/US}
       */
      i18n: {
        type: Object,
        value: () => {
          return {
            moreOptions: 'More options',
          };
        },
      },

      /**
       * A space-delimited list of CSS class names
       * to set on each sub-menu overlay element.
       *
       * @attr {string} overlay-class
       */
      overlayClass: {
        type: String,
      },
    };
  }

  static get observers() {
    return ['_themeChanged(_theme, _overflow, _container)'];
  }

  /** @protected */
  ready() {
    super.ready();

    this._tooltipController = new TooltipController(this);
    this._tooltipController.setManual(true);
    this.addController(this._tooltipController);
  }

  /**
   * Override method inherited from `DisabledMixin`
   * to update the `disabled` property for the buttons
   * whenever the property changes on the menu bar.
   *
   * @param {boolean} newValue the new disabled value
   * @param {boolean} oldValue the previous disabled value
   * @override
   * @protected
   */
  _disabledChanged(newValue, oldValue) {
    super._disabledChanged(newValue, oldValue);
    if (oldValue !== newValue) {
      this.__updateButtonsDisabled(newValue);
    }
  }

  /**
   * A callback for the `_theme` property observer.
   * It propagates the host theme to the buttons and the sub menu.
   *
   * @param {string | null} theme
   * @protected
   */
  _themeChanged(theme, overflow, container) {
    if (overflow && container) {
      this._buttons.forEach((btn) => this._setButtonTheme(btn, theme));
      this.__detectOverflow();
    }

    if (theme) {
      this._subMenu.setAttribute('theme', theme);
    } else {
      this._subMenu.removeAttribute('theme');
    }
  }

  /** @private */
  __updateButtonsDisabled(disabled) {
    this._buttons.forEach((btn) => {
      // Disable the button if the entire menu-bar is disabled or the item alone is disabled
      btn.disabled = disabled || (btn.item && btn.item.disabled);
    });
  }

  /**
   * Fired when either a submenu item or menu bar button without nested children is clicked.
   *
   * @event item-selected
   * @param {Object} detail
   * @param {Object} detail.value the selected menu bar item
   */
}

customElements.define(MenuBar.is, MenuBar);

class SiteMenuBar extends s {
    constructor() {
        super(...arguments);
        this.items = [
            { text: 'View', href: "https://google.com" },
            { text: 'Edit' },
            {
                text: 'Share',
                children: [
                    {
                        text: 'On social media',
                        children: [{ text: 'Facebook' }, { text: 'Twitter' }, { text: 'Instagram' }],
                    },
                    { text: 'By email' },
                    { text: 'Get link' },
                ],
            },
            {
                text: 'Move',
                children: [{ text: 'To folder' }, { text: 'To trash' }],
            },
            { text: 'Duplicate' },
        ];
        this.counter = 5;
    }
    itemSelected(e) {
        if (e.detail.value.href)
            window.location = e.detail.value.href;
    }
    render() {
        return x `
      <vaadin-menu-bar .items="${this.items}" @item-selected="${this.itemSelected}"></vaadin-menu-bar>
    `;
    }
}
SiteMenuBar.styles = i `
    :host {
      display: block;
      padding: 25px;
      color: var(--site-components-text-color, #000);
    }
  `;
__decorate([
    e({ type: Object })
], SiteMenuBar.prototype, "items", void 0);
__decorate([
    e({ type: Number })
], SiteMenuBar.prototype, "counter", void 0);

window.customElements.define('site-menu-bar', SiteMenuBar);
