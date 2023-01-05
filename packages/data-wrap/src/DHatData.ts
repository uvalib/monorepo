import { DHatPerson, parse as parsePerson } from './DHatPerson.js';
import { DHatTool, parse as parseTool } from './DHatTool.js';
import { GeneralData } from './GeneralData.js';

export class DHatData extends GeneralData {

    public items: (DHatPerson)[] = [];

    public limit: number = 10000;

    public types: string[] = ["People","Tools"];

    constructor(init?:Partial<DHatData>) {
      super();
      Object.assign(this, init);
    }
  
    async fetchData(){
      // This should be fetched live from the site under normal conditions
      return import('./data/graph-data-api.js').then(({DHData})=>this.parseResults(DHData));
    }

    // eslint-disable-next-line class-methods-use-this
    private parseResults(d: any) {
      console.log(d);
      this.items = d.nodes.filter((n:any)=>this.types.includes( n.node['Content Type'] ))
             // eslint-disable-next-line arrow-body-style
             .map((n:any)=>{
                if (n.node['Content Type']==='People')
                  return parsePerson(n.node);
                if (n.node['Content Type']==='Tools')
                  return parseTool(n.node);
                console.log(n.node)
                return {};
             })
      return { items: this.items.slice(0,this.limit), meta: {totalResults: this.items.length} }
    } 
  }