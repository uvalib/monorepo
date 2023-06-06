import { property } from 'lit/decorators.js';
import { html, TemplateResult } from 'lit';
import { SiteButton } from './SiteButton.js';
import { SiteButtonStyle } from './SiteButtonStyle.js';

import '@uvalib/site-icon/site-icon.js'

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
//        if (this.icon) {
//            await import('@uvalib/site-icon/src/site-icon.js');
//        }
    }

    render(): TemplateResult {
        return html`
            <button
                part="button"
                class=${this.computeClass()}
                ?disabled=${this.disabled}
                aria-disabled=${this.disabled ? 'true' : 'false'}>
                <span class="content">
                    <slot></slot>
                </span>
                ${this.icon ? html`<site-icon name="${this.icon}"></site-icon>` : ''}
            </button>
        `;
    }
}
