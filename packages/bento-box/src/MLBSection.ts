/* eslint-disable lit/no-value-attribute */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { html, PropertyValueMap } from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import { MLBib, GeneralSearchMeta, MLBData, GeneralSearchResult } from '@uvalib/data-wrap';
import { property } from 'lit/decorators.js';
import { BentoSection } from './BentoSection.js';

export class MLBSection extends BentoSection {

  #mlbData: MLBData;

  @property({ type: Array }) items: MLBib[] = [];
  @property({ type: Number }) indexYear?: number;
  @property({ type: Boolean }) embedded: boolean = false;

  meta: GeneralSearchMeta = {totalResults:0};

  constructor(){
    super();
    this.title = "Modern Library Bibliography";
    this.#mlbData = new MLBData({query:""});
    this.limit = 5;
  }

  /**
   * Reacts to property changes and fetches data accordingly.
   * @param _changedProperties - The properties that have changed.
   */
  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
      super.updated(_changedProperties);
      if (_changedProperties.has('query') || _changedProperties.has('indexYear')) {
        this.loading = true;

        // Update the index URL if indexYear is set
        if (this.indexYear) {
          const customIndexURL = `https://mlbib.library.virginia.edu/json/${this.indexYear}.json`;
          this.#mlbData = new MLBData({query: this.query, indexes: [customIndexURL]});
        } else {
          this.#mlbData = new MLBData({query: this.query});
        }

        this.#mlbData.fetchData()
          .then((data: {meta: GeneralSearchMeta, items: GeneralSearchResult[]} )=>{
            this.items = data.items;
            this.meta = data.meta;
            this.loading = false;
          });
      }
  }

  /**
   * Highlights a snippet of text based on the current query.
   * @param text - The text to highlight.
   * @param limit - The number of characters before and after the match.
   * @returns The highlighted snippet.
   */
  highlight(text: string, limit: number) {
    const { query } = this;
    const words = query.split(" ");
    let snippet = "";
    let matchIndex = -1;

    // Find the first occurrence of any of the query words
    for (let i = 0; i < words.length && matchIndex === -1; i++) {
        const regex = new RegExp(`\\b${words[i]}\\b`, "i");
        matchIndex = text.search(regex);
    }

    // If a match is found, extract a snippet around it
    if (matchIndex !== -1) {
        let start = Math.max(matchIndex - limit, 0);
        let end = Math.min(matchIndex + words[0].length + limit, text.length);

        // Adjust start and end to not break words
        if (text[start] !== ' ' && text.lastIndexOf(" ", start) !== -1) {
            start = text.lastIndexOf(" ", start);
        }
        if (text[end] !== ' ' && text.indexOf(" ", end) !== -1) {
            end = text.indexOf(" ", end);
        }

        snippet = text.substring(start, end);
    } else {
        // If no match is found, return the first 'limit' characters
        snippet = text.substring(0, 2 * limit); // Adjusted to 2*limit to account for characters before and after the match
    }

    // Highlight the query words within the snippet
    for (let word of words) {
        const regex = new RegExp(`(${word})`, "gi");
        snippet = snippet.replace(regex, '<mark>$1</mark>');
    }

    return snippet;
  }
  

  /**
   * Renders the list of items.
   * @returns The rendered list of items.
   */
  private renderItems() {
    return this.items.map(result => html`
      <li class="bs-results--list--entry">
        <a href="${result.link? result.link:''}" class="bento-section-title">${result.title}</a>
        ${result.description? html`
          <div class="bento-section-desc">
            ${ result.year && !String(result.id).startsWith("anchor")? html`
              <mlb-section embedded .query="${this.query}" indexYear="${result.year}"></mlb-section>
            `: html`${unsafeHTML(this.highlight(result.description, 60))}` }  <!-- Adjust the limit as needed -->
          </div>
        `:''}
      </li>
    `);
  }

  render() {
    return html`
      <div class="bs-results--header">
      </div>

      <div class="bs-results--body">
          <p id="no-results" ?hidden="${!this.isEmptySearch}">${this.noResultDescribe}</p>

          ${this.embedded ? html`
            <ul ?hidden="${this.isEmptySearch}" class="bs-results--list">
              ${this.renderItems()}
            </ul>
          ` : html`
            <ol ?hidden="${this.isEmptySearch}" class="bs-results--list">
              ${this.renderItems()}
            </ol>
          `}
      </div>
    `;
  }
}
