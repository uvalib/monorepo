import { css } from 'lit';

export default css`
    :host {
      display: block;
    }
    * {
      font-family: franklin-gothic-urw, Arial, Helvetica, sans-serif !important;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    #header {
      background-color: white;
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
    .header-inner {
        float: none;
        max-width: 1600px;
        margin: 0 auto !important;
    }
    .open-mobile-menu {
        display: none;
    }
    #utility-nav ul:first-of-type {
      display: flex;
      list-style-type: none;
      gap: 1.5rem;
    }
    #utility-nav a {
      color: #232D4B !important;
    }
    a:not([class]) {
      text-decoration-skip-ink: auto;
    }
    ul li a {
      text-decoration: underline !important;
    }

    .visually-hidden {
        position: absolute !important;
        overflow: hidden;
        clip: rect(1px, 1px, 1px, 1px);
        width: 1px;
        height: 1px;
        word-wrap: normal;
    }

    #utility-nav {
      float: right;
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
`;