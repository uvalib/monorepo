import { css } from 'lit';

// colors from https://github.com/uvalib/uvalib-drupal-theme/blob/main/scss/base/_colors.scss
// need to setup a dependency and process to autosync from that authority
export const LibraryColors = css`
:host {
  --uva-brand-blue-lightest: #87B9D9;
  --uva-brand-blue-lighter: #3395D4;
  --uva-brand-blue-light: #0370B7;
  --uva-brand-blue-base: #232D4B;

  --uva-brand-blue-300: var(--uva-brand-blue-lightest);
  --uva-brand-blue-200: var(--uva-brand-blue-lighter);
  --uva-brand-blue-100: var(--uva-brand-blue-light);
  --uva-brand-blue: var(--uva-brand-blue-base);

  --uva-brand-orange-lightest: #FFEAD6;
  --uva-brand-orange-lighter: #FFC999;
  --uva-brand-orange-light: #FFB370;
  --uva-brand-orange-base: #E57200;
  --uva-brand-orange-dark: #B35900;
  --uva-brand-orange-darker: #854200;

  --uva-brand-orange-300: var(--uva-brand-orange-lightest);
  --uva-brand-orange-200: var(--uva-brand-orange-lighter);
  --uva-brand-orange-100: var(--uva-brand-orange-light);
  --uva-brand-orange: var(--uva-brand-orange-base);
  --uva-brand-orange-A: var(--uva-brand-orange-dark);
  --uva-brand-orange-B: var(--uva-brand-orange-darker);

  --uva-blue-alt-lightest: #BFE7F7;
  --uva-blue-alt-lighter: #91D8F2;
  --uva-blue-alt-light: #55C4EC;
  --uva-blue-alt-base: #007BAC;
  --uva-blue-alt-dark: #005679;
  --uva-blue-alt-darkest: #141E3C;

  --uva-blue-alt-400: #E6F2F7; //new color
  --uva-blue-alt-300: var(--uva-blue-alt-lightest);
  --uva-blue-alt-200: var(--uva-blue-alt-lighter);
  --uva-blue-alt-100: var(--uva-blue-alt-light);
  --uva-blue-alt: var(--uva-blue-alt-base);
  --uva-blue-alt-A: var(--uva-blue-alt-dark);
  --uva-blue-alt-B: var(--uva-blue-alt-darkest);

  --uva-teal-lightest: #C8F2F4;
  --uva-teal-light: #5BD7DE;
  --uva-teal-base: #25CAD3;
  --uva-teal-dark: #1DA1A8;
  --uva-teal-darker: #16777C;

  --uva-teal-200: var(--uva-teal-lightest);
  --uva-teal-100: var(--uva-teal-light);
  --uva-teal: var(--uva-teal-base);
  --uva-teal-A: var(--uva-teal-dark);
  --uva-teal-B: var(--uva-teal-darker);

  --uva-green-lightest: #DDEFDC;
  --uva-green-lighter: #89CC74;
  --uva-green-base: #62BB46;
  --uva-green-dark: #4E9737;

  --uva-green-200: var(--uva-green-lightest);
  --uva-green-100: var(--uva-green-lighter);
  --uva-green: var(--uva-green-base);
  --uva-green-A: var(--uva-green-dark);

  --uva-red-lightest: #FBCFDA;
  --uva-red-base: #EF3F6B;
  --uva-red-dark: #DF1E43;
  --uva-red-darker: #B30000;

  --uva-red-100: var(--uva-red-lightest);
  --uva-red: var(--uva-red-base);
  --uva-red-A: var(--uva-red-dark);
  --uva-red-B: var(--uva-red-darker);

  --uva-yellow-lightest: #FEF6C8;
  --uva-yellow-base: #ECC602;
  --uva-yellow-dark: #B99C02;

  --uva-yellow-100: var(--uva-yellow-lightest);
  --uva-yellow: var(--uva-yellow-base);
  --uva-yellow-A: var(--uva-yellow-dark);

  --uva-grey-lightest: #F1F1F1;
  --uva-grey-light: #DADADA;
  --uva-grey-base: #808080;
  --uva-grey-dark: #4F4F4F;
  --uva-grey-darkest: #2B2B2B;

  --uva-grey-200: var(--uva-grey-lightest);
  --uva-grey-100: var(--uva-grey-light);
  --uva-grey: var(--uva-grey-base);
  --uva-grey-A: var(--uva-grey-dark);
  --uva-grey-B: var(--uva-grey-darkest);

  --uva-text-color-base: var(--uva-grey-A);
  --uva-text-color-dark: var(--uva-grey-B);
}
`;
