//export function wcDhViz(): string {
//  return 'wc-dh-viz';
//}

import {customElement} from 'lit/decorators.js';

import { VizGraphAntG6 } from '@uvalib/viz-graph';

import { DHAtUVAData } from '@uvalib/data-wrap';

@customElement('dh-viz')
export class DHViz extends VizGraphAntG6 {
  
  #dataHandle: DHAtUVAData;

  constructor(){
    super();
    this.overlap = false;
    this.#dataHandle = new DHAtUVAData();
    this.#dataHandle.fetchData().then(()=>{
      this.nodes = this.#dataHandle.nodes;
      this.edges = this.#dataHandle.edges;
      console.log(this.nodes);
      console.log(this.edges);
      this.__renderGraph();
    });
  }

}
