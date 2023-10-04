import{i as t,x as i}from"./lit-element-9e1ac43c.js";import{S as o}from"./SiteStyle-35a18246.js";import{S as a}from"./site-header-1957684e.js";import"./query-assigned-elements-8ef6cca7.js";var n=t`
html,
body {
  font-size: 17px !important;
}

p {
  font-size: 1rem;
  font-weight: 400;
  padding-block-end: 1rem;
  line-height: 1.5;
}

h1,
.h1 {
  font-size: 2.488rem !important;
  font-weight: 500;
  color: #232D4B !important;
  line-height: 1.15;
}

h2,
.h2 {
  font-size: 2.074rem !important;
  font-weight: 500;
  color: #232D4B !important;
  line-height: 1.15;
}

h3,
.h3 {
  font-size: 1.728rem !important;
  font-weight: 500;
  color: #232D4B !important;
  line-height: 1.15;
}

h4,
.h4 {
  font-size: 1.44rem !important;
  font-weight: 500;
  color: #232D4B !important;
  line-height: 1.15;
}

h5,
.h5 {
  font-size: 1.2rem !important;
  font-weight: 500;
  color: #232D4B !important;
  line-height: 1.15;
}

h6,
.h6 {
  font-size: 1rem !important;
  font-weight: 500;
  color: #232D4B !important;
  line-height: 1.15;
}

h1,
h2,
.h1,
.h2 {
  font-weight: 700;
}

h2,
h3,
h4,
h5,
h6 {
  margin-top: 0;
  margin-bottom: 0;
}

.all-caps {
  text-transform: uppercase;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body,
h1,
h2,
h3,
h4,
p,
figure,
blockquote,
dl,
dd {
  margin: 0;
}

ul[role=list],
ol[role=list] {
  list-style: none;
}

html:focus-within {
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  text-rendering: optimizeSpeed;
  line-height: 1.5;
}

a:not([class]) {
  text-decoration-skip-ink: auto;
}

img,
picture {
  max-width: 100%;
  display: block;
}

input,
button,
textarea,
select {
  font: inherit;
}

@media (prefers-reduced-motion: reduce) {
  html:focus-within {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

html {
  overflow-x: hidden;
}

body {
  overflow: auto;
}

html,
body,
button,
input,
select,
optgroup,
textarea {
  color: #2B2B2B;
}

.fa,
.svg-inline--fa {
  color: inherit;
}

#header,
#copyright,
.close-nav,
.mobile-nav,
#page-title,
#highlighted,
.page-wrapper,
#footer-menu,
#top-container,
#main-container,
#bottom-container,
#footer-container,
.search-slide-wrapper,
.main-navigation-wrapper,
#top-container .top-box > div,
#footer-container .footer-box > div,
#bottom-container-inner .bottom-box > div {
  background-color: white;
}

.layout.layout--twocol-section + div {
  margin: 4rem 0;
}

.layout.layout--twocol-section + div .layout__region--first {
  padding: 0 2rem;
}

.layout.layout--twocol-section + div .layout__region--second h2 {
  margin-bottom: 2rem;
}

#main-container ul li {
  margin-bottom: 0.75rem;
}

.hidden,
[hidden] {
  display: none !important;
}

.w3-image {
  max-width: 100%;
  height: auto;
}

img {
  max-width: 100%;
  height: auto;
  vertical-align: middle;
}

.w3-table,
.w3-table-all {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  display: table;
}

.w3-table-all {
  border: 1px solid #ccc;
}

.w3-bordered tr,
.w3-table-all tr {
  border-bottom: 1px solid #ddd;
}

.w3-striped tbody tr:nth-child(even) {
  background-color: #f1f1f1;
}

.w3-table-all tr:nth-child(odd) {
  background-color: #fff;
}

.w3-table-all tr:nth-child(even) {
  background-color: #f1f1f1;
}

.w3-hoverable tbody tr:hover,
.w3-ul.w3-hoverable li:hover {
  background-color: #ccc;
}

.w3-centered tr th,
.w3-centered tr td {
  text-align: center;
}

.w3-table td,
.w3-table th,
.w3-table-all td,
.w3-table-all th {
  padding: 8px 8px;
  display: table-cell;
  text-align: left;
  vertical-align: top;
}

.w3-table th:first-child,
.w3-table td:first-child,
.w3-table-all th:first-child,
.w3-table-all td:first-child {
  padding-left: 16px;
}

.w3-btn,
.w3-button {
  border: none;
  display: inline-block;
  padding: 8px 16px;
  vertical-align: middle;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  background-color: inherit;
  text-align: center;
  cursor: pointer;
  white-space: nowrap;
}

.w3-btn:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.w3-btn,
.w3-button {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.w3-disabled,
.w3-btn:disabled,
.w3-button:disabled {
  cursor: not-allowed;
  opacity: 0.3;
}

.w3-disabled *,
:disabled * {
  pointer-events: none;
}

.w3-btn.w3-disabled:hover,
.w3-btn:disabled:hover {
  box-shadow: none;
}

.w3-badge,
.w3-tag {
  background-color: #000;
  color: #fff;
  display: inline-block;
  padding-left: 8px;
  padding-right: 8px;
  text-align: center;
}

.w3-badge {
  border-radius: 50%;
}

.w3-ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.w3-ul li {
  padding: 8px 16px;
  border-bottom: 1px solid #ddd;
}

.w3-ul li:last-child {
  border-bottom: none;
}

.w3-tooltip,
.w3-display-container {
  position: relative;
}

.w3-tooltip .w3-text {
  display: none;
}

.w3-tooltip:hover .w3-text {
  display: inline-block;
}

.w3-input {
  padding: 8px;
  display: block;
  border: none;
  border-bottom: 1px solid #ccc;
  width: 100%;
}

.w3-select {
  padding: 9px 0;
  width: 100%;
  border: none;
  border-bottom: 1px solid #ccc;
}

.w3-dropdown-click,
.w3-dropdown-hover {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.w3-dropdown-hover:hover .w3-dropdown-content {
  display: block;
}

.w3-dropdown-hover:first-child,
.w3-dropdown-click:hover {
  background-color: #ccc;
  color: #000;
}

.w3-dropdown-hover:hover > .w3-button:first-child,
.w3-dropdown-click:hover > .w3-button:first-child {
  background-color: #ccc;
  color: #000;
}

.w3-dropdown-content {
  cursor: auto;
  color: #000;
  background-color: #fff;
  display: none;
  position: absolute;
  min-width: 160px;
  margin: 0;
  padding: 0;
  z-index: 1;
}

.w3-check,
.w3-radio {
  width: 24px;
  height: 24px;
  position: relative;
  top: 6px;
}

.w3-sidebar {
  height: 100%;
  width: 200px;
  background-color: #fff;
  position: fixed !important;
  z-index: 1;
  overflow: auto;
}

.w3-bar-block .w3-dropdown-hover,
.w3-bar-block .w3-dropdown-click {
  width: 100%;
}

.w3-bar-block .w3-dropdown-hover .w3-dropdown-content,
.w3-bar-block .w3-dropdown-click .w3-dropdown-content {
  min-width: 100%;
}

.w3-bar-block .w3-dropdown-hover .w3-button,
.w3-bar-block .w3-dropdown-click .w3-button {
  width: 100%;
  text-align: left;
  padding: 8px 16px;
}

.w3-main,
#main {
  transition: margin-left 0.4s;
}

.w3-modal {
  z-index: 3;
  display: none;
  padding-top: 100px;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

.w3-modal-content {
  margin: auto;
  background-color: #fff;
  position: relative;
  padding: 0;
  outline: 0;
  width: 600px;
}

.w3-bar {
  width: 100%;
  overflow: hidden;
}

.w3-center .w3-bar {
  display: inline-block;
  width: auto;
}

.w3-bar .w3-bar-item {
  padding: 8px 16px;
  float: left;
  width: auto;
  border: none;
  display: block;
  outline: 0;
}

.w3-bar .w3-dropdown-hover,
.w3-bar .w3-dropdown-click {
  position: static;
  float: left;
}

.w3-bar .w3-button {
  white-space: normal;
}

.w3-bar-block .w3-bar-item {
  width: 100%;
  display: block;
  padding: 8px 16px;
  text-align: left;
  border: none;
  white-space: normal;
  float: none;
  outline: 0;
}

.w3-bar-block.w3-center .w3-bar-item {
  text-align: center;
}

.w3-block {
  display: block;
  width: 100%;
}

.w3-responsive {
  display: block;
  overflow-x: auto;
}

.w3-container:after,
.w3-container:before,
.w3-panel:after,
.w3-panel:before,
.w3-row:after,
.w3-row:before,
.w3-row-padding:after,
.w3-row-padding:before,
.w3-cell-row:before,
.w3-cell-row:after,
.w3-clear:after,
.w3-clear:before,
.w3-bar:before,
.w3-bar:after {
  content: "";
  display: table;
  clear: both;
}

.w3-col,
.w3-half,
.w3-third,
.w3-twothird,
.w3-threequarter,
.w3-quarter {
  float: left;
  width: 100%;
}

.w3-col.s1 {
  width: 8.33333%;
}

.w3-col.s2 {
  width: 16.66666%;
}

.w3-col.s3 {
  width: 24.99999%;
}

.w3-col.s4 {
  width: 33.33333%;
}

.w3-col.s5 {
  width: 41.66666%;
}

.w3-col.s6 {
  width: 49.99999%;
}

.w3-col.s7 {
  width: 58.33333%;
}

.w3-col.s8 {
  width: 66.66666%;
}

.w3-col.s9 {
  width: 74.99999%;
}

.w3-col.s10 {
  width: 83.33333%;
}

.w3-col.s11 {
  width: 91.66666%;
}

.w3-col.s12 {
  width: 99.99999%;
}

@media (min-width: 601px) {
  .w3-col.m1 {
    width: 8.33333%;
  }
  .w3-col.m2 {
    width: 16.66666%;
  }
  .w3-col.m3,
  .w3-quarter {
    width: 24.99999%;
  }
  .w3-col.m4,
  .w3-third {
    width: 33.33333%;
  }
  .w3-col.m5 {
    width: 41.66666%;
  }
  .w3-col.m6,
  .w3-half {
    width: 49.99999%;
  }
  .w3-col.m7 {
    width: 58.33333%;
  }
  .w3-col.m8,
  .w3-twothird {
    width: 66.66666%;
  }
  .w3-col.m9,
  .w3-threequarter {
    width: 74.99999%;
  }
  .w3-col.m10 {
    width: 83.33333%;
  }
  .w3-col.m11 {
    width: 91.66666%;
  }
  .w3-col.m12 {
    width: 99.99999%;
  }
}

@media (min-width: 993px) {
  .w3-col.l1 {
    width: 8.33333%;
  }
  .w3-col.l2 {
    width: 16.66666%;
  }
  .w3-col.l3 {
    width: 24.99999%;
  }
  .w3-col.l4 {
    width: 33.33333%;
  }
  .w3-col.l5 {
    width: 41.66666%;
  }
  .w3-col.l6 {
    width: 49.99999%;
  }
  .w3-col.l7 {
    width: 58.33333%;
  }
  .w3-col.l8 {
    width: 66.66666%;
  }
  .w3-col.l9 {
    width: 74.99999%;
  }
  .w3-col.l10 {
    width: 83.33333%;
  }
  .w3-col.l11 {
    width: 91.66666%;
  }
  .w3-col.l12 {
    width: 99.99999%;
  }
}

.w3-rest {
  overflow: hidden;
}

.w3-stretch {
  margin-left: -16px;
  margin-right: -16px;
}

.w3-content,
.w3-auto {
  margin-left: auto;
  margin-right: auto;
}

.w3-content {
  max-width: 980px;
}

.w3-auto {
  max-width: 1140px;
}

.w3-cell-row {
  display: table;
  width: 100%;
}

.w3-cell {
  display: table-cell;
}

.w3-cell-top {
  vertical-align: top;
}

.w3-cell-middle {
  vertical-align: middle;
}

.w3-cell-bottom {
  vertical-align: bottom;
}

.w3-hide {
  display: none !important;
}

.w3-show-block,
.w3-show {
  display: block !important;
}

.w3-show-inline-block {
  display: inline-block !important;
}

@media (max-width: 1205px) {
  .w3-auto {
    max-width: 95%;
  }
}

@media (max-width: 600px) {
  .w3-modal-content {
    margin: 0 10px;
    width: auto !important;
  }
  .w3-modal {
    padding-top: 30px;
  }
  .w3-dropdown-hover.w3-mobile .w3-dropdown-content,
  .w3-dropdown-click.w3-mobile .w3-dropdown-content {
    position: relative;
  }
  .w3-hide-small {
    display: none !important;
  }
  .w3-mobile {
    display: block;
    width: 100% !important;
  }
  .w3-bar-item.w3-mobile,
  .w3-dropdown-hover.w3-mobile,
  .w3-dropdown-click.w3-mobile {
    text-align: center;
  }
  .w3-dropdown-hover.w3-mobile,
  .w3-dropdown-hover.w3-mobile .w3-btn,
  .w3-dropdown-hover.w3-mobile .w3-button,
  .w3-dropdown-click.w3-mobile,
  .w3-dropdown-click.w3-mobile .w3-btn,
  .w3-dropdown-click.w3-mobile .w3-button {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .w3-modal-content {
    width: 500px;
  }
  .w3-modal {
    padding-top: 50px;
  }
}

@media (min-width: 993px) {
  .w3-modal-content {
    width: 900px;
  }
  .w3-hide-large {
    display: none !important;
  }
  .w3-sidebar.w3-collapse {
    display: block !important;
  }
}

@media (max-width: 992px) and (min-width: 601px) {
  .w3-hide-medium {
    display: none !important;
  }
}

@media (max-width: 992px) {
  .w3-sidebar.w3-collapse {
    display: none;
  }
  .w3-main {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  .w3-auto {
    max-width: 100%;
  }
}

.w3-top,
.w3-bottom {
  position: fixed;
  width: 100%;
  z-index: 1;
}

.w3-top {
  top: 0;
}

.w3-bottom {
  bottom: 0;
}

.w3-overlay {
  position: fixed;
  display: none;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
}

.w3-display-topleft {
  position: absolute;
  left: 0;
  top: 0;
}

.w3-display-topright {
  position: absolute;
  right: 0;
  top: 0;
}

.w3-display-bottomleft {
  position: absolute;
  left: 0;
  bottom: 0;
}

.w3-display-bottomright {
  position: absolute;
  right: 0;
  bottom: 0;
}

.w3-display-middle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
}

.w3-display-left {
  position: absolute;
  top: 50%;
  left: 0%;
  transform: translate(0%, -50%);
  -ms-transform: translate(0%, -50%);
}

.w3-display-right {
  position: absolute;
  top: 50%;
  right: 0%;
  transform: translate(0%, -50%);
  -ms-transform: translate(0%, -50%);
}

.w3-display-topmiddle {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translate(-50%, 0%);
  -ms-transform: translate(-50%, 0%);
}

.w3-display-bottommiddle {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 0%);
  -ms-transform: translate(-50%, 0%);
}

.w3-display-container:hover .w3-display-hover {
  display: block;
}

.w3-display-container:hover span.w3-display-hover {
  display: inline-block;
}

.w3-display-hover {
  display: none;
}

.w3-display-position {
  position: absolute;
}

.w3-circle {
  border-radius: 50%;
}

.w3-round-small {
  border-radius: 2px;
}

.w3-round,
.w3-round-medium {
  border-radius: 4px;
}

.w3-round-large {
  border-radius: 8px;
}

.w3-round-xlarge {
  border-radius: 16px;
}

.w3-round-xxlarge {
  border-radius: 32px;
}

.w3-row-padding,
.w3-row-padding > .w3-half,
.w3-row-padding > .w3-third,
.w3-row-padding > .w3-twothird,
.w3-row-padding > .w3-threequarter,
.w3-row-padding > .w3-quarter,
.w3-row-padding > .w3-col {
  padding: 0 8px;
}

.w3-container,
.w3-panel {
  padding: 0.01em 16px;
}

.w3-panel {
  margin-top: 16px;
  margin-bottom: 16px;
}

.w3-code,
.w3-codespan {
  font-family: Consolas, "courier new";
  font-size: 16px;
}

.w3-code {
  width: auto;
  background-color: #fff;
  padding: 8px 12px;
  border-left: 4px solid #4caf50;
  word-wrap: break-word;
}

.w3-codespan {
  color: crimson;
  background-color: #f1f1f1;
  padding-left: 4px;
  padding-right: 4px;
  font-size: 110%;
}

.w3-card,
.w3-card-2 {
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
}

.w3-card-4,
.w3-hover-shadow:hover {
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.2), 0 4px 20px 0 rgba(0, 0, 0, 0.19);
}

.w3-left-align {
  text-align: left !important;
}

.w3-right-align {
  text-align: right !important;
}

.w3-justify {
  text-align: justify !important;
}

.w3-center {
  text-align: center !important;
}

.w3-border-0 {
  border: 0 !important;
}

.w3-left {
  float: left !important;
}

.w3-right {
  float: right !important;
}

* {
  font-family: franklin-gothic-urw, Arial, Helvetica, sans-serif !important;
}

.campaign h1 {
  font-family: adobe-caslon-pro, serif !important;
}

a,
span a {
  color: #005679;
  text-decoration: underline;
}

a:hover,
a:active,
a:focus,
a:focus-visible,
span a:hover,
span a:active,
span a:focus,
span a:focus-visible {
  text-decoration: none;
}

a:focus-visible,
span a:focus-visible {
  outline: -webkit-focus-ring-color auto 1px;
}

a:-webkit-any-link:focus-visible,
span a:-webkit-any-link:focus-visible {
  outline-offset: 2px;
}

h1 a,
h2 a,
h3 a,
h4 a,
h1 span a,
h2 span a,
h3 span a,
h4 span a {
  color: #232D4B;
  text-decoration: none;
}

h1 a:hover,
h1 a:active,
h1 a:focus,
h2 a:hover,
h2 a:active,
h2 a:focus,
h3 a:hover,
h3 a:active,
h3 a:focus,
h4 a:hover,
h4 a:active,
h4 a:focus,
h1 span a:hover,
h1 span a:active,
h1 span a:focus,
h2 span a:hover,
h2 span a:active,
h2 span a:focus,
h3 span a:hover,
h3 span a:active,
h3 span a:focus,
h4 span a:hover,
h4 span a:active,
h4 span a:focus {
  text-decoration: underline;
}

h1 a:focus-visible,
h2 a:focus-visible,
h3 a:focus-visible,
h4 a:focus-visible,
h1 span a:focus-visible,
h2 span a:focus-visible,
h3 span a:focus-visible,
h4 span a:focus-visible {
  outline: -webkit-focus-ring-color auto 1px;
}

h1 a:-webkit-any-link:focus-visible,
h2 a:-webkit-any-link:focus-visible,
h3 a:-webkit-any-link:focus-visible,
h4 a:-webkit-any-link:focus-visible,
h1 span a:-webkit-any-link:focus-visible,
h2 span a:-webkit-any-link:focus-visible,
h3 span a:-webkit-any-link:focus-visible,
h4 span a:-webkit-any-link:focus-visible {
  outline-offset: 2px;
}

mark {
  background-color: #FFC999;
}

mark::before,
mark::after {
  clip-path: inset(100%);
  clip: rect(1px, 1px, 1px, 1px);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}

mark::before {
  content: " [highlight start] ";
}

mark::after {
  content: " [highlight end] ";
}

ul li a {
  text-decoration: underline !important;
}

ul li a:hover {
  text-decoration: none !important;
}

ul li a:active {
  text-decoration: none !important;
}

ul li a:focus {
  text-decoration: none !important;
}

.screen-reader-text {
  clip: rect(1px, 1px, 1px, 1px);
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
}

.screen-reader-text:focus {
  background-color: #F1F1F1;
  border-radius: 3px;
  box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.6);
  clip: auto !important;
  color: #007BAC;
  display: block;
  font-size: 14px;
  font-size: 0.875rem;
  font-weight: bold;
  height: auto;
  left: 5px;
  line-height: normal;
  padding: 15px 23px 14px;
  text-decoration: none;
  top: 5px;
  width: auto;
  z-index: 100000;
}

.a11y-sr-only {
  position: absolute;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

dl.dl--inline {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

dl.dl--inline dt {
  font-weight: 700;
}

.list--simple {
  padding-left: 0;
}

.list--simple li {
  font-size: 1em;
  list-style-type: none;
  line-height: 1.5;
  text-indent: 0;
}

.margin-zero {
  margin: 0 !important;
}

.margin-zero--top {
  margin-top: 0 !important;
}

.margin-zero--bottom {
  margin-bottom: 0 !important;
}

.margin-zero--left {
  margin-left: 0 !important;
}

.margin-zero--right {
  margin-right: 0 !important;
}

.margin-1rem {
  margin: 1rem !important;
}

.margin-1rem--top {
  margin-top: 1rem !important;
}

.margin-1rem--bottom {
  margin-bottom: 1rem !important;
}

.margin-1rem--left {
  margin-left: 1rem !important;
}

.margin-1rem--right {
  margin-right: 1rem !important;
}

.margin-2rem {
  margin: 2rem !important;
}

.margin-2rem--top {
  margin-top: 2rem !important;
}

.margin-2rem--bottom {
  margin-bottom: 2rem !important;
}

.margin-2rem--left {
  margin-left: 2rem !important;
}

.margin-2rem--right {
  margin-right: 2rem !important;
}

.margin-3rem {
  margin: 3rem !important;
}

.margin-3rem--top {
  margin-top: 3rem !important;
}

.margin-3rem--bottom {
  margin-bottom: 3rem !important;
}

.margin-3rem--left {
  margin-left: 3rem !important;
}

.margin-3rem--right {
  margin-right: 3rem !important;
}

.padding-zero {
  padding: 0 !important;
}

.padding-zero--top {
  padding-top: 0 !important;
}

.padding-zero--bottom {
  padding-bottom: 0 !important;
}

.padding-zero--left {
  padding-left: 0 !important;
}

.padding-zero--right {
  padding-right: 0 !important;
}

.padding-1rem {
  padding: 1rem !important;
}

.padding-1rem--top {
  padding-top: 1rem !important;
}

.padding-1rem--bottom {
  padding-bottom: 1rem !important;
}

.padding-1rem--left {
  padding-left: 1rem !important;
}

.padding-1rem--right {
  padding-right: 1rem !important;
}

.padding-2rem {
  padding: 2rem !important;
}

.padding-2rem--top {
  padding-top: 2rem !important;
}

.padding-2rem--bottom {
  padding-bottom: 2rem !important;
}

.padding-2rem--left {
  padding-left: 2rem !important;
}

.padding-2rem--right {
  padding-right: 2rem !important;
}

.padding-3rem {
  padding: 3rem !important;
}

.padding-3rem--top {
  padding-top: 3rem !important;
}

.padding-3rem--bottom {
  padding-bottom: 3rem !important;
}

.padding-3rem--left {
  padding-left: 3rem !important;
}

.padding-3rem--right {
  padding-right: 3rem !important;
}

.w3-border {
  border: 1px solid orange !important;
}

.uvalib-button {
  font-size: 1rem;
  appearance: none;
  border: 0;
  cursor: pointer;
  display: inline-block;
  margin: 0.8rem 0.4rem;
  padding: 0.6rem 1.25rem;
  text-align: center;
  text-decoration: none;
  width: 100%;
  background-color: #007BAC;
  color: #fff;
  border-radius: 5px;
  border-radius: 5px;
  font-weight: normal;
}

.uvalib-button:visited {
  color: #fff;
}

a.uvalib_link--button {
  display: inline-block;
  margin: 0.5rem;
  padding: 0.88rem;
  background-color: #007BAC;
  border-radius: 5px;
  text-decoration: underline;
  color: #fff;
}

.uvalib-button:hover,
.uvalib-button.uvalib-button--hover,
a.uvalib_link--button:hover,
a.uvalib_link--button.uvalib_link--button--hover {
  background-color: #005679;
}

a.uvalib_link--button:hover,
a.uvalib_link--button.uvalib_link--button--hover {
  text-decoration: none;
}

.uvalib-button:active,
.uvalib-button.uvalib-button--active,
a.uvalib_link--button:active,
a.uvalib_link--button--active {
  background-color: #232D4B;
}

a.uvalib_link--button i {
  padding: 2px 4px;
  text-decoration: none;
}

a.uvalib_link--button:hover i {
  text-decoration: underline;
}


/* Disabled Buttons */

.uvalib-button:disabled,
.uvalib-button.uvalib-button--subtle:disabled,
a.uvalib_link--button--disabled,
a.uvalib_link--button.uvalib_link--button--subtle.uvalib_link--button--disabled,
a.uvalib_link--button.uvalib_link--button--alt--disabled {
  background-color: #DADADA;
  color: #fff;
  pointer-events: none;
  box-shadow: none;
}


/* Default Subtle Buttons & Link Buttons */

.uvalib-button--subtle,
a.uvalib_link--button.uvalib_link--button--subtle {
  background-color: #BFE7F7;
  color: #4F4F4F;
  box-shadow: inset 0 0 0 2px #007BAC;
}

.uvalib-button--subtle:hover,
.uvalib-button--subtle.uvalib-button--hover,
a.uvalib_link--button.uvalib_link--button--subtle:hover,
a.uvalib_link--button.uvalib_link--button--subtle.uvalib_link--button--hover {
  background-color: #91D8F2;
  box-shadow: inset 0 0 0 2px #007BAC;
}

.uvalib-button--subtle:active,
.uvalib-button--subtle.uvalib-button--active,
a.uvalib_link--button.uvalib_link--button--subtle:active,
a.uvalib_link--button.uvalib_link--button--subtle.uvalib_link--button--active {
  background-color: #55C4EC;
  box-shadow: inset 0 0 0 2px #007BAC;
}


/* Default Basic Buttons */

.uvalib-button--basic,
a.uvalib_link--button.uvalib_link--button--basic {
  background-color: #DADADA;
  color: #4F4F4F;
  box-shadow: inset 0 0 0 2px #808080;
}

.uvalib-button--basic:hover,
.uvalib-button--basic.uvalib-button--hover,
a.uvalib_link--button.uvalib_link--button--basic:hover,
a.uvalib_link--button.uvalib_link--button--basic.uvalib_link--button--hover {
  background-color: #F1F1F1;
  box-shadow: inset 0 0 0 2px #808080;
}

.uvalib-button--basic:active,
.uvalib-button--basic.uvalib-button--active,
a.uvalib_link--button.uvalib_link--button--basic:active,
a.uvalib_link--button.uvalib_link--button--basic.uvalib_link--button--active {
  background-color: #4F4F4F;
  color: #fff;
  box-shadow: inset 0 0 0 2px #2B2B2B;
}


/* Outline Buttons */

.uvalib-button--outline,
.uvalib_link--button--outline,
a.uvalib_link--button.uvalib_link--button--outline {
  background-color: transparent;
  box-shadow: inset 0 0 0 2px #007BAC;
  color: #007BAC;
}

.uvalib-button--outline.uvalib-button--hover,
.uvalib-button--outline:hover,
a.uvalib_link--button--outline.uvalib_link--button--hover,
a.uvalib_link--button--outline:hover {
  background-color: transparent;
  box-shadow: inset 0 0 0 2px #005679;
  color: #005679;
}

.uvalib-button--outline.uvalib-button--active,
.uvalib-button--outline:active,
a.uvalib_link--button--outline.uvalib_link--button--active,
a.uvalib_link--button--outline:active {
  background-color: transparent;
  box-shadow: inset 0 0 0 2px #232D4B;
  color: #232D4B;
}

.uvalib-button--outline-disabled,
.uvalib-button--outline:disabled,
a.uvalib_link--button.uvalib_link--button--outline.uvalib_link--button--disabled,
a.uvalib_link--button--outline:disabled {
  background-color: transparent;
  box-shadow: inset 0 0 0 2px #DADADA;
  color: #DADADA;
}


/* Outline Inverse Buttons */

.uvalib-button--outline.uvalib-button--inverse,
a.uvalib_link--button--outline.uvalib_link--button--inverse {
  box-shadow: inset 0 0 0 2px #fff;
  color: #fff;
}

.uvalib_link--button--inverse {
  color: #fff;
}

.uvalib-button--outline.uvalib-button--inverse.uvalib-button--hover,
.uvalib-button--outline.uvalib-button--inverse:hover,
a.uvalib_link--button--outline.uvalib_link--button--inverse.uvalib_link--button--hover,
a.uvalib_link--button--outline.uvalib_link--button--inverse:hover {
  box-shadow: inset 0 0 0 2px #DADADA;
  color: #DADADA;
}

.uvalib-button--outline.uvalib-button--inverse.uvalib-button--active,
.uvalib-button--outline.uvalib-button--inverse:active,
a.uvalib_link--button--outline.uvalib_link--button--inverse.uvalib_link--button--active,
a.uvalib_link--button--outline.uvalib_link--button--inverse:active {
  background-color: transparent;
  box-shadow: inset 0 0 0 2px #fff;
  color: #fff;
}

.uvalib-button--outline-disabled.uvalib-button--inverse,
.uvalib-button--outline:disabled.uvalib-button--inverse,
a.uvalib_link--button.uvalib_link--button--outline.uvalib_link--button--inverse--disabled,
a.uvalib_link--button--outline:disabled.uvalib_link--button--inverse {
  background-color: transparent;
  box-shadow: inset 0 0 0 2px #808080;
  color: #808080;
}


/* Alternate Buttons */

.uvalib-button--alt,
.uvalib_link--button--alt,
a.uvalib_link--button.uvalib_link--button--alt {
  background-color: #E57200;
  color: #2B2B2B;
}

.uvalib-button--alt:hover,
.uvalib-button--alt.uvalib-button--hover,
a.uvalib_link--button--alt:hover,
a.uvalib_link--button--alt.uvalib_link--button--hover {
  background-color: #B35900;
  color: #fff;
}

.uvalib-button--alt:active,
.uvalib-button--alt.uvalib-button--active,
a.uvalib_link--button--alt:active,
a.uvalib_link--button--alt.uvalib_link--button--active {
  background-color: #854200;
  color: #fff;
}


/* button sizes */

.uvalib-button--small,
.uvalib_link--button--small {
  border-radius: 0.25rem;
  font-size: 0.85rem;
  padding: 0.5rem 1rem;
}

.uvalib-button--large,
.uvalib_link--button--large {
  border-radius: 0.25rem;
  font-size: 1.33rem;
  padding: 1rem 1.5rem;
}


/* button icon positioning */

.uvalib-icon__left i {
  padding-right: 0.5rem;
}

.uvalib-icon__right i {
  padding-left: 0.5rem;
}

.uvalib-icon__notext {
  padding: 0.6rem 1rem;
}


/* buttons for mobile */

@media (min-width: 30rem) {
  .uvalib-button,
  .uvalib_link--button {
    width: auto;
  }
}

/* Switch Sizes */

svg {
  display: inline-block;
  width: 17px;
  height: 17px;
  position: relative;
  top: 4px;
  left: -5px;
}

.toggleSwitch {
  display: inline-block;
  position: relative;
  overflow: visible;
  padding: 0.3rem;
  cursor: pointer;
  width: 14.6rem;
  background-color: #F1F1F1;
  border: 1px solid #ccc;
  border-radius: 10px;
  height: 3rem;
}

.toggleSwitch span span {
  display: none;
}

.toggleSwitch * {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.toggleSwitch label {
  line-height: 20px;
  height: 20px;
  vertical-align: middle;
  position: relative;
  z-index: 3;
  display: block;
  width: 100%;
}

.toggleSwitch > span {
  line-height: 20px;
  height: 20px;
  vertical-align: middle;
  position: absolute;
  left: 0;
  width: calc(100% - 6px);
  margin: 0;
  text-align: left;
  white-space: nowrap;
  margin: 0 3px;
}

.toggleSwitch > span span {
  position: absolute;
  z-index: 5;
  display: block;
  width: 50%;
  margin-left: 50px;
  text-align: left;
  width: auto;
  left: 0;
  top: 1px;
  opacity: 1;
  width: 40%;
  text-align: center;
  line-height: 34px;
}

.toggleSwitch > span span:first-of-type {
  color: white;
  opacity: 1;
  left: 10px;
  margin: 0;
  width: 50%;
}

.toggleSwitch > span span:first-of-type svg {
  fill: white;
}

.toggleSwitch > span span:last-of-type {
  left: auto;
  right: 0;
  color: #2B2B2B;
  margin: 0;
  width: 50%;
}

.toggleSwitch > span span:last-of-type svg {
  fill: #2B2B2B;
}

.toggleSwitch > span:before {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: -2px;
  border-radius: 30px;
  -webkit-transition: all 0.2s ease-out;
  -moz-transition: all 0.2s ease-out;
  transition: all 0.2s ease-out;
}

.toggleSwitch input {
  position: absolute;
  opacity: 0;
  z-index: 5;
}

.toggleSwitch input:focus ~ a {
  outline: none;
}

.toggleSwitch input:focus + label {
  outline: none;
}

.toggleSwitch input:checked ~ a {
  left: calc(50% - 3px);
}

.toggleSwitch input:checked ~ span span:first-of-type {
  left: 0;
  color: #2B2B2B;
}

.toggleSwitch input:checked ~ span span:first-of-type svg {
  fill: #2B2B2B;
}

.toggleSwitch input:checked ~ span span:last-of-type {
  color: white;
}

.toggleSwitch input:checked ~ span span:last-of-type svg {
  fill: white;
}

.toggleSwitch a {
  position: absolute;
  right: 50%;
  z-index: 4;
  display: block;
  top: 10px;
  bottom: 10px;
  padding: 0;
  left: 10px;
  width: 48%;
  background-color: #007BAC;
  border-radius: 10px;
  -webkit-transition: all 0.2s ease-out;
  -moz-transition: all 0.2s ease-out;
  transition: all 0.2s ease-out;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.toggleSwitch a:focus {
  outline-offset: 3px;
}

.toggleSwitch.large {
  width: 60px;
  height: 27px;
}

.toggleSwitch.large a {
  width: 27px;
}

.toggleSwitch.large > span {
  height: 29px;
  line-height: 28px;
}

.toggleSwitch.large > span span {
  font-size: 1.1rem;
}

.toggleSwitch.large > span span:first-of-type {
  left: 50%;
}

.toggleSwitch.large input:checked ~ a {
  left: 41px;
}

.toggleSwitch.xlarge {
  width: 80px;
  height: 36px;
}

.toggleSwitch.xlarge a {
  width: 36px;
}

.toggleSwitch.xlarge > span {
  height: 38px;
  line-height: 37px;
}

.toggleSwitch.xlarge > span span {
  font-size: 1.4rem;
}

.toggleSwitch.xlarge > span span:first-of-type {
  left: 50%;
}

.toggleSwitch.xlarge input:checked ~ a {
  left: 52px;
}

.main-navigation-wrapper {
  margin-top: 0.5rem;
  margin-bottom: 0;
  border-bottom: 5px solid #232D4B;
}

#utility-nav {
  float: right;
}

#utility-nav ul:first-of-type {
  display: flex;
  list-style-type: none;
  gap: 1.5rem;
}

#utility-nav a {
  color: #232D4B !important;
}

#utility-nav ul li:nth-child(5) {
  display: flex;
}

#utility-nav ul li:nth-child(5) a {
  padding-left: 0.35em;
}

#utility-nav ul li:nth-child(5)::before {
  display: inline-block;
  content: "";
  width: 1rem;
  height: 1rem;
  margin-top: 0.75em;
  content: url(https://www.library.virginia.edu/themes/uvalib-drupal-theme/assets/svg-icons/bell.svg);
  margin-top: 0.25rem;
}

#utility-nav ul li:nth-child(6) {
  display: flex;
}

#utility-nav ul li:nth-child(6) a {
  padding-left: 0.35em;
}

#utility-nav ul li:nth-child(6)::before {
  display: inline-block;
  content: "";
  width: 1rem;
  height: 1rem;
  margin-top: 0.75em;
  content: url(https://www.library.virginia.edu/themes/uvalib-drupal-theme/assets/svg-icons/magnifying-glass.svg);
  margin-top: 0.25rem;
}

.mobile-nav,
.open-nav-inner {
  display: none;
}

nav #uvalibrary-nav .mainlibrary-nav {
  background-color: #fff;
  display: flex;
  list-style-type: none;
  padding: 0;
  margin: 0;
}

nav #uvalibrary-nav .mainlibrary-nav ul {
  background-color: #fff;
  border-top-width: 5px;
  border-radius: 0 0 4px 4px;
  display: block;
  list-style-type: none;
  margin: 0;
  min-width: 200px;
  padding: 0;
  position: absolute;
  top: 100%;
  z-index: 1000;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

nav #uvalibrary-nav .mainlibrary-nav ul a {
  border: 0;
  color: #232D4B;
  display: block;
  margin: 0;
  padding: 0.5em 1em;
  text-decoration: underline;
  font-weight: 400;
}

nav #uvalibrary-nav .mainlibrary-nav ul a:focus {
  outline-offset: -0.25rem;
  position: relative;
}

nav #uvalibrary-nav .mainlibrary-nav li:not(.li-1) {
  margin: 0 1px;
}

nav #uvalibrary-nav .mainlibrary-nav > li {
  display: flex;
  position: relative;
}

nav #uvalibrary-nav .mainlibrary-nav button {
  border: none;
  font-weight: 500;
}

nav #uvalibrary-nav .mainlibrary-nav button::after {
  content: "";
  border-bottom: 1px solid #232D4B;
  border-right: 1px solid #232D4B;
  height: 0.5em;
  margin-left: 0.75em;
  width: 0.5em;
  transform: rotate(45deg);
}

nav #uvalibrary-nav .mainlibrary-nav ul a:hover,
nav #uvalibrary-nav .mainlibrary-nav ul a:focus {
  background-color: #DADADA;
  margin-bottom: 0;
  text-decoration: none;
}

nav #uvalibrary-nav .mainlibrary-nav button {
  align-items: center;
  background-color: transparent;
  display: flex;
  padding: 11.5px 1rem;
}

nav #uvalibrary-nav .mainlibrary-nav button:focus {
  outline-offset: -0.25rem;
  position: relative;
}

nav #uvalibrary-nav .mainlibrary-nav button:hover,
nav #uvalibrary-nav .mainlibrary-nav button[aria-expanded=true] {
  background-color: #DADADA;
  color: #232D4B;
}

nav #uvalibrary-nav .mainlibrary-nav button:hover::after,
nav #uvalibrary-nav .mainlibrary-nav button[aria-expanded=true]::after {
  border-color: #232D4B;
}

.open-mobile-menu {
  display: none;
}

@media (max-width: 992px) {
  .open-mobile-menu {
    display: block;
    float: right;
    margin-top: 1rem;
    margin-right: 1rem;
    width: 44px;
    height: 44px;
    border: none;
    background-color: #fff;
    cursor: pointer;
  }
  .open-mobile-menu:hover,
.open-mobile-menu:focus {
    color: #E57200;
  }
  .overlayTest {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(3px);
    z-index: -1;
  }
  .mobile-menu-modal > ul {
    display: grid;
    margin-top: 2.5rem;
  }
  body {
    position: relative;
  }
  nav.main-nav {
    display: none;
  }
  .utility-nav {
    display: none;
  }
  .open-nav-inner {
    display: inline-block !important;
  }
  .main-navigation-wrapper.w3-sidebar {
    right: 0;
  }
  .mobile-nav-menu-2 {
    background-color: #fff;
    height: fit-content;
    position: absolute !important;
    right: 0;
    top: 0;
    border-top: 2px solid #DADADA;
    border-left: 2px solid #DADADA;
    border-bottom: 2px solid #DADADA;
    padding: 0 1rem;
    width: 340px;
    z-index: 1000;
  }
  .mobile-nav-menu-2 .close-nav {
    display: block;
    position: absolute;
    top: 10px;
    right: 0;
  }
  .mobile-nav-menu-2 .mainlibrary-nav {
    flex-direction: column;
    list-style-type: none;
    padding: 0;
  }
  .mobile-nav-menu-2 .mainlibrary-nav li:last-child {
    margin-bottom: 0;
  }
  .mobile-nav-menu-2 .mainlibrary-nav li:nth-child(5) {
    border-bottom: 3px solid #232D4B;
  }
  .mobile-nav-menu-2 .mainlibrary-nav li:not(.li-expanded) {
    text-decoration: underline;
    color: #4F4F4F;
  }
  .mobile-nav-menu-2 .mainlibrary-nav li:not(.li-expanded):nth-child(n+6) {
    background-color: #BFE7F7;
    padding: 0.25rem 0.75rem;
  }
  .mobile-nav-menu-2 .mainlibrary-nav li:not(.li-expanded):first-child {
    display: contents;
    float: left !important;
    padding: initial;
    border: none;
  }
  .mobile-nav-menu-2 .mainlibrary-nav li:not(.li-expanded):first-child a {
    color: #232D4B;
  }
  .mobile-nav-menu-2 .mainlibrary-nav .menu-list-parent ul li {
    box-shadow: none;
  }
  nav.mobile-nav {
    display: block;
    margin-bottom: 1rem;
    width: 100%;
    font-weight: 500;
  }
  nav.mobile-nav .mainlibrary-nav li .dropdown-arrow {
    color: #232D4B;
  }
  nav.mobile-nav ul.sub-menu-container {
    border-bottom: 0px;
    list-style-type: none;
    padding: 0;
  }
  nav.mobile-nav ul.sub-menu-container li {
    outline: none !important;
    width: 100% !important;
    background-color: #fff !important;
    font-weight: 400 !important;
  }
}
`;class e extends(a(o)){static get styles(){return[...super.styles,n]}_handleButtonClick(){this.dispatchEvent(new CustomEvent("menu-toggle",{bubbles:!0,composed:!0})),this.analyticsEvent(["site-header","button-click","toggle-menu"])}render(){return i`
      <button @click="${this._handleButtonClick}" id="openmobilemenu" tabindex="0" class="open-mobile-menu" aria-label="open menu"> 
        <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="butt" stroke-linejoin="bevel">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      <nav role="navigation" aria-labelledby="block-uvalibrary-v2a-utilitynavmain-menu" id="block-uvalibrary-v2a-utilitynavmain" class="utility-nav">
        <h2 class="visually-hidden" id="block-uvalibrary-v2a-utilitynavmain-menu">Utility Nav-main</h2>
        <div id="utility-nav">
          <ul role="menu" data-once="body" class="ul-0">
            <li role="menuitem" data-once="ul" class="li-0"><a href="https://search.lib.virginia.edu/account" title="My account">My account</a></li>
            <li role="menuitem" data-once="ul" class="li-0"><a href="${this.rootLinkDomain}/askalibrarian" title="Ask a Librarian" data-drupal-link-system-path="node/807">Ask a Librarian</a></li>
            <li role="menuitem" data-once="ul" class="li-0"><a href="${this.rootLinkDomain}/hours" title="Hours" data-drupal-link-system-path="node/1118">Hours</a></li>
            <li role="menuitem" data-once="ul" class="li-0"><a href="${this.rootLinkDomain}/support-library" title="Give" data-drupal-link-system-path="node/1676">Give</a></li>
            <li role="menuitem" data-once="ul" class="li-0"><a href="${this.rootLinkDomain}/status#alerts" title="Alerts" data-drupal-link-system-path="node/1641">Alerts</a></li>
            <li role="menuitem" data-once="ul" class="li-0"><a href="${this.rootLinkDomain}/search" title="Search" data-drupal-link-system-path="node/837">Search</a></li>
          </ul>
        </div>
      </nav>
    `}}window.customElements.define("site-nav",e);
