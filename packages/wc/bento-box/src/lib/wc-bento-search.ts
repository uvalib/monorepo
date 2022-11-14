import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import { 
  allComponents, 
  provideFASTDesignSystem, 
  TextField
} from "@microsoft/fast-components";

provideFASTDesignSystem()
  .withPrefix("uvalib")
  .register(allComponents);

@customElement('bento-search')
export class BentoSearch extends LitElement {
  // Define scoped styles right with your component, in plain CSS
  static override styles = css`
    :host {
      display: block;
      padding: 0 10px 10px; 
    }
        
  `;

  #searchField: TextField;

  // Declare reactive properties
  @property({type: String})
  keyword?: string = 'bento';

  @property({type: String})
  sourcetitle?: string = 'UVA Library';

  // Render the UI as a function of component state
  override render() {
    return html`
      <uvalib-text-field id="search" .value="${this.keyword}"></uvalib-text-field>
      <uvalib-button @click="${this.search}">Search</uvalib-button>  
    `;
  }

  protected firstUpdated(): void {
      this.#searchField = <TextField>this.shadowRoot.getElementById('search');
  }

  search(){

    console.log(`search for ${ this.#searchField.value }`)
    this.keyword = this.#searchField.value;
    this.dispatchEvent(new CustomEvent("search", {bubbles: true, composed: true}));
  }
}