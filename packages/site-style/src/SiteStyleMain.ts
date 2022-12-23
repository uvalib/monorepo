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
`;
