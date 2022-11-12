//export function wcDhViz(): string {
//  return 'wc-dh-viz';
//}

import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('dh-viz')
export class DHViz extends LitElement {
  // Define scoped styles right with your component, in plain CSS
  static override styles = css`
    :host {
      color: blue;
    }
  `;

  // Declare reactive properties
  @property()
  name?: string = 'World';

  // Render the UI as a function of component state
  override render() {
    return html`<p>Yo, ${this.name}!</p>`;
  }
}
