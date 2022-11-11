export function dataWrap(): string {
  return 'data-wrap';
}

export class DHAtUVAData {
  nodes: Array<any> = [];
  edges: Array<any> = [];

  constructor(){
    let _this = this;
//    fetch('./graph-data-api.json')
//      .then(r=>r.json())
//      .then(data=>{
//        _this.#parseData(data);
//      });
  }

  #parseData(data:any){
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