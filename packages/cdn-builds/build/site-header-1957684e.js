import{i as t,x as o}from"./lit-element-9e1ac43c.js";import{S as i}from"./SiteStyle-35a18246.js";const e=t=>class extends t{analyticsEvent(t,o=null){(o||this).dispatchEvent(new CustomEvent("site-analytics-event",{detail:{event:t},bubbles:!0,composed:!0}))}analyticsSearch(t,o=null,i=null,e=null){(e||this).dispatchEvent(new CustomEvent("site-analytics-search",{detail:{searchQuery:t,searchCategory:o,resultCount:i},bubbles:!0,composed:!0}))}};var a=t`

/*
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

*/

#header {
  background-color: #ffffff !important;
  padding: 0.5rem 0;
}

#header .site-name-slogan {
  display: none;
}

#header #block-uvalibrary-branding {
  margin-top: -40px;
}

#header a.site-logo {
  text-decoration: none !important;
}

#header a.site-logo img {
  max-width: 225px;
}

#header #header-inner {
  display: grid;
  grid-template-columns: 225px 1fr;
}

#header #header-inner .block-system-branding-block {
  grid-area: 1/1/2/2;
  width: max-content;
}

#header #header-inner .utility-nav {
  grid-area: 1/2/2/3;
}

@media (max-width: 992px) {
  #header a.site-logo img {
    margin-left: 1rem;
  }
  #header #header-inner {
    display: initial;
    grid-template-columns: none;
  }
  #header .header-inner {
    flex-direction: row;
    justify-content: space-between;
  }
}
`;import("./site-alert-8f7834c4.js");class r extends(e(i)){static get styles(){return[...super.styles,a,t`
        site-alert {
          display: none;
        }
      `]}firstUpdated(t){super.firstUpdated(t),this.shadowRoot&&this.shadowRoot.querySelector("site-nav")&&import("./site-nav-d32660c5.js")}render(){return o`
<site-alert></site-alert>
<header id="header" class="w3-col w3-clear w3-theme-l4 none " role="banner" aria-label="Site header">
  <div id="header-inner" class="w3-container header-inner none">

    <slot>
      <div>
        <slot name="menu-nav">
          <site-nav></site-nav> <!-- Using the site-nav component here -->
        </slot>

        <slot name="branding">
          <div id="block-uvalibrary-v2a-branding" class="block block-system block-system-branding-block">
	          <a href="${this.rootLinkDomain}/" title="Home" rel="home" class="site-logo"><img src="${this.rootLinkDomain}/sites/default/files/2022-09/library_rgb.png" alt="Home"></a>
            <div class="site-name-slogan"></div>
          </div>
        </slot>

      </div>
    </slot>
  </div>
</header>
    `}}window.customElements.define("site-header",r);export{e as S};
