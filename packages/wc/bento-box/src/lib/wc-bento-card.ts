import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import { 
  allComponents, 
  provideFASTDesignSystem 
} from "@microsoft/fast-components";

provideFASTDesignSystem()
  .withPrefix("uvalib")
  .register(allComponents);

@customElement('bento-card')
export class BentoCard extends LitElement {
  // Define scoped styles right with your component, in plain CSS
  static override styles = css`
    :host {
      display: block;
      padding: 0 10px 10px; 
      color: var(--neutral-foreground-rest);
    }        
  `;

  // Declare reactive properties
  @property({type: String})
  keyword?: string = '';

  @property({type: String})
  sourcetitle?: string = 'UVA Library';

  // Render the UI as a function of component state
  override render() {
    return html`

<uvalib-card>
    <h3>${this.sourcetitle}</h3>
    ${this.keyword}
    ${this.keyword? html`<h4>Search for ${this.keyword}</h4>`:''}
    <p>At purus lectus quis habitant commodo, cras. Aliquam malesuada velit a tortor. Felis orci tellus netus risus et ultricies augue aliquet.</p>
    <uvalib-button>Learn more</uvalib-button>
</uvalib-card>
   
    `;
  }
}