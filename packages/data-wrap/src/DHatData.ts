import { DHatPerson, parse as parsePerson } from './DHatPerson.js';
import { DHatTool, parse as parseTool } from './DHatTool.js';
import { DHatNews, parse as parseNews } from './DHatNews.js';
import { DHatEvent, parse as parseEvent } from './DHatEvent.js';
import { DHatOrganization, parse as parseOrganization } from './DHatOrganization.js';
import { GeneralData } from './GeneralData.js';

export class DHatData extends GeneralData {

    public items: (DHatPerson|DHatTool|DHatOrganization|DHatNews|DHatEvent)[] = [];

    public limit: number = 10000;

    // entity types are defined in different fields depending on type
    public types = {
      "Content Type":{
        "People":parsePerson,
        "Tools":parseTool,
        "Organizations":parseOrganization
      },
      "Type":{
        "News":parseNews,
        "Event":parseEvent
      }
    };

    constructor(init?:Partial<DHatData>) {
      super();
      Object.assign(this, init);
    }
  
    async fetchData(){
      // This should be fetched live from the site under normal conditions
      return fetch('https://api.library.virginia.edu/dh/node-listing')
              .then(r=>r.json())
              .then((DHData)=>this.parseResults(DHData));
    }

    private filterTypes(node: { [x: string]: any; }){
      for (const [typeKey, types] of Object.entries(this.types)) {
        if ( Object.keys(types).includes( node[typeKey] ) ) return true;
      }
      return false;
    }

    // eslint-disable-next-line class-methods-use-this
    private parseResults(d: any) {
      this.items = d.nodes.filter((n:any)=>this.filterTypes(n.node)) // this.types.includes( n.node['Content Type'] ))
             // eslint-disable-next-line arrow-body-style
             .map((n:any)=>{

for (const [typeKey, types] of Object.entries(this.types)) {
  if ( n.node[typeKey] )
    for (const [type, parseMethod] of Object.entries(types)){
      if (n.node[typeKey]===type) return parseMethod(n.node);
    }
}
return {};              

             })
      return { items: this.items.slice(0,this.limit), meta: {totalResults: this.items.length} }
    } 
  }