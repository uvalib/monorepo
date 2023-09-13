import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { SiteStyle } from '@uvalib/site-style';
import { SiteAnalyticsMixin } from '@uvalib/site-analytics/SiteAnalyticsMixin.js';
import SiteNavStyle from './SiteNavStyle.js';

export class SiteNav extends SiteAnalyticsMixin(SiteStyle) {
  static get styles() {
    return [
      ...super.styles,
      SiteNavStyle
    ];
  }

  render() {
    return html`
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
    `;
  }
}
