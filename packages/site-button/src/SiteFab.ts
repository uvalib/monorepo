import { property, customElement } from 'lit/decorators.js';
import { LitElement, html, css, CSSResult, TemplateResult } from 'lit';
import { SiteButton } from './SiteButton.js';
import { SiteButtonStyle } from './SiteButtonStyle.js';

// Importing FAB button styles
import { SiteFabStyle } from './SiteFabStyle.js';

@customElement('site-fab')
export class SiteFab extends SiteButton {
    static get styles() {
        return [
            SiteButtonStyle, SiteFabStyle
        ];
    }
    
  // You can override any methods or properties here for the FAB button specific behaviors.
}
