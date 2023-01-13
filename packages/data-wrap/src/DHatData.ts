import { DHatPerson, parse as parsePerson } from './DHatPerson.js';
import { DHatNode, parse as parseNode } from './DHatNode.js';
import { DHatEvent, parse as parseEvent } from './DHatEvent.js';
import { GeneralData } from './GeneralData.js';

export class DHatData extends GeneralData {

    public items: (DHatPerson|DHatNode|DHatEvent)[] = [];

    public limit: number = 10000;

    // type types of nodes we know about and how to parse them
    public types: {[key: string]:any} = {
      "Organization":parseNode,
      "Profile":parsePerson,
      "Tool":parseNode,
      "News":parseNode,
      "Event":parseEvent,
      "Relationship":parseNode,
      "job":parseNode,
      "Basic page":parseNode,
      "Course":parseNode
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

    // eslint-disable-next-line class-methods-use-this
    private parseResults(d: { nodes: any[]; }) {          
      this.items = d.nodes.filter((n: any)=> Object.keys(this.types).includes(n.node.Type) ) 
             // eslint-disable-next-line arrow-body-style
             .map((n)=>{              
              if (Object.keys(this.types).includes(n.node.Type))
                return this.types[ n.node.Type ](n.node);
              return parseNode(n.node);
             })
      return { items: this.items.slice(0,this.limit), meta: {totalResults: this.items.length} }
    } 
  }