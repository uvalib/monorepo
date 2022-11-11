import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import G6 from "@antv/g6";
//import { GraphLayoutPredict } from '@antv/vis-predict-engine';

export class UvalibVizAntG6 extends LitElement {

  graph: any;

  static styles = css`
    :host {
      display: block;
    }
  `;

  @property({ type: Array }) nodes = null;
  @property({ type: Array }) edges = null;

  update(changedProperties: any) {
    if (changedProperties.has("nodes")||changedProperties.has("edges")) {
        this.__renderGraph();
    }
    super.update(changedProperties);
  }

  __renderGraph() {
    if (this.graph) {
      this.graph.data({nodes:this.nodes, edges:this.edges});
      this.graph.render();
      let _this = this;
      this.graph.on("afterlayout", function(){
          _this.graph.fitView();
      } );
      console.info("rendered graph");
    }
  }  

  render() {
    return html`<div id="container"></div>`;
  }

  firstUpdated(changedProps:any) {
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
