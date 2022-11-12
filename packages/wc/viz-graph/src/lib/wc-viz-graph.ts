/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-this-alias */
import {LitElement, css, html, PropertyValueMap} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import G6 from "@antv/g6";
//import { GraphLayoutPredict } from '@antv/vis-predict-engine';

@customElement('viz-graph')
export class VizGraphAntG6 extends LitElement {

  @property({ type: Object }) graph;
  @property({ type: Array }) nodes;
  @property({ type: Array }) edges;

  static override styles = css`
    :host {
      display: block;
    }
  `;

  // Listen for changes to data for graph updates
  override update(changedProperties: PropertyValueMap<unknown> | Map<PropertyKey, unknown>) {
//    if (changedProperties && (changedProperties.has("nodes")||changedProperties.has("edges"))) {
        this.__renderGraph();
//    }
    super.update(changedProperties);
  }

  __renderGraph() {
    if (this != null && this.graph != null) {
      this.graph.data({nodes:this.nodes, edges:this.edges});
      this.graph.render();
      const _this = this;
      this.graph.on("afterlayout", function(){
          _this.graph!.fitView();
      } );
      console.info("rendered graph");
    }
  }  

  override render() {
    return html`<div id="container"></div>`;
  }

  override firstUpdated(changedProps: PropertyValueMap<unknown> | Map<PropertyKey, unknown>) {
    super.firstUpdated(changedProps);
//    GraphLayoutPredict.predict({nodes:this.nodes, edges:this.edges}).then(function(predict){
//        const predictLayout = predict.predictLayout;
//        const confidence = predict.confidence;
//        console.log("----predictLayout---", predictLayout);
//        console.log("----confidence---", confidence); 
        if (this.shadowRoot) {
          const container = this.shadowRoot.getElementById("container");
          if (container) {
            const width = container.scrollWidth;
            const height = container.scrollHeight || 500;
            this.graph = new G6.Graph({
                container: container,
                width: width,
                height: height,
                layout: {
    //                type: predictLayout,
                    type: "force",
                    preventOverlap: true,
                    nodeSize: 20,
                },
                modes: {
                  default: ['drag-node',"zoom-canvas",'drag-canvas'],
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
//    }.bind(this));  
  }  
}
