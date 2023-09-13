import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { SiteStyle } from '@uvalib/site-style';
import { SiteAnalyticsMixin } from '@uvalib/site-analytics/SiteAnalyticsMixin.js';
import SiteHeaderStyle from './SiteHeaderStyle.js';

// async import the site-alert component
import ('@uvalib/site-alert/site-alert.js');

export class SiteHeader extends SiteAnalyticsMixin(SiteStyle) {

  static get styles() {
    return [
      ...super.styles,
      SiteHeaderStyle
    ];
  }

  firstUpdated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.firstUpdated(changedProperties);

    // Check if 'site-nav' is used in the shadow DOM
    if (this.shadowRoot && this.shadowRoot.querySelector('site-nav')) {
      // Dynamically import the site-nav component if it's used
      import('@uvalib/site-nav/site-nav.js');
    }
  }

  private _handleButtonClick() {
    // Emit an event when the button is clicked
    this.dispatchEvent(new CustomEvent('menu-toggle', {
      bubbles: true,
      composed: true
    }));

    // Call the analyticsEvent method from the mixin
    this.analyticsEvent(['site-header', 'button-click', 'toggle-menu']);
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
    `;
  }
}
