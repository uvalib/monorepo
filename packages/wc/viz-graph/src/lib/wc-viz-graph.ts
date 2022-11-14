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
//    if (changedProperties && (changedProperties.has("nodes")||changedProperties.has("edges"))) {
        this.__renderGraph();
//    }
    super.update(changedProperties);
  }

  __renderGraph() {
    if (this != null && this.graph != null) {
      const graphData = {nodes:this.nodes, edges:this.edges};
//      GraphLayoutPredict.predict(graphData).then(function(predict){
//        const predictLayout = predict.predictLayout;
//        const confidence = predict.confidence;
//        console.log("----predictLayout---", predictLayout);
//        console.log("----confidence---", confidence);  
        this.graph.updateLayout({
          type:this.layout,
          preventOverlap:!this.overlap
        });     
            this.graph.data(graphData);
            this.graph.render();
            const _this = this;
            this.graph.on("afterlayout", function(){
                _this.graph!.fitView();
            } );
            console.info("rendered graph");
//      }.bind(this));    
    }
  }  

  override render() {
    return html`<div id="container"></div>`;
  }

  override firstUpdated(changedProps: PropertyValueMap<unknown> | Map<PropertyKey, unknown>) {
    super.firstUpdated(changedProps);
  //  GraphLayoutPredict.predict({nodes:this.nodes, edges:this.edges}).then(function(predict){
  //      const predictLayout = predict.predictLayout;
  //      const confidence = predict.confidence;
  //      console.log("----predictLayout---", predictLayout);
  //      console.log("----confidence---", confidence); 
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
                //outDiv.style.padding = '0px 0px 20px 0px';
                outDiv.innerHTML = `
                  <div class="tooltip">${e.item.getModel().desc || e.item.getModel().label || e.item.getModel().id }</div>
                  `;
                return outDiv;
              },
              shouldBegin: (e) => {
//                console.log(e.target);
                let res = true;
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
    //                type: predictLayout,
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

//            this.graph.on('node:click', function (evt) {
//              const target = evt.target;
//          
//              const type = target.get('type');
//              const hasChangeBg = target.get('hasChangeBg');
//              if (type === 'image') {
//                if (!hasChangeBg) {
//                  // 点击图片节点时，切换背景图片
//                  target.attr('img', img2);
//                  target.attr('imgSrc', 'http://seopic.699pic.com/photo/50055/5642.jpg_wh1200.jpg');
//                  target.set('hasChangeBg', true);
//                } else {
//                  target.attr('img', img);
//                  target.attr(
//                    'imgSrc',
//                    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1566553535233&di=b0b17eeea7bd7356a6f42ebfd48e9441&imgtype=0&src=http%3A%2F%2Fa2.att.hudong.com%2F64%2F29%2F01300543361379145388299988437_s.jpg',
//                  );
//                  target.set('hasChangeBg', false);
//                }
//                graph.paint();
//              }
//            });            

//            this.graph.on('node:dragstart', function () {
//              this.graph.layout();
//              refreshDragedNodePosition(e);
//            });
//            this.graph.on('node:drag', function () {
//              const forceLayout = this.graph.get('layoutController').layoutMethods[0];
//              forceLayout.execute();
////              refreshDragedNodePosition(e);
//            });
//            this.graph.on('node:dragend', function (e: { item: { get: (arg0: string) => { (): unknown; new(): unknown; fx: unknown; fy: unknown; }; }; }) {
//              e.item.get('model').fx = null;
//              e.item.get('model').fy = null;
//            });

          }  
        }
    //}.bind(this));  
  }  
}
