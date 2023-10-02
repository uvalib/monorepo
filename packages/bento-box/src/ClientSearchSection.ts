import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { SearchLibrary } from '@uvalib/js-search/dist/browser/SearchLibrary.js';
import { BentoSection, renderBriefItem } from './BentoSection.js';

export class ClientSearch extends BentoSection {

  //private searchLib: SearchLibrary = new SearchLibrary();
  private searchLib: any = new SearchLibrary();

  private staticIndexURL: string = '/demo/searchIndex.json'; // Replace with your static index URL

  @property({ type: Boolean }) loading: boolean = true;

  async firstUpdated() {
    try {
      const response = await fetch(this.staticIndexURL);
      const indexString = await response.text();      
      await this.searchLib.loadFromString(indexString);
      this.loading = false;
    } catch (error) {
      console.error(`Error loading search index: ${error}`);
      this.loading = false;
    }
  }

  updated(changedProps: Map<string | number | symbol, unknown>): void {
    super.updated(changedProps);
    if (changedProps.has('query')) {
      this.performSearch();
    }
  }

  private performSearch() {
console.log("Attempt a search")    
    if (this.query) {

      this.items = this.searchLib.performSearch(this.query);

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
    return super.render();
  }
}

//customElements.define('client-search', ClientSearch);
