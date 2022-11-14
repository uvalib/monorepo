import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('foo-bar')
export class FooBAR extends LitElement {
  // Define scoped styles right with your component, in plain CSS
  static styles = css`
    :host {
      color: blue;
    }
  `;

  // Declare reactive properties
  @property()
  name?: string = 'World';

  // Render the UI as a function of component state
  render() {
    return html`<p>Yo, ${this.name}!</p>`;
  }
}
