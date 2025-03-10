import { css } from 'lit';

export const W3CSS = css`
.w3-col, .w3-half, .w3-third, .w3-twothird, .w3-threequarter, .w3-quarter {
    float: left;
    width: 100%;
}
.w3-container:after, .w3-container:before, .w3-panel:after, .w3-panel:before, .w3-row:after, .w3-row:before, .w3-row-padding:after, .w3-row-padding:before, .w3-cell-row:before, .w3-cell-row:after, .w3-clear:after, .w3-clear:before, .w3-bar:before, .w3-bar:after {
    content: "";
    display: table;
    clear: both;
}
.w3-container, .w3-panel {
    padding: 0.01em 16px;
}
.w3-width-1360 {
    max-width: 1360px !important;
}
.w3-animate-opacity {
    animation: opac 0.6s;
    animation-timing-function: cubic-bezier(0.1, 0.9, 2, 0.1);
}
.w3-row-padding, .w3-row-padding > .w3-half, .w3-row-padding > .w3-third, .w3-row-padding > .w3-twothird, .w3-row-padding > .w3-threequarter, .w3-row-padding > .w3-quarter, .w3-row-padding > .w3-col {
    padding: 0 8px;
}
`;

export const W3CSSSheet = new CSSStyleSheet();
W3CSSSheet.replaceSync(`
  ${W3CSS}
`);