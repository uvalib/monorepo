import { css } from 'lit';

export const LibraryMain = css`
* {
    font-family: franklin-gothic-urw, Arial, Helvetica, sans-serif !important;
}
*, *::before, *::after {
    box-sizing: border-box;
}
button, input, select, optgroup, textarea {
    color: var(--uva-grey-darkest, #2B2B2B);
}
input, button, textarea, select {
    font: inherit;
}
body, h1, h2, h3, .event-container .event-url .event-date .event--day, h4, .rds-articles h2, .library-hours .uva-library--hours .weekly-hours-header-section .heading-h2, .staff-directory .staff-directory-row .staff-directory-name, .about-uva-library .fact-grid .fact-card--details dd, footer .footer--main .block h2, p, .about-uva-library .fact-grid .fact-card--details dt, figure, blockquote, dl, dd {
    margin: 0;
}
h1, .h1 {
    font-size: 2.488rem !important;
    font-weight: 500;
    color: #232D4B !important;
    line-height: 1.15;
}
h1, h2, .h1, .h2, .news-page .views-row h2:first-of-type, .view-news-full-feed-of-blog-articlces .views-row h2:first-of-type {
    font-weight: 700;
}
h1, .h1, h2, .h2, .news-page .views-row h2:first-of-type, .view-news-full-feed-of-blog-articlces .views-row h2:first-of-type, h3, .event-container .event-url .event-date .event--day, .h3, .library-hours .uva-library--locations .view-content .views-row h2, .staff-bio .field--name-field-uva-ldap-title, .uvalib-bento-search .bs-header h2, .uvalib-bento-search .bs-header p, .exhibitions .current .view-content .views-field-title {
    margin-top: 3rem;
    margin-bottom: 1rem;
}
h4, .rds-articles h2, .library-hours .uva-library--hours .weekly-hours-header-section .heading-h2, .staff-directory .staff-directory-row .staff-directory-name, .about-uva-library .fact-grid .fact-card--details dd, footer .footer--main .block h2, .h4, .sustainable-scholarship .sustainable-links a, .staff-bio .block > h2, .staff-bio .field__label, .news-page .views-row h2, .view-news-full-feed-of-blog-articlces .views-row h2, .block-field-blocknodearticlebody h2 {
    font-size: 1.44rem !important;
    font-weight: 500;
    color: #232D4B !important;
    line-height: 1.15;
}
h4, .rds-articles h2, .library-hours .uva-library--hours .weekly-hours-header-section .heading-h2, .staff-directory .staff-directory-row .staff-directory-name, .about-uva-library .fact-grid .fact-card--details dd, footer .footer--main .block h2, .h4, .sustainable-scholarship .sustainable-links a, .staff-bio .block > h2, .staff-bio .field__label, .news-page .views-row h2, .view-news-full-feed-of-blog-articlces .views-row h2, .block-field-blocknodearticlebody h2, h5, .rds-section .rds-recent--articles ul li a, .rds-articles h3, .about-uva-library .visit-grid .visit-container .hover-block p, .about-uva-library .visit-grid .visit-container .hover-block .fact-grid .fact-card--details dt, .about-uva-library .fact-grid .fact-card--details .visit-grid .visit-container .hover-block dt, .event-container .event-url .event-date .event--month, .event-container .event-url .event-date .event--wkday, .site-sidebar--subnav nav ul li, .h5, .rds-section .neighborhood-teaser .n-t-contents h4, .rds-section .neighborhood-teaser .n-t-contents .rds-articles h2, .rds-articles .rds-section .neighborhood-teaser .n-t-contents h2, .library-hours .three-col .hover-block h3, .how-do-i-main .view-content .item-list ul li a, .how-do-i-detail .view-content h2, .staff-bio .field--name-field-uva-ldap-title .field__item:last-child, .uvalib-bento-search .bs-results-container .bs-results--block .bs-results--header h3, .exhibitions .permanent .view-content .views-row .views-field-title, .exhibitions .view-exhibitions-past .view-content .views-row .views-field-title, .uvalibrary-spaces .rerserve-container .reserve-location h3, .rp-using .neighborhood-teaser .n-t-frame .n-t-contents h4, .home-page .home-hours-block .hour-head, .jumpmenu ul li {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
}
.hidden {
  display: none;
}
.invisible {
  visibility: hidden;
}
a, span a {
    color: var(--uva-blue-alt-dark, #005679);
    text-decoration: underline;
}
#header, #copyright, .close-nav, .mobile-nav, #page-title, #highlighted, .page-wrapper, #footer-menu, #top-container, #main-container, #bottom-container, #footer-container, .search-slide-wrapper, .main-navigation-wrapper, #top-container .top-box > div, #footer-container .footer-box > div, #bottom-container-inner .bottom-box > div {
    background-color: white;
}
.search-slide-inner, .header-inner, .main-navigation-inner-h, .welcome-text-inner, .highlighted-inner, .top-container-inner, .page-title-inner, .main-container-inner, .bottom-container-inner, .footer-container-inner, .footer-menu-inner, .copyright-inner {
    float: none;
    max-width: 1600px;
    margin: 0 auto;
}
svg {
    display: inline-block;
    width: 17px;
    height: 17px;
    position: relative;
    top: 4px;
    left: -5px;
}
img {
    max-width: 100%;
    height: auto;
    vertical-align: middle;
}
img, picture {
    max-width: 100%;
    display: block;
}
.main-container-inner .first-sidebar, .main-container-inner .w3css-content, .main-container-inner .second-sidebar, .top-container-inner .first-top, .top-container-inner .second-top, .top-container-inner .third-top, .bottom-container-inner .first-bottom, .bottom-container-inner .second-bottom, .bottom-container-inner .third-bottom, .bottom-container-inner .forth-bottom, .footer-container-inner .first-footer, .footer-container-inner .second-footer, .footer-container-inner .third-footer {
    margin-bottom: 12px;
    margin-top: 12px;
}
.top-container-inner .first-top, .top-container-inner .second-top, .top-container-inner .third-top, .main-container-inner .first-sidebar, .main-container-inner .w3css-content, .main-container-inner .second-sidebar, .bottom-container-inner .first-bottom, .bottom-container-inner .second-bottom, .bottom-container-inner .third-bottom, .bottom-container-inner .forth-bottom, .footer-container-inner .first-footer, .footer-container-inner .second-footer, .footer-container-inner .third-footer {
    float: left;
}
.top-container-inner .first-top > div, .top-container-inner .second-top > div, .top-container-inner .third-top > div, .main-container-inner .first-sidebar > div, .main-container-inner .w3css-content > div, .main-container-inner .second-sidebar > div, .bottom-container-inner .first-bottom > div, .bottom-container-inner .second-bottom > div, .bottom-container-inner .third-bottom > div, .bottom-container-inner .forth-bottom > div, .footer-container-inner .first-footer > div, .footer-container-inner .second-footer > div, .footer-container-inner .third-footer > div {
    float: left;
    height: 100%;
    width: 100% !important;
    padding: 24px !important;
}
.layout--onecol .layout__region {
    width: 100%;
}
`;

export const MainStyleSheet = new CSSStyleSheet();
MainStyleSheet.replaceSync(`
  ${LibraryMain}
`);