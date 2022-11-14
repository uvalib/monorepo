import {LitElement, css, html, PropertyValueMap} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import './wc-bento-card';
import './wc-bento-search';
import { BentoSearch } from './wc-bento-search';

@customElement('bento-box')
export class BentoBox extends LitElement {
  // Define scoped styles right with your component, in plain CSS
  static override styles = css`
    :host {
      display: block;
      padding: 0 10px 10px; 
    }
  `;

  #searchBox: BentoSearch;

  // Declare reactive properties
  @property({type: String}) keyword?: string = 'foot';

  // Render the UI as a function of component state
  override render() {
    return html`
    <h1>Hello world! ${this.keyword}</h1>
    <bento-search id="searchBox" .keyword="${this.keyword}" @search="${this.search}"></bento-search>
    <bento-card .keyword="${this.keyword}" sourcetitle="Virgo: Catalog"></bento-card>
    <bento-card .keyword="${this.keyword}" sourcetitle="Virgo: Articles"></bento-card>
    <bento-card .keyword="${this.keyword}" sourcetitle="Library Website"></bento-card>
    <bento-card .keyword="${this.keyword}" sourcetitle="LibGuides"></bento-card>
    <bento-card .keyword="${this.keyword}" sourcetitle="Talk to a subject expert"></bento-card>
    `;
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
      this.#searchBox = <BentoSearch>this.shadowRoot.getElementById('searchBox');
  }

  search(e: Event) {
    console.log(`we have a search for ${ this.#searchBox.keyword }`);
    this.keyword = this.#searchBox.keyword;
  }
}