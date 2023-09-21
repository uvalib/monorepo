import { html } from 'lit';
import { property } from 'lit/decorators.js';
import Document from 'flexsearch/dist/module/document.js';
import { BentoSection, renderBriefItem } from './BentoSection.js';
import { MLBib, GeneralSearchMeta, MLBData, GeneralSearchResult } from '@uvalib/data-wrap';
import '@uvalib/site-spinner/site-spinner.js';

export class ClientSearch extends BentoSection {

  meta: GeneralSearchMeta = {totalResults:0};

  private index: any;
  private filenames: string[] = [];
  private staticIndexURL: string = '/demo/searchIndex.json'; // Replace with your static index URL

  constructor(){
    super();
    this.title = "UVA BOV Minutes";
    this.limit = 5;
  }

  protected updated(changedProps: Map<string | number | symbol, unknown>): void {
    super.updated(changedProps);
    if (changedProps.has('query')) {
      this.performSearch();
    }
  }

  async firstUpdated() {
    try {
      this.loading = true;
      const response = await fetch(this.staticIndexURL);
      const parsedContent = await response.json();
      this.filenames = parsedContent.filenames;

      this.index = new Document({
        document: {
          id: "id",
          index: ["content"],
          store: ["title", "year"]
        }
      });

      // Import all keys from the exported index
      for (let key in parsedContent.index) {
        this.index.import(key, parsedContent.index[key]);
      }

      this.loading = false;

      this.performSearch();
    } catch (error) {
      console.error(`Error loading search index: ${error}`);
      this.loading = false;
    }
  }

  private extractYearAndMonth(filename: string): { year: string, month: string } {
    const [year, month] = filename.split('-');
    return { year, month };
  }

  private generateTitleAndDescription(filename: string): { title: string, description: string } {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const { year, month } = this.extractYearAndMonth(filename);
    const monthName = months[parseInt(month) - 1]; // -1 because array indices start from 0

    const title = `Minutes from ${monthName} ${year}`;
    const description = `Detailed minutes recorded in ${monthName} ${year}`;

    return { title, description };
  }

  private performSearch() {
    console.log("Attempt a search");
    if (this.query && this.index) {
        const searchResults = this.index.search(this.query, { enrich: true });
        console.log(searchResults);

        this.items = searchResults.flatMap((result: any) => result.result).map((item: any) => {
            const filename = this.filenames[parseInt(item.id)];
            const { title, description } = this.generateTitleAndDescription(filename);
            return new GeneralSearchResult({
                id: filename,
                title: title,
                description: description,
                link: `/minutes/${filename.replace('.md','')}`
            });
        });
    } else {
        this.items = [];
    }
  }

  renderBriefItem(item: any) {
    return renderBriefItem({
      link: item.filename,
      title: item.title,
      description: item.year
    });
  }

  render() {
    return html`
      <div class="bs-results--header">
      </div>

      <div class="bs-results--body">
          ${this.loading ? html`<site-spinner></site-spinner>` : html`
            <p id="no-results" ?hidden="${!this.isEmptySearch || this.loading}">${this.noResultDescribe}</p>
          `}

            <ol ?hidden="${this.isEmptySearch}" class="bs-results--list">
              ${this.items.map(result => html`
                <li class="bs-results--list--entry">
                  <a href="${result.link? result.link:''}" class="bento-section-title">${result.title}</a>
                  ${result.description? html`
                    <div class="bento-section-desc">${result.description}</div>
                  `:''}
                </li>
              `)}
            </ol>
      </div>
    `;
  }
}

//customElements.define('client-search', ClientSearch);
