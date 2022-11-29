import { css } from 'lit';

// colors from https://github.com/uvalib/uvalib-drupal-theme/blob/main/scss/base/_colors.scss
// need to setup a dependency and process to autosync from that authority
export const LibraryVariables = css`
:host {
  --box-shadow:  0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  --box-shadow-light: 0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.12);
  --box-shadow-mid:  0 2px 4px rgba(0, 0, 0, 0.10), 0 2px 4px rgba(0, 0, 0, 0.12);
}
`;
