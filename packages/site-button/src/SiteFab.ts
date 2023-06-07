import { property } from 'lit/decorators.js';
import { html, TemplateResult } from 'lit';
import { SiteButton } from './SiteButton.js';
import { SiteButtonStyle } from './SiteButtonStyle.js';

// Importing FAB button styles
import { SiteFabStyle } from './SiteFabStyle.js';

export class SiteFab extends SiteButton {
    // Define a property 'icon'
    @property({type:String}) icon?: string;

    static get styles() {
        return [
            SiteButtonStyle, SiteFabStyle
        ];
    }

    async connectedCallback() {
        super.connectedCallback();
        // Dynamically import the 'site-icon' module if an icon is set
        if (this.icon) {
            await import('@uvalib/site-icon/site-icon.js' as any);
        }        
    }

    render(): TemplateResult {
        return (this.icon)? html`
          <button
            part="button"
            class=${this.computeClass()}
            ?disabled=${this.disabled}
            aria-disabled=${this.disabled ? 'true' : 'false'}
            aria-label="${this.icon}">
            <span class="content visually-hidden">
              <slot>${this.icon}</slot>
            </span>
            ${this.icon ? html`<site-icon name="${this.icon}"></site-icon>` : ''}
          </button>
        `:html``;
      }
      
}
