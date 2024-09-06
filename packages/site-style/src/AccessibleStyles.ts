import { css } from 'lit';

// AccessibleStyles.js
export const visuallyHidden = css`
  .visually-hidden {
    position: absolute !important;
    overflow: hidden;
    clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
    width: 1px;
    height: 1px;
    word-wrap: normal;
    border: 0;
    margin: -1px;
    padding: 0;
    white-space: nowrap;
  }

  .visually-hidden.focusable:active,
  .visually-hidden.focusable:focus {
    position: static !important;
    overflow: visible;
    clip: auto;
    width: auto;
    height: auto;
  }  
`;

export const AccessibleSheet = new CSSStyleSheet();
AccessibleSheet.replaceSync(`
  ${visuallyHidden}
`);
