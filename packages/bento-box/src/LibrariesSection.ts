/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line import/no-extraneous-dependencies
import { PropertyValueMap, html } from 'lit';
import { LibrariesData, Library } from '@uvalib/data-wrap';
import { BentoSection } from './BentoSection.js'

export function renderBriefItem(item: Library) {
  console.log(item);
  return html`  
      ${item.link? html`
        <div class="bento-section-title"><a href="${item.link}">${item.title}</a></div>
      `:html`
        <div class="bento-section-title"><a href="http://library.virginia.edu/hours#${item.slug}">${item.title}</a></div>
      `}
      <div class="bento-section-desc"><!-- put todays hours here --></div>
    `;          
}

export class LibrariesSection extends BentoSection {

  #librariesData: LibrariesData;

  constructor(){
    super();
    this.title = "Libraries";
    this.#librariesData = new LibrariesData();
  }

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
      super.updated(_changedProperties);
      if (_changedProperties.has('query')) {
        this.loading = true;
        this.#librariesData.query = this.query;
        this.#librariesData.fetchData().then(()=>{
          console.log(this.#librariesData)
          this.items = this.#librariesData.items;
          this.loading = false;
        })
      }
  }

  // eslint-disable-next-line class-methods-use-this
  renderBriefItem(item: Library) {
    return renderBriefItem(item);
  }

}
