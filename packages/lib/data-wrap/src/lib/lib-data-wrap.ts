//export function libDataWrap(): string {
//  return 'lib-data-wrap';
//}

export function dataWrap(): string {
  return 'data-wrap';
}

export class DHAtUVAData {
  nodes: Array<unknown> = [];
  edges: Array<unknown> = [];

  fetchGraphData(){
    return fetch('./data/graph-data-api.json')
      .then(r=>r.json())
      .then(function(data: unknown){
        return this.#parseData(data);
      }.bind(this));
  }

  #parseData(data:unknown){
    console.log(data);
/*    
    let techApps = new Set();
    data.nodes.forEach(n=>{
        if (n.node['Content Type']==="Projects" && n.node['Project URL']) {
            const id = n.node['Project URL']
            const tas = n.node['Technical Approach'];
            if (tas) {
              tas.split(",").forEach(ta=>{
                if (ta && !techApps.has(ta)) {
                    techApps.add(ta);
                    nodes.push({id:ta, label:ta, type:'rect'});
                }
                edges.push({source:id, target:ta});
              })
            }
            nodes.push({id:id, label:n.node['title'], size: 10});
        }
    }) 
*/       
  }

}

export class Virgo {
  
}

export class Library {

}

export class Hours {

}
