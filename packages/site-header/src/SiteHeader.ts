import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { SiteStyle } from '@uvalib/site-style';
import SiteHeaderStyle from './SiteHeaderStyle.js';

// async import the site-alert component
import ('@uvalib/site-alert/site-alert.js');

export class SiteHeader extends SiteStyle {

  static get styles() {
    return [
      ...super.styles,
      SiteHeaderStyle
    ];
  }

  firstUpdated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.firstUpdated(changedProperties);

    // Check if uvalib-analytics is present in the shadow DOM
    const uvalibAnalytics = this.shadowRoot?.querySelector('uvalib-analytics');
    if (uvalibAnalytics) {
      // Dynamically import the module if uvalib-analytics is present
      import('@uvalib/uvalib-analytics/uvalib-analytics.html');
    }
  }

  private _handleButtonClick() {
    // Emit an event when the button is clicked
    this.dispatchEvent(new CustomEvent('menu-toggle', {
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
<site-alert></site-alert>
<header id="header" class="w3-col w3-clear w3-theme-l4 none " role="banner" aria-label="Site header">
  <div id="header-inner" class="w3-container header-inner w3-width-1360">
    <button @click="${this._handleButtonClick}" id="openmobilemenu" tabindex="0" class="open-mobile-menu" aria-label="open menu"> 
      <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="butt" stroke-linejoin="bevel">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>

    <slot>
      <div>
        <slot name="menu-nav">
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
        </slot>

        <slot name="branding">
          <div id="block-uvalibrary-v2a-branding" class="block block-system block-system-branding-block">
	          <a href="${this.rootLinkDomain}/" title="Home" rel="home" class="site-logo"><img src="${this.rootLinkDomain}/sites/default/files/2022-09/library_rgb.png" alt="Home"></a>
            <div class="site-name-slogan"></div>
          </div>
        </slot>

        <slot name="tracking">
          <uvalib-analytics matomoid="10"><noscript><p><img src="https://analytics.lib.virginia.edu/matomo.php?idsite=10&rec=1" style="border:0;" alt="" /></p></noscript></uvalib-analytics>
        </slot>
      </div>
    </slot>
  </div>
</header>
    `;
  }
}