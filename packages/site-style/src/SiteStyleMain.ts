import { css } from 'lit';

export const LibraryMain = css`
* {
    font-family: franklin-gothic-urw, Arial, Helvetica, sans-serif !important;
}
*, *::before, *::after {
    box-sizing: border-box;
}
html, body, button, input, select, optgroup, textarea {
    color: #2B2B2B;
}
html, body {
    font-size: 17px !important;
}
body {
    min-height: 100vh;
    text-rendering: optimizeSpeed;
    line-height: 1.5;
}
input, button, textarea, select {
    font: inherit;
}

.hidden {
  display: none;
}

.visually-hidden {
  position: absolute !important;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
  width: 1px;
  height: 1px;
  word-wrap: normal;
}

.visually-hidden.focusable:active,
.visually-hidden.focusable:focus {
  position: static !important;
  overflow: visible;
  clip: auto;
  width: auto;
  height: auto;
}

.invisible {
  visibility: hidden;
}
`;
