import { html, css } from 'lit';
import { property } from 'lit/decorators.js';
import '@uvalib/site-alert/site-alert.js';
import { SiteStyle } from '@uvalib/site-style';
import SiteHeaderStyle from './SiteHeaderStyle.js';
export class SiteHeader extends SiteStyle {

  static get styles() {
    return [
      ...super.styles,
      SiteHeaderStyle
    ]
  }

  render() {
    return html`
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
    `;
  }
}
