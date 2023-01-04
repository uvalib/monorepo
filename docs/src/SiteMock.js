import { __decorate } from "tslib";
import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import "@uvalib/site-header/site-header.js";
import "@uvalib/site-components/site-tabs.js";
import "@uvalib/site-components/site-select.js";
import "@uvalib/bento-box/bento-box.js";
import "@uvalib/bento-box/events-section.js";
import "playground-elements/playground-ide.js";
import "@uvalib/site-style/site-style.js";
const logo = new URL('../../assets/open-wc-logo.svg', import.meta.url).href;
export class SiteMock extends LitElement {
    constructor() {
        super();
        this.title = 'My app';
        this.selectedToy = "CatalogData";
        this.toys = {
            ArticlesData: {
                name: "UVA Library Article Search",
                query: "food"
            },
            CatalogData: {
                name: "UVA Library Catalog",
                query: "football"
            },
            DHatData: {
                name: "DH@UVA Entities"
            },
            EventsData: {
                name: "Events at the Library",
                query: "data"
            },
            //  HoursData:{},
            LibGuidesData: {
                name: "Libguides at the Library",
                query: "3d"
            },
            LibrariesData: {
                name: "Libraries",
                query: "clemons"
            },
            PageData: {
                name: "Pages from the Library Website",
                query: "about"
            },
            PersonData: {
                name: "Library Staff",
                query: "chestnut"
            },
            WebsiteData: {
                name: "Mixed data from the Library Website",
                query: "Unsworth"
            }
        };
        this.example = this.loadExample(this.selectedToy);
    }
    selectToy(e) {
        const target = e.currentTarget;
        this.selectedToy = target.value;
        this.example = this.loadExample(this.selectedToy);
    }
    mkPlayground(scr, htm) {
        return `
    <playground-ide editable-file-system line-numbers resizable>
      <script type="sample/html" filename="index.html">
        <!doctype html>
        <body>
          <site-style>
          ${htm} 
          <site-style>
          <script type="module" src="./index.js">&lt;/script>          
        </body>
      </script>
      <script type="sample/ts" filename="index.ts">
        import "@uvalib/site-style/site-style.js";
        ${scr}
      </script>
    </playground-ide>    
    `;
    }
    loadExample(t) {
        const toy = this.toys[t];
        return `
      </h2>Example of ${toy.name}</h2>
      ${this.mkPlayground(`
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
      `, `
        <h1>Search Results from ${this.selectedToy}</h1>
        <p id="resultMeta"></p>
        <site-data-grid id="results"></site-data-grid>     
      `)}   
    `;
    }
    render() {
        return html `
<site-style>    
      <site-header></site-header>
      <main>

      <h1>UVA Library Web Dev Sandbox</h1>

      <site-tabs activeid="dataWrap">
        <site-tab id="dataWrap">Library Data</site-tab>
        <site-tab id="siteComponents">Site Components</site-tab>
        <site-tab id="siteWidgets">Site Widgets</site-tab>
        <site-tab-panel id="dataWrapPanel">
          <div id="selectToy">
            <site-select @change="${this.selectToy}">
              ${Object.keys(this.toys).map(k => html `<site-option ?selected="${k === this.selectedToy}" value="${k}">${k}</site-option>`)}
            </site-select>
          </div>
          ${unsafeHTML(this.example)}        
        </site-tab-panel>

        <site-tab-panel id="siteComponentsPanel">
          <p>Site Components are base web components used to make more complex components and widgets.
            These components are custom named and styled implemetations of <a href="https://www.fast.design/">FAST Components</a>.</p>
          <div>

            <h2>&lt;site-data-grid&gt;</h2>
            <div>
              ${unsafeHTML(this.mkPlayground(`
                // Get the module
                import "@uvalib/site-components/site-data-grid.js";

                // populate the grid by adding an array to the rowsData property
                const grid = document.querySelector("site-data-grid");
                
                grid.rowsData = [{"column 1":"value","column 2":"value"},{"column 1":"another value","column 2":"another value"}]                
              `, `
                <site-data-grid></site-data-grid>               
              `))}
            </div>

            <h2>&lt;site-select&gt;</h2>
            <div>
            ${unsafeHTML(this.mkPlayground(`
              // Get the module
              import "@uvalib/site-components/site-select.js";
    
              // listen to the select
              const select = document.querySelector("site-select");
              select.addEventListener('change',(e)=>console.log(e.target.value))
            `, `
              <site-select>
                <site-option>Option #1</site-option>
                <site-option>Option #2</site-option>
              </site-select>            
            `))}    
            </div>        

            <h2>&lt;site-tabs&gt;</h2>
            <div>
              ${unsafeHTML(this.mkPlayground(`
                // Get the module
                import "@uvalib/site-components/site-tabs.js";
              `, `
                <site-tabs>
                  <site-tab>Tab one</site-tab>
                  <site-tab>Tab two</site-tab>
                  <site-tab>Tab three</site-tab>
                  <site-tab-panel>Tab panel 1</site-tab-panel>
                  <site-tab-panel>Tab panel 2</site-tab-panel>
                  <site-tab-panel>Tab panel 3</site-tab-panel>
                </site-tabs> 
              `))}    
            </div>

            <h2>&lt;site-switch&gt;</h2>
            <div>
              ${unsafeHTML(this.mkPlayground(`
                // Get the module
                import "@uvalib/site-components/site-switch.js";
              `, `
              <div>
                <site-switch></site-switch>
              </div>

              <div>
                <site-switch>
                  Theme
                  <span slot="checked-message">Dark</span>
                  <span slot="unchecked-message">Light</span>
                </site-switch>
              </div>  
              `))}    
            </div>            

          </div>
        </site-tab-panel>
        <site-tab-panel id="siteWidgetsPanel">
       
          <p>Site Widgets are web components that are usually made from other base componets, widgets and libraries.</p>
          <div>

            <h2>&lt;site-header&gt;</h2>
            <div>
              ${unsafeHTML(this.mkPlayground(`
                // Get the module
                import "@uvalib/site-header/site-header.js";
              `, `
                <site-header></site-header>
              `))} 
            </div>

            <h2>&lt;bento-box&gt;</h2>
            <div>
              ${unsafeHTML(this.mkPlayground(`
                // load the module
                import "@uvalib/bento-box/bento-box.js";
              `, `
                <bento-box></bento-box>
              `))}
            </div>

            <h2>&lt;events-section&gt;</h2>
            <div>
              ${unsafeHTML(this.mkPlayground(`
                // load the module
                import "@uvalib/bento-box/events-section.js";
              `, `
                <events-section limit="5"></events-section>
              `))}
            </div>

        </site-tab-panel>
      </site-tabs>

      </main>

      
  </site-style>      
    `;
    }
}
SiteMock.styles = css `
    :host {
      min-height: 100vh;
      display: block;
    }

  `;
__decorate([
    property({ type: String })
], SiteMock.prototype, "title", void 0);
__decorate([
    property({ type: String, attribute: "selected-toy" })
], SiteMock.prototype, "selectedToy", void 0);
__decorate([
    property({ type: Object })
], SiteMock.prototype, "example", void 0);
__decorate([
    property({ type: Object })
], SiteMock.prototype, "toys", void 0);
//# sourceMappingURL=SiteMock.js.map