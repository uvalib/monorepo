import{_ as t,n as e}from"../../query-assigned-elements-8ef6cca7.js";import{o,i as n,s as i,x as s}from"../../lit-element-9e1ac43c.js";
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class r extends HTMLElement{static get version(){return"24.0.0"}}customElements.define("vaadin-lumo-styles",r);
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const a=t=>class extends t{static get properties(){return{_theme:{type:String,readOnly:!0}}}static get observedAttributes(){return[...super.observedAttributes,"theme"]}attributeChangedCallback(t,e,o){super.attributeChangedCallback(t,e,o),"theme"===t&&this._set_theme(o)}}
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,l=[];function d(t){return t&&Object.prototype.hasOwnProperty.call(t,"__themes")}function c(t,e,n={}){var i;t&&(i=t,d(customElements.get(i))&&console.warn(`The custom element definition for "${t}"\n      was finalized before a style module was registered.\n      Make sure to add component specific style modules before\n      importing the corresponding custom element.`)),e=function(t=[]){return[t].flat(1/0).filter((t=>t instanceof o||(console.warn("An item in styles is not of type CSSResult. Use `unsafeCSS` or `css`."),!1)))}(e),window.Vaadin&&window.Vaadin.styleModules?window.Vaadin.styleModules.registerStyles(t,e,n):l.push({themeFor:t,styles:e,include:n.include,moduleId:n.moduleId})}function h(){return window.Vaadin&&window.Vaadin.styleModules?window.Vaadin.styleModules.getAllThemes():l}function u(t=""){let e=0;return t.startsWith("lumo-")||t.startsWith("material-")?e=1:t.startsWith("vaadin-")&&(e=2),e}function m(t){const e=[];return t.include&&[].concat(t.include).forEach((t=>{const o=h().find((e=>e.moduleId===t));o?e.push(...m(o),...o.styles):console.warn(`Included moduleId ${t} not found in style registry`)}),t.styles),e}function p(t){const e=`${t}-default-theme`,o=h().filter((o=>o.moduleId!==e&&function(t,e){return(t||"").split(" ").some((t=>new RegExp(`^${t.split("*").join(".*")}$`,"u").test(e)))}(o.themeFor,t))).map((t=>({...t,styles:[...m(t),...t.styles],includePriority:u(t.moduleId)}))).sort(((t,e)=>e.includePriority-t.includePriority));return o.length>0?o:h().filter((t=>t.moduleId===e))}const _=t=>class extends(a(t)){static finalize(){if(super.finalize(),this.elementStyles)return;const t=this.prototype._template;t&&!d(this)&&function(t,e){const o=document.createElement("style");o.innerHTML=t.map((t=>t.cssText)).join("\n"),e.content.appendChild(o)}(this.getStylesForThis(),t)}static finalizeStyles(t){const e=this.getStylesForThis();return t?[...super.finalizeStyles(t),...e]:e}static getStylesForThis(){const t=Object.getPrototypeOf(this.prototype),e=(t?t.constructor.__themes:[])||[];this.__themes=[...e,...p(this.is)];const o=this.__themes.flatMap((t=>t.styles));return o.filter(((t,e)=>e===o.lastIndexOf(t)))}}
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,f=n`
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
`,v=document.createElement("template");v.innerHTML=`<style>${f.toString().replace(":host","html")}</style>`,document.head.appendChild(v.content);c("",n`
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
`,{moduleId:"lumo-color"});
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const y=n`
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
`,g=document.createElement("template");g.innerHTML=`<style>${y.toString().replace(":host","html")}</style>`,document.head.appendChild(g.content);
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const b=n`
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
`,w=document.createElement("template");w.innerHTML=`<style>${b.toString().replace(":host","html")}</style>`,document.head.appendChild(w.content);
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const x=n`
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
`;n`
  html {
    --vaadin-checkbox-size: calc(var(--lumo-size-m) / 2);
    --vaadin-radio-button-size: calc(var(--lumo-size-m) / 2);
    --vaadin-input-field-border-radius: var(--lumo-border-radius-m);
  }
`;const A=document.createElement("template");A.innerHTML=`<style>${x.toString().replace(":host","html")}$</style>`,document.head.appendChild(A.content);
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const C=n`
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
`;c("",n`
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
`,{moduleId:"lumo-typography"});const P=document.createElement("template");P.innerHTML=`<style>${C.toString().replace(":host","html")}</style>`,document.head.appendChild(P.content);const E=n`
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
`;c("vaadin-button",E,{moduleId:"lumo-button"});c("vaadin-menu-bar-button",[E,n`
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
`],{moduleId:"lumo-menu-bar-button"}),
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
window.JSCompiler_renameProperty=function(t,e){return t};
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
let O,T,S=/(url\()([^)]*)(\))/g,k=/(^\/[^\/])|(^#)|(^[\w-\d]*:)/;function N(t,e){if(t&&k.test(t))return t;if("//"===t)return t;if(void 0===O){O=!1;try{const t=new URL("b","http://a");t.pathname="c%20d",O="http://a/c%20d"===t.href}catch(t){}}if(e||(e=document.baseURI||window.location.href),O)try{return new URL(t,e).href}catch(e){return t}return T||(T=document.implementation.createHTMLDocument("temp"),T.base=T.createElement("base"),T.head.appendChild(T.base),T.anchor=T.createElement("a"),T.body.appendChild(T.anchor)),T.base.href=e,T.anchor.href=t,T.anchor.href||t}function L(t,e){return t.replace(S,(function(t,o,n,i){return o+"'"+N(n.replace(/["']/g,""),e)+"'"+i}))}function M(t){return t.substring(0,t.lastIndexOf("/")+1)}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/const I=!window.ShadyDOM||!window.ShadyDOM.inUse;Boolean(!window.ShadyCSS||window.ShadyCSS.nativeCss);const z=I&&"adoptedStyleSheets"in Document.prototype&&"replaceSync"in CSSStyleSheet.prototype&&(()=>{try{const t=new CSSStyleSheet;t.replaceSync("");const e=document.createElement("div");return e.attachShadow({mode:"open"}),e.shadowRoot.adoptedStyleSheets=[t],e.shadowRoot.adoptedStyleSheets[0]===t}catch(t){return!1}})();let D=window.Polymer&&window.Polymer.rootPath||M(document.baseURI||window.location.href),R=window.Polymer&&window.Polymer.sanitizeDOMValue||void 0;window.Polymer&&window.Polymer.setPassiveTouchGestures;let B=window.Polymer&&window.Polymer.strictTemplatePolicy||!1,F=window.Polymer&&window.Polymer.allowTemplateFromDomModule||!1,H=window.Polymer&&window.Polymer.legacyOptimizations||!1,U=window.Polymer&&window.Polymer.legacyWarnings||!1,j=window.Polymer&&window.Polymer.syncInitialRender||!1,Y=window.Polymer&&window.Polymer.legacyUndefined||!1,q=window.Polymer&&window.Polymer.orderedComputed||!1,V=window.Polymer&&window.Polymer.removeNestedTemplates||!1,K=window.Polymer&&window.Polymer.fastDomIf||!1;window.Polymer&&window.Polymer.suppressTemplateNotifications,window.Polymer&&window.Polymer.legacyNoObservedAttributes;let W=window.Polymer&&window.Polymer.useAdoptedStyleSheetsWithBuiltCSS||!1,G=0;
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/const J=function(t){let e=t.__mixinApplications;e||(e=new WeakMap,t.__mixinApplications=e);let o=G++;return function(n){let i=n.__mixinSet;if(i&&i[o])return n;let s=e,r=s.get(n);if(!r){r=t(n),s.set(n,r);let e=Object.create(r.__mixinSet||i||null);e[o]=!0,r.__mixinSet=e}return r}};
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/let $={},X={};function Z(t,e){$[t]=X[t.toLowerCase()]=e}function Q(t){return $[t]||X[t.toLowerCase()]}class tt extends HTMLElement{static get observedAttributes(){return["id"]}static import(t,e){if(t){let o=Q(t);return o&&e?o.querySelector(e):o}return null}attributeChangedCallback(t,e,o,n){e!==o&&this.register()}get assetpath(){if(!this.__assetpath){const t=window.HTMLImports&&HTMLImports.importForElement?HTMLImports.importForElement(this)||document:this.ownerDocument,e=N(this.getAttribute("assetpath")||"",t.baseURI);this.__assetpath=M(e)}return this.__assetpath}register(t){if(t=t||this.id){if(B&&void 0!==Q(t))throw Z(t,null),new Error(`strictTemplatePolicy: dom-module ${t} re-registered`);this.id=t,Z(t,this),(e=this).querySelector("style")&&console.warn("dom-module %s has style outside template",e.id)}var e}}tt.prototype.modules=$,customElements.define("dom-module",tt);
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
const et="link[rel=import][type~=css]",ot="include",nt="shady-unscoped";function it(t){return tt.import(t)}function st(t){const e=L((t.body?t.body:t).textContent,t.baseURI),o=document.createElement("style");return o.textContent=e,o}function rt(t){const e=t.trim().split(/\s+/),o=[];for(let t=0;t<e.length;t++)o.push(...at(e[t]));return o}function at(t){const e=it(t);if(!e)return console.warn("Could not find style data in module named",t),[];if(void 0===e._styles){const t=[];t.push(...dt(e));const o=e.querySelector("template");o&&t.push(...lt(o,e.assetpath)),e._styles=t}return e._styles}function lt(t,e){if(!t._styles){const o=[],n=t.content.querySelectorAll("style");for(let t=0;t<n.length;t++){let i=n[t],s=i.getAttribute(ot);s&&o.push(...rt(s).filter((function(t,e,o){return o.indexOf(t)===e}))),e&&(i.textContent=L(i.textContent,e)),o.push(i)}t._styles=o}return t._styles}function dt(t){const e=[],o=t.querySelectorAll(et);for(let t=0;t<o.length;t++){let n=o[t];if(n.import){const t=n.import,o=n.hasAttribute(nt);if(o&&!t._unscopedStyle){const e=st(t);e.setAttribute(nt,""),t._unscopedStyle=e}else t._style||(t._style=st(t));e.push(o?t._unscopedStyle:t._style)}}return e}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/const ct=window.ShadyDOM&&window.ShadyDOM.noPatch&&window.ShadyDOM.wrap?window.ShadyDOM.wrap:window.ShadyDOM?t=>ShadyDOM.patch(t):t=>t;
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/function ht(t){return t.indexOf(".")>=0}function ut(t){let e=t.indexOf(".");return-1===e?t:t.slice(0,e)}function mt(t,e){return 0===e.indexOf(t+".")}function pt(t,e,o){return e+o.slice(t.length)}function _t(t){if(Array.isArray(t)){let e=[];for(let o=0;o<t.length;o++){let n=t[o].toString().split(".");for(let t=0;t<n.length;t++)e.push(n[t])}return e.join(".")}return t}function ft(t){return Array.isArray(t)?_t(t).split("."):t.toString().split(".")}function vt(t,e,o){let n=t,i=ft(e);for(let t=0;t<i.length;t++){if(!n)return;n=n[i[t]]}return o&&(o.path=i.join(".")),n}function yt(t,e,o){let n=t,i=ft(e),s=i[i.length-1];if(i.length>1){for(let t=0;t<i.length-1;t++){if(n=n[i[t]],!n)return}n[s]=o}else n[e]=o;return i.join(".")}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/const gt={},bt=/-[a-z]/g,wt=/([A-Z])/g;function xt(t){return gt[t]||(gt[t]=t.indexOf("-")<0?t:t.replace(bt,(t=>t[1].toUpperCase())))}function At(t){return gt[t]||(gt[t]=t.replace(wt,"-$1").toLowerCase())}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/let Ct=0,Pt=0,Et=[],Ot=0,Tt=!1,St=document.createTextNode("");new window.MutationObserver((function(){Tt=!1;const t=Et.length;for(let e=0;e<t;e++){let t=Et[e];if(t)try{t()}catch(t){setTimeout((()=>{throw t}))}}Et.splice(0,t),Pt+=t})).observe(St,{characterData:!0});const kt={run:t=>(Tt||(Tt=!0,St.textContent=Ot++),Et.push(t),Ct++),cancel(t){const e=t-Pt;if(e>=0){if(!Et[e])throw new Error("invalid async handle: "+t);Et[e]=null}}},Nt=kt,Lt=J((t=>class extends t{static createProperties(t){const e=this.prototype;for(let o in t)o in e||e._createPropertyAccessor(o)}static attributeNameForProperty(t){return t.toLowerCase()}static typeForProperty(t){}_createPropertyAccessor(t,e){this._addPropertyToAttributeMap(t),this.hasOwnProperty(JSCompiler_renameProperty("__dataHasAccessor",this))||(this.__dataHasAccessor=Object.assign({},this.__dataHasAccessor)),this.__dataHasAccessor[t]||(this.__dataHasAccessor[t]=!0,this._definePropertyAccessor(t,e))}_addPropertyToAttributeMap(t){this.hasOwnProperty(JSCompiler_renameProperty("__dataAttributes",this))||(this.__dataAttributes=Object.assign({},this.__dataAttributes));let e=this.__dataAttributes[t];return e||(e=this.constructor.attributeNameForProperty(t),this.__dataAttributes[e]=t),e}_definePropertyAccessor(t,e){Object.defineProperty(this,t,{get(){return this.__data[t]},set:e?function(){}:function(e){this._setPendingProperty(t,e,!0)&&this._invalidateProperties()}})}constructor(){super(),this.__dataEnabled=!1,this.__dataReady=!1,this.__dataInvalid=!1,this.__data={},this.__dataPending=null,this.__dataOld=null,this.__dataInstanceProps=null,this.__dataCounter=0,this.__serializing=!1,this._initializeProperties()}ready(){this.__dataReady=!0,this._flushProperties()}_initializeProperties(){for(let t in this.__dataHasAccessor)this.hasOwnProperty(t)&&(this.__dataInstanceProps=this.__dataInstanceProps||{},this.__dataInstanceProps[t]=this[t],delete this[t])}_initializeInstanceProperties(t){Object.assign(this,t)}_setProperty(t,e){this._setPendingProperty(t,e)&&this._invalidateProperties()}_getProperty(t){return this.__data[t]}_setPendingProperty(t,e,o){let n=this.__data[t],i=this._shouldPropertyChange(t,e,n);return i&&(this.__dataPending||(this.__dataPending={},this.__dataOld={}),this.__dataOld&&!(t in this.__dataOld)&&(this.__dataOld[t]=n),this.__data[t]=e,this.__dataPending[t]=e),i}_isPropertyPending(t){return!(!this.__dataPending||!this.__dataPending.hasOwnProperty(t))}_invalidateProperties(){!this.__dataInvalid&&this.__dataReady&&(this.__dataInvalid=!0,Nt.run((()=>{this.__dataInvalid&&(this.__dataInvalid=!1,this._flushProperties())})))}_enableProperties(){this.__dataEnabled||(this.__dataEnabled=!0,this.__dataInstanceProps&&(this._initializeInstanceProperties(this.__dataInstanceProps),this.__dataInstanceProps=null),this.ready())}_flushProperties(){this.__dataCounter++;const t=this.__data,e=this.__dataPending,o=this.__dataOld;this._shouldPropertiesChange(t,e,o)&&(this.__dataPending=null,this.__dataOld=null,this._propertiesChanged(t,e,o)),this.__dataCounter--}_shouldPropertiesChange(t,e,o){return Boolean(e)}_propertiesChanged(t,e,o){}_shouldPropertyChange(t,e,o){return o!==e&&(o==o||e==e)}attributeChangedCallback(t,e,o,n){e!==o&&this._attributeToProperty(t,o),super.attributeChangedCallback&&super.attributeChangedCallback(t,e,o,n)}_attributeToProperty(t,e,o){if(!this.__serializing){const n=this.__dataAttributes,i=n&&n[t]||t;this[i]=this._deserializeValue(e,o||this.constructor.typeForProperty(i))}}_propertyToAttribute(t,e,o){this.__serializing=!0,o=arguments.length<3?this[t]:o,this._valueToNodeAttribute(this,o,e||this.constructor.attributeNameForProperty(t)),this.__serializing=!1}_valueToNodeAttribute(t,e,o){const n=this._serializeValue(e);"class"!==o&&"name"!==o&&"slot"!==o||(t=ct(t)),void 0===n?t.removeAttribute(o):t.setAttribute(o,""===n&&window.trustedTypes?window.trustedTypes.emptyScript:n)}_serializeValue(t){return"boolean"==typeof t?t?"":void 0:null!=t?t.toString():void 0}_deserializeValue(t,e){switch(e){case Boolean:return null!==t;case Number:return Number(t);default:return t}}})),Mt={};
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/let It=HTMLElement.prototype;for(;It;){let t=Object.getOwnPropertyNames(It);for(let e=0;e<t.length;e++)Mt[t[e]]=!0;It=Object.getPrototypeOf(It)}const zt=window.trustedTypes?t=>trustedTypes.isHTML(t)||trustedTypes.isScript(t)||trustedTypes.isScriptURL(t):()=>!1;const Dt=J((t=>{const e=Lt(t);return class extends e{static createPropertiesForAttributes(){let t=this.observedAttributes;for(let e=0;e<t.length;e++)this.prototype._createPropertyAccessor(xt(t[e]))}static attributeNameForProperty(t){return At(t)}_initializeProperties(){this.__dataProto&&(this._initializeProtoProperties(this.__dataProto),this.__dataProto=null),super._initializeProperties()}_initializeProtoProperties(t){for(let e in t)this._setProperty(e,t[e])}_ensureAttribute(t,e){const o=this;o.hasAttribute(t)||this._valueToNodeAttribute(o,e,t)}_serializeValue(t){if("object"==typeof t){if(t instanceof Date)return t.toString();if(t){if(zt(t))return t;try{return JSON.stringify(t)}catch(t){return""}}}return super._serializeValue(t)}_deserializeValue(t,e){let o;switch(e){case Object:try{o=JSON.parse(t)}catch(e){o=t}break;case Array:try{o=JSON.parse(t)}catch(e){o=null,console.warn(`Polymer::Attributes: couldn't decode Array as JSON: ${t}`)}break;case Date:o=isNaN(t)?String(t):Number(t),o=new Date(o);break;default:o=super._deserializeValue(t,e)}return o}_definePropertyAccessor(t,e){!function(t,e){if(!Mt[e]){let o=t[e];void 0!==o&&(t.__data?t._setPendingProperty(e,o):(t.__dataProto?t.hasOwnProperty(JSCompiler_renameProperty("__dataProto",t))||(t.__dataProto=Object.create(t.__dataProto)):t.__dataProto={},t.__dataProto[e]=o))}}(this,t),super._definePropertyAccessor(t,e)}_hasAccessor(t){return this.__dataHasAccessor&&this.__dataHasAccessor[t]}_isPropertyPending(t){return Boolean(this.__dataPending&&t in this.__dataPending)}}})),Rt={"dom-if":!0,"dom-repeat":!0};
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/let Bt=!1,Ft=!1;function Ht(t){(function(){if(!Bt){Bt=!0;const t=document.createElement("textarea");t.placeholder="a",Ft=t.placeholder===t.textContent}return Ft})()&&"textarea"===t.localName&&t.placeholder&&t.placeholder===t.textContent&&(t.textContent=null)}const Ut=(()=>{const t=window.trustedTypes&&window.trustedTypes.createPolicy("polymer-template-event-attribute-policy",{createScript:t=>t});return(e,o,n)=>{const i=o.getAttribute(n);t&&n.startsWith("on-")?e.setAttribute(n,t.createScript(i,n)):e.setAttribute(n,i)}})();function jt(t){let e=t.getAttribute("is");if(e&&Rt[e]){let o=t;for(o.removeAttribute("is"),t=o.ownerDocument.createElement(e),o.parentNode.replaceChild(t,o),t.appendChild(o);o.attributes.length;){const{name:e}=o.attributes[0];Ut(t,o,e),o.removeAttribute(e)}}return t}function Yt(t,e){let o=e.parentInfo&&Yt(t,e.parentInfo);if(!o)return t;for(let t=o.firstChild,n=0;t;t=t.nextSibling)if(e.parentIndex===n++)return t}function qt(t,e,o,n){n.id&&(e[n.id]=o)}function Vt(t,e,o){if(o.events&&o.events.length)for(let n,i=0,s=o.events;i<s.length&&(n=s[i]);i++)t._addMethodEventListenerToNode(e,n.name,n.value,t)}function Kt(t,e,o,n){o.templateInfo&&(e._templateInfo=o.templateInfo,e._parentTemplateInfo=n)}const Wt=J((t=>class extends t{static _parseTemplate(t,e){if(!t._templateInfo){let o=t._templateInfo={};o.nodeInfoList=[],o.nestedTemplate=Boolean(e),o.stripWhiteSpace=e&&e.stripWhiteSpace||t.hasAttribute&&t.hasAttribute("strip-whitespace"),this._parseTemplateContent(t,o,{parent:null})}return t._templateInfo}static _parseTemplateContent(t,e,o){return this._parseTemplateNode(t.content,e,o)}static _parseTemplateNode(t,e,o){let n=!1,i=t;return"template"!=i.localName||i.hasAttribute("preserve-content")?"slot"===i.localName&&(e.hasInsertionPoint=!0):n=this._parseTemplateNestedTemplate(i,e,o)||n,Ht(i),i.firstChild&&this._parseTemplateChildNodes(i,e,o),i.hasAttributes&&i.hasAttributes()&&(n=this._parseTemplateNodeAttributes(i,e,o)||n),n||o.noted}static _parseTemplateChildNodes(t,e,o){if("script"!==t.localName&&"style"!==t.localName)for(let n,i=t.firstChild,s=0;i;i=n){if("template"==i.localName&&(i=jt(i)),n=i.nextSibling,i.nodeType===Node.TEXT_NODE){let o=n;for(;o&&o.nodeType===Node.TEXT_NODE;)i.textContent+=o.textContent,n=o.nextSibling,t.removeChild(o),o=n;if(e.stripWhiteSpace&&!i.textContent.trim()){t.removeChild(i);continue}}let r={parentIndex:s,parentInfo:o};this._parseTemplateNode(i,e,r)&&(r.infoIndex=e.nodeInfoList.push(r)-1),i.parentNode&&s++}}static _parseTemplateNestedTemplate(t,e,o){let n=t,i=this._parseTemplate(n,e);return(i.content=n.content.ownerDocument.createDocumentFragment()).appendChild(n.content),o.templateInfo=i,!0}static _parseTemplateNodeAttributes(t,e,o){let n=!1,i=Array.from(t.attributes);for(let s,r=i.length-1;s=i[r];r--)n=this._parseTemplateNodeAttribute(t,e,o,s.name,s.value)||n;return n}static _parseTemplateNodeAttribute(t,e,o,n,i){return"on-"===n.slice(0,3)?(t.removeAttribute(n),o.events=o.events||[],o.events.push({name:n.slice(3),value:i}),!0):"id"===n&&(o.id=i,!0)}static _contentForTemplate(t){let e=t._templateInfo;return e&&e.content||t.content}_stampTemplate(t,e){t&&!t.content&&window.HTMLTemplateElement&&HTMLTemplateElement.decorate&&HTMLTemplateElement.decorate(t);let o=(e=e||this.constructor._parseTemplate(t)).nodeInfoList,n=e.content||t.content,i=document.importNode(n,!0);i.__noInsertionPoint=!e.hasInsertionPoint;let s=i.nodeList=new Array(o.length);i.$={};for(let t,n=0,r=o.length;n<r&&(t=o[n]);n++){let o=s[n]=Yt(i,t);qt(0,i.$,o,t),Kt(0,o,t,e),Vt(this,o,t)}return i}_addMethodEventListenerToNode(t,e,o,n){let i=function(t,e,o){return t=t._methodHost||t,function(e){t[o]?t[o](e,e.detail):console.warn("listener method `"+o+"` not defined")}}(n=n||t,0,o);return this._addEventListenerToNode(t,e,i),i}_addEventListenerToNode(t,e,o){t.addEventListener(e,o)}_removeEventListenerFromNode(t,e,o){t.removeEventListener(e,o)}}));
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
 */let Gt=0;const Jt=[],$t={COMPUTE:"__computeEffects",REFLECT:"__reflectEffects",NOTIFY:"__notifyEffects",PROPAGATE:"__propagateEffects",OBSERVE:"__observeEffects",READ_ONLY:"__readOnly"},Xt="__computeInfo",Zt=/[A-Z]/;function Qt(t,e,o){let n=t[e];if(n){if(!t.hasOwnProperty(e)&&(n=t[e]=Object.create(t[e]),o))for(let t in n){let e=n[t],o=n[t]=Array(e.length);for(let t=0;t<e.length;t++)o[t]=e[t]}}else n=t[e]={};return n}function te(t,e,o,n,i,s){if(e){let r=!1;const a=Gt++;for(let l in o){let d=e[i?ut(l):l];if(d)for(let e,c=0,h=d.length;c<h&&(e=d[c]);c++)e.info&&e.info.lastRun===a||i&&!oe(l,e.trigger)||(e.info&&(e.info.lastRun=a),e.fn(t,l,o,n,e.info,i,s),r=!0)}return r}return!1}function ee(t,e,o,n,i,s,r,a){let l=!1,d=e[r?ut(n):n];if(d)for(let e,c=0,h=d.length;c<h&&(e=d[c]);c++)e.info&&e.info.lastRun===o||r&&!oe(n,e.trigger)||(e.info&&(e.info.lastRun=o),e.fn(t,n,i,s,e.info,r,a),l=!0);return l}function oe(t,e){if(e){let o=e.name;return o==t||!(!e.structured||!function(t,e){return 0===t.indexOf(e+".")}(o,t))||!(!e.wildcard||!mt(o,t))}return!0}function ne(t,e,o,n,i){let s="string"==typeof i.method?t[i.method]:i.method,r=i.property;s?s.call(t,t.__data[r],n[r]):i.dynamicFn||console.warn("observer method `"+i.method+"` not defined")}function ie(t,e,o){let n=ut(e);if(n!==e){return se(t,At(n)+"-changed",o[e],e),!0}return!1}function se(t,e,o,n){let i={value:o,queueProperty:!0};n&&(i.path=n),ct(t).dispatchEvent(new CustomEvent(e,{detail:i}))}function re(t,e,o,n,i,s){let r=(s?ut(e):e)!=e?e:null,a=r?vt(t,r):t.__data[e];r&&void 0===a&&(a=o[e]),se(t,i.eventName,a,r)}function ae(t,e,o,n,i){let s=t.__data[e];R&&(s=R(s,i.attrName,"attribute",t)),t._propertyToAttribute(e,i.attrName,s)}function le(t,e,o,n){let i=t[$t.COMPUTE];if(i)if(q){Gt++;const s=function(t){let e=t.constructor.__orderedComputedDeps;if(!e){e=new Map;const o=t[$t.COMPUTE];let n,{counts:i,ready:s,total:r}=function(t){const e=t[Xt],o={},n=t[$t.COMPUTE],i=[];let s=0;for(let t in e){const n=e[t];s+=o[t]=n.args.filter((t=>!t.literal)).length+(n.dynamicFn?1:0)}for(let t in n)e[t]||i.push(t);return{counts:o,ready:i,total:s}}(t);for(;n=s.shift();){e.set(n,e.size);const t=o[n];t&&t.forEach((t=>{const e=t.info.methodInfo;--r,0==--i[e]&&s.push(e)}))}if(0!==r){const e=t;console.warn(`Computed graph for ${e.localName} incomplete; circular?`)}t.constructor.__orderedComputedDeps=e}return e}(t),r=[];for(let t in e)ce(t,i,r,s,n);let a;for(;a=r.shift();)he(t,"",e,o,a)&&ce(a.methodInfo,i,r,s,n);Object.assign(o,t.__dataOld),Object.assign(e,t.__dataPending),t.__dataPending=null}else{let s=e;for(;te(t,i,s,o,n);)Object.assign(o,t.__dataOld),Object.assign(e,t.__dataPending),s=t.__dataPending,t.__dataPending=null}}const de=(t,e,o)=>{let n=0,i=e.length-1,s=-1;for(;n<=i;){const r=n+i>>1,a=o.get(e[r].methodInfo)-o.get(t.methodInfo);if(a<0)n=r+1;else{if(!(a>0)){s=r;break}i=r-1}}s<0&&(s=i+1),e.splice(s,0,t)},ce=(t,e,o,n,i)=>{const s=e[i?ut(t):t];if(s)for(let e=0;e<s.length;e++){const r=s[e];r.info.lastRun===Gt||i&&!oe(t,r.trigger)||(r.info.lastRun=Gt,de(r.info,o,n))}};function he(t,e,o,n,i){let s=ye(t,e,o,n,i);if(s===Jt)return!1;let r=i.methodInfo;return t.__dataHasAccessor&&t.__dataHasAccessor[r]?t._setPendingProperty(r,s,!0):(t[r]=s,!1)}function ue(t,e,o,n,i,s,r){o.bindings=o.bindings||[];let a={kind:n,target:i,parts:s,literal:r,isCompound:1!==s.length};if(o.bindings.push(a),function(t){return Boolean(t.target)&&"attribute"!=t.kind&&"text"!=t.kind&&!t.isCompound&&"{"===t.parts[0].mode}(a)){let{event:t,negate:e}=a.parts[0];a.listenerEvent=t||At(i)+"-changed",a.listenerNegate=e}let l=e.nodeInfoList.length;for(let o=0;o<a.parts.length;o++){let n=a.parts[o];n.compoundIndex=o,me(t,e,a,n,l)}}function me(t,e,o,n,i){if(!n.literal)if("attribute"===o.kind&&"-"===o.target[0])console.warn("Cannot set attribute "+o.target+' because "-" is not a valid attribute starting character');else{let s=n.dependencies,r={index:i,binding:o,part:n,evaluator:t};for(let o=0;o<s.length;o++){let n=s[o];"string"==typeof n&&(n=Pe(n),n.wildcard=!0),t._addTemplatePropertyEffect(e,n.rootProperty,{fn:pe,info:r,trigger:n})}}}function pe(t,e,o,n,i,s,r){let a=r[i.index],l=i.binding,d=i.part;if(s&&d.source&&e.length>d.source.length&&"property"==l.kind&&!l.isCompound&&a.__isPropertyEffectsClient&&a.__dataHasAccessor&&a.__dataHasAccessor[l.target]){let n=o[e];e=pt(d.source,l.target,e),a._setPendingPropertyOrPath(e,n,!1,!0)&&t._enqueueClient(a)}else{let r=i.evaluator._evaluateBinding(t,d,e,o,n,s);r!==Jt&&function(t,e,o,n,i){i=function(t,e,o,n){if(o.isCompound){let i=t.__dataCompoundStorage[o.target];i[n.compoundIndex]=e,e=i.join("")}"attribute"!==o.kind&&("textContent"!==o.target&&("value"!==o.target||"input"!==t.localName&&"textarea"!==t.localName)||(e=null==e?"":e));return e}(e,i,o,n),R&&(i=R(i,o.target,o.kind,e));if("attribute"==o.kind)t._valueToNodeAttribute(e,i,o.target);else{let n=o.target;e.__isPropertyEffectsClient&&e.__dataHasAccessor&&e.__dataHasAccessor[n]?e[$t.READ_ONLY]&&e[$t.READ_ONLY][n]||e._setPendingProperty(n,i)&&t._enqueueClient(e):t._setUnmanagedPropertyToNode(e,n,i)}}(t,a,l,d,r)}}function _e(t,e){if(e.isCompound){let o=t.__dataCompoundStorage||(t.__dataCompoundStorage={}),n=e.parts,i=new Array(n.length);for(let t=0;t<n.length;t++)i[t]=n[t].literal;let s=e.target;o[s]=i,e.literal&&"property"==e.kind&&("className"===s&&(t=ct(t)),t[s]=e.literal)}}function fe(t,e,o){if(o.listenerEvent){let n=o.parts[0];t.addEventListener(o.listenerEvent,(function(t){!function(t,e,o,n,i){let s,r=t.detail,a=r&&r.path;a?(n=pt(o,n,a),s=r&&r.value):s=t.currentTarget[o],s=i?!s:s,e[$t.READ_ONLY]&&e[$t.READ_ONLY][n]||!e._setPendingPropertyOrPath(n,s,!0,Boolean(a))||r&&r.queueProperty||e._invalidateProperties()}(t,e,o.target,n.source,n.negate)}))}}function ve(t,e,o,n,i,s){s=e.static||s&&("object"!=typeof s||s[e.methodName]);let r={methodName:e.methodName,args:e.args,methodInfo:i,dynamicFn:s};for(let i,s=0;s<e.args.length&&(i=e.args[s]);s++)i.literal||t._addPropertyEffect(i.rootProperty,o,{fn:n,info:r,trigger:i});return s&&t._addPropertyEffect(e.methodName,o,{fn:n,info:r}),r}function ye(t,e,o,n,i){let s=t._methodHost||t,r=s[i.methodName];if(r){let n=t._marshalArgs(i.args,e,o);return n===Jt?Jt:r.apply(s,n)}i.dynamicFn||console.warn("method `"+i.methodName+"` not defined")}const ge=[],be="(?:[a-zA-Z_$][\\w.:$\\-*]*)",we="(?:("+be+"|(?:[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?)|(?:(?:'(?:[^'\\\\]|\\\\.)*')|(?:\"(?:[^\"\\\\]|\\\\.)*\")))\\s*)",xe=new RegExp("(\\[\\[|{{)\\s*(?:(!)\\s*)?"+("("+be+"\\s*"+("(?:\\(\\s*(?:"+("(?:"+we+"(?:,\\s*"+we+")*)")+"?)\\)\\s*)")+"?)")+"(?:]]|}})","g");function Ae(t){let e="";for(let o=0;o<t.length;o++){e+=t[o].literal||""}return e}function Ce(t){let e=t.match(/([^\s]+?)\(([\s\S]*)\)/);if(e){let t={methodName:e[1],static:!0,args:ge};if(e[2].trim()){return function(t,e){return e.args=t.map((function(t){let o=Pe(t);return o.literal||(e.static=!1),o}),this),e}(e[2].replace(/\\,/g,"&comma;").split(","),t)}return t}return null}function Pe(t){let e=t.trim().replace(/&comma;/g,",").replace(/\\(.)/g,"$1"),o={name:e,value:"",literal:!1},n=e[0];switch("-"===n&&(n=e[1]),n>="0"&&n<="9"&&(n="#"),n){case"'":case'"':o.value=e.slice(1,-1),o.literal=!0;break;case"#":o.value=Number(e),o.literal=!0}return o.literal||(o.rootProperty=ut(e),o.structured=ht(e),o.structured&&(o.wildcard=".*"==e.slice(-2),o.wildcard&&(o.name=e.slice(0,-2)))),o}function Ee(t,e,o){let n=vt(t,o);return void 0===n&&(n=e[o]),n}function Oe(t,e,o,n){const i={indexSplices:n};Y&&!t._overrideLegacyUndefined&&(e.splices=i),t.notifyPath(o+".splices",i),t.notifyPath(o+".length",e.length),Y&&!t._overrideLegacyUndefined&&(i.indexSplices=[])}function Te(t,e,o,n,i,s){Oe(t,e,o,[{index:n,addedCount:i,removed:s,object:e,type:"splice"}])}const Se=J((t=>{const e=Wt(Dt(t));return class extends e{constructor(){super(),this.__isPropertyEffectsClient=!0,this.__dataClientsReady,this.__dataPendingClients,this.__dataToNotify,this.__dataLinkedPaths,this.__dataHasPaths,this.__dataCompoundStorage,this.__dataHost,this.__dataTemp,this.__dataClientsInitialized,this.__data,this.__dataPending,this.__dataOld,this.__computeEffects,this.__computeInfo,this.__reflectEffects,this.__notifyEffects,this.__propagateEffects,this.__observeEffects,this.__readOnly,this.__templateInfo,this._overrideLegacyUndefined}get PROPERTY_EFFECT_TYPES(){return $t}_initializeProperties(){super._initializeProperties(),this._registerHost(),this.__dataClientsReady=!1,this.__dataPendingClients=null,this.__dataToNotify=null,this.__dataLinkedPaths=null,this.__dataHasPaths=!1,this.__dataCompoundStorage=this.__dataCompoundStorage||null,this.__dataHost=this.__dataHost||null,this.__dataTemp={},this.__dataClientsInitialized=!1}_registerHost(){if(ke.length){let t=ke[ke.length-1];t._enqueueClient(this),this.__dataHost=t}}_initializeProtoProperties(t){this.__data=Object.create(t),this.__dataPending=Object.create(t),this.__dataOld={}}_initializeInstanceProperties(t){let e=this[$t.READ_ONLY];for(let o in t)e&&e[o]||(this.__dataPending=this.__dataPending||{},this.__dataOld=this.__dataOld||{},this.__data[o]=this.__dataPending[o]=t[o])}_addPropertyEffect(t,e,o){this._createPropertyAccessor(t,e==$t.READ_ONLY);let n=Qt(this,e,!0)[t];n||(n=this[e][t]=[]),n.push(o)}_removePropertyEffect(t,e,o){let n=Qt(this,e,!0)[t],i=n.indexOf(o);i>=0&&n.splice(i,1)}_hasPropertyEffect(t,e){let o=this[e];return Boolean(o&&o[t])}_hasReadOnlyEffect(t){return this._hasPropertyEffect(t,$t.READ_ONLY)}_hasNotifyEffect(t){return this._hasPropertyEffect(t,$t.NOTIFY)}_hasReflectEffect(t){return this._hasPropertyEffect(t,$t.REFLECT)}_hasComputedEffect(t){return this._hasPropertyEffect(t,$t.COMPUTE)}_setPendingPropertyOrPath(t,e,o,n){if(n||ut(Array.isArray(t)?t[0]:t)!==t){if(!n){let o=vt(this,t);if(!(t=yt(this,t,e))||!super._shouldPropertyChange(t,e,o))return!1}if(this.__dataHasPaths=!0,this._setPendingProperty(t,e,o))return function(t,e,o){let n=t.__dataLinkedPaths;if(n){let i;for(let s in n){let r=n[s];mt(s,e)?(i=pt(s,r,e),t._setPendingPropertyOrPath(i,o,!0,!0)):mt(r,e)&&(i=pt(r,s,e),t._setPendingPropertyOrPath(i,o,!0,!0))}}}(this,t,e),!0}else{if(this.__dataHasAccessor&&this.__dataHasAccessor[t])return this._setPendingProperty(t,e,o);this[t]=e}return!1}_setUnmanagedPropertyToNode(t,e,o){o===t[e]&&"object"!=typeof o||("className"===e&&(t=ct(t)),t[e]=o)}_setPendingProperty(t,e,o){let n=this.__dataHasPaths&&ht(t),i=n?this.__dataTemp:this.__data;return!!this._shouldPropertyChange(t,e,i[t])&&(this.__dataPending||(this.__dataPending={},this.__dataOld={}),t in this.__dataOld||(this.__dataOld[t]=this.__data[t]),n?this.__dataTemp[t]=e:this.__data[t]=e,this.__dataPending[t]=e,(n||this[$t.NOTIFY]&&this[$t.NOTIFY][t])&&(this.__dataToNotify=this.__dataToNotify||{},this.__dataToNotify[t]=o),!0)}_setProperty(t,e){this._setPendingProperty(t,e,!0)&&this._invalidateProperties()}_invalidateProperties(){this.__dataReady&&this._flushProperties()}_enqueueClient(t){this.__dataPendingClients=this.__dataPendingClients||[],t!==this&&this.__dataPendingClients.push(t)}_flushClients(){this.__dataClientsReady?this.__enableOrFlushClients():(this.__dataClientsReady=!0,this._readyClients(),this.__dataReady=!0)}__enableOrFlushClients(){let t=this.__dataPendingClients;if(t){this.__dataPendingClients=null;for(let e=0;e<t.length;e++){let o=t[e];o.__dataEnabled?o.__dataPending&&o._flushProperties():o._enableProperties()}}}_readyClients(){this.__enableOrFlushClients()}setProperties(t,e){for(let o in t)!e&&this[$t.READ_ONLY]&&this[$t.READ_ONLY][o]||this._setPendingPropertyOrPath(o,t[o],!0);this._invalidateProperties()}ready(){this._flushProperties(),this.__dataClientsReady||this._flushClients(),this.__dataPending&&this._flushProperties()}_propertiesChanged(t,e,o){let n,i=this.__dataHasPaths;this.__dataHasPaths=!1,le(this,e,o,i),n=this.__dataToNotify,this.__dataToNotify=null,this._propagatePropertyChanges(e,o,i),this._flushClients(),te(this,this[$t.REFLECT],e,o,i),te(this,this[$t.OBSERVE],e,o,i),n&&function(t,e,o,n,i){let s,r,a=t[$t.NOTIFY],l=Gt++;for(let r in e)e[r]&&(a&&ee(t,a,l,r,o,n,i)||i&&ie(t,r,o))&&(s=!0);s&&(r=t.__dataHost)&&r._invalidateProperties&&r._invalidateProperties()}(this,n,e,o,i),1==this.__dataCounter&&(this.__dataTemp={})}_propagatePropertyChanges(t,e,o){this[$t.PROPAGATE]&&te(this,this[$t.PROPAGATE],t,e,o),this.__templateInfo&&this._runEffectsForTemplate(this.__templateInfo,t,e,o)}_runEffectsForTemplate(t,e,o,n){const i=(e,n)=>{te(this,t.propertyEffects,e,o,n,t.nodeList);for(let i=t.firstChild;i;i=i.nextSibling)this._runEffectsForTemplate(i,e,o,n)};t.runEffects?t.runEffects(i,e,n):i(e,n)}linkPaths(t,e){t=_t(t),e=_t(e),this.__dataLinkedPaths=this.__dataLinkedPaths||{},this.__dataLinkedPaths[t]=e}unlinkPaths(t){t=_t(t),this.__dataLinkedPaths&&delete this.__dataLinkedPaths[t]}notifySplices(t,e){let o={path:""};Oe(this,vt(this,t,o),o.path,e)}get(t,e){return vt(e||this,t)}set(t,e,o){o?yt(o,t,e):this[$t.READ_ONLY]&&this[$t.READ_ONLY][t]||this._setPendingPropertyOrPath(t,e,!0)&&this._invalidateProperties()}push(t,...e){let o={path:""},n=vt(this,t,o),i=n.length,s=n.push(...e);return e.length&&Te(this,n,o.path,i,e.length,[]),s}pop(t){let e={path:""},o=vt(this,t,e),n=Boolean(o.length),i=o.pop();return n&&Te(this,o,e.path,o.length,0,[i]),i}splice(t,e,o,...n){let i,s={path:""},r=vt(this,t,s);return e<0?e=r.length-Math.floor(-e):e&&(e=Math.floor(e)),i=2===arguments.length?r.splice(e):r.splice(e,o,...n),(n.length||i.length)&&Te(this,r,s.path,e,n.length,i),i}shift(t){let e={path:""},o=vt(this,t,e),n=Boolean(o.length),i=o.shift();return n&&Te(this,o,e.path,0,0,[i]),i}unshift(t,...e){let o={path:""},n=vt(this,t,o),i=n.unshift(...e);return e.length&&Te(this,n,o.path,0,e.length,[]),i}notifyPath(t,e){let o;if(1==arguments.length){let n={path:""};e=vt(this,t,n),o=n.path}else o=Array.isArray(t)?_t(t):t;this._setPendingPropertyOrPath(o,e,!0,!0)&&this._invalidateProperties()}_createReadOnlyProperty(t,e){var o;this._addPropertyEffect(t,$t.READ_ONLY),e&&(this["_set"+(o=t,o[0].toUpperCase()+o.substring(1))]=function(e){this._setProperty(t,e)})}_createPropertyObserver(t,e,o){let n={property:t,method:e,dynamicFn:Boolean(o)};this._addPropertyEffect(t,$t.OBSERVE,{fn:ne,info:n,trigger:{name:t}}),o&&this._addPropertyEffect(e,$t.OBSERVE,{fn:ne,info:n,trigger:{name:e}})}_createMethodObserver(t,e){let o=Ce(t);if(!o)throw new Error("Malformed observer expression '"+t+"'");ve(this,o,$t.OBSERVE,ye,null,e)}_createNotifyingProperty(t){this._addPropertyEffect(t,$t.NOTIFY,{fn:re,info:{eventName:At(t)+"-changed",property:t}})}_createReflectedProperty(t){let e=this.constructor.attributeNameForProperty(t);"-"===e[0]?console.warn("Property "+t+" cannot be reflected to attribute "+e+' because "-" is not a valid starting attribute name. Use a lowercase first letter for the property instead.'):this._addPropertyEffect(t,$t.REFLECT,{fn:ae,info:{attrName:e}})}_createComputedProperty(t,e,o){let n=Ce(e);if(!n)throw new Error("Malformed computed expression '"+e+"'");const i=ve(this,n,$t.COMPUTE,he,t,o);Qt(this,Xt)[t]=i}_marshalArgs(t,e,o){const n=this.__data,i=[];for(let s=0,r=t.length;s<r;s++){let{name:r,structured:a,wildcard:l,value:d,literal:c}=t[s];if(!c)if(l){const t=mt(r,e),i=Ee(n,o,t?e:r);d={path:t?e:r,value:i,base:t?vt(n,r):i}}else d=a?Ee(n,o,r):n[r];if(Y&&!this._overrideLegacyUndefined&&void 0===d&&t.length>1)return Jt;i[s]=d}return i}static addPropertyEffect(t,e,o){this.prototype._addPropertyEffect(t,e,o)}static createPropertyObserver(t,e,o){this.prototype._createPropertyObserver(t,e,o)}static createMethodObserver(t,e){this.prototype._createMethodObserver(t,e)}static createNotifyingProperty(t){this.prototype._createNotifyingProperty(t)}static createReadOnlyProperty(t,e){this.prototype._createReadOnlyProperty(t,e)}static createReflectedProperty(t){this.prototype._createReflectedProperty(t)}static createComputedProperty(t,e,o){this.prototype._createComputedProperty(t,e,o)}static bindTemplate(t){return this.prototype._bindTemplate(t)}_bindTemplate(t,e){let o=this.constructor._parseTemplate(t),n=this.__preBoundTemplateInfo==o;if(!n)for(let t in o.propertyEffects)this._createPropertyAccessor(t);if(e)if(o=Object.create(o),o.wasPreBound=n,this.__templateInfo){const e=t._parentTemplateInfo||this.__templateInfo,n=e.lastChild;o.parent=e,e.lastChild=o,o.previousSibling=n,n?n.nextSibling=o:e.firstChild=o}else this.__templateInfo=o;else this.__preBoundTemplateInfo=o;return o}static _addTemplatePropertyEffect(t,e,o){(t.hostProps=t.hostProps||{})[e]=!0;let n=t.propertyEffects=t.propertyEffects||{};(n[e]=n[e]||[]).push(o)}_stampTemplate(t,e){e=e||this._bindTemplate(t,!0),ke.push(this);let o=super._stampTemplate(t,e);if(ke.pop(),e.nodeList=o.nodeList,!e.wasPreBound){let t=e.childNodes=[];for(let e=o.firstChild;e;e=e.nextSibling)t.push(e)}return o.templateInfo=e,function(t,e){let{nodeList:o,nodeInfoList:n}=e;if(n.length)for(let e=0;e<n.length;e++){let i=n[e],s=o[e],r=i.bindings;if(r)for(let e=0;e<r.length;e++){let o=r[e];_e(s,o),fe(s,t,o)}s.__dataHost=t}}(this,e),this.__dataClientsReady&&(this._runEffectsForTemplate(e,this.__data,null,!1),this._flushClients()),o}_removeBoundDom(t){const e=t.templateInfo,{previousSibling:o,nextSibling:n,parent:i}=e;o?o.nextSibling=n:i&&(i.firstChild=n),n?n.previousSibling=o:i&&(i.lastChild=o),e.nextSibling=e.previousSibling=null;let s=e.childNodes;for(let t=0;t<s.length;t++){let e=s[t];ct(ct(e).parentNode).removeChild(e)}}static _parseTemplateNode(t,o,n){let i=e._parseTemplateNode.call(this,t,o,n);if(t.nodeType===Node.TEXT_NODE){let e=this._parseBindings(t.textContent,o);e&&(t.textContent=Ae(e)||" ",ue(this,o,n,"text","textContent",e),i=!0)}return i}static _parseTemplateNodeAttribute(t,o,n,i,s){let r=this._parseBindings(s,o);if(r){let e=i,s="property";Zt.test(i)?s="attribute":"$"==i[i.length-1]&&(i=i.slice(0,-1),s="attribute");let a=Ae(r);return a&&"attribute"==s&&("class"==i&&t.hasAttribute("class")&&(a+=" "+t.getAttribute(i)),t.setAttribute(i,a)),"attribute"==s&&"disable-upgrade$"==e&&t.setAttribute(i,""),"input"===t.localName&&"value"===e&&t.setAttribute(e,""),t.removeAttribute(e),"property"===s&&(i=xt(i)),ue(this,o,n,s,i,r,a),!0}return e._parseTemplateNodeAttribute.call(this,t,o,n,i,s)}static _parseTemplateNestedTemplate(t,o,n){let i=e._parseTemplateNestedTemplate.call(this,t,o,n);const s=t.parentNode,r=n.templateInfo,a="dom-if"===s.localName,l="dom-repeat"===s.localName;V&&(a||l)&&(s.removeChild(t),(n=n.parentInfo).templateInfo=r,n.noted=!0,i=!1);let d=r.hostProps;if(K&&a)d&&(o.hostProps=Object.assign(o.hostProps||{},d),V||(n.parentInfo.noted=!0));else{let t="{";for(let e in d){ue(this,o,n,"property","_host_"+e,[{mode:t,source:e,dependencies:[e],hostProp:!0}])}}return i}static _parseBindings(t,e){let o,n=[],i=0;for(;null!==(o=xe.exec(t));){o.index>i&&n.push({literal:t.slice(i,o.index)});let s=o[1][0],r=Boolean(o[2]),a=o[3].trim(),l=!1,d="",c=-1;"{"==s&&(c=a.indexOf("::"))>0&&(d=a.substring(c+2),a=a.substring(0,c),l=!0);let h=Ce(a),u=[];if(h){let{args:t,methodName:o}=h;for(let e=0;e<t.length;e++){let o=t[e];o.literal||u.push(o)}let n=e.dynamicFns;(n&&n[o]||h.static)&&(u.push(o),h.dynamicFn=!0)}else u.push(a);n.push({source:a,mode:s,negate:r,customEvent:l,signature:h,dependencies:u,event:d}),i=xe.lastIndex}if(i&&i<t.length){let e=t.substring(i);e&&n.push({literal:e})}return n.length?n:null}static _evaluateBinding(t,e,o,n,i,s){let r;return r=e.signature?ye(t,o,n,0,e.signature):o!=e.source?vt(t,e.source):s&&ht(o)?vt(t,o):t.__data[o],e.negate&&(r=!r),r}}})),ke=[];const Ne=J((t=>{const e=Lt(t);function o(t){const e=Object.getPrototypeOf(t);return e.prototype instanceof i?e:null}function n(t){if(!t.hasOwnProperty(JSCompiler_renameProperty("__ownProperties",t))){let e=null;if(t.hasOwnProperty(JSCompiler_renameProperty("properties",t))){const o=t.properties;o&&(e=
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
function(t){const e={};for(let o in t){const n=t[o];e[o]="function"==typeof n?{type:n}:n}return e}(o))}t.__ownProperties=e}return t.__ownProperties}class i extends e{static get observedAttributes(){if(!this.hasOwnProperty(JSCompiler_renameProperty("__observedAttributes",this))){this.prototype;const t=this._properties;this.__observedAttributes=t?Object.keys(t).map((t=>this.prototype._addPropertyToAttributeMap(t))):[]}return this.__observedAttributes}static finalize(){if(!this.hasOwnProperty(JSCompiler_renameProperty("__finalized",this))){const t=o(this);t&&t.finalize(),this.__finalized=!0,this._finalizeClass()}}static _finalizeClass(){const t=n(this);t&&this.createProperties(t)}static get _properties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("__properties",this))){const t=o(this);this.__properties=Object.assign({},t&&t._properties,n(this))}return this.__properties}static typeForProperty(t){const e=this._properties[t];return e&&e.type}_initializeProperties(){this.constructor.finalize(),super._initializeProperties()}connectedCallback(){super.connectedCallback&&super.connectedCallback(),this._enableProperties()}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback()}}return i})),Le=window.ShadyCSS&&window.ShadyCSS.cssBuild,Me=J((t=>{const e=Ne(Se(t));function o(t,e,o,n){o.computed&&(o.readOnly=!0),o.computed&&(t._hasReadOnlyEffect(e)?console.warn(`Cannot redefine computed property '${e}'.`):t._createComputedProperty(e,o.computed,n)),o.readOnly&&!t._hasReadOnlyEffect(e)?t._createReadOnlyProperty(e,!o.computed):!1===o.readOnly&&t._hasReadOnlyEffect(e)&&console.warn(`Cannot make readOnly property '${e}' non-readOnly.`),o.reflectToAttribute&&!t._hasReflectEffect(e)?t._createReflectedProperty(e):!1===o.reflectToAttribute&&t._hasReflectEffect(e)&&console.warn(`Cannot make reflected property '${e}' non-reflected.`),o.notify&&!t._hasNotifyEffect(e)?t._createNotifyingProperty(e):!1===o.notify&&t._hasNotifyEffect(e)&&console.warn(`Cannot make notify property '${e}' non-notify.`),o.observer&&t._createPropertyObserver(e,o.observer,n[o.observer]),t._addPropertyToAttributeMap(e)}function n(t,e,o,n){if(!Le){const i=e.content.querySelectorAll("style"),s=lt(e),r=function(t){let e=it(t);return e?dt(e):[]}(o),a=e.content.firstElementChild;for(let o=0;o<r.length;o++){let i=r[o];i.textContent=t._processStyleText(i.textContent,n),e.content.insertBefore(i,a)}let l=0;for(let e=0;e<s.length;e++){let o=s[e],r=i[l];r!==o?(o=o.cloneNode(!0),r.parentNode.insertBefore(o,r)):l++,o.textContent=t._processStyleText(o.textContent,n)}}if(window.ShadyCSS&&window.ShadyCSS.prepareTemplate(e,o),W&&Le&&z){const o=e.content.querySelectorAll("style");if(o){let e="";Array.from(o).forEach((t=>{e+=t.textContent,t.parentNode.removeChild(t)})),t._styleSheet=new CSSStyleSheet,t._styleSheet.replaceSync(e)}}}return class extends e{static get polymerElementVersion(){return"3.5.1"}static _finalizeClass(){e._finalizeClass.call(this);const t=((o=this).hasOwnProperty(JSCompiler_renameProperty("__ownObservers",o))||(o.__ownObservers=o.hasOwnProperty(JSCompiler_renameProperty("observers",o))?o.observers:null),o.__ownObservers);var o;t&&this.createObservers(t,this._properties),this._prepareTemplate()}static _prepareTemplate(){let t=this.template;t&&("string"==typeof t?(console.error("template getter must return HTMLTemplateElement"),t=null):H||(t=t.cloneNode(!0))),this.prototype._template=t}static createProperties(t){for(let e in t)o(this.prototype,e,t[e],t)}static createObservers(t,e){const o=this.prototype;for(let n=0;n<t.length;n++)o._createMethodObserver(t[n],e)}static get template(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_template",this))){let t=this.prototype.hasOwnProperty(JSCompiler_renameProperty("_template",this.prototype))?this.prototype._template:void 0;"function"==typeof t&&(t=t()),this._template=void 0!==t?t:this.hasOwnProperty(JSCompiler_renameProperty("is",this))&&function(t){let e=null;if(t&&(!B||F)&&(e=tt.import(t,"template"),B&&!e))throw new Error(`strictTemplatePolicy: expecting dom-module or null template for ${t}`);return e}(this.is)||Object.getPrototypeOf(this.prototype).constructor.template}return this._template}static set template(t){this._template=t}static get importPath(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_importPath",this))){const t=this.importMeta;if(t)this._importPath=M(t.url);else{const t=tt.import(this.is);this._importPath=t&&t.assetpath||Object.getPrototypeOf(this.prototype).constructor.importPath}}return this._importPath}constructor(){super(),this._template,this._importPath,this.rootPath,this.importPath,this.root,this.$}_initializeProperties(){this.constructor.finalize(),this.constructor._finalizeTemplate(this.localName),super._initializeProperties(),this.rootPath=D,this.importPath=this.constructor.importPath;let t=function(t){if(!t.hasOwnProperty(JSCompiler_renameProperty("__propertyDefaults",t))){t.__propertyDefaults=null;let e=t._properties;for(let o in e){let n=e[o];"value"in n&&(t.__propertyDefaults=t.__propertyDefaults||{},t.__propertyDefaults[o]=n)}}return t.__propertyDefaults}(this.constructor);if(t)for(let e in t){let o=t[e];if(this._canApplyPropertyDefault(e)){let t="function"==typeof o.value?o.value.call(this):o.value;this._hasAccessor(e)?this._setPendingProperty(e,t,!0):this[e]=t}}}_canApplyPropertyDefault(t){return!this.hasOwnProperty(t)}static _processStyleText(t,e){return L(t,e)}static _finalizeTemplate(t){const e=this.prototype._template;if(e&&!e.__polymerFinalized){e.__polymerFinalized=!0;const o=this.importPath;n(this,e,t,o?N(o):""),this.prototype._bindTemplate(e)}}connectedCallback(){window.ShadyCSS&&this._template&&window.ShadyCSS.styleElement(this),super.connectedCallback()}ready(){this._template&&(this.root=this._stampTemplate(this._template),this.$=this.root.$),super.ready()}_readyClients(){this._template&&(this.root=this._attachDom(this.root)),super._readyClients()}_attachDom(t){const e=ct(this);if(e.attachShadow)return t?(e.shadowRoot||(e.attachShadow({mode:"open",shadyUpgradeFragment:t}),e.shadowRoot.appendChild(t),this.constructor._styleSheet&&(e.shadowRoot.adoptedStyleSheets=[this.constructor._styleSheet])),j&&window.ShadyDOM&&window.ShadyDOM.flushInitial(e.shadowRoot),e.shadowRoot):null;throw new Error("ShadowDOM not available. PolymerElement can create dom as children instead of in ShadowDOM by setting `this.root = this;` before `ready`.")}updateStyles(t){window.ShadyCSS&&window.ShadyCSS.styleSubtree(this,t)}resolveUrl(t,e){return!e&&this.importPath&&(e=N(this.importPath)),N(t,e)}static _parseTemplateContent(t,o,n){return o.dynamicFns=o.dynamicFns||this._properties,e._parseTemplateContent.call(this,t,o,n)}static _addTemplatePropertyEffect(t,o,n){return!U||o in this._properties||n.info.part.signature&&n.info.part.signature.static||n.info.part.hostProp||t.nestedTemplate||console.warn(`Property '${o}' used in template but not declared in 'properties'; attribute will not be observed.`),e._addTemplatePropertyEffect.call(this,t,o,n)}}})),Ie=window.trustedTypes&&trustedTypes.createPolicy("polymer-html-literal",{createHTML:t=>t});
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
 */class ze{constructor(t,e){Be(t,e);const o=e.reduce(((e,o,n)=>e+De(o)+t[n+1]),t[0]);this.value=o.toString()}toString(){return this.value}}function De(t){if(t instanceof ze)return t.value;throw new Error(`non-literal value passed to Polymer's htmlLiteral function: ${t}`)}const Re=function(t,...e){Be(t,e);const o=document.createElement("template");let n=e.reduce(((e,o,n)=>e+function(t){if(t instanceof HTMLTemplateElement)return t.innerHTML;if(t instanceof ze)return De(t);throw new Error(`non-template value passed to Polymer's html function: ${t}`)}(o)+t[n+1]),t[0]);return Ie&&(n=Ie.createHTML(n)),o.innerHTML=n,o},Be=(t,e)=>{if(!Array.isArray(t)||!Array.isArray(t.raw)||e.length!==t.length-1)throw new TypeError("Invalid call to the html template tag")},Fe=Me(HTMLElement),He=J((t=>class extends t{constructor(){super(),this.__controllers=new Set}connectedCallback(){super.connectedCallback(),this.__controllers.forEach((t=>{t.hostConnected&&t.hostConnected()}))}disconnectedCallback(){super.disconnectedCallback(),this.__controllers.forEach((t=>{t.hostDisconnected&&t.hostDisconnected()}))}addController(t){this.__controllers.add(t),void 0!==this.$&&this.isConnected&&t.hostConnected&&t.hostConnected()}removeController(t){this.__controllers.delete(t)}})),Ue=/\/\*\*\s+vaadin-dev-mode:start([\s\S]*)vaadin-dev-mode:end\s+\*\*\//i,je=window.Vaadin&&window.Vaadin.Flow&&window.Vaadin.Flow.clients;function Ye(t,e){if("function"!=typeof t)return;const o=Ue.exec(t.toString());if(o)try{t=new Function(o[1])}catch(t){console.log("vaadin-development-mode-detector: uncommentAndRun() failed",t)}return t(e)}window.Vaadin=window.Vaadin||{};const qe=function(t,e){if(window.Vaadin.developmentMode)return Ye(t,e)};function Ve(){}void 0===window.Vaadin.developmentMode&&(window.Vaadin.developmentMode=function(){try{return!!localStorage.getItem("vaadin.developmentmode.force")||["localhost","127.0.0.1"].indexOf(window.location.hostname)>=0&&(je?!(je&&Object.keys(je).map((t=>je[t])).filter((t=>t.productionMode)).length>0):!Ye((function(){return!0})))}catch(t){return!1}}());
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
let Ke=0,We=0;const Ge=[];let Je=0,$e=!1;const Xe=document.createTextNode("");new window.MutationObserver((function(){$e=!1;const t=Ge.length;for(let e=0;e<t;e++){const t=Ge[e];if(t)try{t()}catch(t){setTimeout((()=>{throw t}))}}Ge.splice(0,t),We+=t})).observe(Xe,{characterData:!0});const Ze={after:t=>({run:e=>window.setTimeout(e,t),cancel(t){window.clearTimeout(t)}}),run:(t,e)=>window.setTimeout(t,e),cancel(t){window.clearTimeout(t)}},Qe={run:t=>window.requestIdleCallback?window.requestIdleCallback(t):window.setTimeout(t,16),cancel(t){window.cancelIdleCallback?window.cancelIdleCallback(t):window.clearTimeout(t)}},to={run(t){$e||($e=!0,Xe.textContent=Je,Je+=1),Ge.push(t);const e=Ke;return Ke+=1,e},cancel(t){const e=t-We;if(e>=0){if(!Ge[e])throw new Error(`invalid async handle: ${t}`);Ge[e]=null}}},eo=new Set;class oo{static debounce(t,e,o){return t instanceof oo?t._cancelAsync():t=new oo,t.setConfig(e,o),t}constructor(){this._asyncModule=null,this._callback=null,this._timer=null}setConfig(t,e){this._asyncModule=t,this._callback=e,this._timer=this._asyncModule.run((()=>{this._timer=null,eo.delete(this),this._callback()}))}cancel(){this.isActive()&&(this._cancelAsync(),eo.delete(this))}_cancelAsync(){this.isActive()&&(this._asyncModule.cancel(this._timer),this._timer=null)}flush(){this.isActive()&&(this.cancel(),this._callback())}isActive(){return null!=this._timer}}
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const no=[];function io(t,e,o=t.getAttribute("dir")){e?t.setAttribute("dir",e):null!=o&&t.removeAttribute("dir")}function so(){return document.documentElement.getAttribute("dir")}new MutationObserver((function(){const t=so();no.forEach((e=>{io(e,t)}))})).observe(document.documentElement,{attributes:!0,attributeFilter:["dir"]});const ro=t=>class extends t{static get properties(){return{dir:{type:String,value:"",reflectToAttribute:!0,converter:{fromAttribute:t=>t||"",toAttribute:t=>""===t?null:t}}}}get __isRTL(){return"rtl"===this.getAttribute("dir")}connectedCallback(){super.connectedCallback(),this.hasAttribute("dir")&&!this.__restoreSubscription||(this.__subscribe(),io(this,so(),null))}attributeChangedCallback(t,e,o){if(super.attributeChangedCallback(t,e,o),"dir"!==t)return;const n=so(),i=o===n&&-1===no.indexOf(this),s=!o&&e&&-1===no.indexOf(this),r=o!==n&&e===n;i||s?(this.__subscribe(),io(this,n,o)):r&&this.__unsubscribe()}disconnectedCallback(){super.disconnectedCallback(),this.__restoreSubscription=no.includes(this),this.__unsubscribe()}_valueToNodeAttribute(t,e,o){("dir"!==o||""!==e||t.hasAttribute("dir"))&&super._valueToNodeAttribute(t,e,o)}_attributeToProperty(t,e,o){"dir"!==t||e?super._attributeToProperty(t,e,o):this.dir=""}__subscribe(){no.includes(this)||no.push(this)}__unsubscribe(){no.includes(this)&&no.splice(no.indexOf(this),1)}}
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;let ao;window.Vaadin||(window.Vaadin={}),window.Vaadin.registrations||(window.Vaadin.registrations=[]),window.Vaadin.developmentModeCallback||(window.Vaadin.developmentModeCallback={}),window.Vaadin.developmentModeCallback["vaadin-usage-statistics"]=function(){qe(Ve)};const lo=new Set,co=t=>class extends(ro(t)){static get version(){return"24.0.0"}static finalize(){super.finalize();const{is:t}=this;var e;t&&!lo.has(t)&&(window.Vaadin.registrations.push(this),lo.add(t),window.Vaadin.developmentModeCallback&&(ao=oo.debounce(ao,Qe,(()=>{window.Vaadin.developmentModeCallback["vaadin-usage-statistics"]()})),e=ao,eo.add(e)))}constructor(){super(),null===document.doctype&&console.warn('Vaadin components require the "standards mode" declaration. Please add <!DOCTYPE html> to the HTML document.')}}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/;function ho(t,e,o){return{index:t,removed:e,addedCount:o}}const uo=0,mo=1,po=2,_o=3;function fo(t,e,o,n,i,s){let r,a=0,l=0,d=Math.min(o-e,s-i);if(0==e&&0==i&&(a=function(t,e,o){for(let n=0;n<o;n++)if(!vo(t[n],e[n]))return n;return o}(t,n,d)),o==t.length&&s==n.length&&(l=function(t,e,o){let n=t.length,i=e.length,s=0;for(;s<o&&vo(t[--n],e[--i]);)s++;return s}(t,n,d-a)),i+=a,s-=l,(o-=l)-(e+=a)==0&&s-i==0)return[];if(e==o){for(r=ho(e,[],0);i<s;)r.removed.push(n[i++]);return[r]}if(i==s)return[ho(e,[],o-e)];let c=function(t){let e=t.length-1,o=t[0].length-1,n=t[e][o],i=[];for(;e>0||o>0;){if(0==e){i.push(po),o--;continue}if(0==o){i.push(_o),e--;continue}let s,r=t[e-1][o-1],a=t[e-1][o],l=t[e][o-1];s=a<l?a<r?a:r:l<r?l:r,s==r?(r==n?i.push(uo):(i.push(mo),n=r),e--,o--):s==a?(i.push(_o),e--,n=a):(i.push(po),o--,n=l)}return i.reverse(),i}(function(t,e,o,n,i,s){let r=s-i+1,a=o-e+1,l=new Array(r);for(let t=0;t<r;t++)l[t]=new Array(a),l[t][0]=t;for(let t=0;t<a;t++)l[0][t]=t;for(let o=1;o<r;o++)for(let s=1;s<a;s++)if(vo(t[e+s-1],n[i+o-1]))l[o][s]=l[o-1][s-1];else{let t=l[o-1][s]+1,e=l[o][s-1]+1;l[o][s]=t<e?t:e}return l}(t,e,o,n,i,s));r=void 0;let h=[],u=e,m=i;for(let t=0;t<c.length;t++)switch(c[t]){case uo:r&&(h.push(r),r=void 0),u++,m++;break;case mo:r||(r=ho(u,[],0)),r.addedCount++,u++,r.removed.push(n[m]),m++;break;case po:r||(r=ho(u,[],0)),r.addedCount++,u++;break;case _o:r||(r=ho(u,[],0)),r.removed.push(n[m]),m++}return r&&h.push(r),h}function vo(t,e){return t===e}
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/function yo(t){return"slot"===t.localName}let go=class{static getFlattenedNodes(t){const e=ct(t);return yo(t)?e.assignedNodes({flatten:!0}):Array.from(e.childNodes).map((t=>yo(t)?ct(t).assignedNodes({flatten:!0}):[t])).reduce(((t,e)=>t.concat(e)),[])}constructor(t,e){this._shadyChildrenObserver=null,this._nativeChildrenObserver=null,this._connected=!1,this._target=t,this.callback=e,this._effectiveNodes=[],this._observer=null,this._scheduled=!1,this._boundSchedule=()=>{this._schedule()},this.connect(),this._schedule()}connect(){yo(this._target)?this._listenSlots([this._target]):ct(this._target).children&&(this._listenSlots(ct(this._target).children),window.ShadyDOM?this._shadyChildrenObserver=window.ShadyDOM.observeChildren(this._target,(t=>{this._processMutations(t)})):(this._nativeChildrenObserver=new MutationObserver((t=>{this._processMutations(t)})),this._nativeChildrenObserver.observe(this._target,{childList:!0}))),this._connected=!0}disconnect(){yo(this._target)?this._unlistenSlots([this._target]):ct(this._target).children&&(this._unlistenSlots(ct(this._target).children),window.ShadyDOM&&this._shadyChildrenObserver?(window.ShadyDOM.unobserveChildren(this._shadyChildrenObserver),this._shadyChildrenObserver=null):this._nativeChildrenObserver&&(this._nativeChildrenObserver.disconnect(),this._nativeChildrenObserver=null)),this._connected=!1}_schedule(){this._scheduled||(this._scheduled=!0,kt.run((()=>this.flush())))}_processMutations(t){this._processSlotMutations(t),this.flush()}_processSlotMutations(t){if(t)for(let e=0;e<t.length;e++){let o=t[e];o.addedNodes&&this._listenSlots(o.addedNodes),o.removedNodes&&this._unlistenSlots(o.removedNodes)}}flush(){if(!this._connected)return!1;window.ShadyDOM&&ShadyDOM.flush(),this._nativeChildrenObserver?this._processSlotMutations(this._nativeChildrenObserver.takeRecords()):this._shadyChildrenObserver&&this._processSlotMutations(this._shadyChildrenObserver.takeRecords()),this._scheduled=!1;let t={target:this._target,addedNodes:[],removedNodes:[]},e=this.constructor.getFlattenedNodes(this._target),o=(n=e,i=this._effectiveNodes,fo(n,0,n.length,i,0,i.length));var n,i;for(let e,n=0;n<o.length&&(e=o[n]);n++)for(let o,n=0;n<e.removed.length&&(o=e.removed[n]);n++)t.removedNodes.push(o);for(let n,i=0;i<o.length&&(n=o[i]);i++)for(let o=n.index;o<n.index+n.addedCount;o++)t.addedNodes.push(e[o]);this._effectiveNodes=e;let s=!1;return(t.addedNodes.length||t.removedNodes.length)&&(s=!0,this.callback.call(this._target,t)),s}_listenSlots(t){for(let e=0;e<t.length;e++){let o=t[e];yo(o)&&o.addEventListener("slotchange",this._boundSchedule)}}_unlistenSlots(t){for(let e=0;e<t.length;e++){let o=t[e];yo(o)&&o.removeEventListener("slotchange",this._boundSchedule)}}};
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
let bo=0;
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class wo extends EventTarget{static generateId(t,e){return`${e||"default"}-${t.localName}-${bo++}`}constructor(t,e,o,n={}){super();const{initializer:i,multiple:s,observe:r,useUniqueId:a}=n;this.host=t,this.slotName=e,this.tagName=o,this.observe="boolean"!=typeof r||r,this.multiple="boolean"==typeof s&&s,this.slotInitializer=i,s&&(this.nodes=[]),a&&(this.defaultId=this.constructor.generateId(t,e))}hostConnected(){this.initialized||(this.multiple?this.initMultiple():this.initSingle(),this.observe&&this.observeSlot(),this.initialized=!0)}initSingle(){let t=this.getSlotChild();t?(this.node=t,this.initAddedNode(t)):(t=this.attachDefaultNode(),this.initNode(t))}initMultiple(){const t=this.getSlotChildren();if(0===t.length){const t=this.attachDefaultNode();this.nodes=[t],this.initNode(t)}else this.nodes=t,t.forEach((t=>{this.initAddedNode(t)}))}attachDefaultNode(){const{host:t,slotName:e,tagName:o}=this;let n=this.defaultNode;return!n&&o&&(n=document.createElement(o),n instanceof Element&&(""!==e&&n.setAttribute("slot",e),this.node=n,this.defaultNode=n)),n&&t.appendChild(n),n}getSlotChildren(){const{slotName:t}=this;return Array.from(this.host.childNodes).filter((e=>e.nodeType===Node.ELEMENT_NODE&&e.slot===t||e.nodeType===Node.TEXT_NODE&&e.textContent.trim()&&""===t))}getSlotChild(){return this.getSlotChildren()[0]}initNode(t){const{slotInitializer:e}=this;e&&e(t,this.host)}initCustomNode(t){}teardownNode(t){}initAddedNode(t){t!==this.defaultNode&&(this.initCustomNode(t),this.initNode(t))}observeSlot(){const{slotName:t}=this,e=""===t?"slot:not([name])":`slot[name=${t}]`,o=this.host.shadowRoot.querySelector(e);this.__slotObserver=new go(o,(t=>{const e=this.multiple?this.nodes:[this.node],o=t.addedNodes.filter((t=>!function(t){return t.nodeType===Node.TEXT_NODE&&""===t.textContent.trim()}(t)&&!e.includes(t)));t.removedNodes.length&&t.removedNodes.forEach((t=>{this.teardownNode(t)})),o&&o.length>0&&(e.forEach((t=>{t&&t.isConnected&&t.parentNode.removeChild(t)})),this.multiple?(this.nodes=o,o.forEach((t=>{this.initAddedNode(t)}))):(this.node=o[0],this.initAddedNode(this.node)))}))}}
/**
 * @license
 * Copyright (c) 2022 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class xo extends wo{constructor(t){super(t,"tooltip"),this.setTarget(t)}initCustomNode(t){t.target=this.target,void 0!==this.context&&(t.context=this.context),void 0!==this.manual&&(t.manual=this.manual),void 0!==this.opened&&(t.opened=this.opened),void 0!==this.position&&(t._position=this.position),void 0!==this.shouldShow&&(t.shouldShow=this.shouldShow)}setContext(t){this.context=t;const e=this.node;e&&(e.context=t)}setManual(t){this.manual=t;const e=this.node;e&&(e.manual=t)}setOpened(t){this.opened=t;const e=this.node;e&&(e.opened=t)}setPosition(t){this.position=t;const e=this.node;e&&(e._position=t)}setShouldShow(t){this.shouldShow=t;const e=this.node;e&&(e.shouldShow=t)}setTarget(t){this.target=t;const e=this.node;e&&(e.target=t)}}
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const Ao=n`
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
`,Co=J((t=>class extends t{static get properties(){return{disabled:{type:Boolean,value:!1,observer:"_disabledChanged",reflectToAttribute:!0}}}_disabledChanged(t){this._setAriaDisabled(t)}_setAriaDisabled(t){t?this.setAttribute("aria-disabled","true"):this.removeAttribute("aria-disabled")}click(){this.disabled||super.click()}})),Po=!1,Eo=t=>t,Oo="string"==typeof document.head.style.touchAction,To="__polymerGestures",So="__polymerGesturesHandled",ko="__polymerGesturesTouchAction",No=["mousedown","mousemove","mouseup","click"],Lo=[0,1,4,2],Mo=function(){try{return 1===new MouseEvent("test",{buttons:1}).buttons}catch(t){return!1}}();function Io(t){return No.indexOf(t)>-1}let zo=!1;function Do(t){if(!Io(t)&&"touchend"!==t)return Oo&&zo&&Po?{passive:!0}:void 0}!function(){try{const t=Object.defineProperty({},"passive",{get(){zo=!0}});window.addEventListener("test",null,t),window.removeEventListener("test",null,t)}catch(t){}}();const Ro=navigator.userAgent.match(/iP(?:[oa]d|hone)|Android/u),Bo={button:!0,command:!0,fieldset:!0,input:!0,keygen:!0,optgroup:!0,option:!0,select:!0,textarea:!0};function Fo(t){const e=t.type;if(!Io(e))return!1;if("mousemove"===e){let e=void 0===t.buttons?1:t.buttons;return t instanceof window.MouseEvent&&!Mo&&(e=Lo[t.which]||0),Boolean(1&e)}return 0===(void 0===t.button?0:t.button)}const Ho={mouse:{target:null,mouseIgnoreJob:null},touch:{x:0,y:0,id:-1,scrollDecided:!1}};function Uo(t,e,o){t.movefn=e,t.upfn=o,document.addEventListener("mousemove",e),document.addEventListener("mouseup",o)}function jo(t){document.removeEventListener("mousemove",t.movefn),document.removeEventListener("mouseup",t.upfn),t.movefn=null,t.upfn=null}const Yo=window.ShadyDOM&&window.ShadyDOM.noPatch?window.ShadyDOM.composedPath:t=>t.composedPath&&t.composedPath()||[],qo={},Vo=[];function Ko(t){const e=Yo(t);return e.length>0?e[0]:t.target}function Wo(t){const e=t.type,o=t.currentTarget[To];if(!o)return;const n=o[e];if(!n)return;if(!t[So]&&(t[So]={},e.startsWith("touch"))){const o=t.changedTouches[0];if("touchstart"===e&&1===t.touches.length&&(Ho.touch.id=o.identifier),Ho.touch.id!==o.identifier)return;Oo||"touchstart"!==e&&"touchmove"!==e||function(t){const e=t.changedTouches[0],o=t.type;if("touchstart"===o)Ho.touch.x=e.clientX,Ho.touch.y=e.clientY,Ho.touch.scrollDecided=!1;else if("touchmove"===o){if(Ho.touch.scrollDecided)return;Ho.touch.scrollDecided=!0;const o=function(t){let e="auto";const o=Yo(t);for(let t,n=0;n<o.length;n++)if(t=o[n],t[ko]){e=t[ko];break}return e}(t);let n=!1;const i=Math.abs(Ho.touch.x-e.clientX),s=Math.abs(Ho.touch.y-e.clientY);t.cancelable&&("none"===o?n=!0:"pan-x"===o?n=s>i:"pan-y"===o&&(n=i>s)),n?t.preventDefault():Zo("track")}}(t)}const i=t[So];if(!i.skip){for(let e,o=0;o<Vo.length;o++)e=Vo[o],n[e.name]&&!i[e.name]&&e.flow&&e.flow.start.indexOf(t.type)>-1&&e.reset&&e.reset();for(let o,s=0;s<Vo.length;s++)o=Vo[s],n[o.name]&&!i[o.name]&&(i[o.name]=!0,o[e](t))}}function Go(t,e,o){return!!qo[e]&&(function(t,e,o){const n=qo[e],i=n.deps,s=n.name;let r=t[To];r||(t[To]=r={});for(let e,o,n=0;n<i.length;n++)e=i[n],Ro&&Io(e)&&"click"!==e||(o=r[e],o||(r[e]=o={_count:0}),0===o._count&&t.addEventListener(e,Wo,Do(e)),o[s]=(o[s]||0)+1,o._count=(o._count||0)+1);t.addEventListener(e,o),n.touchAction&&function(t,e){Oo&&t instanceof HTMLElement&&to.run((()=>{t.style.touchAction=e}));t[ko]=e}(t,n.touchAction)}(t,e,o),!0)}function Jo(t,e,o){return!!qo[e]&&(function(t,e,o){const n=qo[e],i=n.deps,s=n.name,r=t[To];if(r)for(let e,o,n=0;n<i.length;n++)e=i[n],o=r[e],o&&o[s]&&(o[s]=(o[s]||1)-1,o._count=(o._count||1)-1,0===o._count&&t.removeEventListener(e,Wo,Do(e)));t.removeEventListener(e,o)}(t,e,o),!0)}function $o(t){Vo.push(t),t.emits.forEach((e=>{qo[e]=t}))}function Xo(t,e,o){const n=new Event(e,{bubbles:!0,cancelable:!0,composed:!0});if(n.detail=o,Eo(t).dispatchEvent(n),n.defaultPrevented){const t=o.preventer||o.sourceEvent;t&&t.preventDefault&&t.preventDefault()}}function Zo(t){const e=function(t){for(let e,o=0;o<Vo.length;o++){e=Vo[o];for(let o,n=0;n<e.emits.length;n++)if(o=e.emits[n],o===t)return e}return null}(t);e.info&&(e.info.prevent=!0)}function Qo(t,e,o,n){e&&Xo(e,t,{x:o.clientX,y:o.clientY,sourceEvent:o,preventer:n,prevent:t=>Zo(t)})}function tn(t,e,o){if(t.prevent)return!1;if(t.started)return!0;const n=Math.abs(t.x-e),i=Math.abs(t.y-o);return n>=5||i>=5}function en(t,e,o){if(!e)return;const n=t.moves[t.moves.length-2],i=t.moves[t.moves.length-1],s=i.x-t.x,r=i.y-t.y;let a,l=0;n&&(a=i.x-n.x,l=i.y-n.y),Xo(e,"track",{state:t.state,x:o.clientX,y:o.clientY,dx:s,dy:r,ddx:a,ddy:l,sourceEvent:o,hover:()=>function(t,e){let o=document.elementFromPoint(t,e),n=o;for(;n&&n.shadowRoot&&!window.ShadyDOM;){const i=n;if(n=n.shadowRoot.elementFromPoint(t,e),i===n)break;n&&(o=n)}return o}(o.clientX,o.clientY)})}function on(t,e,o){const n=Math.abs(e.clientX-t.x),i=Math.abs(e.clientY-t.y),s=Ko(o||e);!s||Bo[s.localName]&&s.hasAttribute("disabled")||(isNaN(n)||isNaN(i)||n<=25&&i<=25||function(t){if("click"===t.type){if(0===t.detail)return!0;const e=Ko(t);if(!e.nodeType||e.nodeType!==Node.ELEMENT_NODE)return!0;const o=e.getBoundingClientRect(),n=t.pageX,i=t.pageY;return!(n>=o.left&&n<=o.right&&i>=o.top&&i<=o.bottom)}return!1}(e))&&(t.prevent||Xo(s,"tap",{x:e.clientX,y:e.clientY,sourceEvent:e,preventer:o}))}
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */$o({name:"downup",deps:["mousedown","touchstart","touchend"],flow:{start:["mousedown","touchstart"],end:["mouseup","touchend"]},emits:["down","up"],info:{movefn:null,upfn:null},reset(){jo(this.info)},mousedown(t){if(!Fo(t))return;const e=Ko(t),o=this;Uo(this.info,(t=>{Fo(t)||(Qo("up",e,t),jo(o.info))}),(t=>{Fo(t)&&Qo("up",e,t),jo(o.info)})),Qo("down",e,t)},touchstart(t){Qo("down",Ko(t),t.changedTouches[0],t)},touchend(t){Qo("up",Ko(t),t.changedTouches[0],t)}}),$o({name:"track",touchAction:"none",deps:["mousedown","touchstart","touchmove","touchend"],flow:{start:["mousedown","touchstart"],end:["mouseup","touchend"]},emits:["track"],info:{x:0,y:0,state:"start",started:!1,moves:[],addMove(t){this.moves.length>2&&this.moves.shift(),this.moves.push(t)},movefn:null,upfn:null,prevent:!1},reset(){this.info.state="start",this.info.started=!1,this.info.moves=[],this.info.x=0,this.info.y=0,this.info.prevent=!1,jo(this.info)},mousedown(t){if(!Fo(t))return;const e=Ko(t),o=this,n=t=>{const n=t.clientX,i=t.clientY;tn(o.info,n,i)&&(o.info.state=o.info.started?"mouseup"===t.type?"end":"track":"start","start"===o.info.state&&Zo("tap"),o.info.addMove({x:n,y:i}),Fo(t)||(o.info.state="end",jo(o.info)),e&&en(o.info,e,t),o.info.started=!0)};Uo(this.info,n,(t=>{o.info.started&&n(t),jo(o.info)})),this.info.x=t.clientX,this.info.y=t.clientY},touchstart(t){const e=t.changedTouches[0];this.info.x=e.clientX,this.info.y=e.clientY},touchmove(t){const e=Ko(t),o=t.changedTouches[0],n=o.clientX,i=o.clientY;tn(this.info,n,i)&&("start"===this.info.state&&Zo("tap"),this.info.addMove({x:n,y:i}),en(this.info,e,o),this.info.state="track",this.info.started=!0)},touchend(t){const e=Ko(t),o=t.changedTouches[0];this.info.started&&(this.info.state="end",this.info.addMove({x:o.clientX,y:o.clientY}),en(this.info,e,o))}}),$o({name:"tap",deps:["mousedown","click","touchstart","touchend"],flow:{start:["mousedown","touchstart"],end:["click","touchend"]},emits:["tap"],info:{x:NaN,y:NaN,prevent:!1},reset(){this.info.x=NaN,this.info.y=NaN,this.info.prevent=!1},mousedown(t){Fo(t)&&(this.info.x=t.clientX,this.info.y=t.clientY)},click(t){Fo(t)&&on(this.info,t)},touchstart(t){const e=t.changedTouches[0];this.info.x=e.clientX,this.info.y=e.clientY},touchend(t){on(this.info,t.changedTouches[0],t)}});const nn=J((t=>class extends t{ready(){super.ready(),this.addEventListener("keydown",(t=>{this._onKeyDown(t)})),this.addEventListener("keyup",(t=>{this._onKeyUp(t)}))}_onKeyDown(t){switch(t.key){case"Enter":this._onEnter(t);break;case"Escape":this._onEscape(t)}}_onKeyUp(t){}_onEnter(t){}_onEscape(t){}})),sn=t=>class extends(Co(nn(t))){get _activeKeys(){return[" "]}ready(){super.ready(),Go(this,"down",(t=>{this._shouldSetActive(t)&&this._setActive(!0)})),Go(this,"up",(()=>{this._setActive(!1)}))}disconnectedCallback(){super.disconnectedCallback(),this._setActive(!1)}_shouldSetActive(t){return!this.disabled}_onKeyDown(t){super._onKeyDown(t),this._shouldSetActive(t)&&this._activeKeys.includes(t.key)&&(this._setActive(!0),document.addEventListener("keyup",(t=>{this._activeKeys.includes(t.key)&&this._setActive(!1)}),{once:!0}))}_setActive(t){this.toggleAttribute("active",t)}}
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */let rn=!1;function an(){return rn}function ln(t){const e=t.style;if("hidden"===e.visibility||"none"===e.display)return!0;const o=window.getComputedStyle(t);return"hidden"===o.visibility||"none"===o.display}function dn(t,e){const o=Math.max(t.tabIndex,0),n=Math.max(e.tabIndex,0);return 0===o||0===n?n>o:o>n}function cn(t){const e=t.length;if(e<2)return t;const o=Math.ceil(e/2);return function(t,e){const o=[];for(;t.length>0&&e.length>0;)dn(t[0],e[0])?o.push(e.shift()):o.push(t.shift());return o.concat(t,e)}(cn(t.slice(0,o)),cn(t.slice(o)))}function hn(t){return null===t.offsetParent||ln(t)}function un(t){return t.getRootNode().activeElement===t}function mn(t,e){if(t.nodeType!==Node.ELEMENT_NODE||ln(t))return!1;const o=t,n=function(t){if(!function(t){return!t.matches('[tabindex="-1"]')&&(t.matches("input, select, textarea, button, object")?t.matches(":not([disabled])"):t.matches("a[href], area[href], iframe, [tabindex], [contentEditable]"))}(t))return-1;const e=t.getAttribute("tabindex")||0;return Number(e)}(o);let i=n>0;n>=0&&e.push(o);let s=[];return s="slot"===o.localName?o.assignedNodes({flatten:!0}):(o.shadowRoot||o).children,[...s].forEach((t=>{i=mn(t,e)||i})),i}window.addEventListener("keydown",(()=>{rn=!0}),{capture:!0}),window.addEventListener("mousedown",(()=>{rn=!1}),{capture:!0});
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const pn=J((t=>class extends t{get _keyboardActive(){return an()}ready(){this.addEventListener("focusin",(t=>{this._shouldSetFocus(t)&&this._setFocused(!0)})),this.addEventListener("focusout",(t=>{this._shouldRemoveFocus(t)&&this._setFocused(!1)})),super.ready()}disconnectedCallback(){super.disconnectedCallback(),this.hasAttribute("focused")&&this._setFocused(!1)}_setFocused(t){this.toggleAttribute("focused",t),this.toggleAttribute("focus-ring",t&&this._keyboardActive)}_shouldSetFocus(t){return!0}_shouldRemoveFocus(t){return!0}})),_n=t=>class extends(Co(t)){static get properties(){return{tabindex:{type:Number,reflectToAttribute:!0,observer:"_tabindexChanged"},_lastTabIndex:{type:Number}}}_disabledChanged(t,e){super._disabledChanged(t,e),t?(void 0!==this.tabindex&&(this._lastTabIndex=this.tabindex),this.tabindex=-1):e&&(this.tabindex=this._lastTabIndex)}_tabindexChanged(t){this.disabled&&-1!==t&&(this._lastTabIndex=t,this.tabindex=-1)}}
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,fn=t=>class extends(sn(_n(pn(t)))){static get properties(){return{tabindex:{type:Number,value:0,reflectToAttribute:!0}}}get _activeKeys(){return["Enter"," "]}ready(){super.ready(),this.hasAttribute("role")||this.setAttribute("role","button")}_onKeyDown(t){super._onKeyDown(t),this._activeKeys.includes(t.key)&&(t.preventDefault(),this.click())}}
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */c("vaadin-button",Ao,{moduleId:"vaadin-button-styles"});class vn extends(fn(co(_(He(Fe))))){static get is(){return"vaadin-button"}static get template(){return(t=>t`
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
`
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */)(Re)}ready(){super.ready(),this._tooltipController=new xo(this),this.addController(this._tooltipController)}}customElements.define(vn.is,vn),
/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
c("vaadin-menu-bar-button",n`
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
  `,{moduleId:"vaadin-menu-bar-button-styles"});class yn extends vn{static get is(){return"vaadin-menu-bar-button"}}customElements.define(yn.is,yn);
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const gn=document.createElement("template");gn.innerHTML='\n  <style>\n    @font-face {\n      font-family: \'lumo-icons\';\n      src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAABEgAAsAAAAAIjQAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAADsAAABUIIslek9TLzIAAAFEAAAAQwAAAFZAIUuKY21hcAAAAYgAAAD4AAADrsCU8d5nbHlmAAACgAAAC2cAABeAWri7U2hlYWQAAA3oAAAAMAAAADZa/6SsaGhlYQAADhgAAAAdAAAAJAbpA35obXR4AAAOOAAAABAAAACspBAAAGxvY2EAAA5IAAAAWAAAAFh57oA4bWF4cAAADqAAAAAfAAAAIAFKAXBuYW1lAAAOwAAAATEAAAIuUUJZCHBvc3QAAA/0AAABKwAAAelm8SzVeJxjYGRgYOBiMGCwY2BycfMJYeDLSSzJY5BiYGGAAJA8MpsxJzM9kYEDxgPKsYBpDiBmg4gCACY7BUgAeJxjYGS+yDiBgZWBgamKaQ8DA0MPhGZ8wGDIyAQUZWBlZsAKAtJcUxgcXjG+0mIO+p/FEMUcxDANKMwIkgMABn8MLQB4nO3SWW6DMABF0UtwCEnIPM/zhLK8LqhfXRybSP14XUYtHV9hGYQwQBNIo3cUIPkhQeM7rib1ekqnXg981XuC1qvy84lzojleh3puxL0hPjGjRU473teloEefAUNGjJkwZcacBUtWrNmwZceeA0dOnLlw5cadB09elPGhGf+j0NTI/65KfXerT6JhqKnpRKtgOpuqaTrtKjPUlqHmhto21I7pL6i6hlqY3q7qGWrfUAeGOjTUkaGODXViqFNDnRnq3FAXhro01JWhrg11Y6hbQ90Z6t5QD4Z6NNSToZ4N9WKoV0O9GerdUB+G+jTUl6GWRvkL24BkEXictVh9bFvVFb/nxvbz+7Rf/N6zHcd2bCfP+Wic1Z9N0jpNHCD9SNqqoVBgbQoMjY+pjA4hNnWa2pV1rHSIif0DGkyT2k10Kmu1Cag6huj4ZpqYBHSqJsTEJgZCG3TaVBFv595nO3ZIv4RIrPPuvefe884599zzO/cRF8G/tgn6CFFImNgkR0ggX8wlspbhSSWSdrC5ozd30s2dw5afzvgtyz9/zG9t1hV4RtF1pXolowvtzc2z6L2aYUQM45jKH9WDTvd1LRDoDASYWhfTzTyvboXz6uZX4ARX5wrF39y+HM2+CJ8d0pkyqBIqoze3D12ez4DrFoYzxI8dWwMrDlZ2DMqQAR9AROsJU+2smlTPaTTco52BVxXa2a2+I8vvqd2dVHm1LoPeTn/AZPRYGthDYOeZjBjKoFsVGulR3lGU95SeCK44oHU7MhWUGUKZDT3oSUcG2GWuh+EDDfUYA/jhIhl0TOsJNYSEu7mQmi3UzfXwZKA4BsVsHLXQYGgJW95qEtpJ1VcW9HiTriZBlFEqxsDjA09yCNUoQxxwd7KWSTt2y3GTKifkqHRCoWZc3m11Wa/dKdFgXD4kSYfkeJBKd8KMz7J8dZn/cGRCcLGDnA2Ge3bKzcvlnTDNthFWLH7Xt80ua5FMjA4WKelWv5Xo16vHuYzpRbJhhdVlftuRK0VlR27D9lu5TF0DPBi60OrHNO0AfP/uRWvhn/U3LXICE+nh+3IHPUJ8JE6GyBjZQLbjGchlrSgYngF8zyrIF4NJD3atUcgWsWunGN/UHX5B5/yg7uF87Nqp4Gf52F3gH73DjEZNRoqCKAr9giQJp5rGJABpiVE2htNhW9R8nw0jqYjCYcY4LIjwYNScf4WN06IZnZCEqsI4cFaQbo4Z1TsZBx40YhXkHOecaYE5oY37IIQ+iJJ+UsDYSun5MuRSBRZRUUhlY2DqOGajOR6zrSU/5My6l2DnusH1GQgnw5BZP7iuYM/ahcfQ7Z8y51ddfutvuwNqWQ0cBYr8fj0U0vsHpwerVaB2sWhXT2NExi2r1KUE2tUuVMnkepVQrxTmpQrZTG4iu8he8iPyM3KcPE/+RP5KPoE2CEAKclCBzXATxkYOtUY/o961PWRqsj0chRrHFBbtrjP9/P0ven5pcbRdpL94vfsy33e5+izuwz3nFLFPVNayPZx/jdG1fOChflFRvYzsW6L18efgLrSWIgvcqnGJYi4skO4xREURjbDuxKke5v0T3Mrzkt2fi31uyZlLLrqIpEuXXsMlgw442Jb0GAxjS1DM20kBoCzHLXm/jEm0IltdcvU0fEW24jgiwwRjVd9u4NJHcIyoHJcwvyVqgqj5hqBJ1ZWSJryh9p56UWhX1XbhRbW2ZopuZWsQd5y8mEQ8M+C6xjRYxZbDKWf5AgY+Qq/l6wSPk16zDFjowYuu+wjx13mfkxbyDDxadYT/LijZyI0THB+6yfLaWsRcO82zo9mWTNtpO18qlorZoIVMwSN40tky5DOQ1MCIAe24mvlsuwIIxPb10+uXDQ4uWz/9m3rj+ql7p6bufZARuPVq5tXtsn6KwfP8Jy0TeWOyNhUJN6mhX5rkUTtUppQWEMNTqEdaCGKFYKJaQrCE4JtDLYOlNEKmO5kBTPGY2A0N2sY3+dVlo1N9ycBsIGtOjQ2p/tlZvzo0ur4v6cOh8NTospB7U/X40KahoU3bGIH97dnwmtHlYffVG3R1YOwKM2vNhrPhCT5zk64sG53oS4b31aYjqe/B7+kQiXBN+b6h21hNUPMq29B8CU4elINdygMPKF1B+WBTG7Z9ZshpN/xwEuuDQZR+nuoo4CDaAiiwXmLpmukMQyPf/JMclqgL1ixZQ/nnP2VbdUODFGt2fgBvL123rlLYu/6A9ckb7F3K0/CyBMEu6aQoPscroCcacVehvyQyCZAsizsWWBkoLC+WAiWnOksLKaeuQDzGuqSk42aiYTiJ4zf9afl17SrqaTO1f+XlZAfIuYcq7/IqYMaMrksOJ6vHkOCPDq943xcCnHqVD9pHFRpMqSPXrIua1WNs+tOz1U+ciTCDpPk+c4QYJIHnYhxP/kVPAq+ahFpVhPcHp8qyarhiF+HsBU9Hrl+UZa876fbKipL0KqB6OdUveErgtOI97fZ63ae9SvWU6k2w1JfwqnUbHsYcFCJFrC/W12zIMMirWYEHxMPs6LGYSdkSZ5TsNP9PCpwnWC3HKZ1lydNjWHC2Mn3l6vL0dHn1ldP3LTSrX+vKrBqv7KmMr8p0SR6P1NqF63or6XRlIyO90f7+kf7+myOhvt4tq7f09oUiTc2/dycGgqFQcCDRLYmi1NL7fk0CknVMxEg/cdfs/TnpJMNkgqwj17B8beVazSrVbU4lG67IZYOCnWrYy3yBR9cyWcChywos3LJBEdhhFoAdYjiw0rLGm0xU5OzoGm5/ZfmHjVZpNNg6SznzGKDdwv2cCtVn6Eaxo12cfxLprpVtTcZ6hVx6dow7Yq7e8LXO8PY9Jgjoze9yCtU5FNbegcKkQMdCbt9au/te4Ebe0jkc0ukUL32eYnTpNs20h0KpUOhZPYwVcfhZnfdqeCvDfXiuCbAoYWcXERPc/mDQD3/hdF+wK4i/xv3kYfprIpAuMkk2kW3kdtS0kBIKpZwp8KxmsCyfM1MFzAss9LBkDxRyThiaqTLwKYKJVTwmWTudMyz+yks09346MDh4m72yOxCKrt1XMlQ1qPVlTEVVQ1ofdK/sCWjtZu9qGwZ8YZ9PPWlo1IV3eW3+U0aXblP39zrt+JPf6UhEQ1rUjNBULN+utyuaDNW34kpAVuSOeMTyWbSNWnooFu+QFNWQ4d/Ox4IPWx41fP/fB/Rjeoz08ezPA9TysMtmnOXfGN7Ui3xIYLDALrlDLOP09qtJuY2OeL0+QZXdRnR1nxRVBF/SOyKKPpcrn9mWzH4rH9IidE+PTNU2182+hOgSItrE1slByS24vaLvJpxOqe4Pduf3HJkZ+jLqUz9rRzB7p8gKcgWZwV1L8JtUS5Z2JxZSOCuBoMTQihMzLbCPA0KqGMAljRQjONklW/wjnXKy8vxT/Elvm3/KiMUMOoV0/vnDYlhec0SMKtt3/kKMyOt33tj2bqxQLsTjSGLl+EAsNhCnTyRGktW55EgCn/A4PlnWn+Mg8bgZrWqHxTbPwMuyy1u5YeZF2SUM7JRhddwRgiRuxpmgJmxn9ZW7XpcF3ViX/ar6ptRpGJ0S9Adg4qhb9sI3vbL7qNJV/y4i07t5TZBiho1imFoMz3gED+CtjYUxvP4SOxov4bFoNPg5aR1e+G4UgDPoedJTpogyCJ7oYvRqoVS0MQAy+CoNEdTDUjok5ZHZL/WtjV7rFj3PKQE3iKp7ou+rIxN3b9LB1dGjeT4cvKo3FrnWpYpuaFd/h3dtV8UeKN1Y9hpR3dt4p0H/zKuPQq0kZQUIIpuDfoiETsnIk+gCWMJZUXHtE8V9LkUc2TE8vOMbO4ax/MACabzyaGXc7u3FBr11ThBdB8SIeMAlCntG2KThHSPsaj2Dc9KNyY2a0KZ7ODaTHoRiFkeYz+shZBpCS4X6471KKKnuHd84edfk5F37d1XO5bbkcltu2ZLNbvnPXiUVAnVvprJrP+NObryjxrllS65md6Tm6wzFHRR4dY3QUUjb7MgxaIixU8hspi98fl/Xc+IB4iU66eCVL9YfAfahiSUt4TONS8x0D8W7u8vd3fGWx6OXlM/U1IoU/s61PGhpyXRFa3eReq2qG56lvmYtXavCC1iN7lbiBpWxXHU+cSlztVLVz0tVN600fVsLxaVDknhYioeoXP3t4lqV1r79MAw0GCI1FTL1YIGzPL1MMlJ9ZsN9P7lvA2yr9ZFUzwzPrVgxN/x/SS+chwB4nGNgZGBgAOLPrYdY4vltvjJwM78AijDUqG5oRND/XzNPZboF5HIwMIFEAU/lC+J4nGNgZGBgDvqfBSRfMAAB81QGRgZUoA0AVvYDbwAAAHicY2BgYGB+MTQwAM8EJo8AAAAAAE4AmgDoAQoBLAFOAXABmgHEAe4CGgKcAugEmgS8BNYE8gUOBSoFegXQBf4GRAZmBrYHGAeQCBgIUghqCP4JRgm+CdoKBAo+CoQKugr0C1QLmgvAeJxjYGRgYNBmTGEQZQABJiDmAkIGhv9gPgMAGJQBvAB4nG2RPU7DMBiG3/QP0UoIBGJh8QILavozdmRo9w7d09RpUzlx5LgVvQMn4BAcgoEzcAgOwVvzSZVQbcnf48fvFysJgGt8IcJxROiG9TgauODuj5ukG+EW+UG4jR4ehTv0Q+EunjER7uEWmk+IWpc0d3gVbuAKb8JN+nfhFvlDuI17fAp36L+Fu1jgR7iHp+jF7Arbz1Nb1nO93pnEncSJFtrVuS3VKB6e5EyX2iVer9TyoOr9eux9pjJnCzW1pdfGWFU5u9WpjzfeV5PBIBMfp7aAwQ4FLPrIkbKWqDHn+67pDRK4s4lzbsEux5qHvcIIMb/nueSMyTKkE3jWFdNLHLjW2PPmMa1Hxn3GjGW/wjT0HtOG09JU4WxLk9LH2ISuiv9twJn9y8fh9uIXI+BknAAAAHicbY7ZboMwEEW5CVBCSLrv+76kfJRjTwHFsdGAG+Xvy5JUfehIHp0rnxmNN/D6ir3/a4YBhvARIMQOIowQY4wEE0yxiz3s4wCHOMIxTnCKM5zjApe4wjVucIs73OMBj3jCM17wije84wMzfHqJ0EVmUkmmJo77oOmrHvfIRZbXsTCZplTZldlgb3TYGVHProwFs11t1A57tcON2rErR3PBqcwF1/6ctI6k0GSU4JHMSS6WghdJQ99sTbfuN7QLJ9vQ37dNrgyktnIxlDYLJNuqitpRbYWKFNuyDT6pog6oOYKHtKakeakqKjHXpPwlGRcsC+OqxLIiJpXqoqqDMreG2l5bv9Ri3TRX+c23DZna9WFFgmXuO6Ps1Jm/w6ErW8N3FbHn/QC444j0AA==) format(\'woff\');\n      font-weight: normal;\n      font-style: normal;\n    }\n\n    html {\n      --lumo-icons-align-center: "\\ea01";\n      --lumo-icons-align-left: "\\ea02";\n      --lumo-icons-align-right: "\\ea03";\n      --lumo-icons-angle-down: "\\ea04";\n      --lumo-icons-angle-left: "\\ea05";\n      --lumo-icons-angle-right: "\\ea06";\n      --lumo-icons-angle-up: "\\ea07";\n      --lumo-icons-arrow-down: "\\ea08";\n      --lumo-icons-arrow-left: "\\ea09";\n      --lumo-icons-arrow-right: "\\ea0a";\n      --lumo-icons-arrow-up: "\\ea0b";\n      --lumo-icons-bar-chart: "\\ea0c";\n      --lumo-icons-bell: "\\ea0d";\n      --lumo-icons-calendar: "\\ea0e";\n      --lumo-icons-checkmark: "\\ea0f";\n      --lumo-icons-chevron-down: "\\ea10";\n      --lumo-icons-chevron-left: "\\ea11";\n      --lumo-icons-chevron-right: "\\ea12";\n      --lumo-icons-chevron-up: "\\ea13";\n      --lumo-icons-clock: "\\ea14";\n      --lumo-icons-cog: "\\ea15";\n      --lumo-icons-cross: "\\ea16";\n      --lumo-icons-download: "\\ea17";\n      --lumo-icons-dropdown: "\\ea18";\n      --lumo-icons-edit: "\\ea19";\n      --lumo-icons-error: "\\ea1a";\n      --lumo-icons-eye: "\\ea1b";\n      --lumo-icons-eye-disabled: "\\ea1c";\n      --lumo-icons-menu: "\\ea1d";\n      --lumo-icons-minus: "\\ea1e";\n      --lumo-icons-ordered-list: "\\ea1f";\n      --lumo-icons-phone: "\\ea20";\n      --lumo-icons-photo: "\\ea21";\n      --lumo-icons-play: "\\ea22";\n      --lumo-icons-plus: "\\ea23";\n      --lumo-icons-redo: "\\ea24";\n      --lumo-icons-reload: "\\ea25";\n      --lumo-icons-search: "\\ea26";\n      --lumo-icons-undo: "\\ea27";\n      --lumo-icons-unordered-list: "\\ea28";\n      --lumo-icons-upload: "\\ea29";\n      --lumo-icons-user: "\\ea2a";\n    }\n  </style>\n',document.head.appendChild(gn.content);const bn=n`
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
`;c("vaadin-item",bn,{moduleId:"lumo-item"});const wn=n`
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
`;c("vaadin-context-menu-item",[bn,wn],{moduleId:"lumo-context-menu-item"});c("vaadin-menu-bar-item",[bn,wn,n`
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
`],{moduleId:"lumo-menu-bar-item"});const xn=n`
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
`;c("vaadin-list-box",xn,{moduleId:"lumo-list-box"});const An=n`
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
`;c("vaadin-context-menu-list-box",[xn,An],{moduleId:"lumo-context-menu-list-box"}),c("vaadin-menu-bar-list-box",[xn,An],{moduleId:"lumo-menu-bar-list-box"});
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Cn=n`
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
`;c("",Cn,{moduleId:"lumo-overlay"});
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Pn=n`
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
`;c("",Pn,{moduleId:"lumo-menu-overlay-core"});const En=[Cn,Pn,n`
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
`];c("",En,{moduleId:"lumo-menu-overlay"});const On=n`
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
`;c("vaadin-context-menu-overlay",[En,On],{moduleId:"lumo-context-menu-overlay"});c("vaadin-menu-bar-overlay",[En,On,n`
  :host(:first-of-type) {
    padding-top: var(--lumo-space-xs);
  }
`],{moduleId:"lumo-menu-bar-overlay"}),c("vaadin-menu-bar",n`
    :host([has-single-button]) ::slotted(vaadin-menu-bar-button) {
      border-radius: var(--lumo-border-radius-m);
    }

    :host([theme~='end-aligned']) ::slotted(vaadin-menu-bar-button:first-of-type),
    :host([theme~='end-aligned'][has-single-button]) ::slotted(vaadin-menu-bar-button) {
      margin-inline-start: auto;
    }
  `,{moduleId:"lumo-menu-bar"}),c("vaadin-overlay",Cn,{moduleId:"lumo-vaadin-overlay"});
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
let Tn=!1,Sn=[],kn=[];function Nn(){Tn=!0,requestAnimationFrame((function(){Tn=!1,function(t){for(;t.length;)Ln(t.shift())}(Sn),setTimeout((function(){!function(t){for(let e=0,o=t.length;e<o;e++)Ln(t.shift())}(kn)}))}))}function Ln(t){const e=t[0],o=t[1],n=t[2];try{o.apply(e,n)}catch(t){setTimeout((()=>{throw t}))}}
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Mn=t=>t.test(navigator.userAgent),In=t=>t.test(navigator.platform);Mn(/Android/u),Mn(/Chrome/u)&&/Google Inc/u.test(navigator.vendor),Mn(/Firefox/u);const zn=In(/^iPad/u)||In(/^Mac/u)&&navigator.maxTouchPoints>1,Dn=In(/^iPhone/u)||zn;Mn(/^((?!chrome|android).)*safari/iu);const Rn=(()=>{try{return document.createEvent("TouchEvent"),!0}catch(t){return!1}})(),Bn=[];
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class Fn{constructor(t){this.host=t,this.__trapNode=null,this.__onKeyDown=this.__onKeyDown.bind(this)}get __focusableElements(){return function(t){const e=[];return mn(t,e)?cn(e):e}(this.__trapNode)}get __focusedElementIndex(){const t=this.__focusableElements;return t.indexOf(t.filter(un).pop())}hostConnected(){document.addEventListener("keydown",this.__onKeyDown)}hostDisconnected(){document.removeEventListener("keydown",this.__onKeyDown)}trapFocus(t){if(this.__trapNode=t,0===this.__focusableElements.length)throw this.__trapNode=null,new Error("The trap node should have at least one focusable descendant or be focusable itself.");Bn.push(this),-1===this.__focusedElementIndex&&this.__focusableElements[0].focus()}releaseFocus(){this.__trapNode=null,Bn.pop()}__onKeyDown(t){if(this.__trapNode&&this===Array.from(Bn).pop()&&"Tab"===t.key){t.preventDefault();const e=t.shiftKey;this.__focusNextElement(e)}}__focusNextElement(t=!1){const e=this.__focusableElements,o=t?-1:1,n=this.__focusedElementIndex,i=e[(e.length+n+o)%e.length];i.focus(),"input"===i.localName&&i.select()}}
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */function Hn(t){window.Vaadin&&window.Vaadin.templateRendererCallback?window.Vaadin.templateRendererCallback(t):t.querySelector("template")&&console.warn(`WARNING: <template> inside <${t.localName}> is no longer supported. Import @vaadin/polymer-legacy-adapter/template-renderer.js to enable compatibility.`)}
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */class Un extends(_(ro(He(Fe)))){static get template(){return Re`
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
    `}static get is(){return"vaadin-overlay"}static get properties(){return{opened:{type:Boolean,notify:!0,observer:"_openedChanged",reflectToAttribute:!0},owner:Element,renderer:Function,withBackdrop:{type:Boolean,value:!1,reflectToAttribute:!0},model:Object,modeless:{type:Boolean,value:!1,reflectToAttribute:!0,observer:"_modelessChanged"},hidden:{type:Boolean,reflectToAttribute:!0,observer:"_hiddenChanged"},focusTrap:{type:Boolean,value:!1},restoreFocusOnClose:{type:Boolean,value:!1},restoreFocusNode:{type:HTMLElement},_mouseDownInside:{type:Boolean},_mouseUpInside:{type:Boolean},_oldOwner:Element,_oldModel:Object,_oldRenderer:Object,_oldOpened:Boolean}}static get observers(){return["_rendererOrDataChanged(renderer, owner, model, opened)"]}static get __attachedInstances(){return Array.from(document.body.children).filter((t=>t instanceof Un&&!t.hasAttribute("closing"))).sort(((t,e)=>t.__zIndex-e.__zIndex||0))}constructor(){super(),this._boundMouseDownListener=this._mouseDownListener.bind(this),this._boundMouseUpListener=this._mouseUpListener.bind(this),this._boundOutsideClickListener=this._outsideClickListener.bind(this),this._boundKeydownListener=this._keydownListener.bind(this),Dn&&(this._boundIosResizeListener=()=>this._detectIosNavbar()),this.__focusTrapController=new Fn(this)}get _last(){return this===Un.__attachedInstances.pop()}ready(){super.ready(),this.addEventListener("click",(()=>{})),this.$.backdrop.addEventListener("click",(()=>{})),this.addController(this.__focusTrapController),Hn(this)}_detectIosNavbar(){if(!this.opened)return;const t=window.innerHeight,e=window.innerWidth>t,o=document.documentElement.clientHeight;e&&o>t?this.style.setProperty("--vaadin-overlay-viewport-bottom",o-t+"px"):this.style.setProperty("--vaadin-overlay-viewport-bottom","0")}close(t){const e=new CustomEvent("vaadin-overlay-close",{bubbles:!0,cancelable:!0,detail:{sourceEvent:t}});this.dispatchEvent(e),e.defaultPrevented||(this.opened=!1)}connectedCallback(){super.connectedCallback(),this._boundIosResizeListener&&(this._detectIosNavbar(),window.addEventListener("resize",this._boundIosResizeListener))}disconnectedCallback(){super.disconnectedCallback(),this._boundIosResizeListener&&window.removeEventListener("resize",this._boundIosResizeListener)}requestContentUpdate(){this.renderer&&this.renderer.call(this.owner,this,this.owner,this.model)}_mouseDownListener(t){this._mouseDownInside=t.composedPath().indexOf(this.$.overlay)>=0}_mouseUpListener(t){this._mouseUpInside=t.composedPath().indexOf(this.$.overlay)>=0}_shouldCloseOnOutsideClick(t){return this._last}_outsideClickListener(t){if(t.composedPath().includes(this.$.overlay)||this._mouseDownInside||this._mouseUpInside)return this._mouseDownInside=!1,void(this._mouseUpInside=!1);if(!this._shouldCloseOnOutsideClick(t))return;const e=new CustomEvent("vaadin-overlay-outside-click",{bubbles:!0,cancelable:!0,detail:{sourceEvent:t}});this.dispatchEvent(e),this.opened&&!e.defaultPrevented&&this.close(t)}_keydownListener(t){if(this._last&&(!this.modeless||t.composedPath().includes(this.$.overlay))&&"Escape"===t.key){const e=new CustomEvent("vaadin-overlay-escape-press",{bubbles:!0,cancelable:!0,detail:{sourceEvent:t}});this.dispatchEvent(e),this.opened&&!e.defaultPrevented&&this.close(t)}}_openedChanged(t,e){var o,n,i;t?(this.__restoreFocusNode=this._getActiveElement(),this._animatedOpening(),o=this,n=()=>{this.focusTrap&&this.__focusTrapController.trapFocus(this.$.overlay);const t=new CustomEvent("vaadin-overlay-open",{bubbles:!0});this.dispatchEvent(t)},Tn||Nn(),kn.push([o,n,i]),document.addEventListener("keydown",this._boundKeydownListener),this.modeless||this._addGlobalListeners()):e&&(this.focusTrap&&this.__focusTrapController.releaseFocus(),this._animatedClosing(),document.removeEventListener("keydown",this._boundKeydownListener),this.modeless||this._removeGlobalListeners())}_hiddenChanged(t){t&&this.hasAttribute("closing")&&this._flushAnimation("closing")}_shouldAnimate(){const t=getComputedStyle(this),e=t.getPropertyValue("animation-name");return!("none"===t.getPropertyValue("display"))&&e&&"none"!==e}_enqueueAnimation(t,e){const o=`__${t}Handler`,n=t=>{t&&t.target!==this||(e(),this.removeEventListener("animationend",n),delete this[o])};this[o]=n,this.addEventListener("animationend",n)}_flushAnimation(t){const e=`__${t}Handler`;"function"==typeof this[e]&&this[e]()}_animatedOpening(){this.parentNode===document.body&&this.hasAttribute("closing")&&this._flushAnimation("closing"),this._attachOverlay(),this.modeless||this._enterModalState(),this.setAttribute("opening",""),this._shouldAnimate()?this._enqueueAnimation("opening",(()=>{this._finishOpening()})):this._finishOpening()}_attachOverlay(){this._placeholder=document.createComment("vaadin-overlay-placeholder"),this.parentNode.insertBefore(this._placeholder,this),document.body.appendChild(this),this.bringToFront()}_finishOpening(){this.removeAttribute("opening")}_finishClosing(){this._detachOverlay(),this.$.overlay.style.removeProperty("pointer-events"),this.removeAttribute("closing"),this.dispatchEvent(new CustomEvent("vaadin-overlay-closed"))}_animatedClosing(){if(this.hasAttribute("opening")&&this._flushAnimation("opening"),this._placeholder){this._exitModalState();const t=this.restoreFocusNode||this.__restoreFocusNode;if(this.restoreFocusOnClose&&t){const e=this._getActiveElement();(e===document.body||this._deepContains(e))&&setTimeout((()=>t.focus())),this.__restoreFocusNode=null}this.setAttribute("closing",""),this.dispatchEvent(new CustomEvent("vaadin-overlay-closing")),this._shouldAnimate()?this._enqueueAnimation("closing",(()=>{this._finishClosing()})):this._finishClosing()}}_detachOverlay(){this._placeholder.parentNode.insertBefore(this,this._placeholder),this._placeholder.parentNode.removeChild(this._placeholder)}_modelessChanged(t){t?(this._removeGlobalListeners(),this._exitModalState()):this.opened&&(this._addGlobalListeners(),this._enterModalState())}_addGlobalListeners(){document.addEventListener("mousedown",this._boundMouseDownListener),document.addEventListener("mouseup",this._boundMouseUpListener),document.documentElement.addEventListener("click",this._boundOutsideClickListener,!0)}_enterModalState(){"none"!==document.body.style.pointerEvents&&(this._previousDocumentPointerEvents=document.body.style.pointerEvents,document.body.style.pointerEvents="none"),Un.__attachedInstances.forEach((t=>{t!==this&&(t.shadowRoot.querySelector('[part="overlay"]').style.pointerEvents="none")}))}_removeGlobalListeners(){document.removeEventListener("mousedown",this._boundMouseDownListener),document.removeEventListener("mouseup",this._boundMouseUpListener),document.documentElement.removeEventListener("click",this._boundOutsideClickListener,!0)}_exitModalState(){void 0!==this._previousDocumentPointerEvents&&(document.body.style.pointerEvents=this._previousDocumentPointerEvents,delete this._previousDocumentPointerEvents);const t=Un.__attachedInstances;let e;for(;(e=t.pop())&&(e===this||(e.shadowRoot.querySelector('[part="overlay"]').style.removeProperty("pointer-events"),e.modeless)););}_rendererOrDataChanged(t,e,o,n){const i=this._oldOwner!==e||this._oldModel!==o;this._oldModel=o,this._oldOwner=e;const s=this._oldRenderer!==t;this._oldRenderer=t;const r=this._oldOpened!==n;this._oldOpened=n,s&&(this.innerHTML="",delete this._$litPart$),n&&t&&(s||r||i)&&this.requestContentUpdate()}_getActiveElement(){let t=document.activeElement||document.body;for(;t.shadowRoot&&t.shadowRoot.activeElement;)t=t.shadowRoot.activeElement;return t}_deepContains(t){if(this.contains(t))return!0;let e=t;const o=t.ownerDocument;for(;e&&e!==o&&e!==this;)e=e.parentNode||e.host;return e===this}bringToFront(){let t="";const e=Un.__attachedInstances.filter((t=>t!==this)).pop();if(e){t=e.__zIndex+1}this.style.zIndex=t,this.__zIndex=t||parseFloat(getComputedStyle(this).zIndex)}}customElements.define(Un.is,Un);
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const jn=t=>class extends(sn(pn(t))){static get properties(){return{_hasVaadinItemMixin:{value:!0},selected:{type:Boolean,value:!1,reflectToAttribute:!0,observer:"_selectedChanged"},_value:String}}get _activeKeys(){return["Enter"," "]}get value(){return void 0!==this._value?this._value:this.textContent.trim()}set value(t){this._value=t}ready(){super.ready();const t=this.getAttribute("value");null!==t&&(this.value=t)}focus(){this.disabled||(super.focus(),this._setFocused(!0))}_shouldSetActive(t){return!(this.disabled||"keydown"===t.type&&t.defaultPrevented)}_selectedChanged(t){this.setAttribute("aria-selected",t)}_disabledChanged(t){super._disabledChanged(t),t&&(this.selected=!1,this.blur())}_onKeyDown(t){super._onKeyDown(t),this._activeKeys.includes(t.key)&&!t.defaultPrevented&&(t.preventDefault(),this.click())}}
/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;class Yn extends(jn(_(ro(Fe)))){static get is(){return"vaadin-menu-bar-item"}static get template(){return Re`
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
    `}connectedCallback(){super.connectedCallback(),this.setAttribute("role","menuitem")}}customElements.define(Yn.is,Yn);
/**
 * @license
 * Copyright (c) 2022 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const qn=t=>class extends(nn(t)){get focused(){return(this._getItems()||[]).find(un)}get _vertical(){return!0}focus(){const t=this._getItems();if(Array.isArray(t)){const e=this._getAvailableIndex(t,0,null,(t=>!hn(t)));e>=0&&t[e].focus()}}_getItems(){return Array.from(this.children)}_onKeyDown(t){if(super._onKeyDown(t),t.metaKey||t.ctrlKey)return;const{key:e}=t,o=this._getItems()||[],n=o.indexOf(this.focused);let i,s;const r=!this._vertical&&"rtl"===this.getAttribute("dir")?-1:1;this.__isPrevKey(e)?(s=-r,i=n-r):this.__isNextKey(e)?(s=r,i=n+r):"Home"===e?(s=1,i=0):"End"===e&&(s=-1,i=o.length-1),i=this._getAvailableIndex(o,i,s,(t=>!hn(t))),i>=0&&(t.preventDefault(),this._focus(i,!0))}__isPrevKey(t){return this._vertical?"ArrowUp"===t:"ArrowLeft"===t}__isNextKey(t){return this._vertical?"ArrowDown"===t:"ArrowRight"===t}_focus(t,e=!1){const o=this._getItems();this._focusItem(o[t],e)}_focusItem(t){t&&(t.focus(),t.setAttribute("focus-ring",""))}_getAvailableIndex(t,e,o,n){const i=t.length;let s=e;for(let e=0;"number"==typeof s&&e<i;e+=1,s+=o||1){s<0?s=i-1:s>=i&&(s=0);const e=t[s];if(!e.hasAttribute("disabled")&&this.__isMatchingItem(e,n))return s}return-1}__isMatchingItem(t,e){return"function"!=typeof e||e(t)}}
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,Vn=t=>class extends(qn(t)){static get properties(){return{_hasVaadinListMixin:{value:!0},disabled:{type:Boolean,value:!1,reflectToAttribute:!0},selected:{type:Number,reflectToAttribute:!0,notify:!0},orientation:{type:String,reflectToAttribute:!0,value:""},items:{type:Array,readOnly:!0,notify:!0},_searchBuf:{type:String,value:""}}}static get observers(){return["_enhanceItems(items, orientation, selected, disabled)"]}get _isRTL(){return!this._vertical&&"rtl"===this.getAttribute("dir")}get _scrollerElement(){return console.warn(`Please implement the '_scrollerElement' property in <${this.localName}>`),this}get _vertical(){return"horizontal"!==this.orientation}focus(){this._observer&&this._observer.flush();const t=this.querySelector('[tabindex="0"]')||(this.items?this.items[0]:null);this._focusItem(t)}ready(){super.ready(),this.addEventListener("click",(t=>this._onClick(t))),this._observer=new go(this,(()=>{this._setItems(this._filterItems(go.getFlattenedNodes(this)))}))}_getItems(){return this.items}_enhanceItems(t,e,o,n){if(!n&&t){this.setAttribute("aria-orientation",e||"vertical"),t.forEach((t=>{e?t.setAttribute("orientation",e):t.removeAttribute("orientation")})),this._setFocusable(o||0);const n=t[o];t.forEach((t=>{t.selected=t===n})),n&&!n.disabled&&this._scrollToItem(o)}}_filterItems(t){return t.filter((t=>t._hasVaadinItemMixin))}_onClick(t){if(t.metaKey||t.shiftKey||t.ctrlKey||t.defaultPrevented)return;const e=this._filterItems(t.composedPath())[0];let o;e&&!e.disabled&&(o=this.items.indexOf(e))>=0&&(this.selected=o)}_searchKey(t,e){this._searchReset=oo.debounce(this._searchReset,Ze.after(500),(()=>{this._searchBuf=""})),this._searchBuf+=e.toLowerCase(),this.items.some((t=>this.__isMatchingKey(t)))||(this._searchBuf=e.toLowerCase());const o=1===this._searchBuf.length?t+1:t;return this._getAvailableIndex(this.items,o,1,(t=>this.__isMatchingKey(t)&&"none"!==getComputedStyle(t).display))}__isMatchingKey(t){return t.textContent.replace(/[^\p{L}\p{Nd}]/gu,"").toLowerCase().startsWith(this._searchBuf)}_onKeyDown(t){if(t.metaKey||t.ctrlKey)return;const e=t.key,o=this.items.indexOf(this.focused);if(/[a-zA-Z0-9]/u.test(e)&&1===e.length){const t=this._searchKey(o,e);t>=0&&this._focus(t)}else super._onKeyDown(t)}_isItemHidden(t){return"none"===getComputedStyle(t).display}_setFocusable(t){t=this._getAvailableIndex(this.items,t,1);const e=this.items[t];this.items.forEach((t=>{t.tabIndex=t===e?0:-1}))}_focus(t){this.items.forEach(((e,o)=>{e.focused=o===t})),this._setFocusable(t),this._scrollToItem(t),super._focus(t)}_scrollToItem(t){const e=this.items[t];if(!e)return;const o=this._vertical?["top","bottom"]:this._isRTL?["right","left"]:["left","right"],n=this._scrollerElement.getBoundingClientRect(),i=(this.items[t+1]||e).getBoundingClientRect(),s=(this.items[t-1]||e).getBoundingClientRect();let r=0;!this._isRTL&&i[o[1]]>=n[o[1]]||this._isRTL&&i[o[1]]<=n[o[1]]?r=i[o[1]]-n[o[1]]:(!this._isRTL&&s[o[0]]<=n[o[0]]||this._isRTL&&s[o[0]]>=n[o[0]])&&(r=s[o[0]]-n[o[0]]),this._scroll(r)}_scroll(t){if(this._vertical)this._scrollerElement.scrollTop+=t;else{const e=this.getAttribute("dir")||"ltr",o=
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
function(t,e){const{scrollLeft:o}=t;return"rtl"!==e?o:t.scrollWidth-t.clientWidth+o}(this._scrollerElement,e)+t;!function(t,e,o){t.scrollLeft="rtl"!==e?o:t.clientWidth-t.scrollWidth+o}(this._scrollerElement,e,o)}}}
/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;class Kn extends(Vn(_(ro(He(Fe))))){static get is(){return"vaadin-menu-bar-list-box"}static get template(){return Re`
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
    `}static get properties(){return{orientation:{readOnly:!0}}}get _scrollerElement(){return this.shadowRoot.querySelector('[part="items"]')}ready(){super.ready(),this.setAttribute("role","menu")}}customElements.define(Kn.is,Kn);
/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const Wn={start:"top",end:"bottom"},Gn={start:"left",end:"right"},Jn=new ResizeObserver((t=>{setTimeout((()=>{t.forEach((t=>{t.target.__overlay&&t.target.__overlay._updatePosition()}))}))})),$n=t=>class extends t{static get properties(){return{positionTarget:{type:Object,value:null},horizontalAlign:{type:String,value:"start"},verticalAlign:{type:String,value:"top"},noHorizontalOverlap:{type:Boolean,value:!1},noVerticalOverlap:{type:Boolean,value:!1},requiredVerticalSpace:{type:Number,value:0}}}static get observers(){return["__positionSettingsChanged(horizontalAlign, verticalAlign, noHorizontalOverlap, noVerticalOverlap, requiredVerticalSpace)","__overlayOpenedChanged(opened, positionTarget)"]}constructor(){super(),this.__onScroll=this.__onScroll.bind(this),this._updatePosition=this._updatePosition.bind(this)}connectedCallback(){super.connectedCallback(),this.opened&&this.__addUpdatePositionEventListeners()}disconnectedCallback(){super.disconnectedCallback(),this.__removeUpdatePositionEventListeners()}__addUpdatePositionEventListeners(){window.addEventListener("resize",this._updatePosition),this.__positionTargetAncestorRootNodes=function(t){const e=[];for(;t;){if(t.nodeType===Node.DOCUMENT_NODE){e.push(t);break}t.nodeType!==Node.DOCUMENT_FRAGMENT_NODE?t=t.assignedSlot?t.assignedSlot:t.parentNode:(e.push(t),t=t.host)}return e}(this.positionTarget),this.__positionTargetAncestorRootNodes.forEach((t=>{t.addEventListener("scroll",this.__onScroll,!0)}))}__removeUpdatePositionEventListeners(){window.removeEventListener("resize",this._updatePosition),this.__positionTargetAncestorRootNodes&&(this.__positionTargetAncestorRootNodes.forEach((t=>{t.removeEventListener("scroll",this.__onScroll,!0)})),this.__positionTargetAncestorRootNodes=null)}__overlayOpenedChanged(t,e){if(this.__removeUpdatePositionEventListeners(),e&&(e.__overlay=null,Jn.unobserve(e),t&&(this.__addUpdatePositionEventListeners(),e.__overlay=this,Jn.observe(e))),t){const t=getComputedStyle(this);this.__margins||(this.__margins={},["top","bottom","left","right"].forEach((e=>{this.__margins[e]=parseInt(t[e],10)}))),this.setAttribute("dir",t.direction),this._updatePosition(),requestAnimationFrame((()=>this._updatePosition()))}}__positionSettingsChanged(){this._updatePosition()}__onScroll(t){this.contains(t.target)||this._updatePosition()}_updatePosition(){if(!this.positionTarget||!this.opened)return;const t=this.positionTarget.getBoundingClientRect(),e=this.__shouldAlignStartVertically(t);this.style.justifyContent=e?"flex-start":"flex-end";const o=this.__isRTL,n=this.__shouldAlignStartHorizontally(t,o),i=!o&&n||o&&!n;this.style.alignItems=i?"flex-start":"flex-end";const s=this.getBoundingClientRect(),r=this.__calculatePositionInOneDimension(t,s,this.noVerticalOverlap,Wn,this,e),a=this.__calculatePositionInOneDimension(t,s,this.noHorizontalOverlap,Gn,this,n);Object.assign(this.style,r,a),this.toggleAttribute("bottom-aligned",!e),this.toggleAttribute("top-aligned",e),this.toggleAttribute("end-aligned",!i),this.toggleAttribute("start-aligned",i)}__shouldAlignStartHorizontally(t,e){const o=Math.max(this.__oldContentWidth||0,this.$.overlay.offsetWidth);this.__oldContentWidth=this.$.overlay.offsetWidth;const n=Math.min(window.innerWidth,document.documentElement.clientWidth),i=!e&&"start"===this.horizontalAlign||e&&"end"===this.horizontalAlign;return this.__shouldAlignStart(t,o,n,this.__margins,i,this.noHorizontalOverlap,Gn)}__shouldAlignStartVertically(t){const e=this.requiredVerticalSpace||Math.max(this.__oldContentHeight||0,this.$.overlay.offsetHeight);this.__oldContentHeight=this.$.overlay.offsetHeight;const o=Math.min(window.innerHeight,document.documentElement.clientHeight),n="top"===this.verticalAlign;return this.__shouldAlignStart(t,e,o,this.__margins,n,this.noVerticalOverlap,Wn)}__shouldAlignStart(t,e,o,n,i,s,r){const a=o-t[s?r.end:r.start]-n[r.end],l=t[s?r.start:r.end]-n[r.start],d=i?a:l;return i===(d>(i?l:a)||d>e)}__adjustBottomProperty(t,e,o){let n;if(t===e.end){if(e.end===Wn.end){const t=Math.min(window.innerHeight,document.documentElement.clientHeight);if(o>t&&this.__oldViewportHeight){n=o-(this.__oldViewportHeight-t)}this.__oldViewportHeight=t}if(e.end===Gn.end){const t=Math.min(window.innerWidth,document.documentElement.clientWidth);if(o>t&&this.__oldViewportWidth){n=o-(this.__oldViewportWidth-t)}this.__oldViewportWidth=t}}return n}__calculatePositionInOneDimension(t,e,o,n,i,s){const r=s?n.start:n.end,a=s?n.end:n.start,l=parseFloat(i.style[r]||getComputedStyle(i)[r]),d=this.__adjustBottomProperty(r,n,l),c=e[s?n.start:n.end]-t[o===s?n.end:n.start];return{[r]:d?`${d}px`:`${l+c*(s?-1:1)}px`,[a]:""}}}
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,Xn=t=>class extends($n(t)){static get properties(){return{parentOverlay:{type:Object,readOnly:!0}}}static get observers(){return["_themeChanged(_theme)"]}ready(){super.ready(),this.addEventListener("keydown",(t=>{if(!t.defaultPrevented&&t.composedPath()[0]===this.$.overlay&&[38,40].indexOf(t.keyCode)>-1){const e=this.getFirstChild();e&&Array.isArray(e.items)&&e.items.length&&(t.preventDefault(),38===t.keyCode?e.items[e.items.length-1].focus():e.focus())}}))}getFirstChild(){return this.querySelector(":not(style):not(slot)")}_themeChanged(){this.close()}getBoundaries(){const t=this.getBoundingClientRect(),e=this.$.overlay.getBoundingClientRect();let o=t.bottom-e.height;const n=this.parentOverlay;if(n&&n.hasAttribute("bottom-aligned")){const t=getComputedStyle(n);o=o-parseFloat(t.bottom)-parseFloat(t.height)}return{xMax:t.right-e.width,xMin:t.left+e.width,yMax:o}}_updatePosition(){if(super._updatePosition(),this.positionTarget&&this.parentOverlay){const t=this.$.content,e=getComputedStyle(t);!!this.style.left?this.style.left=`${parseFloat(this.style.left)+parseFloat(e.paddingLeft)}px`:this.style.right=`${parseFloat(this.style.right)+parseFloat(e.paddingRight)}px`;!!this.style.bottom?this.style.bottom=parseFloat(this.style.bottom)-parseFloat(e.paddingBottom)+"px":this.style.top=parseFloat(this.style.top)-parseFloat(e.paddingTop)+"px"}}}
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */,Zn=n`
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
`
/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;c("vaadin-menu-bar-overlay",Zn,{moduleId:"vaadin-menu-bar-overlay-styles"});class Qn extends(Xn(Un)){static get is(){return"vaadin-menu-bar-overlay"}}customElements.define(Qn.is,Qn),
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
$o({name:"vaadin-contextmenu",deps:["touchstart","touchmove","touchend","contextmenu"],flow:{start:["touchstart","contextmenu"],end:["contextmenu"]},emits:["vaadin-contextmenu"],info:{sourceEvent:null},reset(){this.info.sourceEvent=null,this._cancelTimer(),this.info.touchJob=null,this.info.touchStartCoords=null},_cancelTimer(){this._timerId&&(clearTimeout(this._timerId),delete this._fired)},_setSourceEvent(t){this.info.sourceEvent=t;const e=t.composedPath();this.info.sourceEvent.__composedPath=e},touchstart(t){this._setSourceEvent(t),this.info.touchStartCoords={x:t.changedTouches[0].clientX,y:t.changedTouches[0].clientY};const e=t.composedPath()[0]||t.target;this._timerId=setTimeout((()=>{const o=t.changedTouches[0];t.shiftKey||(Dn&&(this._fired=!0,this.fire(e,o.clientX,o.clientY)),Zo("tap"))}),500)},touchmove(t){const e=this.info.touchStartCoords;(Math.abs(e.x-t.changedTouches[0].clientX)>15||Math.abs(e.y-t.changedTouches[0].clientY)>15)&&this._cancelTimer()},touchend(t){this._fired&&t.preventDefault(),this._cancelTimer()},contextmenu(t){t.shiftKey||(this._setSourceEvent(t),this.fire(t.target,t.clientX,t.clientY),Zo("tap"))},fire(t,e,o){const n=this.info.sourceEvent,i=new Event("vaadin-contextmenu",{bubbles:!0,cancelable:!0,composed:!0});i.detail={x:e,y:o,sourceEvent:n},t.dispatchEvent(i),i.defaultPrevented&&n&&n.preventDefault&&n.preventDefault()}}),
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
c("vaadin-context-menu-overlay",Zn,{moduleId:"vaadin-context-menu-overlay-styles"});class ti extends(Xn(Un)){static get is(){return"vaadin-context-menu-overlay"}}customElements.define(ti.is,ti);
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class ei{constructor(t,e){this.query=t,this.callback=e,this._boundQueryHandler=this._queryHandler.bind(this)}hostConnected(){this._removeListener(),this._mediaQuery=window.matchMedia(this.query),this._addListener(),this._queryHandler(this._mediaQuery)}hostDisconnected(){this._removeListener()}_addListener(){this._mediaQuery&&this._mediaQuery.addListener(this._boundQueryHandler)}_removeListener(){this._mediaQuery&&this._mediaQuery.removeListener(this._boundQueryHandler),this._mediaQuery=null}_queryHandler(t){"function"==typeof this.callback&&this.callback(t.matches)}}
/**
 * @license
 * Copyright (c) 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */const oi=t=>class extends t{static get properties(){return{overlayClass:{type:String},_overlayElement:{type:Object}}}static get observers(){return["__updateOverlayClassNames(overlayClass, _overlayElement)"]}__updateOverlayClassNames(t,e){if(!e)return;if(void 0===t)return;const{classList:o}=e;if(this.__initialClasses||(this.__initialClasses=new Set(o)),Array.isArray(this.__previousClasses)){const t=this.__previousClasses.filter((t=>!this.__initialClasses.has(t)));t.length>0&&o.remove(...t)}const n="string"==typeof t?t.split(" "):[];n.length>0&&o.add(...n),this.__previousClasses=n}}
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;class ni extends(jn(_(ro(Fe)))){static get is(){return"vaadin-context-menu-item"}static get template(){return Re`
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
    `}ready(){super.ready(),this.setAttribute("role","menuitem")}}customElements.define(ni.is,ni);
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class ii extends(Vn(_(ro(He(Fe))))){static get is(){return"vaadin-context-menu-list-box"}static get template(){return Re`
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
    `}static get properties(){return{orientation:{readOnly:!0}}}get _scrollerElement(){return this.shadowRoot.querySelector('[part="items"]')}ready(){super.ready(),this.setAttribute("role","menu")}}customElements.define(ii.is,ii);
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const si=t=>class extends t{static get properties(){return{items:Array}}get _tagNamePrefix(){return"vaadin-context-menu"}ready(){super.ready(),this.__itemsOutsideClickListener=t=>{t.composedPath().some((t=>t.localName===`${this._tagNamePrefix}-overlay`))||this.dispatchEvent(new CustomEvent("items-outside-click"))},this.addEventListener("items-outside-click",(()=>this.items&&this.close()))}connectedCallback(){super.connectedCallback(),document.documentElement.addEventListener("click",this.__itemsOutsideClickListener)}disconnectedCallback(){super.disconnectedCallback(),document.documentElement.removeEventListener("click",this.__itemsOutsideClickListener)}__forwardFocus(){const t=this.$.overlay,e=t.getFirstChild();if(t.parentOverlay){const o=t.parentOverlay.querySelector("[expanded]");o&&o.hasAttribute("focused")&&e?e.focus():t.$.overlay.focus()}else e&&e.focus()}__openSubMenu(t,e,o){t.items=e._item.children,t.listenOn=e,t.overlayClass=o;const n=this.$.overlay,i=t.$.overlay;i.positionTarget=e,i.noHorizontalOverlap=!0,i._setParentOverlay(n),n.hasAttribute("theme")?t.setAttribute("theme",n.getAttribute("theme")):t.removeAttribute("theme");t.$.overlay.$.content.style.minWidth="",e.dispatchEvent(new CustomEvent("opensubmenu",{detail:{children:e._item.children}}))}__createComponent(t){let e;return e=t.component instanceof HTMLElement?t.component:document.createElement(t.component||`${this._tagNamePrefix}-item`),e._hasVaadinItemMixin&&e.setAttribute("role","menuitem"),"hr"===e.localName?e.setAttribute("role","separator"):e.setAttribute("aria-haspopup","false"),this._setMenuItemTheme(e,t,this._theme),e._item=t,t.text&&(e.textContent=t.text),this.__toggleMenuComponentAttribute(e,"menu-item-checked",t.checked),this.__toggleMenuComponentAttribute(e,"disabled",t.disabled),t.children&&t.children.length&&(this.__updateExpanded(e,!1),e.setAttribute("aria-haspopup","true")),e}__initListBox(){const t=document.createElement(`${this._tagNamePrefix}-list-box`);return this._theme&&t.setAttribute("theme",this._theme),t.addEventListener("selected-changed",(e=>{const{value:o}=e.detail;if("number"==typeof o){const e=t.items[o]._item;e.children||this.dispatchEvent(new CustomEvent("item-selected",{detail:{value:e}})),t.selected=null}})),t}__initOverlay(){const t=this.$.overlay;t.$.backdrop.addEventListener("click",(()=>{this.close()})),t.addEventListener(Rn?"click":"mouseover",(t=>{this.__showSubMenu(t)})),t.addEventListener("keydown",(t=>{const{key:e}=t,o=this.__isRTL,n="ArrowRight"===e,i="ArrowLeft"===e;!o&&n||o&&i||"Enter"===e||" "===e?this.__showSubMenu(t):!o&&i||o&&n?(this.close(),this.listenOn.focus()):"Escape"!==e&&"Tab"!==e||this.dispatchEvent(new CustomEvent("close-all-menus"))}))}__initSubMenu(){const t=document.createElement(this.constructor.is);return t._modeless=!0,t.openOn="opensubmenu",t.setAttribute("hidden",""),this.addEventListener("opened-changed",(t=>{t.detail.value||this._subMenu.close()})),t.addEventListener("close-all-menus",(()=>{this.dispatchEvent(new CustomEvent("close-all-menus"))})),t.addEventListener("item-selected",(t=>{const{detail:e}=t;this.dispatchEvent(new CustomEvent("item-selected",{detail:e}))})),this.addEventListener("close-all-menus",(()=>{this.close()})),this.addEventListener("item-selected",(()=>{this.close()})),t.addEventListener("opened-changed",(t=>{if(!t.detail.value){const t=this._listBox.querySelector("[expanded]");t&&this.__updateExpanded(t,!1)}})),t}__showSubMenu(t,e=t.composedPath().find((t=>t.localName===`${this._tagNamePrefix}-item`))){if(!this.__openListenerActive)return;if(this.$.overlay.hasAttribute("opening"))return void requestAnimationFrame((()=>{this.__showSubMenu(t,e)}));const o=this._subMenu;if(e){const{children:t}=e._item;if(o.items!==t&&o.close(),!this.opened)return;if(t&&t.length){this.__updateExpanded(e,!0);const{overlayClass:t}=this;this.__openSubMenu(o,e,t)}else o.listenOn.focus()}}__itemsRenderer(t,e,{detail:o}){this.__initMenu(t,e);t.querySelector(this.constructor.is).closeOn=e.closeOn;const n=t.querySelector(`${this._tagNamePrefix}-list-box`);n.innerHTML="",[...o.children||e.items].forEach((t=>{const e=this.__createComponent(t);n.appendChild(e)}))}_setMenuItemTheme(t,e,o){let n=t.getAttribute("theme")||o;null!=e.theme&&(n=Array.isArray(e.theme)?e.theme.join(" "):e.theme),this.__updateTheme(t,n)}__toggleMenuComponentAttribute(t,e,o){o?(t.setAttribute(e,""),t[`__has-${e}`]=!0):t[`__has-${e}`]&&(t.removeAttribute(e),t[`__has-${e}`]=!1)}__initMenu(t,e){if(t.firstElementChild)this.__updateTheme(this._listBox,this._theme);else{this.__initOverlay();const e=this.__initListBox();this._listBox=e,t.appendChild(e);const o=this.__initSubMenu();this._subMenu=o,t.appendChild(o),requestAnimationFrame((()=>{this.__openListenerActive=!0}))}}__updateExpanded(t,e){t.setAttribute("aria-expanded",e.toString()),t.toggleAttribute("expanded",e)}__updateTheme(t,e){e?t.setAttribute("theme",e):t.removeAttribute("theme")}}
/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;class ri extends(oi(He(co(a(si(Fe)))))){static get template(){return Re`
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
    `}static get is(){return"vaadin-context-menu"}static get properties(){return{selector:{type:String},opened:{type:Boolean,value:!1,notify:!0,readOnly:!0},openOn:{type:String,value:"vaadin-contextmenu"},listenOn:{type:Object,value(){return this}},closeOn:{type:String,value:"click",observer:"_closeOnChanged"},renderer:{type:Function},_modeless:{type:Boolean},_context:Object,_phone:{type:Boolean},_touch:{type:Boolean,value:Rn},_wide:{type:Boolean},_wideMediaQuery:{type:String,value:"(min-device-width: 750px)"}}}static get observers(){return["_openedChanged(opened)","_targetOrOpenOnChanged(listenOn, openOn)","_rendererChanged(renderer, items)","_touchOrWideChanged(_touch, _wide)"]}constructor(){super(),this._boundOpen=this.open.bind(this),this._boundClose=this.close.bind(this),this._boundPreventDefault=this._preventDefault.bind(this),this._boundOnGlobalContextMenu=this._onGlobalContextMenu.bind(this)}connectedCallback(){super.connectedCallback(),this.__boundOnScroll=this.__onScroll.bind(this),window.addEventListener("scroll",this.__boundOnScroll,!0)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("scroll",this.__boundOnScroll,!0),this.close()}ready(){super.ready(),this._overlayElement=this.$.overlay,this.addController(new ei(this._wideMediaQuery,(t=>{this._wide=t}))),Hn(this)}_onOverlayOpened(t){this._setOpened(t.detail.value),this.__alignOverlayPosition()}_onVaadinOverlayOpen(){this.__alignOverlayPosition(),this.$.overlay.style.opacity="",this.__forwardFocus()}_targetOrOpenOnChanged(t,e){this._oldListenOn&&this._oldOpenOn&&(this._unlisten(this._oldListenOn,this._oldOpenOn,this._boundOpen),this._oldListenOn.style.webkitTouchCallout="",this._oldListenOn.style.webkitUserSelect="",this._oldListenOn.style.userSelect="",this._oldListenOn=null,this._oldOpenOn=null),t&&e&&(this._listen(t,e,this._boundOpen),this._oldListenOn=t,this._oldOpenOn=e)}_touchOrWideChanged(t,e){this._phone=!e&&t}_setListenOnUserSelect(t){this.listenOn.style.webkitTouchCallout=t,this.listenOn.style.webkitUserSelect=t,this.listenOn.style.userSelect=t,document.getSelection().removeAllRanges()}_closeOnChanged(t,e){const o="vaadin-overlay-outside-click",n=this.$.overlay;e&&this._unlisten(n,e,this._boundClose),t?(this._listen(n,t,this._boundClose),n.removeEventListener(o,this._boundPreventDefault)):n.addEventListener(o,this._boundPreventDefault)}_preventDefault(t){t.preventDefault()}_openedChanged(t){t?(document.documentElement.addEventListener("contextmenu",this._boundOnGlobalContextMenu,!0),this._setListenOnUserSelect("none")):(document.documentElement.removeEventListener("contextmenu",this._boundOnGlobalContextMenu,!0),this._setListenOnUserSelect("")),this.$.overlay.opened=t}requestContentUpdate(){this._overlayElement&&this.renderer&&this._overlayElement.requestContentUpdate()}_rendererChanged(t,e){if(e){if(t)throw new Error("The items API cannot be used together with a renderer");"click"===this.closeOn&&(this.closeOn=""),t=this.__itemsRenderer}this.$.overlay.setProperties({owner:this,renderer:t})}close(){this._setOpened(!1)}_contextTarget(t){if(this.selector){const e=this.listenOn.querySelectorAll(this.selector);return Array.prototype.filter.call(e,(e=>t.composedPath().indexOf(e)>-1))[0]}return t.target}open(t){t&&!this.opened&&(this._context={detail:t.detail,target:this._contextTarget(t)},this._context.target&&(t.preventDefault(),t.stopPropagation(),this.__x=this._getEventCoordinate(t,"x"),this.__pageXOffset=window.pageXOffset,this.__y=this._getEventCoordinate(t,"y"),this.__pageYOffset=window.pageYOffset,this.$.overlay.style.opacity="0",this._setOpened(!0)))}__onScroll(){if(!this.opened)return;const t=window.pageYOffset-this.__pageYOffset,e=window.pageXOffset-this.__pageXOffset;this.__adjustPosition("left",-e),this.__adjustPosition("right",e),this.__adjustPosition("top",-t),this.__adjustPosition("bottom",t),this.__pageYOffset+=t,this.__pageXOffset+=e}__adjustPosition(t,e){const o=this.$.overlay.style;o[t]=`${(parseInt(o[t])||0)+e}px`}__alignOverlayPosition(){const t=this.$.overlay;if(t.positionTarget)return;const e=t.style;["top","right","bottom","left"].forEach((t=>e.removeProperty(t))),["right-aligned","end-aligned","bottom-aligned"].forEach((e=>t.removeAttribute(e)));const{xMax:o,xMin:n,yMax:i}=t.getBoundaries(),s=this.__x,r=this.__y,a=document.documentElement.clientWidth,l=document.documentElement.clientHeight;this.__isRTL?s>a/2||s>n?e.right=`${Math.max(0,a-s)}px`:(e.left=`${s}px`,this._setEndAligned(t)):s<a/2||s<o?e.left=`${s}px`:(e.right=`${Math.max(0,a-s)}px`,this._setEndAligned(t)),r<l/2||r<i?e.top=`${r}px`:(e.bottom=`${Math.max(0,l-r)}px`,t.setAttribute("bottom-aligned",""))}_setEndAligned(t){t.setAttribute("end-aligned",""),this.__isRTL||t.setAttribute("right-aligned","")}_getEventCoordinate(t,e){if(!(t.detail instanceof Object)){const o=`client${e.toUpperCase()}`,n=t.changedTouches?t.changedTouches[0][o]:t[o];if(0===n){const o=t.target.getBoundingClientRect();return"x"===e?o.left:o.top+o.height}return n}return t.detail[e]?t.detail[e]:t.detail.sourceEvent?this._getEventCoordinate(t.detail.sourceEvent,e):void 0}_listen(t,e,o){qo[e]?Go(t,e,o):t.addEventListener(e,o)}_unlisten(t,e,o){qo[e]?Jo(t,e,o):t.removeEventListener(e,o)}_onGlobalContextMenu(t){t.shiftKey||(t.preventDefault(),this.close())}}customElements.define(ri.is,ri);
/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
class ai extends ri{static get is(){return"vaadin-menu-bar-submenu"}static get template(){return Re`
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
    `}constructor(){super(),this.openOn="opensubmenu"}get _tagNamePrefix(){return"vaadin-menu-bar"}_openedChanged(t){this.$.overlay.opened=t}close(){super.close(),this.hasAttribute("is-root")&&this.getRootNode().host._close()}}customElements.define(ai.is,ai);
/**
 * @license
 * Copyright (c) 2021 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
const li=new ResizeObserver((t=>{setTimeout((()=>{t.forEach((t=>{t.target.resizables?t.target.resizables.forEach((e=>{e._onResize(t.contentRect)})):t.target._onResize(t.contentRect)}))}))})),di=J((t=>class extends t{get _observeParent(){return!1}connectedCallback(){if(super.connectedCallback(),li.observe(this),this._observeParent){const t=this.parentNode instanceof ShadowRoot?this.parentNode.host:this.parentNode;t.resizables||(t.resizables=new Set,li.observe(t)),t.resizables.add(this),this.__parent=t}}disconnectedCallback(){super.disconnectedCallback(),li.unobserve(this);const t=this.__parent;if(this._observeParent&&t){const e=t.resizables;e&&(e.delete(this),0===e.size&&li.unobserve(t)),this.__parent=null}}_onResize(t){}})),ci=t=>class extends(qn(di(pn(He(t))))){static get properties(){return{openOnHover:{type:Boolean},_hasOverflow:{type:Boolean,value:!1},_overflow:{type:Object},_container:{type:Object}}}static get observers(){return["_itemsChanged(items, items.splices)","__hasOverflowChanged(_hasOverflow, _overflow)","__i18nChanged(i18n, _overflow)","_menuItemsChanged(items, _overflow, _container, items.splices)"]}constructor(){super(),this.__boundOnContextMenuKeydown=this.__onContextMenuKeydown.bind(this)}get focused(){return(this._getItems()||[]).find(un)||this._expandedButton}get _vertical(){return!1}get _observeParent(){return!0}get _buttons(){return Array.from(this.querySelectorAll("vaadin-menu-bar-button"))}get _subMenu(){return this.shadowRoot.querySelector("vaadin-menu-bar-submenu")}ready(){super.ready(),this.setAttribute("role","menubar"),this._overflowController=new wo(this,"overflow","vaadin-menu-bar-button",{initializer:t=>{t.setAttribute("hidden","");const e=document.createElement("div");e.setAttribute("aria-hidden","true"),e.innerHTML="&centerdot;".repeat(3),t.appendChild(e),this._overflow=t,this._initButtonAttrs(t)}}),this.addController(this._overflowController),this.addEventListener("mousedown",(()=>this._hideTooltip())),this.addEventListener("mouseleave",(()=>this._hideTooltip())),this._subMenu.addEventListener("item-selected",this.__onItemSelected.bind(this)),this._subMenu.addEventListener("close-all-menus",this.__onEscapeClose.bind(this));this._subMenu.$.overlay.addEventListener("keydown",this.__boundOnContextMenuKeydown);const t=this.shadowRoot.querySelector('[part="container"]');t.addEventListener("click",this.__onButtonClick.bind(this)),t.addEventListener("mouseover",(t=>this._onMouseOver(t))),this._container=t}_getItems(){return this._buttons}disconnectedCallback(){super.disconnectedCallback(),this._hideTooltip(!0)}_onResize(){this.__detectOverflow()}__hasOverflowChanged(t,e){e&&e.toggleAttribute("hidden",!t)}_menuItemsChanged(t,e,o){e&&o&&t!==this._oldItems&&(this._oldItems=t,this.__renderButtons(t))}__i18nChanged(t,e){e&&t&&void 0!==t.moreOptions&&(t.moreOptions?e.setAttribute("aria-label",t.moreOptions):e.removeAttribute("aria-label"))}__getOverflowCount(t){return t.item&&t.item.children&&t.item.children.length||0}__restoreButtons(t){t.forEach((t=>{t.disabled=t.item&&t.item.disabled||this.disabled,t.style.visibility="",t.style.position="";const e=t.item&&t.item.component;e instanceof HTMLElement&&"menuitem"===e.getAttribute("role")&&this.__restoreItem(t,e)})),this.__updateOverflow([])}__restoreItem(t,e){t.appendChild(e),e.removeAttribute("role"),e.removeAttribute("aria-expanded"),e.removeAttribute("aria-haspopup"),e.removeAttribute("tabindex")}__updateOverflow(t){this._overflow.item={children:t},this._hasOverflow=t.length>0}__setOverflowItems(t,e){const o=this._container;if(o.offsetWidth<o.scrollWidth){this._hasOverflow=!0;const n=this.__isRTL;let i;for(i=t.length;i>0;i--){const s=t[i-1],r=getComputedStyle(s);if(!n&&s.offsetLeft+s.offsetWidth<o.offsetWidth-e.offsetWidth||n&&s.offsetLeft>=e.offsetWidth)break;s.disabled=!0,s.style.visibility="hidden",s.style.position="absolute",s.style.width=r.width}const s=t.filter(((t,e)=>e>=i)).map((t=>t.item));this.__updateOverflow(s)}}__detectOverflow(){const t=this._overflow,e=this._buttons.filter((e=>e!==t)),o=this.__getOverflowCount(t);this.__restoreButtons(e),this.__setOverflowItems(e,t);const n=this.__getOverflowCount(t);o!==n&&this._subMenu.opened&&this._subMenu.close();const i=n===e.length||0===n&&1===e.length;this.toggleAttribute("has-single-button",i)}_removeButtons(){this._buttons.forEach((t=>{t!==this._overflow&&this.removeChild(t)}))}_initButton(t){const e=document.createElement("vaadin-menu-bar-button"),o={...t};if(e.item=o,t.component){const t=this.__getComponent(o);o.component=t,t.item=o,e.appendChild(t)}else t.text&&(e.textContent=t.text);return e}_initButtonAttrs(t){t.setAttribute("role","menuitem"),(t===this._overflow||t.item&&t.item.children)&&(t.setAttribute("aria-haspopup","true"),t.setAttribute("aria-expanded","false"))}_setButtonDisabled(t,e){t.disabled=e,t.setAttribute("tabindex",e?"-1":"0")}_setButtonTheme(t,e){let o=e;const n=t.item&&t.item.theme;null!=n&&(o=Array.isArray(n)?n.join(" "):n),o?t.setAttribute("theme",o):t.removeAttribute("theme")}__getComponent(t){const e=t.component;let o;const n=e instanceof HTMLElement;if(n&&"vaadin-menu-bar-item"===e.localName?o=e:(o=document.createElement("vaadin-menu-bar-item"),o.appendChild(n?e:document.createElement(e))),t.text){(o.firstChild||o).textContent=t.text}return o}__renderButtons(t=[]){this._removeButtons(),0!==t.length&&(t.forEach((t=>{const e=this._initButton(t);this.insertBefore(e,this._overflow),this._setButtonDisabled(e,t.disabled),this._initButtonAttrs(e),this._setButtonTheme(e,this._theme)})),this.__detectOverflow())}_showTooltip(t,e){const o=this._tooltipController.node;o&&o.isConnected&&(void 0===o.generator&&(o.generator=({item:t})=>t&&t.tooltip),this._subMenu.opened||(this._tooltipController.setTarget(t),this._tooltipController.setContext({item:t.item}),o._stateController.open({hover:e,focus:!e})))}_hideTooltip(t){const e=this._tooltipController&&this._tooltipController.node;e&&e._stateController.close(t)}_setExpanded(t,e){t.toggleAttribute("expanded",e),t.toggleAttribute("active",e),t.setAttribute("aria-expanded",e?"true":"false")}_setTabindex(t,e){t.setAttribute("tabindex",e?"0":"-1")}_focusItem(t,e){const o=e&&this.focused===this._expandedButton;o&&this._close(),super._focusItem(t,e),this._buttons.forEach((e=>{this._setTabindex(e,e===t)})),o&&t.item&&t.item.children?this.__openSubMenu(t,!0,{keepFocus:!0}):t===this._overflow?this._hideTooltip():this._showTooltip(t)}_getButtonFromEvent(t){return Array.from(t.composedPath()).find((t=>"vaadin-menu-bar-button"===t.localName))}_setFocused(t){if(t){const t=this.querySelector('[tabindex="0"]');t&&this._buttons.forEach((e=>{this._setTabindex(e,e===t),e===t&&e!==this._overflow&&an()&&this._showTooltip(e)}))}else this._hideTooltip()}_onArrowDown(t){t.preventDefault();const e=this._getButtonFromEvent(t);e===this._expandedButton?this._focusFirstItem():this.__openSubMenu(e,!0)}_onArrowUp(t){t.preventDefault();const e=this._getButtonFromEvent(t);e===this._expandedButton?this._focusLastItem():this.__openSubMenu(e,!0,{focusLast:!0})}_onEscape(t){t.composedPath().includes(this._expandedButton)&&this._close(!0),this._hideTooltip(!0)}_onKeyDown(t){switch(t.key){case"ArrowDown":this._onArrowDown(t);break;case"ArrowUp":this._onArrowUp(t);break;default:super._onKeyDown(t)}}_itemsChanged(){const t=this._subMenu;t&&t.opened&&t.close()}_onMouseOver(t){const e=this._getButtonFromEvent(t);if(e){if(e!==this._expandedButton){const t=this._subMenu.opened;e.item.children&&(this.openOnHover||t)?this.__openSubMenu(e,!1):t&&this._close(),e===this._overflow||this.openOnHover&&e.item.children?this._hideTooltip():this._showTooltip(e,!0)}}else this._hideTooltip()}__onContextMenuKeydown(t){const e=Array.from(t.composedPath()).find((t=>t._item));if(e){const o=e.parentNode;38===t.keyCode&&e===o.items[0]&&this._close(!0),(37===t.keyCode||39===t.keyCode&&!e._item.children)&&(t.stopImmediatePropagation(),this._onKeyDown(t))}}__fireItemSelected(t){this.dispatchEvent(new CustomEvent("item-selected",{detail:{value:t}}))}__onButtonClick(t){t.stopPropagation();const e=this._getButtonFromEvent(t);e&&this.__openSubMenu(e,!1)}__openSubMenu(t,e,o={}){const n=this._subMenu,i=t.item;if(n.opened&&(this._close(),n.listenOn===t))return;const s=i&&i.children;if(!s||0===s.length)return void this.__fireItemSelected(i);n.items=s,n.listenOn=t;const r=n.$.overlay;r.positionTarget=t,r.noVerticalOverlap=!0,this._expandedButton=t,requestAnimationFrame((()=>{t.dispatchEvent(new CustomEvent("opensubmenu",{detail:{children:s}})),this._hideTooltip(!0),this._setExpanded(t,!0)})),this.style.pointerEvents="auto",r.addEventListener("vaadin-overlay-open",(()=>{o.focusLast&&this._focusLastItem(),o.keepFocus&&this._focusItem(this._expandedButton,!1),e||r.$.overlay.focus(),r._updatePosition()}),{once:!0})}_focusFirstItem(){this._subMenu.$.overlay.firstElementChild.focus()}_focusLastItem(){const t=this._subMenu.$.overlay.firstElementChild,e=t.items[t.items.length-1];e&&e.focus()}__onItemSelected(t){t.stopPropagation(),this._close(),this.__fireItemSelected(t.detail.value)}__onEscapeClose(){this.__deactivateButton(!0)}__deactivateButton(t){const e=this._expandedButton;e&&e.hasAttribute("expanded")&&(this._setExpanded(e,!1),t&&this._focusItem(e,!1),this._expandedButton=null)}_close(t){this.style.pointerEvents="",this.__deactivateButton(t),this._subMenu.opened&&this._subMenu.close()}}
/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */;class hi extends(ci(Co(co(_(Fe))))){static get template(){return Re`
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
    `}static get is(){return"vaadin-menu-bar"}static get properties(){return{items:{type:Array,value:()=>[]},i18n:{type:Object,value:()=>({moreOptions:"More options"})},overlayClass:{type:String}}}static get observers(){return["_themeChanged(_theme, _overflow, _container)"]}ready(){super.ready(),this._tooltipController=new xo(this),this._tooltipController.setManual(!0),this.addController(this._tooltipController)}_disabledChanged(t,e){super._disabledChanged(t,e),e!==t&&this.__updateButtonsDisabled(t)}_themeChanged(t,e,o){e&&o&&(this._buttons.forEach((e=>this._setButtonTheme(e,t))),this.__detectOverflow()),t?this._subMenu.setAttribute("theme",t):this._subMenu.removeAttribute("theme")}__updateButtonsDisabled(t){this._buttons.forEach((e=>{e.disabled=t||e.item&&e.item.disabled}))}}customElements.define(hi.is,hi);class ui extends i{constructor(){super(...arguments),this.items=[{text:"View",href:"https://google.com"},{text:"Edit"},{text:"Share",children:[{text:"On social media",children:[{text:"Facebook"},{text:"Twitter"},{text:"Instagram"}]},{text:"By email"},{text:"Get link"}]},{text:"Move",children:[{text:"To folder"},{text:"To trash"}]},{text:"Duplicate"}],this.counter=5}itemSelected(t){t.detail.value.href&&(window.location=t.detail.value.href)}render(){return s`
      <vaadin-menu-bar .items="${this.items}" @item-selected="${this.itemSelected}"></vaadin-menu-bar>
    `}}ui.styles=n`
    :host {
      display: block;
      padding: 25px;
      color: var(--site-components-text-color, #000);
    }
  `,t([e({type:Object})],ui.prototype,"items",void 0),t([e({type:Number})],ui.prototype,"counter",void 0),window.customElements.define("site-menu-bar",ui);
