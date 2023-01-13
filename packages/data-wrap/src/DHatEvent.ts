import { DHatNode, parse as parseNode } from './DHatNode.js';

export class DHatEvent extends DHatNode {

  public dateStart?: number;

  public dateEnd?: number;

  public location?: string;

  public affiliatedUVA?: boolean;

  public certificate?: boolean;

  public eventType?: string;

  constructor(init?:Partial<DHatEvent>) {
    super(init);
    Object.assign(this, init);
  }
}

export function parse(tool: any){
  const event = <DHatEvent>parseNode(tool);
  event.location = tool.Location;
  event.affiliatedUVA = (!(tool['Not UVa Affiliated']==="Not UVa"));
  event.certificate = (!(tool['Certificate Event']==="no"));
  event.eventType = tool['Event Type'];
  return event; 
}