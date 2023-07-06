import{i as e,s as i,x as a}from"../../lit-element-b1a1c7e4.js";import{S as t}from"../../SiteStyle-00ee8f65.js";import"../../query-assigned-elements-ba719eec.js";class l extends i{render(){return a`
<!-- Start: Pre-Header -->
<div id="pre_header" class="w3-col w3-clear w3-theme-l5 ">
	<div id="pre_header-inner" class="w3-row pre_header-inner w3-width-1360">
    <section class="views-element-container alert-sitewide-lvl4 w3-block w3-block-wrapper block-views block-views-blockalert4-published-sitewide-block-1" id="block-uvalibrary-v2a-views-block-alert4-published-sitewide-block-1">
      <div>
        <div class="uva-alert--sitewide view view-alert4-published-sitewide view-id-alert4_published_sitewide view-display-id-block_1 js-view-dom-id-96ab9ea9272ee605d9b31310c4122d2c05e78303f30d7fdcdf9e122499f8369f">
        </div>
      </div>
    </section>
  </div>
</div>
<!-- End: Pre-Header -->
    `}}l.styles=e`
    :host {
      display: block;
      padding: 25px;
      color: var(--site-alert-text-color, #000);
    }
  `,window.customElements.define("site-alert",l);var r=e`
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
`;window.customElements.define("site-header",class extends t{static get styles(){return[...super.styles,r]}render(){return a`
<site-alert></site-alert>
<!-- Start: Header -->
<header id="header" class="w3-col w3-clear w3-theme-l4 none " role="banner" aria-label="Site header">
	<div id="header-inner" class="w3-container header-inner w3-width-1360">
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
					<li role="menuitem">
						<a href="https://search.lib.virginia.edu/account" title="My account">My account</a>
					</li>
					<li role="menuitem">
						<a href="/askalibrarian" title="Ask a Librarian" data-drupal-link-system-path="node/807">Ask a Librarian</a>
					</li>
					<li role="menuitem">
						<a href="/hours" title="Hours" data-drupal-link-system-path="node/1118">Hours</a>
					</li>
					<li role="menuitem">
						<a href="/support-library" title="Give" data-drupal-link-system-path="node/1676">Give</a>
					</li>
					<li role="menuitem">
						<a href="/status#alerts" title="Alerts" data-drupal-link-system-path="node/1641">Alerts</a>
					</li>
					<li role="menuitem">
						<a href="/search" title="Search" data-drupal-link-system-path="node/837">Search</a>
					</li>
				</ul>
	    </div>
    </nav>
    <section id="block-uvalibrary-v2a-branding" class="w3-block w3-block-wrapper block-system block-system-branding-block">
      <a href="/" title="Home" rel="home" class="site-logo">
        <img src="https://library.virginia.edu/sites/default/files/2022-09/library_rgb.png" alt="Home" />
      </a>
      <div class="site-name-slogan"></div>
    </section>

    <section id="block-analyticstrackingcode" class="w3-block w3-block-wrapper block-block-content block-block-contente9ac28b3-1917-44d0-9461-cb23e685c626">
      <div class="layout layout--onecol">
        <div  class="layout__region layout__region--content"> 
          <section class="w3-block w3-block-wrapper block-layout-builder block-field-blockblock-contentbasicbody">
            <div class="clearfix text-formatted field field--name-body field--type-text-with-summary field--label-hidden field__item">
              <uvalib-analytics matomoId="10">
                <noscript><p><img src="https://analytics.lib.virginia.edu/matomo.php?idsite=10&rec=1" style="border:0;" alt="" /></p></noscript>
              </uvalib-analytics>
              <script type="module" src="https://unpkg.internal.lib.virginia.edu/v0.0.12/uvalib-analytics.js"></script></div>
          </section>
        </div>
      </div>
    </section>
	</div>
</header>
<!-- End: Header -->
    `}});
