import {LitElement, css, html, PropertyValueMap} from 'lit';
import { property } from 'lit/decorators.js';

import G6 from '@antv/g6';

export class VizGraph extends LitElement {

  @property({ type: Object }) graph:any;

  @property({ type: Array }) nodes:any;

  @property({ type: Array }) edges:any;

  @property({ type: String }) layout = "force";

  @property({ type: Boolean }) overlap = true;

  static override styles = css`
    :host {
      display: block;
    }
    .tooltip {
      background-color: white;
      border-radius: 15px;
      border: 2px solid #73AD21;
      padding: 10px;
    }
  `;
  
  // Listen for changes to data for graph updates
  override update(changedProperties: PropertyValueMap<unknown> | Map<PropertyKey, unknown>) {
        this.__renderGraph();
        super.update(changedProperties);
  }

  __renderGraph() {
    if (this != null && this.graph != null) {
      const graphData = {nodes:this.nodes, edges:this.edges}; 
        this.graph.updateLayout({
          type:this.layout,
          preventOverlap:!this.overlap
        });     
            this.graph.data(graphData);
            this.graph.render();
            const _this = this;
            this.graph.on("afterlayout", ()=> {
                _this.graph!.fitView();
            } );    
    }
  }  

  override render() {
    return html`<div id="container"></div>`;
  }

  override firstUpdated(changedProps: PropertyValueMap<unknown> | Map<PropertyKey, unknown>) {
    super.firstUpdated(changedProps);
    if (this.shadowRoot) {
      const container = this.shadowRoot.getElementById("container");
      if (container) {
        const width = container.scrollWidth;
        const height = container.scrollHeight || 500;
        const tooltip = new G6.Tooltip({
          offsetX: 10,
          offsetY: 10,
          // the types of items that allow the tooltip show up
          // 允许出现 tooltip 的 item 类型
          itemTypes: ['node','edge'],
          // custom the tooltip's content
          // 自定义 tooltip 内容
          getContent: (e) => {
            const outDiv = document.createElement('div');
            outDiv.style.width = 'fit-content';
            if (e && e.item)
            outDiv.innerHTML = `
                  <div class="tooltip">${e.item.getModel().desc || e.item.getModel().label || e.item.getModel().id }</div>
            `;
            return outDiv;
          },
          shouldBegin: (e) => {
            let res = true;
            if (e && e.item)
            switch (e.item.getModel().id) {
              case '1':
                res = false;
                break;
              case '2':
                if (e.target.get('name') === 'text-shape') res = true;
                else res = false;
                break;
              case '3':
                if (e.target.get('name') !== 'text-shape') res = true;
                else res = false;
                break;
              default:
                res = true;
                break;
            }
            return res;
          },
        });

        this.graph = new G6.Graph({
            container: container,
            width: width,
            height: height,
            layout: {
                type: this.layout,
                preventOverlap: !this.overlap,
                nodeSize: 20,
            },
            plugins: [tooltip],
            modes: {
              default: ['drag-node',"zoom-canvas",'drag-canvas','activate-relations'],
            },
            defaultNode: {
              size: 20,
            },
            defaultEdge: {
              style: {
                stroke: "#e2e2e2"
              }
            }
        });
        if (this.nodes || this.edges)  this.__renderGraph();

      }  
    }
  }

}
