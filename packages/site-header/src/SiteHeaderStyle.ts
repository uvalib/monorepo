import { css } from 'lit';

export default css`
    :host {
      display: block;
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