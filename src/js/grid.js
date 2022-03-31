import { s, r, a as s$1, $ } from './lit-element-20b53a88.js';

/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class Lumo extends HTMLElement {
  static get version() {
    return '22.0.4';
  }
}

customElements.define('vaadin-lumo-styles', Lumo);

/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
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
         * the sub-component’s "theme" attribute to the `theme` property of
         * the host.
         *
         * **NOTE:** Extending the mixin only provides the property for binding,
         * and does not make the propagation alone.
         *
         * See [Styling Components: Sub-components](https://vaadin.com/docs/latest/ds/customization/styling-components/#sub-components).
         * page for more information.
         *
         * @protected
         */
        theme: {
          type: String,
          readOnly: true
        }
      };
    }

    /** @protected */
    attributeChangedCallback(name, oldValue, newValue) {
      super.attributeChangedCallback(name, oldValue, newValue);

      if (name === 'theme') {
        this._setTheme(newValue);
      }
    }
  };

/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
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
    const elementClass = customElements.get(themeFor);
    if (elementClass && Object.prototype.hasOwnProperty.call(elementClass, '__finalized')) {
      console.warn(`The custom element definition for "${themeFor}"
      was finalized before a style module was registered.
      Make sure to add component specific style modules before
      importing the corresponding custom element.`);
    }
  }

  styles = recursiveFlattenStyles(styles);

  if (window.Vaadin && window.Vaadin.styleModules) {
    window.Vaadin.styleModules.registerStyles(themeFor, styles, options);
  } else {
    themeRegistry.push({
      themeFor,
      styles,
      include: options.include,
      moduleId: options.moduleId
    });
  }
}

/**
 * Returns all registered themes. By default the themeRegistry is returend as is.
 * In case the style-modules adapter is imported, the themes are obtained from there instead
 * @returns {Theme[]}
 */
function getAllThemes() {
  if (window.Vaadin && window.Vaadin.styleModules) {
    return window.Vaadin.styleModules.getAllThemes();
  } else {
    return themeRegistry;
  }
}

/**
 * Returns true if the themeFor string matches the tag name
 * @param {string} themeFor
 * @param {string} tagName
 * @returns {boolean}
 */
function matchesThemeFor(themeFor, tagName) {
  return (themeFor || '').split(' ').some((themeForToken) => {
    return new RegExp('^' + themeForToken.split('*').join('.*') + '$').test(tagName);
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
  if (moduleName.indexOf('lumo-') === 0 || moduleName.indexOf('material-') === 0) {
    includePriority = 1;
  } else if (moduleName.indexOf('vaadin-') === 0) {
    includePriority = 2;
  }
  return includePriority;
}

/**
 * Flattens the styles into a single array of styles.
 * @param {CSSResultGroup} styles
 * @param {CSSResult[]} result
 * @returns {CSSResult[]}
 */
function recursiveFlattenStyles(styles = [], result = []) {
  if (styles instanceof s) {
    result.push(styles);
  } else if (Array.isArray(styles)) {
    styles.forEach((style) => recursiveFlattenStyles(style, result));
  } else {
    console.warn('An item in styles is not of type CSSResult. Use `unsafeCSS` or `css`.');
  }
  return result;
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
  styleEl.innerHTML = styles
    // Remove duplicates so that the last occurrence remains
    .filter((style, index) => index === styles.lastIndexOf(style))
    .map((style) => style.cssText)
    .join('\n');
  template.content.appendChild(styleEl);
}

/**
 * Returns an array of themes that should be used for styling a component matching
 * the tag name. The array is sorted by the include order.
 * @param {string} tagName
 * @returns {Theme[]}
 */
function getThemes(tagName) {
  const defaultModuleName = tagName + '-default-theme';

  const themes = getAllThemes()
    // Filter by matching themeFor properties
    .filter((theme) => theme.moduleId !== defaultModuleName && matchesThemeFor(theme.themeFor, tagName))
    .map((theme) => ({
      ...theme,
      // Prepend styles from included themes
      styles: [...getIncludedStyles(theme), ...theme.styles],
      // Map moduleId to includePriority
      includePriority: getIncludePriority(theme.moduleId)
    }))
    // Sort by includePriority
    .sort((themeA, themeB) => themeB.includePriority - themeA.includePriority);

  if (themes.length > 0) {
    return themes;
  } else {
    // No theme modules found, return the default module if it exists
    return getAllThemes().filter((theme) => theme.moduleId === defaultModuleName);
  }
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

      const template = this.prototype._template;
      if (!template || template.__themes) {
        return;
      }

      const inheritedTemplate = Object.getPrototypeOf(this.prototype)._template;
      const inheritedThemes = (inheritedTemplate ? inheritedTemplate.__themes : []) || [];

      template.__themes = [...inheritedThemes, ...getThemes(this.is)];

      // Get flattened styles array
      const styles = template.__themes.reduce((styles, theme) => [...styles, ...theme.styles], []);
      addStylesToTemplate(styles, template);
    }

    /**
     * Covers LitElement based component styling
     *
     * NOTE: This is not yet an offically supported API!
     *
     * TODO: Add tests (run a variation of themable-mixin.test.js where the components get created as LitElements)
     * @protected
     */
    static finalizeStyles(styles) {
      return (
        getThemes(this.is)
          // Get flattened styles array
          .reduce((styles, theme) => [...styles, ...theme.styles], [])
          .concat(styles)
      );
    }
  };

/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const colorBase = r`
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

const $tpl$5 = document.createElement('template');
$tpl$5.innerHTML = `<style>${colorBase.toString().replace(':host', 'html')}</style>`;
document.head.appendChild($tpl$5.content);

const color = r`
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
  }

  [theme~='dark'] {
    color: var(--lumo-body-text-color);
    background-color: var(--lumo-base-color);
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: var(--lumo-header-text-color);
  }

  a {
    color: var(--lumo-primary-text-color);
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

const colorLegacy = r`
  :host {
    color: var(--lumo-body-text-color) !important;
    background-color: var(--lumo-base-color) !important;
  }
`;

registerStyles('', [color, colorLegacy], { moduleId: 'lumo-color-legacy' });

/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const $_documentContainer$2 = document.createElement('template');

$_documentContainer$2.innerHTML = `
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

document.head.appendChild($_documentContainer$2.content);

/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const sizing = r`
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

const $tpl$4 = document.createElement('template');
$tpl$4.innerHTML = `<style>${sizing.toString().replace(':host', 'html')}</style>`;
document.head.appendChild($tpl$4.content);

/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const spacing = r`
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

const $tpl$3 = document.createElement('template');
$tpl$3.innerHTML = `<style>${spacing.toString().replace(':host', 'html')}</style>`;
document.head.appendChild($tpl$3.content);

/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const style = r`
  :host {
    /* Border radius */
    --lumo-border-radius-s: 0.25em; /* Checkbox, badge, date-picker year indicator, etc */
    --lumo-border-radius-m: var(--lumo-border-radius, 0.25em); /* Button, text field, menu overlay, etc */
    --lumo-border-radius-l: 0.5em; /* Dialog, notification, etc */
    --lumo-border-radius: 0.25em; /* Deprecated */

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

const $tpl$2 = document.createElement('template');
$tpl$2.innerHTML = `<style>${style.toString().replace(':host', 'html')}</style>`;
document.head.appendChild($tpl$2.content);

/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const font = r`
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

const typography = r`
  html,
  :host {
    font-family: var(--lumo-font-family);
    font-size: var(--lumo-font-size, var(--lumo-font-size-m));
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

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 600;
    line-height: var(--lumo-line-height-xs);
    margin-top: 1.25em;
  }

  h1 {
    font-size: var(--lumo-font-size-xxxl);
    margin-bottom: 0.75em;
  }

  h2 {
    font-size: var(--lumo-font-size-xxl);
    margin-bottom: 0.5em;
  }

  h3 {
    font-size: var(--lumo-font-size-xl);
    margin-bottom: 0.5em;
  }

  h4 {
    font-size: var(--lumo-font-size-l);
    margin-bottom: 0.5em;
  }

  h5 {
    font-size: var(--lumo-font-size-m);
    margin-bottom: 0.25em;
  }

  h6 {
    font-size: var(--lumo-font-size-xs);
    margin-bottom: 0;
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

  a:hover {
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

const $tpl$1 = document.createElement('template');
$tpl$1.innerHTML = `<style>${font.toString().replace(':host', 'html')}</style>`;
document.head.appendChild($tpl$1.content);

registerStyles(
  'vaadin-checkbox',
  r`
    :host {
      color: var(--lumo-body-text-color);
      font-size: var(--lumo-font-size-m);
      font-family: var(--lumo-font-family);
      line-height: var(--lumo-line-height-s);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      -webkit-tap-highlight-color: transparent;
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
      cursor: default;
      outline: none;
    }

    :host([has-label]) ::slotted(label) {
      padding: var(--lumo-space-xs) var(--lumo-space-s) var(--lumo-space-xs) var(--lumo-space-xs);
    }

    [part='checkbox'] {
      width: calc(var(--lumo-size-m) / 2);
      height: calc(var(--lumo-size-m) / 2);
      margin: var(--lumo-space-xs);
      position: relative;
      border-radius: var(--lumo-border-radius-s);
      background-color: var(--lumo-contrast-20pct);
      transition: transform 0.2s cubic-bezier(0.12, 0.32, 0.54, 2), background-color 0.15s;
      line-height: 1.2;
      cursor: var(--lumo-clickable-cursor);
      flex: none;
    }

    :host([indeterminate]) [part='checkbox'],
    :host([checked]) [part='checkbox'] {
      background-color: var(--lumo-primary-color);
    }

    /* Needed to align the checkbox nicely on the baseline */
    [part='checkbox']::before {
      content: '\\2003';
    }

    /* Checkmark */
    [part='checkbox']::after {
      content: '';
      pointer-events: none;
      display: inline-block;
      width: 0;
      height: 0;
      border: 0 solid var(--lumo-primary-contrast-color);
      border-width: 0.1875em 0 0 0.1875em;
      box-sizing: border-box;
      transform-origin: 0 0;
      position: absolute;
      top: 0.8125em;
      left: 0.5em;
      transform: scale(0.55) rotate(-135deg);
      opacity: 0;
    }

    :host([checked]) [part='checkbox']::after {
      opacity: 1;
      width: 0.625em;
      height: 1.0625em;
    }

    /* Indeterminate checkmark */
    :host([indeterminate]) [part='checkbox']::after {
      transform: none;
      opacity: 1;
      top: 45%;
      height: 10%;
      left: 22%;
      right: 22%;
      width: auto;
      border: 0;
      background-color: var(--lumo-primary-contrast-color);
      transition: opacity 0.25s;
    }

    /* Focus ring */
    :host([focus-ring]) [part='checkbox'] {
      box-shadow: 0 0 0 1px var(--lumo-base-color), 0 0 0 3px var(--lumo-primary-color-50pct);
    }

    /* Disabled */
    :host([disabled]) {
      pointer-events: none;
      color: var(--lumo-disabled-text-color);
    }

    :host([disabled]) ::slotted(label) {
      color: inherit;
    }

    :host([disabled]) [part='checkbox'] {
      background-color: var(--lumo-contrast-10pct);
    }

    :host([disabled]) [part='checkbox']::after {
      border-color: var(--lumo-contrast-30pct);
    }

    :host([indeterminate][disabled]) [part='checkbox']::after {
      background-color: var(--lumo-contrast-30pct);
    }

    /* RTL specific styles */
    :host([dir='rtl'][has-label]) ::slotted(label) {
      padding: var(--lumo-space-xs) var(--lumo-space-xs) var(--lumo-space-xs) var(--lumo-space-s);
    }

    /* Transition the checkmark if activated with the mouse (disabled for grid select-all this way) */
    :host(:hover) [part='checkbox']::after {
      transition: width 0.1s, height 0.25s;
    }

    /* Used for activation "halo" */
    [part='checkbox']::before {
      pointer-events: none;
      color: transparent;
      display: inline-block;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      background-color: inherit;
      transform: scale(1.4);
      opacity: 0;
      transition: transform 0.1s, opacity 0.8s;
    }

    /* Hover */
    :host(:not([checked]):not([indeterminate]):not([disabled]):hover) [part='checkbox'] {
      background-color: var(--lumo-contrast-30pct);
    }

    /* Disable hover for touch devices */
    @media (pointer: coarse) {
      :host(:not([checked]):not([indeterminate]):not([disabled]):hover) [part='checkbox'] {
        background-color: var(--lumo-contrast-20pct);
      }
    }

    /* Active */
    :host([active]) [part='checkbox'] {
      transform: scale(0.9);
      transition-duration: 0.05s;
    }

    :host([active][checked]) [part='checkbox'] {
      transform: scale(1.1);
    }

    :host([active]:not([checked])) [part='checkbox']::before {
      transition-duration: 0.01s, 0.01s;
      transform: scale(0);
      opacity: 0.4;
    }
  `,
  { moduleId: 'lumo-checkbox' }
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
let passiveTouchGestures =
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
      // element's location; accomodate polyfilled HTMLImports
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
const wrap = (window['ShadyDOM'] && window['ShadyDOM']['noPatch'] && window['ShadyDOM']['wrap']) ?
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
function get$1(root, path, info) {
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
 * Async interface wrapper around `setTimeout`.
 *
 * @namespace
 * @summary Async interface wrapper around `setTimeout`.
 */
const timeOut$1 = {
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
      run(fn) { return window.setTimeout(fn, delay); },
      cancel(handle) {
        window.clearTimeout(handle);
      }
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
  }
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
        node = /** @type {?Element} */(wrap(node));
      }
      if (str === undefined) {
        node.removeAttribute(attribute);
      } else {
        node.setAttribute(attribute, str);
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

function wrapTemplateExtension(node) {
  let is = node.getAttribute('is');
  if (is && templateExtensions[is]) {
    let t = node;
    t.removeAttribute('is');
    node = t.ownerDocument.createElement(is);
    t.parentNode.replaceChild(node, t);
    node.appendChild(t);
    while(t.attributes.length) {
      node.setAttribute(t.attributes[0].name, t.attributes[0].value);
      t.removeAttribute(t.attributes[0].name);
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
          template.hasAttribute('strip-whitespace');
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
  wrap(/** @type {!HTMLElement} */(inst)).dispatchEvent(new CustomEvent(eventName, { detail }));
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
  let value = path ? get$1(inst, path) : inst.__data[property];
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
        node = wrap(node);
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
    .replace(/\\(.)/g, '\$1')
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
  let value = get$1(data, path);
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
          let old = get$1(this, path);
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
          node = /** @type {!Node} */(wrap(node));
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
      let array = /** @type {Array} */(get$1(this, path, info));
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
      return get$1(root || this, path);
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
      let array = /** @type {Array}*/(get$1(this, path, info));
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
      let array = /** @type {Array} */(get$1(this, path, info));
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
      let array = /** @type {Array} */(get$1(this, path, info));
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
      let array = /** @type {Array} */(get$1(this, path, info));
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
      let array = /** @type {Array} */(get$1(this, path, info));
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
        value = get$1(this, path, info);
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
              base: matches ? get$1(data, name) : pathValue
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
        wrap(wrap(node).parentNode).removeChild(node);
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
        value = get$1(inst, part.source);
      } else {
        if (hasPaths && isPath(path)) {
          value = get$1(inst, path);
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
const version = '3.4.1';

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
        const protoTemplate = this.prototype.hasOwnProperty(
          JSCompiler_renameProperty('_template', this.prototype)) ?
          this.prototype._template : undefined;
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
      const n = wrap(this);
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
 * Class representing a static string value which can be used to filter
 * strings by asseting that they have been created via this class. The
 * `value` property returns the string passed to the constructor.
 */
class LiteralString {
  constructor(string) {
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
  const template = /** @type {!HTMLTemplateElement} */(document.createElement('template'));
  template.innerHTML = values.reduce((acc, v, idx) =>
      acc + htmlValue(v) + strings[idx + 1], strings[0]);
  return template;
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
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/**
 * @summary Collapse multiple callbacks into one invocation after a timer.
 */
class Debouncer$1 {
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
      debouncerQueue$1.delete(this);
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
      debouncerQueue$1.delete(this);
    }
  }
  /**
   * Cancels a debouncer's async callback.
   *
   * @return {void}
   */
  _cancelAsync() {
    if (this.isActive()) {
      this._asyncModule.cancel(/** @type {number} */(this._timer));
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
  /**
   * Creates a debouncer if no debouncer is passed as a parameter
   * or it cancels an active debouncer otherwise. The following
   * example shows how a debouncer can be called multiple times within a
   * microtask and "debounced" such that the provided callback function is
   * called once. Add this method to a custom element:
   *
   * ```js
   * import {microTask} from '@polymer/polymer/lib/utils/async.js';
   * import {Debouncer} from '@polymer/polymer/lib/utils/debounce.js';
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
    if (debouncer instanceof Debouncer$1) {
      // Cancel the async callback, but leave in debouncerQueue if it was
      // enqueued, to maintain 1.x flush order
      debouncer._cancelAsync();
    } else {
      debouncer = new Debouncer$1();
    }
    debouncer.setConfig(asyncModule, callback);
    return debouncer;
  }
}

let debouncerQueue$1 = new Set();

/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

// detect native touch action support
let HAS_NATIVE_TA = typeof document.head.style.touchAction === 'string';
let GESTURE_KEY = '__polymerGestures';
let HANDLED_OBJ = '__polymerGesturesHandled';
let TOUCH_ACTION = '__polymerGesturesTouchAction';
// radius for tap and track
let TAP_DISTANCE = 25;
let TRACK_DISTANCE = 5;
// number of last N track positions to keep
let TRACK_LENGTH = 2;

// Disabling "mouse" handlers for 2500ms is enough
let MOUSE_TIMEOUT = 2500;
let MOUSE_EVENTS = ['mousedown', 'mousemove', 'mouseup', 'click'];
// an array of bitmask values for mapping MouseEvent.which to MouseEvent.buttons
let MOUSE_WHICH_TO_BUTTONS = [0, 1, 4, 2];
let MOUSE_HAS_BUTTONS = (function() {
  try {
    return new MouseEvent('test', {buttons: 1}).buttons === 1;
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
(function() {
  try {
    let opts = Object.defineProperty({}, 'passive', {get() {supportsPassive = true;}});
    window.addEventListener('test', null, opts);
    window.removeEventListener('test', null, opts);
  } catch(e) {}
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
    return {passive: true};
  } else {
    return;
  }
}

// Check for touch-only devices
let IS_TOUCH_ONLY = navigator.userAgent.match(/iP(?:[oa]d|hone)|Android/);

// keep track of any labels hit by the mouseCanceller
/** @type {!Array<!HTMLLabelElement>} */
const clickedLabels = [];

/** @type {!Object<boolean>} */
const labellable = {
  'button': true,
  'input': true,
  'keygen': true,
  'meter': true,
  'output': true,
  'textarea': true,
  'progress': true,
  'select': true
};

// Defined at https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#enabling-and-disabling-form-controls:-the-disabled-attribute
/** @type {!Object<boolean>} */
const canBeDisabled = {
  'button': true,
  'command': true,
  'fieldset': true,
  'input': true,
  'keygen': true,
  'optgroup': true,
  'option': true,
  'select': true,
  'textarea': true
};

/**
 * @param {HTMLElement} el Element to check labelling status
 * @return {boolean} element can have labels
 */
function canBeLabelled(el) {
  return labellable[el.localName] || false;
}

/**
 * @param {HTMLElement} el Element that may be labelled.
 * @return {!Array<!HTMLLabelElement>} Relevant label for `el`
 */
function matchingLabels(el) {
  let labels = Array.prototype.slice.call(/** @type {HTMLInputElement} */(el).labels || []);
  // IE doesn't have `labels` and Safari doesn't populate `labels`
  // if element is in a shadowroot.
  // In this instance, finding the non-ancestor labels is enough,
  // as the mouseCancellor code will handle ancstor labels
  if (!labels.length) {
    labels = [];
    let root = el.getRootNode();
    // if there is an id on `el`, check for all labels with a matching `for` attribute
    if (el.id) {
      let matching = root.querySelectorAll(`label[for = ${el.id}]`);
      for (let i = 0; i < matching.length; i++) {
        labels.push(/** @type {!HTMLLabelElement} */(matching[i]));
      }
    }
  }
  return labels;
}

// touch will make synthetic mouse events
// `preventDefault` on touchend will cancel them,
// but this breaks `<input>` focus and link clicks
// disable mouse handlers for MOUSE_TIMEOUT ms after
// a touchend to ignore synthetic mouse events
let mouseCanceller = function(mouseEvent) {
  // Check for sourceCapabilities, used to distinguish synthetic events
  // if mouseEvent did not come from a device that fires touch events,
  // it was made by a real mouse and should be counted
  // http://wicg.github.io/InputDeviceCapabilities/#dom-inputdevicecapabilities-firestouchevents
  let sc = mouseEvent.sourceCapabilities;
  if (sc && !sc.firesTouchEvents) {
    return;
  }
  // skip synthetic mouse events
  mouseEvent[HANDLED_OBJ] = {skip: true};
  // disable "ghost clicks"
  if (mouseEvent.type === 'click') {
    let clickFromLabel = false;
    let path = getComposedPath(mouseEvent);
    for (let i = 0; i < path.length; i++) {
      if (path[i].nodeType === Node.ELEMENT_NODE) {
        if (path[i].localName === 'label') {
          clickedLabels.push(/** @type {!HTMLLabelElement} */ (path[i]));
        } else if (canBeLabelled(/** @type {!HTMLElement} */ (path[i]))) {
          let ownerLabels =
              matchingLabels(/** @type {!HTMLElement} */ (path[i]));
          // check if one of the clicked labels is labelling this element
          for (let j = 0; j < ownerLabels.length; j++) {
            clickFromLabel = clickFromLabel || clickedLabels.indexOf(ownerLabels[j]) > -1;
          }
        }
      }
      if (path[i] === POINTERSTATE.mouse.target) {
        return;
      }
    }
    // if one of the clicked labels was labelling the target element,
    // this is not a ghost click
    if (clickFromLabel) {
      return;
    }
    mouseEvent.preventDefault();
    mouseEvent.stopPropagation();
  }
};

/**
 * @param {boolean=} setup True to add, false to remove.
 * @return {void}
 */
function setupTeardownMouseCanceller(setup) {
  let events = IS_TOUCH_ONLY ? ['click'] : MOUSE_EVENTS;
  for (let i = 0, en; i < events.length; i++) {
    en = events[i];
    if (setup) {
      // reset clickLabels array
      clickedLabels.length = 0;
      document.addEventListener(en, mouseCanceller, true);
    } else {
      document.removeEventListener(en, mouseCanceller, true);
    }
  }
}

function ignoreMouse(e) {
  if (!POINTERSTATE.mouse.mouseIgnoreJob) {
    setupTeardownMouseCanceller(true);
  }
  let unset = function() {
    setupTeardownMouseCanceller();
    POINTERSTATE.mouse.target = null;
    POINTERSTATE.mouse.mouseIgnoreJob = null;
  };
  POINTERSTATE.mouse.target = getComposedPath(e)[0];
  POINTERSTATE.mouse.mouseIgnoreJob = Debouncer$1.debounce(
        POINTERSTATE.mouse.mouseIgnoreJob
      , timeOut$1.after(MOUSE_TIMEOUT)
      , unset);
}

/**
 * @param {MouseEvent} ev event to test for left mouse button down
 * @return {boolean} has left mouse button down
 */
function hasLeftMouseButton(ev) {
  let type = ev.type;
  // exit early if the event is not a mouse event
  if (!isMouseEvent(type)) {
    return false;
  }
  // ev.button is not reliable for mousemove (0 is overloaded as both left button and no buttons)
  // instead we use ev.buttons (bitmask of buttons) or fall back to ev.which (deprecated, 0 for no buttons, 1 for left button)
  if (type === 'mousemove') {
    // allow undefined for testing events
    let buttons = ev.buttons === undefined ? 1 : ev.buttons;
    if ((ev instanceof window.MouseEvent) && !MOUSE_HAS_BUTTONS) {
      buttons = MOUSE_WHICH_TO_BUTTONS[ev.which] || 0;
    }
    // buttons is a bitmask, check that the left button bit is set (1)
    return Boolean(buttons & 1);
  } else {
    // allow undefined for testing events
    let button = ev.button === undefined ? 0 : ev.button;
    // ev.button is 0 in mousedown/mouseup/click for left button activation
    return button === 0;
  }
}

function isSyntheticClick(ev) {
  if (ev.type === 'click') {
    // ev.detail is 0 for HTMLElement.click in most browsers
    if (ev.detail === 0) {
      return true;
    }
    // in the worst case, check that the x/y position of the click is within
    // the bounding box of the target of the event
    // Thanks IE 10 >:(
    let t = _findOriginalTarget(ev);
    // make sure the target of the event is an element so we can use getBoundingClientRect,
    // if not, just assume it is a synthetic click
    if (!t.nodeType || /** @type {Element} */(t).nodeType !== Node.ELEMENT_NODE) {
      return true;
    }
    let bcr = /** @type {Element} */(t).getBoundingClientRect();
    // use page x/y to account for scrolling
    let x = ev.pageX, y = ev.pageY;
    // ev is a synthetic click if the position is outside the bounding box of the target
    return !((x >= bcr.left && x <= bcr.right) && (y >= bcr.top && y <= bcr.bottom));
  }
  return false;
}

let POINTERSTATE = {
  mouse: {
    target: null,
    mouseIgnoreJob: null
  },
  touch: {
    x: 0,
    y: 0,
    id: -1,
    scrollDecided: false
  }
};

function firstTouchAction(ev) {
  let ta = 'auto';
  let path = getComposedPath(ev);
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

{
  // use a document-wide touchend listener to start the ghost-click prevention mechanism
  // Use passive event listeners, if supported, to not affect scrolling performance
  document.addEventListener('touchend', ignoreMouse, supportsPassive ? {passive: true} : false);
}

/**
 * Returns the composedPath for the given event.
 * @param {Event} event to process
 * @return {!Array<!EventTarget>} Path of the event
 */
const getComposedPath = window.ShadyDOM && window.ShadyDOM.noPatch ?
  window.ShadyDOM.composedPath :
  (event) => event.composedPath && event.composedPath() || [];

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
  // this code path is only taken when native ShadowDOM is used
  // if there is a shadowroot, it may have a node at x/y
  // if there is not a shadowroot, exit the loop
  while (next && next.shadowRoot && !window.ShadyDOM) {
    // if there is a node at x/y in the shadowroot, look deeper
    let oldNext = next;
    next = next.shadowRoot.elementFromPoint(x, y);
    // on Safari, elementFromPoint may return the shadowRoot host
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
 * a cheaper check than ev.composedPath()[0];
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
  let handled;
  let type = ev.type;
  let node = ev.currentTarget;
  let gobj = node[GESTURE_KEY];
  if (!gobj) {
    return;
  }
  let gs = gobj[type];
  if (!gs) {
    return;
  }
  if (!ev[HANDLED_OBJ]) {
    ev[HANDLED_OBJ] = {};
    if (type.slice(0, 5) === 'touch') {
      ev = /** @type {TouchEvent} */(ev); // eslint-disable-line no-self-assign
      let t = ev.changedTouches[0];
      if (type === 'touchstart') {
        // only handle the first finger
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
  handled = ev[HANDLED_OBJ];
  // used to ignore synthetic mouse events
  if (handled.skip) {
    return;
  }
  // reset recognizer state
  for (let i = 0, r; i < recognizers.length; i++) {
    r = recognizers[i];
    if (gs[r.name] && !handled[r.name]) {
      if (r.flow && r.flow.start.indexOf(ev.type) > -1 && r.reset) {
        r.reset();
      }
    }
  }
  // enforce gesture recognizer order
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
  let t = ev.changedTouches[0];
  let type = ev.type;
  if (type === 'touchstart') {
    POINTERSTATE.touch.x = t.clientX;
    POINTERSTATE.touch.y = t.clientY;
    POINTERSTATE.touch.scrollDecided = false;
  } else if (type === 'touchmove') {
    if (POINTERSTATE.touch.scrollDecided) {
      return;
    }
    POINTERSTATE.touch.scrollDecided = true;
    let ta = firstTouchAction(ev);
    let shouldPrevent = false;
    let dx = Math.abs(POINTERSTATE.touch.x - t.clientX);
    let dy = Math.abs(POINTERSTATE.touch.y - t.clientY);
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
 * automate the event listeners for the native events
 *
 * @private
 * @param {!EventTarget} node Node on which to add the event.
 * @param {string} evType Event type to add.
 * @param {function(!Event)} handler Event handler function.
 * @return {void}
 */
function _add(node, evType, handler) {
  let recognizer = gestures[evType];
  let deps = recognizer.deps;
  let name = recognizer.name;
  let gobj = node[GESTURE_KEY];
  if (!gobj) {
    node[GESTURE_KEY] = gobj = {};
  }
  for (let i = 0, dep, gd; i < deps.length; i++) {
    dep = deps[i];
    // don't add mouse handlers on iOS because they cause gray selection overlays
    if (IS_TOUCH_ONLY && isMouseEvent(dep) && dep !== 'click') {
      continue;
    }
    gd = gobj[dep];
    if (!gd) {
      gobj[dep] = gd = {_count: 0};
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
 * automate event listener removal for native events
 *
 * @private
 * @param {!EventTarget} node Node on which to remove the event.
 * @param {string} evType Event type to remove.
 * @param {function(!Event): void} handler Event handler function.
 * @return {void}
 */
function _remove(node, evType, handler) {
  let recognizer = gestures[evType];
  let deps = recognizer.deps;
  let name = recognizer.name;
  let gobj = node[GESTURE_KEY];
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
  for (let i = 0; i < recog.emits.length; i++) {
    gestures[recog.emits[i]] = recog;
  }
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
    microTask$1.run(() => {
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
  let ev = new Event(type, { bubbles: true, cancelable: true, composed: true });
  ev.detail = detail;
  wrap(/** @type {!Node} */(target)).dispatchEvent(ev);
  // forward `preventDefault` in a clean way
  if (ev.defaultPrevented) {
    let preventer = detail.preventer || detail.sourceEvent;
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
  let recognizer = _findRecognizerByEvent(evName);
  if (recognizer.info) {
    recognizer.info.prevent = true;
  }
}

/* eslint-disable valid-jsdoc */

register({
  name: 'downup',
  deps: ['mousedown', 'touchstart', 'touchend'],
  flow: {
    start: ['mousedown', 'touchstart'],
    end: ['mouseup', 'touchend']
  },
  emits: ['down', 'up'],

  info: {
    movefn: null,
    upfn: null
  },

  /**
   * @this {GestureRecognizer}
   * @return {void}
   */
  reset: function() {
    untrackDocument(this.info);
  },

  /**
   * @this {GestureRecognizer}
   * @param {MouseEvent} e
   * @return {void}
   */
  mousedown: function(e) {
    if (!hasLeftMouseButton(e)) {
      return;
    }
    let t = _findOriginalTarget(e);
    let self = this;
    let movefn = function movefn(e) {
      if (!hasLeftMouseButton(e)) {
        downupFire('up', t, e);
        untrackDocument(self.info);
      }
    };
    let upfn = function upfn(e) {
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
  touchstart: function(e) {
    downupFire('down', _findOriginalTarget(e), e.changedTouches[0], e);
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchend: function(e) {
    downupFire('up', _findOriginalTarget(e), e.changedTouches[0], e);
  }
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
    preventer: preventer,
    prevent: function(e) {
      return prevent(e);
    }
  });
}

register({
  name: 'track',
  touchAction: 'none',
  deps: ['mousedown', 'touchstart', 'touchmove', 'touchend'],
  flow: {
    start: ['mousedown', 'touchstart'],
    end: ['mouseup', 'touchend']
  },
  emits: ['track'],

  info: {
    x: 0,
    y: 0,
    state: 'start',
    started: false,
    moves: [],
    /** @this {GestureInfo} */
    addMove: function(move) {
      if (this.moves.length > TRACK_LENGTH) {
        this.moves.shift();
      }
      this.moves.push(move);
    },
    movefn: null,
    upfn: null,
    prevent: false
  },

  /**
   * @this {GestureRecognizer}
   * @return {void}
   */
  reset: function() {
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
  mousedown: function(e) {
    if (!hasLeftMouseButton(e)) {
      return;
    }
    let t = _findOriginalTarget(e);
    let self = this;
    let movefn = function movefn(e) {
      let x = e.clientX, y = e.clientY;
      if (trackHasMovedEnough(self.info, x, y)) {
        // first move is 'start', subsequent moves are 'move', mouseup is 'end'
        self.info.state = self.info.started ? (e.type === 'mouseup' ? 'end' : 'track') : 'start';
        if (self.info.state === 'start') {
          // if and only if tracking, always prevent tap
          prevent('tap');
        }
        self.info.addMove({x: x, y: y});
        if (!hasLeftMouseButton(e)) {
          // always fire "end"
          self.info.state = 'end';
          untrackDocument(self.info);
        }
        if (t) {
          trackFire(self.info, t, e);
        }
        self.info.started = true;
      }
    };
    let upfn = function upfn(e) {
      if (self.info.started) {
        movefn(e);
      }

      // remove the temporary listeners
      untrackDocument(self.info);
    };
    // add temporary document listeners as mouse retargets
    trackDocument(this.info, movefn, upfn);
    this.info.x = e.clientX;
    this.info.y = e.clientY;
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchstart: function(e) {
    let ct = e.changedTouches[0];
    this.info.x = ct.clientX;
    this.info.y = ct.clientY;
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchmove: function(e) {
    let t = _findOriginalTarget(e);
    let ct = e.changedTouches[0];
    let x = ct.clientX, y = ct.clientY;
    if (trackHasMovedEnough(this.info, x, y)) {
      if (this.info.state === 'start') {
        // if and only if tracking, always prevent tap
        prevent('tap');
      }
      this.info.addMove({x: x, y: y});
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
  touchend: function(e) {
    let t = _findOriginalTarget(e);
    let ct = e.changedTouches[0];
    // only trackend if track was started and not aborted
    if (this.info.started) {
      // reset started state on up
      this.info.state = 'end';
      this.info.addMove({x: ct.clientX, y: ct.clientY});
      trackFire(this.info, t, ct);
    }
  }
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
  let dx = Math.abs(info.x - x);
  let dy = Math.abs(info.y - y);
  return (dx >= TRACK_DISTANCE || dy >= TRACK_DISTANCE);
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
  let secondlast = info.moves[info.moves.length - 2];
  let lastmove = info.moves[info.moves.length - 1];
  let dx = lastmove.x - info.x;
  let dy = lastmove.y - info.y;
  let ddx, ddy = 0;
  if (secondlast) {
    ddx = lastmove.x - secondlast.x;
    ddy = lastmove.y - secondlast.y;
  }
  _fire(target, 'track', {
    state: info.state,
    x: touch.clientX,
    y: touch.clientY,
    dx: dx,
    dy: dy,
    ddx: ddx,
    ddy: ddy,
    sourceEvent: touch,
    hover: function() {
      return deepTargetFind(touch.clientX, touch.clientY);
    }
  });
}

register({
  name: 'tap',
  deps: ['mousedown', 'click', 'touchstart', 'touchend'],
  flow: {
    start: ['mousedown', 'touchstart'],
    end: ['click', 'touchend']
  },
  emits: ['tap'],
  info: {
    x: NaN,
    y: NaN,
    prevent: false
  },
  /**
   * @this {GestureRecognizer}
   * @return {void}
   */
  reset: function() {
    this.info.x = NaN;
    this.info.y = NaN;
    this.info.prevent = false;
  },
  /**
   * @this {GestureRecognizer}
   * @param {MouseEvent} e
   * @return {void}
   */
  mousedown: function(e) {
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
  click: function(e) {
    if (hasLeftMouseButton(e)) {
      trackForward(this.info, e);
    }
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchstart: function(e) {
    const touch = e.changedTouches[0];
    this.info.x = touch.clientX;
    this.info.y = touch.clientY;
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchend: function(e) {
    trackForward(this.info, e.changedTouches[0], e);
  }
});

/**
 * @param {!GestureInfo} info
 * @param {Event | Touch} e
 * @param {Event=} preventer
 * @return {void}
 */
function trackForward(info, e, preventer) {
  let dx = Math.abs(e.clientX - info.x);
  let dy = Math.abs(e.clientY - info.y);
  // find original target from `preventer` for TouchEvents, or `e` for MouseEvents
  let t = _findOriginalTarget((preventer || e));
  if (!t || (canBeDisabled[/** @type {!HTMLElement} */(t).localName] && t.hasAttribute('disabled'))) {
    return;
  }
  // dx,dy can be NaN if `click` has been simulated and there was no `down` for `start`
  if (isNaN(dx) || isNaN(dy) || (dx <= TAP_DISTANCE && dy <= TAP_DISTANCE) || isSyntheticClick(e)) {
    // prevent taps from being generated if an event has canceled them
    if (!info.prevent) {
      _fire(t, 'tap', {
        x: e.clientX,
        y: e.clientY,
        sourceEvent: e,
        preventer: preventer
      });
    }
  }
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
 * Element class mixin that provides API for adding Polymer's cross-platform
 * gesture events to nodes.
 *
 * The API is designed to be compatible with override points implemented
 * in `TemplateStamp` such that declarative event listeners in
 * templates will support gesture events when this mixin is applied along with
 * `TemplateStamp`.
 *
 * @mixinFunction
 * @polymer
 * @summary Element class mixin that provides API for adding Polymer's
 *   cross-platform gesture events to nodes
 * @template T
 * @param {function(new:T)} superClass Class to apply mixin to.
 * @return {function(new:T)} superClass with mixin applied.
 */
const GestureEventListeners = dedupingMixin((superClass) => {
  /**
   * @polymer
   * @mixinClass
   * @implements {Polymer_GestureEventListeners}
   */
  class GestureEventListeners extends superClass {
    /**
     * Add the event listener to the node if it is a gestures event.
     *
     * @param {!EventTarget} node Node to add event listener to
     * @param {string} eventName Name of event
     * @param {function(!Event):void} handler Listener function to add
     * @return {void}
     * @override
     */
    _addEventListenerToNode(node, eventName, handler) {
      if (!addListener(node, eventName, handler)) {
        super._addEventListenerToNode(node, eventName, handler);
      }
    }

    /**
     * Remove the event listener to the node if it is a gestures event.
     *
     * @param {!EventTarget} node Node to remove event listener from
     * @param {string} eventName Name of event
     * @param {function(!Event):void} handler Listener function to remove
     * @return {void}
     * @override
     */
    _removeEventListenerFromNode(node, eventName, handler) {
      if (!removeListener(node, eventName, handler)) {
        super._removeEventListenerFromNode(node, eventName, handler);
      }
    }
  }

  return GestureEventListeners;
});

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
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
            reflectToAttribute: true
          }
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
    }
);

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
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
       * A handler for the `keydown` event. By default, it does nothing.
       * Override the method to implement your own behavior.
       *
       * @param {KeyboardEvent} _event
       * @protected
       */
      _onKeyDown(_event) {
        // To be implemented.
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
    }
);

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
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
  class ActiveMixinClass extends DisabledMixin(GestureEventListeners(KeyboardMixin(superclass))) {
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

      this._addEventListenerToNode(this, 'down', (event) => {
        if (this._shouldSetActive(event)) {
          this._setActive(true);
        }
      });

      this._addEventListenerToNode(this, 'up', () => {
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
      }
    }

    /**
     * Removes the `active` attribute from the element if the activation key is released.
     *
     * @param {KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyUp(event) {
      super._onKeyUp(event);

      if (this._activeKeys.includes(event.key)) {
        this._setActive(false);
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
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
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
         * @type {Set<import('lit').ReactiveController>}
         */
        this.__controllers = new Set();
      }

      /** @protected */
      connectedCallback() {
        super.connectedCallback();

        this.__controllers.forEach((c) => {
          c.hostConnected && c.hostConnected();
        });
      }

      /** @protected */
      disconnectedCallback() {
        super.disconnectedCallback();

        this.__controllers.forEach((c) => {
          c.hostDisconnected && c.hostDisconnected();
        });
      }

      /**
       * Registers a controller to participate in the element update cycle.
       *
       * @param {import('lit').ReactiveController} controller
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
       * @param {import('lit').ReactiveController} controller
       * @protected
       */
      removeController(controller) {
        this.__controllers.delete(controller);
      }
    }
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
let microtaskCallbacks = [];
let microtaskNodeContent = 0;
let microtaskScheduled = false;
let microtaskNode = document.createTextNode('');
new window.MutationObserver(microtaskFlush).observe(microtaskNode, { characterData: true });

function microtaskFlush() {
  microtaskScheduled = false;
  const len = microtaskCallbacks.length;
  for (let i = 0; i < len; i++) {
    let cb = microtaskCallbacks[i];
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
      }
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
  }
};

/**
 * Async interface wrapper around `requestAnimationFrame`.
 *
 * @namespace
 * @summary Async interface wrapper around `requestAnimationFrame`.
 */
const animationFrame = {
  /**
   * Enqueues a function called at `requestAnimationFrame` timing.
   *
   * @memberof animationFrame
   * @param {function(number):void} fn Callback to run
   * @return {number} Handle used for canceling task
   */
  run(fn) {
    return window.requestAnimationFrame(fn);
  },
  /**
   * Cancels a previously enqueued `animationFrame` callback.
   *
   * @memberof animationFrame
   * @param {number} handle Handle returned from `run` of callback to cancel
   * @return {void}
   */
  cancel(handle) {
    window.cancelAnimationFrame(handle);
  }
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
    window.cancelIdleCallback ? window.cancelIdleCallback(handle) : window.clearTimeout(handle);
  }
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
      microtaskNode.textContent = microtaskNodeContent++;
    }
    microtaskCallbacks.push(callback);
    return microtaskCurrHandle++;
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
        throw new Error('invalid async handle: ' + handle);
      }
      microtaskCallbacks[idx] = null;
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

/**
 * @summary Collapse multiple callbacks into one invocation after a timer.
 */
class Debouncer {
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
}

let debouncerQueue = new Set();

/**
 * Adds a `Debouncer` to a list of globally flushable tasks.
 *
 * @param {!Debouncer} debouncer Debouncer to enqueue
 * @return {void}
 */
const enqueueDebouncer = function (debouncer) {
  debouncerQueue.add(debouncer);
};

/**
 * Flushes any enqueued debouncers
 *
 * @return {boolean} Returns whether any debouncers were flushed
 */
const flushDebouncers = function () {
  const didFlush = Boolean(debouncerQueue.size);
  // If new debouncers are added while flushing, Set.forEach will ensure
  // newly added ones are also flushed
  debouncerQueue.forEach((debouncer) => {
    try {
      debouncer.flush();
    } catch (e) {
      setTimeout(() => {
        throw e;
      });
    }
  });
  return didFlush;
};

const flush = () => {
  let debouncers;
  do {
    debouncers = flushDebouncers();
  } while (debouncers);
};

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Helper that provides a set of functions for RTL.
 */
class DirHelper {
  /**
   * Get the scroll type in the current browser view.
   *
   * @return {string} the scroll type. Possible values are `default|reverse|negative`
   */
  static detectScrollType() {
    const dummy = document.createElement('div');
    dummy.textContent = 'ABCD';
    dummy.dir = 'rtl';
    dummy.style.fontSize = '14px';
    dummy.style.width = '4px';
    dummy.style.height = '1px';
    dummy.style.position = 'absolute';
    dummy.style.top = '-1000px';
    dummy.style.overflow = 'scroll';
    document.body.appendChild(dummy);

    let cachedType = 'reverse';
    if (dummy.scrollLeft > 0) {
      cachedType = 'default';
    } else {
      dummy.scrollLeft = 2;
      if (dummy.scrollLeft < 2) {
        cachedType = 'negative';
      }
    }
    document.body.removeChild(dummy);
    return cachedType;
  }

  /**
   * Get the scrollLeft value of the element relative to the direction
   *
   * @param {string} scrollType type of the scroll detected with `detectScrollType`
   * @param {string} direction current direction of the element
   * @param {Element} element
   * @return {number} the scrollLeft value.
   */
  static getNormalizedScrollLeft(scrollType, direction, element) {
    const { scrollLeft } = element;
    if (direction !== 'rtl' || !scrollType) {
      return scrollLeft;
    }

    switch (scrollType) {
      case 'negative':
        return element.scrollWidth - element.clientWidth + scrollLeft;
      case 'reverse':
        return element.scrollWidth - element.clientWidth - scrollLeft;
    }
    return scrollLeft;
  }

  /**
   * Set the scrollLeft value of the element relative to the direction
   *
   * @param {string} scrollType type of the scroll detected with `detectScrollType`
   * @param {string} direction current direction of the element
   * @param {Element} element
   * @param {number} scrollLeft the scrollLeft value to be set
   */
  static setNormalizedScrollLeft(scrollType, direction, element, scrollLeft) {
    if (direction !== 'rtl' || !scrollType) {
      element.scrollLeft = scrollLeft;
      return;
    }

    switch (scrollType) {
      case 'negative':
        element.scrollLeft = element.clientWidth - element.scrollWidth + scrollLeft;
        break;
      case 'reverse':
        element.scrollLeft = element.scrollWidth - element.clientWidth - scrollLeft;
        break;
      default:
        element.scrollLeft = scrollLeft;
        break;
    }
  }
}

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * Array of Vaadin custom element classes that have been subscribed to the dir changes.
 */
const directionSubscribers = [];
const directionUpdater = function () {
  const documentDir = getDocumentDir();
  directionSubscribers.forEach((element) => {
    alignDirs(element, documentDir);
  });
};

let scrollType;

const directionObserver = new MutationObserver(directionUpdater);
directionObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });

const alignDirs = function (element, documentDir, elementDir = element.getAttribute('dir')) {
  if (documentDir) {
    element.setAttribute('dir', documentDir);
  } else if (elementDir != null) {
    element.removeAttribute('dir');
  }
};

const getDocumentDir = function () {
  return document.documentElement.getAttribute('dir');
};

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
          reflectToAttribute: true
        }
      };
    }

    /** @protected */
    static finalize() {
      super.finalize();

      if (!scrollType) {
        scrollType = DirHelper.detectScrollType();
      }
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      if (!this.hasAttribute('dir')) {
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
        this.__subscribe(false);
      }
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();
      this.__subscribe(false);
      this.removeAttribute('dir');
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
    __subscribe(push = true) {
      if (push) {
        directionSubscribers.indexOf(this) === -1 && directionSubscribers.push(this);
      } else {
        directionSubscribers.indexOf(this) > -1 && directionSubscribers.splice(directionSubscribers.indexOf(this), 1);
      }
    }

    /**
     * @param {Element} element
     * @return {number}
     * @protected
     */
    __getNormalizedScrollLeft(element) {
      return DirHelper.getNormalizedScrollLeft(scrollType, this.getAttribute('dir') || 'ltr', element);
    }

    /**
     * @param {Element} element
     * @param {number} scrollLeft
     * @protected
     */
    __setNormalizedScrollLeft(element, scrollLeft) {
      return DirHelper.setNormalizedScrollLeft(scrollType, this.getAttribute('dir') || 'ltr', element, scrollLeft);
    }
  };

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

window.Vaadin = window.Vaadin || {};

/**
 * Array of Vaadin custom element classes that have been finalized.
 */
window.Vaadin.registrations = window.Vaadin.registrations || [];

window.Vaadin.developmentModeCallback = window.Vaadin.developmentModeCallback || {};

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
      return '22.0.4';
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
          'Vaadin components require the "standards mode" declaration. Please add <!DOCTYPE html> to the HTML document.'
        );
      }
    }
  };

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin to delegate properties and attributes to a target element.
 *
 * @polymerMixin
 */
const DelegateStateMixin = dedupingMixin(
  (superclass) =>
    class DelegateStateMixinClass extends superclass {
      static get properties() {
        return {
          /**
           * A target element to which attributes and properties are delegated.
           * @protected
           */
          stateTarget: {
            type: Object,
            observer: '_stateTargetChanged'
          }
        };
      }

      /**
       * An array of the host attributes to delegate to the target element.
       */
      static get delegateAttrs() {
        return [];
      }

      /**
       * An array of the host properties to delegate to the target element.
       */
      static get delegateProps() {
        return [];
      }

      /** @protected */
      ready() {
        super.ready();

        this._createDelegateAttrsObserver();
        this._createDelegatePropsObserver();
      }

      /** @protected */
      _stateTargetChanged(target) {
        if (target) {
          this._ensureAttrsDelegated();
          this._ensurePropsDelegated();
        }
      }

      /** @protected */
      _createDelegateAttrsObserver() {
        this._createMethodObserver(`_delegateAttrsChanged(${this.constructor.delegateAttrs.join(', ')})`);
      }

      /** @protected */
      _createDelegatePropsObserver() {
        this._createMethodObserver(`_delegatePropsChanged(${this.constructor.delegateProps.join(', ')})`);
      }

      /** @protected */
      _ensureAttrsDelegated() {
        this.constructor.delegateAttrs.forEach((name) => {
          this._delegateAttribute(name, this[name]);
        });
      }

      /** @protected */
      _ensurePropsDelegated() {
        this.constructor.delegateProps.forEach((name) => {
          this._delegateProperty(name, this[name]);
        });
      }

      /** @protected */
      _delegateAttrsChanged(...values) {
        this.constructor.delegateAttrs.forEach((name, index) => {
          this._delegateAttribute(name, values[index]);
        });
      }

      /** @protected */
      _delegatePropsChanged(...values) {
        this.constructor.delegateProps.forEach((name, index) => {
          this._delegateProperty(name, values[index]);
        });
      }

      /** @protected */
      _delegateAttribute(name, value) {
        if (!this.stateTarget) {
          return;
        }

        if (name === 'invalid') {
          this._delegateAttribute('aria-invalid', value ? 'true' : false);
        }

        if (typeof value === 'boolean') {
          this.stateTarget.toggleAttribute(name, value);
        } else if (value) {
          this.stateTarget.setAttribute(name, value);
        } else {
          this.stateTarget.removeAttribute(name);
        }
      }

      /** @protected */
      _delegateProperty(name, value) {
        if (!this.stateTarget) {
          return;
        }

        this.stateTarget[name] = value;
      }
    }
);

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin to store the reference to an input element
 * and add input and change event listeners to it.
 *
 * @polymerMixin
 */
const InputMixin = dedupingMixin(
  (superclass) =>
    class InputMixinClass extends superclass {
      static get properties() {
        return {
          /**
           * A reference to the input element controlled by the mixin.
           * Any component implementing this mixin is expected to provide it
           * by using `this._setInputElement(input)` Polymer API.
           *
           * A typical case is using `InputController` that does this automatically.
           * However, the input element does not have to always be native <input>:
           * as an example, <vaadin-combo-box-light> accepts other components.
           *
           * @protected
           * @type {!HTMLElement}
           */
          inputElement: {
            type: Object,
            readOnly: true,
            observer: '_inputElementChanged'
          },

          /**
           * String used to define input type.
           * @protected
           */
          type: {
            type: String,
            readOnly: true
          },

          /**
           * The value of the field.
           */
          value: {
            type: String,
            value: '',
            observer: '_valueChanged',
            notify: true
          }
        };
      }

      constructor() {
        super();

        this._boundOnInput = this._onInput.bind(this);
        this._boundOnChange = this._onChange.bind(this);
      }

      /**
       * Clear the value of the field.
       */
      clear() {
        this.value = '';
      }

      /**
       * Add event listeners to the input element instance.
       * Override this method to add custom listeners.
       * @param {!HTMLElement} input
       */
      _addInputListeners(input) {
        input.addEventListener('input', this._boundOnInput);
        input.addEventListener('change', this._boundOnChange);
      }

      /**
       * Remove event listeners from the input element instance.
       * @param {!HTMLElement} input
       */
      _removeInputListeners(input) {
        input.removeEventListener('input', this._boundOnInput);
        input.removeEventListener('change', this._boundOnChange);
      }

      /**
       * A method to forward the value property set on the field
       * programmatically back to the input element value.
       * Override this method to perform additional checks,
       * for example to skip this in certain conditions.
       * @param {string} value
       * @protected
       * @override
       */
      _forwardInputValue(value) {
        // Value might be set before an input element is initialized.
        // This case should be handled separately by a component that
        // implements this mixin, for example in `connectedCallback`.
        if (!this.inputElement) {
          return;
        }

        if (value != undefined) {
          this.inputElement.value = value;
        } else {
          this.inputElement.value = '';
        }
      }

      /** @protected */
      _inputElementChanged(input, oldInput) {
        if (input) {
          this._addInputListeners(input);
        } else if (oldInput) {
          this._removeInputListeners(oldInput);
        }
      }

      /**
       * An input event listener used to update the field value.
       * Override this method with an actual implementation.
       * @param {Event} _event
       * @protected
       * @override
       */
      _onInput(event) {
        // Ignore fake input events e.g. used by clear button.
        this.__userInput = event.isTrusted;
        this.value = event.target.value;
        this.__userInput = false;
      }

      /**
       * A change event listener.
       * Override this method with an actual implementation.
       * @param {Event} _event
       * @protected
       * @override
       */
      _onChange(_event) {}

      /**
       * Toggle the has-value attribute based on the value property.
       * @param {boolean} hasValue
       * @protected
       */
      _toggleHasValue(hasValue) {
        this.toggleAttribute('has-value', hasValue);
      }

      /**
       * Observer called when a value property changes.
       * @param {string | undefined} newVal
       * @param {string | undefined} oldVal
       * @protected
       * @override
       */
      _valueChanged(newVal, oldVal) {
        this._toggleHasValue(newVal !== '' && newVal != null);

        // Setting initial value to empty string, do nothing.
        if (newVal === '' && oldVal === undefined) {
          return;
        }

        // Value is set by the user, no need to sync it back to input.
        if (this.__userInput) {
          return;
        }

        // Setting a value programmatically, sync it to input element.
        this._forwardInputValue(newVal);
      }
    }
);

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin to manage the checked state.
 *
 * @polymerMixin
 * @mixes DelegateStateMixin
 * @mixes DisabledMixin
 * @mixes InputMixin
 */
const CheckedMixin = dedupingMixin(
  (superclass) =>
    class CheckedMixinClass extends DelegateStateMixin(DisabledMixin(InputMixin(superclass))) {
      static get properties() {
        return {
          /**
           * True if the element is checked.
           * @type {boolean}
           */
          checked: {
            type: Boolean,
            value: false,
            notify: true,
            reflectToAttribute: true
          }
        };
      }

      static get delegateProps() {
        return [...super.delegateProps, 'checked'];
      }

      /**
       * @protected
       * @override
       */
      _onChange(event) {
        this._toggleChecked(event.target.checked);
      }

      /** @protected */
      _toggleChecked(checked) {
        this.checked = checked;
      }
    }
);

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
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
  { capture: true }
);

window.addEventListener(
  'mousedown',
  () => {
    keyboardActive = false;
  },
  { capture: true }
);

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
        return keyboardActive;
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
        // input field on iOS after “Done” is pressed.
        super.ready();
      }

      /** @protected */
      disconnectedCallback() {
        super.disconnectedCallback();

        // in non-Chrome browsers, blur does not fire on the element when it is disconnected.
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

        // focus-ring is true when the element was focused from the keyboard.
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
    }
);

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin to forward focus to an element in the light DOM.
 *
 * @polymerMixin
 * @mixes DisabledMixin
 * @mixes FocusMixin
 */
const DelegateFocusMixin = dedupingMixin(
  (superclass) =>
    class DelegateFocusMixinClass extends FocusMixin(DisabledMixin(superclass)) {
      static get properties() {
        return {
          /**
           * Specify that this control should have input focus when the page loads.
           */
          autofocus: {
            type: Boolean
          },

          /**
           * A reference to the focusable element controlled by the mixin.
           * It can be an input, textarea, button or any element with tabindex > -1.
           *
           * Any component implementing this mixin is expected to provide it
           * by using `this._setFocusElement(input)` Polymer API.
           *
           * @protected
           * @type {!HTMLElement}
           */
          focusElement: {
            type: Object,
            readOnly: true,
            observer: '_focusElementChanged'
          }
        };
      }

      constructor() {
        super();

        this._boundOnBlur = this._onBlur.bind(this);
        this._boundOnFocus = this._onFocus.bind(this);
      }

      /** @protected */
      ready() {
        super.ready();

        if (this.autofocus && !this.disabled) {
          requestAnimationFrame(() => {
            this.focus();
            this.setAttribute('focus-ring', '');
          });
        }
      }

      /**
       * @protected
       * @override
       */
      focus() {
        if (!this.focusElement || this.disabled) {
          return;
        }

        this.focusElement.focus();
        this._setFocused(true);
      }

      /**
       * @protected
       * @override
       */
      blur() {
        if (!this.focusElement) {
          return;
        }
        this.focusElement.blur();
        this._setFocused(false);
      }

      /**
       * @protected
       * @override
       */
      click() {
        if (this.focusElement && !this.disabled) {
          this.focusElement.click();
        }
      }

      /** @protected */
      _focusElementChanged(element, oldElement) {
        if (element) {
          element.disabled = this.disabled;
          this._addFocusListeners(element);
        } else if (oldElement) {
          this._removeFocusListeners(oldElement);
        }
      }

      /**
       * @param {HTMLElement} element
       * @protected
       */
      _addFocusListeners(element) {
        element.addEventListener('blur', this._boundOnBlur);
        element.addEventListener('focus', this._boundOnFocus);
      }

      /**
       * @param {HTMLElement} element
       * @protected
       */
      _removeFocusListeners(element) {
        element.removeEventListener('blur', this._boundOnBlur);
        element.removeEventListener('focus', this._boundOnFocus);
      }

      /**
       * Focus event does not bubble, so we dispatch it manually
       * on the host element to support adding focus listeners
       * when the focusable element is placed in light DOM.
       * @param {FocusEvent} event
       * @protected
       */
      _onFocus(event) {
        event.stopPropagation();
        this.dispatchEvent(new Event('focus'));
      }

      /**
       * Blur event does not bubble, so we dispatch it manually
       * on the host element to support adding blur listeners
       * when the focusable element is placed in light DOM.
       * @param {FocusEvent} event
       * @protected
       */
      _onBlur(event) {
        event.stopPropagation();
        this.dispatchEvent(new Event('blur'));
      }

      /**
       * @param {Event} event
       * @return {boolean}
       * @protected
       * @override
       */
      _shouldSetFocus(event) {
        return event.target === this.focusElement;
      }

      /**
       * @param {boolean} disabled
       * @protected
       */
      _disabledChanged(disabled) {
        super._disabledChanged(disabled);

        if (this.focusElement) {
          this.focusElement.disabled = disabled;
        }

        if (disabled) {
          this.blur();
        }
      }
    }
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
    const wrapped = wrap(node);
    if (isSlot(node)) {
      node = /** @type {!HTMLSlotElement} */(node); // eslint-disable-line no-self-assign
      return wrapped.assignedNodes({flatten: true});
    } else {
      return Array.from(wrapped.childNodes).map((node) => {
        if (isSlot(node)) {
          node = /** @type {!HTMLSlotElement} */(node); // eslint-disable-line no-self-assign
          return wrap(node).assignedNodes({flatten: true});
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
    } else if (wrap(this._target).children) {
      this._listenSlots(
          /** @type {!NodeList<!Node>} */ (wrap(this._target).children));
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
    } else if (wrap(this._target).children) {
      this._unlistenSlots(
          /** @type {!NodeList<!Node>} */ (wrap(this._target).children));
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
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A controller for providing content to slot element and observing changes.
 */
class SlotController extends EventTarget {
  constructor(host, slotName, slotFactory, slotInitializer) {
    super();

    this.host = host;
    this.slotName = slotName;
    this.slotFactory = slotFactory;
    this.slotInitializer = slotInitializer;
    this.defaultId = SlotController.generateId(slotName, host);
  }

  /**
   * Ensure that every instance has unique ID.
   *
   * @param {string} slotName
   * @param {HTMLElement} host
   * @return {string}
   * @protected
   */
  static generateId(slotName, host) {
    const prefix = slotName || 'default';

    // Maintain the unique ID counter for a given prefix.
    this[`${prefix}Id`] = 1 + this[`${prefix}Id`] || 0;

    return `${prefix}-${host.localName}-${this[`${prefix}Id`]}`;
  }

  hostConnected() {
    if (!this.initialized) {
      let node = this.getSlotChild();

      if (!node) {
        node = this.attachDefaultNode();
      } else {
        this.node = node;
        this.initCustomNode(node);
      }

      this.initNode(node);

      // TODO: Consider making this behavior opt-in to improve performance.
      this.observe();

      this.initialized = true;
    }
  }

  /**
   * Create and attach default node using the slot factory.
   * @return {Node | undefined}
   * @protected
   */
  attachDefaultNode() {
    const { host, slotName, slotFactory } = this;

    // Check if the node was created previously and if so, reuse it.
    let node = this.defaultNode;

    // Slot factory is optional, some slots don't have default content.
    if (!node && slotFactory) {
      node = slotFactory(host);
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
   * Return a reference to the node managed by the controller.
   * @return {Node}
   */
  getSlotChild() {
    const { slotName } = this;
    return Array.from(this.host.childNodes).find((node) => {
      // Either an element (any slot) or a text node (only un-named slot).
      return (
        (node.nodeType === Node.ELEMENT_NODE && node.slot === slotName) ||
        (node.nodeType === Node.TEXT_NODE && node.textContent.trim() && slotName === '')
      );
    });
  }

  /**
   * @param {Node} node
   * @protected
   */
  initNode(node) {
    const { slotInitializer } = this;
    // Don't try to bind `this` to initializer (normally it's arrow function).
    // Instead, pass the host as a first argument to access component's state.
    if (slotInitializer) {
      slotInitializer(this.host, node);
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
   * Setup the observer to manage slot content changes.
   * @protected
   */
  observe() {
    const { slotName } = this;
    const selector = slotName === '' ? 'slot:not([name])' : `slot[name=${slotName}]`;
    const slot = this.host.shadowRoot.querySelector(selector);

    this.__slotObserver = new FlattenedNodesObserver(slot, (info) => {
      // TODO: support default slot with multiple nodes (e.g. confirm-dialog)
      const current = this.node;
      const newNode = info.addedNodes.find((node) => node !== current);

      if (info.removedNodes.length) {
        info.removedNodes.forEach((node) => {
          this.teardownNode(node);
        });
      }

      if (newNode) {
        // Custom node is added, remove the current one.
        if (current && current.isConnected) {
          this.host.removeChild(current);
        }

        this.node = newNode;

        if (newNode !== this.defaultNode) {
          this.initCustomNode(newNode);

          this.initNode(newNode);
        }
      }
    });
  }
}

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A controller to create and initialize slotted `<input>` element.
 */
class InputController extends SlotController {
  constructor(host, callback) {
    super(
      host,
      'input',
      () => document.createElement('input'),
      (host, node) => {
        if (host.value) {
          node.setAttribute('value', host.value);
        }
        if (host.type) {
          node.setAttribute('type', host.type);
        }

        // Ensure every instance has unique ID
        const uniqueId = (InputController._uniqueInputId = 1 + InputController._uniqueInputId || 0);
        host._inputId = `${host.localName}-${uniqueId}`;
        node.id = host._inputId;

        if (typeof callback == 'function') {
          callback(node);
        }
      }
    );
  }
}

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A controller to manage the label element.
 */
class LabelController extends SlotController {
  constructor(host) {
    super(
      host,
      'label',
      () => document.createElement('label'),
      (_host, node) => {
        // Set ID attribute or use the existing one.
        this.__updateLabelId(node);

        // Set text content for the default label.
        this.__updateDefaultLabel(this.label);

        this.__observeLabel(node);
      }
    );
  }

  /**
   * @return {string}
   */
  get labelId() {
    return this.node.id;
  }

  /**
   * Override to initialize the newly added custom label.
   *
   * @param {Node} labelNode
   * @protected
   * @override
   */
  initCustomNode(labelNode) {
    const hasLabel = this.__hasLabel(labelNode);
    this.__toggleHasLabel(hasLabel);
  }

  /**
   * Override to cleanup label node when it's removed.
   *
   * @param {Node} node
   * @protected
   * @override
   */
  teardownNode(node) {
    if (this.__labelObserver) {
      this.__labelObserver.disconnect();
    }

    let labelNode = this.getSlotChild();

    // If custom label was removed, restore the default one.
    if (!labelNode && node !== this.defaultNode) {
      labelNode = this.attachDefaultNode();

      // Run initializer to update default label and ID.
      this.initNode(labelNode);
    }

    const hasLabel = this.__hasLabel(labelNode);
    this.__toggleHasLabel(hasLabel);
  }

  /**
   * Set label based on corresponding host property.
   *
   * @param {string} label
   */
  setLabel(label) {
    this.label = label;

    this.__updateDefaultLabel(label);
  }

  /**
   * @param {HTMLElement} labelNode
   * @return {boolean}
   * @private
   */
  __hasLabel(labelNode) {
    if (!labelNode) {
      return false;
    }

    return labelNode.children.length > 0 || this.__isNotEmpty(labelNode.textContent);
  }

  /**
   * @param {string} label
   * @private
   */
  __isNotEmpty(label) {
    return Boolean(label && label.trim() !== '');
  }

  /**
   * @param {HTMLElement} labelNode
   * @private
   */
  __observeLabel(labelNode) {
    this.__labelObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const target = mutation.target;

        // Ensure the mutation target is the currently connected label
        // to ignore async mutations dispatched for removed element.
        const isLabelMutation = target === this.node;

        if (mutation.type === 'attributes') {
          // We use attributeFilter to only observe ID mutation,
          // no need to check for attribute name separately.
          if (isLabelMutation && target.id !== this.defaultId) {
            this.__updateLabelId(target);
          }
        } else if (isLabelMutation || target.parentElement === this.node) {
          // Update has-label when textContent changes
          const hasLabel = this.__hasLabel(this.node);
          this.__toggleHasLabel(hasLabel);
        }
      });
    });

    // Observe changes to label ID attribute, text content and children.
    this.__labelObserver.observe(labelNode, {
      attributes: true,
      attributeFilter: ['id'],
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  /**
   * @param {boolean} hasLabel
   * @private
   */
  __toggleHasLabel(hasLabel) {
    this.host.toggleAttribute('has-label', hasLabel);

    // Make it possible for other mixins to observe change
    this.dispatchEvent(
      new CustomEvent('label-changed', {
        detail: {
          hasLabel,
          node: this.node
        }
      })
    );
  }

  /**
   * @param {string} label
   * @private
   */
  __updateDefaultLabel(label) {
    if (this.defaultNode) {
      this.defaultNode.textContent = label;

      // Update has-label if default label is used
      if (this.defaultNode === this.node) {
        const hasLabel = this.__isNotEmpty(label);
        this.__toggleHasLabel(hasLabel);
      }
    }
  }

  /**
   * @param {HTMLElement} labelNode
   * @private
   */
  __updateLabelId(labelNode) {
    if (!labelNode.id) {
      labelNode.id = this.defaultId;
    }
  }
}

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin to provide label via corresponding property or named slot.
 *
 * @polymerMixin
 * @mixes SlotMixin
 */
const LabelMixin = dedupingMixin(
  (superclass) =>
    class LabelMixinClass extends ControllerMixin(superclass) {
      static get properties() {
        return {
          /**
           * The label text for the input node.
           * When no light dom defined via [slot=label], this value will be used.
           */
          label: {
            type: String,
            observer: '_labelChanged'
          }
        };
      }

      /** @protected */
      get _labelId() {
        return this._labelController.labelId;
      }

      /** @protected */
      get _labelNode() {
        return this._labelController.node;
      }

      constructor() {
        super();

        this._labelController = new LabelController(this);
        this.addController(this._labelController);
      }

      /** @protected */
      _labelChanged(label) {
        this._labelController.setLabel(label);
      }
    }
);

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A controller for linking a `<label>` element with an `<input>` element.
 */
class LabelledInputController {
  constructor(input, labelController) {
    this.input = input;
    this.__preventDuplicateLabelClick = this.__preventDuplicateLabelClick.bind(this);

    labelController.addEventListener('label-changed', (event) => {
      this.__initLabel(event.detail.node);
    });

    // Initialize the default label element
    this.__initLabel(labelController.node);
  }

  /**
   * @param {HTMLElement} label
   * @private
   */
  __initLabel(label) {
    if (label) {
      label.addEventListener('click', this.__preventDuplicateLabelClick);

      if (this.input) {
        label.setAttribute('for', this.input.id);
      }
    }
  }

  /**
   * The native platform fires an event for both the click on the label, and also
   * the subsequent click on the native input element caused by label click.
   * This results in two click events arriving at the host, but we only want one.
   * This method prevents the duplicate click and ensures the correct isTrusted event
   * with the correct event.target arrives at the host.
   * @private
   */
  __preventDuplicateLabelClick() {
    const inputClickHandler = (e) => {
      e.stopImmediatePropagation();
      this.input.removeEventListener('click', inputClickHandler);
    };
    this.input.addEventListener('click', inputClickHandler);
  }
}

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A controller to copy the content from a source slot to a target element.
 */
class SlotTargetController {
  constructor(sourceSlot, targetFactory, callback) {
    /**
     * The source `<slot>` element to copy nodes from.
     */
    this.sourceSlot = sourceSlot;

    /**
     * Function used to get a reference to slot target.
     */
    this.targetFactory = targetFactory;

    /**
     * Function called after copying nodes to target.
     */
    this.copyCallback = callback;

    if (sourceSlot) {
      sourceSlot.addEventListener('slotchange', () => {
        // Copy in progress, ignore this event.
        if (this.__copying) {
          this.__copying = false;
        } else {
          this.__checkAndCopyNodesToSlotTarget();
        }
      });
    }
  }

  hostConnected() {
    this.__sourceSlotObserver = new MutationObserver(() => this.__checkAndCopyNodesToSlotTarget());

    // Ensure the content is up to date when host is connected
    // to handle e.g. mutating text content while disconnected.
    this.__checkAndCopyNodesToSlotTarget();
  }

  /**
   * Copies every node from the source slot to the target element
   * once the source slot' content is changed.
   *
   * @private
   */
  __checkAndCopyNodesToSlotTarget() {
    this.__sourceSlotObserver.disconnect();

    // Ensure slot target element is up to date.
    const slotTarget = this.targetFactory();

    if (!slotTarget) {
      return;
    }

    // Remove any existing clones from the slot target
    if (this.__slotTargetClones) {
      this.__slotTargetClones.forEach((node) => {
        if (node.parentElement === slotTarget) {
          slotTarget.removeChild(node);
        }
      });
      delete this.__slotTargetClones;
    }

    // Exclude whitespace text nodes
    const nodes = this.sourceSlot
      .assignedNodes({ flatten: true })
      .filter((node) => !(node.nodeType == Node.TEXT_NODE && node.textContent.trim() === ''));

    if (nodes.length > 0) {
      slotTarget.innerHTML = '';

      // Ignore next slotchange
      this.__copying = true;

      this.__copyNodesToSlotTarget(nodes, slotTarget);
    }
  }

  /**
   * Copies the nodes to the target element.
   *
   * @param {!Array<!Node>} nodes
   * @param {HTMLElement} slotTarget
   * @private
   */
  __copyNodesToSlotTarget(nodes, slotTarget) {
    this.__slotTargetClones = this.__slotTargetClones || [];

    nodes.forEach((node) => {
      // Clone the nodes and append the clones to the target
      const clone = node.cloneNode(true);
      this.__slotTargetClones.push(clone);

      slotTarget.appendChild(clone);

      // Observe all changes to the source node to have the clones updated
      this.__sourceSlotObserver.observe(node, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
      });
    });

    // Run callback e.g. to show a deprecation warning
    if (typeof this.copyCallback === 'function') {
      this.copyCallback(nodes);
    }
  }
}

/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * `<vaadin-checkbox>` is an input field representing a binary choice.
 *
 * ```html
 * <vaadin-checkbox label="I accept the terms and conditions"></vaadin-checkbox>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name   | Description
 * ------------|----------------
 * `checkbox`  | The wrapper element that contains slotted <input type="checkbox">.
 *
 * The following state attributes are available for styling:
 *
 * Attribute       | Description | Part name
 * ----------------|-------------|--------------
 * `active`        | Set when the checkbox is pressed down, either with mouse, touch or the keyboard. | `:host`
 * `disabled`      | Set when the checkbox is disabled. | `:host`
 * `focus-ring`    | Set when the checkbox is focused using the keyboard. | `:host`
 * `focused`       | Set when the checkbox is focused. | `:host`
 * `indeterminate` | Set when the checkbox is in the indeterminate state. | `:host`
 * `checked`       | Set when the checkbox is checked. | `:host`
 * `has-label`     | Set when the checkbox has a label. | `:host`
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {CustomEvent} checked-changed - Fired when the `checked` property changes.
 * @fires {CustomEvent} indeterminate-changed - Fired when the `indeterminate` property changes.
 *
 * @extends HTMLElement
 * @mixes ControllerMixin
 * @mixes ThemableMixin
 * @mixes ElementMixin
 * @mixes ActiveMixin
 * @mixes DelegateFocusMixin
 * @mixes CheckedMixin
 * @mixes LabelMixin
 */
class Checkbox extends LabelMixin(
  CheckedMixin(DelegateFocusMixin(ActiveMixin(ElementMixin(ThemableMixin(ControllerMixin(PolymerElement))))))
) {
  static get is() {
    return 'vaadin-checkbox';
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

        :host([disabled]) {
          -webkit-tap-highlight-color: transparent;
        }

        .vaadin-checkbox-container {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: baseline;
        }

        .vaadin-checkbox-wrapper {
          position: relative;
          height: 100%;
        }

        /* visually hidden */
        ::slotted(input) {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: inherit;
          margin: 0;
        }
      </style>
      <div class="vaadin-checkbox-container">
        <div class="vaadin-checkbox-wrapper">
          <div part="checkbox"></div>
          <slot name="input"></slot>
        </div>

        <slot name="label"></slot>

        <div style="display: none !important">
          <slot id="noop"></slot>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      /**
       * True if the checkbox is in the indeterminate state which means
       * it is not possible to say whether it is checked or unchecked.
       * The state is reset once the user switches the checkbox by hand.
       *
       * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#Indeterminate_state_checkboxes
       *
       * @type {boolean}
       */
      indeterminate: {
        type: Boolean,
        notify: true,
        value: false,
        reflectToAttribute: true
      },

      /**
       * The name of the checkbox.
       *
       * @type {string}
       */
      name: {
        type: String,
        value: ''
      }
    };
  }

  /** @override */
  static get delegateProps() {
    return [...super.delegateProps, 'indeterminate'];
  }

  /** @override */
  static get delegateAttrs() {
    return [...super.delegateAttrs, 'name'];
  }

  constructor() {
    super();

    this._setType('checkbox');

    // Set the string "on" as the default value for the checkbox following the HTML specification:
    // https://html.spec.whatwg.org/multipage/input.html#dom-input-value-default-on
    this.value = 'on';
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    if (!this._inputController) {
      this._inputController = new InputController(this, (input) => {
        this._setInputElement(input);
        this._setFocusElement(input);
        this.stateTarget = input;
        this.ariaTarget = input;
      });
      this.addController(this._inputController);
      this.addController(new LabelledInputController(this.inputElement, this._labelController));
      this.addController(
        new SlotTargetController(
          this.$.noop,
          () => this._labelController.node,
          () => this.__warnDeprecated()
        )
      );
    }
  }

  /** @private */
  __warnDeprecated() {
    console.warn(
      `WARNING: Since Vaadin 22, placing the label as a direct child of a <vaadin-checkbox> is deprecated.
Please use <label slot="label"> wrapper or the label property instead.`
    );
  }

  /**
   * Extends the method from `ActiveMixin` in order to
   * prevent setting the `active` attribute when interacting with a link inside the label.
   *
   * @param {Event} event
   * @return {boolean}
   * @protected
   * @override
   */
  _shouldSetActive(event) {
    if (event.target.localName === 'a') {
      return false;
    }

    return super._shouldSetActive(event);
  }

  /**
   * Extends the method from `CheckedMixin` in order to
   * reset the indeterminate state once the user switches the checkbox.
   *
   * @param {boolean} checked
   * @protected
   * @override
   */
  _toggleChecked(checked) {
    if (this.indeterminate) {
      this.indeterminate = false;
    }

    super._toggleChecked(checked);
  }
}

customElements.define(Checkbox.is, Checkbox);

registerStyles(
  'vaadin-grid',
  r`
    :host {
      font-family: var(--lumo-font-family);
      font-size: var(--lumo-font-size-m);
      line-height: var(--lumo-line-height-s);
      color: var(--lumo-body-text-color);
      background-color: var(--lumo-base-color);
      box-sizing: border-box;
      -webkit-text-size-adjust: 100%;
      -webkit-tap-highlight-color: transparent;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;

      /* For internal use only */
      --_lumo-grid-border-color: var(--lumo-contrast-20pct);
      --_lumo-grid-secondary-border-color: var(--lumo-contrast-10pct);
      --_lumo-grid-border-width: 1px;
      --_lumo-grid-selected-row-color: var(--lumo-primary-color-10pct);
    }

    /* No (outer) border */

    :host(:not([theme~='no-border'])) {
      border: var(--_lumo-grid-border-width) solid var(--_lumo-grid-border-color);
    }

    /* Cell styles */

    [part~='cell'] {
      min-height: var(--lumo-size-m);
      background-color: var(--lumo-base-color);
    }

    [part~='cell'] ::slotted(vaadin-grid-cell-content) {
      cursor: default;
      padding: var(--lumo-space-xs) var(--lumo-space-m);
    }

    /* Apply row borders by default and introduce the "no-row-borders" variant */
    :host(:not([theme~='no-row-borders'])) [part~='cell']:not([part~='details-cell']) {
      border-top: var(--_lumo-grid-border-width) solid var(--_lumo-grid-secondary-border-color);
    }

    /* Hide first body row top border */
    :host(:not([theme~='no-row-borders'])) [part='row'][first] [part~='cell']:not([part~='details-cell']) {
      border-top: 0;
      min-height: calc(var(--lumo-size-m) - var(--_lumo-grid-border-width));
    }

    /* Focus-ring */

    [part~='row'] {
      position: relative;
    }

    [part~='row']:focus,
    [part~='cell']:focus {
      outline: none;
    }

    :host([navigating]) [part~='row']:focus::before,
    :host([navigating]) [part~='cell']:focus::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      pointer-events: none;
      box-shadow: inset 0 0 0 2px var(--lumo-primary-color-50pct);
    }

    :host([navigating]) [part~='row']:focus::before {
      transform: translateX(calc(-1 * var(--_grid-horizontal-scroll-position)));
      z-index: 3;
    }

    /* Drag and Drop styles */
    :host([dragover])::after {
      content: '';
      position: absolute;
      z-index: 100;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      pointer-events: none;
      box-shadow: inset 0 0 0 2px var(--lumo-primary-color-50pct);
    }

    [part~='row'][dragover] {
      z-index: 100 !important;
    }

    [part~='row'][dragover] [part~='cell'] {
      overflow: visible;
    }

    [part~='row'][dragover] [part~='cell']::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      height: calc(var(--_lumo-grid-border-width) + 2px);
      pointer-events: none;
      background: var(--lumo-primary-color-50pct);
    }

    [part~='row'][dragover] [part~='cell'][last-frozen]::after {
      right: -1px;
    }

    :host([theme~='no-row-borders']) [dragover] [part~='cell']::after {
      height: 2px;
    }

    [part~='row'][dragover='below'] [part~='cell']::after {
      top: 100%;
      bottom: auto;
      margin-top: -1px;
    }

    :host([all-rows-visible]) [part~='row'][last][dragover='below'] [part~='cell']::after {
      height: 1px;
    }

    [part~='row'][dragover='above'] [part~='cell']::after {
      top: auto;
      bottom: 100%;
      margin-bottom: -1px;
    }

    [part~='row'][details-opened][dragover='below'] [part~='cell']:not([part~='details-cell'])::after,
    [part~='row'][details-opened][dragover='above'] [part~='details-cell']::after {
      display: none;
    }

    [part~='row'][dragover][dragover='on-top'] [part~='cell']::after {
      height: 100%;
      opacity: 0.5;
    }

    [part~='row'][dragstart] [part~='cell'] {
      border: none !important;
      box-shadow: none !important;
    }

    [part~='row'][dragstart] [part~='cell'][last-column] {
      border-radius: 0 var(--lumo-border-radius-s) var(--lumo-border-radius-s) 0;
    }

    [part~='row'][dragstart] [part~='cell'][first-column] {
      border-radius: var(--lumo-border-radius-s) 0 0 var(--lumo-border-radius-s);
    }

    [ios] [part~='row'][dragstart] [part~='cell'] {
      background: var(--lumo-primary-color-50pct);
    }

    #scroller:not([ios]) [part~='row'][dragstart]:not([dragstart=''])::after {
      display: block;
      position: absolute;
      left: var(--_grid-drag-start-x);
      top: var(--_grid-drag-start-y);
      z-index: 100;
      content: attr(dragstart);
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      padding: calc(var(--lumo-space-xs) * 0.8);
      color: var(--lumo-error-contrast-color);
      background-color: var(--lumo-error-color);
      border-radius: var(--lumo-border-radius-m);
      font-family: var(--lumo-font-family);
      font-size: var(--lumo-font-size-xxs);
      line-height: 1;
      font-weight: 500;
      text-transform: initial;
      letter-spacing: initial;
      min-width: calc(var(--lumo-size-s) * 0.7);
      text-align: center;
    }

    /* Headers and footers */

    [part~='header-cell'] ::slotted(vaadin-grid-cell-content),
    [part~='footer-cell'] ::slotted(vaadin-grid-cell-content),
    [part~='reorder-ghost'] {
      font-size: var(--lumo-font-size-s);
      font-weight: 500;
    }

    [part~='footer-cell'] ::slotted(vaadin-grid-cell-content) {
      font-weight: 400;
    }

    [part='row']:only-child [part~='header-cell'] {
      min-height: var(--lumo-size-xl);
    }

    /* Header borders */

    /* Hide first header row top border */
    :host(:not([theme~='no-row-borders'])) [part='row']:first-child [part~='header-cell'] {
      border-top: 0;
    }

    [part='row']:last-child [part~='header-cell'] {
      border-bottom: var(--_lumo-grid-border-width) solid transparent;
    }

    :host(:not([theme~='no-row-borders'])) [part='row']:last-child [part~='header-cell'] {
      border-bottom-color: var(--_lumo-grid-secondary-border-color);
    }

    /* Overflow uses a stronger border color */
    :host([overflow~='top']) [part='row']:last-child [part~='header-cell'] {
      border-bottom-color: var(--_lumo-grid-border-color);
    }

    /* Footer borders */

    [part='row']:first-child [part~='footer-cell'] {
      border-top: var(--_lumo-grid-border-width) solid transparent;
    }

    :host(:not([theme~='no-row-borders'])) [part='row']:first-child [part~='footer-cell'] {
      border-top-color: var(--_lumo-grid-secondary-border-color);
    }

    /* Overflow uses a stronger border color */
    :host([overflow~='bottom']) [part='row']:first-child [part~='footer-cell'] {
      border-top-color: var(--_lumo-grid-border-color);
    }

    /* Column reordering */

    :host([reordering]) [part~='cell'] {
      background: linear-gradient(var(--lumo-shade-20pct), var(--lumo-shade-20pct)) var(--lumo-base-color);
    }

    :host([reordering]) [part~='cell'][reorder-status='allowed'] {
      background: var(--lumo-base-color);
    }

    :host([reordering]) [part~='cell'][reorder-status='dragging'] {
      background: linear-gradient(var(--lumo-contrast-5pct), var(--lumo-contrast-5pct)) var(--lumo-base-color);
    }

    [part~='reorder-ghost'] {
      opacity: 0.85;
      box-shadow: var(--lumo-box-shadow-s);
      /* TODO Use the same styles as for the cell element (reorder-ghost copies styles from the cell element) */
      padding: var(--lumo-space-s) var(--lumo-space-m) !important;
    }

    /* Column resizing */

    [part='resize-handle'] {
      width: 3px;
      background-color: var(--lumo-primary-color-50pct);
      opacity: 0;
      transition: opacity 0.2s;
    }

    :host(:not([reordering])) *:not([column-resizing]) [part~='cell']:hover [part='resize-handle'],
    [part='resize-handle']:active {
      opacity: 1;
      transition-delay: 0.15s;
    }

    /* Column borders */

    :host([theme~='column-borders']) [part~='cell']:not([last-column]):not([part~='details-cell']) {
      border-right: var(--_lumo-grid-border-width) solid var(--_lumo-grid-secondary-border-color);
    }

    /* Frozen columns */

    [last-frozen] {
      border-right: var(--_lumo-grid-border-width) solid transparent;
      overflow: hidden;
    }

    :host([overflow~='left']) [part~='cell'][last-frozen]:not([part~='details-cell']) {
      border-right-color: var(--_lumo-grid-border-color);
    }

    /* Row stripes */

    :host([theme~='row-stripes']) [part~='row']:not([odd]) [part~='body-cell'],
    :host([theme~='row-stripes']) [part~='row']:not([odd]) [part~='details-cell'] {
      background-image: linear-gradient(var(--lumo-contrast-5pct), var(--lumo-contrast-5pct));
      background-repeat: repeat-x;
    }

    /* Selected row */

    /* Raise the selected rows above unselected rows (so that box-shadow can cover unselected rows) */
    :host(:not([reordering])) [part~='row'][selected] {
      z-index: 1;
    }

    :host(:not([reordering])) [part~='row'][selected] [part~='body-cell']:not([part~='details-cell']) {
      background-image: linear-gradient(var(--_lumo-grid-selected-row-color), var(--_lumo-grid-selected-row-color));
      background-repeat: repeat;
    }

    /* Cover the border of an unselected row */
    :host(:not([theme~='no-row-borders'])) [part~='row'][selected] [part~='cell']:not([part~='details-cell']) {
      box-shadow: 0 var(--_lumo-grid-border-width) 0 0 var(--_lumo-grid-selected-row-color);
    }

    /* Compact */

    :host([theme~='compact']) [part='row']:only-child [part~='header-cell'] {
      min-height: var(--lumo-size-m);
    }

    :host([theme~='compact']) [part~='cell'] {
      min-height: var(--lumo-size-s);
    }

    :host([theme~='compact']) [part='row'][first] [part~='cell']:not([part~='details-cell']) {
      min-height: calc(var(--lumo-size-s) - var(--_lumo-grid-border-width));
    }

    :host([theme~='compact']) [part~='cell'] ::slotted(vaadin-grid-cell-content) {
      padding: var(--lumo-space-xs) var(--lumo-space-s);
    }

    /* Wrap cell contents */

    :host([theme~='wrap-cell-content']) [part~='cell'] ::slotted(vaadin-grid-cell-content) {
      white-space: normal;
    }

    /* RTL specific styles */

    :host([dir='rtl']) [part~='row'][dragstart] [part~='cell'][last-column] {
      border-radius: var(--lumo-border-radius-s) 0 0 var(--lumo-border-radius-s);
    }

    :host([dir='rtl']) [part~='row'][dragstart] [part~='cell'][first-column] {
      border-radius: 0 var(--lumo-border-radius-s) var(--lumo-border-radius-s) 0;
    }

    :host([dir='rtl'][theme~='column-borders']) [part~='cell']:not([last-column]):not([part~='details-cell']) {
      border-right: none;
      border-left: var(--_lumo-grid-border-width) solid var(--_lumo-grid-secondary-border-color);
    }

    :host([dir='rtl']) [last-frozen] {
      border-right: none;
      border-left: var(--_lumo-grid-border-width) solid transparent;
    }

    :host([dir='rtl'][overflow~='right']) [part~='cell'][last-frozen]:not([part~='details-cell']) {
      border-left-color: var(--_lumo-grid-border-color);
    }
  `,
  { moduleId: 'lumo-grid' }
);

registerStyles(
  'vaadin-checkbox',
  r`
    :host(.vaadin-grid-select-all-checkbox) {
      font-size: var(--lumo-font-size-m);
    }
  `,
  { moduleId: 'vaadin-grid-select-all-checkbox-lumo' }
);

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
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
      `WARNING: <template> inside <${component.localName}> is no longer supported. Import @vaadin/polymer-legacy-adapter/template-renderer.js to enable compatibility.`
    );
  }
}

/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
const ColumnBaseMixin = (superClass) =>
  class ColumnBaseMixin extends superClass {
    static get properties() {
      return {
        /**
         * When set to true, the column is user-resizable.
         * @default false
         */
        resizable: {
          type: Boolean,
          value: function () {
            if (this.localName === 'vaadin-grid-column-group') {
              return;
            }

            const parent = this.parentNode;
            if (parent && parent.localName === 'vaadin-grid-column-group') {
              return parent.resizable || false;
            } else {
              return false;
            }
          }
        },

        /**
         * When true, the column is frozen. When a column inside of a column group is frozen,
         * all of the sibling columns inside the group will get frozen also.
         * @type {boolean}
         */
        frozen: {
          type: Boolean,
          value: false
        },

        /**
         * When set to true, the cells for this column are hidden.
         */
        hidden: {
          type: Boolean,
          value: false
        },

        /**
         * Text content to display in the header cell of the column.
         */
        header: {
          type: String
        },

        /**
         * Aligns the columns cell content horizontally.
         * Supported values: "start", "center" and "end".
         * @attr {start|center|end} text-align
         * @type {GridColumnTextAlign | null | undefined}
         */
        textAlign: {
          type: String
        },

        /**
         * @type {boolean}
         * @protected
         */
        _lastFrozen: {
          type: Boolean,
          value: false
        },

        /** @protected */
        _order: Number,

        /** @private */
        _reorderStatus: Boolean,

        /**
         * @type {Array<!HTMLElement>}
         * @protected
         */
        _emptyCells: Array,

        /** @private */
        _headerCell: Object,

        /** @private */
        _footerCell: Object,

        /** @protected */
        _grid: Object,

        /**
         * By default, the Polymer doesn't invoke the observer
         * during initialization if all of its dependencies are `undefined`.
         * This internal property can be used to force initial invocation of an observer
         * even the other dependencies of the observer are `undefined`.
         *
         * @private
         */
        __initialized: {
          type: Boolean,
          value: true
        },

        /**
         * Custom function for rendering the header content.
         * Receives two arguments:
         *
         * - `root` The header cell content DOM element. Append your content to it.
         * - `column` The `<vaadin-grid-column>` element.
         *
         * @type {GridHeaderFooterRenderer | null | undefined}
         */
        headerRenderer: Function,

        /**
         * Represents the final header renderer computed on the set of observable arguments.
         * It is supposed to be used internally when rendering the header cell content.
         *
         * @protected
         * @type {GridHeaderFooterRenderer | undefined}
         */
        _headerRenderer: {
          type: Function,
          computed: '_computeHeaderRenderer(headerRenderer, header, __initialized)'
        },

        /**
         * Custom function for rendering the footer content.
         * Receives two arguments:
         *
         * - `root` The footer cell content DOM element. Append your content to it.
         * - `column` The `<vaadin-grid-column>` element.
         *
         * @type {GridHeaderFooterRenderer | null | undefined}
         */
        footerRenderer: Function,

        /**
         * Represents the final footer renderer computed on the set of observable arguments.
         * It is supposed to be used internally when rendering the footer cell content.
         *
         * @protected
         * @type {GridHeaderFooterRenderer | undefined}
         */
        _footerRenderer: {
          type: Function,
          computed: '_computeFooterRenderer(footerRenderer, __initialized)'
        },

        /**
         * An internal property that is mainly used by `vaadin-template-renderer`
         * to identify grid column elements.
         *
         * @private
         */
        __gridColumnElement: {
          type: Boolean,
          value: true
        }
      };
    }

    static get observers() {
      return [
        '_widthChanged(width, _headerCell, _footerCell, _cells.*)',
        '_frozenChanged(frozen, _headerCell, _footerCell, _cells.*)',
        '_flexGrowChanged(flexGrow, _headerCell, _footerCell, _cells.*)',
        '_textAlignChanged(textAlign, _cells.*, _headerCell, _footerCell)',
        '_orderChanged(_order, _headerCell, _footerCell, _cells.*)',
        '_lastFrozenChanged(_lastFrozen)',
        '_onRendererOrBindingChanged(_renderer, _cells, _cells.*, path)',
        '_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header)',
        '_onFooterRendererOrBindingChanged(_footerRenderer, _footerCell)',
        '_resizableChanged(resizable, _headerCell)',
        '_reorderStatusChanged(_reorderStatus, _headerCell, _footerCell, _cells.*)',
        '_hiddenChanged(hidden, _headerCell, _footerCell, _cells.*)'
      ];
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      // Adds the column cells to the grid after the column is attached
      requestAnimationFrame(() => {
        // Skip if the column has been detached
        if (!this._grid) return;

        this._allCells.forEach((cell) => {
          if (!cell._content.parentNode) {
            this._grid.appendChild(cell._content);
          }
        });
      });
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      // Removes the column cells from the grid after the column is detached
      requestAnimationFrame(() => {
        // Skip if the column has been attached again
        if (this._grid) return;

        this._allCells.forEach((cell) => {
          if (cell._content.parentNode) {
            cell._content.parentNode.removeChild(cell._content);
          }
        });
      });

      this._gridValue = undefined;
    }

    /** @protected */
    ready() {
      super.ready();

      processTemplates(this);
    }

    /**
     * @return {!Grid | undefined}
     * @protected
     */
    _findHostGrid() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let el = this;
      // Custom elements extending grid must have a specific localName
      while (el && !/^vaadin.*grid(-pro)?$/.test(el.localName)) {
        el = el.assignedSlot ? el.assignedSlot.parentNode : el.parentNode;
      }
      return el || undefined;
    }

    /**
     * @return {!Grid | undefined}
     * @protected
     */
    get _grid() {
      if (!this._gridValue) {
        this._gridValue = this._findHostGrid();
      }
      return this._gridValue;
    }

    /**
     * @return {!Array<!HTMLElement>}
     * @protected
     */
    get _allCells() {
      return []
        .concat(this._cells || [])
        .concat(this._emptyCells || [])
        .concat(this._headerCell)
        .concat(this._footerCell)
        .filter((cell) => cell);
    }

    /** @protected */
    _renderHeaderAndFooter() {
      this._renderHeaderCellContent(this._headerRenderer, this._headerCell);
      this._renderFooterCellContent(this._footerRenderer, this._footerCell);
    }

    /** @private */
    _flexGrowChanged(flexGrow) {
      if (this.parentElement && this.parentElement._columnPropChanged) {
        this.parentElement._columnPropChanged('flexGrow');
      }

      this._allCells.forEach((cell) => (cell.style.flexGrow = flexGrow));
    }

    /** @private */
    _orderChanged(order) {
      this._allCells.forEach((cell) => (cell.style.order = order));
    }

    /** @private */
    _widthChanged(width) {
      if (this.parentElement && this.parentElement._columnPropChanged) {
        this.parentElement._columnPropChanged('width');
      }

      this._allCells.forEach((cell) => (cell.style.width = width));
    }

    /** @private */
    _frozenChanged(frozen) {
      if (this.parentElement && this.parentElement._columnPropChanged) {
        this.parentElement._columnPropChanged('frozen', frozen);
      }

      this._allCells.forEach((cell) => cell.toggleAttribute('frozen', frozen));

      this._grid && this._grid._frozenCellsChanged && this._grid._frozenCellsChanged();
    }

    /** @private */
    _lastFrozenChanged(lastFrozen) {
      this._allCells.forEach((cell) => cell.toggleAttribute('last-frozen', lastFrozen));

      if (this.parentElement && this.parentElement._columnPropChanged) {
        this.parentElement._lastFrozen = lastFrozen;
      }
    }

    /**
     * @param {string} path
     * @return {string}
     * @protected
     */
    _generateHeader(path) {
      return path
        .substr(path.lastIndexOf('.') + 1)
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase()
        .replace(/-/g, ' ')
        .replace(/^./, (match) => match.toUpperCase());
    }

    /** @private */
    _reorderStatusChanged(reorderStatus) {
      this._allCells.forEach((cell) => cell.setAttribute('reorder-status', reorderStatus));
    }

    /** @private */
    _resizableChanged(resizable, headerCell) {
      if (resizable === undefined || headerCell === undefined) {
        return;
      }

      if (headerCell) {
        [headerCell].concat(this._emptyCells).forEach((cell) => {
          if (cell) {
            const existingHandle = cell.querySelector('[part~="resize-handle"]');
            if (existingHandle) {
              cell.removeChild(existingHandle);
            }

            if (resizable) {
              const handle = document.createElement('div');
              handle.setAttribute('part', 'resize-handle');
              cell.appendChild(handle);
            }
          }
        });
      }
    }

    /** @private */
    _textAlignChanged(textAlign) {
      if (textAlign === undefined) {
        return;
      }
      if (['start', 'end', 'center'].indexOf(textAlign) === -1) {
        console.warn('textAlign can only be set as "start", "end" or "center"');
        return;
      }

      let textAlignFallback;
      if (getComputedStyle(this._grid).direction === 'ltr') {
        if (textAlign === 'start') {
          textAlignFallback = 'left';
        } else if (textAlign === 'end') {
          textAlignFallback = 'right';
        }
      } else {
        if (textAlign === 'start') {
          textAlignFallback = 'right';
        } else if (textAlign === 'end') {
          textAlignFallback = 'left';
        }
      }

      this._allCells.forEach((cell) => {
        cell._content.style.textAlign = textAlign;
        if (getComputedStyle(cell._content).textAlign !== textAlign) {
          cell._content.style.textAlign = textAlignFallback;
        }
      });
    }

    /** @private */
    _hiddenChanged(hidden) {
      if (this.parentElement && this.parentElement._columnPropChanged) {
        this.parentElement._columnPropChanged('hidden', hidden);
      }

      if (!!hidden !== !!this._previousHidden && this._grid) {
        if (hidden === true) {
          this._allCells.forEach((cell) => {
            if (cell._content.parentNode) {
              cell._content.parentNode.removeChild(cell._content);
            }
          });
        }
        this._grid._debouncerHiddenChanged = Debouncer.debounce(
          this._grid._debouncerHiddenChanged,
          animationFrame,
          () => {
            if (this._grid && this._grid._renderColumnTree) {
              this._grid._renderColumnTree(this._grid._columnTree);
            }
          }
        );

        this._grid._updateLastFrozen && this._grid._updateLastFrozen();
        this._grid._resetKeyboardNavigation && this._grid._resetKeyboardNavigation();
      }
      this._previousHidden = hidden;
    }

    /** @protected */
    _runRenderer(renderer, cell, model) {
      const args = [cell._content, this];
      if (model && model.item) {
        args.push(model);
      }

      renderer.apply(this, args);
    }

    /**
     * Renders the content to the given cells using a renderer.
     *
     * @private
     */
    __renderCellsContent(renderer, cells) {
      // Skip if the column is hidden or not attached to a grid.
      if (this.hidden || !this._grid) {
        return;
      }

      cells.forEach((cell) => {
        if (!cell.parentElement) {
          return;
        }

        const model = this._grid.__getRowModel(cell.parentElement);

        if (!renderer) return;

        if (cell._renderer !== renderer) {
          this._clearCellContent(cell);
        }

        cell._renderer = renderer;

        if (model.item || renderer === this._headerRenderer || renderer === this._footerRenderer) {
          this._runRenderer(renderer, cell, model);
        }
      });
    }

    /**
     * Clears the content of a cell.
     *
     * @protected
     */
    _clearCellContent(cell) {
      cell._content.innerHTML = '';
      // Whenever a Lit-based renderer is used, it assigns a Lit part to the node it was rendered into.
      // When clearing the rendered content, this part needs to be manually disposed of.
      // Otherwise, using a Lit-based renderer on the same node will throw an exception or render nothing afterward.
      delete cell._content._$litPart$;
    }

    /**
     * Renders the header cell content using a renderer,
     * and then updates the visibility of the parent row depending on
     * whether all its children cells are empty or not.
     *
     * @protected
     */
    _renderHeaderCellContent(headerRenderer, headerCell) {
      if (!headerCell || !headerRenderer) {
        return;
      }

      this.__renderCellsContent(headerRenderer, [headerCell]);
      if (this._grid) {
        this._grid.__updateHeaderFooterRowVisibility(headerCell.parentElement);
      }
    }

    /** @protected */
    _onHeaderRendererOrBindingChanged(headerRenderer, headerCell, ..._bindings) {
      this._renderHeaderCellContent(headerRenderer, headerCell);
    }

    /**
     * Renders the content of body cells using a renderer.
     *
     * @protected
     */
    _renderBodyCellsContent(renderer, cells) {
      if (!cells || !renderer) {
        return;
      }

      this.__renderCellsContent(renderer, cells);
    }

    /** @protected */
    _onRendererOrBindingChanged(renderer, cells, ..._bindings) {
      this._renderBodyCellsContent(renderer, cells);
    }

    /**
     * Renders the footer cell content using a renderer
     * and then updates the visibility of the parent row depending on
     * whether all its children cells are empty or not.
     *
     * @protected
     */
    _renderFooterCellContent(footerRenderer, footerCell) {
      if (!footerCell || !footerRenderer) {
        return;
      }

      this.__renderCellsContent(footerRenderer, [footerCell]);
      if (this._grid) {
        this._grid.__updateHeaderFooterRowVisibility(footerCell.parentElement);
      }
    }

    /** @protected */
    _onFooterRendererOrBindingChanged(footerRenderer, footerCell) {
      this._renderFooterCellContent(footerRenderer, footerCell);
    }

    /** @private */
    __setTextContent(node, textContent) {
      node.textContent !== textContent && (node.textContent = textContent);
    }

    /**
     * Renders the text header to the header cell.
     *
     * @private
     */
    __textHeaderRenderer() {
      this.__setTextContent(this._headerCell._content, this.header);
    }

    /**
     * Computes the property name based on the path and renders it to the header cell.
     * If the path is not defined, then nothing is rendered.
     *
     * @protected
     */
    _defaultHeaderRenderer() {
      if (!this.path) return;

      this.__setTextContent(this._headerCell._content, this._generateHeader(this.path));
    }

    /**
     * Computes the item property value based on the path and renders it to the body cell.
     * If the path is not defined, then nothing is rendered.
     *
     * @protected
     */
    _defaultRenderer(root, _owner, { item }) {
      if (!this.path) return;

      this.__setTextContent(root, this.get(this.path, item));
    }

    /**
     * By default, nothing is rendered to the footer cell.
     *
     * @protected
     */
    _defaultFooterRenderer() {}

    /**
     * Computes the final header renderer for the `_headerRenderer` computed property.
     * All the arguments are observable by the Polymer, it re-calls the method
     * once an argument is changed to update the property value.
     *
     * @protected
     * @return {GridHeaderFooterRenderer | undefined}
     */
    _computeHeaderRenderer(headerRenderer, header) {
      if (headerRenderer) {
        return headerRenderer;
      }

      if (header !== undefined && header !== null) {
        return this.__textHeaderRenderer;
      }

      return this._defaultHeaderRenderer;
    }

    /**
     * Computes the final renderer for the `_renderer` property.
     * All the arguments are observable by the Polymer, it re-calls the method
     * once an argument is changed to update the property value.
     *
     * @protected
     * @return {GridBodyRenderer | undefined}
     */
    _computeRenderer(renderer) {
      if (renderer) {
        return renderer;
      }

      return this._defaultRenderer;
    }

    /**
     * Computes the final footer renderer for the `_footerRenderer` property.
     * All the arguments are observable by the Polymer, it re-calls the method
     * once an argument is changed to update the property value.
     *
     * @protected
     * @return {GridHeaderFooterRenderer | undefined}
     */
    _computeFooterRenderer(footerRenderer) {
      if (footerRenderer) {
        return footerRenderer;
      }

      return this._defaultFooterRenderer;
    }
  };

/**
 * A `<vaadin-grid-column>` is used to configure how a column in `<vaadin-grid>`
 * should look like.
 *
 * See [`<vaadin-grid>`](#/elements/vaadin-grid) documentation for instructions on how
 * to configure the `<vaadin-grid-column>`.
 *
 * @extends HTMLElement
 * @mixes ColumnBaseMixin
 */
class GridColumn extends ColumnBaseMixin(DirMixin(PolymerElement)) {
  static get is() {
    return 'vaadin-grid-column';
  }

  static get properties() {
    return {
      /**
       * Width of the cells for this column.
       */
      width: {
        type: String,
        value: '100px'
      },

      /**
       * Flex grow ratio for the cell widths. When set to 0, cell width is fixed.
       * @attr {number} flex-grow
       * @type {number}
       */
      flexGrow: {
        type: Number,
        value: 1
      },

      /**
       * Custom function for rendering the cell content.
       * Receives three arguments:
       *
       * - `root` The cell content DOM element. Append your content to it.
       * - `column` The `<vaadin-grid-column>` element.
       * - `model` The object with the properties related with
       *   the rendered item, contains:
       *   - `model.index` The index of the item.
       *   - `model.item` The item.
       *   - `model.expanded` Sublevel toggle state.
       *   - `model.level` Level of the tree represented with a horizontal offset of the toggle button.
       *   - `model.selected` Selected state.
       *   - `model.detailsOpened` Details opened state.
       *
       * @type {GridBodyRenderer | null | undefined}
       */
      renderer: Function,

      /**
       * Represents the final renderer computed on the set of observable arguments.
       * It is supposed to be used internally when rendering the content of a body cell.
       *
       * @protected
       * @type {GridBodyRenderer | undefined}
       */
      _renderer: {
        type: Function,
        computed: '_computeRenderer(renderer, __initialized)'
      },

      /**
       * Path to an item sub-property whose value gets displayed in the column body cells.
       * The property name is also shown in the column header if an explicit header or renderer isn't defined.
       */
      path: {
        type: String
      },

      /**
       * Automatically sets the width of the column based on the column contents when this is set to `true`.
       *
       * For performance reasons the column width is calculated automatically only once when the grid items
       * are rendered for the first time and the calculation only considers the rows which are currently
       * rendered in DOM (a bit more than what is currently visible). If the grid is scrolled, or the cell
       * content changes, the column width might not match the contents anymore.
       *
       * Hidden columns are ignored in the calculation and their widths are not automatically updated when
       * you show a column that was initially hidden.
       *
       * You can manually trigger the auto sizing behavior again by calling `grid.recalculateColumnWidths()`.
       *
       * The column width may still grow larger when `flexGrow` is not 0.
       * @attr {boolean} auto-width
       * @type {boolean}
       */
      autoWidth: {
        type: Boolean,
        value: false
      },

      /**
       * @type {Array<!HTMLElement>}
       * @protected
       */
      _cells: Array
    };
  }
}

customElements.define(GridColumn.is, GridColumn);

/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

registerStyles(
  'vaadin-grid',
  r`
    @keyframes vaadin-grid-appear {
      to {
        opacity: 1;
      }
    }

    :host {
      display: block;
      animation: 1ms vaadin-grid-appear;
      height: 400px;
      flex: 1 1 auto;
      align-self: stretch;
      position: relative;
    }

    :host([hidden]) {
      display: none !important;
    }

    #scroller {
      display: block;
      transform: translateY(0);
      width: auto;
      height: auto;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }

    :host([all-rows-visible]) {
      height: auto;
      align-self: flex-start;
      flex-grow: 0;
      width: 100%;
    }

    :host([all-rows-visible]) #scroller {
      width: 100%;
      height: 100%;
      position: relative;
    }

    :host([all-rows-visible]) #items {
      min-height: 1px;
    }

    #table {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      overflow: auto;
      position: relative;
      outline: none;
      /* Workaround for a Desktop Safari bug: new stacking context here prevents the scrollbar from getting hidden */
      z-index: 0;
    }

    #header,
    #footer {
      transform: translateX(var(--_grid-horizontal-scroll-position));
      display: block;
      position: -webkit-sticky;
      position: sticky;
      left: 0;
      overflow: visible;
      width: 100%;
      z-index: 1;
    }

    #header {
      top: 0;
    }

    th {
      text-align: inherit;
    }

    /* Safari doesn't work with "inherit" */
    [safari] th {
      text-align: initial;
    }

    #footer {
      bottom: 0;
    }

    #items {
      transform: translateX(var(--_grid-horizontal-scroll-position));
      flex-grow: 1;
      flex-shrink: 0;
      display: block;
      position: -webkit-sticky;
      position: sticky;
      width: 100%;
      left: 0;
      overflow: visible;
    }

    [part~='row'] {
      display: flex;
      width: 100%;
      box-sizing: border-box;
      margin: 0;
    }

    [part~='row'][loading] [part~='body-cell'] ::slotted(vaadin-grid-cell-content) {
      opacity: 0;
    }

    #items [part~='row'] {
      position: absolute;
    }

    #items [part~='row']:empty {
      height: 100%;
    }

    [part~='cell']:not([part~='details-cell']) {
      flex-shrink: 0;
      flex-grow: 1;
      box-sizing: border-box;
      display: flex;
      width: 100%;
      position: relative;
      align-items: center;
      padding: 0;
      white-space: nowrap;
    }

    [part~='details-cell'] {
      position: absolute;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 0;
    }

    [part~='cell'] ::slotted(vaadin-grid-cell-content) {
      display: block;
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    [hidden] {
      display: none !important;
    }

    [frozen] {
      z-index: 2;
      transform: translateX(calc(-1 * var(--_grid-horizontal-scroll-position)));
      will-change: transform;
    }

    [no-scrollbars][safari] #table,
    [no-scrollbars][firefox] #table {
      overflow: hidden;
    }

    /* Reordering styles */
    :host([reordering]) [part~='cell'] ::slotted(vaadin-grid-cell-content),
    :host([reordering]) [part~='resize-handle'],
    #scroller[no-content-pointer-events] [part~='cell'] ::slotted(vaadin-grid-cell-content) {
      pointer-events: none;
    }

    [part~='reorder-ghost'] {
      visibility: hidden;
      position: fixed;
      pointer-events: none;
      opacity: 0.5;

      /* Prevent overflowing the grid in Firefox */
      top: 0;
      left: 0;
    }

    :host([reordering]) {
      -moz-user-select: none;
      -webkit-user-select: none;
      user-select: none;
    }

    /* Resizing styles */
    [part~='resize-handle'] {
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      cursor: col-resize;
      z-index: 1;
    }

    [part~='resize-handle']::before {
      position: absolute;
      content: '';
      height: 100%;
      width: 35px;
      transform: translateX(-50%);
    }

    [last-column] [part~='resize-handle']::before,
    [last-frozen] [part~='resize-handle']::before {
      width: 18px;
      transform: none;
      right: 0;
    }

    #scroller[column-resizing] {
      -ms-user-select: none;
      -moz-user-select: none;
      -webkit-user-select: none;
      user-select: none;
    }

    /* Sizer styles */
    #sizer {
      display: flex;
      position: absolute;
      visibility: hidden;
    }

    #sizer [part~='details-cell'] {
      display: none !important;
    }

    #sizer [part~='cell'][hidden] {
      display: none !important;
    }

    #sizer [part~='cell'] {
      display: block;
      flex-shrink: 0;
      line-height: 0;
      height: 0 !important;
      min-height: 0 !important;
      max-height: 0 !important;
      padding: 0 !important;
      border: none !important;
    }

    #sizer [part~='cell']::before {
      content: '-';
    }

    #sizer [part~='cell'] ::slotted(vaadin-grid-cell-content) {
      display: none !important;
    }

    /* RTL specific styles */

    :host([dir='rtl']) *:is(#items, #header, #footer, [frozen]) {
      transform: none;
    }

    :host([dir='rtl']) #items,
    :host([dir='rtl']) #header,
    :host([dir='rtl']) #footer {
      left: auto;
    }

    :host([dir='rtl']) [part~='reorder-ghost'] {
      left: auto;
      right: 0;
    }

    :host([dir='rtl']) [part~='resize-handle'] {
      left: 0;
      right: auto;
    }

    :host([dir='rtl']) [part~='resize-handle']::before {
      transform: translateX(50%);
    }

    :host([dir='rtl']) [last-column] [part~='resize-handle']::before,
    :host([dir='rtl']) [last-frozen] [part~='resize-handle']::before {
      left: 0;
      right: auto;
    }
  `,
  { moduleId: 'vaadin-grid-styles' }
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
 * Enqueues a callback which will be run before the next render, at
 * `requestAnimationFrame` timing.
 *
 * This method is useful for enqueuing work that requires DOM measurement,
 * since measurement may not be reliable in custom element callbacks before
 * the first render, as well as for batching measurement tasks in general.
 *
 * Tasks in this queue may be flushed by calling `flush()`.
 *
 * @param {*} context Context object the callback function will be bound to
 * @param {function(...*):void} callback Callback function
 * @param {!Array=} args An array of arguments to call the callback function with
 * @return {void}
 */
function beforeNextRender(context, callback, args) {
  if (!scheduled) {
    schedule();
  }
  beforeRenderQueue.push([context, callback, args]);
}

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const testUserAgent = (regexp) => regexp.test(navigator.userAgent);

const testPlatform = (regexp) => regexp.test(navigator.platform);

const testVendor = (regexp) => regexp.test(navigator.vendor);

const isAndroid = testUserAgent(/Android/);

testUserAgent(/Chrome/) && testVendor(/Google Inc/);

const isFirefox = testUserAgent(/Firefox/);

// iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
const isIPad = testPlatform(/^iPad/) || (testPlatform(/^Mac/) && navigator.maxTouchPoints > 1);

const isIPhone = testPlatform(/^iPhone/);

const isIOS = isIPhone || isIPad;

const isSafari = testUserAgent(/^((?!chrome|android).)*safari/i);

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
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

const IOS = navigator.userAgent.match(/iP(?:hone|ad;(?: U;)? CPU) OS (\d+)/);
const IOS_TOUCH_SCROLLING = IOS && IOS[1] >= 8;
const DEFAULT_PHYSICAL_COUNT = 3;

/**
 * @private
 */
const ironList = {
  /**
   * The ratio of hidden tiles that should remain in the scroll direction.
   * Recommended value ~0.5, so it will distribute tiles evenly in both
   * directions.
   */
  _ratio: 0.5,

  /**
   * The padding-top value for the list.
   */
  _scrollerPaddingTop: 0,

  /**
   * This value is a cached value of `scrollTop` from the last `scroll` event.
   */
  _scrollPosition: 0,

  /**
   * The sum of the heights of all the tiles in the DOM.
   */
  _physicalSize: 0,

  /**
   * The average `offsetHeight` of the tiles observed till now.
   */
  _physicalAverage: 0,

  /**
   * The number of tiles which `offsetHeight` > 0 observed until now.
   */
  _physicalAverageCount: 0,

  /**
   * The Y position of the item rendered in the `_physicalStart`
   * tile relative to the scrolling list.
   */
  _physicalTop: 0,

  /**
   * The number of items in the list.
   */
  _virtualCount: 0,

  /**
   * The estimated scroll height based on `_physicalAverage`
   */
  _estScrollHeight: 0,

  /**
   * The scroll height of the dom node
   */
  _scrollHeight: 0,

  /**
   * The height of the list. This is referred as the viewport in the context of
   * list.
   */
  _viewportHeight: 0,

  /**
   * The width of the list. This is referred as the viewport in the context of
   * list.
   */
  _viewportWidth: 0,

  /**
   * An array of DOM nodes that are currently in the tree
   * @type {?Array<!HTMLElement>}
   */
  _physicalItems: null,

  /**
   * An array of heights for each item in `_physicalItems`
   * @type {?Array<number>}
   */
  _physicalSizes: null,

  /**
   * A cached value for the first visible index.
   * See `firstVisibleIndex`
   * @type {?number}
   */
  _firstVisibleIndexVal: null,

  /**
   * A cached value for the last visible index.
   * See `lastVisibleIndex`
   * @type {?number}
   */
  _lastVisibleIndexVal: null,

  /**
   * The max number of pages to render. One page is equivalent to the height of
   * the list.
   */
  _maxPages: 2,

  /**
   * The maximum items per row
   */
  _itemsPerRow: 1,

  /**
   * The width of each grid item
   */
  _itemWidth: 0,

  /**
   * The height of the row in grid layout.
   */
  _rowHeight: 0,

  /**
   * The cost of stamping a template in ms.
   */
  _templateCost: 0,

  /**
   * Needed to pass event.model property to declarative event handlers -
   * see polymer/polymer#4339.
   */
  _parentModel: true,

  /**
   * The bottom of the physical content.
   */
  get _physicalBottom() {
    return this._physicalTop + this._physicalSize;
  },

  /**
   * The bottom of the scroll.
   */
  get _scrollBottom() {
    return this._scrollPosition + this._viewportHeight;
  },

  /**
   * The n-th item rendered in the last physical item.
   */
  get _virtualEnd() {
    return this._virtualStart + this._physicalCount - 1;
  },

  /**
   * The height of the physical content that isn't on the screen.
   */
  get _hiddenContentSize() {
    var size = this.grid ? this._physicalRows * this._rowHeight : this._physicalSize;
    return size - this._viewportHeight;
  },

  /**
   * The maximum scroll top value.
   */
  get _maxScrollTop() {
    return this._estScrollHeight - this._viewportHeight + this._scrollOffset;
  },

  /**
   * The largest n-th value for an item such that it can be rendered in
   * `_physicalStart`.
   */
  get _maxVirtualStart() {
    var virtualCount = this._convertIndexToCompleteRow(this._virtualCount);
    return Math.max(0, virtualCount - this._physicalCount);
  },

  set _virtualStart(val) {
    val = this._clamp(val, 0, this._maxVirtualStart);
    if (this.grid) {
      val = val - (val % this._itemsPerRow);
    }
    this._virtualStartVal = val;
  },

  get _virtualStart() {
    return this._virtualStartVal || 0;
  },

  /**
   * The k-th tile that is at the top of the scrolling list.
   */
  set _physicalStart(val) {
    val = val % this._physicalCount;
    if (val < 0) {
      val = this._physicalCount + val;
    }
    if (this.grid) {
      val = val - (val % this._itemsPerRow);
    }
    this._physicalStartVal = val;
  },

  get _physicalStart() {
    return this._physicalStartVal || 0;
  },

  /**
   * The k-th tile that is at the bottom of the scrolling list.
   */
  get _physicalEnd() {
    return (this._physicalStart + this._physicalCount - 1) % this._physicalCount;
  },

  set _physicalCount(val) {
    this._physicalCountVal = val;
  },

  get _physicalCount() {
    return this._physicalCountVal || 0;
  },

  /**
   * An optimal physical size such that we will have enough physical items
   * to fill up the viewport and recycle when the user scrolls.
   *
   * This default value assumes that we will at least have the equivalent
   * to a viewport of physical items above and below the user's viewport.
   */
  get _optPhysicalSize() {
    return this._viewportHeight === 0 ? Infinity : this._viewportHeight * this._maxPages;
  },

  /**
   * True if the current list is visible.
   */
  get _isVisible() {
    return Boolean(this.offsetWidth || this.offsetHeight);
  },

  /**
   * Gets the index of the first visible item in the viewport.
   *
   * @type {number}
   */
  get firstVisibleIndex() {
    var idx = this._firstVisibleIndexVal;
    if (idx == null) {
      var physicalOffset = this._physicalTop + this._scrollOffset;

      idx =
        this._iterateItems(function (pidx, vidx) {
          physicalOffset += this._getPhysicalSizeIncrement(pidx);

          if (physicalOffset > this._scrollPosition) {
            return this.grid ? vidx - (vidx % this._itemsPerRow) : vidx;
          }
          // Handle a partially rendered final row in grid mode
          if (this.grid && this._virtualCount - 1 === vidx) {
            return vidx - (vidx % this._itemsPerRow);
          }
        }) || 0;
      this._firstVisibleIndexVal = idx;
    }
    return idx;
  },

  /**
   * Gets the index of the last visible item in the viewport.
   *
   * @type {number}
   */
  get lastVisibleIndex() {
    var idx = this._lastVisibleIndexVal;
    if (idx == null) {
      if (this.grid) {
        idx = Math.min(this._virtualCount, this.firstVisibleIndex + this._estRowsInView * this._itemsPerRow - 1);
      } else {
        var physicalOffset = this._physicalTop + this._scrollOffset;
        this._iterateItems(function (pidx, vidx) {
          if (physicalOffset < this._scrollBottom) {
            idx = vidx;
          }
          physicalOffset += this._getPhysicalSizeIncrement(pidx);
        });
      }
      this._lastVisibleIndexVal = idx;
    }
    return idx;
  },

  get _defaultScrollTarget() {
    return this;
  },

  get _virtualRowCount() {
    return Math.ceil(this._virtualCount / this._itemsPerRow);
  },

  get _estRowsInView() {
    return Math.ceil(this._viewportHeight / this._rowHeight);
  },

  get _physicalRows() {
    return Math.ceil(this._physicalCount / this._itemsPerRow);
  },

  get _scrollOffset() {
    return this._scrollerPaddingTop + this.scrollOffset;
  },

  /**
   * Recycles the physical items when needed.
   */
  _scrollHandler: function () {
    var scrollTop = Math.max(0, Math.min(this._maxScrollTop, this._scrollTop));
    var delta = scrollTop - this._scrollPosition;
    var isScrollingDown = delta >= 0;
    // Track the current scroll position.
    this._scrollPosition = scrollTop;
    // Clear indexes for first and last visible indexes.
    this._firstVisibleIndexVal = null;
    this._lastVisibleIndexVal = null;
    // Random access.
    if (Math.abs(delta) > this._physicalSize && this._physicalSize > 0) {
      delta = delta - this._scrollOffset;
      var idxAdjustment = Math.round(delta / this._physicalAverage) * this._itemsPerRow;
      this._virtualStart = this._virtualStart + idxAdjustment;
      this._physicalStart = this._physicalStart + idxAdjustment;
      // Estimate new physical offset based on the virtual start index.
      // adjusts the physical start position to stay in sync with the clamped
      // virtual start index. It's critical not to let this value be
      // more than the scroll position however, since that would result in
      // the physical items not covering the viewport, and leading to
      // _increasePoolIfNeeded to run away creating items to try to fill it.
      this._physicalTop = Math.min(
        Math.floor(this._virtualStart / this._itemsPerRow) * this._physicalAverage,
        this._scrollPosition
      );
      this._update();
    } else if (this._physicalCount > 0) {
      var reusables = this._getReusables(isScrollingDown);
      if (isScrollingDown) {
        this._physicalTop = reusables.physicalTop;
        this._virtualStart = this._virtualStart + reusables.indexes.length;
        this._physicalStart = this._physicalStart + reusables.indexes.length;
      } else {
        this._virtualStart = this._virtualStart - reusables.indexes.length;
        this._physicalStart = this._physicalStart - reusables.indexes.length;
      }
      this._update(reusables.indexes, isScrollingDown ? null : reusables.indexes);
      this._debounce('_increasePoolIfNeeded', this._increasePoolIfNeeded.bind(this, 0), microTask);
    }
  },

  /**
   * Returns an object that contains the indexes of the physical items
   * that might be reused and the physicalTop.
   *
   * @param {boolean} fromTop If the potential reusable items are above the scrolling region.
   */
  _getReusables: function (fromTop) {
    var ith, offsetContent, physicalItemHeight;
    var idxs = [];
    var protectedOffsetContent = this._hiddenContentSize * this._ratio;
    var virtualStart = this._virtualStart;
    var virtualEnd = this._virtualEnd;
    var physicalCount = this._physicalCount;
    var top = this._physicalTop + this._scrollOffset;
    var bottom = this._physicalBottom + this._scrollOffset;
    // This may be called outside of a scrollHandler, so use last cached position
    var scrollTop = this._scrollPosition;
    var scrollBottom = this._scrollBottom;

    if (fromTop) {
      ith = this._physicalStart;
      offsetContent = scrollTop - top;
    } else {
      ith = this._physicalEnd;
      offsetContent = bottom - scrollBottom;
    }
    // eslint-disable-next-line no-constant-condition
    while (true) {
      physicalItemHeight = this._getPhysicalSizeIncrement(ith);
      offsetContent = offsetContent - physicalItemHeight;
      if (idxs.length >= physicalCount || offsetContent <= protectedOffsetContent) {
        break;
      }
      if (fromTop) {
        // Check that index is within the valid range.
        if (virtualEnd + idxs.length + 1 >= this._virtualCount) {
          break;
        }
        // Check that the index is not visible.
        if (top + physicalItemHeight >= scrollTop - this._scrollOffset) {
          break;
        }
        idxs.push(ith);
        top = top + physicalItemHeight;
        ith = (ith + 1) % physicalCount;
      } else {
        // Check that index is within the valid range.
        if (virtualStart - idxs.length <= 0) {
          break;
        }
        // Check that the index is not visible.
        if (top + this._physicalSize - physicalItemHeight <= scrollBottom) {
          break;
        }
        idxs.push(ith);
        top = top - physicalItemHeight;
        ith = ith === 0 ? physicalCount - 1 : ith - 1;
      }
    }
    return { indexes: idxs, physicalTop: top - this._scrollOffset };
  },

  /**
   * Update the list of items, starting from the `_virtualStart` item.
   * @param {!Array<number>=} itemSet
   * @param {!Array<number>=} movingUp
   */
  _update: function (itemSet, movingUp) {
    if ((itemSet && itemSet.length === 0) || this._physicalCount === 0) {
      return;
    }
    this._manageFocus();
    this._assignModels(itemSet);
    this._updateMetrics(itemSet);
    // Adjust offset after measuring.
    if (movingUp) {
      while (movingUp.length) {
        var idx = movingUp.pop();
        this._physicalTop -= this._getPhysicalSizeIncrement(idx);
      }
    }
    this._positionItems();
    this._updateScrollerSize();
  },

  _isClientFull: function () {
    return (
      this._scrollBottom != 0 &&
      this._physicalBottom - 1 >= this._scrollBottom &&
      this._physicalTop <= this._scrollPosition
    );
  },

  /**
   * Increases the pool size.
   */
  _increasePoolIfNeeded: function (count) {
    var nextPhysicalCount = this._clamp(
      this._physicalCount + count,
      DEFAULT_PHYSICAL_COUNT,
      this._virtualCount - this._virtualStart
    );
    nextPhysicalCount = this._convertIndexToCompleteRow(nextPhysicalCount);
    if (this.grid) {
      var correction = nextPhysicalCount % this._itemsPerRow;
      if (correction && nextPhysicalCount - correction <= this._physicalCount) {
        nextPhysicalCount += this._itemsPerRow;
      }
      nextPhysicalCount -= correction;
    }
    var delta = nextPhysicalCount - this._physicalCount;
    var nextIncrease = Math.round(this._physicalCount * 0.5);

    if (delta < 0) {
      return;
    }
    if (delta > 0) {
      var ts = window.performance.now();
      // Concat arrays in place.
      [].push.apply(this._physicalItems, this._createPool(delta));
      // Push 0s into physicalSizes. Can't use Array.fill because IE11 doesn't
      // support it.
      for (var i = 0; i < delta; i++) {
        this._physicalSizes.push(0);
      }
      this._physicalCount = this._physicalCount + delta;
      // Update the physical start if it needs to preserve the model of the
      // focused item. In this situation, the focused item is currently rendered
      // and its model would have changed after increasing the pool if the
      // physical start remained unchanged.
      if (
        this._physicalStart > this._physicalEnd &&
        this._isIndexRendered(this._focusedVirtualIndex) &&
        this._getPhysicalIndex(this._focusedVirtualIndex) < this._physicalEnd
      ) {
        this._physicalStart = this._physicalStart + delta;
      }
      this._update();
      this._templateCost = (window.performance.now() - ts) / delta;
      nextIncrease = Math.round(this._physicalCount * 0.5);
    }
    // The upper bounds is not fixed when dealing with a grid that doesn't
    // fill it's last row with the exact number of items per row.
    if (this._virtualEnd >= this._virtualCount - 1 || nextIncrease === 0) ; else if (!this._isClientFull()) {
      this._debounce('_increasePoolIfNeeded', this._increasePoolIfNeeded.bind(this, nextIncrease), microTask);
    } else if (this._physicalSize < this._optPhysicalSize) {
      // Yield and increase the pool during idle time until the physical size is
      // optimal.
      this._debounce(
        '_increasePoolIfNeeded',
        this._increasePoolIfNeeded.bind(this, this._clamp(Math.round(50 / this._templateCost), 1, nextIncrease)),
        idlePeriod
      );
    }
  },

  /**
   * Renders the a new list.
   */
  _render: function () {
    if (!this.isAttached || !this._isVisible) {
      return;
    }
    if (this._physicalCount !== 0) {
      var reusables = this._getReusables(true);
      this._physicalTop = reusables.physicalTop;
      this._virtualStart = this._virtualStart + reusables.indexes.length;
      this._physicalStart = this._physicalStart + reusables.indexes.length;
      this._update(reusables.indexes);
      this._update();
      this._increasePoolIfNeeded(0);
    } else if (this._virtualCount > 0) {
      // Initial render
      this.updateViewportBoundaries();
      this._increasePoolIfNeeded(DEFAULT_PHYSICAL_COUNT);
    }
  },

  _gridChanged: function (newGrid, oldGrid) {
    if (typeof oldGrid === 'undefined') return;
    this.notifyResize();
    flush();
    newGrid && this._updateGridMetrics();
  },

  /**
   * Called when the items have changed. That is, reassignments
   * to `items`, splices or updates to a single item.
   */
  _itemsChanged: function (change) {
    if (change.path === 'items') {
      this._virtualStart = 0;
      this._physicalTop = 0;
      this._virtualCount = this.items ? this.items.length : 0;
      this._physicalIndexForKey = {};
      this._firstVisibleIndexVal = null;
      this._lastVisibleIndexVal = null;
      this._physicalCount = this._physicalCount || 0;
      this._physicalItems = this._physicalItems || [];
      this._physicalSizes = this._physicalSizes || [];
      this._physicalStart = 0;
      if (this._scrollTop > this._scrollOffset) {
        this._resetScrollPosition(0);
      }
      this._removeFocusedItem();
      this._debounce('_render', this._render, animationFrame);
    } else if (change.path === 'items.splices') {
      this._adjustVirtualIndex(change.value.indexSplices);
      this._virtualCount = this.items ? this.items.length : 0;
      // Only blur if at least one item is added or removed.
      var itemAddedOrRemoved = change.value.indexSplices.some(function (splice) {
        return splice.addedCount > 0 || splice.removed.length > 0;
      });
      if (itemAddedOrRemoved) {
        // Only blur activeElement if it is a descendant of the list (#505,
        // #507).
        var activeElement = this._getActiveElement();
        if (this.contains(activeElement)) {
          activeElement.blur();
        }
      }
      // Render only if the affected index is rendered.
      var affectedIndexRendered = change.value.indexSplices.some(function (splice) {
        return splice.index + splice.addedCount >= this._virtualStart && splice.index <= this._virtualEnd;
      }, this);
      if (!this._isClientFull() || affectedIndexRendered) {
        this._debounce('_render', this._render, animationFrame);
      }
    } else if (change.path !== 'items.length') {
      this._forwardItemPath(change.path, change.value);
    }
  },

  /**
   * Executes a provided function per every physical index in `itemSet`
   * `itemSet` default value is equivalent to the entire set of physical
   * indexes.
   *
   * @param {!function(number, number)} fn
   * @param {!Array<number>=} itemSet
   */
  _iterateItems: function (fn, itemSet) {
    var pidx, vidx, rtn, i;

    if (arguments.length === 2 && itemSet) {
      for (i = 0; i < itemSet.length; i++) {
        pidx = itemSet[i];
        vidx = this._computeVidx(pidx);
        if ((rtn = fn.call(this, pidx, vidx)) != null) {
          return rtn;
        }
      }
    } else {
      pidx = this._physicalStart;
      vidx = this._virtualStart;
      for (; pidx < this._physicalCount; pidx++, vidx++) {
        if ((rtn = fn.call(this, pidx, vidx)) != null) {
          return rtn;
        }
      }
      for (pidx = 0; pidx < this._physicalStart; pidx++, vidx++) {
        if ((rtn = fn.call(this, pidx, vidx)) != null) {
          return rtn;
        }
      }
    }
  },

  /**
   * Returns the virtual index for a given physical index
   *
   * @param {number} pidx Physical index
   * @return {number}
   */
  _computeVidx: function (pidx) {
    if (pidx >= this._physicalStart) {
      return this._virtualStart + (pidx - this._physicalStart);
    }
    return this._virtualStart + (this._physicalCount - this._physicalStart) + pidx;
  },

  /**
   * Updates the height for a given set of items.
   *
   * @param {!Array<number>=} itemSet
   */
  _updateMetrics: function (itemSet) {
    // Make sure we distributed all the physical items
    // so we can measure them.
    flush();

    var newPhysicalSize = 0;
    var oldPhysicalSize = 0;
    var prevAvgCount = this._physicalAverageCount;
    var prevPhysicalAvg = this._physicalAverage;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this._iterateItems(function (pidx, vidx) {
      oldPhysicalSize += this._physicalSizes[pidx];
      this._physicalSizes[pidx] = this._physicalItems[pidx].offsetHeight;
      newPhysicalSize += this._physicalSizes[pidx];
      this._physicalAverageCount += this._physicalSizes[pidx] ? 1 : 0;
    }, itemSet);

    if (this.grid) {
      this._updateGridMetrics();
      this._physicalSize = Math.ceil(this._physicalCount / this._itemsPerRow) * this._rowHeight;
    } else {
      oldPhysicalSize =
        this._itemsPerRow === 1
          ? oldPhysicalSize
          : Math.ceil(this._physicalCount / this._itemsPerRow) * this._rowHeight;
      this._physicalSize = this._physicalSize + newPhysicalSize - oldPhysicalSize;
      this._itemsPerRow = 1;
    }
    // Update the average if it measured something.
    if (this._physicalAverageCount !== prevAvgCount) {
      this._physicalAverage = Math.round(
        (prevPhysicalAvg * prevAvgCount + newPhysicalSize) / this._physicalAverageCount
      );
    }
  },

  _updateGridMetrics: function () {
    this._itemWidth = this._physicalCount > 0 ? this._physicalItems[0].getBoundingClientRect().width : 200;
    this._rowHeight = this._physicalCount > 0 ? this._physicalItems[0].offsetHeight : 200;
    this._itemsPerRow = this._itemWidth ? Math.floor(this._viewportWidth / this._itemWidth) : this._itemsPerRow;
  },

  /**
   * Updates the position of the physical items.
   */
  _positionItems: function () {
    this._adjustScrollPosition();

    var y = this._physicalTop;

    if (this.grid) {
      var totalItemWidth = this._itemsPerRow * this._itemWidth;
      var rowOffset = (this._viewportWidth - totalItemWidth) / 2;

      this._iterateItems(function (pidx, vidx) {
        var modulus = vidx % this._itemsPerRow;
        var x = Math.floor(modulus * this._itemWidth + rowOffset);
        if (this._isRTL) {
          x = x * -1;
        }
        this.translate3d(x + 'px', y + 'px', 0, this._physicalItems[pidx]);
        if (this._shouldRenderNextRow(vidx)) {
          y += this._rowHeight;
        }
      });
    } else {
      const order = [];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      this._iterateItems(function (pidx, vidx) {
        const item = this._physicalItems[pidx];
        this.translate3d(0, y + 'px', 0, item);
        y += this._physicalSizes[pidx];
        const itemId = item.id;
        if (itemId) {
          order.push(itemId);
        }
      });
      if (order.length) {
        this.setAttribute('aria-owns', order.join(' '));
      }
    }
  },

  _getPhysicalSizeIncrement: function (pidx) {
    if (!this.grid) {
      return this._physicalSizes[pidx];
    }
    if (this._computeVidx(pidx) % this._itemsPerRow !== this._itemsPerRow - 1) {
      return 0;
    }
    return this._rowHeight;
  },

  /**
   * Returns, based on the current index,
   * whether or not the next index will need
   * to be rendered on a new row.
   *
   * @param {number} vidx Virtual index
   * @return {boolean}
   */
  _shouldRenderNextRow: function (vidx) {
    return vidx % this._itemsPerRow === this._itemsPerRow - 1;
  },

  /**
   * Adjusts the scroll position when it was overestimated.
   */
  _adjustScrollPosition: function () {
    var deltaHeight =
      this._virtualStart === 0 ? this._physicalTop : Math.min(this._scrollPosition + this._physicalTop, 0);
    // Note: the delta can be positive or negative.
    if (deltaHeight !== 0) {
      this._physicalTop = this._physicalTop - deltaHeight;
      // This may be called outside of a scrollHandler, so use last cached position
      var scrollTop = this._scrollPosition;
      // juking scroll position during interial scrolling on iOS is no bueno
      if (!IOS_TOUCH_SCROLLING && scrollTop > 0) {
        this._resetScrollPosition(scrollTop - deltaHeight);
      }
    }
  },

  /**
   * Sets the position of the scroll.
   */
  _resetScrollPosition: function (pos) {
    if (this.scrollTarget && pos >= 0) {
      this._scrollTop = pos;
      this._scrollPosition = this._scrollTop;
    }
  },

  /**
   * Sets the scroll height, that's the height of the content,
   *
   * @param {boolean=} forceUpdate If true, updates the height no matter what.
   */
  _updateScrollerSize: function (forceUpdate) {
    if (this.grid) {
      this._estScrollHeight = this._virtualRowCount * this._rowHeight;
    } else {
      this._estScrollHeight =
        this._physicalBottom +
        Math.max(this._virtualCount - this._physicalCount - this._virtualStart, 0) * this._physicalAverage;
    }
    forceUpdate = forceUpdate || this._scrollHeight === 0;
    forceUpdate = forceUpdate || this._scrollPosition >= this._estScrollHeight - this._physicalSize;
    forceUpdate = forceUpdate || (this.grid && this.$.items.style.height < this._estScrollHeight);
    // Amortize height adjustment, so it won't trigger large repaints too often.
    if (forceUpdate || Math.abs(this._estScrollHeight - this._scrollHeight) >= this._viewportHeight) {
      this.$.items.style.height = this._estScrollHeight + 'px';
      this._scrollHeight = this._estScrollHeight;
    }
  },

  /**
   * Scroll to a specific index in the virtual list regardless
   * of the physical items in the DOM tree.
   *
   * @method scrollToIndex
   * @param {number} idx The index of the item
   */
  scrollToIndex: function (idx) {
    if (typeof idx !== 'number' || idx < 0 || idx > this.items.length - 1) {
      return;
    }
    flush();
    // Items should have been rendered prior scrolling to an index.
    if (this._physicalCount === 0) {
      return;
    }
    idx = this._clamp(idx, 0, this._virtualCount - 1);
    // Update the virtual start only when needed.
    if (!this._isIndexRendered(idx) || idx >= this._maxVirtualStart) {
      this._virtualStart = this.grid ? idx - this._itemsPerRow * 2 : idx - 1;
    }
    this._manageFocus();
    this._assignModels();
    this._updateMetrics();
    // Estimate new physical offset.
    this._physicalTop = Math.floor(this._virtualStart / this._itemsPerRow) * this._physicalAverage;

    var currentTopItem = this._physicalStart;
    var currentVirtualItem = this._virtualStart;
    var targetOffsetTop = 0;
    var hiddenContentSize = this._hiddenContentSize;
    // scroll to the item as much as we can.
    while (currentVirtualItem < idx && targetOffsetTop <= hiddenContentSize) {
      targetOffsetTop = targetOffsetTop + this._getPhysicalSizeIncrement(currentTopItem);
      currentTopItem = (currentTopItem + 1) % this._physicalCount;
      currentVirtualItem++;
    }
    this._updateScrollerSize(true);
    this._positionItems();
    this._resetScrollPosition(this._physicalTop + this._scrollOffset + targetOffsetTop);
    this._increasePoolIfNeeded(0);
    // clear cached visible index.
    this._firstVisibleIndexVal = null;
    this._lastVisibleIndexVal = null;
  },

  /**
   * Reset the physical average and the average count.
   */
  _resetAverage: function () {
    this._physicalAverage = 0;
    this._physicalAverageCount = 0;
  },

  /**
   * A handler for the `iron-resize` event triggered by `IronResizableBehavior`
   * when the element is resized.
   */
  _resizeHandler: function () {
    this._debounce(
      '_render',
      function () {
        // clear cached visible index.
        this._firstVisibleIndexVal = null;
        this._lastVisibleIndexVal = null;
        if (this._isVisible) {
          this.updateViewportBoundaries();
          // Reinstall the scroll event listener.
          this.toggleScrollListener(true);
          this._resetAverage();
          this._render();
        } else {
          // Uninstall the scroll event listener.
          this.toggleScrollListener(false);
        }
      },
      animationFrame
    );
  },

  /**
   * Updates the size of a given list item.
   *
   * @method updateSizeForItem
   * @param {Object} item The item instance.
   */
  updateSizeForItem: function (item) {
    return this.updateSizeForIndex(this.items.indexOf(item));
  },

  /**
   * Updates the size of the item at the given index in the items array.
   *
   * @method updateSizeForIndex
   * @param {number} index The index of the item in the items array.
   */
  updateSizeForIndex: function (index) {
    if (!this._isIndexRendered(index)) {
      return null;
    }
    this._updateMetrics([this._getPhysicalIndex(index)]);
    this._positionItems();
    return null;
  },

  /**
   * Converts a random index to the index of the item that completes it's row.
   * Allows for better order and fill computation when grid == true.
   */
  _convertIndexToCompleteRow: function (idx) {
    // when grid == false _itemPerRow can be unset.
    this._itemsPerRow = this._itemsPerRow || 1;
    return this.grid ? Math.ceil(idx / this._itemsPerRow) * this._itemsPerRow : idx;
  },

  _isIndexRendered: function (idx) {
    return idx >= this._virtualStart && idx <= this._virtualEnd;
  },

  _isIndexVisible: function (idx) {
    return idx >= this.firstVisibleIndex && idx <= this.lastVisibleIndex;
  },

  _getPhysicalIndex: function (vidx) {
    return (this._physicalStart + (vidx - this._virtualStart)) % this._physicalCount;
  },

  _clamp: function (v, min, max) {
    return Math.min(max, Math.max(min, v));
  },

  _debounce: function (name, cb, asyncModule) {
    this._debouncers = this._debouncers || {};
    this._debouncers[name] = Debouncer.debounce(this._debouncers[name], asyncModule, cb.bind(this));
    enqueueDebouncer(this._debouncers[name]);
  }
};

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

// iron-list can by default handle sizes up to around 100000.
// When the size is larger than MAX_VIRTUAL_COUNT _vidxOffset is used
const MAX_VIRTUAL_COUNT = 100000;
const OFFSET_ADJUST_MIN_THRESHOLD = 1000;

class IronListAdapter {
  constructor({ createElements, updateElement, scrollTarget, scrollContainer, elementsContainer, reorderElements }) {
    this.isAttached = true;
    this._vidxOffset = 0;
    this.createElements = createElements;
    this.updateElement = updateElement;
    this.scrollTarget = scrollTarget;
    this.scrollContainer = scrollContainer;
    this.elementsContainer = elementsContainer || scrollContainer;
    this.reorderElements = reorderElements;
    // Iron-list uses this value to determine how many pages of elements to render
    this._maxPages = 1.3;

    this.timeouts = {
      SCROLL_REORDER: 500,
      IGNORE_WHEEL: 500
    };

    this.__resizeObserver = new ResizeObserver(() => this._resizeHandler());

    if (getComputedStyle(this.scrollTarget).overflow === 'visible') {
      this.scrollTarget.style.overflow = 'auto';
    }

    if (getComputedStyle(this.scrollContainer).position === 'static') {
      this.scrollContainer.style.position = 'relative';
    }

    this.__resizeObserver.observe(this.scrollTarget);
    this.scrollTarget.addEventListener('scroll', () => this._scrollHandler());

    this._scrollLineHeight = this._getScrollLineHeight();
    this.scrollTarget.addEventListener('wheel', (e) => this.__onWheel(e));

    if (this.reorderElements) {
      // Reordering the physical elements cancels the user's grab of the scroll bar handle on Safari.
      // Need to defer reordering until the user lets go of the scroll bar handle.
      this.scrollTarget.addEventListener('mousedown', () => (this.__mouseDown = true));
      this.scrollTarget.addEventListener('mouseup', () => {
        this.__mouseDown = false;
        if (this.__pendingReorder) {
          this.__reorderElements();
        }
      });
    }
  }

  _manageFocus() {}

  _removeFocusedItem() {}

  get scrollOffset() {
    return 0;
  }

  get adjustedFirstVisibleIndex() {
    return this.firstVisibleIndex + this._vidxOffset;
  }

  get adjustedLastVisibleIndex() {
    return this.lastVisibleIndex + this._vidxOffset;
  }

  scrollToIndex(index) {
    if (typeof index !== 'number' || isNaN(index) || this.size === 0 || !this.scrollTarget.offsetHeight) {
      return;
    }
    index = this._clamp(index, 0, this.size - 1);

    const visibleElementCount = this.__getVisibleElements().length;
    let targetVirtualIndex = Math.floor((index / this.size) * this._virtualCount);
    if (this._virtualCount - targetVirtualIndex < visibleElementCount) {
      targetVirtualIndex = this._virtualCount - (this.size - index);
      this._vidxOffset = this.size - this._virtualCount;
    } else if (targetVirtualIndex < visibleElementCount) {
      if (index < OFFSET_ADJUST_MIN_THRESHOLD) {
        targetVirtualIndex = index;
        this._vidxOffset = 0;
      } else {
        targetVirtualIndex = OFFSET_ADJUST_MIN_THRESHOLD;
        this._vidxOffset = index - targetVirtualIndex;
      }
    } else {
      this._vidxOffset = index - targetVirtualIndex;
    }

    this.__skipNextVirtualIndexAdjust = true;
    super.scrollToIndex(targetVirtualIndex);

    if (this.adjustedFirstVisibleIndex !== index && this._scrollTop < this._maxScrollTop && !this.grid) {
      // Workaround an iron-list issue by manually adjusting the scroll position
      this._scrollTop -= this.__getIndexScrollOffset(index) || 0;
    }
    this._scrollHandler();
  }

  flush() {
    // The scroll target is hidden.
    if (this.scrollTarget.offsetHeight === 0) {
      return;
    }

    this._resizeHandler();
    flush();
    this._scrollHandler();
    this.__scrollReorderDebouncer && this.__scrollReorderDebouncer.flush();
    this.__debouncerWheelAnimationFrame && this.__debouncerWheelAnimationFrame.flush();
  }

  update(startIndex = 0, endIndex = this.size - 1) {
    this.__getVisibleElements().forEach((el) => {
      if (el.__virtualIndex >= startIndex && el.__virtualIndex <= endIndex) {
        this.__updateElement(el, el.__virtualIndex, true);
      }
    });
  }

  __updateElement(el, index, forceSameIndexUpdates) {
    // Clean up temporary min height
    if (el.style.minHeight) {
      el.style.minHeight = '';
    }

    if (!this.__preventElementUpdates && (el.__lastUpdatedIndex !== index || forceSameIndexUpdates)) {
      this.updateElement(el, index);
      el.__lastUpdatedIndex = index;
    }

    if (el.offsetHeight === 0) {
      // If the elements have 0 height after update (for example due to lazy rendering),
      // it results in iron-list requesting to create an unlimited count of elements.
      // Assign a temporary min height to elements that would otherwise end up having
      // no height.
      el.style.minHeight = '200px';
    }
  }

  __getIndexScrollOffset(index) {
    const element = this.__getVisibleElements().find((el) => el.__virtualIndex === index);
    return element ? this.scrollTarget.getBoundingClientRect().top - element.getBoundingClientRect().top : undefined;
  }

  set size(size) {
    if (size === this.size) {
      return;
    }

    // Prevent element update while the scroll position is being restored
    this.__preventElementUpdates = true;

    // Record the scroll position before changing the size
    let fvi; // first visible index
    let fviOffsetBefore; // scroll offset of the first visible index
    if (size > 0) {
      fvi = this.adjustedFirstVisibleIndex;
      fviOffsetBefore = this.__getIndexScrollOffset(fvi);
    }

    // Change the size
    this.__size = size;

    // Flush before invoking items change to avoid
    // creating excess elements on the following flush()
    flush();

    this._itemsChanged({
      path: 'items'
    });
    flush();

    // Try to restore the scroll position if the new size is larger than 0
    if (size > 0) {
      fvi = Math.min(fvi, size - 1);
      this.scrollToIndex(fvi);

      const fviOffsetAfter = this.__getIndexScrollOffset(fvi);
      if (fviOffsetBefore !== undefined && fviOffsetAfter !== undefined) {
        this._scrollTop += fviOffsetBefore - fviOffsetAfter;
      }
    }

    if (!this.elementsContainer.children.length) {
      requestAnimationFrame(() => this._resizeHandler());
    }

    this.__preventElementUpdates = false;
    // Schedule and flush a resize handler
    this._resizeHandler();
    flush();
  }

  get size() {
    return this.__size;
  }

  /** @private */
  get _scrollTop() {
    return this.scrollTarget.scrollTop;
  }

  /** @private */
  set _scrollTop(top) {
    this.scrollTarget.scrollTop = top;
  }

  /** @private */
  get items() {
    return {
      length: Math.min(this.size, MAX_VIRTUAL_COUNT)
    };
  }

  /** @private */
  get offsetHeight() {
    return this.scrollTarget.offsetHeight;
  }

  /** @private */
  get $() {
    return {
      items: this.scrollContainer
    };
  }

  /** @private */
  updateViewportBoundaries() {
    const styles = window.getComputedStyle(this.scrollTarget);
    this._scrollerPaddingTop = this.scrollTarget === this ? 0 : parseInt(styles['padding-top'], 10);
    this._isRTL = Boolean(styles.direction === 'rtl');
    this._viewportWidth = this.elementsContainer.offsetWidth;
    this._viewportHeight = this.scrollTarget.offsetHeight;
    this._scrollPageHeight = this._viewportHeight - this._scrollLineHeight;
    this.grid && this._updateGridMetrics();
  }

  /** @private */
  setAttribute() {}

  /** @private */
  _createPool(size) {
    const physicalItems = this.createElements(size);
    const fragment = document.createDocumentFragment();
    physicalItems.forEach((el) => {
      el.style.position = 'absolute';
      fragment.appendChild(el);
      this.__resizeObserver.observe(el);
    });
    this.elementsContainer.appendChild(fragment);
    return physicalItems;
  }

  /** @private */
  _assignModels(itemSet) {
    this._iterateItems((pidx, vidx) => {
      const el = this._physicalItems[pidx];
      el.hidden = vidx >= this.size;
      if (!el.hidden) {
        el.__virtualIndex = vidx + (this._vidxOffset || 0);
        this.__updateElement(el, el.__virtualIndex);
      } else {
        delete el.__lastUpdatedIndex;
      }
    }, itemSet);
  }

  /** @private */
  _isClientFull() {
    // Workaround an issue in iron-list that can cause it to freeze on fast scroll
    setTimeout(() => (this.__clientFull = true));
    return this.__clientFull || super._isClientFull();
  }

  /** @private */
  translate3d(_x, y, _z, el) {
    el.style.transform = `translateY(${y})`;
  }

  /** @private */
  toggleScrollListener() {}

  _scrollHandler() {
    this._adjustVirtualIndexOffset(this._scrollTop - (this.__previousScrollTop || 0));

    super._scrollHandler();

    if (this.reorderElements) {
      this.__scrollReorderDebouncer = Debouncer.debounce(
        this.__scrollReorderDebouncer,
        timeOut.after(this.timeouts.SCROLL_REORDER),
        () => this.__reorderElements()
      );
    }

    this.__previousScrollTop = this._scrollTop;
  }

  /** @private */
  __onWheel(e) {
    if (e.ctrlKey || this._hasScrolledAncestor(e.target, e.deltaX, e.deltaY)) {
      return;
    }

    let deltaY = e.deltaY;
    if (e.deltaMode === WheelEvent.DOM_DELTA_LINE) {
      // Scrolling by "lines of text" instead of pixels
      deltaY *= this._scrollLineHeight;
    } else if (e.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
      // Scrolling by "pages" instead of pixels
      deltaY *= this._scrollPageHeight;
    }

    this._deltaYAcc = this._deltaYAcc || 0;

    if (this._wheelAnimationFrame) {
      // Accumulate wheel delta while a frame is being processed
      this._deltaYAcc += deltaY;
      e.preventDefault();
      return;
    }

    deltaY += this._deltaYAcc;
    this._deltaYAcc = 0;

    this._wheelAnimationFrame = true;
    this.__debouncerWheelAnimationFrame = Debouncer.debounce(
      this.__debouncerWheelAnimationFrame,
      animationFrame,
      () => (this._wheelAnimationFrame = false)
    );

    const momentum = Math.abs(e.deltaX) + Math.abs(deltaY);

    if (this._canScroll(this.scrollTarget, e.deltaX, deltaY)) {
      e.preventDefault();
      this.scrollTarget.scrollTop += deltaY;
      this.scrollTarget.scrollLeft += e.deltaX;

      this._hasResidualMomentum = true;

      this._ignoreNewWheel = true;
      this._debouncerIgnoreNewWheel = Debouncer.debounce(
        this._debouncerIgnoreNewWheel,
        timeOut.after(this.timeouts.IGNORE_WHEEL),
        () => (this._ignoreNewWheel = false)
      );
    } else if ((this._hasResidualMomentum && momentum <= this._previousMomentum) || this._ignoreNewWheel) {
      e.preventDefault();
    } else if (momentum > this._previousMomentum) {
      this._hasResidualMomentum = false;
    }
    this._previousMomentum = momentum;
  }

  /**
   * Determines if the element has an ancestor that handles the scroll delta prior to this
   *
   * @private
   */
  _hasScrolledAncestor(el, deltaX, deltaY) {
    if (el === this.scrollTarget || el === this.scrollTarget.getRootNode().host) {
      return false;
    } else if (
      this._canScroll(el, deltaX, deltaY) &&
      ['auto', 'scroll'].indexOf(getComputedStyle(el).overflow) !== -1
    ) {
      return true;
    } else if (el !== this && el.parentElement) {
      return this._hasScrolledAncestor(el.parentElement, deltaX, deltaY);
    }
  }

  _canScroll(el, deltaX, deltaY) {
    return (
      (deltaY > 0 && el.scrollTop < el.scrollHeight - el.offsetHeight) ||
      (deltaY < 0 && el.scrollTop > 0) ||
      (deltaX > 0 && el.scrollLeft < el.scrollWidth - el.offsetWidth) ||
      (deltaX < 0 && el.scrollLeft > 0)
    );
  }

  /**
   * @returns {Number|undefined} - The browser's default font-size in pixels
   * @private
   */
  _getScrollLineHeight() {
    const el = document.createElement('div');
    el.style.fontSize = 'initial';
    el.style.display = 'none';
    document.body.appendChild(el);
    const fontSize = window.getComputedStyle(el).fontSize;
    document.body.removeChild(el);
    return fontSize ? window.parseInt(fontSize) : undefined;
  }

  __getVisibleElements() {
    return Array.from(this.elementsContainer.children).filter((element) => !element.hidden);
  }

  /** @private */
  __reorderElements() {
    if (this.__mouseDown) {
      this.__pendingReorder = true;
      return;
    }
    this.__pendingReorder = false;

    const adjustedVirtualStart = this._virtualStart + (this._vidxOffset || 0);

    // Which row to use as a target?
    const visibleElements = this.__getVisibleElements();

    const elementWithFocus = visibleElements.find(
      (element) =>
        element.contains(this.elementsContainer.getRootNode().activeElement) ||
        element.contains(this.scrollTarget.getRootNode().activeElement)
    );
    const targetElement = elementWithFocus || visibleElements[0];
    if (!targetElement) {
      // All elements are hidden, don't reorder
      return;
    }

    // Where the target row should be?
    const targetPhysicalIndex = targetElement.__virtualIndex - adjustedVirtualStart;

    // Reodrer the DOM elements to keep the target row at the target physical index
    const delta = visibleElements.indexOf(targetElement) - targetPhysicalIndex;
    if (delta > 0) {
      for (let i = 0; i < delta; i++) {
        this.elementsContainer.appendChild(visibleElements[i]);
      }
    } else if (delta < 0) {
      for (let i = visibleElements.length + delta; i < visibleElements.length; i++) {
        this.elementsContainer.insertBefore(visibleElements[i], visibleElements[0]);
      }
    }

    // Due to a rendering bug, reordering the rows can make parts of the scroll target disappear
    // on Safari when using sticky positioning in case the scroll target is inside a flexbox.
    // This issue manifests with grid (the header can disappear if grid is used inside a flexbox)
    if (isSafari) {
      const { transform } = this.scrollTarget.style;
      this.scrollTarget.style.transform = 'translateZ(0)';
      setTimeout(() => (this.scrollTarget.style.transform = transform));
    }
  }

  /** @private */
  _adjustVirtualIndexOffset(delta) {
    if (this._virtualCount >= this.size) {
      this._vidxOffset = 0;
    } else if (this.__skipNextVirtualIndexAdjust) {
      this.__skipNextVirtualIndexAdjust = false;
      return;
    } else if (Math.abs(delta) > 10000) {
      // Process a large scroll position change
      const scale = this._scrollTop / (this.scrollTarget.scrollHeight - this.scrollTarget.offsetHeight);
      const offset = scale * this.size;
      this._vidxOffset = Math.round(offset - scale * this._virtualCount);
    } else {
      // Make sure user can always swipe/wheel scroll to the start and end
      const oldOffset = this._vidxOffset;
      const threshold = OFFSET_ADJUST_MIN_THRESHOLD;
      const maxShift = 100;

      // Near start
      if (this._scrollTop === 0) {
        this._vidxOffset = 0;
        if (oldOffset !== this._vidxOffset) {
          super.scrollToIndex(0);
        }
      } else if (this.firstVisibleIndex < threshold && this._vidxOffset > 0) {
        this._vidxOffset -= Math.min(this._vidxOffset, maxShift);
        super.scrollToIndex(this.firstVisibleIndex + (oldOffset - this._vidxOffset));
      }

      // Near end
      const maxOffset = this.size - this._virtualCount;
      if (this._scrollTop >= this._maxScrollTop && this._maxScrollTop > 0) {
        this._vidxOffset = maxOffset;
        if (oldOffset !== this._vidxOffset) {
          super.scrollToIndex(this._virtualCount - 1);
        }
      } else if (this.firstVisibleIndex > this._virtualCount - threshold && this._vidxOffset < maxOffset) {
        this._vidxOffset += Math.min(maxOffset - this._vidxOffset, maxShift);
        super.scrollToIndex(this.firstVisibleIndex - (this._vidxOffset - oldOffset));
      }
    }
  }
}

Object.setPrototypeOf(IronListAdapter.prototype, ironList);

class Virtualizer {
  /**
   * @typedef {Object} VirtualizerConfig
   * @property {Function} createElements Function that returns the given number of new elements
   * @property {Function} updateElement Function that updates the element at a specific index
   * @property {HTMLElement} scrollTarget Reference to the scrolling element
   * @property {HTMLElement} scrollContainer Reference to a wrapper for the item elements (or a slot) inside the scrollTarget
   * @property {HTMLElement | undefined} elementsContainer Reference to the container in which the item elements are placed, defaults to scrollContainer
   * @property {boolean | undefined} reorderElements Determines whether the physical item elements should be kept in order in the DOM
   * @param {VirtualizerConfig} config Configuration for the virtualizer
   */
  constructor(config) {
    this.__adapter = new IronListAdapter(config);
  }

  /**
   * The size of the virtualizer
   * @param {number} size The size of the virtualizer
   */
  set size(size) {
    this.__adapter.size = size;
  }

  /**
   * The size of the virtualizer
   * @return {number | undefined} The size of the virtualizer
   */
  get size() {
    return this.__adapter.size;
  }

  /**
   * Scroll to a specific index in the virtual list
   *
   * @method scrollToIndex
   * @param {number} index The index of the item
   */
  scrollToIndex(index) {
    this.__adapter.scrollToIndex(index);
  }

  /**
   * Requests the virtualizer to re-render the item elements on an index range, if currently in the DOM
   *
   * @method update
   * @param {number | undefined} startIndex The start index of the range
   * @param {number | undefined} endIndex The end index of the range
   */
  update(startIndex = 0, endIndex = this.size - 1) {
    this.__adapter.update(startIndex, endIndex);
  }

  /**
   * Flushes active asynchronous tasks so that the component and the DOM end up in a stable state
   *
   * @method update
   * @param {number | undefined} startIndex The start index of the range
   * @param {number | undefined} endIndex The end index of the range
   */
  flush() {
    this.__adapter.flush();
  }

  /**
   * Gets the index of the first visible item in the viewport.
   *
   * @return {number}
   */
  get firstVisibleIndex() {
    return this.__adapter.adjustedFirstVisibleIndex;
  }

  /**
   * Gets the index of the last visible item in the viewport.
   *
   * @return {number}
   */
  get lastVisibleIndex() {
    return this.__adapter.adjustedLastVisibleIndex;
  }
}

/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
const A11yMixin = (superClass) =>
  class A11yMixin extends superClass {
    static get observers() {
      return ['_a11yUpdateGridSize(size, _columnTree, _columnTree.*)'];
    }

    /** @private */
    _a11yGetHeaderRowCount(_columnTree) {
      return _columnTree.filter((level) => level.some((col) => col.headerRenderer || col.path || col.header)).length;
    }

    /** @private */
    _a11yGetFooterRowCount(_columnTree) {
      return _columnTree.filter((level) => level.some((col) => col.headerRenderer)).length;
    }

    /** @private */
    _a11yUpdateGridSize(size, _columnTree) {
      if (size === undefined || _columnTree === undefined) {
        return;
      }

      const bodyColumns = _columnTree[_columnTree.length - 1];
      this.$.table.setAttribute(
        'aria-rowcount',
        size + this._a11yGetHeaderRowCount(_columnTree) + this._a11yGetFooterRowCount(_columnTree)
      );
      this.$.table.setAttribute('aria-colcount', (bodyColumns && bodyColumns.length) || 0);

      this._a11yUpdateHeaderRows();
      this._a11yUpdateFooterRows();
    }

    /** @protected */
    _a11yUpdateHeaderRows() {
      Array.from(this.$.header.children).forEach((headerRow, index) =>
        headerRow.setAttribute('aria-rowindex', index + 1)
      );
    }

    /** @protected */
    _a11yUpdateFooterRows() {
      Array.from(this.$.footer.children).forEach((footerRow, index) =>
        footerRow.setAttribute('aria-rowindex', this._a11yGetHeaderRowCount(this._columnTree) + this.size + index + 1)
      );
    }

    /**
     * @param {!HTMLElement} row
     * @param {number} index
     * @protected
     */
    _a11yUpdateRowRowindex(row, index) {
      row.setAttribute('aria-rowindex', index + this._a11yGetHeaderRowCount(this._columnTree) + 1);
    }

    /**
     * @param {!HTMLElement} row
     * @param {boolean} selected
     * @protected
     */
    _a11yUpdateRowSelected(row, selected) {
      // Jaws reads selection only for rows, NVDA only for cells
      row.setAttribute('aria-selected', Boolean(selected));
      Array.from(row.children).forEach((cell) => cell.setAttribute('aria-selected', Boolean(selected)));
    }

    /**
     * @param {!HTMLElement} row
     * @protected
     */
    _a11yUpdateRowExpanded(row) {
      if (this.__isRowExpandable(row)) {
        row.setAttribute('aria-expanded', 'false');
      } else if (this.__isRowCollapsible(row)) {
        row.setAttribute('aria-expanded', 'true');
      } else {
        row.removeAttribute('aria-expanded');
      }
    }

    /**
     * @param {!HTMLElement} row
     * @param {number} level
     * @protected
     */
    _a11yUpdateRowLevel(row, level) {
      row.setAttribute('aria-level', level + 1);
    }

    /**
     * @param {!HTMLElement} row
     * @param {boolean} detailsOpened
     * @protected
     */
    _a11yUpdateRowDetailsOpened(row, detailsOpened) {
      const detailsCell = row.querySelector('[part~=details-cell]');

      Array.from(row.children).forEach((cell) => {
        if (detailsCell) {
          cell.setAttribute('aria-expanded', detailsOpened);
        } else {
          cell.removeAttribute('aria-expanded');
        }
      });
    }

    /**
     * @param {!HTMLElement} row
     * @param {!HTMLElement} detailsCell
     * @protected
     */
    _a11ySetRowDetailsCell(row, detailsCell) {
      Array.from(row.children).forEach((cell) => {
        if (cell !== detailsCell) {
          cell.setAttribute('aria-controls', detailsCell.id);
        }
      });
    }

    /**
     * @param {!HTMLElement} row
     * @param {number} colspan
     * @protected
     */
    _a11yUpdateCellColspan(cell, colspan) {
      cell.setAttribute('aria-colspan', Number(colspan));
    }

    /** @protected */
    _a11yUpdateSorters() {
      Array.from(this.querySelectorAll('vaadin-grid-sorter')).forEach((sorter) => {
        let cellContent = sorter.parentNode;
        while (cellContent && cellContent.localName !== 'vaadin-grid-cell-content') {
          cellContent = cellContent.parentNode;
        }
        if (cellContent && cellContent.assignedSlot) {
          const cell = cellContent.assignedSlot.parentNode;
          cell.setAttribute(
            'aria-sort',
            {
              asc: 'ascending',
              desc: 'descending'
            }[String(sorter.direction)] || 'none'
          );
        }
      });
    }
  };

/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
const ActiveItemMixin = (superClass) =>
  class ActiveItemMixin extends superClass {
    static get properties() {
      return {
        /**
         * The item user has last interacted with. Turns to `null` after user deactivates
         * the item by re-interacting with the currently active item.
         * @type {GridItem}
         */
        activeItem: {
          type: Object,
          notify: true,
          value: null
        }
      };
    }

    ready() {
      super.ready();

      this.$.scroller.addEventListener('click', this._onClick.bind(this));
      this.addEventListener('cell-activate', this._activateItem.bind(this));
      this.addEventListener('row-activate', this._activateItem.bind(this));
    }

    /** @private */
    _activateItem(e) {
      const model = e.detail.model;
      const clickedItem = model ? model.item : null;

      if (clickedItem) {
        this.activeItem = !this._itemsEqual(this.activeItem, clickedItem) ? clickedItem : null;
      }
    }

    /**
     * We need to listen to click instead of tap because on mobile safari, the
     * document.activeElement has not been updated (focus has not been shifted)
     * yet at the point when tap event is being executed.
     * @param {!MouseEvent} e
     * @protected
     */
    _onClick(e) {
      if (e.defaultPrevented) {
        // Something has handled this click already, e. g., <vaadin-grid-sorter>
        return;
      }

      const path = e.composedPath();
      const cell = path[path.indexOf(this.$.table) - 3];
      if (!cell || cell.getAttribute('part').indexOf('details-cell') > -1) {
        return;
      }
      const cellContent = cell._content;

      const activeElement = this.getRootNode().activeElement;
      const cellContentHasFocus = cellContent.contains(activeElement);
      if (!cellContentHasFocus && !this._isFocusable(e.target)) {
        this.dispatchEvent(
          new CustomEvent('cell-activate', {
            detail: {
              model: this.__getRowModel(cell.parentElement)
            }
          })
        );
      }
    }

    /**
     * @param {!Element} target
     * @return {boolean}
     * @protected
     */
    _isFocusable(target) {
      return isFocusable(target);
    }

    /**
     * Fired when the `activeItem` property changes.
     *
     * @event active-item-changed
     */

    /**
     * Fired when the cell is activated with click or keyboard.
     *
     * @event cell-activate
     */
  };

/**
 * @param {!Element} target
 * @return {boolean}
 * @protected
 */
const isFocusable = (target) => {
  if (!target.parentNode) {
    return false;
  }
  const focusables = Array.from(
    target.parentNode.querySelectorAll(
      '[tabindex], button, input, select, textarea, object, iframe, label, a[href], area[href]'
    )
  ).filter((element) => element.getAttribute('part') !== 'cell body-cell');

  const isFocusableElement = focusables.indexOf(target) !== -1;
  return !target.disabled && isFocusableElement;
};

/**
 * Returns a sub-property of an object
 *
 * @param {string} path dot-separated path to the sub property
 * @param {*} object
 * @returns {*}
 */
function get(path, object) {
  return path.split('.').reduce((obj, property) => obj[property], object);
}

/**
 * Check array of filters/sorters for paths validity, console.warn invalid items
 * @param {!Array<!GridFilterDefinition | !GridSorterDefinition>} arrayToCheck The array of filters/sorters to check
 * @param {string} action The name of action to include in warning (filtering, sorting)
 * @param {!Array<!GridItem>} items
 */
function checkPaths(arrayToCheck, action, items) {
  if (items.length === 0) {
    return false;
  }

  let result = true;

  for (let i in arrayToCheck) {
    const path = arrayToCheck[i].path;

    // skip simple paths
    if (!path || path.indexOf('.') === -1) {
      continue;
    }

    const parentProperty = path.replace(/\.[^.]*$/, ''); // a.b.c -> a.b
    if (get(parentProperty, items[0]) === undefined) {
      console.warn(`Path "${path}" used for ${action} does not exist in all of the items, ${action} is disabled.`);
      result = false;
    }
  }

  return result;
}

/**
 * Sorts the given array of items based on the sorting rules and returns the result.
 *
 * @param {Array<any>} items
 * @param {Array<GridSorterDefinition>} items
 * @return {Array<any>}
 */
function multiSort(items, sortOrders) {
  return items.sort((a, b) => {
    return sortOrders
      .map((sortOrder) => {
        if (sortOrder.direction === 'asc') {
          return compare(get(sortOrder.path, a), get(sortOrder.path, b));
        } else if (sortOrder.direction === 'desc') {
          return compare(get(sortOrder.path, b), get(sortOrder.path, a));
        }
        return 0;
      })
      .reduce((p, n) => {
        return p !== 0 ? p : n;
      }, 0);
  });
}

/**
 * @param {unknown} value
 * @return {string}
 */
function normalizeEmptyValue(value) {
  if ([undefined, null].indexOf(value) >= 0) {
    return '';
  } else if (isNaN(value)) {
    return value.toString();
  } else {
    return value;
  }
}

/**
 * @param {unknown} a
 * @param {unknown} b
 * @return {number}
 */
function compare(a, b) {
  a = normalizeEmptyValue(a);
  b = normalizeEmptyValue(b);

  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

/**
 * @param {!Array<!GridItem>} items
 * @return {!Array<!GridItem>}
 */
function filter(items, filters) {
  return items.filter((item) => {
    return filters.every((filter) => {
      const value = normalizeEmptyValue(get(filter.path, item));
      const filterValueLowercase = normalizeEmptyValue(filter.value).toString().toLowerCase();
      return value.toString().toLowerCase().includes(filterValueLowercase);
    });
  });
}

/**
 * WARNING: This API is still intended for internal purposes only and
 * may change any time.
 *
 * Creates a new grid compatible data provider that serves the items
 * from the given array as data when requested by the grid.
 *
 * @param {Array<any>} items
 * @return {GridDataProvider<any>}
 */
const createArrayDataProvider = (allItems) => {
  return (params, callback) => {
    let items = allItems ? [...allItems] : [];

    if (params.filters && checkPaths(params.filters, 'filtering', items)) {
      items = filter(items, params.filters);
    }

    if (
      Array.isArray(params.sortOrders) &&
      params.sortOrders.length &&
      checkPaths(params.sortOrders, 'sorting', items)
    ) {
      items = multiSort(items, params.sortOrders);
    }

    const count = Math.min(items.length, params.pageSize);
    const start = params.page * count;
    const end = start + count;
    const slice = items.slice(start, end);
    callback(slice, items.length);
  };
};

/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
const ArrayDataProviderMixin = (superClass) =>
  class ArrayDataProviderMixin extends superClass {
    static get properties() {
      return {
        /**
         * An array containing the items which will be passed to renderer functions.
         *
         * @type {Array<!GridItem> | undefined}
         */
        items: Array
      };
    }

    static get observers() {
      return ['__dataProviderOrItemsChanged(dataProvider, items, isAttached, items.*, _filters, _sorters)'];
    }

    /** @private */
    __setArrayDataProvider(items) {
      const arrayDataProvider = createArrayDataProvider(this.items);
      arrayDataProvider.__items = items;
      this.setProperties({
        _arrayDataProvider: arrayDataProvider,
        size: items.length,
        dataProvider: arrayDataProvider
      });
    }

    /** @private */
    __dataProviderOrItemsChanged(dataProvider, items, isAttached) {
      if (!isAttached) {
        return;
      }

      if (this._arrayDataProvider) {
        // Has an items array data provider beforehand

        if (dataProvider !== this._arrayDataProvider) {
          // A custom data provider was set externally
          this.setProperties({
            _arrayDataProvider: undefined,
            items: undefined
          });
        } else if (!items) {
          // The items array was unset
          this.setProperties({
            _arrayDataProvider: undefined,
            dataProvider: undefined,
            size: 0
          });
          this.clearCache();
        } else if (this._arrayDataProvider.__items === items) {
          // The items array was modified
          this.clearCache();
          this.size = this._effectiveSize;
        } else {
          // The items array was replaced
          this.__setArrayDataProvider(items);
        }
      } else if (items) {
        // There was no array data provider before items was set
        this.__setArrayDataProvider(items);
      }
    }
  };

/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @param {Array<Object>} columns array of columns to be modified
 * @param {number} scope multiplier added to base order for each column
 * @param {number} baseOrder base number used for order
 */
function updateColumnOrders(columns, scope, baseOrder) {
  let c = 1;
  columns.forEach((column) => {
    // avoid multiples of 10 because they introduce and extra zero and
    // causes the underlying calculations for child order goes wrong
    if (c % 10 === 0) {
      c++;
    }
    column._order = baseOrder + c * scope;
    c++;
  });
}

/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
const ColumnReorderingMixin = (superClass) =>
  class ColumnReorderingMixin extends GestureEventListeners(superClass) {
    static get properties() {
      return {
        /**
         * Set to true to allow column reordering.
         * @attr {boolean} column-reordering-allowed
         * @type {boolean}
         */
        columnReorderingAllowed: {
          type: Boolean,
          value: false
        },

        /** @private */
        _orderBaseScope: {
          type: Number,
          value: 10000000
        }
      };
    }

    static get observers() {
      return ['_updateOrders(_columnTree, _columnTree.*)'];
    }

    ready() {
      super.ready();
      addListener(this, 'track', this._onTrackEvent);
      this._reorderGhost = this.shadowRoot.querySelector('[part="reorder-ghost"]');

      this.addEventListener('touchstart', this._onTouchStart.bind(this));
      this.addEventListener('touchmove', this._onTouchMove.bind(this));
      this.addEventListener('touchend', this._onTouchEnd.bind(this));
      this.addEventListener('contextmenu', this._onContextMenu.bind(this));
    }

    /** @private */
    _onContextMenu(e) {
      if (this.hasAttribute('reordering')) {
        e.preventDefault();
      }
    }

    /** @private */
    _onTouchStart(e) {
      // Touch event, delay activation by 100ms
      this._startTouchReorderTimeout = setTimeout(() => {
        this._onTrackStart({
          detail: {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
          }
        });
      }, 100);
    }

    /** @private */
    _onTouchMove(e) {
      if (this._draggedColumn) {
        e.preventDefault();
      }
      clearTimeout(this._startTouchReorderTimeout);
    }

    /** @private */
    _onTouchEnd() {
      clearTimeout(this._startTouchReorderTimeout);
      this._onTrackEnd();
    }

    /** @private */
    _onTrackEvent(e) {
      if (e.detail.state === 'start') {
        const path = e.composedPath();
        const headerCell = path[path.indexOf(this.$.header) - 2];
        if (!headerCell || !headerCell._content) {
          // Not a header column
          return;
        }

        if (headerCell._content.contains(this.getRootNode().activeElement)) {
          // Something was focused inside the cell
          return;
        }

        if (this.$.scroller.hasAttribute('column-resizing')) {
          // Resizing is in progress
          return;
        }

        if (!this._touchDevice) {
          // Not a touch device
          this._onTrackStart(e);
        }
      } else if (e.detail.state === 'track') {
        this._onTrack(e);
      } else if (e.detail.state === 'end') {
        this._onTrackEnd(e);
      }
    }

    /** @private */
    _onTrackStart(e) {
      if (!this.columnReorderingAllowed) {
        return;
      }

      // Cancel reordering if there are draggable nodes on the event path
      const path = e.composedPath && e.composedPath();
      if (path && path.filter((node) => node.hasAttribute && node.hasAttribute('draggable'))[0]) {
        return;
      }

      const headerCell = this._cellFromPoint(e.detail.x, e.detail.y);
      if (!headerCell || headerCell.getAttribute('part').indexOf('header-cell') === -1) {
        return;
      }

      this.toggleAttribute('reordering', true);
      this._draggedColumn = headerCell._column;
      while (this._draggedColumn.parentElement.childElementCount === 1) {
        // This is the only column in the group, drag the whole group instead
        this._draggedColumn = this._draggedColumn.parentElement;
      }
      this._setSiblingsReorderStatus(this._draggedColumn, 'allowed');
      this._draggedColumn._reorderStatus = 'dragging';

      this._updateGhost(headerCell);
      this._reorderGhost.style.visibility = 'visible';
      this._updateGhostPosition(e.detail.x, this._touchDevice ? e.detail.y - 50 : e.detail.y);
      this._autoScroller();
    }

    /** @private */
    _onTrack(e) {
      if (!this._draggedColumn) {
        // Reordering didn’t start. Skip this event.
        return;
      }

      const targetCell = this._cellFromPoint(e.detail.x, e.detail.y);
      if (!targetCell) {
        return;
      }

      const targetColumn = this._getTargetColumn(targetCell, this._draggedColumn);
      if (
        this._isSwapAllowed(this._draggedColumn, targetColumn) &&
        this._isSwappableByPosition(targetColumn, e.detail.x)
      ) {
        this._swapColumnOrders(this._draggedColumn, targetColumn);
      }

      this._updateGhostPosition(e.detail.x, this._touchDevice ? e.detail.y - 50 : e.detail.y);
      this._lastDragClientX = e.detail.x;
    }

    /** @private */
    _onTrackEnd() {
      if (!this._draggedColumn) {
        // Reordering didn’t start. Skip this event.
        return;
      }

      this.toggleAttribute('reordering', false);
      this._draggedColumn._reorderStatus = '';
      this._setSiblingsReorderStatus(this._draggedColumn, '');
      this._draggedColumn = null;
      this._lastDragClientX = null;
      this._reorderGhost.style.visibility = 'hidden';

      this.dispatchEvent(
        new CustomEvent('column-reorder', {
          detail: {
            columns: this._getColumnsInOrder()
          }
        })
      );
    }

    /**
     * @return {!Array<!GridColumn>}
     * @protected
     */
    _getColumnsInOrder() {
      return this._columnTree
        .slice(0)
        .pop()
        .filter((c) => !c.hidden)
        .sort((b, a) => b._order - a._order);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @return {HTMLElement | undefined}
     * @protected
     */
    _cellFromPoint(x, y) {
      x = x || 0;
      y = y || 0;
      if (!this._draggedColumn) {
        this.$.scroller.toggleAttribute('no-content-pointer-events', true);
      }
      const cell = this.shadowRoot.elementFromPoint(x, y);
      this.$.scroller.toggleAttribute('no-content-pointer-events', false);

      // Make sure the element is actually a cell
      if (cell && cell._column) {
        return cell;
      }
    }

    /**
     * @param {number} eventClientX
     * @param {number} eventClientY
     * @protected
     */
    _updateGhostPosition(eventClientX, eventClientY) {
      const ghostRect = this._reorderGhost.getBoundingClientRect();
      // // This is where we want to position the ghost
      const targetLeft = eventClientX - ghostRect.width / 2;
      const targetTop = eventClientY - ghostRect.height / 2;
      // Current position
      const _left = parseInt(this._reorderGhost._left || 0);
      const _top = parseInt(this._reorderGhost._top || 0);
      // Reposition the ghost
      this._reorderGhost._left = _left - (ghostRect.left - targetLeft);
      this._reorderGhost._top = _top - (ghostRect.top - targetTop);
      this._reorderGhost.style.transform = `translate(${this._reorderGhost._left}px, ${this._reorderGhost._top}px)`;
    }

    /**
     * @param {!HTMLElement} cell
     * @return {!HTMLElement}
     * @protected
     */
    _updateGhost(cell) {
      const ghost = this._reorderGhost;
      ghost.textContent = cell._content.innerText;
      const style = window.getComputedStyle(cell);
      [
        'boxSizing',
        'display',
        'width',
        'height',
        'background',
        'alignItems',
        'padding',
        'border',
        'flex-direction',
        'overflow'
      ].forEach((propertyName) => (ghost.style[propertyName] = style[propertyName]));
      return ghost;
    }

    /** @private */
    _updateOrders(columnTree, splices) {
      if (columnTree === undefined || splices === undefined) {
        return;
      }

      // Reset all column orders
      columnTree[0].forEach((column) => (column._order = 0));
      // Set order numbers to top-level columns
      updateColumnOrders(columnTree[0], this._orderBaseScope, 0);
    }

    /**
     * @param {!GridColumn} column
     * @param {string} status
     * @protected
     */
    _setSiblingsReorderStatus(column, status) {
      Array.from(column.parentNode.children)
        .filter((child) => /column/.test(child.localName) && this._isSwapAllowed(child, column))
        .forEach((sibling) => (sibling._reorderStatus = status));
    }

    /** @protected */
    _autoScroller() {
      if (this._lastDragClientX) {
        const rightDiff = this._lastDragClientX - this.getBoundingClientRect().right + 50;
        const leftDiff = this.getBoundingClientRect().left - this._lastDragClientX + 50;

        if (rightDiff > 0) {
          this.$.table.scrollLeft += rightDiff / 10;
        } else if (leftDiff > 0) {
          this.$.table.scrollLeft -= leftDiff / 10;
        }
      }

      if (this._draggedColumn) {
        setTimeout(() => this._autoScroller(), 10);
      }
    }

    /**
     * @param {GridColumn | undefined} column1
     * @param {GridColumn | undefined} column2
     * @return {boolean | undefined}
     * @protected
     */
    _isSwapAllowed(column1, column2) {
      if (column1 && column2) {
        const differentColumns = column1 !== column2;
        const sameParent = column1.parentElement === column2.parentElement;
        const sameFrozen = column1.frozen === column2.frozen;
        return differentColumns && sameParent && sameFrozen;
      }
    }

    /**
     * @param {!GridColumn} targetColumn
     * @param {number} clientX
     * @return {boolean}
     * @protected
     */
    _isSwappableByPosition(targetColumn, clientX) {
      const targetCell = Array.from(this.$.header.querySelectorAll('tr:not([hidden]) [part~="cell"]')).filter((cell) =>
        targetColumn.contains(cell._column)
      )[0];
      const sourceCellRect = this.$.header
        .querySelector('tr:not([hidden]) [reorder-status=dragging]')
        .getBoundingClientRect();
      const targetRect = targetCell.getBoundingClientRect();
      if (targetRect.left > sourceCellRect.left) {
        return clientX > targetRect.right - sourceCellRect.width;
      } else {
        return clientX < targetRect.left + sourceCellRect.width;
      }
    }

    /**
     * @param {!GridColumn} column1
     * @param {!GridColumn} column2
     * @protected
     */
    _swapColumnOrders(column1, column2) {
      const _order = column1._order;
      column1._order = column2._order;
      column2._order = _order;
      this._updateLastFrozen();
      this._updateFirstAndLastColumn();
    }

    /**
     * @param {HTMLElement | undefined} targetCell
     * @param {GridColumn} draggedColumn
     * @return {GridColumn | undefined}
     * @protected
     */
    _getTargetColumn(targetCell, draggedColumn) {
      if (targetCell && draggedColumn) {
        let candidate = targetCell._column;
        while (candidate.parentElement !== draggedColumn.parentElement && candidate !== this) {
          candidate = candidate.parentElement;
        }
        if (candidate.parentElement === draggedColumn.parentElement) {
          return candidate;
        } else {
          return targetCell._column;
        }
      }
    }

    /**
     * Fired when the columns in the grid are reordered.
     *
     * @event column-reorder
     * @param {Object} detail
     * @param {Object} detail.columns the columns in the new order
     */
  };

/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
const ColumnResizingMixin = (superClass) =>
  class ColumnResizingMixin extends GestureEventListeners(superClass) {
    ready() {
      super.ready();
      const scroller = this.$.scroller;
      addListener(scroller, 'track', this._onHeaderTrack.bind(this));

      // Disallow scrolling while resizing
      scroller.addEventListener('touchmove', (e) => scroller.hasAttribute('column-resizing') && e.preventDefault());

      // Disable contextmenu on any resize separator.
      scroller.addEventListener(
        'contextmenu',
        (e) => e.target.getAttribute('part') == 'resize-handle' && e.preventDefault()
      );

      // Disable native cell focus when resizing
      scroller.addEventListener(
        'mousedown',
        (e) => e.target.getAttribute('part') === 'resize-handle' && e.preventDefault()
      );
    }

    /** @private */
    _onHeaderTrack(e) {
      const handle = e.target;
      if (handle.getAttribute('part') === 'resize-handle') {
        const cell = handle.parentElement;
        let column = cell._column;

        this.$.scroller.toggleAttribute('column-resizing', true);

        // Get the target column to resize
        while (column.localName === 'vaadin-grid-column-group') {
          column = Array.prototype.slice
            .call(column._childColumns, 0)
            .sort(function (a, b) {
              return a._order - b._order;
            })
            .filter(function (column) {
              return !column.hidden;
            })
            .pop();
        }

        const columnRowCells = Array.from(this.$.header.querySelectorAll('[part~="row"]:last-child [part~="cell"]'));
        const targetCell = columnRowCells.filter((cell) => cell._column === column)[0];
        // Resize the target column
        if (targetCell.offsetWidth) {
          const style = window.getComputedStyle(targetCell);
          const minWidth =
            10 +
            parseInt(style.paddingLeft) +
            parseInt(style.paddingRight) +
            parseInt(style.borderLeftWidth) +
            parseInt(style.borderRightWidth) +
            parseInt(style.marginLeft) +
            parseInt(style.marginRight);
          const maxWidth =
            targetCell.offsetWidth +
            (this.__isRTL
              ? targetCell.getBoundingClientRect().left - e.detail.x
              : e.detail.x - targetCell.getBoundingClientRect().right);
          column.width = Math.max(minWidth, maxWidth) + 'px';
          column.flexGrow = 0;
        }
        // Fix width and flex-grow for all preceding columns
        columnRowCells
          .sort(function (a, b) {
            return a._column._order - b._column._order;
          })
          .forEach(function (cell, index, array) {
            if (index < array.indexOf(targetCell)) {
              cell._column.width = cell.offsetWidth + 'px';
              cell._column.flexGrow = 0;
            }
          });

        if (e.detail.state === 'end') {
          this.$.scroller.toggleAttribute('column-resizing', false);
          this.dispatchEvent(
            new CustomEvent('column-resize', {
              detail: { resizedColumn: column }
            })
          );
        }

        // Notify resize
        this._resizeHandler();
      }
    }

    /**
     * Fired when a column in the grid is resized by the user.
     *
     * @event column-resize
     * @param {Object} detail
     * @param {Object} detail.resizedColumn the column that was resized
     */
  };

/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @private
 */
const ItemCache = class ItemCache {
  /**
   * @param {!HTMLElement} grid
   * @param {!ItemCache | undefined} parentCache
   * @param {!GridItem | undefined} parentItem
   */
  constructor(grid, parentCache, parentItem) {
    /** @type {!HTMLElement} */
    this.grid = grid;
    /** @type {!ItemCache | undefined} */
    this.parentCache = parentCache;
    /** @type {!GridItem | undefined} */
    this.parentItem = parentItem;
    /** @type {object} */
    this.itemCaches = {};
    /** @type {object} */
    this.items = {};
    /** @type {number} */
    this.effectiveSize = 0;
    /** @type {number} */
    this.size = 0;
    /** @type {object} */
    this.pendingRequests = {};
  }

  /**
   * @return {boolean}
   */
  isLoading() {
    return Boolean(
      Object.keys(this.pendingRequests).length ||
        Object.keys(this.itemCaches).filter((index) => {
          return this.itemCaches[index].isLoading();
        })[0]
    );
  }

  /**
   * @param {number} index
   * @return {!GridItem | undefined}
   */
  getItemForIndex(index) {
    const { cache, scaledIndex } = this.getCacheAndIndex(index);
    return cache.items[scaledIndex];
  }

  updateSize() {
    this.effectiveSize =
      !this.parentItem || this.grid._isExpanded(this.parentItem)
        ? this.size +
          Object.keys(this.itemCaches).reduce((prev, curr) => {
            const subCache = this.itemCaches[curr];
            subCache.updateSize();
            return prev + subCache.effectiveSize;
          }, 0)
        : 0;
  }

  /**
   * @param {number} scaledIndex
   */
  ensureSubCacheForScaledIndex(scaledIndex) {
    if (!this.itemCaches[scaledIndex]) {
      const subCache = new ItemCache(this.grid, this, this.items[scaledIndex]);
      this.itemCaches[scaledIndex] = subCache;
      this.grid._loadPage(0, subCache);
    }
  }

  /**
   * @param {number} index
   * @return {{cache: !ItemCache, scaledIndex: number}}
   */
  getCacheAndIndex(index) {
    let thisLevelIndex = index;
    const keys = Object.keys(this.itemCaches);
    for (let i = 0; i < keys.length; i++) {
      const expandedIndex = Number(keys[i]);
      const subCache = this.itemCaches[expandedIndex];
      if (thisLevelIndex <= expandedIndex) {
        return { cache: this, scaledIndex: thisLevelIndex };
      } else if (thisLevelIndex <= expandedIndex + subCache.effectiveSize) {
        return subCache.getCacheAndIndex(thisLevelIndex - expandedIndex - 1);
      }
      thisLevelIndex -= subCache.effectiveSize;
    }
    return { cache: this, scaledIndex: thisLevelIndex };
  }
};

/**
 * @polymerMixin
 */
const DataProviderMixin = (superClass) =>
  class DataProviderMixin extends superClass {
    static get properties() {
      return {
        /**
         * The number of root-level items in the grid.
         * @attr {number} size
         * @type {number}
         */
        size: {
          type: Number,
          notify: true
        },

        /**
         * Number of items fetched at a time from the dataprovider.
         * @attr {number} page-size
         * @type {number}
         */
        pageSize: {
          type: Number,
          value: 50,
          observer: '_pageSizeChanged'
        },

        /**
         * Function that provides items lazily. Receives arguments `params`, `callback`
         *
         * `params.page` Requested page index
         *
         * `params.pageSize` Current page size
         *
         * `params.filters` Currently applied filters
         *
         * `params.sortOrders` Currently applied sorting orders
         *
         * `params.parentItem` When tree is used, and sublevel items
         * are requested, reference to parent item of the requested sublevel.
         * Otherwise `undefined`.
         *
         * `callback(items, size)` Callback function with arguments:
         *   - `items` Current page of items
         *   - `size` Total number of items. When tree sublevel items
         *     are requested, total number of items in the requested sublevel.
         *     Optional when tree is not used, required for tree.
         *
         * @type {GridDataProvider | null | undefined}
         */
        dataProvider: {
          type: Object,
          notify: true,
          observer: '_dataProviderChanged'
        },

        /**
         * `true` while data is being requested from the data provider.
         */
        loading: {
          type: Boolean,
          notify: true,
          readOnly: true,
          reflectToAttribute: true
        },

        /**
         * @type {!ItemCache}
         * @protected
         */
        _cache: {
          type: Object,
          value: function () {
            const cache = new ItemCache(this);
            return cache;
          }
        },

        /**
         * @protected
         */
        _hasData: {
          type: Boolean,
          value: false
        },

        /**
         * Path to an item sub-property that identifies the item.
         * @attr {string} item-id-path
         */
        itemIdPath: {
          type: String,
          value: null
        },

        /**
         * An array that contains the expanded items.
         * @type {!Array<!GridItem>}
         */
        expandedItems: {
          type: Object,
          notify: true,
          value: () => []
        },

        /**
         * @private
         */
        __expandedKeys: {
          type: Object,
          value: () => new Set()
        }
      };
    }

    static get observers() {
      return ['_sizeChanged(size)', '_itemIdPathChanged(itemIdPath)', '_expandedItemsChanged(expandedItems.*)'];
    }

    /** @private */
    _sizeChanged(size) {
      const delta = size - this._cache.size;
      this._cache.size += delta;
      this._cache.effectiveSize += delta;
      this._effectiveSize = this._cache.effectiveSize;
    }

    /**
     * @param {number} index
     * @param {HTMLElement} el
     * @protected
     */
    _getItem(index, el) {
      if (index >= this._effectiveSize) {
        return;
      }

      el.index = index;
      const { cache, scaledIndex } = this._cache.getCacheAndIndex(index);
      const item = cache.items[scaledIndex];
      if (item) {
        el.toggleAttribute('loading', false);
        this._updateItem(el, item);
        if (this._isExpanded(item)) {
          cache.ensureSubCacheForScaledIndex(scaledIndex);
        }
      } else {
        el.toggleAttribute('loading', true);
        this._loadPage(this._getPageForIndex(scaledIndex), cache);
      }
    }

    /**
     * Returns a value that identifies the item. Uses `itemIdPath` if available.
     * Can be customized by overriding.
     * @param {!GridItem} item
     * @return {!GridItem | !unknown}
     */
    getItemId(item) {
      return this.itemIdPath ? this.get(this.itemIdPath, item) : item;
    }

    /**
     * @param {!GridItem} item
     * @return {boolean}
     * @protected
     */
    _isExpanded(item) {
      return this.__expandedKeys.has(this.getItemId(item));
    }

    /** @private */
    _expandedItemsChanged() {
      this.__cacheExpandedKeys();
      this._cache.updateSize();
      this._effectiveSize = this._cache.effectiveSize;
      this.__updateVisibleRows();
    }

    /** @private */
    _itemIdPathChanged() {
      this.__cacheExpandedKeys();
    }

    /** @private */
    __cacheExpandedKeys() {
      if (this.expandedItems) {
        this.__expandedKeys = new Set();
        this.expandedItems.forEach((item) => {
          this.__expandedKeys.add(this.getItemId(item));
        });
      }
    }

    /**
     * Expands the given item tree.
     * @param {!GridItem} item
     */
    expandItem(item) {
      if (!this._isExpanded(item)) {
        this.expandedItems = [...this.expandedItems, item];
      }
    }

    /**
     * Collapses the given item tree.
     * @param {!GridItem} item
     */
    collapseItem(item) {
      if (this._isExpanded(item)) {
        this.expandedItems = this.expandedItems.filter((i) => !this._itemsEqual(i, item));
      }
    }

    /**
     * @param {number} index
     * @return {number}
     * @protected
     */
    _getIndexLevel(index) {
      let { cache } = this._cache.getCacheAndIndex(index);
      let level = 0;
      while (cache.parentCache) {
        cache = cache.parentCache;
        level++;
      }
      return level;
    }

    /**
     * @param {number} page
     * @param {ItemCache} cache
     * @protected
     */
    _loadPage(page, cache) {
      // make sure same page isn't requested multiple times.
      if (!cache.pendingRequests[page] && this.dataProvider) {
        this._setLoading(true);
        cache.pendingRequests[page] = true;
        const params = {
          page,
          pageSize: this.pageSize,
          sortOrders: this._mapSorters(),
          filters: this._mapFilters(),
          parentItem: cache.parentItem
        };

        this.dataProvider(params, (items, size) => {
          if (size !== undefined) {
            cache.size = size;
          } else {
            if (params.parentItem) {
              cache.size = items.length;
            }
          }

          const currentItems = Array.from(this.$.items.children).map((row) => row._item);

          // Populate the cache with new items
          items.forEach((item, itemsIndex) => {
            const itemIndex = page * this.pageSize + itemsIndex;
            cache.items[itemIndex] = item;
            if (this._isExpanded(item) && currentItems.indexOf(item) > -1) {
              // Force synchronous data request for expanded item sub-cache
              cache.ensureSubCacheForScaledIndex(itemIndex);
            }
          });

          this._hasData = true;

          delete cache.pendingRequests[page];

          this._debouncerApplyCachedData = Debouncer.debounce(this._debouncerApplyCachedData, timeOut.after(0), () => {
            this._setLoading(false);
            this._cache.updateSize();
            this._effectiveSize = this._cache.effectiveSize;

            Array.from(this.$.items.children)
              .filter((row) => !row.hidden)
              .forEach((row) => {
                const cachedItem = this._cache.getItemForIndex(row.index);
                if (cachedItem) {
                  this._getItem(row.index, row);
                }
              });

            this.__scrollToPendingIndex();
          });

          if (!this._cache.isLoading()) {
            this._debouncerApplyCachedData.flush();
          }

          this.__itemsReceived();
        });
      }
    }

    /**
     * @param {number} index
     * @return {number}
     * @private
     */
    _getPageForIndex(index) {
      return Math.floor(index / this.pageSize);
    }

    /**
     * Clears the cached pages and reloads data from dataprovider when needed.
     */
    clearCache() {
      this._cache = new ItemCache(this);
      this._cache.size = this.size || 0;
      this._cache.updateSize();
      this._hasData = false;
      this.__updateVisibleRows();

      if (!this._effectiveSize) {
        this._loadPage(0, this._cache);
      }
    }

    /** @private */
    _pageSizeChanged(pageSize, oldPageSize) {
      if (oldPageSize !== undefined && pageSize !== oldPageSize) {
        this.clearCache();
      }
    }

    /** @protected */
    _checkSize() {
      if (this.size === undefined && this._effectiveSize === 0) {
        console.warn(
          'The <vaadin-grid> needs the total number of items' +
            ' in order to display rows. Set the total number of items' +
            ' to the `size` property, or provide the total number of items' +
            ' in the second argument of the `dataProvider`’s `callback` call.'
        );
      }
    }

    /** @private */
    _dataProviderChanged(dataProvider, oldDataProvider) {
      if (oldDataProvider !== undefined) {
        this.clearCache();
      }

      this._ensureFirstPageLoaded();

      this._debouncerCheckSize = Debouncer.debounce(
        this._debouncerCheckSize,
        timeOut.after(2000),
        this._checkSize.bind(this)
      );
    }

    /** @protected */
    _ensureFirstPageLoaded() {
      if (!this._hasData) {
        // load data before adding rows to make sure they have content when
        // rendered for the first time.
        this._loadPage(0, this._cache);
      }
    }

    /**
     * @param {!GridItem} item1
     * @param {!GridItem} item2
     * @return {boolean}
     * @protected
     */
    _itemsEqual(item1, item2) {
      return this.getItemId(item1) === this.getItemId(item2);
    }

    /**
     * @param {!GridItem} item
     * @param {!Array<!GridItem>} array
     * @return {number}
     * @protected
     */
    _getItemIndexInArray(item, array) {
      let result = -1;
      array.forEach((i, idx) => {
        if (this._itemsEqual(i, item)) {
          result = idx;
        }
      });
      return result;
    }

    scrollToIndex(index) {
      super.scrollToIndex(index);
      if (!isNaN(index) && (this._cache.isLoading() || !this.clientHeight)) {
        this.__pendingScrollToIndex = index;
      }
    }

    __scrollToPendingIndex() {
      if (this.__pendingScrollToIndex && this.$.items.children.length) {
        const index = this.__pendingScrollToIndex;
        delete this.__pendingScrollToIndex;
        this.scrollToIndex(index);
      }
    }

    /**
     * Fired when the `expandedItems` property changes.
     *
     * @event expanded-items-changed
     */

    /**
     * Fired when the `loading` property changes.
     *
     * @event loading-changed
     */
  };

/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const DropMode = {
  BETWEEN: 'between',
  ON_TOP: 'on-top',
  ON_TOP_OR_BETWEEN: 'on-top-or-between',
  ON_GRID: 'on-grid'
};

const DropLocation = {
  ON_TOP: 'on-top',
  ABOVE: 'above',
  BELOW: 'below',
  EMPTY: 'empty'
};

/**
 * @polymerMixin
 */
const DragAndDropMixin = (superClass) =>
  class DragAndDropMixin extends superClass {
    static get properties() {
      return {
        /**
         * Defines the locations within the Grid row where an element can be dropped.
         *
         * Possible values are:
         * - `between`: The drop event can happen between Grid rows.
         * - `on-top`: The drop event can happen on top of Grid rows.
         * - `on-top-or-between`: The drop event can happen either on top of or between Grid rows.
         * - `on-grid`: The drop event will not happen on any specific row, it will show the drop target outline around the whole grid.
         * @attr {between|on-top|on-top-or-between|on-grid} drop-mode
         * @type {GridDropMode | null | undefined}
         */
        dropMode: String,

        /**
         * Marks the grid's rows to be available for dragging.
         * @attr {boolean} rows-draggable
         */
        rowsDraggable: Boolean,

        /**
         * A function that filters dragging of specific grid rows. The return value should be false
         * if dragging of the row should be disabled.
         *
         * Receives one argument:
         * - `model` The object with the properties related with
         *   the rendered item, contains:
         *   - `model.index` The index of the item.
         *   - `model.item` The item.
         *   - `model.expanded` Sublevel toggle state.
         *   - `model.level` Level of the tree represented with a horizontal offset of the toggle button.
         *   - `model.selected` Selected state.
         *
         * @type {GridDragAndDropFilter | null | undefined}
         */
        dragFilter: Function,

        /**
         * A function that filters dropping on specific grid rows. The return value should be false
         * if dropping on the row should be disabled.
         *
         * Receives one argument:
         * - `model` The object with the properties related with
         *   the rendered item, contains:
         *   - `model.index` The index of the item.
         *   - `model.item` The item.
         *   - `model.expanded` Sublevel toggle state.
         *   - `model.level` Level of the tree represented with a horizontal offset of the toggle button.
         *   - `model.selected` Selected state.
         *
         * @type {GridDragAndDropFilter | null | undefined}
         */
        dropFilter: Function,

        /** @private */
        __dndAutoScrollThreshold: {
          value: 50
        }
      };
    }

    static get observers() {
      return ['_dragDropAccessChanged(rowsDraggable, dropMode, dragFilter, dropFilter, loading)'];
    }

    /** @protected */
    ready() {
      super.ready();
      this.$.table.addEventListener('dragstart', this._onDragStart.bind(this));
      this.$.table.addEventListener('dragend', this._onDragEnd.bind(this));
      this.$.table.addEventListener('dragover', this._onDragOver.bind(this));
      this.$.table.addEventListener('dragleave', this._onDragLeave.bind(this));
      this.$.table.addEventListener('drop', this._onDrop.bind(this));
      this.$.table.addEventListener('dragenter', (e) => {
        if (this.dropMode) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
    }

    /** @private */
    _onDragStart(e) {
      if (this.rowsDraggable) {
        let row = e.target;
        if (row.localName === 'vaadin-grid-cell-content') {
          // The draggable node is the cell content element on browsers that support native shadow
          row = row.assignedSlot.parentNode.parentNode;
        }
        if (row.parentNode !== this.$.items) {
          return;
        }

        e.stopPropagation();
        this.toggleAttribute('dragging-rows', true);

        if (this._safari) {
          // Safari doesn't position drag images from transformed
          // elements properly so we need to switch to use top temporarily
          const transform = row.style.transform;
          row.style.top = /translateY\((.*)\)/.exec(transform)[1];
          row.style.transform = 'none';
          requestAnimationFrame(() => {
            row.style.top = '';
            row.style.transform = transform;
          });
        }

        const rowRect = row.getBoundingClientRect();

        if (this._ios) {
          e.dataTransfer.setDragImage(row);
        } else {
          e.dataTransfer.setDragImage(row, e.clientX - rowRect.left, e.clientY - rowRect.top);
        }

        let rows = [row];
        if (this._isSelected(row._item)) {
          rows = this.__getViewportRows()
            .filter((row) => this._isSelected(row._item))
            .filter((row) => !this.dragFilter || this.dragFilter(this.__getRowModel(row)));
        }

        // Set the default transfer data
        e.dataTransfer.setData('text', this.__formatDefaultTransferData(rows));

        row.setAttribute('dragstart', rows.length > 1 ? rows.length : '');
        this.style.setProperty('--_grid-drag-start-x', `${e.clientX - rowRect.left + 20}px`);
        this.style.setProperty('--_grid-drag-start-y', `${e.clientY - rowRect.top + 10}px`);

        requestAnimationFrame(() => {
          row.removeAttribute('dragstart');
          this.updateStyles({ '--_grid-drag-start-x': '', '--_grid-drag-start-y': '' });
        });

        const event = new CustomEvent('grid-dragstart', {
          detail: {
            draggedItems: rows.map((row) => row._item),
            setDragData: (type, data) => e.dataTransfer.setData(type, data),
            setDraggedItemsCount: (count) => row.setAttribute('dragstart', count)
          }
        });
        event.originalEvent = e;
        this.dispatchEvent(event);
      }
    }

    /** @private */
    _onDragEnd(e) {
      this.toggleAttribute('dragging-rows', false);
      e.stopPropagation();
      const event = new CustomEvent('grid-dragend');
      event.originalEvent = e;
      this.dispatchEvent(event);
    }

    /** @private */
    _onDragLeave(e) {
      e.stopPropagation();
      this._clearDragStyles();
    }

    /** @private */
    _onDragOver(e) {
      if (this.dropMode) {
        this._dropLocation = undefined;
        this._dragOverItem = undefined;

        if (this.__dndAutoScroll(e.clientY)) {
          this._clearDragStyles();
          return;
        }

        let row = e.composedPath().filter((node) => node.localName === 'tr')[0];

        if (!this._effectiveSize || this.dropMode === DropMode.ON_GRID) {
          // The grid is empty or "on-grid" drop mode was used, always default to "empty"
          this._dropLocation = DropLocation.EMPTY;
        } else if (!row || row.parentNode !== this.$.items) {
          // The dragover didn't occur on a body row but the grid has items
          if (row) {
            // The dragover occurred over a header/footer row
            return;
          } else if (this.dropMode === DropMode.BETWEEN || this.dropMode === DropMode.ON_TOP_OR_BETWEEN) {
            // The drop mode allows setting the last row as the drag over item
            row = Array.from(this.$.items.children)
              .filter((row) => !row.hidden)
              .pop();
            this._dropLocation = DropLocation.BELOW;
          } else {
            // Drop mode on-top used but the dragover didn't occur over one of the existing rows
            return;
          }
        } else {
          // The dragover occurred on a body row, determine the drop location from coordinates
          const rowRect = row.getBoundingClientRect();

          this._dropLocation = DropLocation.ON_TOP;

          if (this.dropMode === DropMode.BETWEEN) {
            const dropAbove = e.clientY - rowRect.top < rowRect.bottom - e.clientY;
            this._dropLocation = dropAbove ? DropLocation.ABOVE : DropLocation.BELOW;
          } else if (this.dropMode === DropMode.ON_TOP_OR_BETWEEN) {
            if (e.clientY - rowRect.top < rowRect.height / 3) {
              this._dropLocation = DropLocation.ABOVE;
            } else if (e.clientY - rowRect.top > (rowRect.height / 3) * 2) {
              this._dropLocation = DropLocation.BELOW;
            }
          }
        }

        if (row && row.hasAttribute('drop-disabled')) {
          this._dropLocation = undefined;
          return;
        }

        e.stopPropagation();
        e.preventDefault();

        if (this._dropLocation === DropLocation.EMPTY) {
          this.toggleAttribute('dragover', true);
        } else if (row) {
          this._dragOverItem = row._item;
          if (row.getAttribute('dragover') !== this._dropLocation) {
            row.setAttribute('dragover', this._dropLocation);
          }
        } else {
          this._clearDragStyles();
        }
      }
    }

    /** @private */
    __dndAutoScroll(clientY) {
      if (this.__dndAutoScrolling) {
        return true;
      }

      const headerBottom = this.$.header.getBoundingClientRect().bottom;
      const footerTop = this.$.footer.getBoundingClientRect().top;
      const topDiff = headerBottom - clientY + this.__dndAutoScrollThreshold;
      const bottomDiff = clientY - footerTop + this.__dndAutoScrollThreshold;
      let scrollTopDelta = 0;

      if (bottomDiff > 0) {
        scrollTopDelta = bottomDiff * 2;
      } else if (topDiff > 0) {
        scrollTopDelta = -topDiff * 2;
      }

      if (scrollTopDelta) {
        const scrollTop = this.$.table.scrollTop;
        this.$.table.scrollTop += scrollTopDelta;
        const scrollTopChanged = scrollTop !== this.$.table.scrollTop;
        if (scrollTopChanged) {
          this.__dndAutoScrolling = true;
          // Disallow more auto-scrolls within 20ms
          setTimeout(() => (this.__dndAutoScrolling = false), 20);
          return true;
        }
      }
    }

    /** @private */
    __getViewportRows() {
      const headerBottom = this.$.header.getBoundingClientRect().bottom;
      const footerTop = this.$.footer.getBoundingClientRect().top;
      return Array.from(this.$.items.children).filter((row) => {
        const rowRect = row.getBoundingClientRect();
        return rowRect.bottom > headerBottom && rowRect.top < footerTop;
      });
    }

    /** @protected */
    _clearDragStyles() {
      this.removeAttribute('dragover');
      Array.from(this.$.items.children).forEach((row) => row.removeAttribute('dragover'));
    }

    /** @private */
    _onDrop(e) {
      if (this.dropMode) {
        e.stopPropagation();
        e.preventDefault();

        const dragData =
          e.dataTransfer.types &&
          Array.from(e.dataTransfer.types).map((type) => {
            return {
              type,
              data: e.dataTransfer.getData(type)
            };
          });

        this._clearDragStyles();

        const event = new CustomEvent('grid-drop', {
          bubbles: e.bubbles,
          cancelable: e.cancelable,
          detail: {
            dropTargetItem: this._dragOverItem,
            dropLocation: this._dropLocation,
            dragData
          }
        });
        event.originalEvent = e;
        this.dispatchEvent(event);
      }
    }

    /** @private */
    __formatDefaultTransferData(rows) {
      return rows
        .map((row) => {
          return Array.from(row.children)
            .filter((cell) => !cell.hidden && cell.getAttribute('part').indexOf('details-cell') === -1)
            .sort((a, b) => {
              return a._column._order > b._column._order ? 1 : -1;
            })
            .map((cell) => cell._content.textContent.trim())
            .filter((content) => content)
            .join('\t');
        })
        .join('\n');
    }

    /** @private */
    _dragDropAccessChanged() {
      this.filterDragAndDrop();
    }

    /**
     * Runs the `dragFilter` and `dropFilter` hooks for the visible cells.
     * If the filter depends on varying conditions, you may need to
     * call this function manually in order to update the draggability when
     * the conditions change.
     */
    filterDragAndDrop() {
      Array.from(this.$.items.children)
        .filter((row) => !row.hidden)
        .forEach((row) => {
          this._filterDragAndDrop(row, this.__getRowModel(row));
        });
    }

    /**
     * @param {!HTMLElement} row
     * @param {!GridItemModel} model
     * @protected
     */
    _filterDragAndDrop(row, model) {
      const loading = this.loading || row.hasAttribute('loading');
      const dragDisabled = !this.rowsDraggable || loading || (this.dragFilter && !this.dragFilter(model));
      const dropDisabled = !this.dropMode || loading || (this.dropFilter && !this.dropFilter(model));

      const draggableElements = Array.from(row.children).map((cell) => cell._content);

      draggableElements.forEach((e) => {
        if (dragDisabled) {
          e.removeAttribute('draggable');
        } else {
          e.setAttribute('draggable', true);
        }
      });

      row.toggleAttribute('drag-disabled', !!dragDisabled);
      row.toggleAttribute('drop-disabled', !!dropDisabled);
    }

    /**
     * Fired when starting to drag grid rows.
     *
     * @event grid-dragstart
     * @param {Object} originalEvent The native dragstart event
     * @param {Object} detail
     * @param {Object} detail.draggedItems the items in the visible viewport that are dragged
     * @param {Function} detail.setDraggedItemsCount Overrides the default number shown in the drag image on multi row drag.
     * Parameter is of type number.
     * @param {Function} detail.setDragData Sets dataTransfer data for the drag operation.
     * Note that "text" is the only data type supported by all the browsers the grid currently supports (including IE11).
     * The function takes two parameters:
     * - type:string The type of the data
     * - data:string The data
     */

    /**
     * Fired when the dragging of the rows ends.
     *
     * @event grid-dragend
     * @param {Object} originalEvent The native dragend event
     */

    /**
     * Fired when a drop occurs on top of the grid.
     *
     * @event grid-drop
     * @param {Object} originalEvent The native drop event
     * @param {Object} detail
     * @param {Object} detail.dropTargetItem The item of the grid row on which the drop occurred.
     * @param {string} detail.dropLocation The position at which the drop event took place relative to a row.
     * Depending on the dropMode value, the drop location can be one of the following
     * - `on-top`: when the drop occurred on top of the row
     * - `above`: when the drop occurred above the row
     * - `below`: when the drop occurred below the row
     * - `empty`: when the drop occurred over the grid, not relative to any specific row
     * @param {string} detail.dragData An array of items with the payload as a string representation as the
     * `data` property and the type of the data as `type` property.
     */
  };

/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
const DynamicColumnsMixin = (superClass) =>
  class DynamicColumnsMixin extends superClass {
    static get properties() {
      return {
        /**
         * @protected
         */
        _columnTree: Object
      };
    }

    /** @protected */
    ready() {
      super.ready();
      this._addNodeObserver();
    }

    /** @private */
    _hasColumnGroups(columns) {
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].localName === 'vaadin-grid-column-group') {
          return true;
        }
      }

      return false;
    }

    /**
     * @param {!GridColumnGroup} el
     * @return {!Array<!GridColumn>}
     * @protected
     */
    _getChildColumns(el) {
      return FlattenedNodesObserver.getFlattenedNodes(el).filter(this._isColumnElement);
    }

    /** @private */
    _flattenColumnGroups(columns) {
      return columns
        .map((col) => {
          if (col.localName === 'vaadin-grid-column-group') {
            return this._getChildColumns(col);
          } else {
            return [col];
          }
        })
        .reduce((prev, curr) => {
          return prev.concat(curr);
        }, []);
    }

    /** @private */
    _getColumnTree() {
      const rootColumns = FlattenedNodesObserver.getFlattenedNodes(this).filter(this._isColumnElement);
      const columnTree = [];

      for (let c = rootColumns; ; ) {
        columnTree.push(c);
        if (!this._hasColumnGroups(c)) {
          break;
        }
        c = this._flattenColumnGroups(c);
      }

      return columnTree;
    }

    /** @protected */
    _updateColumnTree() {
      const columnTree = this._getColumnTree();
      if (!this._arrayEquals(columnTree, this._columnTree)) {
        this._columnTree = columnTree;
      }
    }

    /** @private */
    _addNodeObserver() {
      this._observer = new FlattenedNodesObserver(this, (info) => {
        const hasColumnElements = (nodeCollection) => nodeCollection.filter(this._isColumnElement).length > 0;
        if (hasColumnElements(info.addedNodes) || hasColumnElements(info.removedNodes)) {
          const allRemovedCells = info.removedNodes.flatMap((c) => c._allCells);
          const filterNotConnected = (element) =>
            allRemovedCells.filter((cell) => cell._content.contains(element)).length;

          this.__removeSorters(this._sorters.filter(filterNotConnected));
          this.__removeFilters(this._filters.filter(filterNotConnected));
          this._updateColumnTree();
        }

        this._debouncerCheckImports = Debouncer.debounce(
          this._debouncerCheckImports,
          timeOut.after(2000),
          this._checkImports.bind(this)
        );

        this._ensureFirstPageLoaded();
      });
    }

    /** @private */
    _arrayEquals(arr1, arr2) {
      if (!arr1 || !arr2 || arr1.length != arr2.length) {
        return false;
      }

      for (let i = 0, l = arr1.length; i < l; i++) {
        // Check if we have nested arrays
        if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
          // recurse into the nested arrays
          if (!this._arrayEquals(arr1[i], arr2[i])) {
            return false;
          }
        } else if (arr1[i] != arr2[i]) {
          return false;
        }
      }
      return true;
    }

    /** @protected */
    _checkImports() {
      [
        'vaadin-grid-column-group',
        'vaadin-grid-filter',
        'vaadin-grid-filter-column',
        'vaadin-grid-tree-toggle',
        'vaadin-grid-selection-column',
        'vaadin-grid-sort-column',
        'vaadin-grid-sorter'
      ].forEach((elementName) => {
        const element = this.querySelector(elementName);
        if (element && !(element instanceof PolymerElement)) {
          console.warn(`Make sure you have imported the required module for <${elementName}> element.`);
        }
      });
    }

    /** @protected */
    _updateFirstAndLastColumn() {
      Array.from(this.shadowRoot.querySelectorAll('tr')).forEach((row) => this._updateFirstAndLastColumnForRow(row));
    }

    /**
     * @param {!HTMLElement} row
     * @protected
     */
    _updateFirstAndLastColumnForRow(row) {
      Array.from(row.querySelectorAll('[part~="cell"]:not([part~="details-cell"])'))
        .sort((a, b) => {
          return a._column._order - b._column._order;
        })
        .forEach((cell, cellIndex, children) => {
          cell.toggleAttribute('first-column', cellIndex === 0);
          cell.toggleAttribute('last-column', cellIndex === children.length - 1);
        });
    }

    /**
     * @param {!Node} node
     * @return {boolean}
     * @protected
     */
    _isColumnElement(node) {
      return node.nodeType === Node.ELEMENT_NODE && /\bcolumn\b/.test(node.localName);
    }
  };

/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
const EventContextMixin = (superClass) =>
  class EventContextMixin extends superClass {
    /**
     * Returns an object with context information about the event target:
     * - `item`: the data object corresponding to the targeted row (not specified when targeting header or footer)
     * - `column`: the column element corresponding to the targeted cell (not specified when targeting row details)
     * - `section`: whether the event targeted the body, header, footer or details of the grid
     *
     * These additional properties are included when `item` is specified:
     * - `index`: the index of the item
     * - `selected`: the selected state of the item
     * - `detailsOpened`: whether the row details are open for the item
     * - `expanded`: the expanded state of the tree toggle
     * - `level`: the tree hierarchy level
     *
     * The returned object is populated only when a grid cell, header, footer or row details is found in `event.composedPath()`.
     * This means mostly mouse and keyboard events. If such a grid part is not found in the path, an empty object is returned.
     * This may be the case eg. if the event is fired on the `<vaadin-grid>` element and not any deeper in the DOM, or if
     * the event targets the empty part of the grid body.
     *
     * @param {!Event} event
     * @return {GridEventContext}
     */
    getEventContext(event) {
      const context = {};

      const path = event.composedPath();
      const cell = path[path.indexOf(this.$.table) - 3];

      if (!cell) {
        return context;
      }

      context.section = ['body', 'header', 'footer', 'details'].filter(
        (section) => cell.getAttribute('part').indexOf(section) > -1
      )[0];

      if (cell._column) {
        context.column = cell._column;
      }

      if (context.section === 'body' || context.section === 'details') {
        Object.assign(context, this.__getRowModel(cell.parentElement));
      }

      return context;
    }
  };

/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
const FilterMixin = (superClass) =>
  class FilterMixin extends superClass {
    static get properties() {
      return {
        /** @private */
        _filters: {
          type: Array,
          value: function () {
            return [];
          }
        }
      };
    }

    /** @protected */
    ready() {
      super.ready();
      this.addEventListener('filter-changed', this._filterChanged.bind(this));
    }

    /** @private */
    _filterChanged(e) {
      e.stopPropagation();

      this.__addFilter(e.target);
      this.__applyFilters();
    }

    /** @private */
    __removeFilters(filtersToRemove) {
      if (filtersToRemove.length == 0) {
        return;
      }

      this._filters = this._filters.filter((filter) => filtersToRemove.indexOf(filter) < 0);
      this.__applyFilters();
    }

    /** @private */
    __addFilter(filter) {
      const filterIndex = this._filters.indexOf(filter);

      if (filterIndex === -1) {
        this._filters.push(filter);
      }
    }

    /** @private */
    __applyFilters() {
      if (this.dataProvider && this.isAttached) {
        this.clearCache();
      }
    }

    /**
     * @return {!Array<!GridFilterDefinition>}
     * @protected
     */
    _mapFilters() {
      return this._filters.map((filter) => {
        return {
          path: filter.path,
          value: filter.value
        };
      });
    }
  };

/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
const KeyboardNavigationMixin = (superClass) =>
  class KeyboardNavigationMixin extends superClass {
    static get properties() {
      return {
        /** @private */
        _headerFocusable: {
          type: Object,
          observer: '_focusableChanged'
        },

        /**
         * @type {!HTMLElement | undefined}
         * @protected
         */
        _itemsFocusable: {
          type: Object,
          observer: '_focusableChanged'
        },

        /** @private */
        _footerFocusable: {
          type: Object,
          observer: '_focusableChanged'
        },

        /** @private */
        _navigatingIsHidden: Boolean,

        /**
         * @type {number}
         * @protected
         */
        _focusedItemIndex: {
          type: Number,
          value: 0
        },

        /** @private */
        _focusedColumnOrder: Number,

        /**
         * Indicates whether the grid is currently in interaction mode.
         * In interaction mode the user is currently interacting with a control,
         * such as an input or a select, within a cell.
         * In interaction mode keyboard navigation between cells is disabled.
         * Interaction mode also prevents the focus target cell of that section of
         * the grid from receiving focus, allowing the user to switch focus to
         * controls in adjacent cells, rather than focussing the outer cell
         * itself.
         * @type {boolean}
         * @private
         */
        interacting: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          readOnly: true,
          observer: '_interactingChanged'
        }
      };
    }

    /** @protected */
    ready() {
      super.ready();

      if (this._ios || this._android) {
        // Disable keyboard navigation on mobile devices
        return;
      }

      this.addEventListener('keydown', this._onKeyDown);
      this.addEventListener('keyup', this._onKeyUp);

      this.addEventListener('focusin', this._onFocusIn);
      this.addEventListener('focusout', this._onFocusOut);

      // When focus goes from cell to another cell, focusin/focusout events do
      // not escape the grid’s shadowRoot, thus listening inside the shadowRoot.
      this.$.table.addEventListener('focusin', this._onContentFocusIn.bind(this));

      this.addEventListener('mousedown', () => {
        this.toggleAttribute('navigating', false);
        this._isMousedown = true;
      });
      this.addEventListener('mouseup', () => (this._isMousedown = false));
    }

    /** @private */
    get __rowFocusMode() {
      return (
        this.__isRow(this._itemsFocusable) || this.__isRow(this._headerFocusable) || this.__isRow(this._footerFocusable)
      );
    }

    set __rowFocusMode(value) {
      ['_itemsFocusable', '_footerFocusable', '_headerFocusable'].forEach((focusable) => {
        if (value && this.__isCell(this[focusable])) {
          this[focusable] = this[focusable].parentElement;
        } else if (!value && this.__isRow(this[focusable])) {
          this[focusable] = this[focusable].firstElementChild;
        }
      });
    }

    /** @private */
    _focusableChanged(focusable, oldFocusable) {
      if (oldFocusable) {
        oldFocusable.setAttribute('tabindex', '-1');
      }
      if (focusable) {
        this._updateGridSectionFocusTarget(focusable);
      }
    }

    /** @private */
    _interactingChanged() {
      // Update focus targets when entering / exiting interaction mode
      this._updateGridSectionFocusTarget(this._headerFocusable);
      this._updateGridSectionFocusTarget(this._itemsFocusable);
      this._updateGridSectionFocusTarget(this._footerFocusable);
    }

    /**
     * Since the focused cell/row state is stored as an element reference, the reference may get
     * out of sync when the virtual indexes for elements update due to effective size change.
     * This function updates the reference to the correct element after a possible index change.
     * @private
     */
    __updateItemsFocusable() {
      if (!this._itemsFocusable) {
        return;
      }

      const wasFocused = this.shadowRoot.activeElement === this._itemsFocusable;

      this._getVisibleRows().forEach((row) => {
        if (row.index === this._focusedItemIndex) {
          if (this.__rowFocusMode) {
            // Row focus mode
            this._itemsFocusable = row;
          } else if (this._itemsFocusable.parentElement) {
            // Cell focus mode
            const cellIndex = [...this._itemsFocusable.parentElement.children].indexOf(this._itemsFocusable);
            this._itemsFocusable = row.children[cellIndex];
          }
        }
      });

      if (wasFocused) {
        this._itemsFocusable.focus();
      }
    }

    /**
     * @param {!KeyboardEvent} e
     * @protected
     */
    _onKeyDown(e) {
      const key = e.key;

      let keyGroup;
      switch (key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'PageUp':
        case 'PageDown':
        case 'Home':
        case 'End':
          keyGroup = 'Navigation';
          break;
        case 'Enter':
        case 'Escape':
        case 'F2':
          keyGroup = 'Interaction';
          break;
        case 'Tab':
          keyGroup = 'Tab';
          break;
        case ' ':
          keyGroup = 'Space';
          break;
      }

      this._detectInteracting(e);
      if (this.interacting && keyGroup !== 'Interaction') {
        // When in the interacting mode, only the “Interaction” keys are handled.
        keyGroup = undefined;
      }

      if (keyGroup) {
        this[`_on${keyGroup}KeyDown`](e, key);
      }
    }

    /** @private */
    _ensureScrolledToIndex(index) {
      const targetRowInDom = [...this.$.items.children].find((child) => child.index === index);
      if (!targetRowInDom) {
        this.scrollToIndex(index);
      } else {
        this.__scrollIntoViewport(index);
      }
    }

    // TODO: A tree toggle component should not be the way to determine if the row is expandable
    /** @private */
    __isRowExpandable(row) {
      const treeToggle = [...row.children].reduce(
        (value, cell) => value || cell._content.querySelector('vaadin-grid-tree-toggle'),
        null
      );
      return treeToggle && !treeToggle.expanded && !treeToggle.leaf;
    }

    /** @private */
    __isRowCollapsible(row) {
      return this._isExpanded(row._item);
    }

    /** @private */
    __isDetailsCell(element) {
      return element.matches('[part~="details-cell"]');
    }

    /** @private */
    __isCell(element) {
      return element instanceof HTMLTableCellElement;
    }

    /** @private */
    __isRow(element) {
      return element instanceof HTMLTableRowElement;
    }

    /** @private */
    __getIndexOfChildElement(el) {
      return Array.prototype.indexOf.call(el.parentNode.children, el);
    }

    /** @private */
    _onNavigationKeyDown(e, key) {
      e.preventDefault();

      const visibleItemsCount = this._lastVisibleIndex - this._firstVisibleIndex - 1;

      // Handle keyboard interaction as defined in:
      // https://w3c.github.io/aria-practices/#keyboard-interaction-24

      let dx = 0,
        dy = 0;
      switch (key) {
        case 'ArrowRight':
          dx = this.__isRTL ? -1 : 1;
          break;
        case 'ArrowLeft':
          dx = this.__isRTL ? 1 : -1;
          break;
        case 'Home':
          if (this.__rowFocusMode) {
            // "If focus is on a row, moves focus to the first row. If focus is in the first row, focus does not move."
            dy = -Infinity;
          } else {
            if (e.ctrlKey) {
              // "If focus is on a cell, moves focus to the first cell in the column. If focus is in the first row, focus does not move."
              dy = -Infinity;
            } else {
              // "If focus is on a cell, moves focus to the first cell in the row. If focus is in the first cell of the row, focus does not move."
              dx = -Infinity;
            }
          }
          break;
        case 'End':
          if (this.__rowFocusMode) {
            // "If focus is on a row, moves focus to the last row. If focus is in the last row, focus does not move."
            dy = Infinity;
          } else {
            if (e.ctrlKey) {
              // "If focus is on a cell, moves focus to the last cell in the column. If focus is in the last row, focus does not move."
              dy = Infinity;
            } else {
              // "If focus is on a cell, moves focus to the last cell in the row. If focus is in the last cell of the row, focus does not move."
              dx = Infinity;
            }
          }
          break;
        case 'ArrowDown':
          dy = 1;
          break;
        case 'ArrowUp':
          dy = -1;
          break;
        case 'PageDown':
          dy = visibleItemsCount;
          break;
        case 'PageUp':
          dy = -visibleItemsCount;
          break;
      }

      const activeRow = e.composedPath().find((el) => this.__isRow(el));
      const activeCell = e.composedPath().find((el) => this.__isCell(el));

      if ((this.__rowFocusMode && !activeRow) || (!this.__rowFocusMode && !activeCell)) {
        // When using a screen reader, it's possible that neither a cell nor a row is focused.
        return;
      }

      const forwardsKey = this.__isRTL ? 'ArrowLeft' : 'ArrowRight';
      const backwardsKey = this.__isRTL ? 'ArrowRight' : 'ArrowLeft';
      if (key === forwardsKey) {
        // "Right Arrow:"
        if (this.__rowFocusMode) {
          // In row focus mode
          if (this.__isRowExpandable(activeRow)) {
            // "If focus is on a collapsed row, expands the row."
            this.expandItem(activeRow._item);
            return;
          } else {
            // "If focus is on an expanded row or is on a row that does not have child rows,
            // moves focus to the first cell in the row."
            this.__rowFocusMode = false;
            this._onCellNavigation(activeRow.firstElementChild, 0, 0);
            return;
          }
        }
      } else if (key === backwardsKey) {
        // "Left Arrow:"
        if (this.__rowFocusMode) {
          // In row focus mode
          if (this.__isRowCollapsible(activeRow)) {
            // "If focus is on an expanded row, collapses the row."
            this.collapseItem(activeRow._item);
            return;
          }
        } else {
          // In cell focus mode
          const activeRowCells = [...activeRow.children].sort((a, b) => a._order - b._order);
          if (activeCell === activeRowCells[0] || this.__isDetailsCell(activeCell)) {
            // "If focus is on the first cell in a row and row focus is supported, moves focus to the row."
            this.__rowFocusMode = true;
            this._onRowNavigation(activeRow, 0);
            return;
          }
        }
      }

      // Navigate
      if (this.__rowFocusMode) {
        // Navigate the rows
        this._onRowNavigation(activeRow, dy);
      } else {
        // Navigate the cells
        this._onCellNavigation(activeCell, dx, dy);
      }
    }

    /**
     * Focuses the target row after navigating by the given dy offset.
     * If the row is not in the viewport, it is first scrolled to.
     * @private
     **/
    _onRowNavigation(activeRow, dy) {
      const { dstRow } = this.__navigateRows(dy, activeRow);

      if (dstRow) {
        dstRow.focus();
      }
    }

    /** @private */
    __getIndexInGroup(row, bodyFallbackIndex) {
      const rowGroup = row.parentNode;
      // Body rows have index property, otherwise DOM child index of the row is used.
      if (rowGroup === this.$.items) {
        return bodyFallbackIndex !== undefined ? bodyFallbackIndex : row.index;
      } else {
        return this.__getIndexOfChildElement(row);
      }
    }

    /**
     * Returns the target row after navigating by the given dy offset.
     * Also returns infromation whether the details cell should be the target on the target row.
     * If the row is not in the viewport, it is first scrolled to.
     * @private
     **/
    __navigateRows(dy, activeRow, activeCell) {
      const currentRowIndex = this.__getIndexInGroup(activeRow, this._focusedItemIndex);
      const activeRowGroup = activeRow.parentNode;
      const maxRowIndex = (activeRowGroup === this.$.items ? this._effectiveSize : activeRowGroup.children.length) - 1;

      // Index of the destination row
      let dstRowIndex = Math.max(0, Math.min(currentRowIndex + dy, maxRowIndex));

      if (activeRowGroup !== this.$.items) {
        // Navigating header/footer rows

        // Header and footer could have hidden rows, e. g., if none of the columns
        // or groups on the given column tree level define template. Skip them
        // in vertical keyboard navigation.
        if (dstRowIndex > currentRowIndex) {
          while (dstRowIndex < maxRowIndex && activeRowGroup.children[dstRowIndex].hidden) {
            dstRowIndex++;
          }
        } else if (dstRowIndex < currentRowIndex) {
          while (dstRowIndex > 0 && activeRowGroup.children[dstRowIndex].hidden) {
            dstRowIndex--;
          }
        }

        this.toggleAttribute('navigating', true);

        return { dstRow: activeRowGroup.children[dstRowIndex] };
      } else {
        // Navigating body rows

        let dstIsRowDetails = false;
        if (activeCell) {
          const isRowDetails = this.__isDetailsCell(activeCell);
          // Row details navigation logic
          if (activeRowGroup === this.$.items) {
            const item = activeRow._item;
            const dstItem = this._cache.getItemForIndex(dstRowIndex);
            // Should we navigate to row details?
            if (isRowDetails) {
              dstIsRowDetails = dy === 0;
            } else {
              dstIsRowDetails =
                (dy === 1 && this._isDetailsOpened(item)) ||
                (dy === -1 && dstRowIndex !== currentRowIndex && this._isDetailsOpened(dstItem));
            }
            // Should we navigate between details and regular cells of the same row?
            if (
              dstIsRowDetails !== isRowDetails &&
              ((dy === 1 && dstIsRowDetails) || (dy === -1 && !dstIsRowDetails))
            ) {
              dstRowIndex = currentRowIndex;
            }
          }
        }

        // Ensure correct vertical scroll position, destination row is visible
        this._ensureScrolledToIndex(dstRowIndex);

        // When scrolling with repeated keydown, sometimes FocusEvent listeners
        // are too late to update _focusedItemIndex. Ensure next keydown
        // listener invocation gets updated _focusedItemIndex value.
        this._focusedItemIndex = dstRowIndex;

        // This has to be set after scrolling, otherwise it can be removed by
        // `_preventScrollerRotatingCellFocus(row, index)` during scrolling.
        this.toggleAttribute('navigating', true);

        return {
          dstRow: [...activeRowGroup.children].find((el) => !el.hidden && el.index === dstRowIndex),
          dstIsRowDetails
        };
      }
    }

    /**
     * Focuses the target cell after navigating by the given dx and dy offset.
     * If the cell is not in the viewport, it is first scrolled to.
     * @private
     **/
    _onCellNavigation(activeCell, dx, dy) {
      const activeRow = activeCell.parentNode;
      const { dstRow, dstIsRowDetails } = this.__navigateRows(dy, activeRow, activeCell);
      if (!dstRow) {
        return;
      }

      const columnIndex = this.__getIndexOfChildElement(activeCell);
      const isCurrentCellRowDetails = this.__isDetailsCell(activeCell);
      const activeRowGroup = activeRow.parentNode;
      const currentRowIndex = this.__getIndexInGroup(activeRow, this._focusedItemIndex);

      // _focusedColumnOrder is memoized — this is to ensure predictable
      // navigation when entering and leaving detail and column group cells.
      if (this._focusedColumnOrder === undefined) {
        if (isCurrentCellRowDetails) {
          this._focusedColumnOrder = 0;
        } else {
          this._focusedColumnOrder = this._getColumns(activeRowGroup, currentRowIndex).filter((c) => !c.hidden)[
            columnIndex
          ]._order;
        }
      }

      if (dstIsRowDetails) {
        // Focusing a row details cell on the destination row
        const dstCell = [...dstRow.children].find((el) => this.__isDetailsCell(el));
        dstCell.focus();
      } else {
        // Focusing a regular cell on the destination row

        // Find orderedColumnIndex — the index of order closest matching the
        // original _focusedColumnOrder in the sorted array of orders
        // of the visible columns on the destination row.
        const dstRowIndex = this.__getIndexInGroup(dstRow, this._focusedItemIndex);
        const dstColumns = this._getColumns(activeRowGroup, dstRowIndex).filter((c) => !c.hidden);
        const dstSortedColumnOrders = dstColumns.map((c) => c._order).sort((b, a) => b - a);
        const maxOrderedColumnIndex = dstSortedColumnOrders.length - 1;
        const orderedColumnIndex = dstSortedColumnOrders.indexOf(
          dstSortedColumnOrders
            .slice(0)
            .sort((b, a) => Math.abs(b - this._focusedColumnOrder) - Math.abs(a - this._focusedColumnOrder))[0]
        );

        // Index of the destination column order
        const dstOrderedColumnIndex =
          dy === 0 && isCurrentCellRowDetails
            ? orderedColumnIndex
            : Math.max(0, Math.min(orderedColumnIndex + dx, maxOrderedColumnIndex));

        if (dstOrderedColumnIndex !== orderedColumnIndex) {
          // Horizontal movement invalidates stored _focusedColumnOrder
          this._focusedColumnOrder = undefined;
        }

        const columnIndexByOrder = dstColumns.reduce((acc, col, i) => ((acc[col._order] = i), acc), {});
        const dstColumnIndex = columnIndexByOrder[dstSortedColumnOrders[dstOrderedColumnIndex]];
        const dstCell = dstRow.children[dstColumnIndex];

        this._scrollHorizontallyToCell(dstCell);
        dstCell.focus();
      }
    }

    /** @private */
    _onInteractionKeyDown(e, key) {
      const localTarget = e.composedPath()[0];
      const localTargetIsTextInput =
        localTarget.localName === 'input' &&
        !/^(button|checkbox|color|file|image|radio|range|reset|submit)$/i.test(localTarget.type);

      let wantInteracting;
      switch (key) {
        case 'Enter':
          wantInteracting = this.interacting ? !localTargetIsTextInput : true;
          break;
        case 'Escape':
          wantInteracting = false;
          break;
        case 'F2':
          wantInteracting = !this.interacting;
          break;
      }

      const { cell } = this._getGridEventLocation(e);

      if (this.interacting !== wantInteracting && cell !== null) {
        if (wantInteracting) {
          const focusTarget =
            cell._content.querySelector('[focus-target]') ||
            // If a child element hasn't been explicitly marked as a focus target,
            // fall back to any focusable element inside the cell.
            [...cell._content.querySelectorAll('*')].find((node) => this._isFocusable(node));
          if (focusTarget) {
            e.preventDefault();
            focusTarget.focus();
            this._setInteracting(true);
            this.toggleAttribute('navigating', false);
          }
        } else {
          e.preventDefault();
          this._focusedColumnOrder = undefined;
          cell.focus();
          this._setInteracting(false);
          this.toggleAttribute('navigating', true);
        }
      }
    }

    /** @private */
    _predictFocusStepTarget(srcElement, step) {
      const tabOrder = [
        this.$.table,
        this._headerFocusable,
        this._itemsFocusable,
        this._footerFocusable,
        this.$.focusexit
      ];

      let index = tabOrder.indexOf(srcElement);

      index += step;
      while (index >= 0 && index <= tabOrder.length - 1) {
        let rowElement = tabOrder[index];
        if (rowElement && !this.__rowFocusMode) {
          rowElement = tabOrder[index].parentNode;
        }

        if (!rowElement || rowElement.hidden) {
          index += step;
        } else {
          break;
        }
      }

      return tabOrder[index];
    }

    /** @private */
    _onTabKeyDown(e) {
      const focusTarget = this._predictFocusStepTarget(e.composedPath()[0], e.shiftKey ? -1 : 1);

      if (focusTarget === this.$.table) {
        // The focus is about to exit the grid to the top.
        this.$.table.focus();
      } else if (focusTarget === this.$.focusexit) {
        // The focus is about to exit the grid to the bottom.
        this.$.focusexit.focus();
      } else if (focusTarget === this._itemsFocusable) {
        let itemsFocusTarget = focusTarget;
        const targetRow = this.__isRow(focusTarget) ? focusTarget : focusTarget.parentNode;
        this._ensureScrolledToIndex(this._focusedItemIndex);
        if (targetRow.index !== this._focusedItemIndex && this.__isCell(focusTarget)) {
          // The target row, which is about to be focused next, has been
          // assigned with a new index since last focus, probably because of
          // scrolling. Focus the row for the stored focused item index instead.
          const columnIndex = Array.from(targetRow.children).indexOf(this._itemsFocusable);
          const focusedItemRow = Array.from(this.$.items.children).find(
            (row) => !row.hidden && row.index === this._focusedItemIndex
          );
          if (focusedItemRow) {
            itemsFocusTarget = focusedItemRow.children[columnIndex];
          }
        }
        e.preventDefault();
        itemsFocusTarget.focus();
      } else {
        e.preventDefault();
        focusTarget.focus();
      }

      this.toggleAttribute('navigating', true);
    }

    /** @private */
    _onSpaceKeyDown(e) {
      e.preventDefault();

      const element = e.composedPath()[0];
      const isRow = this.__isRow(element);
      if (isRow || !element._content || !element._content.firstElementChild) {
        this.dispatchEvent(
          new CustomEvent(isRow ? 'row-activate' : 'cell-activate', {
            detail: {
              model: this.__getRowModel(isRow ? element : element.parentElement)
            }
          })
        );
      }
    }

    /** @private */
    _onKeyUp(e) {
      if (!/^( |SpaceBar)$/.test(e.key) || this.interacting) {
        return;
      }

      e.preventDefault();

      const cell = e.composedPath()[0];
      if (cell._content && cell._content.firstElementChild) {
        const wasNavigating = this.hasAttribute('navigating');
        cell._content.firstElementChild.click();
        this.toggleAttribute('navigating', wasNavigating);
      }
    }

    /**
     * @param {!FocusEvent} e
     * @protected
     */
    _onFocusIn(e) {
      if (!this._isMousedown) {
        this.toggleAttribute('navigating', true);
      }

      const rootTarget = e.composedPath()[0];

      if (rootTarget === this.$.table || rootTarget === this.$.focusexit) {
        // The focus enters the top (bottom) of the grid, meaning that user has
        // tabbed (shift-tabbed) into the grid. Move the focus to
        // the first (the last) focusable.
        this._predictFocusStepTarget(rootTarget, rootTarget === this.$.table ? 1 : -1).focus();
        this._setInteracting(false);
      } else {
        this._detectInteracting(e);
      }
    }

    /**
     * @param {!FocusEvent} e
     * @protected
     */
    _onFocusOut(e) {
      this.toggleAttribute('navigating', false);
      this._detectInteracting(e);
    }

    /** @private */
    _onContentFocusIn(e) {
      const { section, cell, row } = this._getGridEventLocation(e);
      this._detectInteracting(e);

      if (section && (cell || row)) {
        this._activeRowGroup = section;
        if (this.$.header === section) {
          this._headerFocusable = this.__rowFocusMode ? row : cell;
        } else if (this.$.items === section) {
          this._itemsFocusable = this.__rowFocusMode ? row : cell;
        } else if (this.$.footer === section) {
          this._footerFocusable = this.__rowFocusMode ? row : cell;
        }

        if (cell) {
          // Fire a public event for cell.
          const context = this.getEventContext(e);
          cell.dispatchEvent(
            new CustomEvent('cell-focus', { bubbles: true, composed: true, detail: { context: context } })
          );
        }
      }

      this._detectFocusedItemIndex(e);
    }

    /** @private
     * Enables interaction mode if a cells descendant receives focus or keyboard
     * input. Disables it if the event is not related to cell content.
     * @param {!KeyboardEvent|!FocusEvent} e
     */
    _detectInteracting(e) {
      const isInteracting = e.composedPath().some((el) => el.localName === 'vaadin-grid-cell-content');
      this._setInteracting(isInteracting);
    }

    /** @private */
    _detectFocusedItemIndex(e) {
      const { section, row } = this._getGridEventLocation(e);
      if (section === this.$.items) {
        this._focusedItemIndex = row.index;
      }
    }

    /** @private
     * Enables or disables the focus target of the containing section of the
     * grid from receiving focus, based on whether the user is interacting with
     * that section of the grid.
     * @param {HTMLElement} focusTarget
     */
    _updateGridSectionFocusTarget(focusTarget) {
      if (!focusTarget) return;

      const section = this._getGridSectionFromFocusTarget(focusTarget);
      const isInteractingWithinActiveSection = this.interacting && section === this._activeRowGroup;

      focusTarget.tabIndex = isInteractingWithinActiveSection ? -1 : 0;
    }

    /**
     * @param {!HTMLTableRowElement} row
     * @param {number} index
     * @protected
     */
    _preventScrollerRotatingCellFocus(row, index) {
      if (
        row.index === this._focusedItemIndex &&
        this.hasAttribute('navigating') &&
        this._activeRowGroup === this.$.items
      ) {
        // Focused item has went, hide navigation mode
        this._navigatingIsHidden = true;
        this.toggleAttribute('navigating', false);
      }
      if (index === this._focusedItemIndex && this._navigatingIsHidden) {
        // Focused item is back, restore navigation mode
        this._navigatingIsHidden = false;
        this.toggleAttribute('navigating', true);
      }
    }

    /**
     * @param {HTMLTableSectionElement=} rowGroup
     * @param {number=} rowIndex
     * @return {!Array<!GridColumn>}
     * @protected
     */
    _getColumns(rowGroup, rowIndex) {
      let columnTreeLevel = this._columnTree.length - 1;
      if (rowGroup === this.$.header) {
        columnTreeLevel = rowIndex;
      } else if (rowGroup === this.$.footer) {
        columnTreeLevel = this._columnTree.length - 1 - rowIndex;
      }
      return this._columnTree[columnTreeLevel];
    }

    /** @private */
    __isValidFocusable(element) {
      return this.$.table.contains(element) && element.offsetHeight;
    }

    /** @protected */
    _resetKeyboardNavigation() {
      // Header / footer
      ['header', 'footer'].forEach((section) => {
        if (!this.__isValidFocusable(this[`_${section}Focusable`])) {
          const firstVisibleRow = [...this.$[section].children].find((row) => row.offsetHeight);
          const firstVisibleCell = firstVisibleRow ? [...firstVisibleRow.children].find((cell) => !cell.hidden) : null;
          if (firstVisibleRow && firstVisibleCell) {
            this[`_${section}Focusable`] = this.__rowFocusMode ? firstVisibleRow : firstVisibleCell;
          }
        }
      });

      // Body
      if (!this.__isValidFocusable(this._itemsFocusable) && this.$.items.firstElementChild) {
        const firstVisibleRow = this.__getFirstVisibleItem();
        const firstVisibleCell = firstVisibleRow ? [...firstVisibleRow.children].find((cell) => !cell.hidden) : null;

        if (firstVisibleCell && firstVisibleRow) {
          // Reset memoized column
          delete this._focusedColumnOrder;
          this._itemsFocusable = this.__rowFocusMode ? firstVisibleRow : firstVisibleCell;
        }
      } else {
        this.__updateItemsFocusable();
      }
    }

    /**
     * @param {!HTMLElement} dstCell
     * @protected
     */
    _scrollHorizontallyToCell(dstCell) {
      if (dstCell.hasAttribute('frozen') || this.__isDetailsCell(dstCell)) {
        // These cells are, by design, always visible, no need to scroll.
        return;
      }

      const dstCellRect = dstCell.getBoundingClientRect();
      const dstRow = dstCell.parentNode;
      const dstCellIndex = Array.from(dstRow.children).indexOf(dstCell);
      const tableRect = this.$.table.getBoundingClientRect();
      let leftBoundary = tableRect.left,
        rightBoundary = tableRect.right;
      for (let i = dstCellIndex - 1; i >= 0; i--) {
        const cell = dstRow.children[i];
        if (cell.hasAttribute('hidden') || this.__isDetailsCell(cell)) {
          continue;
        }
        if (cell.hasAttribute('frozen')) {
          leftBoundary = cell.getBoundingClientRect().right;
          break;
        }
      }
      for (let i = dstCellIndex + 1; i < dstRow.children.length; i++) {
        const cell = dstRow.children[i];
        if (cell.hasAttribute('hidden') || this.__isDetailsCell(cell)) {
          continue;
        }
        if (cell.hasAttribute('frozen')) {
          rightBoundary = cell.getBoundingClientRect().left;
          break;
        }
      }

      if (dstCellRect.left < leftBoundary) {
        this.$.table.scrollLeft += Math.round(dstCellRect.left - leftBoundary);
      }
      if (dstCellRect.right > rightBoundary) {
        this.$.table.scrollLeft += Math.round(dstCellRect.right - rightBoundary);
      }
    }

    /**
     * @typedef {Object} GridEventLocation
     * @property {HTMLTableSectionElement | null} section - The table section element that the event occurred in (header, body, or footer), or null if the event did not occur in a section
     * @property {HTMLTableRowElement | null} row - The row element that the event occurred in, or null if the event did not occur in a row
     * @property {HTMLTableCellElement | null} cell - The cell element that the event occurred in, or null if the event did not occur in a cell
     * @private
     */
    /**
     * Takes an event and returns a location object describing in which part of the grid the event occurred.
     * The event may either target table section, a row, a cell or contents of a cell.
     * @param {Event} e
     * @returns {GridEventLocation}
     * @private
     */
    _getGridEventLocation(e) {
      const path = e.composedPath();
      const tableIndex = path.indexOf(this.$.table);
      // Assuming ascending path to table is: [...,] th|td, tr, thead|tbody, table [,...]
      const section = tableIndex >= 1 ? path[tableIndex - 1] : null;
      const row = tableIndex >= 2 ? path[tableIndex - 2] : null;
      const cell = tableIndex >= 3 ? path[tableIndex - 3] : null;

      return {
        section,
        row,
        cell
      };
    }

    /**
     * Helper method that maps a focus target cell to the containing grid section
     * @param {HTMLElement} focusTarget
     * @returns {HTMLTableSectionElement | null}
     * @private
     */
    _getGridSectionFromFocusTarget(focusTarget) {
      if (focusTarget === this._headerFocusable) return this.$.header;
      if (focusTarget === this._itemsFocusable) return this.$.items;
      if (focusTarget === this._footerFocusable) return this.$.footer;
      return null;
    }

    /**
     * Fired when a cell is focused with click or keyboard navigation.
     *
     * Use context property of @see {@link GridCellFocusEvent} to get detail information about the event.
     *
     * @event cell-focus
     */
  };

/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
const RowDetailsMixin = (superClass) =>
  class RowDetailsMixin extends superClass {
    static get properties() {
      return {
        /**
         * An array containing references to items with open row details.
         * @type {!Array<!GridItem>}
         */
        detailsOpenedItems: {
          type: Array,
          value: function () {
            return [];
          }
        },

        /**
         * Custom function for rendering the content of the row details.
         * Receives three arguments:
         *
         * - `root` The row details content DOM element. Append your content to it.
         * - `grid` The `<vaadin-grid>` element.
         * - `model` The object with the properties related with
         *   the rendered item, contains:
         *   - `model.index` The index of the item.
         *   - `model.item` The item.
         *   - `model.level` The number of the item's tree sublevel, starts from 0.
         *   - `model.expanded` True if the item's tree sublevel is expanded.
         *   - `model.selected` True if the item is selected.
         *
         * @type {GridRowDetailsRenderer | null | undefined}
         */
        rowDetailsRenderer: Function,

        /**
         * @type {!Array<!HTMLElement> | undefined}
         * @protected
         */
        _detailsCells: {
          type: Array
        }
      };
    }

    static get observers() {
      return [
        '_detailsOpenedItemsChanged(detailsOpenedItems.*, rowDetailsRenderer)',
        '_rowDetailsRendererChanged(rowDetailsRenderer)'
      ];
    }

    /** @protected */
    ready() {
      super.ready();

      this._detailsCellResizeObserver = new ResizeObserver((entries) => {
        entries.forEach(({ target: cell }) => {
          this._updateDetailsCellHeight(cell.parentElement);
        });

        // This workaround is needed until Safari also supports
        // ResizeObserver.observe with {box: 'border-box'}
        this.__virtualizer.__adapter._resizeHandler();
      });
    }

    /** @private */
    _rowDetailsRendererChanged(rowDetailsRenderer) {
      if (!rowDetailsRenderer) {
        return;
      }

      if (this._columnTree) {
        // Only update the rows if the column tree has already been initialized
        Array.from(this.$.items.children).forEach((row) => {
          if (!row.querySelector('[part~=details-cell]')) {
            this._updateRow(row, this._columnTree[this._columnTree.length - 1]);
            const isDetailsOpened = this._isDetailsOpened(row._item);
            this._a11yUpdateRowDetailsOpened(row, isDetailsOpened);
            this._toggleDetailsCell(row, isDetailsOpened);
          }
        });
      }
    }

    /** @private */
    _detailsOpenedItemsChanged(changeRecord, rowDetailsRenderer) {
      // Skip to avoid duplicate work of both “.splices” and “.length” updates.
      if (changeRecord.path === 'detailsOpenedItems.length' || !changeRecord.value) {
        return;
      }

      [...this.$.items.children].forEach((row) => {
        // Re-renders the row to possibly close the previously opened details.
        if (row.hasAttribute('details-opened')) {
          this._updateItem(row, row._item);
          return;
        }

        // Re-renders the row to open the details when a row details renderer is provided.
        if (rowDetailsRenderer && this._isDetailsOpened(row._item)) {
          this._updateItem(row, row._item);
          return;
        }
      });
    }

    /**
     * @param {!HTMLElement} cell
     * @protected
     */
    _configureDetailsCell(cell) {
      cell.setAttribute('part', 'cell details-cell');
      // Freeze the details cell, so that it does not scroll horizontally
      // with the normal cells. This way it looks less weird.
      cell.toggleAttribute('frozen', true);

      this._detailsCellResizeObserver.observe(cell);
    }

    /**
     * @param {!HTMLElement} row
     * @param {!GridItem} item
     * @protected
     */
    _toggleDetailsCell(row, detailsOpened) {
      const cell = row.querySelector('[part~="details-cell"]');
      if (!cell) {
        return;
      }

      cell.hidden = !detailsOpened;

      if (cell.hidden) {
        return;
      }

      // Assigns a renderer when the details cell is opened.
      // The details cell content is rendered later in the `_updateItem` method.
      if (this.rowDetailsRenderer) {
        cell._renderer = this.rowDetailsRenderer;
      }
    }

    /** @protected */
    _updateDetailsCellHeight(row) {
      const cell = row.querySelector('[part~="details-cell"]');
      if (!cell) {
        return;
      }

      if (cell.hidden) {
        row.style.removeProperty('padding-bottom');
      } else {
        row.style.setProperty('padding-bottom', `${cell.offsetHeight}px`);
      }
    }

    /** @protected */
    _updateDetailsCellHeights() {
      [...this.$.items.children].forEach((row) => {
        this._updateDetailsCellHeight(row);
      });
    }

    /**
     * @param {!GridItem} item
     * @return {boolean}
     * @protected
     */
    _isDetailsOpened(item) {
      return this.detailsOpenedItems && this._getItemIndexInArray(item, this.detailsOpenedItems) !== -1;
    }

    /**
     * Open the details row of a given item.
     * @param {!GridItem} item
     */
    openItemDetails(item) {
      if (!this._isDetailsOpened(item)) {
        this.detailsOpenedItems = [...this.detailsOpenedItems, item];
      }
    }

    /**
     * Close the details row of a given item.
     * @param {!GridItem} item
     */
    closeItemDetails(item) {
      if (this._isDetailsOpened(item)) {
        this.detailsOpenedItems = this.detailsOpenedItems.filter((i) => !this._itemsEqual(i, item));
      }
    }
  };

/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const timeouts = {
  SCROLLING: 500
};

/**
 * @polymerMixin
 */
const ScrollMixin = (superClass) =>
  class ScrollMixin extends superClass {
    static get properties() {
      return {
        /**
         * Cached array of frozen cells
         * @private
         */
        _frozenCells: {
          type: Array,
          value: () => []
        },

        /** @private */
        _rowWithFocusedElement: Element
      };
    }

    /**
     * Override (from iron-scroll-target-behavior) to avoid document scroll
     * @private
     */
    set _scrollTop(top) {
      this.$.table.scrollTop = top;
    }

    /** @private */
    get _scrollTop() {
      return this.$.table.scrollTop;
    }

    /** @private */
    get _scrollLeft() {
      return this.$.table.scrollLeft;
    }

    /** @protected */
    ready() {
      super.ready();

      // Preserve accessor to the legacy scrolling functionality
      this.$.outerscroller = document.createElement('div');

      this.scrollTarget = this.$.table;

      this.$.items.addEventListener('focusin', (e) => {
        const itemsIndex = e.composedPath().indexOf(this.$.items);
        this._rowWithFocusedElement = e.composedPath()[itemsIndex - 1];
      });
      this.$.items.addEventListener('focusout', () => (this._rowWithFocusedElement = undefined));

      this.$.table.addEventListener('scroll', () => this._afterScroll());
    }

    /**
     * Scroll to a specific row index in the virtual list. Note that the row index is
     * not always the same for any particular item. For example, sorting/filtering/expanding
     * or collapsing hierarchical items can affect the row index related to an item.
     *
     * @param {number} index Row index to scroll to
     */
    scrollToIndex(index) {
      index = Math.min(this._effectiveSize - 1, Math.max(0, index));
      this.__virtualizer.scrollToIndex(index);
      this.__scrollIntoViewport(index);
    }

    /**
     * Makes sure the row with the given index (if found in the DOM) is fully
     * inside the visible viewport, taking header/footer into account.
     * @private
     */
    __scrollIntoViewport(index) {
      const rowElement = [...this.$.items.children].find((child) => child.index === index);
      if (rowElement) {
        const dstRect = rowElement.getBoundingClientRect();
        const footerTop = this.$.footer.getBoundingClientRect().top;
        const headerBottom = this.$.header.getBoundingClientRect().bottom;
        if (dstRect.bottom > footerTop) {
          this.$.table.scrollTop += dstRect.bottom - footerTop;
        } else if (dstRect.top < headerBottom) {
          this.$.table.scrollTop -= headerBottom - dstRect.top;
        }
      }
    }

    /** @private */
    _scheduleScrolling() {
      if (!this._scrollingFrame) {
        // Defer setting state attributes to avoid Edge hiccups
        this._scrollingFrame = requestAnimationFrame(() => this.$.scroller.toggleAttribute('scrolling', true));
      }
      this._debounceScrolling = Debouncer.debounce(this._debounceScrolling, timeOut.after(timeouts.SCROLLING), () => {
        cancelAnimationFrame(this._scrollingFrame);
        delete this._scrollingFrame;
        this.$.scroller.toggleAttribute('scrolling', false);
      });
    }

    /** @private */
    _afterScroll() {
      this.__updateHorizontalScrollPosition();

      if (!this.hasAttribute('reordering')) {
        this._scheduleScrolling();
      }

      this._updateOverflow();
    }

    /** @private */
    _updateOverflow() {
      // Set overflow styling attributes
      let overflow = '';
      const table = this.$.table;
      if (table.scrollTop < table.scrollHeight - table.clientHeight) {
        overflow += ' bottom';
      }

      if (table.scrollTop > 0) {
        overflow += ' top';
      }

      if (table.scrollLeft < table.scrollWidth - table.clientWidth) {
        overflow += ' right';
      }

      if (table.scrollLeft > 0) {
        overflow += ' left';
      }

      this._debounceOverflow = Debouncer.debounce(this._debounceOverflow, animationFrame, () => {
        const value = overflow.trim();
        if (value.length > 0 && this.getAttribute('overflow') !== value) {
          this.setAttribute('overflow', value);
        } else if (value.length == 0 && this.hasAttribute('overflow')) {
          this.removeAttribute('overflow');
        }
      });
    }

    /** @protected */
    _frozenCellsChanged() {
      this._debouncerCacheElements = Debouncer.debounce(this._debouncerCacheElements, microTask, () => {
        Array.from(this.shadowRoot.querySelectorAll('[part~="cell"]')).forEach(function (cell) {
          cell.style.transform = '';
        });
        this._frozenCells = Array.prototype.slice.call(this.$.table.querySelectorAll('[frozen]'));
        this.__updateHorizontalScrollPosition();
      });
      this._updateLastFrozen();
    }

    /** @protected */
    _updateLastFrozen() {
      if (!this._columnTree) {
        return;
      }

      const columnsRow = this._columnTree[this._columnTree.length - 1].slice(0);
      columnsRow.sort((a, b) => {
        return a._order - b._order;
      });
      const lastFrozen = columnsRow.reduce((prev, col, index) => {
        col._lastFrozen = false;
        return col.frozen && !col.hidden ? index : prev;
      }, undefined);
      if (lastFrozen !== undefined) {
        columnsRow[lastFrozen]._lastFrozen = true;
      }
    }

    /** @private */
    __updateHorizontalScrollPosition() {
      this.$.table.style.setProperty('--_grid-horizontal-scroll-position', -this._scrollLeft + 'px');

      if (this.__isRTL) {
        // Translating the sticky sections using a CSS variable works nicely on LTR.
        // On RTL, it causes jumpy behavior (on Desktop Safari) so we need to translate manually.
        const x = this.__getNormalizedScrollLeft(this.$.table) + this.$.table.clientWidth - this.$.table.scrollWidth;
        const transform = `translate(${x}px, 0)`;
        for (let i = 0; i < this._frozenCells.length; i++) {
          this._frozenCells[i].style.transform = transform;
        }
      }
    }
  };

/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
const SelectionMixin = (superClass) =>
  class SelectionMixin extends superClass {
    static get properties() {
      return {
        /**
         * An array that contains the selected items.
         * @type {!Array<!GridItem>}
         */
        selectedItems: {
          type: Object,
          notify: true,
          value: () => []
        }
      };
    }

    static get observers() {
      return ['_selectedItemsChanged(selectedItems.*)'];
    }

    /**
     * @param {!GridItem} item
     * @return {boolean}
     * @protected
     */
    _isSelected(item) {
      return this.selectedItems && this._getItemIndexInArray(item, this.selectedItems) > -1;
    }

    /**
     * Selects the given item.
     *
     * @method selectItem
     * @param {!GridItem} item The item object
     */
    selectItem(item) {
      if (!this._isSelected(item)) {
        this.selectedItems = [...this.selectedItems, item];
      }
    }

    /**
     * Deselects the given item if it is already selected.
     *
     * @method deselect
     * @param {!GridItem} item The item object
     */
    deselectItem(item) {
      if (this._isSelected(item)) {
        this.selectedItems = this.selectedItems.filter((i) => !this._itemsEqual(i, item));
      }
    }

    /**
     * Toggles the selected state of the given item.
     *
     * @method toggle
     * @param {!GridItem} item The item object
     * @protected
     */
    _toggleItem(item) {
      const index = this._getItemIndexInArray(item, this.selectedItems);
      if (index === -1) {
        this.selectItem(item);
      } else {
        this.deselectItem(item);
      }
    }

    /** @private */
    _selectedItemsChanged() {
      this.requestContentUpdate();
    }

    /**
     * Fired when the `selectedItems` property changes.
     *
     * @event selected-items-changed
     */
  };

/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
const SortMixin = (superClass) =>
  class SortMixin extends superClass {
    static get properties() {
      return {
        /**
         * When `true`, all `<vaadin-grid-sorter>` are applied for sorting.
         * @attr {boolean} multi-sort
         * @type {boolean}
         */
        multiSort: {
          type: Boolean,
          value: false
        },

        /**
         * @type {!Array<!GridSorterDefinition>}
         * @protected
         */
        _sorters: {
          type: Array,
          value: function () {
            return [];
          }
        },

        /** @private */
        _previousSorters: {
          type: Array,
          value: function () {
            return [];
          }
        }
      };
    }

    /** @protected */
    ready() {
      super.ready();
      this.addEventListener('sorter-changed', this._onSorterChanged);
    }

    /** @private */
    _onSorterChanged(e) {
      const sorter = e.target;
      e.stopPropagation();
      this.__updateSorter(sorter);
      this.__applySorters();
    }

    /** @private */
    __removeSorters(sortersToRemove) {
      if (sortersToRemove.length == 0) {
        return;
      }

      this._sorters = this._sorters.filter((sorter) => sortersToRemove.indexOf(sorter) < 0);
      if (this.multiSort) {
        this.__updateSortOrders();
      }
      this.__applySorters();
    }

    /** @private */
    __updateSortOrders() {
      this._sorters.forEach((sorter, index) => (sorter._order = this._sorters.length > 1 ? index : null), this);
    }

    /** @private */
    __updateSorter(sorter) {
      if (!sorter.direction && this._sorters.indexOf(sorter) === -1) {
        return;
      }

      sorter._order = null;

      if (this.multiSort) {
        this._removeArrayItem(this._sorters, sorter);
        if (sorter.direction) {
          this._sorters.unshift(sorter);
        }
        this.__updateSortOrders();
      } else {
        if (sorter.direction) {
          const otherSorters = this._sorters.filter((s) => s != sorter);
          this._sorters = [sorter];
          otherSorters.forEach((sorter) => {
            sorter._order = null;
            sorter.direction = null;
          });
        }
      }
    }

    /** @private */
    __applySorters() {
      if (
        this.dataProvider &&
        // No need to clear cache if sorters didn't change and grid is attached
        this.isAttached &&
        JSON.stringify(this._previousSorters) !== JSON.stringify(this._mapSorters())
      ) {
        this.clearCache();
      }

      this._a11yUpdateSorters();

      this._previousSorters = this._mapSorters();
    }

    /**
     * @return {!Array<!GridSorterDefinition>}
     * @protected
     */
    _mapSorters() {
      return this._sorters.map((sorter) => {
        return {
          path: sorter.path,
          direction: sorter.direction
        };
      });
    }

    /** @private */
    _removeArrayItem(array, item) {
      const index = array.indexOf(item);
      if (index > -1) {
        array.splice(index, 1);
      }
    }
  };

/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * @polymerMixin
 */
const StylingMixin = (superClass) =>
  class StylingMixin extends superClass {
    static get properties() {
      return {
        /**
         * A function that allows generating CSS class names for grid cells
         * based on their row and column. The return value should be the generated
         * class name as a string, or multiple class names separated by whitespace
         * characters.
         *
         * Receives two arguments:
         * - `column` The `<vaadin-grid-column>` element (`undefined` for details-cell).
         * - `model` The object with the properties related with
         *   the rendered item, contains:
         *   - `model.index` The index of the item.
         *   - `model.item` The item.
         *   - `model.expanded` Sublevel toggle state.
         *   - `model.level` Level of the tree represented with a horizontal offset of the toggle button.
         *   - `model.selected` Selected state.
         *
         * @type {GridCellClassNameGenerator | null | undefined}
         */
        cellClassNameGenerator: Function
      };
    }

    static get observers() {
      return ['__cellClassNameGeneratorChanged(cellClassNameGenerator)'];
    }

    __cellClassNameGeneratorChanged() {
      this.generateCellClassNames();
    }

    /**
     * Runs the `cellClassNameGenerator` for the visible cells.
     * If the generator depends on varying conditions, you need to
     * call this function manually in order to update the styles when
     * the conditions change.
     */
    generateCellClassNames() {
      Array.from(this.$.items.children)
        .filter((row) => !row.hidden)
        .forEach((row) => this._generateCellClassNames(row, this.__getRowModel(row)));
    }

    /** @private */
    _generateCellClassNames(row, model) {
      Array.from(row.children).forEach((cell) => {
        if (cell.__generatedClasses) {
          cell.__generatedClasses.forEach((className) => cell.classList.remove(className));
        }
        if (this.cellClassNameGenerator) {
          const result = this.cellClassNameGenerator(cell._column, model);
          cell.__generatedClasses = result && result.split(' ').filter((className) => className.length > 0);
          if (cell.__generatedClasses) {
            cell.__generatedClasses.forEach((className) => cell.classList.add(className));
          }
        }
      });
    }
  };

/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * `<vaadin-grid>` is a free, high quality data grid / data table Web Component. The content of the
 * the grid can be populated by using renderer callback function.
 *
 * ### Quick Start
 *
 * Start with an assigning an array to the [`items`](#/elements/vaadin-grid#property-items) property to visualize your data.
 *
 * Use the [`<vaadin-grid-column>`](#/elements/vaadin-grid-column) element to configure the grid columns. Set `path` and `header`
 * shorthand properties for the columns to define what gets rendered in the cells of the column.
 *
 * #### Example:
 * ```html
 * <vaadin-grid>
 *   <vaadin-grid-column path="name.first" header="First name"></vaadin-grid-column>
 *   <vaadin-grid-column path="name.last" header="Last name"></vaadin-grid-column>
 *   <vaadin-grid-column path="email"></vaadin-grid-column>
 * </vaadin-grid>
 * ```
 *
 * For custom content `vaadin-grid-column` element provides you with three types of `renderer` callback functions: `headerRenderer`,
 * `renderer` and `footerRenderer`.
 *
 * Each of those renderer functions provides `root`, `column`, `model` arguments when applicable.
 * Generate DOM content, append it to the `root` element and control the state
 * of the host element by accessing `column`. Before generating new content,
 * users are able to check if there is already content in `root` for reusing it.
 *
 * Renderers are called on initialization of new column cells and each time the
 * related row model is updated. DOM generated during the renderer call can be reused
 * in the next renderer call and will be provided with the `root` argument.
 * On first call it will be empty.
 *
 * #### Example:
 * ```html
 * <vaadin-grid>
 *   <vaadin-grid-column></vaadin-grid-column>
 *   <vaadin-grid-column></vaadin-grid-column>
 *   <vaadin-grid-column></vaadin-grid-column>
 * </vaadin-grid>
 * ```
 * ```js
 * const grid = document.querySelector('vaadin-grid');
 * grid.items = [{'name': 'John', 'surname': 'Lennon', 'role': 'singer'},
 *               {'name': 'Ringo', 'surname': 'Starr', 'role': 'drums'}];
 *
 * const columns = grid.querySelectorAll('vaadin-grid-column');
 *
 * columns[0].headerRenderer = function(root) {
 *   root.textContent = 'Name';
 * };
 * columns[0].renderer = function(root, column, model) {
 *   root.textContent = model.item.name;
 * };
 *
 * columns[1].headerRenderer = function(root) {
 *   root.textContent = 'Surname';
 * };
 * columns[1].renderer = function(root, column, model) {
 *   root.textContent = model.item.surname;
 * };
 *
 * columns[2].headerRenderer = function(root) {
 *   root.textContent = 'Role';
 * };
 * columns[2].renderer = function(root, column, model) {
 *   root.textContent = model.item.role;
 * };
 * ```
 *
 * The following properties are available in the `model` argument:
 *
 * Property name | Type | Description
 * --------------|------|------------
 * `index`| Number | The index of the item.
 * `item` | String or Object | The item.
 * `level` | Number | Number of the item's tree sublevel, starts from 0.
 * `expanded` | Boolean | True if the item's tree sublevel is expanded.
 * `selected` | Boolean | True if the item is selected.
 * `detailsOpened` | Boolean | True if the item's row details are open.
 *
 * The following helper elements can be used for further customization:
 * - [`<vaadin-grid-column-group>`](#/elements/vaadin-grid-column-group)
 * - [`<vaadin-grid-filter>`](#/elements/vaadin-grid-filter)
 * - [`<vaadin-grid-sorter>`](#/elements/vaadin-grid-sorter)
 * - [`<vaadin-grid-selection-column>`](#/elements/vaadin-grid-selection-column)
 * - [`<vaadin-grid-tree-toggle>`](#/elements/vaadin-grid-tree-toggle)
 *
 * __Note that the helper elements must be explicitly imported.__
 * If you want to import everything at once you can use the `all-imports.html` bundle.
 *
 * ### Lazy Loading with Function Data Provider
 *
 * In addition to assigning an array to the items property, you can alternatively
 * provide the `<vaadin-grid>` data through the
 * [`dataProvider`](#/elements/vaadin-grid#property-dataProvider) function property.
 * The `<vaadin-grid>` calls this function lazily, only when it needs more data
 * to be displayed.
 *
 * See the [`dataProvider`](#/elements/vaadin-grid#property-dataProvider) in
 * the API reference below for the detailed data provider arguments description,
 * and the “Assigning Data” page in the demos.
 *
 * __Note that expanding the tree grid's item will trigger a call to the `dataProvider`.__
 *
 * __Also, note that when using function data providers, the total number of items
 * needs to be set manually. The total number of items can be returned
 * in the second argument of the data provider callback:__
 *
 * ```javascript
 * grid.dataProvider = ({page, pageSize}, callback) => {
 *   // page: the requested page index
 *   // pageSize: number of items on one page
 *   const url = `https://api.example/data?page=${page}&per_page=${pageSize}`;
 *
 *   fetch(url)
 *     .then((res) => res.json())
 *     .then(({ employees, totalSize }) => {
 *       callback(employees, totalSize);
 *     });
 * };
 * ```
 *
 * __Alternatively, you can use the `size` property to set the total number of items:__
 *
 * ```javascript
 * grid.size = 200; // The total number of items
 * grid.dataProvider = ({page, pageSize}, callback) => {
 *   const url = `https://api.example/data?page=${page}&per_page=${pageSize}`;
 *
 *   fetch(url)
 *     .then((res) => res.json())
 *     .then((resJson) => callback(resJson.employees));
 * };
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------------|----------------
 * `row` | Row in the internal table
 * `cell` | Cell in the internal table
 * `header-cell` | Header cell in the internal table
 * `body-cell` | Body cell in the internal table
 * `footer-cell` | Footer cell in the internal table
 * `details-cell` | Row details cell in the internal table
 * `resize-handle` | Handle for resizing the columns
 * `reorder-ghost` | Ghost element of the header cell being dragged
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description | Part name
 * -------------|-------------|------------
 * `loading` | Set when the grid is loading data from data provider | :host
 * `interacting` | Keyboard navigation in interaction mode | :host
 * `navigating` | Keyboard navigation in navigation mode | :host
 * `overflow` | Set when rows are overflowing the grid viewport. Possible values: `top`, `bottom`, `left`, `right` | :host
 * `reordering` | Set when the grid's columns are being reordered | :host
 * `dragover` | Set when the grid (not a specific row) is dragged over | :host
 * `dragging-rows` : Set when grid rows are dragged  | :host
 * `reorder-status` | Reflects the status of a cell while columns are being reordered | cell
 * `frozen` | Frozen cell | cell
 * `last-frozen` | Last frozen cell | cell
 * `first-column` | First visible cell on a row | cell
 * `last-column` | Last visible cell on a row | cell
 * `selected` | Selected row | row
 * `expanded` | Expanded row | row
 * `details-opened` | Row with details open | row
 * `loading` | Row that is waiting for data from data provider | row
 * `odd` | Odd row | row
 * `first` | The first body row | row
 * `last` | The last body row | row
 * `dragstart` | Set for one frame when drag of a row is starting. The value is a number when multiple rows are dragged | row
 * `dragover` | Set when the row is dragged over | row
 * `drag-disabled` | Set to a row that isn't available for dragging | row
 * `drop-disabled` | Set to a row that can't be dropped on top of | row
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {CustomEvent} active-item-changed - Fired when the `activeItem` property changes.
 * @fires {CustomEvent} cell-activate - Fired when the cell is activated with click or keyboard.
 * @fires {CustomEvent} cell-focus - Fired when a cell is focused with click or keyboard navigation.
 * @fires {CustomEvent} column-reorder - Fired when the columns in the grid are reordered.
 * @fires {CustomEvent} column-resize - Fired when the grid column resize is finished.
 * @fires {CustomEvent} expanded-items-changed - Fired when the `expandedItems` property changes.
 * @fires {CustomEvent} grid-dragstart - Fired when starting to drag grid rows.
 * @fires {CustomEvent} grid-dragend - Fired when the dragging of the rows ends.
 * @fires {CustomEvent} grid-drop - Fired when a drop occurs on top of the grid.
 * @fires {CustomEvent} loading-changed - Fired when the `loading` property changes.
 * @fires {CustomEvent} selected-items-changed - Fired when the `selectedItems` property changes.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @mixes A11yMixin
 * @mixes ActiveItemMixin
 * @mixes ArrayDataProviderMixin
 * @mixes ColumnResizingMixin
 * @mixes DataProviderMixin
 * @mixes DynamicColumnsMixin
 * @mixes FilterMixin
 * @mixes RowDetailsMixin
 * @mixes ScrollMixin
 * @mixes SelectionMixin
 * @mixes SortMixin
 * @mixes KeyboardNavigationMixin
 * @mixes ColumnReorderingMixin
 * @mixes EventContextMixin
 * @mixes StylingMixin
 * @mixes DragAndDropMixin
 */
class Grid extends ElementMixin(
  ThemableMixin(
    DataProviderMixin(
      ArrayDataProviderMixin(
        DynamicColumnsMixin(
          ActiveItemMixin(
            ScrollMixin(
              SelectionMixin(
                SortMixin(
                  RowDetailsMixin(
                    KeyboardNavigationMixin(
                      A11yMixin(
                        FilterMixin(
                          ColumnReorderingMixin(
                            ColumnResizingMixin(EventContextMixin(DragAndDropMixin(StylingMixin(PolymerElement))))
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  )
) {
  static get template() {
    return html`
      <div
        id="scroller"
        safari$="[[_safari]]"
        ios$="[[_ios]]"
        loading$="[[loading]]"
        column-reordering-allowed$="[[columnReorderingAllowed]]"
      >
        <table id="table" role="treegrid" aria-multiselectable="true" tabindex="0">
          <caption id="sizer" part="row"></caption>
          <thead id="header" role="rowgroup"></thead>
          <tbody id="items" role="rowgroup"></tbody>
          <tfoot id="footer" role="rowgroup"></tfoot>
        </table>

        <div part="reorder-ghost"></div>
      </div>

      <div id="focusexit" tabindex="0"></div>
    `;
  }

  static get is() {
    return 'vaadin-grid';
  }

  static get observers() {
    return [
      '_columnTreeChanged(_columnTree, _columnTree.*)',
      '_effectiveSizeChanged(_effectiveSize, __virtualizer, _hasData, _columnTree)'
    ];
  }

  static get properties() {
    return {
      /** @private */
      _safari: {
        type: Boolean,
        value: isSafari
      },

      /** @private */
      _ios: {
        type: Boolean,
        value: isIOS
      },

      /** @private */
      _firefox: {
        type: Boolean,
        value: isFirefox
      },

      /** @private */
      _android: {
        type: Boolean,
        value: isAndroid
      },

      /** @private */
      _touchDevice: {
        type: Boolean,
        value: isTouch
      },

      /**
       * If true, the grid's height is defined by its rows.
       *
       * Effectively, this disables the grid's virtual scrolling so that all the rows are rendered in the DOM at once.
       * If the grid has a large number of items, using the feature is discouraged to avoid performance issues.
       * @attr {boolean} all-rows-visible
       * @type {boolean}
       */
      allRowsVisible: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /** @private */
      _recalculateColumnWidthOnceLoadingFinished: {
        type: Boolean,
        value: true
      },

      /** @private */
      isAttached: {
        value: false
      },

      /**
       * An internal property that is mainly used by `vaadin-template-renderer`
       * to identify grid elements.
       *
       * @private
       */
      __gridElement: {
        type: Boolean,
        value: true
      }
    };
  }

  constructor() {
    super();
    this.addEventListener('animationend', this._onAnimationEnd);
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();
    this.isAttached = true;
    this.recalculateColumnWidths();
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.isAttached = false;
  }

  /** @private */
  __getFirstVisibleItem() {
    return this._getVisibleRows().find((row) => this._isInViewport(row));
  }

  /** @private */
  get _firstVisibleIndex() {
    const firstVisibleItem = this.__getFirstVisibleItem();
    return firstVisibleItem ? firstVisibleItem.index : undefined;
  }

  /** @private */
  __getLastVisibleItem() {
    return this._getVisibleRows()
      .reverse()
      .find((row) => this._isInViewport(row));
  }

  /** @private */
  get _lastVisibleIndex() {
    const lastVisibleItem = this.__getLastVisibleItem();
    return lastVisibleItem ? lastVisibleItem.index : undefined;
  }

  /** @private */
  _isInViewport(item) {
    const scrollTargetRect = this.$.table.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const headerHeight = this.$.header.getBoundingClientRect().height;
    const footerHeight = this.$.footer.getBoundingClientRect().height;
    return (
      itemRect.bottom > scrollTargetRect.top + headerHeight && itemRect.top < scrollTargetRect.bottom - footerHeight
    );
  }

  /** @private */
  _getVisibleRows() {
    return Array.from(this.$.items.children)
      .filter((item) => !item.hidden)
      .sort((a, b) => a.index - b.index);
  }

  /** @protected */
  ready() {
    super.ready();

    this.__virtualizer = new Virtualizer({
      createElements: this._createScrollerRows.bind(this),
      updateElement: this._updateScrollerItem.bind(this),
      scrollContainer: this.$.items,
      scrollTarget: this.$.table,
      reorderElements: true
    });

    new ResizeObserver(() => setTimeout(() => this.__updateFooterPositioning())).observe(this.$.footer);

    processTemplates(this);
  }

  /**
   * @param {string} name
   * @param {?string} oldValue
   * @param {?string} newValue
   * @protected
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'dir') {
      this.__isRTL = newValue === 'rtl';
    }
  }

  /** @private */
  __getBodyCellCoordinates(cell) {
    if (this.$.items.contains(cell) && cell.localName === 'td') {
      return {
        item: cell.parentElement._item,
        column: cell._column
      };
    }
  }

  /** @private */
  __focusBodyCell({ item, column }) {
    const row = this._getVisibleRows().find((row) => row._item === item);
    const cell = row && [...row.children].find((cell) => cell._column === column);
    cell && cell.focus();
  }

  /** @private */
  _effectiveSizeChanged(effectiveSize, virtualizer, hasData, columnTree) {
    if (virtualizer && hasData && columnTree) {
      // Changing the virtualizer size may result in the row with focus getting hidden
      const cell = this.shadowRoot.activeElement;
      const cellCoordinates = this.__getBodyCellCoordinates(cell);

      virtualizer.size = effectiveSize;
      virtualizer.update();
      virtualizer.flush();

      // If the focused cell's parent row got hidden by the size change, focus the corresponding new cell
      cellCoordinates && cell.parentElement.hidden && this.__focusBodyCell(cellCoordinates);

      // Make sure the body has a tabbable element
      this._resetKeyboardNavigation();
    }
  }

  /** @private */
  __hasRowsWithClientHeight() {
    return !!Array.from(this.$.items.children).filter((row) => row.clientHeight).length;
  }

  /** @protected */
  __itemsReceived() {
    if (
      this._recalculateColumnWidthOnceLoadingFinished &&
      !this._cache.isLoading() &&
      this.__hasRowsWithClientHeight()
    ) {
      this._recalculateColumnWidthOnceLoadingFinished = false;
      this.recalculateColumnWidths();
    }
  }

  /** @private */
  __getIntrinsicWidth(col) {
    const initialWidth = col.width;
    const initialFlexGrow = col.flexGrow;

    col.width = 'auto';
    col.flexGrow = 0;

    // Note: _allCells only contains cells which are currently rendered in DOM
    const width = col._allCells
      .filter((cell) => {
        // Exclude body cells that are out of the visible viewport
        return !this.$.items.contains(cell) || this._isInViewport(cell.parentElement);
      })
      .reduce((width, cell) => {
        // Add 1px buffer to the offset width to avoid too narrow columns (sub-pixel rendering)
        return Math.max(width, cell.offsetWidth + 1);
      }, 0);

    col.flexGrow = initialFlexGrow;
    col.width = initialWidth;

    return width;
  }

  /** @private */
  __getDistributedWidth(col, innerColumn) {
    if (col == null || col === this) return 0;

    const columnWidth = Math.max(this.__getIntrinsicWidth(col), this.__getDistributedWidth(col.parentElement, col));

    // we're processing a regular grid-column and not a grid-column-group
    if (!innerColumn) {
      return columnWidth;
    }

    // At the end, the width of each vaadin-grid-column-group is determined by the sum of the width of its children.
    // Here we determine how much space the vaadin-grid-column-group actually needs to render properly and then we distribute that space
    // to its children, so when we actually do the summation it will be rendered properly.
    // Check out vaadin-grid-column-group:_updateFlexAndWidth
    const columnGroup = col;
    const columnGroupWidth = columnWidth;
    const sumOfWidthOfAllChildColumns = columnGroup._visibleChildColumns
      .map((col) => this.__getIntrinsicWidth(col))
      .reduce((sum, curr) => sum + curr, 0);

    const extraNecessarySpaceForGridColumnGroup = Math.max(0, columnGroupWidth - sumOfWidthOfAllChildColumns);

    // The distribution of the extra necessary space is done according to the intrinsic width of each child column.
    // Lets say we need 100 pixels of extra space for the grid-column-group to render properly
    // it has two grid-column children, |100px|300px| in total 400px
    // the first column gets 25px of the additional space (100/400)*100 = 25
    // the second column gets the 75px of the additional space (300/400)*100 = 75
    const proportionOfExtraSpace = this.__getIntrinsicWidth(innerColumn) / sumOfWidthOfAllChildColumns;
    const shareOfInnerColumnFromNecessaryExtraSpace = proportionOfExtraSpace * extraNecessarySpaceForGridColumnGroup;

    return this.__getIntrinsicWidth(innerColumn) + shareOfInnerColumnFromNecessaryExtraSpace;
  }

  /**
   * @param {!Array<!GridColumn>} cols the columns to auto size based on their content width
   * @private
   */
  _recalculateColumnWidths(cols) {
    // Flush to make sure DOM is up-to-date when measuring the column widths
    this.__virtualizer.flush();

    cols.forEach((col) => {
      col.width = `${this.__getDistributedWidth(col)}px`;
    });
  }

  /**
   * Updates the `width` of all columns which have `autoWidth` set to `true`.
   */
  recalculateColumnWidths() {
    if (!this._columnTree) {
      return; // No columns
    }
    if (this._cache.isLoading()) {
      this._recalculateColumnWidthOnceLoadingFinished = true;
    } else {
      const cols = this._getColumns().filter((col) => !col.hidden && col.autoWidth);
      this._recalculateColumnWidths(cols);
    }
  }

  /** @private */
  _createScrollerRows(count) {
    const rows = [];
    for (let i = 0; i < count; i++) {
      const row = document.createElement('tr');
      row.setAttribute('part', 'row');
      row.setAttribute('role', 'row');
      row.setAttribute('tabindex', '-1');
      if (this._columnTree) {
        this._updateRow(row, this._columnTree[this._columnTree.length - 1], 'body', false, true);
      }
      rows.push(row);
    }

    if (this._columnTree) {
      this._columnTree[this._columnTree.length - 1].forEach(
        (c) => c.isConnected && c.notifyPath && c.notifyPath('_cells.*', c._cells)
      );
    }

    beforeNextRender(this, () => {
      this._updateFirstAndLastColumn();
      this._resetKeyboardNavigation();
      this._afterScroll();
      this.__itemsReceived();
    });
    return rows;
  }

  /** @private */
  _createCell(tagName) {
    const contentId = (this._contentIndex = this._contentIndex + 1 || 0);
    const slotName = 'vaadin-grid-cell-content-' + contentId;

    const cellContent = document.createElement('vaadin-grid-cell-content');
    cellContent.setAttribute('slot', slotName);

    const cell = document.createElement(tagName);
    cell.id = slotName.replace('-content-', '-');
    cell.setAttribute('tabindex', '-1');
    cell.setAttribute('role', tagName === 'td' ? 'gridcell' : 'columnheader');

    const slot = document.createElement('slot');
    slot.setAttribute('name', slotName);

    cell.appendChild(slot);

    cell._content = cellContent;

    // With native Shadow DOM, mousedown on slotted element does not focus
    // focusable slot wrapper, that is why cells are not focused with
    // mousedown. Workaround: listen for mousedown and focus manually.
    cellContent.addEventListener('mousedown', () => {
      if (window.chrome) {
        // Chrome bug: focusing before mouseup prevents text selection, see http://crbug.com/771903
        const mouseUpListener = () => {
          if (!cellContent.contains(this.getRootNode().activeElement)) {
            cell.focus();
          }
          // If focus is in the cell content — respect it, do not change.
          document.removeEventListener('mouseup', mouseUpListener, true);
        };
        document.addEventListener('mouseup', mouseUpListener, true);
      } else {
        // Focus on mouseup, on the other hand, removes selection on Safari.
        // Watch out sync focus removal issue, only async focus works here.
        setTimeout(() => {
          if (!cellContent.contains(this.getRootNode().activeElement)) {
            cell.focus();
          }
        });
      }
    });

    return cell;
  }

  /**
   * @param {!HTMLTableRowElement} row
   * @param {!Array<!GridColumn>} columns
   * @param {?string} section
   * @param {boolean} isColumnRow
   * @param {boolean} noNotify
   * @protected
   */
  _updateRow(row, columns, section, isColumnRow, noNotify) {
    section = section || 'body';

    const contentsFragment = document.createDocumentFragment();

    Array.from(row.children).forEach((cell) => (cell._vacant = true));
    row.innerHTML = '';

    columns
      .filter((column) => !column.hidden)
      .forEach((column, index, cols) => {
        let cell;

        if (section === 'body') {
          // Body
          column._cells = column._cells || [];
          cell = column._cells.filter((cell) => cell._vacant)[0];
          if (!cell) {
            cell = this._createCell('td');
            column._cells.push(cell);
          }
          cell.setAttribute('part', 'cell body-cell');
          row.appendChild(cell);

          if (index === cols.length - 1 && this.rowDetailsRenderer) {
            // Add details cell as last cell to body rows
            this._detailsCells = this._detailsCells || [];
            const detailsCell = this._detailsCells.filter((cell) => cell._vacant)[0] || this._createCell('td');
            if (this._detailsCells.indexOf(detailsCell) === -1) {
              this._detailsCells.push(detailsCell);
            }
            if (!detailsCell._content.parentElement) {
              contentsFragment.appendChild(detailsCell._content);
            }
            this._configureDetailsCell(detailsCell);
            row.appendChild(detailsCell);
            this._a11ySetRowDetailsCell(row, detailsCell);
            detailsCell._vacant = false;
          }

          if (column.notifyPath && !noNotify) {
            column.notifyPath('_cells.*', column._cells);
          }
        } else {
          // Header & footer
          const tagName = section === 'header' ? 'th' : 'td';
          if (isColumnRow || column.localName === 'vaadin-grid-column-group') {
            cell = column[`_${section}Cell`] || this._createCell(tagName);
            cell._column = column;
            row.appendChild(cell);
            column[`_${section}Cell`] = cell;
          } else {
            column._emptyCells = column._emptyCells || [];
            cell = column._emptyCells.filter((cell) => cell._vacant)[0] || this._createCell(tagName);
            cell._column = column;
            row.appendChild(cell);
            if (column._emptyCells.indexOf(cell) === -1) {
              column._emptyCells.push(cell);
            }
          }
          cell.setAttribute('part', `cell ${section}-cell`);
          this.__updateHeaderFooterRowVisibility(row);
        }

        if (!cell._content.parentElement) {
          contentsFragment.appendChild(cell._content);
        }
        cell._vacant = false;
        cell._column = column;
      });

    // Might be empty if only cache was used
    this.appendChild(contentsFragment);

    this._frozenCellsChanged();
    this._updateFirstAndLastColumnForRow(row);
  }

  /**
   * @param {HTMLTableRowElement} row
   * @protected
   */
  __updateHeaderFooterRowVisibility(row) {
    if (!row) {
      return;
    }

    const visibleRowCells = Array.from(row.children).filter((cell) => {
      const column = cell._column;
      if (column._emptyCells && column._emptyCells.indexOf(cell) > -1) {
        // The cell is an "empty cell"  -> doesn't block hiding the row
        return false;
      }
      if (row.parentElement === this.$.header) {
        if (column.headerRenderer) {
          // The cell is the header cell of a column that has a header renderer
          // -> row should be visible
          return true;
        }
        if (column.header === null) {
          // The column header is explicilty set to null -> doesn't block hiding the row
          return false;
        }
        if (column.path || column.header !== undefined) {
          // The column has an explicit non-null header or a path that generates a header
          // -> row should be visible
          return true;
        }
      } else {
        if (column.footerRenderer) {
          // The cell is the footer cell of a column that has a footer renderer
          // -> row should be visible
          return true;
        }
      }
    });

    if (row.hidden !== !visibleRowCells.length) {
      row.hidden = !visibleRowCells.length;
    }

    // Make sure the section has a tabbable element
    this._resetKeyboardNavigation();
  }

  /** @private */
  _updateScrollerItem(row, index) {
    this._preventScrollerRotatingCellFocus(row, index);

    if (!this._columnTree) {
      return;
    }

    row.toggleAttribute('first', index === 0);
    row.toggleAttribute('last', index === this._effectiveSize - 1);
    row.toggleAttribute('odd', index % 2);
    this._a11yUpdateRowRowindex(row, index);
    this._getItem(index, row);
  }

  /** @private */
  _columnTreeChanged(columnTree) {
    this._renderColumnTree(columnTree);
    this.recalculateColumnWidths();
  }

  /**
   * @param {!Array<!GridColumn>} columnTree
   * @protected
   */
  _renderColumnTree(columnTree) {
    Array.from(this.$.items.children).forEach((row) =>
      this._updateRow(row, columnTree[columnTree.length - 1], null, false, true)
    );

    while (this.$.header.children.length < columnTree.length) {
      const headerRow = document.createElement('tr');
      headerRow.setAttribute('part', 'row');
      headerRow.setAttribute('role', 'row');
      headerRow.setAttribute('tabindex', '-1');
      this.$.header.appendChild(headerRow);

      const footerRow = document.createElement('tr');
      footerRow.setAttribute('part', 'row');
      footerRow.setAttribute('role', 'row');
      footerRow.setAttribute('tabindex', '-1');
      this.$.footer.appendChild(footerRow);
    }
    while (this.$.header.children.length > columnTree.length) {
      this.$.header.removeChild(this.$.header.firstElementChild);
      this.$.footer.removeChild(this.$.footer.firstElementChild);
    }

    Array.from(this.$.header.children).forEach((headerRow, index) =>
      this._updateRow(headerRow, columnTree[index], 'header', index === columnTree.length - 1)
    );

    Array.from(this.$.footer.children).forEach((footerRow, index) =>
      this._updateRow(footerRow, columnTree[columnTree.length - 1 - index], 'footer', index === 0)
    );

    // Sizer rows
    this._updateRow(this.$.sizer, columnTree[columnTree.length - 1]);

    this._resizeHandler();
    this._frozenCellsChanged();
    this._updateFirstAndLastColumn();
    this._resetKeyboardNavigation();
    this._a11yUpdateHeaderRows();
    this._a11yUpdateFooterRows();
    this.__updateFooterPositioning();
    this.generateCellClassNames();
  }

  __updateFooterPositioning() {
    if (this._firefox) {
      // Sticky (or translated) footer in a flexbox host doesn't get included in
      // the scroll height calculation on FF. This is a workaround for the issue.
      this.$.items.style.paddingBottom = 0;
      if (!this.allRowsVisible) {
        this.$.items.style.paddingBottom = `${this.$.footer.offsetHeight}px`;
      }
    }
  }

  /**
   * @param {!HTMLElement} row
   * @param {GridItem} item
   * @protected
   */
  _updateItem(row, item) {
    row._item = item;
    const model = this.__getRowModel(row);

    this._toggleDetailsCell(row, model.detailsOpened);

    this._a11yUpdateRowLevel(row, model.level);
    this._a11yUpdateRowSelected(row, model.selected);
    this._a11yUpdateRowDetailsOpened(row, model.detailsOpened);

    row.toggleAttribute('expanded', model.expanded);
    row.toggleAttribute('selected', model.selected);
    row.toggleAttribute('details-opened', model.detailsOpened);

    this._generateCellClassNames(row, model);
    this._filterDragAndDrop(row, model);

    Array.from(row.children).forEach((cell) => {
      if (cell._renderer) {
        const owner = cell._column || this;
        cell._renderer.call(owner, cell._content, owner, model);
      }
    });

    this._updateDetailsCellHeight(row);

    this._a11yUpdateRowExpanded(row, model.expanded);
  }

  /** @private */
  _resizeHandler() {
    this._updateDetailsCellHeights();
    this.__updateFooterPositioning();
  }

  /** @private */
  _onAnimationEnd(e) {
    // ShadyCSS applies scoping suffixes to animation names
    if (e.animationName.indexOf('vaadin-grid-appear') === 0) {
      e.stopPropagation();
      this.__itemsReceived();

      requestAnimationFrame(() => {
        this.__scrollToPendingIndex();
        // This needs to be set programmatically in order to avoid an iOS 10 bug (disappearing grid)
        this.$.table.style.webkitOverflowScrolling = 'touch';
      });
    }
  }

  /**
   * @param {!HTMLTableRowElement} row
   * @return {!GridItemModel}
   * @protected
   */
  __getRowModel(row) {
    return {
      index: row.index,
      item: row._item,
      level: this._getIndexLevel(row.index),
      expanded: this._isExpanded(row._item),
      selected: this._isSelected(row._item),
      detailsOpened: !!this.rowDetailsRenderer && this._isDetailsOpened(row._item)
    };
  }

  /**
   * Requests an update for the content of cells.
   *
   * While performing the update, the following renderers are invoked:
   * - `Grid.rowDetailsRenderer`
   * - `GridColumn.renderer`
   * - `GridColumn.headerRenderer`
   * - `GridColumn.footerRenderer`
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate() {
    if (this._columnTree) {
      // header and footer renderers
      this._columnTree.forEach((level) => {
        level.forEach((column) => {
          column._renderHeaderAndFooter();
        });
      });

      // body and row details renderers
      this.__updateVisibleRows();
    }
  }

  /** @protected */
  __updateVisibleRows(start, end) {
    this.__virtualizer && this.__virtualizer.update(start, end);
  }

  /**
   * Updates the computed metrics and positioning of internal grid parts
   * (row/details cell positioning etc). Needs to be invoked whenever the sizing of grid
   * content changes asynchronously to ensure consistent appearance (e.g. when a
   * contained image whose bounds aren't known beforehand finishes loading).
   *
   * @deprecated Since Vaadin 22, `notifyResize()` is deprecated. The component uses a
   * ResizeObserver internally and doesn't need to be explicitly notified of resizes.
   */
  notifyResize() {
    console.warn(
      `WARNING: Since Vaadin 22, notifyResize() is deprecated. The component uses a ResizeObserver internally and doesn't need to be explicitly notified of resizes.`
    );
  }
}

customElements.define(Grid.is, Grid);

/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A `<vaadin-grid-column-group>` is used to make groups of columns in `<vaadin-grid>` and
 * to configure additional headers and footers.
 *
 * Groups can be nested to create complex header and footer configurations.
 *
 * #### Example:
 * ```html
 * <vaadin-grid-column-group resizable id="columnGroup">
 *   <vaadin-grid-column id="column1"></vaadin-grid-column>
 *   <vaadin-grid-column id="column2"></vaadin-grid-column>
 * </vaadin-grid-column-group>
 * ```
 *
 * ```js
 * const columnGroup = document.querySelector('#columnGroup');
 * columnGroup.headerRenderer = (root, columnGroup) => {
 *   root.textContent = 'header';
 * }
 *
 * const column1 = document.querySelector('#column1');
 * column1.headerRenderer = (root, column) => { ... };
 * column1.renderer = (root, column, model) => { ... };
 *
 * const column2 = document.querySelector('#column2');
 * column2.headerRenderer = (root, column) => { ... };
 * column2.renderer = (root, column, model) => { ... };
 * ```
 *
 * @extends HTMLElement
 * @mixes ColumnBaseMixin
 */
class GridColumnGroup extends ColumnBaseMixin(PolymerElement) {
  static get is() {
    return 'vaadin-grid-column-group';
  }

  static get properties() {
    return {
      /** @private */
      _childColumns: {
        value: function () {
          return this._getChildColumns(this);
        }
      },

      /**
       * Flex grow ratio for the column group as the sum of the ratios of its child columns.
       * @attr {number} flex-grow
       */
      flexGrow: {
        type: Number,
        readOnly: true
      },

      /**
       * Width of the column group as the sum of the widths of its child columns.
       */
      width: {
        type: String,
        readOnly: true
      },

      /** @private */
      _visibleChildColumns: Array,

      /** @private */
      _colSpan: Number,

      /** @private */
      _rootColumns: Array
    };
  }

  static get observers() {
    return [
      '_updateVisibleChildColumns(_childColumns)',
      '_childColumnsChanged(_childColumns)',
      '_groupFrozenChanged(frozen, _rootColumns)',
      '_groupHiddenChanged(hidden, _rootColumns)',
      '_visibleChildColumnsChanged(_visibleChildColumns)',
      '_colSpanChanged(_colSpan, _headerCell, _footerCell)',
      '_groupOrderChanged(_order, _rootColumns)',
      '_groupReorderStatusChanged(_reorderStatus, _rootColumns)',
      '_groupResizableChanged(resizable, _rootColumns)'
    ];
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();
    this._addNodeObserver();
    this._updateFlexAndWidth();
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();
    this._observer && this._observer.disconnect();
  }

  /**
   * @param {string} path
   * @param {unknown=} value
   * @protected
   */
  _columnPropChanged(path, value) {
    if (path === 'hidden') {
      this._preventHiddenCascade = true;
      this._updateVisibleChildColumns(this._childColumns);
      this._preventHiddenCascade = false;
    }

    if (/flexGrow|width|hidden|_childColumns/.test(path)) {
      this._updateFlexAndWidth();
    }

    if (path === 'frozen') {
      // Don’t unfreeze the frozen group because of a non-frozen child
      this.frozen = this.frozen || value;
    }

    if (path === 'lastFrozen') {
      // Don’t unfreeze the frozen group because of a non-frozen child
      this._lastFrozen = this._lastFrozen || value;
    }
  }

  /** @private */
  _groupOrderChanged(order, rootColumns) {
    if (rootColumns) {
      const _rootColumns = rootColumns.slice(0);

      if (!order) {
        _rootColumns.forEach((column) => (column._order = 0));
        return;
      }
      // The parent column order number cascades downwards to it's children
      // so that the resulting order numbering constructs as follows:
      // [             1000              ]
      // [     1100    ] | [     1200    ]
      // [1110] | [1120] | [1210] | [1220]

      // Trailing zeros are counted so we know the level on which we're working on.
      const trailingZeros = /(0+)$/.exec(order).pop().length;

      // In an unlikely situation where a group has more than 9 child columns,
      // the child scope must have 1 digit less...
      // Log^a_b = Ln(a)/Ln(b)
      // Number of digits of a number is equal to floor(Log(number)_10) + 1
      const childCountDigits = ~~(Math.log(rootColumns.length) / Math.LN10) + 1;

      // Final scope for the child columns needs to mind both factors.
      const scope = Math.pow(10, trailingZeros - childCountDigits);

      if (_rootColumns[0] && _rootColumns[0]._order) {
        _rootColumns.sort((a, b) => a._order - b._order);
      }
      updateColumnOrders(_rootColumns, scope, order);
    }
  }

  /** @private */
  _groupReorderStatusChanged(reorderStatus, rootColumns) {
    if (reorderStatus === undefined || rootColumns === undefined) {
      return;
    }

    rootColumns.forEach((column) => (column._reorderStatus = reorderStatus));
  }

  /** @private */
  _groupResizableChanged(resizable, rootColumns) {
    if (resizable === undefined || rootColumns === undefined) {
      return;
    }

    rootColumns.forEach((column) => (column.resizable = resizable));
  }

  /** @private */
  _updateVisibleChildColumns(childColumns) {
    this._visibleChildColumns = Array.prototype.filter.call(childColumns, (col) => !col.hidden);
  }

  /** @private */
  _childColumnsChanged(childColumns) {
    if (!this._autoHidden && this.hidden) {
      Array.prototype.forEach.call(childColumns, (column) => (column.hidden = true));
      this._updateVisibleChildColumns(childColumns);
    }
  }

  /** @protected */
  _updateFlexAndWidth() {
    if (!this._visibleChildColumns) {
      return;
    }

    if (this._visibleChildColumns.length) {
      this._setWidth(
        'calc(' +
          Array.prototype.reduce
            .call(
              this._visibleChildColumns,
              (prev, curr) => (prev += ' + ' + (curr.width || '0px').replace('calc', '')),
              ''
            )
            .substring(3) +
          ')'
      );
    } else {
      this._setWidth('0px');
    }

    this._setFlexGrow(Array.prototype.reduce.call(this._visibleChildColumns, (prev, curr) => prev + curr.flexGrow, 0));
  }

  /** @private */
  _groupFrozenChanged(frozen, rootColumns) {
    if (rootColumns === undefined || frozen === undefined) {
      return;
    }

    // Don’t propagate the default `false` value.
    if (frozen !== false) {
      Array.from(rootColumns).forEach((col) => (col.frozen = frozen));
    }
  }

  /** @private */
  _groupHiddenChanged(hidden, rootColumns) {
    if (rootColumns && !this._preventHiddenCascade) {
      this._ignoreVisibleChildColumns = true;
      rootColumns.forEach((column) => (column.hidden = hidden));
      this._ignoreVisibleChildColumns = false;
    }

    this._columnPropChanged('hidden');
  }

  /** @private */
  _visibleChildColumnsChanged(visibleChildColumns) {
    this._colSpan = visibleChildColumns.length;

    if (!this._ignoreVisibleChildColumns) {
      if (visibleChildColumns.length === 0) {
        this._autoHidden = this.hidden = true;
      } else if (this.hidden && this._autoHidden) {
        this._autoHidden = this.hidden = false;
      }
    }
  }

  /** @private */
  _colSpanChanged(colSpan, headerCell, footerCell) {
    if (headerCell) {
      headerCell.setAttribute('colspan', colSpan);
      this._grid && this._grid._a11yUpdateCellColspan(headerCell, colSpan);
    }
    if (footerCell) {
      footerCell.setAttribute('colspan', colSpan);
      this._grid && this._grid._a11yUpdateCellColspan(footerCell, colSpan);
    }
  }

  /**
   * @param {!GridColumnGroup} el
   * @return {!Array<!GridColumn>}
   * @protected
   */
  _getChildColumns(el) {
    return FlattenedNodesObserver.getFlattenedNodes(el).filter(this._isColumnElement);
  }

  /** @private */
  _addNodeObserver() {
    this._observer = new FlattenedNodesObserver(this, (info) => {
      if (
        info.addedNodes.filter(this._isColumnElement).length > 0 ||
        info.removedNodes.filter(this._isColumnElement).length > 0
      ) {
        this._preventHiddenCascade = true;
        this._rootColumns = this._getChildColumns(this);
        this._childColumns = this._rootColumns;
        this._preventHiddenCascade = false;

        // Update the column tree with microtask timing to avoid shady style scope issues
        microTask.run(() => {
          this._grid && this._grid._updateColumnTree && this._grid._updateColumnTree();
        });
      }
    });
    this._observer.flush();
  }

  /**
   * @param {!Node} node
   * @return {boolean}
   * @protected
   */
  _isColumnElement(node) {
    return node.nodeType === Node.ELEMENT_NODE && /\bcolumn\b/.test(node.localName);
  }
}

customElements.define(GridColumnGroup.is, GridColumnGroup);

registerStyles(
  'vaadin-input-container',
  r`
    :host {
      border-radius: var(--lumo-border-radius-m);
      background-color: var(--lumo-contrast-10pct);
      padding: 0 calc(0.375em + var(--lumo-border-radius-m) / 4 - 1px);
      font-weight: 500;
      line-height: 1;
      position: relative;
      cursor: text;
      box-sizing: border-box;
    }

    /* Used for hover and activation effects */
    :host::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border-radius: inherit;
      pointer-events: none;
      background-color: var(--lumo-contrast-50pct);
      opacity: 0;
      transition: transform 0.15s, opacity 0.2s;
      transform-origin: 100% 0;
    }

    ::slotted(:not([slot$='fix'])) {
      cursor: inherit;
      min-height: var(--lumo-text-field-size, var(--lumo-size-m));
      padding: 0 0.25em;
      --_lumo-text-field-overflow-mask-image: linear-gradient(to left, transparent, #000 1.25em);
      -webkit-mask-image: var(--_lumo-text-field-overflow-mask-image);
      mask-image: var(--_lumo-text-field-overflow-mask-image);
    }

    /* Read-only */
    :host([readonly]) {
      color: var(--lumo-secondary-text-color);
      background-color: transparent;
      cursor: default;
    }

    :host([readonly])::after {
      background-color: transparent;
      opacity: 1;
      border: 1px dashed var(--lumo-contrast-30pct);
    }

    /* Disabled */
    :host([disabled]) {
      background-color: var(--lumo-contrast-5pct);
    }

    :host([disabled]) ::slotted(*) {
      color: var(--lumo-disabled-text-color);
      -webkit-text-fill-color: var(--lumo-disabled-text-color);
    }

    /* Invalid */
    :host([invalid]) {
      background-color: var(--lumo-error-color-10pct);
    }

    :host([invalid])::after {
      background-color: var(--lumo-error-color-50pct);
    }

    /* Slotted icons */
    ::slotted(iron-icon),
    ::slotted(vaadin-icon) {
      color: var(--lumo-contrast-60pct);
      width: var(--lumo-icon-size-m);
      height: var(--lumo-icon-size-m);
    }

    /* Vaadin icons are based on a 16x16 grid (unlike Lumo and Material icons with 24x24), so they look too big by default */
    ::slotted(iron-icon[icon^='vaadin:']),
    ::slotted(vaadin-icon[icon^='vaadin:']) {
      padding: 0.25em;
      box-sizing: border-box !important;
    }

    /* Text align */
    :host([dir='rtl']) ::slotted(:not([slot$='fix'])) {
      --_lumo-text-field-overflow-mask-image: linear-gradient(to right, transparent, #000 1.25em);
    }

    @-moz-document url-prefix() {
      :host([dir='rtl']) ::slotted(:not([slot$='fix'])) {
        mask-image: var(--_lumo-text-field-overflow-mask-image);
      }
    }

    :host([theme~='align-left']) ::slotted(:not([slot$='fix'])) {
      text-align: start;
      --_lumo-text-field-overflow-mask-image: none;
    }

    :host([theme~='align-center']) ::slotted(:not([slot$='fix'])) {
      text-align: center;
      --_lumo-text-field-overflow-mask-image: none;
    }

    :host([theme~='align-right']) ::slotted(:not([slot$='fix'])) {
      text-align: end;
      --_lumo-text-field-overflow-mask-image: none;
    }

    @-moz-document url-prefix() {
      /* Firefox is smart enough to align overflowing text to right */
      :host([theme~='align-right']) ::slotted(:not([slot$='fix'])) {
        --_lumo-text-field-overflow-mask-image: linear-gradient(to right, transparent 0.25em, #000 1.5em);
      }
    }

    @-moz-document url-prefix() {
      /* Firefox is smart enough to align overflowing text to right */
      :host([theme~='align-left']) ::slotted(:not([slot$='fix'])) {
        --_lumo-text-field-overflow-mask-image: linear-gradient(to left, transparent 0.25em, #000 1.5em);
      }
    }

    /* RTL specific styles */
    :host([theme~='align-left'][dir='rtl']) ::slotted(:not([slot$='fix'])) {
      --_lumo-text-field-overflow-mask-image: none;
    }

    :host([theme~='align-center'][dir='rtl']) ::slotted(:not([slot$='fix'])) {
      --_lumo-text-field-overflow-mask-image: none;
    }

    :host([theme~='align-right'][dir='rtl']) ::slotted(:not([slot$='fix'])) {
      --_lumo-text-field-overflow-mask-image: none;
    }

    @-moz-document url-prefix() {
      /* Firefox is smart enough to align overflowing text to right */
      :host([theme~='align-right'][dir='rtl']) ::slotted(:not([slot$='fix'])) {
        --_lumo-text-field-overflow-mask-image: linear-gradient(to right, transparent 0.25em, #000 1.5em);
      }
    }

    @-moz-document url-prefix() {
      /* Firefox is smart enough to align overflowing text to right */
      :host([theme~='align-left'][dir='rtl']) ::slotted(:not([slot$='fix'])) {
        --_lumo-text-field-overflow-mask-image: linear-gradient(to left, transparent 0.25em, #000 1.5em);
      }
    }
  `,
  { moduleId: 'lumo-input-container' }
);

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

class InputContainer extends ThemableMixin(DirMixin(PolymerElement)) {
  static get is() {
    return 'vaadin-input-container';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          align-items: center;
          flex: 0 1 auto;
        }

        :host([hidden]) {
          display: none !important;
        }

        /* Reset the native input styles */
        ::slotted(input) {
          -webkit-appearance: none;
          -moz-appearance: none;
          flex: auto;
          white-space: nowrap;
          overflow: hidden;
          width: 100%;
          height: 100%;
          outline: none;
          margin: 0;
          padding: 0;
          border: 0;
          border-radius: 0;
          min-width: 0;
          font: inherit;
          line-height: normal;
          color: inherit;
          background-color: transparent;
          /* Disable default invalid style in Firefox */
          box-shadow: none;
        }

        ::slotted(*) {
          flex: none;
        }

        ::slotted(:is(input, textarea))::placeholder {
          /* Use ::slotted(input:placeholder-shown) in themes to style the placeholder. */
          /* because ::slotted(...)::placeholder does not work in Safari. */
          /* See the workaround at the end of this file. */
          font: inherit;
          color: inherit;
          /* Override default opacity in Firefox */
          opacity: 1;
        }
      </style>
      <slot name="prefix"></slot>
      <slot></slot>
      <slot name="suffix"></slot>
    `;
  }

  static get properties() {
    return {
      /**
       * If true, the user cannot interact with this element.
       */
      disabled: {
        type: Boolean,
        reflectToAttribute: true
      },

      /**
       * Set to true to make this element read-only.
       */
      readonly: {
        type: Boolean,
        reflectToAttribute: true
      },

      /**
       * Set to true when the element is invalid.
       */
      invalid: {
        type: Boolean,
        reflectToAttribute: true
      }
    };
  }

  /** @protected */
  ready() {
    super.ready();

    this.addEventListener('pointerdown', (event) => {
      if (event.target === this) {
        // Prevent direct clicks to the input container from blurring the input
        event.preventDefault();
      }
    });

    this.addEventListener('click', (event) => {
      if (event.target === this) {
        // The vaadin-input-container element was directly clicked,
        // focus any focusable child element from the default slot
        this.shadowRoot
          .querySelector('slot:not([name])')
          .assignedNodes({ flatten: true })
          .forEach((node) => node.focus && node.focus());
      }
    });
  }
}

customElements.define(InputContainer.is, InputContainer);

const placeholderStyleWorkaround = r`
  /* Needed for Safari, where ::slotted(...)::placeholder does not work */
  :is(input[slot='input'], textarea[slot='textarea'])::placeholder {
    font: inherit;
    color: inherit;
  }
`;

const $tpl = document.createElement('template');
$tpl.innerHTML = `<style>${placeholderStyleWorkaround.toString()}</style>`;
document.head.appendChild($tpl.content);

/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const fieldButton = r`
  [part$='button'] {
    flex: none;
    width: 1em;
    height: 1em;
    line-height: 1;
    font-size: var(--lumo-icon-size-m);
    text-align: center;
    color: var(--lumo-contrast-60pct);
    transition: 0.2s color;
    cursor: var(--lumo-clickable-cursor);
  }

  [part$='button']:hover {
    color: var(--lumo-contrast-90pct);
  }

  :host([disabled]) [part$='button'],
  :host([readonly]) [part$='button'] {
    color: var(--lumo-contrast-20pct);
    cursor: default;
  }

  [part$='button']::before {
    font-family: 'lumo-icons';
    display: block;
  }
`;
registerStyles('', fieldButton, { moduleId: 'lumo-field-button' });

/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const helper = r`
  :host([has-helper]) [part='helper-text']::before {
    content: '';
    display: block;
    height: 0.4em;
  }

  [part='helper-text'] {
    display: block;
    color: var(--lumo-secondary-text-color);
    font-size: var(--lumo-font-size-xs);
    line-height: var(--lumo-line-height-xs);
    margin-left: calc(var(--lumo-border-radius-m) / 4);
    transition: color 0.2s;
  }

  :host(:hover:not([readonly])) [part='helper-text'] {
    color: var(--lumo-body-text-color);
  }

  :host([disabled]) [part='helper-text'] {
    color: var(--lumo-disabled-text-color);
    -webkit-text-fill-color: var(--lumo-disabled-text-color);
  }

  :host([has-helper][theme~='helper-above-field']) [part='helper-text']::before {
    display: none;
  }

  :host([has-helper][theme~='helper-above-field']) [part='helper-text']::after {
    content: '';
    display: block;
    height: 0.4em;
  }

  :host([has-helper][theme~='helper-above-field']) [part='label'] {
    order: 0;
    padding-bottom: 0.4em;
  }

  :host([has-helper][theme~='helper-above-field']) [part='helper-text'] {
    order: 1;
  }

  :host([has-helper][theme~='helper-above-field']) [part='label'] + * {
    order: 2;
  }

  :host([has-helper][theme~='helper-above-field']) [part='error-message'] {
    order: 3;
  }
`;

/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const requiredField = r`
  [part='label'] {
    align-self: flex-start;
    color: var(--lumo-secondary-text-color);
    font-weight: 500;
    font-size: var(--lumo-font-size-s);
    margin-left: calc(var(--lumo-border-radius-m) / 4);
    transition: color 0.2s;
    line-height: 1;
    padding-right: 1em;
    padding-bottom: 0.5em;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;
    max-width: 100%;
    box-sizing: border-box;
  }

  :host([has-label])::before {
    margin-top: calc(var(--lumo-font-size-s) * 1.5);
  }

  :host([has-label][theme~='small'])::before {
    margin-top: calc(var(--lumo-font-size-xs) * 1.5);
  }

  :host([has-label]) {
    padding-top: var(--lumo-space-m);
  }

  [part='required-indicator']::after {
    content: var(--lumo-required-field-indicator, '•');
    transition: opacity 0.2s;
    opacity: 0;
    color: var(--lumo-required-field-indicator-color, var(--lumo-primary-text-color));
    position: absolute;
    right: 0;
    width: 1em;
    text-align: center;
  }

  :host([required]:not([has-value])) [part='required-indicator']::after {
    opacity: 1;
  }

  :host([invalid]) [part='required-indicator']::after {
    color: var(--lumo-required-field-indicator-color, var(--lumo-error-text-color));
  }

  [part='error-message'] {
    margin-left: calc(var(--lumo-border-radius-m) / 4);
    font-size: var(--lumo-font-size-xs);
    line-height: var(--lumo-line-height-xs);
    color: var(--lumo-error-text-color);
    will-change: max-height;
    transition: 0.4s max-height;
    max-height: 5em;
  }

  :host([has-error-message]) [part='error-message']::before,
  :host([has-error-message]) [part='error-message']::after {
    content: '';
    display: block;
    height: 0.4em;
  }

  :host(:not([invalid])) [part='error-message'] {
    max-height: 0;
    overflow: hidden;
  }

  /* RTL specific styles */

  :host([dir='rtl']) [part='label'] {
    margin-left: 0;
    margin-right: calc(var(--lumo-border-radius-m) / 4);
  }

  :host([dir='rtl']) [part='label'] {
    padding-left: 1em;
    padding-right: 0;
  }

  :host([dir='rtl']) [part='required-indicator']::after {
    right: auto;
    left: 0;
  }

  :host([dir='rtl']) [part='error-message'] {
    margin-left: 0;
    margin-right: calc(var(--lumo-border-radius-m) / 4);
  }
`;

registerStyles('', requiredField, { moduleId: 'lumo-required-field' });

/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const inputField = r`
  :host {
    --lumo-text-field-size: var(--lumo-size-m);
    color: var(--lumo-body-text-color);
    font-size: var(--lumo-font-size-m);
    font-family: var(--lumo-font-family);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
    padding: var(--lumo-space-xs) 0;
  }

  :host::before {
    height: var(--lumo-text-field-size);
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
  }

  :host([focused]:not([readonly])) [part='label'] {
    color: var(--lumo-primary-text-color);
  }

  :host([focused]) [part='input-field'] ::slotted(:is(input, textarea)) {
    -webkit-mask-image: none;
    mask-image: none;
  }

  ::slotted(:is(input, textarea):placeholder-shown) {
    color: var(--lumo-secondary-text-color);
  }

  /* Hover */
  :host(:hover:not([readonly]):not([focused])) [part='label'] {
    color: var(--lumo-body-text-color);
  }

  :host(:hover:not([readonly]):not([focused])) [part='input-field']::after {
    opacity: 0.1;
  }

  /* Touch device adjustment */
  @media (pointer: coarse) {
    :host(:hover:not([readonly]):not([focused])) [part='label'] {
      color: var(--lumo-secondary-text-color);
    }

    :host(:hover:not([readonly]):not([focused])) [part='input-field']::after {
      opacity: 0;
    }

    :host(:active:not([readonly]):not([focused])) [part='input-field']::after {
      opacity: 0.2;
    }
  }

  /* Trigger when not focusing using the keyboard */
  :host([focused]:not([focus-ring]):not([readonly])) [part='input-field']::after {
    transform: scaleX(0);
    transition-duration: 0.15s, 1s;
  }

  /* Focus-ring */
  :host([focus-ring]) [part='input-field'] {
    box-shadow: 0 0 0 2px var(--lumo-primary-color-50pct);
  }

  /* Read-only and disabled */
  :host(:is([readonly], [disabled])) ::slotted(:is(input, textarea):placeholder-shown) {
    opacity: 0;
  }

  /* Disabled style */
  :host([disabled]) {
    pointer-events: none;
  }

  :host([disabled]) [part='label'],
  :host([disabled]) [part='input-field'] ::slotted(*) {
    color: var(--lumo-disabled-text-color);
    -webkit-text-fill-color: var(--lumo-disabled-text-color);
  }

  /* Invalid style */
  :host([invalid][focus-ring]) [part='input-field'] {
    box-shadow: 0 0 0 2px var(--lumo-error-color-50pct);
  }

  :host([input-prevented]) [part='input-field'] {
    animation: shake 0.15s infinite;
  }

  @keyframes shake {
    25% {
      transform: translateX(4px);
    }
    75% {
      transform: translateX(-4px);
    }
  }

  /* Small theme */
  :host([theme~='small']) {
    font-size: var(--lumo-font-size-s);
    --lumo-text-field-size: var(--lumo-size-s);
  }

  :host([theme~='small']) [part='label'] {
    font-size: var(--lumo-font-size-xs);
  }

  :host([theme~='small']) [part='error-message'] {
    font-size: var(--lumo-font-size-xxs);
  }

  /* Slotted content */
  [part='input-field'] ::slotted(:not(iron-icon):not(vaadin-icon):not(input):not(textarea)) {
    color: var(--lumo-secondary-text-color);
    font-weight: 400;
  }

  [part='clear-button']::before {
    content: var(--lumo-icons-cross);
  }
`;

const inputFieldShared$1 = [requiredField, fieldButton, helper, inputField];

registerStyles('', inputFieldShared$1, {
  moduleId: 'lumo-input-field-shared-styles'
});

/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

registerStyles('vaadin-text-field', inputFieldShared$1, {
  moduleId: 'lumo-text-field-styles'
});

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin to provide content for named slots defined by component.
 *
 * @polymerMixin
 */
const SlotMixin = dedupingMixin(
  (superclass) =>
    class SlotMixinClass extends superclass {
      /**
       * List of named slots to initialize.
       * @protected
       */
      get slots() {
        return {};
      }

      /** @protected */
      ready() {
        super.ready();
        this._connectSlotMixin();
      }

      /** @private */
      _connectSlotMixin() {
        Object.keys(this.slots).forEach((slotName) => {
          // Ignore labels of nested components, if any
          const hasContent = this._getDirectSlotChild(slotName) !== undefined;

          if (!hasContent) {
            const slotFactory = this.slots[slotName];
            const slotContent = slotFactory();
            if (slotContent instanceof Element) {
              slotContent.setAttribute('slot', slotName);
              this.appendChild(slotContent);
            }
          }
        });
      }

      /** @protected */
      _getDirectSlotChild(slotName) {
        return Array.from(this.children).find((el) => el.slot === slotName);
      }
    }
);

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A controller for managing ARIA attributes for a field element:
 * either the component itself or slotted `<input>` element.
 */
class FieldAriaController {
  constructor(host) {
    this.host = host;
    this.__required = false;
  }

  /**
   * Sets a target element to which ARIA attributes are added.
   *
   * @param {HTMLElement} target
   */
  setTarget(target) {
    this.__target = target;
    this.__setAriaRequiredAttribute(this.__required);
    this.__setLabelIdToAriaAttribute(this.__labelId);
    this.__setErrorIdToAriaAttribute(this.__errorId);
    this.__setHelperIdToAriaAttribute(this.__helperId);
  }

  /**
   * Toggles the `aria-required` attribute on the target element
   * if the target is the host component (e.g. a field group).
   * Otherwise, it does nothing.
   *
   * @param {boolean} required
   */
  setRequired(required) {
    this.__setAriaRequiredAttribute(required);
    this.__required = required;
  }

  /**
   * Links the target element with a slotted label element
   * via the target's attribute `aria-labelledby`.
   *
   * To unlink the previous slotted label element, pass `null` as `labelId`.
   *
   * @param {string | null} labelId
   */
  setLabelId(labelId) {
    this.__setLabelIdToAriaAttribute(labelId, this.__labelId);
    this.__labelId = labelId;
  }

  /**
   * Links the target element with a slotted error element via the target's attribute:
   * - `aria-labelledby` if the target is the host component (e.g a field group).
   * - `aria-describedby` otherwise.
   *
   * To unlink the previous slotted error element, pass `null` as `errorId`.
   *
   * @param {string | null} errorId
   */
  setErrorId(errorId) {
    this.__setErrorIdToAriaAttribute(errorId, this.__errorId);
    this.__errorId = errorId;
  }

  /**
   * Links the target element with a slotted helper element via the target's attribute:
   * - `aria-labelledby` if the target is the host component (e.g a field group).
   * - `aria-describedby` otherwise.
   *
   * To unlink the previous slotted helper element, pass `null` as `helperId`.
   *
   * @param {string | null} helperId
   */
  setHelperId(helperId) {
    this.__setHelperIdToAriaAttribute(helperId, this.__helperId);
    this.__helperId = helperId;
  }

  /**
   * `true` if the target element is the host component itself, `false` otherwise.
   *
   * @return {boolean}
   * @private
   */
  get __isGroupField() {
    return this.__target === this.host;
  }

  /**
   * @param {string | null | undefined} labelId
   * @param {string | null | undefined} oldLabelId
   * @private
   */
  __setLabelIdToAriaAttribute(labelId, oldLabelId) {
    this.__setAriaAttributeId('aria-labelledby', labelId, oldLabelId);
  }

  /**
   * @param {string | null | undefined} errorId
   * @param {string | null | undefined} oldErrorId
   * @private
   */
  __setErrorIdToAriaAttribute(errorId, oldErrorId) {
    // For groups, add all IDs to aria-labelledby rather than aria-describedby -
    // that should guarantee that it's announced when the group is entered.
    if (this.__isGroupField) {
      this.__setAriaAttributeId('aria-labelledby', errorId, oldErrorId);
    } else {
      this.__setAriaAttributeId('aria-describedby', errorId, oldErrorId);
    }
  }

  /**
   * @param {string | null | undefined} helperId
   * @param {string | null | undefined} oldHelperId
   * @private
   */
  __setHelperIdToAriaAttribute(helperId, oldHelperId) {
    // For groups, add all IDs to aria-labelledby rather than aria-describedby -
    // that should guarantee that it's announced when the group is entered.
    if (this.__isGroupField) {
      this.__setAriaAttributeId('aria-labelledby', helperId, oldHelperId);
    } else {
      this.__setAriaAttributeId('aria-describedby', helperId, oldHelperId);
    }
  }

  /**
   * @param {boolean} required
   * @private
   */
  __setAriaRequiredAttribute(required) {
    if (!this.__target) {
      return;
    }

    if (!this.__isGroupField) {
      // native <input> or <textarea>, required is enough
      return;
    }

    if (required) {
      this.__target.setAttribute('aria-required', 'true');
    } else {
      this.__target.removeAttribute('aria-required');
    }
  }

  /**
   * @param {string | null | undefined} newId
   * @param {string | null | undefined} oldId
   * @private
   */
  __setAriaAttributeId(attr, newId, oldId) {
    if (!this.__target) {
      return;
    }

    const value = this.__target.getAttribute(attr);
    const ids = value ? new Set(value.split(' ')) : new Set();

    if (oldId) {
      ids.delete(oldId);
    }
    if (newId) {
      ids.add(newId);
    }

    this.__target.setAttribute(attr, [...ids].join(' '));
  }
}

/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A controller that manages the helper node content.
 */
class HelperController extends SlotController {
  constructor(host) {
    // Do not provide slot factory, as only create helper lazily.
    super(host, 'helper');
  }

  get helperId() {
    return this.node && this.node.id;
  }

  /**
   * Override to initialize the newly added custom helper.
   *
   * @param {Node} helperNode
   * @protected
   * @override
   */
  initCustomNode(helperNode) {
    this.__updateHelperId(helperNode);

    this.__observeHelper(helperNode);

    const hasHelper = this.__hasHelper(helperNode);
    this.__toggleHasHelper(hasHelper);
  }

  /**
   * Override to cleanup helper node when it's removed.
   *
   * @param {Node} _node
   * @protected
   * @override
   */
  teardownNode(_node) {
    // The observer does not exist when the default helper is removed.
    if (this.__helperIdObserver) {
      this.__helperIdObserver.disconnect();
    }

    const helperNode = this.getSlotChild();

    // Custom node is added to helper slot
    if (helperNode && helperNode !== this.defaultNode) {
      const hasHelper = this.__hasHelper(helperNode);
      this.__toggleHasHelper(hasHelper);
    } else {
      // Restore default helper if needed
      this.__applyDefaultHelper(this.helperText, helperNode);
    }
  }

  /**
   * Set helper text based on corresponding host property.
   * @param {string} helperText
   */
  setHelperText(helperText) {
    this.helperText = helperText;

    const helperNode = this.getSlotChild();
    if (!helperNode || helperNode === this.defaultNode) {
      this.__applyDefaultHelper(helperText, helperNode);
    }
  }

  /**
   * @param {HTMLElement} helperNode
   * @return {boolean}
   * @private
   */
  __hasHelper(helperNode) {
    if (!helperNode) {
      return false;
    }

    return helperNode.children.length > 0 || this.__isNotEmpty(helperNode.textContent);
  }

  /**
   * @param {string} helperText
   * @private
   */
  __isNotEmpty(helperText) {
    return helperText && helperText.trim() !== '';
  }

  /**
   * @param {string} helperText
   * @param {Node} helperNode
   * @private
   */
  __applyDefaultHelper(helperText, helperNode) {
    const hasHelperText = this.__isNotEmpty(helperText);

    if (hasHelperText && !helperNode) {
      // Set slot factory lazily to only create helper node when needed.
      this.slotFactory = () => document.createElement('div');

      helperNode = this.attachDefaultNode();

      this.__updateHelperId(helperNode);
      this.__observeHelper(helperNode);
    }

    if (helperNode) {
      helperNode.textContent = helperText;
    }

    this.__toggleHasHelper(hasHelperText);
  }

  /**
   * @param {HTMLElement} helperNode
   * @private
   */
  __observeHelper(helperNode) {
    this.__helperObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const target = mutation.target;

        // Ensure the mutation target is the currently connected helper
        // to ignore async mutations dispatched for removed element.
        const isHelperMutation = target === this.node;

        if (mutation.type === 'attributes') {
          // We use attributeFilter to only observe ID mutation,
          // no need to check for attribute name separately.
          if (isHelperMutation && target.id !== this.defaultId) {
            this.__updateHelperId(target);
          }
        } else if (isHelperMutation || target.parentElement === this.node) {
          // Update has-helper when textContent changes
          const hasHelper = this.__hasHelper(this.node);
          this.__toggleHasHelper(hasHelper);
        }
      });
    });

    // Observe changes to helper ID attribute, text content and children.
    this.__helperObserver.observe(helperNode, {
      attributes: true,
      attributeFilter: ['id'],
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  /**
   * @param {boolean} hasHelper
   * @private
   */
  __toggleHasHelper(hasHelper) {
    this.host.toggleAttribute('has-helper', hasHelper);

    // Make it possible for other mixins to observe change
    this.dispatchEvent(
      new CustomEvent('helper-changed', {
        detail: {
          hasHelper,
          node: this.node
        }
      })
    );
  }

  /**
   * @param {HTMLElement} helperNode
   * @private
   */
  __updateHelperId(helperNode) {
    if (!helperNode.id) {
      helperNode.id = this.defaultId;
    }
  }
}

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin to provide required state and validation logic.
 *
 * @polymerMixin
 */
const ValidateMixin = dedupingMixin(
  (superclass) =>
    class ValidateMixinClass extends superclass {
      static get properties() {
        return {
          /**
           * Set to true when the field is invalid.
           */
          invalid: {
            type: Boolean,
            reflectToAttribute: true,
            notify: true,
            value: false
          },

          /**
           * Specifies that the user must fill in a value.
           */
          required: {
            type: Boolean,
            reflectToAttribute: true
          }
        };
      }

      /**
       * Returns true if field is valid, and sets `invalid` based on the field validity.
       *
       * @return {boolean} True if the value is valid.
       */
      validate() {
        return !(this.invalid = !this.checkValidity());
      }

      /**
       * Returns true if the field value satisfies all constraints (if any).
       *
       * @return {boolean}
       */
      checkValidity() {
        return !this.required || !!this.value;
      }
    }
);

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin to provide common field logic: label, error message and helper text.
 *
 * @polymerMixin
 * @mixes ControllerMixin
 * @mixes LabelMixin
 * @mixes SlotMixin
 * @mixes ValidateMixin
 */
const FieldMixin = (superclass) =>
  class FieldMixinClass extends ValidateMixin(LabelMixin(ControllerMixin(SlotMixin(superclass)))) {
    static get properties() {
      return {
        /**
         * A target element to which ARIA attributes are set.
         * @protected
         */
        ariaTarget: {
          type: Object,
          observer: '_ariaTargetChanged'
        },

        /**
         * Error to show when the field is invalid.
         *
         * @attr {string} error-message
         */
        errorMessage: {
          type: String
        },

        /**
         * String used for the helper text.
         * @attr {string} helper-text
         */
        helperText: {
          type: String,
          observer: '_helperTextChanged'
        },

        /** @protected */
        _helperId: String
      };
    }

    /** @protected */
    get slots() {
      return {
        ...super.slots,
        'error-message': () => {
          const error = document.createElement('div');
          error.textContent = this.errorMessage;
          return error;
        }
      };
    }

    static get observers() {
      return [
        '__observeOffsetHeight(errorMessage, invalid, label, helperText)',
        '_updateErrorMessage(invalid, errorMessage)',
        '_invalidChanged(invalid)',
        '_requiredChanged(required)'
      ];
    }

    /**
     * @protected
     * @return {HTMLElement}
     */
    get _errorNode() {
      return this._getDirectSlotChild('error-message');
    }

    /** @protected */
    get _helperId() {
      return this._helperController.helperId;
    }

    /**
     * @protected
     * @return {HTMLElement}
     */
    get _helperNode() {
      return this._helperController.node;
    }

    constructor() {
      super();

      // Ensure every instance has unique ID
      const uniqueId = (FieldMixinClass._uniqueFieldId = 1 + FieldMixinClass._uniqueFieldId || 0);
      this._errorId = `error-${this.localName}-${uniqueId}`;

      this._fieldAriaController = new FieldAriaController(this);
      this._helperController = new HelperController(this);

      this.addController(this._fieldAriaController);
      this.addController(this._helperController);

      this._labelController.addEventListener('label-changed', (event) => {
        const { hasLabel, node } = event.detail;
        this.__labelChanged(hasLabel, node);
      });

      this._helperController.addEventListener('helper-changed', (event) => {
        const { hasHelper, node } = event.detail;
        this.__helperChanged(hasHelper, node);
      });
    }

    /** @protected */
    ready() {
      super.ready();

      const error = this._errorNode;
      if (error) {
        error.id = this._errorId;

        this.__applyCustomError();

        this._updateErrorMessage(this.invalid, this.errorMessage);
      }
    }

    /** @private */
    __applyCustomError() {
      const error = this.__errorMessage;
      if (error && error !== this.errorMessage) {
        this.errorMessage = error;
        delete this.__errorMessage;
      }
    }

    /** @private */
    __helperChanged(hasHelper, helperNode) {
      if (hasHelper) {
        this._fieldAriaController.setHelperId(helperNode.id);
      } else {
        this._fieldAriaController.setHelperId(null);
      }
    }

    /**
     * Dispatch an event if a specific size measurement property has changed.
     * Supporting multiple properties here is needed for `vaadin-text-area`.
     * @protected
     */
    _dispatchIronResizeEventIfNeeded(prop, value) {
      const oldSize = '__old' + prop;
      if (this[oldSize] !== undefined && this[oldSize] !== value) {
        this.dispatchEvent(new CustomEvent('iron-resize', { bubbles: true, composed: true }));
      }

      this[oldSize] = value;
    }

    /** @private */
    __observeOffsetHeight() {
      this.__observeOffsetHeightDebouncer = Debouncer.debounce(
        this.__observeOffsetHeightDebouncer,
        animationFrame,
        () => {
          this._dispatchIronResizeEventIfNeeded('Height', this.offsetHeight);
        }
      );
    }

    /** @private */
    __labelChanged(hasLabel, labelNode) {
      // Label ID should be only added when the label content is present.
      // Otherwise, it may conflict with an `aria-label` attribute possibly added by the user.
      if (hasLabel) {
        this._fieldAriaController.setLabelId(labelNode.id);
      } else {
        this._fieldAriaController.setLabelId(null);
      }
    }

    /**
     * @param {boolean} invalid
     * @param {string | null | undefined} errorMessage
     * @protected
     */
    _updateErrorMessage(invalid, errorMessage) {
      const error = this._errorNode;
      if (!error) {
        return;
      }

      // save the custom error message content
      if (error.textContent && !errorMessage) {
        this.__errorMessage = error.textContent.trim();
      }
      const hasError = Boolean(invalid && errorMessage);
      error.textContent = hasError ? errorMessage : '';
      error.hidden = !hasError;
      this.toggleAttribute('has-error-message', hasError);

      // Role alert will make the error message announce immediately
      // as the field becomes invalid
      if (hasError) {
        error.setAttribute('role', 'alert');
      } else {
        error.removeAttribute('role');
      }
    }

    /**
     * @param {string} helperText
     * @protected
     */
    _helperTextChanged(helperText) {
      this._helperController.setHelperText(helperText);
    }

    /**
     * @param {HTMLElement | null | undefined} target
     * @protected
     */
    _ariaTargetChanged(target) {
      if (target) {
        this._fieldAriaController.setTarget(target);
      }
    }

    /**
     * @param {boolean} required
     * @protected
     */
    _requiredChanged(required) {
      this._fieldAriaController.setRequired(required);
    }

    /**
     * @param {boolean} required
     * @protected
     */
    _invalidChanged(invalid) {
      // This timeout is needed to prevent NVDA from announcing the error message twice:
      // 1. Once adding the `[role=alert]` attribute by the `_updateErrorMessage` method (OK).
      // 2. Once linking the error ID with the ARIA target here (unwanted).
      // Related issue: https://github.com/vaadin/web-components/issues/3061.
      setTimeout(() => {
        // Error message ID needs to be dynamically added / removed based on the validity
        // Otherwise assistive technologies would announce the error, even if we hide it.
        if (invalid) {
          this._fieldAriaController.setErrorId(this._errorId);
        } else {
          this._fieldAriaController.setErrorId(null);
        }
      });
    }
  };

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin to combine multiple input validation constraints.
 *
 * @polymerMixin
 * @mixes DelegateStateMixin
 * @mixes InputMixin
 * @mixes ValidateMixin
 */
const InputConstraintsMixin = dedupingMixin(
  (superclass) =>
    class InputConstraintsMixinClass extends DelegateStateMixin(ValidateMixin(InputMixin(superclass))) {
      /**
       * An array of attributes which participate in the input validation.
       * Changing these attributes will cause the input to re-validate.
       *
       * IMPORTANT: The attributes should be properly delegated to the input element
       * from the host using `delegateAttrs` getter (see `DelegateStateMixin`).
       * The `required` attribute is already delegated.
       */
      static get constraints() {
        return ['required'];
      }

      static get delegateAttrs() {
        return [...super.delegateAttrs, 'required'];
      }

      /** @protected */
      ready() {
        super.ready();

        this._createConstraintsObserver();
      }

      /**
       * Returns true if the current input value satisfies all constraints (if any).
       * @return {boolean}
       */
      checkValidity() {
        if (this.inputElement && this._hasValidConstraints(this.constructor.constraints.map((c) => this[c]))) {
          return this.inputElement.checkValidity();
        } else {
          return !this.invalid;
        }
      }

      /**
       * Returns true if some of the provided set of constraints are valid.
       * @param {Array} constraints
       * @return {boolean}
       * @protected
       */
      _hasValidConstraints(constraints) {
        return constraints.some((c) => this.__isValidConstraint(c));
      }

      /**
       * Override this method to customize setting up constraints observer.
       * @protected
       */
      _createConstraintsObserver() {
        // This complex observer needs to be added dynamically instead of using `static get observers()`
        // to make it possible to tweak this behavior in classes that apply this mixin.
        this._createMethodObserver(`_constraintsChanged(${this.constructor.constraints.join(', ')})`);
      }

      /**
       * Override this method to implement custom validation constraints.
       * @param {unknown[]} constraints
       * @protected
       */
      _constraintsChanged(...constraints) {
        // Prevent marking field as invalid when setting required state
        // or any other constraint before a user has entered the value.
        if (!this.invalid) {
          return;
        }

        if (this._hasValidConstraints(constraints)) {
          this.validate();
        } else {
          this.invalid = false;
        }
      }

      /**
       * Override an event listener inherited from `InputMixin`
       * to capture native `change` event and make sure that
       * a new one is dispatched after validation runs.
       * @param {Event} event
       * @protected
       * @override
       */
      _onChange(event) {
        event.stopPropagation();

        this.validate();

        this.dispatchEvent(
          new CustomEvent('change', {
            detail: {
              sourceEvent: event
            },
            bubbles: event.bubbles,
            cancelable: event.cancelable
          })
        );
      }

      /** @private */
      __isValidConstraint(constraint) {
        // 0 is valid for `minlength` and `maxlength`
        return Boolean(constraint) || constraint === 0;
      }
    }
);

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin to provide shared logic for the editable form input controls.
 *
 * @polymerMixin
 * @mixes DelegateFocusMixin
 * @mixes FieldMixin
 * @mixes InputConstraintsMixin
 * @mixes KeyboardMixin
 */
const InputControlMixin = (superclass) =>
  class InputControlMixinClass extends DelegateFocusMixin(
    InputConstraintsMixin(FieldMixin(KeyboardMixin(superclass)))
  ) {
    static get properties() {
      return {
        /**
         * If true, the input text gets fully selected when the field is focused using click or touch / tap.
         */
        autoselect: {
          type: Boolean,
          value: false
        },

        /**
         * Set to true to display the clear icon which clears the input.
         * @attr {boolean} clear-button-visible
         */
        clearButtonVisible: {
          type: Boolean,
          reflectToAttribute: true,
          value: false
        },

        /**
         * The name of this field.
         */
        name: {
          type: String,
          reflectToAttribute: true
        },

        /**
         * A hint to the user of what can be entered in the field.
         */
        placeholder: {
          type: String,
          reflectToAttribute: true
        },

        /**
         * When present, it specifies that the field is read-only.
         */
        readonly: {
          type: Boolean,
          value: false,
          reflectToAttribute: true
        },

        /**
         * The text usually displayed in a tooltip popup when the mouse is over the field.
         */
        title: {
          type: String,
          reflectToAttribute: true
        }
      };
    }

    static get delegateAttrs() {
      return [...super.delegateAttrs, 'name', 'type', 'placeholder', 'readonly', 'invalid', 'title'];
    }

    /**
     * Any element extending this mixin is required to implement this getter.
     * It returns the reference to the clear button element.
     * @protected
     * @return {Element | null | undefined}
     */
    get clearElement() {
      console.warn(`Please implement the 'clearElement' property in <${this.localName}>`);
      return null;
    }

    /** @protected */
    ready() {
      super.ready();

      if (this.clearElement) {
        this.clearElement.addEventListener('click', (e) => this._onClearButtonClick(e));
      }
    }

    /**
     * @param {Event} event
     * @protected
     */
    _onClearButtonClick(event) {
      event.preventDefault();
      this.inputElement.focus();
      this.clear();
      this.inputElement.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      this.inputElement.dispatchEvent(new Event('change', { bubbles: true }));
    }

    /**
     * Override an event listener from `DelegateFocusMixin`.
     * @param {FocusEvent} event
     * @protected
     * @override
     */
    _onFocus(event) {
      super._onFocus(event);

      if (this.autoselect && this.inputElement) {
        this.inputElement.select();
      }
    }

    /**
     * Override an event listener inherited from `KeydownMixin` to clear on Esc.
     * Components that extend this mixin can prevent this behavior by overriding
     * this method without calling `super._onKeyDown` to provide custom logic.
     * @param {KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyDown(event) {
      super._onKeyDown(event);

      if (event.key === 'Escape' && this.clearButtonVisible) {
        const dispatchChange = !!this.value;
        this.clear();
        dispatchChange && this.inputElement.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    /**
     * Override an event listener inherited from `InputMixin`
     * to capture native `change` event and make sure that
     * a new one is dispatched after validation runs.
     * @param {Event} event
     * @protected
     * @override
     */
    _onChange(event) {
      event.stopPropagation();

      this.validate();

      this.dispatchEvent(
        new CustomEvent('change', {
          detail: {
            sourceEvent: event
          },
          bubbles: event.bubbles,
          cancelable: event.cancelable
        })
      );
    }
  };

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin to provide logic for vaadin-text-field and related components.
 *
 * @polymerMixin
 * @mixes InputControlMixin
 */
const InputFieldMixin = (superclass) =>
  class InputFieldMixinClass extends InputControlMixin(superclass) {
    static get properties() {
      return {
        /**
         * Whether the value of the control can be automatically completed by the browser.
         * List of available options at:
         * https://developer.mozilla.org/en/docs/Web/HTML/Element/input#attr-autocomplete
         */
        autocomplete: {
          type: String
        },

        /**
         * This is a property supported by Safari that is used to control whether
         * autocorrection should be enabled when the user is entering/editing the text.
         * Possible values are:
         * on: Enable autocorrection.
         * off: Disable autocorrection.
         */
        autocorrect: {
          type: String
        },

        /**
         * This is a property supported by Safari and Chrome that is used to control whether
         * autocapitalization should be enabled when the user is entering/editing the text.
         * Possible values are:
         * characters: Characters capitalization.
         * words: Words capitalization.
         * sentences: Sentences capitalization.
         * none: No capitalization.
         */
        autocapitalize: {
          type: String
        },

        /**
         * A pattern matched against individual characters the user inputs.
         * When set, the field will prevent:
         * - `keyDown` events if the entered key doesn't match `/^_enabledCharPattern$/`
         * - `paste` events if the pasted text doesn't match `/^_enabledCharPattern*$/`
         * - `drop` events if the dropped text doesn't match `/^_enabledCharPattern*$/`
         *
         * For example, to enable entering only numbers and minus signs,
         * `_enabledCharPattern = "[\\d-]"`
         * @protected
         */
        _enabledCharPattern: {
          type: String,
          observer: '_enabledCharPatternChanged'
        }
      };
    }

    static get delegateAttrs() {
      return [...super.delegateAttrs, 'autocapitalize', 'autocomplete', 'autocorrect'];
    }

    constructor() {
      super();

      this._boundOnPaste = this._onPaste.bind(this);
      this._boundOnDrop = this._onDrop.bind(this);
      this._boundOnBeforeInput = this._onBeforeInput.bind(this);
    }

    /**
     * @param {HTMLElement} input
     * @protected
     * @override
     */
    _inputElementChanged(input) {
      super._inputElementChanged(input);

      if (input) {
        // Discard value set on the custom slotted input.
        if (input.value && input.value !== this.value) {
          console.warn(`Please define value on the <${this.localName}> component!`);
          input.value = '';
        }

        if (this.value) {
          input.value = this.value;
        }
      }
    }

    // Workaround for https://github.com/Polymer/polymer/issues/5259
    get __data() {
      return this.__dataValue || {};
    }

    set __data(value) {
      this.__dataValue = value;
    }

    /**
     * Override an event listener from `DelegateFocusMixin`.
     * @param {FocusEvent} event
     * @protected
     * @override
     */
    _onBlur(event) {
      super._onBlur(event);

      this.validate();
    }

    /**
     * Override an event listener from `InputMixin`
     * to mark as valid after user started typing.
     * @param {Event} event
     * @protected
     * @override
     */
    _onInput(event) {
      super._onInput(event);

      if (this.invalid) {
        this.validate();
      }
    }

    /**
     * Override a method from `InputMixin` to validate the field
     * when a new value is set programmatically.
     * @param {string} value
     * @protected
     * @override
     */
    _forwardInputValue(value) {
      super._forwardInputValue(value);

      if (this.invalid) {
        this.validate();
      }
    }

    /**
     * Override a method from `InputMixin`.
     * @param {!HTMLElement} input
     * @protected
     * @override
     */
    _addInputListeners(input) {
      super._addInputListeners(input);

      input.addEventListener('paste', this._boundOnPaste);
      input.addEventListener('drop', this._boundOnDrop);
      input.addEventListener('beforeinput', this._boundOnBeforeInput);
    }

    /**
     * Override a method from `InputMixin`.
     * @param {!HTMLElement} input
     * @protected
     * @override
     */
    _removeInputListeners(input) {
      super._removeInputListeners(input);

      input.removeEventListener('paste', this._boundOnPaste);
      input.removeEventListener('drop', this._boundOnDrop);
      input.removeEventListener('beforeinput', this._boundOnBeforeInput);
    }

    /**
     * Override an event listener from `ClearButtonMixin`
     * to avoid adding a separate listener.
     * @param {!KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyDown(event) {
      if (this._enabledCharPattern && !this.__shouldAcceptKey(event)) {
        event.preventDefault();
      }

      super._onKeyDown(event);
    }

    /** @private */
    __shouldAcceptKey(event) {
      return (
        event.metaKey ||
        event.ctrlKey ||
        !event.key || // allow typing anything if event.key is not supported
        event.key.length !== 1 || // allow "Backspace", "ArrowLeft" etc.
        this.__enabledCharRegExp.test(event.key)
      );
    }

    /** @private */
    _onPaste(e) {
      if (this._enabledCharPattern) {
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        if (!this.__enabledTextRegExp.test(pastedText)) {
          e.preventDefault();
        }
      }
    }

    /** @private */
    _onDrop(e) {
      if (this._enabledCharPattern) {
        const draggedText = e.dataTransfer.getData('text');
        if (!this.__enabledTextRegExp.test(draggedText)) {
          e.preventDefault();
        }
      }
    }

    /** @private */
    _onBeforeInput(e) {
      // The `beforeinput` event covers all the cases for `_enabledCharPattern`: keyboard, pasting and dropping,
      // but it is still experimental technology so we can't rely on it. It's used here just as an additional check,
      // because it seems to be the only way to detect and prevent specific keys on mobile devices.
      // See https://github.com/vaadin/vaadin-text-field/issues/429
      if (this._enabledCharPattern && e.data && !this.__enabledTextRegExp.test(e.data)) {
        e.preventDefault();
      }
    }

    /** @private */
    _enabledCharPatternChanged(charPattern) {
      if (charPattern) {
        this.__enabledCharRegExp = new RegExp('^' + charPattern + '$');
        this.__enabledTextRegExp = new RegExp('^' + charPattern + '*$');
      }
    }
  };

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * A mixin to provide `pattern` and `preventInvalidInput` properties.
 *
 * @polymerMixin
 * @mixes InputConstraintsMixin
 */
const PatternMixin = (superclass) =>
  class PatternMixinClass extends InputConstraintsMixin(superclass) {
    static get properties() {
      return {
        /**
         * A regular expression that the value is checked against.
         * The pattern must match the entire value, not just some subset.
         */
        pattern: {
          type: String
        },

        /**
         * When set to true, user is prevented from typing a value that
         * conflicts with the given `pattern`.
         * @attr {boolean} prevent-invalid-input
         */
        preventInvalidInput: {
          type: Boolean
        }
      };
    }

    static get delegateAttrs() {
      return [...super.delegateAttrs, 'pattern'];
    }

    static get constraints() {
      return [...super.constraints, 'pattern'];
    }

    /** @private */
    _checkInputValue() {
      if (this.preventInvalidInput) {
        const input = this.inputElement;
        if (input && input.value.length > 0 && !this.checkValidity()) {
          input.value = this.value || '';
          // add input-prevented attribute for 200ms
          this.setAttribute('input-prevented', '');
          this._inputDebouncer = Debouncer.debounce(this._inputDebouncer, timeOut.after(200), () => {
            this.removeAttribute('input-prevented');
          });
          return;
        }
      }
    }

    /**
     * @param {Event} event
     * @protected
     */
    _onInput(event) {
      this._checkInputValue();

      super._onInput(event);
    }
  };

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd..
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const clearButton = r`
  [part='clear-button'] {
    display: none;
    cursor: default;
  }

  [part='clear-button']::before {
    content: '✕';
  }

  :host([clear-button-visible][has-value]:not([disabled]):not([readonly])) [part='clear-button'] {
    display: block;
  }
`;

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd..
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const fieldShared = r`
  :host {
    display: inline-flex;
    outline: none;
  }

  :host::before {
    content: '\\2003';
    width: 0;
    display: inline-block;
    /* Size and position this element on the same vertical position as the input-field element
          to make vertical align for the host element work as expected */
  }

  :host([hidden]) {
    display: none !important;
  }

  :host(:not([has-label])) [part='label'] {
    display: none;
  }
`;

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd..
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const inputFieldContainer = r`
  [class$='container'] {
    display: flex;
    flex-direction: column;
    min-width: 100%;
    max-width: 100%;
    width: var(--vaadin-field-default-width, 12em);
  }
`;

/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd..
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const inputFieldShared = [fieldShared, inputFieldContainer, clearButton];

/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

registerStyles('vaadin-text-field', inputFieldShared, { moduleId: 'vaadin-text-field-styles' });

/**
 * `<vaadin-text-field>` is a web component that allows the user to input and edit text.
 *
 * ```html
 * <vaadin-text-field label="First Name"></vaadin-text-field>
 * ```
 *
 * ### Prefixes and suffixes
 *
 * These are child elements of a `<vaadin-text-field>` that are displayed
 * inline with the input, before or after.
 * In order for an element to be considered as a prefix, it must have the slot
 * attribute set to `prefix` (and similarly for `suffix`).
 *
 * ```html
 * <vaadin-text-field label="Email address">
 *   <div slot="prefix">Sent to:</div>
 *   <div slot="suffix">@vaadin.com</div>
 * </vaadin-text-field>
 * ```
 *
 * ### Styling
 *
 * The following custom properties are available for styling:
 *
 * Custom property                | Description                | Default
 * -------------------------------|----------------------------|---------
 * `--vaadin-field-default-width` | Default width of the field | `12em`
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name            | Description
 * ---------------------|----------------
 * `label`              | The label element
 * `input-field`        | The element that wraps prefix, value and suffix
 * `clear-button`       | The clear button
 * `error-message`      | The error message element
 * `helper-text`        | The helper text element wrapper
 * `required-indicator` | The `required` state indicator element
 *
 * The following state attributes are available for styling:
 *
 * Attribute           | Description | Part name
 * --------------------|-------------|------------
 * `disabled`          | Set to a disabled text field | :host
 * `has-value`         | Set when the element has a value | :host
 * `has-label`         | Set when the element has a label | :host
 * `has-helper`        | Set when the element has helper text or slot | :host
 * `has-error-message` | Set when the element has an error message | :host
 * `invalid`           | Set when the element is invalid | :host
 * `input-prevented`   | Temporarily set when invalid input is prevented | :host
 * `focused`           | Set when the element is focused | :host
 * `focus-ring`        | Set when the element is keyboard focused | :host
 * `readonly`          | Set to a readonly text field | :host
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {Event} input - Fired when the value is changed by the user: on every typing keystroke, and the value is cleared using the clear button.
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @mixes PatternMixin
 * @mixes InputFieldMixin
 */
class TextField extends PatternMixin(InputFieldMixin(ThemableMixin(ElementMixin(PolymerElement)))) {
  static get is() {
    return 'vaadin-text-field';
  }

  static get template() {
    return html`
      <style>
        [part='input-field'] {
          flex-grow: 0;
        }
      </style>

      <div class="vaadin-field-container">
        <div part="label">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true" on-click="focus"></span>
        </div>

        <vaadin-input-container
          part="input-field"
          readonly="[[readonly]]"
          disabled="[[disabled]]"
          invalid="[[invalid]]"
          theme$="[[theme]]"
        >
          <slot name="prefix" slot="prefix"></slot>
          <slot name="input"></slot>
          <slot name="suffix" slot="suffix"></slot>
          <div id="clearButton" part="clear-button" slot="suffix" aria-hidden="true"></div>
        </vaadin-input-container>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      /**
       * Maximum number of characters (in Unicode code points) that the user can enter.
       */
      maxlength: {
        type: Number
      },

      /**
       * Minimum number of characters (in Unicode code points) that the user can enter.
       */
      minlength: {
        type: Number
      }
    };
  }

  static get delegateAttrs() {
    return [...super.delegateAttrs, 'maxlength', 'minlength'];
  }

  static get constraints() {
    return [...super.constraints, 'maxlength', 'minlength'];
  }

  constructor() {
    super();
    this._setType('text');
  }

  /** @protected */
  get clearElement() {
    return this.$.clearButton;
  }

  /** @protected */
  ready() {
    super.ready();

    this.addController(
      new InputController(this, (input) => {
        this._setInputElement(input);
        this._setFocusElement(input);
        this.stateTarget = input;
        this.ariaTarget = input;
      })
    );
    this.addController(new LabelledInputController(this.inputElement, this._labelController));
  }
}

customElements.define(TextField.is, TextField);

/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * `<vaadin-grid-filter>` is a helper element for the `<vaadin-grid>` that provides out-of-the-box UI controls,
 * and handlers for filtering the grid data.
 *
 * #### Example:
 * ```html
 * <vaadin-grid-column id="column"></vaadin-grid-column>
 * ```
 * ```js
 * const column = document.querySelector('#column');
 * column.headerRenderer = (root, column) => {
 *   let filter = root.firstElementChild;
 *   if (!filter) {
 *     filter = document.createElement('vaadin-grid-filter');
 *     root.appendChild(filter);
 *   }
 *   filter.path = 'name.first';
 * };
 * column.renderer = (root, column, model) => {
 *   root.textContent = model.item.name.first;
 * };
 * ```
 *
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 *
 * @extends HTMLElement
 */
class GridFilter extends class extends PolymerElement {} {
  static get template() {
    return html`
      <style>
        :host {
          display: inline-flex;
          max-width: 100%;
        }

        #filter {
          width: 100%;
          box-sizing: border-box;
        }
      </style>
      <slot name="filter">
        <vaadin-text-field id="filter" value="{{value}}"></vaadin-text-field>
      </slot>
    `;
  }

  static get is() {
    return 'vaadin-grid-filter';
  }

  static get properties() {
    return {
      /**
       * JS Path of the property in the item used for filtering the data.
       */
      path: String,

      /**
       * Current filter value.
       */
      value: {
        type: String,
        notify: true
      },

      /** @private */
      _connected: Boolean
    };
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();
    this._connected = true;
  }

  static get observers() {
    return ['_filterChanged(path, value, _connected)'];
  }

  /** @protected */
  ready() {
    super.ready();

    const child = this.firstElementChild;
    if (child && child.getAttribute('slot') !== 'filter') {
      console.warn('Make sure you have assigned slot="filter" to the child elements of <vaadin-grid-filter>');
      child.setAttribute('slot', 'filter');
    }
  }

  /** @private */
  _filterChanged(path, value, connected) {
    if (path === undefined || value === undefined || !connected) {
      return;
    }
    if (this._previousValue === undefined && value === '') {
      return;
    }
    this._previousValue = value;

    this._debouncerFilterChanged = Debouncer.debounce(this._debouncerFilterChanged, timeOut.after(200), () => {
      this.dispatchEvent(new CustomEvent('filter-changed', { bubbles: true }));
    });
  }

  focus() {
    this.$.filter.focus();
  }
}

customElements.define(GridFilter.is, GridFilter);

/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * `<vaadin-grid-filter-column>` is a helper element for the `<vaadin-grid>`
 * that provides default header renderer and functionality for filtering.
 *
 * #### Example:
 * ```html
 * <vaadin-grid items="[[items]]">
 *  <vaadin-grid-filter-column path="name.first"></vaadin-grid-filter-column>
 *
 *  <vaadin-grid-column>
 *    ...
 * ```
 */
class GridFilterColumn extends GridColumn {
  static get is() {
    return 'vaadin-grid-filter-column';
  }

  static get properties() {
    return {
      /**
       * JS Path of the property in the item used for filtering the data.
       */
      path: String,

      /**
       * Text to display as the label of the column filter text-field.
       */
      header: String
    };
  }

  static get observers() {
    return ['_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header, _filterValue)'];
  }

  constructor() {
    super();

    this.__boundOnFilterValueChanged = this.__onFilterValueChanged.bind(this);
  }

  /**
   * Renders the grid filter with the custom text field to the header cell.
   *
   * @override
   */
  _defaultHeaderRenderer(root, _column) {
    let filter = root.firstElementChild;
    let textField = filter ? filter.firstElementChild : undefined;

    if (!filter) {
      filter = document.createElement('vaadin-grid-filter');
      textField = document.createElement('vaadin-text-field');
      textField.setAttribute('slot', 'filter');
      textField.setAttribute('theme', 'small');
      textField.setAttribute('style', 'max-width: 100%;');
      textField.setAttribute('focus-target', '');
      textField.addEventListener('value-changed', this.__boundOnFilterValueChanged);
      filter.appendChild(textField);
      root.appendChild(filter);
    }

    filter.path = this.path;
    filter.value = this._filterValue;

    textField.__rendererValue = this._filterValue;
    textField.value = this._filterValue;
    textField.label = this.__getHeader(this.header, this.path);
  }

  /**
   * The filter column doesn't allow to use a custom header renderer
   * to override the header cell content.
   * It always renders the grid filter to the header cell.
   *
   * @override
   */
  _computeHeaderRenderer() {
    return this._defaultHeaderRenderer;
  }

  /**
   * Updates the internal filter value once the filter text field is changed.
   * The listener handles only user-fired events.
   *
   * @private
   */
  __onFilterValueChanged(e) {
    // Skip if the value is changed by the renderer.
    if (e.detail.value === e.target.__rendererValue) {
      return;
    }

    this._filterValue = e.detail.value;
  }

  /** @private */
  __getHeader(header, path) {
    if (header) {
      return header;
    }

    if (path) {
      return this._generateHeader(path);
    }
  }
}

customElements.define(GridFilterColumn.is, GridFilterColumn);

/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * `<vaadin-grid-selection-column>` is a helper element for the `<vaadin-grid>`
 * that provides default renderers and functionality for item selection.
 *
 * #### Example:
 * ```html
 * <vaadin-grid items="[[items]]">
 *  <vaadin-grid-selection-column frozen auto-select></vaadin-grid-selection-column>
 *
 *  <vaadin-grid-column>
 *    ...
 * ```
 *
 * By default the selection column displays `<vaadin-checkbox>` elements in the
 * column cells. The checkboxes in the body rows toggle selection of the corresponding row items.
 *
 * When the grid data is provided as an array of [`items`](#/elements/vaadin-grid#property-items),
 * the column header gets an additional checkbox that can be used for toggling
 * selection for all the items at once.
 *
 * __The default content can also be overridden__
 *
 * @fires {CustomEvent} select-all-changed - Fired when the `selectAll` property changes.
 */
class GridSelectionColumn extends GridColumn {
  static get is() {
    return 'vaadin-grid-selection-column';
  }

  static get properties() {
    return {
      /**
       * Width of the cells for this column.
       */
      width: {
        type: String,
        value: '58px'
      },

      /**
       * Flex grow ratio for the cell widths. When set to 0, cell width is fixed.
       * @attr {number} flex-grow
       * @type {number}
       */
      flexGrow: {
        type: Number,
        value: 0
      },

      /**
       * When true, all the items are selected.
       * @attr {boolean} select-all
       * @type {boolean}
       */
      selectAll: {
        type: Boolean,
        value: false,
        notify: true
      },

      /**
       * When true, the active gets automatically selected.
       * @attr {boolean} auto-select
       * @type {boolean}
       */
      autoSelect: {
        type: Boolean,
        value: false
      },

      /** @private */
      __indeterminate: Boolean,

      /**
       * The previous state of activeItem. When activeItem turns to `null`,
       * previousActiveItem will have an Object with just unselected activeItem
       * @private
       */
      __previousActiveItem: Object,

      /** @private */
      __selectAllHidden: Boolean
    };
  }

  static get observers() {
    return [
      '__onSelectAllChanged(selectAll)',
      '_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header, selectAll, __indeterminate, __selectAllHidden)'
    ];
  }

  constructor() {
    super();

    this.__boundOnActiveItemChanged = this.__onActiveItemChanged.bind(this);
    this.__boundOnDataProviderChanged = this.__onDataProviderChanged.bind(this);
    this.__boundOnSelectedItemsChanged = this.__onSelectedItemsChanged.bind(this);
  }

  /** @protected */
  disconnectedCallback() {
    this._grid.removeEventListener('active-item-changed', this.__boundOnActiveItemChanged);
    this._grid.removeEventListener('data-provider-changed', this.__boundOnDataProviderChanged);
    this._grid.removeEventListener('filter-changed', this.__boundOnSelectedItemsChanged);
    this._grid.removeEventListener('selected-items-changed', this.__boundOnSelectedItemsChanged);

    super.disconnectedCallback();
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();
    if (this._grid) {
      this._grid.addEventListener('active-item-changed', this.__boundOnActiveItemChanged);
      this._grid.addEventListener('data-provider-changed', this.__boundOnDataProviderChanged);
      this._grid.addEventListener('filter-changed', this.__boundOnSelectedItemsChanged);
      this._grid.addEventListener('selected-items-changed', this.__boundOnSelectedItemsChanged);
    }
  }

  /**
   * Renders the Select All checkbox to the header cell.
   *
   * @override
   */
  _defaultHeaderRenderer(root, _column) {
    let checkbox = root.firstElementChild;
    if (!checkbox) {
      checkbox = document.createElement('vaadin-checkbox');
      checkbox.setAttribute('aria-label', 'Select All');
      checkbox.classList.add('vaadin-grid-select-all-checkbox');
      checkbox.addEventListener('checked-changed', this.__onSelectAllCheckedChanged.bind(this));
      root.appendChild(checkbox);
    }

    const checked = this.__isChecked(this.selectAll, this.__indeterminate);
    checkbox.__rendererChecked = checked;
    checkbox.checked = checked;
    checkbox.hidden = this.__selectAllHidden;
    checkbox.indeterminate = this.__indeterminate;
  }

  /**
   * Renders the Select Row checkbox to the body cell.
   *
   * @override
   */
  _defaultRenderer(root, _column, { item, selected }) {
    let checkbox = root.firstElementChild;
    if (!checkbox) {
      checkbox = document.createElement('vaadin-checkbox');
      checkbox.setAttribute('aria-label', 'Select Row');
      checkbox.addEventListener('checked-changed', this.__onSelectRowCheckedChanged.bind(this));
      root.appendChild(checkbox);
    }

    checkbox.__item = item;
    checkbox.__rendererChecked = selected;
    checkbox.checked = selected;
  }

  /** @private */
  __onSelectAllChanged(selectAll) {
    if (selectAll === undefined || !this._grid) {
      return;
    }

    if (!this.__selectAllInitialized) {
      // The initial value for selectAll property was applied, avoid clearing pre-selected items
      this.__selectAllInitialized = true;
      return;
    }

    if (this._selectAllChangeLock) {
      return;
    }

    if (selectAll && Array.isArray(this._grid.items)) {
      this.__withFilteredItemsArray((items) => (this._grid.selectedItems = items));
    } else {
      this._grid.selectedItems = [];
    }
  }

  /**
   * Return true if array `a` contains all the items in `b`
   * We need this when sorting or to preserve selection after filtering.
   * @private
   */
  __arrayContains(a, b) {
    return Array.isArray(a) && Array.isArray(b) && b.every((i) => a.includes(i));
  }

  /**
   * Enables or disables the Select All mode once the Select All checkbox is switched.
   * The listener handles only user-fired events.
   *
   * @private
   */
  __onSelectAllCheckedChanged(e) {
    // Skip if the state is changed by the renderer.
    if (e.target.checked === e.target.__rendererChecked) {
      return;
    }

    this.selectAll = this.__indeterminate || e.target.checked;
  }

  /**
   * Selects or deselects the row once the Select Row checkbox is switched.
   * The listener handles only user-fired events.
   *
   * @private
   */
  __onSelectRowCheckedChanged(e) {
    // Skip if the state is changed by the renderer.
    if (e.target.checked === e.target.__rendererChecked) {
      return;
    }

    if (e.target.checked) {
      this._grid.selectItem(e.target.__item);
    } else {
      this._grid.deselectItem(e.target.__item);
    }
  }

  /**
   * iOS needs indeterminated + checked at the same time
   * @private
   */
  __isChecked(selectAll, indeterminate) {
    return indeterminate || selectAll;
  }

  /** @private */
  __onActiveItemChanged(e) {
    const activeItem = e.detail.value;
    if (this.autoSelect) {
      const item = activeItem || this.__previousActiveItem;
      if (item) {
        this._grid._toggleItem(item);
      }
    }
    this.__previousActiveItem = activeItem;
  }

  /** @private */
  __onSelectedItemsChanged() {
    this._selectAllChangeLock = true;
    if (Array.isArray(this._grid.items)) {
      this.__withFilteredItemsArray((items) => {
        if (!this._grid.selectedItems.length) {
          this.selectAll = false;
          this.__indeterminate = false;
        } else if (this.__arrayContains(this._grid.selectedItems, items)) {
          this.selectAll = true;
          this.__indeterminate = false;
        } else {
          this.selectAll = false;
          this.__indeterminate = true;
        }
      });
    }
    this._selectAllChangeLock = false;
  }

  /** @private */
  __onDataProviderChanged() {
    this.__selectAllHidden = !Array.isArray(this._grid.items);
  }

  /**
   * Assuming the grid uses an items array data provider, fetches all the filtered items
   * from the data provider and invokes the callback with the resulting array.
   *
   * @private
   */
  __withFilteredItemsArray(callback) {
    const params = {
      page: 0,
      pageSize: Infinity,
      sortOrders: [],
      filters: this._grid._mapFilters()
    };
    this._grid.dataProvider(params, (items) => callback(items));
  }
}

customElements.define(GridSelectionColumn.is, GridSelectionColumn);

registerStyles(
  'vaadin-grid-sorter',
  r`
    :host {
      justify-content: flex-start;
      align-items: baseline;
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
      cursor: var(--lumo-clickable-cursor);
    }

    [part='content'] {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    [part='indicators'] {
      margin-left: var(--lumo-space-s);
    }

    [part='indicators']::before {
      transform: scale(0.8);
    }

    :host(:not([direction]):not(:hover)) [part='indicators'] {
      color: var(--lumo-tertiary-text-color);
    }

    :host([direction]) {
      color: var(--lumo-primary-text-color);
    }

    [part='order'] {
      font-size: var(--lumo-font-size-xxs);
      line-height: 1;
    }

    /* RTL specific styles */

    :host([dir='rtl']) [part='indicators'] {
      margin-right: var(--lumo-space-s);
      margin-left: 0;
    }
  `,
  { moduleId: 'lumo-grid-sorter' }
);

/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const $_documentContainer$1 = document.createElement('template');

$_documentContainer$1.innerHTML = `
  <style>
    @font-face {
      font-family: 'vaadin-grid-sorter-icons';
      src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAQwAA0AAAAABuwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAAEFAAAABkAAAAcfep+mUdERUYAAAP4AAAAHAAAAB4AJwAOT1MvMgAAAZgAAAA/AAAAYA8TBPpjbWFwAAAB7AAAAFUAAAFeF1fZ4mdhc3AAAAPwAAAACAAAAAgAAAAQZ2x5ZgAAAlgAAABcAAAAnMvguMloZWFkAAABMAAAAC8AAAA2C5Ap72hoZWEAAAFgAAAAHQAAACQGbQPHaG10eAAAAdgAAAAUAAAAHAoAAABsb2NhAAACRAAAABIAAAASAIwAYG1heHAAAAGAAAAAFgAAACAACwAKbmFtZQAAArQAAAECAAACZxWCgKhwb3N0AAADuAAAADUAAABZCrApUXicY2BkYGAA4rDECVrx/DZfGbhZGEDgyqNPOxH0/wNMq5kPALkcDEwgUQBWRA0dAHicY2BkYGA+8P8AAwMLAwgwrWZgZEAFbABY4QM8AAAAeJxjYGRgYOAAQiYGEICQSAAAAi8AFgAAeJxjYGY6yziBgZWBgWkm0xkGBoZ+CM34msGYkZMBFTAKoAkwODAwvmRiPvD/AIMDMxCD1CDJKjAwAgBktQsXAHicY2GAAMZQCM0EwqshbAALxAEKeJxjYGBgZoBgGQZGBhCIAPIYwXwWBhsgzcXAwcAEhIwMCi+Z/v/9/x+sSuElA4T9/4k4K1gHFwMMMILMY2QDYmaoABOQYGJABUA7WBiGNwAAJd4NIQAAAAAAAAAACAAIABAAGAAmAEAATgAAeJyNjLENgDAMBP9tIURJwQCMQccSZgk2i5fIYBDAidJjycXr7x5EPwE2wY8si7jmyBNXGo/bNBerxJNrpxhbO3/fEFpx8ZICpV+ghxJ74fAMe+h7Ox14AbrsHB14nK2QQWrDMBRER4mTkhQK3ZRQKOgCNk7oGQqhhEIX2WSlWEI1BAlkJ5CDdNsj5Ey9Rncdi38ES+jzNJo/HwTgATcoDEthhY3wBHc4CE+pfwsX5F/hGe7Vo/AcK/UhvMSz+mGXKhZU6pww8ISz3oWn1BvhgnwTnuEJf8Jz1OpFeIlX9YULDLdFi4ASHolkSR0iuYdjLak1vAequBhj21D61Nqyi6l3qWybGPjySbPHGScGJl6dP58MYcQRI0bts7mjebBqrFENH7t3qWtj0OuqHnXcW7b0HOTZFnKryRGW2hFX1m0O2vEM3opNMfTau+CS6Z3Vx6veNnEXY6jwDxhsc2gAAHicY2BiwA84GBgYmRiYGJkZmBlZGFkZ2djScyoLMgzZS/MyDQwMwLSrpYEBlIbxjQDrzgsuAAAAAAEAAf//AA94nGNgZGBg4AFiMSBmYmAEQnYgZgHzGAAD6wA2eJxjYGBgZACCKyoz1cD0o087YTQATOcIewAAAA==) format('woff');
      font-weight: normal;
      font-style: normal;
    }
  </style>
`;

document.head.appendChild($_documentContainer$1.content);

/**
 * `<vaadin-grid-sorter>` is a helper element for the `<vaadin-grid>` that provides out-of-the-box UI controls,
 * visual feedback, and handlers for sorting the grid data.
 *
 * #### Example:
 * ```html
 * <vaadin-grid-column id="column"></vaadin-grid-column>
 * ```
 * ```js
 * const column = document.querySelector('#column');
 * column.renderer = (root, column, model) => {
 *   let sorter = root.firstElementChild;
 *   if (!sorter) {
 *     sorter = document.createElement('vaadin-grid-sorter');
 *     root.appendChild(sorter);
 *   }
 *   sorter.path = 'name.first';
 * };
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------------|----------------
 * `content` | The slotted content wrapper
 * `indicators` | The internal sorter indicators.
 * `order` | The internal sorter order
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description | Part name
 * -------------|-------------|------------
 * `direction` | Sort direction of a sorter | :host
 *
 * @fires {CustomEvent} direction-changed - Fired when the `direction` property changes.
 * @fires {CustomEvent} sorter-changed - Fired when the `path` or `direction` property changes.
 *
 * @extends HTMLElement
 */
class GridSorter extends ThemableMixin(DirMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: inline-flex;
          cursor: pointer;
          max-width: 100%;
        }

        [part='content'] {
          flex: 1 1 auto;
        }

        [part='indicators'] {
          position: relative;
          align-self: center;
          flex: none;
        }

        [part='order'] {
          display: inline;
          vertical-align: super;
        }

        [part='indicators']::before {
          font-family: 'vaadin-grid-sorter-icons';
          display: inline-block;
        }

        :host(:not([direction])) [part='indicators']::before {
          content: '\\e901';
        }

        :host([direction='asc']) [part='indicators']::before {
          content: '\\e900';
        }

        :host([direction='desc']) [part='indicators']::before {
          content: '\\e902';
        }
      </style>

      <div part="content">
        <slot></slot>
      </div>
      <div part="indicators">
        <span part="order">[[_getDisplayOrder(_order)]]</span>
      </div>
    `;
  }

  static get is() {
    return 'vaadin-grid-sorter';
  }

  static get properties() {
    return {
      /**
       * JS Path of the property in the item used for sorting the data.
       */
      path: String,

      /**
       * How to sort the data.
       * Possible values are `asc` to use an ascending algorithm, `desc` to sort the data in
       * descending direction, or `null` for not sorting the data.
       * @type {GridSorterDirection | undefined}
       */
      direction: {
        type: String,
        reflectToAttribute: true,
        notify: true,
        value: null
      },

      /**
       * @type {number | null}
       * @protected
       */
      _order: {
        type: Number,
        value: null
      },

      /** @private */
      _isConnected: {
        type: Boolean,
        observer: '__isConnectedChanged'
      }
    };
  }

  static get observers() {
    return ['_pathOrDirectionChanged(path, direction)'];
  }

  /** @protected */
  ready() {
    super.ready();
    this.addEventListener('click', this._onClick.bind(this));
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();
    this._isConnected = true;
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();
    this._isConnected = false;
  }

  /** @private */
  _pathOrDirectionChanged() {
    this.__dispatchSorterChangedEvenIfPossible();
  }

  /** @private */
  __isConnectedChanged(newValue, oldValue) {
    if (oldValue === false) {
      return;
    }

    this.__dispatchSorterChangedEvenIfPossible();
  }

  /** @private */
  __dispatchSorterChangedEvenIfPossible() {
    if (this.path === undefined || this.direction === undefined || !this._isConnected) {
      return;
    }

    this.dispatchEvent(new CustomEvent('sorter-changed', { bubbles: true, composed: true }));
  }

  /** @private */
  _getDisplayOrder(order) {
    return order === null ? '' : order + 1;
  }

  /** @private */
  _onClick(e) {
    const activeElement = this.getRootNode().activeElement;
    if (this !== activeElement && this.contains(activeElement)) {
      // Some focusable content inside the sorter was clicked, do nothing.
      return;
    }

    e.preventDefault();
    if (this.direction === 'asc') {
      this.direction = 'desc';
    } else if (this.direction === 'desc') {
      this.direction = null;
    } else {
      this.direction = 'asc';
    }
  }
}

customElements.define(GridSorter.is, GridSorter);

/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * `<vaadin-grid-sort-column>` is a helper element for the `<vaadin-grid>`
 * that provides default header renderer and functionality for sorting.
 *
 * #### Example:
 * ```html
 * <vaadin-grid items="[[items]]">
 *  <vaadin-grid-sort-column path="name.first" direction="asc"></vaadin-grid-sort-column>
 *
 *  <vaadin-grid-column>
 *    ...
 * ```
 *
 * @fires {CustomEvent} direction-changed - Fired when the `direction` property changes.
 */
class GridSortColumn extends GridColumn {
  static get is() {
    return 'vaadin-grid-sort-column';
  }

  static get properties() {
    return {
      /**
       * JS Path of the property in the item used for sorting the data.
       */
      path: String,

      /**
       * How to sort the data.
       * Possible values are `asc` to use an ascending algorithm, `desc` to sort the data in
       * descending direction, or `null` for not sorting the data.
       * @type {GridSorterDirection | undefined}
       */
      direction: {
        type: String,
        notify: true
      }
    };
  }

  static get observers() {
    return ['_onHeaderRendererOrBindingChanged(_headerRenderer, _headerCell, path, header, direction)'];
  }

  constructor() {
    super();

    this.__boundOnDirectionChanged = this.__onDirectionChanged.bind(this);
  }

  /**
   * Renders the grid sorter to the header cell.
   *
   * @override
   */
  _defaultHeaderRenderer(root, _column) {
    let sorter = root.firstElementChild;
    if (!sorter) {
      sorter = document.createElement('vaadin-grid-sorter');
      sorter.addEventListener('direction-changed', this.__boundOnDirectionChanged);
      root.appendChild(sorter);
    }

    sorter.path = this.path;
    sorter.__rendererDirection = this.direction;
    sorter.direction = this.direction;
    sorter.textContent = this.__getHeader(this.header, this.path);
  }

  /**
   * The sort column doesn't allow to use a custom header renderer
   * to override the header cell content.
   * It always renders the grid sorter to the header cell.
   *
   * @override
   */
  _computeHeaderRenderer() {
    return this._defaultHeaderRenderer;
  }

  /**
   * Updates the sorting direction once the grid sorter's direction is changed.
   * The listener handles only user-fired events.
   *
   * @private
   */
  __onDirectionChanged(e) {
    // Skip if the direction is changed by the renderer.
    if (e.detail.value === e.target.__rendererDirection) {
      return;
    }

    this.direction = e.detail.value;
  }

  /** @private */
  __getHeader(header, path) {
    if (header) {
      return header;
    }

    if (path) {
      return this._generateHeader(path);
    }
  }
}

customElements.define(GridSortColumn.is, GridSortColumn);

registerStyles(
  'vaadin-grid-tree-toggle',
  r`
    :host {
      --vaadin-grid-tree-toggle-level-offset: 2em;
      align-items: center;
      vertical-align: middle;
      margin-left: calc(var(--lumo-space-s) * -1);
      -webkit-tap-highlight-color: transparent;
    }

    :host(:not([leaf])) {
      cursor: default;
    }

    [part='toggle'] {
      display: inline-block;
      font-size: 1.5em;
      line-height: 1;
      width: 1em;
      height: 1em;
      text-align: center;
      color: var(--lumo-contrast-50pct);
      cursor: var(--lumo-clickable-cursor);
      /* Increase touch target area */
      padding: calc(1em / 3);
      margin: calc(1em / -3);
    }

    :host(:not([dir='rtl'])) [part='toggle'] {
      margin-right: 0;
    }

    @media (hover: hover) {
      :host(:hover) [part='toggle'] {
        color: var(--lumo-contrast-80pct);
      }
    }

    [part='toggle']::before {
      font-family: 'lumo-icons';
      display: inline-block;
      height: 100%;
    }

    :host(:not([expanded])) [part='toggle']::before {
      content: var(--lumo-icons-angle-right);
    }

    :host([expanded]) [part='toggle']::before {
      content: var(--lumo-icons-angle-right);
      transform: rotate(90deg);
    }

    /* Experimental support for hierarchy connectors, using an unsupported selector */
    :host([theme~='connectors']) #level-spacer {
      position: relative;
      z-index: -1;
      font-size: 1em;
      height: 1.5em;
    }

    :host([theme~='connectors']) #level-spacer::before {
      display: block;
      content: '';
      margin-top: calc(var(--lumo-space-m) * -1);
      height: calc(var(--lumo-space-m) + 3em);
      background-image: linear-gradient(
        to right,
        transparent calc(var(--vaadin-grid-tree-toggle-level-offset) - 1px),
        var(--lumo-contrast-10pct) calc(var(--vaadin-grid-tree-toggle-level-offset) - 1px)
      );
      background-size: var(--vaadin-grid-tree-toggle-level-offset) var(--vaadin-grid-tree-toggle-level-offset);
      background-position: calc(var(--vaadin-grid-tree-toggle-level-offset) / 2 - 2px) 0;
    }

    /* RTL specific styles */

    :host([dir='rtl']) {
      margin-left: 0;
      margin-right: calc(var(--lumo-space-s) * -1);
    }

    :host([dir='rtl']) [part='toggle'] {
      margin-left: 0;
    }

    :host([dir='rtl'][expanded]) [part='toggle']::before {
      transform: rotate(-90deg);
    }

    :host([dir='rtl'][theme~='connectors']) #level-spacer::before {
      background-image: linear-gradient(
        to left,
        transparent calc(var(--vaadin-grid-tree-toggle-level-offset) - 1px),
        var(--lumo-contrast-10pct) calc(var(--vaadin-grid-tree-toggle-level-offset) - 1px)
      );
      background-position: calc(100% - (var(--vaadin-grid-tree-toggle-level-offset) / 2 - 2px)) 0;
    }

    :host([dir='rtl']:not([expanded])) [part='toggle']::before,
    :host([dir='rtl'][expanded]) [part='toggle']::before {
      content: var(--lumo-icons-angle-left);
    }
  `,
  { moduleId: 'lumo-grid-tree-toggle' }
);

/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `
  <style>
    @font-face {
      font-family: "vaadin-grid-tree-icons";
      src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAQkAA0AAAAABrwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAAECAAAABoAAAAcgHwa6EdERUYAAAPsAAAAHAAAAB4AJwAOT1MvMgAAAZQAAAA/AAAAYA8TBIJjbWFwAAAB8AAAAFUAAAFeGJvXWmdhc3AAAAPkAAAACAAAAAgAAAAQZ2x5ZgAAAlwAAABLAAAAhIrPOhFoZWFkAAABMAAAACsAAAA2DsJI02hoZWEAAAFcAAAAHQAAACQHAgPHaG10eAAAAdQAAAAZAAAAHAxVAgBsb2NhAAACSAAAABIAAAASAIAAVG1heHAAAAF8AAAAGAAAACAACgAFbmFtZQAAAqgAAAECAAACTwflzbdwb3N0AAADrAAAADYAAABZQ7Ajh3icY2BkYGAA4twv3Vfi+W2+MnCzMIDANSOmbGSa2YEZRHEwMIEoAAoiB6sAeJxjYGRgYD7w/wADAwsDCDA7MDAyoAI2AFEEAtIAAAB4nGNgZGBg4GBgZgDRDAxMDGgAAAGbABB4nGNgZp7JOIGBlYGBaSbTGQYGhn4IzfiawZiRkwEVMAqgCTA4MDA+38d84P8BBgdmIAapQZJVYGAEAGc/C54AeJxjYYAAxlAIzQTELAwMBxgZGB0ACy0BYwAAAHicY2BgYGaAYBkGRgYQiADyGMF8FgYbIM3FwMHABISMDArP9/3/+/8/WJXC8z0Q9v8nEp5gHVwMMMAIMo+RDYiZoQJMQIKJARUA7WBhGN4AACFKDtoAAAAAAAAAAAgACAAQABgAJgA0AEIAAHichYvBEYBADAKBVHBjBT4swl9KS2k05o0XHd/yW1hAfBFwCv9sIlJu3nZaNS3PXAaXXHI8Lge7DlzF7C1RgXc7xkK6+gvcD2URmQB4nK2RQWoCMRiFX3RUqtCli65yADModOMBLLgQSqHddRFnQghIAnEUvEA3vUUP0LP0Fj1G+yb8R5iEhO9/ef/7FwFwj28o9EthiVp4hBlehcfUP4Ur8o/wBAv8CU+xVFvhOR7UB7tUdUdlVRJ6HnHWTnhM/V24In8JT5j/KzzFSi2E53hUz7jCcrcIiDDwyKSW1JEct2HdIPH1DFytbUM0PofWdNk5E5oUqb/Q6HHBiVGZpfOXkyUMEj5IyBuNmYZQjBobfsuassvnkKLe1OuBBj0VQ8cRni2xjLWsHaM0jrjx3peYA0/vrdmUYqe9iy7bzrX6eNP7Jh1SijX+AaUVbB8AAHicY2BiwA84GBgYmRiYGJkZmBlZGFkZ2djScyoLMgzZS/MyDQwMwLSruZMzlHaB0q4A76kLlwAAAAEAAf//AA94nGNgZGBg4AFiMSBmYmAEQnYgZgHzGAAD6wA2eJxjYGBgZACCKxJigiD6mhFTNowGACmcA/8AAA==) format('woff');
      font-weight: normal;
      font-style: normal;
    }
  </style>
`;

document.head.appendChild($_documentContainer.content);

/**
 * `<vaadin-grid-tree-toggle>` is a helper element for the `<vaadin-grid>`
 * that provides toggle and level display functionality for the item tree.
 *
 * #### Example:
 * ```html
 * <vaadin-grid-column id="column"></vaadin-grid-column>
 * ```
 * ```js
 * const column = document.querySelector('#column');
 * column.renderer = (root, column, model) => {
 *   let treeToggle = root.firstElementChild;
 *   if (!treeToggle) {
 *     treeToggle = document.createElement('vaadin-grid-tree-toggle');
 *     treeToggle.addEventListener('expanded-changed', () => { ... });
 *     root.appendChild(treeToggle);
 *   }
 *   treeToggle.leaf = !model.item.hasChildren;
 *   treeToggle.level = level;
 *   treeToggle.expanded = expanded;
 *   treeToggle.textContent = model.item.name;
 * };
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ---|---
 * `toggle` | The tree toggle icon
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description | Part name
 * ---|---|---
 * `expanded` | When present, the toggle is expanded | :host
 * `leaf` | When present, the toggle is not expandable, i. e., the current item is a leaf | :host
 *
 * The following custom CSS properties are available on
 * the `<vaadin-grid-tree-toggle>` element:
 *
 * Custom CSS property | Description | Default
 * ---|---|---
 * `--vaadin-grid-tree-toggle-level-offset` | Visual offset step for each tree sublevel | `1em`
 *
 * @fires {CustomEvent} expanded-changed - Fired when the `expanded` property changes.
 *
 * @extends HTMLElement
 * @mixes ThemableMixin
 */
class GridTreeToggle extends ThemableMixin(DirMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: inline-flex;
          align-items: baseline;

          /* CSS API for :host */
          --vaadin-grid-tree-toggle-level-offset: 1em;
          --_collapsed-icon: '\\e7be\\00a0';
        }

        :host([dir='rtl']) {
          --_collapsed-icon: '\\e7bd\\00a0';
        }

        :host([hidden]) {
          display: none !important;
        }

        :host(:not([leaf])) {
          cursor: pointer;
        }

        #level-spacer,
        [part='toggle'] {
          flex: none;
        }

        #level-spacer {
          display: inline-block;
          width: calc(var(---level, '0') * var(--vaadin-grid-tree-toggle-level-offset));
        }

        [part='toggle']::before {
          font-family: 'vaadin-grid-tree-icons';
          line-height: 1em; /* make icon font metrics not affect baseline */
        }

        :host(:not([expanded])) [part='toggle']::before {
          content: var(--_collapsed-icon);
        }

        :host([expanded]) [part='toggle']::before {
          content: '\\e7bc\\00a0'; /* icon glyph + single non-breaking space */
        }

        :host([leaf]) [part='toggle'] {
          visibility: hidden;
        }
      </style>

      <span id="level-spacer"></span>
      <span part="toggle"></span>
      <slot></slot>
    `;
  }

  static get is() {
    return 'vaadin-grid-tree-toggle';
  }

  static get properties() {
    return {
      /**
       * Current level of the tree represented with a horizontal offset
       * of the toggle button.
       * @type {number}
       */
      level: {
        type: Number,
        value: 0,
        observer: '_levelChanged'
      },

      /**
       * Hides the toggle icon and disables toggling a tree sublevel.
       * @type {boolean}
       */
      leaf: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * Sublevel toggle state.
       * @type {boolean}
       */
      expanded: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        notify: true
      }
    };
  }

  /** @protected */
  ready() {
    super.ready();

    this.addEventListener('click', (e) => this._onClick(e));
  }

  /** @private */
  _onClick(e) {
    if (this.leaf) {
      return;
    }
    if (isFocusable(e.target)) {
      return;
    }

    e.preventDefault();
    this.expanded = !this.expanded;
  }

  /** @private */
  _levelChanged(level) {
    const value = Number(level).toString();
    this.style.setProperty('---level', value);
  }
}

customElements.define(GridTreeToggle.is, GridTreeToggle);

/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

/**
 * `<vaadin-grid-tree-column>` is a helper element for the `<vaadin-grid>`
 * that provides default renderer and functionality for toggling tree/hierarchical items.
 *
 * #### Example:
 * ```html
 * <vaadin-grid items="[[items]]">
 *  <vaadin-grid-tree-column path="name.first"></vaadin-grid-tree-column>
 *
 *  <vaadin-grid-column>
 *    ...
 * ```
 */
class GridTreeColumn extends GridColumn {
  static get is() {
    return 'vaadin-grid-tree-column';
  }

  static get properties() {
    return {
      /**
       * JS Path of the property in the item used as text content for the tree toggle.
       */
      path: String,

      /**
       * JS Path of the property in the item that indicates whether the item has child items.
       * @attr {string} item-has-children-path
       */
      itemHasChildrenPath: {
        type: String,
        value: 'children'
      }
    };
  }

  static get observers() {
    return ['_onRendererOrBindingChanged(_renderer, _cells, _cells.*, path, itemHasChildrenPath)'];
  }

  constructor() {
    super();

    this.__boundOnExpandedChanged = this.__onExpandedChanged.bind(this);
  }

  /**
   * Renders the grid tree toggle to the body cell
   *
   * @private
   */
  __defaultRenderer(root, _column, { item, expanded, level }) {
    let toggle = root.firstElementChild;
    if (!toggle) {
      toggle = document.createElement('vaadin-grid-tree-toggle');
      toggle.addEventListener('expanded-changed', this.__boundOnExpandedChanged);
      root.appendChild(toggle);
    }

    toggle.__item = item;
    toggle.__rendererExpanded = expanded;
    toggle.expanded = expanded;
    toggle.leaf = this.__isLeafItem(item, this.itemHasChildrenPath);
    toggle.textContent = this.__getToggleContent(this.path, item);
    toggle.level = level;
  }

  /**
   * The tree column doesn't allow to use a custom renderer
   * to override the content of body cells.
   * It always renders the grid tree toggle to body cells.
   *
   * @override
   */
  _computeRenderer() {
    return this.__defaultRenderer;
  }

  /**
   * Expands or collapses the row once the tree toggle is switched.
   * The listener handles only user-fired events.
   *
   * @private
   */
  __onExpandedChanged(e) {
    // Skip if the state is changed by the renderer.
    if (e.detail.value === e.target.__rendererExpanded) {
      return;
    }

    if (e.detail.value) {
      this._grid.expandItem(e.target.__item);
    } else {
      this._grid.collapseItem(e.target.__item);
    }
  }

  /** @private */
  __isLeafItem(item, itemHasChildrenPath) {
    return !item || !item[itemHasChildrenPath];
  }

  /** @private */
  __getToggleContent(path, item) {
    return path && this.get(path, item);
  }
}

customElements.define(GridTreeColumn.is, GridTreeColumn);

class MLBGrid extends s$1 {
  static properties = {
    items: {type:Object},
  };
  // Define scoped styles right with your component, in plain CSS
  static styles = r`
  `;

  constructor() {
    super();
    // Declare reactive properties
    this.items = [];
  }

  // Render the UI as a function of component state
  render() {
    return $`
    <vaadin-grid .items="${this.items}" theme="row-stripes" column-reordering-allowed multi-sort>
        <vaadin-grid-selection-column auto-select></vaadin-grid-selection-column>
        <vaadin-grid-sort-column width="5em" path="yearId" header="Year"></vaadin-grid-sort-column>
        <vaadin-grid-sort-column width="9em" path="METADATA.TITLE" header="Title"></vaadin-grid-sort-column>
        <vaadin-grid-sort-column width="9em" flex-grow="2" path="METADATA.AUTHOR" header="Author"></vaadin-grid-column>
    </vaadin-grid>    
    `;
  }
}
customElements.define('mlb-grid', MLBGrid);

export { MLBGrid };
