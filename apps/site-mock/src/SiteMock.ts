import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';

import "@uvalib/bento-box/bento-box.js";
import "playground-elements/playground-ide.js";

const logo = new URL('../../assets/open-wc-logo.svg', import.meta.url).href;

export class SiteMock extends LitElement {
  @property({ type: String }) title = 'My app';

  static styles = css`
    :host {
      min-height: 100vh;
      display: block;
    }

  `;

  render() {
    return html`
      <main>

      <h1>UVA Library Web Dev Sandbox</h1>

      </h2>Catalog DataWrap</h2>
      <playground-ide editable-file-system line-numbers resizable>
        <script type="sample/html" filename="index.html">
          <!doctype html>
          <body>
            <h1>Search Results from UVA Library Catalog</h1>
            <p id="resultMeta"></p>
            <ul id="results"></ul>
            <script type="module" src="./index.js">&lt;/script>
          </body>
        </script>
        <script type="sample/ts" filename="index.ts">
          // You need the module
          import { CatalogData } from '@uvalib/data-wrap';

          // Just getting the elements to show the results in
          const resultJar = document.getElementById("results");
          const metaJar = document.getElementById("resultMeta");

          // A sample query and then make the results visible!
          new CatalogData({query:"football"}).fetchData().then(results=>{
            metaJar.innerHTML="Search has "+results.meta.totalResults+" results!";
            resultJar.innerHTML=results.items.map(r=>"<li>"+r.title+"</li>").join();
          });        
        </script>
      </playground-ide>

      </h2>People DataWrap</h2>
      <playground-ide editable-file-system line-numbers resizable>
        <script type="sample/html" filename="index.html">
          <!doctype html>
          <body>
            <h1>UVA Library Staff Search Results</h1>
            <p id="resultMeta"></p>
            <ul id="results"></ul>
            <script type="module" src="./index.js">&lt;/script>
          </body>
        </script>
        <script type="sample/ts" filename="index.ts">
          // You need the module
          import { PersonData } from '@uvalib/data-wrap';

          // Just getting the elements to show the results in
          const resultJar = document.getElementById("results");
          const metaJar = document.getElementById("resultMeta");

          // A sample query and then make the results visible!
          new PersonData({limit:3}).fetchData().then(results=>{
            metaJar.innerHTML="Search has "+results.meta.totalResults+" results!";
            resultJar.innerHTML=results.items.map(r=>"<li>"+r.title+"</li>").join();
          });        
        </script>
      </playground-ide>

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
