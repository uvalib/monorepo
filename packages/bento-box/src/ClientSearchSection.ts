import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { SearchLibrary } from '@uvalib/site-search-index/SearchLibrary.js';
//import { SearchLibrary } from '@uvalib/js-search/dist/browser/SearchLibrary.js';
import { BentoSection, renderBriefItem } from './BentoSection.js';

interface CatalogItem {
  url: string;
  // include other properties of catalog items here
}
export class ClientSearch extends BentoSection {

  //private searchLib: SearchLibrary = new SearchLibrary();
  private searchLib: any = new SearchLibrary();
  private catalog: any = null;

  private staticIndexURL: string = '/demo/searchIndex.json'; // Replace with your static index URL
  private staticCatalogURL: string = '/demo/catalog.json'; // Replace with your static catalog URL

  @property({ type: Boolean }) loading: boolean = true;

  async firstUpdated() {
    try {
      const response = await fetch(this.staticIndexURL);
      const indexString = await response.text();      
      await this.searchLib.loadFromString(indexString);
      
      this.catalog = await fetch(this.staticCatalogURL).then(response => response.json());
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
    console.log("Attempt a search");
    if (this.query) {
      const temp = this.searchLib.performSearch(this.query);
      this.items = temp.map((item: any) => this.catalog.find((i: CatalogItem) => i.url === `/minutes/${item.replace(".md","")}/`));
    } else {
      this.items = [];
    }
  }

  renderBriefItem(item: any) {
    console.log(item)
//    console.log(this.catalog)
    if (!item) {
      return renderBriefItem({
        link: '',
        title: '',
        description: ''
      });
    }
    return renderBriefItem({
      link: item.url,
      title: item.title,
      description: item.description
    });
  }

  render() {
    return super.render();
  }
}

//customElements.define('client-search', ClientSearch);
