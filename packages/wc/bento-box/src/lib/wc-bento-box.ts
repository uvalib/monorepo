import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import './wc-bento-card';

@customElement('bento-box')
export class BentoBox extends LitElement {
  // Define scoped styles right with your component, in plain CSS
  static override styles = css`
    :host {
      padding: 0 10px 10px; 
      color: var(--neutral-foreground-rest);
    }
  `;

  // Declare reactive properties
  @property()
  keyword?: string = 'bento';

  // Render the UI as a function of component state
  override render() {
    return html`

<bento-card sourcetitle="Virgo: Catalog"></bento-card>
<bento-card sourcetitle="Virgo: Articles"></bento-card>
<bento-card sourcetitle="Library Website"></bento-card>
<bento-card sourcetitle="LibGuides"></bento-card>
<bento-card sourcetitle="Talk to a subject expert"></bento-card>

    `;
  }
}