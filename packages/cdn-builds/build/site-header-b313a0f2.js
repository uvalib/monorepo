import{_ as i,n as e}from"./query-assigned-elements-8ef6cca7.js";import{i as a,s as t,x as n}from"./lit-element-9e1ac43c.js";class l extends t{constructor(){super(...arguments),this.rootLinkDomain="https://www.library.virginia.edu"}render(){return n`
      <header
        id="header" class="w3-col w3-clear w3-theme-l4 none" role="banner" aria-label="Site header">
        <div id="header-inner" class="w3-container header-inner none">
          <button id="openmobilemenu" tabindex="0" class="open-mobile-menu" aria-label="open menu">
            <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="butt" stroke-linejoin="bevel">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          <nav role="navigation" aria-labelledby="block-uvalibrary-v2a-utilitynavmain-menu" id="block-uvalibrary-v2a-utilitynavmain" class="utility-nav">
            <h2 class="visually-hidden" id="block-uvalibrary-v2a-utilitynavmain-menu">Utility Nav-main</h2>
            <div id="utility-nav">
              <ul role="menu">
                <li role="menuitem"><a href="https://search.lib.virginia.edu/account" title="My account">My account</a></li>
                <li role="menuitem"><a href="${this.rootLinkDomain}/askalibrarian" title="Ask a Librarian" data-drupal-link-system-path="node/807">Ask a Librarian</a></li>
                <li role="menuitem"><a href="${this.rootLinkDomain}/hours" title="Hours" data-drupal-link-system-path="node/1118">Hours</a></li>
                <li role="menuitem"><a href="${this.rootLinkDomain}/support-library" title="Give" data-drupal-link-system-path="node/1676">Give</a></li>
                <li role="menuitem"><a href="${this.rootLinkDomain}/status#alerts" title="Alerts" data-drupal-link-system-path="node/1641">Alerts</a></li>
                <li role="menuitem"><a href="${this.rootLinkDomain}/search" title="Search" data-drupal-link-system-path="node/837">Search</a></li>
              </ul>
            </div>
          </nav>

          <div id="block-uvalibrary-v2a-branding" class="block block-system block-system-branding-block">
            <a href="${this.rootLinkDomain}/" title="Home" rel="home" class="site-logo">
              <img src="${this.rootLinkDomain}/sites/default/files/2022-09/library_rgb.png" alt="Home" />
            </a>
            <div class="site-name-slogan"></div>
          </div>

        </div>
      </header>
    `}}l.styles=a`

    /* Styles for visually hidden elements */
    .visually-hidden {
      border: 0;
      clip: rect(0 0 0 0);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      white-space: nowrap;
      width: 1px;
    }


    :host {
      display: block;
      padding: 25px;
      color: var(--site-header-text-color, #000);
    }

    /* Direct styles for the header elements */
    #header {
      /* position: fixed;
      top: 0; */
      width: 100%;
      z-index: 1000;
    }
    #header-inner {
      max-width: 1340px;
      margin: 0 /* auto */;
      position: relative;
    }
    .open-mobile-menu {
      display: none;
      position: absolute;
      top: 24px;
      right: 0;
      background: none;
      border: none;
      outline: none;
    }
    .utility-nav {
      float: right;
      text-align: right;
      margin-top: 10px;
    }
    #utility-nav ul {
      margin: 0;
      padding: 0;
      list-style-type: none;
    }
    #utility-nav li {
      display: inline-block;
    }
    .site-logo img {
      max-width: 100%;
      height: auto;
      display: block;
    }

    /* Media queries for responsive design */
    @media screen and (max-width: 992px) {
      #header {
        position: static;
      }
      .open-mobile-menu {
        display: inline-block;
      }
      .utility-nav {
        display: none;
      }
    }

    @media screen and (min-width: 993px) {
      /* Styles for screens wider than 992px */
      .open-mobile-menu {
        display: none;
      }
      .utility-nav {
        display: block;
      }
    }
  `,i([e({type:String})],l.prototype,"rootLinkDomain",void 0),window.customElements.define("site-header",l);
