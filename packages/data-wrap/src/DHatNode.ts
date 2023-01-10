// generic node, similar fields that all node types might share
export class DHatNode {
  public id?: string;

  public title?: string;

  public type?: string;

  public description?: string;

  public link?: string;
  
  public images?: { alt: string; url: string; }[];

  public materials?: string[]

  constructor(init?:Partial<DHatNode>) {
    Object.assign(this, init);
  }
}

export function parse(tool: any){
  return new DHatNode({
    id: tool.title,
    title: tool.title,
    type: tool.Type.toLowerCase(),
    description: tool.Body,
    images: tool['Featured Image']? [{alt:tool['Featured Image'].alt, url:tool['Featured Image'].src}]:undefined,
    materials: tool['MAO Materials']? tool['MAO Materials'].split(','):undefined,
    link: `https://dh.library.virginia.edu${tool.Path}`
  });
}