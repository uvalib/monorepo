import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { SiteStyle } from '@uvalib/site-style';
import { SiteAnalyticsMixin } from '@uvalib/site-analytics/SiteAnalyticsMixin.js';
//import SiteHeaderStyle from './SiteHeaderStyle.js';
import SiteHeaderStyle from './StyleSync.js';

// async import the site-alert component
import ('@uvalib/site-alert/site-alert.js');

export class SiteHeader extends SiteAnalyticsMixin(SiteStyle) {

  static get styles() {
    return [
      ...super.styles,
      SiteHeaderStyle,
      css`
        site-alert {
          display: none;
        }
      `
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

  render() {
    return html`
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
    `;
  }
}
