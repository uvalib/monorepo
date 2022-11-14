import './app.element.css';
import '@uvalib/dh-viz';
import '@uvalib/viz-graph';
import '@uvalib/bento-box';

import '@uvalib/foo-bar';

import { 
  allComponents, 
  provideFASTDesignSystem 
} from "@microsoft/fast-components";

provideFASTDesignSystem()
  .withPrefix("uvalib")
  .register(allComponents);

export class AppElement extends HTMLElement {
  public static observedAttributes = [];

  connectedCallback() {
//    const title = 'site-mock';
    this.innerHTML = `
    <div class="wrapper">
      <div class="container">

      <foo-bar></foo-bar>

      <bento-box></bento-box>
<!--
<uvalib-tabs>
      <uvalib-tab slot="tab">DH@UVA Visualizations</uvalib-tab>
      <uvalib-tab slot="tab">Generic viz-graph web component</uvalib-tab>
      <uvalib-tab slot="tab">Bento-Box</uvalib-tab>
      <uvalib-tab-panel slot="tabpanel" >
        <h1>dh-viz</h1>
        <dh-viz></dh-viz>
        <table style="padding-bottom: 50px">
        <tr><td><img src="https://site-assets.fontawesome.com/releases/v6.2.0/svgs/solid/book.svg" style="height:15px;width:15px;"></td><td>Technical Approach</td></tr>
        <tr><td><img src="https://site-assets.fontawesome.com/releases/v6.2.0/svgs/solid/gear.svg" style="height:20px;width:20px;"></td><td>Project</td></tr>
        <tr><td><img src="https://site-assets.fontawesome.com/releases/v6.2.0/svgs/solid/person.svg" style="height:20px;width:15px;"></td><td>Person</td></tr>
        <tr><td><img src="https://site-assets.fontawesome.com/releases/v6.2.0/svgs/solid/screwdriver-wrench.svg" style="height:15px;width:15px;"></td><td>Tool</td></tr>
        <tr><td><img src="https://site-assets.fontawesome.com/releases/v6.2.0/svgs/solid/building-columns.svg" style="height:15px;width:15px;"></td><td>Organization</td></tr>
        </table>
        <!--  COMMANDS  -->
        <div id="commands" class="rounded shadow">
          <h2>Next steps</h2>
          <p>Goals for this project:</p>
          <ul> 
          <li>Create a set of accessible/flexible visualization web components that wrap existing graphing libraries/components for use at UVA Library.</li>
          <li>Create a data library that wraps existing data sources making them easier to visualize.</li>
          <li>Add data (nodes and edges) from DH@UVA site and add interactions that enables filtering and further exploration</li>
          </ul>
        </div>            
      </uvalib-tab-panel>
      <uvalib-tab-panel slot="tabpanel" style="background-color: white; color: black;">
        <h1>viz-graph</h1>      
        <viz-graph nodes='[{ "id": "node0", "size": 50 },{ "id": "node1", "size": 30 },{ "id": "node2", "size": 30 },{ "id": "node3", "size": 30 },{ "id": "node4", "size": 30, "isLeaf": true },{ "id": "node5", "size": 30, "isLeaf": true },{ "id": "node6", "size": 15, "isLeaf": true },{ "id": "node7", "size": 15, "isLeaf": true },{ "id": "node8", "size": 15, "isLeaf": true },{ "id": "node9", "size": 15, "isLeaf": true },{ "id": "node10", "size": 15, "isLeaf": true },{ "id": "node11", "size": 15, "isLeaf": true },{ "id": "node12", "size": 15, "isLeaf": true },{ "id": "node13", "size": 15, "isLeaf": true },{ "id": "node14", "size": 15, "isLeaf": true },{ "id": "node15", "size": 15, "isLeaf": true },{ "id": "node16", "size": 15, "isLeaf": true }]' 
        edges='[{ "source": "node0", "target": "node1" },{ "source": "node0", "target": "node2" },{ "source": "node0", "target": "node3" },{ "source": "node0", "target": "node4" },{ "source": "node0", "target": "node5" },{ "source": "node1", "target": "node6" },{ "source": "node1", "target": "node7" },{ "source": "node2", "target": "node8" },{ "source": "node2", "target": "node9" },{ "source": "node2", "target": "node10" },{ "source": "node2", "target": "node11" },{ "source": "node2", "target": "node12" },{ "source": "node2", "target": "node13" },{ "source": "node3", "target": "node14" },{ "source": "node3", "target": "node15" },{ "source": "node3", "target": "node16" }]'></viz-graph>            
      </uvalib-tab-panel>
      <uvalib-tab-panel slot="tabpanel">
        <bento-box>
      </uvalib-tab-panel>
</uvalib-tabs>
-->

<hr />
<hr />      

        <p id="love">
          Carefully crafted with
          <svg
            fill="currentColor"
            stroke="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </p>
      </div>
    </div>
      `;
  }
}
customElements.define('web-stuff-root', AppElement);
