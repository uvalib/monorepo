//export function libDataWrap(): string {
//  return 'lib-data-wrap';
//}

export class DHAtUVAData {
  nodes: Array<unknown> = [];
  edges: Array<unknown> = [];

  fetchData(){
    // This should be fetched live from the site under normal conditions
    //return Promise.resolve( this.#parseData(DHData) );
    return import('./data/graph-data-api')
      .then(data=>data.default)
      .then(data=>{
        this.#parseData(data.DHData);
        return data;
      })
  }

  #parseData(data: { nodes: { node: unknown}[] }){    
    const techApps = new Set();
    data.nodes.forEach(n=>{
        if (n.node['Content Type']==="Projects" && n.node['Project URL']) {
            const id = n.node['Project URL']
            const tas = n.node['Technical Approach'];
            if (tas) {
              tas.split(",").forEach(ta=>{
                if (ta && !techApps.has(ta)) {
                    techApps.add(ta);
                    this.nodes.push({id:ta, label:ta, type:'rect'});
                }
                this.edges.push({source:id, target:ta});
              })
            }
            this.nodes.push({id:id, label:n.node['title'], size: 10});
        }
    })       
  }

}

export class Virgo {
  
}

export class Library {

}

export class Hours {

}
