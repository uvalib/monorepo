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
                    // push Tech Approach onto the stack
                    this.nodes.push({id:ta, label:ta, type:'rect'});
                }
                // push tech app -> project edge
                this.edges.push({source:id, target:ta});
              })
            }
            // push project onto the stack
            this.nodes.push({id:id, type:'image', img: 'https://site-assets.fontawesome.com/releases/v6.2.0/svgs/solid/gear.svg', size:[20,20]});
        } else if (n.node['Content Type']==="People") {
          const id = n.node['Name']
          // push person onto the stack
          this.nodes.push({id:id, type:'image', img: 'https://site-assets.fontawesome.com/releases/v6.2.0/svgs/solid/person.svg', size: [15,20]});
          // create edges for this person
          data.nodes.filter(n=>n.node['Instructor']===id).forEach(n=>{
            this.edges.push({source:id, target:n.node['I am connected to:'], label:n.node['My connection type is:']});
          });
        }
        // https://site-assets.fontawesome.com/releases/v6.2.0/svgs/solid/screwdriver-wrench.svg
    })       
  }

}

export class Virgo {
  
}

export class Library {

}

export class Hours {

}
