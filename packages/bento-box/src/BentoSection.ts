/* eslint-disable @typescript-eslint/no-unused-vars */
import { html, css, PropertyValueMap } from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import { property } from 'lit/decorators.js';
import { GeneralSearchResult } from '@uvalib/data-wrap';
import { SiteStyle } from '@uvalib/site-style';
import BentoSectionStyle from './BentoSectionStyle.js';
import '@uvalib/site-spinner/site-spinner.js';

export function renderBriefItem(item: GeneralSearchResult) {
  return html`
      ${item.link? html`
        <div class="bento-section-title"><a href="${item.link}">${unsafeHTML(item.title)}</a></div>
      `:html`
        <div class="bento-section-title">${unsafeHTML(item.title)}</div>
      `}
      <div class="bento-section-desc">${unsafeHTML(item.description)}</div>
    `;          
}

export class BentoSection extends SiteStyle {
  static get styles() {
    return [
      ...super.styles,
      BentoSectionStyle
    ]
  }

  @property({ type: String }) query = '';

  @property({ type: Number }) limit: number = 0;

  @property({ type: String }) title = "";

  @property({ type: Number, attribute: "max-title-length" }) maxTitleLength?: number = undefined;

  @property({ type: String }) label: string|null = null;

  @property({ type: Array }) items: GeneralSearchResult[] = [];

  @property({ type: Boolean }) loading = false;

  @property({ type: String, attribute: "no-result-describe" }) noResultDescribe = "";

  @property({ type: Boolean, attribute: "is-empty-search" }) isEmptySearch=true;

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
      if (_changedProperties.has('items') || _changedProperties.has('loading')) {
        this.isEmptySearch = this.loading || !this.items || this.items.length === 0;
      }
  }

  // eslint-disable-next-line class-methods-use-this
  renderBriefItem(item: GeneralSearchResult) {
    return renderBriefItem(item);
  }

  protected limitTitle(title?: String) {
    if (this.maxTitleLength && title && title.length>=this.maxTitleLength)
      return `${title.substring(0, this.maxTitleLength)}…`;
    return title; 
  }

  render() {
    return html`
      <h1>${ this.limitTitle(this.title) }</h1>
      ${this.label==null || this.label!==""? html`
        <h2 ?hidden="${this.loading}">${this.label? this.label:html`Search for ${this.query}`}</h2>
      `:''}
      ${this.loading? html`<site-spinner></site-spinner>`:''}
      <p id="no-results" ?hidden="${this.isEmptySearch}">${this.noResultDescribe}</p>
      <ul ?hidden="${this.loading}">
        ${this.items.map(item=>html`
          <li>
            ${ this.renderBriefItem(item) }
          </li>
        `)}

      </ul>
    `;
  }
}