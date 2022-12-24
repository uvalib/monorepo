import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';

import "@uvalib/site-components/site-tabs.js";
import "@uvalib/site-components/site-select.js";
import "@uvalib/bento-box/bento-box.js";
import "playground-elements/playground-ide.js";

const logo = new URL('../../assets/open-wc-logo.svg', import.meta.url).href;

export class SiteMock extends LitElement {
  @property({ type: String }) title = 'My app';

  @property({ type: String, attribute: "selected-toy" }) selectedToy = "CatalogData";

  @property({ type: Object }) example: any;

  @property({ type: Object }) toys: any = {
    ArticlesData:{
      name: "UVA Library Article Search",
      query: "food"
    },
    CatalogData:{
      name: "UVA Library Catalog",
      query: "football"
    },
    DHatData:{
      name: "DH@UVA Entities"
    },
    EventsData:{
      name: "Events at the Library",
      query: "data"
    },
  //  HoursData:{},
    LibGuidesData:{
      name: "Libguides at the Library",
      query: "3d"
    },
    LibrariesData:{
      name: "Libraries",
      query: "clemons"
    },
    PageData:{
      name: "Pages from the Library Website",
      query: "about"
    },
    PersonData:{
      name: "Library Staff",
      query: "chestnut"
    },
    WebsiteData:{
      name: "Mixed data from the Library Website",
      query: "Unsworth"
    }
  }

  static styles = css`
    :host {
      min-height: 100vh;
      display: block;
    }

  `;

  constructor(){
    super();
    this.example = this.loadExample(this.selectedToy);
  }

  private selectToy(e:Event) {
    const target = <HTMLSelectElement> e.currentTarget;
    this.selectedToy = target.value;
    this.example = this.loadExample(this.selectedToy);
  }

  private loadExample(t:string){
    const toy = this.toys[t];
    return `
      </h2>Example of ${toy.name}</h2>
      <playground-ide editable-file-system line-numbers resizable>
        <script type="sample/html" filename="index.html">
          <!doctype html>
          <body>
            <h1>Search Results from ${this.selectedToy}</h1>
            <p id="resultMeta"></p>
            <site-data-grid id="results"></site-data-grid>
            <script type="module" src="./index.js">&lt;/script>
          </body>
        </script>
        <script type="sample/ts" filename="index.ts">
          // We are using a site-data-grid to stuff results into
          import "@uvalib/site-components/site-data-grid.js";

          // You need the module
          import { ${this.selectedToy} } from '@uvalib/data-wrap';

          // Just getting the elements to show the results in
          const resultJar = document.getElementById("results");
          const metaJar = document.getElementById("resultMeta");

          // A sample query and then make the results visible!
          new ${this.selectedToy}({query:"${toy.query}"}).fetchData().then(results=>{
            metaJar.innerHTML="Search has "+results.meta.totalResults+" results!";
            resultJar.rowsData = results.items.map(r=>({Title:r.title}));
          });        
        </script>
      </playground-ide>    
    `;
  }

  render() {
    return html`
      <main>

      <h1>UVA Library Web Dev Sandbox</h1>

      <site-tabs activeid="dataWrap">
        <site-tab id="dataWrap">Library Data</site-tab>
        <site-tab id="siteComponents">Site Components</site-tab>
        <site-tab id="siteWidgets">Site Widgets</site-tab>
        <site-tab-panel id="dataWrapPanel">
          <div id="selectToy">
            <site-select @change="${this.selectToy}">
              ${Object.keys(this.toys).map(k=>html`<site-option ?selected="${k===this.selectedToy}" value="${k}">${k}</site-option>`)}
            </site-select>
          </div>
          ${unsafeHTML(this.example)}        
        </site-tab-panel>
        <site-tab-panel id="siteComponentsPanel">
          <div>

            <h2>&lt;site-data-grid&gt;</h2>
            <div>
      <playground-ide editable-file-system line-numbers resizable>
        <script type="sample/html" filename="index.html">
          <!doctype html>
          <body>
            <site-data-grid></site-data-grid> 
            <script type="module" src="./index.js">&lt;/script>          
          </body>
        </script>
        <script type="sample/ts" filename="index.ts">
          // Get the module
          import "@uvalib/site-components/site-data-grid.js";

          // populate the grid by adding an array to the rowsData property
          const grid = document.querySelector("site-data-grid");

          grid.rowsData = [{"column 1":"value","column 2":"value"},{"column 1":"another value","column 2":"another value"}]       
        </script>
      </playground-ide> 
            </div>

            <h2>&lt;site-select&gt;</h2>
            <div>

            </div>

            <h2>&lt;site-tabs&gt;</h2>
            <div>

            </div>

          </div>
        </site-tab-panel>
        <site-tab-panel id="siteWidgetsPanel">
        
        </site-tab-panel>
      </site-tabs>

      </main>

      <p class="app-footer">
        🚽 Made with love by
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/open-wc"
          >open-wc</a
        >.
      </p>
    `;
  }
}
